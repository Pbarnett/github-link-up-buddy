Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Global objects
Class: AbortController
abortController.abort([reason])
abortController.signal
Class: AbortSignal
Static method: AbortSignal.abort([reason])
Static method: AbortSignal.timeout(delay)
Static method: AbortSignal.any(signals)
Event: 'abort'
abortSignal.aborted
abortSignal.onabort
abortSignal.reason
abortSignal.throwIfAborted()
Class: Blob
Class: Buffer
Class: ByteLengthQueuingStrategy
__dirname
__filename
atob(data)
Class: BroadcastChannel
btoa(data)
clearImmediate(immediateObject)
clearInterval(intervalObject)
clearTimeout(timeoutObject)
Class: CloseEvent
Class: CompressionStream
console
Class: CountQueuingStrategy
Class: Crypto
crypto
Class: CryptoKey
Class: CustomEvent
Class: DecompressionStream
Class: Event
Class: EventSource
Class: EventTarget
exports
fetch
Custom dispatcher
Related classes
Class: File
Class: FormData
global
Class: Headers
localStorage
Class: MessageChannel
Class: MessageEvent
Class: MessagePort
module
Class: Navigator
navigator
navigator.hardwareConcurrency
navigator.language
navigator.languages
navigator.platform
navigator.userAgent
Class: PerformanceEntry
Class: PerformanceMark
Class: PerformanceMeasure
Class: PerformanceObserver
Class: PerformanceObserverEntryList
Class: PerformanceResourceTiming
performance
process
queueMicrotask(callback)
Class: ReadableByteStreamController
Class: ReadableStream
Class: ReadableStreamBYOBReader
Class: ReadableStreamBYOBRequest
Class: ReadableStreamDefaultController
Class: ReadableStreamDefaultReader
require()
Class: Response
Class: Request
sessionStorage
setImmediate(callback[, ...args])
setInterval(callback, delay[, ...args])
setTimeout(callback, delay[, ...args])
Class: Storage
structuredClone(value[, options])
Class: SubtleCrypto
Class: DOMException
Class: TextDecoder
Class: TextDecoderStream
Class: TextEncoder
Class: TextEncoderStream
Class: TransformStream
Class: TransformStreamDefaultController
Class: URL
Class: URLPattern
Class: URLSearchParams
Class: WebAssembly
Class: WebSocket
Class: WritableStream
Class: WritableStreamDefaultController
Class: WritableStreamDefaultWriter
Global objects
#
Stability: 2 - Stable
These objects are available in all modules.
The following variables may appear to be global but are not. They exist only in the scope of CommonJS modules:
__dirname
__filename
exports
module
require()
The objects listed here are specific to Node.js. There are built-in objects that are part of the JavaScript language itself, which are also globally accessible.
Class: AbortController
#
History













A utility class used to signal cancelation in selected Promise-based APIs. The API is based on the Web API <AbortController>.
const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('Aborted!'),
                           { once: true });

ac.abort();

console.log(ac.signal.aborted);  // Prints true
copy
abortController.abort([reason])
#
History













reason <any> An optional reason, retrievable on the AbortSignal's reason property.
Triggers the abort signal, causing the abortController.signal to emit the 'abort' event.
abortController.signal
#
Added in: v15.0.0, v14.17.0
Type: <AbortSignal>
Class: AbortSignal
#
Added in: v15.0.0, v14.17.0
Extends: <EventTarget>
The AbortSignal is used to notify observers when the abortController.abort() method is called.
Static method: AbortSignal.abort([reason])
#
History













reason: <any>
Returns: <AbortSignal>
Returns a new already aborted AbortSignal.
Static method: AbortSignal.timeout(delay)
#
Added in: v17.3.0, v16.14.0
delay <number> The number of milliseconds to wait before triggering the AbortSignal.
Returns a new AbortSignal which will be aborted in delay milliseconds.
Static method: AbortSignal.any(signals)
#
Added in: v20.3.0, v18.17.0
signals <AbortSignal[]> The AbortSignals of which to compose a new AbortSignal.
Returns a new AbortSignal which will be aborted if any of the provided signals are aborted. Its abortSignal.reason will be set to whichever one of the signals caused it to be aborted.
Event: 'abort'
#
Added in: v15.0.0, v14.17.0
The 'abort' event is emitted when the abortController.abort() method is called. The callback is invoked with a single object argument with a single type property set to 'abort':
const ac = new AbortController();

// Use either the onabort property...
ac.signal.onabort = () => console.log('aborted!');

// Or the EventTarget API...
ac.signal.addEventListener('abort', (event) => {
  console.log(event.type);  // Prints 'abort'
}, { once: true });

ac.abort();
copy
The AbortController with which the AbortSignal is associated will only ever trigger the 'abort' event once. We recommended that code check that the abortSignal.aborted attribute is false before adding an 'abort' event listener.
Any event listeners attached to the AbortSignal should use the { once: true } option (or, if using the EventEmitter APIs to attach a listener, use the once() method) to ensure that the event listener is removed as soon as the 'abort' event is handled. Failure to do so may result in memory leaks.
abortSignal.aborted
#
Added in: v15.0.0, v14.17.0
Type: <boolean> True after the AbortController has been aborted.
abortSignal.onabort
#
Added in: v15.0.0, v14.17.0
Type: <Function>
An optional callback function that may be set by user code to be notified when the abortController.abort() function has been called.
abortSignal.reason
#
Added in: v17.2.0, v16.14.0
Type: <any>
An optional reason specified when the AbortSignal was triggered.
const ac = new AbortController();
ac.abort(new Error('boom!'));
console.log(ac.signal.reason);  // Error: boom!
copy
abortSignal.throwIfAborted()
#
Added in: v17.3.0, v16.17.0
If abortSignal.aborted is true, throws abortSignal.reason.
Class: Blob
#
Added in: v18.0.0
See <Blob>.
Class: Buffer
#
Added in: v0.1.103
<Function>
Used to handle binary data. See the buffer section.
Class: ByteLengthQueuingStrategy
#
History













A browser-compatible implementation of ByteLengthQueuingStrategy.
__dirname
#
This variable may appear to be global but is not. See __dirname.
__filename
#
This variable may appear to be global but is not. See __filename.
atob(data)
#
Added in: v16.0.0
Stability: 3 - Legacy. Use Buffer.from(data, 'base64') instead.
Global alias for buffer.atob().
Class: BroadcastChannel
#
Added in: v18.0.0
See <BroadcastChannel>.
btoa(data)
#
Added in: v16.0.0
Stability: 3 - Legacy. Use buf.toString('base64') instead.
Global alias for buffer.btoa().
clearImmediate(immediateObject)
#
Added in: v0.9.1
clearImmediate is described in the timers section.
clearInterval(intervalObject)
#
Added in: v0.0.1
clearInterval is described in the timers section.
clearTimeout(timeoutObject)
#
Added in: v0.0.1
clearTimeout is described in the timers section.
Class: CloseEvent
#
Added in: v23.0.0
A browser-compatible implementation of <CloseEvent>. Disable this API with the --no-experimental-websocket CLI flag.
Class: CompressionStream
#
History













A browser-compatible implementation of CompressionStream.
console
#
Added in: v0.1.100
<Object>
Used to print to stdout and stderr. See the console section.
Class: CountQueuingStrategy
#
History













A browser-compatible implementation of CountQueuingStrategy.
Class: Crypto
#
History

















A browser-compatible implementation of <Crypto>. This global is available only if the Node.js binary was compiled with including support for the node:crypto module.
crypto
#
History

















A browser-compatible implementation of the Web Crypto API.
Class: CryptoKey
#
History

















A browser-compatible implementation of <CryptoKey>. This global is available only if the Node.js binary was compiled with including support for the node:crypto module.
Class: CustomEvent
#
History





















A browser-compatible implementation of <CustomEvent>.
Class: DecompressionStream
#
History













A browser-compatible implementation of DecompressionStream.
Class: Event
#
History













A browser-compatible implementation of the Event class. See EventTarget and Event API for more details.
Class: EventSource
#
Added in: v22.3.0, v20.18.0
Stability: 1 - Experimental. Enable this API with the --experimental-eventsource CLI flag.
A browser-compatible implementation of <EventSource>.
Class: EventTarget
#
History













A browser-compatible implementation of the EventTarget class. See EventTarget and Event API for more details.
exports
#
This variable may appear to be global but is not. See exports.
fetch
#
History

















A browser-compatible implementation of the fetch() function.
const res = await fetch('https://nodejs.org/api/documentation.json');
if (res.ok) {
  const data = await res.json();
  console.log(data);
}
copy
The implementation is based upon undici, an HTTP/1.1 client written from scratch for Node.js. You can figure out which version of undici is bundled in your Node.js process reading the process.versions.undici property.
Custom dispatcher
#
You can use a custom dispatcher to dispatch requests passing it in fetch's options object. The dispatcher must be compatible with undici's Dispatcher class.
fetch(url, { dispatcher: new MyAgent() });
copy
It is possible to change the global dispatcher in Node.js installing undici and using the setGlobalDispatcher() method. Calling this method will affect both undici and Node.js.
import { setGlobalDispatcher } from 'undici';
setGlobalDispatcher(new MyAgent());
copy
Related classes
#
The following globals are available to use with fetch:
FormData
Headers
Request
Response.
Class: File
#
Added in: v20.0.0
See <File>.
Class: FormData
#
History

















A browser-compatible implementation of <FormData>.
global
#
Added in: v0.1.27
Stability: 3 - Legacy. Use globalThis instead.
<Object> The global namespace object.
In browsers, the top-level scope has traditionally been the global scope. This means that var something will define a new global variable, except within ECMAScript modules. In Node.js, this is different. The top-level scope is not the global scope; var something inside a Node.js module will be local to that module, regardless of whether it is a CommonJS module or an ECMAScript module.
Class: Headers
#
History

















A browser-compatible implementation of <Headers>.
localStorage
#
Added in: v22.4.0
Stability: 1.0 - Early development.
A browser-compatible implementation of localStorage. Data is stored unencrypted in the file specified by the --localstorage-file CLI flag. The maximum amount of data that can be stored is 10 MB. Any modification of this data outside of the Web Storage API is not supported. Enable this API with the --experimental-webstorage CLI flag. localStorage data is not stored per user or per request when used in the context of a server, it is shared across all users and requests.
Class: MessageChannel
#
Added in: v15.0.0
The MessageChannel class. See MessageChannel for more details.
Class: MessageEvent
#
Added in: v15.0.0
A browser-compatible implementation of <MessageEvent>.
Class: MessagePort
#
Added in: v15.0.0
The MessagePort class. See MessagePort for more details.
module
#
This variable may appear to be global but is not. See module.
Class: Navigator
#
Added in: v21.0.0
Stability: 1.1 - Active development. Disable this API with the --no-experimental-global-navigator CLI flag.
A partial implementation of the Navigator API.
navigator
#
Added in: v21.0.0
Stability: 1.1 - Active development. Disable this API with the --no-experimental-global-navigator CLI flag.
A partial implementation of window.navigator.
navigator.hardwareConcurrency
#
Added in: v21.0.0
<number>
The navigator.hardwareConcurrency read-only property returns the number of logical processors available to the current Node.js instance.
console.log(`This process is running on ${navigator.hardwareConcurrency} logical processors`);
copy
navigator.language
#
Added in: v21.2.0
<string>
The navigator.language read-only property returns a string representing the preferred language of the Node.js instance. The language will be determined by the ICU library used by Node.js at runtime based on the default language of the operating system.
The value is representing the language version as defined in RFC 5646.
The fallback value on builds without ICU is 'en-US'.
console.log(`The preferred language of the Node.js instance has the tag '${navigator.language}'`);
copy
navigator.languages
#
Added in: v21.2.0
{Array}
The navigator.languages read-only property returns an array of strings representing the preferred languages of the Node.js instance. By default navigator.languages contains only the value of navigator.language, which will be determined by the ICU library used by Node.js at runtime based on the default language of the operating system.
The fallback value on builds without ICU is ['en-US'].
console.log(`The preferred languages are '${navigator.languages}'`);
copy
navigator.platform
#
Added in: v21.2.0
<string>
The navigator.platform read-only property returns a string identifying the platform on which the Node.js instance is running.
console.log(`This process is running on ${navigator.platform}`);
copy
navigator.userAgent
#
Added in: v21.1.0
<string>
The navigator.userAgent read-only property returns user agent consisting of the runtime name and major version number.
console.log(`The user-agent is ${navigator.userAgent}`); // Prints "Node.js/21"
copy
Class: PerformanceEntry
#
Added in: v19.0.0
The PerformanceEntry class. See PerformanceEntry for more details.
Class: PerformanceMark
#
Added in: v19.0.0
The PerformanceMark class. See PerformanceMark for more details.
Class: PerformanceMeasure
#
Added in: v19.0.0
The PerformanceMeasure class. See PerformanceMeasure for more details.
Class: PerformanceObserver
#
Added in: v19.0.0
The PerformanceObserver class. See PerformanceObserver for more details.
Class: PerformanceObserverEntryList
#
Added in: v19.0.0
The PerformanceObserverEntryList class. See PerformanceObserverEntryList for more details.
Class: PerformanceResourceTiming
#
Added in: v19.0.0
The PerformanceResourceTiming class. See PerformanceResourceTiming for more details.
performance
#
Added in: v16.0.0
The perf_hooks.performance object.
process
#
Added in: v0.1.7
<Object>
The process object. See the process object section.
queueMicrotask(callback)
#
Added in: v11.0.0
callback <Function> Function to be queued.
The queueMicrotask() method queues a microtask to invoke callback. If callback throws an exception, the process object 'uncaughtException' event will be emitted.
The microtask queue is managed by V8 and may be used in a similar manner to the process.nextTick() queue, which is managed by Node.js. The process.nextTick() queue is always processed before the microtask queue within each turn of the Node.js event loop.
// Here, `queueMicrotask()` is used to ensure the 'load' event is always
// emitted asynchronously, and therefore consistently. Using
// `process.nextTick()` here would result in the 'load' event always emitting
// before any other promise jobs.

DataHandler.prototype.load = async function load(key) {
  const hit = this._cache.get(key);
  if (hit !== undefined) {
    queueMicrotask(() => {
      this.emit('load', hit);
    });
    return;
  }

  const data = await fetchData(key);
  this._cache.set(key, data);
  this.emit('load', data);
};
copy
Class: ReadableByteStreamController
#
History













A browser-compatible implementation of ReadableByteStreamController.
Class: ReadableStream
#
History













A browser-compatible implementation of ReadableStream.
Class: ReadableStreamBYOBReader
#
History













A browser-compatible implementation of ReadableStreamBYOBReader.
Class: ReadableStreamBYOBRequest
#
History













A browser-compatible implementation of ReadableStreamBYOBRequest.
Class: ReadableStreamDefaultController
#
History













A browser-compatible implementation of ReadableStreamDefaultController.
Class: ReadableStreamDefaultReader
#
History













A browser-compatible implementation of ReadableStreamDefaultReader.
require()
#
This variable may appear to be global but is not. See require().
Class: Response
#
History

















A browser-compatible implementation of <Response>.
Class: Request
#
History

















A browser-compatible implementation of <Request>.
sessionStorage
#
Added in: v22.4.0
Stability: 1.0 - Early development.
A browser-compatible implementation of sessionStorage. Data is stored in memory, with a storage quota of 10 MB. sessionStorage data persists only within the currently running process, and is not shared between workers.
setImmediate(callback[, ...args])
#
Added in: v0.9.1
setImmediate is described in the timers section.
setInterval(callback, delay[, ...args])
#
Added in: v0.0.1
setInterval is described in the timers section.
setTimeout(callback, delay[, ...args])
#
Added in: v0.0.1
setTimeout is described in the timers section.
Class: Storage
#
Added in: v22.4.0
Stability: 1.0 - Early development. Enable this API with the --experimental-webstorage CLI flag.
A browser-compatible implementation of <Storage>.
structuredClone(value[, options])
#
Added in: v17.0.0
The WHATWG structuredClone method.
Class: SubtleCrypto
#
History













A browser-compatible implementation of <SubtleCrypto>. This global is available only if the Node.js binary was compiled with including support for the node:crypto module.
Class: DOMException
#
Added in: v17.0.0
The WHATWG <DOMException> class.
Class: TextDecoder
#
Added in: v11.0.0
The WHATWG TextDecoder class. See the TextDecoder section.
Class: TextDecoderStream
#
History













A browser-compatible implementation of TextDecoderStream.
Class: TextEncoder
#
Added in: v11.0.0
The WHATWG TextEncoder class. See the TextEncoder section.
Class: TextEncoderStream
#
History













A browser-compatible implementation of TextEncoderStream.
Class: TransformStream
#
History













A browser-compatible implementation of TransformStream.
Class: TransformStreamDefaultController
#
History













A browser-compatible implementation of TransformStreamDefaultController.
Class: URL
#
Added in: v10.0.0
The WHATWG URL class. See the URL section.
Class: URLPattern
#
Added in: v24.0.0
Stability: 1 - Experimental
The WHATWG URLPattern class. See the URLPattern section.
Class: URLSearchParams
#
Added in: v10.0.0
The WHATWG URLSearchParams class. See the URLSearchParams section.
Class: WebAssembly
#
Added in: v8.0.0
<Object>
The object that acts as the namespace for all W3C WebAssembly related functionality. See the Mozilla Developer Network for usage and compatibility.
Class: WebSocket
#
History

















A browser-compatible implementation of <WebSocket>. Disable this API with the --no-experimental-websocket CLI flag.
Class: WritableStream
#
History













A browser-compatible implementation of WritableStream.
Class: WritableStreamDefaultController
#
History













A browser-compatible implementation of WritableStreamDefaultController.
Class: WritableStreamDefaultWriter
#
History













A browser-compatible implementation of WritableStreamDefaultWriter.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
HTTP
Class: http.Agent
new Agent([options])
agent.createConnection(options[, callback])
agent.keepSocketAlive(socket)
agent.reuseSocket(socket, request)
agent.destroy()
agent.freeSockets
agent.getName([options])
agent.maxFreeSockets
agent.maxSockets
agent.maxTotalSockets
agent.requests
agent.sockets
Class: http.ClientRequest
Event: 'abort'
Event: 'close'
Event: 'connect'
Event: 'continue'
Event: 'finish'
Event: 'information'
Event: 'response'
Event: 'socket'
Event: 'timeout'
Event: 'upgrade'
request.abort()
request.aborted
request.connection
request.cork()
request.end([data[, encoding]][, callback])
request.destroy([error])
request.destroyed
request.finished
request.flushHeaders()
request.getHeader(name)
request.getHeaderNames()
request.getHeaders()
request.getRawHeaderNames()
request.hasHeader(name)
request.maxHeadersCount
request.path
request.method
request.host
request.protocol
request.removeHeader(name)
request.reusedSocket
request.setHeader(name, value)
request.setNoDelay([noDelay])
request.setSocketKeepAlive([enable][, initialDelay])
request.setTimeout(timeout[, callback])
request.socket
request.uncork()
request.writableEnded
request.writableFinished
request.write(chunk[, encoding][, callback])
Class: http.Server
Event: 'checkContinue'
Event: 'checkExpectation'
Event: 'clientError'
Event: 'close'
Event: 'connect'
Event: 'connection'
Event: 'dropRequest'
Event: 'request'
Event: 'upgrade'
server.close([callback])
server.closeAllConnections()
server.closeIdleConnections()
server.headersTimeout
server.listen()
server.listening
server.maxHeadersCount
server.requestTimeout
server.setTimeout([msecs][, callback])
server.maxRequestsPerSocket
server.timeout
server.keepAliveTimeout
server[Symbol.asyncDispose]()
Class: http.ServerResponse
Event: 'close'
Event: 'finish'
response.addTrailers(headers)
response.connection
response.cork()
response.end([data[, encoding]][, callback])
response.finished
response.flushHeaders()
response.getHeader(name)
response.getHeaderNames()
response.getHeaders()
response.hasHeader(name)
response.headersSent
response.removeHeader(name)
response.req
response.sendDate
response.setHeader(name, value)
response.setTimeout(msecs[, callback])
response.socket
response.statusCode
response.statusMessage
response.strictContentLength
response.uncork()
response.writableEnded
response.writableFinished
response.write(chunk[, encoding][, callback])
response.writeContinue()
response.writeEarlyHints(hints[, callback])
response.writeHead(statusCode[, statusMessage][, headers])
response.writeProcessing()
Class: http.IncomingMessage
Event: 'aborted'
Event: 'close'
message.aborted
message.complete
message.connection
message.destroy([error])
message.headers
message.headersDistinct
message.httpVersion
message.method
message.rawHeaders
message.rawTrailers
message.setTimeout(msecs[, callback])
message.socket
message.statusCode
message.statusMessage
message.trailers
message.trailersDistinct
message.url
Class: http.OutgoingMessage
Event: 'drain'
Event: 'finish'
Event: 'prefinish'
outgoingMessage.addTrailers(headers)
outgoingMessage.appendHeader(name, value)
outgoingMessage.connection
outgoingMessage.cork()
outgoingMessage.destroy([error])
outgoingMessage.end(chunk[, encoding][, callback])
outgoingMessage.flushHeaders()
outgoingMessage.getHeader(name)
outgoingMessage.getHeaderNames()
outgoingMessage.getHeaders()
outgoingMessage.hasHeader(name)
outgoingMessage.headersSent
outgoingMessage.pipe()
outgoingMessage.removeHeader(name)
outgoingMessage.setHeader(name, value)
outgoingMessage.setHeaders(headers)
outgoingMessage.setTimeout(msecs[, callback])
outgoingMessage.socket
outgoingMessage.uncork()
outgoingMessage.writableCorked
outgoingMessage.writableEnded
outgoingMessage.writableFinished
outgoingMessage.writableHighWaterMark
outgoingMessage.writableLength
outgoingMessage.writableObjectMode
outgoingMessage.write(chunk[, encoding][, callback])
http.METHODS
http.STATUS_CODES
http.createServer([options][, requestListener])
http.get(options[, callback])
http.get(url[, options][, callback])
http.globalAgent
http.maxHeaderSize
http.request(options[, callback])
http.request(url[, options][, callback])
http.validateHeaderName(name[, label])
http.validateHeaderValue(name, value)
http.setMaxIdleHTTPParsers(max)
Class: WebSocket
HTTP
#
Stability: 2 - Stable
Source Code: lib/http.js
This module, containing both a client and server, can be imported via require('node:http') (CommonJS) or import * as http from 'node:http' (ES module).
The HTTP interfaces in Node.js are designed to support many features of the protocol which have been traditionally difficult to use. In particular, large, possibly chunk-encoded, messages. The interface is careful to never buffer entire requests or responses, so the user is able to stream data.
HTTP message headers are represented by an object like this:
{ "content-length": "123",
  "content-type": "text/plain",
  "connection": "keep-alive",
  "host": "example.com",
  "accept": "*/*" }
copy
Keys are lowercased. Values are not modified.
In order to support the full spectrum of possible HTTP applications, the Node.js HTTP API is very low-level. It deals with stream handling and message parsing only. It parses a message into headers and body but it does not parse the actual headers or the body.
See message.headers for details on how duplicate headers are handled.
The raw headers as they were received are retained in the rawHeaders property, which is an array of [key, value, key2, value2, ...]. For example, the previous message header object might have a rawHeaders list like the following:
[ 'ConTent-Length', '123456',
  'content-LENGTH', '123',
  'content-type', 'text/plain',
  'CONNECTION', 'keep-alive',
  'Host', 'example.com',
  'accepT', '*/*' ]
copy
Class: http.Agent
#
Added in: v0.3.4
An Agent is responsible for managing connection persistence and reuse for HTTP clients. It maintains a queue of pending requests for a given host and port, reusing a single socket connection for each until the queue is empty, at which time the socket is either destroyed or put into a pool where it is kept to be used again for requests to the same host and port. Whether it is destroyed or pooled depends on the keepAlive option.
Pooled connections have TCP Keep-Alive enabled for them, but servers may still close idle connections, in which case they will be removed from the pool and a new connection will be made when a new HTTP request is made for that host and port. Servers may also refuse to allow multiple requests over the same connection, in which case the connection will have to be remade for every request and cannot be pooled. The Agent will still make the requests to that server, but each one will occur over a new connection.
When a connection is closed by the client or the server, it is removed from the pool. Any unused sockets in the pool will be unrefed so as not to keep the Node.js process running when there are no outstanding requests. (see socket.unref()).
It is good practice, to destroy() an Agent instance when it is no longer in use, because unused sockets consume OS resources.
Sockets are removed from an agent when the socket emits either a 'close' event or an 'agentRemove' event. When intending to keep one HTTP request open for a long time without keeping it in the agent, something like the following may be done:
http.get(options, (res) => {
  // Do stuff
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
copy
An agent may also be used for an individual request. By providing {agent: false} as an option to the http.get() or http.request() functions, a one-time use Agent with default options will be used for the client connection.
agent:false:
http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false,  // Create a new agent just for this one request
}, (res) => {
  // Do stuff with response
});
copy
new Agent([options])
#
History





















options <Object> Set of configurable options to set on the agent. Can have the following fields:
keepAlive <boolean> Keep sockets around even when there are no outstanding requests, so they can be used for future requests without having to reestablish a TCP connection. Not to be confused with the keep-alive value of the Connection header. The Connection: keep-alive header is always sent when using an agent except when the Connection header is explicitly specified or when the keepAlive and maxSockets options are respectively set to false and Infinity, in which case Connection: close will be used. Default: false.
keepAliveMsecs <number> When using the keepAlive option, specifies the initial delay for TCP Keep-Alive packets. Ignored when the keepAlive option is false or undefined. Default: 1000.
maxSockets <number> Maximum number of sockets to allow per host. If the same host opens multiple concurrent connections, each request will use new socket until the maxSockets value is reached. If the host attempts to open more connections than maxSockets, the additional requests will enter into a pending request queue, and will enter active connection state when an existing connection terminates. This makes sure there are at most maxSockets active connections at any point in time, from a given host. Default: Infinity.
maxTotalSockets <number> Maximum number of sockets allowed for all hosts in total. Each request will use a new socket until the maximum is reached. Default: Infinity.
maxFreeSockets <number> Maximum number of sockets per host to leave open in a free state. Only relevant if keepAlive is set to true. Default: 256.
scheduling <string> Scheduling strategy to apply when picking the next free socket to use. It can be 'fifo' or 'lifo'. The main difference between the two scheduling strategies is that 'lifo' selects the most recently used socket, while 'fifo' selects the least recently used socket. In case of a low rate of request per second, the 'lifo' scheduling will lower the risk of picking a socket that might have been closed by the server due to inactivity. In case of a high rate of request per second, the 'fifo' scheduling will maximize the number of open sockets, while the 'lifo' scheduling will keep it as low as possible. Default: 'lifo'.
timeout <number> Socket timeout in milliseconds. This will set the timeout when the socket is created.
options in socket.connect() are also supported.
To configure any of them, a custom http.Agent instance must be created.
const http = require('node:http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
copy
agent.createConnection(options[, callback])
#
Added in: v0.11.4
options <Object> Options containing connection details. Check net.createConnection() for the format of the options
callback <Function> Callback function that receives the created socket
Returns: <stream.Duplex>
Produces a socket/stream to be used for HTTP requests.
By default, this function is the same as net.createConnection(). However, custom agents may override this method in case greater flexibility is desired.
A socket/stream can be supplied in one of two ways: by returning the socket/stream from this function, or by passing the socket/stream to callback.
This method is guaranteed to return an instance of the <net.Socket> class, a subclass of <stream.Duplex>, unless the user specifies a socket type other than <net.Socket>.
callback has a signature of (err, stream).
agent.keepSocketAlive(socket)
#
Added in: v8.1.0
socket <stream.Duplex>
Called when socket is detached from a request and could be persisted by the Agent. Default behavior is to:
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
copy
This method can be overridden by a particular Agent subclass. If this method returns a falsy value, the socket will be destroyed instead of persisting it for use with the next request.
The socket argument can be an instance of <net.Socket>, a subclass of <stream.Duplex>.
agent.reuseSocket(socket, request)
#
Added in: v8.1.0
socket <stream.Duplex>
request <http.ClientRequest>
Called when socket is attached to request after being persisted because of the keep-alive options. Default behavior is to:
socket.ref();
copy
This method can be overridden by a particular Agent subclass.
The socket argument can be an instance of <net.Socket>, a subclass of <stream.Duplex>.
agent.destroy()
#
Added in: v0.11.4
Destroy any sockets that are currently in use by the agent.
It is usually not necessary to do this. However, if using an agent with keepAlive enabled, then it is best to explicitly shut down the agent when it is no longer needed. Otherwise, sockets might stay open for quite a long time before the server terminates them.
agent.freeSockets
#
History













<Object>
An object which contains arrays of sockets currently awaiting use by the agent when keepAlive is enabled. Do not modify.
Sockets in the freeSockets list will be automatically destroyed and removed from the array on 'timeout'.
agent.getName([options])
#
History













options <Object> A set of options providing information for name generation
host <string> A domain name or IP address of the server to issue the request to
port <number> Port of remote server
localAddress <string> Local interface to bind for network connections when issuing the request
family <integer> Must be 4 or 6 if this doesn't equal undefined.
Returns: <string>
Get a unique name for a set of request options, to determine whether a connection can be reused. For an HTTP agent, this returns host:port:localAddress or host:port:localAddress:family. For an HTTPS agent, the name includes the CA, cert, ciphers, and other HTTPS/TLS-specific options that determine socket reusability.
agent.maxFreeSockets
#
Added in: v0.11.7
<number>
By default set to 256. For agents with keepAlive enabled, this sets the maximum number of sockets that will be left open in the free state.
agent.maxSockets
#
Added in: v0.3.6
<number>
By default set to Infinity. Determines how many concurrent sockets the agent can have open per origin. Origin is the returned value of agent.getName().
agent.maxTotalSockets
#
Added in: v14.5.0, v12.19.0
<number>
By default set to Infinity. Determines how many concurrent sockets the agent can have open. Unlike maxSockets, this parameter applies across all origins.
agent.requests
#
History













<Object>
An object which contains queues of requests that have not yet been assigned to sockets. Do not modify.
agent.sockets
#
History













<Object>
An object which contains arrays of sockets currently in use by the agent. Do not modify.
Class: http.ClientRequest
#
Added in: v0.1.17
Extends: <http.OutgoingMessage>
This object is created internally and returned from http.request(). It represents an in-progress request whose header has already been queued. The header is still mutable using the setHeader(name, value), getHeader(name), removeHeader(name) API. The actual header will be sent along with the first data chunk or when calling request.end().
To get the response, add a listener for 'response' to the request object. 'response' will be emitted from the request object when the response headers have been received. The 'response' event is executed with one argument which is an instance of http.IncomingMessage.
During the 'response' event, one can add listeners to the response object; particularly to listen for the 'data' event.
If no 'response' handler is added, then the response will be entirely discarded. However, if a 'response' event handler is added, then the data from the response object must be consumed, either by calling response.read() whenever there is a 'readable' event, or by adding a 'data' handler, or by calling the .resume() method. Until the data is consumed, the 'end' event will not fire. Also, until the data is read it will consume memory that can eventually lead to a 'process out of memory' error.
For backward compatibility, res will only emit 'error' if there is an 'error' listener registered.
Set Content-Length header to limit the response body size. If response.strictContentLength is set to true, mismatching the Content-Length header value will result in an Error being thrown, identified by code: 'ERR_HTTP_CONTENT_LENGTH_MISMATCH'.
Content-Length value should be in bytes, not characters. Use Buffer.byteLength() to determine the length of the body in bytes.
Event: 'abort'
#
Added in: v1.4.1Deprecated since: v17.0.0, v16.12.0
Stability: 0 - Deprecated. Listen for the 'close' event instead.
Emitted when the request has been aborted by the client. This event is only emitted on the first call to abort().
Event: 'close'
#
Added in: v0.5.4
Indicates that the request is completed, or its underlying connection was terminated prematurely (before the response completion).
Event: 'connect'
#
Added in: v0.7.0
response <http.IncomingMessage>
socket <stream.Duplex>
head <Buffer>
Emitted each time a server responds to a request with a CONNECT method. If this event is not being listened for, clients receiving a CONNECT method will have their connections closed.
This event is guaranteed to be passed an instance of the <net.Socket> class, a subclass of <stream.Duplex>, unless the user specifies a socket type other than <net.Socket>.
A client and server pair demonstrating how to listen for the 'connect' event:
const http = require('node:http');
const net = require('node:net');
const { URL } = require('node:url');

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
copy
Event: 'continue'
#
Added in: v0.3.2
Emitted when the server sends a '100 Continue' HTTP response, usually because the request contained 'Expect: 100-continue'. This is an instruction that the client should send the request body.
Event: 'finish'
#
Added in: v0.3.6
Emitted when the request has been sent. More specifically, this event is emitted when the last segment of the response headers and body have been handed off to the operating system for transmission over the network. It does not imply that the server has received anything yet.
Event: 'information'
#
Added in: v10.0.0
info <Object>
httpVersion <string>
httpVersionMajor <integer>
httpVersionMinor <integer>
statusCode <integer>
statusMessage <string>
headers <Object>
rawHeaders <string[]>
Emitted when the server sends a 1xx intermediate response (excluding 101 Upgrade). The listeners of this event will receive an object containing the HTTP version, status code, status message, key-value headers object, and array with the raw header names followed by their respective values.
const http = require('node:http');

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = http.request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
copy
101 Upgrade statuses do not fire this event due to their break from the traditional HTTP request/response chain, such as web sockets, in-place TLS upgrades, or HTTP 2.0. To be notified of 101 Upgrade notices, listen for the 'upgrade' event instead.
Event: 'response'
#
Added in: v0.1.0
response <http.IncomingMessage>
Emitted when a response is received to this request. This event is emitted only once.
Event: 'socket'
#
Added in: v0.5.3
socket <stream.Duplex>
This event is guaranteed to be passed an instance of the <net.Socket> class, a subclass of <stream.Duplex>, unless the user specifies a socket type other than <net.Socket>.
Event: 'timeout'
#
Added in: v0.7.8
Emitted when the underlying socket times out from inactivity. This only notifies that the socket has been idle. The request must be destroyed manually.
See also: request.setTimeout().
Event: 'upgrade'
#
Added in: v0.1.94
response <http.IncomingMessage>
socket <stream.Duplex>
head <Buffer>
Emitted each time a server responds to a request with an upgrade. If this event is not being listened for and the response status code is 101 Switching Protocols, clients receiving an upgrade header will have their connections closed.
This event is guaranteed to be passed an instance of the <net.Socket> class, a subclass of <stream.Duplex>, unless the user specifies a socket type other than <net.Socket>.
A client server pair demonstrating how to listen for the 'upgrade' event.
const http = require('node:http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// Now that server is running
server.listen(1337, '127.0.0.1', () => {

  // make a request
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
copy
request.abort()
#
Added in: v0.3.8Deprecated since: v14.1.0, v13.14.0
Stability: 0 - Deprecated: Use request.destroy() instead.
Marks the request as aborting. Calling this will cause remaining data in the response to be dropped and the socket to be destroyed.
request.aborted
#
History

















Stability: 0 - Deprecated. Check request.destroyed instead.
<boolean>
The request.aborted property will be true if the request has been aborted.
request.connection
#
Added in: v0.3.0Deprecated since: v13.0.0
Stability: 0 - Deprecated. Use request.socket.
<stream.Duplex>
See request.socket.
request.cork()
#
Added in: v13.2.0, v12.16.0
See writable.cork().
request.end([data[, encoding]][, callback])
#
History

















data <string> | <Buffer> | <Uint8Array>
encoding <string>
callback <Function>
Returns: <this>
Finishes sending the request. If any parts of the body are unsent, it will flush them to the stream. If the request is chunked, this will send the terminating '0\r\n\r\n'.
If data is specified, it is equivalent to calling request.write(data, encoding) followed by request.end(callback).
If callback is specified, it will be called when the request stream is finished.
request.destroy([error])
#
History













error <Error> Optional, an error to emit with 'error' event.
Returns: <this>
Destroy the request. Optionally emit an 'error' event, and emit a 'close' event. Calling this will cause remaining data in the response to be dropped and the socket to be destroyed.
See writable.destroy() for further details.
request.destroyed
#
Added in: v14.1.0, v13.14.0
<boolean>
Is true after request.destroy() has been called.
See writable.destroyed for further details.
request.finished
#
Added in: v0.0.1Deprecated since: v13.4.0, v12.16.0
Stability: 0 - Deprecated. Use request.writableEnded.
<boolean>
The request.finished property will be true if request.end() has been called. request.end() will automatically be called if the request was initiated via http.get().
request.flushHeaders()
#
Added in: v1.6.0
Flushes the request headers.
For efficiency reasons, Node.js normally buffers the request headers until request.end() is called or the first chunk of request data is written. It then tries to pack the request headers and data into a single TCP packet.
That's usually desired (it saves a TCP round-trip), but not when the first data is not sent until possibly much later. request.flushHeaders() bypasses the optimization and kickstarts the request.
request.getHeader(name)
#
Added in: v1.6.0
name <string>
Returns: <any>
Reads out a header on the request. The name is case-insensitive. The type of the return value depends on the arguments provided to request.setHeader().
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' is 'text/html'
const contentLength = request.getHeader('Content-Length');
// 'contentLength' is of type number
const cookie = request.getHeader('Cookie');
// 'cookie' is of type string[]
copy
request.getHeaderNames()
#
Added in: v7.7.0
Returns: <string[]>
Returns an array containing the unique names of the current outgoing headers. All header names are lowercase.
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getHeaderNames();
// headerNames === ['foo', 'cookie']
copy
request.getHeaders()
#
Added in: v7.7.0
Returns: <Object>
Returns a shallow copy of the current outgoing headers. Since a shallow copy is used, array values may be mutated without additional calls to various header-related http module methods. The keys of the returned object are the header names and the values are the respective header values. All header names are lowercase.
The object returned by the request.getHeaders() method does not prototypically inherit from the JavaScript Object. This means that typical Object methods such as obj.toString(), obj.hasOwnProperty(), and others are not defined and will not work.
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headers = request.getHeaders();
// headers === { foo: 'bar', 'cookie': ['foo=bar', 'bar=baz'] }
copy
request.getRawHeaderNames()
#
Added in: v15.13.0, v14.17.0
Returns: <string[]>
Returns an array containing the unique names of the current outgoing raw headers. Header names are returned with their exact casing being set.
request.setHeader('Foo', 'bar');
request.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getRawHeaderNames();
// headerNames === ['Foo', 'Set-Cookie']
copy
request.hasHeader(name)
#
Added in: v7.7.0
name <string>
Returns: <boolean>
Returns true if the header identified by name is currently set in the outgoing headers. The header name matching is case-insensitive.
const hasContentType = request.hasHeader('content-type');
copy
request.maxHeadersCount
#
<number> Default: 2000
Limits maximum response headers count. If set to 0, no limit will be applied.
request.path
#
Added in: v0.4.0
<string> The request path.
request.method
#
Added in: v0.1.97
<string> The request method.
request.host
#
Added in: v14.5.0, v12.19.0
<string> The request host.
request.protocol
#
Added in: v14.5.0, v12.19.0
<string> The request protocol.
request.removeHeader(name)
#
Added in: v1.6.0
name <string>
Removes a header that's already defined into headers object.
request.removeHeader('Content-Type');
copy
request.reusedSocket
#
Added in: v13.0.0, v12.16.0
<boolean> Whether the request is send through a reused socket.
When sending request through a keep-alive enabled agent, the underlying socket might be reused. But if server closes connection at unfortunate time, client may run into a 'ECONNRESET' error.
const http = require('node:http');

// Server has a 5 seconds keep-alive timeout by default
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Adapting a keep-alive agent
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // Do nothing
    });
  });
}, 5000); // Sending request on 5s interval so it's easy to hit idle timeout
copy
By marking a request whether it reused socket or not, we can do automatic error retry base on it.
const http = require('node:http');
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // Check if retry is needed
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
copy
request.setHeader(name, value)
#
Added in: v1.6.0
name <string>
value <any>
Sets a single header value for headers object. If this header already exists in the to-be-sent headers, its value will be replaced. Use an array of strings here to send multiple headers with the same name. Non-string values will be stored without modification. Therefore, request.getHeader() may return non-string values. However, the non-string values will be converted to strings for network transmission.
request.setHeader('Content-Type', 'application/json');
copy
or
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
copy
When the value is a string an exception will be thrown if it contains characters outside the latin1 encoding.
If you need to pass UTF-8 characters in the value please encode the value using the RFC 8187 standard.
const filename = 'Rock 🎵.txt';
request.setHeader('Content-Disposition', `attachment; filename*=utf-8''${encodeURIComponent(filename)}`);
copy
request.setNoDelay([noDelay])
#
Added in: v0.5.9
noDelay <boolean>
Once a socket is assigned to this request and is connected socket.setNoDelay() will be called.
request.setSocketKeepAlive([enable][, initialDelay])
#
Added in: v0.5.9
enable <boolean>
initialDelay <number>
Once a socket is assigned to this request and is connected socket.setKeepAlive() will be called.
request.setTimeout(timeout[, callback])
#
History













timeout <number> Milliseconds before a request times out.
callback <Function> Optional function to be called when a timeout occurs. Same as binding to the 'timeout' event.
Returns: <http.ClientRequest>
Once a socket is assigned to this request and is connected socket.setTimeout() will be called.
request.socket
#
Added in: v0.3.0
<stream.Duplex>
Reference to the underlying socket. Usually users will not want to access this property. In particular, the socket will not emit 'readable' events because of how the protocol parser attaches to the socket.
const http = require('node:http');
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
copy
This property is guaranteed to be an instance of the <net.Socket> class, a subclass of <stream.Duplex>, unless the user specified a socket type other than <net.Socket>.
request.uncork()
#
Added in: v13.2.0, v12.16.0
See writable.uncork().
request.writableEnded
#
Added in: v12.9.0
<boolean>
Is true after request.end() has been called. This property does not indicate whether the data has been flushed, for this use request.writableFinished instead.
request.writableFinished
#
Added in: v12.7.0
<boolean>
Is true if all data has been flushed to the underlying system, immediately before the 'finish' event is emitted.
request.write(chunk[, encoding][, callback])
#
History













chunk <string> | <Buffer> | <Uint8Array>
encoding <string>
callback <Function>
Returns: <boolean>
Sends a chunk of the body. This method can be called multiple times. If no Content-Length is set, data will automatically be encoded in HTTP Chunked transfer encoding, so that server knows when the data ends. The Transfer-Encoding: chunked header is added. Calling request.end() is necessary to finish sending the request.
The encoding argument is optional and only applies when chunk is a string. Defaults to 'utf8'.
The callback argument is optional and will be called when this chunk of data is flushed, but only if the chunk is non-empty.
Returns true if the entire data was flushed successfully to the kernel buffer. Returns false if all or part of the data was queued in user memory. 'drain' will be emitted when the buffer is free again.
When write function is called with empty string or buffer, it does nothing and waits for more input.
Class: http.Server
#
Added in: v0.1.17
Extends: <net.Server>
Event: 'checkContinue'
#
Added in: v0.3.0
request <http.IncomingMessage>
response <http.ServerResponse>
Emitted each time a request with an HTTP Expect: 100-continue is received. If this event is not listened for, the server will automatically respond with a 100 Continue as appropriate.
Handling this event involves calling response.writeContinue() if the client should continue to send the request body, or generating an appropriate HTTP response (e.g. 400 Bad Request) if the client should not continue to send the request body.
When this event is emitted and handled, the 'request' event will not be emitted.
Event: 'checkExpectation'
#
Added in: v5.5.0
request <http.IncomingMessage>
response <http.ServerResponse>
Emitted each time a request with an HTTP Expect header is received, where the value is not 100-continue. If this event is not listened for, the server will automatically respond with a 417 Expectation Failed as appropriate.
When this event is emitted and handled, the 'request' event will not be emitted.
Event: 'clientError'
#
History





















exception <Error>
socket <stream.Duplex>
If a client connection emits an 'error' event, it will be forwarded here. Listener of this event is responsible for closing/destroying the underlying socket. For example, one may wish to more gracefully close the socket with a custom HTTP response instead of abruptly severing the connection. The socket must be closed or destroyed before the listener ends.
This event is guaranteed to be passed an instance of the <net.Socket> class, a subclass of <stream.Duplex>, unless the user specifies a socket type other than <net.Socket>.
Default behavior is to try close the socket with a HTTP '400 Bad Request', or a HTTP '431 Request Header Fields Too Large' in the case of a HPE_HEADER_OVERFLOW error. If the socket is not writable or headers of the current attached http.ServerResponse has been sent, it is immediately destroyed.
socket is the net.Socket object that the error originated from.
const http = require('node:http');

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
copy
When the 'clientError' event occurs, there is no request or response object, so any HTTP response sent, including response headers and payload, must be written directly to the socket object. Care must be taken to ensure the response is a properly formatted HTTP response message.
err is an instance of Error with two extra columns:
bytesParsed: the bytes count of request packet that Node.js may have parsed correctly;
rawPacket: the raw packet of current request.
In some cases, the client has already received the response and/or the socket has already been destroyed, like in case of ECONNRESET errors. Before trying to send data to the socket, it is better to check that it is still writable.
server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
copy
Event: 'close'
#
Added in: v0.1.4
Emitted when the server closes.
Event: 'connect'
#
Added in: v0.7.0
request <http.IncomingMessage> Arguments for the HTTP request, as it is in the 'request' event
socket <stream.Duplex> Network socket between the server and client
head <Buffer> The first packet of the tunneling stream (may be empty)
Emitted each time a client requests an HTTP CONNECT method. If this event is not listened for, then clients requesting a CONNECT method will have their connections closed.
This event is guaranteed to be passed an instance of the <net.Socket> class, a subclass of <stream.Duplex>, unless the user specifies a socket type other than <net.Socket>.
After this event is emitted, the request's socket will not have a 'data' event listener, meaning it will need to be bound in order to handle data sent to the server on that socket.
Event: 'connection'
#
Added in: v0.1.0
socket <stream.Duplex>
This event is emitted when a new TCP stream is established. socket is typically an object of type net.Socket. Usually users will not want to access this event. In particular, the socket will not emit 'readable' events because of how the protocol parser attaches to the socket. The socket can also be accessed at request.socket.
This event can also be explicitly emitted by users to inject connections into the HTTP server. In that case, any Duplex stream can be passed.
If socket.setTimeout() is called here, the timeout will be replaced with server.keepAliveTimeout when the socket has served a request (if server.keepAliveTimeout is non-zero).
This event is guaranteed to be passed an instance of the <net.Socket> class, a subclass of <stream.Duplex>, unless the user specifies a socket type other than <net.Socket>.
Event: 'dropRequest'
#
Added in: v18.7.0, v16.17.0
request <http.IncomingMessage> Arguments for the HTTP request, as it is in the 'request' event
socket <stream.Duplex> Network socket between the server and client
When the number of requests on a socket reaches the threshold of server.maxRequestsPerSocket, the server will drop new requests and emit 'dropRequest' event instead, then send 503 to client.
Event: 'request'
#
Added in: v0.1.0
request <http.IncomingMessage>
response <http.ServerResponse>
Emitted each time there is a request. There may be multiple requests per connection (in the case of HTTP Keep-Alive connections).
Event: 'upgrade'
#
History













request <http.IncomingMessage> Arguments for the HTTP request, as it is in the 'request' event
socket <stream.Duplex> Network socket between the server and client
head <Buffer> The first packet of the upgraded stream (may be empty)
Emitted each time a client requests an HTTP upgrade. Listening to this event is optional and clients cannot insist on a protocol change.
After this event is emitted, the request's socket will not have a 'data' event listener, meaning it will need to be bound in order to handle data sent to the server on that socket.
This event is guaranteed to be passed an instance of the <net.Socket> class, a subclass of <stream.Duplex>, unless the user specifies a socket type other than <net.Socket>.
server.close([callback])
#
History













callback <Function>
Stops the server from accepting new connections and closes all connections connected to this server which are not sending a request or waiting for a response. See net.Server.close().
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Close the server after 10 seconds
setTimeout(() => {
  server.close(() => {
    console.log('server on port 8000 closed successfully');
  });
}, 10000);
copy
server.closeAllConnections()
#
Added in: v18.2.0
Closes all established HTTP(S) connections connected to this server, including active connections connected to this server which are sending a request or waiting for a response. This does not destroy sockets upgraded to a different protocol, such as WebSocket or HTTP/2.
This is a forceful way of closing all connections and should be used with caution. Whenever using this in conjunction with server.close, calling this after server.close is recommended as to avoid race conditions where new connections are created between a call to this and a call to server.close.
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Close the server after 10 seconds
setTimeout(() => {
  server.close(() => {
    console.log('server on port 8000 closed successfully');
  });
  // Closes all connections, ensuring the server closes successfully
  server.closeAllConnections();
}, 10000);
copy
server.closeIdleConnections()
#
Added in: v18.2.0
Closes all connections connected to this server which are not sending a request or waiting for a response.
Starting with Node.js 19.0.0, there's no need for calling this method in conjunction with server.close to reap keep-alive connections. Using it won't cause any harm though, and it can be useful to ensure backwards compatibility for libraries and applications that need to support versions older than 19.0.0. Whenever using this in conjunction with server.close, calling this after server.close is recommended as to avoid race conditions where new connections are created between a call to this and a call to server.close.
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Close the server after 10 seconds
setTimeout(() => {
  server.close(() => {
    console.log('server on port 8000 closed successfully');
  });
  // Closes idle connections, such as keep-alive connections. Server will close
  // once remaining active connections are terminated
  server.closeIdleConnections();
}, 10000);
copy
server.headersTimeout
#
History













<number> Default: The minimum between server.requestTimeout or 60000.
Limit the amount of time the parser will wait to receive the complete HTTP headers.
If the timeout expires, the server responds with status 408 without forwarding the request to the request listener and then closes the connection.
It must be set to a non-zero value (e.g. 120 seconds) to protect against potential Denial-of-Service attacks in case the server is deployed without a reverse proxy in front.
server.listen()
#
Starts the HTTP server listening for connections. This method is identical to server.listen() from net.Server.
server.listening
#
Added in: v5.7.0
<boolean> Indicates whether or not the server is listening for connections.
server.maxHeadersCount
#
Added in: v0.7.0
<number> Default: 2000
Limits maximum incoming headers count. If set to 0, no limit will be applied.
server.requestTimeout
#
History













<number> Default: 300000
Sets the timeout value in milliseconds for receiving the entire request from the client.
If the timeout expires, the server responds with status 408 without forwarding the request to the request listener and then closes the connection.
It must be set to a non-zero value (e.g. 120 seconds) to protect against potential Denial-of-Service attacks in case the server is deployed without a reverse proxy in front.
server.setTimeout([msecs][, callback])
#
History













msecs <number> Default: 0 (no timeout)
callback <Function>
Returns: <http.Server>
Sets the timeout value for sockets, and emits a 'timeout' event on the Server object, passing the socket as an argument, if a timeout occurs.
If there is a 'timeout' event listener on the Server object, then it will be called with the timed-out socket as an argument.
By default, the Server does not timeout sockets. However, if a callback is assigned to the Server's 'timeout' event, timeouts must be handled explicitly.
server.maxRequestsPerSocket
#
Added in: v16.10.0
<number> Requests per socket. Default: 0 (no limit)
The maximum number of requests socket can handle before closing keep alive connection.
A value of 0 will disable the limit.
When the limit is reached it will set the Connection header value to close, but will not actually close the connection, subsequent requests sent after the limit is reached will get 503 Service Unavailable as a response.
server.timeout
#
History













<number> Timeout in milliseconds. Default: 0 (no timeout)
The number of milliseconds of inactivity before a socket is presumed to have timed out.
A value of 0 will disable the timeout behavior on incoming connections.
The socket timeout logic is set up on connection, so changing this value only affects new connections to the server, not any existing connections.
server.keepAliveTimeout
#
Added in: v8.0.0
<number> Timeout in milliseconds. Default: 5000 (5 seconds).
The number of milliseconds of inactivity a server needs to wait for additional incoming data, after it has finished writing the last response, before a socket will be destroyed. If the server receives new data before the keep-alive timeout has fired, it will reset the regular inactivity timeout, i.e., server.timeout.
A value of 0 will disable the keep-alive timeout behavior on incoming connections. A value of 0 makes the http server behave similarly to Node.js versions prior to 8.0.0, which did not have a keep-alive timeout.
The socket timeout logic is set up on connection, so changing this value only affects new connections to the server, not any existing connections.
server[Symbol.asyncDispose]()
#
History













Calls server.close() and returns a promise that fulfills when the server has closed.
Class: http.ServerResponse
#
Added in: v0.1.17
Extends: <http.OutgoingMessage>
This object is created internally by an HTTP server, not by the user. It is passed as the second parameter to the 'request' event.
Event: 'close'
#
Added in: v0.6.7
Indicates that the response is completed, or its underlying connection was terminated prematurely (before the response completion).
Event: 'finish'
#
Added in: v0.3.6
Emitted when the response has been sent. More specifically, this event is emitted when the last segment of the response headers and body have been handed off to the operating system for transmission over the network. It does not imply that the client has received anything yet.
response.addTrailers(headers)
#
Added in: v0.3.0
headers <Object>
This method adds HTTP trailing headers (a header but at the end of the message) to the response.
Trailers will only be emitted if chunked encoding is used for the response; if it is not (e.g. if the request was HTTP/1.0), they will be silently discarded.
HTTP requires the Trailer header to be sent in order to emit trailers, with a list of the header fields in its value. E.g.,
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
copy
Attempting to set a header field name or value that contains invalid characters will result in a TypeError being thrown.
response.connection
#
Added in: v0.3.0Deprecated since: v13.0.0
Stability: 0 - Deprecated. Use response.socket.
<stream.Duplex>
See response.socket.
response.cork()
#
Added in: v13.2.0, v12.16.0
See writable.cork().
response.end([data[, encoding]][, callback])
#
History

















data <string> | <Buffer> | <Uint8Array>
encoding <string>
callback <Function>
Returns: <this>
This method signals to the server that all of the response headers and body have been sent; that server should consider this message complete. The method, response.end(), MUST be called on each response.
If data is specified, it is similar in effect to calling response.write(data, encoding) followed by response.end(callback).
If callback is specified, it will be called when the response stream is finished.
response.finished
#
Added in: v0.0.2Deprecated since: v13.4.0, v12.16.0
Stability: 0 - Deprecated. Use response.writableEnded.
<boolean>
The response.finished property will be true if response.end() has been called.
response.flushHeaders()
#
Added in: v1.6.0
Flushes the response headers. See also: request.flushHeaders().
response.getHeader(name)
#
Added in: v0.4.0
name <string>
Returns: <any>
Reads out a header that's already been queued but not sent to the client. The name is case-insensitive. The type of the return value depends on the arguments provided to response.setHeader().
response.setHeader('Content-Type', 'text/html');
response.setHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
const contentType = response.getHeader('content-type');
// contentType is 'text/html'
const contentLength = response.getHeader('Content-Length');
// contentLength is of type number
const setCookie = response.getHeader('set-cookie');
// setCookie is of type string[]
copy
response.getHeaderNames()
#
Added in: v7.7.0
Returns: <string[]>
Returns an array containing the unique names of the current outgoing headers. All header names are lowercase.
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
copy
response.getHeaders()
#
Added in: v7.7.0
Returns: <Object>
Returns a shallow copy of the current outgoing headers. Since a shallow copy is used, array values may be mutated without additional calls to various header-related http module methods. The keys of the returned object are the header names and the values are the respective header values. All header names are lowercase.
The object returned by the response.getHeaders() method does not prototypically inherit from the JavaScript Object. This means that typical Object methods such as obj.toString(), obj.hasOwnProperty(), and others are not defined and will not work.
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
copy
response.hasHeader(name)
#
Added in: v7.7.0
name <string>
Returns: <boolean>
Returns true if the header identified by name is currently set in the outgoing headers. The header name matching is case-insensitive.
const hasContentType = response.hasHeader('content-type');
copy
response.headersSent
#
Added in: v0.9.3
<boolean>
Boolean (read-only). True if headers were sent, false otherwise.
response.removeHeader(name)
#
Added in: v0.4.0
name <string>
Removes a header that's queued for implicit sending.
response.removeHeader('Content-Encoding');
copy
response.req
#
Added in: v15.7.0
<http.IncomingMessage>
A reference to the original HTTP request object.
response.sendDate
#
Added in: v0.7.5
<boolean>
When true, the Date header will be automatically generated and sent in the response if it is not already present in the headers. Defaults to true.
This should only be disabled for testing; HTTP requires the Date header in responses.
response.setHeader(name, value)
#
Added in: v0.4.0
name <string>
value <any>
Returns: <http.ServerResponse>
Returns the response object.
Sets a single header value for implicit headers. If this header already exists in the to-be-sent headers, its value will be replaced. Use an array of strings here to send multiple headers with the same name. Non-string values will be stored without modification. Therefore, response.getHeader() may return non-string values. However, the non-string values will be converted to strings for network transmission. The same response object is returned to the caller, to enable call chaining.
response.setHeader('Content-Type', 'text/html');
copy
or
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
copy
Attempting to set a header field name or value that contains invalid characters will result in a TypeError being thrown.
When headers have been set with response.setHeader(), they will be merged with any headers passed to response.writeHead(), with the headers passed to response.writeHead() given precedence.
// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
copy
If response.writeHead() method is called and this method has not been called, it will directly write the supplied header values onto the network channel without caching internally, and the response.getHeader() on the header will not yield the expected result. If progressive population of headers is desired with potential future retrieval and modification, use response.setHeader() instead of response.writeHead().
response.setTimeout(msecs[, callback])
#
Added in: v0.9.12
msecs <number>
callback <Function>
Returns: <http.ServerResponse>
Sets the Socket's timeout value to msecs. If a callback is provided, then it is added as a listener on the 'timeout' event on the response object.
If no 'timeout' listener is added to the request, the response, or the server, then sockets are destroyed when they time out. If a handler is assigned to the request, the response, or the server's 'timeout' events, timed out sockets must be handled explicitly.
response.socket
#
Added in: v0.3.0
<stream.Duplex>
Reference to the underlying socket. Usually users will not want to access this property. In particular, the socket will not emit 'readable' events because of how the protocol parser attaches to the socket. After response.end(), the property is nulled.
const http = require('node:http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
copy
This property is guaranteed to be an instance of the <net.Socket> class, a subclass of <stream.Duplex>, unless the user specified a socket type other than <net.Socket>.
response.statusCode
#
Added in: v0.4.0
<number> Default: 200
When using implicit headers (not calling response.writeHead() explicitly), this property controls the status code that will be sent to the client when the headers get flushed.
response.statusCode = 404;
copy
After response header was sent to the client, this property indicates the status code which was sent out.
response.statusMessage
#
Added in: v0.11.8
<string>
When using implicit headers (not calling response.writeHead() explicitly), this property controls the status message that will be sent to the client when the headers get flushed. If this is left as undefined then the standard message for the status code will be used.
response.statusMessage = 'Not found';
copy
After response header was sent to the client, this property indicates the status message which was sent out.
response.strictContentLength
#
Added in: v18.10.0, v16.18.0
<boolean> Default: false
If set to true, Node.js will check whether the Content-Length header value and the size of the body, in bytes, are equal. Mismatching the Content-Length header value will result in an Error being thrown, identified by code: 'ERR_HTTP_CONTENT_LENGTH_MISMATCH'.
response.uncork()
#
Added in: v13.2.0, v12.16.0
See writable.uncork().
response.writableEnded
#
Added in: v12.9.0
<boolean>
Is true after response.end() has been called. This property does not indicate whether the data has been flushed, for this use response.writableFinished instead.
response.writableFinished
#
Added in: v12.7.0
<boolean>
Is true if all data has been flushed to the underlying system, immediately before the 'finish' event is emitted.
response.write(chunk[, encoding][, callback])
#
History













chunk <string> | <Buffer> | <Uint8Array>
encoding <string> Default: 'utf8'
callback <Function>
Returns: <boolean>
If this method is called and response.writeHead() has not been called, it will switch to implicit header mode and flush the implicit headers.
This sends a chunk of the response body. This method may be called multiple times to provide successive parts of the body.
If rejectNonStandardBodyWrites is set to true in createServer then writing to the body is not allowed when the request method or response status do not support content. If an attempt is made to write to the body for a HEAD request or as part of a 204 or 304response, a synchronous Error with the code ERR_HTTP_BODY_NOT_ALLOWED is thrown.
chunk can be a string or a buffer. If chunk is a string, the second parameter specifies how to encode it into a byte stream. callback will be called when this chunk of data is flushed.
This is the raw HTTP body and has nothing to do with higher-level multi-part body encodings that may be used.
The first time response.write() is called, it will send the buffered header information and the first chunk of the body to the client. The second time response.write() is called, Node.js assumes data will be streamed, and sends the new data separately. That is, the response is buffered up to the first chunk of the body.
Returns true if the entire data was flushed successfully to the kernel buffer. Returns false if all or part of the data was queued in user memory. 'drain' will be emitted when the buffer is free again.
response.writeContinue()
#
Added in: v0.3.0
Sends an HTTP/1.1 100 Continue message to the client, indicating that the request body should be sent. See the 'checkContinue' event on Server.
response.writeEarlyHints(hints[, callback])
#
History













hints <Object>
callback <Function>
Sends an HTTP/1.1 103 Early Hints message to the client with a Link header, indicating that the user agent can preload/preconnect the linked resources. The hints is an object containing the values of headers to be sent with early hints message. The optional callback argument will be called when the response message has been written.
Example
const earlyHintsLink = '</styles.css>; rel=preload; as=style';
response.writeEarlyHints({
  'link': earlyHintsLink,
});

const earlyHintsLinks = [
  '</styles.css>; rel=preload; as=style',
  '</scripts.js>; rel=preload; as=script',
];
response.writeEarlyHints({
  'link': earlyHintsLinks,
  'x-trace-id': 'id for diagnostics',
});

const earlyHintsCallback = () => console.log('early hints message sent');
response.writeEarlyHints({
  'link': earlyHintsLinks,
}, earlyHintsCallback);
copy
response.writeHead(statusCode[, statusMessage][, headers])
#
History





















statusCode <number>
statusMessage <string>
headers <Object> | <Array>
Returns: <http.ServerResponse>
Sends a response header to the request. The status code is a 3-digit HTTP status code, like 404. The last argument, headers, are the response headers. Optionally one can give a human-readable statusMessage as the second argument.
headers may be an Array where the keys and values are in the same list. It is not a list of tuples. So, the even-numbered offsets are key values, and the odd-numbered offsets are the associated values. The array is in the same format as request.rawHeaders.
Returns a reference to the ServerResponse, so that calls can be chained.
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body);
copy
This method must only be called once on a message and it must be called before response.end() is called.
If response.write() or response.end() are called before calling this, the implicit/mutable headers will be calculated and call this function.
When headers have been set with response.setHeader(), they will be merged with any headers passed to response.writeHead(), with the headers passed to response.writeHead() given precedence.
If this method is called and response.setHeader() has not been called, it will directly write the supplied header values onto the network channel without caching internally, and the response.getHeader() on the header will not yield the expected result. If progressive population of headers is desired with potential future retrieval and modification, use response.setHeader() instead.
// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
copy
Content-Length is read in bytes, not characters. Use Buffer.byteLength() to determine the length of the body in bytes. Node.js will check whether Content-Length and the length of the body which has been transmitted are equal or not.
Attempting to set a header field name or value that contains invalid characters will result in a [Error][] being thrown.
response.writeProcessing()
#
Added in: v10.0.0
Sends a HTTP/1.1 102 Processing message to the client, indicating that the request body should be sent.
Class: http.IncomingMessage
#
History

















Extends: <stream.Readable>
An IncomingMessage object is created by http.Server or http.ClientRequest and passed as the first argument to the 'request' and 'response' event respectively. It may be used to access response status, headers, and data.
Different from its socket value which is a subclass of <stream.Duplex>, the IncomingMessage itself extends <stream.Readable> and is created separately to parse and emit the incoming HTTP headers and payload, as the underlying socket may be reused multiple times in case of keep-alive.
Event: 'aborted'
#
Added in: v0.3.8Deprecated since: v17.0.0, v16.12.0
Stability: 0 - Deprecated. Listen for 'close' event instead.
Emitted when the request has been aborted.
Event: 'close'
#
History













Emitted when the request has been completed.
message.aborted
#
Added in: v10.1.0Deprecated since: v17.0.0, v16.12.0
Stability: 0 - Deprecated. Check message.destroyed from <stream.Readable>.
<boolean>
The message.aborted property will be true if the request has been aborted.
message.complete
#
Added in: v0.3.0
<boolean>
The message.complete property will be true if a complete HTTP message has been received and successfully parsed.
This property is particularly useful as a means of determining if a client or server fully transmitted a message before a connection was terminated:
const req = http.request({
  host: '127.0.0.1',
  port: 8080,
  method: 'POST',
}, (res) => {
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        'The connection was terminated while the message was still being sent');
  });
});
copy
message.connection
#
Added in: v0.1.90Deprecated since: v16.0.0
Stability: 0 - Deprecated. Use message.socket.
Alias for message.socket.
message.destroy([error])
#
History













error <Error>
Returns: <this>
Calls destroy() on the socket that received the IncomingMessage. If error is provided, an 'error' event is emitted on the socket and error is passed as an argument to any listeners on the event.
message.headers
#
History

















<Object>
The request/response headers object.
Key-value pairs of header names and values. Header names are lower-cased.
// Prints something like:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
copy
Duplicates in raw headers are handled in the following ways, depending on the header name:
Duplicates of age, authorization, content-length, content-type, etag, expires, from, host, if-modified-since, if-unmodified-since, last-modified, location, max-forwards, proxy-authorization, referer, retry-after, server, or user-agent are discarded. To allow duplicate values of the headers listed above to be joined, use the option joinDuplicateHeaders in http.request() and http.createServer(). See RFC 9110 Section 5.3 for more information.
set-cookie is always an array. Duplicates are added to the array.
For duplicate cookie headers, the values are joined together with ; .
For all other headers, the values are joined together with , .
message.headersDistinct
#
Added in: v18.3.0, v16.17.0
<Object>
Similar to message.headers, but there is no join logic and the values are always arrays of strings, even for headers received just once.
// Prints something like:
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*/*'] }
console.log(request.headersDistinct);
copy
message.httpVersion
#
Added in: v0.1.1
<string>
In case of server request, the HTTP version sent by the client. In the case of client response, the HTTP version of the connected-to server. Probably either '1.1' or '1.0'.
Also message.httpVersionMajor is the first integer and message.httpVersionMinor is the second.
message.method
#
Added in: v0.1.1
<string>
Only valid for request obtained from http.Server.
The request method as a string. Read only. Examples: 'GET', 'DELETE'.
message.rawHeaders
#
Added in: v0.11.6
<string[]>
The raw request/response headers list exactly as they were received.
The keys and values are in the same list. It is not a list of tuples. So, the even-numbered offsets are key values, and the odd-numbered offsets are the associated values.
Header names are not lowercased, and duplicates are not merged.
// Prints something like:
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders);
copy
message.rawTrailers
#
Added in: v0.11.6
<string[]>
The raw request/response trailer keys and values exactly as they were received. Only populated at the 'end' event.
message.setTimeout(msecs[, callback])
#
Added in: v0.5.9
msecs <number>
callback <Function>
Returns: <http.IncomingMessage>
Calls message.socket.setTimeout(msecs, callback).
message.socket
#
Added in: v0.3.0
<stream.Duplex>
The net.Socket object associated with the connection.
With HTTPS support, use request.socket.getPeerCertificate() to obtain the client's authentication details.
This property is guaranteed to be an instance of the <net.Socket> class, a subclass of <stream.Duplex>, unless the user specified a socket type other than <net.Socket> or internally nulled.
message.statusCode
#
Added in: v0.1.1
<number>
Only valid for response obtained from http.ClientRequest.
The 3-digit HTTP response status code. E.G. 404.
message.statusMessage
#
Added in: v0.11.10
<string>
Only valid for response obtained from http.ClientRequest.
The HTTP response status message (reason phrase). E.G. OK or Internal Server Error.
message.trailers
#
Added in: v0.3.0
<Object>
The request/response trailers object. Only populated at the 'end' event.
message.trailersDistinct
#
Added in: v18.3.0, v16.17.0
<Object>
Similar to message.trailers, but there is no join logic and the values are always arrays of strings, even for headers received just once. Only populated at the 'end' event.
message.url
#
Added in: v0.1.90
<string>
Only valid for request obtained from http.Server.
Request URL string. This contains only the URL that is present in the actual HTTP request. Take the following request:
GET /status?name=ryan HTTP/1.1
Accept: text/plain
copy
To parse the URL into its parts:
new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
copy
When request.url is '/status?name=ryan' and process.env.HOST is undefined:
$ node
> new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
URL {
  href: 'http://localhost/status?name=ryan',
  origin: 'http://localhost',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
copy
Ensure that you set process.env.HOST to the server's host name, or consider replacing this part entirely. If using req.headers.host, ensure proper validation is used, as clients may specify a custom Host header.
Class: http.OutgoingMessage
#
Added in: v0.1.17
Extends: <Stream>
This class serves as the parent class of http.ClientRequest and http.ServerResponse. It is an abstract outgoing message from the perspective of the participants of an HTTP transaction.
Event: 'drain'
#
Added in: v0.3.6
Emitted when the buffer of the message is free again.
Event: 'finish'
#
Added in: v0.1.17
Emitted when the transmission is finished successfully.
Event: 'prefinish'
#
Added in: v0.11.6
Emitted after outgoingMessage.end() is called. When the event is emitted, all data has been processed but not necessarily completely flushed.
outgoingMessage.addTrailers(headers)
#
Added in: v0.3.0
headers <Object>
Adds HTTP trailers (headers but at the end of the message) to the message.
Trailers will only be emitted if the message is chunked encoded. If not, the trailers will be silently discarded.
HTTP requires the Trailer header to be sent to emit trailers, with a list of header field names in its value, e.g.
message.writeHead(200, { 'Content-Type': 'text/plain',
                         'Trailer': 'Content-MD5' });
message.write(fileData);
message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
message.end();
copy
Attempting to set a header field name or value that contains invalid characters will result in a TypeError being thrown.
outgoingMessage.appendHeader(name, value)
#
Added in: v18.3.0, v16.17.0
name <string> Header name
value <string> | <string[]> Header value
Returns: <this>
Append a single header value to the header object.
If the value is an array, this is equivalent to calling this method multiple times.
If there were no previous values for the header, this is equivalent to calling outgoingMessage.setHeader(name, value).
Depending of the value of options.uniqueHeaders when the client request or the server were created, this will end up in the header being sent multiple times or a single time with values joined using ; .
outgoingMessage.connection
#
Added in: v0.3.0Deprecated since: v15.12.0, v14.17.1
Stability: 0 - Deprecated: Use outgoingMessage.socket instead.
Alias of outgoingMessage.socket.
outgoingMessage.cork()
#
Added in: v13.2.0, v12.16.0
See writable.cork().
outgoingMessage.destroy([error])
#
Added in: v0.3.0
error <Error> Optional, an error to emit with error event
Returns: <this>
Destroys the message. Once a socket is associated with the message and is connected, that socket will be destroyed as well.
outgoingMessage.end(chunk[, encoding][, callback])
#
History

















chunk <string> | <Buffer> | <Uint8Array>
encoding <string> Optional, Default: utf8
callback <Function> Optional
Returns: <this>
Finishes the outgoing message. If any parts of the body are unsent, it will flush them to the underlying system. If the message is chunked, it will send the terminating chunk 0\r\n\r\n, and send the trailers (if any).
If chunk is specified, it is equivalent to calling outgoingMessage.write(chunk, encoding), followed by outgoingMessage.end(callback).
If callback is provided, it will be called when the message is finished (equivalent to a listener of the 'finish' event).
outgoingMessage.flushHeaders()
#
Added in: v1.6.0
Flushes the message headers.
For efficiency reason, Node.js normally buffers the message headers until outgoingMessage.end() is called or the first chunk of message data is written. It then tries to pack the headers and data into a single TCP packet.
It is usually desired (it saves a TCP round-trip), but not when the first data is not sent until possibly much later. outgoingMessage.flushHeaders() bypasses the optimization and kickstarts the message.
outgoingMessage.getHeader(name)
#
Added in: v0.4.0
name <string> Name of header
Returns: <string> | <undefined>
Gets the value of the HTTP header with the given name. If that header is not set, the returned value will be undefined.
outgoingMessage.getHeaderNames()
#
Added in: v7.7.0
Returns: <string[]>
Returns an array containing the unique names of the current outgoing headers. All names are lowercase.
outgoingMessage.getHeaders()
#
Added in: v7.7.0
Returns: <Object>
Returns a shallow copy of the current outgoing headers. Since a shallow copy is used, array values may be mutated without additional calls to various header-related HTTP module methods. The keys of the returned object are the header names and the values are the respective header values. All header names are lowercase.
The object returned by the outgoingMessage.getHeaders() method does not prototypically inherit from the JavaScript Object. This means that typical Object methods such as obj.toString(), obj.hasOwnProperty(), and others are not defined and will not work.
outgoingMessage.setHeader('Foo', 'bar');
outgoingMessage.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = outgoingMessage.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
copy
outgoingMessage.hasHeader(name)
#
Added in: v7.7.0
name <string>
Returns: <boolean>
Returns true if the header identified by name is currently set in the outgoing headers. The header name is case-insensitive.
const hasContentType = outgoingMessage.hasHeader('content-type');
copy
outgoingMessage.headersSent
#
Added in: v0.9.3
<boolean>
Read-only. true if the headers were sent, otherwise false.
outgoingMessage.pipe()
#
Added in: v9.0.0
Overrides the stream.pipe() method inherited from the legacy Stream class which is the parent class of http.OutgoingMessage.
Calling this method will throw an Error because outgoingMessage is a write-only stream.
outgoingMessage.removeHeader(name)
#
Added in: v0.4.0
name <string> Header name
Removes a header that is queued for implicit sending.
outgoingMessage.removeHeader('Content-Encoding');
copy
outgoingMessage.setHeader(name, value)
#
Added in: v0.4.0
name <string> Header name
value <any> Header value
Returns: <this>
Sets a single header value. If the header already exists in the to-be-sent headers, its value will be replaced. Use an array of strings to send multiple headers with the same name.
outgoingMessage.setHeaders(headers)
#
Added in: v19.6.0, v18.15.0
headers <Headers> | <Map>
Returns: <this>
Sets multiple header values for implicit headers. headers must be an instance of Headers or Map, if a header already exists in the to-be-sent headers, its value will be replaced.
const headers = new Headers({ foo: 'bar' });
outgoingMessage.setHeaders(headers);
copy
or
const headers = new Map([['foo', 'bar']]);
outgoingMessage.setHeaders(headers);
copy
When headers have been set with outgoingMessage.setHeaders(), they will be merged with any headers passed to response.writeHead(), with the headers passed to response.writeHead() given precedence.
// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  const headers = new Headers({ 'Content-Type': 'text/html' });
  res.setHeaders(headers);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
copy
outgoingMessage.setTimeout(msecs[, callback])
#
Added in: v0.9.12
msecs <number>
callback <Function> Optional function to be called when a timeout occurs. Same as binding to the timeout event.
Returns: <this>
Once a socket is associated with the message and is connected, socket.setTimeout() will be called with msecs as the first parameter.
outgoingMessage.socket
#
Added in: v0.3.0
<stream.Duplex>
Reference to the underlying socket. Usually, users will not want to access this property.
After calling outgoingMessage.end(), this property will be nulled.
outgoingMessage.uncork()
#
Added in: v13.2.0, v12.16.0
See writable.uncork()
outgoingMessage.writableCorked
#
Added in: v13.2.0, v12.16.0
<number>
The number of times outgoingMessage.cork() has been called.
outgoingMessage.writableEnded
#
Added in: v12.9.0
<boolean>
Is true if outgoingMessage.end() has been called. This property does not indicate whether the data has been flushed. For that purpose, use message.writableFinished instead.
outgoingMessage.writableFinished
#
Added in: v12.7.0
<boolean>
Is true if all data has been flushed to the underlying system.
outgoingMessage.writableHighWaterMark
#
Added in: v12.9.0
<number>
The highWaterMark of the underlying socket if assigned. Otherwise, the default buffer level when writable.write() starts returning false (16384).
outgoingMessage.writableLength
#
Added in: v12.9.0
<number>
The number of buffered bytes.
outgoingMessage.writableObjectMode
#
Added in: v12.9.0
<boolean>
Always false.
outgoingMessage.write(chunk[, encoding][, callback])
#
History

















chunk <string> | <Buffer> | <Uint8Array>
encoding <string> Default: utf8
callback <Function>
Returns: <boolean>
Sends a chunk of the body. This method can be called multiple times.
The encoding argument is only relevant when chunk is a string. Defaults to 'utf8'.
The callback argument is optional and will be called when this chunk of data is flushed.
Returns true if the entire data was flushed successfully to the kernel buffer. Returns false if all or part of the data was queued in the user memory. The 'drain' event will be emitted when the buffer is free again.
http.METHODS
#
Added in: v0.11.8
<string[]>
A list of the HTTP methods that are supported by the parser.
http.STATUS_CODES
#
Added in: v0.1.22
<Object>
A collection of all the standard HTTP response status codes, and the short description of each. For example, http.STATUS_CODES[404] === 'Not Found'.
http.createServer([options][, requestListener])
#
History






































options <Object>
connectionsCheckingInterval: Sets the interval value in milliseconds to check for request and headers timeout in incomplete requests. Default: 30000.
headersTimeout: Sets the timeout value in milliseconds for receiving the complete HTTP headers from the client. See server.headersTimeout for more information. Default: 60000.
highWaterMark <number> Optionally overrides all sockets' readableHighWaterMark and writableHighWaterMark. This affects highWaterMark property of both IncomingMessage and ServerResponse. Default: See stream.getDefaultHighWaterMark().
insecureHTTPParser <boolean> If set to true, it will use a HTTP parser with leniency flags enabled. Using the insecure parser should be avoided. See --insecure-http-parser for more information. Default: false.
IncomingMessage <http.IncomingMessage> Specifies the IncomingMessage class to be used. Useful for extending the original IncomingMessage. Default: IncomingMessage.
joinDuplicateHeaders <boolean> If set to true, this option allows joining the field line values of multiple headers in a request with a comma (, ) instead of discarding the duplicates. For more information, refer to message.headers. Default: false.
keepAlive <boolean> If set to true, it enables keep-alive functionality on the socket immediately after a new incoming connection is received, similarly on what is done in [socket.setKeepAlive([enable][, initialDelay])][socket.setKeepAlive(enable, initialDelay)]. Default: false.
keepAliveInitialDelay <number> If set to a positive number, it sets the initial delay before the first keepalive probe is sent on an idle socket. Default: 0.
keepAliveTimeout: The number of milliseconds of inactivity a server needs to wait for additional incoming data, after it has finished writing the last response, before a socket will be destroyed. See server.keepAliveTimeout for more information. Default: 5000.
maxHeaderSize <number> Optionally overrides the value of --max-http-header-size for requests received by this server, i.e. the maximum length of request headers in bytes. Default: 16384 (16 KiB).
noDelay <boolean> If set to true, it disables the use of Nagle's algorithm immediately after a new incoming connection is received. Default: true.
requestTimeout: Sets the timeout value in milliseconds for receiving the entire request from the client. See server.requestTimeout for more information. Default: 300000.
requireHostHeader <boolean> If set to true, it forces the server to respond with a 400 (Bad Request) status code to any HTTP/1.1 request message that lacks a Host header (as mandated by the specification). Default: true.
ServerResponse <http.ServerResponse> Specifies the ServerResponse class to be used. Useful for extending the original ServerResponse. Default: ServerResponse.
uniqueHeaders <Array> A list of response headers that should be sent only once. If the header's value is an array, the items will be joined using ; .
rejectNonStandardBodyWrites <boolean> If set to true, an error is thrown when writing to an HTTP response which does not have a body. Default: false.
requestListener <Function>
Returns: <http.Server>
Returns a new instance of http.Server.
The requestListener is a function which is automatically added to the 'request' event.
const http = require('node:http');

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
copy
const http = require('node:http');

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
copy
http.get(options[, callback])
#
http.get(url[, options][, callback])
#
History

















url <string> | <URL>
options <Object> Accepts the same options as http.request(), with the method set to GET by default.
callback <Function>
Returns: <http.ClientRequest>
Since most requests are GET requests without bodies, Node.js provides this convenience method. The only difference between this method and http.request() is that it sets the method to GET by default and calls req.end() automatically. The callback must take care to consume the response data for reasons stated in http.ClientRequest section.
The callback is invoked with a single argument that is an instance of http.IncomingMessage.
JSON fetching example:
http.get('http://localhost:8000/', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  // Any 2xx status code signals a successful response but
  // here we're only checking for 200.
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // Consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
copy
http.globalAgent
#
History













<http.Agent>
Global instance of Agent which is used as the default for all HTTP client requests. Diverges from a default Agent configuration by having keepAlive enabled and a timeout of 5 seconds.
http.maxHeaderSize
#
Added in: v11.6.0, v10.15.0
<number>
Read-only property specifying the maximum allowed size of HTTP headers in bytes. Defaults to 16 KiB. Configurable using the --max-http-header-size CLI option.
This can be overridden for servers and client requests by passing the maxHeaderSize option.
http.request(options[, callback])
#
http.request(url[, options][, callback])
#
History

































url <string> | <URL>
options <Object>
agent <http.Agent> | <boolean> Controls Agent behavior. Possible values:
undefined (default): use http.globalAgent for this host and port.
Agent object: explicitly use the passed in Agent.
false: causes a new Agent with default values to be used.
auth <string> Basic authentication ('user:password') to compute an Authorization header.
createConnection <Function> A function that produces a socket/stream to use for the request when the agent option is not used. This can be used to avoid creating a custom Agent class just to override the default createConnection function. See agent.createConnection() for more details. Any Duplex stream is a valid return value.
defaultPort <number> Default port for the protocol. Default: agent.defaultPort if an Agent is used, else undefined.
family <number> IP address family to use when resolving host or hostname. Valid values are 4 or 6. When unspecified, both IP v4 and v6 will be used.
headers <Object> | <Array> An object or an array of strings containing request headers. The array is in the same format as message.rawHeaders.
hints <number> Optional dns.lookup() hints.
host <string> A domain name or IP address of the server to issue the request to. Default: 'localhost'.
hostname <string> Alias for host. To support url.parse(), hostname will be used if both host and hostname are specified.
insecureHTTPParser <boolean> If set to true, it will use a HTTP parser with leniency flags enabled. Using the insecure parser should be avoided. See --insecure-http-parser for more information. Default: false
joinDuplicateHeaders <boolean> It joins the field line values of multiple headers in a request with , instead of discarding the duplicates. See message.headers for more information. Default: false.
localAddress <string> Local interface to bind for network connections.
localPort <number> Local port to connect from.
lookup <Function> Custom lookup function. Default: dns.lookup().
maxHeaderSize <number> Optionally overrides the value of --max-http-header-size (the maximum length of response headers in bytes) for responses received from the server. Default: 16384 (16 KiB).
method <string> A string specifying the HTTP request method. Default: 'GET'.
path <string> Request path. Should include query string if any. E.G. '/index.html?page=12'. An exception is thrown when the request path contains illegal characters. Currently, only spaces are rejected but that may change in the future. Default: '/'.
port <number> Port of remote server. Default: defaultPort if set, else 80.
protocol <string> Protocol to use. Default: 'http:'.
setDefaultHeaders <boolean>: Specifies whether or not to automatically add default headers such as Connection, Content-Length, Transfer-Encoding, and Host. If set to false then all necessary headers must be added manually. Defaults to true.
setHost <boolean>: Specifies whether or not to automatically add the Host header. If provided, this overrides setDefaultHeaders. Defaults to true.
signal <AbortSignal>: An AbortSignal that may be used to abort an ongoing request.
socketPath <string> Unix domain socket. Cannot be used if one of host or port is specified, as those specify a TCP Socket.
timeout <number>: A number specifying the socket timeout in milliseconds. This will set the timeout before the socket is connected.
uniqueHeaders <Array> A list of request headers that should be sent only once. If the header's value is an array, the items will be joined using ; .
callback <Function>
Returns: <http.ClientRequest>
options in socket.connect() are also supported.
Node.js maintains several connections per server to make HTTP requests. This function allows one to transparently issue requests.
url can be a string or a URL object. If url is a string, it is automatically parsed with new URL(). If it is a URL object, it will be automatically converted to an ordinary options object.
If both url and options are specified, the objects are merged, with the options properties taking precedence.
The optional callback parameter will be added as a one-time listener for the 'response' event.
http.request() returns an instance of the http.ClientRequest class. The ClientRequest instance is a writable stream. If one needs to upload a file with a POST request, then write to the ClientRequest object.
const http = require('node:http');

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
copy
In the example req.end() was called. With http.request() one must always call req.end() to signify the end of the request - even if there is no data being written to the request body.
If any error is encountered during the request (be that with DNS resolution, TCP level errors, or actual HTTP parse errors) an 'error' event is emitted on the returned request object. As with all 'error' events, if no listeners are registered the error will be thrown.
There are a few special headers that should be noted.
Sending a 'Connection: keep-alive' will notify Node.js that the connection to the server should be persisted until the next request.
Sending a 'Content-Length' header will disable the default chunked encoding.
Sending an 'Expect' header will immediately send the request headers. Usually, when sending 'Expect: 100-continue', both a timeout and a listener for the 'continue' event should be set. See RFC 2616 Section 8.2.3 for more information.
Sending an Authorization header will override using the auth option to compute basic authentication.
Example using a URL as options:
const options = new URL('http://abc:xyz@example.com');

const req = http.request(options, (res) => {
  // ...
});
copy
In a successful request, the following events will be emitted in the following order:
'socket'
'response'
'data' any number of times, on the res object ('data' will not be emitted at all if the response body is empty, for instance, in most redirects)
'end' on the res object
'close'
In the case of a connection error, the following events will be emitted:
'socket'
'error'
'close'
In the case of a premature connection close before the response is received, the following events will be emitted in the following order:
'socket'
'error' with an error with message 'Error: socket hang up' and code 'ECONNRESET'
'close'
In the case of a premature connection close after the response is received, the following events will be emitted in the following order:
'socket'
'response'
'data' any number of times, on the res object
(connection closed here)
'aborted' on the res object
'close'
'error' on the res object with an error with message 'Error: aborted' and code 'ECONNRESET'
'close' on the res object
If req.destroy() is called before a socket is assigned, the following events will be emitted in the following order:
(req.destroy() called here)
'error' with an error with message 'Error: socket hang up' and code 'ECONNRESET', or the error with which req.destroy() was called
'close'
If req.destroy() is called before the connection succeeds, the following events will be emitted in the following order:
'socket'
(req.destroy() called here)
'error' with an error with message 'Error: socket hang up' and code 'ECONNRESET', or the error with which req.destroy() was called
'close'
If req.destroy() is called after the response is received, the following events will be emitted in the following order:
'socket'
'response'
'data' any number of times, on the res object
(req.destroy() called here)
'aborted' on the res object
'close'
'error' on the res object with an error with message 'Error: aborted' and code 'ECONNRESET', or the error with which req.destroy() was called
'close' on the res object
If req.abort() is called before a socket is assigned, the following events will be emitted in the following order:
(req.abort() called here)
'abort'
'close'
If req.abort() is called before the connection succeeds, the following events will be emitted in the following order:
'socket'
(req.abort() called here)
'abort'
'error' with an error with message 'Error: socket hang up' and code 'ECONNRESET'
'close'
If req.abort() is called after the response is received, the following events will be emitted in the following order:
'socket'
'response'
'data' any number of times, on the res object
(req.abort() called here)
'abort'
'aborted' on the res object
'error' on the res object with an error with message 'Error: aborted' and code 'ECONNRESET'.
'close'
'close' on the res object
Setting the timeout option or using the setTimeout() function will not abort the request or do anything besides add a 'timeout' event.
Passing an AbortSignal and then calling abort() on the corresponding AbortController will behave the same way as calling .destroy() on the request. Specifically, the 'error' event will be emitted with an error with the message 'AbortError: The operation was aborted', the code 'ABORT_ERR' and the cause, if one was provided.
http.validateHeaderName(name[, label])
#
History













name <string>
label <string> Label for error message. Default: 'Header name'.
Performs the low-level validations on the provided name that are done when res.setHeader(name, value) is called.
Passing illegal value as name will result in a TypeError being thrown, identified by code: 'ERR_INVALID_HTTP_TOKEN'.
It is not necessary to use this method before passing headers to an HTTP request or response. The HTTP module will automatically validate such headers.
Example:
const { validateHeaderName } = require('node:http');

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
copy
http.validateHeaderValue(name, value)
#
Added in: v14.3.0
name <string>
value <any>
Performs the low-level validations on the provided value that are done when res.setHeader(name, value) is called.
Passing illegal value as value will result in a TypeError being thrown.
Undefined value error is identified by code: 'ERR_HTTP_INVALID_HEADER_VALUE'.
Invalid value character error is identified by code: 'ERR_INVALID_CHAR'.
It is not necessary to use this method before passing headers to an HTTP request or response. The HTTP module will automatically validate such headers.
Examples:
const { validateHeaderValue } = require('node:http');

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
copy
http.setMaxIdleHTTPParsers(max)
#
Added in: v18.8.0, v16.18.0
max <number> Default: 1000.
Set the maximum number of idle HTTP parsers.
Class: WebSocket
#
Added in: v22.5.0
A browser-compatible implementation of <WebSocket>.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
HTTP/2
Determining if crypto support is unavailable
Core API
Server-side example
Client-side example
Class: Http2Session
Http2Session and sockets
Event: 'close'
Event: 'connect'
Event: 'error'
Event: 'frameError'
Event: 'goaway'
Event: 'localSettings'
Event: 'ping'
Event: 'remoteSettings'
Event: 'stream'
Event: 'timeout'
http2session.alpnProtocol
http2session.close([callback])
http2session.closed
http2session.connecting
http2session.destroy([error][, code])
http2session.destroyed
http2session.encrypted
http2session.goaway([code[, lastStreamID[, opaqueData]]])
http2session.localSettings
http2session.originSet
http2session.pendingSettingsAck
http2session.ping([payload, ]callback)
http2session.ref()
http2session.remoteSettings
http2session.setLocalWindowSize(windowSize)
http2session.setTimeout(msecs, callback)
http2session.socket
http2session.state
http2session.settings([settings][, callback])
http2session.type
http2session.unref()
Class: ServerHttp2Session
serverhttp2session.altsvc(alt, originOrStream)
Specifying alternative services
serverhttp2session.origin(...origins)
Class: ClientHttp2Session
Event: 'altsvc'
Event: 'origin'
clienthttp2session.request(headers[, options])
Class: Http2Stream
Http2Stream Lifecycle
Creation
Destruction
Event: 'aborted'
Event: 'close'
Event: 'error'
Event: 'frameError'
Event: 'ready'
Event: 'timeout'
Event: 'trailers'
Event: 'wantTrailers'
http2stream.aborted
http2stream.bufferSize
http2stream.close(code[, callback])
http2stream.closed
http2stream.destroyed
http2stream.endAfterHeaders
http2stream.id
http2stream.pending
http2stream.priority(options)
http2stream.rstCode
http2stream.sentHeaders
http2stream.sentInfoHeaders
http2stream.sentTrailers
http2stream.session
http2stream.setTimeout(msecs, callback)
http2stream.state
http2stream.sendTrailers(headers)
Class: ClientHttp2Stream
Event: 'continue'
Event: 'headers'
Event: 'push'
Event: 'response'
Class: ServerHttp2Stream
http2stream.additionalHeaders(headers)
http2stream.headersSent
http2stream.pushAllowed
http2stream.pushStream(headers[, options], callback)
http2stream.respond([headers[, options]])
http2stream.respondWithFD(fd[, headers[, options]])
http2stream.respondWithFile(path[, headers[, options]])
Class: Http2Server
Event: 'checkContinue'
Event: 'connection'
Event: 'request'
Event: 'session'
Event: 'sessionError'
Event: 'stream'
Event: 'timeout'
server.close([callback])
server[Symbol.asyncDispose]()
server.setTimeout([msecs][, callback])
server.timeout
server.updateSettings([settings])
Class: Http2SecureServer
Event: 'checkContinue'
Event: 'connection'
Event: 'request'
Event: 'session'
Event: 'sessionError'
Event: 'stream'
Event: 'timeout'
Event: 'unknownProtocol'
server.close([callback])
server.setTimeout([msecs][, callback])
server.timeout
server.updateSettings([settings])
http2.createServer([options][, onRequestHandler])
http2.createSecureServer(options[, onRequestHandler])
http2.connect(authority[, options][, listener])
http2.constants
Error codes for RST_STREAM and GOAWAY
http2.getDefaultSettings()
http2.getPackedSettings([settings])
http2.getUnpackedSettings(buf)
http2.performServerHandshake(socket[, options])
http2.sensitiveHeaders
Headers object
Sensitive headers
Settings object
Error handling
Invalid character handling in header names and values
Push streams on the client
Supporting the CONNECT method
The extended CONNECT protocol
Compatibility API
ALPN negotiation
Class: http2.Http2ServerRequest
Event: 'aborted'
Event: 'close'
request.aborted
request.authority
request.complete
request.connection
request.destroy([error])
request.headers
request.httpVersion
request.method
request.rawHeaders
request.rawTrailers
request.scheme
request.setTimeout(msecs, callback)
request.socket
request.stream
request.trailers
request.url
Class: http2.Http2ServerResponse
Event: 'close'
Event: 'finish'
response.addTrailers(headers)
response.appendHeader(name, value)
response.connection
response.createPushResponse(headers, callback)
response.end([data[, encoding]][, callback])
response.finished
response.getHeader(name)
response.getHeaderNames()
response.getHeaders()
response.hasHeader(name)
response.headersSent
response.removeHeader(name)
response.req
response.sendDate
response.setHeader(name, value)
response.setTimeout(msecs[, callback])
response.socket
response.statusCode
response.statusMessage
response.stream
response.writableEnded
response.write(chunk[, encoding][, callback])
response.writeContinue()
response.writeEarlyHints(hints)
response.writeHead(statusCode[, statusMessage][, headers])
Collecting HTTP/2 performance metrics
Note on :authority and host
HTTP/2
#
History





















Stability: 2 - Stable
Source Code: lib/http2.js
The node:http2 module provides an implementation of the HTTP/2 protocol. It can be accessed using:
const http2 = require('node:http2');
copy
Determining if crypto support is unavailable
#
It is possible for Node.js to be built without including support for the node:crypto module. In such cases, attempting to import from node:http2 or calling require('node:http2') will result in an error being thrown.
When using CommonJS, the error thrown can be caught using try/catch:
let http2;
try {
  http2 = require('node:http2');
} catch (err) {
  console.error('http2 support is disabled!');
}
copy
When using the lexical ESM import keyword, the error can only be caught if a handler for process.on('uncaughtException') is registered before any attempt to load the module is made (using, for instance, a preload module).
When using ESM, if there is a chance that the code may be run on a build of Node.js where crypto support is not enabled, consider using the import() function instead of the lexical import keyword:
let http2;
try {
  http2 = await import('node:http2');
} catch (err) {
  console.error('http2 support is disabled!');
}
copy
Core API
#
The Core API provides a low-level interface designed specifically around support for HTTP/2 protocol features. It is specifically not designed for compatibility with the existing HTTP/1 module API. However, the Compatibility API is.
The http2 Core API is much more symmetric between client and server than the http API. For instance, most events, like 'error', 'connect' and 'stream', can be emitted either by client-side code or server-side code.
Server-side example
#
The following illustrates a simple HTTP/2 server using the Core API. Since there are no browsers known that support unencrypted HTTP/2, the use of http2.createSecureServer() is necessary when communicating with browser clients.
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
copy
To generate the certificate and key for this example, run:
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
copy
Client-side example
#
The following illustrates an HTTP/2 client:
const http2 = require('node:http2');
const fs = require('node:fs');

const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
copy
Class: Http2Session
#
Added in: v8.4.0
Extends: <EventEmitter>
Instances of the http2.Http2Session class represent an active communications session between an HTTP/2 client and server. Instances of this class are not intended to be constructed directly by user code.
Each Http2Session instance will exhibit slightly different behaviors depending on whether it is operating as a server or a client. The http2session.type property can be used to determine the mode in which an Http2Session is operating. On the server side, user code should rarely have occasion to work with the Http2Session object directly, with most actions typically taken through interactions with either the Http2Server or Http2Stream objects.
User code will not create Http2Session instances directly. Server-side Http2Session instances are created by the Http2Server instance when a new HTTP/2 connection is received. Client-side Http2Session instances are created using the http2.connect() method.
Http2Session and sockets
#
Every Http2Session instance is associated with exactly one net.Socket or tls.TLSSocket when it is created. When either the Socket or the Http2Session are destroyed, both will be destroyed.
Because of the specific serialization and processing requirements imposed by the HTTP/2 protocol, it is not recommended for user code to read data from or write data to a Socket instance bound to a Http2Session. Doing so can put the HTTP/2 session into an indeterminate state causing the session and the socket to become unusable.
Once a Socket has been bound to an Http2Session, user code should rely solely on the API of the Http2Session.
Event: 'close'
#
Added in: v8.4.0
The 'close' event is emitted once the Http2Session has been destroyed. Its listener does not expect any arguments.
Event: 'connect'
#
Added in: v8.4.0
session <Http2Session>
socket <net.Socket>
The 'connect' event is emitted once the Http2Session has been successfully connected to the remote peer and communication may begin.
User code will typically not listen for this event directly.
Event: 'error'
#
Added in: v8.4.0
error <Error>
The 'error' event is emitted when an error occurs during the processing of an Http2Session.
Event: 'frameError'
#
Added in: v8.4.0
type <integer> The frame type.
code <integer> The error code.
id <integer> The stream id (or 0 if the frame isn't associated with a stream).
The 'frameError' event is emitted when an error occurs while attempting to send a frame on the session. If the frame that could not be sent is associated with a specific Http2Stream, an attempt to emit a 'frameError' event on the Http2Stream is made.
If the 'frameError' event is associated with a stream, the stream will be closed and destroyed immediately following the 'frameError' event. If the event is not associated with a stream, the Http2Session will be shut down immediately following the 'frameError' event.
Event: 'goaway'
#
Added in: v8.4.0
errorCode <number> The HTTP/2 error code specified in the GOAWAY frame.
lastStreamID <number> The ID of the last stream the remote peer successfully processed (or 0 if no ID is specified).
opaqueData <Buffer> If additional opaque data was included in the GOAWAY frame, a Buffer instance will be passed containing that data.
The 'goaway' event is emitted when a GOAWAY frame is received.
The Http2Session instance will be shut down automatically when the 'goaway' event is emitted.
Event: 'localSettings'
#
Added in: v8.4.0
settings <HTTP/2 Settings Object> A copy of the SETTINGS frame received.
The 'localSettings' event is emitted when an acknowledgment SETTINGS frame has been received.
When using http2session.settings() to submit new settings, the modified settings do not take effect until the 'localSettings' event is emitted.
session.settings({ enablePush: false });

session.on('localSettings', (settings) => {
  /* Use the new settings */
});
copy
Event: 'ping'
#
Added in: v10.12.0
payload <Buffer> The PING frame 8-byte payload
The 'ping' event is emitted whenever a PING frame is received from the connected peer.
Event: 'remoteSettings'
#
Added in: v8.4.0
settings <HTTP/2 Settings Object> A copy of the SETTINGS frame received.
The 'remoteSettings' event is emitted when a new SETTINGS frame is received from the connected peer.
session.on('remoteSettings', (settings) => {
  /* Use the new settings */
});
copy
Event: 'stream'
#
Added in: v8.4.0
stream <Http2Stream> A reference to the stream
headers <HTTP/2 Headers Object> An object describing the headers
flags <number> The associated numeric flags
rawHeaders <Array> An array containing the raw header names followed by their respective values.
The 'stream' event is emitted when a new Http2Stream is created.
session.on('stream', (stream, headers, flags) => {
  const method = headers[':method'];
  const path = headers[':path'];
  // ...
  stream.respond({
    ':status': 200,
    'content-type': 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
copy
On the server side, user code will typically not listen for this event directly, and would instead register a handler for the 'stream' event emitted by the net.Server or tls.Server instances returned by http2.createServer() and http2.createSecureServer(), respectively, as in the example below:
const http2 = require('node:http2');

// Create an unencrypted HTTP/2 server
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
copy
Even though HTTP/2 streams and network sockets are not in a 1:1 correspondence, a network error will destroy each individual stream and must be handled on the stream level, as shown above.
Event: 'timeout'
#
Added in: v8.4.0
After the http2session.setTimeout() method is used to set the timeout period for this Http2Session, the 'timeout' event is emitted if there is no activity on the Http2Session after the configured number of milliseconds. Its listener does not expect any arguments.
session.setTimeout(2000);
session.on('timeout', () => { /* .. */ });
copy
http2session.alpnProtocol
#
Added in: v9.4.0
<string> | <undefined>
Value will be undefined if the Http2Session is not yet connected to a socket, h2c if the Http2Session is not connected to a TLSSocket, or will return the value of the connected TLSSocket's own alpnProtocol property.
http2session.close([callback])
#
Added in: v9.4.0
callback <Function>
Gracefully closes the Http2Session, allowing any existing streams to complete on their own and preventing new Http2Stream instances from being created. Once closed, http2session.destroy() might be called if there are no open Http2Stream instances.
If specified, the callback function is registered as a handler for the 'close' event.
http2session.closed
#
Added in: v9.4.0
<boolean>
Will be true if this Http2Session instance has been closed, otherwise false.
http2session.connecting
#
Added in: v10.0.0
<boolean>
Will be true if this Http2Session instance is still connecting, will be set to false before emitting connect event and/or calling the http2.connect callback.
http2session.destroy([error][, code])
#
Added in: v8.4.0
error <Error> An Error object if the Http2Session is being destroyed due to an error.
code <number> The HTTP/2 error code to send in the final GOAWAY frame. If unspecified, and error is not undefined, the default is INTERNAL_ERROR, otherwise defaults to NO_ERROR.
Immediately terminates the Http2Session and the associated net.Socket or tls.TLSSocket.
Once destroyed, the Http2Session will emit the 'close' event. If error is not undefined, an 'error' event will be emitted immediately before the 'close' event.
If there are any remaining open Http2Streams associated with the Http2Session, those will also be destroyed.
http2session.destroyed
#
Added in: v8.4.0
<boolean>
Will be true if this Http2Session instance has been destroyed and must no longer be used, otherwise false.
http2session.encrypted
#
Added in: v9.4.0
<boolean> | <undefined>
Value is undefined if the Http2Session session socket has not yet been connected, true if the Http2Session is connected with a TLSSocket, and false if the Http2Session is connected to any other kind of socket or stream.
http2session.goaway([code[, lastStreamID[, opaqueData]]])
#
Added in: v9.4.0
code <number> An HTTP/2 error code
lastStreamID <number> The numeric ID of the last processed Http2Stream
opaqueData <Buffer> | <TypedArray> | <DataView> A TypedArray or DataView instance containing additional data to be carried within the GOAWAY frame.
Transmits a GOAWAY frame to the connected peer without shutting down the Http2Session.
http2session.localSettings
#
Added in: v8.4.0
<HTTP/2 Settings Object>
A prototype-less object describing the current local settings of this Http2Session. The local settings are local to this Http2Session instance.
http2session.originSet
#
Added in: v9.4.0
<string[]> | <undefined>
If the Http2Session is connected to a TLSSocket, the originSet property will return an Array of origins for which the Http2Session may be considered authoritative.
The originSet property is only available when using a secure TLS connection.
http2session.pendingSettingsAck
#
Added in: v8.4.0
<boolean>
Indicates whether the Http2Session is currently waiting for acknowledgment of a sent SETTINGS frame. Will be true after calling the http2session.settings() method. Will be false once all sent SETTINGS frames have been acknowledged.
http2session.ping([payload, ]callback)
#
History













payload <Buffer> | <TypedArray> | <DataView> Optional ping payload.
callback <Function>
Returns: <boolean>
Sends a PING frame to the connected HTTP/2 peer. A callback function must be provided. The method will return true if the PING was sent, false otherwise.
The maximum number of outstanding (unacknowledged) pings is determined by the maxOutstandingPings configuration option. The default maximum is 10.
If provided, the payload must be a Buffer, TypedArray, or DataView containing 8 bytes of data that will be transmitted with the PING and returned with the ping acknowledgment.
The callback will be invoked with three arguments: an error argument that will be null if the PING was successfully acknowledged, a duration argument that reports the number of milliseconds elapsed since the ping was sent and the acknowledgment was received, and a Buffer containing the 8-byte PING payload.
session.ping(Buffer.from('abcdefgh'), (err, duration, payload) => {
  if (!err) {
    console.log(`Ping acknowledged in ${duration} milliseconds`);
    console.log(`With payload '${payload.toString()}'`);
  }
});
copy
If the payload argument is not specified, the default payload will be the 64-bit timestamp (little endian) marking the start of the PING duration.
http2session.ref()
#
Added in: v9.4.0
Calls ref() on this Http2Session instance's underlying net.Socket.
http2session.remoteSettings
#
Added in: v8.4.0
<HTTP/2 Settings Object>
A prototype-less object describing the current remote settings of this Http2Session. The remote settings are set by the connected HTTP/2 peer.
http2session.setLocalWindowSize(windowSize)
#
Added in: v15.3.0, v14.18.0
windowSize <number>
Sets the local endpoint's window size. The windowSize is the total window size to set, not the delta.
const http2 = require('node:http2');

const server = http2.createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
copy
For http2 clients the proper event is either 'connect' or 'remoteSettings'.
http2session.setTimeout(msecs, callback)
#
History













msecs <number>
callback <Function>
Used to set a callback function that is called when there is no activity on the Http2Session after msecs milliseconds. The given callback is registered as a listener on the 'timeout' event.
http2session.socket
#
Added in: v8.4.0
<net.Socket> | <tls.TLSSocket>
Returns a Proxy object that acts as a net.Socket (or tls.TLSSocket) but limits available methods to ones safe to use with HTTP/2.
destroy, emit, end, pause, read, resume, and write will throw an error with code ERR_HTTP2_NO_SOCKET_MANIPULATION. See Http2Session and Sockets for more information.
setTimeout method will be called on this Http2Session.
All other interactions will be routed directly to the socket.
http2session.state
#
Added in: v8.4.0
Provides miscellaneous information about the current state of the Http2Session.
<Object>
effectiveLocalWindowSize <number> The current local (receive) flow control window size for the Http2Session.
effectiveRecvDataLength <number> The current number of bytes that have been received since the last flow control WINDOW_UPDATE.
nextStreamID <number> The numeric identifier to be used the next time a new Http2Stream is created by this Http2Session.
localWindowSize <number> The number of bytes that the remote peer can send without receiving a WINDOW_UPDATE.
lastProcStreamID <number> The numeric id of the Http2Stream for which a HEADERS or DATA frame was most recently received.
remoteWindowSize <number> The number of bytes that this Http2Session may send without receiving a WINDOW_UPDATE.
outboundQueueSize <number> The number of frames currently within the outbound queue for this Http2Session.
deflateDynamicTableSize <number> The current size in bytes of the outbound header compression state table.
inflateDynamicTableSize <number> The current size in bytes of the inbound header compression state table.
An object describing the current status of this Http2Session.
http2session.settings([settings][, callback])
#
History













settings <HTTP/2 Settings Object>
callback <Function> Callback that is called once the session is connected or right away if the session is already connected.
err <Error> | <null>
settings <HTTP/2 Settings Object> The updated settings object.
duration <integer>
Updates the current local settings for this Http2Session and sends a new SETTINGS frame to the connected HTTP/2 peer.
Once called, the http2session.pendingSettingsAck property will be true while the session is waiting for the remote peer to acknowledge the new settings.
The new settings will not become effective until the SETTINGS acknowledgment is received and the 'localSettings' event is emitted. It is possible to send multiple SETTINGS frames while acknowledgment is still pending.
http2session.type
#
Added in: v8.4.0
<number>
The http2session.type will be equal to http2.constants.NGHTTP2_SESSION_SERVER if this Http2Session instance is a server, and http2.constants.NGHTTP2_SESSION_CLIENT if the instance is a client.
http2session.unref()
#
Added in: v9.4.0
Calls unref() on this Http2Session instance's underlying net.Socket.
Class: ServerHttp2Session
#
Added in: v8.4.0
Extends: <Http2Session>
serverhttp2session.altsvc(alt, originOrStream)
#
Added in: v9.4.0
alt <string> A description of the alternative service configuration as defined by RFC 7838.
originOrStream <number> | <string> | <URL> | <Object> Either a URL string specifying the origin (or an Object with an origin property) or the numeric identifier of an active Http2Stream as given by the http2stream.id property.
Submits an ALTSVC frame (as defined by RFC 7838) to the connected client.
const http2 = require('node:http2');

const server = http2.createServer();
server.on('session', (session) => {
  // Set altsvc for origin https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Set altsvc for a specific stream
  stream.session.altsvc('h2=":8000"', stream.id);
});
copy
Sending an ALTSVC frame with a specific stream ID indicates that the alternate service is associated with the origin of the given Http2Stream.
The alt and origin string must contain only ASCII bytes and are strictly interpreted as a sequence of ASCII bytes. The special value 'clear' may be passed to clear any previously set alternative service for a given domain.
When a string is passed for the originOrStream argument, it will be parsed as a URL and the origin will be derived. For instance, the origin for the HTTP URL 'https://example.org/foo/bar' is the ASCII string 'https://example.org'. An error will be thrown if either the given string cannot be parsed as a URL or if a valid origin cannot be derived.
A URL object, or any object with an origin property, may be passed as originOrStream, in which case the value of the origin property will be used. The value of the origin property must be a properly serialized ASCII origin.
Specifying alternative services
#
The format of the alt parameter is strictly defined by RFC 7838 as an ASCII string containing a comma-delimited list of "alternative" protocols associated with a specific host and port.
For example, the value 'h2="example.org:81"' indicates that the HTTP/2 protocol is available on the host 'example.org' on TCP/IP port 81. The host and port must be contained within the quote (") characters.
Multiple alternatives may be specified, for instance: 'h2="example.org:81", h2=":82"'.
The protocol identifier ('h2' in the examples) may be any valid ALPN Protocol ID.
The syntax of these values is not validated by the Node.js implementation and are passed through as provided by the user or received from the peer.
serverhttp2session.origin(...origins)
#
Added in: v10.12.0
origins <string> | <URL> | <Object> One or more URL Strings passed as separate arguments.
Submits an ORIGIN frame (as defined by RFC 8336) to the connected client to advertise the set of origins for which the server is capable of providing authoritative responses.
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
copy
When a string is passed as an origin, it will be parsed as a URL and the origin will be derived. For instance, the origin for the HTTP URL 'https://example.org/foo/bar' is the ASCII string 'https://example.org'. An error will be thrown if either the given string cannot be parsed as a URL or if a valid origin cannot be derived.
A URL object, or any object with an origin property, may be passed as an origin, in which case the value of the origin property will be used. The value of the origin property must be a properly serialized ASCII origin.
Alternatively, the origins option may be used when creating a new HTTP/2 server using the http2.createSecureServer() method:
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
copy
Class: ClientHttp2Session
#
Added in: v8.4.0
Extends: <Http2Session>
Event: 'altsvc'
#
Added in: v9.4.0
alt <string>
origin <string>
streamId <number>
The 'altsvc' event is emitted whenever an ALTSVC frame is received by the client. The event is emitted with the ALTSVC value, origin, and stream ID. If no origin is provided in the ALTSVC frame, origin will be an empty string.
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
copy
Event: 'origin'
#
Added in: v10.12.0
origins <string[]>
The 'origin' event is emitted whenever an ORIGIN frame is received by the client. The event is emitted with an array of origin strings. The http2session.originSet will be updated to include the received origins.
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
copy
The 'origin' event is only emitted when using a secure TLS connection.
clienthttp2session.request(headers[, options])
#
History


















headers <HTTP/2 Headers Object> | <Array>
options <Object>
endStream <boolean> true if the Http2Stream writable side should be closed initially, such as when sending a GET request that should not expect a payload body.
exclusive <boolean> When true and parent identifies a parent Stream, the created stream is made the sole direct dependency of the parent, with all other existing dependents made a dependent of the newly created stream. Default: false.
parent <number> Specifies the numeric identifier of a stream the newly created stream is dependent on.
waitForTrailers <boolean> When true, the Http2Stream will emit the 'wantTrailers' event after the final DATA frame has been sent.
signal <AbortSignal> An AbortSignal that may be used to abort an ongoing request.
Returns: <ClientHttp2Stream>
For HTTP/2 Client Http2Session instances only, the http2session.request() creates and returns an Http2Stream instance that can be used to send an HTTP/2 request to the connected server.
When a ClientHttp2Session is first created, the socket may not yet be connected. if clienthttp2session.request() is called during this time, the actual request will be deferred until the socket is ready to go. If the session is closed before the actual request be executed, an ERR_HTTP2_GOAWAY_SESSION is thrown.
This method is only available if http2session.type is equal to http2.constants.NGHTTP2_SESSION_CLIENT.
const http2 = require('node:http2');
const clientSession = http2.connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = http2.constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
copy
When the options.waitForTrailers option is set, the 'wantTrailers' event is emitted immediately after queuing the last chunk of payload data to be sent. The http2stream.sendTrailers() method can then be called to send trailing headers to the peer.
When options.waitForTrailers is set, the Http2Stream will not automatically close when the final DATA frame is transmitted. User code must call either http2stream.sendTrailers() or http2stream.close() to close the Http2Stream.
When options.signal is set with an AbortSignal and then abort on the corresponding AbortController is called, the request will emit an 'error' event with an AbortError error.
The :method and :path pseudo-headers are not specified within headers, they respectively default to:
:method = 'GET'
:path = /
Class: Http2Stream
#
Added in: v8.4.0
Extends: <stream.Duplex>
Each instance of the Http2Stream class represents a bidirectional HTTP/2 communications stream over an Http2Session instance. Any single Http2Session may have up to 231-1 Http2Stream instances over its lifetime.
User code will not construct Http2Stream instances directly. Rather, these are created, managed, and provided to user code through the Http2Session instance. On the server, Http2Stream instances are created either in response to an incoming HTTP request (and handed off to user code via the 'stream' event), or in response to a call to the http2stream.pushStream() method. On the client, Http2Stream instances are created and returned when either the http2session.request() method is called, or in response to an incoming 'push' event.
The Http2Stream class is a base for the ServerHttp2Stream and ClientHttp2Stream classes, each of which is used specifically by either the Server or Client side, respectively.
All Http2Stream instances are Duplex streams. The Writable side of the Duplex is used to send data to the connected peer, while the Readable side is used to receive data sent by the connected peer.
The default text character encoding for an Http2Stream is UTF-8. When using an Http2Stream to send text, use the 'content-type' header to set the character encoding.
stream.respond({
  'content-type': 'text/html; charset=utf-8',
  ':status': 200,
});
copy
Http2Stream Lifecycle
#
Creation
#
On the server side, instances of ServerHttp2Stream are created either when:
A new HTTP/2 HEADERS frame with a previously unused stream ID is received;
The http2stream.pushStream() method is called.
On the client side, instances of ClientHttp2Stream are created when the http2session.request() method is called.
On the client, the Http2Stream instance returned by http2session.request() may not be immediately ready for use if the parent Http2Session has not yet been fully established. In such cases, operations called on the Http2Stream will be buffered until the 'ready' event is emitted. User code should rarely, if ever, need to handle the 'ready' event directly. The ready status of an Http2Stream can be determined by checking the value of http2stream.id. If the value is undefined, the stream is not yet ready for use.
Destruction
#
All Http2Stream instances are destroyed either when:
An RST_STREAM frame for the stream is received by the connected peer, and (for client streams only) pending data has been read.
The http2stream.close() method is called, and (for client streams only) pending data has been read.
The http2stream.destroy() or http2session.destroy() methods are called.
When an Http2Stream instance is destroyed, an attempt will be made to send an RST_STREAM frame to the connected peer.
When the Http2Stream instance is destroyed, the 'close' event will be emitted. Because Http2Stream is an instance of stream.Duplex, the 'end' event will also be emitted if the stream data is currently flowing. The 'error' event may also be emitted if http2stream.destroy() was called with an Error passed as the first argument.
After the Http2Stream has been destroyed, the http2stream.destroyed property will be true and the http2stream.rstCode property will specify the RST_STREAM error code. The Http2Stream instance is no longer usable once destroyed.
Event: 'aborted'
#
Added in: v8.4.0
The 'aborted' event is emitted whenever a Http2Stream instance is abnormally aborted in mid-communication. Its listener does not expect any arguments.
The 'aborted' event will only be emitted if the Http2Stream writable side has not been ended.
Event: 'close'
#
Added in: v8.4.0
The 'close' event is emitted when the Http2Stream is destroyed. Once this event is emitted, the Http2Stream instance is no longer usable.
The HTTP/2 error code used when closing the stream can be retrieved using the http2stream.rstCode property. If the code is any value other than NGHTTP2_NO_ERROR (0), an 'error' event will have also been emitted.
Event: 'error'
#
Added in: v8.4.0
error <Error>
The 'error' event is emitted when an error occurs during the processing of an Http2Stream.
Event: 'frameError'
#
Added in: v8.4.0
type <integer> The frame type.
code <integer> The error code.
id <integer> The stream id (or 0 if the frame isn't associated with a stream).
The 'frameError' event is emitted when an error occurs while attempting to send a frame. When invoked, the handler function will receive an integer argument identifying the frame type, and an integer argument identifying the error code. The Http2Stream instance will be destroyed immediately after the 'frameError' event is emitted.
Event: 'ready'
#
Added in: v8.4.0
The 'ready' event is emitted when the Http2Stream has been opened, has been assigned an id, and can be used. The listener does not expect any arguments.
Event: 'timeout'
#
Added in: v8.4.0
The 'timeout' event is emitted after no activity is received for this Http2Stream within the number of milliseconds set using http2stream.setTimeout(). Its listener does not expect any arguments.
Event: 'trailers'
#
Added in: v8.4.0
headers <HTTP/2 Headers Object> An object describing the headers
flags <number> The associated numeric flags
The 'trailers' event is emitted when a block of headers associated with trailing header fields is received. The listener callback is passed the HTTP/2 Headers Object and flags associated with the headers.
This event might not be emitted if http2stream.end() is called before trailers are received and the incoming data is not being read or listened for.
stream.on('trailers', (headers, flags) => {
  console.log(headers);
});
copy
Event: 'wantTrailers'
#
Added in: v10.0.0
The 'wantTrailers' event is emitted when the Http2Stream has queued the final DATA frame to be sent on a frame and the Http2Stream is ready to send trailing headers. When initiating a request or response, the waitForTrailers option must be set for this event to be emitted.
http2stream.aborted
#
Added in: v8.4.0
<boolean>
Set to true if the Http2Stream instance was aborted abnormally. When set, the 'aborted' event will have been emitted.
http2stream.bufferSize
#
Added in: v11.2.0, v10.16.0
<number>
This property shows the number of characters currently buffered to be written. See net.Socket.bufferSize for details.
http2stream.close(code[, callback])
#
History













code <number> Unsigned 32-bit integer identifying the error code. Default: http2.constants.NGHTTP2_NO_ERROR (0x00).
callback <Function> An optional function registered to listen for the 'close' event.
Closes the Http2Stream instance by sending an RST_STREAM frame to the connected HTTP/2 peer.
http2stream.closed
#
Added in: v9.4.0
<boolean>
Set to true if the Http2Stream instance has been closed.
http2stream.destroyed
#
Added in: v8.4.0
<boolean>
Set to true if the Http2Stream instance has been destroyed and is no longer usable.
http2stream.endAfterHeaders
#
Added in: v10.11.0
<boolean>
Set to true if the END_STREAM flag was set in the request or response HEADERS frame received, indicating that no additional data should be received and the readable side of the Http2Stream will be closed.
http2stream.id
#
Added in: v8.4.0
<number> | <undefined>
The numeric stream identifier of this Http2Stream instance. Set to undefined if the stream identifier has not yet been assigned.
http2stream.pending
#
Added in: v9.4.0
<boolean>
Set to true if the Http2Stream instance has not yet been assigned a numeric stream identifier.
http2stream.priority(options)
#
History

















Stability: 0 - Deprecated: support for priority signaling has been deprecated in the RFC 9113 and is no longer supported in Node.js.
Empty method, only there to maintain some backward compatibility.
http2stream.rstCode
#
Added in: v8.4.0
<number>
Set to the RST_STREAM error code reported when the Http2Stream is destroyed after either receiving an RST_STREAM frame from the connected peer, calling http2stream.close(), or http2stream.destroy(). Will be undefined if the Http2Stream has not been closed.
http2stream.sentHeaders
#
Added in: v9.5.0
<HTTP/2 Headers Object>
An object containing the outbound headers sent for this Http2Stream.
http2stream.sentInfoHeaders
#
Added in: v9.5.0
<HTTP/2 Headers Object[]>
An array of objects containing the outbound informational (additional) headers sent for this Http2Stream.
http2stream.sentTrailers
#
Added in: v9.5.0
<HTTP/2 Headers Object>
An object containing the outbound trailers sent for this HttpStream.
http2stream.session
#
Added in: v8.4.0
<Http2Session>
A reference to the Http2Session instance that owns this Http2Stream. The value will be undefined after the Http2Stream instance is destroyed.
http2stream.setTimeout(msecs, callback)
#
History













msecs <number>
callback <Function>
const http2 = require('node:http2');
const client = http2.connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = http2.constants;
const req = client.request({ ':path': '/' });

// Cancel the stream if there's no activity after 5 seconds
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
copy
http2stream.state
#
History

















Provides miscellaneous information about the current state of the Http2Stream.
<Object>
localWindowSize <number> The number of bytes the connected peer may send for this Http2Stream without receiving a WINDOW_UPDATE.
state <number> A flag indicating the low-level current state of the Http2Stream as determined by nghttp2.
localClose <number> 1 if this Http2Stream has been closed locally.
remoteClose <number> 1 if this Http2Stream has been closed remotely.
sumDependencyWeight <number> Legacy property, always set to 0.
weight <number> Legacy property, always set to 16.
A current state of this Http2Stream.
http2stream.sendTrailers(headers)
#
Added in: v10.0.0
headers <HTTP/2 Headers Object>
Sends a trailing HEADERS frame to the connected HTTP/2 peer. This method will cause the Http2Stream to be immediately closed and must only be called after the 'wantTrailers' event has been emitted. When sending a request or sending a response, the options.waitForTrailers option must be set in order to keep the Http2Stream open after the final DATA frame so that trailers can be sent.
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
copy
The HTTP/1 specification forbids trailers from containing HTTP/2 pseudo-header fields (e.g. ':method', ':path', etc).
Class: ClientHttp2Stream
#
Added in: v8.4.0
Extends <Http2Stream>
The ClientHttp2Stream class is an extension of Http2Stream that is used exclusively on HTTP/2 Clients. Http2Stream instances on the client provide events such as 'response' and 'push' that are only relevant on the client.
Event: 'continue'
#
Added in: v8.5.0
Emitted when the server sends a 100 Continue status, usually because the request contained Expect: 100-continue. This is an instruction that the client should send the request body.
Event: 'headers'
#
Added in: v8.4.0
headers <HTTP/2 Headers Object>
flags <number>
The 'headers' event is emitted when an additional block of headers is received for a stream, such as when a block of 1xx informational headers is received. The listener callback is passed the HTTP/2 Headers Object and flags associated with the headers.
stream.on('headers', (headers, flags) => {
  console.log(headers);
});
copy
Event: 'push'
#
Added in: v8.4.0
headers <HTTP/2 Headers Object>
flags <number>
The 'push' event is emitted when response headers for a Server Push stream are received. The listener callback is passed the HTTP/2 Headers Object and flags associated with the headers.
stream.on('push', (headers, flags) => {
  console.log(headers);
});
copy
Event: 'response'
#
Added in: v8.4.0
headers <HTTP/2 Headers Object>
flags <number>
The 'response' event is emitted when a response HEADERS frame has been received for this stream from the connected HTTP/2 server. The listener is invoked with two arguments: an Object containing the received HTTP/2 Headers Object, and flags associated with the headers.
const http2 = require('node:http2');
const client = http2.connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
copy
Class: ServerHttp2Stream
#
Added in: v8.4.0
Extends: <Http2Stream>
The ServerHttp2Stream class is an extension of Http2Stream that is used exclusively on HTTP/2 Servers. Http2Stream instances on the server provide additional methods such as http2stream.pushStream() and http2stream.respond() that are only relevant on the server.
http2stream.additionalHeaders(headers)
#
Added in: v8.4.0
headers <HTTP/2 Headers Object>
Sends an additional informational HEADERS frame to the connected HTTP/2 peer.
http2stream.headersSent
#
Added in: v8.4.0
<boolean>
True if headers were sent, false otherwise (read-only).
http2stream.pushAllowed
#
Added in: v8.4.0
<boolean>
Read-only property mapped to the SETTINGS_ENABLE_PUSH flag of the remote client's most recent SETTINGS frame. Will be true if the remote peer accepts push streams, false otherwise. Settings are the same for every Http2Stream in the same Http2Session.
http2stream.pushStream(headers[, options], callback)
#
History













headers <HTTP/2 Headers Object>
options <Object>
exclusive <boolean> When true and parent identifies a parent Stream, the created stream is made the sole direct dependency of the parent, with all other existing dependents made a dependent of the newly created stream. Default: false.
parent <number> Specifies the numeric identifier of a stream the newly created stream is dependent on.
callback <Function> Callback that is called once the push stream has been initiated.
err <Error>
pushStream <ServerHttp2Stream> The returned pushStream object.
headers <HTTP/2 Headers Object> Headers object the pushStream was initiated with.
Initiates a push stream. The callback is invoked with the new Http2Stream instance created for the push stream passed as the second argument, or an Error passed as the first argument.
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
copy
Setting the weight of a push stream is not allowed in the HEADERS frame. Pass a weight value to http2stream.priority with the silent option set to true to enable server-side bandwidth balancing between concurrent streams.
Calling http2stream.pushStream() from within a pushed stream is not permitted and will throw an error.
http2stream.respond([headers[, options]])
#
History













headers <HTTP/2 Headers Object>
options <Object>
endStream <boolean> Set to true to indicate that the response will not include payload data.
waitForTrailers <boolean> When true, the Http2Stream will emit the 'wantTrailers' event after the final DATA frame has been sent.
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
copy
Initiates a response. When the options.waitForTrailers option is set, the 'wantTrailers' event will be emitted immediately after queuing the last chunk of payload data to be sent. The http2stream.sendTrailers() method can then be used to sent trailing header fields to the peer.
When options.waitForTrailers is set, the Http2Stream will not automatically close when the final DATA frame is transmitted. User code must call either http2stream.sendTrailers() or http2stream.close() to close the Http2Stream.
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
copy
http2stream.respondWithFD(fd[, headers[, options]])
#
History





















fd <number> | <FileHandle> A readable file descriptor.
headers <HTTP/2 Headers Object>
options <Object>
statCheck <Function>
waitForTrailers <boolean> When true, the Http2Stream will emit the 'wantTrailers' event after the final DATA frame has been sent.
offset <number> The offset position at which to begin reading.
length <number> The amount of data from the fd to send.
Initiates a response whose data is read from the given file descriptor. No validation is performed on the given file descriptor. If an error occurs while attempting to read data using the file descriptor, the Http2Stream will be closed using an RST_STREAM frame using the standard INTERNAL_ERROR code.
When used, the Http2Stream object's Duplex interface will be closed automatically.
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => fs.closeSync(fd));
});
copy
The optional options.statCheck function may be specified to give user code an opportunity to set additional content headers based on the fs.Stat details of the given fd. If the statCheck function is provided, the http2stream.respondWithFD() method will perform an fs.fstat() call to collect details on the provided file descriptor.
The offset and length options may be used to limit the response to a specific range subset. This can be used, for instance, to support HTTP Range requests.
The file descriptor or FileHandle is not closed when the stream is closed, so it will need to be closed manually once it is no longer needed. Using the same file descriptor concurrently for multiple streams is not supported and may result in data loss. Re-using a file descriptor after a stream has finished is supported.
When the options.waitForTrailers option is set, the 'wantTrailers' event will be emitted immediately after queuing the last chunk of payload data to be sent. The http2stream.sendTrailers() method can then be used to sent trailing header fields to the peer.
When options.waitForTrailers is set, the Http2Stream will not automatically close when the final DATA frame is transmitted. User code must call either http2stream.sendTrailers() or http2stream.close() to close the Http2Stream.
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => fs.closeSync(fd));
});
copy
http2stream.respondWithFile(path[, headers[, options]])
#
History

















path <string> | <Buffer> | <URL>
headers <HTTP/2 Headers Object>
options <Object>
statCheck <Function>
onError <Function> Callback function invoked in the case of an error before send.
waitForTrailers <boolean> When true, the Http2Stream will emit the 'wantTrailers' event after the final DATA frame has been sent.
offset <number> The offset position at which to begin reading.
length <number> The amount of data from the fd to send.
Sends a regular file as the response. The path must specify a regular file or an 'error' event will be emitted on the Http2Stream object.
When used, the Http2Stream object's Duplex interface will be closed automatically.
The optional options.statCheck function may be specified to give user code an opportunity to set additional content headers based on the fs.Stat details of the given file:
If an error occurs while attempting to read the file data, the Http2Stream will be closed using an RST_STREAM frame using the standard INTERNAL_ERROR code. If the onError callback is defined, then it will be called. Otherwise the stream will be destroyed.
Example using a file path:
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() can throw if the stream has been destroyed by
    // the other side.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Perform actual error handling.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
copy
The options.statCheck function may also be used to cancel the send operation by returning false. For instance, a conditional request may check the stat results to determine if the file has been modified to return an appropriate 304 response:
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Check the stat here...
    stream.respond({ ':status': 304 });
    return false; // Cancel the send operation
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
copy
The content-length header field will be automatically set.
The offset and length options may be used to limit the response to a specific range subset. This can be used, for instance, to support HTTP Range requests.
The options.onError function may also be used to handle all the errors that could happen before the delivery of the file is initiated. The default behavior is to destroy the stream.
When the options.waitForTrailers option is set, the 'wantTrailers' event will be emitted immediately after queuing the last chunk of payload data to be sent. The http2stream.sendTrailers() method can then be used to sent trailing header fields to the peer.
When options.waitForTrailers is set, the Http2Stream will not automatically close when the final DATA frame is transmitted. User code must call either http2stream.sendTrailers() or http2stream.close() to close the Http2Stream.
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
copy
Class: Http2Server
#
Added in: v8.4.0
Extends: <net.Server>
Instances of Http2Server are created using the http2.createServer() function. The Http2Server class is not exported directly by the node:http2 module.
Event: 'checkContinue'
#
Added in: v8.5.0
request <http2.Http2ServerRequest>
response <http2.Http2ServerResponse>
If a 'request' listener is registered or http2.createServer() is supplied a callback function, the 'checkContinue' event is emitted each time a request with an HTTP Expect: 100-continue is received. If this event is not listened for, the server will automatically respond with a status 100 Continue as appropriate.
Handling this event involves calling response.writeContinue() if the client should continue to send the request body, or generating an appropriate HTTP response (e.g. 400 Bad Request) if the client should not continue to send the request body.
When this event is emitted and handled, the 'request' event will not be emitted.
Event: 'connection'
#
Added in: v8.4.0
socket <stream.Duplex>
This event is emitted when a new TCP stream is established. socket is typically an object of type net.Socket. Usually users will not want to access this event.
This event can also be explicitly emitted by users to inject connections into the HTTP server. In that case, any Duplex stream can be passed.
Event: 'request'
#
Added in: v8.4.0
request <http2.Http2ServerRequest>
response <http2.Http2ServerResponse>
Emitted each time there is a request. There may be multiple requests per session. See the Compatibility API.
Event: 'session'
#
Added in: v8.4.0
session <ServerHttp2Session>
The 'session' event is emitted when a new Http2Session is created by the Http2Server.
Event: 'sessionError'
#
Added in: v8.4.0
error <Error>
session <ServerHttp2Session>
The 'sessionError' event is emitted when an 'error' event is emitted by an Http2Session object associated with the Http2Server.
Event: 'stream'
#
Added in: v8.4.0
stream <Http2Stream> A reference to the stream
headers <HTTP/2 Headers Object> An object describing the headers
flags <number> The associated numeric flags
rawHeaders <Array> An array containing the raw header names followed by their respective values.
The 'stream' event is emitted when a 'stream' event has been emitted by an Http2Session associated with the server.
See also Http2Session's 'stream' event.
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const server = http2.createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
copy
Event: 'timeout'
#
History













The 'timeout' event is emitted when there is no activity on the Server for a given number of milliseconds set using http2server.setTimeout(). Default: 0 (no timeout)
server.close([callback])
#
Added in: v8.4.0
callback <Function>
Stops the server from establishing new sessions. This does not prevent new request streams from being created due to the persistent nature of HTTP/2 sessions. To gracefully shut down the server, call http2session.close() on all active sessions.
If callback is provided, it is not invoked until all active sessions have been closed, although the server has already stopped allowing new sessions. See net.Server.close() for more details.
server[Symbol.asyncDispose]()
#
History













Calls server.close() and returns a promise that fulfills when the server has closed.
server.setTimeout([msecs][, callback])
#
History

















msecs <number> Default: 0 (no timeout)
callback <Function>
Returns: <Http2Server>
Used to set the timeout value for http2 server requests, and sets a callback function that is called when there is no activity on the Http2Server after msecs milliseconds.
The given callback is registered as a listener on the 'timeout' event.
In case if callback is not a function, a new ERR_INVALID_ARG_TYPE error will be thrown.
server.timeout
#
History













<number> Timeout in milliseconds. Default: 0 (no timeout)
The number of milliseconds of inactivity before a socket is presumed to have timed out.
A value of 0 will disable the timeout behavior on incoming connections.
The socket timeout logic is set up on connection, so changing this value only affects new connections to the server, not any existing connections.
server.updateSettings([settings])
#
Added in: v15.1.0, v14.17.0
settings <HTTP/2 Settings Object>
Used to update the server with the provided settings.
Throws ERR_HTTP2_INVALID_SETTING_VALUE for invalid settings values.
Throws ERR_INVALID_ARG_TYPE for invalid settings argument.
Class: Http2SecureServer
#
Added in: v8.4.0
Extends: <tls.Server>
Instances of Http2SecureServer are created using the http2.createSecureServer() function. The Http2SecureServer class is not exported directly by the node:http2 module.
Event: 'checkContinue'
#
Added in: v8.5.0
request <http2.Http2ServerRequest>
response <http2.Http2ServerResponse>
If a 'request' listener is registered or http2.createSecureServer() is supplied a callback function, the 'checkContinue' event is emitted each time a request with an HTTP Expect: 100-continue is received. If this event is not listened for, the server will automatically respond with a status 100 Continue as appropriate.
Handling this event involves calling response.writeContinue() if the client should continue to send the request body, or generating an appropriate HTTP response (e.g. 400 Bad Request) if the client should not continue to send the request body.
When this event is emitted and handled, the 'request' event will not be emitted.
Event: 'connection'
#
Added in: v8.4.0
socket <stream.Duplex>
This event is emitted when a new TCP stream is established, before the TLS handshake begins. socket is typically an object of type net.Socket. Usually users will not want to access this event.
This event can also be explicitly emitted by users to inject connections into the HTTP server. In that case, any Duplex stream can be passed.
Event: 'request'
#
Added in: v8.4.0
request <http2.Http2ServerRequest>
response <http2.Http2ServerResponse>
Emitted each time there is a request. There may be multiple requests per session. See the Compatibility API.
Event: 'session'
#
Added in: v8.4.0
session <ServerHttp2Session>
The 'session' event is emitted when a new Http2Session is created by the Http2SecureServer.
Event: 'sessionError'
#
Added in: v8.4.0
error <Error>
session <ServerHttp2Session>
The 'sessionError' event is emitted when an 'error' event is emitted by an Http2Session object associated with the Http2SecureServer.
Event: 'stream'
#
Added in: v8.4.0
stream <Http2Stream> A reference to the stream
headers <HTTP/2 Headers Object> An object describing the headers
flags <number> The associated numeric flags
rawHeaders <Array> An array containing the raw header names followed by their respective values.
The 'stream' event is emitted when a 'stream' event has been emitted by an Http2Session associated with the server.
See also Http2Session's 'stream' event.
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const options = getOptionsSomehow();

const server = http2.createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
copy
Event: 'timeout'
#
Added in: v8.4.0
The 'timeout' event is emitted when there is no activity on the Server for a given number of milliseconds set using http2secureServer.setTimeout(). Default: 2 minutes.
Event: 'unknownProtocol'
#
History













socket <stream.Duplex>
The 'unknownProtocol' event is emitted when a connecting client fails to negotiate an allowed protocol (i.e. HTTP/2 or HTTP/1.1). The event handler receives the socket for handling. If no listener is registered for this event, the connection is terminated. A timeout may be specified using the 'unknownProtocolTimeout' option passed to http2.createSecureServer().
In earlier versions of Node.js, this event would be emitted if allowHTTP1 is false and, during the TLS handshake, the client either does not send an ALPN extension or sends an ALPN extension that does not include HTTP/2 (h2). Newer versions of Node.js only emit this event if allowHTTP1 is false and the client does not send an ALPN extension. If the client sends an ALPN extension that does not include HTTP/2 (or HTTP/1.1 if allowHTTP1 is true), the TLS handshake will fail and no secure connection will be established.
See the Compatibility API.
server.close([callback])
#
Added in: v8.4.0
callback <Function>
Stops the server from establishing new sessions. This does not prevent new request streams from being created due to the persistent nature of HTTP/2 sessions. To gracefully shut down the server, call http2session.close() on all active sessions.
If callback is provided, it is not invoked until all active sessions have been closed, although the server has already stopped allowing new sessions. See tls.Server.close() for more details.
server.setTimeout([msecs][, callback])
#
History













msecs <number> Default: 120000 (2 minutes)
callback <Function>
Returns: <Http2SecureServer>
Used to set the timeout value for http2 secure server requests, and sets a callback function that is called when there is no activity on the Http2SecureServer after msecs milliseconds.
The given callback is registered as a listener on the 'timeout' event.
In case if callback is not a function, a new ERR_INVALID_ARG_TYPE error will be thrown.
server.timeout
#
History













<number> Timeout in milliseconds. Default: 0 (no timeout)
The number of milliseconds of inactivity before a socket is presumed to have timed out.
A value of 0 will disable the timeout behavior on incoming connections.
The socket timeout logic is set up on connection, so changing this value only affects new connections to the server, not any existing connections.
server.updateSettings([settings])
#
Added in: v15.1.0, v14.17.0
settings <HTTP/2 Settings Object>
Used to update the server with the provided settings.
Throws ERR_HTTP2_INVALID_SETTING_VALUE for invalid settings values.
Throws ERR_INVALID_ARG_TYPE for invalid settings argument.
http2.createServer([options][, onRequestHandler])
#
History

















































options <Object>
maxDeflateDynamicTableSize <number> Sets the maximum dynamic table size for deflating header fields. Default: 4Kib.
maxSettings <number> Sets the maximum number of settings entries per SETTINGS frame. The minimum value allowed is 1. Default: 32.
maxSessionMemory<number> Sets the maximum memory that the Http2Session is permitted to use. The value is expressed in terms of number of megabytes, e.g. 1 equal 1 megabyte. The minimum value allowed is 1. This is a credit based limit, existing Http2Streams may cause this limit to be exceeded, but new Http2Stream instances will be rejected while this limit is exceeded. The current number of Http2Stream sessions, the current memory use of the header compression tables, current data queued to be sent, and unacknowledged PING and SETTINGS frames are all counted towards the current limit. Default: 10.
maxHeaderListPairs <number> Sets the maximum number of header entries. This is similar to server.maxHeadersCount or request.maxHeadersCount in the node:http module. The minimum value is 4. Default: 128.
maxOutstandingPings <number> Sets the maximum number of outstanding, unacknowledged pings. Default: 10.
maxSendHeaderBlockLength <number> Sets the maximum allowed size for a serialized, compressed block of headers. Attempts to send headers that exceed this limit will result in a 'frameError' event being emitted and the stream being closed and destroyed. While this sets the maximum allowed size to the entire block of headers, nghttp2 (the internal http2 library) has a limit of 65536 for each decompressed key/value pair.
paddingStrategy <number> The strategy used for determining the amount of padding to use for HEADERS and DATA frames. Default: http2.constants.PADDING_STRATEGY_NONE. Value may be one of:
http2.constants.PADDING_STRATEGY_NONE: No padding is applied.
http2.constants.PADDING_STRATEGY_MAX: The maximum amount of padding, determined by the internal implementation, is applied.
http2.constants.PADDING_STRATEGY_ALIGNED: Attempts to apply enough padding to ensure that the total frame length, including the 9-byte header, is a multiple of 8. For each frame, there is a maximum allowed number of padding bytes that is determined by current flow control state and settings. If this maximum is less than the calculated amount needed to ensure alignment, the maximum is used and the total frame length is not necessarily aligned at 8 bytes.
peerMaxConcurrentStreams <number> Sets the maximum number of concurrent streams for the remote peer as if a SETTINGS frame had been received. Will be overridden if the remote peer sets its own value for maxConcurrentStreams. Default: 100.
maxSessionInvalidFrames <integer> Sets the maximum number of invalid frames that will be tolerated before the session is closed. Default: 1000.
maxSessionRejectedStreams <integer> Sets the maximum number of rejected upon creation streams that will be tolerated before the session is closed. Each rejection is associated with an NGHTTP2_ENHANCE_YOUR_CALM error that should tell the peer to not open any more streams, continuing to open streams is therefore regarded as a sign of a misbehaving peer. Default: 100.
settings <HTTP/2 Settings Object> The initial settings to send to the remote peer upon connection.
streamResetBurst <number> and streamResetRate <number> Sets the rate limit for the incoming stream reset (RST_STREAM frame). Both settings must be set to have any effect, and default to 1000 and 33 respectively.
remoteCustomSettings <Array> The array of integer values determines the settings types, which are included in the CustomSettings-property of the received remoteSettings. Please see the CustomSettings-property of the Http2Settings object for more information, on the allowed setting types.
Http1IncomingMessage <http.IncomingMessage> Specifies the IncomingMessage class to used for HTTP/1 fallback. Useful for extending the original http.IncomingMessage. Default: http.IncomingMessage.
Http1ServerResponse <http.ServerResponse> Specifies the ServerResponse class to used for HTTP/1 fallback. Useful for extending the original http.ServerResponse. Default: http.ServerResponse.
Http2ServerRequest <http2.Http2ServerRequest> Specifies the Http2ServerRequest class to use. Useful for extending the original Http2ServerRequest. Default: Http2ServerRequest.
Http2ServerResponse <http2.Http2ServerResponse> Specifies the Http2ServerResponse class to use. Useful for extending the original Http2ServerResponse. Default: Http2ServerResponse.
unknownProtocolTimeout <number> Specifies a timeout in milliseconds that a server should wait when an 'unknownProtocol' is emitted. If the socket has not been destroyed by that time the server will destroy it. Default: 10000.
strictFieldWhitespaceValidation <boolean> If true, it turns on strict leading and trailing whitespace validation for HTTP/2 header field names and values as per RFC-9113. Default: true.
...: Any net.createServer() option can be provided.
onRequestHandler <Function> See Compatibility API
Returns: <Http2Server>
Returns a net.Server instance that creates and manages Http2Session instances.
Since there are no browsers known that support unencrypted HTTP/2, the use of http2.createSecureServer() is necessary when communicating with browser clients.
const http2 = require('node:http2');

// Create an unencrypted HTTP/2 server.
// Since there are no browsers known that support
// unencrypted HTTP/2, the use of `http2.createSecureServer()`
// is necessary when communicating with browser clients.
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
copy
http2.createSecureServer(options[, onRequestHandler])
#
History









































options <Object>
allowHTTP1 <boolean> Incoming client connections that do not support HTTP/2 will be downgraded to HTTP/1.x when set to true. See the 'unknownProtocol' event. See ALPN negotiation. Default: false.
maxDeflateDynamicTableSize <number> Sets the maximum dynamic table size for deflating header fields. Default: 4Kib.
maxSettings <number> Sets the maximum number of settings entries per SETTINGS frame. The minimum value allowed is 1. Default: 32.
maxSessionMemory<number> Sets the maximum memory that the Http2Session is permitted to use. The value is expressed in terms of number of megabytes, e.g. 1 equal 1 megabyte. The minimum value allowed is 1. This is a credit based limit, existing Http2Streams may cause this limit to be exceeded, but new Http2Stream instances will be rejected while this limit is exceeded. The current number of Http2Stream sessions, the current memory use of the header compression tables, current data queued to be sent, and unacknowledged PING and SETTINGS frames are all counted towards the current limit. Default: 10.
maxHeaderListPairs <number> Sets the maximum number of header entries. This is similar to server.maxHeadersCount or request.maxHeadersCount in the node:http module. The minimum value is 4. Default: 128.
maxOutstandingPings <number> Sets the maximum number of outstanding, unacknowledged pings. Default: 10.
maxSendHeaderBlockLength <number> Sets the maximum allowed size for a serialized, compressed block of headers. Attempts to send headers that exceed this limit will result in a 'frameError' event being emitted and the stream being closed and destroyed.
paddingStrategy <number> Strategy used for determining the amount of padding to use for HEADERS and DATA frames. Default: http2.constants.PADDING_STRATEGY_NONE. Value may be one of:
http2.constants.PADDING_STRATEGY_NONE: No padding is applied.
http2.constants.PADDING_STRATEGY_MAX: The maximum amount of padding, determined by the internal implementation, is applied.
http2.constants.PADDING_STRATEGY_ALIGNED: Attempts to apply enough padding to ensure that the total frame length, including the 9-byte header, is a multiple of 8. For each frame, there is a maximum allowed number of padding bytes that is determined by current flow control state and settings. If this maximum is less than the calculated amount needed to ensure alignment, the maximum is used and the total frame length is not necessarily aligned at 8 bytes.
peerMaxConcurrentStreams <number> Sets the maximum number of concurrent streams for the remote peer as if a SETTINGS frame had been received. Will be overridden if the remote peer sets its own value for maxConcurrentStreams. Default: 100.
maxSessionInvalidFrames <integer> Sets the maximum number of invalid frames that will be tolerated before the session is closed. Default: 1000.
maxSessionRejectedStreams <integer> Sets the maximum number of rejected upon creation streams that will be tolerated before the session is closed. Each rejection is associated with an NGHTTP2_ENHANCE_YOUR_CALM error that should tell the peer to not open any more streams, continuing to open streams is therefore regarded as a sign of a misbehaving peer. Default: 100.
settings <HTTP/2 Settings Object> The initial settings to send to the remote peer upon connection.
streamResetBurst <number> and streamResetRate <number> Sets the rate limit for the incoming stream reset (RST_STREAM frame). Both settings must be set to have any effect, and default to 1000 and 33 respectively.
remoteCustomSettings <Array> The array of integer values determines the settings types, which are included in the customSettings-property of the received remoteSettings. Please see the customSettings-property of the Http2Settings object for more information, on the allowed setting types.
...: Any tls.createServer() options can be provided. For servers, the identity options (pfx or key/cert) are usually required.
origins <string[]> An array of origin strings to send within an ORIGIN frame immediately following creation of a new server Http2Session.
unknownProtocolTimeout <number> Specifies a timeout in milliseconds that a server should wait when an 'unknownProtocol' event is emitted. If the socket has not been destroyed by that time the server will destroy it. Default: 10000.
strictFieldWhitespaceValidation <boolean> If true, it turns on strict leading and trailing whitespace validation for HTTP/2 header field names and values as per RFC-9113. Default: true.
onRequestHandler <Function> See Compatibility API
Returns: <Http2SecureServer>
Returns a tls.Server instance that creates and manages Http2Session instances.
const http2 = require('node:http2');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
};

// Create a secure HTTP/2 server
const server = http2.createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
copy
http2.connect(authority[, options][, listener])
#
History





























authority <string> | <URL> The remote HTTP/2 server to connect to. This must be in the form of a minimal, valid URL with the http:// or https:// prefix, host name, and IP port (if a non-default port is used). Userinfo (user ID and password), path, querystring, and fragment details in the URL will be ignored.
options <Object>
maxDeflateDynamicTableSize <number> Sets the maximum dynamic table size for deflating header fields. Default: 4Kib.
maxSettings <number> Sets the maximum number of settings entries per SETTINGS frame. The minimum value allowed is 1. Default: 32.
maxSessionMemory<number> Sets the maximum memory that the Http2Session is permitted to use. The value is expressed in terms of number of megabytes, e.g. 1 equal 1 megabyte. The minimum value allowed is 1. This is a credit based limit, existing Http2Streams may cause this limit to be exceeded, but new Http2Stream instances will be rejected while this limit is exceeded. The current number of Http2Stream sessions, the current memory use of the header compression tables, current data queued to be sent, and unacknowledged PING and SETTINGS frames are all counted towards the current limit. Default: 10.
maxHeaderListPairs <number> Sets the maximum number of header entries. This is similar to server.maxHeadersCount or request.maxHeadersCount in the node:http module. The minimum value is 1. Default: 128.
maxOutstandingPings <number> Sets the maximum number of outstanding, unacknowledged pings. Default: 10.
maxReservedRemoteStreams <number> Sets the maximum number of reserved push streams the client will accept at any given time. Once the current number of currently reserved push streams exceeds reaches this limit, new push streams sent by the server will be automatically rejected. The minimum allowed value is 0. The maximum allowed value is 232-1. A negative value sets this option to the maximum allowed value. Default: 200.
maxSendHeaderBlockLength <number> Sets the maximum allowed size for a serialized, compressed block of headers. Attempts to send headers that exceed this limit will result in a 'frameError' event being emitted and the stream being closed and destroyed.
paddingStrategy <number> Strategy used for determining the amount of padding to use for HEADERS and DATA frames. Default: http2.constants.PADDING_STRATEGY_NONE. Value may be one of:
http2.constants.PADDING_STRATEGY_NONE: No padding is applied.
http2.constants.PADDING_STRATEGY_MAX: The maximum amount of padding, determined by the internal implementation, is applied.
http2.constants.PADDING_STRATEGY_ALIGNED: Attempts to apply enough padding to ensure that the total frame length, including the 9-byte header, is a multiple of 8. For each frame, there is a maximum allowed number of padding bytes that is determined by current flow control state and settings. If this maximum is less than the calculated amount needed to ensure alignment, the maximum is used and the total frame length is not necessarily aligned at 8 bytes.
peerMaxConcurrentStreams <number> Sets the maximum number of concurrent streams for the remote peer as if a SETTINGS frame had been received. Will be overridden if the remote peer sets its own value for maxConcurrentStreams. Default: 100.
protocol <string> The protocol to connect with, if not set in the authority. Value may be either 'http:' or 'https:'. Default: 'https:'
settings <HTTP/2 Settings Object> The initial settings to send to the remote peer upon connection.
remoteCustomSettings <Array> The array of integer values determines the settings types, which are included in the CustomSettings-property of the received remoteSettings. Please see the CustomSettings-property of the Http2Settings object for more information, on the allowed setting types.
createConnection <Function> An optional callback that receives the URL instance passed to connect and the options object, and returns any Duplex stream that is to be used as the connection for this session.
...: Any net.connect() or tls.connect() options can be provided.
unknownProtocolTimeout <number> Specifies a timeout in milliseconds that a server should wait when an 'unknownProtocol' event is emitted. If the socket has not been destroyed by that time the server will destroy it. Default: 10000.
strictFieldWhitespaceValidation <boolean> If true, it turns on strict leading and trailing whitespace validation for HTTP/2 header field names and values as per RFC-9113. Default: true.
listener <Function> Will be registered as a one-time listener of the 'connect' event.
Returns: <ClientHttp2Session>
Returns a ClientHttp2Session instance.
const http2 = require('node:http2');
const client = http2.connect('https://localhost:1234');

/* Use the client */

client.close();
copy
http2.constants
#
Added in: v8.4.0
Error codes for RST_STREAM and GOAWAY
#
Value
Name
Constant
0x00
No Error
http2.constants.NGHTTP2_NO_ERROR
0x01
Protocol Error
http2.constants.NGHTTP2_PROTOCOL_ERROR
0x02
Internal Error
http2.constants.NGHTTP2_INTERNAL_ERROR
0x03
Flow Control Error
http2.constants.NGHTTP2_FLOW_CONTROL_ERROR
0x04
Settings Timeout
http2.constants.NGHTTP2_SETTINGS_TIMEOUT
0x05
Stream Closed
http2.constants.NGHTTP2_STREAM_CLOSED
0x06
Frame Size Error
http2.constants.NGHTTP2_FRAME_SIZE_ERROR
0x07
Refused Stream
http2.constants.NGHTTP2_REFUSED_STREAM
0x08
Cancel
http2.constants.NGHTTP2_CANCEL
0x09
Compression Error
http2.constants.NGHTTP2_COMPRESSION_ERROR
0x0a
Connect Error
http2.constants.NGHTTP2_CONNECT_ERROR
0x0b
Enhance Your Calm
http2.constants.NGHTTP2_ENHANCE_YOUR_CALM
0x0c
Inadequate Security
http2.constants.NGHTTP2_INADEQUATE_SECURITY
0x0d
HTTP/1.1 Required
http2.constants.NGHTTP2_HTTP_1_1_REQUIRED

The 'timeout' event is emitted when there is no activity on the Server for a given number of milliseconds set using http2server.setTimeout().
http2.getDefaultSettings()
#
Added in: v8.4.0
Returns: <HTTP/2 Settings Object>
Returns an object containing the default settings for an Http2Session instance. This method returns a new object instance every time it is called so instances returned may be safely modified for use.
http2.getPackedSettings([settings])
#
Added in: v8.4.0
settings <HTTP/2 Settings Object>
Returns: <Buffer>
Returns a Buffer instance containing serialized representation of the given HTTP/2 settings as specified in the HTTP/2 specification. This is intended for use with the HTTP2-Settings header field.
const http2 = require('node:http2');

const packed = http2.getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
copy
http2.getUnpackedSettings(buf)
#
Added in: v8.4.0
buf <Buffer> | <TypedArray> The packed settings.
Returns: <HTTP/2 Settings Object>
Returns a HTTP/2 Settings Object containing the deserialized settings from the given Buffer as generated by http2.getPackedSettings().
http2.performServerHandshake(socket[, options])
#
Added in: v21.7.0, v20.12.0
socket <stream.Duplex>
options <Object>
...: Any http2.createServer() option can be provided.
Returns: <ServerHttp2Session>
Create an HTTP/2 server session from an existing socket.
http2.sensitiveHeaders
#
Added in: v15.0.0, v14.18.0
<symbol>
This symbol can be set as a property on the HTTP/2 headers object with an array value in order to provide a list of headers considered sensitive. See Sensitive headers for more details.
Headers object
#
Headers are represented as own-properties on JavaScript objects. The property keys will be serialized to lower-case. Property values should be strings (if they are not they will be coerced to strings) or an Array of strings (in order to send more than one value per header field).
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'ABC': ['has', 'more', 'than', 'one', 'value'],
};

stream.respond(headers);
copy
Header objects passed to callback functions will have a null prototype. This means that normal JavaScript object methods such as Object.prototype.toString() and Object.prototype.hasOwnProperty() will not work.
For incoming headers:
The :status header is converted to number.
Duplicates of :status, :method, :authority, :scheme, :path, :protocol, age, authorization, access-control-allow-credentials, access-control-max-age, access-control-request-method, content-encoding, content-language, content-length, content-location, content-md5, content-range, content-type, date, dnt, etag, expires, from, host, if-match, if-modified-since, if-none-match, if-range, if-unmodified-since, last-modified, location, max-forwards, proxy-authorization, range, referer,retry-after, tk, upgrade-insecure-requests, user-agent or x-content-type-options are discarded.
set-cookie is always an array. Duplicates are added to the array.
For duplicate cookie headers, the values are joined together with '; '.
For all other headers, the values are joined together with ', '.
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
copy
Sensitive headers
#
HTTP2 headers can be marked as sensitive, which means that the HTTP/2 header compression algorithm will never index them. This can make sense for header values with low entropy and that may be considered valuable to an attacker, for example Cookie or Authorization. To achieve this, add the header name to the [http2.sensitiveHeaders] property as an array:
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'cookie': 'some-cookie',
  'other-sensitive-header': 'very secret data',
  [http2.sensitiveHeaders]: ['cookie', 'other-sensitive-header'],
};

stream.respond(headers);
copy
For some headers, such as Authorization and short Cookie headers, this flag is set automatically.
This property is also set for received headers. It will contain the names of all headers marked as sensitive, including ones marked that way automatically.
Settings object
#
History

















The http2.getDefaultSettings(), http2.getPackedSettings(), http2.createServer(), http2.createSecureServer(), http2session.settings(), http2session.localSettings, and http2session.remoteSettings APIs either return or receive as input an object that defines configuration settings for an Http2Session object. These objects are ordinary JavaScript objects containing the following properties.
headerTableSize <number> Specifies the maximum number of bytes used for header compression. The minimum allowed value is 0. The maximum allowed value is 232-1. Default: 4096.
enablePush <boolean> Specifies true if HTTP/2 Push Streams are to be permitted on the Http2Session instances. Default: true.
initialWindowSize <number> Specifies the sender's initial window size in bytes for stream-level flow control. The minimum allowed value is 0. The maximum allowed value is 232-1. Default: 65535.
maxFrameSize <number> Specifies the size in bytes of the largest frame payload. The minimum allowed value is 16,384. The maximum allowed value is 224-1. Default: 16384.
maxConcurrentStreams <number> Specifies the maximum number of concurrent streams permitted on an Http2Session. There is no default value which implies, at least theoretically, 232-1 streams may be open concurrently at any given time in an Http2Session. The minimum value is 0. The maximum allowed value is 232-1. Default: 4294967295.
maxHeaderListSize <number> Specifies the maximum size (uncompressed octets) of header list that will be accepted. The minimum allowed value is 0. The maximum allowed value is 232-1. Default: 65535.
maxHeaderSize <number> Alias for maxHeaderListSize.
enableConnectProtocol<boolean> Specifies true if the "Extended Connect Protocol" defined by RFC 8441 is to be enabled. This setting is only meaningful if sent by the server. Once the enableConnectProtocol setting has been enabled for a given Http2Session, it cannot be disabled. Default: false.
customSettings <Object> Specifies additional settings, yet not implemented in node and the underlying libraries. The key of the object defines the numeric value of the settings type (as defined in the "HTTP/2 SETTINGS" registry established by [RFC 7540]) and the values the actual numeric value of the settings. The settings type has to be an integer in the range from 1 to 2^16-1. It should not be a settings type already handled by node, i.e. currently it should be greater than 6, although it is not an error. The values need to be unsigned integers in the range from 0 to 2^32-1. Currently, a maximum of up 10 custom settings is supported. It is only supported for sending SETTINGS, or for receiving settings values specified in the remoteCustomSettings options of the server or client object. Do not mix the customSettings-mechanism for a settings id with interfaces for the natively handled settings, in case a setting becomes natively supported in a future node version.
All additional properties on the settings object are ignored.
Error handling
#
There are several types of error conditions that may arise when using the node:http2 module:
Validation errors occur when an incorrect argument, option, or setting value is passed in. These will always be reported by a synchronous throw.
State errors occur when an action is attempted at an incorrect time (for instance, attempting to send data on a stream after it has closed). These will be reported using either a synchronous throw or via an 'error' event on the Http2Stream, Http2Session or HTTP/2 Server objects, depending on where and when the error occurs.
Internal errors occur when an HTTP/2 session fails unexpectedly. These will be reported via an 'error' event on the Http2Session or HTTP/2 Server objects.
Protocol errors occur when various HTTP/2 protocol constraints are violated. These will be reported using either a synchronous throw or via an 'error' event on the Http2Stream, Http2Session or HTTP/2 Server objects, depending on where and when the error occurs.
Invalid character handling in header names and values
#
The HTTP/2 implementation applies stricter handling of invalid characters in HTTP header names and values than the HTTP/1 implementation.
Header field names are case-insensitive and are transmitted over the wire strictly as lower-case strings. The API provided by Node.js allows header names to be set as mixed-case strings (e.g. Content-Type) but will convert those to lower-case (e.g. content-type) upon transmission.
Header field-names must only contain one or more of the following ASCII characters: a-z, A-Z, 0-9, !, #, $, %, &, ', *, +, -, ., ^, _, ` (backtick), |, and ~.
Using invalid characters within an HTTP header field name will cause the stream to be closed with a protocol error being reported.
Header field values are handled with more leniency but should not contain new-line or carriage return characters and should be limited to US-ASCII characters, per the requirements of the HTTP specification.
Push streams on the client
#
To receive pushed streams on the client, set a listener for the 'stream' event on the ClientHttp2Session:
const http2 = require('node:http2');

const client = http2.connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Process response headers
  });
  pushedStream.on('data', (chunk) => { /* handle pushed data */ });
});

const req = client.request({ ':path': '/' });
copy
Supporting the CONNECT method
#
The CONNECT method is used to allow an HTTP/2 server to be used as a proxy for TCP/IP connections.
A simple TCP Server:
const net = require('node:net');

const server = net.createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
copy
An HTTP/2 CONNECT proxy:
const http2 = require('node:http2');
const { NGHTTP2_REFUSED_STREAM } = http2.constants;
const net = require('node:net');

const proxy = http2.createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // Only accept CONNECT requests
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // It's a very good idea to verify that hostname and port are
  // things this proxy should be connecting to.
  const socket = net.connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(http2.constants.NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
copy
An HTTP/2 CONNECT client:
const http2 = require('node:http2');

const client = http2.connect('http://localhost:8001');

// Must not specify the ':path' and ':scheme' headers
// for CONNECT requests or an error will be thrown.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[http2.constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
copy
The extended CONNECT protocol
#
RFC 8441 defines an "Extended CONNECT Protocol" extension to HTTP/2 that may be used to bootstrap the use of an Http2Stream using the CONNECT method as a tunnel for other communication protocols (such as WebSockets).
The use of the Extended CONNECT Protocol is enabled by HTTP/2 servers by using the enableConnectProtocol setting:
const http2 = require('node:http2');
const settings = { enableConnectProtocol: true };
const server = http2.createServer({ settings });
copy
Once the client receives the SETTINGS frame from the server indicating that the extended CONNECT may be used, it may send CONNECT requests that use the ':protocol' HTTP/2 pseudo-header:
const http2 = require('node:http2');
const client = http2.connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
copy
Compatibility API
#
The Compatibility API has the goal of providing a similar developer experience of HTTP/1 when using HTTP/2, making it possible to develop applications that support both HTTP/1 and HTTP/2. This API targets only the public API of the HTTP/1. However many modules use internal methods or state, and those are not supported as it is a completely different implementation.
The following example creates an HTTP/2 server using the compatibility API:
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
copy
In order to create a mixed HTTPS and HTTP/2 server, refer to the ALPN negotiation section. Upgrading from non-tls HTTP/1 servers is not supported.
The HTTP/2 compatibility API is composed of Http2ServerRequest and Http2ServerResponse. They aim at API compatibility with HTTP/1, but they do not hide the differences between the protocols. As an example, the status message for HTTP codes is ignored.
ALPN negotiation
#
ALPN negotiation allows supporting both HTTPS and HTTP/2 over the same socket. The req and res objects can be either HTTP/1 or HTTP/2, and an application must restrict itself to the public API of HTTP/1, and detect if it is possible to use the more advanced features of HTTP/2.
The following example creates a server that supports both protocols:
const { createSecureServer } = require('node:http2');
const { readFileSync } = require('node:fs');

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(4443);

function onRequest(req, res) {
  // Detects if it is a HTTPS request or HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
copy
The 'request' event works identically on both HTTPS and HTTP/2.
Class: http2.Http2ServerRequest
#
Added in: v8.4.0
Extends: <stream.Readable>
A Http2ServerRequest object is created by http2.Server or http2.SecureServer and passed as the first argument to the 'request' event. It may be used to access a request status, headers, and data.
Event: 'aborted'
#
Added in: v8.4.0
The 'aborted' event is emitted whenever a Http2ServerRequest instance is abnormally aborted in mid-communication.
The 'aborted' event will only be emitted if the Http2ServerRequest writable side has not been ended.
Event: 'close'
#
Added in: v8.4.0
Indicates that the underlying Http2Stream was closed. Just like 'end', this event occurs only once per response.
request.aborted
#
Added in: v10.1.0
<boolean>
The request.aborted property will be true if the request has been aborted.
request.authority
#
Added in: v8.4.0
<string>
The request authority pseudo header field. Because HTTP/2 allows requests to set either :authority or host, this value is derived from req.headers[':authority'] if present. Otherwise, it is derived from req.headers['host'].
request.complete
#
Added in: v12.10.0
<boolean>
The request.complete property will be true if the request has been completed, aborted, or destroyed.
request.connection
#
Added in: v8.4.0Deprecated since: v13.0.0
Stability: 0 - Deprecated. Use request.socket.
<net.Socket> | <tls.TLSSocket>
See request.socket.
request.destroy([error])
#
Added in: v8.4.0
error <Error>
Calls destroy() on the Http2Stream that received the Http2ServerRequest. If error is provided, an 'error' event is emitted and error is passed as an argument to any listeners on the event.
It does nothing if the stream was already destroyed.
request.headers
#
Added in: v8.4.0
<Object>
The request/response headers object.
Key-value pairs of header names and values. Header names are lower-cased.
// Prints something like:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
copy
See HTTP/2 Headers Object.
In HTTP/2, the request path, host name, protocol, and method are represented as special headers prefixed with the : character (e.g. ':path'). These special headers will be included in the request.headers object. Care must be taken not to inadvertently modify these special headers or errors may occur. For instance, removing all headers from the request will cause errors to occur:
removeAllHeaders(request.headers);
assert(request.url);   // Fails because the :path header has been removed
copy
request.httpVersion
#
Added in: v8.4.0
<string>
In case of server request, the HTTP version sent by the client. In the case of client response, the HTTP version of the connected-to server. Returns '2.0'.
Also message.httpVersionMajor is the first integer and message.httpVersionMinor is the second.
request.method
#
Added in: v8.4.0
<string>
The request method as a string. Read-only. Examples: 'GET', 'DELETE'.
request.rawHeaders
#
Added in: v8.4.0
<string[]>
The raw request/response headers list exactly as they were received.
The keys and values are in the same list. It is not a list of tuples. So, the even-numbered offsets are key values, and the odd-numbered offsets are the associated values.
Header names are not lowercased, and duplicates are not merged.
// Prints something like:
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders);
copy
request.rawTrailers
#
Added in: v8.4.0
<string[]>
The raw request/response trailer keys and values exactly as they were received. Only populated at the 'end' event.
request.scheme
#
Added in: v8.4.0
<string>
The request scheme pseudo header field indicating the scheme portion of the target URL.
request.setTimeout(msecs, callback)
#
Added in: v8.4.0
msecs <number>
callback <Function>
Returns: <http2.Http2ServerRequest>
Sets the Http2Stream's timeout value to msecs. If a callback is provided, then it is added as a listener on the 'timeout' event on the response object.
If no 'timeout' listener is added to the request, the response, or the server, then Http2Streams are destroyed when they time out. If a handler is assigned to the request, the response, or the server's 'timeout' events, timed out sockets must be handled explicitly.
request.socket
#
Added in: v8.4.0
<net.Socket> | <tls.TLSSocket>
Returns a Proxy object that acts as a net.Socket (or tls.TLSSocket) but applies getters, setters, and methods based on HTTP/2 logic.
destroyed, readable, and writable properties will be retrieved from and set on request.stream.
destroy, emit, end, on and once methods will be called on request.stream.
setTimeout method will be called on request.stream.session.
pause, read, resume, and write will throw an error with code ERR_HTTP2_NO_SOCKET_MANIPULATION. See Http2Session and Sockets for more information.
All other interactions will be routed directly to the socket. With TLS support, use request.socket.getPeerCertificate() to obtain the client's authentication details.
request.stream
#
Added in: v8.4.0
<Http2Stream>
The Http2Stream object backing the request.
request.trailers
#
Added in: v8.4.0
<Object>
The request/response trailers object. Only populated at the 'end' event.
request.url
#
Added in: v8.4.0
<string>
Request URL string. This contains only the URL that is present in the actual HTTP request. If the request is:
GET /status?name=ryan HTTP/1.1
Accept: text/plain
copy
Then request.url will be:
'/status?name=ryan'
copy
To parse the url into its parts, new URL() can be used:
$ node
> new URL('/status?name=ryan', 'http://example.com')
URL {
  href: 'http://example.com/status?name=ryan',
  origin: 'http://example.com',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'example.com',
  hostname: 'example.com',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
copy
Class: http2.Http2ServerResponse
#
Added in: v8.4.0
Extends: <Stream>
This object is created internally by an HTTP server, not by the user. It is passed as the second parameter to the 'request' event.
Event: 'close'
#
Added in: v8.4.0
Indicates that the underlying Http2Stream was terminated before response.end() was called or able to flush.
Event: 'finish'
#
Added in: v8.4.0
Emitted when the response has been sent. More specifically, this event is emitted when the last segment of the response headers and body have been handed off to the HTTP/2 multiplexing for transmission over the network. It does not imply that the client has received anything yet.
After this event, no more events will be emitted on the response object.
response.addTrailers(headers)
#
Added in: v8.4.0
headers <Object>
This method adds HTTP trailing headers (a header but at the end of the message) to the response.
Attempting to set a header field name or value that contains invalid characters will result in a TypeError being thrown.
response.appendHeader(name, value)
#
Added in: v21.7.0, v20.12.0
name <string>
value <string> | <string[]>
Append a single header value to the header object.
If the value is an array, this is equivalent to calling this method multiple times.
If there were no previous values for the header, this is equivalent to calling response.setHeader().
Attempting to set a header field name or value that contains invalid characters will result in a TypeError being thrown.
// Returns headers including "set-cookie: a" and "set-cookie: b"
const server = http2.createServer((req, res) => {
  res.setHeader('set-cookie', 'a');
  res.appendHeader('set-cookie', 'b');
  res.writeHead(200);
  res.end('ok');
});
copy
response.connection
#
Added in: v8.4.0Deprecated since: v13.0.0
Stability: 0 - Deprecated. Use response.socket.
<net.Socket> | <tls.TLSSocket>
See response.socket.
response.createPushResponse(headers, callback)
#
History













headers <HTTP/2 Headers Object> An object describing the headers
callback <Function> Called once http2stream.pushStream() is finished, or either when the attempt to create the pushed Http2Stream has failed or has been rejected, or the state of Http2ServerRequest is closed prior to calling the http2stream.pushStream() method
err <Error>
res <http2.Http2ServerResponse> The newly-created Http2ServerResponse object
Call http2stream.pushStream() with the given headers, and wrap the given Http2Stream on a newly created Http2ServerResponse as the callback parameter if successful. When Http2ServerRequest is closed, the callback is called with an error ERR_HTTP2_INVALID_STREAM.
response.end([data[, encoding]][, callback])
#
History













data <string> | <Buffer> | <Uint8Array>
encoding <string>
callback <Function>
Returns: <this>
This method signals to the server that all of the response headers and body have been sent; that server should consider this message complete. The method, response.end(), MUST be called on each response.
If data is specified, it is equivalent to calling response.write(data, encoding) followed by response.end(callback).
If callback is specified, it will be called when the response stream is finished.
response.finished
#
Added in: v8.4.0Deprecated since: v13.4.0, v12.16.0
Stability: 0 - Deprecated. Use response.writableEnded.
<boolean>
Boolean value that indicates whether the response has completed. Starts as false. After response.end() executes, the value will be true.
response.getHeader(name)
#
Added in: v8.4.0
name <string>
Returns: <string>
Reads out a header that has already been queued but not sent to the client. The name is case-insensitive.
const contentType = response.getHeader('content-type');
copy
response.getHeaderNames()
#
Added in: v8.4.0
Returns: <string[]>
Returns an array containing the unique names of the current outgoing headers. All header names are lowercase.
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
copy
response.getHeaders()
#
Added in: v8.4.0
Returns: <Object>
Returns a shallow copy of the current outgoing headers. Since a shallow copy is used, array values may be mutated without additional calls to various header-related http module methods. The keys of the returned object are the header names and the values are the respective header values. All header names are lowercase.
The object returned by the response.getHeaders() method does not prototypically inherit from the JavaScript Object. This means that typical Object methods such as obj.toString(), obj.hasOwnProperty(), and others are not defined and will not work.
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
copy
response.hasHeader(name)
#
Added in: v8.4.0
name <string>
Returns: <boolean>
Returns true if the header identified by name is currently set in the outgoing headers. The header name matching is case-insensitive.
const hasContentType = response.hasHeader('content-type');
copy
response.headersSent
#
Added in: v8.4.0
<boolean>
True if headers were sent, false otherwise (read-only).
response.removeHeader(name)
#
Added in: v8.4.0
name <string>
Removes a header that has been queued for implicit sending.
response.removeHeader('Content-Encoding');
copy
response.req
#
Added in: v15.7.0
<http2.Http2ServerRequest>
A reference to the original HTTP2 request object.
response.sendDate
#
Added in: v8.4.0
<boolean>
When true, the Date header will be automatically generated and sent in the response if it is not already present in the headers. Defaults to true.
This should only be disabled for testing; HTTP requires the Date header in responses.
response.setHeader(name, value)
#
Added in: v8.4.0
name <string>
value <string> | <string[]>
Sets a single header value for implicit headers. If this header already exists in the to-be-sent headers, its value will be replaced. Use an array of strings here to send multiple headers with the same name.
response.setHeader('Content-Type', 'text/html; charset=utf-8');
copy
or
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
copy
Attempting to set a header field name or value that contains invalid characters will result in a TypeError being thrown.
When headers have been set with response.setHeader(), they will be merged with any headers passed to response.writeHead(), with the headers passed to response.writeHead() given precedence.
// Returns content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
copy
response.setTimeout(msecs[, callback])
#
Added in: v8.4.0
msecs <number>
callback <Function>
Returns: <http2.Http2ServerResponse>
Sets the Http2Stream's timeout value to msecs. If a callback is provided, then it is added as a listener on the 'timeout' event on the response object.
If no 'timeout' listener is added to the request, the response, or the server, then Http2Streams are destroyed when they time out. If a handler is assigned to the request, the response, or the server's 'timeout' events, timed out sockets must be handled explicitly.
response.socket
#
Added in: v8.4.0
<net.Socket> | <tls.TLSSocket>
Returns a Proxy object that acts as a net.Socket (or tls.TLSSocket) but applies getters, setters, and methods based on HTTP/2 logic.
destroyed, readable, and writable properties will be retrieved from and set on response.stream.
destroy, emit, end, on and once methods will be called on response.stream.
setTimeout method will be called on response.stream.session.
pause, read, resume, and write will throw an error with code ERR_HTTP2_NO_SOCKET_MANIPULATION. See Http2Session and Sockets for more information.
All other interactions will be routed directly to the socket.
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
copy
response.statusCode
#
Added in: v8.4.0
<number>
When using implicit headers (not calling response.writeHead() explicitly), this property controls the status code that will be sent to the client when the headers get flushed.
response.statusCode = 404;
copy
After response header was sent to the client, this property indicates the status code which was sent out.
response.statusMessage
#
Added in: v8.4.0
<string>
Status message is not supported by HTTP/2 (RFC 7540 8.1.2.4). It returns an empty string.
response.stream
#
Added in: v8.4.0
<Http2Stream>
The Http2Stream object backing the response.
response.writableEnded
#
Added in: v12.9.0
<boolean>
Is true after response.end() has been called. This property does not indicate whether the data has been flushed, for this use writable.writableFinished instead.
response.write(chunk[, encoding][, callback])
#
Added in: v8.4.0
chunk <string> | <Buffer> | <Uint8Array>
encoding <string>
callback <Function>
Returns: <boolean>
If this method is called and response.writeHead() has not been called, it will switch to implicit header mode and flush the implicit headers.
This sends a chunk of the response body. This method may be called multiple times to provide successive parts of the body.
In the node:http module, the response body is omitted when the request is a HEAD request. Similarly, the 204 and 304 responses must not include a message body.
chunk can be a string or a buffer. If chunk is a string, the second parameter specifies how to encode it into a byte stream. By default the encoding is 'utf8'. callback will be called when this chunk of data is flushed.
This is the raw HTTP body and has nothing to do with higher-level multi-part body encodings that may be used.
The first time response.write() is called, it will send the buffered header information and the first chunk of the body to the client. The second time response.write() is called, Node.js assumes data will be streamed, and sends the new data separately. That is, the response is buffered up to the first chunk of the body.
Returns true if the entire data was flushed successfully to the kernel buffer. Returns false if all or part of the data was queued in user memory. 'drain' will be emitted when the buffer is free again.
response.writeContinue()
#
Added in: v8.4.0
Sends a status 100 Continue to the client, indicating that the request body should be sent. See the 'checkContinue' event on Http2Server and Http2SecureServer.
response.writeEarlyHints(hints)
#
Added in: v18.11.0
hints <Object>
Sends a status 103 Early Hints to the client with a Link header, indicating that the user agent can preload/preconnect the linked resources. The hints is an object containing the values of headers to be sent with early hints message.
Example
const earlyHintsLink = '</styles.css>; rel=preload; as=style';
response.writeEarlyHints({
  'link': earlyHintsLink,
});

const earlyHintsLinks = [
  '</styles.css>; rel=preload; as=style',
  '</scripts.js>; rel=preload; as=script',
];
response.writeEarlyHints({
  'link': earlyHintsLinks,
});
copy
response.writeHead(statusCode[, statusMessage][, headers])
#
History













statusCode <number>
statusMessage <string>
headers <Object> | <Array>
Returns: <http2.Http2ServerResponse>
Sends a response header to the request. The status code is a 3-digit HTTP status code, like 404. The last argument, headers, are the response headers.
Returns a reference to the Http2ServerResponse, so that calls can be chained.
For compatibility with HTTP/1, a human-readable statusMessage may be passed as the second argument. However, because the statusMessage has no meaning within HTTP/2, the argument will have no effect and a process warning will be emitted.
const body = 'hello world';
response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain; charset=utf-8',
});
copy
Content-Length is given in bytes not characters. The Buffer.byteLength() API may be used to determine the number of bytes in a given encoding. On outbound messages, Node.js does not check if Content-Length and the length of the body being transmitted are equal or not. However, when receiving messages, Node.js will automatically reject messages when the Content-Length does not match the actual payload size.
This method may be called at most one time on a message before response.end() is called.
If response.write() or response.end() are called before calling this, the implicit/mutable headers will be calculated and call this function.
When headers have been set with response.setHeader(), they will be merged with any headers passed to response.writeHead(), with the headers passed to response.writeHead() given precedence.
// Returns content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
copy
Attempting to set a header field name or value that contains invalid characters will result in a TypeError being thrown.
Collecting HTTP/2 performance metrics
#
The Performance Observer API can be used to collect basic performance metrics for each Http2Session and Http2Stream instance.
const { PerformanceObserver } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // prints 'http2'
  if (entry.name === 'Http2Session') {
    // Entry contains statistics about the Http2Session
  } else if (entry.name === 'Http2Stream') {
    // Entry contains statistics about the Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
copy
The entryType property of the PerformanceEntry will be equal to 'http2'.
The name property of the PerformanceEntry will be equal to either 'Http2Stream' or 'Http2Session'.
If name is equal to Http2Stream, the PerformanceEntry will contain the following additional properties:
bytesRead <number> The number of DATA frame bytes received for this Http2Stream.
bytesWritten <number> The number of DATA frame bytes sent for this Http2Stream.
id <number> The identifier of the associated Http2Stream
timeToFirstByte <number> The number of milliseconds elapsed between the PerformanceEntry startTime and the reception of the first DATA frame.
timeToFirstByteSent <number> The number of milliseconds elapsed between the PerformanceEntry startTime and sending of the first DATA frame.
timeToFirstHeader <number> The number of milliseconds elapsed between the PerformanceEntry startTime and the reception of the first header.
If name is equal to Http2Session, the PerformanceEntry will contain the following additional properties:
bytesRead <number> The number of bytes received for this Http2Session.
bytesWritten <number> The number of bytes sent for this Http2Session.
framesReceived <number> The number of HTTP/2 frames received by the Http2Session.
framesSent <number> The number of HTTP/2 frames sent by the Http2Session.
maxConcurrentStreams <number> The maximum number of streams concurrently open during the lifetime of the Http2Session.
pingRTT <number> The number of milliseconds elapsed since the transmission of a PING frame and the reception of its acknowledgment. Only present if a PING frame has been sent on the Http2Session.
streamAverageDuration <number> The average duration (in milliseconds) for all Http2Stream instances.
streamCount <number> The number of Http2Stream instances processed by the Http2Session.
type <string> Either 'server' or 'client' to identify the type of Http2Session.
Note on :authority and host
#
HTTP/2 requires requests to have either the :authority pseudo-header or the host header. Prefer :authority when constructing an HTTP/2 request directly, and host when converting from HTTP/1 (in proxies, for instance).
The compatibility API falls back to host if :authority is not present. See request.authority for more information. However, if you don't use the compatibility API (or use req.headers directly), you need to implement any fall-back behavior yourself.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
HTTPS
Determining if crypto support is unavailable
Class: https.Agent
new Agent([options])
Event: 'keylog'
Class: https.Server
server.close([callback])
server[Symbol.asyncDispose]()
server.closeAllConnections()
server.closeIdleConnections()
server.headersTimeout
server.listen()
server.maxHeadersCount
server.requestTimeout
server.setTimeout([msecs][, callback])
server.timeout
server.keepAliveTimeout
https.createServer([options][, requestListener])
https.get(options[, callback])
https.get(url[, options][, callback])
https.globalAgent
https.request(options[, callback])
https.request(url[, options][, callback])
HTTPS
#
Stability: 2 - Stable
Source Code: lib/https.js
HTTPS is the HTTP protocol over TLS/SSL. In Node.js this is implemented as a separate module.
Determining if crypto support is unavailable
#
It is possible for Node.js to be built without including support for the node:crypto module. In such cases, attempting to import from https or calling require('node:https') will result in an error being thrown.
When using CommonJS, the error thrown can be caught using try/catch:
let https;
try {
  https = require('node:https');
} catch (err) {
  console.error('https support is disabled!');
}
copy
When using the lexical ESM import keyword, the error can only be caught if a handler for process.on('uncaughtException') is registered before any attempt to load the module is made (using, for instance, a preload module).
When using ESM, if there is a chance that the code may be run on a build of Node.js where crypto support is not enabled, consider using the import() function instead of the lexical import keyword:
let https;
try {
  https = await import('node:https');
} catch (err) {
  console.error('https support is disabled!');
}
copy
Class: https.Agent
#
History

















An Agent object for HTTPS similar to http.Agent. See https.request() for more information.
new Agent([options])
#
History









options <Object> Set of configurable options to set on the agent. Can have the same fields as for http.Agent(options), and
maxCachedSessions <number> maximum number of TLS cached sessions. Use 0 to disable TLS session caching. Default: 100.
servername <string> the value of Server Name Indication extension to be sent to the server. Use empty string '' to disable sending the extension. Default: host name of the target server, unless the target server is specified using an IP address, in which case the default is '' (no extension).
See Session Resumption for information about TLS session reuse.
Event: 'keylog'
#
Added in: v13.2.0, v12.16.0
line <Buffer> Line of ASCII text, in NSS SSLKEYLOGFILE format.
tlsSocket <tls.TLSSocket> The tls.TLSSocket instance on which it was generated.
The keylog event is emitted when key material is generated or received by a connection managed by this agent (typically before handshake has completed, but not necessarily). This keying material can be stored for debugging, as it allows captured TLS traffic to be decrypted. It may be emitted multiple times for each socket.
A typical use case is to append received lines to a common text file, which is later used by software (such as Wireshark) to decrypt the traffic:
// ...
https.globalAgent.on('keylog', (line, tlsSocket) => {
  fs.appendFileSync('/tmp/ssl-keys.log', line, { mode: 0o600 });
});
copy
Class: https.Server
#
Added in: v0.3.4
Extends: <tls.Server>
See http.Server for more information.
server.close([callback])
#
Added in: v0.1.90
callback <Function>
Returns: <https.Server>
See server.close() in the node:http module.
server[Symbol.asyncDispose]()
#
History













Calls server.close() and returns a promise that fulfills when the server has closed.
server.closeAllConnections()
#
Added in: v18.2.0
See server.closeAllConnections() in the node:http module.
server.closeIdleConnections()
#
Added in: v18.2.0
See server.closeIdleConnections() in the node:http module.
server.headersTimeout
#
Added in: v11.3.0
<number> Default: 60000
See server.headersTimeout in the node:http module.
server.listen()
#
Starts the HTTPS server listening for encrypted connections. This method is identical to server.listen() from net.Server.
server.maxHeadersCount
#
<number> Default: 2000
See server.maxHeadersCount in the node:http module.
server.requestTimeout
#
History













<number> Default: 300000
See server.requestTimeout in the node:http module.
server.setTimeout([msecs][, callback])
#
Added in: v0.11.2
msecs <number> Default: 120000 (2 minutes)
callback <Function>
Returns: <https.Server>
See server.setTimeout() in the node:http module.
server.timeout
#
History













<number> Default: 0 (no timeout)
See server.timeout in the node:http module.
server.keepAliveTimeout
#
Added in: v8.0.0
<number> Default: 5000 (5 seconds)
See server.keepAliveTimeout in the node:http module.
https.createServer([options][, requestListener])
#
Added in: v0.3.4
options <Object> Accepts options from tls.createServer(), tls.createSecureContext() and http.createServer().
requestListener <Function> A listener to be added to the 'request' event.
Returns: <https.Server>
// curl -k https://localhost:8000/
const https = require('node:https');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
copy
Or
const https = require('node:https');
const fs = require('node:fs');

const options = {
  pfx: fs.readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
copy
To generate the certificate and key for this example, run:
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
copy
Then, to generate the pfx certificate for this example, run:
openssl pkcs12 -certpbe AES-256-CBC -export -out test_cert.pfx \
  -inkey private-key.pem -in certificate.pem -passout pass:sample
copy
https.get(options[, callback])
#
https.get(url[, options][, callback])
#
History

















url <string> | <URL>
options <Object> | <string> | <URL> Accepts the same options as https.request(), with the method set to GET by default.
callback <Function>
Returns: <http.ClientRequest>
Like http.get() but for HTTPS.
options can be an object, a string, or a URL object. If options is a string, it is automatically parsed with new URL(). If it is a URL object, it will be automatically converted to an ordinary options object.
const https = require('node:https');

https.get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
copy
https.globalAgent
#
History













Global instance of https.Agent for all HTTPS client requests. Diverges from a default https.Agent configuration by having keepAlive enabled and a timeout of 5 seconds.
https.request(options[, callback])
#
https.request(url[, options][, callback])
#
History

































url <string> | <URL>
options <Object> | <string> | <URL> Accepts all options from http.request(), with some differences in default values:
protocol Default: 'https:'
port Default: 443
agent Default: https.globalAgent
callback <Function>
Returns: <http.ClientRequest>
Makes a request to a secure web server.
The following additional options from tls.connect() are also accepted: ca, cert, ciphers, clientCertEngine (deprecated), crl, dhparam, ecdhCurve, honorCipherOrder, key, passphrase, pfx, rejectUnauthorized, secureOptions, secureProtocol, servername, sessionIdContext, highWaterMark.
options can be an object, a string, or a URL object. If options is a string, it is automatically parsed with new URL(). If it is a URL object, it will be automatically converted to an ordinary options object.
https.request() returns an instance of the http.ClientRequest class. The ClientRequest instance is a writable stream. If one needs to upload a file with a POST request, then write to the ClientRequest object.
const https = require('node:https');

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
copy
Example using options from tls.connect():
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};
options.agent = new https.Agent(options);

const req = https.request(options, (res) => {
  // ...
});
copy
Alternatively, opt out of connection pooling by not using an Agent.
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  agent: false,
};

const req = https.request(options, (res) => {
  // ...
});
copy
Example using a URL as options:
const options = new URL('https://abc:xyz@example.com');

const req = https.request(options, (res) => {
  // ...
});
copy
Example pinning on certificate fingerprint, or the public key (similar to pin-sha256):
const tls = require('node:tls');
const https = require('node:https');
const crypto = require('node:crypto');

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = tls.checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      hash = crypto.createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new https.Agent(options);
const req = https.request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
copy
Outputs for example:
Subject Common Name: github.com
  Certificate SHA256 fingerprint: FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65
  Public key ping-sha256: SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=
Subject Common Name: Sectigo ECC Domain Validation Secure Server CA
  Certificate SHA256 fingerprint: 61:E9:73:75:E9:F6:DA:98:2F:F5:C1:9E:2F:94:E6:6C:4E:35:B6:83:7C:E3:B9:14:D2:24:5C:7F:5F:65:82:5F
  Public key ping-sha256: Eep0p/AsSa9lFUH6KT2UY+9s1Z8v7voAPkQ4fGknZ2g=
Subject Common Name: USERTrust ECC Certification Authority
  Certificate SHA256 fingerprint: A6:CF:64:DB:B4:C8:D5:FD:19:CE:48:89:60:68:DB:03:B5:33:A8:D1:33:6C:62:56:A8:7D:00:CB:B3:DE:F3:EA
  Public key ping-sha256: UJM2FOhG9aTNY0Pg4hgqjNzZ/lQBiMGRxPD5Y2/e0bw=
Subject Common Name: AAA Certificate Services
  Certificate SHA256 fingerprint: D7:A7:A0:FB:5D:7E:27:31:D7:71:E9:48:4E:BC:DE:F7:1D:5F:0C:3E:0A:29:48:78:2B:C8:3E:E0:EA:69:9E:F4
  Public key ping-sha256: vRU+17BDT2iGsXvOi76E7TQMcTLXAqj0+jGPdW7L1vM=
All OK. Server matched our pinned cert or public key
statusCode: 200
copy
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Inspector
Promises API
Class: inspector.Session
new inspector.Session()
Event: 'inspectorNotification'
Event: <inspector-protocol-method>;
session.connect()
session.connectToMainThread()
session.disconnect()
session.post(method[, params])
Example usage
CPU profiler
Heap profiler
Callback API
Class: inspector.Session
new inspector.Session()
Event: 'inspectorNotification'
Event: <inspector-protocol-method>;
session.connect()
session.connectToMainThread()
session.disconnect()
session.post(method[, params][, callback])
Example usage
CPU profiler
Heap profiler
Common Objects
inspector.close()
inspector.console
inspector.open([port[, host[, wait]]])
inspector.url()
inspector.waitForDebugger()
Integration with DevTools
inspector.Network.dataReceived([params])
inspector.Network.dataSent([params])
inspector.Network.requestWillBeSent([params])
inspector.Network.responseReceived([params])
inspector.Network.loadingFinished([params])
inspector.Network.loadingFailed([params])
Support of breakpoints
Inspector
#
Stability: 2 - Stable
Source Code: lib/inspector.js
The node:inspector module provides an API for interacting with the V8 inspector.
It can be accessed using:
const inspector = require('node:inspector/promises');
copy
or
const inspector = require('node:inspector');
copy
Promises API
#
Added in: v19.0.0
Stability: 1 - Experimental
Class: inspector.Session
#
Extends: <EventEmitter>
The inspector.Session is used for dispatching messages to the V8 inspector back-end and receiving message responses and notifications.
new inspector.Session()
#
Added in: v8.0.0
Create a new instance of the inspector.Session class. The inspector session needs to be connected through session.connect() before the messages can be dispatched to the inspector backend.
When using Session, the object outputted by the console API will not be released, unless we performed manually Runtime.DiscardConsoleEntries command.
Event: 'inspectorNotification'
#
Added in: v8.0.0
<Object> The notification message object
Emitted when any notification from the V8 Inspector is received.
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
copy
Caveat Breakpoints with same-thread session is not recommended, see support of breakpoints.
It is also possible to subscribe only to notifications with specific method:
Event: <inspector-protocol-method>;
#
Added in: v8.0.0
<Object> The notification message object
Emitted when an inspector notification is received that has its method field set to the <inspector-protocol-method> value.
The following snippet installs a listener on the 'Debugger.paused' event, and prints the reason for program suspension whenever program execution is suspended (through breakpoints, for example):
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
copy
Caveat Breakpoints with same-thread session is not recommended, see support of breakpoints.
session.connect()
#
Added in: v8.0.0
Connects a session to the inspector back-end.
session.connectToMainThread()
#
Added in: v12.11.0
Connects a session to the main thread inspector back-end. An exception will be thrown if this API was not called on a Worker thread.
session.disconnect()
#
Added in: v8.0.0
Immediately close the session. All pending message callbacks will be called with an error. session.connect() will need to be called to be able to send messages again. Reconnected session will lose all inspector state, such as enabled agents or configured breakpoints.
session.post(method[, params])
#
Added in: v19.0.0
method <string>
params <Object>
Returns: <Promise>
Posts a message to the inspector back-end.
import { Session } from 'node:inspector/promises';
try {
  const session = new Session();
  session.connect();
  const result = await session.post('Runtime.evaluate', { expression: '2 + 2' });
  console.log(result);
} catch (error) {
  console.error(error);
}
// Output: { result: { type: 'number', value: 4, description: '4' } }
copy
The latest version of the V8 inspector protocol is published on the Chrome DevTools Protocol Viewer.
Node.js inspector supports all the Chrome DevTools Protocol domains declared by V8. Chrome DevTools Protocol domain provides an interface for interacting with one of the runtime agents used to inspect the application state and listen to the run-time events.
Example usage
#
Apart from the debugger, various V8 Profilers are available through the DevTools protocol.
CPU profiler
#
Here's an example showing how to use the CPU Profiler:
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();
session.connect();

await session.post('Profiler.enable');
await session.post('Profiler.start');
// Invoke business logic under measurement here...

// some time later...
const { profile } = await session.post('Profiler.stop');

// Write profile to disk, upload, etc.
fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
copy
Heap profiler
#
Here's an example showing how to use the Heap Profiler:
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

const result = await session.post('HeapProfiler.takeHeapSnapshot', null);
console.log('HeapProfiler.takeHeapSnapshot done:', result);
session.disconnect();
fs.closeSync(fd);
copy
Callback API
#
Class: inspector.Session
#
Extends: <EventEmitter>
The inspector.Session is used for dispatching messages to the V8 inspector back-end and receiving message responses and notifications.
new inspector.Session()
#
Added in: v8.0.0
Create a new instance of the inspector.Session class. The inspector session needs to be connected through session.connect() before the messages can be dispatched to the inspector backend.
When using Session, the object outputted by the console API will not be released, unless we performed manually Runtime.DiscardConsoleEntries command.
Event: 'inspectorNotification'
#
Added in: v8.0.0
<Object> The notification message object
Emitted when any notification from the V8 Inspector is received.
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
copy
Caveat Breakpoints with same-thread session is not recommended, see support of breakpoints.
It is also possible to subscribe only to notifications with specific method:
Event: <inspector-protocol-method>;
#
Added in: v8.0.0
<Object> The notification message object
Emitted when an inspector notification is received that has its method field set to the <inspector-protocol-method> value.
The following snippet installs a listener on the 'Debugger.paused' event, and prints the reason for program suspension whenever program execution is suspended (through breakpoints, for example):
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
copy
Caveat Breakpoints with same-thread session is not recommended, see support of breakpoints.
session.connect()
#
Added in: v8.0.0
Connects a session to the inspector back-end.
session.connectToMainThread()
#
Added in: v12.11.0
Connects a session to the main thread inspector back-end. An exception will be thrown if this API was not called on a Worker thread.
session.disconnect()
#
Added in: v8.0.0
Immediately close the session. All pending message callbacks will be called with an error. session.connect() will need to be called to be able to send messages again. Reconnected session will lose all inspector state, such as enabled agents or configured breakpoints.
session.post(method[, params][, callback])
#
History













method <string>
params <Object>
callback <Function>
Posts a message to the inspector back-end. callback will be notified when a response is received. callback is a function that accepts two optional arguments: error and message-specific result.
session.post('Runtime.evaluate', { expression: '2 + 2' },
             (error, { result }) => console.log(result));
// Output: { type: 'number', value: 4, description: '4' }
copy
The latest version of the V8 inspector protocol is published on the Chrome DevTools Protocol Viewer.
Node.js inspector supports all the Chrome DevTools Protocol domains declared by V8. Chrome DevTools Protocol domain provides an interface for interacting with one of the runtime agents used to inspect the application state and listen to the run-time events.
You can not set reportProgress to true when sending a HeapProfiler.takeHeapSnapshot or HeapProfiler.stopTrackingHeapObjects command to V8.
Example usage
#
Apart from the debugger, various V8 Profilers are available through the DevTools protocol.
CPU profiler
#
Here's an example showing how to use the CPU Profiler:
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // Invoke business logic under measurement here...

    // some time later...
    session.post('Profiler.stop', (err, { profile }) => {
      // Write profile to disk, upload, etc.
      if (!err) {
        fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
      }
    });
  });
});
copy
Heap profiler
#
Here's an example showing how to use the Heap Profiler:
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
  console.log('HeapProfiler.takeHeapSnapshot done:', err, r);
  session.disconnect();
  fs.closeSync(fd);
});
copy
Common Objects
#
inspector.close()
#
History













Attempts to close all remaining connections, blocking the event loop until all are closed. Once all connections are closed, deactivates the inspector.
inspector.console
#
<Object> An object to send messages to the remote inspector console.
require('node:inspector').console.log('a message');
copy
The inspector console does not have API parity with Node.js console.
inspector.open([port[, host[, wait]]])
#
History









port <number> Port to listen on for inspector connections. Optional. Default: what was specified on the CLI.
host <string> Host to listen on for inspector connections. Optional. Default: what was specified on the CLI.
wait <boolean> Block until a client has connected. Optional. Default: false.
Returns: <Disposable> A Disposable that calls inspector.close().
Activate inspector on host and port. Equivalent to node --inspect=[[host:]port], but can be done programmatically after node has started.
If wait is true, will block until a client has connected to the inspect port and flow control has been passed to the debugger client.
See the security warning regarding the host parameter usage.
inspector.url()
#
Returns: <string> | <undefined>
Return the URL of the active inspector, or undefined if there is none.
$ node --inspect -p 'inspector.url()'
Debugger listening on ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34
For help, see: https://nodejs.org/en/docs/inspector
ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34

$ node --inspect=localhost:3000 -p 'inspector.url()'
Debugger listening on ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a
For help, see: https://nodejs.org/en/docs/inspector
ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a

$ node -p 'inspector.url()'
undefined
copy
inspector.waitForDebugger()
#
Added in: v12.7.0
Blocks until a client (existing or connected later) has sent Runtime.runIfWaitingForDebugger command.
An exception will be thrown if there is no active inspector.
Integration with DevTools
#
Stability: 1.1 - Active development
The node:inspector module provides an API for integrating with devtools that support Chrome DevTools Protocol. DevTools frontends connected to a running Node.js instance can capture protocol events emitted from the instance and display them accordingly to facilitate debugging. The following methods broadcast a protocol event to all connected frontends. The params passed to the methods can be optional, depending on the protocol.
// The `Network.requestWillBeSent` event will be fired.
inspector.Network.requestWillBeSent({
  requestId: 'request-id-1',
  timestamp: Date.now() / 1000,
  wallTime: Date.now(),
  request: {
    url: 'https://nodejs.org/en',
    method: 'GET',
  },
});
copy
inspector.Network.dataReceived([params])
#
Added in: v24.2.0
params <Object>
This feature is only available with the --experimental-network-inspection flag enabled.
Broadcasts the Network.dataReceived event to connected frontends, or buffers the data if Network.streamResourceContent command was not invoked for the given request yet.
Also enables Network.getResponseBody command to retrieve the response data.
inspector.Network.dataSent([params])
#
Added in: v24.3.0
params <Object>
This feature is only available with the --experimental-network-inspection flag enabled.
Enables Network.getRequestPostData command to retrieve the request data.
inspector.Network.requestWillBeSent([params])
#
Added in: v22.6.0, v20.18.0
params <Object>
This feature is only available with the --experimental-network-inspection flag enabled.
Broadcasts the Network.requestWillBeSent event to connected frontends. This event indicates that the application is about to send an HTTP request.
inspector.Network.responseReceived([params])
#
Added in: v22.6.0, v20.18.0
params <Object>
This feature is only available with the --experimental-network-inspection flag enabled.
Broadcasts the Network.responseReceived event to connected frontends. This event indicates that HTTP response is available.
inspector.Network.loadingFinished([params])
#
Added in: v22.6.0, v20.18.0
params <Object>
This feature is only available with the --experimental-network-inspection flag enabled.
Broadcasts the Network.loadingFinished event to connected frontends. This event indicates that HTTP request has finished loading.
inspector.Network.loadingFailed([params])
#
Added in: v22.7.0, v20.18.0
params <Object>
This feature is only available with the --experimental-network-inspection flag enabled.
Broadcasts the Network.loadingFailed event to connected frontends. This event indicates that HTTP request has failed to load.
Support of breakpoints
#
The Chrome DevTools Protocol Debugger domain allows an inspector.Session to attach to a program and set breakpoints to step through the codes.
However, setting breakpoints with a same-thread inspector.Session, which is connected by session.connect(), should be avoided as the program being attached and paused is exactly the debugger itself. Instead, try connect to the main thread by session.connectToMainThread() and set breakpoints in a worker thread, or connect with a Debugger program over WebSocket connection.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Internationalization support
Options for building Node.js
Disable all internationalization features (none)
Build with a pre-installed ICU (system-icu)
Embed a limited set of ICU data (small-icu)
Providing ICU data at runtime
Embed the entire ICU (full-icu)
Detecting internationalization support
Internationalization support
#
Node.js has many features that make it easier to write internationalized programs. Some of them are:
Locale-sensitive or Unicode-aware functions in the ECMAScript Language Specification:
String.prototype.normalize()
String.prototype.toLowerCase()
String.prototype.toUpperCase()
All functionality described in the ECMAScript Internationalization API Specification (aka ECMA-402):
Intl object
Locale-sensitive methods like String.prototype.localeCompare() and Date.prototype.toLocaleString()
The WHATWG URL parser's internationalized domain names (IDNs) support
require('node:buffer').transcode()
More accurate REPL line editing
require('node:util').TextDecoder
RegExp Unicode Property Escapes
Node.js and the underlying V8 engine use International Components for Unicode (ICU) to implement these features in native C/C++ code. The full ICU data set is provided by Node.js by default. However, due to the size of the ICU data file, several options are provided for customizing the ICU data set either when building or running Node.js.
Options for building Node.js
#
To control how ICU is used in Node.js, four configure options are available during compilation. Additional details on how to compile Node.js are documented in BUILDING.md.
--with-intl=none/--without-intl
--with-intl=system-icu
--with-intl=small-icu
--with-intl=full-icu (default)
An overview of available Node.js and JavaScript features for each configure option:
Feature
none
system-icu
small-icu
full-icu
String.prototype.normalize()
none (function is no-op)
full
full
full
String.prototype.to*Case()
full
full
full
full
Intl
none (object does not exist)
partial/full (depends on OS)
partial (English-only)
full
String.prototype.localeCompare()
partial (not locale-aware)
full
full
full
String.prototype.toLocale*Case()
partial (not locale-aware)
full
full
full
Number.prototype.toLocaleString()
partial (not locale-aware)
partial/full (depends on OS)
partial (English-only)
full
Date.prototype.toLocale*String()
partial (not locale-aware)
partial/full (depends on OS)
partial (English-only)
full
Legacy URL Parser
partial (no IDN support)
full
full
full
WHATWG URL Parser
partial (no IDN support)
full
full
full
require('node:buffer').transcode()
none (function does not exist)
full
full
full
REPL
partial (inaccurate line editing)
full
full
full
require('node:util').TextDecoder
partial (basic encodings support)
partial/full (depends on OS)
partial (Unicode-only)
full
RegExp Unicode Property Escapes
none (invalid RegExp error)
full
full
full

The "(not locale-aware)" designation denotes that the function carries out its operation just like the non-Locale version of the function, if one exists. For example, under none mode, Date.prototype.toLocaleString()'s operation is identical to that of Date.prototype.toString().
Disable all internationalization features (none)
#
If this option is chosen, ICU is disabled and most internationalization features mentioned above will be unavailable in the resulting node binary.
Build with a pre-installed ICU (system-icu)
#
Node.js can link against an ICU build already installed on the system. In fact, most Linux distributions already come with ICU installed, and this option would make it possible to reuse the same set of data used by other components in the OS.
Functionalities that only require the ICU library itself, such as String.prototype.normalize() and the WHATWG URL parser, are fully supported under system-icu. Features that require ICU locale data in addition, such as Intl.DateTimeFormat may be fully or partially supported, depending on the completeness of the ICU data installed on the system.
Embed a limited set of ICU data (small-icu)
#
This option makes the resulting binary link against the ICU library statically, and includes a subset of ICU data (typically only the English locale) within the node executable.
Functionalities that only require the ICU library itself, such as String.prototype.normalize() and the WHATWG URL parser, are fully supported under small-icu. Features that require ICU locale data in addition, such as Intl.DateTimeFormat, generally only work with the English locale:
const january = new Date(9e8);
const english = new Intl.DateTimeFormat('en', { month: 'long' });
const spanish = new Intl.DateTimeFormat('es', { month: 'long' });

console.log(english.format(january));
// Prints "January"
console.log(spanish.format(january));
// Prints either "M01" or "January" on small-icu, depending on the user’s default locale
// Should print "enero"
copy
This mode provides a balance between features and binary size.
Providing ICU data at runtime
#
If the small-icu option is used, one can still provide additional locale data at runtime so that the JS methods would work for all ICU locales. Assuming the data file is stored at /runtime/directory/with/dat/file, it can be made available to ICU through either:
The --with-icu-default-data-dir configure option:
./configure --with-icu-default-data-dir=/runtime/directory/with/dat/file --with-intl=small-icu
copy
This only embeds the default data directory path into the binary. The actual data file is going to be loaded at runtime from this directory path.
The NODE_ICU_DATA environment variable:
env NODE_ICU_DATA=/runtime/directory/with/dat/file node
copy
The --icu-data-dir CLI parameter:
node --icu-data-dir=/runtime/directory/with/dat/file
copy
When more than one of them is specified, the --icu-data-dir CLI parameter has the highest precedence, then the NODE_ICU_DATA environment variable, then the --with-icu-default-data-dir configure option.
ICU is able to automatically find and load a variety of data formats, but the data must be appropriate for the ICU version, and the file correctly named. The most common name for the data file is icudtX[bl].dat, where X denotes the intended ICU version, and b or l indicates the system's endianness. Node.js would fail to load if the expected data file cannot be read from the specified directory. The name of the data file corresponding to the current Node.js version can be computed with:
`icudt${process.versions.icu.split('.')[0]}${os.endianness()[0].toLowerCase()}.dat`;
copy
Check "ICU Data" article in the ICU User Guide for other supported formats and more details on ICU data in general.
The full-icu npm module can greatly simplify ICU data installation by detecting the ICU version of the running node executable and downloading the appropriate data file. After installing the module through npm i full-icu, the data file will be available at ./node_modules/full-icu. This path can be then passed either to NODE_ICU_DATA or --icu-data-dir as shown above to enable full Intl support.
Embed the entire ICU (full-icu)
#
This option makes the resulting binary link against ICU statically and include a full set of ICU data. A binary created this way has no further external dependencies and supports all locales, but might be rather large. This is the default behavior if no --with-intl flag is passed. The official binaries are also built in this mode.
Detecting internationalization support
#
To verify that ICU is enabled at all (system-icu, small-icu, or full-icu), simply checking the existence of Intl should suffice:
const hasICU = typeof Intl === 'object';
copy
Alternatively, checking for process.versions.icu, a property defined only when ICU is enabled, works too:
const hasICU = typeof process.versions.icu === 'string';
copy
To check for support for a non-English locale (i.e. full-icu or system-icu), Intl.DateTimeFormat can be a good distinguishing factor:
const hasFullICU = (() => {
  try {
    const january = new Date(9e8);
    const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
    return spanish.format(january) === 'enero';
  } catch (err) {
    return false;
  }
})();
copy
For more verbose tests for Intl support, the following resources may be found to be helpful:
btest402: Generally used to check whether Node.js with Intl support is built correctly.
Test262: ECMAScript's official conformance test suite includes a section dedicated to ECMA-402.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Modules: CommonJS modules
Enabling
Accessing the main module
Package manager tips
Loading ECMAScript modules using require()
All together
Caching
Module caching caveats
Built-in modules
Built-in modules with mandatory node: prefix
Cycles
File modules
Folders as modules
Loading from node_modules folders
Loading from the global folders
The module wrapper
The module scope
__dirname
__filename
exports
module
require(id)
require.cache
require.extensions
require.main
require.resolve(request[, options])
require.resolve.paths(request)
The module object
module.children
module.exports
exports shortcut
module.filename
module.id
module.isPreloading
module.loaded
module.parent
module.path
module.paths
module.require(id)
The Module object
Source map v3 support
Modules: CommonJS modules
#
Stability: 2 - Stable
CommonJS modules are the original way to package JavaScript code for Node.js. Node.js also supports the ECMAScript modules standard used by browsers and other JavaScript runtimes.
In Node.js, each file is treated as a separate module. For example, consider a file named foo.js:
const circle = require('./circle.js');
console.log(`The area of a circle of radius 4 is ${circle.area(4)}`);
copy
On the first line, foo.js loads the module circle.js that is in the same directory as foo.js.
Here are the contents of circle.js:
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
copy
The module circle.js has exported the functions area() and circumference(). Functions and objects are added to the root of a module by specifying additional properties on the special exports object.
Variables local to the module will be private, because the module is wrapped in a function by Node.js (see module wrapper). In this example, the variable PI is private to circle.js.
The module.exports property can be assigned a new value (such as a function or object).
In the following code, bar.js makes use of the square module, which exports a Square class:
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`The area of mySquare is ${mySquare.area()}`);
copy
The square module is defined in square.js:
// Assigning to exports will not modify module, must use module.exports
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
copy
The CommonJS module system is implemented in the module core module.
Enabling
#
Node.js has two module systems: CommonJS modules and ECMAScript modules.
By default, Node.js will treat the following as CommonJS modules:
Files with a .cjs extension;
Files with a .js extension when the nearest parent package.json file contains a top-level field "type" with a value of "commonjs".
Files with a .js extension or without an extension, when the nearest parent package.json file doesn't contain a top-level field "type" or there is no package.json in any parent folder; unless the file contains syntax that errors unless it is evaluated as an ES module. Package authors should include the "type" field, even in packages where all sources are CommonJS. Being explicit about the type of the package will make things easier for build tools and loaders to determine how the files in the package should be interpreted.
Files with an extension that is not .mjs, .cjs, .json, .node, or .js (when the nearest parent package.json file contains a top-level field "type" with a value of "module", those files will be recognized as CommonJS modules only if they are being included via require(), not when used as the command-line entry point of the program).
See Determining module system for more details.
Calling require() always use the CommonJS module loader. Calling import() always use the ECMAScript module loader.
Accessing the main module
#
When a file is run directly from Node.js, require.main is set to its module. That means that it is possible to determine whether a file has been run directly by testing require.main === module.
For a file foo.js, this will be true if run via node foo.js, but false if run by require('./foo').
When the entry point is not a CommonJS module, require.main is undefined, and the main module is out of reach.
Package manager tips
#
The semantics of the Node.js require() function were designed to be general enough to support reasonable directory structures. Package manager programs such as dpkg, rpm, and npm will hopefully find it possible to build native packages from Node.js modules without modification.
In the following, we give a suggested directory structure that could work:
Let's say that we wanted to have the folder at /usr/lib/node/<some-package>/<some-version> hold the contents of a specific version of a package.
Packages can depend on one another. In order to install package foo, it may be necessary to install a specific version of package bar. The bar package may itself have dependencies, and in some cases, these may even collide or form cyclic dependencies.
Because Node.js looks up the realpath of any modules it loads (that is, it resolves symlinks) and then looks for their dependencies in node_modules folders, this situation can be resolved with the following architecture:
/usr/lib/node/foo/1.2.3/: Contents of the foo package, version 1.2.3.
/usr/lib/node/bar/4.3.2/: Contents of the bar package that foo depends on.
/usr/lib/node/foo/1.2.3/node_modules/bar: Symbolic link to /usr/lib/node/bar/4.3.2/.
/usr/lib/node/bar/4.3.2/node_modules/*: Symbolic links to the packages that bar depends on.
Thus, even if a cycle is encountered, or if there are dependency conflicts, every module will be able to get a version of its dependency that it can use.
When the code in the foo package does require('bar'), it will get the version that is symlinked into /usr/lib/node/foo/1.2.3/node_modules/bar. Then, when the code in the bar package calls require('quux'), it'll get the version that is symlinked into /usr/lib/node/bar/4.3.2/node_modules/quux.
Furthermore, to make the module lookup process even more optimal, rather than putting packages directly in /usr/lib/node, we could put them in /usr/lib/node_modules/<name>/<version>. Then Node.js will not bother looking for missing dependencies in /usr/node_modules or /node_modules.
In order to make modules available to the Node.js REPL, it might be useful to also add the /usr/lib/node_modules folder to the $NODE_PATH environment variable. Since the module lookups using node_modules folders are all relative, and based on the real path of the files making the calls to require(), the packages themselves can be anywhere.
Loading ECMAScript modules using require()
#
History





















Stability: 1.2 - Release candidate
The .mjs extension is reserved for ECMAScript Modules. See Determining module system section for more info regarding which files are parsed as ECMAScript modules.
require() only supports loading ECMAScript modules that meet the following requirements:
The module is fully synchronous (contains no top-level await); and
One of these conditions are met:
The file has a .mjs extension.
The file has a .js extension, and the closest package.json contains "type": "module"
The file has a .js extension, the closest package.json does not contain "type": "commonjs", and the module contains ES module syntax.
If the ES Module being loaded meets the requirements, require() can load it and return the module namespace object. In this case it is similar to dynamic import() but is run synchronously and returns the name space object directly.
With the following ES Modules:
// distance.mjs
export function distance(a, b) { return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2); }
copy
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}
copy
A CommonJS module can load them with require():
const distance = require('./distance.mjs');
console.log(distance);
// [Module: null prototype] {
//   distance: [Function: distance]
// }

const point = require('./point.mjs');
console.log(point);
// [Module: null prototype] {
//   default: [class Point],
//   __esModule: true,
// }
copy
For interoperability with existing tools that convert ES Modules into CommonJS, which could then load real ES Modules through require(), the returned namespace would contain a __esModule: true property if it has a default export so that consuming code generated by tools can recognize the default exports in real ES Modules. If the namespace already defines __esModule, this would not be added. This property is experimental and can change in the future. It should only be used by tools converting ES modules into CommonJS modules, following existing ecosystem conventions. Code authored directly in CommonJS should avoid depending on it.
When an ES Module contains both named exports and a default export, the result returned by require() is the module namespace object, which places the default export in the .default property, similar to the results returned by import(). To customize what should be returned by require(esm) directly, the ES Module can export the desired value using the string name "module.exports".
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}

// `distance` is lost to CommonJS consumers of this module, unless it's
// added to `Point` as a static property.
export function distance(a, b) { return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2); }
export { Point as 'module.exports' }
copy
const Point = require('./point.mjs');
console.log(Point); // [class Point]

// Named exports are lost when 'module.exports' is used
const { distance } = require('./point.mjs');
console.log(distance); // undefined
copy
Notice in the example above, when the module.exports export name is used, named exports will be lost to CommonJS consumers. To allow CommonJS consumers to continue accessing named exports, the module can make sure that the default export is an object with the named exports attached to it as properties. For example with the example above, distance can be attached to the default export, the Point class, as a static method.
export function distance(a, b) { return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2); }

export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  static distance = distance;
}

export { Point as 'module.exports' }
copy
const Point = require('./point.mjs');
console.log(Point); // [class Point]

const { distance } = require('./point.mjs');
console.log(distance); // [Function: distance]
copy
If the module being require()'d contains top-level await, or the module graph it imports contains top-level await, ERR_REQUIRE_ASYNC_MODULE will be thrown. In this case, users should load the asynchronous module using import().
If --experimental-print-required-tla is enabled, instead of throwing ERR_REQUIRE_ASYNC_MODULE before evaluation, Node.js will evaluate the module, try to locate the top-level awaits, and print their location to help users fix them.
Support for loading ES modules using require() is currently experimental and can be disabled using --no-experimental-require-module. To print where this feature is used, use --trace-require-module.
This feature can be detected by checking if process.features.require_module is true.
All together
#
To get the exact filename that will be loaded when require() is called, use the require.resolve() function.
Putting together all of the above, here is the high-level algorithm in pseudocode of what require() does:
require(X) from module at path Y
1. If X is a core module,
   a. return the core module
   b. STOP
2. If X begins with '/'
   a. set Y to the file system root
3. If X is equal to '.', or X begins with './', '/' or '../'
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
   c. THROW "not found"
4. If X begins with '#'
   a. LOAD_PACKAGE_IMPORTS(X, dirname(Y))
5. LOAD_PACKAGE_SELF(X, dirname(Y))
6. LOAD_NODE_MODULES(X, dirname(Y))
7. THROW "not found"

MAYBE_DETECT_AND_LOAD(X)
1. If X parses as a CommonJS module, load X as a CommonJS module. STOP.
2. Else, if the source code of X can be parsed as ECMAScript module using
  <a href="esm.md#resolver-algorithm-specification">DETECT_MODULE_SYNTAX defined in
  the ESM resolver</a>,
  a. Load X as an ECMAScript module. STOP.
3. THROW the SyntaxError from attempting to parse X as CommonJS in 1. STOP.

LOAD_AS_FILE(X)
1. If X is a file, load X as its file extension format. STOP
2. If X.js is a file,
    a. Find the closest package scope SCOPE to X.
    b. If no scope was found
      1. MAYBE_DETECT_AND_LOAD(X.js)
    c. If the SCOPE/package.json contains "type" field,
      1. If the "type" field is "module", load X.js as an ECMAScript module. STOP.
      2. If the "type" field is "commonjs", load X.js as a CommonJS module. STOP.
    d. MAYBE_DETECT_AND_LOAD(X.js)
3. If X.json is a file, load X.json to a JavaScript Object. STOP
4. If X.node is a file, load X.node as binary addon. STOP

LOAD_INDEX(X)
1. If X/index.js is a file
    a. Find the closest package scope SCOPE to X.
    b. If no scope was found, load X/index.js as a CommonJS module. STOP.
    c. If the SCOPE/package.json contains "type" field,
      1. If the "type" field is "module", load X/index.js as an ECMAScript module. STOP.
      2. Else, load X/index.js as a CommonJS module. STOP.
2. If X/index.json is a file, parse X/index.json to a JavaScript object. STOP
3. If X/index.node is a file, load X/index.node as binary addon. STOP

LOAD_AS_DIRECTORY(X)
1. If X/package.json is a file,
   a. Parse X/package.json, and look for "main" field.
   b. If "main" is a falsy value, GOTO 2.
   c. let M = X + (json main field)
   d. LOAD_AS_FILE(M)
   e. LOAD_INDEX(M)
   f. LOAD_INDEX(X) DEPRECATED
   g. THROW "not found"
2. LOAD_INDEX(X)

LOAD_NODE_MODULES(X, START)
1. let DIRS = NODE_MODULES_PATHS(START)
2. for each DIR in DIRS:
   a. LOAD_PACKAGE_EXPORTS(X, DIR)
   b. LOAD_AS_FILE(DIR/X)
   c. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. let PARTS = path split(START)
2. let I = count of PARTS - 1
3. let DIRS = []
4. while I >= 0,
   a. if PARTS[I] = "node_modules", GOTO d.
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIR + DIRS
   d. let I = I - 1
5. return DIRS + GLOBAL_FOLDERS

LOAD_PACKAGE_IMPORTS(X, DIR)
1. Find the closest package scope SCOPE to DIR.
2. If no scope was found, return.
3. If the SCOPE/package.json "imports" is null or undefined, return.
4. If `--experimental-require-module` is enabled
  a. let CONDITIONS = ["node", "require", "module-sync"]
  b. Else, let CONDITIONS = ["node", "require"]
5. let MATCH = PACKAGE_IMPORTS_RESOLVE(X, pathToFileURL(SCOPE),
  CONDITIONS) <a href="esm.md#resolver-algorithm-specification">defined in the ESM resolver</a>.
6. RESOLVE_ESM_MATCH(MATCH).

LOAD_PACKAGE_EXPORTS(X, DIR)
1. Try to interpret X as a combination of NAME and SUBPATH where the name
   may have a @scope/ prefix and the subpath begins with a slash (`/`).
2. If X does not match this pattern or DIR/NAME/package.json is not a file,
   return.
3. Parse DIR/NAME/package.json, and look for "exports" field.
4. If "exports" is null or undefined, return.
5. If `--experimental-require-module` is enabled
  a. let CONDITIONS = ["node", "require", "module-sync"]
  b. Else, let CONDITIONS = ["node", "require"]
6. let MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(DIR/NAME), "." + SUBPATH,
   `package.json` "exports", CONDITIONS) <a href="esm.md#resolver-algorithm-specification">defined in the ESM resolver</a>.
7. RESOLVE_ESM_MATCH(MATCH)

LOAD_PACKAGE_SELF(X, DIR)
1. Find the closest package scope SCOPE to DIR.
2. If no scope was found, return.
3. If the SCOPE/package.json "exports" is null or undefined, return.
4. If the SCOPE/package.json "name" is not the first segment of X, return.
5. let MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(SCOPE),
   "." + X.slice("name".length), `package.json` "exports", ["node", "require"])
   <a href="esm.md#resolver-algorithm-specification">defined in the ESM resolver</a>.
6. RESOLVE_ESM_MATCH(MATCH)

RESOLVE_ESM_MATCH(MATCH)
1. let RESOLVED_PATH = fileURLToPath(MATCH)
2. If the file at RESOLVED_PATH exists, load RESOLVED_PATH as its extension
   format. STOP
3. THROW "not found"
copy
Caching
#
Modules are cached after the first time they are loaded. This means (among other things) that every call to require('foo') will get exactly the same object returned, if it would resolve to the same file.
Provided require.cache is not modified, multiple calls to require('foo') will not cause the module code to be executed multiple times. This is an important feature. With it, "partially done" objects can be returned, thus allowing transitive dependencies to be loaded even when they would cause cycles.
To have a module execute code multiple times, export a function, and call that function.
Module caching caveats
#
Modules are cached based on their resolved filename. Since modules may resolve to a different filename based on the location of the calling module (loading from node_modules folders), it is not a guarantee that require('foo') will always return the exact same object, if it would resolve to different files.
Additionally, on case-insensitive file systems or operating systems, different resolved filenames can point to the same file, but the cache will still treat them as different modules and will reload the file multiple times. For example, require('./foo') and require('./FOO') return two different objects, irrespective of whether or not ./foo and ./FOO are the same file.
Built-in modules
#
History









Node.js has several modules compiled into the binary. These modules are described in greater detail elsewhere in this documentation.
The built-in modules are defined within the Node.js source and are located in the lib/ folder.
Built-in modules can be identified using the node: prefix, in which case it bypasses the require cache. For instance, require('node:http') will always return the built in HTTP module, even if there is require.cache entry by that name.
Some built-in modules are always preferentially loaded if their identifier is passed to require(). For instance, require('http') will always return the built-in HTTP module, even if there is a file by that name.
The list of all the built-in modules can be retrieved from module.builtinModules. The modules being all listed without the node: prefix, except those that mandate such prefix (as explained in the next section).
Built-in modules with mandatory node: prefix
#
When being loaded by require(), some built-in modules must be requested with the node: prefix. This requirement exists to prevent newly introduced built-in modules from having a conflict with user land packages that already have taken the name. Currently the built-in modules that requires the node: prefix are:
node:sea
node:sqlite
node:test
node:test/reporters
The list of these modules is exposed in module.builtinModules, including the prefix.
Cycles
#
When there are circular require() calls, a module might not have finished executing when it is returned.
Consider this situation:
a.js:
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
copy
b.js:
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
copy
main.js:
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
copy
When main.js loads a.js, then a.js in turn loads b.js. At that point, b.js tries to load a.js. In order to prevent an infinite loop, an unfinished copy of the a.js exports object is returned to the b.js module. b.js then finishes loading, and its exports object is provided to the a.js module.
By the time main.js has loaded both modules, they're both finished. The output of this program would thus be:
$ node main.js
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
copy
Careful planning is required to allow cyclic module dependencies to work correctly within an application.
File modules
#
If the exact filename is not found, then Node.js will attempt to load the required filename with the added extensions: .js, .json, and finally .node. When loading a file that has a different extension (e.g. .cjs), its full name must be passed to require(), including its file extension (e.g. require('./file.cjs')).
.json files are parsed as JSON text files, .node files are interpreted as compiled addon modules loaded with process.dlopen(). Files using any other extension (or no extension at all) are parsed as JavaScript text files. Refer to the Determining module system section to understand what parse goal will be used.
A required module prefixed with '/' is an absolute path to the file. For example, require('/home/marco/foo.js') will load the file at /home/marco/foo.js.
A required module prefixed with './' is relative to the file calling require(). That is, circle.js must be in the same directory as foo.js for require('./circle') to find it.
Without a leading '/', './', or '../' to indicate a file, the module must either be a core module or is loaded from a node_modules folder.
If the given path does not exist, require() will throw a MODULE_NOT_FOUND error.
Folders as modules
#
Stability: 3 - Legacy: Use subpath exports or subpath imports instead.
There are three ways in which a folder may be passed to require() as an argument.
The first is to create a package.json file in the root of the folder, which specifies a main module. An example package.json file might look like this:
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
copy
If this was in a folder at ./some-library, then require('./some-library') would attempt to load ./some-library/lib/some-library.js.
If there is no package.json file present in the directory, or if the "main" entry is missing or cannot be resolved, then Node.js will attempt to load an index.js or index.node file out of that directory. For example, if there was no package.json file in the previous example, then require('./some-library') would attempt to load:
./some-library/index.js
./some-library/index.node
If these attempts fail, then Node.js will report the entire module as missing with the default error:
Error: Cannot find module 'some-library'
copy
In all three above cases, an import('./some-library') call would result in a ERR_UNSUPPORTED_DIR_IMPORT error. Using package subpath exports or subpath imports can provide the same containment organization benefits as folders as modules, and work for both require and import.
Loading from node_modules folders
#
If the module identifier passed to require() is not a built-in module, and does not begin with '/', '../', or './', then Node.js starts at the directory of the current module, and adds /node_modules, and attempts to load the module from that location. Node.js will not append node_modules to a path already ending in node_modules.
If it is not found there, then it moves to the parent directory, and so on, until the root of the file system is reached.
For example, if the file at '/home/ry/projects/foo.js' called require('bar.js'), then Node.js would look in the following locations, in this order:
/home/ry/projects/node_modules/bar.js
/home/ry/node_modules/bar.js
/home/node_modules/bar.js
/node_modules/bar.js
This allows programs to localize their dependencies, so that they do not clash.
It is possible to require specific files or sub modules distributed with a module by including a path suffix after the module name. For instance require('example-module/path/to/file') would resolve path/to/file relative to where example-module is located. The suffixed path follows the same module resolution semantics.
Loading from the global folders
#
If the NODE_PATH environment variable is set to a colon-delimited list of absolute paths, then Node.js will search those paths for modules if they are not found elsewhere.
On Windows, NODE_PATH is delimited by semicolons (;) instead of colons.
NODE_PATH was originally created to support loading modules from varying paths before the current module resolution algorithm was defined.
NODE_PATH is still supported, but is less necessary now that the Node.js ecosystem has settled on a convention for locating dependent modules. Sometimes deployments that rely on NODE_PATH show surprising behavior when people are unaware that NODE_PATH must be set. Sometimes a module's dependencies change, causing a different version (or even a different module) to be loaded as the NODE_PATH is searched.
Additionally, Node.js will search in the following list of GLOBAL_FOLDERS:
1: $HOME/.node_modules
2: $HOME/.node_libraries
3: $PREFIX/lib/node
Where $HOME is the user's home directory, and $PREFIX is the Node.js configured node_prefix.
These are mostly for historic reasons.
It is strongly encouraged to place dependencies in the local node_modules folder. These will be loaded faster, and more reliably.
The module wrapper
#
Before a module's code is executed, Node.js will wrap it with a function wrapper that looks like the following:
(function(exports, require, module, __filename, __dirname) {
// Module code actually lives in here
});
copy
By doing this, Node.js achieves a few things:
It keeps top-level variables (defined with var, const, or let) scoped to the module rather than the global object.
It helps to provide some global-looking variables that are actually specific to the module, such as:
The module and exports objects that the implementor can use to export values from the module.
The convenience variables __filename and __dirname, containing the module's absolute filename and directory path.
The module scope
#
__dirname
#
Added in: v0.1.27
<string>
The directory name of the current module. This is the same as the path.dirname() of the __filename.
Example: running node example.js from /Users/mjr
console.log(__dirname);
// Prints: /Users/mjr
console.log(path.dirname(__filename));
// Prints: /Users/mjr
copy
__filename
#
Added in: v0.0.1
<string>
The file name of the current module. This is the current module file's absolute path with symlinks resolved.
For a main program this is not necessarily the same as the file name used in the command line.
See __dirname for the directory name of the current module.
Examples:
Running node example.js from /Users/mjr
console.log(__filename);
// Prints: /Users/mjr/example.js
console.log(__dirname);
// Prints: /Users/mjr
copy
Given two modules: a and b, where b is a dependency of a and there is a directory structure of:
/Users/mjr/app/a.js
/Users/mjr/app/node_modules/b/b.js
References to __filename within b.js will return /Users/mjr/app/node_modules/b/b.js while references to __filename within a.js will return /Users/mjr/app/a.js.
exports
#
Added in: v0.1.12
<Object>
A reference to the module.exports that is shorter to type. See the section about the exports shortcut for details on when to use exports and when to use module.exports.
module
#
Added in: v0.1.16
<module>
A reference to the current module, see the section about the module object. In particular, module.exports is used for defining what a module exports and makes available through require().
require(id)
#
Added in: v0.1.13
id <string> module name or path
Returns: <any> exported module content
Used to import modules, JSON, and local files. Modules can be imported from node_modules. Local modules and JSON files can be imported using a relative path (e.g. ./, ./foo, ./bar/baz, ../foo) that will be resolved against the directory named by __dirname (if defined) or the current working directory. The relative paths of POSIX style are resolved in an OS independent fashion, meaning that the examples above will work on Windows in the same way they would on Unix systems.
// Importing a local module with a path relative to the `__dirname` or current
// working directory. (On Windows, this would resolve to .\path\myLocalModule.)
const myLocalModule = require('./path/myLocalModule');

// Importing a JSON file:
const jsonData = require('./path/filename.json');

// Importing a module from node_modules or Node.js built-in module:
const crypto = require('node:crypto');
copy
require.cache
#
Added in: v0.3.0
<Object>
Modules are cached in this object when they are required. By deleting a key value from this object, the next require will reload the module. This does not apply to native addons, for which reloading will result in an error.
Adding or replacing entries is also possible. This cache is checked before built-in modules and if a name matching a built-in module is added to the cache, only node:-prefixed require calls are going to receive the built-in module. Use with care!
const assert = require('node:assert');
const realFs = require('node:fs');

const fakeFs = {};
require.cache.fs = { exports: fakeFs };

assert.strictEqual(require('fs'), fakeFs);
assert.strictEqual(require('node:fs'), realFs);
copy
require.extensions
#
Added in: v0.3.0Deprecated since: v0.10.6
Stability: 0 - Deprecated
<Object>
Instruct require on how to handle certain file extensions.
Process files with the extension .sjs as .js:
require.extensions['.sjs'] = require.extensions['.js'];
copy
Deprecated. In the past, this list has been used to load non-JavaScript modules into Node.js by compiling them on-demand. However, in practice, there are much better ways to do this, such as loading modules via some other Node.js program, or compiling them to JavaScript ahead of time.
Avoid using require.extensions. Use could cause subtle bugs and resolving the extensions gets slower with each registered extension.
require.main
#
Added in: v0.1.17
<module> | <undefined>
The Module object representing the entry script loaded when the Node.js process launched, or undefined if the entry point of the program is not a CommonJS module. See "Accessing the main module".
In entry.js script:
console.log(require.main);
copy
node entry.js
copy
Module {
  id: '.',
  path: '/absolute/path/to',
  exports: {},
  filename: '/absolute/path/to/entry.js',
  loaded: false,
  children: [],
  paths:
   [ '/absolute/path/to/node_modules',
     '/absolute/path/node_modules',
     '/absolute/node_modules',
     '/node_modules' ] }
copy
require.resolve(request[, options])
#
History













request <string> The module path to resolve.
options <Object>
paths <string[]> Paths to resolve module location from. If present, these paths are used instead of the default resolution paths, with the exception of GLOBAL_FOLDERS like $HOME/.node_modules, which are always included. Each of these paths is used as a starting point for the module resolution algorithm, meaning that the node_modules hierarchy is checked from this location.
Returns: <string>
Use the internal require() machinery to look up the location of a module, but rather than loading the module, just return the resolved filename.
If the module can not be found, a MODULE_NOT_FOUND error is thrown.
require.resolve.paths(request)
#
Added in: v8.9.0
request <string> The module path whose lookup paths are being retrieved.
Returns: <string[]> | <null>
Returns an array containing the paths searched during resolution of request or null if the request string references a core module, for example http or fs.
The module object
#
Added in: v0.1.16
<Object>
In each module, the module free variable is a reference to the object representing the current module. For convenience, module.exports is also accessible via the exports module-global. module is not actually a global but rather local to each module.
module.children
#
Added in: v0.1.16
<module[]>
The module objects required for the first time by this one.
module.exports
#
Added in: v0.1.16
<Object>
The module.exports object is created by the Module system. Sometimes this is not acceptable; many want their module to be an instance of some class. To do this, assign the desired export object to module.exports. Assigning the desired object to exports will simply rebind the local exports variable, which is probably not what is desired.
For example, suppose we were making a module called a.js:
const EventEmitter = require('node:events');

module.exports = new EventEmitter();

// Do some work, and after some time emit
// the 'ready' event from the module itself.
setTimeout(() => {
  module.exports.emit('ready');
}, 1000);
copy
Then in another file we could do:
const a = require('./a');
a.on('ready', () => {
  console.log('module "a" is ready');
});
copy
Assignment to module.exports must be done immediately. It cannot be done in any callbacks. This does not work:
x.js:
setTimeout(() => {
  module.exports = { a: 'hello' };
}, 0);
copy
y.js:
const x = require('./x');
console.log(x.a);
copy
exports shortcut
#
Added in: v0.1.16
The exports variable is available within a module's file-level scope, and is assigned the value of module.exports before the module is evaluated.
It allows a shortcut, so that module.exports.f = ... can be written more succinctly as exports.f = .... However, be aware that like any variable, if a new value is assigned to exports, it is no longer bound to module.exports:
module.exports.hello = true; // Exported from require of module
exports = { hello: false };  // Not exported, only available in the module
copy
When the module.exports property is being completely replaced by a new object, it is common to also reassign exports:
module.exports = exports = function Constructor() {
  // ... etc.
};
copy
To illustrate the behavior, imagine this hypothetical implementation of require(), which is quite similar to what is actually done by require():
function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // Module code here. In this example, define a function.
    function someFunc() {}
    exports = someFunc;
    // At this point, exports is no longer a shortcut to module.exports, and
    // this module will still export an empty default object.
    module.exports = someFunc;
    // At this point, the module will now export someFunc, instead of the
    // default object.
  })(module, module.exports);
  return module.exports;
}
copy
module.filename
#
Added in: v0.1.16
<string>
The fully resolved filename of the module.
module.id
#
Added in: v0.1.16
<string>
The identifier for the module. Typically this is the fully resolved filename.
module.isPreloading
#
Added in: v15.4.0, v14.17.0
Type: <boolean> true if the module is running during the Node.js preload phase.
module.loaded
#
Added in: v0.1.16
<boolean>
Whether or not the module is done loading, or is in the process of loading.
module.parent
#
Added in: v0.1.16Deprecated since: v14.6.0, v12.19.0
Stability: 0 - Deprecated: Please use require.main and module.children instead.
<module> | <null> | <undefined>
The module that first required this one, or null if the current module is the entry point of the current process, or undefined if the module was loaded by something that is not a CommonJS module (E.G.: REPL or import).
module.path
#
Added in: v11.14.0
<string>
The directory name of the module. This is usually the same as the path.dirname() of the module.id.
module.paths
#
Added in: v0.4.0
<string[]>
The search paths for the module.
module.require(id)
#
Added in: v0.5.1
id <string>
Returns: <any> exported module content
The module.require() method provides a way to load a module as if require() was called from the original module.
In order to do this, it is necessary to get a reference to the module object. Since require() returns the module.exports, and the module is typically only available within a specific module's code, it must be explicitly exported in order to be used.
The Module object
#
This section was moved to Modules: module core module.
module.builtinModules
module.createRequire(filename)
module.syncBuiltinESMExports()
Source map v3 support
#
This section was moved to Modules: module core module.
module.findSourceMap(path)
Class: module.SourceMap
new SourceMap(payload)
sourceMap.payload
sourceMap.findEntry(lineNumber, columnNumber)
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Modules: ECMAScript modules
Introduction
Enabling
Packages
import Specifiers
Terminology
Mandatory file extensions
URLs
file: URLs
data: imports
node: imports
Import attributes
Built-in modules
import() expressions
import.meta
import.meta.dirname
import.meta.filename
import.meta.url
import.meta.main
import.meta.resolve(specifier)
Interoperability with CommonJS
import statements
require
CommonJS Namespaces
Differences between ES modules and CommonJS
No require, exports, or module.exports
No __filename or __dirname
No Addon Loading
No require.main
No require.resolve
No NODE_PATH
No require.extensions
No require.cache
JSON modules
Wasm modules
Wasm Source Phase Imports
Top-level await
Loaders
Resolution and loading algorithm
Features
Resolution algorithm
Resolution Algorithm Specification
Customizing ESM specifier resolution algorithm
Modules: ECMAScript modules
#
History





























































Stability: 2 - Stable
Introduction
#
ECMAScript modules are the official standard format to package JavaScript code for reuse. Modules are defined using a variety of import and export statements.
The following example of an ES module exports a function:
// addTwo.mjs
function addTwo(num) {
  return num + 2;
}

export { addTwo };
copy
The following example of an ES module imports the function from addTwo.mjs:
// app.mjs
import { addTwo } from './addTwo.mjs';

// Prints: 6
console.log(addTwo(4));
copy
Node.js fully supports ECMAScript modules as they are currently specified and provides interoperability between them and its original module format, CommonJS.
Enabling
#
Node.js has two module systems: CommonJS modules and ECMAScript modules.
Authors can tell Node.js to interpret JavaScript as an ES module via the .mjs file extension, the package.json "type" field with a value "module", or the --input-type flag with a value of "module". These are explicit markers of code being intended to run as an ES module.
Inversely, authors can explicitly tell Node.js to interpret JavaScript as CommonJS via the .cjs file extension, the package.json "type" field with a value "commonjs", or the --input-type flag with a value of "commonjs".
When code lacks explicit markers for either module system, Node.js will inspect the source code of a module to look for ES module syntax. If such syntax is found, Node.js will run the code as an ES module; otherwise it will run the module as CommonJS. See Determining module system for more details.
Packages
#
This section was moved to Modules: Packages.
import Specifiers
#
Terminology
#
The specifier of an import statement is the string after the from keyword, e.g. 'node:path' in import { sep } from 'node:path'. Specifiers are also used in export from statements, and as the argument to an import() expression.
There are three types of specifiers:
Relative specifiers like './startup.js' or '../config.mjs'. They refer to a path relative to the location of the importing file. The file extension is always necessary for these.
Bare specifiers like 'some-package' or 'some-package/shuffle'. They can refer to the main entry point of a package by the package name, or a specific feature module within a package prefixed by the package name as per the examples respectively. Including the file extension is only necessary for packages without an "exports" field.
Absolute specifiers like 'file:///opt/nodejs/config.js'. They refer directly and explicitly to a full path.
Bare specifier resolutions are handled by the Node.js module resolution and loading algorithm. All other specifier resolutions are always only resolved with the standard relative URL resolution semantics.
Like in CommonJS, module files within packages can be accessed by appending a path to the package name unless the package's package.json contains an "exports" field, in which case files within packages can only be accessed via the paths defined in "exports".
For details on these package resolution rules that apply to bare specifiers in the Node.js module resolution, see the packages documentation.
Mandatory file extensions
#
A file extension must be provided when using the import keyword to resolve relative or absolute specifiers. Directory indexes (e.g. './startup/index.js') must also be fully specified.
This behavior matches how import behaves in browser environments, assuming a typically configured server.
URLs
#
ES modules are resolved and cached as URLs. This means that special characters must be percent-encoded, such as # with %23 and ? with %3F.
file:, node:, and data: URL schemes are supported. A specifier like 'https://example.com/app.js' is not supported natively in Node.js unless using a custom HTTPS loader.
file: URLs
#
Modules are loaded multiple times if the import specifier used to resolve them has a different query or fragment.
import './foo.mjs?query=1'; // loads ./foo.mjs with query of "?query=1"
import './foo.mjs?query=2'; // loads ./foo.mjs with query of "?query=2"
copy
The volume root may be referenced via /, //, or file:///. Given the differences between URL and path resolution (such as percent encoding details), it is recommended to use url.pathToFileURL when importing a path.
data: imports
#
Added in: v12.10.0
data: URLs are supported for importing with the following MIME types:
text/javascript for ES modules
application/json for JSON
application/wasm for Wasm
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"' with { type: 'json' };
copy
data: URLs only resolve bare specifiers for builtin modules and absolute specifiers. Resolving relative specifiers does not work because data: is not a special scheme. For example, attempting to load ./foo from data:text/javascript,import "./foo"; fails to resolve because there is no concept of relative resolution for data: URLs.
node: imports
#
History













node: URLs are supported as an alternative means to load Node.js builtin modules. This URL scheme allows for builtin modules to be referenced by valid absolute URL strings.
import fs from 'node:fs/promises';
copy
Import attributes
#
History













Import attributes are an inline syntax for module import statements to pass on more information alongside the module specifier.
import fooData from './foo.json' with { type: 'json' };

const { default: barData } =
  await import('./bar.json', { with: { type: 'json' } });
copy
Node.js only supports the type attribute, for which it supports the following values:
Attribute type
Needed for
'json'
JSON modules

The type: 'json' attribute is mandatory when importing JSON modules.
Built-in modules
#
Built-in modules provide named exports of their public API. A default export is also provided which is the value of the CommonJS exports. The default export can be used for, among other things, modifying the named exports. Named exports of built-in modules are updated only by calling module.syncBuiltinESMExports().
import EventEmitter from 'node:events';
const e = new EventEmitter();
copy
import { readFile } from 'node:fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
copy
import fs, { readFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { Buffer } from 'node:buffer';

fs.readFileSync = () => Buffer.from('Hello, ESM');
syncBuiltinESMExports();

fs.readFileSync === readFileSync;
copy
import() expressions
#
Dynamic import() is supported in both CommonJS and ES modules. In CommonJS modules it can be used to load ES modules.
import.meta
#
<Object>
The import.meta meta property is an Object that contains the following properties. It is only supported in ES modules.
import.meta.dirname
#
History













<string> The directory name of the current module.
This is the same as the path.dirname() of the import.meta.filename.
Caveat: only present on file: modules.
import.meta.filename
#
History













<string> The full absolute path and filename of the current module, with symlinks resolved.
This is the same as the url.fileURLToPath() of the import.meta.url.
Caveat only local modules support this property. Modules not using the file: protocol will not provide it.
import.meta.url
#
<string> The absolute file: URL of the module.
This is defined exactly the same as it is in browsers providing the URL of the current module file.
This enables useful patterns such as relative file loading:
import { readFileSync } from 'node:fs';
const buffer = readFileSync(new URL('./data.proto', import.meta.url));
copy
import.meta.main
#
Added in: v24.2.0
Stability: 1.0 - Early development
<boolean> true when the current module is the entry point of the current process; false otherwise.
Equivalent to require.main === module in CommonJS.
Analogous to Python's __name__ == "__main__".
export function foo() {
  return 'Hello, world';
}

function main() {
  const message = foo();
  console.log(message);
}

if (import.meta.main) main();
// `foo` can be imported from another module without possible side-effects from `main`
copy
import.meta.resolve(specifier)
#
History

























Stability: 1.2 - Release candidate
specifier <string> The module specifier to resolve relative to the current module.
Returns: <string> The absolute URL string that the specifier would resolve to.
import.meta.resolve is a module-relative resolution function scoped to each module, returning the URL string.
const dependencyAsset = import.meta.resolve('component-lib/asset.css');
// file:///app/node_modules/component-lib/asset.css
import.meta.resolve('./dep.js');
// file:///app/dep.js
copy
All features of the Node.js module resolution are supported. Dependency resolutions are subject to the permitted exports resolutions within the package.
Caveats:
This can result in synchronous file-system operations, which can impact performance similarly to require.resolve.
This feature is not available within custom loaders (it would create a deadlock).
Non-standard API:
When using the --experimental-import-meta-resolve flag, that function accepts a second argument:
parent <string> | <URL> An optional absolute parent module URL to resolve from. Default: import.meta.url
Interoperability with CommonJS
#
import statements
#
An import statement can reference an ES module or a CommonJS module. import statements are permitted only in ES modules, but dynamic import() expressions are supported in CommonJS for loading ES modules.
When importing CommonJS modules, the module.exports object is provided as the default export. Named exports may be available, provided by static analysis as a convenience for better ecosystem compatibility.
require
#
The CommonJS module require currently only supports loading synchronous ES modules (that is, ES modules that do not use top-level await).
See Loading ECMAScript modules using require() for details.
CommonJS Namespaces
#
History













CommonJS modules consist of a module.exports object which can be of any type.
To support this, when importing CommonJS from an ECMAScript module, a namespace wrapper for the CommonJS module is constructed, which always provides a default export key pointing to the CommonJS module.exports value.
In addition, a heuristic static analysis is performed against the source text of the CommonJS module to get a best-effort static list of exports to provide on the namespace from values on module.exports. This is necessary since these namespaces must be constructed prior to the evaluation of the CJS module.
These CommonJS namespace objects also provide the default export as a 'module.exports' named export, in order to unambiguously indicate that their representation in CommonJS uses this value, and not the namespace value. This mirrors the semantics of the handling of the 'module.exports' export name in require(esm) interop support.
When importing a CommonJS module, it can be reliably imported using the ES module default import or its corresponding sugar syntax:
import { default as cjs } from 'cjs';
// Identical to the above
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
// Prints:
//   <module.exports>
//   true
copy
This Module Namespace Exotic Object can be directly observed either when using import * as m from 'cjs' or a dynamic import:
import * as m from 'cjs';
console.log(m);
console.log(m === await import('cjs'));
// Prints:
//   [Module] { default: <module.exports>, 'module.exports': <module.exports> }
//   true
copy
For better compatibility with existing usage in the JS ecosystem, Node.js in addition attempts to determine the CommonJS named exports of every imported CommonJS module to provide them as separate ES module exports using a static analysis process.
For example, consider a CommonJS module written:
// cjs.cjs
exports.name = 'exported';
copy
The preceding module supports named imports in ES modules:
import { name } from './cjs.cjs';
console.log(name);
// Prints: 'exported'

import cjs from './cjs.cjs';
console.log(cjs);
// Prints: { name: 'exported' }

import * as m from './cjs.cjs';
console.log(m);
// Prints:
//   [Module] {
//     default: { name: 'exported' },
//     'module.exports': { name: 'exported' },
//     name: 'exported'
//   }
copy
As can be seen from the last example of the Module Namespace Exotic Object being logged, the name export is copied off of the module.exports object and set directly on the ES module namespace when the module is imported.
Live binding updates or new exports added to module.exports are not detected for these named exports.
The detection of named exports is based on common syntax patterns but does not always correctly detect named exports. In these cases, using the default import form described above can be a better option.
Named exports detection covers many common export patterns, reexport patterns and build tool and transpiler outputs. See cjs-module-lexer for the exact semantics implemented.
Differences between ES modules and CommonJS
#
No require, exports, or module.exports
#
In most cases, the ES module import can be used to load CommonJS modules.
If needed, a require function can be constructed within an ES module using module.createRequire().
No __filename or __dirname
#
These CommonJS variables are not available in ES modules.
__filename and __dirname use cases can be replicated via import.meta.filename and import.meta.dirname.
No Addon Loading
#
Addons are not currently supported with ES module imports.
They can instead be loaded with module.createRequire() or process.dlopen.
No require.main
#
To replace require.main === module, there is the import.meta.main API.
No require.resolve
#
Relative resolution can be handled via new URL('./local', import.meta.url).
For a complete require.resolve replacement, there is the import.meta.resolve API.
Alternatively module.createRequire() can be used.
No NODE_PATH
#
NODE_PATH is not part of resolving import specifiers. Please use symlinks if this behavior is desired.
No require.extensions
#
require.extensions is not used by import. Module customization hooks can provide a replacement.
No require.cache
#
require.cache is not used by import as the ES module loader has its own separate cache.
JSON modules
#
History









JSON files can be referenced by import:
import packageConfig from './package.json' with { type: 'json' };
copy
The with { type: 'json' } syntax is mandatory; see Import Attributes.
The imported JSON only exposes a default export. There is no support for named exports. A cache entry is created in the CommonJS cache to avoid duplication. The same object is returned in CommonJS if the JSON module has already been imported from the same path.
Wasm modules
#
Stability: 1 - Experimental
Importing both WebAssembly module instances and WebAssembly source phase imports are supported under the --experimental-wasm-modules flag.
Both of these integrations are in line with the ES Module Integration Proposal for WebAssembly.
Instance imports allow any .wasm files to be imported as normal modules, supporting their module imports in turn.
For example, an index.js containing:
import * as M from './library.wasm';
console.log(M);
copy
executed under:
node --experimental-wasm-modules index.mjs
copy
would provide the exports interface for the instantiation of library.wasm.
Wasm Source Phase Imports
#
Added in: v24.0.0
The Source Phase Imports proposal allows the import source keyword combination to import a WebAssembly.Module object directly, instead of getting a module instance already instantiated with its dependencies.
This is useful when needing custom instantiations for Wasm, while still resolving and loading it through the ES module integration.
For example, to create multiple instances of a module, or to pass custom imports into a new instance of library.wasm:
import source libraryModule from './library.wasm';

const instance1 = await WebAssembly.instantiate(libraryModule, importObject1);

const instance2 = await WebAssembly.instantiate(libraryModule, importObject2);
copy
In addition to the static source phase, there is also a dynamic variant of the source phase via the import.source dynamic phase import syntax:
const dynamicLibrary = await import.source('./library.wasm');

const instance = await WebAssembly.instantiate(dynamicLibrary, importObject);
copy
Top-level await
#
Added in: v14.8.0
The await keyword may be used in the top level body of an ECMAScript module.
Assuming an a.mjs with
export const five = await Promise.resolve(5);
copy
And a b.mjs with
import { five } from './a.mjs';

console.log(five); // Logs `5`
copy
node b.mjs # works
copy
If a top level await expression never resolves, the node process will exit with a 13 status code.
import { spawn } from 'node:child_process';
import { execPath } from 'node:process';

spawn(execPath, [
  '--input-type=module',
  '--eval',
  // Never-resolving Promise:
  'await new Promise(() => {})',
]).once('exit', (code) => {
  console.log(code); // Logs `13`
});
copy
Loaders
#
The former Loaders documentation is now at Modules: Customization hooks.
Resolution and loading algorithm
#
Features
#
The default resolver has the following properties:
FileURL-based resolution as is used by ES modules
Relative and absolute URL resolution
No default extensions
No folder mains
Bare specifier package resolution lookup through node_modules
Does not fail on unknown extensions or protocols
Can optionally provide a hint of the format to the loading phase
The default loader has the following properties
Support for builtin module loading via node: URLs
Support for "inline" module loading via data: URLs
Support for file: module loading
Fails on any other URL protocol
Fails on unknown extensions for file: loading (supports only .cjs, .js, and .mjs)
Resolution algorithm
#
The algorithm to load an ES module specifier is given through the ESM_RESOLVE method below. It returns the resolved URL for a module specifier relative to a parentURL.
The resolution algorithm determines the full resolved URL for a module load, along with its suggested module format. The resolution algorithm does not determine whether the resolved URL protocol can be loaded, or whether the file extensions are permitted, instead these validations are applied by Node.js during the load phase (for example, if it was asked to load a URL that has a protocol that is not file:, data: or node:.
The algorithm also tries to determine the format of the file based on the extension (see ESM_FILE_FORMAT algorithm below). If it does not recognize the file extension (eg if it is not .mjs, .cjs, or .json), then a format of undefined is returned, which will throw during the load phase.
The algorithm to determine the module format of a resolved URL is provided by ESM_FILE_FORMAT, which returns the unique module format for any file. The "module" format is returned for an ECMAScript Module, while the "commonjs" format is used to indicate loading through the legacy CommonJS loader. Additional formats such as "addon" can be extended in future updates.
In the following algorithms, all subroutine errors are propagated as errors of these top-level routines unless stated otherwise.
defaultConditions is the conditional environment name array, ["node", "import"].
The resolver can throw the following errors:
Invalid Module Specifier: Module specifier is an invalid URL, package name or package subpath specifier.
Invalid Package Configuration: package.json configuration is invalid or contains an invalid configuration.
Invalid Package Target: Package exports or imports define a target module for the package that is an invalid type or string target.
Package Path Not Exported: Package exports do not define or permit a target subpath in the package for the given module.
Package Import Not Defined: Package imports do not define the specifier.
Module Not Found: The package or module requested does not exist.
Unsupported Directory Import: The resolved path corresponds to a directory, which is not a supported target for module imports.
Resolution Algorithm Specification
#
ESM_RESOLVE(specifier, parentURL)
Let resolved be undefined.
If specifier is a valid URL, then
Set resolved to the result of parsing and reserializing specifier as a URL.
Otherwise, if specifier starts with "/", "./", or "../", then
Set resolved to the URL resolution of specifier relative to parentURL.
Otherwise, if specifier starts with "#", then
Set resolved to the result of PACKAGE_IMPORTS_RESOLVE(specifier, parentURL, defaultConditions).
Otherwise,
Note: specifier is now a bare specifier.
Set resolved the result of PACKAGE_RESOLVE(specifier, parentURL).
Let format be undefined.
If resolved is a "file:" URL, then
If resolved contains any percent encodings of "/" or "\" ("%2F" and "%5C" respectively), then
Throw an Invalid Module Specifier error.
If the file at resolved is a directory, then
Throw an Unsupported Directory Import error.
If the file at resolved does not exist, then
Throw a Module Not Found error.
Set resolved to the real path of resolved, maintaining the same URL querystring and fragment components.
Set format to the result of ESM_FILE_FORMAT(resolved).
Otherwise,
Set format the module format of the content type associated with the URL resolved.
Return format and resolved to the loading phase
PACKAGE_RESOLVE(packageSpecifier, parentURL)
Let packageName be undefined.
If packageSpecifier is an empty string, then
Throw an Invalid Module Specifier error.
If packageSpecifier is a Node.js builtin module name, then
Return the string "node:" concatenated with packageSpecifier.
If packageSpecifier does not start with "@", then
Set packageName to the substring of packageSpecifier until the first "/" separator or the end of the string.
Otherwise,
If packageSpecifier does not contain a "/" separator, then
Throw an Invalid Module Specifier error.
Set packageName to the substring of packageSpecifier until the second "/" separator or the end of the string.
If packageName starts with "." or contains "\" or "%", then
Throw an Invalid Module Specifier error.
Let packageSubpath be "." concatenated with the substring of packageSpecifier from the position at the length of packageName.
Let selfUrl be the result of PACKAGE_SELF_RESOLVE(packageName, packageSubpath, parentURL).
If selfUrl is not undefined, return selfUrl.
While parentURL is not the file system root,
Let packageURL be the URL resolution of "node_modules/" concatenated with packageName, relative to parentURL.
Set parentURL to the parent folder URL of parentURL.
If the folder at packageURL does not exist, then
Continue the next loop iteration.
Let pjson be the result of READ_PACKAGE_JSON(packageURL).
If pjson is not null and pjson.exports is not null or undefined, then
Return the result of PACKAGE_EXPORTS_RESOLVE(packageURL, packageSubpath, pjson.exports, defaultConditions).
Otherwise, if packageSubpath is equal to ".", then
If pjson.main is a string, then
Return the URL resolution of main in packageURL.
Otherwise,
Return the URL resolution of packageSubpath in packageURL.
Throw a Module Not Found error.
PACKAGE_SELF_RESOLVE(packageName, packageSubpath, parentURL)
Let packageURL be the result of LOOKUP_PACKAGE_SCOPE(parentURL).
If packageURL is null, then
Return undefined.
Let pjson be the result of READ_PACKAGE_JSON(packageURL).
If pjson is null or if pjson.exports is null or undefined, then
Return undefined.
If pjson.name is equal to packageName, then
Return the result of PACKAGE_EXPORTS_RESOLVE(packageURL, packageSubpath, pjson.exports, defaultConditions).
Otherwise, return undefined.
PACKAGE_EXPORTS_RESOLVE(packageURL, subpath, exports, conditions)
Note: This function is directly invoked by the CommonJS resolution algorithm.
If exports is an Object with both a key starting with "." and a key not starting with ".", throw an Invalid Package Configuration error.
If subpath is equal to ".", then
Let mainExport be undefined.
If exports is a String or Array, or an Object containing no keys starting with ".", then
Set mainExport to exports.
Otherwise if exports is an Object containing a "." property, then
Set mainExport to exports["."].
If mainExport is not undefined, then
Let resolved be the result of PACKAGE_TARGET_RESOLVE( packageURL, mainExport, null, false, conditions).
If resolved is not null or undefined, return resolved.
Otherwise, if exports is an Object and all keys of exports start with ".", then
Assert: subpath begins with "./".
Let resolved be the result of PACKAGE_IMPORTS_EXPORTS_RESOLVE( subpath, exports, packageURL, false, conditions).
If resolved is not null or undefined, return resolved.
Throw a Package Path Not Exported error.
PACKAGE_IMPORTS_RESOLVE(specifier, parentURL, conditions)
Note: This function is directly invoked by the CommonJS resolution algorithm.
Assert: specifier begins with "#".
If specifier is exactly equal to "#" or starts with "#/", then
Throw an Invalid Module Specifier error.
Let packageURL be the result of LOOKUP_PACKAGE_SCOPE(parentURL).
If packageURL is not null, then
Let pjson be the result of READ_PACKAGE_JSON(packageURL).
If pjson.imports is a non-null Object, then
Let resolved be the result of PACKAGE_IMPORTS_EXPORTS_RESOLVE( specifier, pjson.imports, packageURL, true, conditions).
If resolved is not null or undefined, return resolved.
Throw a Package Import Not Defined error.
PACKAGE_IMPORTS_EXPORTS_RESOLVE(matchKey, matchObj, packageURL, isImports, conditions)
If matchKey ends in "/", then
Throw an Invalid Module Specifier error.
If matchKey is a key of matchObj and does not contain "*", then
Let target be the value of matchObj[matchKey].
Return the result of PACKAGE_TARGET_RESOLVE(packageURL, target, null, isImports, conditions).
Let expansionKeys be the list of keys of matchObj containing only a single "*", sorted by the sorting function PATTERN_KEY_COMPARE which orders in descending order of specificity.
For each key expansionKey in expansionKeys, do
Let patternBase be the substring of expansionKey up to but excluding the first "*" character.
If matchKey starts with but is not equal to patternBase, then
Let patternTrailer be the substring of expansionKey from the index after the first "*" character.
If patternTrailer has zero length, or if matchKey ends with patternTrailer and the length of matchKey is greater than or equal to the length of expansionKey, then
Let target be the value of matchObj[expansionKey].
Let patternMatch be the substring of matchKey starting at the index of the length of patternBase up to the length of matchKey minus the length of patternTrailer.
Return the result of PACKAGE_TARGET_RESOLVE(packageURL, target, patternMatch, isImports, conditions).
Return null.
PATTERN_KEY_COMPARE(keyA, keyB)
Assert: keyA contains only a single "*".
Assert: keyB contains only a single "*".
Let baseLengthA be the index of "*" in keyA.
Let baseLengthB be the index of "*" in keyB.
If baseLengthA is greater than baseLengthB, return -1.
If baseLengthB is greater than baseLengthA, return 1.
If the length of keyA is greater than the length of keyB, return -1.
If the length of keyB is greater than the length of keyA, return 1.
Return 0.
PACKAGE_TARGET_RESOLVE(packageURL, target, patternMatch, isImports, conditions)
If target is a String, then
If target does not start with "./", then
If isImports is false, or if target starts with "../" or "/", or if target is a valid URL, then
Throw an Invalid Package Target error.
If patternMatch is a String, then
Return PACKAGE_RESOLVE(target with every instance of "*" replaced by patternMatch, packageURL + "/").
Return PACKAGE_RESOLVE(target, packageURL + "/").
If target split on "/" or "\" contains any "", ".", "..", or "node_modules" segments after the first "." segment, case insensitive and including percent encoded variants, throw an Invalid Package Target error.
Let resolvedTarget be the URL resolution of the concatenation of packageURL and target.
Assert: packageURL is contained in resolvedTarget.
If patternMatch is null, then
Return resolvedTarget.
If patternMatch split on "/" or "\" contains any "", ".", "..", or "node_modules" segments, case insensitive and including percent encoded variants, throw an Invalid Module Specifier error.
Return the URL resolution of resolvedTarget with every instance of "*" replaced with patternMatch.
Otherwise, if target is a non-null Object, then
If target contains any index property keys, as defined in ECMA-262 6.1.7 Array Index, throw an Invalid Package Configuration error.
For each property p of target, in object insertion order as,
If p equals "default" or conditions contains an entry for p, then
Let targetValue be the value of the p property in target.
Let resolved be the result of PACKAGE_TARGET_RESOLVE( packageURL, targetValue, patternMatch, isImports, conditions).
If resolved is equal to undefined, continue the loop.
Return resolved.
Return undefined.
Otherwise, if target is an Array, then
If _target.length is zero, return null.
For each item targetValue in target, do
Let resolved be the result of PACKAGE_TARGET_RESOLVE( packageURL, targetValue, patternMatch, isImports, conditions), continuing the loop on any Invalid Package Target error.
If resolved is undefined, continue the loop.
Return resolved.
Return or throw the last fallback resolution null return or error.
Otherwise, if target is null, return null.
Otherwise throw an Invalid Package Target error.
ESM_FILE_FORMAT(url)
Assert: url corresponds to an existing file.
If url ends in ".mjs", then
Return "module".
If url ends in ".cjs", then
Return "commonjs".
If url ends in ".json", then
Return "json".
If --experimental-wasm-modules is enabled and url ends in ".wasm", then
Return "wasm".
If --experimental-addon-modules is enabled and url ends in ".node", then
Return "addon".
Let packageURL be the result of LOOKUP_PACKAGE_SCOPE(url).
Let pjson be the result of READ_PACKAGE_JSON(packageURL).
Let packageType be null.
If pjson?.type is "module" or "commonjs", then
Set packageType to pjson.type.
If url ends in ".js", then
If packageType is not null, then
Return packageType.
If the result of DETECT_MODULE_SYNTAX(source) is true, then
Return "module".
Return "commonjs".
If url does not have any extension, then
If packageType is "module" and --experimental-wasm-modules is enabled and the file at url contains the header for a WebAssembly module, then
Return "wasm".
If packageType is not null, then
Return packageType.
If the result of DETECT_MODULE_SYNTAX(source) is true, then
Return "module".
Return "commonjs".
Return undefined (will throw during load phase).
LOOKUP_PACKAGE_SCOPE(url)
Let scopeURL be url.
While scopeURL is not the file system root,
Set scopeURL to the parent URL of scopeURL.
If scopeURL ends in a "node_modules" path segment, return null.
Let pjsonURL be the resolution of "package.json" within scopeURL.
if the file at pjsonURL exists, then
Return scopeURL.
Return null.
READ_PACKAGE_JSON(packageURL)
Let pjsonURL be the resolution of "package.json" within packageURL.
If the file at pjsonURL does not exist, then
Return null.
If the file at packageURL does not parse as valid JSON, then
Throw an Invalid Package Configuration error.
Return the parsed JSON source of the file at pjsonURL.
DETECT_MODULE_SYNTAX(source)
Parse source as an ECMAScript module.
If the parse is successful, then
If source contains top-level await, static import or export statements, or import.meta, return true.
If source contains a top-level lexical declaration (const, let, or class) of any of the CommonJS wrapper variables (require, exports, module, __filename, or __dirname) then return true.
Else return false.
Customizing ESM specifier resolution algorithm
#
Module customization hooks provide a mechanism for customizing the ESM specifier resolution algorithm. An example that provides CommonJS-style resolution for ESM specifiers is commonjs-extension-resolution-loader.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Modules: node:module API
The Module object
module.builtinModules
module.createRequire(filename)
module.findPackageJSON(specifier[, base])
module.isBuiltin(moduleName)
module.register(specifier[, parentURL][, options])
module.registerHooks(options)
module.stripTypeScriptTypes(code[, options])
module.syncBuiltinESMExports()
Module compile cache
module.constants.compileCacheStatus
module.enableCompileCache([cacheDir])
module.flushCompileCache()
module.getCompileCacheDir()
Customization Hooks
Enabling
Chaining
Communication with module customization hooks
Hooks
Asynchronous hooks accepted by module.register()
Synchronous hooks accepted by module.registerHooks()
Conventions of hooks
initialize()
resolve(specifier, context, nextResolve)
load(url, context, nextLoad)
Caveat in the asynchronous load hook
Examples
Import from HTTPS
Transpilation
Asynchronous version
Synchronous version
Running hooks
Import maps
Asynchronous version
Synchronous version
Using the hooks
Source Map Support
module.getSourceMapsSupport()
module.findSourceMap(path)
module.setSourceMapsSupport(enabled[, options])
Class: module.SourceMap
new SourceMap(payload[, { lineLengths }])
sourceMap.payload
sourceMap.findEntry(lineOffset, columnOffset)
sourceMap.findOrigin(lineNumber, columnNumber)
Modules: node:module API
#
Added in: v0.3.7
The Module object
#
<Object>
Provides general utility methods when interacting with instances of Module, the module variable often seen in CommonJS modules. Accessed via import 'node:module' or require('node:module').
module.builtinModules
#
History













<string[]>
A list of the names of all modules provided by Node.js. Can be used to verify if a module is maintained by a third party or not.
module in this context isn't the same object that's provided by the module wrapper. To access it, require the Module module:
// module.cjs
// In a CommonJS module
const builtin = require('node:module').builtinModules;
copy
module.createRequire(filename)
#
Added in: v12.2.0
filename <string> | <URL> Filename to be used to construct the require function. Must be a file URL object, file URL string, or absolute path string.
Returns: <require> Require function
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js is a CommonJS module.
const siblingModule = require('./sibling-module');
copy
module.findPackageJSON(specifier[, base])
#
Added in: v23.2.0, v22.14.0
Stability: 1.1 - Active Development
specifier <string> | <URL> The specifier for the module whose package.json to retrieve. When passing a bare specifier, the package.json at the root of the package is returned. When passing a relative specifier or an absolute specifier, the closest parent package.json is returned.
base <string> | <URL> The absolute location (file: URL string or FS path) of the containing module. For CJS, use __filename (not __dirname!); for ESM, use import.meta.url. You do not need to pass it if specifier is an absolute specifier.
Returns: <string> | <undefined> A path if the package.json is found. When specifier is a package, the package's root package.json; when a relative or unresolved, the closest package.json to the specifier.
Caveat: Do not use this to try to determine module format. There are many things affecting that determination; the type field of package.json is the least definitive (ex file extension supersedes it, and a loader hook supersedes that).
Caveat: This currently leverages only the built-in default resolver; if resolve customization hooks are registered, they will not affect the resolution. This may change in the future.
/path/to/project
  ├ packages/
    ├ bar/
      ├ bar.js
      └ package.json // name = '@foo/bar'
    └ qux/
      ├ node_modules/
        └ some-package/
          └ package.json // name = 'some-package'
      ├ qux.js
      └ package.json // name = '@foo/qux'
  ├ main.js
  └ package.json // name = '@foo'
copy
// /path/to/project/packages/bar/bar.js
const { findPackageJSON } = require('node:module');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

findPackageJSON('..', __filename);
// '/path/to/project/package.json'
// Same result when passing an absolute specifier instead:
findPackageJSON(pathToFileURL(path.join(__dirname, '..')));

findPackageJSON('some-package', __filename);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// When passing an absolute specifier, you might get a different result if the
// resolved module is inside a subfolder that has nested `package.json`.
findPackageJSON(pathToFileURL(require.resolve('some-package')));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', __filename);
// '/path/to/project/packages/qux/package.json'
copy
module.isBuiltin(moduleName)
#
Added in: v18.6.0, v16.17.0
moduleName <string> name of the module
Returns: <boolean> returns true if the module is builtin else returns false
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false
copy
module.register(specifier[, parentURL][, options])
#
History

















Stability: 1.2 - Release candidate
specifier <string> | <URL> Customization hooks to be registered; this should be the same string that would be passed to import(), except that if it is relative, it is resolved relative to parentURL.
parentURL <string> | <URL> If you want to resolve specifier relative to a base URL, such as import.meta.url, you can pass that URL here. Default: 'data:'
options <Object>
parentURL <string> | <URL> If you want to resolve specifier relative to a base URL, such as import.meta.url, you can pass that URL here. This property is ignored if the parentURL is supplied as the second argument. Default: 'data:'
data <any> Any arbitrary, cloneable JavaScript value to pass into the initialize hook.
transferList <Object[]> transferable objects to be passed into the initialize hook.
Register a module that exports hooks that customize Node.js module resolution and loading behavior. See Customization hooks.
This feature requires --allow-worker if used with the Permission Model.
module.registerHooks(options)
#
Added in: v23.5.0, v22.15.0
Stability: 1.1 - Active development
options <Object>
load <Function> | <undefined> See load hook. Default: undefined.
resolve <Function> | <undefined> See resolve hook. Default: undefined.
Register hooks that customize Node.js module resolution and loading behavior. See Customization hooks.
module.stripTypeScriptTypes(code[, options])
#
Added in: v23.2.0, v22.13.0
Stability: 1.2 - Release candidate
code <string> The code to strip type annotations from.
options <Object>
mode <string> Default: 'strip'. Possible values are:
'strip' Only strip type annotations without performing the transformation of TypeScript features.
'transform' Strip type annotations and transform TypeScript features to JavaScript.
sourceMap <boolean> Default: false. Only when mode is 'transform', if true, a source map will be generated for the transformed code.
sourceUrl <string> Specifies the source url used in the source map.
Returns: <string> The code with type annotations stripped. module.stripTypeScriptTypes() removes type annotations from TypeScript code. It can be used to strip type annotations from TypeScript code before running it with vm.runInContext() or vm.compileFunction(). By default, it will throw an error if the code contains TypeScript features that require transformation such as Enums, see type-stripping for more information. When mode is 'transform', it also transforms TypeScript features to JavaScript, see transform TypeScript features for more information. When mode is 'strip', source maps are not generated, because locations are preserved. If sourceMap is provided, when mode is 'strip', an error will be thrown.
WARNING: The output of this function should not be considered stable across Node.js versions, due to changes in the TypeScript parser.
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
copy
If sourceUrl is provided, it will be used appended as a comment at the end of the output:
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
copy
When mode is 'transform', the code is transformed to JavaScript:
const { stripTypeScriptTypes } = require('node:module');
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
copy
module.syncBuiltinESMExports()
#
Added in: v12.12.0
The module.syncBuiltinESMExports() method updates all the live bindings for builtin ES Modules to match the properties of the CommonJS exports. It does not add or remove exported names from the ES Modules.
const fs = require('node:fs');
const assert = require('node:assert');
const { syncBuiltinESMExports } = require('node:module');

fs.readFile = newAPI;

delete fs.readFileSync;

function newAPI() {
  // ...
}

fs.newAPI = newAPI;

syncBuiltinESMExports();

import('node:fs').then((esmFS) => {
  // It syncs the existing readFile property with the new value
  assert.strictEqual(esmFS.readFile, newAPI);
  // readFileSync has been deleted from the required fs
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports() does not remove readFileSync from esmFS
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports() does not add names
  assert.strictEqual(esmFS.newAPI, undefined);
});
copy
Module compile cache
#
History













The module compile cache can be enabled either using the module.enableCompileCache() method or the NODE_COMPILE_CACHE=dir environment variable. After it is enabled, whenever Node.js compiles a CommonJS or a ECMAScript Module, it will use on-disk V8 code cache persisted in the specified directory to speed up the compilation. This may slow down the first load of a module graph, but subsequent loads of the same module graph may get a significant speedup if the contents of the modules do not change.
To clean up the generated compile cache on disk, simply remove the cache directory. The cache directory will be recreated the next time the same directory is used for for compile cache storage. To avoid filling up the disk with stale cache, it is recommended to use a directory under the os.tmpdir(). If the compile cache is enabled by a call to module.enableCompileCache() without specifying the directory, Node.js will use the NODE_COMPILE_CACHE=dir environment variable if it's set, or defaults to path.join(os.tmpdir(), 'node-compile-cache') otherwise. To locate the compile cache directory used by a running Node.js instance, use module.getCompileCacheDir().
Currently when using the compile cache with V8 JavaScript code coverage, the coverage being collected by V8 may be less precise in functions that are deserialized from the code cache. It's recommended to turn this off when running tests to generate precise coverage.
The enabled module compile cache can be disabled by the NODE_DISABLE_COMPILE_CACHE=1 environment variable. This can be useful when the compile cache leads to unexpected or undesired behaviors (e.g. less precise test coverage).
Compilation cache generated by one version of Node.js can not be reused by a different version of Node.js. Cache generated by different versions of Node.js will be stored separately if the same base directory is used to persist the cache, so they can co-exist.
At the moment, when the compile cache is enabled and a module is loaded afresh, the code cache is generated from the compiled code immediately, but will only be written to disk when the Node.js instance is about to exit. This is subject to change. The module.flushCompileCache() method can be used to ensure the accumulated code cache is flushed to disk in case the application wants to spawn other Node.js instances and let them share the cache long before the parent exits.
module.constants.compileCacheStatus
#
Added in: v22.8.0
Stability: 1.1 - Active Development
The following constants are returned as the status field in the object returned by module.enableCompileCache() to indicate the result of the attempt to enable the module compile cache.
Constant
Description
ENABLED
Node.js has enabled the compile cache successfully. The directory used to store the compile cache will be returned in the directory field in the returned object.
ALREADY_ENABLED
The compile cache has already been enabled before, either by a previous call to module.enableCompileCache(), or by the NODE_COMPILE_CACHE=dir environment variable. The directory used to store the compile cache will be returned in the directory field in the returned object.
FAILED
Node.js fails to enable the compile cache. This can be caused by the lack of permission to use the specified directory, or various kinds of file system errors. The detail of the failure will be returned in the message field in the returned object.
DISABLED
Node.js cannot enable the compile cache because the environment variable NODE_DISABLE_COMPILE_CACHE=1 has been set.

module.enableCompileCache([cacheDir])
#
Added in: v22.8.0
Stability: 1.1 - Active Development
cacheDir <string> | <undefined> Optional path to specify the directory where the compile cache will be stored/retrieved.
Returns: <Object>
status <integer> One of the module.constants.compileCacheStatus
message <string> | <undefined> If Node.js cannot enable the compile cache, this contains the error message. Only set if status is module.constants.compileCacheStatus.FAILED.
directory <string> | <undefined> If the compile cache is enabled, this contains the directory where the compile cache is stored. Only set if status is module.constants.compileCacheStatus.ENABLED or module.constants.compileCacheStatus.ALREADY_ENABLED.
Enable module compile cache in the current Node.js instance.
If cacheDir is not specified, Node.js will either use the directory specified by the NODE_COMPILE_CACHE=dir environment variable if it's set, or use path.join(os.tmpdir(), 'node-compile-cache') otherwise. For general use cases, it's recommended to call module.enableCompileCache() without specifying the cacheDir, so that the directory can be overridden by the NODE_COMPILE_CACHE environment variable when necessary.
Since compile cache is supposed to be a quiet optimization that is not required for the application to be functional, this method is designed to not throw any exception when the compile cache cannot be enabled. Instead, it will return an object containing an error message in the message field to aid debugging. If compile cache is enabled successfully, the directory field in the returned object contains the path to the directory where the compile cache is stored. The status field in the returned object would be one of the module.constants.compileCacheStatus values to indicate the result of the attempt to enable the module compile cache.
This method only affects the current Node.js instance. To enable it in child worker threads, either call this method in child worker threads too, or set the process.env.NODE_COMPILE_CACHE value to compile cache directory so the behavior can be inherited into the child workers. The directory can be obtained either from the directory field returned by this method, or with module.getCompileCacheDir().
module.flushCompileCache()
#
Added in: v23.0.0, v22.10.0
Stability: 1.1 - Active Development
Flush the module compile cache accumulated from modules already loaded in the current Node.js instance to disk. This returns after all the flushing file system operations come to an end, no matter they succeed or not. If there are any errors, this will fail silently, since compile cache misses should not interfere with the actual operation of the application.
module.getCompileCacheDir()
#
Added in: v22.8.0
Stability: 1.1 - Active Development
Returns: <string> | <undefined> Path to the module compile cache directory if it is enabled, or undefined otherwise.
Customization Hooks
#
History

























Stability: 1.2 - Release candidate (asynchronous version) Stability: 1.1 - Active development (synchronous version)
There are two types of module customization hooks that are currently supported:
module.register(specifier[, parentURL][, options]) which takes a module that exports asynchronous hook functions. The functions are run on a separate loader thread.
module.registerHooks(options) which takes synchronous hook functions that are run directly on the thread where the module is loaded.
Enabling
#
Module resolution and loading can be customized by:
Registering a file which exports a set of asynchronous hook functions, using the register method from node:module,
Registering a set of synchronous hook functions using the registerHooks method from node:module.
The hooks can be registered before the application code is run by using the --import or --require flag:
node --import ./register-hooks.js ./my-app.js
node --require ./register-hooks.js ./my-app.js
copy
// register-hooks.js
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
// Use module.register() to register asynchronous hooks in a dedicated thread.
register('./hooks.mjs', pathToFileURL(__filename));
copy
// Use module.registerHooks() to register synchronous hooks in the main thread.
const { registerHooks } = require('node:module');
registerHooks({
  resolve(specifier, context, nextResolve) { /* implementation */ },
  load(url, context, nextLoad) { /* implementation */ },
});
copy
The file passed to --import or --require can also be an export from a dependency:
node --import some-package/register ./my-app.js
node --require some-package/register ./my-app.js
copy
Where some-package has an "exports" field defining the /register export to map to a file that calls register(), like the following register-hooks.js example.
Using --import or --require ensures that the hooks are registered before any application files are imported, including the entry point of the application and for any worker threads by default as well.
Alternatively, register() and registerHooks() can be called from the entry point, though dynamic import() must be used for any ESM code that should be run after the hooks are registered.
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

register('http-to-https', pathToFileURL(__filename));

// Because this is a dynamic `import()`, the `http-to-https` hooks will run
// to handle `./my-app.js` and any other files it imports or requires.
import('./my-app.js');
copy
Customization hooks will run for any modules loaded later than the registration and the modules they reference via import and the built-in require. require function created by users using module.createRequire() can only be customized by the synchronous hooks.
In this example, we are registering the http-to-https hooks, but they will only be available for subsequently imported modules — in this case, my-app.js and anything it references via import or built-in require in CommonJS dependencies.
If the import('./my-app.js') had instead been a static import './my-app.js', the app would have already been loaded before the http-to-https hooks were registered. This due to the ES modules specification, where static imports are evaluated from the leaves of the tree first, then back to the trunk. There can be static imports within my-app.js, which will not be evaluated until my-app.js is dynamically imported.
If synchronous hooks are used, both import, require and user require created using createRequire() are supported.
const { register, registerHooks } = require('node:module');
const { pathToFileURL } = require('node:url');

registerHooks({ /* implementation of synchronous hooks */ });

const userRequire = createRequire(__filename);

// The synchronous hooks affect import, require() and user require() function
// created through createRequire().
import('./my-app.js');
require('./my-app-2.js');
userRequire('./my-app-3.js');
copy
Finally, if all you want to do is register hooks before your app runs and you don't want to create a separate file for that purpose, you can pass a data: URL to --import:
node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("http-to-https", pathToFileURL("./"));' ./my-app.js
copy
Chaining
#
It's possible to call register more than once:
// entrypoint.cjs
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

const parentURL = pathToFileURL(__filename);
register('./foo.mjs', parentURL);
register('./bar.mjs', parentURL);
import('./my-app.mjs');
copy
In this example, the registered hooks will form chains. These chains run last-in, first out (LIFO). If both foo.mjs and bar.mjs define a resolve hook, they will be called like so (note the right-to-left): node's default ← ./foo.mjs ← ./bar.mjs (starting with ./bar.mjs, then ./foo.mjs, then the Node.js default). The same applies to all the other hooks.
The registered hooks also affect register itself. In this example, bar.mjs will be resolved and loaded via the hooks registered by foo.mjs (because foo's hooks will have already been added to the chain). This allows for things like writing hooks in non-JavaScript languages, so long as earlier registered hooks transpile into JavaScript.
The register method cannot be called from within the module that defines the hooks.
Chaining of registerHooks work similarly. If synchronous and asynchronous hooks are mixed, the synchronous hooks are always run first before the asynchronous hooks start running, that is, in the last synchronous hook being run, its next hook includes invocation of the asynchronous hooks.
// entrypoint.cjs
const { registerHooks } = require('node:module');

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 run before hook1.
registerHooks(hook1);
registerHooks(hook2);
copy
Communication with module customization hooks
#
Asynchronous hooks run on a dedicated thread, separate from the main thread that runs application code. This means mutating global variables won't affect the other thread(s), and message channels must be used to communicate between the threads.
The register method can be used to pass data to an initialize hook. The data passed to the hook may include transferable objects like ports.
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// This example showcases how a message channel can be used to
// communicate with the hooks, by sending `port2` to the hooks.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
copy
Synchronous module hooks are run on the same thread where the application code is run. They can directly mutate the globals of the context accessed by the main thread.
Hooks
#
Asynchronous hooks accepted by module.register()
#
The register method can be used to register a module that exports a set of hooks. The hooks are functions that are called by Node.js to customize the module resolution and loading process. The exported functions must have specific names and signatures, and they must be exported as named exports.
export async function initialize({ number, port }) {
  // Receives data from `register`.
}

export async function resolve(specifier, context, nextResolve) {
  // Take an `import` or `require` specifier and resolve it to a URL.
}

export async function load(url, context, nextLoad) {
  // Take a resolved URL and return the source code to be evaluated.
}
copy
Asynchronous hooks are run in a separate thread, isolated from the main thread where application code runs. That means it is a different realm. The hooks thread may be terminated by the main thread at any time, so do not depend on asynchronous operations (like console.log) to complete. They are inherited into child workers by default.
Synchronous hooks accepted by module.registerHooks()
#
Added in: v23.5.0, v22.15.0
Stability: 1.1 - Active development
The module.registerHooks() method accepts synchronous hook functions. initialize() is not supported nor necessary, as the hook implementer can simply run the initialization code directly before the call to module.registerHooks().
function resolve(specifier, context, nextResolve) {
  // Take an `import` or `require` specifier and resolve it to a URL.
}

function load(url, context, nextLoad) {
  // Take a resolved URL and return the source code to be evaluated.
}
copy
Synchronous hooks are run in the same thread and the same realm where the modules are loaded. Unlike the asynchronous hooks they are not inherited into child worker threads by default, though if the hooks are registered using a file preloaded by --import or --require, child worker threads can inherit the preloaded scripts via process.execArgv inheritance. See the documentation of Worker for detail.
In synchronous hooks, users can expect console.log() to complete in the same way that they expect console.log() in module code to complete.
Conventions of hooks
#
Hooks are part of a chain, even if that chain consists of only one custom (user-provided) hook and the default hook, which is always present. Hook functions nest: each one must always return a plain object, and chaining happens as a result of each function calling next<hookName>(), which is a reference to the subsequent loader's hook (in LIFO order).
A hook that returns a value lacking a required property triggers an exception. A hook that returns without calling next<hookName>() and without returning shortCircuit: true also triggers an exception. These errors are to help prevent unintentional breaks in the chain. Return shortCircuit: true from a hook to signal that the chain is intentionally ending at your hook.
initialize()
#
Added in: v20.6.0, v18.19.0
Stability: 1.2 - Release candidate
data <any> The data from register(loader, import.meta.url, { data }).
The initialize hook is only accepted by register. registerHooks() does not support nor need it since initialization done for synchronous hooks can be run directly before the call to registerHooks().
The initialize hook provides a way to define a custom function that runs in the hooks thread when the hooks module is initialized. Initialization happens when the hooks module is registered via register.
This hook can receive data from a register invocation, including ports and other transferable objects. The return value of initialize can be a <Promise>, in which case it will be awaited before the main application thread execution resumes.
Module customization code:
// path-to-my-hooks.js

export async function initialize({ number, port }) {
  port.postMessage(`increment: ${number + 1}`);
}
copy
Caller code:
const assert = require('node:assert');
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// This example showcases how a message channel can be used to communicate
// between the main (application) thread and the hooks running on the hooks
// thread, by sending `port2` to the `initialize` hook.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
copy
resolve(specifier, context, nextResolve)
#
History





















specifier <string>
context <Object>
conditions <string[]> Export conditions of the relevant package.json
importAttributes <Object> An object whose key-value pairs represent the attributes for the module to import
parentURL <string> | <undefined> The module importing this one, or undefined if this is the Node.js entry point
nextResolve <Function> The subsequent resolve hook in the chain, or the Node.js default resolve hook after the last user-supplied resolve hook
specifier <string>
context <Object> | <undefined> When omitted, the defaults are provided. When provided, defaults are merged in with preference to the provided properties.
Returns: <Object> | <Promise> The asynchronous version takes either an object containing the following properties, or a Promise that will resolve to such an object. The synchronous version only accepts an object returned synchronously.
format <string> | <null> | <undefined> A hint to the load hook (it might be ignored). It can be a module format (such as 'commonjs' or 'module') or an arbitrary value like 'css' or 'yaml'.
importAttributes <Object> | <undefined> The import attributes to use when caching the module (optional; if excluded the input will be used)
shortCircuit <undefined> | <boolean> A signal that this hook intends to terminate the chain of resolve hooks. Default: false
url <string> The absolute URL to which this input resolves
Warning In the case of the asynchronous version, despite support for returning promises and async functions, calls to resolve may still block the main thread which can impact performance.
The resolve hook chain is responsible for telling Node.js where to find and how to cache a given import statement or expression, or require call. It can optionally return a format (such as 'module') as a hint to the load hook. If a format is specified, the load hook is ultimately responsible for providing the final format value (and it is free to ignore the hint provided by resolve); if resolve provides a format, a custom load hook is required even if only to pass the value to the Node.js default load hook.
Import type attributes are part of the cache key for saving loaded modules into the internal module cache. The resolve hook is responsible for returning an importAttributes object if the module should be cached with different attributes than were present in the source code.
The conditions property in context is an array of conditions that will be used to match package exports conditions for this resolution request. They can be used for looking up conditional mappings elsewhere or to modify the list when calling the default resolution logic.
The current package exports conditions are always in the context.conditions array passed into the hook. To guarantee default Node.js module specifier resolution behavior when calling defaultResolve, the context.conditions array passed to it must include all elements of the context.conditions array originally passed into the resolve hook.
// Asynchronous version accepted by module.register().
export async function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  if (Math.random() > 0.5) { // Some condition.
    // For some or all specifiers, do some custom logic for resolving.
    // Always return an object of the form {url: <string>}.
    return {
      shortCircuit: true,
      url: parentURL ?
        new URL(specifier, parentURL).href :
        new URL(specifier).href,
    };
  }

  if (Math.random() < 0.5) { // Another condition.
    // When calling `defaultResolve`, the arguments can be modified. In this
    // case it's adding another value for matching conditional exports.
    return nextResolve(specifier, {
      ...context,
      conditions: [...context.conditions, 'another-condition'],
    });
  }

  // Defer to the next hook in the chain, which would be the
  // Node.js default resolve if this is the last user-specified loader.
  return nextResolve(specifier);
}
copy
// Synchronous version accepted by module.registerHooks().
function resolve(specifier, context, nextResolve) {
  // Similar to the asynchronous resolve() above, since that one does not have
  // any asynchronous logic.
}
copy
load(url, context, nextLoad)
#
History





















url <string> The URL returned by the resolve chain
context <Object>
conditions <string[]> Export conditions of the relevant package.json
format <string> | <null> | <undefined> The format optionally supplied by the resolve hook chain. This can be any string value as an input; input values do not need to conform to the list of acceptable return values described below.
importAttributes <Object>
nextLoad <Function> The subsequent load hook in the chain, or the Node.js default load hook after the last user-supplied load hook
url <string>
context <Object> | <undefined> When omitted, defaults are provided. When provided, defaults are merged in with preference to the provided properties. In the default nextLoad, if the module pointed to by url does not have explicit module type information, context.format is mandatory.
Returns: <Object> | <Promise> The asynchronous version takes either an object containing the following properties, or a Promise that will resolve to such an object. The synchronous version only accepts an object returned synchronously.
format <string>
shortCircuit <undefined> | <boolean> A signal that this hook intends to terminate the chain of load hooks. Default: false
source <string> | <ArrayBuffer> | <TypedArray> The source for Node.js to evaluate
The load hook provides a way to define a custom method of determining how a URL should be interpreted, retrieved, and parsed. It is also in charge of validating the import attributes.
The final value of format must be one of the following:
format
Description
Acceptable types for source returned by load
'addon'
Load a Node.js addon
<null>
'builtin'
Load a Node.js builtin module
<null>
'commonjs-typescript'
Load a Node.js CommonJS module with TypeScript syntax
<string> | <ArrayBuffer> | <TypedArray> | <null> | <undefined>
'commonjs'
Load a Node.js CommonJS module
<string> | <ArrayBuffer> | <TypedArray> | <null> | <undefined>
'json'
Load a JSON file
<string> | <ArrayBuffer> | <TypedArray>
'module-typescript'
Load an ES module with TypeScript syntax
<string> | <ArrayBuffer> | <TypedArray>
'module'
Load an ES module
<string> | <ArrayBuffer> | <TypedArray>
'wasm'
Load a WebAssembly module
<ArrayBuffer> | <TypedArray>

The value of source is ignored for type 'builtin' because currently it is not possible to replace the value of a Node.js builtin (core) module.
Caveat in the asynchronous load hook
#
When using the asynchronous load hook, omitting vs providing a source for 'commonjs' has very different effects:
When a source is provided, all require calls from this module will be processed by the ESM loader with registered resolve and load hooks; all require.resolve calls from this module will be processed by the ESM loader with registered resolve hooks; only a subset of the CommonJS API will be available (e.g. no require.extensions, no require.cache, no require.resolve.paths) and monkey-patching on the CommonJS module loader will not apply.
If source is undefined or null, it will be handled by the CommonJS module loader and require/require.resolve calls will not go through the registered hooks. This behavior for nullish source is temporary — in the future, nullish source will not be supported.
These caveats do not apply to the synchronous load hook, in which case the complete set of CommonJS APIs available to the customized CommonJS modules, and require/require.resolve always go through the registered hooks.
The Node.js internal asynchronous load implementation, which is the value of next for the last hook in the load chain, returns null for source when format is 'commonjs' for backward compatibility. Here is an example hook that would opt-in to using the non-default behavior:
import { readFile } from 'node:fs/promises';

// Asynchronous version accepted by module.register(). This fix is not needed
// for the synchronous version accepted by module.registerHooks().
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format === 'commonjs') {
    result.source ??= await readFile(new URL(result.responseURL ?? url));
  }
  return result;
}
copy
This doesn't apply to the synchronous load hook either, in which case the source returned contains source code loaded by the next hook, regardless of module format.
Warning: The asynchronous load hook and namespaced exports from CommonJS modules are incompatible. Attempting to use them together will result in an empty object from the import. This may be addressed in the future. This does not apply to the synchronous load hook, in which case exports can be used as usual.
These types all correspond to classes defined in ECMAScript.
The specific <ArrayBuffer> object is a <SharedArrayBuffer>.
The specific <TypedArray> object is a <Uint8Array>.
If the source value of a text-based format (i.e., 'json', 'module') is not a string, it is converted to a string using util.TextDecoder.
The load hook provides a way to define a custom method for retrieving the source code of a resolved URL. This would allow a loader to potentially avoid reading files from disk. It could also be used to map an unrecognized format to a supported one, for example yaml to module.
// Asynchronous version accepted by module.register().
export async function load(url, context, nextLoad) {
  const { format } = context;

  if (Math.random() > 0.5) { // Some condition
    /*
      For some or all URLs, do some custom logic for retrieving the source.
      Always return an object of the form {
        format: <string>,
        source: <string|buffer>,
      }.
    */
    return {
      format,
      shortCircuit: true,
      source: '...',
    };
  }

  // Defer to the next hook in the chain.
  return nextLoad(url);
}
copy
// Synchronous version accepted by module.registerHooks().
function load(url, context, nextLoad) {
  // Similar to the asynchronous load() above, since that one does not have
  // any asynchronous logic.
}
copy
In a more advanced scenario, this can also be used to transform an unsupported source to a supported one (see Examples below).
Examples
#
The various module customization hooks can be used together to accomplish wide-ranging customizations of the Node.js code loading and evaluation behaviors.
Import from HTTPS
#
The hook below registers hooks to enable rudimentary support for such specifiers. While this may seem like a significant improvement to Node.js core functionality, there are substantial downsides to actually using these hooks: performance is much slower than loading files from disk, there is no caching, and there is no security.
// https-hooks.mjs
import { get } from 'node:https';

export function load(url, context, nextLoad) {
  // For JavaScript to be loaded over the network, we need to fetch and
  // return it.
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          // This example assumes all network-provided JavaScript is ES module
          // code.
          format: 'module',
          shortCircuit: true,
          source: data,
        }));
      }).on('error', (err) => reject(err));
    });
  }

  // Let Node.js handle all other URLs.
  return nextLoad(url);
}
copy
// main.mjs
import { VERSION } from 'https://coffeescript.org/browser-compiler-modern/coffeescript.js';

console.log(VERSION);
copy
With the preceding hooks module, running node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./https-hooks.mjs"));' ./main.mjs prints the current version of CoffeeScript per the module at the URL in main.mjs.
Transpilation
#
Sources that are in formats Node.js doesn't understand can be converted into JavaScript using the load hook.
This is less performant than transpiling source files before running Node.js; transpiler hooks should only be used for development and testing purposes.
Asynchronous version
#
// coffeescript-hooks.mjs
import { readFile } from 'node:fs/promises';
import { findPackageJSON } from 'node:module';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

export async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    // CoffeeScript files can be either CommonJS or ES modules. Use a custom format
    // to tell Node.js not to detect its module type.
    const { source: rawSource } = await nextLoad(url, { ...context, format: 'coffee' });
    // This hook converts CoffeeScript source code into JavaScript source code
    // for all imported CoffeeScript files.
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    // To determine how Node.js would interpret the transpilation result,
    // search up the file system for the nearest parent package.json file
    // and read its "type" field.
    return {
      format: await getPackageType(url),
      shortCircuit: true,
      source: transformedSource,
    };
  }

  // Let Node.js handle all other URLs.
  return nextLoad(url, context);
}

async function getPackageType(url) {
  // `url` is only a file path during the first iteration when passed the
  // resolved url from the load() hook
  // an actual file path from load() will contain a file extension as it's
  // required by the spec
  // this simple truthy check for whether `url` contains a file extension will
  // work for most projects but does not cover some edge-cases (such as
  // extensionless files or a url ending in a trailing space)
  const pJson = findPackageJSON(url);

  return readFile(pJson, 'utf8')
    .then(JSON.parse)
    .then((json) => json?.type)
    .catch(() => undefined);
}
copy
Synchronous version
#
// coffeescript-sync-hooks.mjs
import { readFileSync } from 'node:fs';
import { registerHooks, findPackageJSON } from 'node:module';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const { source: rawSource } = nextLoad(url, { ...context, format: 'coffee' });
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format: getPackageType(url),
      shortCircuit: true,
      source: transformedSource,
    };
  }

  return nextLoad(url, context);
}

function getPackageType(url) {
  const pJson = findPackageJSON(url);
  if (!pJson) {
    return undefined;
  }
  try {
    const file = readFileSync(pJson, 'utf-8');
    return JSON.parse(file)?.type;
  } catch {
    return undefined;
  }
}

registerHooks({ load });
copy
Running hooks
#
# main.coffee
import { scream } from './scream.coffee'
console.log scream 'hello, world'

import { version } from 'node:process'
console.log "Brought to you by Node.js version #{version}"
copy
# scream.coffee
export scream = (str) -> str.toUpperCase()
copy
For the sake of running the example, add a package.json file containing the module type of the CoffeeScript files.
{
  "type": "module"
}
copy
This is only for running the example. In real world loaders, getPackageType() must be able to return an format known to Node.js even in the absence of an explicit type in a package.json, or otherwise the nextLoad call would throw ERR_UNKNOWN_FILE_EXTENSION (if undefined) or ERR_UNKNOWN_MODULE_FORMAT (if it's not a known format listed in the load hook documentation).
With the preceding hooks modules, running node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./coffeescript-hooks.mjs"));' ./main.coffee or node --import ./coffeescript-sync-hooks.mjs ./main.coffee causes main.coffee to be turned into JavaScript after its source code is loaded from disk but before Node.js executes it; and so on for any .coffee, .litcoffee or .coffee.md files referenced via import statements of any loaded file.
Import maps
#
The previous two examples defined load hooks. This is an example of a resolve hook. This hooks module reads an import-map.json file that defines which specifiers to override to other URLs (this is a very simplistic implementation of a small subset of the "import maps" specification).
Asynchronous version
#
// import-map-hooks.js
import fs from 'node:fs/promises';

const { imports } = JSON.parse(await fs.readFile('import-map.json'));

export async function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}
copy
Synchronous version
#
// import-map-sync-hooks.js
import fs from 'node:fs/promises';
import module from 'node:module';

const { imports } = JSON.parse(fs.readFileSync('import-map.json', 'utf-8'));

function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}

module.registerHooks({ resolve });
copy
Using the hooks
#
With these files:
// main.js
import 'a-module';
copy
// import-map.json
{
  "imports": {
    "a-module": "./some-module.js"
  }
}
copy
// some-module.js
console.log('some module!');
copy
Running node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./import-map-hooks.js"));' main.js or node --import ./import-map-sync-hooks.js main.js should print some module!.
Source Map Support
#
Added in: v13.7.0, v12.17.0
Stability: 1 - Experimental
Node.js supports TC39 ECMA-426 Source Map format (it was called Source map revision 3 format).
The APIs in this section are helpers for interacting with the source map cache. This cache is populated when source map parsing is enabled and source map include directives are found in a modules' footer.
To enable source map parsing, Node.js must be run with the flag --enable-source-maps, or with code coverage enabled by setting NODE_V8_COVERAGE=dir, or be enabled programmatically via module.setSourceMapsSupport().
// module.cjs
// In a CommonJS module
const { findSourceMap, SourceMap } = require('node:module');
copy
module.getSourceMapsSupport()
#
Added in: v23.7.0, v22.14.0
Returns: <Object>
enabled <boolean> If the source maps support is enabled
nodeModules <boolean> If the support is enabled for files in node_modules.
generatedCode <boolean> If the support is enabled for generated code from eval or new Function.
This method returns whether the Source Map v3 support for stack traces is enabled.
module.findSourceMap(path)
#
Added in: v13.7.0, v12.17.0
path <string>
Returns: <module.SourceMap> | <undefined> Returns module.SourceMap if a source map is found, undefined otherwise.
path is the resolved path for the file for which a corresponding source map should be fetched.
module.setSourceMapsSupport(enabled[, options])
#
Added in: v23.7.0, v22.14.0
enabled <boolean> Enable the source map support.
options <Object> Optional
nodeModules <boolean> If enabling the support for files in node_modules. Default: false.
generatedCode <boolean> If enabling the support for generated code from eval or new Function. Default: false.
This function enables or disables the Source Map v3 support for stack traces.
It provides same features as launching Node.js process with commandline options --enable-source-maps, with additional options to alter the support for files in node_modules or generated codes.
Only source maps in JavaScript files that are loaded after source maps has been enabled will be parsed and loaded. Preferably, use the commandline options --enable-source-maps to avoid losing track of source maps of modules loaded before this API call.
Class: module.SourceMap
#
Added in: v13.7.0, v12.17.0
new SourceMap(payload[, { lineLengths }])
#
History









payload <Object>
lineLengths <number[]>
Creates a new sourceMap instance.
payload is an object with keys matching the Source map format:
file: <string>
version: <number>
sources: <string[]>
sourcesContent: <string[]>
names: <string[]>
mappings: <string>
sourceRoot: <string>
lineLengths is an optional array of the length of each line in the generated code.
sourceMap.payload
#
Returns: <Object>
Getter for the payload used to construct the SourceMap instance.
sourceMap.findEntry(lineOffset, columnOffset)
#
lineOffset <number> The zero-indexed line number offset in the generated source
columnOffset <number> The zero-indexed column number offset in the generated source
Returns: <Object>
Given a line offset and column offset in the generated source file, returns an object representing the SourceMap range in the original file if found, or an empty object if not.
The object returned contains the following keys:
generatedLine: <number> The line offset of the start of the range in the generated source
generatedColumn: <number> The column offset of start of the range in the generated source
originalSource: <string> The file name of the original source, as reported in the SourceMap
originalLine: <number> The line offset of the start of the range in the original source
originalColumn: <number> The column offset of start of the range in the original source
name: <string>
The returned value represents the raw range as it appears in the SourceMap, based on zero-indexed offsets, not 1-indexed line and column numbers as they appear in Error messages and CallSite objects.
To get the corresponding 1-indexed line and column numbers from a lineNumber and columnNumber as they are reported by Error stacks and CallSite objects, use sourceMap.findOrigin(lineNumber, columnNumber)
sourceMap.findOrigin(lineNumber, columnNumber)
#
Added in: v20.4.0, v18.18.0
lineNumber <number> The 1-indexed line number of the call site in the generated source
columnNumber <number> The 1-indexed column number of the call site in the generated source
Returns: <Object>
Given a 1-indexed lineNumber and columnNumber from a call site in the generated source, find the corresponding call site location in the original source.
If the lineNumber and columnNumber provided are not found in any source map, then an empty object is returned. Otherwise, the returned object contains the following keys:
name: <string> | <undefined> The name of the range in the source map, if one was provided
fileName: <string> The file name of the original source, as reported in the SourceMap
lineNumber: <number> The 1-indexed lineNumber of the corresponding call site in the original source
columnNumber: <number> The 1-indexed columnNumber of the corresponding call site in the original source
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Modules: Packages
Introduction
Determining module system
Introduction
Syntax detection
Modules loaders
package.json and file extensions
--input-type flag
Package entry points
Main entry point export
Subpath exports
Extensions in subpaths
Path Rules and Validation for Export Targets
Targets must be relative URLs
No path traversal or invalid segments
Exports sugar
Subpath imports
Subpath patterns
Conditional exports
Nested conditions
Resolving user conditions
Community Conditions Definitions
Self-referencing a package using its name
Dual CommonJS/ES module packages
Node.js package.json field definitions
"name"
"main"
"type"
"exports"
"imports"
Modules: Packages
#
History

































Introduction
#
A package is a folder tree described by a package.json file. The package consists of the folder containing the package.json file and all subfolders until the next folder containing another package.json file, or a folder named node_modules.
This page provides guidance for package authors writing package.json files along with a reference for the package.json fields defined by Node.js.
Determining module system
#
Introduction
#
Node.js will treat the following as ES modules when passed to node as the initial input, or when referenced by import statements or import() expressions:
Files with an .mjs extension.
Files with a .js extension when the nearest parent package.json file contains a top-level "type" field with a value of "module".
Strings passed in as an argument to --eval, or piped to node via STDIN, with the flag --input-type=module.
Code containing syntax only successfully parsed as ES modules, such as import or export statements or import.meta, with no explicit marker of how it should be interpreted. Explicit markers are .mjs or .cjs extensions, package.json "type" fields with either "module" or "commonjs" values, or the --input-type flag. Dynamic import() expressions are supported in either CommonJS or ES modules and would not force a file to be treated as an ES module. See Syntax detection.
Node.js will treat the following as CommonJS when passed to node as the initial input, or when referenced by import statements or import() expressions:
Files with a .cjs extension.
Files with a .js extension when the nearest parent package.json file contains a top-level field "type" with a value of "commonjs".
Strings passed in as an argument to --eval or --print, or piped to node via STDIN, with the flag --input-type=commonjs.
Files with a .js extension with no parent package.json file or where the nearest parent package.json file lacks a type field, and where the code can evaluate successfully as CommonJS. In other words, Node.js tries to run such "ambiguous" files as CommonJS first, and will retry evaluating them as ES modules if the evaluation as CommonJS fails because the parser found ES module syntax.
Writing ES module syntax in "ambiguous" files incurs a performance cost, and therefore it is encouraged that authors be explicit wherever possible. In particular, package authors should always include the "type" field in their package.json files, even in packages where all sources are CommonJS. Being explicit about the type of the package will future-proof the package in case the default type of Node.js ever changes, and it will also make things easier for build tools and loaders to determine how the files in the package should be interpreted.
Syntax detection
#
History













Stability: 1.2 - Release candidate
Node.js will inspect the source code of ambiguous input to determine whether it contains ES module syntax; if such syntax is detected, the input will be treated as an ES module.
Ambiguous input is defined as:
Files with a .js extension or no extension; and either no controlling package.json file or one that lacks a type field.
String input (--eval or STDIN) when --input-typeis not specified.
ES module syntax is defined as syntax that would throw when evaluated as CommonJS. This includes the following:
import statements (but not import() expressions, which are valid in CommonJS).
export statements.
import.meta references.
await at the top level of a module.
Lexical redeclarations of the CommonJS wrapper variables (require, module, exports, __dirname, __filename).
Modules loaders
#
Node.js has two systems for resolving a specifier and loading modules.
There is the CommonJS module loader:
It is fully synchronous.
It is responsible for handling require() calls.
It is monkey patchable.
It supports folders as modules.
When resolving a specifier, if no exact match is found, it will try to add extensions (.js, .json, and finally .node) and then attempt to resolve folders as modules.
It treats .json as JSON text files.
.node files are interpreted as compiled addon modules loaded with process.dlopen().
It treats all files that lack .json or .node extensions as JavaScript text files.
It can only be used to load ECMAScript modules from CommonJS modules if the module graph is synchronous (that contains no top-level await). When used to load a JavaScript text file that is not an ECMAScript module, the file will be loaded as a CommonJS module.
There is the ECMAScript module loader:
It is asynchronous, unless it's being used to load modules for require().
It is responsible for handling import statements and import() expressions.
It is not monkey patchable, can be customized using loader hooks.
It does not support folders as modules, directory indexes (e.g. './startup/index.js') must be fully specified.
It does no extension searching. A file extension must be provided when the specifier is a relative or absolute file URL.
It can load JSON modules, but an import type attribute is required.
It accepts only .js, .mjs, and .cjs extensions for JavaScript text files.
It can be used to load JavaScript CommonJS modules. Such modules are passed through the cjs-module-lexer to try to identify named exports, which are available if they can be determined through static analysis. Imported CommonJS modules have their URLs converted to absolute paths and are then loaded via the CommonJS module loader.
package.json and file extensions
#
Within a package, the package.json "type" field defines how Node.js should interpret .js files. If a package.json file does not have a "type" field, .js files are treated as CommonJS.
A package.json "type" value of "module" tells Node.js to interpret .js files within that package as using ES module syntax.
The "type" field applies not only to initial entry points (node my-app.js) but also to files referenced by import statements and import() expressions.
// my-app.js, treated as an ES module because there is a package.json
// file in the same folder with "type": "module".

import './startup/init.js';
// Loaded as ES module since ./startup contains no package.json file,
// and therefore inherits the "type" value from one level up.

import 'commonjs-package';
// Loaded as CommonJS since ./node_modules/commonjs-package/package.json
// lacks a "type" field or contains "type": "commonjs".

import './node_modules/commonjs-package/index.js';
// Loaded as CommonJS since ./node_modules/commonjs-package/package.json
// lacks a "type" field or contains "type": "commonjs".
copy
Files ending with .mjs are always loaded as ES modules regardless of the nearest parent package.json.
Files ending with .cjs are always loaded as CommonJS regardless of the nearest parent package.json.
import './legacy-file.cjs';
// Loaded as CommonJS since .cjs is always loaded as CommonJS.

import 'commonjs-package/src/index.mjs';
// Loaded as ES module since .mjs is always loaded as ES module.
copy
The .mjs and .cjs extensions can be used to mix types within the same package:
Within a "type": "module" package, Node.js can be instructed to interpret a particular file as CommonJS by naming it with a .cjs extension (since both .js and .mjs files are treated as ES modules within a "module" package).
Within a "type": "commonjs" package, Node.js can be instructed to interpret a particular file as an ES module by naming it with an .mjs extension (since both .js and .cjs files are treated as CommonJS within a "commonjs" package).
--input-type flag
#
Added in: v12.0.0
Strings passed in as an argument to --eval (or -e), or piped to node via STDIN, are treated as ES modules when the --input-type=module flag is set.
node --input-type=module --eval "import { sep } from 'node:path'; console.log(sep);"

echo "import { sep } from 'node:path'; console.log(sep);" | node --input-type=module
copy
For completeness there is also --input-type=commonjs, for explicitly running string input as CommonJS. This is the default behavior if --input-type is unspecified.
Package entry points
#
In a package's package.json file, two fields can define entry points for a package: "main" and "exports". Both fields apply to both ES module and CommonJS module entry points.
The "main" field is supported in all versions of Node.js, but its capabilities are limited: it only defines the main entry point of the package.
The "exports" provides a modern alternative to "main" allowing multiple entry points to be defined, conditional entry resolution support between environments, and preventing any other entry points besides those defined in "exports". This encapsulation allows module authors to clearly define the public interface for their package.
For new packages targeting the currently supported versions of Node.js, the "exports" field is recommended. For packages supporting Node.js 10 and below, the "main" field is required. If both "exports" and "main" are defined, the "exports" field takes precedence over "main" in supported versions of Node.js.
Conditional exports can be used within "exports" to define different package entry points per environment, including whether the package is referenced via require or via import. For more information about supporting both CommonJS and ES modules in a single package please consult the dual CommonJS/ES module packages section.
Existing packages introducing the "exports" field will prevent consumers of the package from using any entry points that are not defined, including the package.json (e.g. require('your-package/package.json')). This will likely be a breaking change.
To make the introduction of "exports" non-breaking, ensure that every previously supported entry point is exported. It is best to explicitly specify entry points so that the package's public API is well-defined. For example, a project that previously exported main, lib, feature, and the package.json could use the following package.exports:
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/index": "./lib/index.js",
    "./lib/index.js": "./lib/index.js",
    "./feature": "./feature/index.js",
    "./feature/index": "./feature/index.js",
    "./feature/index.js": "./feature/index.js",
    "./package.json": "./package.json"
  }
}
copy
Alternatively a project could choose to export entire folders both with and without extensioned subpaths using export patterns:
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/*": "./lib/*.js",
    "./lib/*.js": "./lib/*.js",
    "./feature": "./feature/index.js",
    "./feature/*": "./feature/*.js",
    "./feature/*.js": "./feature/*.js",
    "./package.json": "./package.json"
  }
}
copy
With the above providing backwards-compatibility for any minor package versions, a future major change for the package can then properly restrict the exports to only the specific feature exports exposed:
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./feature/*.js": "./feature/*.js",
    "./feature/internal/*": null
  }
}
copy
Main entry point export
#
When writing a new package, it is recommended to use the "exports" field:
{
  "exports": "./index.js"
}
copy
When the "exports" field is defined, all subpaths of the package are encapsulated and no longer available to importers. For example, require('pkg/subpath.js') throws an ERR_PACKAGE_PATH_NOT_EXPORTED error.
This encapsulation of exports provides more reliable guarantees about package interfaces for tools and when handling semver upgrades for a package. It is not a strong encapsulation since a direct require of any absolute subpath of the package such as require('/path/to/node_modules/pkg/subpath.js') will still load subpath.js.
All currently supported versions of Node.js and modern build tools support the "exports" field. For projects using an older version of Node.js or a related build tool, compatibility can be achieved by including the "main" field alongside "exports" pointing to the same module:
{
  "main": "./index.js",
  "exports": "./index.js"
}
copy
Subpath exports
#
Added in: v12.7.0
When using the "exports" field, custom subpaths can be defined along with the main entry point by treating the main entry point as the "." subpath:
{
  "exports": {
    ".": "./index.js",
    "./submodule.js": "./src/submodule.js"
  }
}
copy
Now only the defined subpath in "exports" can be imported by a consumer:
import submodule from 'es-module-package/submodule.js';
// Loads ./node_modules/es-module-package/src/submodule.js
copy
While other subpaths will error:
import submodule from 'es-module-package/private-module.js';
// Throws ERR_PACKAGE_PATH_NOT_EXPORTED
copy
Extensions in subpaths
#
Package authors should provide either extensioned (import 'pkg/subpath.js') or extensionless (import 'pkg/subpath') subpaths in their exports. This ensures that there is only one subpath for each exported module so that all dependents import the same consistent specifier, keeping the package contract clear for consumers and simplifying package subpath completions.
Traditionally, packages tended to use the extensionless style, which has the benefits of readability and of masking the true path of the file within the package.
With import maps now providing a standard for package resolution in browsers and other JavaScript runtimes, using the extensionless style can result in bloated import map definitions. Explicit file extensions can avoid this issue by enabling the import map to utilize a packages folder mapping to map multiple subpaths where possible instead of a separate map entry per package subpath export. This also mirrors the requirement of using the full specifier path in relative and absolute import specifiers.
Path Rules and Validation for Export Targets
#
When defining paths as targets in the "exports" field, Node.js enforces several rules to ensure security, predictability, and proper encapsulation. Understanding these rules is crucial for authors publishing packages.
Targets must be relative URLs
#
All target paths in the "exports" map (the values associated with export keys) must be relative URL strings starting with ./.
// package.json
{
  "name": "my-package",
  "exports": {
    ".": "./dist/main.js",          // Correct
    "./feature": "./lib/feature.js", // Correct
    // "./origin-relative": "/dist/main.js", // Incorrect: Must start with ./
    // "./absolute": "file:///dev/null", // Incorrect: Must start with ./
    // "./outside": "../common/util.js" // Incorrect: Must start with ./
  }
}
copy
Reasons for this behavior include:
Security: Prevents exporting arbitrary files from outside the package's own directory.
Encapsulation: Ensures all exported paths are resolved relative to the package root, making the package self-contained.
No path traversal or invalid segments
#
Export targets must not resolve to a location outside the package's root directory. Additionally, path segments like . (single dot), .. (double dot), or node_modules (and their URL-encoded equivalents) are generally disallowed within the target string after the initial ./ and in any subpath part substituted into a target pattern.
// package.json
{
  "name": "my-package",
  "exports": {
    // ".": "./dist/../../elsewhere/file.js", // Invalid: path traversal
    // ".": "././dist/main.js",             // Invalid: contains "." segment
    // ".": "./dist/../dist/main.js",       // Invalid: contains ".." segment
    // "./utils/./helper.js": "./utils/helper.js" // Key has invalid segment
  }
}
copy
Exports sugar
#
Added in: v12.11.0
If the "." export is the only export, the "exports" field provides sugar for this case being the direct "exports" field value.
{
  "exports": {
    ".": "./index.js"
  }
}
copy
can be written:
{
  "exports": "./index.js"
}
copy
Subpath imports
#
Added in: v14.6.0, v12.19.0
In addition to the "exports" field, there is a package "imports" field to create private mappings that only apply to import specifiers from within the package itself.
Entries in the "imports" field must always start with # to ensure they are disambiguated from external package specifiers.
For example, the imports field can be used to gain the benefits of conditional exports for internal modules:
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
copy
where import '#dep' does not get the resolution of the external package dep-node-native (including its exports in turn), and instead gets the local file ./dep-polyfill.js relative to the package in other environments.
Unlike the "exports" field, the "imports" field permits mapping to external packages.
The resolution rules for the imports field are otherwise analogous to the exports field.
Subpath patterns
#
History

















For packages with a small number of exports or imports, we recommend explicitly listing each exports subpath entry. But for packages that have large numbers of subpaths, this might cause package.json bloat and maintenance issues.
For these use cases, subpath export patterns can be used instead:
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js"
  },
  "imports": {
    "#internal/*.js": "./src/internal/*.js"
  }
}
copy
* maps expose nested subpaths as it is a string replacement syntax only.
All instances of * on the right hand side will then be replaced with this value, including if it contains any / separators.
import featureX from 'es-module-package/features/x.js';
// Loads ./node_modules/es-module-package/src/features/x.js

import featureY from 'es-module-package/features/y/y.js';
// Loads ./node_modules/es-module-package/src/features/y/y.js

import internalZ from '#internal/z.js';
// Loads ./node_modules/es-module-package/src/internal/z.js
copy
This is a direct static matching and replacement without any special handling for file extensions. Including the "*.js" on both sides of the mapping restricts the exposed package exports to only JS files.
The property of exports being statically enumerable is maintained with exports patterns since the individual exports for a package can be determined by treating the right hand side target pattern as a ** glob against the list of files within the package. Because node_modules paths are forbidden in exports targets, this expansion is dependent on only the files of the package itself.
To exclude private subfolders from patterns, null targets can be used:
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js",
    "./features/private-internal/*": null
  }
}
copy
import featureInternal from 'es-module-package/features/private-internal/m.js';
// Throws: ERR_PACKAGE_PATH_NOT_EXPORTED

import featureX from 'es-module-package/features/x.js';
// Loads ./node_modules/es-module-package/src/features/x.js
copy
Conditional exports
#
History













Conditional exports provide a way to map to different paths depending on certain conditions. They are supported for both CommonJS and ES module imports.
For example, a package that wants to provide different ES module exports for require() and import can be written:
// package.json
{
  "exports": {
    "import": "./index-module.js",
    "require": "./index-require.cjs"
  },
  "type": "module"
}
copy
Node.js implements the following conditions, listed in order from most specific to least specific as conditions should be defined:
"node-addons" - similar to "node" and matches for any Node.js environment. This condition can be used to provide an entry point which uses native C++ addons as opposed to an entry point which is more universal and doesn't rely on native addons. This condition can be disabled via the --no-addons flag.
"node" - matches for any Node.js environment. Can be a CommonJS or ES module file. In most cases explicitly calling out the Node.js platform is not necessary.
"import" - matches when the package is loaded via import or import(), or via any top-level import or resolve operation by the ECMAScript module loader. Applies regardless of the module format of the target file. Always mutually exclusive with "require".
"require" - matches when the package is loaded via require(). The referenced file should be loadable with require() although the condition matches regardless of the module format of the target file. Expected formats include CommonJS, JSON, native addons, and ES modules. Always mutually exclusive with "import".
"module-sync" - matches no matter the package is loaded via import, import() or require(). The format is expected to be ES modules that does not contain top-level await in its module graph - if it does, ERR_REQUIRE_ASYNC_MODULE will be thrown when the module is require()-ed.
"default" - the generic fallback that always matches. Can be a CommonJS or ES module file. This condition should always come last.
Within the "exports" object, key order is significant. During condition matching, earlier entries have higher priority and take precedence over later entries. The general rule is that conditions should be from most specific to least specific in object order.
Using the "import" and "require" conditions can lead to some hazards, which are further explained in the dual CommonJS/ES module packages section.
The "node-addons" condition can be used to provide an entry point which uses native C++ addons. However, this condition can be disabled via the --no-addons flag. When using "node-addons", it's recommended to treat "default" as an enhancement that provides a more universal entry point, e.g. using WebAssembly instead of a native addon.
Conditional exports can also be extended to exports subpaths, for example:
{
  "exports": {
    ".": "./index.js",
    "./feature.js": {
      "node": "./feature-node.js",
      "default": "./feature.js"
    }
  }
}
copy
Defines a package where require('pkg/feature.js') and import 'pkg/feature.js' could provide different implementations between Node.js and other JS environments.
When using environment branches, always include a "default" condition where possible. Providing a "default" condition ensures that any unknown JS environments are able to use this universal implementation, which helps avoid these JS environments from having to pretend to be existing environments in order to support packages with conditional exports. For this reason, using "node" and "default" condition branches is usually preferable to using "node" and "browser" condition branches.
Nested conditions
#
In addition to direct mappings, Node.js also supports nested condition objects.
For example, to define a package that only has dual mode entry points for use in Node.js but not the browser:
{
  "exports": {
    "node": {
      "import": "./feature-node.mjs",
      "require": "./feature-node.cjs"
    },
    "default": "./feature.mjs"
  }
}
copy
Conditions continue to be matched in order as with flat conditions. If a nested condition does not have any mapping it will continue checking the remaining conditions of the parent condition. In this way nested conditions behave analogously to nested JavaScript if statements.
Resolving user conditions
#
Added in: v14.9.0, v12.19.0
When running Node.js, custom user conditions can be added with the --conditions flag:
node --conditions=development index.js
copy
which would then resolve the "development" condition in package imports and exports, while resolving the existing "node", "node-addons", "default", "import", and "require" conditions as appropriate.
Any number of custom conditions can be set with repeat flags.
Typical conditions should only contain alphanumerical characters, using ":", "-", or "=" as separators if necessary. Anything else may run into compability issues outside of node.
In node, conditions have very few restrictions, but specifically these include:
They must contain at least one character.
They cannot start with "." since they may appear in places that also allow relative paths.
They cannot contain "," since they may be parsed as a comma-separated list by some CLI tools.
They cannot be integer property keys like "10" since that can have unexpected effects on property key ordering for JS objects.
Community Conditions Definitions
#
Condition strings other than the "import", "require", "node", "module-sync", "node-addons" and "default" conditions implemented in Node.js core are ignored by default.
Other platforms may implement other conditions and user conditions can be enabled in Node.js via the --conditions / -C flag.
Since custom package conditions require clear definitions to ensure correct usage, a list of common known package conditions and their strict definitions is provided below to assist with ecosystem coordination.
"types" - can be used by typing systems to resolve the typing file for the given export. This condition should always be included first.
"browser" - any web browser environment.
"development" - can be used to define a development-only environment entry point, for example to provide additional debugging context such as better error messages when running in a development mode. Must always be mutually exclusive with "production".
"production" - can be used to define a production environment entry point. Must always be mutually exclusive with "development".
For other runtimes, platform-specific condition key definitions are maintained by the WinterCG in the Runtime Keys proposal specification.
New conditions definitions may be added to this list by creating a pull request to the Node.js documentation for this section. The requirements for listing a new condition definition here are that:
The definition should be clear and unambiguous for all implementers.
The use case for why the condition is needed should be clearly justified.
There should exist sufficient existing implementation usage.
The condition name should not conflict with another condition definition or condition in wide usage.
The listing of the condition definition should provide a coordination benefit to the ecosystem that wouldn't otherwise be possible. For example, this would not necessarily be the case for company-specific or application-specific conditions.
The condition should be such that a Node.js user would expect it to be in Node.js core documentation. The "types" condition is a good example: It doesn't really belong in the Runtime Keys proposal but is a good fit here in the Node.js docs.
The above definitions may be moved to a dedicated conditions registry in due course.
Self-referencing a package using its name
#
History













Within a package, the values defined in the package's package.json "exports" field can be referenced via the package's name. For example, assuming the package.json is:
// package.json
{
  "name": "a-package",
  "exports": {
    ".": "./index.mjs",
    "./foo.js": "./foo.js"
  }
}
copy
Then any module in that package can reference an export in the package itself:
// ./a-module.mjs
import { something } from 'a-package'; // Imports "something" from ./index.mjs.
copy
Self-referencing is available only if package.json has "exports", and will allow importing only what that "exports" (in the package.json) allows. So the code below, given the previous package, will generate a runtime error:
// ./another-module.mjs

// Imports "another" from ./m.mjs. Fails because
// the "package.json" "exports" field
// does not provide an export named "./m.mjs".
import { another } from 'a-package/m.mjs';
copy
Self-referencing is also available when using require, both in an ES module, and in a CommonJS one. For example, this code will also work:
// ./a-module.js
const { something } = require('a-package/foo.js'); // Loads from ./foo.js.
copy
Finally, self-referencing also works with scoped packages. For example, this code will also work:
// package.json
{
  "name": "@my/package",
  "exports": "./index.js"
}
copy
// ./index.js
module.exports = 42;
copy
// ./other.js
console.log(require('@my/package'));
copy
$ node other.js
42
copy
Dual CommonJS/ES module packages
#
See the package examples repository for details.
Node.js package.json field definitions
#
This section describes the fields used by the Node.js runtime. Other tools (such as npm) use additional fields which are ignored by Node.js and not documented here.
The following fields in package.json files are used in Node.js:
"name" - Relevant when using named imports within a package. Also used by package managers as the name of the package.
"main" - The default module when loading the package, if exports is not specified, and in versions of Node.js prior to the introduction of exports.
"type" - The package type determining whether to load .js files as CommonJS or ES modules.
"exports" - Package exports and conditional exports. When present, limits which submodules can be loaded from within the package.
"imports" - Package imports, for use by modules within the package itself.
"name"
#
History













Type: <string>
{
  "name": "package-name"
}
copy
The "name" field defines your package's name. Publishing to the npm registry requires a name that satisfies certain requirements.
The "name" field can be used in addition to the "exports" field to self-reference a package using its name.
"main"
#
Added in: v0.4.0
Type: <string>
{
  "main": "./index.js"
}
copy
The "main" field defines the entry point of a package when imported by name via a node_modules lookup. Its value is a path.
When a package has an "exports" field, this will take precedence over the "main" field when importing the package by name.
It also defines the script that is used when the package directory is loaded via require().
// This resolves to ./path/to/directory/index.js.
require('./path/to/directory');
copy
"type"
#
History













Type: <string>
The "type" field defines the module format that Node.js uses for all .js files that have that package.json file as their nearest parent.
Files ending with .js are loaded as ES modules when the nearest parent package.json file contains a top-level field "type" with a value of "module".
The nearest parent package.json is defined as the first package.json found when searching in the current folder, that folder's parent, and so on up until a node_modules folder or the volume root is reached.
// package.json
{
  "type": "module"
}
copy
# In same folder as preceding package.json
node my-app.js # Runs as ES module
copy
If the nearest parent package.json lacks a "type" field, or contains "type": "commonjs", .js files are treated as CommonJS. If the volume root is reached and no package.json is found, .js files are treated as CommonJS.
import statements of .js files are treated as ES modules if the nearest parent package.json contains "type": "module".
// my-app.js, part of the same example as above
import './startup.js'; // Loaded as ES module because of package.json
copy
Regardless of the value of the "type" field, .mjs files are always treated as ES modules and .cjs files are always treated as CommonJS.
"exports"
#
History





























Type: <Object> | <string> | <string[]>
{
  "exports": "./index.js"
}
copy
The "exports" field allows defining the entry points of a package when imported by name loaded either via a node_modules lookup or a self-reference to its own name. It is supported in Node.js 12+ as an alternative to the "main" that can support defining subpath exports and conditional exports while encapsulating internal unexported modules.
Conditional Exports can also be used within "exports" to define different package entry points per environment, including whether the package is referenced via require or via import.
All paths defined in the "exports" must be relative file URLs starting with ./.
"imports"
#
Added in: v14.6.0, v12.19.0
Type: <Object>
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
copy
Entries in the imports field must be strings starting with #.
Package imports permit mapping to external packages.
This field defines subpath imports for the current package.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Modules: TypeScript
Enabling
Full TypeScript support
Type stripping
Determining module system
TypeScript features
Importing types without type keyword
Non-file forms of input
Source maps
Type stripping in dependencies
Paths aliases
Modules: TypeScript
#
History

















Stability: 1.2 - Release candidate
Enabling
#
There are two ways to enable runtime TypeScript support in Node.js:
For full support of all of TypeScript's syntax and features, including using any version of TypeScript, use a third-party package.
For lightweight support, you can use the built-in support for type stripping.
Full TypeScript support
#
To use TypeScript with full support for all TypeScript features, including tsconfig.json, you can use a third-party package. These instructions use tsx as an example but there are many other similar libraries available.
Install the package as a development dependency using whatever package manager you're using for your project. For example, with npm:
npm install --save-dev tsx
copy
Then you can run your TypeScript code via:
npx tsx your-file.ts
copy
Or alternatively, you can run with node via:
node --import=tsx your-file.ts
copy
Type stripping
#
Added in: v22.6.0
By default Node.js will execute TypeScript files that contains only erasable TypeScript syntax. Node.js will replace TypeScript syntax with whitespace, and no type checking is performed. To enable the transformation of non erasable TypeScript syntax, which requires JavaScript code generation, such as enum declarations, parameter properties use the flag --experimental-transform-types. To disable this feature, use the flag --no-experimental-strip-types.
Node.js ignores tsconfig.json files and therefore features that depend on settings within tsconfig.json, such as paths or converting newer JavaScript syntax to older standards, are intentionally unsupported. To get full TypeScript support, see Full TypeScript support.
The type stripping feature is designed to be lightweight. By intentionally not supporting syntaxes that require JavaScript code generation, and by replacing inline types with whitespace, Node.js can run TypeScript code without the need for source maps.
Type stripping is compatible with most versions of TypeScript but we recommend version 5.8 or newer with the following tsconfig.json settings:
{
  "compilerOptions": {
     "noEmit": true, // Optional - see note below
     "target": "esnext",
     "module": "nodenext",
     "rewriteRelativeImportExtensions": true,
     "erasableSyntaxOnly": true,
     "verbatimModuleSyntax": true
  }
}
copy
Use the noEmit option if you intend to only execute *.ts files, for example a build script. You won't need this flag if you intend to distribute *.js files.
Determining module system
#
Node.js supports both CommonJS and ES Modules syntax in TypeScript files. Node.js will not convert from one module system to another; if you want your code to run as an ES module, you must use import and export syntax, and if you want your code to run as CommonJS you must use require and module.exports.
.ts files will have their module system determined the same way as .js files. To use import and export syntax, add "type": "module" to the nearest parent package.json.
.mts files will always be run as ES modules, similar to .mjs files.
.cts files will always be run as CommonJS modules, similar to .cjs files.
.tsx files are unsupported.
As in JavaScript files, file extensions are mandatory in import statements and import() expressions: import './file.ts', not import './file'. Because of backward compatibility, file extensions are also mandatory in require() calls: require('./file.ts'), not require('./file'), similar to how the .cjs extension is mandatory in require calls in CommonJS files.
The tsconfig.json option allowImportingTsExtensions will allow the TypeScript compiler tsc to type-check files with import specifiers that include the .ts extension.
TypeScript features
#
Since Node.js is only removing inline types, any TypeScript features that involve replacing TypeScript syntax with new JavaScript syntax will error, unless the flag --experimental-transform-types is passed.
The most prominent features that require transformation are:
Enum declarations
namespace with runtime code
legacy module with runtime code
parameter properties
import aliases
namespaces and module that do not contain runtime code are supported. This example will work correctly:
// This namespace is exporting a type
namespace TypeOnly {
   export type A = string;
}
copy
This will result in ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX error:
// This namespace is exporting a value
namespace A {
   export let x = 1
}
copy
Since Decorators are currently a TC39 Stage 3 proposal and will soon be supported by the JavaScript engine, they are not transformed and will result in a parser error. This is a temporary limitation and will be resolved in the future.
In addition, Node.js does not read tsconfig.json files and does not support features that depend on settings within tsconfig.json, such as paths or converting newer JavaScript syntax into older standards.
Importing types without type keyword
#
Due to the nature of type stripping, the type keyword is necessary to correctly strip type imports. Without the type keyword, Node.js will treat the import as a value import, which will result in a runtime error. The tsconfig option verbatimModuleSyntax can be used to match this behavior.
This example will work correctly:
import type { Type1, Type2 } from './module.ts';
import { fn, type FnParams } from './fn.ts';
copy
This will result in a runtime error:
import { Type1, Type2 } from './module.ts';
import { fn, FnParams } from './fn.ts';
copy
Non-file forms of input
#
Type stripping can be enabled for --eval and STDIN. The module system will be determined by --input-type, as it is for JavaScript.
TypeScript syntax is unsupported in the REPL, --check, and inspect.
Source maps
#
Since inline types are replaced by whitespace, source maps are unnecessary for correct line numbers in stack traces; and Node.js does not generate them. When --experimental-transform-types is enabled, source-maps are enabled by default.
Type stripping in dependencies
#
To discourage package authors from publishing packages written in TypeScript, Node.js will by default refuse to handle TypeScript files inside folders under a node_modules path.
Paths aliases
#
tsconfig "paths" won't be transformed and therefore produce an error. The closest feature available is subpath imports with the limitation that they need to start with #.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Net
IPC support
Identifying paths for IPC connections
Class: net.BlockList
blockList.addAddress(address[, type])
blockList.addRange(start, end[, type])
blockList.addSubnet(net, prefix[, type])
blockList.check(address[, type])
blockList.rules
BlockList.isBlockList(value)
Class: net.SocketAddress
new net.SocketAddress([options])
socketaddress.address
socketaddress.family
socketaddress.flowlabel
socketaddress.port
SocketAddress.parse(input)
Class: net.Server
new net.Server([options][, connectionListener])
Event: 'close'
Event: 'connection'
Event: 'error'
Event: 'listening'
Event: 'drop'
server.address()
server.close([callback])
server[Symbol.asyncDispose]()
server.getConnections(callback)
server.listen()
server.listen(handle[, backlog][, callback])
server.listen(options[, callback])
server.listen(path[, backlog][, callback])
server.listen([port[, host[, backlog]]][, callback])
server.listening
server.maxConnections
server.dropMaxConnection
server.ref()
server.unref()
Class: net.Socket
new net.Socket([options])
Event: 'close'
Event: 'connect'
Event: 'connectionAttempt'
Event: 'connectionAttemptFailed'
Event: 'connectionAttemptTimeout'
Event: 'data'
Event: 'drain'
Event: 'end'
Event: 'error'
Event: 'lookup'
Event: 'ready'
Event: 'timeout'
socket.address()
socket.autoSelectFamilyAttemptedAddresses
socket.bufferSize
socket.bytesRead
socket.bytesWritten
socket.connect()
socket.connect(options[, connectListener])
socket.connect(path[, connectListener])
socket.connect(port[, host][, connectListener])
socket.connecting
socket.destroy([error])
socket.destroyed
socket.destroySoon()
socket.end([data[, encoding]][, callback])
socket.localAddress
socket.localPort
socket.localFamily
socket.pause()
socket.pending
socket.ref()
socket.remoteAddress
socket.remoteFamily
socket.remotePort
socket.resetAndDestroy()
socket.resume()
socket.setEncoding([encoding])
socket.setKeepAlive([enable][, initialDelay])
socket.setNoDelay([noDelay])
socket.setTimeout(timeout[, callback])
socket.timeout
socket.unref()
socket.write(data[, encoding][, callback])
socket.readyState
net.connect()
net.connect(options[, connectListener])
net.connect(path[, connectListener])
net.connect(port[, host][, connectListener])
net.createConnection()
net.createConnection(options[, connectListener])
net.createConnection(path[, connectListener])
net.createConnection(port[, host][, connectListener])
net.createServer([options][, connectionListener])
net.getDefaultAutoSelectFamily()
net.setDefaultAutoSelectFamily(value)
net.getDefaultAutoSelectFamilyAttemptTimeout()
net.setDefaultAutoSelectFamilyAttemptTimeout(value)
net.isIP(input)
net.isIPv4(input)
net.isIPv6(input)
Net
#
Stability: 2 - Stable
Source Code: lib/net.js
The node:net module provides an asynchronous network API for creating stream-based TCP or IPC servers (net.createServer()) and clients (net.createConnection()).
It can be accessed using:
const net = require('node:net');
copy
IPC support
#
History









The node:net module supports IPC with named pipes on Windows, and Unix domain sockets on other operating systems.
Identifying paths for IPC connections
#
net.connect(), net.createConnection(), server.listen(), and socket.connect() take a path parameter to identify IPC endpoints.
On Unix, the local domain is also known as the Unix domain. The path is a file system pathname. It will throw an error when the length of pathname is greater than the length of sizeof(sockaddr_un.sun_path). Typical values are 107 bytes on Linux and 103 bytes on macOS. If a Node.js API abstraction creates the Unix domain socket, it will unlink the Unix domain socket as well. For example, net.createServer() may create a Unix domain socket and server.close() will unlink it. But if a user creates the Unix domain socket outside of these abstractions, the user will need to remove it. The same applies when a Node.js API creates a Unix domain socket but the program then crashes. In short, a Unix domain socket will be visible in the file system and will persist until unlinked. On Linux, You can use Unix abstract socket by adding \0 to the beginning of the path, such as \0abstract. The path to the Unix abstract socket is not visible in the file system and it will disappear automatically when all open references to the socket are closed.
On Windows, the local domain is implemented using a named pipe. The path must refer to an entry in \\?\pipe\ or \\.\pipe\. Any characters are permitted, but the latter may do some processing of pipe names, such as resolving .. sequences. Despite how it might look, the pipe namespace is flat. Pipes will not persist. They are removed when the last reference to them is closed. Unlike Unix domain sockets, Windows will close and remove the pipe when the owning process exits.
JavaScript string escaping requires paths to be specified with extra backslash escaping such as:
net.createServer().listen(
  path.join('\\\\?\\pipe', process.cwd(), 'myctl'));
copy
Class: net.BlockList
#
Added in: v15.0.0, v14.18.0
The BlockList object can be used with some network APIs to specify rules for disabling inbound or outbound access to specific IP addresses, IP ranges, or IP subnets.
blockList.addAddress(address[, type])
#
Added in: v15.0.0, v14.18.0
address <string> | <net.SocketAddress> An IPv4 or IPv6 address.
type <string> Either 'ipv4' or 'ipv6'. Default: 'ipv4'.
Adds a rule to block the given IP address.
blockList.addRange(start, end[, type])
#
Added in: v15.0.0, v14.18.0
start <string> | <net.SocketAddress> The starting IPv4 or IPv6 address in the range.
end <string> | <net.SocketAddress> The ending IPv4 or IPv6 address in the range.
type <string> Either 'ipv4' or 'ipv6'. Default: 'ipv4'.
Adds a rule to block a range of IP addresses from start (inclusive) to end (inclusive).
blockList.addSubnet(net, prefix[, type])
#
Added in: v15.0.0, v14.18.0
net <string> | <net.SocketAddress> The network IPv4 or IPv6 address.
prefix <number> The number of CIDR prefix bits. For IPv4, this must be a value between 0 and 32. For IPv6, this must be between 0 and 128.
type <string> Either 'ipv4' or 'ipv6'. Default: 'ipv4'.
Adds a rule to block a range of IP addresses specified as a subnet mask.
blockList.check(address[, type])
#
Added in: v15.0.0, v14.18.0
address <string> | <net.SocketAddress> The IP address to check
type <string> Either 'ipv4' or 'ipv6'. Default: 'ipv4'.
Returns: <boolean>
Returns true if the given IP address matches any of the rules added to the BlockList.
const blockList = new net.BlockList();
blockList.addAddress('123.123.123.123');
blockList.addRange('10.0.0.1', '10.0.0.10');
blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

console.log(blockList.check('123.123.123.123'));  // Prints: true
console.log(blockList.check('10.0.0.3'));  // Prints: true
console.log(blockList.check('222.111.111.222'));  // Prints: false

// IPv6 notation for IPv4 addresses works:
console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // Prints: true
console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // Prints: true
copy
blockList.rules
#
Added in: v15.0.0, v14.18.0
Type: <string[]>
The list of rules added to the blocklist.
BlockList.isBlockList(value)
#
Added in: v23.4.0, v22.13.0
value <any> Any JS value
Returns true if the value is a net.BlockList.
Class: net.SocketAddress
#
Added in: v15.14.0, v14.18.0
new net.SocketAddress([options])
#
Added in: v15.14.0, v14.18.0
options <Object>
address <string> The network address as either an IPv4 or IPv6 string. Default: '127.0.0.1' if family is 'ipv4'; '::' if family is 'ipv6'.
family <string> One of either 'ipv4' or 'ipv6'. Default: 'ipv4'.
flowlabel <number> An IPv6 flow-label used only if family is 'ipv6'.
port <number> An IP port.
socketaddress.address
#
Added in: v15.14.0, v14.18.0
Type <string>
socketaddress.family
#
Added in: v15.14.0, v14.18.0
Type <string> Either 'ipv4' or 'ipv6'.
socketaddress.flowlabel
#
Added in: v15.14.0, v14.18.0
Type <number>
socketaddress.port
#
Added in: v15.14.0, v14.18.0
Type <number>
SocketAddress.parse(input)
#
Added in: v23.4.0, v22.13.0
input <string> An input string containing an IP address and optional port, e.g. 123.1.2.3:1234 or [1::1]:1234.
Returns: <net.SocketAddress> Returns a SocketAddress if parsing was successful. Otherwise returns undefined.
Class: net.Server
#
Added in: v0.1.90
Extends: <EventEmitter>
This class is used to create a TCP or IPC server.
new net.Server([options][, connectionListener])
#
options <Object> See net.createServer([options][, connectionListener]).
connectionListener <Function> Automatically set as a listener for the 'connection' event.
Returns: <net.Server>
net.Server is an EventEmitter with the following events:
Event: 'close'
#
Added in: v0.5.0
Emitted when the server closes. If connections exist, this event is not emitted until all connections are ended.
Event: 'connection'
#
Added in: v0.1.90
<net.Socket> The connection object
Emitted when a new connection is made. socket is an instance of net.Socket.
Event: 'error'
#
Added in: v0.1.90
<Error>
Emitted when an error occurs. Unlike net.Socket, the 'close' event will not be emitted directly following this event unless server.close() is manually called. See the example in discussion of server.listen().
Event: 'listening'
#
Added in: v0.1.90
Emitted when the server has been bound after calling server.listen().
Event: 'drop'
#
Added in: v18.6.0, v16.17.0
When the number of connections reaches the threshold of server.maxConnections, the server will drop new connections and emit 'drop' event instead. If it is a TCP server, the argument is as follows, otherwise the argument is undefined.
data <Object> The argument passed to event listener.
localAddress <string> Local address.
localPort <number> Local port.
localFamily <string> Local family.
remoteAddress <string> Remote address.
remotePort <number> Remote port.
remoteFamily <string> Remote IP family. 'IPv4' or 'IPv6'.
server.address()
#
History

















Returns: <Object> | <string> | <null>
Returns the bound address, the address family name, and port of the server as reported by the operating system if listening on an IP socket (useful to find which port was assigned when getting an OS-assigned address): { port: 12346, family: 'IPv4', address: '127.0.0.1' }.
For a server listening on a pipe or Unix domain socket, the name is returned as a string.
const server = net.createServer((socket) => {
  socket.end('goodbye\n');
}).on('error', (err) => {
  // Handle errors here.
  throw err;
});

// Grab an arbitrary unused port.
server.listen(() => {
  console.log('opened server on', server.address());
});
copy
server.address() returns null before the 'listening' event has been emitted or after calling server.close().
server.close([callback])
#
Added in: v0.1.90
callback <Function> Called when the server is closed.
Returns: <net.Server>
Stops the server from accepting new connections and keeps existing connections. This function is asynchronous, the server is finally closed when all connections are ended and the server emits a 'close' event. The optional callback will be called once the 'close' event occurs. Unlike that event, it will be called with an Error as its only argument if the server was not open when it was closed.
server[Symbol.asyncDispose]()
#
History













Calls server.close() and returns a promise that fulfills when the server has closed.
server.getConnections(callback)
#
Added in: v0.9.7
callback <Function>
Returns: <net.Server>
Asynchronously get the number of concurrent connections on the server. Works when sockets were sent to forks.
Callback should take two arguments err and count.
server.listen()
#
Start a server listening for connections. A net.Server can be a TCP or an IPC server depending on what it listens to.
Possible signatures:
server.listen(handle[, backlog][, callback])
server.listen(options[, callback])
server.listen(path[, backlog][, callback]) for IPC servers
server.listen([port[, host[, backlog]]][, callback]) for TCP servers
This function is asynchronous. When the server starts listening, the 'listening' event will be emitted. The last parameter callback will be added as a listener for the 'listening' event.
All listen() methods can take a backlog parameter to specify the maximum length of the queue of pending connections. The actual length will be determined by the OS through sysctl settings such as tcp_max_syn_backlog and somaxconn on Linux. The default value of this parameter is 511 (not 512).
All net.Socket are set to SO_REUSEADDR (see socket(7) for details).
The server.listen() method can be called again if and only if there was an error during the first server.listen() call or server.close() has been called. Otherwise, an ERR_SERVER_ALREADY_LISTEN error will be thrown.
One of the most common errors raised when listening is EADDRINUSE. This happens when another server is already listening on the requested port/path/handle. One way to handle this would be to retry after a certain amount of time:
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});
copy
server.listen(handle[, backlog][, callback])
#
Added in: v0.5.10
handle <Object>
backlog <number> Common parameter of server.listen() functions
callback <Function>
Returns: <net.Server>
Start a server listening for connections on a given handle that has already been bound to a port, a Unix domain socket, or a Windows named pipe.
The handle object can be either a server, a socket (anything with an underlying _handle member), or an object with an fd member that is a valid file descriptor.
Listening on a file descriptor is not supported on Windows.
server.listen(options[, callback])
#
History





















options <Object> Required. Supports the following properties:
backlog <number> Common parameter of server.listen() functions.
exclusive <boolean> Default: false
host <string>
ipv6Only <boolean> For TCP servers, setting ipv6Only to true will disable dual-stack support, i.e., binding to host :: won't make 0.0.0.0 be bound. Default: false.
reusePort <boolean> For TCP servers, setting reusePort to true allows multiple sockets on the same host to bind to the same port. Incoming connections are distributed by the operating system to listening sockets. This option is available only on some platforms, such as Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4, and AIX 7.2.5+. Default: false.
path <string> Will be ignored if port is specified. See Identifying paths for IPC connections.
port <number>
readableAll <boolean> For IPC servers makes the pipe readable for all users. Default: false.
signal <AbortSignal> An AbortSignal that may be used to close a listening server.
writableAll <boolean> For IPC servers makes the pipe writable for all users. Default: false.
callback <Function> functions.
Returns: <net.Server>
If port is specified, it behaves the same as server.listen([port[, host[, backlog]]][, callback]). Otherwise, if path is specified, it behaves the same as server.listen(path[, backlog][, callback]). If none of them is specified, an error will be thrown.
If exclusive is false (default), then cluster workers will use the same underlying handle, allowing connection handling duties to be shared. When exclusive is true, the handle is not shared, and attempted port sharing results in an error. An example which listens on an exclusive port is shown below.
server.listen({
  host: 'localhost',
  port: 80,
  exclusive: true,
});
copy
When exclusive is true and the underlying handle is shared, it is possible that several workers query a handle with different backlogs. In this case, the first backlog passed to the master process will be used.
Starting an IPC server as root may cause the server path to be inaccessible for unprivileged users. Using readableAll and writableAll will make the server accessible for all users.
If the signal option is enabled, calling .abort() on the corresponding AbortController is similar to calling .close() on the server:
const controller = new AbortController();
server.listen({
  host: 'localhost',
  port: 80,
  signal: controller.signal,
});
// Later, when you want to close the server.
controller.abort();
copy
server.listen(path[, backlog][, callback])
#
Added in: v0.1.90
path <string> Path the server should listen to. See Identifying paths for IPC connections.
backlog <number> Common parameter of server.listen() functions.
callback <Function>.
Returns: <net.Server>
Start an IPC server listening for connections on the given path.
server.listen([port[, host[, backlog]]][, callback])
#
Added in: v0.1.90
port <number>
host <string>
backlog <number> Common parameter of server.listen() functions.
callback <Function>.
Returns: <net.Server>
Start a TCP server listening for connections on the given port and host.
If port is omitted or is 0, the operating system will assign an arbitrary unused port, which can be retrieved by using server.address().port after the 'listening' event has been emitted.
If host is omitted, the server will accept connections on the unspecified IPv6 address (::) when IPv6 is available, or the unspecified IPv4 address (0.0.0.0) otherwise.
In most operating systems, listening to the unspecified IPv6 address (::) may cause the net.Server to also listen on the unspecified IPv4 address (0.0.0.0).
server.listening
#
Added in: v5.7.0
<boolean> Indicates whether or not the server is listening for connections.
server.maxConnections
#
History













<integer>
When the number of connections reaches the server.maxConnections threshold:
If the process is not running in cluster mode, Node.js will close the connection.
If the process is running in cluster mode, Node.js will, by default, route the connection to another worker process. To close the connection instead, set [server.dropMaxConnection][] to true.
It is not recommended to use this option once a socket has been sent to a child with child_process.fork().
server.dropMaxConnection
#
Added in: v23.1.0, v22.12.0
<boolean>
Set this property to true to begin closing connections once the number of connections reaches the [server.maxConnections][] threshold. This setting is only effective in cluster mode.
server.ref()
#
Added in: v0.9.1
Returns: <net.Server>
Opposite of unref(), calling ref() on a previously unrefed server will not let the program exit if it's the only server left (the default behavior). If the server is refed calling ref() again will have no effect.
server.unref()
#
Added in: v0.9.1
Returns: <net.Server>
Calling unref() on a server will allow the program to exit if this is the only active server in the event system. If the server is already unrefed calling unref() again will have no effect.
Class: net.Socket
#
Added in: v0.3.4
Extends: <stream.Duplex>
This class is an abstraction of a TCP socket or a streaming IPC endpoint (uses named pipes on Windows, and Unix domain sockets otherwise). It is also an EventEmitter.
A net.Socket can be created by the user and used directly to interact with a server. For example, it is returned by net.createConnection(), so the user can use it to talk to the server.
It can also be created by Node.js and passed to the user when a connection is received. For example, it is passed to the listeners of a 'connection' event emitted on a net.Server, so the user can use it to interact with the client.
new net.Socket([options])
#
History

















options <Object> Available options are:
allowHalfOpen <boolean> If set to false, then the socket will automatically end the writable side when the readable side ends. See net.createServer() and the 'end' event for details. Default: false.
fd <number> If specified, wrap around an existing socket with the given file descriptor, otherwise a new socket will be created.
onread <Object> If specified, incoming data is stored in a single buffer and passed to the supplied callback when data arrives on the socket. This will cause the streaming functionality to not provide any data. The socket will emit events like 'error', 'end', and 'close' as usual. Methods like pause() and resume() will also behave as expected.
buffer <Buffer> | <Uint8Array> | <Function> Either a reusable chunk of memory to use for storing incoming data or a function that returns such.
callback <Function> This function is called for every chunk of incoming data. Two arguments are passed to it: the number of bytes written to buffer and a reference to buffer. Return false from this function to implicitly pause() the socket. This function will be executed in the global context.
readable <boolean> Allow reads on the socket when an fd is passed, otherwise ignored. Default: false.
signal <AbortSignal> An Abort signal that may be used to destroy the socket.
writable <boolean> Allow writes on the socket when an fd is passed, otherwise ignored. Default: false.
Returns: <net.Socket>
Creates a new socket object.
The newly created socket can be either a TCP socket or a streaming IPC endpoint, depending on what it connect() to.
Event: 'close'
#
Added in: v0.1.90
hadError <boolean> true if the socket had a transmission error.
Emitted once the socket is fully closed. The argument hadError is a boolean which says if the socket was closed due to a transmission error.
Event: 'connect'
#
Added in: v0.1.90
Emitted when a socket connection is successfully established. See net.createConnection().
Event: 'connectionAttempt'
#
Added in: v21.6.0, v20.12.0
ip <string> The IP which the socket is attempting to connect to.
port <number> The port which the socket is attempting to connect to.
family <number> The family of the IP. It can be 6 for IPv6 or 4 for IPv4.
Emitted when a new connection attempt is started. This may be emitted multiple times if the family autoselection algorithm is enabled in socket.connect(options).
Event: 'connectionAttemptFailed'
#
Added in: v21.6.0, v20.12.0
ip <string> The IP which the socket attempted to connect to.
port <number> The port which the socket attempted to connect to.
family <number> The family of the IP. It can be 6 for IPv6 or 4 for IPv4.
error <Error> The error associated with the failure.
Emitted when a connection attempt failed. This may be emitted multiple times if the family autoselection algorithm is enabled in socket.connect(options).
Event: 'connectionAttemptTimeout'
#
Added in: v21.6.0, v20.12.0
ip <string> The IP which the socket attempted to connect to.
port <number> The port which the socket attempted to connect to.
family <number> The family of the IP. It can be 6 for IPv6 or 4 for IPv4.
Emitted when a connection attempt timed out. This is only emitted (and may be emitted multiple times) if the family autoselection algorithm is enabled in socket.connect(options).
Event: 'data'
#
Added in: v0.1.90
<Buffer> | <string>
Emitted when data is received. The argument data will be a Buffer or String. Encoding of data is set by socket.setEncoding().
The data will be lost if there is no listener when a Socket emits a 'data' event.
Event: 'drain'
#
Added in: v0.1.90
Emitted when the write buffer becomes empty. Can be used to throttle uploads.
See also: the return values of socket.write().
Event: 'end'
#
Added in: v0.1.90
Emitted when the other end of the socket signals the end of transmission, thus ending the readable side of the socket.
By default (allowHalfOpen is false) the socket will send an end of transmission packet back and destroy its file descriptor once it has written out its pending write queue. However, if allowHalfOpen is set to true, the socket will not automatically end() its writable side, allowing the user to write arbitrary amounts of data. The user must call end() explicitly to close the connection (i.e. sending a FIN packet back).
Event: 'error'
#
Added in: v0.1.90
<Error>
Emitted when an error occurs. The 'close' event will be called directly following this event.
Event: 'lookup'
#
History













Emitted after resolving the host name but before connecting. Not applicable to Unix sockets.
err <Error> | <null> The error object. See dns.lookup().
address <string> The IP address.
family <number> | <null> The address type. See dns.lookup().
host <string> The host name.
Event: 'ready'
#
Added in: v9.11.0
Emitted when a socket is ready to be used.
Triggered immediately after 'connect'.
Event: 'timeout'
#
Added in: v0.1.90
Emitted if the socket times out from inactivity. This is only to notify that the socket has been idle. The user must manually close the connection.
See also: socket.setTimeout().
socket.address()
#
History

















Returns: <Object>
Returns the bound address, the address family name and port of the socket as reported by the operating system: { port: 12346, family: 'IPv4', address: '127.0.0.1' }
socket.autoSelectFamilyAttemptedAddresses
#
Added in: v19.4.0, v18.18.0
<string[]>
This property is only present if the family autoselection algorithm is enabled in socket.connect(options) and it is an array of the addresses that have been attempted.
Each address is a string in the form of $IP:$PORT. If the connection was successful, then the last address is the one that the socket is currently connected to.
socket.bufferSize
#
Added in: v0.3.8Deprecated since: v14.6.0
Stability: 0 - Deprecated: Use writable.writableLength instead.
<integer>
This property shows the number of characters buffered for writing. The buffer may contain strings whose length after encoding is not yet known. So this number is only an approximation of the number of bytes in the buffer.
net.Socket has the property that socket.write() always works. This is to help users get up and running quickly. The computer cannot always keep up with the amount of data that is written to a socket. The network connection simply might be too slow. Node.js will internally queue up the data written to a socket and send it out over the wire when it is possible.
The consequence of this internal buffering is that memory may grow. Users who experience large or growing bufferSize should attempt to "throttle" the data flows in their program with socket.pause() and socket.resume().
socket.bytesRead
#
Added in: v0.5.3
<integer>
The amount of received bytes.
socket.bytesWritten
#
Added in: v0.5.3
<integer>
The amount of bytes sent.
socket.connect()
#
Initiate a connection on a given socket.
Possible signatures:
socket.connect(options[, connectListener])
socket.connect(path[, connectListener]) for IPC connections.
socket.connect(port[, host][, connectListener]) for TCP connections.
Returns: <net.Socket> The socket itself.
This function is asynchronous. When the connection is established, the 'connect' event will be emitted. If there is a problem connecting, instead of a 'connect' event, an 'error' event will be emitted with the error passed to the 'error' listener. The last parameter connectListener, if supplied, will be added as a listener for the 'connect' event once.
This function should only be used for reconnecting a socket after 'close' has been emitted or otherwise it may lead to undefined behavior.
socket.connect(options[, connectListener])
#
History

































options <Object>
connectListener <Function> Common parameter of socket.connect() methods. Will be added as a listener for the 'connect' event once.
Returns: <net.Socket> The socket itself.
Initiate a connection on a given socket. Normally this method is not needed, the socket should be created and opened with net.createConnection(). Use this only when implementing a custom Socket.
For TCP connections, available options are:
autoSelectFamily <boolean>: If set to true, it enables a family autodetection algorithm that loosely implements section 5 of RFC 8305. The all option passed to lookup is set to true and the sockets attempts to connect to all obtained IPv6 and IPv4 addresses, in sequence, until a connection is established. The first returned AAAA address is tried first, then the first returned A address, then the second returned AAAA address and so on. Each connection attempt (but the last one) is given the amount of time specified by the autoSelectFamilyAttemptTimeout option before timing out and trying the next address. Ignored if the family option is not 0 or if localAddress is set. Connection errors are not emitted if at least one connection succeeds. If all connections attempts fails, a single AggregateError with all failed attempts is emitted. Default: net.getDefaultAutoSelectFamily().
autoSelectFamilyAttemptTimeout <number>: The amount of time in milliseconds to wait for a connection attempt to finish before trying the next address when using the autoSelectFamily option. If set to a positive integer less than 10, then the value 10 will be used instead. Default: net.getDefaultAutoSelectFamilyAttemptTimeout().
family <number>: Version of IP stack. Must be 4, 6, or 0. The value 0 indicates that both IPv4 and IPv6 addresses are allowed. Default: 0.
hints <number> Optional dns.lookup() hints.
host <string> Host the socket should connect to. Default: 'localhost'.
keepAlive <boolean> If set to true, it enables keep-alive functionality on the socket immediately after the connection is established, similarly on what is done in socket.setKeepAlive(). Default: false.
keepAliveInitialDelay <number> If set to a positive number, it sets the initial delay before the first keepalive probe is sent on an idle socket. Default: 0.
localAddress <string> Local address the socket should connect from.
localPort <number> Local port the socket should connect from.
lookup <Function> Custom lookup function. Default: dns.lookup().
noDelay <boolean> If set to true, it disables the use of Nagle's algorithm immediately after the socket is established. Default: false.
port <number> Required. Port the socket should connect to.
blockList <net.BlockList> blockList can be used for disabling outbound access to specific IP addresses, IP ranges, or IP subnets.
For IPC connections, available options are:
path <string> Required. Path the client should connect to. See Identifying paths for IPC connections. If provided, the TCP-specific options above are ignored.
socket.connect(path[, connectListener])
#
path <string> Path the client should connect to. See Identifying paths for IPC connections.
connectListener <Function> Common parameter of socket.connect() methods. Will be added as a listener for the 'connect' event once.
Returns: <net.Socket> The socket itself.
Initiate an IPC connection on the given socket.
Alias to socket.connect(options[, connectListener]) called with { path: path } as options.
socket.connect(port[, host][, connectListener])
#
Added in: v0.1.90
port <number> Port the client should connect to.
host <string> Host the client should connect to.
connectListener <Function> Common parameter of socket.connect() methods. Will be added as a listener for the 'connect' event once.
Returns: <net.Socket> The socket itself.
Initiate a TCP connection on the given socket.
Alias to socket.connect(options[, connectListener]) called with {port: port, host: host} as options.
socket.connecting
#
Added in: v6.1.0
<boolean>
If true, socket.connect(options[, connectListener]) was called and has not yet finished. It will stay true until the socket becomes connected, then it is set to false and the 'connect' event is emitted. Note that the socket.connect(options[, connectListener]) callback is a listener for the 'connect' event.
socket.destroy([error])
#
Added in: v0.1.90
error <Object>
Returns: <net.Socket>
Ensures that no more I/O activity happens on this socket. Destroys the stream and closes the connection.
See writable.destroy() for further details.
socket.destroyed
#
<boolean> Indicates if the connection is destroyed or not. Once a connection is destroyed no further data can be transferred using it.
See writable.destroyed for further details.
socket.destroySoon()
#
Added in: v0.3.4
Destroys the socket after all data is written. If the 'finish' event was already emitted the socket is destroyed immediately. If the socket is still writable it implicitly calls socket.end().
socket.end([data[, encoding]][, callback])
#
Added in: v0.1.90
data <string> | <Buffer> | <Uint8Array>
encoding <string> Only used when data is string. Default: 'utf8'.
callback <Function> Optional callback for when the socket is finished.
Returns: <net.Socket> The socket itself.
Half-closes the socket. i.e., it sends a FIN packet. It is possible the server will still send some data.
See writable.end() for further details.
socket.localAddress
#
Added in: v0.9.6
<string>
The string representation of the local IP address the remote client is connecting on. For example, in a server listening on '0.0.0.0', if a client connects on '192.168.1.1', the value of socket.localAddress would be '192.168.1.1'.
socket.localPort
#
Added in: v0.9.6
<integer>
The numeric representation of the local port. For example, 80 or 21.
socket.localFamily
#
Added in: v18.8.0, v16.18.0
<string>
The string representation of the local IP family. 'IPv4' or 'IPv6'.
socket.pause()
#
Returns: <net.Socket> The socket itself.
Pauses the reading of data. That is, 'data' events will not be emitted. Useful to throttle back an upload.
socket.pending
#
Added in: v11.2.0, v10.16.0
<boolean>
This is true if the socket is not connected yet, either because .connect() has not yet been called or because it is still in the process of connecting (see socket.connecting).
socket.ref()
#
Added in: v0.9.1
Returns: <net.Socket> The socket itself.
Opposite of unref(), calling ref() on a previously unrefed socket will not let the program exit if it's the only socket left (the default behavior). If the socket is refed calling ref again will have no effect.
socket.remoteAddress
#
Added in: v0.5.10
<string>
The string representation of the remote IP address. For example, '74.125.127.100' or '2001:4860:a005::68'. Value may be undefined if the socket is destroyed (for example, if the client disconnected).
socket.remoteFamily
#
Added in: v0.11.14
<string>
The string representation of the remote IP family. 'IPv4' or 'IPv6'. Value may be undefined if the socket is destroyed (for example, if the client disconnected).
socket.remotePort
#
Added in: v0.5.10
<integer>
The numeric representation of the remote port. For example, 80 or 21. Value may be undefined if the socket is destroyed (for example, if the client disconnected).
socket.resetAndDestroy()
#
Added in: v18.3.0, v16.17.0
Returns: <net.Socket>
Close the TCP connection by sending an RST packet and destroy the stream. If this TCP socket is in connecting status, it will send an RST packet and destroy this TCP socket once it is connected. Otherwise, it will call socket.destroy with an ERR_SOCKET_CLOSED Error. If this is not a TCP socket (for example, a pipe), calling this method will immediately throw an ERR_INVALID_HANDLE_TYPE Error.
socket.resume()
#
Returns: <net.Socket> The socket itself.
Resumes reading after a call to socket.pause().
socket.setEncoding([encoding])
#
Added in: v0.1.90
encoding <string>
Returns: <net.Socket> The socket itself.
Set the encoding for the socket as a Readable Stream. See readable.setEncoding() for more information.
socket.setKeepAlive([enable][, initialDelay])
#
History













enable <boolean> Default: false
initialDelay <number> Default: 0
Returns: <net.Socket> The socket itself.
Enable/disable keep-alive functionality, and optionally set the initial delay before the first keepalive probe is sent on an idle socket.
Set initialDelay (in milliseconds) to set the delay between the last data packet received and the first keepalive probe. Setting 0 for initialDelay will leave the value unchanged from the default (or previous) setting.
Enabling the keep-alive functionality will set the following socket options:
SO_KEEPALIVE=1
TCP_KEEPIDLE=initialDelay
TCP_KEEPCNT=10
TCP_KEEPINTVL=1
socket.setNoDelay([noDelay])
#
Added in: v0.1.90
noDelay <boolean> Default: true
Returns: <net.Socket> The socket itself.
Enable/disable the use of Nagle's algorithm.
When a TCP connection is created, it will have Nagle's algorithm enabled.
Nagle's algorithm delays data before it is sent via the network. It attempts to optimize throughput at the expense of latency.
Passing true for noDelay or not passing an argument will disable Nagle's algorithm for the socket. Passing false for noDelay will enable Nagle's algorithm.
socket.setTimeout(timeout[, callback])
#
History













timeout <number>
callback <Function>
Returns: <net.Socket> The socket itself.
Sets the socket to timeout after timeout milliseconds of inactivity on the socket. By default net.Socket do not have a timeout.
When an idle timeout is triggered the socket will receive a 'timeout' event but the connection will not be severed. The user must manually call socket.end() or socket.destroy() to end the connection.
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('socket timeout');
  socket.end();
});
copy
If timeout is 0, then the existing idle timeout is disabled.
The optional callback parameter will be added as a one-time listener for the 'timeout' event.
socket.timeout
#
Added in: v10.7.0
<number> | <undefined>
The socket timeout in milliseconds as set by socket.setTimeout(). It is undefined if a timeout has not been set.
socket.unref()
#
Added in: v0.9.1
Returns: <net.Socket> The socket itself.
Calling unref() on a socket will allow the program to exit if this is the only active socket in the event system. If the socket is already unrefed calling unref() again will have no effect.
socket.write(data[, encoding][, callback])
#
Added in: v0.1.90
data <string> | <Buffer> | <Uint8Array>
encoding <string> Only used when data is string. Default: utf8.
callback <Function>
Returns: <boolean>
Sends data on the socket. The second parameter specifies the encoding in the case of a string. It defaults to UTF8 encoding.
Returns true if the entire data was flushed successfully to the kernel buffer. Returns false if all or part of the data was queued in user memory. 'drain' will be emitted when the buffer is again free.
The optional callback parameter will be executed when the data is finally written out, which may not be immediately.
See Writable stream write() method for more information.
socket.readyState
#
Added in: v0.5.0
<string>
This property represents the state of the connection as a string.
If the stream is connecting socket.readyState is opening.
If the stream is readable and writable, it is open.
If the stream is readable and not writable, it is readOnly.
If the stream is not readable and writable, it is writeOnly.
net.connect()
#
Aliases to net.createConnection().
Possible signatures:
net.connect(options[, connectListener])
net.connect(path[, connectListener]) for IPC connections.
net.connect(port[, host][, connectListener]) for TCP connections.
net.connect(options[, connectListener])
#
Added in: v0.7.0
options <Object>
connectListener <Function>
Returns: <net.Socket>
Alias to net.createConnection(options[, connectListener]).
net.connect(path[, connectListener])
#
Added in: v0.1.90
path <string>
connectListener <Function>
Returns: <net.Socket>
Alias to net.createConnection(path[, connectListener]).
net.connect(port[, host][, connectListener])
#
Added in: v0.1.90
port <number>
host <string>
connectListener <Function>
Returns: <net.Socket>
Alias to net.createConnection(port[, host][, connectListener]).
net.createConnection()
#
A factory function, which creates a new net.Socket, immediately initiates connection with socket.connect(), then returns the net.Socket that starts the connection.
When the connection is established, a 'connect' event will be emitted on the returned socket. The last parameter connectListener, if supplied, will be added as a listener for the 'connect' event once.
Possible signatures:
net.createConnection(options[, connectListener])
net.createConnection(path[, connectListener]) for IPC connections.
net.createConnection(port[, host][, connectListener]) for TCP connections.
The net.connect() function is an alias to this function.
net.createConnection(options[, connectListener])
#
Added in: v0.1.90
options <Object> Required. Will be passed to both the new net.Socket([options]) call and the socket.connect(options[, connectListener]) method.
connectListener <Function> Common parameter of the net.createConnection() functions. If supplied, will be added as a listener for the 'connect' event on the returned socket once.
Returns: <net.Socket> The newly created socket used to start the connection.
For available options, see new net.Socket([options]) and socket.connect(options[, connectListener]).
Additional options:
timeout <number> If set, will be used to call socket.setTimeout(timeout) after the socket is created, but before it starts the connection.
Following is an example of a client of the echo server described in the net.createServer() section:
const net = require('node:net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
copy
To connect on the socket /tmp/echo.sock:
const client = net.createConnection({ path: '/tmp/echo.sock' });
copy
Following is an example of a client using the port and onread option. In this case, the onread option will be only used to call new net.Socket([options]) and the port option will be used to call socket.connect(options[, connectListener]).
const net = require('node:net');
net.createConnection({
  port: 8124,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
copy
net.createConnection(path[, connectListener])
#
Added in: v0.1.90
path <string> Path the socket should connect to. Will be passed to socket.connect(path[, connectListener]). See Identifying paths for IPC connections.
connectListener <Function> Common parameter of the net.createConnection() functions, an "once" listener for the 'connect' event on the initiating socket. Will be passed to socket.connect(path[, connectListener]).
Returns: <net.Socket> The newly created socket used to start the connection.
Initiates an IPC connection.
This function creates a new net.Socket with all options set to default, immediately initiates connection with socket.connect(path[, connectListener]), then returns the net.Socket that starts the connection.
net.createConnection(port[, host][, connectListener])
#
Added in: v0.1.90
port <number> Port the socket should connect to. Will be passed to socket.connect(port[, host][, connectListener]).
host <string> Host the socket should connect to. Will be passed to socket.connect(port[, host][, connectListener]). Default: 'localhost'.
connectListener <Function> Common parameter of the net.createConnection() functions, an "once" listener for the 'connect' event on the initiating socket. Will be passed to socket.connect(port[, host][, connectListener]).
Returns: <net.Socket> The newly created socket used to start the connection.
Initiates a TCP connection.
This function creates a new net.Socket with all options set to default, immediately initiates connection with socket.connect(port[, host][, connectListener]), then returns the net.Socket that starts the connection.
net.createServer([options][, connectionListener])
#
History


















options <Object>
allowHalfOpen <boolean> If set to false, then the socket will automatically end the writable side when the readable side ends. Default: false.
highWaterMark <number> Optionally overrides all net.Sockets' readableHighWaterMark and writableHighWaterMark. Default: See stream.getDefaultHighWaterMark().
keepAlive <boolean> If set to true, it enables keep-alive functionality on the socket immediately after a new incoming connection is received, similarly on what is done in socket.setKeepAlive(). Default: false.
keepAliveInitialDelay <number> If set to a positive number, it sets the initial delay before the first keepalive probe is sent on an idle socket. Default: 0.
noDelay <boolean> If set to true, it disables the use of Nagle's algorithm immediately after a new incoming connection is received. Default: false.
pauseOnConnect <boolean> Indicates whether the socket should be paused on incoming connections. Default: false.
blockList <net.BlockList> blockList can be used for disabling inbound access to specific IP addresses, IP ranges, or IP subnets. This does not work if the server is behind a reverse proxy, NAT, etc. because the address checked against the block list is the address of the proxy, or the one specified by the NAT.
connectionListener <Function> Automatically set as a listener for the 'connection' event.
Returns: <net.Server>
Creates a new TCP or IPC server.
If allowHalfOpen is set to true, when the other end of the socket signals the end of transmission, the server will only send back the end of transmission when socket.end() is explicitly called. For example, in the context of TCP, when a FIN packed is received, a FIN packed is sent back only when socket.end() is explicitly called. Until then the connection is half-closed (non-readable but still writable). See 'end' event and RFC 1122 (section 4.2.2.13) for more information.
If pauseOnConnect is set to true, then the socket associated with each incoming connection will be paused, and no data will be read from its handle. This allows connections to be passed between processes without any data being read by the original process. To begin reading data from a paused socket, call socket.resume().
The server can be a TCP server or an IPC server, depending on what it listen() to.
Here is an example of a TCP echo server which listens for connections on port 8124:
const net = require('node:net');
const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
copy
Test this by using telnet:
telnet localhost 8124
copy
To listen on the socket /tmp/echo.sock:
server.listen('/tmp/echo.sock', () => {
  console.log('server bound');
});
copy
Use nc to connect to a Unix domain socket server:
nc -U /tmp/echo.sock
copy
net.getDefaultAutoSelectFamily()
#
Added in: v19.4.0
Gets the current default value of the autoSelectFamily option of socket.connect(options). The initial default value is true, unless the command line option --no-network-family-autoselection is provided.
Returns: <boolean> The current default value of the autoSelectFamily option.
net.setDefaultAutoSelectFamily(value)
#
Added in: v19.4.0
Sets the default value of the autoSelectFamily option of socket.connect(options).
value <boolean> The new default value. The initial default value is true, unless the command line option --no-network-family-autoselection is provided.
net.getDefaultAutoSelectFamilyAttemptTimeout()
#
Added in: v19.8.0, v18.18.0
Gets the current default value of the autoSelectFamilyAttemptTimeout option of socket.connect(options). The initial default value is 250 or the value specified via the command line option --network-family-autoselection-attempt-timeout.
Returns: <number> The current default value of the autoSelectFamilyAttemptTimeout option.
net.setDefaultAutoSelectFamilyAttemptTimeout(value)
#
Added in: v19.8.0, v18.18.0
Sets the default value of the autoSelectFamilyAttemptTimeout option of socket.connect(options).
value <number> The new default value, which must be a positive number. If the number is less than 10, the value 10 is used instead. The initial default value is 250 or the value specified via the command line option --network-family-autoselection-attempt-timeout.
net.isIP(input)
#
Added in: v0.3.0
input <string>
Returns: <integer>
Returns 6 if input is an IPv6 address. Returns 4 if input is an IPv4 address in dot-decimal notation with no leading zeroes. Otherwise, returns 0.
net.isIP('::1'); // returns 6
net.isIP('127.0.0.1'); // returns 4
net.isIP('127.000.000.001'); // returns 0
net.isIP('127.0.0.1/24'); // returns 0
net.isIP('fhqwhgads'); // returns 0
copy
net.isIPv4(input)
#
Added in: v0.3.0
input <string>
Returns: <boolean>
Returns true if input is an IPv4 address in dot-decimal notation with no leading zeroes. Otherwise, returns false.
net.isIPv4('127.0.0.1'); // returns true
net.isIPv4('127.000.000.001'); // returns false
net.isIPv4('127.0.0.1/24'); // returns false
net.isIPv4('fhqwhgads'); // returns false
copy
net.isIPv6(input)
#
Added in: v0.3.0
input <string>
Returns: <boolean>
Returns true if input is an IPv6 address. Otherwise, returns false.
net.isIPv6('::1'); // returns true
net.isIPv6('fhqwhgads'); // returns false
copy
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
OS
os.EOL
os.availableParallelism()
os.arch()
os.constants
os.cpus()
os.devNull
os.endianness()
os.freemem()
os.getPriority([pid])
os.homedir()
os.hostname()
os.loadavg()
os.machine()
os.networkInterfaces()
os.platform()
os.release()
os.setPriority([pid, ]priority)
os.tmpdir()
os.totalmem()
os.type()
os.uptime()
os.userInfo([options])
os.version()
OS constants
Signal constants
Error constants
POSIX error constants
Windows-specific error constants
dlopen constants
Priority constants
libuv constants
OS
#
Stability: 2 - Stable
Source Code: lib/os.js
The node:os module provides operating system-related utility methods and properties. It can be accessed using:
const os = require('node:os');
copy
os.EOL
#
Added in: v0.7.8
<string>
The operating system-specific end-of-line marker.
\n on POSIX
\r\n on Windows
os.availableParallelism()
#
Added in: v19.4.0, v18.14.0
Returns: <integer>
Returns an estimate of the default amount of parallelism a program should use. Always returns a value greater than zero.
This function is a small wrapper about libuv's uv_available_parallelism().
os.arch()
#
Added in: v0.5.0
Returns: <string>
Returns the operating system CPU architecture for which the Node.js binary was compiled. Possible values are 'arm', 'arm64', 'ia32', 'loong64', 'mips', 'mipsel', 'ppc64', 'riscv64', 's390x', and 'x64'.
The return value is equivalent to process.arch.
os.constants
#
Added in: v6.3.0
<Object>
Contains commonly used operating system-specific constants for error codes, process signals, and so on. The specific constants defined are described in OS constants.
os.cpus()
#
Added in: v0.3.3
Returns: <Object[]>
Returns an array of objects containing information about each logical CPU core. The array will be empty if no CPU information is available, such as if the /proc file system is unavailable.
The properties included on each object include:
model <string>
speed <number> (in MHz)
times <Object>
user <number> The number of milliseconds the CPU has spent in user mode.
nice <number> The number of milliseconds the CPU has spent in nice mode.
sys <number> The number of milliseconds the CPU has spent in sys mode.
idle <number> The number of milliseconds the CPU has spent in idle mode.
irq <number> The number of milliseconds the CPU has spent in irq mode.
[
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 252020,
      nice: 0,
      sys: 30340,
      idle: 1070356870,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 306960,
      nice: 0,
      sys: 26980,
      idle: 1071569080,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 248450,
      nice: 0,
      sys: 21750,
      idle: 1070919370,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 256880,
      nice: 0,
      sys: 19430,
      idle: 1070905480,
      irq: 20,
    },
  },
]
copy
nice values are POSIX-only. On Windows, the nice values of all processors are always 0.
os.cpus().length should not be used to calculate the amount of parallelism available to an application. Use os.availableParallelism() for this purpose.
os.devNull
#
Added in: v16.3.0, v14.18.0
<string>
The platform-specific file path of the null device.
\\.\nul on Windows
/dev/null on POSIX
os.endianness()
#
Added in: v0.9.4
Returns: <string>
Returns a string identifying the endianness of the CPU for which the Node.js binary was compiled.
Possible values are 'BE' for big endian and 'LE' for little endian.
os.freemem()
#
Added in: v0.3.3
Returns: <integer>
Returns the amount of free system memory in bytes as an integer.
os.getPriority([pid])
#
Added in: v10.10.0
pid <integer> The process ID to retrieve scheduling priority for. Default: 0.
Returns: <integer>
Returns the scheduling priority for the process specified by pid. If pid is not provided or is 0, the priority of the current process is returned.
os.homedir()
#
Added in: v2.3.0
Returns: <string>
Returns the string path of the current user's home directory.
On POSIX, it uses the $HOME environment variable if defined. Otherwise it uses the effective UID to look up the user's home directory.
On Windows, it uses the USERPROFILE environment variable if defined. Otherwise it uses the path to the profile directory of the current user.
os.hostname()
#
Added in: v0.3.3
Returns: <string>
Returns the host name of the operating system as a string.
os.loadavg()
#
Added in: v0.3.3
Returns: <number[]>
Returns an array containing the 1, 5, and 15 minute load averages.
The load average is a measure of system activity calculated by the operating system and expressed as a fractional number.
The load average is a Unix-specific concept. On Windows, the return value is always [0, 0, 0].
os.machine()
#
Added in: v18.9.0, v16.18.0
Returns: <string>
Returns the machine type as a string, such as arm, arm64, aarch64, mips, mips64, ppc64, ppc64le, s390x, i386, i686, x86_64.
On POSIX systems, the machine type is determined by calling uname(3). On Windows, RtlGetVersion() is used, and if it is not available, GetVersionExW() will be used. See https://en.wikipedia.org/wiki/Uname#Examples for more information.
os.networkInterfaces()
#
History

















Returns: <Object>
Returns an object containing network interfaces that have been assigned a network address.
Each key on the returned object identifies a network interface. The associated value is an array of objects that each describe an assigned network address.
The properties available on the assigned network address object include:
address <string> The assigned IPv4 or IPv6 address
netmask <string> The IPv4 or IPv6 network mask
family <string> Either IPv4 or IPv6
mac <string> The MAC address of the network interface
internal <boolean> true if the network interface is a loopback or similar interface that is not remotely accessible; otherwise false
scopeid <number> The numeric IPv6 scope ID (only specified when family is IPv6)
cidr <string> The assigned IPv4 or IPv6 address with the routing prefix in CIDR notation. If the netmask is invalid, this property is set to null.
{
  lo: [
    {
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
      cidr: '127.0.0.1/8'
    },
    {
      address: '::1',
      netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
      family: 'IPv6',
      mac: '00:00:00:00:00:00',
      scopeid: 0,
      internal: true,
      cidr: '::1/128'
    }
  ],
  eth0: [
    {
      address: '192.168.1.108',
      netmask: '255.255.255.0',
      family: 'IPv4',
      mac: '01:02:03:0a:0b:0c',
      internal: false,
      cidr: '192.168.1.108/24'
    },
    {
      address: 'fe80::a00:27ff:fe4e:66a1',
      netmask: 'ffff:ffff:ffff:ffff::',
      family: 'IPv6',
      mac: '01:02:03:0a:0b:0c',
      scopeid: 1,
      internal: false,
      cidr: 'fe80::a00:27ff:fe4e:66a1/64'
    }
  ]
}
copy
os.platform()
#
Added in: v0.5.0
Returns: <string>
Returns a string identifying the operating system platform for which the Node.js binary was compiled. The value is set at compile time. Possible values are 'aix', 'darwin', 'freebsd','linux', 'openbsd', 'sunos', and 'win32'.
The return value is equivalent to process.platform.
The value 'android' may also be returned if Node.js is built on the Android operating system. Android support is experimental.
os.release()
#
Added in: v0.3.3
Returns: <string>
Returns the operating system as a string.
On POSIX systems, the operating system release is determined by calling uname(3). On Windows, GetVersionExW() is used. See https://en.wikipedia.org/wiki/Uname#Examples for more information.
os.setPriority([pid, ]priority)
#
Added in: v10.10.0
pid <integer> The process ID to set scheduling priority for. Default: 0.
priority <integer> The scheduling priority to assign to the process.
Attempts to set the scheduling priority for the process specified by pid. If pid is not provided or is 0, the process ID of the current process is used.
The priority input must be an integer between -20 (high priority) and 19 (low priority). Due to differences between Unix priority levels and Windows priority classes, priority is mapped to one of six priority constants in os.constants.priority. When retrieving a process priority level, this range mapping may cause the return value to be slightly different on Windows. To avoid confusion, set priority to one of the priority constants.
On Windows, setting priority to PRIORITY_HIGHEST requires elevated user privileges. Otherwise the set priority will be silently reduced to PRIORITY_HIGH.
os.tmpdir()
#
History













Returns: <string>
Returns the operating system's default directory for temporary files as a string.
On Windows, the result can be overridden by TEMP and TMP environment variables, and TEMP takes precedence over TMP. If neither is set, it defaults to %SystemRoot%\temp or %windir%\temp.
On non-Windows platforms, TMPDIR, TMP and TEMP environment variables will be checked to override the result of this method, in the described order. If none of them is set, it defaults to /tmp.
Some operating system distributions would either configure TMPDIR (non-Windows) or TEMP and TMP (Windows) by default without additional configurations by the system administrators. The result of os.tmpdir() typically reflects the system preference unless it's explicitly overridden by the users.
os.totalmem()
#
Added in: v0.3.3
Returns: <integer>
Returns the total amount of system memory in bytes as an integer.
os.type()
#
Added in: v0.3.3
Returns: <string>
Returns the operating system name as returned by uname(3). For example, it returns 'Linux' on Linux, 'Darwin' on macOS, and 'Windows_NT' on Windows.
See https://en.wikipedia.org/wiki/Uname#Examples for additional information about the output of running uname(3) on various operating systems.
os.uptime()
#
History













Returns: <integer>
Returns the system uptime in number of seconds.
os.userInfo([options])
#
Added in: v6.0.0
options <Object>
encoding <string> Character encoding used to interpret resulting strings. If encoding is set to 'buffer', the username, shell, and homedir values will be Buffer instances. Default: 'utf8'.
Returns: <Object>
Returns information about the currently effective user. On POSIX platforms, this is typically a subset of the password file. The returned object includes the username, uid, gid, shell, and homedir. On Windows, the uid and gid fields are -1, and shell is null.
The value of homedir returned by os.userInfo() is provided by the operating system. This differs from the result of os.homedir(), which queries environment variables for the home directory before falling back to the operating system response.
Throws a SystemError if a user has no username or homedir.
os.version()
#
Added in: v13.11.0, v12.17.0
Returns: <string>
Returns a string identifying the kernel version.
On POSIX systems, the operating system release is determined by calling uname(3). On Windows, RtlGetVersion() is used, and if it is not available, GetVersionExW() will be used. See https://en.wikipedia.org/wiki/Uname#Examples for more information.
OS constants
#
The following constants are exported by os.constants.
Not all constants will be available on every operating system.
Signal constants
#
History









The following signal constants are exported by os.constants.signals.
Constant
Description
SIGHUP
Sent to indicate when a controlling terminal is closed or a parent process exits.
SIGINT
Sent to indicate when a user wishes to interrupt a process (Ctrl+C).
SIGQUIT
Sent to indicate when a user wishes to terminate a process and perform a core dump.
SIGILL
Sent to a process to notify that it has attempted to perform an illegal, malformed, unknown, or privileged instruction.
SIGTRAP
Sent to a process when an exception has occurred.
SIGABRT
Sent to a process to request that it abort.
SIGIOT
Synonym for SIGABRT
SIGBUS
Sent to a process to notify that it has caused a bus error.
SIGFPE
Sent to a process to notify that it has performed an illegal arithmetic operation.
SIGKILL
Sent to a process to terminate it immediately.
SIGUSR1 SIGUSR2
Sent to a process to identify user-defined conditions.
SIGSEGV
Sent to a process to notify of a segmentation fault.
SIGPIPE
Sent to a process when it has attempted to write to a disconnected pipe.
SIGALRM
Sent to a process when a system timer elapses.
SIGTERM
Sent to a process to request termination.
SIGCHLD
Sent to a process when a child process terminates.
SIGSTKFLT
Sent to a process to indicate a stack fault on a coprocessor.
SIGCONT
Sent to instruct the operating system to continue a paused process.
SIGSTOP
Sent to instruct the operating system to halt a process.
SIGTSTP
Sent to a process to request it to stop.
SIGBREAK
Sent to indicate when a user wishes to interrupt a process.
SIGTTIN
Sent to a process when it reads from the TTY while in the background.
SIGTTOU
Sent to a process when it writes to the TTY while in the background.
SIGURG
Sent to a process when a socket has urgent data to read.
SIGXCPU
Sent to a process when it has exceeded its limit on CPU usage.
SIGXFSZ
Sent to a process when it grows a file larger than the maximum allowed.
SIGVTALRM
Sent to a process when a virtual timer has elapsed.
SIGPROF
Sent to a process when a system timer has elapsed.
SIGWINCH
Sent to a process when the controlling terminal has changed its size.
SIGIO
Sent to a process when I/O is available.
SIGPOLL
Synonym for SIGIO
SIGLOST
Sent to a process when a file lock has been lost.
SIGPWR
Sent to a process to notify of a power failure.
SIGINFO
Synonym for SIGPWR
SIGSYS
Sent to a process to notify of a bad argument.
SIGUNUSED
Synonym for SIGSYS

Error constants
#
The following error constants are exported by os.constants.errno.
POSIX error constants
#
Constant
Description
E2BIG
Indicates that the list of arguments is longer than expected.
EACCES
Indicates that the operation did not have sufficient permissions.
EADDRINUSE
Indicates that the network address is already in use.
EADDRNOTAVAIL
Indicates that the network address is currently unavailable for use.
EAFNOSUPPORT
Indicates that the network address family is not supported.
EAGAIN
Indicates that there is no data available and to try the operation again later.
EALREADY
Indicates that the socket already has a pending connection in progress.
EBADF
Indicates that a file descriptor is not valid.
EBADMSG
Indicates an invalid data message.
EBUSY
Indicates that a device or resource is busy.
ECANCELED
Indicates that an operation was canceled.
ECHILD
Indicates that there are no child processes.
ECONNABORTED
Indicates that the network connection has been aborted.
ECONNREFUSED
Indicates that the network connection has been refused.
ECONNRESET
Indicates that the network connection has been reset.
EDEADLK
Indicates that a resource deadlock has been avoided.
EDESTADDRREQ
Indicates that a destination address is required.
EDOM
Indicates that an argument is out of the domain of the function.
EDQUOT
Indicates that the disk quota has been exceeded.
EEXIST
Indicates that the file already exists.
EFAULT
Indicates an invalid pointer address.
EFBIG
Indicates that the file is too large.
EHOSTUNREACH
Indicates that the host is unreachable.
EIDRM
Indicates that the identifier has been removed.
EILSEQ
Indicates an illegal byte sequence.
EINPROGRESS
Indicates that an operation is already in progress.
EINTR
Indicates that a function call was interrupted.
EINVAL
Indicates that an invalid argument was provided.
EIO
Indicates an otherwise unspecified I/O error.
EISCONN
Indicates that the socket is connected.
EISDIR
Indicates that the path is a directory.
ELOOP
Indicates too many levels of symbolic links in a path.
EMFILE
Indicates that there are too many open files.
EMLINK
Indicates that there are too many hard links to a file.
EMSGSIZE
Indicates that the provided message is too long.
EMULTIHOP
Indicates that a multihop was attempted.
ENAMETOOLONG
Indicates that the filename is too long.
ENETDOWN
Indicates that the network is down.
ENETRESET
Indicates that the connection has been aborted by the network.
ENETUNREACH
Indicates that the network is unreachable.
ENFILE
Indicates too many open files in the system.
ENOBUFS
Indicates that no buffer space is available.
ENODATA
Indicates that no message is available on the stream head read queue.
ENODEV
Indicates that there is no such device.
ENOENT
Indicates that there is no such file or directory.
ENOEXEC
Indicates an exec format error.
ENOLCK
Indicates that there are no locks available.
ENOLINK
Indications that a link has been severed.
ENOMEM
Indicates that there is not enough space.
ENOMSG
Indicates that there is no message of the desired type.
ENOPROTOOPT
Indicates that a given protocol is not available.
ENOSPC
Indicates that there is no space available on the device.
ENOSR
Indicates that there are no stream resources available.
ENOSTR
Indicates that a given resource is not a stream.
ENOSYS
Indicates that a function has not been implemented.
ENOTCONN
Indicates that the socket is not connected.
ENOTDIR
Indicates that the path is not a directory.
ENOTEMPTY
Indicates that the directory is not empty.
ENOTSOCK
Indicates that the given item is not a socket.
ENOTSUP
Indicates that a given operation is not supported.
ENOTTY
Indicates an inappropriate I/O control operation.
ENXIO
Indicates no such device or address.
EOPNOTSUPP
Indicates that an operation is not supported on the socket. Although ENOTSUP and EOPNOTSUPP have the same value on Linux, according to POSIX.1 these error values should be distinct.)
EOVERFLOW
Indicates that a value is too large to be stored in a given data type.
EPERM
Indicates that the operation is not permitted.
EPIPE
Indicates a broken pipe.
EPROTO
Indicates a protocol error.
EPROTONOSUPPORT
Indicates that a protocol is not supported.
EPROTOTYPE
Indicates the wrong type of protocol for a socket.
ERANGE
Indicates that the results are too large.
EROFS
Indicates that the file system is read only.
ESPIPE
Indicates an invalid seek operation.
ESRCH
Indicates that there is no such process.
ESTALE
Indicates that the file handle is stale.
ETIME
Indicates an expired timer.
ETIMEDOUT
Indicates that the connection timed out.
ETXTBSY
Indicates that a text file is busy.
EWOULDBLOCK
Indicates that the operation would block.
EXDEV
Indicates an improper link.

Windows-specific error constants
#
The following error codes are specific to the Windows operating system.
Constant
Description
WSAEINTR
Indicates an interrupted function call.
WSAEBADF
Indicates an invalid file handle.
WSAEACCES
Indicates insufficient permissions to complete the operation.
WSAEFAULT
Indicates an invalid pointer address.
WSAEINVAL
Indicates that an invalid argument was passed.
WSAEMFILE
Indicates that there are too many open files.
WSAEWOULDBLOCK
Indicates that a resource is temporarily unavailable.
WSAEINPROGRESS
Indicates that an operation is currently in progress.
WSAEALREADY
Indicates that an operation is already in progress.
WSAENOTSOCK
Indicates that the resource is not a socket.
WSAEDESTADDRREQ
Indicates that a destination address is required.
WSAEMSGSIZE
Indicates that the message size is too long.
WSAEPROTOTYPE
Indicates the wrong protocol type for the socket.
WSAENOPROTOOPT
Indicates a bad protocol option.
WSAEPROTONOSUPPORT
Indicates that the protocol is not supported.
WSAESOCKTNOSUPPORT
Indicates that the socket type is not supported.
WSAEOPNOTSUPP
Indicates that the operation is not supported.
WSAEPFNOSUPPORT
Indicates that the protocol family is not supported.
WSAEAFNOSUPPORT
Indicates that the address family is not supported.
WSAEADDRINUSE
Indicates that the network address is already in use.
WSAEADDRNOTAVAIL
Indicates that the network address is not available.
WSAENETDOWN
Indicates that the network is down.
WSAENETUNREACH
Indicates that the network is unreachable.
WSAENETRESET
Indicates that the network connection has been reset.
WSAECONNABORTED
Indicates that the connection has been aborted.
WSAECONNRESET
Indicates that the connection has been reset by the peer.
WSAENOBUFS
Indicates that there is no buffer space available.
WSAEISCONN
Indicates that the socket is already connected.
WSAENOTCONN
Indicates that the socket is not connected.
WSAESHUTDOWN
Indicates that data cannot be sent after the socket has been shutdown.
WSAETOOMANYREFS
Indicates that there are too many references.
WSAETIMEDOUT
Indicates that the connection has timed out.
WSAECONNREFUSED
Indicates that the connection has been refused.
WSAELOOP
Indicates that a name cannot be translated.
WSAENAMETOOLONG
Indicates that a name was too long.
WSAEHOSTDOWN
Indicates that a network host is down.
WSAEHOSTUNREACH
Indicates that there is no route to a network host.
WSAENOTEMPTY
Indicates that the directory is not empty.
WSAEPROCLIM
Indicates that there are too many processes.
WSAEUSERS
Indicates that the user quota has been exceeded.
WSAEDQUOT
Indicates that the disk quota has been exceeded.
WSAESTALE
Indicates a stale file handle reference.
WSAEREMOTE
Indicates that the item is remote.
WSASYSNOTREADY
Indicates that the network subsystem is not ready.
WSAVERNOTSUPPORTED
Indicates that the winsock.dll version is out of range.
WSANOTINITIALISED
Indicates that successful WSAStartup has not yet been performed.
WSAEDISCON
Indicates that a graceful shutdown is in progress.
WSAENOMORE
Indicates that there are no more results.
WSAECANCELLED
Indicates that an operation has been canceled.
WSAEINVALIDPROCTABLE
Indicates that the procedure call table is invalid.
WSAEINVALIDPROVIDER
Indicates an invalid service provider.
WSAEPROVIDERFAILEDINIT
Indicates that the service provider failed to initialized.
WSASYSCALLFAILURE
Indicates a system call failure.
WSASERVICE_NOT_FOUND
Indicates that a service was not found.
WSATYPE_NOT_FOUND
Indicates that a class type was not found.
WSA_E_NO_MORE
Indicates that there are no more results.
WSA_E_CANCELLED
Indicates that the call was canceled.
WSAEREFUSED
Indicates that a database query was refused.

dlopen constants
#
If available on the operating system, the following constants are exported in os.constants.dlopen. See dlopen(3) for detailed information.
Constant
Description
RTLD_LAZY
Perform lazy binding. Node.js sets this flag by default.
RTLD_NOW
Resolve all undefined symbols in the library before dlopen(3) returns.
RTLD_GLOBAL
Symbols defined by the library will be made available for symbol resolution of subsequently loaded libraries.
RTLD_LOCAL
The converse of RTLD_GLOBAL. This is the default behavior if neither flag is specified.
RTLD_DEEPBIND
Make a self-contained library use its own symbols in preference to symbols from previously loaded libraries.

Priority constants
#
Added in: v10.10.0
The following process scheduling constants are exported by os.constants.priority.
Constant
Description
PRIORITY_LOW
The lowest process scheduling priority. This corresponds to IDLE_PRIORITY_CLASS on Windows, and a nice value of 19 on all other platforms.
PRIORITY_BELOW_NORMAL
The process scheduling priority above PRIORITY_LOW and below PRIORITY_NORMAL. This corresponds to BELOW_NORMAL_PRIORITY_CLASS on Windows, and a nice value of 10 on all other platforms.
PRIORITY_NORMAL
The default process scheduling priority. This corresponds to NORMAL_PRIORITY_CLASS on Windows, and a nice value of 0 on all other platforms.
PRIORITY_ABOVE_NORMAL
The process scheduling priority above PRIORITY_NORMAL and below PRIORITY_HIGH. This corresponds to ABOVE_NORMAL_PRIORITY_CLASS on Windows, and a nice value of -7 on all other platforms.
PRIORITY_HIGH
The process scheduling priority above PRIORITY_ABOVE_NORMAL and below PRIORITY_HIGHEST. This corresponds to HIGH_PRIORITY_CLASS on Windows, and a nice value of -14 on all other platforms.
PRIORITY_HIGHEST
The highest process scheduling priority. This corresponds to REALTIME_PRIORITY_CLASS on Windows, and a nice value of -20 on all other platforms.

libuv constants
#
Constant
Description
UV_UDP_REUSEADDR



Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Path
Windows vs. POSIX
path.basename(path[, suffix])
path.delimiter
path.dirname(path)
path.extname(path)
path.format(pathObject)
path.matchesGlob(path, pattern)
path.isAbsolute(path)
path.join([...paths])
path.normalize(path)
path.parse(path)
path.posix
path.relative(from, to)
path.resolve([...paths])
path.sep
path.toNamespacedPath(path)
path.win32
Path
#
Stability: 2 - Stable
Source Code: lib/path.js
The node:path module provides utilities for working with file and directory paths. It can be accessed using:
const path = require('node:path');
copy
Windows vs. POSIX
#
The default operation of the node:path module varies based on the operating system on which a Node.js application is running. Specifically, when running on a Windows operating system, the node:path module will assume that Windows-style paths are being used.
So using path.basename() might yield different results on POSIX and Windows:
On POSIX:
path.basename('C:\\temp\\myfile.html');
// Returns: 'C:\\temp\\myfile.html'
copy
On Windows:
path.basename('C:\\temp\\myfile.html');
// Returns: 'myfile.html'
copy
To achieve consistent results when working with Windows file paths on any operating system, use path.win32:
On POSIX and Windows:
path.win32.basename('C:\\temp\\myfile.html');
// Returns: 'myfile.html'
copy
To achieve consistent results when working with POSIX file paths on any operating system, use path.posix:
On POSIX and Windows:
path.posix.basename('/tmp/myfile.html');
// Returns: 'myfile.html'
copy
On Windows Node.js follows the concept of per-drive working directory. This behavior can be observed when using a drive path without a backslash. For example, path.resolve('C:\\') can potentially return a different result than path.resolve('C:'). For more information, see this MSDN page.
path.basename(path[, suffix])
#
History













path <string>
suffix <string> An optional suffix to remove
Returns: <string>
The path.basename() method returns the last portion of a path, similar to the Unix basename command. Trailing directory separators are ignored.
path.basename('/foo/bar/baz/asdf/quux.html');
// Returns: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// Returns: 'quux'
copy
Although Windows usually treats file names, including file extensions, in a case-insensitive manner, this function does not. For example, C:\\foo.html and C:\\foo.HTML refer to the same file, but basename treats the extension as a case-sensitive string:
path.win32.basename('C:\\foo.html', '.html');
// Returns: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// Returns: 'foo.HTML'
copy
A TypeError is thrown if path is not a string or if suffix is given and is not a string.
path.delimiter
#
Added in: v0.9.3
<string>
Provides the platform-specific path delimiter:
; for Windows
: for POSIX
For example, on POSIX:
console.log(process.env.PATH);
// Prints: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// Returns: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
copy
On Windows:
console.log(process.env.PATH);
// Prints: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// Returns ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
copy
path.dirname(path)
#
History













path <string>
Returns: <string>
The path.dirname() method returns the directory name of a path, similar to the Unix dirname command. Trailing directory separators are ignored, see path.sep.
path.dirname('/foo/bar/baz/asdf/quux');
// Returns: '/foo/bar/baz/asdf'
copy
A TypeError is thrown if path is not a string.
path.extname(path)
#
History













path <string>
Returns: <string>
The path.extname() method returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than the first character of the basename of path (see path.basename()) , an empty string is returned.
path.extname('index.html');
// Returns: '.html'

path.extname('index.coffee.md');
// Returns: '.md'

path.extname('index.');
// Returns: '.'

path.extname('index');
// Returns: ''

path.extname('.index');
// Returns: ''

path.extname('.index.md');
// Returns: '.md'
copy
A TypeError is thrown if path is not a string.
path.format(pathObject)
#
History













pathObject <Object> Any JavaScript object having the following properties:
dir <string>
root <string>
base <string>
name <string>
ext <string>
Returns: <string>
The path.format() method returns a path string from an object. This is the opposite of path.parse().
When providing properties to the pathObject remember that there are combinations where one property has priority over another:
pathObject.root is ignored if pathObject.dir is provided
pathObject.ext and pathObject.name are ignored if pathObject.base exists
For example, on POSIX:
// If `dir`, `root` and `base` are provided,
// `${dir}${path.sep}${base}`
// will be returned. `root` is ignored.
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
// Returns: '/home/user/dir/file.txt'

// `root` will be used if `dir` is not specified.
// If only `root` is provided or `dir` is equal to `root` then the
// platform separator will not be included. `ext` will be ignored.
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
// Returns: '/file.txt'

// `name` + `ext` will be used if `base` is not specified.
path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
// Returns: '/file.txt'

// The dot will be added if it is not specified in `ext`.
path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
// Returns: '/file.txt'
copy
On Windows:
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt',
});
// Returns: 'C:\\path\\dir\\file.txt'
copy
path.matchesGlob(path, pattern)
#
Added in: v22.5.0, v20.17.0
Stability: 1 - Experimental
path <string> The path to glob-match against.
pattern <string> The glob to check the path against.
Returns: <boolean> Whether or not the path matched the pattern.
The path.matchesGlob() method determines if path matches the pattern.
For example:
path.matchesGlob('/foo/bar', '/foo/*'); // true
path.matchesGlob('/foo/bar*', 'foo/bird'); // false
copy
A TypeError is thrown if path or pattern are not strings.
path.isAbsolute(path)
#
Added in: v0.11.2
path <string>
Returns: <boolean>
The path.isAbsolute() method determines if the literal path is absolute. Therefore, it’s not safe for mitigating path traversals.
If the given path is a zero-length string, false will be returned.
For example, on POSIX:
path.isAbsolute('/foo/bar');   // true
path.isAbsolute('/baz/..');    // true
path.isAbsolute('/baz/../..'); // true
path.isAbsolute('qux/');       // false
path.isAbsolute('.');          // false
copy
On Windows:
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
copy
A TypeError is thrown if path is not a string.
path.join([...paths])
#
Added in: v0.1.16
...paths <string> A sequence of path segments
Returns: <string>
The path.join() method joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.
Zero-length path segments are ignored. If the joined path string is a zero-length string then '.' will be returned, representing the current working directory.
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// Returns: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// Throws 'TypeError: Path must be a string. Received {}'
copy
A TypeError is thrown if any of the path segments is not a string.
path.normalize(path)
#
Added in: v0.1.23
path <string>
Returns: <string>
The path.normalize() method normalizes the given path, resolving '..' and '.' segments.
When multiple, sequential path segment separation characters are found (e.g. / on POSIX and either \ or / on Windows), they are replaced by a single instance of the platform-specific path segment separator (/ on POSIX and \ on Windows). Trailing separators are preserved.
If the path is a zero-length string, '.' is returned, representing the current working directory.
On POSIX, the types of normalization applied by this function do not strictly adhere to the POSIX specification. For example, this function will replace two leading forward slashes with a single slash as if it was a regular absolute path, whereas a few POSIX systems assign special meaning to paths beginning with exactly two forward slashes. Similarly, other substitutions performed by this function, such as removing .. segments, may change how the underlying system resolves the path.
For example, on POSIX:
path.normalize('/foo/bar//baz/asdf/quux/..');
// Returns: '/foo/bar/baz/asdf'
copy
On Windows:
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// Returns: 'C:\\temp\\foo\\'
copy
Since Windows recognizes multiple path separators, both separators will be replaced by instances of the Windows preferred separator (\):
path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
// Returns: 'C:\\temp\\foo\\bar'
copy
A TypeError is thrown if path is not a string.
path.parse(path)
#
Added in: v0.11.15
path <string>
Returns: <Object>
The path.parse() method returns an object whose properties represent significant elements of the path. Trailing directory separators are ignored, see path.sep.
The returned object will have the following properties:
dir <string>
root <string>
base <string>
name <string>
ext <string>
For example, on POSIX:
path.parse('/home/user/dir/file.txt');
// Returns:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
copy
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
(All spaces in the "" line should be ignored. They are purely for formatting.)
copy
On Windows:
path.parse('C:\\path\\dir\\file.txt');
// Returns:
// { root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
copy
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
(All spaces in the "" line should be ignored. They are purely for formatting.)
copy
A TypeError is thrown if path is not a string.
path.posix
#
History













<Object>
The path.posix property provides access to POSIX specific implementations of the path methods.
The API is accessible via require('node:path').posix or require('node:path/posix').
path.relative(from, to)
#
History













from <string>
to <string>
Returns: <string>
The path.relative() method returns the relative path from from to to based on the current working directory. If from and to each resolve to the same path (after calling path.resolve() on each), a zero-length string is returned.
If a zero-length string is passed as from or to, the current working directory will be used instead of the zero-length strings.
For example, on POSIX:
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// Returns: '../../impl/bbb'
copy
On Windows:
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// Returns: '..\\..\\impl\\bbb'
copy
A TypeError is thrown if either from or to is not a string.
path.resolve([...paths])
#
Added in: v0.3.4
...paths <string> A sequence of paths or path segments
Returns: <string>
The path.resolve() method resolves a sequence of paths or path segments into an absolute path.
The given sequence of paths is processed from right to left, with each subsequent path prepended until an absolute path is constructed. For instance, given the sequence of path segments: /foo, /bar, baz, calling path.resolve('/foo', '/bar', 'baz') would return /bar/baz because 'baz' is not an absolute path but '/bar' + '/' + 'baz' is.
If, after processing all given path segments, an absolute path has not yet been generated, the current working directory is used.
The resulting path is normalized and trailing slashes are removed unless the path is resolved to the root directory.
Zero-length path segments are ignored.
If no path segments are passed, path.resolve() will return the absolute path of the current working directory.
path.resolve('/foo/bar', './baz');
// Returns: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// Returns: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// If the current working directory is /home/myself/node,
// this returns '/home/myself/node/wwwroot/static_files/gif/image.gif'
copy
A TypeError is thrown if any of the arguments is not a string.
path.sep
#
Added in: v0.7.9
<string>
Provides the platform-specific path segment separator:
\ on Windows
/ on POSIX
For example, on POSIX:
'foo/bar/baz'.split(path.sep);
// Returns: ['foo', 'bar', 'baz']
copy
On Windows:
'foo\\bar\\baz'.split(path.sep);
// Returns: ['foo', 'bar', 'baz']
copy
On Windows, both the forward slash (/) and backward slash (\) are accepted as path segment separators; however, the path methods only add backward slashes (\).
path.toNamespacedPath(path)
#
Added in: v9.0.0
path <string>
Returns: <string>
On Windows systems only, returns an equivalent namespace-prefixed path for the given path. If path is not a string, path will be returned without modifications.
This method is meaningful only on Windows systems. On POSIX systems, the method is non-operational and always returns path without modifications.
path.win32
#
History













<Object>
The path.win32 property provides access to Windows-specific implementations of the path methods.
The API is accessible via require('node:path').win32 or require('node:path/win32').
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Performance measurement APIs
perf_hooks.performance
performance.clearMarks([name])
performance.clearMeasures([name])
performance.clearResourceTimings([name])
performance.eventLoopUtilization([utilization1[, utilization2]])
performance.getEntries()
performance.getEntriesByName(name[, type])
performance.getEntriesByType(type)
performance.mark(name[, options])
performance.markResourceTiming(timingInfo, requestedUrl, initiatorType, global, cacheMode, bodyInfo, responseStatus[, deliveryType])
performance.measure(name[, startMarkOrOptions[, endMark]])
performance.nodeTiming
performance.now()
performance.setResourceTimingBufferSize(maxSize)
performance.timeOrigin
performance.timerify(fn[, options])
performance.toJSON()
Event: 'resourcetimingbufferfull'
Class: PerformanceEntry
performanceEntry.duration
performanceEntry.entryType
performanceEntry.name
performanceEntry.startTime
Class: PerformanceMark
performanceMark.detail
Class: PerformanceMeasure
performanceMeasure.detail
Class: PerformanceNodeEntry
performanceNodeEntry.detail
performanceNodeEntry.flags
performanceNodeEntry.kind
Garbage Collection ('gc') Details
HTTP ('http') Details
HTTP/2 ('http2') Details
Timerify ('function') Details
Net ('net') Details
DNS ('dns') Details
Class: PerformanceNodeTiming
performanceNodeTiming.bootstrapComplete
performanceNodeTiming.environment
performanceNodeTiming.idleTime
performanceNodeTiming.loopExit
performanceNodeTiming.loopStart
performanceNodeTiming.nodeStart
performanceNodeTiming.uvMetricsInfo
performanceNodeTiming.v8Start
Class: PerformanceResourceTiming
performanceResourceTiming.workerStart
performanceResourceTiming.redirectStart
performanceResourceTiming.redirectEnd
performanceResourceTiming.fetchStart
performanceResourceTiming.domainLookupStart
performanceResourceTiming.domainLookupEnd
performanceResourceTiming.connectStart
performanceResourceTiming.connectEnd
performanceResourceTiming.secureConnectionStart
performanceResourceTiming.requestStart
performanceResourceTiming.responseEnd
performanceResourceTiming.transferSize
performanceResourceTiming.encodedBodySize
performanceResourceTiming.decodedBodySize
performanceResourceTiming.toJSON()
Class: PerformanceObserver
PerformanceObserver.supportedEntryTypes
new PerformanceObserver(callback)
performanceObserver.disconnect()
performanceObserver.observe(options)
performanceObserver.takeRecords()
Class: PerformanceObserverEntryList
performanceObserverEntryList.getEntries()
performanceObserverEntryList.getEntriesByName(name[, type])
performanceObserverEntryList.getEntriesByType(type)
perf_hooks.createHistogram([options])
perf_hooks.monitorEventLoopDelay([options])
Class: Histogram
histogram.count
histogram.countBigInt
histogram.exceeds
histogram.exceedsBigInt
histogram.max
histogram.maxBigInt
histogram.mean
histogram.min
histogram.minBigInt
histogram.percentile(percentile)
histogram.percentileBigInt(percentile)
histogram.percentiles
histogram.percentilesBigInt
histogram.reset()
histogram.stddev
Class: IntervalHistogram extends Histogram
histogram.disable()
histogram.enable()
histogram[Symbol.dispose]()
Cloning an IntervalHistogram
Class: RecordableHistogram extends Histogram
histogram.add(other)
histogram.record(val)
histogram.recordDelta()
Examples
Measuring the duration of async operations
Measuring how long it takes to load dependencies
Measuring how long one HTTP round-trip takes
Measuring how long the net.connect (only for TCP) takes when the connection is successful
Measuring how long the DNS takes when the request is successful
Performance measurement APIs
#
Stability: 2 - Stable
Source Code: lib/perf_hooks.js
This module provides an implementation of a subset of the W3C Web Performance APIs as well as additional APIs for Node.js-specific performance measurements.
Node.js supports the following Web Performance APIs:
High Resolution Time
Performance Timeline
User Timing
Resource Timing
const { PerformanceObserver, performance } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
(async function doSomeLongRunningProcess() {
  await new Promise((r) => setTimeout(r, 5000));
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
})();
copy
perf_hooks.performance
#
Added in: v8.5.0
An object that can be used to collect performance metrics from the current Node.js instance. It is similar to window.performance in browsers.
performance.clearMarks([name])
#
History













name <string>
If name is not provided, removes all PerformanceMark objects from the Performance Timeline. If name is provided, removes only the named mark.
performance.clearMeasures([name])
#
History













name <string>
If name is not provided, removes all PerformanceMeasure objects from the Performance Timeline. If name is provided, removes only the named measure.
performance.clearResourceTimings([name])
#
History













name <string>
If name is not provided, removes all PerformanceResourceTiming objects from the Resource Timeline. If name is provided, removes only the named resource.
performance.eventLoopUtilization([utilization1[, utilization2]])
#
Added in: v14.10.0, v12.19.0
utilization1 <Object> The result of a previous call to eventLoopUtilization().
utilization2 <Object> The result of a previous call to eventLoopUtilization() prior to utilization1.
Returns: <Object>
idle <number>
active <number>
utilization <number>
The eventLoopUtilization() method returns an object that contains the cumulative duration of time the event loop has been both idle and active as a high resolution milliseconds timer. The utilization value is the calculated Event Loop Utilization (ELU).
If bootstrapping has not yet finished on the main thread the properties have the value of 0. The ELU is immediately available on Worker threads since bootstrap happens within the event loop.
Both utilization1 and utilization2 are optional parameters.
If utilization1 is passed, then the delta between the current call's active and idle times, as well as the corresponding utilization value are calculated and returned (similar to process.hrtime()).
If utilization1 and utilization2 are both passed, then the delta is calculated between the two arguments. This is a convenience option because, unlike process.hrtime(), calculating the ELU is more complex than a single subtraction.
ELU is similar to CPU utilization, except that it only measures event loop statistics and not CPU usage. It represents the percentage of time the event loop has spent outside the event loop's event provider (e.g. epoll_wait). No other CPU idle time is taken into consideration. The following is an example of how a mostly idle process will have a high ELU.
'use strict';
const { eventLoopUtilization } = require('node:perf_hooks').performance;
const { spawnSync } = require('node:child_process');

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
copy
Although the CPU is mostly idle while running this script, the value of utilization is 1. This is because the call to child_process.spawnSync() blocks the event loop from proceeding.
Passing in a user-defined object instead of the result of a previous call to eventLoopUtilization() will lead to undefined behavior. The return values are not guaranteed to reflect any correct state of the event loop.
performance.getEntries()
#
History













Returns: <PerformanceEntry[]>
Returns a list of PerformanceEntry objects in chronological order with respect to performanceEntry.startTime. If you are only interested in performance entries of certain types or that have certain names, see performance.getEntriesByType() and performance.getEntriesByName().
performance.getEntriesByName(name[, type])
#
History













name <string>
type <string>
Returns: <PerformanceEntry[]>
Returns a list of PerformanceEntry objects in chronological order with respect to performanceEntry.startTime whose performanceEntry.name is equal to name, and optionally, whose performanceEntry.entryType is equal to type.
performance.getEntriesByType(type)
#
History













type <string>
Returns: <PerformanceEntry[]>
Returns a list of PerformanceEntry objects in chronological order with respect to performanceEntry.startTime whose performanceEntry.entryType is equal to type.
performance.mark(name[, options])
#
History

















name <string>
options <Object>
detail <any> Additional optional detail to include with the mark.
startTime <number> An optional timestamp to be used as the mark time. Default: performance.now().
Creates a new PerformanceMark entry in the Performance Timeline. A PerformanceMark is a subclass of PerformanceEntry whose performanceEntry.entryType is always 'mark', and whose performanceEntry.duration is always 0. Performance marks are used to mark specific significant moments in the Performance Timeline.
The created PerformanceMark entry is put in the global Performance Timeline and can be queried with performance.getEntries, performance.getEntriesByName, and performance.getEntriesByType. When the observation is performed, the entries should be cleared from the global Performance Timeline manually with performance.clearMarks.
performance.markResourceTiming(timingInfo, requestedUrl, initiatorType, global, cacheMode, bodyInfo, responseStatus[, deliveryType])
#
History













timingInfo <Object> Fetch Timing Info
requestedUrl <string> The resource url
initiatorType <string> The initiator name, e.g: 'fetch'
global <Object>
cacheMode <string> The cache mode must be an empty string ('') or 'local'
bodyInfo <Object> Fetch Response Body Info
responseStatus <number> The response's status code
deliveryType <string> The delivery type. Default: ''.
This property is an extension by Node.js. It is not available in Web browsers.
Creates a new PerformanceResourceTiming entry in the Resource Timeline. A PerformanceResourceTiming is a subclass of PerformanceEntry whose performanceEntry.entryType is always 'resource'. Performance resources are used to mark moments in the Resource Timeline.
The created PerformanceMark entry is put in the global Resource Timeline and can be queried with performance.getEntries, performance.getEntriesByName, and performance.getEntriesByType. When the observation is performed, the entries should be cleared from the global Performance Timeline manually with performance.clearResourceTimings.
performance.measure(name[, startMarkOrOptions[, endMark]])
#
History





















name <string>
startMarkOrOptions <string> | <Object> Optional.
detail <any> Additional optional detail to include with the measure.
duration <number> Duration between start and end times.
end <number> | <string> Timestamp to be used as the end time, or a string identifying a previously recorded mark.
start <number> | <string> Timestamp to be used as the start time, or a string identifying a previously recorded mark.
endMark <string> Optional. Must be omitted if startMarkOrOptions is an <Object>.
Creates a new PerformanceMeasure entry in the Performance Timeline. A PerformanceMeasure is a subclass of PerformanceEntry whose performanceEntry.entryType is always 'measure', and whose performanceEntry.duration measures the number of milliseconds elapsed since startMark and endMark.
The startMark argument may identify any existing PerformanceMark in the Performance Timeline, or may identify any of the timestamp properties provided by the PerformanceNodeTiming class. If the named startMark does not exist, an error is thrown.
The optional endMark argument must identify any existing PerformanceMark in the Performance Timeline or any of the timestamp properties provided by the PerformanceNodeTiming class. endMark will be performance.now() if no parameter is passed, otherwise if the named endMark does not exist, an error will be thrown.
The created PerformanceMeasure entry is put in the global Performance Timeline and can be queried with performance.getEntries, performance.getEntriesByName, and performance.getEntriesByType. When the observation is performed, the entries should be cleared from the global Performance Timeline manually with performance.clearMeasures.
performance.nodeTiming
#
Added in: v8.5.0
<PerformanceNodeTiming>
This property is an extension by Node.js. It is not available in Web browsers.
An instance of the PerformanceNodeTiming class that provides performance metrics for specific Node.js operational milestones.
performance.now()
#
History













Returns: <number>
Returns the current high resolution millisecond timestamp, where 0 represents the start of the current node process.
performance.setResourceTimingBufferSize(maxSize)
#
History













Sets the global performance resource timing buffer size to the specified number of "resource" type performance entry objects.
By default the max buffer size is set to 250.
performance.timeOrigin
#
Added in: v8.5.0
<number>
The timeOrigin specifies the high resolution millisecond timestamp at which the current node process began, measured in Unix time.
performance.timerify(fn[, options])
#
History

















fn <Function>
options <Object>
histogram <RecordableHistogram> A histogram object created using perf_hooks.createHistogram() that will record runtime durations in nanoseconds.
This property is an extension by Node.js. It is not available in Web browsers.
Wraps a function within a new function that measures the running time of the wrapped function. A PerformanceObserver must be subscribed to the 'function' event type in order for the timing details to be accessed.
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();
copy
If the wrapped function returns a promise, a finally handler will be attached to the promise and the duration will be reported once the finally handler is invoked.
performance.toJSON()
#
History













An object which is JSON representation of the performance object. It is similar to window.performance.toJSON in browsers.
Event: 'resourcetimingbufferfull'
#
Added in: v18.8.0
The 'resourcetimingbufferfull' event is fired when the global performance resource timing buffer is full. Adjust resource timing buffer size with performance.setResourceTimingBufferSize() or clear the buffer with performance.clearResourceTimings() in the event listener to allow more entries to be added to the performance timeline buffer.
Class: PerformanceEntry
#
Added in: v8.5.0
The constructor of this class is not exposed to users directly.
performanceEntry.duration
#
History













<number>
The total number of milliseconds elapsed for this entry. This value will not be meaningful for all Performance Entry types.
performanceEntry.entryType
#
History













<string>
The type of the performance entry. It may be one of:
'dns' (Node.js only)
'function' (Node.js only)
'gc' (Node.js only)
'http2' (Node.js only)
'http' (Node.js only)
'mark' (available on the Web)
'measure' (available on the Web)
'net' (Node.js only)
'node' (Node.js only)
'resource' (available on the Web)
performanceEntry.name
#
History













<string>
The name of the performance entry.
performanceEntry.startTime
#
History













<number>
The high resolution millisecond timestamp marking the starting time of the Performance Entry.
Class: PerformanceMark
#
Added in: v18.2.0, v16.17.0
Extends: <PerformanceEntry>
Exposes marks created via the Performance.mark() method.
performanceMark.detail
#
History













<any>
Additional detail specified when creating with Performance.mark() method.
Class: PerformanceMeasure
#
Added in: v18.2.0, v16.17.0
Extends: <PerformanceEntry>
Exposes measures created via the Performance.measure() method.
The constructor of this class is not exposed to users directly.
performanceMeasure.detail
#
History













<any>
Additional detail specified when creating with Performance.measure() method.
Class: PerformanceNodeEntry
#
Added in: v19.0.0
Extends: <PerformanceEntry>
This class is an extension by Node.js. It is not available in Web browsers.
Provides detailed Node.js timing data.
The constructor of this class is not exposed to users directly.
performanceNodeEntry.detail
#
History













<any>
Additional detail specific to the entryType.
performanceNodeEntry.flags
#
History













Stability: 0 - Deprecated: Use performanceNodeEntry.detail instead.
<number>
When performanceEntry.entryType is equal to 'gc', the performance.flags property contains additional information about garbage collection operation. The value may be one of:
perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO
perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED
perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED
perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING
perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE
perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY
perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE
performanceNodeEntry.kind
#
History













Stability: 0 - Deprecated: Use performanceNodeEntry.detail instead.
<number>
When performanceEntry.entryType is equal to 'gc', the performance.kind property identifies the type of garbage collection operation that occurred. The value may be one of:
perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR
perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR
perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL
perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB
Garbage Collection ('gc') Details
#
When performanceEntry.type is equal to 'gc', the performanceNodeEntry.detail property will be an <Object> with two properties:
kind <number> One of:
perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR
perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR
perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL
perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB
flags <number> One of:
perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO
perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED
perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED
perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING
perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE
perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY
perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE
HTTP ('http') Details
#
When performanceEntry.type is equal to 'http', the performanceNodeEntry.detail property will be an <Object> containing additional information.
If performanceEntry.name is equal to HttpClient, the detail will contain the following properties: req, res. And the req property will be an <Object> containing method, url, headers, the res property will be an <Object> containing statusCode, statusMessage, headers.
If performanceEntry.name is equal to HttpRequest, the detail will contain the following properties: req, res. And the req property will be an <Object> containing method, url, headers, the res property will be an <Object> containing statusCode, statusMessage, headers.
This could add additional memory overhead and should only be used for diagnostic purposes, not left turned on in production by default.
HTTP/2 ('http2') Details
#
When performanceEntry.type is equal to 'http2', the performanceNodeEntry.detail property will be an <Object> containing additional performance information.
If performanceEntry.name is equal to Http2Stream, the detail will contain the following properties:
bytesRead <number> The number of DATA frame bytes received for this Http2Stream.
bytesWritten <number> The number of DATA frame bytes sent for this Http2Stream.
id <number> The identifier of the associated Http2Stream
timeToFirstByte <number> The number of milliseconds elapsed between the PerformanceEntry startTime and the reception of the first DATA frame.
timeToFirstByteSent <number> The number of milliseconds elapsed between the PerformanceEntry startTime and sending of the first DATA frame.
timeToFirstHeader <number> The number of milliseconds elapsed between the PerformanceEntry startTime and the reception of the first header.
If performanceEntry.name is equal to Http2Session, the detail will contain the following properties:
bytesRead <number> The number of bytes received for this Http2Session.
bytesWritten <number> The number of bytes sent for this Http2Session.
framesReceived <number> The number of HTTP/2 frames received by the Http2Session.
framesSent <number> The number of HTTP/2 frames sent by the Http2Session.
maxConcurrentStreams <number> The maximum number of streams concurrently open during the lifetime of the Http2Session.
pingRTT <number> The number of milliseconds elapsed since the transmission of a PING frame and the reception of its acknowledgment. Only present if a PING frame has been sent on the Http2Session.
streamAverageDuration <number> The average duration (in milliseconds) for all Http2Stream instances.
streamCount <number> The number of Http2Stream instances processed by the Http2Session.
type <string> Either 'server' or 'client' to identify the type of Http2Session.
Timerify ('function') Details
#
When performanceEntry.type is equal to 'function', the performanceNodeEntry.detail property will be an <Array> listing the input arguments to the timed function.
Net ('net') Details
#
When performanceEntry.type is equal to 'net', the performanceNodeEntry.detail property will be an <Object> containing additional information.
If performanceEntry.name is equal to connect, the detail will contain the following properties: host, port.
DNS ('dns') Details
#
When performanceEntry.type is equal to 'dns', the performanceNodeEntry.detail property will be an <Object> containing additional information.
If performanceEntry.name is equal to lookup, the detail will contain the following properties: hostname, family, hints, verbatim, addresses.
If performanceEntry.name is equal to lookupService, the detail will contain the following properties: host, port, hostname, service.
If performanceEntry.name is equal to queryxxx or getHostByAddr, the detail will contain the following properties: host, ttl, result. The value of result is same as the result of queryxxx or getHostByAddr.
Class: PerformanceNodeTiming
#
Added in: v8.5.0
Extends: <PerformanceEntry>
This property is an extension by Node.js. It is not available in Web browsers.
Provides timing details for Node.js itself. The constructor of this class is not exposed to users.
performanceNodeTiming.bootstrapComplete
#
Added in: v8.5.0
<number>
The high resolution millisecond timestamp at which the Node.js process completed bootstrapping. If bootstrapping has not yet finished, the property has the value of -1.
performanceNodeTiming.environment
#
Added in: v8.5.0
<number>
The high resolution millisecond timestamp at which the Node.js environment was initialized.
performanceNodeTiming.idleTime
#
Added in: v14.10.0, v12.19.0
<number>
The high resolution millisecond timestamp of the amount of time the event loop has been idle within the event loop's event provider (e.g. epoll_wait). This does not take CPU usage into consideration. If the event loop has not yet started (e.g., in the first tick of the main script), the property has the value of 0.
performanceNodeTiming.loopExit
#
Added in: v8.5.0
<number>
The high resolution millisecond timestamp at which the Node.js event loop exited. If the event loop has not yet exited, the property has the value of -1. It can only have a value of not -1 in a handler of the 'exit' event.
performanceNodeTiming.loopStart
#
Added in: v8.5.0
<number>
The high resolution millisecond timestamp at which the Node.js event loop started. If the event loop has not yet started (e.g., in the first tick of the main script), the property has the value of -1.
performanceNodeTiming.nodeStart
#
Added in: v8.5.0
<number>
The high resolution millisecond timestamp at which the Node.js process was initialized.
performanceNodeTiming.uvMetricsInfo
#
Added in: v22.8.0, v20.18.0
Returns: <Object>
loopCount <number> Number of event loop iterations.
events <number> Number of events that have been processed by the event handler.
eventsWaiting <number> Number of events that were waiting to be processed when the event provider was called.
This is a wrapper to the uv_metrics_info function. It returns the current set of event loop metrics.
It is recommended to use this property inside a function whose execution was scheduled using setImmediate to avoid collecting metrics before finishing all operations scheduled during the current loop iteration.
const { performance } = require('node:perf_hooks');

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
copy
performanceNodeTiming.v8Start
#
Added in: v8.5.0
<number>
The high resolution millisecond timestamp at which the V8 platform was initialized.
Class: PerformanceResourceTiming
#
Added in: v18.2.0, v16.17.0
Extends: <PerformanceEntry>
Provides detailed network timing data regarding the loading of an application's resources.
The constructor of this class is not exposed to users directly.
performanceResourceTiming.workerStart
#
History













<number>
The high resolution millisecond timestamp at immediately before dispatching the fetch request. If the resource is not intercepted by a worker the property will always return 0.
performanceResourceTiming.redirectStart
#
History













<number>
The high resolution millisecond timestamp that represents the start time of the fetch which initiates the redirect.
performanceResourceTiming.redirectEnd
#
History













<number>
The high resolution millisecond timestamp that will be created immediately after receiving the last byte of the response of the last redirect.
performanceResourceTiming.fetchStart
#
History













<number>
The high resolution millisecond timestamp immediately before the Node.js starts to fetch the resource.
performanceResourceTiming.domainLookupStart
#
History













<number>
The high resolution millisecond timestamp immediately before the Node.js starts the domain name lookup for the resource.
performanceResourceTiming.domainLookupEnd
#
History













<number>
The high resolution millisecond timestamp representing the time immediately after the Node.js finished the domain name lookup for the resource.
performanceResourceTiming.connectStart
#
History













<number>
The high resolution millisecond timestamp representing the time immediately before Node.js starts to establish the connection to the server to retrieve the resource.
performanceResourceTiming.connectEnd
#
History













<number>
The high resolution millisecond timestamp representing the time immediately after Node.js finishes establishing the connection to the server to retrieve the resource.
performanceResourceTiming.secureConnectionStart
#
History













<number>
The high resolution millisecond timestamp representing the time immediately before Node.js starts the handshake process to secure the current connection.
performanceResourceTiming.requestStart
#
History













<number>
The high resolution millisecond timestamp representing the time immediately before Node.js receives the first byte of the response from the server.
performanceResourceTiming.responseEnd
#
History













<number>
The high resolution millisecond timestamp representing the time immediately after Node.js receives the last byte of the resource or immediately before the transport connection is closed, whichever comes first.
performanceResourceTiming.transferSize
#
History













<number>
A number representing the size (in octets) of the fetched resource. The size includes the response header fields plus the response payload body.
performanceResourceTiming.encodedBodySize
#
History













<number>
A number representing the size (in octets) received from the fetch (HTTP or cache), of the payload body, before removing any applied content-codings.
performanceResourceTiming.decodedBodySize
#
History













<number>
A number representing the size (in octets) received from the fetch (HTTP or cache), of the message body, after removing any applied content-codings.
performanceResourceTiming.toJSON()
#
History













Returns a object that is the JSON representation of the PerformanceResourceTiming object
Class: PerformanceObserver
#
Added in: v8.5.0
PerformanceObserver.supportedEntryTypes
#
Added in: v16.0.0
<string[]>
Get supported types.
new PerformanceObserver(callback)
#
History













callback <Function>
list <PerformanceObserverEntryList>
observer <PerformanceObserver>
PerformanceObserver objects provide notifications when new PerformanceEntry instances have been added to the Performance Timeline.
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
copy
Because PerformanceObserver instances introduce their own additional performance overhead, instances should not be left subscribed to notifications indefinitely. Users should disconnect observers as soon as they are no longer needed.
The callback is invoked when a PerformanceObserver is notified about new PerformanceEntry instances. The callback receives a PerformanceObserverEntryList instance and a reference to the PerformanceObserver.
performanceObserver.disconnect()
#
Added in: v8.5.0
Disconnects the PerformanceObserver instance from all notifications.
performanceObserver.observe(options)
#
History

















options <Object>
type <string> A single <PerformanceEntry> type. Must not be given if entryTypes is already specified.
entryTypes <string[]> An array of strings identifying the types of <PerformanceEntry> instances the observer is interested in. If not provided an error will be thrown.
buffered <boolean> If true, the observer callback is called with a list global PerformanceEntry buffered entries. If false, only PerformanceEntrys created after the time point are sent to the observer callback. Default: false.
Subscribes the <PerformanceObserver> instance to notifications of new <PerformanceEntry> instances identified either by options.entryTypes or options.type:
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  // Called once asynchronously. `list` contains three items.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
copy
performanceObserver.takeRecords()
#
Added in: v16.0.0
Returns: <PerformanceEntry[]> Current list of entries stored in the performance observer, emptying it out.
Class: PerformanceObserverEntryList
#
Added in: v8.5.0
The PerformanceObserverEntryList class is used to provide access to the PerformanceEntry instances passed to a PerformanceObserver. The constructor of this class is not exposed to users.
performanceObserverEntryList.getEntries()
#
Added in: v8.5.0
Returns: <PerformanceEntry[]>
Returns a list of PerformanceEntry objects in chronological order with respect to performanceEntry.startTime.
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
copy
performanceObserverEntryList.getEntriesByName(name[, type])
#
Added in: v8.5.0
name <string>
type <string>
Returns: <PerformanceEntry[]>
Returns a list of PerformanceEntry objects in chronological order with respect to performanceEntry.startTime whose performanceEntry.name is equal to name, and optionally, whose performanceEntry.entryType is equal to type.
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
copy
performanceObserverEntryList.getEntriesByType(type)
#
Added in: v8.5.0
type <string>
Returns: <PerformanceEntry[]>
Returns a list of PerformanceEntry objects in chronological order with respect to performanceEntry.startTime whose performanceEntry.entryType is equal to type.
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
copy
perf_hooks.createHistogram([options])
#
Added in: v15.9.0, v14.18.0
options <Object>
lowest <number> | <bigint> The lowest discernible value. Must be an integer value greater than 0. Default: 1.
highest <number> | <bigint> The highest recordable value. Must be an integer value that is equal to or greater than two times lowest. Default: Number.MAX_SAFE_INTEGER.
figures <number> The number of accuracy digits. Must be a number between 1 and 5. Default: 3.
Returns: <RecordableHistogram>
Returns a <RecordableHistogram>.
perf_hooks.monitorEventLoopDelay([options])
#
Added in: v11.10.0
options <Object>
resolution <number> The sampling rate in milliseconds. Must be greater than zero. Default: 10.
Returns: <IntervalHistogram>
This property is an extension by Node.js. It is not available in Web browsers.
Creates an IntervalHistogram object that samples and reports the event loop delay over time. The delays will be reported in nanoseconds.
Using a timer to detect approximate event loop delay works because the execution of timers is tied specifically to the lifecycle of the libuv event loop. That is, a delay in the loop will cause a delay in the execution of the timer, and those delays are specifically what this API is intended to detect.
const { monitorEventLoopDelay } = require('node:perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
copy
Class: Histogram
#
Added in: v11.10.0
histogram.count
#
Added in: v17.4.0, v16.14.0
<number>
The number of samples recorded by the histogram.
histogram.countBigInt
#
Added in: v17.4.0, v16.14.0
<bigint>
The number of samples recorded by the histogram.
histogram.exceeds
#
Added in: v11.10.0
<number>
The number of times the event loop delay exceeded the maximum 1 hour event loop delay threshold.
histogram.exceedsBigInt
#
Added in: v17.4.0, v16.14.0
<bigint>
The number of times the event loop delay exceeded the maximum 1 hour event loop delay threshold.
histogram.max
#
Added in: v11.10.0
<number>
The maximum recorded event loop delay.
histogram.maxBigInt
#
Added in: v17.4.0, v16.14.0
<bigint>
The maximum recorded event loop delay.
histogram.mean
#
Added in: v11.10.0
<number>
The mean of the recorded event loop delays.
histogram.min
#
Added in: v11.10.0
<number>
The minimum recorded event loop delay.
histogram.minBigInt
#
Added in: v17.4.0, v16.14.0
<bigint>
The minimum recorded event loop delay.
histogram.percentile(percentile)
#
Added in: v11.10.0
percentile <number> A percentile value in the range (0, 100].
Returns: <number>
Returns the value at the given percentile.
histogram.percentileBigInt(percentile)
#
Added in: v17.4.0, v16.14.0
percentile <number> A percentile value in the range (0, 100].
Returns: <bigint>
Returns the value at the given percentile.
histogram.percentiles
#
Added in: v11.10.0
<Map>
Returns a Map object detailing the accumulated percentile distribution.
histogram.percentilesBigInt
#
Added in: v17.4.0, v16.14.0
<Map>
Returns a Map object detailing the accumulated percentile distribution.
histogram.reset()
#
Added in: v11.10.0
Resets the collected histogram data.
histogram.stddev
#
Added in: v11.10.0
<number>
The standard deviation of the recorded event loop delays.
Class: IntervalHistogram extends Histogram
#
A Histogram that is periodically updated on a given interval.
histogram.disable()
#
Added in: v11.10.0
Returns: <boolean>
Disables the update interval timer. Returns true if the timer was stopped, false if it was already stopped.
histogram.enable()
#
Added in: v11.10.0
Returns: <boolean>
Enables the update interval timer. Returns true if the timer was started, false if it was already started.
histogram[Symbol.dispose]()
#
Added in: v24.2.0
Disables the update interval timer when the histogram is disposed.
const { monitorEventLoopDelay } = require('node:perf_hooks');
{
  using hist = monitorEventLoopDelay({ resolution: 20 });
  hist.enable();
  // The histogram will be disabled when the block is exited.
}
copy
Cloning an IntervalHistogram
#
<IntervalHistogram> instances can be cloned via <MessagePort>. On the receiving end, the histogram is cloned as a plain <Histogram> object that does not implement the enable() and disable() methods.
Class: RecordableHistogram extends Histogram
#
Added in: v15.9.0, v14.18.0
histogram.add(other)
#
Added in: v17.4.0, v16.14.0
other <RecordableHistogram>
Adds the values from other to this histogram.
histogram.record(val)
#
Added in: v15.9.0, v14.18.0
val <number> | <bigint> The amount to record in the histogram.
histogram.recordDelta()
#
Added in: v15.9.0, v14.18.0
Calculates the amount of time (in nanoseconds) that has passed since the previous call to recordDelta() and records that amount in the histogram.
Examples
#
Measuring the duration of async operations
#
The following example uses the Async Hooks and Performance APIs to measure the actual duration of a Timeout operation (including the amount of time it took to execute the callback).
'use strict';
const async_hooks = require('node:async_hooks');
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const set = new Set();
const hook = async_hooks.createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'] });

setTimeout(() => {}, 1000);
copy
Measuring how long it takes to load dependencies
#
The following example measures the duration of require() operations to load dependencies:
'use strict';
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');
const mod = require('node:module');

// Monkey patch the require function
mod.Module.prototype.require =
  performance.timerify(mod.Module.prototype.require);
require = performance.timerify(require);

// Activate the observer
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`require('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

require('some-module');
copy
Measuring how long one HTTP round-trip takes
#
The following example is used to trace the time spent by HTTP client (OutgoingMessage) and HTTP request (IncomingMessage). For HTTP client, it means the time interval between starting the request and receiving the response, and for HTTP request, it means the time interval between receiving the request and sending the response:
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const http = require('node:http');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

http.createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  http.get(`http://127.0.0.1:${PORT}`);
});
copy
Measuring how long the net.connect (only for TCP) takes when the connection is successful
#
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const net = require('node:net');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
net.createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  net.connect(PORT);
});
copy
Measuring how long the DNS takes when the request is successful
#
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const dns = require('node:dns');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
dns.lookup('localhost', () => {});
dns.promises.resolve('localhost');
copy
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Permissions
Process-based permissions
Permission Model
Runtime API
permission.has(scope[, reference])
File System Permissions
Using the Permission Model with npx
Permission Model constraints
Limitations and Known Issues
Permissions
#
Permissions can be used to control what system resources the Node.js process has access to or what actions the process can take with those resources.
Process-based permissions control the Node.js process's access to resources. The resource can be entirely allowed or denied, or actions related to it can be controlled. For example, file system reads can be allowed while denying writes. This feature does not protect against malicious code. According to the Node.js Security Policy, Node.js trusts any code it is asked to run.
The permission model implements a "seat belt" approach, which prevents trusted code from unintentionally changing files or using resources that access has not explicitly been granted to. It does not provide security guarantees in the presence of malicious code. Malicious code can bypass the permission model and execute arbitrary code without the restrictions imposed by the permission model.
If you find a potential security vulnerability, please refer to our Security Policy.
Process-based permissions
#
Permission Model
#
History













Stability: 2 - Stable
The Node.js Permission Model is a mechanism for restricting access to specific resources during execution. The API exists behind a flag --permission which when enabled, will restrict access to all available permissions.
The available permissions are documented by the --permission flag.
When starting Node.js with --permission, the ability to access the file system through the fs module, spawn processes, use node:worker_threads, use native addons, use WASI, and enable the runtime inspector will be restricted.
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/home/user/index.js'
}
copy
Allowing access to spawning a process and creating worker threads can be done using the --allow-child-process and --allow-worker respectively.
To allow native addons when using permission model, use the --allow-addons flag. For WASI, use the --allow-wasi flag.
Runtime API
#
When enabling the Permission Model through the --permission flag a new property permission is added to the process object. This property contains one function:
permission.has(scope[, reference])
#
API call to check permissions at runtime (permission.has())
process.permission.has('fs.write'); // true
process.permission.has('fs.write', '/home/rafaelgss/protected-folder'); // true

process.permission.has('fs.read'); // true
process.permission.has('fs.read', '/home/rafaelgss/protected-folder'); // false
copy
File System Permissions
#
The Permission Model, by default, restricts access to the file system through the node:fs module. It does not guarantee that users will not be able to access the file system through other means, such as through the node:sqlite module.
To allow access to the file system, use the --allow-fs-read and --allow-fs-write flags:
$ node --permission --allow-fs-read=* --allow-fs-write=* index.js
Hello world!
copy
By default the entrypoints of your application are included in the allowed file system read list. For example:
$ node --permission index.js
copy
index.js will be included in the allowed file system read list
$ node -r /path/to/custom-require.js --permission index.js.
copy
/path/to/custom-require.js will be included in the allowed file system read list.
index.js will be included in the allowed file system read list.
The valid arguments for both flags are:
* - To allow all FileSystemRead or FileSystemWrite operations, respectively.
Relative paths to the current working directory.
Absolute paths.
Example:
--allow-fs-read=* - It will allow all FileSystemRead operations.
--allow-fs-write=* - It will allow all FileSystemWrite operations.
--allow-fs-write=/tmp/ - It will allow FileSystemWrite access to the /tmp/ folder.
--allow-fs-read=/tmp/ --allow-fs-read=/home/.gitignore - It allows FileSystemRead access to the /tmp/ folder and the /home/.gitignore path.
Wildcards are supported too:
--allow-fs-read=/home/test* will allow read access to everything that matches the wildcard. e.g: /home/test/file1 or /home/test2
After passing a wildcard character (*) all subsequent characters will be ignored. For example: /home/*.js will work similar to /home/*.
When the permission model is initialized, it will automatically add a wildcard (*) if the specified directory exists. For example, if /home/test/files exists, it will be treated as /home/test/files/*. However, if the directory does not exist, the wildcard will not be added, and access will be limited to /home/test/files. If you want to allow access to a folder that does not exist yet, make sure to explicitly include the wildcard: /my-path/folder-do-not-exist/*.
Using the Permission Model with npx
#
If you're using npx to execute a Node.js script, you can enable the Permission Model by passing the --node-options flag. For example:
npx --node-options="--permission" package-name
copy
This sets the NODE_OPTIONS environment variable for all Node.js processes spawned by npx, without affecting the npx process itself.
FileSystemRead Error with npx
The above command will likely throw a FileSystemRead invalid access error because Node.js requires file system read access to locate and execute the package. To avoid this:
Using a Globally Installed Package Grant read access to the global node_modules directory by running:
npx --node-options="--permission --allow-fs-read=$(npm prefix -g)" package-name
copy
Using the npx Cache If you are installing the package temporarily or relying on the npx cache, grant read access to the npm cache directory:
npx --node-options="--permission --allow-fs-read=$(npm config get cache)" package-name
copy
Any arguments you would normally pass to node (e.g., --allow-* flags) can also be passed through the --node-options flag. This flexibility makes it easy to configure permissions as needed when using npx.
Permission Model constraints
#
There are constraints you need to know before using this system:
The model does not inherit to a worker thread.
When using the Permission Model the following features will be restricted:
Native modules
Child process
Worker Threads
Inspector protocol
File system access
WASI
The Permission Model is initialized after the Node.js environment is set up. However, certain flags such as --env-file or --openssl-config are designed to read files before environment initialization. As a result, such flags are not subject to the rules of the Permission Model. The same applies for V8 flags that can be set via runtime through v8.setFlagsFromString.
OpenSSL engines cannot be requested at runtime when the Permission Model is enabled, affecting the built-in crypto, https, and tls modules.
Run-Time Loadable Extensions cannot be loaded when the Permission Model is enabled, affecting the sqlite module.
Using existing file descriptors via the node:fs module bypasses the Permission Model.
Limitations and Known Issues
#
Symbolic links will be followed even to locations outside of the set of paths that access has been granted to. Relative symbolic links may allow access to arbitrary files and directories. When starting applications with the permission model enabled, you must ensure that no paths to which access has been granted contain relative symbolic links.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Process
Process events
Event: 'beforeExit'
Event: 'disconnect'
Event: 'exit'
Event: 'message'
Event: 'multipleResolves'
Event: 'rejectionHandled'
Event: 'workerMessage'
Event: 'uncaughtException'
Warning: Using 'uncaughtException' correctly
Event: 'uncaughtExceptionMonitor'
Event: 'unhandledRejection'
Event: 'warning'
Emitting custom warnings
Node.js warning names
Event: 'worker'
Signal events
process.abort()
process.allowedNodeEnvironmentFlags
process.arch
process.argv
process.argv0
process.availableMemory()
process.channel
process.channel.ref()
process.channel.unref()
process.chdir(directory)
process.config
process.connected
process.constrainedMemory()
process.cpuUsage([previousValue])
process.cwd()
process.debugPort
process.disconnect()
process.dlopen(module, filename[, flags])
process.emitWarning(warning[, options])
process.emitWarning(warning[, type[, code]][, ctor])
Avoiding duplicate warnings
process.env
process.execArgv
process.execPath
process.execve(file[, args[, env]])
process.exit([code])
process.exitCode
process.features.cached_builtins
process.features.debug
process.features.inspector
process.features.ipv6
process.features.require_module
process.features.tls
process.features.tls_alpn
process.features.tls_ocsp
process.features.tls_sni
process.features.typescript
process.features.uv
process.finalization.register(ref, callback)
process.finalization.registerBeforeExit(ref, callback)
process.finalization.unregister(ref)
process.getActiveResourcesInfo()
process.getBuiltinModule(id)
process.getegid()
process.geteuid()
process.getgid()
process.getgroups()
process.getuid()
process.hasUncaughtExceptionCaptureCallback()
process.hrtime([time])
process.hrtime.bigint()
process.initgroups(user, extraGroup)
process.kill(pid[, signal])
process.loadEnvFile(path)
process.mainModule
process.memoryUsage()
process.memoryUsage.rss()
process.nextTick(callback[, ...args])
When to use queueMicrotask() vs. process.nextTick()
process.noDeprecation
process.permission
process.permission.has(scope[, reference])
process.pid
process.platform
process.ppid
process.ref(maybeRefable)
process.release
process.report
process.report.compact
process.report.directory
process.report.filename
process.report.getReport([err])
process.report.reportOnFatalError
process.report.reportOnSignal
process.report.reportOnUncaughtException
process.report.excludeEnv
process.report.signal
process.report.writeReport([filename][, err])
process.resourceUsage()
process.send(message[, sendHandle[, options]][, callback])
process.setegid(id)
process.seteuid(id)
process.setgid(id)
process.setgroups(groups)
process.setuid(id)
process.setSourceMapsEnabled(val)
process.setUncaughtExceptionCaptureCallback(fn)
process.sourceMapsEnabled
process.stderr
process.stderr.fd
process.stdin
process.stdin.fd
process.stdout
process.stdout.fd
A note on process I/O
process.throwDeprecation
process.threadCpuUsage([previousValue])
process.title
process.traceDeprecation
process.umask()
process.umask(mask)
process.unref(maybeRefable)
process.uptime()
process.version
process.versions
Exit codes
Process
#
Source Code: lib/process.js
The process object provides information about, and control over, the current Node.js process.
const process = require('node:process');
copy
Process events
#
The process object is an instance of EventEmitter.
Event: 'beforeExit'
#
Added in: v0.11.12
The 'beforeExit' event is emitted when Node.js empties its event loop and has no additional work to schedule. Normally, the Node.js process will exit when there is no work scheduled, but a listener registered on the 'beforeExit' event can make asynchronous calls, and thereby cause the Node.js process to continue.
The listener callback function is invoked with the value of process.exitCode passed as the only argument.
The 'beforeExit' event is not emitted for conditions causing explicit termination, such as calling process.exit() or uncaught exceptions.
The 'beforeExit' should not be used as an alternative to the 'exit' event unless the intention is to schedule additional work.
const process = require('node:process');

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
copy
Event: 'disconnect'
#
Added in: v0.7.7
If the Node.js process is spawned with an IPC channel (see the Child Process and Cluster documentation), the 'disconnect' event will be emitted when the IPC channel is closed.
Event: 'exit'
#
Added in: v0.1.7
code <integer>
The 'exit' event is emitted when the Node.js process is about to exit as a result of either:
The process.exit() method being called explicitly;
The Node.js event loop no longer having any additional work to perform.
There is no way to prevent the exiting of the event loop at this point, and once all 'exit' listeners have finished running the Node.js process will terminate.
The listener callback function is invoked with the exit code specified either by the process.exitCode property, or the exitCode argument passed to the process.exit() method.
const process = require('node:process');

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
copy
Listener functions must only perform synchronous operations. The Node.js process will exit immediately after calling the 'exit' event listeners causing any additional work still queued in the event loop to be abandoned. In the following example, for instance, the timeout will never occur:
const process = require('node:process');

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
copy
Event: 'message'
#
Added in: v0.5.10
message <Object> | <boolean> | <number> | <string> | <null> a parsed JSON object or a serializable primitive value.
sendHandle <net.Server> | <net.Socket> a net.Server or net.Socket object, or undefined.
If the Node.js process is spawned with an IPC channel (see the Child Process and Cluster documentation), the 'message' event is emitted whenever a message sent by a parent process using childprocess.send() is received by the child process.
The message goes through serialization and parsing. The resulting message might not be the same as what is originally sent.
If the serialization option was set to advanced used when spawning the process, the message argument can contain data that JSON is not able to represent. See Advanced serialization for child_process for more details.
Event: 'multipleResolves'
#
Added in: v10.12.0Deprecated since: v17.6.0, v16.15.0
Stability: 0 - Deprecated
type <string> The resolution type. One of 'resolve' or 'reject'.
promise <Promise> The promise that resolved or rejected more than once.
value <any> The value with which the promise was either resolved or rejected after the original resolve.
The 'multipleResolves' event is emitted whenever a Promise has been either:
Resolved more than once.
Rejected more than once.
Rejected after resolve.
Resolved after reject.
This is useful for tracking potential errors in an application while using the Promise constructor, as multiple resolutions are silently swallowed. However, the occurrence of this event does not necessarily indicate an error. For example, Promise.race() can trigger a 'multipleResolves' event.
Because of the unreliability of the event in cases like the Promise.race() example above it has been deprecated.
const process = require('node:process');

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
copy
Event: 'rejectionHandled'
#
Added in: v1.4.1
promise <Promise> The late handled promise.
The 'rejectionHandled' event is emitted whenever a Promise has been rejected and an error handler was attached to it (using promise.catch(), for example) later than one turn of the Node.js event loop.
The Promise object would have previously been emitted in an 'unhandledRejection' event, but during the course of processing gained a rejection handler.
There is no notion of a top level for a Promise chain at which rejections can always be handled. Being inherently asynchronous in nature, a Promise rejection can be handled at a future point in time, possibly much later than the event loop turn it takes for the 'unhandledRejection' event to be emitted.
Another way of stating this is that, unlike in synchronous code where there is an ever-growing list of unhandled exceptions, with Promises there can be a growing-and-shrinking list of unhandled rejections.
In synchronous code, the 'uncaughtException' event is emitted when the list of unhandled exceptions grows.
In asynchronous code, the 'unhandledRejection' event is emitted when the list of unhandled rejections grows, and the 'rejectionHandled' event is emitted when the list of unhandled rejections shrinks.
const process = require('node:process');

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
copy
In this example, the unhandledRejections Map will grow and shrink over time, reflecting rejections that start unhandled and then become handled. It is possible to record such errors in an error log, either periodically (which is likely best for long-running application) or upon process exit (which is likely most convenient for scripts).
Event: 'workerMessage'
#
Added in: v22.5.0, v20.19.0
value <any> A value transmitted using postMessageToThread().
source <number> The transmitting worker thread ID or 0 for the main thread.
The 'workerMessage' event is emitted for any incoming message send by the other party by using postMessageToThread().
Event: 'uncaughtException'
#
History













err <Error> The uncaught exception.
origin <string> Indicates if the exception originates from an unhandled rejection or from a synchronous error. Can either be 'uncaughtException' or 'unhandledRejection'. The latter is used when an exception happens in a Promise based async context (or if a Promise is rejected) and --unhandled-rejections flag set to strict or throw (which is the default) and the rejection is not handled, or when a rejection happens during the command line entry point's ES module static loading phase.
The 'uncaughtException' event is emitted when an uncaught JavaScript exception bubbles all the way back to the event loop. By default, Node.js handles such exceptions by printing the stack trace to stderr and exiting with code 1, overriding any previously set process.exitCode. Adding a handler for the 'uncaughtException' event overrides this default behavior. Alternatively, change the process.exitCode in the 'uncaughtException' handler which will result in the process exiting with the provided exit code. Otherwise, in the presence of such handler the process will exit with 0.
const process = require('node:process');
const fs = require('node:fs');

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
copy
It is possible to monitor 'uncaughtException' events without overriding the default behavior to exit the process by installing a 'uncaughtExceptionMonitor' listener.
Warning: Using 'uncaughtException' correctly
#
'uncaughtException' is a crude mechanism for exception handling intended to be used only as a last resort. The event should not be used as an equivalent to On Error Resume Next. Unhandled exceptions inherently mean that an application is in an undefined state. Attempting to resume application code without properly recovering from the exception can cause additional unforeseen and unpredictable issues.
Exceptions thrown from within the event handler will not be caught. Instead the process will exit with a non-zero exit code and the stack trace will be printed. This is to avoid infinite recursion.
Attempting to resume normally after an uncaught exception can be similar to pulling out the power cord when upgrading a computer. Nine out of ten times, nothing happens. But the tenth time, the system becomes corrupted.
The correct use of 'uncaughtException' is to perform synchronous cleanup of allocated resources (e.g. file descriptors, handles, etc) before shutting down the process. It is not safe to resume normal operation after 'uncaughtException'.
To restart a crashed application in a more reliable way, whether 'uncaughtException' is emitted or not, an external monitor should be employed in a separate process to detect application failures and recover or restart as needed.
Event: 'uncaughtExceptionMonitor'
#
Added in: v13.7.0, v12.17.0
err <Error> The uncaught exception.
origin <string> Indicates if the exception originates from an unhandled rejection or from synchronous errors. Can either be 'uncaughtException' or 'unhandledRejection'. The latter is used when an exception happens in a Promise based async context (or if a Promise is rejected) and --unhandled-rejections flag set to strict or throw (which is the default) and the rejection is not handled, or when a rejection happens during the command line entry point's ES module static loading phase.
The 'uncaughtExceptionMonitor' event is emitted before an 'uncaughtException' event is emitted or a hook installed via process.setUncaughtExceptionCaptureCallback() is called.
Installing an 'uncaughtExceptionMonitor' listener does not change the behavior once an 'uncaughtException' event is emitted. The process will still crash if no 'uncaughtException' listener is installed.
const process = require('node:process');

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
// Still crashes Node.js
copy
Event: 'unhandledRejection'
#
History

















reason <Error> | <any> The object with which the promise was rejected (typically an Error object).
promise <Promise> The rejected promise.
The 'unhandledRejection' event is emitted whenever a Promise is rejected and no error handler is attached to the promise within a turn of the event loop. When programming with Promises, exceptions are encapsulated as "rejected promises". Rejections can be caught and handled using promise.catch() and are propagated through a Promise chain. The 'unhandledRejection' event is useful for detecting and keeping track of promises that were rejected whose rejections have not yet been handled.
const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Note the typo (`pasre`)
}); // No `.catch()` or `.then()`
copy
The following will also trigger the 'unhandledRejection' event to be emitted:
const process = require('node:process');

function SomeResource() {
  // Initially set the loaded status to a rejected promise
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// no .catch or .then on resource.loaded for at least a turn
copy
In this example case, it is possible to track the rejection as a developer error as would typically be the case for other 'unhandledRejection' events. To address such failures, a non-operational .catch(() => { }) handler may be attached to resource.loaded, which would prevent the 'unhandledRejection' event from being emitted.
If an 'unhandledRejection' event is emitted but not handled it will be raised as an uncaught exception. This alongside other behaviors of 'unhandledRejection' events can changed via the --unhandled-rejections flag.
Event: 'warning'
#
Added in: v6.0.0
warning <Error> Key properties of the warning are:
name <string> The name of the warning. Default: 'Warning'.
message <string> A system-provided description of the warning.
stack <string> A stack trace to the location in the code where the warning was issued.
The 'warning' event is emitted whenever Node.js emits a process warning.
A process warning is similar to an error in that it describes exceptional conditions that are being brought to the user's attention. However, warnings are not part of the normal Node.js and JavaScript error handling flow. Node.js can emit warnings whenever it detects bad coding practices that could lead to sub-optimal application performance, bugs, or security vulnerabilities.
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack);   // Print the stack trace
});
copy
By default, Node.js will print process warnings to stderr. The --no-warnings command-line option can be used to suppress the default console output but the 'warning' event will still be emitted by the process object. Currently, it is not possible to suppress specific warning types other than deprecation warnings. To suppress deprecation warnings, check out the --no-deprecation flag.
The following example illustrates the warning that is printed to stderr when too many listeners have been added to an event:
$ node
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> (node:38638) MaxListenersExceededWarning: Possible EventEmitter memory leak
detected. 2 foo listeners added. Use emitter.setMaxListeners() to increase limit
copy
In contrast, the following example turns off the default warning output and adds a custom handler to the 'warning' event:
$ node --no-warnings
> const p = process.on('warning', (warning) => console.warn('Do not do that!'));
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> Do not do that!
copy
The --trace-warnings command-line option can be used to have the default console output for warnings include the full stack trace of the warning.
Launching Node.js using the --throw-deprecation command-line flag will cause custom deprecation warnings to be thrown as exceptions.
Using the --trace-deprecation command-line flag will cause the custom deprecation to be printed to stderr along with the stack trace.
Using the --no-deprecation command-line flag will suppress all reporting of the custom deprecation.
The *-deprecation command-line flags only affect warnings that use the name 'DeprecationWarning'.
Emitting custom warnings
#
See the process.emitWarning() method for issuing custom or application-specific warnings.
Node.js warning names
#
There are no strict guidelines for warning types (as identified by the name property) emitted by Node.js. New types of warnings can be added at any time. A few of the warning types that are most common include:
'DeprecationWarning' - Indicates use of a deprecated Node.js API or feature. Such warnings must include a 'code' property identifying the deprecation code.
'ExperimentalWarning' - Indicates use of an experimental Node.js API or feature. Such features must be used with caution as they may change at any time and are not subject to the same strict semantic-versioning and long-term support policies as supported features.
'MaxListenersExceededWarning' - Indicates that too many listeners for a given event have been registered on either an EventEmitter or EventTarget. This is often an indication of a memory leak.
'TimeoutOverflowWarning' - Indicates that a numeric value that cannot fit within a 32-bit signed integer has been provided to either the setTimeout() or setInterval() functions.
'TimeoutNegativeWarning' - Indicates that a negative number has provided to either the setTimeout() or setInterval() functions.
'TimeoutNaNWarning' - Indicates that a value which is not a number has provided to either the setTimeout() or setInterval() functions.
'UnsupportedWarning' - Indicates use of an unsupported option or feature that will be ignored rather than treated as an error. One example is use of the HTTP response status message when using the HTTP/2 compatibility API.
Event: 'worker'
#
Added in: v16.2.0, v14.18.0
worker <Worker> The <Worker> that was created.
The 'worker' event is emitted after a new <Worker> thread has been created.
Signal events
#
Signal events will be emitted when the Node.js process receives a signal. Please refer to signal(7) for a listing of standard POSIX signal names such as 'SIGINT', 'SIGHUP', etc.
Signals are not available on Worker threads.
The signal handler will receive the signal's name ('SIGINT', 'SIGTERM', etc.) as the first argument.
The name of each event will be the uppercase common name for the signal (e.g. 'SIGINT' for SIGINT signals).
const process = require('node:process');

// Begin reading from stdin so the process does not exit.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// Using a single function to handle multiple signals
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
copy
'SIGUSR1' is reserved by Node.js to start the debugger. It's possible to install a listener but doing so might interfere with the debugger.
'SIGTERM' and 'SIGINT' have default handlers on non-Windows platforms that reset the terminal mode before exiting with code 128 + signal number. If one of these signals has a listener installed, its default behavior will be removed (Node.js will no longer exit).
'SIGPIPE' is ignored by default. It can have a listener installed.
'SIGHUP' is generated on Windows when the console window is closed, and on other platforms under various similar conditions. See signal(7). It can have a listener installed, however Node.js will be unconditionally terminated by Windows about 10 seconds later. On non-Windows platforms, the default behavior of SIGHUP is to terminate Node.js, but once a listener has been installed its default behavior will be removed.
'SIGTERM' is not supported on Windows, it can be listened on.
'SIGINT' from the terminal is supported on all platforms, and can usually be generated with Ctrl+C (though this may be configurable). It is not generated when terminal raw mode is enabled and Ctrl+C is used.
'SIGBREAK' is delivered on Windows when Ctrl+Break is pressed. On non-Windows platforms, it can be listened on, but there is no way to send or generate it.
'SIGWINCH' is delivered when the console has been resized. On Windows, this will only happen on write to the console when the cursor is being moved, or when a readable tty is used in raw mode.
'SIGKILL' cannot have a listener installed, it will unconditionally terminate Node.js on all platforms.
'SIGSTOP' cannot have a listener installed.
'SIGBUS', 'SIGFPE', 'SIGSEGV', and 'SIGILL', when not raised artificially using kill(2), inherently leave the process in a state from which it is not safe to call JS listeners. Doing so might cause the process to stop responding.
0 can be sent to test for the existence of a process, it has no effect if the process exists, but will throw an error if the process does not exist.
Windows does not support signals so has no equivalent to termination by signal, but Node.js offers some emulation with process.kill(), and subprocess.kill():
Sending SIGINT, SIGTERM, and SIGKILL will cause the unconditional termination of the target process, and afterwards, subprocess will report that the process was terminated by signal.
Sending signal 0 can be used as a platform independent way to test for the existence of a process.
process.abort()
#
Added in: v0.7.0
The process.abort() method causes the Node.js process to exit immediately and generate a core file.
This feature is not available in Worker threads.
process.allowedNodeEnvironmentFlags
#
Added in: v10.10.0
<Set>
The process.allowedNodeEnvironmentFlags property is a special, read-only Set of flags allowable within the NODE_OPTIONS environment variable.
process.allowedNodeEnvironmentFlags extends Set, but overrides Set.prototype.has to recognize several different possible flag representations. process.allowedNodeEnvironmentFlags.has() will return true in the following cases:
Flags may omit leading single (-) or double (--) dashes; e.g., inspect-brk for --inspect-brk, or r for -r.
Flags passed through to V8 (as listed in --v8-options) may replace one or more non-leading dashes for an underscore, or vice-versa; e.g., --perf_basic_prof, --perf-basic-prof, --perf_basic-prof, etc.
Flags may contain one or more equals (=) characters; all characters after and including the first equals will be ignored; e.g., --stack-trace-limit=100.
Flags must be allowable within NODE_OPTIONS.
When iterating over process.allowedNodeEnvironmentFlags, flags will appear only once; each will begin with one or more dashes. Flags passed through to V8 will contain underscores instead of non-leading dashes:
const { allowedNodeEnvironmentFlags } = require('node:process');

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
copy
The methods add(), clear(), and delete() of process.allowedNodeEnvironmentFlags do nothing, and will fail silently.
If Node.js was compiled without NODE_OPTIONS support (shown in process.config), process.allowedNodeEnvironmentFlags will contain what would have been allowable.
process.arch
#
Added in: v0.5.0
<string>
The operating system CPU architecture for which the Node.js binary was compiled. Possible values are: 'arm', 'arm64', 'ia32', 'loong64', 'mips', 'mipsel', 'ppc64', 'riscv64', 's390', 's390x', and 'x64'.
const { arch } = require('node:process');

console.log(`This processor architecture is ${arch}`);
copy
process.argv
#
Added in: v0.1.27
<string[]>
The process.argv property returns an array containing the command-line arguments passed when the Node.js process was launched. The first element will be process.execPath. See process.argv0 if access to the original value of argv[0] is needed. The second element will be the path to the JavaScript file being executed. The remaining elements will be any additional command-line arguments.
For example, assuming the following script for process-args.js:
const { argv } = require('node:process');

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
copy
Launching the Node.js process as:
node process-args.js one two=three four
copy
Would generate the output:
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
copy
process.argv0
#
Added in: v6.4.0
<string>
The process.argv0 property stores a read-only copy of the original value of argv[0] passed when Node.js starts.
$ bash -c 'exec -a customArgv0 ./node'
> process.argv[0]
'/Volumes/code/external/node/out/Release/node'
> process.argv0
'customArgv0'
copy
process.availableMemory()
#
History













<number>
Gets the amount of free memory that is still available to the process (in bytes).
See uv_get_available_memory for more information.
process.channel
#
History













<Object>
If the Node.js process was spawned with an IPC channel (see the Child Process documentation), the process.channel property is a reference to the IPC channel. If no IPC channel exists, this property is undefined.
process.channel.ref()
#
Added in: v7.1.0
This method makes the IPC channel keep the event loop of the process running if .unref() has been called before.
Typically, this is managed through the number of 'disconnect' and 'message' listeners on the process object. However, this method can be used to explicitly request a specific behavior.
process.channel.unref()
#
Added in: v7.1.0
This method makes the IPC channel not keep the event loop of the process running, and lets it finish even while the channel is open.
Typically, this is managed through the number of 'disconnect' and 'message' listeners on the process object. However, this method can be used to explicitly request a specific behavior.
process.chdir(directory)
#
Added in: v0.1.17
directory <string>
The process.chdir() method changes the current working directory of the Node.js process or throws an exception if doing so fails (for instance, if the specified directory does not exist).
const { chdir, cwd } = require('node:process');

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`New directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
copy
This feature is not available in Worker threads.
process.config
#
History

















<Object>
The process.config property returns a frozen Object containing the JavaScript representation of the configure options used to compile the current Node.js executable. This is the same as the config.gypi file that was produced when running the ./configure script.
An example of the possible output looks like:
{
  target_defaults:
   { cflags: [],
     default_configuration: 'Release',
     defines: [],
     include_dirs: [],
     libraries: [] },
  variables:
   {
     host_arch: 'x64',
     napi_build_version: 5,
     node_install_npm: 'true',
     node_prefix: '',
     node_shared_cares: 'false',
     node_shared_http_parser: 'false',
     node_shared_libuv: 'false',
     node_shared_zlib: 'false',
     node_use_openssl: 'true',
     node_shared_openssl: 'false',
     target_arch: 'x64',
     v8_use_snapshot: 1
   }
}
copy
process.connected
#
Added in: v0.7.2
<boolean>
If the Node.js process is spawned with an IPC channel (see the Child Process and Cluster documentation), the process.connected property will return true so long as the IPC channel is connected and will return false after process.disconnect() is called.
Once process.connected is false, it is no longer possible to send messages over the IPC channel using process.send().
process.constrainedMemory()
#
History

















<number>
Gets the amount of memory available to the process (in bytes) based on limits imposed by the OS. If there is no such constraint, or the constraint is unknown, 0 is returned.
See uv_get_constrained_memory for more information.
process.cpuUsage([previousValue])
#
Added in: v6.1.0
previousValue <Object> A previous return value from calling process.cpuUsage()
Returns: <Object>
user <integer>
system <integer>
The process.cpuUsage() method returns the user and system CPU time usage of the current process, in an object with properties user and system, whose values are microsecond values (millionth of a second). These values measure time spent in user and system code respectively, and may end up being greater than actual elapsed time if multiple CPU cores are performing work for this process.
The result of a previous call to process.cpuUsage() can be passed as the argument to the function, to get a diff reading.
const { cpuUsage } = require('node:process');

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// spin the CPU for 500 milliseconds
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
copy
process.cwd()
#
Added in: v0.1.8
Returns: <string>
The process.cwd() method returns the current working directory of the Node.js process.
const { cwd } = require('node:process');

console.log(`Current directory: ${cwd()}`);
copy
process.debugPort
#
Added in: v0.7.2
<number>
The port used by the Node.js debugger when enabled.
const process = require('node:process');

process.debugPort = 5858;
copy
process.disconnect()
#
Added in: v0.7.2
If the Node.js process is spawned with an IPC channel (see the Child Process and Cluster documentation), the process.disconnect() method will close the IPC channel to the parent process, allowing the child process to exit gracefully once there are no other connections keeping it alive.
The effect of calling process.disconnect() is the same as calling ChildProcess.disconnect() from the parent process.
If the Node.js process was not spawned with an IPC channel, process.disconnect() will be undefined.
process.dlopen(module, filename[, flags])
#
History













module <Object>
filename <string>
flags <os.constants.dlopen> Default: os.constants.dlopen.RTLD_LAZY
The process.dlopen() method allows dynamically loading shared objects. It is primarily used by require() to load C++ Addons, and should not be used directly, except in special cases. In other words, require() should be preferred over process.dlopen() unless there are specific reasons such as custom dlopen flags or loading from ES modules.
The flags argument is an integer that allows to specify dlopen behavior. See the os.constants.dlopen documentation for details.
An important requirement when calling process.dlopen() is that the module instance must be passed. Functions exported by the C++ Addon are then accessible via module.exports.
The example below shows how to load a C++ Addon, named local.node, that exports a foo function. All the symbols are loaded before the call returns, by passing the RTLD_NOW constant. In this example the constant is assumed to be available.
const { dlopen } = require('node:process');
const { constants } = require('node:os');
const { join } = require('node:path');

const module = { exports: {} };
dlopen(module, join(__dirname, 'local.node'), constants.dlopen.RTLD_NOW);
module.exports.foo();
copy
process.emitWarning(warning[, options])
#
Added in: v8.0.0
warning <string> | <Error> The warning to emit.
options <Object>
type <string> When warning is a String, type is the name to use for the type of warning being emitted. Default: 'Warning'.
code <string> A unique identifier for the warning instance being emitted.
ctor <Function> When warning is a String, ctor is an optional function used to limit the generated stack trace. Default: process.emitWarning.
detail <string> Additional text to include with the error.
The process.emitWarning() method can be used to emit custom or application specific process warnings. These can be listened for by adding a handler to the 'warning' event.
const { emitWarning } = require('node:process');

// Emit a warning with a code and additional detail.
emitWarning('Something happened!', {
  code: 'MY_WARNING',
  detail: 'This is some additional information',
});
// Emits:
// (node:56338) [MY_WARNING] Warning: Something happened!
// This is some additional information
copy
In this example, an Error object is generated internally by process.emitWarning() and passed through to the 'warning' handler.
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Something happened!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // Stack trace
  console.warn(warning.detail);  // 'This is some additional information'
});
copy
If warning is passed as an Error object, the options argument is ignored.
process.emitWarning(warning[, type[, code]][, ctor])
#
Added in: v6.0.0
warning <string> | <Error> The warning to emit.
type <string> When warning is a String, type is the name to use for the type of warning being emitted. Default: 'Warning'.
code <string> A unique identifier for the warning instance being emitted.
ctor <Function> When warning is a String, ctor is an optional function used to limit the generated stack trace. Default: process.emitWarning.
The process.emitWarning() method can be used to emit custom or application specific process warnings. These can be listened for by adding a handler to the 'warning' event.
const { emitWarning } = require('node:process');

// Emit a warning using a string.
emitWarning('Something happened!');
// Emits: (node: 56338) Warning: Something happened!
copy
const { emitWarning } = require('node:process');

// Emit a warning using a string and a type.
emitWarning('Something Happened!', 'CustomWarning');
// Emits: (node:56338) CustomWarning: Something Happened!
copy
const { emitWarning } = require('node:process');

process.emitWarning('Something happened!', 'CustomWarning', 'WARN001');
// Emits: (node:56338) [WARN001] CustomWarning: Something happened!
copy
In each of the previous examples, an Error object is generated internally by process.emitWarning() and passed through to the 'warning' handler.
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
copy
If warning is passed as an Error object, it will be passed through to the 'warning' event handler unmodified (and the optional type, code and ctor arguments will be ignored):
const { emitWarning } = require('node:process');

// Emit a warning using an Error object.
const myWarning = new Error('Something happened!');
// Use the Error name property to specify the type name
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Emits: (node:56338) [WARN001] CustomWarning: Something happened!
copy
A TypeError is thrown if warning is anything other than a string or Error object.
While process warnings use Error objects, the process warning mechanism is not a replacement for normal error handling mechanisms.
The following additional handling is implemented if the warning type is 'DeprecationWarning':
If the --throw-deprecation command-line flag is used, the deprecation warning is thrown as an exception rather than being emitted as an event.
If the --no-deprecation command-line flag is used, the deprecation warning is suppressed.
If the --trace-deprecation command-line flag is used, the deprecation warning is printed to stderr along with the full stack trace.
Avoiding duplicate warnings
#
As a best practice, warnings should be emitted only once per process. To do so, place the emitWarning() behind a boolean.
const { emitWarning } = require('node:process');

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
copy
process.env
#
History

















<Object>
The process.env property returns an object containing the user environment. See environ(7).
An example of this object looks like:
{
  TERM: 'xterm-256color',
  SHELL: '/usr/local/bin/bash',
  USER: 'maciej',
  PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
  PWD: '/Users/maciej',
  EDITOR: 'vim',
  SHLVL: '1',
  HOME: '/Users/maciej',
  LOGNAME: 'maciej',
  _: '/usr/local/bin/node'
}
copy
It is possible to modify this object, but such modifications will not be reflected outside the Node.js process, or (unless explicitly requested) to other Worker threads. In other words, the following example would not work:
node -e 'process.env.foo = "bar"' && echo $foo
copy
While the following will:
const { env } = require('node:process');

env.foo = 'bar';
console.log(env.foo);
copy
Assigning a property on process.env will implicitly convert the value to a string. This behavior is deprecated. Future versions of Node.js may throw an error when the value is not a string, number, or boolean.
const { env } = require('node:process');

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
copy
Use delete to delete a property from process.env.
const { env } = require('node:process');

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
copy
On Windows operating systems, environment variables are case-insensitive.
const { env } = require('node:process');

env.TEST = 1;
console.log(env.test);
// => 1
copy
Unless explicitly specified when creating a Worker instance, each Worker thread has its own copy of process.env, based on its parent thread's process.env, or whatever was specified as the env option to the Worker constructor. Changes to process.env will not be visible across Worker threads, and only the main thread can make changes that are visible to the operating system or to native add-ons. On Windows, a copy of process.env on a Worker instance operates in a case-sensitive manner unlike the main thread.
process.execArgv
#
Added in: v0.7.7
<string[]>
The process.execArgv property returns the set of Node.js-specific command-line options passed when the Node.js process was launched. These options do not appear in the array returned by the process.argv property, and do not include the Node.js executable, the name of the script, or any options following the script name. These options are useful in order to spawn child processes with the same execution environment as the parent.
node --icu-data-dir=./foo --require ./bar.js script.js --version
copy
Results in process.execArgv:
["--icu-data-dir=./foo", "--require", "./bar.js"]
copy
And process.argv:
['/usr/local/bin/node', 'script.js', '--version']
copy
Refer to Worker constructor for the detailed behavior of worker threads with this property.
process.execPath
#
Added in: v0.1.100
<string>
The process.execPath property returns the absolute pathname of the executable that started the Node.js process. Symbolic links, if any, are resolved.
'/usr/local/bin/node'
copy
process.execve(file[, args[, env]])
#
Added in: v23.11.0, v22.15.0
Stability: 1 - Experimental
file <string> The name or path of the executable file to run.
args <string[]> List of string arguments. No argument can contain a null-byte (\u0000).
env <Object> Environment key-value pairs. No key or value can contain a null-byte (\u0000). Default: process.env.
Replaces the current process with a new process.
This is achieved by using the execve POSIX function and therefore no memory or other resources from the current process are preserved, except for the standard input, standard output and standard error file descriptor.
All other resources are discarded by the system when the processes are swapped, without triggering any exit or close events and without running any cleanup handler.
This function will never return, unless an error occurred.
This function is not available on Windows or IBM i.
process.exit([code])
#
History













code <integer> | <string> | <null> | <undefined> The exit code. For string type, only integer strings (e.g.,'1') are allowed. Default: 0.
The process.exit() method instructs Node.js to terminate the process synchronously with an exit status of code. If code is omitted, exit uses either the 'success' code 0 or the value of process.exitCode if it has been set. Node.js will not terminate until all the 'exit' event listeners are called.
To exit with a 'failure' code:
const { exit } = require('node:process');

exit(1);
copy
The shell that executed Node.js should see the exit code as 1.
Calling process.exit() will force the process to exit as quickly as possible even if there are still asynchronous operations pending that have not yet completed fully, including I/O operations to process.stdout and process.stderr.
In most situations, it is not actually necessary to call process.exit() explicitly. The Node.js process will exit on its own if there is no additional work pending in the event loop. The process.exitCode property can be set to tell the process which exit code to use when the process exits gracefully.
For instance, the following example illustrates a misuse of the process.exit() method that could lead to data printed to stdout being truncated and lost:
const { exit } = require('node:process');

// This is an example of what *not* to do:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
copy
The reason this is problematic is because writes to process.stdout in Node.js are sometimes asynchronous and may occur over multiple ticks of the Node.js event loop. Calling process.exit(), however, forces the process to exit before those additional writes to stdout can be performed.
Rather than calling process.exit() directly, the code should set the process.exitCode and allow the process to exit naturally by avoiding scheduling any additional work for the event loop:
const process = require('node:process');

// How to properly set the exit code while letting
// the process exit gracefully.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
copy
If it is necessary to terminate the Node.js process due to an error condition, throwing an uncaught error and allowing the process to terminate accordingly is safer than calling process.exit().
In Worker threads, this function stops the current thread rather than the current process.
process.exitCode
#
History













<integer> | <string> | <null> | <undefined> The exit code. For string type, only integer strings (e.g.,'1') are allowed. Default: undefined.
A number which will be the process exit code, when the process either exits gracefully, or is exited via process.exit() without specifying a code.
The value of process.exitCode can be updated by either assigning a value to process.exitCode or by passing an argument to process.exit():
$ node -e 'process.exitCode = 9'; echo $?
9
$ node -e 'process.exit(42)'; echo $?
42
$ node -e 'process.exitCode = 9; process.exit(42)'; echo $?
42
copy
The value can also be set implicitly by Node.js when unrecoverable errors occur (e.g. such as the encountering of an unsettled top-level await). However explicit manipulations of the exit code always take precedence over implicit ones:
$ node --input-type=module -e 'await new Promise(() => {})'; echo $?
13
$ node --input-type=module -e 'process.exitCode = 9; await new Promise(() => {})'; echo $?
9
copy
process.features.cached_builtins
#
Added in: v12.0.0
<boolean>
A boolean value that is true if the current Node.js build is caching builtin modules.
process.features.debug
#
Added in: v0.5.5
<boolean>
A boolean value that is true if the current Node.js build is a debug build.
process.features.inspector
#
Added in: v11.10.0
<boolean>
A boolean value that is true if the current Node.js build includes the inspector.
process.features.ipv6
#
Added in: v0.5.3Deprecated since: v23.4.0, v22.13.0
Stability: 0 - Deprecated. This property is always true, and any checks based on it are redundant.
<boolean>
A boolean value that is true if the current Node.js build includes support for IPv6.
Since all Node.js builds have IPv6 support, this value is always true.
process.features.require_module
#
Added in: v23.0.0, v22.10.0, v20.19.0
<boolean>
A boolean value that is true if the current Node.js build supports loading ECMAScript modules using require().
process.features.tls
#
Added in: v0.5.3
<boolean>
A boolean value that is true if the current Node.js build includes support for TLS.
process.features.tls_alpn
#
Added in: v4.8.0Deprecated since: v23.4.0, v22.13.0
Stability: 0 - Deprecated. Use process.features.tls instead.
<boolean>
A boolean value that is true if the current Node.js build includes support for ALPN in TLS.
In Node.js 11.0.0 and later versions, the OpenSSL dependencies feature unconditional ALPN support. This value is therefore identical to that of process.features.tls.
process.features.tls_ocsp
#
Added in: v0.11.13Deprecated since: v23.4.0, v22.13.0
Stability: 0 - Deprecated. Use process.features.tls instead.
<boolean>
A boolean value that is true if the current Node.js build includes support for OCSP in TLS.
In Node.js 11.0.0 and later versions, the OpenSSL dependencies feature unconditional OCSP support. This value is therefore identical to that of process.features.tls.
process.features.tls_sni
#
Added in: v0.5.3Deprecated since: v23.4.0, v22.13.0
Stability: 0 - Deprecated. Use process.features.tls instead.
<boolean>
A boolean value that is true if the current Node.js build includes support for SNI in TLS.
In Node.js 11.0.0 and later versions, the OpenSSL dependencies feature unconditional SNI support. This value is therefore identical to that of process.features.tls.
process.features.typescript
#
Added in: v23.0.0, v22.10.0
Stability: 1.2 - Release candidate
<boolean> | <string>
A value that is "strip" by default, "transform" if Node.js is run with --experimental-transform-types, and false if Node.js is run with --no-experimental-strip-types.
process.features.uv
#
Added in: v0.5.3Deprecated since: v23.4.0, v22.13.0
Stability: 0 - Deprecated. This property is always true, and any checks based on it are redundant.
<boolean>
A boolean value that is true if the current Node.js build includes support for libuv.
Since it's not possible to build Node.js without libuv, this value is always true.
process.finalization.register(ref, callback)
#
Added in: v22.5.0
Stability: 1.1 - Active Development
ref <Object> | <Function> The reference to the resource that is being tracked.
callback <Function> The callback function to be called when the resource is finalized.
ref <Object> | <Function> The reference to the resource that is being tracked.
event <string> The event that triggered the finalization. Defaults to 'exit'.
This function registers a callback to be called when the process emits the exit event if the ref object was not garbage collected. If the object ref was garbage collected before the exit event is emitted, the callback will be removed from the finalization registry, and it will not be called on process exit.
Inside the callback you can release the resources allocated by the ref object. Be aware that all limitations applied to the beforeExit event are also applied to the callback function, this means that there is a possibility that the callback will not be called under special circumstances.
The idea of ​​this function is to help you free up resources when the starts process exiting, but also let the object be garbage collected if it is no longer being used.
Eg: you can register an object that contains a buffer, you want to make sure that buffer is released when the process exit, but if the object is garbage collected before the process exit, we no longer need to release the buffer, so in this case we just remove the callback from the finalization registry.
const { finalization } = require('node:process');

// Please make sure that the function passed to finalization.register()
// does not create a closure around unnecessary objects.
function onFinalize(obj, event) {
  // You can do whatever you want with the object
  obj.dispose();
}

function setup() {
  // This object can be safely garbage collected,
  // and the resulting shutdown function will not be called.
  // There are no leaks.
  const myDisposableObject = {
    dispose() {
      // Free your resources synchronously
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
copy
The code above relies on the following assumptions:
arrow functions are avoided
regular functions are recommended to be within the global context (root)
Regular functions could reference the context where the obj lives, making the obj not garbage collectible.
Arrow functions will hold the previous context. Consider, for example:
class Test {
  constructor() {
    finalization.register(this, (ref) => ref.dispose());

    // Even something like this is highly discouraged
    // finalization.register(this, () => this.dispose());
  }
  dispose() {}
}
copy
It is very unlikely (not impossible) that this object will be garbage collected, but if it is not, dispose will be called when process.exit is called.
Be careful and avoid relying on this feature for the disposal of critical resources, as it is not guaranteed that the callback will be called under all circumstances.
process.finalization.registerBeforeExit(ref, callback)
#
Added in: v22.5.0
Stability: 1.1 - Active Development
ref <Object> | <Function> The reference to the resource that is being tracked.
callback <Function> The callback function to be called when the resource is finalized.
ref <Object> | <Function> The reference to the resource that is being tracked.
event <string> The event that triggered the finalization. Defaults to 'beforeExit'.
This function behaves exactly like the register, except that the callback will be called when the process emits the beforeExit event if ref object was not garbage collected.
Be aware that all limitations applied to the beforeExit event are also applied to the callback function, this means that there is a possibility that the callback will not be called under special circumstances.
process.finalization.unregister(ref)
#
Added in: v22.5.0
Stability: 1.1 - Active Development
ref <Object> | <Function> The reference to the resource that was registered previously.
This function remove the register of the object from the finalization registry, so the callback will not be called anymore.
const { finalization } = require('node:process');

// Please make sure that the function passed to finalization.register()
// does not create a closure around unnecessary objects.
function onFinalize(obj, event) {
  // You can do whatever you want with the object
  obj.dispose();
}

function setup() {
  // This object can be safely garbage collected,
  // and the resulting shutdown function will not be called.
  // There are no leaks.
  const myDisposableObject = {
    dispose() {
      // Free your resources synchronously
    },
  };

  finalization.register(myDisposableObject, onFinalize);

  // Do something

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
copy
process.getActiveResourcesInfo()
#
History













Returns: <string[]>
The process.getActiveResourcesInfo() method returns an array of strings containing the types of the active resources that are currently keeping the event loop alive.
const { getActiveResourcesInfo } = require('node:process');
const { setTimeout } = require('node:timers');

console.log('Before:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('After:', getActiveResourcesInfo());
// Prints:
//   Before: [ 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   After: [ 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
copy
process.getBuiltinModule(id)
#
Added in: v22.3.0, v20.16.0
id <string> ID of the built-in module being requested.
Returns: <Object> | <undefined>
process.getBuiltinModule(id) provides a way to load built-in modules in a globally available function. ES Modules that need to support other environments can use it to conditionally load a Node.js built-in when it is run in Node.js, without having to deal with the resolution error that can be thrown by import in a non-Node.js environment or having to use dynamic import() which either turns the module into an asynchronous module, or turns a synchronous API into an asynchronous one.
if (globalThis.process?.getBuiltinModule) {
  // Run in Node.js, use the Node.js fs module.
  const fs = globalThis.process.getBuiltinModule('fs');
  // If `require()` is needed to load user-modules, use createRequire()
  const module = globalThis.process.getBuiltinModule('module');
  const require = module.createRequire(import.meta.url);
  const foo = require('foo');
}
copy
If id specifies a built-in module available in the current Node.js process, process.getBuiltinModule(id) method returns the corresponding built-in module. If id does not correspond to any built-in module, undefined is returned.
process.getBuiltinModule(id) accepts built-in module IDs that are recognized by module.isBuiltin(id). Some built-in modules must be loaded with the node: prefix, see built-in modules with mandatory node: prefix. The references returned by process.getBuiltinModule(id) always point to the built-in module corresponding to id even if users modify require.cache so that require(id) returns something else.
process.getegid()
#
Added in: v2.0.0
The process.getegid() method returns the numerical effective group identity of the Node.js process. (See getegid(2).)
const process = require('node:process');

if (process.getegid) {
  console.log(`Current gid: ${process.getegid()}`);
}
copy
This function is only available on POSIX platforms (i.e. not Windows or Android).
process.geteuid()
#
Added in: v2.0.0
Returns: <Object>
The process.geteuid() method returns the numerical effective user identity of the process. (See geteuid(2).)
const process = require('node:process');

if (process.geteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
}
copy
This function is only available on POSIX platforms (i.e. not Windows or Android).
process.getgid()
#
Added in: v0.1.31
Returns: <Object>
The process.getgid() method returns the numerical group identity of the process. (See getgid(2).)
const process = require('node:process');

if (process.getgid) {
  console.log(`Current gid: ${process.getgid()}`);
}
copy
This function is only available on POSIX platforms (i.e. not Windows or Android).
process.getgroups()
#
Added in: v0.9.4
Returns: <integer[]>
The process.getgroups() method returns an array with the supplementary group IDs. POSIX leaves it unspecified if the effective group ID is included but Node.js ensures it always is.
const process = require('node:process');

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
copy
This function is only available on POSIX platforms (i.e. not Windows or Android).
process.getuid()
#
Added in: v0.1.28
Returns: <integer>
The process.getuid() method returns the numeric user identity of the process. (See getuid(2).)
const process = require('node:process');

if (process.getuid) {
  console.log(`Current uid: ${process.getuid()}`);
}
copy
This function not available on Windows.
process.hasUncaughtExceptionCaptureCallback()
#
Added in: v9.3.0
Returns: <boolean>
Indicates whether a callback has been set using process.setUncaughtExceptionCaptureCallback().
process.hrtime([time])
#
Added in: v0.7.6
Stability: 3 - Legacy. Use process.hrtime.bigint() instead.
time <integer[]> The result of a previous call to process.hrtime()
Returns: <integer[]>
This is the legacy version of process.hrtime.bigint() before bigint was introduced in JavaScript.
The process.hrtime() method returns the current high-resolution real time in a [seconds, nanoseconds] tuple Array, where nanoseconds is the remaining part of the real time that can't be represented in second precision.
time is an optional parameter that must be the result of a previous process.hrtime() call to diff with the current time. If the parameter passed in is not a tuple Array, a TypeError will be thrown. Passing in a user-defined array instead of the result of a previous call to process.hrtime() will lead to undefined behavior.
These times are relative to an arbitrary time in the past, and not related to the time of day and therefore not subject to clock drift. The primary use is for measuring performance between intervals:
const { hrtime } = require('node:process');

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  // Benchmark took 1000000552 nanoseconds
}, 1000);
copy
process.hrtime.bigint()
#
Added in: v10.7.0
Returns: <bigint>
The bigint version of the process.hrtime() method returning the current high-resolution real time in nanoseconds as a bigint.
Unlike process.hrtime(), it does not support an additional time argument since the difference can just be computed directly by subtraction of the two bigints.
const { hrtime } = require('node:process');

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
copy
process.initgroups(user, extraGroup)
#
Added in: v0.9.4
user <string> | <number> The user name or numeric identifier.
extraGroup <string> | <number> A group name or numeric identifier.
The process.initgroups() method reads the /etc/group file and initializes the group access list, using all groups of which the user is a member. This is a privileged operation that requires that the Node.js process either have root access or the CAP_SETGID capability.
Use care when dropping privileges:
const { getgroups, initgroups, setgid } = require('node:process');

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
copy
This function is only available on POSIX platforms (i.e. not Windows or Android). This feature is not available in Worker threads.
process.kill(pid[, signal])
#
Added in: v0.0.6
pid <number> A process ID
signal <string> | <number> The signal to send, either as a string or number. Default: 'SIGTERM'.
The process.kill() method sends the signal to the process identified by pid.
Signal names are strings such as 'SIGINT' or 'SIGHUP'. See Signal Events and kill(2) for more information.
This method will throw an error if the target pid does not exist. As a special case, a signal of 0 can be used to test for the existence of a process. Windows platforms will throw an error if the pid is used to kill a process group.
Even though the name of this function is process.kill(), it is really just a signal sender, like the kill system call. The signal sent may do something other than kill the target process.
const process = require('node:process');

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

process.kill(process.pid, 'SIGHUP');
copy
When SIGUSR1 is received by a Node.js process, Node.js will start the debugger. See Signal Events.
process.loadEnvFile(path)
#
Added in: v21.7.0, v20.12.0
Stability: 1.1 - Active development
path <string> | <URL> | <Buffer> | <undefined>. Default: './.env'
Loads the .env file into process.env. Usage of NODE_OPTIONS in the .env file will not have any effect on Node.js.
const { loadEnvFile } = require('node:process');
loadEnvFile();
copy
process.mainModule
#
Added in: v0.1.17Deprecated since: v14.0.0
Stability: 0 - Deprecated: Use require.main instead.
<Object>
The process.mainModule property provides an alternative way of retrieving require.main. The difference is that if the main module changes at runtime, require.main may still refer to the original main module in modules that were required before the change occurred. Generally, it's safe to assume that the two refer to the same module.
As with require.main, process.mainModule will be undefined if there is no entry script.
process.memoryUsage()
#
History

















Returns: <Object>
rss <integer>
heapTotal <integer>
heapUsed <integer>
external <integer>
arrayBuffers <integer>
Returns an object describing the memory usage of the Node.js process measured in bytes.
const { memoryUsage } = require('node:process');

console.log(memoryUsage());
// Prints:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
copy
heapTotal and heapUsed refer to V8's memory usage.
external refers to the memory usage of C++ objects bound to JavaScript objects managed by V8.
rss, Resident Set Size, is the amount of space occupied in the main memory device (that is a subset of the total allocated memory) for the process, including all C++ and JavaScript objects and code.
arrayBuffers refers to memory allocated for ArrayBuffers and SharedArrayBuffers, including all Node.js Buffers. This is also included in the external value. When Node.js is used as an embedded library, this value may be 0 because allocations for ArrayBuffers may not be tracked in that case.
When using Worker threads, rss will be a value that is valid for the entire process, while the other fields will only refer to the current thread.
The process.memoryUsage() method iterates over each page to gather information about memory usage which might be slow depending on the program memory allocations.
process.memoryUsage.rss()
#
Added in: v15.6.0, v14.18.0
Returns: <integer>
The process.memoryUsage.rss() method returns an integer representing the Resident Set Size (RSS) in bytes.
The Resident Set Size, is the amount of space occupied in the main memory device (that is a subset of the total allocated memory) for the process, including all C++ and JavaScript objects and code.
This is the same value as the rss property provided by process.memoryUsage() but process.memoryUsage.rss() is faster.
const { memoryUsage } = require('node:process');

console.log(memoryUsage.rss());
// 35655680
copy
process.nextTick(callback[, ...args])
#
History





















Stability: 3 - Legacy: Use queueMicrotask() instead.
callback <Function>
...args <any> Additional arguments to pass when invoking the callback
process.nextTick() adds callback to the "next tick queue". This queue is fully drained after the current operation on the JavaScript stack runs to completion and before the event loop is allowed to continue. It's possible to create an infinite loop if one were to recursively call process.nextTick(). See the Event Loop guide for more background.
const { nextTick } = require('node:process');

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
copy
This is important when developing APIs in order to give users the opportunity to assign event handlers after an object has been constructed but before any I/O has occurred:
const { nextTick } = require('node:process');

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() gets called now, not before.
copy
It is very important for APIs to be either 100% synchronous or 100% asynchronous. Consider this example:
// WARNING!  DO NOT USE!  BAD UNSAFE HAZARD!
function maybeSync(arg, cb) {
  if (arg) {
    cb();
    return;
  }

  fs.stat('file', cb);
}
copy
This API is hazardous because in the following case:
const maybeTrue = Math.random() > 0.5;

maybeSync(maybeTrue, () => {
  foo();
});

bar();
copy
It is not clear whether foo() or bar() will be called first.
The following approach is much better:
const { nextTick } = require('node:process');

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
copy
When to use queueMicrotask() vs. process.nextTick()
#
The queueMicrotask() API is an alternative to process.nextTick() that instead of using the "next tick queue" defers execution of a function using the same microtask queue used to execute the then, catch, and finally handlers of resolved promises.
Within Node.js, every time the "next tick queue" is drained, the microtask queue is drained immediately after.
So in CJS modules process.nextTick() callbacks are always run before queueMicrotask() ones. However since ESM modules are processed already as part of the microtask queue, there queueMicrotask() callbacks are always exectued before process.nextTick() ones since Node.js is already in the process of draining the microtask queue.
const { nextTick } = require('node:process');

Promise.resolve().then(() => console.log('resolve'));
queueMicrotask(() => console.log('microtask'));
nextTick(() => console.log('nextTick'));
// Output:
// nextTick
// resolve
// microtask
copy
For most userland use cases, the queueMicrotask() API provides a portable and reliable mechanism for deferring execution that works across multiple JavaScript platform environments and should be favored over process.nextTick(). In simple scenarios, queueMicrotask() can be a drop-in replacement for process.nextTick().
console.log('start');
queueMicrotask(() => {
  console.log('microtask callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// microtask callback
copy
One note-worthy difference between the two APIs is that process.nextTick() allows specifying additional values that will be passed as arguments to the deferred function when it is called. Achieving the same result with queueMicrotask() requires using either a closure or a bound function:
function deferred(a, b) {
  console.log('microtask', a + b);
}

console.log('start');
queueMicrotask(deferred.bind(undefined, 1, 2));
console.log('scheduled');
// Output:
// start
// scheduled
// microtask 3
copy
There are minor differences in the way errors raised from within the next tick queue and microtask queue are handled. Errors thrown within a queued microtask callback should be handled within the queued callback when possible. If they are not, the process.on('uncaughtException') event handler can be used to capture and handle the errors.
When in doubt, unless the specific capabilities of process.nextTick() are needed, use queueMicrotask().
process.noDeprecation
#
Added in: v0.8.0
<boolean>
The process.noDeprecation property indicates whether the --no-deprecation flag is set on the current Node.js process. See the documentation for the 'warning' event and the emitWarning() method for more information about this flag's behavior.
process.permission
#
Added in: v20.0.0
<Object>
This API is available through the --permission flag.
process.permission is an object whose methods are used to manage permissions for the current process. Additional documentation is available in the Permission Model.
process.permission.has(scope[, reference])
#
Added in: v20.0.0
scope <string>
reference <string>
Returns: <boolean>
Verifies that the process is able to access the given scope and reference. If no reference is provided, a global scope is assumed, for instance, process.permission.has('fs.read') will check if the process has ALL file system read permissions.
The reference has a meaning based on the provided scope. For example, the reference when the scope is File System means files and folders.
The available scopes are:
fs - All File System
fs.read - File System read operations
fs.write - File System write operations
child - Child process spawning operations
worker - Worker thread spawning operation
// Check if the process has permission to read the README file
process.permission.has('fs.read', './README.md');
// Check if the process has read permission operations
process.permission.has('fs.read');
copy
process.pid
#
Added in: v0.1.15
<integer>
The process.pid property returns the PID of the process.
const { pid } = require('node:process');

console.log(`This process is pid ${pid}`);
copy
process.platform
#
Added in: v0.1.16
<string>
The process.platform property returns a string identifying the operating system platform for which the Node.js binary was compiled.
Currently possible values are:
'aix'
'darwin'
'freebsd'
'linux'
'openbsd'
'sunos'
'win32'
const { platform } = require('node:process');

console.log(`This platform is ${platform}`);
copy
The value 'android' may also be returned if the Node.js is built on the Android operating system. However, Android support in Node.js is experimental.
process.ppid
#
Added in: v9.2.0, v8.10.0, v6.13.0
<integer>
The process.ppid property returns the PID of the parent of the current process.
const { ppid } = require('node:process');

console.log(`The parent process is pid ${ppid}`);
copy
process.ref(maybeRefable)
#
Added in: v23.6.0, v22.14.0
Stability: 1 - Experimental
maybeRefable <any> An object that may be "refable".
An object is "refable" if it implements the Node.js "Refable protocol". Specifically, this means that the object implements the Symbol.for('nodejs.ref') and Symbol.for('nodejs.unref') methods. "Ref'd" objects will keep the Node.js event loop alive, while "unref'd" objects will not. Historically, this was implemented by using ref() and unref() methods directly on the objects. This pattern, however, is being deprecated in favor of the "Refable protocol" in order to better support Web Platform API types whose APIs cannot be modified to add ref() and unref() methods but still need to support that behavior.
process.release
#
History













<Object>
The process.release property returns an Object containing metadata related to the current release, including URLs for the source tarball and headers-only tarball.
process.release contains the following properties:
name <string> A value that will always be 'node'.
sourceUrl <string> an absolute URL pointing to a .tar.gz file containing the source code of the current release.
headersUrl<string> an absolute URL pointing to a .tar.gz file containing only the source header files for the current release. This file is significantly smaller than the full source file and can be used for compiling Node.js native add-ons.
libUrl <string> | <undefined> an absolute URL pointing to a node.lib file matching the architecture and version of the current release. This file is used for compiling Node.js native add-ons. This property is only present on Windows builds of Node.js and will be missing on all other platforms.
lts <string> | <undefined> a string label identifying the LTS label for this release. This property only exists for LTS releases and is undefined for all other release types, including Current releases. Valid values include the LTS Release code names (including those that are no longer supported).
'Fermium' for the 14.x LTS line beginning with 14.15.0.
'Gallium' for the 16.x LTS line beginning with 16.13.0.
'Hydrogen' for the 18.x LTS line beginning with 18.12.0. For other LTS Release code names, see Node.js Changelog Archive
{
  name: 'node',
  lts: 'Hydrogen',
  sourceUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0.tar.gz',
  headersUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0-headers.tar.gz',
  libUrl: 'https://nodejs.org/download/release/v18.12.0/win-x64/node.lib'
}
copy
In custom builds from non-release versions of the source tree, only the name property may be present. The additional properties should not be relied upon to exist.
process.report
#
History













<Object>
process.report is an object whose methods are used to generate diagnostic reports for the current process. Additional documentation is available in the report documentation.
process.report.compact
#
Added in: v13.12.0, v12.17.0
<boolean>
Write reports in a compact format, single-line JSON, more easily consumable by log processing systems than the default multi-line format designed for human consumption.
const { report } = require('node:process');

console.log(`Reports are compact? ${report.compact}`);
copy
process.report.directory
#
History













<string>
Directory where the report is written. The default value is the empty string, indicating that reports are written to the current working directory of the Node.js process.
const { report } = require('node:process');

console.log(`Report directory is ${report.directory}`);
copy
process.report.filename
#
History













<string>
Filename where the report is written. If set to the empty string, the output filename will be comprised of a timestamp, PID, and sequence number. The default value is the empty string.
If the value of process.report.filename is set to 'stdout' or 'stderr', the report is written to the stdout or stderr of the process respectively.
const { report } = require('node:process');

console.log(`Report filename is ${report.filename}`);
copy
process.report.getReport([err])
#
History













err <Error> A custom error used for reporting the JavaScript stack.
Returns: <Object>
Returns a JavaScript Object representation of a diagnostic report for the running process. The report's JavaScript stack trace is taken from err, if present.
const { report } = require('node:process');
const util = require('node:util');

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Similar to process.report.writeReport()
const fs = require('node:fs');
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
copy
Additional documentation is available in the report documentation.
process.report.reportOnFatalError
#
History













<boolean>
If true, a diagnostic report is generated on fatal errors, such as out of memory errors or failed C++ assertions.
const { report } = require('node:process');

console.log(`Report on fatal error: ${report.reportOnFatalError}`);
copy
process.report.reportOnSignal
#
History













<boolean>
If true, a diagnostic report is generated when the process receives the signal specified by process.report.signal.
const { report } = require('node:process');

console.log(`Report on signal: ${report.reportOnSignal}`);
copy
process.report.reportOnUncaughtException
#
History













<boolean>
If true, a diagnostic report is generated on uncaught exception.
const { report } = require('node:process');

console.log(`Report on exception: ${report.reportOnUncaughtException}`);
copy
process.report.excludeEnv
#
Added in: v23.3.0, v22.13.0
<boolean>
If true, a diagnostic report is generated without the environment variables.
process.report.signal
#
History













<string>
The signal used to trigger the creation of a diagnostic report. Defaults to 'SIGUSR2'.
const { report } = require('node:process');

console.log(`Report signal: ${report.signal}`);
copy
process.report.writeReport([filename][, err])
#
History














filename <string> Name of the file where the report is written. This should be a relative path, that will be appended to the directory specified in process.report.directory, or the current working directory of the Node.js process, if unspecified.
err <Error> A custom error used for reporting the JavaScript stack.
Returns: <string> Returns the filename of the generated report.
Writes a diagnostic report to a file. If filename is not provided, the default filename includes the date, time, PID, and a sequence number. The report's JavaScript stack trace is taken from err, if present.
If the value of filename is set to 'stdout' or 'stderr', the report is written to the stdout or stderr of the process respectively.
const { report } = require('node:process');

report.writeReport();
copy
Additional documentation is available in the report documentation.
process.resourceUsage()
#
Added in: v12.6.0
Returns: <Object> the resource usage for the current process. All of these values come from the uv_getrusage call which returns a uv_rusage_t struct.
userCPUTime <integer> maps to ru_utime computed in microseconds. It is the same value as process.cpuUsage().user.
systemCPUTime <integer> maps to ru_stime computed in microseconds. It is the same value as process.cpuUsage().system.
maxRSS <integer> maps to ru_maxrss which is the maximum resident set size used in kilobytes.
sharedMemorySize <integer> maps to ru_ixrss but is not supported by any platform.
unsharedDataSize <integer> maps to ru_idrss but is not supported by any platform.
unsharedStackSize <integer> maps to ru_isrss but is not supported by any platform.
minorPageFault <integer> maps to ru_minflt which is the number of minor page faults for the process, see this article for more details.
majorPageFault <integer> maps to ru_majflt which is the number of major page faults for the process, see this article for more details. This field is not supported on Windows.
swappedOut <integer> maps to ru_nswap but is not supported by any platform.
fsRead <integer> maps to ru_inblock which is the number of times the file system had to perform input.
fsWrite <integer> maps to ru_oublock which is the number of times the file system had to perform output.
ipcSent <integer> maps to ru_msgsnd but is not supported by any platform.
ipcReceived <integer> maps to ru_msgrcv but is not supported by any platform.
signalsCount <integer> maps to ru_nsignals but is not supported by any platform.
voluntaryContextSwitches <integer> maps to ru_nvcsw which is the number of times a CPU context switch resulted due to a process voluntarily giving up the processor before its time slice was completed (usually to await availability of a resource). This field is not supported on Windows.
involuntaryContextSwitches <integer> maps to ru_nivcsw which is the number of times a CPU context switch resulted due to a higher priority process becoming runnable or because the current process exceeded its time slice. This field is not supported on Windows.
const { resourceUsage } = require('node:process');

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
copy
process.send(message[, sendHandle[, options]][, callback])
#
Added in: v0.5.9
message <Object>
sendHandle <net.Server> | <net.Socket>
options <Object> used to parameterize the sending of certain types of handles.options supports the following properties:
keepOpen <boolean> A value that can be used when passing instances of net.Socket. When true, the socket is kept open in the sending process. Default: false.
callback <Function>
Returns: <boolean>
If Node.js is spawned with an IPC channel, the process.send() method can be used to send messages to the parent process. Messages will be received as a 'message' event on the parent's ChildProcess object.
If Node.js was not spawned with an IPC channel, process.send will be undefined.
The message goes through serialization and parsing. The resulting message might not be the same as what is originally sent.
process.setegid(id)
#
Added in: v2.0.0
id <string> | <number> A group name or ID
The process.setegid() method sets the effective group identity of the process. (See setegid(2).) The id can be passed as either a numeric ID or a group name string. If a group name is specified, this method blocks while resolving the associated a numeric ID.
const process = require('node:process');

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
copy
This function is only available on POSIX platforms (i.e. not Windows or Android). This feature is not available in Worker threads.
process.seteuid(id)
#
Added in: v2.0.0
id <string> | <number> A user name or ID
The process.seteuid() method sets the effective user identity of the process. (See seteuid(2).) The id can be passed as either a numeric ID or a username string. If a username is specified, the method blocks while resolving the associated numeric ID.
const process = require('node:process');

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
copy
This function is only available on POSIX platforms (i.e. not Windows or Android). This feature is not available in Worker threads.
process.setgid(id)
#
Added in: v0.1.31
id <string> | <number> The group name or ID
The process.setgid() method sets the group identity of the process. (See setgid(2).) The id can be passed as either a numeric ID or a group name string. If a group name is specified, this method blocks while resolving the associated numeric ID.
const process = require('node:process');

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
copy
This function is only available on POSIX platforms (i.e. not Windows or Android). This feature is not available in Worker threads.
process.setgroups(groups)
#
Added in: v0.9.4
groups <integer[]>
The process.setgroups() method sets the supplementary group IDs for the Node.js process. This is a privileged operation that requires the Node.js process to have root or the CAP_SETGID capability.
The groups array can contain numeric group IDs, group names, or both.
const process = require('node:process');

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
copy
This function is only available on POSIX platforms (i.e. not Windows or Android). This feature is not available in Worker threads.
process.setuid(id)
#
Added in: v0.1.28
id <integer> | <string>
The process.setuid(id) method sets the user identity of the process. (See setuid(2).) The id can be passed as either a numeric ID or a username string. If a username is specified, the method blocks while resolving the associated numeric ID.
const process = require('node:process');

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
copy
This function is only available on POSIX platforms (i.e. not Windows or Android). This feature is not available in Worker threads.
process.setSourceMapsEnabled(val)
#
Added in: v16.6.0, v14.18.0
Stability: 1 - Experimental: Use module.setSourceMapsSupport() instead.
val <boolean>
This function enables or disables the Source Map support for stack traces.
It provides same features as launching Node.js process with commandline options --enable-source-maps.
Only source maps in JavaScript files that are loaded after source maps has been enabled will be parsed and loaded.
This implies calling module.setSourceMapsSupport() with an option { nodeModules: true, generatedCode: true }.
process.setUncaughtExceptionCaptureCallback(fn)
#
Added in: v9.3.0
fn <Function> | <null>
The process.setUncaughtExceptionCaptureCallback() function sets a function that will be invoked when an uncaught exception occurs, which will receive the exception value itself as its first argument.
If such a function is set, the 'uncaughtException' event will not be emitted. If --abort-on-uncaught-exception was passed from the command line or set through v8.setFlagsFromString(), the process will not abort. Actions configured to take place on exceptions such as report generations will be affected too
To unset the capture function, process.setUncaughtExceptionCaptureCallback(null) may be used. Calling this method with a non-null argument while another capture function is set will throw an error.
Using this function is mutually exclusive with using the deprecated domain built-in module.
process.sourceMapsEnabled
#
Added in: v20.7.0, v18.19.0
Stability: 1 - Experimental: Use module.getSourceMapsSupport() instead.
<boolean>
The process.sourceMapsEnabled property returns whether the Source Map support for stack traces is enabled.
process.stderr
#
<Stream>
The process.stderr property returns a stream connected to stderr (fd 2). It is a net.Socket (which is a Duplex stream) unless fd 2 refers to a file, in which case it is a Writable stream.
process.stderr differs from other Node.js streams in important ways. See note on process I/O for more information.
process.stderr.fd
#
<number>
This property refers to the value of underlying file descriptor of process.stderr. The value is fixed at 2. In Worker threads, this field does not exist.
process.stdin
#
<Stream>
The process.stdin property returns a stream connected to stdin (fd 0). It is a net.Socket (which is a Duplex stream) unless fd 0 refers to a file, in which case it is a Readable stream.
For details of how to read from stdin see readable.read().
As a Duplex stream, process.stdin can also be used in "old" mode that is compatible with scripts written for Node.js prior to v0.10. For more information see Stream compatibility.
In "old" streams mode the stdin stream is paused by default, so one must call process.stdin.resume() to read from it. Note also that calling process.stdin.resume() itself would switch stream to "old" mode.
process.stdin.fd
#
<number>
This property refers to the value of underlying file descriptor of process.stdin. The value is fixed at 0. In Worker threads, this field does not exist.
process.stdout
#
<Stream>
The process.stdout property returns a stream connected to stdout (fd 1). It is a net.Socket (which is a Duplex stream) unless fd 1 refers to a file, in which case it is a Writable stream.
For example, to copy process.stdin to process.stdout:
const { stdin, stdout } = require('node:process');

stdin.pipe(stdout);
copy
process.stdout differs from other Node.js streams in important ways. See note on process I/O for more information.
process.stdout.fd
#
<number>
This property refers to the value of underlying file descriptor of process.stdout. The value is fixed at 1. In Worker threads, this field does not exist.
A note on process I/O
#
process.stdout and process.stderr differ from other Node.js streams in important ways:
They are used internally by console.log() and console.error(), respectively.
Writes may be synchronous depending on what the stream is connected to and whether the system is Windows or POSIX:
Files: synchronous on Windows and POSIX
TTYs (Terminals): asynchronous on Windows, synchronous on POSIX
Pipes (and sockets): synchronous on Windows, asynchronous on POSIX
These behaviors are partly for historical reasons, as changing them would create backward incompatibility, but they are also expected by some users.
Synchronous writes avoid problems such as output written with console.log() or console.error() being unexpectedly interleaved, or not written at all if process.exit() is called before an asynchronous write completes. See process.exit() for more information.
Warning: Synchronous writes block the event loop until the write has completed. This can be near instantaneous in the case of output to a file, but under high system load, pipes that are not being read at the receiving end, or with slow terminals or file systems, it's possible for the event loop to be blocked often enough and long enough to have severe negative performance impacts. This may not be a problem when writing to an interactive terminal session, but consider this particularly careful when doing production logging to the process output streams.
To check if a stream is connected to a TTY context, check the isTTY property.
For instance:
$ node -p "Boolean(process.stdin.isTTY)"
true
$ echo "foo" | node -p "Boolean(process.stdin.isTTY)"
false
$ node -p "Boolean(process.stdout.isTTY)"
true
$ node -p "Boolean(process.stdout.isTTY)" | cat
false
copy
See the TTY documentation for more information.
process.throwDeprecation
#
Added in: v0.9.12
<boolean>
The initial value of process.throwDeprecation indicates whether the --throw-deprecation flag is set on the current Node.js process. process.throwDeprecation is mutable, so whether or not deprecation warnings result in errors may be altered at runtime. See the documentation for the 'warning' event and the emitWarning() method for more information.
$ node --throw-deprecation -p "process.throwDeprecation"
true
$ node -p "process.throwDeprecation"
undefined
$ node
> process.emitWarning('test', 'DeprecationWarning');
undefined
> (node:26598) DeprecationWarning: test
> process.throwDeprecation = true;
true
> process.emitWarning('test', 'DeprecationWarning');
Thrown:
[DeprecationWarning: test] { name: 'DeprecationWarning' }
copy
process.threadCpuUsage([previousValue])
#
Added in: v23.9.0
previousValue <Object> A previous return value from calling process.threadCpuUsage()
Returns: <Object>
user <integer>
system <integer>
The process.threadCpuUsage() method returns the user and system CPU time usage of the current worker thread, in an object with properties user and system, whose values are microsecond values (millionth of a second).
The result of a previous call to process.threadCpuUsage() can be passed as the argument to the function, to get a diff reading.
process.title
#
Added in: v0.1.104
<string>
The process.title property returns the current process title (i.e. returns the current value of ps). Assigning a new value to process.title modifies the current value of ps.
When a new value is assigned, different platforms will impose different maximum length restrictions on the title. Usually such restrictions are quite limited. For instance, on Linux and macOS, process.title is limited to the size of the binary name plus the length of the command-line arguments because setting the process.title overwrites the argv memory of the process. Node.js v0.8 allowed for longer process title strings by also overwriting the environ memory but that was potentially insecure and confusing in some (rather obscure) cases.
Assigning a value to process.title might not result in an accurate label within process manager applications such as macOS Activity Monitor or Windows Services Manager.
process.traceDeprecation
#
Added in: v0.8.0
<boolean>
The process.traceDeprecation property indicates whether the --trace-deprecation flag is set on the current Node.js process. See the documentation for the 'warning' event and the emitWarning() method for more information about this flag's behavior.
process.umask()
#
History













Stability: 0 - Deprecated. Calling process.umask() with no argument causes the process-wide umask to be written twice. This introduces a race condition between threads, and is a potential security vulnerability. There is no safe, cross-platform alternative API.
process.umask() returns the Node.js process's file mode creation mask. Child processes inherit the mask from the parent process.
process.umask(mask)
#
Added in: v0.1.19
mask <string> | <integer>
process.umask(mask) sets the Node.js process's file mode creation mask. Child processes inherit the mask from the parent process. Returns the previous mask.
const { umask } = require('node:process');

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
copy
In Worker threads, process.umask(mask) will throw an exception.
process.unref(maybeRefable)
#
Added in: v23.6.0, v22.14.0
Stability: 1 - Experimental
maybeUnfefable <any> An object that may be "unref'd".
An object is "unrefable" if it implements the Node.js "Refable protocol". Specifically, this means that the object implements the Symbol.for('nodejs.ref') and Symbol.for('nodejs.unref') methods. "Ref'd" objects will keep the Node.js event loop alive, while "unref'd" objects will not. Historically, this was implemented by using ref() and unref() methods directly on the objects. This pattern, however, is being deprecated in favor of the "Refable protocol" in order to better support Web Platform API types whose APIs cannot be modified to add ref() and unref() methods but still need to support that behavior.
process.uptime()
#
Added in: v0.5.0
Returns: <number>
The process.uptime() method returns the number of seconds the current Node.js process has been running.
The return value includes fractions of a second. Use Math.floor() to get whole seconds.
process.version
#
Added in: v0.1.3
<string>
The process.version property contains the Node.js version string.
const { version } = require('node:process');

console.log(`Version: ${version}`);
// Version: v14.8.0
copy
To get the version string without the prepended v, use process.versions.node.
process.versions
#
History

















<Object>
The process.versions property returns an object listing the version strings of Node.js and its dependencies. process.versions.modules indicates the current ABI version, which is increased whenever a C++ API changes. Node.js will refuse to load modules that were compiled against a different module ABI version.
const { versions } = require('node:process');

console.log(versions);
copy
Will generate an object similar to:
{ node: '23.0.0',
  acorn: '8.11.3',
  ada: '2.7.8',
  ares: '1.28.1',
  base64: '0.5.2',
  brotli: '1.1.0',
  cjs_module_lexer: '1.2.2',
  cldr: '45.0',
  icu: '75.1',
  llhttp: '9.2.1',
  modules: '127',
  napi: '9',
  nghttp2: '1.61.0',
  nghttp3: '0.7.0',
  ngtcp2: '1.3.0',
  openssl: '3.0.13+quic',
  simdjson: '3.8.0',
  simdutf: '5.2.4',
  sqlite: '3.46.0',
  tz: '2024a',
  undici: '6.13.0',
  unicode: '15.1',
  uv: '1.48.0',
  uvwasi: '0.0.20',
  v8: '12.4.254.14-node.11',
  zlib: '1.3.0.1-motley-7d77fb7' }
copy
Exit codes
#
Node.js will normally exit with a 0 status code when no more async operations are pending. The following status codes are used in other cases:
1 Uncaught Fatal Exception: There was an uncaught exception, and it was not handled by a domain or an 'uncaughtException' event handler.
2: Unused (reserved by Bash for builtin misuse)
3 Internal JavaScript Parse Error: The JavaScript source code internal in the Node.js bootstrapping process caused a parse error. This is extremely rare, and generally can only happen during development of Node.js itself.
4 Internal JavaScript Evaluation Failure: The JavaScript source code internal in the Node.js bootstrapping process failed to return a function value when evaluated. This is extremely rare, and generally can only happen during development of Node.js itself.
5 Fatal Error: There was a fatal unrecoverable error in V8. Typically a message will be printed to stderr with the prefix FATAL ERROR.
6 Non-function Internal Exception Handler: There was an uncaught exception, but the internal fatal exception handler function was somehow set to a non-function, and could not be called.
7 Internal Exception Handler Run-Time Failure: There was an uncaught exception, and the internal fatal exception handler function itself threw an error while attempting to handle it. This can happen, for example, if an 'uncaughtException' or domain.on('error') handler throws an error.
8: Unused. In previous versions of Node.js, exit code 8 sometimes indicated an uncaught exception.
9 Invalid Argument: Either an unknown option was specified, or an option requiring a value was provided without a value.
10 Internal JavaScript Run-Time Failure: The JavaScript source code internal in the Node.js bootstrapping process threw an error when the bootstrapping function was called. This is extremely rare, and generally can only happen during development of Node.js itself.
12 Invalid Debug Argument: The --inspect and/or --inspect-brk options were set, but the port number chosen was invalid or unavailable.
13 Unsettled Top-Level Await: await was used outside of a function in the top-level code, but the passed Promise never settled.
14 Snapshot Failure: Node.js was started to build a V8 startup snapshot and it failed because certain requirements of the state of the application were not met.
>128 Signal Exits: If Node.js receives a fatal signal such as SIGKILL or SIGHUP, then its exit code will be 128 plus the value of the signal code. This is a standard POSIX practice, since exit codes are defined to be 7-bit integers, and signal exits set the high-order bit, and then contain the value of the signal code. For example, signal SIGABRT has value 6, so the expected exit code will be 128 + 6, or 134.

# NodeJS Documentation 4

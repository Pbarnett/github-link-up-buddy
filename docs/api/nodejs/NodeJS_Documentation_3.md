# NodeJS Documentation 3
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Diagnostics Channel
Public API
Overview
diagnostics_channel.hasSubscribers(name)
diagnostics_channel.channel(name)
diagnostics_channel.subscribe(name, onMessage)
diagnostics_channel.unsubscribe(name, onMessage)
diagnostics_channel.tracingChannel(nameOrChannels)
Class: Channel
channel.hasSubscribers
channel.publish(message)
channel.subscribe(onMessage)
channel.unsubscribe(onMessage)
channel.bindStore(store[, transform])
channel.unbindStore(store)
channel.runStores(context, fn[, thisArg[, ...args]])
Class: TracingChannel
tracingChannel.subscribe(subscribers)
tracingChannel.unsubscribe(subscribers)
tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])
tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])
tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])
tracingChannel.hasSubscribers
TracingChannel Channels
start(event)
end(event)
asyncStart(event)
asyncEnd(event)
error(event)
Built-in Channels
Console
HTTP
HTTP/2
Modules
NET
UDP
Process
Worker Thread
Diagnostics Channel
#
History













Stability: 2 - Stable
Source Code: lib/diagnostics_channel.js
The node:diagnostics_channel module provides an API to create named channels to report arbitrary message data for diagnostics purposes.
It can be accessed using:
const diagnostics_channel = require('node:diagnostics_channel');
copy
It is intended that a module writer wanting to report diagnostics messages will create one or many top-level channels to report messages through. Channels may also be acquired at runtime but it is not encouraged due to the additional overhead of doing so. Channels may be exported for convenience, but as long as the name is known it can be acquired anywhere.
If you intend for your module to produce diagnostics data for others to consume it is recommended that you include documentation of what named channels are used along with the shape of the message data. Channel names should generally include the module name to avoid collisions with data from other modules.
Public API
#
Overview
#
Following is a simple overview of the public API.
const diagnostics_channel = require('node:diagnostics_channel');

// Get a reusable channel object
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

// Subscribe to the channel
diagnostics_channel.subscribe('my-channel', onMessage);

// Check if the channel has an active subscriber
if (channel.hasSubscribers) {
  // Publish data to the channel
  channel.publish({
    some: 'data',
  });
}

// Unsubscribe from the channel
diagnostics_channel.unsubscribe('my-channel', onMessage);
copy
diagnostics_channel.hasSubscribers(name)
#
Added in: v15.1.0, v14.17.0
name <string> | <symbol> The channel name
Returns: <boolean> If there are active subscribers
Check if there are active subscribers to the named channel. This is helpful if the message you want to send might be expensive to prepare.
This API is optional but helpful when trying to publish messages from very performance-sensitive code.
const diagnostics_channel = require('node:diagnostics_channel');

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // There are subscribers, prepare and publish message
}
copy
diagnostics_channel.channel(name)
#
Added in: v15.1.0, v14.17.0
name <string> | <symbol> The channel name
Returns: <Channel> The named channel object
This is the primary entry-point for anyone wanting to publish to a named channel. It produces a channel object which is optimized to reduce overhead at publish time as much as possible.
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');
copy
diagnostics_channel.subscribe(name, onMessage)
#
Added in: v18.7.0, v16.17.0
name <string> | <symbol> The channel name
onMessage <Function> The handler to receive channel messages
message <any> The message data
name <string> | <symbol> The name of the channel
Register a message handler to subscribe to this channel. This message handler will be run synchronously whenever a message is published to the channel. Any errors thrown in the message handler will trigger an 'uncaughtException'.
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Received data
});
copy
diagnostics_channel.unsubscribe(name, onMessage)
#
Added in: v18.7.0, v16.17.0
name <string> | <symbol> The channel name
onMessage <Function> The previous subscribed handler to remove
Returns: <boolean> true if the handler was found, false otherwise.
Remove a message handler previously registered to this channel with diagnostics_channel.subscribe(name, onMessage).
const diagnostics_channel = require('node:diagnostics_channel');

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
copy
diagnostics_channel.tracingChannel(nameOrChannels)
#
Added in: v19.9.0, v18.19.0
Stability: 1 - Experimental
nameOrChannels <string> | <TracingChannel> Channel name or object containing all the TracingChannel Channels
Returns: <TracingChannel> Collection of channels to trace with
Creates a TracingChannel wrapper for the given TracingChannel Channels. If a name is given, the corresponding tracing channels will be created in the form of tracing:${name}:${eventType} where eventType corresponds to the types of TracingChannel Channels.
const diagnostics_channel = require('node:diagnostics_channel');

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
copy
Class: Channel
#
Added in: v15.1.0, v14.17.0
The class Channel represents an individual named channel within the data pipeline. It is used to track subscribers and to publish messages when there are subscribers present. It exists as a separate object to avoid channel lookups at publish time, enabling very fast publish speeds and allowing for heavy use while incurring very minimal cost. Channels are created with diagnostics_channel.channel(name), constructing a channel directly with new Channel(name) is not supported.
channel.hasSubscribers
#
Added in: v15.1.0, v14.17.0
Returns: <boolean> If there are active subscribers
Check if there are active subscribers to this channel. This is helpful if the message you want to send might be expensive to prepare.
This API is optional but helpful when trying to publish messages from very performance-sensitive code.
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // There are subscribers, prepare and publish message
}
copy
channel.publish(message)
#
Added in: v15.1.0, v14.17.0
message <any> The message to send to the channel subscribers
Publish a message to any subscribers to the channel. This will trigger message handlers synchronously so they will execute within the same context.
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
copy
channel.subscribe(onMessage)
#
Added in: v15.1.0, v14.17.0Deprecated since: v18.7.0, v16.17.0
Stability: 0 - Deprecated: Use diagnostics_channel.subscribe(name, onMessage)
onMessage <Function> The handler to receive channel messages
message <any> The message data
name <string> | <symbol> The name of the channel
Register a message handler to subscribe to this channel. This message handler will be run synchronously whenever a message is published to the channel. Any errors thrown in the message handler will trigger an 'uncaughtException'.
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});
copy
channel.unsubscribe(onMessage)
#
History

















Stability: 0 - Deprecated: Use diagnostics_channel.unsubscribe(name, onMessage)
onMessage <Function> The previous subscribed handler to remove
Returns: <boolean> true if the handler was found, false otherwise.
Remove a message handler previously registered to this channel with channel.subscribe(onMessage).
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
copy
channel.bindStore(store[, transform])
#
Added in: v19.9.0, v18.19.0
Stability: 1 - Experimental
store <AsyncLocalStorage> The store to which to bind the context data
transform <Function> Transform context data before setting the store context
When channel.runStores(context, ...) is called, the given context data will be applied to any store bound to the channel. If the store has already been bound the previous transform function will be replaced with the new one. The transform function may be omitted to set the given context data as the context directly.
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
copy
channel.unbindStore(store)
#
Added in: v19.9.0, v18.19.0
Stability: 1 - Experimental
store <AsyncLocalStorage> The store to unbind from the channel.
Returns: <boolean> true if the store was found, false otherwise.
Remove a message handler previously registered to this channel with channel.bindStore(store).
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
copy
channel.runStores(context, fn[, thisArg[, ...args]])
#
Added in: v19.9.0, v18.19.0
Stability: 1 - Experimental
context <any> Message to send to subscribers and bind to stores
fn <Function> Handler to run within the entered storage context
thisArg <any> The receiver to be used for the function call.
...args <any> Optional arguments to pass to the function.
Applies the given data to any AsyncLocalStorage instances bound to the channel for the duration of the given function, then publishes to the channel within the scope of that data is applied to the stores.
If a transform function was given to channel.bindStore(store) it will be applied to transform the message data before it becomes the context value for the store. The prior storage context is accessible from within the transform function in cases where context linking is required.
The context applied to the store should be accessible in any async code which continues from execution which began during the given function, however there are some situations in which context loss may occur.
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
copy
Class: TracingChannel
#
Added in: v19.9.0, v18.19.0
Stability: 1 - Experimental
The class TracingChannel is a collection of TracingChannel Channels which together express a single traceable action. It is used to formalize and simplify the process of producing events for tracing application flow. diagnostics_channel.tracingChannel() is used to construct a TracingChannel. As with Channel it is recommended to create and reuse a single TracingChannel at the top-level of the file rather than creating them dynamically.
tracingChannel.subscribe(subscribers)
#
Added in: v19.9.0, v18.19.0
subscribers <Object> Set of TracingChannel Channels subscribers
start <Function> The start event subscriber
end <Function> The end event subscriber
asyncStart <Function> The asyncStart event subscriber
asyncEnd <Function> The asyncEnd event subscriber
error <Function> The error event subscriber
Helper to subscribe a collection of functions to the corresponding channels. This is the same as calling channel.subscribe(onMessage) on each channel individually.
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
copy
tracingChannel.unsubscribe(subscribers)
#
Added in: v19.9.0, v18.19.0
subscribers <Object> Set of TracingChannel Channels subscribers
start <Function> The start event subscriber
end <Function> The end event subscriber
asyncStart <Function> The asyncStart event subscriber
asyncEnd <Function> The asyncEnd event subscriber
error <Function> The error event subscriber
Returns: <boolean> true if all handlers were successfully unsubscribed, and false otherwise.
Helper to unsubscribe a collection of functions from the corresponding channels. This is the same as calling channel.unsubscribe(onMessage) on each channel individually.
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
copy
tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])
#
Added in: v19.9.0, v18.19.0
fn <Function> Function to wrap a trace around
context <Object> Shared object to correlate events through
thisArg <any> The receiver to be used for the function call
...args <any> Optional arguments to pass to the function
Returns: <any> The return value of the given function
Trace a synchronous function call. This will always produce a start event and end event around the execution and may produce an error event if the given function throws an error. This will run the given function using channel.runStores(context, ...) on the start channel which ensures all events should have any bound stores set to match this trace context.
To ensure only correct trace graphs are formed, events will only be published if subscribers are present prior to starting the trace. Subscriptions which are added after the trace begins will not receive future events from that trace, only future traces will be seen.
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
copy
tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])
#
Added in: v19.9.0, v18.19.0
fn <Function> Promise-returning function to wrap a trace around
context <Object> Shared object to correlate trace events through
thisArg <any> The receiver to be used for the function call
...args <any> Optional arguments to pass to the function
Returns: <Promise> Chained from promise returned by the given function
Trace a promise-returning function call. This will always produce a start event and end event around the synchronous portion of the function execution, and will produce an asyncStart event and asyncEnd event when a promise continuation is reached. It may also produce an error event if the given function throws an error or the returned promise rejects. This will run the given function using channel.runStores(context, ...) on the start channel which ensures all events should have any bound stores set to match this trace context.
To ensure only correct trace graphs are formed, events will only be published if subscribers are present prior to starting the trace. Subscriptions which are added after the trace begins will not receive future events from that trace, only future traces will be seen.
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
copy
tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])
#
Added in: v19.9.0, v18.19.0
fn <Function> callback using function to wrap a trace around
position <number> Zero-indexed argument position of expected callback (defaults to last argument if undefined is passed)
context <Object> Shared object to correlate trace events through (defaults to {} if undefined is passed)
thisArg <any> The receiver to be used for the function call
...args <any> arguments to pass to the function (must include the callback)
Returns: <any> The return value of the given function
Trace a callback-receiving function call. The callback is expected to follow the error as first arg convention typically used. This will always produce a start event and end event around the synchronous portion of the function execution, and will produce a asyncStart event and asyncEnd event around the callback execution. It may also produce an error event if the given function throws or the first argument passed to the callback is set. This will run the given function using channel.runStores(context, ...) on the start channel which ensures all events should have any bound stores set to match this trace context.
To ensure only correct trace graphs are formed, events will only be published if subscribers are present prior to starting the trace. Subscriptions which are added after the trace begins will not receive future events from that trace, only future traces will be seen.
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
copy
The callback will also be run with channel.runStores(context, ...) which enables context loss recovery in some cases.
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
copy
tracingChannel.hasSubscribers
#
Added in: v22.0.0, v20.13.0
Returns: <boolean> true if any of the individual channels has a subscriber, false if not.
This is a helper method available on a TracingChannel instance to check if any of the TracingChannel Channels have subscribers. A true is returned if any of them have at least one subscriber, a false is returned otherwise.
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
copy
TracingChannel Channels
#
A TracingChannel is a collection of several diagnostics_channels representing specific points in the execution lifecycle of a single traceable action. The behavior is split into five diagnostics_channels consisting of start, end, asyncStart, asyncEnd, and error. A single traceable action will share the same event object between all events, this can be helpful for managing correlation through a weakmap.
These event objects will be extended with result or error values when the task "completes". In the case of a synchronous task the result will be the return value and the error will be anything thrown from the function. With callback-based async functions the result will be the second argument of the callback while the error will either be a thrown error visible in the end event or the first callback argument in either of the asyncStart or asyncEnd events.
To ensure only correct trace graphs are formed, events should only be published if subscribers are present prior to starting the trace. Subscriptions which are added after the trace begins should not receive future events from that trace, only future traces will be seen.
Tracing channels should follow a naming pattern of:
tracing:module.class.method:start or tracing:module.function:start
tracing:module.class.method:end or tracing:module.function:end
tracing:module.class.method:asyncStart or tracing:module.function:asyncStart
tracing:module.class.method:asyncEnd or tracing:module.function:asyncEnd
tracing:module.class.method:error or tracing:module.function:error
start(event)
#
Name: tracing:${name}:start
The start event represents the point at which a function is called. At this point the event data may contain function arguments or anything else available at the very start of the execution of the function.
end(event)
#
Name: tracing:${name}:end
The end event represents the point at which a function call returns a value. In the case of an async function this is when the promise returned not when the function itself makes a return statement internally. At this point, if the traced function was synchronous the result field will be set to the return value of the function. Alternatively, the error field may be present to represent any thrown errors.
It is recommended to listen specifically to the error event to track errors as it may be possible for a traceable action to produce multiple errors. For example, an async task which fails may be started internally before the sync part of the task then throws an error.
asyncStart(event)
#
Name: tracing:${name}:asyncStart
The asyncStart event represents the callback or continuation of a traceable function being reached. At this point things like callback arguments may be available, or anything else expressing the "result" of the action.
For callbacks-based functions, the first argument of the callback will be assigned to the error field, if not undefined or null, and the second argument will be assigned to the result field.
For promises, the argument to the resolve path will be assigned to result or the argument to the reject path will be assign to error.
It is recommended to listen specifically to the error event to track errors as it may be possible for a traceable action to produce multiple errors. For example, an async task which fails may be started internally before the sync part of the task then throws an error.
asyncEnd(event)
#
Name: tracing:${name}:asyncEnd
The asyncEnd event represents the callback of an asynchronous function returning. It's not likely event data will change after the asyncStart event, however it may be useful to see the point where the callback completes.
error(event)
#
Name: tracing:${name}:error
The error event represents any error produced by the traceable function either synchronously or asynchronously. If an error is thrown in the synchronous portion of the traced function the error will be assigned to the error field of the event and the error event will be triggered. If an error is received asynchronously through a callback or promise rejection it will also be assigned to the error field of the event and trigger the error event.
It is possible for a single traceable function call to produce errors multiple times so this should be considered when consuming this event. For example, if another async task is triggered internally which fails and then the sync part of the function then throws and error two error events will be emitted, one for the sync error and one for the async error.
Built-in Channels
#
Console
#
Stability: 1 - Experimental
console.log
args <any[]>
Emitted when console.log() is called. Receives and array of the arguments passed to console.log().
console.info
args <any[]>
Emitted when console.info() is called. Receives and array of the arguments passed to console.info().
console.debug
args <any[]>
Emitted when console.debug() is called. Receives and array of the arguments passed to console.debug().
console.warn
args <any[]>
Emitted when console.warn() is called. Receives and array of the arguments passed to console.warn().
console.error
args <any[]>
Emitted when console.error() is called. Receives and array of the arguments passed to console.error().
HTTP
#
Stability: 1 - Experimental
http.client.request.created
request <http.ClientRequest>
Emitted when client creates a request object. Unlike http.client.request.start, this event is emitted before the request has been sent.
http.client.request.start
request <http.ClientRequest>
Emitted when client starts a request.
http.client.request.error
request <http.ClientRequest>
error <Error>
Emitted when an error occurs during a client request.
http.client.response.finish
request <http.ClientRequest>
response <http.IncomingMessage>
Emitted when client receives a response.
http.server.request.start
request <http.IncomingMessage>
response <http.ServerResponse>
socket <net.Socket>
server <http.Server>
Emitted when server receives a request.
http.server.response.created
request <http.IncomingMessage>
response <http.ServerResponse>
Emitted when server creates a response. The event is emitted before the response is sent.
http.server.response.finish
request <http.IncomingMessage>
response <http.ServerResponse>
socket <net.Socket>
server <http.Server>
Emitted when server sends a response.
HTTP/2
#
Stability: 1 - Experimental
http2.client.stream.created
stream <ClientHttp2Stream>
headers <HTTP/2 Headers Object>
Emitted when a stream is created on the client.
http2.client.stream.start
stream <ClientHttp2Stream>
headers <HTTP/2 Headers Object>
Emitted when a stream is started on the client.
http2.client.stream.error
stream <ClientHttp2Stream>
error <Error>
Emitted when an error occurs during the processing of a stream on the client.
http2.client.stream.finish
stream <ClientHttp2Stream>
headers <HTTP/2 Headers Object>
flags <number>
Emitted when a stream is received on the client.
http2.client.stream.close
stream <ClientHttp2Stream>
Emitted when a stream is closed on the client. The HTTP/2 error code used when closing the stream can be retrieved using the stream.rstCode property.
http2.server.stream.created
stream <ServerHttp2Stream>
headers <HTTP/2 Headers Object>
Emitted when a stream is created on the server.
http2.server.stream.start
stream <ServerHttp2Stream>
headers <HTTP/2 Headers Object>
Emitted when a stream is started on the server.
http2.server.stream.error
stream <ServerHttp2Stream>
error <Error>
Emitted when an error occurs during the processing of a stream on the server.
http2.server.stream.finish
stream <ServerHttp2Stream>
headers <HTTP/2 Headers Object>
flags <number>
Emitted when a stream is sent on the server.
http2.server.stream.close
stream <ServerHttp2Stream>
Emitted when a stream is closed on the server. The HTTP/2 error code used when closing the stream can be retrieved using the stream.rstCode property.
Modules
#
Stability: 1 - Experimental
module.require.start
event <Object> containing the following properties
id - Argument passed to require(). Module name.
parentFilename - Name of the module that attempted to require(id).
Emitted when require() is executed. See start event.
module.require.end
event <Object> containing the following properties
id - Argument passed to require(). Module name.
parentFilename - Name of the module that attempted to require(id).
Emitted when a require() call returns. See end event.
module.require.error
event <Object> containing the following properties
id - Argument passed to require(). Module name.
parentFilename - Name of the module that attempted to require(id).
error <Error>
Emitted when a require() throws an error. See error event.
module.import.asyncStart
event <Object> containing the following properties
id - Argument passed to import(). Module name.
parentURL - URL object of the module that attempted to import(id).
Emitted when import() is invoked. See asyncStart event.
module.import.asyncEnd
event <Object> containing the following properties
id - Argument passed to import(). Module name.
parentURL - URL object of the module that attempted to import(id).
Emitted when import() has completed. See asyncEnd event.
module.import.error
event <Object> containing the following properties
id - Argument passed to import(). Module name.
parentURL - URL object of the module that attempted to import(id).
error <Error>
Emitted when a import() throws an error. See error event.
NET
#
Stability: 1 - Experimental
net.client.socket
socket <net.Socket> | <tls.TLSSocket>
Emitted when a new TCP or pipe client socket connection is created.
net.server.socket
socket <net.Socket>
Emitted when a new TCP or pipe connection is received.
tracing:net.server.listen:asyncStart
server <net.Server>
options <Object>
Emitted when net.Server.listen() is invoked, before the port or pipe is actually setup.
tracing:net.server.listen:asyncEnd
server <net.Server>
Emitted when net.Server.listen() has completed and thus the server is ready to accept connection.
tracing:net.server.listen:error
server <net.Server>
error <Error>
Emitted when net.Server.listen() is returning an error.
UDP
#
Stability: 1 - Experimental
udp.socket
socket <dgram.Socket>
Emitted when a new UDP socket is created.
Process
#
Stability: 1 - Experimental
Added in: v16.18.0
child_process
process <ChildProcess>
Emitted when a new process is created.
execve
execPath <string>
args <string[]>
env <string[]>
Emitted when process.execve() is invoked.
Worker Thread
#
Stability: 1 - Experimental
Added in: v16.18.0
worker_threads
worker Worker
Emitted when a new thread is created.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
DNS
Class: dns.Resolver
Resolver([options])
resolver.cancel()
resolver.setLocalAddress([ipv4][, ipv6])
dns.getServers()
dns.lookup(hostname[, options], callback)
Supported getaddrinfo flags
dns.lookupService(address, port, callback)
dns.resolve(hostname[, rrtype], callback)
dns.resolve4(hostname[, options], callback)
dns.resolve6(hostname[, options], callback)
dns.resolveAny(hostname, callback)
dns.resolveCname(hostname, callback)
dns.resolveCaa(hostname, callback)
dns.resolveMx(hostname, callback)
dns.resolveNaptr(hostname, callback)
dns.resolveNs(hostname, callback)
dns.resolvePtr(hostname, callback)
dns.resolveSoa(hostname, callback)
dns.resolveSrv(hostname, callback)
dns.resolveTlsa(hostname, callback)
dns.resolveTxt(hostname, callback)
dns.reverse(ip, callback)
dns.setDefaultResultOrder(order)
dns.getDefaultResultOrder()
dns.setServers(servers)
DNS promises API
Class: dnsPromises.Resolver
resolver.cancel()
dnsPromises.getServers()
dnsPromises.lookup(hostname[, options])
dnsPromises.lookupService(address, port)
dnsPromises.resolve(hostname[, rrtype])
dnsPromises.resolve4(hostname[, options])
dnsPromises.resolve6(hostname[, options])
dnsPromises.resolveAny(hostname)
dnsPromises.resolveCaa(hostname)
dnsPromises.resolveCname(hostname)
dnsPromises.resolveMx(hostname)
dnsPromises.resolveNaptr(hostname)
dnsPromises.resolveNs(hostname)
dnsPromises.resolvePtr(hostname)
dnsPromises.resolveSoa(hostname)
dnsPromises.resolveSrv(hostname)
dnsPromises.resolveTlsa(hostname)
dnsPromises.resolveTxt(hostname)
dnsPromises.reverse(ip)
dnsPromises.setDefaultResultOrder(order)
dnsPromises.getDefaultResultOrder()
dnsPromises.setServers(servers)
Error codes
Implementation considerations
dns.lookup()
dns.resolve(), dns.resolve*(), and dns.reverse()
DNS
#
Stability: 2 - Stable
Source Code: lib/dns.js
The node:dns module enables name resolution. For example, use it to look up IP addresses of host names.
Although named for the Domain Name System (DNS), it does not always use the DNS protocol for lookups. dns.lookup() uses the operating system facilities to perform name resolution. It may not need to perform any network communication. To perform name resolution the way other applications on the same system do, use dns.lookup().
const dns = require('node:dns');

dns.lookup('example.org', (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family);
});
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
copy
All other functions in the node:dns module connect to an actual DNS server to perform name resolution. They will always use the network to perform DNS queries. These functions do not use the same set of configuration files used by dns.lookup() (e.g. /etc/hosts). Use these functions to always perform DNS queries, bypassing other name-resolution facilities.
const dns = require('node:dns');

dns.resolve4('archive.org', (err, addresses) => {
  if (err) throw err;

  console.log(`addresses: ${JSON.stringify(addresses)}`);

  addresses.forEach((a) => {
    dns.reverse(a, (err, hostnames) => {
      if (err) {
        throw err;
      }
      console.log(`reverse for ${a}: ${JSON.stringify(hostnames)}`);
    });
  });
});
copy
See the Implementation considerations section for more information.
Class: dns.Resolver
#
Added in: v8.3.0
An independent resolver for DNS requests.
Creating a new resolver uses the default server settings. Setting the servers used for a resolver using resolver.setServers() does not affect other resolvers:
const { Resolver } = require('node:dns');
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// This request will use the server at 4.4.4.4, independent of global settings.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
copy
The following methods from the node:dns module are available:
resolver.getServers()
resolver.resolve()
resolver.resolve4()
resolver.resolve6()
resolver.resolveAny()
resolver.resolveCaa()
resolver.resolveCname()
resolver.resolveMx()
resolver.resolveNaptr()
resolver.resolveNs()
resolver.resolvePtr()
resolver.resolveSoa()
resolver.resolveSrv()
resolver.resolveTlsa()
resolver.resolveTxt()
resolver.reverse()
resolver.setServers()
Resolver([options])
#
History

















Create a new resolver.
options <Object>
timeout <integer> Query timeout in milliseconds, or -1 to use the default timeout.
tries <integer> The number of tries the resolver will try contacting each name server before giving up. Default: 4
resolver.cancel()
#
Added in: v8.3.0
Cancel all outstanding DNS queries made by this resolver. The corresponding callbacks will be called with an error with code ECANCELLED.
resolver.setLocalAddress([ipv4][, ipv6])
#
Added in: v15.1.0, v14.17.0
ipv4 <string> A string representation of an IPv4 address. Default: '0.0.0.0'
ipv6 <string> A string representation of an IPv6 address. Default: '::0'
The resolver instance will send its requests from the specified IP address. This allows programs to specify outbound interfaces when used on multi-homed systems.
If a v4 or v6 address is not specified, it is set to the default and the operating system will choose a local address automatically.
The resolver will use the v4 local address when making requests to IPv4 DNS servers, and the v6 local address when making requests to IPv6 DNS servers. The rrtype of resolution requests has no impact on the local address used.
dns.getServers()
#
Added in: v0.11.3
Returns: <string[]>
Returns an array of IP address strings, formatted according to RFC 5952, that are currently configured for DNS resolution. A string will include a port section if a custom port is used.
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
copy
dns.lookup(hostname[, options], callback)
#
History

































hostname <string>
options <integer> | <Object>
family <integer> | <string> The record family. Must be 4, 6, or 0. For backward compatibility reasons,'IPv4' and 'IPv6' are interpreted as 4 and 6 respectively. The value 0 indicates that either an IPv4 or IPv6 address is returned. If the value 0 is used with { all: true } (see below), either one of or both IPv4 and IPv6 addresses are returned, depending on the system's DNS resolver. Default: 0.
hints <number> One or more supported getaddrinfo flags. Multiple flags may be passed by bitwise ORing their values.
all <boolean> When true, the callback returns all resolved addresses in an array. Otherwise, returns a single address. Default: false.
order <string> When verbatim, the resolved addresses are return unsorted. When ipv4first, the resolved addresses are sorted by placing IPv4 addresses before IPv6 addresses. When ipv6first, the resolved addresses are sorted by placing IPv6 addresses before IPv4 addresses. Default: verbatim (addresses are not reordered). Default value is configurable using dns.setDefaultResultOrder() or --dns-result-order.
verbatim <boolean> When true, the callback receives IPv4 and IPv6 addresses in the order the DNS resolver returned them. When false, IPv4 addresses are placed before IPv6 addresses. This option will be deprecated in favor of order. When both are specified, order has higher precedence. New code should only use order. Default: true (addresses are not reordered). Default value is configurable using dns.setDefaultResultOrder() or --dns-result-order.
callback <Function>
err <Error>
address <string> A string representation of an IPv4 or IPv6 address.
family <integer> 4 or 6, denoting the family of address, or 0 if the address is not an IPv4 or IPv6 address. 0 is a likely indicator of a bug in the name resolution service used by the operating system.
Resolves a host name (e.g. 'nodejs.org') into the first found A (IPv4) or AAAA (IPv6) record. All option properties are optional. If options is an integer, then it must be 4 or 6 – if options is not provided, then either IPv4 or IPv6 addresses, or both, are returned if found.
With the all option set to true, the arguments for callback change to (err, addresses), with addresses being an array of objects with the properties address and family.
On error, err is an Error object, where err.code is the error code. Keep in mind that err.code will be set to 'ENOTFOUND' not only when the host name does not exist but also when the lookup fails in other ways such as no available file descriptors.
dns.lookup() does not necessarily have anything to do with the DNS protocol. The implementation uses an operating system facility that can associate names with addresses and vice versa. This implementation can have subtle but important consequences on the behavior of any Node.js program. Please take some time to consult the Implementation considerations section before using dns.lookup().
Example usage:
const dns = require('node:dns');
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
dns.lookup('example.org', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family));
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6

// When options.all is true, the result will be an Array.
options.all = true;
dns.lookup('example.org', options, (err, addresses) =>
  console.log('addresses: %j', addresses));
// addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
copy
If this method is invoked as its util.promisify()ed version, and all is not set to true, it returns a Promise for an Object with address and family properties.
Supported getaddrinfo flags
#
History









The following flags can be passed as hints to dns.lookup().
dns.ADDRCONFIG: Limits returned address types to the types of non-loopback addresses configured on the system. For example, IPv4 addresses are only returned if the current system has at least one IPv4 address configured.
dns.V4MAPPED: If the IPv6 family was specified, but no IPv6 addresses were found, then return IPv4 mapped IPv6 addresses. It is not supported on some operating systems (e.g. FreeBSD 10.1).
dns.ALL: If dns.V4MAPPED is specified, return resolved IPv6 addresses as well as IPv4 mapped IPv6 addresses.
dns.lookupService(address, port, callback)
#
History













address <string>
port <number>
callback <Function>
err <Error>
hostname <string> e.g. example.com
service <string> e.g. http
Resolves the given address and port into a host name and service using the operating system's underlying getnameinfo implementation.
If address is not a valid IP address, a TypeError will be thrown. The port will be coerced to a number. If it is not a legal port, a TypeError will be thrown.
On an error, err is an Error object, where err.code is the error code.
const dns = require('node:dns');
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
  console.log(hostname, service);
  // Prints: localhost ssh
});
copy
If this method is invoked as its util.promisify()ed version, it returns a Promise for an Object with hostname and service properties.
dns.resolve(hostname[, rrtype], callback)
#
History













hostname <string> Host name to resolve.
rrtype <string> Resource record type. Default: 'A'.
callback <Function>
err <Error>
records <string[]> | <Object[]> | <Object>
Uses the DNS protocol to resolve a host name (e.g. 'nodejs.org') into an array of the resource records. The callback function has arguments (err, records). When successful, records will be an array of resource records. The type and structure of individual results varies based on rrtype:
rrtype
records contains
Result type
Shorthand method
'A'
IPv4 addresses (default)
<string>
dns.resolve4()
'AAAA'
IPv6 addresses
<string>
dns.resolve6()
'ANY'
any records
<Object>
dns.resolveAny()
'CAA'
CA authorization records
<Object>
dns.resolveCaa()
'CNAME'
canonical name records
<string>
dns.resolveCname()
'MX'
mail exchange records
<Object>
dns.resolveMx()
'NAPTR'
name authority pointer records
<Object>
dns.resolveNaptr()
'NS'
name server records
<string>
dns.resolveNs()
'PTR'
pointer records
<string>
dns.resolvePtr()
'SOA'
start of authority records
<Object>
dns.resolveSoa()
'SRV'
service records
<Object>
dns.resolveSrv()
'TLSA'
certificate associations
<Object>
dns.resolveTlsa()
'TXT'
text records
<string[]>
dns.resolveTxt()

On error, err is an Error object, where err.code is one of the DNS error codes.
dns.resolve4(hostname[, options], callback)
#
History

















hostname <string> Host name to resolve.
options <Object>
ttl <boolean> Retrieves the Time-To-Live value (TTL) of each record. When true, the callback receives an array of { address: '1.2.3.4', ttl: 60 } objects rather than an array of strings, with the TTL expressed in seconds.
callback <Function>
err <Error>
addresses <string[]> | <Object[]>
Uses the DNS protocol to resolve a IPv4 addresses (A records) for the hostname. The addresses argument passed to the callback function will contain an array of IPv4 addresses (e.g. ['74.125.79.104', '74.125.79.105', '74.125.79.106']).
dns.resolve6(hostname[, options], callback)
#
History

















hostname <string> Host name to resolve.
options <Object>
ttl <boolean> Retrieve the Time-To-Live value (TTL) of each record. When true, the callback receives an array of { address: '0:1:2:3:4:5:6:7', ttl: 60 } objects rather than an array of strings, with the TTL expressed in seconds.
callback <Function>
err <Error>
addresses <string[]> | <Object[]>
Uses the DNS protocol to resolve IPv6 addresses (AAAA records) for the hostname. The addresses argument passed to the callback function will contain an array of IPv6 addresses.
dns.resolveAny(hostname, callback)
#
History









hostname <string>
callback <Function>
err <Error>
ret <Object[]>
Uses the DNS protocol to resolve all records (also known as ANY or * query). The ret argument passed to the callback function will be an array containing various types of records. Each object has a property type that indicates the type of the current record. And depending on the type, additional properties will be present on the object:
Type
Properties
'A'
address/ttl
'AAAA'
address/ttl
'CNAME'
value
'MX'
Refer to dns.resolveMx()
'NAPTR'
Refer to dns.resolveNaptr()
'NS'
value
'PTR'
value
'SOA'
Refer to dns.resolveSoa()
'SRV'
Refer to dns.resolveSrv()
'TLSA'
Refer to dns.resolveTlsa()
'TXT'
This type of record contains an array property called entries which refers to dns.resolveTxt(), e.g. { entries: ['...'], type: 'TXT' }

Here is an example of the ret object passed to the callback:
[ { type: 'A', address: '127.0.0.1', ttl: 299 },
  { type: 'CNAME', value: 'example.com' },
  { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
  { type: 'NS', value: 'ns1.example.com' },
  { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
  { type: 'SOA',
    nsname: 'ns1.example.com',
    hostmaster: 'admin.example.com',
    serial: 156696742,
    refresh: 900,
    retry: 900,
    expire: 1800,
    minttl: 60 } ]
copy
DNS server operators may choose not to respond to ANY queries. It may be better to call individual methods like dns.resolve4(), dns.resolveMx(), and so on. For more details, see RFC 8482.
dns.resolveCname(hostname, callback)
#
History













hostname <string>
callback <Function>
err <Error>
addresses <string[]>
Uses the DNS protocol to resolve CNAME records for the hostname. The addresses argument passed to the callback function will contain an array of canonical name records available for the hostname (e.g. ['bar.example.com']).
dns.resolveCaa(hostname, callback)
#
History













hostname <string>
callback <Function>
err <Error>
records <Object[]>
Uses the DNS protocol to resolve CAA records for the hostname. The addresses argument passed to the callback function will contain an array of certification authority authorization records available for the hostname (e.g. [{critical: 0, iodef: 'mailto:pki@example.com'}, {critical: 128, issue: 'pki.example.com'}]).
dns.resolveMx(hostname, callback)
#
History













hostname <string>
callback <Function>
err <Error>
addresses <Object[]>
Uses the DNS protocol to resolve mail exchange records (MX records) for the hostname. The addresses argument passed to the callback function will contain an array of objects containing both a priority and exchange property (e.g. [{priority: 10, exchange: 'mx.example.com'}, ...]).
dns.resolveNaptr(hostname, callback)
#
History













hostname <string>
callback <Function>
err <Error>
addresses <Object[]>
Uses the DNS protocol to resolve regular expression-based records (NAPTR records) for the hostname. The addresses argument passed to the callback function will contain an array of objects with the following properties:
flags
service
regexp
replacement
order
preference
{
  flags: 's',
  service: 'SIP+D2U',
  regexp: '',
  replacement: '_sip._udp.example.com',
  order: 30,
  preference: 100
}
copy
dns.resolveNs(hostname, callback)
#
History













hostname <string>
callback <Function>
err <Error>
addresses <string[]>
Uses the DNS protocol to resolve name server records (NS records) for the hostname. The addresses argument passed to the callback function will contain an array of name server records available for hostname (e.g. ['ns1.example.com', 'ns2.example.com']).
dns.resolvePtr(hostname, callback)
#
History













hostname <string>
callback <Function>
err <Error>
addresses <string[]>
Uses the DNS protocol to resolve pointer records (PTR records) for the hostname. The addresses argument passed to the callback function will be an array of strings containing the reply records.
dns.resolveSoa(hostname, callback)
#
History













hostname <string>
callback <Function>
err <Error>
address <Object>
Uses the DNS protocol to resolve a start of authority record (SOA record) for the hostname. The address argument passed to the callback function will be an object with the following properties:
nsname
hostmaster
serial
refresh
retry
expire
minttl
{
  nsname: 'ns.example.com',
  hostmaster: 'root.example.com',
  serial: 2013101809,
  refresh: 10000,
  retry: 2400,
  expire: 604800,
  minttl: 3600
}
copy
dns.resolveSrv(hostname, callback)
#
History













hostname <string>
callback <Function>
err <Error>
addresses <Object[]>
Uses the DNS protocol to resolve service records (SRV records) for the hostname. The addresses argument passed to the callback function will be an array of objects with the following properties:
priority
weight
port
name
{
  priority: 10,
  weight: 5,
  port: 21223,
  name: 'service.example.com'
}
copy
dns.resolveTlsa(hostname, callback)
#
Added in: v23.9.0, v22.15.0
hostname <string>
callback <Function>
err <Error>
records <Object[]>
Uses the DNS protocol to resolve certificate associations (TLSA records) for the hostname. The records argument passed to the callback function is an array of objects with these properties:
certUsage
selector
match
data
{
  certUsage: 3,
  selector: 1,
  match: 1,
  data: [ArrayBuffer]
}
copy
dns.resolveTxt(hostname, callback)
#
History













hostname <string>
callback <Function>
err <Error>
records <string[][]>
Uses the DNS protocol to resolve text queries (TXT records) for the hostname. The records argument passed to the callback function is a two-dimensional array of the text records available for hostname (e.g. [ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]). Each sub-array contains TXT chunks of one record. Depending on the use case, these could be either joined together or treated separately.
dns.reverse(ip, callback)
#
Added in: v0.1.16
ip <string>
callback <Function>
err <Error>
hostnames <string[]>
Performs a reverse DNS query that resolves an IPv4 or IPv6 address to an array of host names.
On error, err is an Error object, where err.code is one of the DNS error codes.
dns.setDefaultResultOrder(order)
#
History

















order <string> must be 'ipv4first', 'ipv6first' or 'verbatim'.
Set the default value of order in dns.lookup() and dnsPromises.lookup(). The value could be:
ipv4first: sets default order to ipv4first.
ipv6first: sets default order to ipv6first.
verbatim: sets default order to verbatim.
The default is verbatim and dns.setDefaultResultOrder() have higher priority than --dns-result-order. When using worker threads, dns.setDefaultResultOrder() from the main thread won't affect the default dns orders in workers.
dns.getDefaultResultOrder()
#
History













Get the default value for order in dns.lookup() and dnsPromises.lookup(). The value could be:
ipv4first: for order defaulting to ipv4first.
ipv6first: for order defaulting to ipv6first.
verbatim: for order defaulting to verbatim.
dns.setServers(servers)
#
Added in: v0.11.3
servers <string[]> array of RFC 5952 formatted addresses
Sets the IP address and port of servers to be used when performing DNS resolution. The servers argument is an array of RFC 5952 formatted addresses. If the port is the IANA default DNS port (53) it can be omitted.
dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
copy
An error will be thrown if an invalid address is provided.
The dns.setServers() method must not be called while a DNS query is in progress.
The dns.setServers() method affects only dns.resolve(), dns.resolve*() and dns.reverse() (and specifically not dns.lookup()).
This method works much like resolve.conf. That is, if attempting to resolve with the first server provided results in a NOTFOUND error, the resolve() method will not attempt to resolve with subsequent servers provided. Fallback DNS servers will only be used if the earlier ones time out or result in some other error.
DNS promises API
#
History

















The dns.promises API provides an alternative set of asynchronous DNS methods that return Promise objects rather than using callbacks. The API is accessible via require('node:dns').promises or require('node:dns/promises').
Class: dnsPromises.Resolver
#
Added in: v10.6.0
An independent resolver for DNS requests.
Creating a new resolver uses the default server settings. Setting the servers used for a resolver using resolver.setServers() does not affect other resolvers:
const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// This request will use the server at 4.4.4.4, independent of global settings.
resolver.resolve4('example.org').then((addresses) => {
  // ...
});

// Alternatively, the same code can be written using async-await style.
(async function() {
  const addresses = await resolver.resolve4('example.org');
})();
copy
The following methods from the dnsPromises API are available:
resolver.getServers()
resolver.resolve()
resolver.resolve4()
resolver.resolve6()
resolver.resolveAny()
resolver.resolveCaa()
resolver.resolveCname()
resolver.resolveMx()
resolver.resolveNaptr()
resolver.resolveNs()
resolver.resolvePtr()
resolver.resolveSoa()
resolver.resolveSrv()
resolver.resolveTlsa()
resolver.resolveTxt()
resolver.reverse()
resolver.setServers()
resolver.cancel()
#
Added in: v15.3.0, v14.17.0
Cancel all outstanding DNS queries made by this resolver. The corresponding promises will be rejected with an error with the code ECANCELLED.
dnsPromises.getServers()
#
Added in: v10.6.0
Returns: <string[]>
Returns an array of IP address strings, formatted according to RFC 5952, that are currently configured for DNS resolution. A string will include a port section if a custom port is used.
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
copy
dnsPromises.lookup(hostname[, options])
#
History













hostname <string>
options <integer> | <Object>
family <integer> The record family. Must be 4, 6, or 0. The value 0 indicates that either an IPv4 or IPv6 address is returned. If the value 0 is used with { all: true } (see below), either one of or both IPv4 and IPv6 addresses are returned, depending on the system's DNS resolver. Default: 0.
hints <number> One or more supported getaddrinfo flags. Multiple flags may be passed by bitwise ORing their values.
all <boolean> When true, the Promise is resolved with all addresses in an array. Otherwise, returns a single address. Default: false.
order <string> When verbatim, the Promise is resolved with IPv4 and IPv6 addresses in the order the DNS resolver returned them. When ipv4first, IPv4 addresses are placed before IPv6 addresses. When ipv6first, IPv6 addresses are placed before IPv4 addresses. Default: verbatim (addresses are not reordered). Default value is configurable using dns.setDefaultResultOrder() or --dns-result-order. New code should use { order: 'verbatim' }.
verbatim <boolean> When true, the Promise is resolved with IPv4 and IPv6 addresses in the order the DNS resolver returned them. When false, IPv4 addresses are placed before IPv6 addresses. This option will be deprecated in favor of order. When both are specified, order has higher precedence. New code should only use order. Default: currently false (addresses are reordered) but this is expected to change in the not too distant future. Default value is configurable using dns.setDefaultResultOrder() or --dns-result-order.
Resolves a host name (e.g. 'nodejs.org') into the first found A (IPv4) or AAAA (IPv6) record. All option properties are optional. If options is an integer, then it must be 4 or 6 – if options is not provided, then either IPv4 or IPv6 addresses, or both, are returned if found.
With the all option set to true, the Promise is resolved with addresses being an array of objects with the properties address and family.
On error, the Promise is rejected with an Error object, where err.code is the error code. Keep in mind that err.code will be set to 'ENOTFOUND' not only when the host name does not exist but also when the lookup fails in other ways such as no available file descriptors.
dnsPromises.lookup() does not necessarily have anything to do with the DNS protocol. The implementation uses an operating system facility that can associate names with addresses and vice versa. This implementation can have subtle but important consequences on the behavior of any Node.js program. Please take some time to consult the Implementation considerations section before using dnsPromises.lookup().
Example usage:
const dns = require('node:dns');
const dnsPromises = dns.promises;
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

dnsPromises.lookup('example.org', options).then((result) => {
  console.log('address: %j family: IPv%s', result.address, result.family);
  // address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
});

// When options.all is true, the result will be an Array.
options.all = true;
dnsPromises.lookup('example.org', options).then((result) => {
  console.log('addresses: %j', result);
  // addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
});
copy
dnsPromises.lookupService(address, port)
#
Added in: v10.6.0
address <string>
port <number>
Resolves the given address and port into a host name and service using the operating system's underlying getnameinfo implementation.
If address is not a valid IP address, a TypeError will be thrown. The port will be coerced to a number. If it is not a legal port, a TypeError will be thrown.
On error, the Promise is rejected with an Error object, where err.code is the error code.
const dnsPromises = require('node:dns').promises;
dnsPromises.lookupService('127.0.0.1', 22).then((result) => {
  console.log(result.hostname, result.service);
  // Prints: localhost ssh
});
copy
dnsPromises.resolve(hostname[, rrtype])
#
Added in: v10.6.0
hostname <string> Host name to resolve.
rrtype <string> Resource record type. Default: 'A'.
Uses the DNS protocol to resolve a host name (e.g. 'nodejs.org') into an array of the resource records. When successful, the Promise is resolved with an array of resource records. The type and structure of individual results vary based on rrtype:
rrtype
records contains
Result type
Shorthand method
'A'
IPv4 addresses (default)
<string>
dnsPromises.resolve4()
'AAAA'
IPv6 addresses
<string>
dnsPromises.resolve6()
'ANY'
any records
<Object>
dnsPromises.resolveAny()
'CAA'
CA authorization records
<Object>
dnsPromises.resolveCaa()
'CNAME'
canonical name records
<string>
dnsPromises.resolveCname()
'MX'
mail exchange records
<Object>
dnsPromises.resolveMx()
'NAPTR'
name authority pointer records
<Object>
dnsPromises.resolveNaptr()
'NS'
name server records
<string>
dnsPromises.resolveNs()
'PTR'
pointer records
<string>
dnsPromises.resolvePtr()
'SOA'
start of authority records
<Object>
dnsPromises.resolveSoa()
'SRV'
service records
<Object>
dnsPromises.resolveSrv()
'TLSA'
certificate associations
<Object>
dnsPromises.resolveTlsa()
'TXT'
text records
<string[]>
dnsPromises.resolveTxt()

On error, the Promise is rejected with an Error object, where err.code is one of the DNS error codes.
dnsPromises.resolve4(hostname[, options])
#
Added in: v10.6.0
hostname <string> Host name to resolve.
options <Object>
ttl <boolean> Retrieve the Time-To-Live value (TTL) of each record. When true, the Promise is resolved with an array of { address: '1.2.3.4', ttl: 60 } objects rather than an array of strings, with the TTL expressed in seconds.
Uses the DNS protocol to resolve IPv4 addresses (A records) for the hostname. On success, the Promise is resolved with an array of IPv4 addresses (e.g. ['74.125.79.104', '74.125.79.105', '74.125.79.106']).
dnsPromises.resolve6(hostname[, options])
#
Added in: v10.6.0
hostname <string> Host name to resolve.
options <Object>
ttl <boolean> Retrieve the Time-To-Live value (TTL) of each record. When true, the Promise is resolved with an array of { address: '0:1:2:3:4:5:6:7', ttl: 60 } objects rather than an array of strings, with the TTL expressed in seconds.
Uses the DNS protocol to resolve IPv6 addresses (AAAA records) for the hostname. On success, the Promise is resolved with an array of IPv6 addresses.
dnsPromises.resolveAny(hostname)
#
Added in: v10.6.0
hostname <string>
Uses the DNS protocol to resolve all records (also known as ANY or * query). On success, the Promise is resolved with an array containing various types of records. Each object has a property type that indicates the type of the current record. And depending on the type, additional properties will be present on the object:
Type
Properties
'A'
address/ttl
'AAAA'
address/ttl
'CNAME'
value
'MX'
Refer to dnsPromises.resolveMx()
'NAPTR'
Refer to dnsPromises.resolveNaptr()
'NS'
value
'PTR'
value
'SOA'
Refer to dnsPromises.resolveSoa()
'SRV'
Refer to dnsPromises.resolveSrv()
'TLSA'
Refer to dnsPromises.resolveTlsa()
'TXT'
This type of record contains an array property called entries which refers to dnsPromises.resolveTxt(), e.g. { entries: ['...'], type: 'TXT' }

Here is an example of the result object:
[ { type: 'A', address: '127.0.0.1', ttl: 299 },
  { type: 'CNAME', value: 'example.com' },
  { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
  { type: 'NS', value: 'ns1.example.com' },
  { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
  { type: 'SOA',
    nsname: 'ns1.example.com',
    hostmaster: 'admin.example.com',
    serial: 156696742,
    refresh: 900,
    retry: 900,
    expire: 1800,
    minttl: 60 } ]
copy
dnsPromises.resolveCaa(hostname)
#
Added in: v15.0.0, v14.17.0
hostname <string>
Uses the DNS protocol to resolve CAA records for the hostname. On success, the Promise is resolved with an array of objects containing available certification authority authorization records available for the hostname (e.g. [{critical: 0, iodef: 'mailto:pki@example.com'},{critical: 128, issue: 'pki.example.com'}]).
dnsPromises.resolveCname(hostname)
#
Added in: v10.6.0
hostname <string>
Uses the DNS protocol to resolve CNAME records for the hostname. On success, the Promise is resolved with an array of canonical name records available for the hostname (e.g. ['bar.example.com']).
dnsPromises.resolveMx(hostname)
#
Added in: v10.6.0
hostname <string>
Uses the DNS protocol to resolve mail exchange records (MX records) for the hostname. On success, the Promise is resolved with an array of objects containing both a priority and exchange property (e.g. [{priority: 10, exchange: 'mx.example.com'}, ...]).
dnsPromises.resolveNaptr(hostname)
#
Added in: v10.6.0
hostname <string>
Uses the DNS protocol to resolve regular expression-based records (NAPTR records) for the hostname. On success, the Promise is resolved with an array of objects with the following properties:
flags
service
regexp
replacement
order
preference
{
  flags: 's',
  service: 'SIP+D2U',
  regexp: '',
  replacement: '_sip._udp.example.com',
  order: 30,
  preference: 100
}
copy
dnsPromises.resolveNs(hostname)
#
Added in: v10.6.0
hostname <string>
Uses the DNS protocol to resolve name server records (NS records) for the hostname. On success, the Promise is resolved with an array of name server records available for hostname (e.g. ['ns1.example.com', 'ns2.example.com']).
dnsPromises.resolvePtr(hostname)
#
Added in: v10.6.0
hostname <string>
Uses the DNS protocol to resolve pointer records (PTR records) for the hostname. On success, the Promise is resolved with an array of strings containing the reply records.
dnsPromises.resolveSoa(hostname)
#
Added in: v10.6.0
hostname <string>
Uses the DNS protocol to resolve a start of authority record (SOA record) for the hostname. On success, the Promise is resolved with an object with the following properties:
nsname
hostmaster
serial
refresh
retry
expire
minttl
{
  nsname: 'ns.example.com',
  hostmaster: 'root.example.com',
  serial: 2013101809,
  refresh: 10000,
  retry: 2400,
  expire: 604800,
  minttl: 3600
}
copy
dnsPromises.resolveSrv(hostname)
#
Added in: v10.6.0
hostname <string>
Uses the DNS protocol to resolve service records (SRV records) for the hostname. On success, the Promise is resolved with an array of objects with the following properties:
priority
weight
port
name
{
  priority: 10,
  weight: 5,
  port: 21223,
  name: 'service.example.com'
}
copy
dnsPromises.resolveTlsa(hostname)
#
Added in: v23.9.0, v22.15.0
hostname <string>
Uses the DNS protocol to resolve certificate associations (TLSA records) for the hostname. On success, the Promise is resolved with an array of objects with these properties:
certUsage
selector
match
data
{
  certUsage: 3,
  selector: 1,
  match: 1,
  data: [ArrayBuffer]
}
copy
dnsPromises.resolveTxt(hostname)
#
Added in: v10.6.0
hostname <string>
Uses the DNS protocol to resolve text queries (TXT records) for the hostname. On success, the Promise is resolved with a two-dimensional array of the text records available for hostname (e.g. [ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]). Each sub-array contains TXT chunks of one record. Depending on the use case, these could be either joined together or treated separately.
dnsPromises.reverse(ip)
#
Added in: v10.6.0
ip <string>
Performs a reverse DNS query that resolves an IPv4 or IPv6 address to an array of host names.
On error, the Promise is rejected with an Error object, where err.code is one of the DNS error codes.
dnsPromises.setDefaultResultOrder(order)
#
History

















order <string> must be 'ipv4first', 'ipv6first' or 'verbatim'.
Set the default value of order in dns.lookup() and dnsPromises.lookup(). The value could be:
ipv4first: sets default order to ipv4first.
ipv6first: sets default order to ipv6first.
verbatim: sets default order to verbatim.
The default is verbatim and dnsPromises.setDefaultResultOrder() have higher priority than --dns-result-order. When using worker threads, dnsPromises.setDefaultResultOrder() from the main thread won't affect the default dns orders in workers.
dnsPromises.getDefaultResultOrder()
#
Added in: v20.1.0, v18.17.0
Get the value of dnsOrder.
dnsPromises.setServers(servers)
#
Added in: v10.6.0
servers <string[]> array of RFC 5952 formatted addresses
Sets the IP address and port of servers to be used when performing DNS resolution. The servers argument is an array of RFC 5952 formatted addresses. If the port is the IANA default DNS port (53) it can be omitted.
dnsPromises.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
copy
An error will be thrown if an invalid address is provided.
The dnsPromises.setServers() method must not be called while a DNS query is in progress.
This method works much like resolve.conf. That is, if attempting to resolve with the first server provided results in a NOTFOUND error, the resolve() method will not attempt to resolve with subsequent servers provided. Fallback DNS servers will only be used if the earlier ones time out or result in some other error.
Error codes
#
Each DNS query can return one of the following error codes:
dns.NODATA: DNS server returned an answer with no data.
dns.FORMERR: DNS server claims query was misformatted.
dns.SERVFAIL: DNS server returned general failure.
dns.NOTFOUND: Domain name not found.
dns.NOTIMP: DNS server does not implement the requested operation.
dns.REFUSED: DNS server refused query.
dns.BADQUERY: Misformatted DNS query.
dns.BADNAME: Misformatted host name.
dns.BADFAMILY: Unsupported address family.
dns.BADRESP: Misformatted DNS reply.
dns.CONNREFUSED: Could not contact DNS servers.
dns.TIMEOUT: Timeout while contacting DNS servers.
dns.EOF: End of file.
dns.FILE: Error reading file.
dns.NOMEM: Out of memory.
dns.DESTRUCTION: Channel is being destroyed.
dns.BADSTR: Misformatted string.
dns.BADFLAGS: Illegal flags specified.
dns.NONAME: Given host name is not numeric.
dns.BADHINTS: Illegal hints flags specified.
dns.NOTINITIALIZED: c-ares library initialization not yet performed.
dns.LOADIPHLPAPI: Error loading iphlpapi.dll.
dns.ADDRGETNETWORKPARAMS: Could not find GetNetworkParams function.
dns.CANCELLED: DNS query cancelled.
The dnsPromises API also exports the above error codes, e.g., dnsPromises.NODATA.
Implementation considerations
#
Although dns.lookup() and the various dns.resolve*()/dns.reverse() functions have the same goal of associating a network name with a network address (or vice versa), their behavior is quite different. These differences can have subtle but significant consequences on the behavior of Node.js programs.
dns.lookup()
#
Under the hood, dns.lookup() uses the same operating system facilities as most other programs. For instance, dns.lookup() will almost always resolve a given name the same way as the ping command. On most POSIX-like operating systems, the behavior of the dns.lookup() function can be modified by changing settings in nsswitch.conf(5) and/or resolv.conf(5), but changing these files will change the behavior of all other programs running on the same operating system.
Though the call to dns.lookup() will be asynchronous from JavaScript's perspective, it is implemented as a synchronous call to getaddrinfo(3) that runs on libuv's threadpool. This can have surprising negative performance implications for some applications, see the UV_THREADPOOL_SIZE documentation for more information.
Various networking APIs will call dns.lookup() internally to resolve host names. If that is an issue, consider resolving the host name to an address using dns.resolve() and using the address instead of a host name. Also, some networking APIs (such as socket.connect() and dgram.createSocket()) allow the default resolver, dns.lookup(), to be replaced.
dns.resolve(), dns.resolve*(), and dns.reverse()
#
These functions are implemented quite differently than dns.lookup(). They do not use getaddrinfo(3) and they always perform a DNS query on the network. This network communication is always done asynchronously and does not use libuv's threadpool.
As a result, these functions cannot have the same negative impact on other processing that happens on libuv's threadpool that dns.lookup() can have.
They do not use the same set of configuration files that dns.lookup() uses. For instance, they do not use the configuration from /etc/hosts.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Domain
Warning: Don't ignore errors!
Additions to Error objects
Implicit binding
Explicit binding
domain.create()
Class: Domain
domain.members
domain.add(emitter)
domain.bind(callback)
domain.enter()
domain.exit()
domain.intercept(callback)
domain.remove(emitter)
domain.run(fn[, ...args])
Domains and promises
Domain
#
History

















Stability: 0 - Deprecated
Source Code: lib/domain.js
This module is pending deprecation. Once a replacement API has been finalized, this module will be fully deprecated. Most developers should not have cause to use this module. Users who absolutely must have the functionality that domains provide may rely on it for the time being but should expect to have to migrate to a different solution in the future.
Domains provide a way to handle multiple different IO operations as a single group. If any of the event emitters or callbacks registered to a domain emit an 'error' event, or throw an error, then the domain object will be notified, rather than losing the context of the error in the process.on('uncaughtException') handler, or causing the program to exit immediately with an error code.
Warning: Don't ignore errors!
#
Domain error handlers are not a substitute for closing down a process when an error occurs.
By the very nature of how throw works in JavaScript, there is almost never any way to safely "pick up where it left off", without leaking references, or creating some other sort of undefined brittle state.
The safest way to respond to a thrown error is to shut down the process. Of course, in a normal web server, there may be many open connections, and it is not reasonable to abruptly shut those down because an error was triggered by someone else.
The better approach is to send an error response to the request that triggered the error, while letting the others finish in their normal time, and stop listening for new requests in that worker.
In this way, domain usage goes hand-in-hand with the cluster module, since the primary process can fork a new worker when a worker encounters an error. For Node.js programs that scale to multiple machines, the terminating proxy or service registry can take note of the failure, and react accordingly.
For example, this is not a good idea:
// XXX WARNING! BAD IDEA!

const d = require('node:domain').create();
d.on('error', (er) => {
  // The error won't crash the process, but what it does is worse!
  // Though we've prevented abrupt process restarting, we are leaking
  // a lot of resources if this ever happens.
  // This is no better than process.on('uncaughtException')!
  console.log(`error, but oh well ${er.message}`);
});
d.run(() => {
  require('node:http').createServer((req, res) => {
    handleRequest(req, res);
  }).listen(PORT);
});
copy
By using the context of a domain, and the resilience of separating our program into multiple worker processes, we can react more appropriately, and handle errors with much greater safety.
// Much better!

const cluster = require('node:cluster');
const PORT = +process.env.PORT || 1337;

if (cluster.isPrimary) {
  // A more realistic scenario would have more than 2 workers,
  // and perhaps not put the primary and worker in the same file.
  //
  // It is also possible to get a bit fancier about logging, and
  // implement whatever custom logic is needed to prevent DoS
  // attacks and other bad behavior.
  //
  // See the options in the cluster documentation.
  //
  // The important thing is that the primary does very little,
  // increasing our resilience to unexpected errors.

  cluster.fork();
  cluster.fork();

  cluster.on('disconnect', (worker) => {
    console.error('disconnect!');
    cluster.fork();
  });

} else {
  // the worker
  //
  // This is where we put our bugs!

  const domain = require('node:domain');

  // See the cluster documentation for more details about using
  // worker processes to serve requests. How it works, caveats, etc.

  const server = require('node:http').createServer((req, res) => {
    const d = domain.create();
    d.on('error', (er) => {
      console.error(`error ${er.stack}`);

      // We're in dangerous territory!
      // By definition, something unexpected occurred,
      // which we probably didn't want.
      // Anything can happen now! Be very careful!

      try {
        // Make sure we close down within 30 seconds
        const killtimer = setTimeout(() => {
          process.exit(1);
        }, 30000);
        // But don't keep the process open just for that!
        killtimer.unref();

        // Stop taking new requests.
        server.close();

        // Let the primary know we're dead. This will trigger a
        // 'disconnect' in the cluster primary, and then it will fork
        // a new worker.
        cluster.worker.disconnect();

        // Try to send an error to the request that triggered the problem
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('Oops, there was a problem!\n');
      } catch (er2) {
        // Oh well, not much we can do at this point.
        console.error(`Error sending 500! ${er2.stack}`);
      }
    });

    // Because req and res were created before this domain existed,
    // we need to explicitly add them.
    // See the explanation of implicit vs explicit binding below.
    d.add(req);
    d.add(res);

    // Now run the handler function in the domain.
    d.run(() => {
      handleRequest(req, res);
    });
  });
  server.listen(PORT);
}

// This part is not important. Just an example routing thing.
// Put fancy application logic here.
function handleRequest(req, res) {
  switch (req.url) {
    case '/error':
      // We do some async stuff, and then...
      setTimeout(() => {
        // Whoops!
        flerb.bark();
      }, timeout);
      break;
    default:
      res.end('ok');
  }
}
copy
Additions to Error objects
#
Any time an Error object is routed through a domain, a few extra fields are added to it.
error.domain The domain that first handled the error.
error.domainEmitter The event emitter that emitted an 'error' event with the error object.
error.domainBound The callback function which was bound to the domain, and passed an error as its first argument.
error.domainThrown A boolean indicating whether the error was thrown, emitted, or passed to a bound callback function.
Implicit binding
#
If domains are in use, then all new EventEmitter objects (including Stream objects, requests, responses, etc.) will be implicitly bound to the active domain at the time of their creation.
Additionally, callbacks passed to low-level event loop requests (such as to fs.open(), or other callback-taking methods) will automatically be bound to the active domain. If they throw, then the domain will catch the error.
In order to prevent excessive memory usage, Domain objects themselves are not implicitly added as children of the active domain. If they were, then it would be too easy to prevent request and response objects from being properly garbage collected.
To nest Domain objects as children of a parent Domain they must be explicitly added.
Implicit binding routes thrown errors and 'error' events to the Domain's 'error' event, but does not register the EventEmitter on the Domain. Implicit binding only takes care of thrown errors and 'error' events.
Explicit binding
#
Sometimes, the domain in use is not the one that ought to be used for a specific event emitter. Or, the event emitter could have been created in the context of one domain, but ought to instead be bound to some other domain.
For example, there could be one domain in use for an HTTP server, but perhaps we would like to have a separate domain to use for each request.
That is possible via explicit binding.
// Create a top-level domain for the server
const domain = require('node:domain');
const http = require('node:http');
const serverDomain = domain.create();

serverDomain.run(() => {
  // Server is created in the scope of serverDomain
  http.createServer((req, res) => {
    // Req and res are also created in the scope of serverDomain
    // however, we'd prefer to have a separate domain for each request.
    // create it first thing, and add req and res to it.
    const reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    reqd.on('error', (er) => {
      console.error('Error', er, req.url);
      try {
        res.writeHead(500);
        res.end('Error occurred, sorry.');
      } catch (er2) {
        console.error('Error sending 500', er2, req.url);
      }
    });
  }).listen(1337);
});
copy
domain.create()
#
Returns: <Domain>
Class: Domain
#
Extends: <EventEmitter>
The Domain class encapsulates the functionality of routing errors and uncaught exceptions to the active Domain object.
To handle the errors that it catches, listen to its 'error' event.
domain.members
#
<Array>
An array of timers and event emitters that have been explicitly added to the domain.
domain.add(emitter)
#
emitter <EventEmitter> | <Timer> emitter or timer to be added to the domain
Explicitly adds an emitter to the domain. If any event handlers called by the emitter throw an error, or if the emitter emits an 'error' event, it will be routed to the domain's 'error' event, just like with implicit binding.
This also works with timers that are returned from setInterval() and setTimeout(). If their callback function throws, it will be caught by the domain 'error' handler.
If the Timer or EventEmitter was already bound to a domain, it is removed from that one, and bound to this one instead.
domain.bind(callback)
#
callback <Function> The callback function
Returns: <Function> The bound function
The returned function will be a wrapper around the supplied callback function. When the returned function is called, any errors that are thrown will be routed to the domain's 'error' event.
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.bind((er, data) => {
    // If this throws, it will also be passed to the domain.
    return cb(er, data ? JSON.parse(data) : null);
  }));
}

d.on('error', (er) => {
  // An error occurred somewhere. If we throw it now, it will crash the program
  // with the normal line number and stack message.
});
copy
domain.enter()
#
The enter() method is plumbing used by the run(), bind(), and intercept() methods to set the active domain. It sets domain.active and process.domain to the domain, and implicitly pushes the domain onto the domain stack managed by the domain module (see domain.exit() for details on the domain stack). The call to enter() delimits the beginning of a chain of asynchronous calls and I/O operations bound to a domain.
Calling enter() changes only the active domain, and does not alter the domain itself. enter() and exit() can be called an arbitrary number of times on a single domain.
domain.exit()
#
The exit() method exits the current domain, popping it off the domain stack. Any time execution is going to switch to the context of a different chain of asynchronous calls, it's important to ensure that the current domain is exited. The call to exit() delimits either the end of or an interruption to the chain of asynchronous calls and I/O operations bound to a domain.
If there are multiple, nested domains bound to the current execution context, exit() will exit any domains nested within this domain.
Calling exit() changes only the active domain, and does not alter the domain itself. enter() and exit() can be called an arbitrary number of times on a single domain.
domain.intercept(callback)
#
callback <Function> The callback function
Returns: <Function> The intercepted function
This method is almost identical to domain.bind(callback). However, in addition to catching thrown errors, it will also intercept Error objects sent as the first argument to the function.
In this way, the common if (err) return callback(err); pattern can be replaced with a single error handler in a single place.
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.intercept((data) => {
    // Note, the first argument is never passed to the
    // callback since it is assumed to be the 'Error' argument
    // and thus intercepted by the domain.

    // If this throws, it will also be passed to the domain
    // so the error-handling logic can be moved to the 'error'
    // event on the domain instead of being repeated throughout
    // the program.
    return cb(null, JSON.parse(data));
  }));
}

d.on('error', (er) => {
  // An error occurred somewhere. If we throw it now, it will crash the program
  // with the normal line number and stack message.
});
copy
domain.remove(emitter)
#
emitter <EventEmitter> | <Timer> emitter or timer to be removed from the domain
The opposite of domain.add(emitter). Removes domain handling from the specified emitter.
domain.run(fn[, ...args])
#
fn <Function>
...args <any>
Run the supplied function in the context of the domain, implicitly binding all event emitters, timers, and low-level requests that are created in that context. Optionally, arguments can be passed to the function.
This is the most basic way to use a domain.
const domain = require('node:domain');
const fs = require('node:fs');
const d = domain.create();
d.on('error', (er) => {
  console.error('Caught error!', er);
});
d.run(() => {
  process.nextTick(() => {
    setTimeout(() => { // Simulating some various async stuff
      fs.open('non-existent file', 'r', (er, fd) => {
        if (er) throw er;
        // proceed...
      });
    }, 100);
  });
});
copy
In this example, the d.on('error') handler will be triggered, rather than crashing the program.
Domains and promises
#
As of Node.js 8.0.0, the handlers of promises are run inside the domain in which the call to .then() or .catch() itself was made:
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then((v) => {
    // running in d2
  });
});
copy
A callback may be bound to a specific domain using domain.bind(callback):
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then(p.domain.bind((v) => {
    // running in d1
  }));
});
copy
Domains will not interfere with the error handling mechanisms for promises. In other words, no 'error' event will be emitted for unhandled Promise rejections.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Errors
Error propagation and interception
Class: Error
new Error(message[, options])
Error.captureStackTrace(targetObject[, constructorOpt])
Error.stackTraceLimit
error.cause
error.code
error.message
error.stack
Class: AssertionError
Class: RangeError
Class: ReferenceError
Class: SyntaxError
Class: SystemError
error.address
error.code
error.dest
error.errno
error.info
error.message
error.path
error.port
error.syscall
Common system errors
Class: TypeError
Exceptions vs. errors
OpenSSL errors
error.opensslErrorStack
error.function
error.library
error.reason
Node.js error codes
ABORT_ERR
ERR_ACCESS_DENIED
ERR_AMBIGUOUS_ARGUMENT
ERR_ARG_NOT_ITERABLE
ERR_ASSERTION
ERR_ASYNC_CALLBACK
ERR_ASYNC_TYPE
ERR_BROTLI_COMPRESSION_FAILED
ERR_BROTLI_INVALID_PARAM
ERR_BUFFER_CONTEXT_NOT_AVAILABLE
ERR_BUFFER_OUT_OF_BOUNDS
ERR_BUFFER_TOO_LARGE
ERR_CANNOT_WATCH_SIGINT
ERR_CHILD_CLOSED_BEFORE_REPLY
ERR_CHILD_PROCESS_IPC_REQUIRED
ERR_CHILD_PROCESS_STDIO_MAXBUFFER
ERR_CLOSED_MESSAGE_PORT
ERR_CONSOLE_WRITABLE_STREAM
ERR_CONSTRUCT_CALL_INVALID
ERR_CONSTRUCT_CALL_REQUIRED
ERR_CONTEXT_NOT_INITIALIZED
ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED
ERR_CRYPTO_ECDH_INVALID_FORMAT
ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY
ERR_CRYPTO_ENGINE_UNKNOWN
ERR_CRYPTO_FIPS_FORCED
ERR_CRYPTO_FIPS_UNAVAILABLE
ERR_CRYPTO_HASH_FINALIZED
ERR_CRYPTO_HASH_UPDATE_FAILED
ERR_CRYPTO_INCOMPATIBLE_KEY
ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS
ERR_CRYPTO_INITIALIZATION_FAILED
ERR_CRYPTO_INVALID_AUTH_TAG
ERR_CRYPTO_INVALID_COUNTER
ERR_CRYPTO_INVALID_CURVE
ERR_CRYPTO_INVALID_DIGEST
ERR_CRYPTO_INVALID_IV
ERR_CRYPTO_INVALID_JWK
ERR_CRYPTO_INVALID_KEYLEN
ERR_CRYPTO_INVALID_KEYPAIR
ERR_CRYPTO_INVALID_KEYTYPE
ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE
ERR_CRYPTO_INVALID_MESSAGELEN
ERR_CRYPTO_INVALID_SCRYPT_PARAMS
ERR_CRYPTO_INVALID_STATE
ERR_CRYPTO_INVALID_TAG_LENGTH
ERR_CRYPTO_JOB_INIT_FAILED
ERR_CRYPTO_JWK_UNSUPPORTED_CURVE
ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE
ERR_CRYPTO_OPERATION_FAILED
ERR_CRYPTO_PBKDF2_ERROR
ERR_CRYPTO_SCRYPT_NOT_SUPPORTED
ERR_CRYPTO_SIGN_KEY_REQUIRED
ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH
ERR_CRYPTO_UNKNOWN_CIPHER
ERR_CRYPTO_UNKNOWN_DH_GROUP
ERR_CRYPTO_UNSUPPORTED_OPERATION
ERR_DEBUGGER_ERROR
ERR_DEBUGGER_STARTUP_ERROR
ERR_DIR_CLOSED
ERR_DIR_CONCURRENT_OPERATION
ERR_DLOPEN_DISABLED
ERR_DLOPEN_FAILED
ERR_DNS_SET_SERVERS_FAILED
ERR_DOMAIN_CALLBACK_NOT_AVAILABLE
ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE
ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION
ERR_ENCODING_INVALID_ENCODED_DATA
ERR_ENCODING_NOT_SUPPORTED
ERR_EVAL_ESM_CANNOT_PRINT
ERR_EVENT_RECURSION
ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE
ERR_FALSY_VALUE_REJECTION
ERR_FEATURE_UNAVAILABLE_ON_PLATFORM
ERR_FS_CP_DIR_TO_NON_DIR
ERR_FS_CP_EEXIST
ERR_FS_CP_EINVAL
ERR_FS_CP_FIFO_PIPE
ERR_FS_CP_NON_DIR_TO_DIR
ERR_FS_CP_SOCKET
ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY
ERR_FS_CP_UNKNOWN
ERR_FS_EISDIR
ERR_FS_FILE_TOO_LARGE
ERR_FS_WATCH_QUEUE_OVERFLOW
ERR_HTTP2_ALTSVC_INVALID_ORIGIN
ERR_HTTP2_ALTSVC_LENGTH
ERR_HTTP2_CONNECT_AUTHORITY
ERR_HTTP2_CONNECT_PATH
ERR_HTTP2_CONNECT_SCHEME
ERR_HTTP2_ERROR
ERR_HTTP2_GOAWAY_SESSION
ERR_HTTP2_HEADERS_AFTER_RESPOND
ERR_HTTP2_HEADERS_SENT
ERR_HTTP2_HEADER_SINGLE_VALUE
ERR_HTTP2_INFO_STATUS_NOT_ALLOWED
ERR_HTTP2_INVALID_CONNECTION_HEADERS
ERR_HTTP2_INVALID_HEADER_VALUE
ERR_HTTP2_INVALID_INFO_STATUS
ERR_HTTP2_INVALID_ORIGIN
ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH
ERR_HTTP2_INVALID_PSEUDOHEADER
ERR_HTTP2_INVALID_SESSION
ERR_HTTP2_INVALID_SETTING_VALUE
ERR_HTTP2_INVALID_STREAM
ERR_HTTP2_MAX_PENDING_SETTINGS_ACK
ERR_HTTP2_NESTED_PUSH
ERR_HTTP2_NO_MEM
ERR_HTTP2_NO_SOCKET_MANIPULATION
ERR_HTTP2_ORIGIN_LENGTH
ERR_HTTP2_OUT_OF_STREAMS
ERR_HTTP2_PAYLOAD_FORBIDDEN
ERR_HTTP2_PING_CANCEL
ERR_HTTP2_PING_LENGTH
ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED
ERR_HTTP2_PUSH_DISABLED
ERR_HTTP2_SEND_FILE
ERR_HTTP2_SEND_FILE_NOSEEK
ERR_HTTP2_SESSION_ERROR
ERR_HTTP2_SETTINGS_CANCEL
ERR_HTTP2_SOCKET_BOUND
ERR_HTTP2_SOCKET_UNBOUND
ERR_HTTP2_STATUS_101
ERR_HTTP2_STATUS_INVALID
ERR_HTTP2_STREAM_CANCEL
ERR_HTTP2_STREAM_ERROR
ERR_HTTP2_STREAM_SELF_DEPENDENCY
ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS
ERR_HTTP2_TOO_MANY_INVALID_FRAMES
ERR_HTTP2_TRAILERS_ALREADY_SENT
ERR_HTTP2_TRAILERS_NOT_READY
ERR_HTTP2_UNSUPPORTED_PROTOCOL
ERR_HTTP_BODY_NOT_ALLOWED
ERR_HTTP_CONTENT_LENGTH_MISMATCH
ERR_HTTP_HEADERS_SENT
ERR_HTTP_INVALID_HEADER_VALUE
ERR_HTTP_INVALID_STATUS_CODE
ERR_HTTP_REQUEST_TIMEOUT
ERR_HTTP_SOCKET_ASSIGNED
ERR_HTTP_SOCKET_ENCODING
ERR_HTTP_TRAILER_INVALID
ERR_ILLEGAL_CONSTRUCTOR
ERR_IMPORT_ATTRIBUTE_MISSING
ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE
ERR_IMPORT_ATTRIBUTE_UNSUPPORTED
ERR_INCOMPATIBLE_OPTION_PAIR
ERR_INPUT_TYPE_NOT_ALLOWED
ERR_INSPECTOR_ALREADY_ACTIVATED
ERR_INSPECTOR_ALREADY_CONNECTED
ERR_INSPECTOR_CLOSED
ERR_INSPECTOR_COMMAND
ERR_INSPECTOR_NOT_ACTIVE
ERR_INSPECTOR_NOT_AVAILABLE
ERR_INSPECTOR_NOT_CONNECTED
ERR_INSPECTOR_NOT_WORKER
ERR_INTERNAL_ASSERTION
ERR_INVALID_ADDRESS
ERR_INVALID_ADDRESS_FAMILY
ERR_INVALID_ARG_TYPE
ERR_INVALID_ARG_VALUE
ERR_INVALID_ASYNC_ID
ERR_INVALID_BUFFER_SIZE
ERR_INVALID_CHAR
ERR_INVALID_CURSOR_POS
ERR_INVALID_FD
ERR_INVALID_FD_TYPE
ERR_INVALID_FILE_URL_HOST
ERR_INVALID_FILE_URL_PATH
ERR_INVALID_HANDLE_TYPE
ERR_INVALID_HTTP_TOKEN
ERR_INVALID_IP_ADDRESS
ERR_INVALID_MIME_SYNTAX
ERR_INVALID_MODULE
ERR_INVALID_MODULE_SPECIFIER
ERR_INVALID_OBJECT_DEFINE_PROPERTY
ERR_INVALID_PACKAGE_CONFIG
ERR_INVALID_PACKAGE_TARGET
ERR_INVALID_PROTOCOL
ERR_INVALID_REPL_EVAL_CONFIG
ERR_INVALID_REPL_INPUT
ERR_INVALID_RETURN_PROPERTY
ERR_INVALID_RETURN_PROPERTY_VALUE
ERR_INVALID_RETURN_VALUE
ERR_INVALID_STATE
ERR_INVALID_SYNC_FORK_INPUT
ERR_INVALID_THIS
ERR_INVALID_TUPLE
ERR_INVALID_TYPESCRIPT_SYNTAX
ERR_INVALID_URI
ERR_INVALID_URL
ERR_INVALID_URL_PATTERN
ERR_INVALID_URL_SCHEME
ERR_IPC_CHANNEL_CLOSED
ERR_IPC_DISCONNECTED
ERR_IPC_ONE_PIPE
ERR_IPC_SYNC_FORK
ERR_IP_BLOCKED
ERR_LOADER_CHAIN_INCOMPLETE
ERR_LOAD_SQLITE_EXTENSION
ERR_MEMORY_ALLOCATION_FAILED
ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE
ERR_METHOD_NOT_IMPLEMENTED
ERR_MISSING_ARGS
ERR_MISSING_OPTION
ERR_MISSING_PASSPHRASE
ERR_MISSING_PLATFORM_FOR_WORKER
ERR_MODULE_NOT_FOUND
ERR_MULTIPLE_CALLBACK
ERR_NAPI_CONS_FUNCTION
ERR_NAPI_INVALID_DATAVIEW_ARGS
ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT
ERR_NAPI_INVALID_TYPEDARRAY_LENGTH
ERR_NAPI_TSFN_CALL_JS
ERR_NAPI_TSFN_GET_UNDEFINED
ERR_NON_CONTEXT_AWARE_DISABLED
ERR_NOT_BUILDING_SNAPSHOT
ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION
ERR_NOT_SUPPORTED_IN_SNAPSHOT
ERR_NO_CRYPTO
ERR_NO_ICU
ERR_NO_TYPESCRIPT
ERR_OPERATION_FAILED
ERR_OPTIONS_BEFORE_BOOTSTRAPPING
ERR_OUT_OF_RANGE
ERR_PACKAGE_IMPORT_NOT_DEFINED
ERR_PACKAGE_PATH_NOT_EXPORTED
ERR_PARSE_ARGS_INVALID_OPTION_VALUE
ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL
ERR_PARSE_ARGS_UNKNOWN_OPTION
ERR_PERFORMANCE_INVALID_TIMESTAMP
ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS
ERR_PROTO_ACCESS
ERR_QUIC_APPLICATION_ERROR
ERR_QUIC_CONNECTION_FAILED
ERR_QUIC_ENDPOINT_CLOSED
ERR_QUIC_OPEN_STREAM_FAILED
ERR_QUIC_TRANSPORT_ERROR
ERR_QUIC_VERSION_NEGOTIATION_ERROR
ERR_REQUIRE_ASYNC_MODULE
ERR_REQUIRE_CYCLE_MODULE
ERR_REQUIRE_ESM
ERR_SCRIPT_EXECUTION_INTERRUPTED
ERR_SCRIPT_EXECUTION_TIMEOUT
ERR_SERVER_ALREADY_LISTEN
ERR_SERVER_NOT_RUNNING
ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND
ERR_SOCKET_ALREADY_BOUND
ERR_SOCKET_BAD_BUFFER_SIZE
ERR_SOCKET_BAD_PORT
ERR_SOCKET_BAD_TYPE
ERR_SOCKET_BUFFER_SIZE
ERR_SOCKET_CLOSED
ERR_SOCKET_CLOSED_BEFORE_CONNECTION
ERR_SOCKET_CONNECTION_TIMEOUT
ERR_SOCKET_DGRAM_IS_CONNECTED
ERR_SOCKET_DGRAM_NOT_CONNECTED
ERR_SOCKET_DGRAM_NOT_RUNNING
ERR_SOURCE_MAP_CORRUPT
ERR_SOURCE_MAP_MISSING_SOURCE
ERR_SOURCE_PHASE_NOT_DEFINED
ERR_SQLITE_ERROR
ERR_SRI_PARSE
ERR_STREAM_ALREADY_FINISHED
ERR_STREAM_CANNOT_PIPE
ERR_STREAM_DESTROYED
ERR_STREAM_NULL_VALUES
ERR_STREAM_PREMATURE_CLOSE
ERR_STREAM_PUSH_AFTER_EOF
ERR_STREAM_UNABLE_TO_PIPE
ERR_STREAM_UNSHIFT_AFTER_END_EVENT
ERR_STREAM_WRAP
ERR_STREAM_WRITE_AFTER_END
ERR_STRING_TOO_LONG
ERR_SYNTHETIC
ERR_SYSTEM_ERROR
ERR_TEST_FAILURE
ERR_TLS_ALPN_CALLBACK_INVALID_RESULT
ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS
ERR_TLS_CERT_ALTNAME_FORMAT
ERR_TLS_CERT_ALTNAME_INVALID
ERR_TLS_DH_PARAM_SIZE
ERR_TLS_HANDSHAKE_TIMEOUT
ERR_TLS_INVALID_CONTEXT
ERR_TLS_INVALID_PROTOCOL_METHOD
ERR_TLS_INVALID_PROTOCOL_VERSION
ERR_TLS_INVALID_STATE
ERR_TLS_PROTOCOL_VERSION_CONFLICT
ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED
ERR_TLS_RENEGOTIATION_DISABLED
ERR_TLS_REQUIRED_SERVER_NAME
ERR_TLS_SESSION_ATTACK
ERR_TLS_SNI_FROM_SERVER
ERR_TRACE_EVENTS_CATEGORY_REQUIRED
ERR_TRACE_EVENTS_UNAVAILABLE
ERR_TRAILING_JUNK_AFTER_STREAM_END
ERR_TRANSFORM_ALREADY_TRANSFORMING
ERR_TRANSFORM_WITH_LENGTH_0
ERR_TTY_INIT_FAILED
ERR_UNAVAILABLE_DURING_EXIT
ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET
ERR_UNESCAPED_CHARACTERS
ERR_UNHANDLED_ERROR
ERR_UNKNOWN_BUILTIN_MODULE
ERR_UNKNOWN_CREDENTIAL
ERR_UNKNOWN_ENCODING
ERR_UNKNOWN_FILE_EXTENSION
ERR_UNKNOWN_MODULE_FORMAT
ERR_UNKNOWN_SIGNAL
ERR_UNSUPPORTED_DIR_IMPORT
ERR_UNSUPPORTED_ESM_URL_SCHEME
ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING
ERR_UNSUPPORTED_RESOLVE_REQUEST
ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX
ERR_USE_AFTER_CLOSE
ERR_VALID_PERFORMANCE_ENTRY_TYPE
ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING
ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG
ERR_VM_MODULE_ALREADY_LINKED
ERR_VM_MODULE_CACHED_DATA_REJECTED
ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA
ERR_VM_MODULE_DIFFERENT_CONTEXT
ERR_VM_MODULE_LINK_FAILURE
ERR_VM_MODULE_NOT_MODULE
ERR_VM_MODULE_STATUS
ERR_WASI_ALREADY_STARTED
ERR_WASI_NOT_STARTED
ERR_WEBASSEMBLY_RESPONSE
ERR_WORKER_INIT_FAILED
ERR_WORKER_INVALID_EXEC_ARGV
ERR_WORKER_MESSAGING_ERRORED
ERR_WORKER_MESSAGING_FAILED
ERR_WORKER_MESSAGING_SAME_THREAD
ERR_WORKER_MESSAGING_TIMEOUT
ERR_WORKER_NOT_RUNNING
ERR_WORKER_OUT_OF_MEMORY
ERR_WORKER_PATH
ERR_WORKER_UNSERIALIZABLE_ERROR
ERR_WORKER_UNSUPPORTED_OPERATION
ERR_ZLIB_INITIALIZATION_FAILED
ERR_ZSTD_INVALID_PARAM
HPE_CHUNK_EXTENSIONS_OVERFLOW
HPE_HEADER_OVERFLOW
HPE_UNEXPECTED_CONTENT_LENGTH
MODULE_NOT_FOUND
Legacy Node.js error codes
ERR_CANNOT_TRANSFER_OBJECT
ERR_CPU_USAGE
ERR_CRYPTO_HASH_DIGEST_NO_UTF16
ERR_CRYPTO_SCRYPT_INVALID_PARAMETER
ERR_FS_INVALID_SYMLINK_TYPE
ERR_HTTP2_FRAME_ERROR
ERR_HTTP2_HEADERS_OBJECT
ERR_HTTP2_HEADER_REQUIRED
ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND
ERR_HTTP2_STREAM_CLOSED
ERR_HTTP_INVALID_CHAR
ERR_IMPORT_ASSERTION_TYPE_FAILED
ERR_IMPORT_ASSERTION_TYPE_MISSING
ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED
ERR_INDEX_OUT_OF_RANGE
ERR_INVALID_OPT_VALUE
ERR_INVALID_OPT_VALUE_ENCODING
ERR_INVALID_PERFORMANCE_MARK
ERR_INVALID_TRANSFER_OBJECT
ERR_MANIFEST_ASSERT_INTEGRITY
ERR_MANIFEST_DEPENDENCY_MISSING
ERR_MANIFEST_INTEGRITY_MISMATCH
ERR_MANIFEST_INVALID_RESOURCE_FIELD
ERR_MANIFEST_INVALID_SPECIFIER
ERR_MANIFEST_PARSE_POLICY
ERR_MANIFEST_TDZ
ERR_MANIFEST_UNKNOWN_ONERROR
ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST
ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST
ERR_NAPI_CONS_PROTOTYPE_OBJECT
ERR_NAPI_TSFN_START_IDLE_LOOP
ERR_NAPI_TSFN_STOP_IDLE_LOOP
ERR_NO_LONGER_SUPPORTED
ERR_OUTOFMEMORY
ERR_PARSE_HISTORY_DATA
ERR_SOCKET_CANNOT_SEND
ERR_STDERR_CLOSE
ERR_STDOUT_CLOSE
ERR_STREAM_READ_NOT_IMPLEMENTED
ERR_TAP_LEXER_ERROR
ERR_TAP_PARSER_ERROR
ERR_TAP_VALIDATION_ERROR
ERR_TLS_RENEGOTIATION_FAILED
ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER
ERR_UNKNOWN_STDIN_TYPE
ERR_UNKNOWN_STREAM_TYPE
ERR_V8BREAKITERATOR
ERR_VALUE_OUT_OF_RANGE
ERR_VM_MODULE_LINKING_ERRORED
ERR_VM_MODULE_NOT_LINKED
ERR_WORKER_UNSUPPORTED_EXTENSION
ERR_ZLIB_BINDING_CLOSED
OpenSSL Error Codes
Time Validity Errors
CERT_NOT_YET_VALID
CERT_HAS_EXPIRED
CRL_NOT_YET_VALID
CRL_HAS_EXPIRED
CERT_REVOKED
Trust or Chain Related Errors
UNABLE_TO_GET_ISSUER_CERT
UNABLE_TO_GET_ISSUER_CERT_LOCALLY
DEPTH_ZERO_SELF_SIGNED_CERT
SELF_SIGNED_CERT_IN_CHAIN
CERT_CHAIN_TOO_LONG
UNABLE_TO_GET_CRL
UNABLE_TO_VERIFY_LEAF_SIGNATURE
CERT_UNTRUSTED
Basic Extension Errors
INVALID_CA
PATH_LENGTH_EXCEEDED
Name Related Errors
HOSTNAME_MISMATCH
Usage and Policy Errors
INVALID_PURPOSE
CERT_REJECTED
Formatting Errors
CERT_SIGNATURE_FAILURE
CRL_SIGNATURE_FAILURE
ERROR_IN_CERT_NOT_BEFORE_FIELD
ERROR_IN_CERT_NOT_AFTER_FIELD
ERROR_IN_CRL_LAST_UPDATE_FIELD
ERROR_IN_CRL_NEXT_UPDATE_FIELD
UNABLE_TO_DECRYPT_CERT_SIGNATURE
UNABLE_TO_DECRYPT_CRL_SIGNATURE
UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY
Other OpenSSL Errors
OUT_OF_MEM
Errors
#
Applications running in Node.js will generally experience the following categories of errors:
Standard JavaScript errors such as <EvalError>, <SyntaxError>, <RangeError>, <ReferenceError>, <TypeError>, and <URIError>.
Standard DOMExceptions.
System errors triggered by underlying operating system constraints such as attempting to open a file that does not exist or attempting to send data over a closed socket.
AssertionErrors are a special class of error that can be triggered when Node.js detects an exceptional logic violation that should never occur. These are raised typically by the node:assert module.
User-specified errors triggered by application code.
All JavaScript and system errors raised by Node.js inherit from, or are instances of, the standard JavaScript <Error> class and are guaranteed to provide at least the properties available on that class.
The error.message property of errors raised by Node.js may be changed in any versions. Use error.code to identify an error instead. For a DOMException, use domException.name to identify its type.
Error propagation and interception
#
Node.js supports several mechanisms for propagating and handling errors that occur while an application is running. How these errors are reported and handled depends entirely on the type of Error and the style of the API that is called.
All JavaScript errors are handled as exceptions that immediately generate and throw an error using the standard JavaScript throw mechanism. These are handled using the try…catch construct provided by the JavaScript language.
// Throws with a ReferenceError because z is not defined.
try {
  const m = 1;
  const n = m + z;
} catch (err) {
  // Handle the error here.
}
copy
Any use of the JavaScript throw mechanism will raise an exception that must be handled or the Node.js process will exit immediately.
With few exceptions, Synchronous APIs (any blocking method that does not return a <Promise> nor accept a callback function, such as fs.readFileSync), will use throw to report errors.
Errors that occur within Asynchronous APIs may be reported in multiple ways:
Some asynchronous methods returns a <Promise>, you should always take into account that it might be rejected. See --unhandled-rejections flag for how the process will react to an unhandled promise rejection.
const fs = require('node:fs/promises');

(async () => {
  let data;
  try {
    data = await fs.readFile('a file that does not exist');
  } catch (err) {
    console.error('There was an error reading the file!', err);
    return;
  }
  // Otherwise handle the data
})();
copy
Most asynchronous methods that accept a callback function will accept an Error object passed as the first argument to that function. If that first argument is not null and is an instance of Error, then an error occurred that should be handled.
const fs = require('node:fs');
fs.readFile('a file that does not exist', (err, data) => {
  if (err) {
    console.error('There was an error reading the file!', err);
    return;
  }
  // Otherwise handle the data
});
copy
When an asynchronous method is called on an object that is an EventEmitter, errors can be routed to that object's 'error' event.
const net = require('node:net');
const connection = net.connect('localhost');

// Adding an 'error' event handler to a stream:
connection.on('error', (err) => {
  // If the connection is reset by the server, or if it can't
  // connect at all, or on any sort of error encountered by
  // the connection, the error will be sent here.
  console.error(err);
});

connection.pipe(process.stdout);
copy
A handful of typically asynchronous methods in the Node.js API may still use the throw mechanism to raise exceptions that must be handled using try…catch. There is no comprehensive list of such methods; please refer to the documentation of each method to determine the appropriate error handling mechanism required.
The use of the 'error' event mechanism is most common for stream-based and event emitter-based APIs, which themselves represent a series of asynchronous operations over time (as opposed to a single operation that may pass or fail).
For all EventEmitter objects, if an 'error' event handler is not provided, the error will be thrown, causing the Node.js process to report an uncaught exception and crash unless either: a handler has been registered for the 'uncaughtException' event, or the deprecated node:domain module is used.
const EventEmitter = require('node:events');
const ee = new EventEmitter();

setImmediate(() => {
  // This will crash the process because no 'error' event
  // handler has been added.
  ee.emit('error', new Error('This will crash'));
});
copy
Errors generated in this way cannot be intercepted using try…catch as they are thrown after the calling code has already exited.
Developers must refer to the documentation for each method to determine exactly how errors raised by those methods are propagated.
Class: Error
#
A generic JavaScript <Error> object that does not denote any specific circumstance of why the error occurred. Error objects capture a "stack trace" detailing the point in the code at which the Error was instantiated, and may provide a text description of the error.
All errors generated by Node.js, including all system and JavaScript errors, will either be instances of, or inherit from, the Error class.
new Error(message[, options])
#
message <string>
options <Object>
cause <any> The error that caused the newly created error.
Creates a new Error object and sets the error.message property to the provided text message. If an object is passed as message, the text message is generated by calling String(message). If the cause option is provided, it is assigned to the error.cause property. The error.stack property will represent the point in the code at which new Error() was called. Stack traces are dependent on V8's stack trace API. Stack traces extend only to either (a) the beginning of synchronous code execution, or (b) the number of frames given by the property Error.stackTraceLimit, whichever is smaller.
Error.captureStackTrace(targetObject[, constructorOpt])
#
targetObject <Object>
constructorOpt <Function>
Creates a .stack property on targetObject, which when accessed returns a string representing the location in the code at which Error.captureStackTrace() was called.
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
copy
The first line of the trace will be prefixed with ${myObject.name}: ${myObject.message}.
The optional constructorOpt argument accepts a function. If given, all frames above constructorOpt, including constructorOpt, will be omitted from the generated stack trace.
The constructorOpt argument is useful for hiding implementation details of error generation from the user. For instance:
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
copy
Error.stackTraceLimit
#
<number>
The Error.stackTraceLimit property specifies the number of stack frames collected by a stack trace (whether generated by new Error().stack or Error.captureStackTrace(obj)).
The default value is 10 but may be set to any valid JavaScript number. Changes will affect any stack trace captured after the value has been changed.
If set to a non-number value, or set to a negative number, stack traces will not capture any frames.
error.cause
#
Added in: v16.9.0
<any>
If present, the error.cause property is the underlying cause of the Error. It is used when catching an error and throwing a new one with a different message or code in order to still have access to the original error.
The error.cause property is typically set by calling new Error(message, { cause }). It is not set by the constructor if the cause option is not provided.
This property allows errors to be chained. When serializing Error objects, util.inspect() recursively serializes error.cause if it is set.
const cause = new Error('The remote HTTP server responded with a 500 status');
const symptom = new Error('The message failed to send', { cause });

console.log(symptom);
// Prints:
//   Error: The message failed to send
//       at REPL2:1:17
//       at Script.runInThisContext (node:vm:130:12)
//       ... 7 lines matching cause stack trace ...
//       at [_line] [as _line] (node:internal/readline/interface:886:18) {
//     [cause]: Error: The remote HTTP server responded with a 500 status
//         at REPL1:1:15
//         at Script.runInThisContext (node:vm:130:12)
//         at REPLServer.defaultEval (node:repl:574:29)
//         at bound (node:domain:426:15)
//         at REPLServer.runBound [as eval] (node:domain:437:12)
//         at REPLServer.onLine (node:repl:902:10)
//         at REPLServer.emit (node:events:549:35)
//         at REPLServer.emit (node:domain:482:12)
//         at [_onLine] [as _onLine] (node:internal/readline/interface:425:12)
//         at [_line] [as _line] (node:internal/readline/interface:886:18)
copy
error.code
#
<string>
The error.code property is a string label that identifies the kind of error. error.code is the most stable way to identify an error. It will only change between major versions of Node.js. In contrast, error.message strings may change between any versions of Node.js. See Node.js error codes for details about specific codes.
error.message
#
<string>
The error.message property is the string description of the error as set by calling new Error(message). The message passed to the constructor will also appear in the first line of the stack trace of the Error, however changing this property after the Error object is created may not change the first line of the stack trace (for example, when error.stack is read before this property is changed).
const err = new Error('The message');
console.error(err.message);
// Prints: The message
copy
error.stack
#
<string>
The error.stack property is a string describing the point in the code at which the Error was instantiated.
Error: Things keep happening!
   at /home/gbusey/file.js:525:2
   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
   at increaseSynergy (/home/gbusey/actors.js:701:6)
copy
The first line is formatted as <error class name>: <error message>, and is followed by a series of stack frames (each line beginning with "at "). Each frame describes a call site within the code that lead to the error being generated. V8 attempts to display a name for each function (by variable name, function name, or object method name), but occasionally it will not be able to find a suitable name. If V8 cannot determine a name for the function, only location information will be displayed for that frame. Otherwise, the determined function name will be displayed with location information appended in parentheses.
Frames are only generated for JavaScript functions. If, for example, execution synchronously passes through a C++ addon function called cheetahify which itself calls a JavaScript function, the frame representing the cheetahify call will not be present in the stack traces:
const cheetahify = require('./native-binding.node');

function makeFaster() {
  // `cheetahify()` *synchronously* calls speedy.
  cheetahify(function speedy() {
    throw new Error('oh no!');
  });
}

makeFaster();
// will throw:
//   /home/gbusey/file.js:6
//       throw new Error('oh no!');
//           ^
//   Error: oh no!
//       at speedy (/home/gbusey/file.js:6:11)
//       at makeFaster (/home/gbusey/file.js:5:3)
//       at Object.<anonymous> (/home/gbusey/file.js:10:1)
//       at Module._compile (module.js:456:26)
//       at Object.Module._extensions..js (module.js:474:10)
//       at Module.load (module.js:356:32)
//       at Function.Module._load (module.js:312:12)
//       at Function.Module.runMain (module.js:497:10)
//       at startup (node.js:119:16)
//       at node.js:906:3
copy
The location information will be one of:
native, if the frame represents a call internal to V8 (as in [].forEach).
plain-filename.js:line:column, if the frame represents a call internal to Node.js.
/absolute/path/to/file.js:line:column, if the frame represents a call in a user program (using CommonJS module system), or its dependencies.
<transport-protocol>:///url/to/module/file.mjs:line:column, if the frame represents a call in a user program (using ES module system), or its dependencies.
The string representing the stack trace is lazily generated when the error.stack property is accessed.
The number of frames captured by the stack trace is bounded by the smaller of Error.stackTraceLimit or the number of available frames on the current event loop tick.
Class: AssertionError
#
Extends: <errors.Error>
Indicates the failure of an assertion. For details, see Class: assert.AssertionError.
Class: RangeError
#
Extends: <errors.Error>
Indicates that a provided argument was not within the set or range of acceptable values for a function; whether that is a numeric range, or outside the set of options for a given function parameter.
require('node:net').connect(-1);
// Throws "RangeError: "port" option should be >= 0 and < 65536: -1"
copy
Node.js will generate and throw RangeError instances immediately as a form of argument validation.
Class: ReferenceError
#
Extends: <errors.Error>
Indicates that an attempt is being made to access a variable that is not defined. Such errors commonly indicate typos in code, or an otherwise broken program.
While client code may generate and propagate these errors, in practice, only V8 will do so.
doesNotExist;
// Throws ReferenceError, doesNotExist is not a variable in this program.
copy
Unless an application is dynamically generating and running code, ReferenceError instances indicate a bug in the code or its dependencies.
Class: SyntaxError
#
Extends: <errors.Error>
Indicates that a program is not valid JavaScript. These errors may only be generated and propagated as a result of code evaluation. Code evaluation may happen as a result of eval, Function, require, or vm. These errors are almost always indicative of a broken program.
try {
  require('node:vm').runInThisContext('binary ! isNotOk');
} catch (err) {
  // 'err' will be a SyntaxError.
}
copy
SyntaxError instances are unrecoverable in the context that created them – they may only be caught by other contexts.
Class: SystemError
#
Extends: <errors.Error>
Node.js generates system errors when exceptions occur within its runtime environment. These usually occur when an application violates an operating system constraint. For example, a system error will occur if an application attempts to read a file that does not exist.
address <string> If present, the address to which a network connection failed
code <string> The string error code
dest <string> If present, the file path destination when reporting a file system error
errno <number> The system-provided error number
info <Object> If present, extra details about the error condition
message <string> A system-provided human-readable description of the error
path <string> If present, the file path when reporting a file system error
port <number> If present, the network connection port that is not available
syscall <string> The name of the system call that triggered the error
error.address
#
<string>
If present, error.address is a string describing the address to which a network connection failed.
error.code
#
<string>
The error.code property is a string representing the error code.
error.dest
#
<string>
If present, error.dest is the file path destination when reporting a file system error.
error.errno
#
<number>
The error.errno property is a negative number which corresponds to the error code defined in libuv Error handling.
On Windows the error number provided by the system will be normalized by libuv.
To get the string representation of the error code, use util.getSystemErrorName(error.errno).
error.info
#
<Object>
If present, error.info is an object with details about the error condition.
error.message
#
<string>
error.message is a system-provided human-readable description of the error.
error.path
#
<string>
If present, error.path is a string containing a relevant invalid pathname.
error.port
#
<number>
If present, error.port is the network connection port that is not available.
error.syscall
#
<string>
The error.syscall property is a string describing the syscall that failed.
Common system errors
#
This is a list of system errors commonly-encountered when writing a Node.js program. For a comprehensive list, see the errno(3) man page.
EACCES (Permission denied): An attempt was made to access a file in a way forbidden by its file access permissions.
EADDRINUSE (Address already in use): An attempt to bind a server (net, http, or https) to a local address failed due to another server on the local system already occupying that address.
ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.
ECONNRESET (Connection reset by peer): A connection was forcibly closed by a peer. This normally results from a loss of the connection on the remote socket due to a timeout or reboot. Commonly encountered via the http and net modules.
EEXIST (File exists): An existing file was the target of an operation that required that the target not exist.
EISDIR (Is a directory): An operation expected a file, but the given pathname was a directory.
EMFILE (Too many open files in system): Maximum number of file descriptors allowable on the system has been reached, and requests for another descriptor cannot be fulfilled until at least one has been closed. This is encountered when opening many files at once in parallel, especially on systems (in particular, macOS) where there is a low file descriptor limit for processes. To remedy a low limit, run ulimit -n 2048 in the same shell that will run the Node.js process.
ENOENT (No such file or directory): Commonly raised by fs operations to indicate that a component of the specified pathname does not exist. No entity (file or directory) could be found by the given path.
ENOTDIR (Not a directory): A component of the given pathname existed, but was not a directory as expected. Commonly raised by fs.readdir.
ENOTEMPTY (Directory not empty): A directory with entries was the target of an operation that requires an empty directory, usually fs.unlink.
ENOTFOUND (DNS lookup failed): Indicates a DNS failure of either EAI_NODATA or EAI_NONAME. This is not a standard POSIX error.
EPERM (Operation not permitted): An attempt was made to perform an operation that requires elevated privileges.
EPIPE (Broken pipe): A write on a pipe, socket, or FIFO for which there is no process to read the data. Commonly encountered at the net and http layers, indicative that the remote side of the stream being written to has been closed.
ETIMEDOUT (Operation timed out): A connect or send request failed because the connected party did not properly respond after a period of time. Usually encountered by http or net. Often a sign that a socket.end() was not properly called.
Class: TypeError
#
Extends <errors.Error>
Indicates that a provided argument is not an allowable type. For example, passing a function to a parameter which expects a string would be a TypeError.
require('node:url').parse(() => { });
// Throws TypeError, since it expected a string.
copy
Node.js will generate and throw TypeError instances immediately as a form of argument validation.
Exceptions vs. errors
#
A JavaScript exception is a value that is thrown as a result of an invalid operation or as the target of a throw statement. While it is not required that these values are instances of Error or classes which inherit from Error, all exceptions thrown by Node.js or the JavaScript runtime will be instances of Error.
Some exceptions are unrecoverable at the JavaScript layer. Such exceptions will always cause the Node.js process to crash. Examples include assert() checks or abort() calls in the C++ layer.
OpenSSL errors
#
Errors originating in crypto or tls are of class Error, and in addition to the standard .code and .message properties, may have some additional OpenSSL-specific properties.
error.opensslErrorStack
#
An array of errors that can give context to where in the OpenSSL library an error originates from.
error.function
#
The OpenSSL function the error originates in.
error.library
#
The OpenSSL library the error originates in.
error.reason
#
A human-readable string describing the reason for the error.
Node.js error codes
#
ABORT_ERR
#
Added in: v15.0.0
Used when an operation has been aborted (typically using an AbortController).
APIs not using AbortSignals typically do not raise an error with this code.
This code does not use the regular ERR_* convention Node.js errors use in order to be compatible with the web platform's AbortError.
ERR_ACCESS_DENIED
#
A special type of error that is triggered whenever Node.js tries to get access to a resource restricted by the Permission Model.
ERR_AMBIGUOUS_ARGUMENT
#
A function argument is being used in a way that suggests that the function signature may be misunderstood. This is thrown by the node:assert module when the message parameter in assert.throws(block, message) matches the error message thrown by block because that usage suggests that the user believes message is the expected message rather than the message the AssertionError will display if block does not throw.
ERR_ARG_NOT_ITERABLE
#
An iterable argument (i.e. a value that works with for...of loops) was required, but not provided to a Node.js API.
ERR_ASSERTION
#
A special type of error that can be triggered whenever Node.js detects an exceptional logic violation that should never occur. These are raised typically by the node:assert module.
ERR_ASYNC_CALLBACK
#
An attempt was made to register something that is not a function as an AsyncHooks callback.
ERR_ASYNC_TYPE
#
The type of an asynchronous resource was invalid. Users are also able to define their own types if using the public embedder API.
ERR_BROTLI_COMPRESSION_FAILED
#
Data passed to a Brotli stream was not successfully compressed.
ERR_BROTLI_INVALID_PARAM
#
An invalid parameter key was passed during construction of a Brotli stream.
ERR_BUFFER_CONTEXT_NOT_AVAILABLE
#
An attempt was made to create a Node.js Buffer instance from addon or embedder code, while in a JS engine Context that is not associated with a Node.js instance. The data passed to the Buffer method will have been released by the time the method returns.
When encountering this error, a possible alternative to creating a Buffer instance is to create a normal Uint8Array, which only differs in the prototype of the resulting object. Uint8Arrays are generally accepted in all Node.js core APIs where Buffers are; they are available in all Contexts.
ERR_BUFFER_OUT_OF_BOUNDS
#
An operation outside the bounds of a Buffer was attempted.
ERR_BUFFER_TOO_LARGE
#
An attempt has been made to create a Buffer larger than the maximum allowed size.
ERR_CANNOT_WATCH_SIGINT
#
Node.js was unable to watch for the SIGINT signal.
ERR_CHILD_CLOSED_BEFORE_REPLY
#
A child process was closed before the parent received a reply.
ERR_CHILD_PROCESS_IPC_REQUIRED
#
Used when a child process is being forked without specifying an IPC channel.
ERR_CHILD_PROCESS_STDIO_MAXBUFFER
#
Used when the main process is trying to read data from the child process's STDERR/STDOUT, and the data's length is longer than the maxBuffer option.
ERR_CLOSED_MESSAGE_PORT
#
History

















There was an attempt to use a MessagePort instance in a closed state, usually after .close() has been called.
ERR_CONSOLE_WRITABLE_STREAM
#
Console was instantiated without stdout stream, or Console has a non-writable stdout or stderr stream.
ERR_CONSTRUCT_CALL_INVALID
#
Added in: v12.5.0
A class constructor was called that is not callable.
ERR_CONSTRUCT_CALL_REQUIRED
#
A constructor for a class was called without new.
ERR_CONTEXT_NOT_INITIALIZED
#
The vm context passed into the API is not yet initialized. This could happen when an error occurs (and is caught) during the creation of the context, for example, when the allocation fails or the maximum call stack size is reached when the context is created.
ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED
#
An OpenSSL engine was requested (for example, through the clientCertEngine or privateKeyEngine TLS options) that is not supported by the version of OpenSSL being used, likely due to the compile-time flag OPENSSL_NO_ENGINE.
ERR_CRYPTO_ECDH_INVALID_FORMAT
#
An invalid value for the format argument was passed to the crypto.ECDH() class getPublicKey() method.
ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY
#
An invalid value for the key argument has been passed to the crypto.ECDH() class computeSecret() method. It means that the public key lies outside of the elliptic curve.
ERR_CRYPTO_ENGINE_UNKNOWN
#
An invalid crypto engine identifier was passed to require('node:crypto').setEngine().
ERR_CRYPTO_FIPS_FORCED
#
The --force-fips command-line argument was used but there was an attempt to enable or disable FIPS mode in the node:crypto module.
ERR_CRYPTO_FIPS_UNAVAILABLE
#
An attempt was made to enable or disable FIPS mode, but FIPS mode was not available.
ERR_CRYPTO_HASH_FINALIZED
#
hash.digest() was called multiple times. The hash.digest() method must be called no more than one time per instance of a Hash object.
ERR_CRYPTO_HASH_UPDATE_FAILED
#
hash.update() failed for any reason. This should rarely, if ever, happen.
ERR_CRYPTO_INCOMPATIBLE_KEY
#
The given crypto keys are incompatible with the attempted operation.
ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS
#
The selected public or private key encoding is incompatible with other options.
ERR_CRYPTO_INITIALIZATION_FAILED
#
Added in: v15.0.0
Initialization of the crypto subsystem failed.
ERR_CRYPTO_INVALID_AUTH_TAG
#
Added in: v15.0.0
An invalid authentication tag was provided.
ERR_CRYPTO_INVALID_COUNTER
#
Added in: v15.0.0
An invalid counter was provided for a counter-mode cipher.
ERR_CRYPTO_INVALID_CURVE
#
Added in: v15.0.0
An invalid elliptic-curve was provided.
ERR_CRYPTO_INVALID_DIGEST
#
An invalid crypto digest algorithm was specified.
ERR_CRYPTO_INVALID_IV
#
Added in: v15.0.0
An invalid initialization vector was provided.
ERR_CRYPTO_INVALID_JWK
#
Added in: v15.0.0
An invalid JSON Web Key was provided.
ERR_CRYPTO_INVALID_KEYLEN
#
Added in: v15.0.0
An invalid key length was provided.
ERR_CRYPTO_INVALID_KEYPAIR
#
Added in: v15.0.0
An invalid key pair was provided.
ERR_CRYPTO_INVALID_KEYTYPE
#
Added in: v15.0.0
An invalid key type was provided.
ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE
#
The given crypto key object's type is invalid for the attempted operation.
ERR_CRYPTO_INVALID_MESSAGELEN
#
Added in: v15.0.0
An invalid message length was provided.
ERR_CRYPTO_INVALID_SCRYPT_PARAMS
#
Added in: v15.0.0
One or more crypto.scrypt() or crypto.scryptSync() parameters are outside their legal range.
ERR_CRYPTO_INVALID_STATE
#
A crypto method was used on an object that was in an invalid state. For instance, calling cipher.getAuthTag() before calling cipher.final().
ERR_CRYPTO_INVALID_TAG_LENGTH
#
Added in: v15.0.0
An invalid authentication tag length was provided.
ERR_CRYPTO_JOB_INIT_FAILED
#
Added in: v15.0.0
Initialization of an asynchronous crypto operation failed.
ERR_CRYPTO_JWK_UNSUPPORTED_CURVE
#
Key's Elliptic Curve is not registered for use in the JSON Web Key Elliptic Curve Registry.
ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE
#
Key's Asymmetric Key Type is not registered for use in the JSON Web Key Types Registry.
ERR_CRYPTO_OPERATION_FAILED
#
Added in: v15.0.0
A crypto operation failed for an otherwise unspecified reason.
ERR_CRYPTO_PBKDF2_ERROR
#
The PBKDF2 algorithm failed for unspecified reasons. OpenSSL does not provide more details and therefore neither does Node.js.
ERR_CRYPTO_SCRYPT_NOT_SUPPORTED
#
Node.js was compiled without scrypt support. Not possible with the official release binaries but can happen with custom builds, including distro builds.
ERR_CRYPTO_SIGN_KEY_REQUIRED
#
A signing key was not provided to the sign.sign() method.
ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH
#
crypto.timingSafeEqual() was called with Buffer, TypedArray, or DataView arguments of different lengths.
ERR_CRYPTO_UNKNOWN_CIPHER
#
An unknown cipher was specified.
ERR_CRYPTO_UNKNOWN_DH_GROUP
#
An unknown Diffie-Hellman group name was given. See crypto.getDiffieHellman() for a list of valid group names.
ERR_CRYPTO_UNSUPPORTED_OPERATION
#
Added in: v15.0.0, v14.18.0
An attempt to invoke an unsupported crypto operation was made.
ERR_DEBUGGER_ERROR
#
Added in: v16.4.0, v14.17.4
An error occurred with the debugger.
ERR_DEBUGGER_STARTUP_ERROR
#
Added in: v16.4.0, v14.17.4
The debugger timed out waiting for the required host/port to be free.
ERR_DIR_CLOSED
#
The fs.Dir was previously closed.
ERR_DIR_CONCURRENT_OPERATION
#
Added in: v14.3.0
A synchronous read or close call was attempted on an fs.Dir which has ongoing asynchronous operations.
ERR_DLOPEN_DISABLED
#
Added in: v16.10.0, v14.19.0
Loading native addons has been disabled using --no-addons.
ERR_DLOPEN_FAILED
#
Added in: v15.0.0
A call to process.dlopen() failed.
ERR_DNS_SET_SERVERS_FAILED
#
c-ares failed to set the DNS server.
ERR_DOMAIN_CALLBACK_NOT_AVAILABLE
#
The node:domain module was not usable since it could not establish the required error handling hooks, because process.setUncaughtExceptionCaptureCallback() had been called at an earlier point in time.
ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE
#
process.setUncaughtExceptionCaptureCallback() could not be called because the node:domain module has been loaded at an earlier point in time.
The stack trace is extended to include the point in time at which the node:domain module had been loaded.
ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION
#
v8.startupSnapshot.setDeserializeMainFunction() could not be called because it had already been called before.
ERR_ENCODING_INVALID_ENCODED_DATA
#
Data provided to TextDecoder() API was invalid according to the encoding provided.
ERR_ENCODING_NOT_SUPPORTED
#
Encoding provided to TextDecoder() API was not one of the WHATWG Supported Encodings.
ERR_EVAL_ESM_CANNOT_PRINT
#
--print cannot be used with ESM input.
ERR_EVENT_RECURSION
#
Thrown when an attempt is made to recursively dispatch an event on EventTarget.
ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE
#
The JS execution context is not associated with a Node.js environment. This may occur when Node.js is used as an embedded library and some hooks for the JS engine are not set up properly.
ERR_FALSY_VALUE_REJECTION
#
A Promise that was callbackified via util.callbackify() was rejected with a falsy value.
ERR_FEATURE_UNAVAILABLE_ON_PLATFORM
#
Added in: v14.0.0
Used when a feature that is not available to the current platform which is running Node.js is used.
ERR_FS_CP_DIR_TO_NON_DIR
#
Added in: v16.7.0
An attempt was made to copy a directory to a non-directory (file, symlink, etc.) using fs.cp().
ERR_FS_CP_EEXIST
#
Added in: v16.7.0
An attempt was made to copy over a file that already existed with fs.cp(), with the force and errorOnExist set to true.
ERR_FS_CP_EINVAL
#
Added in: v16.7.0
When using fs.cp(), src or dest pointed to an invalid path.
ERR_FS_CP_FIFO_PIPE
#
Added in: v16.7.0
An attempt was made to copy a named pipe with fs.cp().
ERR_FS_CP_NON_DIR_TO_DIR
#
Added in: v16.7.0
An attempt was made to copy a non-directory (file, symlink, etc.) to a directory using fs.cp().
ERR_FS_CP_SOCKET
#
Added in: v16.7.0
An attempt was made to copy to a socket with fs.cp().
ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY
#
Added in: v16.7.0
When using fs.cp(), a symlink in dest pointed to a subdirectory of src.
ERR_FS_CP_UNKNOWN
#
Added in: v16.7.0
An attempt was made to copy to an unknown file type with fs.cp().
ERR_FS_EISDIR
#
Path is a directory.
ERR_FS_FILE_TOO_LARGE
#
An attempt has been made to read a file whose size is larger than the maximum allowed size for a Buffer.
ERR_FS_WATCH_QUEUE_OVERFLOW
#
The number of file system events queued without being handled exceeded the size specified in maxQueue in fs.watch().
ERR_HTTP2_ALTSVC_INVALID_ORIGIN
#
HTTP/2 ALTSVC frames require a valid origin.
ERR_HTTP2_ALTSVC_LENGTH
#
HTTP/2 ALTSVC frames are limited to a maximum of 16,382 payload bytes.
ERR_HTTP2_CONNECT_AUTHORITY
#
For HTTP/2 requests using the CONNECT method, the :authority pseudo-header is required.
ERR_HTTP2_CONNECT_PATH
#
For HTTP/2 requests using the CONNECT method, the :path pseudo-header is forbidden.
ERR_HTTP2_CONNECT_SCHEME
#
For HTTP/2 requests using the CONNECT method, the :scheme pseudo-header is forbidden.
ERR_HTTP2_ERROR
#
A non-specific HTTP/2 error has occurred.
ERR_HTTP2_GOAWAY_SESSION
#
New HTTP/2 Streams may not be opened after the Http2Session has received a GOAWAY frame from the connected peer.
ERR_HTTP2_HEADERS_AFTER_RESPOND
#
An additional headers was specified after an HTTP/2 response was initiated.
ERR_HTTP2_HEADERS_SENT
#
An attempt was made to send multiple response headers.
ERR_HTTP2_HEADER_SINGLE_VALUE
#
Multiple values were provided for an HTTP/2 header field that was required to have only a single value.
ERR_HTTP2_INFO_STATUS_NOT_ALLOWED
#
Informational HTTP status codes (1xx) may not be set as the response status code on HTTP/2 responses.
ERR_HTTP2_INVALID_CONNECTION_HEADERS
#
HTTP/1 connection specific headers are forbidden to be used in HTTP/2 requests and responses.
ERR_HTTP2_INVALID_HEADER_VALUE
#
An invalid HTTP/2 header value was specified.
ERR_HTTP2_INVALID_INFO_STATUS
#
An invalid HTTP informational status code has been specified. Informational status codes must be an integer between 100 and 199 (inclusive).
ERR_HTTP2_INVALID_ORIGIN
#
HTTP/2 ORIGIN frames require a valid origin.
ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH
#
Input Buffer and Uint8Array instances passed to the http2.getUnpackedSettings() API must have a length that is a multiple of six.
ERR_HTTP2_INVALID_PSEUDOHEADER
#
Only valid HTTP/2 pseudoheaders (:status, :path, :authority, :scheme, and :method) may be used.
ERR_HTTP2_INVALID_SESSION
#
An action was performed on an Http2Session object that had already been destroyed.
ERR_HTTP2_INVALID_SETTING_VALUE
#
An invalid value has been specified for an HTTP/2 setting.
ERR_HTTP2_INVALID_STREAM
#
An operation was performed on a stream that had already been destroyed.
ERR_HTTP2_MAX_PENDING_SETTINGS_ACK
#
Whenever an HTTP/2 SETTINGS frame is sent to a connected peer, the peer is required to send an acknowledgment that it has received and applied the new SETTINGS. By default, a maximum number of unacknowledged SETTINGS frames may be sent at any given time. This error code is used when that limit has been reached.
ERR_HTTP2_NESTED_PUSH
#
An attempt was made to initiate a new push stream from within a push stream. Nested push streams are not permitted.
ERR_HTTP2_NO_MEM
#
Out of memory when using the http2session.setLocalWindowSize(windowSize) API.
ERR_HTTP2_NO_SOCKET_MANIPULATION
#
An attempt was made to directly manipulate (read, write, pause, resume, etc.) a socket attached to an Http2Session.
ERR_HTTP2_ORIGIN_LENGTH
#
HTTP/2 ORIGIN frames are limited to a length of 16382 bytes.
ERR_HTTP2_OUT_OF_STREAMS
#
The number of streams created on a single HTTP/2 session reached the maximum limit.
ERR_HTTP2_PAYLOAD_FORBIDDEN
#
A message payload was specified for an HTTP response code for which a payload is forbidden.
ERR_HTTP2_PING_CANCEL
#
An HTTP/2 ping was canceled.
ERR_HTTP2_PING_LENGTH
#
HTTP/2 ping payloads must be exactly 8 bytes in length.
ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED
#
An HTTP/2 pseudo-header has been used inappropriately. Pseudo-headers are header key names that begin with the : prefix.
ERR_HTTP2_PUSH_DISABLED
#
An attempt was made to create a push stream, which had been disabled by the client.
ERR_HTTP2_SEND_FILE
#
An attempt was made to use the Http2Stream.prototype.responseWithFile() API to send a directory.
ERR_HTTP2_SEND_FILE_NOSEEK
#
An attempt was made to use the Http2Stream.prototype.responseWithFile() API to send something other than a regular file, but offset or length options were provided.
ERR_HTTP2_SESSION_ERROR
#
The Http2Session closed with a non-zero error code.
ERR_HTTP2_SETTINGS_CANCEL
#
The Http2Session settings canceled.
ERR_HTTP2_SOCKET_BOUND
#
An attempt was made to connect a Http2Session object to a net.Socket or tls.TLSSocket that had already been bound to another Http2Session object.
ERR_HTTP2_SOCKET_UNBOUND
#
An attempt was made to use the socket property of an Http2Session that has already been closed.
ERR_HTTP2_STATUS_101
#
Use of the 101 Informational status code is forbidden in HTTP/2.
ERR_HTTP2_STATUS_INVALID
#
An invalid HTTP status code has been specified. Status codes must be an integer between 100 and 599 (inclusive).
ERR_HTTP2_STREAM_CANCEL
#
An Http2Stream was destroyed before any data was transmitted to the connected peer.
ERR_HTTP2_STREAM_ERROR
#
A non-zero error code was been specified in an RST_STREAM frame.
ERR_HTTP2_STREAM_SELF_DEPENDENCY
#
When setting the priority for an HTTP/2 stream, the stream may be marked as a dependency for a parent stream. This error code is used when an attempt is made to mark a stream and dependent of itself.
ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS
#
The number of supported custom settings (10) has been exceeded.
ERR_HTTP2_TOO_MANY_INVALID_FRAMES
#
Added in: v15.14.0
The limit of acceptable invalid HTTP/2 protocol frames sent by the peer, as specified through the maxSessionInvalidFrames option, has been exceeded.
ERR_HTTP2_TRAILERS_ALREADY_SENT
#
Trailing headers have already been sent on the Http2Stream.
ERR_HTTP2_TRAILERS_NOT_READY
#
The http2stream.sendTrailers() method cannot be called until after the 'wantTrailers' event is emitted on an Http2Stream object. The 'wantTrailers' event will only be emitted if the waitForTrailers option is set for the Http2Stream.
ERR_HTTP2_UNSUPPORTED_PROTOCOL
#
http2.connect() was passed a URL that uses any protocol other than http: or https:.
ERR_HTTP_BODY_NOT_ALLOWED
#
An error is thrown when writing to an HTTP response which does not allow contents.
ERR_HTTP_CONTENT_LENGTH_MISMATCH
#
Response body size doesn't match with the specified content-length header value.
ERR_HTTP_HEADERS_SENT
#
An attempt was made to add more headers after the headers had already been sent.
ERR_HTTP_INVALID_HEADER_VALUE
#
An invalid HTTP header value was specified.
ERR_HTTP_INVALID_STATUS_CODE
#
Status code was outside the regular status code range (100-999).
ERR_HTTP_REQUEST_TIMEOUT
#
The client has not sent the entire request within the allowed time.
ERR_HTTP_SOCKET_ASSIGNED
#
The given ServerResponse was already assigned a socket.
ERR_HTTP_SOCKET_ENCODING
#
Changing the socket encoding is not allowed per RFC 7230 Section 3.
ERR_HTTP_TRAILER_INVALID
#
The Trailer header was set even though the transfer encoding does not support that.
ERR_ILLEGAL_CONSTRUCTOR
#
An attempt was made to construct an object using a non-public constructor.
ERR_IMPORT_ATTRIBUTE_MISSING
#
Added in: v21.1.0
An import attribute is missing, preventing the specified module to be imported.
ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE
#
Added in: v21.1.0
An import type attribute was provided, but the specified module is of a different type.
ERR_IMPORT_ATTRIBUTE_UNSUPPORTED
#
Added in: v21.0.0, v20.10.0, v18.19.0
An import attribute is not supported by this version of Node.js.
ERR_INCOMPATIBLE_OPTION_PAIR
#
An option pair is incompatible with each other and cannot be used at the same time.
ERR_INPUT_TYPE_NOT_ALLOWED
#
The --input-type flag was used to attempt to execute a file. This flag can only be used with input via --eval, --print, or STDIN.
ERR_INSPECTOR_ALREADY_ACTIVATED
#
While using the node:inspector module, an attempt was made to activate the inspector when it already started to listen on a port. Use inspector.close() before activating it on a different address.
ERR_INSPECTOR_ALREADY_CONNECTED
#
While using the node:inspector module, an attempt was made to connect when the inspector was already connected.
ERR_INSPECTOR_CLOSED
#
While using the node:inspector module, an attempt was made to use the inspector after the session had already closed.
ERR_INSPECTOR_COMMAND
#
An error occurred while issuing a command via the node:inspector module.
ERR_INSPECTOR_NOT_ACTIVE
#
The inspector is not active when inspector.waitForDebugger() is called.
ERR_INSPECTOR_NOT_AVAILABLE
#
The node:inspector module is not available for use.
ERR_INSPECTOR_NOT_CONNECTED
#
While using the node:inspector module, an attempt was made to use the inspector before it was connected.
ERR_INSPECTOR_NOT_WORKER
#
An API was called on the main thread that can only be used from the worker thread.
ERR_INTERNAL_ASSERTION
#
There was a bug in Node.js or incorrect usage of Node.js internals. To fix the error, open an issue at https://github.com/nodejs/node/issues.
ERR_INVALID_ADDRESS
#
The provided address is not understood by the Node.js API.
ERR_INVALID_ADDRESS_FAMILY
#
The provided address family is not understood by the Node.js API.
ERR_INVALID_ARG_TYPE
#
An argument of the wrong type was passed to a Node.js API.
ERR_INVALID_ARG_VALUE
#
An invalid or unsupported value was passed for a given argument.
ERR_INVALID_ASYNC_ID
#
An invalid asyncId or triggerAsyncId was passed using AsyncHooks. An id less than -1 should never happen.
ERR_INVALID_BUFFER_SIZE
#
A swap was performed on a Buffer but its size was not compatible with the operation.
ERR_INVALID_CHAR
#
Invalid characters were detected in headers.
ERR_INVALID_CURSOR_POS
#
A cursor on a given stream cannot be moved to a specified row without a specified column.
ERR_INVALID_FD
#
A file descriptor ('fd') was not valid (e.g. it was a negative value).
ERR_INVALID_FD_TYPE
#
A file descriptor ('fd') type was not valid.
ERR_INVALID_FILE_URL_HOST
#
A Node.js API that consumes file: URLs (such as certain functions in the fs module) encountered a file URL with an incompatible host. This situation can only occur on Unix-like systems where only localhost or an empty host is supported.
ERR_INVALID_FILE_URL_PATH
#
A Node.js API that consumes file: URLs (such as certain functions in the fs module) encountered a file URL with an incompatible path. The exact semantics for determining whether a path can be used is platform-dependent.
ERR_INVALID_HANDLE_TYPE
#
An attempt was made to send an unsupported "handle" over an IPC communication channel to a child process. See subprocess.send() and process.send() for more information.
ERR_INVALID_HTTP_TOKEN
#
An invalid HTTP token was supplied.
ERR_INVALID_IP_ADDRESS
#
An IP address is not valid.
ERR_INVALID_MIME_SYNTAX
#
The syntax of a MIME is not valid.
ERR_INVALID_MODULE
#
Added in: v15.0.0, v14.18.0
An attempt was made to load a module that does not exist or was otherwise not valid.
ERR_INVALID_MODULE_SPECIFIER
#
The imported module string is an invalid URL, package name, or package subpath specifier.
ERR_INVALID_OBJECT_DEFINE_PROPERTY
#
An error occurred while setting an invalid attribute on the property of an object.
ERR_INVALID_PACKAGE_CONFIG
#
An invalid package.json file failed parsing.
ERR_INVALID_PACKAGE_TARGET
#
The package.json "exports" field contains an invalid target mapping value for the attempted module resolution.
ERR_INVALID_PROTOCOL
#
An invalid options.protocol was passed to http.request().
ERR_INVALID_REPL_EVAL_CONFIG
#
Both breakEvalOnSigint and eval options were set in the REPL config, which is not supported.
ERR_INVALID_REPL_INPUT
#
The input may not be used in the REPL. The conditions under which this error is used are described in the REPL documentation.
ERR_INVALID_RETURN_PROPERTY
#
Thrown in case a function option does not provide a valid value for one of its returned object properties on execution.
ERR_INVALID_RETURN_PROPERTY_VALUE
#
Thrown in case a function option does not provide an expected value type for one of its returned object properties on execution.
ERR_INVALID_RETURN_VALUE
#
Thrown in case a function option does not return an expected value type on execution, such as when a function is expected to return a promise.
ERR_INVALID_STATE
#
Added in: v15.0.0
Indicates that an operation cannot be completed due to an invalid state. For instance, an object may have already been destroyed, or may be performing another operation.
ERR_INVALID_SYNC_FORK_INPUT
#
A Buffer, TypedArray, DataView, or string was provided as stdio input to an asynchronous fork. See the documentation for the child_process module for more information.
ERR_INVALID_THIS
#
A Node.js API function was called with an incompatible this value.
const urlSearchParams = new URLSearchParams('foo=bar&baz=new');

const buf = Buffer.alloc(1);
urlSearchParams.has.call(buf, 'foo');
// Throws a TypeError with code 'ERR_INVALID_THIS'
copy
ERR_INVALID_TUPLE
#
An element in the iterable provided to the WHATWG URLSearchParams constructor did not represent a [name, value] tuple – that is, if an element is not iterable, or does not consist of exactly two elements.
ERR_INVALID_TYPESCRIPT_SYNTAX
#
History













The provided TypeScript syntax is not valid.
ERR_INVALID_URI
#
An invalid URI was passed.
ERR_INVALID_URL
#
An invalid URL was passed to the WHATWG URL constructor or the legacy url.parse() to be parsed. The thrown error object typically has an additional property 'input' that contains the URL that failed to parse.
ERR_INVALID_URL_PATTERN
#
An invalid URLPattern was passed to the WHATWG [URLPattern constructor][new URLPattern(input)] to be parsed.
ERR_INVALID_URL_SCHEME
#
An attempt was made to use a URL of an incompatible scheme (protocol) for a specific purpose. It is only used in the WHATWG URL API support in the fs module (which only accepts URLs with 'file' scheme), but may be used in other Node.js APIs as well in the future.
ERR_IPC_CHANNEL_CLOSED
#
An attempt was made to use an IPC communication channel that was already closed.
ERR_IPC_DISCONNECTED
#
An attempt was made to disconnect an IPC communication channel that was already disconnected. See the documentation for the child_process module for more information.
ERR_IPC_ONE_PIPE
#
An attempt was made to create a child Node.js process using more than one IPC communication channel. See the documentation for the child_process module for more information.
ERR_IPC_SYNC_FORK
#
An attempt was made to open an IPC communication channel with a synchronously forked Node.js process. See the documentation for the child_process module for more information.
ERR_IP_BLOCKED
#
IP is blocked by net.BlockList.
ERR_LOADER_CHAIN_INCOMPLETE
#
Added in: v18.6.0, v16.17.0
An ESM loader hook returned without calling next() and without explicitly signaling a short circuit.
ERR_LOAD_SQLITE_EXTENSION
#
Added in: v23.5.0, v22.13.0
An error occurred while loading a SQLite extension.
ERR_MEMORY_ALLOCATION_FAILED
#
An attempt was made to allocate memory (usually in the C++ layer) but it failed.
ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE
#
Added in: v14.5.0, v12.19.0
A message posted to a MessagePort could not be deserialized in the target vm Context. Not all Node.js objects can be successfully instantiated in any context at this time, and attempting to transfer them using postMessage() can fail on the receiving side in that case.
ERR_METHOD_NOT_IMPLEMENTED
#
A method is required but not implemented.
ERR_MISSING_ARGS
#
A required argument of a Node.js API was not passed. This is only used for strict compliance with the API specification (which in some cases may accept func(undefined) but not func()). In most native Node.js APIs, func(undefined) and func() are treated identically, and the ERR_INVALID_ARG_TYPE error code may be used instead.
ERR_MISSING_OPTION
#
For APIs that accept options objects, some options might be mandatory. This code is thrown if a required option is missing.
ERR_MISSING_PASSPHRASE
#
An attempt was made to read an encrypted key without specifying a passphrase.
ERR_MISSING_PLATFORM_FOR_WORKER
#
The V8 platform used by this instance of Node.js does not support creating Workers. This is caused by lack of embedder support for Workers. In particular, this error will not occur with standard builds of Node.js.
ERR_MODULE_NOT_FOUND
#
A module file could not be resolved by the ECMAScript modules loader while attempting an import operation or when loading the program entry point.
ERR_MULTIPLE_CALLBACK
#
A callback was called more than once.
A callback is almost always meant to only be called once as the query can either be fulfilled or rejected but not both at the same time. The latter would be possible by calling a callback more than once.
ERR_NAPI_CONS_FUNCTION
#
While using Node-API, a constructor passed was not a function.
ERR_NAPI_INVALID_DATAVIEW_ARGS
#
While calling napi_create_dataview(), a given offset was outside the bounds of the dataview or offset + length was larger than a length of given buffer.
ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT
#
While calling napi_create_typedarray(), the provided offset was not a multiple of the element size.
ERR_NAPI_INVALID_TYPEDARRAY_LENGTH
#
While calling napi_create_typedarray(), (length * size_of_element) + byte_offset was larger than the length of given buffer.
ERR_NAPI_TSFN_CALL_JS
#
An error occurred while invoking the JavaScript portion of the thread-safe function.
ERR_NAPI_TSFN_GET_UNDEFINED
#
An error occurred while attempting to retrieve the JavaScript undefined value.
ERR_NON_CONTEXT_AWARE_DISABLED
#
A non-context-aware native addon was loaded in a process that disallows them.
ERR_NOT_BUILDING_SNAPSHOT
#
An attempt was made to use operations that can only be used when building V8 startup snapshot even though Node.js isn't building one.
ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION
#
Added in: v21.7.0, v20.12.0
The operation cannot be performed when it's not in a single-executable application.
ERR_NOT_SUPPORTED_IN_SNAPSHOT
#
An attempt was made to perform operations that are not supported when building a startup snapshot.
ERR_NO_CRYPTO
#
An attempt was made to use crypto features while Node.js was not compiled with OpenSSL crypto support.
ERR_NO_ICU
#
An attempt was made to use features that require ICU, but Node.js was not compiled with ICU support.
ERR_NO_TYPESCRIPT
#
Added in: v23.0.0, v22.12.0
An attempt was made to use features that require Native TypeScript support, but Node.js was not compiled with TypeScript support.
ERR_OPERATION_FAILED
#
Added in: v15.0.0
An operation failed. This is typically used to signal the general failure of an asynchronous operation.
ERR_OPTIONS_BEFORE_BOOTSTRAPPING
#
Added in: v23.10.0
An attempt was made to get options before the bootstrapping was completed.
ERR_OUT_OF_RANGE
#
A given value is out of the accepted range.
ERR_PACKAGE_IMPORT_NOT_DEFINED
#
The package.json "imports" field does not define the given internal package specifier mapping.
ERR_PACKAGE_PATH_NOT_EXPORTED
#
The package.json "exports" field does not export the requested subpath. Because exports are encapsulated, private internal modules that are not exported cannot be imported through the package resolution, unless using an absolute URL.
ERR_PARSE_ARGS_INVALID_OPTION_VALUE
#
Added in: v18.3.0, v16.17.0
When strict set to true, thrown by util.parseArgs() if a <boolean> value is provided for an option of type <string>, or if a <string> value is provided for an option of type <boolean>.
ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL
#
Added in: v18.3.0, v16.17.0
Thrown by util.parseArgs(), when a positional argument is provided and allowPositionals is set to false.
ERR_PARSE_ARGS_UNKNOWN_OPTION
#
Added in: v18.3.0, v16.17.0
When strict set to true, thrown by util.parseArgs() if an argument is not configured in options.
ERR_PERFORMANCE_INVALID_TIMESTAMP
#
An invalid timestamp value was provided for a performance mark or measure.
ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS
#
Invalid options were provided for a performance measure.
ERR_PROTO_ACCESS
#
Accessing Object.prototype.__proto__ has been forbidden using --disable-proto=throw. Object.getPrototypeOf and Object.setPrototypeOf should be used to get and set the prototype of an object.
ERR_QUIC_APPLICATION_ERROR
#
Added in: v23.4.0, v22.13.0
Stability: 1 - Experimental
A QUIC application error occurred.
ERR_QUIC_CONNECTION_FAILED
#
Added in: v23.0.0, v22.10.0
Stability: 1 - Experimental
Establishing a QUIC connection failed.
ERR_QUIC_ENDPOINT_CLOSED
#
Added in: v23.0.0, v22.10.0
Stability: 1 - Experimental
A QUIC Endpoint closed with an error.
ERR_QUIC_OPEN_STREAM_FAILED
#
Added in: v23.0.0, v22.10.0
Stability: 1 - Experimental
Opening a QUIC stream failed.
ERR_QUIC_TRANSPORT_ERROR
#
Added in: v23.4.0, v22.13.0
Stability: 1 - Experimental
A QUIC transport error occurred.
ERR_QUIC_VERSION_NEGOTIATION_ERROR
#
Added in: v23.4.0, v22.13.0
Stability: 1 - Experimental
A QUIC session failed because version negotiation is required.
ERR_REQUIRE_ASYNC_MODULE
#
Stability: 1 - Experimental
When trying to require() a ES Module, the module turns out to be asynchronous. That is, it contains top-level await.
To see where the top-level await is, use --experimental-print-required-tla (this would execute the modules before looking for the top-level awaits).
ERR_REQUIRE_CYCLE_MODULE
#
Stability: 1 - Experimental
When trying to require() a ES Module, a CommonJS to ESM or ESM to CommonJS edge participates in an immediate cycle. This is not allowed because ES Modules cannot be evaluated while they are already being evaluated.
To avoid the cycle, the require() call involved in a cycle should not happen at the top-level of either an ES Module (via createRequire()) or a CommonJS module, and should be done lazily in an inner function.
ERR_REQUIRE_ESM
#
History









Stability: 0 - Deprecated
An attempt was made to require() an ES Module.
This error has been deprecated since require() now supports loading synchronous ES modules. When require() encounters an ES module that contains top-level await, it will throw ERR_REQUIRE_ASYNC_MODULE instead.
ERR_SCRIPT_EXECUTION_INTERRUPTED
#
Script execution was interrupted by SIGINT (For example, Ctrl+C was pressed.)
ERR_SCRIPT_EXECUTION_TIMEOUT
#
Script execution timed out, possibly due to bugs in the script being executed.
ERR_SERVER_ALREADY_LISTEN
#
The server.listen() method was called while a net.Server was already listening. This applies to all instances of net.Server, including HTTP, HTTPS, and HTTP/2 Server instances.
ERR_SERVER_NOT_RUNNING
#
The server.close() method was called when a net.Server was not running. This applies to all instances of net.Server, including HTTP, HTTPS, and HTTP/2 Server instances.
ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND
#
Added in: v21.7.0, v20.12.0
A key was passed to single executable application APIs to identify an asset, but no match could be found.
ERR_SOCKET_ALREADY_BOUND
#
An attempt was made to bind a socket that has already been bound.
ERR_SOCKET_BAD_BUFFER_SIZE
#
An invalid (negative) size was passed for either the recvBufferSize or sendBufferSize options in dgram.createSocket().
ERR_SOCKET_BAD_PORT
#
An API function expecting a port >= 0 and < 65536 received an invalid value.
ERR_SOCKET_BAD_TYPE
#
An API function expecting a socket type (udp4 or udp6) received an invalid value.
ERR_SOCKET_BUFFER_SIZE
#
While using dgram.createSocket(), the size of the receive or send Buffer could not be determined.
ERR_SOCKET_CLOSED
#
An attempt was made to operate on an already closed socket.
ERR_SOCKET_CLOSED_BEFORE_CONNECTION
#
When calling net.Socket.write() on a connecting socket and the socket was closed before the connection was established.
ERR_SOCKET_CONNECTION_TIMEOUT
#
The socket was unable to connect to any address returned by the DNS within the allowed timeout when using the family autoselection algorithm.
ERR_SOCKET_DGRAM_IS_CONNECTED
#
A dgram.connect() call was made on an already connected socket.
ERR_SOCKET_DGRAM_NOT_CONNECTED
#
A dgram.disconnect() or dgram.remoteAddress() call was made on a disconnected socket.
ERR_SOCKET_DGRAM_NOT_RUNNING
#
A call was made and the UDP subsystem was not running.
ERR_SOURCE_MAP_CORRUPT
#
The source map could not be parsed because it does not exist, or is corrupt.
ERR_SOURCE_MAP_MISSING_SOURCE
#
A file imported from a source map was not found.
ERR_SOURCE_PHASE_NOT_DEFINED
#
Added in: v24.0.0
The provided module import does not provide a source phase imports representation for source phase import syntax import source x from 'x' or import.source(x).
ERR_SQLITE_ERROR
#
Added in: v22.5.0
An error was returned from SQLite.
ERR_SRI_PARSE
#
A string was provided for a Subresource Integrity check, but was unable to be parsed. Check the format of integrity attributes by looking at the Subresource Integrity specification.
ERR_STREAM_ALREADY_FINISHED
#
A stream method was called that cannot complete because the stream was finished.
ERR_STREAM_CANNOT_PIPE
#
An attempt was made to call stream.pipe() on a Writable stream.
ERR_STREAM_DESTROYED
#
A stream method was called that cannot complete because the stream was destroyed using stream.destroy().
ERR_STREAM_NULL_VALUES
#
An attempt was made to call stream.write() with a null chunk.
ERR_STREAM_PREMATURE_CLOSE
#
An error returned by stream.finished() and stream.pipeline(), when a stream or a pipeline ends non gracefully with no explicit error.
ERR_STREAM_PUSH_AFTER_EOF
#
An attempt was made to call stream.push() after a null(EOF) had been pushed to the stream.
ERR_STREAM_UNABLE_TO_PIPE
#
An attempt was made to pipe to a closed or destroyed stream in a pipeline.
ERR_STREAM_UNSHIFT_AFTER_END_EVENT
#
An attempt was made to call stream.unshift() after the 'end' event was emitted.
ERR_STREAM_WRAP
#
Prevents an abort if a string decoder was set on the Socket or if the decoder is in objectMode.
const Socket = require('node:net').Socket;
const instance = new Socket();

instance.setEncoding('utf8');
copy
ERR_STREAM_WRITE_AFTER_END
#
An attempt was made to call stream.write() after stream.end() has been called.
ERR_STRING_TOO_LONG
#
An attempt has been made to create a string longer than the maximum allowed length.
ERR_SYNTHETIC
#
An artificial error object used to capture the call stack for diagnostic reports.
ERR_SYSTEM_ERROR
#
An unspecified or non-specific system error has occurred within the Node.js process. The error object will have an err.info object property with additional details.
ERR_TEST_FAILURE
#
This error represents a failed test. Additional information about the failure is available via the cause property. The failureType property specifies what the test was doing when the failure occurred.
ERR_TLS_ALPN_CALLBACK_INVALID_RESULT
#
This error is thrown when an ALPNCallback returns a value that is not in the list of ALPN protocols offered by the client.
ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS
#
This error is thrown when creating a TLSServer if the TLS options include both ALPNProtocols and ALPNCallback. These options are mutually exclusive.
ERR_TLS_CERT_ALTNAME_FORMAT
#
This error is thrown by checkServerIdentity if a user-supplied subjectaltname property violates encoding rules. Certificate objects produced by Node.js itself always comply with encoding rules and will never cause this error.
ERR_TLS_CERT_ALTNAME_INVALID
#
While using TLS, the host name/IP of the peer did not match any of the subjectAltNames in its certificate.
ERR_TLS_DH_PARAM_SIZE
#
While using TLS, the parameter offered for the Diffie-Hellman (DH) key-agreement protocol is too small. By default, the key length must be greater than or equal to 1024 bits to avoid vulnerabilities, even though it is strongly recommended to use 2048 bits or larger for stronger security.
ERR_TLS_HANDSHAKE_TIMEOUT
#
A TLS/SSL handshake timed out. In this case, the server must also abort the connection.
ERR_TLS_INVALID_CONTEXT
#
Added in: v13.3.0
The context must be a SecureContext.
ERR_TLS_INVALID_PROTOCOL_METHOD
#
The specified secureProtocol method is invalid. It is either unknown, or disabled because it is insecure.
ERR_TLS_INVALID_PROTOCOL_VERSION
#
Valid TLS protocol versions are 'TLSv1', 'TLSv1.1', or 'TLSv1.2'.
ERR_TLS_INVALID_STATE
#
Added in: v13.10.0, v12.17.0
The TLS socket must be connected and securely established. Ensure the 'secure' event is emitted before continuing.
ERR_TLS_PROTOCOL_VERSION_CONFLICT
#
Attempting to set a TLS protocol minVersion or maxVersion conflicts with an attempt to set the secureProtocol explicitly. Use one mechanism or the other.
ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED
#
Failed to set PSK identity hint. Hint may be too long.
ERR_TLS_RENEGOTIATION_DISABLED
#
An attempt was made to renegotiate TLS on a socket instance with renegotiation disabled.
ERR_TLS_REQUIRED_SERVER_NAME
#
While using TLS, the server.addContext() method was called without providing a host name in the first parameter.
ERR_TLS_SESSION_ATTACK
#
An excessive amount of TLS renegotiations is detected, which is a potential vector for denial-of-service attacks.
ERR_TLS_SNI_FROM_SERVER
#
An attempt was made to issue Server Name Indication from a TLS server-side socket, which is only valid from a client.
ERR_TRACE_EVENTS_CATEGORY_REQUIRED
#
The trace_events.createTracing() method requires at least one trace event category.
ERR_TRACE_EVENTS_UNAVAILABLE
#
The node:trace_events module could not be loaded because Node.js was compiled with the --without-v8-platform flag.
ERR_TRAILING_JUNK_AFTER_STREAM_END
#
Trailing junk found after the end of the compressed stream. This error is thrown when extra, unexpected data is detected after the end of a compressed stream (for example, in zlib or gzip decompression).
ERR_TRANSFORM_ALREADY_TRANSFORMING
#
A Transform stream finished while it was still transforming.
ERR_TRANSFORM_WITH_LENGTH_0
#
A Transform stream finished with data still in the write buffer.
ERR_TTY_INIT_FAILED
#
The initialization of a TTY failed due to a system error.
ERR_UNAVAILABLE_DURING_EXIT
#
Function was called within a process.on('exit') handler that shouldn't be called within process.on('exit') handler.
ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET
#
process.setUncaughtExceptionCaptureCallback() was called twice, without first resetting the callback to null.
This error is designed to prevent accidentally overwriting a callback registered from another module.
ERR_UNESCAPED_CHARACTERS
#
A string that contained unescaped characters was received.
ERR_UNHANDLED_ERROR
#
An unhandled error occurred (for instance, when an 'error' event is emitted by an EventEmitter but an 'error' handler is not registered).
ERR_UNKNOWN_BUILTIN_MODULE
#
Used to identify a specific kind of internal Node.js error that should not typically be triggered by user code. Instances of this error point to an internal bug within the Node.js binary itself.
ERR_UNKNOWN_CREDENTIAL
#
A Unix group or user identifier that does not exist was passed.
ERR_UNKNOWN_ENCODING
#
An invalid or unknown encoding option was passed to an API.
ERR_UNKNOWN_FILE_EXTENSION
#
An attempt was made to load a module with an unknown or unsupported file extension.
ERR_UNKNOWN_MODULE_FORMAT
#
An attempt was made to load a module with an unknown or unsupported format.
ERR_UNKNOWN_SIGNAL
#
An invalid or unknown process signal was passed to an API expecting a valid signal (such as subprocess.kill()).
ERR_UNSUPPORTED_DIR_IMPORT
#
import a directory URL is unsupported. Instead, self-reference a package using its name and define a custom subpath in the "exports" field of the package.json file.
import './'; // unsupported
import './index.js'; // supported
import 'package-name'; // supported
copy
ERR_UNSUPPORTED_ESM_URL_SCHEME
#
import with URL schemes other than file and data is unsupported.
ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING
#
Added in: v22.6.0
Type stripping is not supported for files descendent of a node_modules directory.
ERR_UNSUPPORTED_RESOLVE_REQUEST
#
An attempt was made to resolve an invalid module referrer. This can happen when importing or calling import.meta.resolve() with either:
a bare specifier that is not a builtin module from a module whose URL scheme is not file.
a relative URL from a module whose URL scheme is not a special scheme.
try {
  // Trying to import the package 'bare-specifier' from a `data:` URL module:
  await import('data:text/javascript,import "bare-specifier"');
} catch (e) {
  console.log(e.code); // ERR_UNSUPPORTED_RESOLVE_REQUEST
}
copy
ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX
#
Added in: v23.7.0, v22.14.0
The provided TypeScript syntax is unsupported. This could happen when using TypeScript syntax that requires transformation with type-stripping.
ERR_USE_AFTER_CLOSE
#
An attempt was made to use something that was already closed.
ERR_VALID_PERFORMANCE_ENTRY_TYPE
#
While using the Performance Timing API (perf_hooks), no valid performance entry types are found.
ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING
#
A dynamic import callback was not specified.
ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG
#
A dynamic import callback was invoked without --experimental-vm-modules.
ERR_VM_MODULE_ALREADY_LINKED
#
The module attempted to be linked is not eligible for linking, because of one of the following reasons:
It has already been linked (linkingStatus is 'linked')
It is being linked (linkingStatus is 'linking')
Linking has failed for this module (linkingStatus is 'errored')
ERR_VM_MODULE_CACHED_DATA_REJECTED
#
The cachedData option passed to a module constructor is invalid.
ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA
#
Cached data cannot be created for modules which have already been evaluated.
ERR_VM_MODULE_DIFFERENT_CONTEXT
#
The module being returned from the linker function is from a different context than the parent module. Linked modules must share the same context.
ERR_VM_MODULE_LINK_FAILURE
#
The module was unable to be linked due to a failure.
ERR_VM_MODULE_NOT_MODULE
#
The fulfilled value of a linking promise is not a vm.Module object.
ERR_VM_MODULE_STATUS
#
The current module's status does not allow for this operation. The specific meaning of the error depends on the specific function.
ERR_WASI_ALREADY_STARTED
#
The WASI instance has already started.
ERR_WASI_NOT_STARTED
#
The WASI instance has not been started.
ERR_WEBASSEMBLY_RESPONSE
#
Added in: v18.1.0
The Response that has been passed to WebAssembly.compileStreaming or to WebAssembly.instantiateStreaming is not a valid WebAssembly response.
ERR_WORKER_INIT_FAILED
#
The Worker initialization failed.
ERR_WORKER_INVALID_EXEC_ARGV
#
The execArgv option passed to the Worker constructor contains invalid flags.
ERR_WORKER_MESSAGING_ERRORED
#
Added in: v22.5.0
Stability: 1.1 - Active development
The destination thread threw an error while processing a message sent via postMessageToThread().
ERR_WORKER_MESSAGING_FAILED
#
Added in: v22.5.0
Stability: 1.1 - Active development
The thread requested in postMessageToThread() is invalid or has no workerMessage listener.
ERR_WORKER_MESSAGING_SAME_THREAD
#
Added in: v22.5.0
Stability: 1.1 - Active development
The thread id requested in postMessageToThread() is the current thread id.
ERR_WORKER_MESSAGING_TIMEOUT
#
Added in: v22.5.0
Stability: 1.1 - Active development
Sending a message via postMessageToThread() timed out.
ERR_WORKER_NOT_RUNNING
#
An operation failed because the Worker instance is not currently running.
ERR_WORKER_OUT_OF_MEMORY
#
The Worker instance terminated because it reached its memory limit.
ERR_WORKER_PATH
#
The path for the main script of a worker is neither an absolute path nor a relative path starting with ./ or ../.
ERR_WORKER_UNSERIALIZABLE_ERROR
#
All attempts at serializing an uncaught exception from a worker thread failed.
ERR_WORKER_UNSUPPORTED_OPERATION
#
The requested functionality is not supported in worker threads.
ERR_ZLIB_INITIALIZATION_FAILED
#
Creation of a zlib object failed due to incorrect configuration.
ERR_ZSTD_INVALID_PARAM
#
An invalid parameter key was passed during construction of a Zstd stream.
HPE_CHUNK_EXTENSIONS_OVERFLOW
#
Added in: v21.6.2, v20.11.1, v18.19.1
Too much data was received for a chunk extensions. In order to protect against malicious or malconfigured clients, if more than 16 KiB of data is received then an Error with this code will be emitted.
HPE_HEADER_OVERFLOW
#
History









Too much HTTP header data was received. In order to protect against malicious or malconfigured clients, if more than maxHeaderSize of HTTP header data is received then HTTP parsing will abort without a request or response object being created, and an Error with this code will be emitted.
HPE_UNEXPECTED_CONTENT_LENGTH
#
Server is sending both a Content-Length header and Transfer-Encoding: chunked.
Transfer-Encoding: chunked allows the server to maintain an HTTP persistent connection for dynamically generated content. In this case, the Content-Length HTTP header cannot be used.
Use Content-Length or Transfer-Encoding: chunked.
MODULE_NOT_FOUND
#
History









A module file could not be resolved by the CommonJS modules loader while attempting a require() operation or when loading the program entry point.
Legacy Node.js error codes
#
Stability: 0 - Deprecated. These error codes are either inconsistent, or have been removed.
ERR_CANNOT_TRANSFER_OBJECT
#
Added in: v10.5.0Removed in: v12.5.0
The value passed to postMessage() contained an object that is not supported for transferring.
ERR_CPU_USAGE
#
Removed in: v15.0.0
The native call from process.cpuUsage could not be processed.
ERR_CRYPTO_HASH_DIGEST_NO_UTF16
#
Added in: v9.0.0Removed in: v12.12.0
The UTF-16 encoding was used with hash.digest(). While the hash.digest() method does allow an encoding argument to be passed in, causing the method to return a string rather than a Buffer, the UTF-16 encoding (e.g. ucs or utf16le) is not supported.
ERR_CRYPTO_SCRYPT_INVALID_PARAMETER
#
Removed in: v23.0.0
An incompatible combination of options was passed to crypto.scrypt() or crypto.scryptSync(). New versions of Node.js use the error code ERR_INCOMPATIBLE_OPTION_PAIR instead, which is consistent with other APIs.
ERR_FS_INVALID_SYMLINK_TYPE
#
Removed in: v23.0.0
An invalid symlink type was passed to the fs.symlink() or fs.symlinkSync() methods.
ERR_HTTP2_FRAME_ERROR
#
Added in: v9.0.0Removed in: v10.0.0
Used when a failure occurs sending an individual frame on the HTTP/2 session.
ERR_HTTP2_HEADERS_OBJECT
#
Added in: v9.0.0Removed in: v10.0.0
Used when an HTTP/2 Headers Object is expected.
ERR_HTTP2_HEADER_REQUIRED
#
Added in: v9.0.0Removed in: v10.0.0
Used when a required header is missing in an HTTP/2 message.
ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND
#
Added in: v9.0.0Removed in: v10.0.0
HTTP/2 informational headers must only be sent prior to calling the Http2Stream.prototype.respond() method.
ERR_HTTP2_STREAM_CLOSED
#
Added in: v9.0.0Removed in: v10.0.0
Used when an action has been performed on an HTTP/2 Stream that has already been closed.
ERR_HTTP_INVALID_CHAR
#
Added in: v9.0.0Removed in: v10.0.0
Used when an invalid character is found in an HTTP response status message (reason phrase).
ERR_IMPORT_ASSERTION_TYPE_FAILED
#
Added in: v17.1.0, v16.14.0Removed in: v21.1.0
An import assertion has failed, preventing the specified module to be imported.
ERR_IMPORT_ASSERTION_TYPE_MISSING
#
Added in: v17.1.0, v16.14.0Removed in: v21.1.0
An import assertion is missing, preventing the specified module to be imported.
ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED
#
Added in: v17.1.0, v16.14.0Removed in: v21.1.0
An import attribute is not supported by this version of Node.js.
ERR_INDEX_OUT_OF_RANGE
#
Added in: v10.0.0Removed in: v11.0.0
A given index was out of the accepted range (e.g. negative offsets).
ERR_INVALID_OPT_VALUE
#
Added in: v8.0.0Removed in: v15.0.0
An invalid or unexpected value was passed in an options object.
ERR_INVALID_OPT_VALUE_ENCODING
#
Added in: v9.0.0Removed in: v15.0.0
An invalid or unknown file encoding was passed.
ERR_INVALID_PERFORMANCE_MARK
#
Added in: v8.5.0Removed in: v16.7.0
While using the Performance Timing API (perf_hooks), a performance mark is invalid.
ERR_INVALID_TRANSFER_OBJECT
#
History













An invalid transfer object was passed to postMessage().
ERR_MANIFEST_ASSERT_INTEGRITY
#
Removed in: v22.2.0
An attempt was made to load a resource, but the resource did not match the integrity defined by the policy manifest. See the documentation for policy manifests for more information.
ERR_MANIFEST_DEPENDENCY_MISSING
#
Removed in: v22.2.0
An attempt was made to load a resource, but the resource was not listed as a dependency from the location that attempted to load it. See the documentation for policy manifests for more information.
ERR_MANIFEST_INTEGRITY_MISMATCH
#
Removed in: v22.2.0
An attempt was made to load a policy manifest, but the manifest had multiple entries for a resource which did not match each other. Update the manifest entries to match in order to resolve this error. See the documentation for policy manifests for more information.
ERR_MANIFEST_INVALID_RESOURCE_FIELD
#
Removed in: v22.2.0
A policy manifest resource had an invalid value for one of its fields. Update the manifest entry to match in order to resolve this error. See the documentation for policy manifests for more information.
ERR_MANIFEST_INVALID_SPECIFIER
#
Removed in: v22.2.0
A policy manifest resource had an invalid value for one of its dependency mappings. Update the manifest entry to match to resolve this error. See the documentation for policy manifests for more information.
ERR_MANIFEST_PARSE_POLICY
#
Removed in: v22.2.0
An attempt was made to load a policy manifest, but the manifest was unable to be parsed. See the documentation for policy manifests for more information.
ERR_MANIFEST_TDZ
#
Removed in: v22.2.0
An attempt was made to read from a policy manifest, but the manifest initialization has not yet taken place. This is likely a bug in Node.js.
ERR_MANIFEST_UNKNOWN_ONERROR
#
Removed in: v22.2.0
A policy manifest was loaded, but had an unknown value for its "onerror" behavior. See the documentation for policy manifests for more information.
ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST
#
Removed in: v15.0.0
This error code was replaced by ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST in Node.js v15.0.0, because it is no longer accurate as other types of transferable objects also exist now.
ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST
#
History

















An object that needs to be explicitly listed in the transferList argument is in the object passed to a postMessage() call, but is not provided in the transferList for that call. Usually, this is a MessagePort.
In Node.js versions prior to v15.0.0, the error code being used here was ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST. However, the set of transferable object types has been expanded to cover more types than MessagePort.
ERR_NAPI_CONS_PROTOTYPE_OBJECT
#
Added in: v9.0.0Removed in: v10.0.0
Used by the Node-API when Constructor.prototype is not an object.
ERR_NAPI_TSFN_START_IDLE_LOOP
#
Added in: v10.6.0, v8.16.0Removed in: v14.2.0, v12.17.0
On the main thread, values are removed from the queue associated with the thread-safe function in an idle loop. This error indicates that an error has occurred when attempting to start the loop.
ERR_NAPI_TSFN_STOP_IDLE_LOOP
#
Added in: v10.6.0, v8.16.0Removed in: v14.2.0, v12.17.0
Once no more items are left in the queue, the idle loop must be suspended. This error indicates that the idle loop has failed to stop.
ERR_NO_LONGER_SUPPORTED
#
A Node.js API was called in an unsupported manner, such as Buffer.write(string, encoding, offset[, length]).
ERR_OUTOFMEMORY
#
Added in: v9.0.0Removed in: v10.0.0
Used generically to identify that an operation caused an out of memory condition.
ERR_PARSE_HISTORY_DATA
#
Added in: v9.0.0Removed in: v10.0.0
The node:repl module was unable to parse data from the REPL history file.
ERR_SOCKET_CANNOT_SEND
#
Added in: v9.0.0Removed in: v14.0.0
Data could not be sent on a socket.
ERR_STDERR_CLOSE
#
History













An attempt was made to close the process.stderr stream. By design, Node.js does not allow stdout or stderr streams to be closed by user code.
ERR_STDOUT_CLOSE
#
History













An attempt was made to close the process.stdout stream. By design, Node.js does not allow stdout or stderr streams to be closed by user code.
ERR_STREAM_READ_NOT_IMPLEMENTED
#
Added in: v9.0.0Removed in: v10.0.0
Used when an attempt is made to use a readable stream that has not implemented readable._read().
ERR_TAP_LEXER_ERROR
#
An error representing a failing lexer state.
ERR_TAP_PARSER_ERROR
#
An error representing a failing parser state. Additional information about the token causing the error is available via the cause property.
ERR_TAP_VALIDATION_ERROR
#
This error represents a failed TAP validation.
ERR_TLS_RENEGOTIATION_FAILED
#
Added in: v9.0.0Removed in: v10.0.0
Used when a TLS renegotiation request has failed in a non-specific way.
ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER
#
Added in: v10.5.0Removed in: v14.0.0
A SharedArrayBuffer whose memory is not managed by the JavaScript engine or by Node.js was encountered during serialization. Such a SharedArrayBuffer cannot be serialized.
This can only happen when native addons create SharedArrayBuffers in "externalized" mode, or put existing SharedArrayBuffer into externalized mode.
ERR_UNKNOWN_STDIN_TYPE
#
Added in: v8.0.0Removed in: v11.7.0
An attempt was made to launch a Node.js process with an unknown stdin file type. This error is usually an indication of a bug within Node.js itself, although it is possible for user code to trigger it.
ERR_UNKNOWN_STREAM_TYPE
#
Added in: v8.0.0Removed in: v11.7.0
An attempt was made to launch a Node.js process with an unknown stdout or stderr file type. This error is usually an indication of a bug within Node.js itself, although it is possible for user code to trigger it.
ERR_V8BREAKITERATOR
#
The V8 BreakIterator API was used but the full ICU data set is not installed.
ERR_VALUE_OUT_OF_RANGE
#
Added in: v9.0.0Removed in: v10.0.0
Used when a given value is out of the accepted range.
ERR_VM_MODULE_LINKING_ERRORED
#
Added in: v10.0.0Removed in: v18.1.0, v16.17.0
The linker function returned a module for which linking has failed.
ERR_VM_MODULE_NOT_LINKED
#
The module must be successfully linked before instantiation.
ERR_WORKER_UNSUPPORTED_EXTENSION
#
Added in: v11.0.0Removed in: v16.9.0
The pathname used for the main script of a worker has an unknown file extension.
ERR_ZLIB_BINDING_CLOSED
#
Added in: v9.0.0Removed in: v10.0.0
Used when an attempt is made to use a zlib object after it has already been closed.
OpenSSL Error Codes
#
Time Validity Errors
#
CERT_NOT_YET_VALID
#
The certificate is not yet valid: the notBefore date is after the current time.
CERT_HAS_EXPIRED
#
The certificate has expired: the notAfter date is before the current time.
CRL_NOT_YET_VALID
#
The certificate revocation list (CRL) has a future issue date.
CRL_HAS_EXPIRED
#
The certificate revocation list (CRL) has expired.
CERT_REVOKED
#
The certificate has been revoked; it is on a certificate revocation list (CRL).
Trust or Chain Related Errors
#
UNABLE_TO_GET_ISSUER_CERT
#
The issuer certificate of a looked up certificate could not be found. This normally means the list of trusted certificates is not complete.
UNABLE_TO_GET_ISSUER_CERT_LOCALLY
#
The certificate’s issuer is not known. This is the case if the issuer is not included in the trusted certificate list.
DEPTH_ZERO_SELF_SIGNED_CERT
#
The passed certificate is self-signed and the same certificate cannot be found in the list of trusted certificates.
SELF_SIGNED_CERT_IN_CHAIN
#
The certificate’s issuer is not known. This is the case if the issuer is not included in the trusted certificate list.
CERT_CHAIN_TOO_LONG
#
The certificate chain length is greater than the maximum depth.
UNABLE_TO_GET_CRL
#
The CRL reference by the certificate could not be found.
UNABLE_TO_VERIFY_LEAF_SIGNATURE
#
No signatures could be verified because the chain contains only one certificate and it is not self signed.
CERT_UNTRUSTED
#
The root certificate authority (CA) is not marked as trusted for the specified purpose.
Basic Extension Errors
#
INVALID_CA
#
A CA certificate is invalid. Either it is not a CA or its extensions are not consistent with the supplied purpose.
PATH_LENGTH_EXCEEDED
#
The basicConstraints pathlength parameter has been exceeded.
Name Related Errors
#
HOSTNAME_MISMATCH
#
Certificate does not match provided name.
Usage and Policy Errors
#
INVALID_PURPOSE
#
The supplied certificate cannot be used for the specified purpose.
CERT_REJECTED
#
The root CA is marked to reject the specified purpose.
Formatting Errors
#
CERT_SIGNATURE_FAILURE
#
The signature of the certificate is invalid.
CRL_SIGNATURE_FAILURE
#
The signature of the certificate revocation list (CRL) is invalid.
ERROR_IN_CERT_NOT_BEFORE_FIELD
#
The certificate notBefore field contains an invalid time.
ERROR_IN_CERT_NOT_AFTER_FIELD
#
The certificate notAfter field contains an invalid time.
ERROR_IN_CRL_LAST_UPDATE_FIELD
#
The CRL lastUpdate field contains an invalid time.
ERROR_IN_CRL_NEXT_UPDATE_FIELD
#
The CRL nextUpdate field contains an invalid time.
UNABLE_TO_DECRYPT_CERT_SIGNATURE
#
The certificate signature could not be decrypted. This means that the actual signature value could not be determined rather than it not matching the expected value, this is only meaningful for RSA keys.
UNABLE_TO_DECRYPT_CRL_SIGNATURE
#
The certificate revocation list (CRL) signature could not be decrypted: this means that the actual signature value could not be determined rather than it not matching the expected value.
UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY
#
The public key in the certificate SubjectPublicKeyInfo could not be read.
Other OpenSSL Errors
#
OUT_OF_MEM
#
An error occurred trying to allocate memory. This should never happen.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Events
Passing arguments and this to listeners
Asynchronous vs. synchronous
Handling events only once
Error events
Capture rejections of promises
Class: EventEmitter
Event: 'newListener'
Event: 'removeListener'
emitter.addListener(eventName, listener)
emitter.emit(eventName[, ...args])
emitter.eventNames()
emitter.getMaxListeners()
emitter.listenerCount(eventName[, listener])
emitter.listeners(eventName)
emitter.off(eventName, listener)
emitter.on(eventName, listener)
emitter.once(eventName, listener)
emitter.prependListener(eventName, listener)
emitter.prependOnceListener(eventName, listener)
emitter.removeAllListeners([eventName])
emitter.removeListener(eventName, listener)
emitter.setMaxListeners(n)
emitter.rawListeners(eventName)
emitter[Symbol.for('nodejs.rejection')](err, eventName[, ...args])
events.defaultMaxListeners
events.errorMonitor
events.getEventListeners(emitterOrTarget, eventName)
events.getMaxListeners(emitterOrTarget)
events.once(emitter, name[, options])
Awaiting multiple events emitted on process.nextTick()
events.captureRejections
events.captureRejectionSymbol
events.listenerCount(emitter, eventName)
events.on(emitter, eventName[, options])
events.setMaxListeners(n[, ...eventTargets])
events.addAbortListener(signal, listener)
Class: events.EventEmitterAsyncResource extends EventEmitter
new events.EventEmitterAsyncResource([options])
eventemitterasyncresource.asyncId
eventemitterasyncresource.asyncResource
eventemitterasyncresource.emitDestroy()
eventemitterasyncresource.triggerAsyncId
EventTarget and Event API
Node.js EventTarget vs. DOM EventTarget
NodeEventTarget vs. EventEmitter
Event listener
EventTarget error handling
Class: Event
event.bubbles
event.cancelBubble
event.cancelable
event.composed
event.composedPath()
event.currentTarget
event.defaultPrevented
event.eventPhase
event.initEvent(type[, bubbles[, cancelable]])
event.isTrusted
event.preventDefault()
event.returnValue
event.srcElement
event.stopImmediatePropagation()
event.stopPropagation()
event.target
event.timeStamp
event.type
Class: EventTarget
eventTarget.addEventListener(type, listener[, options])
eventTarget.dispatchEvent(event)
eventTarget.removeEventListener(type, listener[, options])
Class: CustomEvent
event.detail
Class: NodeEventTarget
nodeEventTarget.addListener(type, listener)
nodeEventTarget.emit(type, arg)
nodeEventTarget.eventNames()
nodeEventTarget.listenerCount(type)
nodeEventTarget.setMaxListeners(n)
nodeEventTarget.getMaxListeners()
nodeEventTarget.off(type, listener[, options])
nodeEventTarget.on(type, listener)
nodeEventTarget.once(type, listener)
nodeEventTarget.removeAllListeners([type])
nodeEventTarget.removeListener(type, listener[, options])
Events
#
Stability: 2 - Stable
Source Code: lib/events.js
Much of the Node.js core API is built around an idiomatic asynchronous event-driven architecture in which certain kinds of objects (called "emitters") emit named events that cause Function objects ("listeners") to be called.
For instance: a net.Server object emits an event each time a peer connects to it; a fs.ReadStream emits an event when the file is opened; a stream emits an event whenever data is available to be read.
All objects that emit events are instances of the EventEmitter class. These objects expose an eventEmitter.on() function that allows one or more functions to be attached to named events emitted by the object. Typically, event names are camel-cased strings but any valid JavaScript property key can be used.
When the EventEmitter object emits an event, all of the functions attached to that specific event are called synchronously. Any values returned by the called listeners are ignored and discarded.
The following example shows a simple EventEmitter instance with a single listener. The eventEmitter.on() method is used to register listeners, while the eventEmitter.emit() method is used to trigger the event.
const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
copy
Passing arguments and this to listeners
#
The eventEmitter.emit() method allows an arbitrary set of arguments to be passed to the listener functions. Keep in mind that when an ordinary listener function is called, the standard this keyword is intentionally set to reference the EventEmitter instance to which the listener is attached.
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     Symbol(shapeMode): false,
  //     Symbol(kCapture): false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
copy
It is possible to use ES6 Arrow Functions as listeners, however, when doing so, the this keyword will no longer reference the EventEmitter instance:
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b {}
});
myEmitter.emit('event', 'a', 'b');
copy
Asynchronous vs. synchronous
#
The EventEmitter calls all listeners synchronously in the order in which they were registered. This ensures the proper sequencing of events and helps avoid race conditions and logic errors. When appropriate, listener functions can switch to an asynchronous mode of operation using the setImmediate() or process.nextTick() methods:
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
copy
Handling events only once
#
When a listener is registered using the eventEmitter.on() method, that listener is invoked every time the named event is emitted.
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
copy
Using the eventEmitter.once() method, it is possible to register a listener that is called at most once for a particular event. Once the event is emitted, the listener is unregistered and then called.
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
copy
Error events
#
When an error occurs within an EventEmitter instance, the typical action is for an 'error' event to be emitted. These are treated as special cases within Node.js.
If an EventEmitter does not have at least one listener registered for the 'error' event, and an 'error' event is emitted, the error is thrown, a stack trace is printed, and the Node.js process exits.
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Throws and crashes Node.js
copy
To guard against crashing the Node.js process the domain module can be used. (Note, however, that the node:domain module is deprecated.)
As a best practice, listeners should always be added for the 'error' events.
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Prints: whoops! there was an error
copy
It is possible to monitor 'error' events without consuming the emitted error by installing a listener using the symbol events.errorMonitor.
const { EventEmitter, errorMonitor } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Still throws and crashes Node.js
copy
Capture rejections of promises
#
Using async functions with event handlers is problematic, because it can lead to an unhandled rejection in case of a thrown exception:
const EventEmitter = require('node:events');
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
copy
The captureRejections option in the EventEmitter constructor or the global setting change this behavior, installing a .then(undefined, handler) handler on the Promise. This handler routes the exception asynchronously to the Symbol.for('nodejs.rejection') method if there is one, or to 'error' event handler if there is none.
const EventEmitter = require('node:events');
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
copy
Setting events.captureRejections = true will change the default for all new instances of EventEmitter.
const events = require('node:events');
events.captureRejections = true;
const ee1 = new events.EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
copy
The 'error' events that are generated by the captureRejections behavior do not have a catch handler to avoid infinite error loops: the recommendation is to not use async functions as 'error' event handlers.
Class: EventEmitter
#
History













The EventEmitter class is defined and exposed by the node:events module:
const EventEmitter = require('node:events');
copy
All EventEmitters emit the event 'newListener' when new listeners are added and 'removeListener' when existing listeners are removed.
It supports the following option:
captureRejections <boolean> It enables automatic capturing of promise rejection. Default: false.
Event: 'newListener'
#
Added in: v0.1.26
eventName <string> | <symbol> The name of the event being listened for
listener <Function> The event handler function
The EventEmitter instance will emit its own 'newListener' event before a listener is added to its internal array of listeners.
Listeners registered for the 'newListener' event are passed the event name and a reference to the listener being added.
The fact that the event is triggered before adding the listener has a subtle but important side effect: any additional listeners registered to the same name within the 'newListener' callback are inserted before the listener that is in the process of being added.
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Only do this once so we don't loop forever
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Insert a new listener in front
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Prints:
//   B
//   A
copy
Event: 'removeListener'
#
History













eventName <string> | <symbol> The event name
listener <Function> The event handler function
The 'removeListener' event is emitted after the listener is removed.
emitter.addListener(eventName, listener)
#
Added in: v0.1.26
eventName <string> | <symbol>
listener <Function>
Alias for emitter.on(eventName, listener).
emitter.emit(eventName[, ...args])
#
Added in: v0.1.26
eventName <string> | <symbol>
...args <any>
Returns: <boolean>
Synchronously calls each of the listeners registered for the event named eventName, in the order they were registered, passing the supplied arguments to each.
Returns true if the event had listeners, false otherwise.
const EventEmitter = require('node:events');
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
copy
emitter.eventNames()
#
Added in: v6.0.0
Returns: <string[]> | <symbol[]>
Returns an array listing the events for which the emitter has registered listeners.
const EventEmitter = require('node:events');

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
copy
emitter.getMaxListeners()
#
Added in: v1.0.0
Returns: <integer>
Returns the current max listener value for the EventEmitter which is either set by emitter.setMaxListeners(n) or defaults to events.defaultMaxListeners.
emitter.listenerCount(eventName[, listener])
#
History













eventName <string> | <symbol> The name of the event being listened for
listener <Function> The event handler function
Returns: <integer>
Returns the number of listeners listening for the event named eventName. If listener is provided, it will return how many times the listener is found in the list of the listeners of the event.
emitter.listeners(eventName)
#
History













eventName <string> | <symbol>
Returns: <Function[]>
Returns a copy of the array of listeners for the event named eventName.
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
copy
emitter.off(eventName, listener)
#
Added in: v10.0.0
eventName <string> | <symbol>
listener <Function>
Returns: <EventEmitter>
Alias for emitter.removeListener().
emitter.on(eventName, listener)
#
Added in: v0.1.101
eventName <string> | <symbol> The name of the event.
listener <Function> The callback function
Returns: <EventEmitter>
Adds the listener function to the end of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times.
server.on('connection', (stream) => {
  console.log('someone connected!');
});
copy
Returns a reference to the EventEmitter, so that calls can be chained.
By default, event listeners are invoked in the order they are added. The emitter.prependListener() method can be used as an alternative to add the event listener to the beginning of the listeners array.
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
copy
emitter.once(eventName, listener)
#
Added in: v0.3.0
eventName <string> | <symbol> The name of the event.
listener <Function> The callback function
Returns: <EventEmitter>
Adds a one-time listener function for the event named eventName. The next time eventName is triggered, this listener is removed and then invoked.
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
copy
Returns a reference to the EventEmitter, so that calls can be chained.
By default, event listeners are invoked in the order they are added. The emitter.prependOnceListener() method can be used as an alternative to add the event listener to the beginning of the listeners array.
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
copy
emitter.prependListener(eventName, listener)
#
Added in: v6.0.0
eventName <string> | <symbol> The name of the event.
listener <Function> The callback function
Returns: <EventEmitter>
Adds the listener function to the beginning of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times.
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
copy
Returns a reference to the EventEmitter, so that calls can be chained.
emitter.prependOnceListener(eventName, listener)
#
Added in: v6.0.0
eventName <string> | <symbol> The name of the event.
listener <Function> The callback function
Returns: <EventEmitter>
Adds a one-time listener function for the event named eventName to the beginning of the listeners array. The next time eventName is triggered, this listener is removed, and then invoked.
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
copy
Returns a reference to the EventEmitter, so that calls can be chained.
emitter.removeAllListeners([eventName])
#
Added in: v0.1.26
eventName <string> | <symbol>
Returns: <EventEmitter>
Removes all listeners, or those of the specified eventName.
It is bad practice to remove listeners added elsewhere in the code, particularly when the EventEmitter instance was created by some other component or module (e.g. sockets or file streams).
Returns a reference to the EventEmitter, so that calls can be chained.
emitter.removeListener(eventName, listener)
#
Added in: v0.1.26
eventName <string> | <symbol>
listener <Function>
Returns: <EventEmitter>
Removes the specified listener from the listener array for the event named eventName.
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
copy
removeListener() will remove, at most, one instance of a listener from the listener array. If any single listener has been added multiple times to the listener array for the specified eventName, then removeListener() must be called multiple times to remove each instance.
Once an event is emitted, all listeners attached to it at the time of emitting are called in order. This implies that any removeListener() or removeAllListeners() calls after emitting and before the last listener finishes execution will not remove them from emit() in progress. Subsequent events behave as expected.
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
copy
Because listeners are managed using an internal array, calling this will change the position indexes of any listener registered after the listener being removed. This will not impact the order in which listeners are called, but it means that any copies of the listener array as returned by the emitter.listeners() method will need to be recreated.
When a single function has been added as a handler multiple times for a single event (as in the example below), removeListener() will remove the most recently added instance. In the example the once('ping') listener is removed:
const EventEmitter = require('node:events');
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
copy
Returns a reference to the EventEmitter, so that calls can be chained.
emitter.setMaxListeners(n)
#
Added in: v0.3.5
n <integer>
Returns: <EventEmitter>
By default EventEmitters will print a warning if more than 10 listeners are added for a particular event. This is a useful default that helps finding memory leaks. The emitter.setMaxListeners() method allows the limit to be modified for this specific EventEmitter instance. The value can be set to Infinity (or 0) to indicate an unlimited number of listeners.
Returns a reference to the EventEmitter, so that calls can be chained.
emitter.rawListeners(eventName)
#
Added in: v9.4.0
eventName <string> | <symbol>
Returns: <Function[]>
Returns a copy of the array of listeners for the event named eventName, including any wrappers (such as those created by .once()).
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
copy
emitter[Symbol.for('nodejs.rejection')](err, eventName[, ...args])
#
History













err Error
eventName <string> | <symbol>
...args <any>
The Symbol.for('nodejs.rejection') method is called in case a promise rejection happens when emitting an event and captureRejections is enabled on the emitter. It is possible to use events.captureRejectionSymbol in place of Symbol.for('nodejs.rejection').
const { EventEmitter, captureRejectionSymbol } = require('node:events');

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
copy
events.defaultMaxListeners
#
Added in: v0.11.2
By default, a maximum of 10 listeners can be registered for any single event. This limit can be changed for individual EventEmitter instances using the emitter.setMaxListeners(n) method. To change the default for all EventEmitter instances, the events.defaultMaxListeners property can be used. If this value is not a positive number, a RangeError is thrown.
Take caution when setting the events.defaultMaxListeners because the change affects all EventEmitter instances, including those created before the change is made. However, calling emitter.setMaxListeners(n) still has precedence over events.defaultMaxListeners.
This is not a hard limit. The EventEmitter instance will allow more listeners to be added but will output a trace warning to stderr indicating that a "possible EventEmitter memory leak" has been detected. For any single EventEmitter, the emitter.getMaxListeners() and emitter.setMaxListeners() methods can be used to temporarily avoid this warning:
defaultMaxListeners has no effect on AbortSignal instances. While it is still possible to use emitter.setMaxListeners(n) to set a warning limit for individual AbortSignal instances, per default AbortSignal instances will not warn.
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
copy
The --trace-warnings command-line flag can be used to display the stack trace for such warnings.
The emitted warning can be inspected with process.on('warning') and will have the additional emitter, type, and count properties, referring to the event emitter instance, the event's name and the number of attached listeners, respectively. Its name property is set to 'MaxListenersExceededWarning'.
events.errorMonitor
#
Added in: v13.6.0, v12.17.0
This symbol shall be used to install a listener for only monitoring 'error' events. Listeners installed using this symbol are called before the regular 'error' listeners are called.
Installing a listener using this symbol does not change the behavior once an 'error' event is emitted. Therefore, the process will still crash if no regular 'error' listener is installed.
events.getEventListeners(emitterOrTarget, eventName)
#
Added in: v15.2.0, v14.17.0
emitterOrTarget <EventEmitter> | <EventTarget>
eventName <string> | <symbol>
Returns: <Function[]>
Returns a copy of the array of listeners for the event named eventName.
For EventEmitters this behaves exactly the same as calling .listeners on the emitter.
For EventTargets this is the only way to get the event listeners for the event target. This is useful for debugging and diagnostic purposes.
const { getEventListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
copy
events.getMaxListeners(emitterOrTarget)
#
Added in: v19.9.0, v18.17.0
emitterOrTarget <EventEmitter> | <EventTarget>
Returns: <number>
Returns the currently set max amount of listeners.
For EventEmitters this behaves exactly the same as calling .getMaxListeners on the emitter.
For EventTargets this is the only way to get the max event listeners for the event target. If the number of event handlers on a single EventTarget exceeds the max set, the EventTarget will print a warning.
const { getMaxListeners, setMaxListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
copy
events.once(emitter, name[, options])
#
History













emitter <EventEmitter>
name <string> | <symbol>
options <Object>
signal <AbortSignal> Can be used to cancel waiting for the event.
Returns: <Promise>
Creates a Promise that is fulfilled when the EventEmitter emits the given event or that is rejected if the EventEmitter emits 'error' while waiting. The Promise will resolve with an array of all the arguments emitted to the given event.
This method is intentionally generic and works with the web platform EventTarget interface, which has no special 'error' event semantics and does not listen to the 'error' event.
const { once, EventEmitter } = require('node:events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('kaboom');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.error('error happened', err);
  }
}

run();
copy
The special handling of the 'error' event is only used when events.once() is used to wait for another event. If events.once() is used to wait for the 'error' event itself, then it is treated as any other kind of event without special handling:
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
copy
An <AbortSignal> can be used to cancel waiting for the event:
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
copy
Awaiting multiple events emitted on process.nextTick()
#
There is an edge case worth noting when using the events.once() function to await multiple events emitted on in the same batch of process.nextTick() operations, or whenever multiple events are emitted synchronously. Specifically, because the process.nextTick() queue is drained before the Promise microtask queue, and because EventEmitter emits all events synchronously, it is possible for events.once() to miss an event.
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // This Promise will never resolve because the 'foo' event will
  // have already been emitted before the Promise is created.
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
copy
To catch both events, create each of the Promises before awaiting either of them, then it becomes possible to use Promise.all(), Promise.race(), or Promise.allSettled():
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
copy
events.captureRejections
#
History













Value: <boolean>
Change the default captureRejections option on all new EventEmitter objects.
events.captureRejectionSymbol
#
History













Value: Symbol.for('nodejs.rejection')
See how to write a custom rejection handler.
events.listenerCount(emitter, eventName)
#
Added in: v0.9.12Deprecated since: v3.2.0
Stability: 0 - Deprecated: Use emitter.listenerCount() instead.
emitter <EventEmitter> The emitter to query
eventName <string> | <symbol> The event name
A class method that returns the number of listeners for the given eventName registered on the given emitter.
const { EventEmitter, listenerCount } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
copy
events.on(emitter, eventName[, options])
#
History

















emitter <EventEmitter>
eventName <string> | <symbol> The name of the event being listened for
options <Object>
signal <AbortSignal> Can be used to cancel awaiting events.
close - <string[]> Names of events that will end the iteration.
highWaterMark - <integer> Default: Number.MAX_SAFE_INTEGER The high watermark. The emitter is paused every time the size of events being buffered is higher than it. Supported only on emitters implementing pause() and resume() methods.
lowWaterMark - <integer> Default: 1 The low watermark. The emitter is resumed every time the size of events being buffered is lower than it. Supported only on emitters implementing pause() and resume() methods.
Returns: <AsyncIterator> that iterates eventName events emitted by the emitter
const { on, EventEmitter } = require('node:events');

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();
copy
Returns an AsyncIterator that iterates eventName events. It will throw if the EventEmitter emits 'error'. It removes all listeners when exiting the loop. The value returned by each iteration is an array composed of the emitted event arguments.
An <AbortSignal> can be used to cancel waiting on events:
const { on, EventEmitter } = require('node:events');

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
copy
events.setMaxListeners(n[, ...eventTargets])
#
Added in: v15.4.0
n <number> A non-negative number. The maximum number of listeners per EventTarget event.
...eventsTargets <EventTarget[]> | <EventEmitter[]> Zero or more <EventTarget> or <EventEmitter> instances. If none are specified, n is set as the default max for all newly created <EventTarget> and <EventEmitter> objects.
const {
  setMaxListeners,
  EventEmitter,
} = require('node:events');

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
copy
events.addAbortListener(signal, listener)
#
History













signal <AbortSignal>
listener <Function> | <EventListener>
Returns: <Disposable> A Disposable that removes the abort listener.
Listens once to the abort event on the provided signal.
Listening to the abort event on abort signals is unsafe and may lead to resource leaks since another third party with the signal can call e.stopImmediatePropagation(). Unfortunately Node.js cannot change this since it would violate the web standard. Additionally, the original API makes it easy to forget to remove listeners.
This API allows safely using AbortSignals in Node.js APIs by solving these two issues by listening to the event such that stopImmediatePropagation does not prevent the listener from running.
Returns a disposable so that it may be unsubscribed from more easily.
const { addAbortListener } = require('node:events');

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
copy
Class: events.EventEmitterAsyncResource extends EventEmitter
#
Added in: v17.4.0, v16.14.0
Integrates EventEmitter with <AsyncResource> for EventEmitters that require manual async tracking. Specifically, all events emitted by instances of events.EventEmitterAsyncResource will run within its async context.
const { EventEmitterAsyncResource, EventEmitter } = require('node:events');
const { notStrictEqual, strictEqual } = require('node:assert');
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

// Async tracking tooling will identify this as 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// 'foo' listeners will run in the EventEmitters async context.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// 'foo' listeners on ordinary EventEmitters that do not track async
// context, however, run in the same async context as the emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
copy
The EventEmitterAsyncResource class has the same methods and takes the same options as EventEmitter and AsyncResource themselves.
new events.EventEmitterAsyncResource([options])
#
options <Object>
captureRejections <boolean> It enables automatic capturing of promise rejection. Default: false.
name <string> The type of async event. Default: new.target.name.
triggerAsyncId <number> The ID of the execution context that created this async event. Default: executionAsyncId().
requireManualDestroy <boolean> If set to true, disables emitDestroy when the object is garbage collected. This usually does not need to be set (even if emitDestroy is called manually), unless the resource's asyncId is retrieved and the sensitive API's emitDestroy is called with it. When set to false, the emitDestroy call on garbage collection will only take place if there is at least one active destroy hook. Default: false.
eventemitterasyncresource.asyncId
#
Type: <number> The unique asyncId assigned to the resource.
eventemitterasyncresource.asyncResource
#
Type: The underlying <AsyncResource>.
The returned AsyncResource object has an additional eventEmitter property that provides a reference to this EventEmitterAsyncResource.
eventemitterasyncresource.emitDestroy()
#
Call all destroy hooks. This should only ever be called once. An error will be thrown if it is called more than once. This must be manually called. If the resource is left to be collected by the GC then the destroy hooks will never be called.
eventemitterasyncresource.triggerAsyncId
#
Type: <number> The same triggerAsyncId that is passed to the AsyncResource constructor.
EventTarget and Event API
#
History





















The EventTarget and Event objects are a Node.js-specific implementation of the EventTarget Web API that are exposed by some Node.js core APIs.
const target = new EventTarget();

target.addEventListener('foo', (event) => {
  console.log('foo event happened!');
});
copy
Node.js EventTarget vs. DOM EventTarget
#
There are two key differences between the Node.js EventTarget and the EventTarget Web API:
Whereas DOM EventTarget instances may be hierarchical, there is no concept of hierarchy and event propagation in Node.js. That is, an event dispatched to an EventTarget does not propagate through a hierarchy of nested target objects that may each have their own set of handlers for the event.
In the Node.js EventTarget, if an event listener is an async function or returns a Promise, and the returned Promise rejects, the rejection is automatically captured and handled the same way as a listener that throws synchronously (see EventTarget error handling for details).
NodeEventTarget vs. EventEmitter
#
The NodeEventTarget object implements a modified subset of the EventEmitter API that allows it to closely emulate an EventEmitter in certain situations. A NodeEventTarget is not an instance of EventEmitter and cannot be used in place of an EventEmitter in most cases.
Unlike EventEmitter, any given listener can be registered at most once per event type. Attempts to register a listener multiple times are ignored.
The NodeEventTarget does not emulate the full EventEmitter API. Specifically the prependListener(), prependOnceListener(), rawListeners(), and errorMonitor APIs are not emulated. The 'newListener' and 'removeListener' events will also not be emitted.
The NodeEventTarget does not implement any special default behavior for events with type 'error'.
The NodeEventTarget supports EventListener objects as well as functions as handlers for all event types.
Event listener
#
Event listeners registered for an event type may either be JavaScript functions or objects with a handleEvent property whose value is a function.
In either case, the handler function is invoked with the event argument passed to the eventTarget.dispatchEvent() function.
Async functions may be used as event listeners. If an async handler function rejects, the rejection is captured and handled as described in EventTarget error handling.
An error thrown by one handler function does not prevent the other handlers from being invoked.
The return value of a handler function is ignored.
Handlers are always invoked in the order they were added.
Handler functions may mutate the event object.
function handler1(event) {
  console.log(event.type);  // Prints 'foo'
  event.a = 1;
}

async function handler2(event) {
  console.log(event.type);  // Prints 'foo'
  console.log(event.a);  // Prints 1
}

const handler3 = {
  handleEvent(event) {
    console.log(event.type);  // Prints 'foo'
  },
};

const handler4 = {
  async handleEvent(event) {
    console.log(event.type);  // Prints 'foo'
  },
};

const target = new EventTarget();

target.addEventListener('foo', handler1);
target.addEventListener('foo', handler2);
target.addEventListener('foo', handler3);
target.addEventListener('foo', handler4, { once: true });
copy
EventTarget error handling
#
When a registered event listener throws (or returns a Promise that rejects), by default the error is treated as an uncaught exception on process.nextTick(). This means uncaught exceptions in EventTargets will terminate the Node.js process by default.
Throwing within an event listener will not stop the other registered handlers from being invoked.
The EventTarget does not implement any special default handling for 'error' type events like EventEmitter.
Currently errors are first forwarded to the process.on('error') event before reaching process.on('uncaughtException'). This behavior is deprecated and will change in a future release to align EventTarget with other Node.js APIs. Any code relying on the process.on('error') event should be aligned with the new behavior.
Class: Event
#
History













The Event object is an adaptation of the Event Web API. Instances are created internally by Node.js.
event.bubbles
#
Added in: v14.5.0
Type: <boolean> Always returns false.
This is not used in Node.js and is provided purely for completeness.
event.cancelBubble
#
Added in: v14.5.0
Stability: 3 - Legacy: Use event.stopPropagation() instead.
Type: <boolean>
Alias for event.stopPropagation() if set to true. This is not used in Node.js and is provided purely for completeness.
event.cancelable
#
Added in: v14.5.0
Type: <boolean> True if the event was created with the cancelable option.
event.composed
#
Added in: v14.5.0
Type: <boolean> Always returns false.
This is not used in Node.js and is provided purely for completeness.
event.composedPath()
#
Added in: v14.5.0
Returns an array containing the current EventTarget as the only entry or empty if the event is not being dispatched. This is not used in Node.js and is provided purely for completeness.
event.currentTarget
#
Added in: v14.5.0
Type: <EventTarget> The EventTarget dispatching the event.
Alias for event.target.
event.defaultPrevented
#
Added in: v14.5.0
Type: <boolean>
Is true if cancelable is true and event.preventDefault() has been called.
event.eventPhase
#
Added in: v14.5.0
Type: <number> Returns 0 while an event is not being dispatched, 2 while it is being dispatched.
This is not used in Node.js and is provided purely for completeness.
event.initEvent(type[, bubbles[, cancelable]])
#
Added in: v19.5.0
Stability: 3 - Legacy: The WHATWG spec considers it deprecated and users shouldn't use it at all.
type <string>
bubbles <boolean>
cancelable <boolean>
Redundant with event constructors and incapable of setting composed. This is not used in Node.js and is provided purely for completeness.
event.isTrusted
#
Added in: v14.5.0
Type: <boolean>
The <AbortSignal> "abort" event is emitted with isTrusted set to true. The value is false in all other cases.
event.preventDefault()
#
Added in: v14.5.0
Sets the defaultPrevented property to true if cancelable is true.
event.returnValue
#
Added in: v14.5.0
Stability: 3 - Legacy: Use event.defaultPrevented instead.
Type: <boolean> True if the event has not been canceled.
The value of event.returnValue is always the opposite of event.defaultPrevented. This is not used in Node.js and is provided purely for completeness.
event.srcElement
#
Added in: v14.5.0
Stability: 3 - Legacy: Use event.target instead.
Type: <EventTarget> The EventTarget dispatching the event.
Alias for event.target.
event.stopImmediatePropagation()
#
Added in: v14.5.0
Stops the invocation of event listeners after the current one completes.
event.stopPropagation()
#
Added in: v14.5.0
This is not used in Node.js and is provided purely for completeness.
event.target
#
Added in: v14.5.0
Type: <EventTarget> The EventTarget dispatching the event.
event.timeStamp
#
Added in: v14.5.0
Type: <number>
The millisecond timestamp when the Event object was created.
event.type
#
Added in: v14.5.0
Type: <string>
The event type identifier.
Class: EventTarget
#
History













eventTarget.addEventListener(type, listener[, options])
#
History













type <string>
listener <Function> | <EventListener>
options <Object>
once <boolean> When true, the listener is automatically removed when it is first invoked. Default: false.
passive <boolean> When true, serves as a hint that the listener will not call the Event object's preventDefault() method. Default: false.
capture <boolean> Not directly used by Node.js. Added for API completeness. Default: false.
signal <AbortSignal> The listener will be removed when the given AbortSignal object's abort() method is called.
Adds a new handler for the type event. Any given listener is added only once per type and per capture option value.
If the once option is true, the listener is removed after the next time a type event is dispatched.
The capture option is not used by Node.js in any functional way other than tracking registered event listeners per the EventTarget specification. Specifically, the capture option is used as part of the key when registering a listener. Any individual listener may be added once with capture = false, and once with capture = true.
function handler(event) {}

const target = new EventTarget();
target.addEventListener('foo', handler, { capture: true });  // first
target.addEventListener('foo', handler, { capture: false }); // second

// Removes the second instance of handler
target.removeEventListener('foo', handler);

// Removes the first instance of handler
target.removeEventListener('foo', handler, { capture: true });
copy
eventTarget.dispatchEvent(event)
#
Added in: v14.5.0
event <Event>
Returns: <boolean> true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, otherwise false.
Dispatches the event to the list of handlers for event.type.
The registered event listeners is synchronously invoked in the order they were registered.
eventTarget.removeEventListener(type, listener[, options])
#
Added in: v14.5.0
type <string>
listener <Function> | <EventListener>
options <Object>
capture <boolean>
Removes the listener from the list of handlers for event type.
Class: CustomEvent
#
History





















Extends: <Event>
The CustomEvent object is an adaptation of the CustomEvent Web API. Instances are created internally by Node.js.
event.detail
#
History













Type: <any> Returns custom data passed when initializing.
Read-only.
Class: NodeEventTarget
#
Added in: v14.5.0
Extends: <EventTarget>
The NodeEventTarget is a Node.js-specific extension to EventTarget that emulates a subset of the EventEmitter API.
nodeEventTarget.addListener(type, listener)
#
Added in: v14.5.0
type <string>
listener <Function> | <EventListener>
Returns: <EventTarget> this
Node.js-specific extension to the EventTarget class that emulates the equivalent EventEmitter API. The only difference between addListener() and addEventListener() is that addListener() will return a reference to the EventTarget.
nodeEventTarget.emit(type, arg)
#
Added in: v15.2.0
type <string>
arg <any>
Returns: <boolean> true if event listeners registered for the type exist, otherwise false.
Node.js-specific extension to the EventTarget class that dispatches the arg to the list of handlers for type.
nodeEventTarget.eventNames()
#
Added in: v14.5.0
Returns: <string[]>
Node.js-specific extension to the EventTarget class that returns an array of event type names for which event listeners are registered.
nodeEventTarget.listenerCount(type)
#
Added in: v14.5.0
type <string>
Returns: <number>
Node.js-specific extension to the EventTarget class that returns the number of event listeners registered for the type.
nodeEventTarget.setMaxListeners(n)
#
Added in: v14.5.0
n <number>
Node.js-specific extension to the EventTarget class that sets the number of max event listeners as n.
nodeEventTarget.getMaxListeners()
#
Added in: v14.5.0
Returns: <number>
Node.js-specific extension to the EventTarget class that returns the number of max event listeners.
nodeEventTarget.off(type, listener[, options])
#
Added in: v14.5.0
type <string>
listener <Function> | <EventListener>
options <Object>
capture <boolean>
Returns: <EventTarget> this
Node.js-specific alias for eventTarget.removeEventListener().
nodeEventTarget.on(type, listener)
#
Added in: v14.5.0
type <string>
listener <Function> | <EventListener>
Returns: <EventTarget> this
Node.js-specific alias for eventTarget.addEventListener().
nodeEventTarget.once(type, listener)
#
Added in: v14.5.0
type <string>
listener <Function> | <EventListener>
Returns: <EventTarget> this
Node.js-specific extension to the EventTarget class that adds a once listener for the given event type. This is equivalent to calling on with the once option set to true.
nodeEventTarget.removeAllListeners([type])
#
Added in: v14.5.0
type <string>
Returns: <EventTarget> this
Node.js-specific extension to the EventTarget class. If type is specified, removes all registered listeners for type, otherwise removes all registered listeners.
nodeEventTarget.removeListener(type, listener[, options])
#
Added in: v14.5.0
type <string>
listener <Function> | <EventListener>
options <Object>
capture <boolean>
Returns: <EventTarget> this
Node.js-specific extension to the EventTarget class that removes the listener for the given type. The only difference between removeListener() and removeEventListener() is that removeListener() will return a reference to the EventTarget.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
File system
Promise example
Callback example
Synchronous example
Promises API
Class: FileHandle
Event: 'close'
filehandle.appendFile(data[, options])
filehandle.chmod(mode)
filehandle.chown(uid, gid)
filehandle.close()
filehandle.createReadStream([options])
filehandle.createWriteStream([options])
filehandle.datasync()
filehandle.fd
filehandle.read(buffer, offset, length, position)
filehandle.read([options])
filehandle.read(buffer[, options])
filehandle.readableWebStream([options])
filehandle.readFile(options)
filehandle.readLines([options])
filehandle.readv(buffers[, position])
filehandle.stat([options])
filehandle.sync()
filehandle.truncate(len)
filehandle.utimes(atime, mtime)
filehandle.write(buffer, offset[, length[, position]])
filehandle.write(buffer[, options])
filehandle.write(string[, position[, encoding]])
filehandle.writeFile(data, options)
filehandle.writev(buffers[, position])
filehandle[Symbol.asyncDispose]()
fsPromises.access(path[, mode])
fsPromises.appendFile(path, data[, options])
fsPromises.chmod(path, mode)
fsPromises.chown(path, uid, gid)
fsPromises.copyFile(src, dest[, mode])
fsPromises.cp(src, dest[, options])
fsPromises.glob(pattern[, options])
fsPromises.lchmod(path, mode)
fsPromises.lchown(path, uid, gid)
fsPromises.lutimes(path, atime, mtime)
fsPromises.link(existingPath, newPath)
fsPromises.lstat(path[, options])
fsPromises.mkdir(path[, options])
fsPromises.mkdtemp(prefix[, options])
fsPromises.mkdtempDisposable(prefix[, options])
fsPromises.open(path, flags[, mode])
fsPromises.opendir(path[, options])
fsPromises.readdir(path[, options])
fsPromises.readFile(path[, options])
fsPromises.readlink(path[, options])
fsPromises.realpath(path[, options])
fsPromises.rename(oldPath, newPath)
fsPromises.rmdir(path[, options])
fsPromises.rm(path[, options])
fsPromises.stat(path[, options])
fsPromises.statfs(path[, options])
fsPromises.symlink(target, path[, type])
fsPromises.truncate(path[, len])
fsPromises.unlink(path)
fsPromises.utimes(path, atime, mtime)
fsPromises.watch(filename[, options])
fsPromises.writeFile(file, data[, options])
fsPromises.constants
Callback API
fs.access(path[, mode], callback)
fs.appendFile(path, data[, options], callback)
fs.chmod(path, mode, callback)
File modes
fs.chown(path, uid, gid, callback)
fs.close(fd[, callback])
fs.copyFile(src, dest[, mode], callback)
fs.cp(src, dest[, options], callback)
fs.createReadStream(path[, options])
fs.createWriteStream(path[, options])
fs.exists(path, callback)
fs.fchmod(fd, mode, callback)
fs.fchown(fd, uid, gid, callback)
fs.fdatasync(fd, callback)
fs.fstat(fd[, options], callback)
fs.fsync(fd, callback)
fs.ftruncate(fd[, len], callback)
fs.futimes(fd, atime, mtime, callback)
fs.glob(pattern[, options], callback)
fs.lchmod(path, mode, callback)
fs.lchown(path, uid, gid, callback)
fs.lutimes(path, atime, mtime, callback)
fs.link(existingPath, newPath, callback)
fs.lstat(path[, options], callback)
fs.mkdir(path[, options], callback)
fs.mkdtemp(prefix[, options], callback)
fs.open(path[, flags[, mode]], callback)
fs.openAsBlob(path[, options])
fs.opendir(path[, options], callback)
fs.read(fd, buffer, offset, length, position, callback)
fs.read(fd[, options], callback)
fs.read(fd, buffer[, options], callback)
fs.readdir(path[, options], callback)
fs.readFile(path[, options], callback)
File descriptors
Performance Considerations
fs.readlink(path[, options], callback)
fs.readv(fd, buffers[, position], callback)
fs.realpath(path[, options], callback)
fs.realpath.native(path[, options], callback)
fs.rename(oldPath, newPath, callback)
fs.rmdir(path[, options], callback)
fs.rm(path[, options], callback)
fs.stat(path[, options], callback)
fs.statfs(path[, options], callback)
fs.symlink(target, path[, type], callback)
fs.truncate(path[, len], callback)
fs.unlink(path, callback)
fs.unwatchFile(filename[, listener])
fs.utimes(path, atime, mtime, callback)
fs.watch(filename[, options][, listener])
Caveats
Availability
Inodes
Filename argument
fs.watchFile(filename[, options], listener)
fs.write(fd, buffer, offset[, length[, position]], callback)
fs.write(fd, buffer[, options], callback)
fs.write(fd, string[, position[, encoding]], callback)
fs.writeFile(file, data[, options], callback)
Using fs.writeFile() with file descriptors
fs.writev(fd, buffers[, position], callback)
Synchronous API
fs.accessSync(path[, mode])
fs.appendFileSync(path, data[, options])
fs.chmodSync(path, mode)
fs.chownSync(path, uid, gid)
fs.closeSync(fd)
fs.copyFileSync(src, dest[, mode])
fs.cpSync(src, dest[, options])
fs.existsSync(path)
fs.fchmodSync(fd, mode)
fs.fchownSync(fd, uid, gid)
fs.fdatasyncSync(fd)
fs.fstatSync(fd[, options])
fs.fsyncSync(fd)
fs.ftruncateSync(fd[, len])
fs.futimesSync(fd, atime, mtime)
fs.globSync(pattern[, options])
fs.lchmodSync(path, mode)
fs.lchownSync(path, uid, gid)
fs.lutimesSync(path, atime, mtime)
fs.linkSync(existingPath, newPath)
fs.lstatSync(path[, options])
fs.mkdirSync(path[, options])
fs.mkdtempSync(prefix[, options])
fs.mkdtempDisposableSync(prefix[, options])
fs.opendirSync(path[, options])
fs.openSync(path[, flags[, mode]])
fs.readdirSync(path[, options])
fs.readFileSync(path[, options])
fs.readlinkSync(path[, options])
fs.readSync(fd, buffer, offset, length[, position])
fs.readSync(fd, buffer[, options])
fs.readvSync(fd, buffers[, position])
fs.realpathSync(path[, options])
fs.realpathSync.native(path[, options])
fs.renameSync(oldPath, newPath)
fs.rmdirSync(path[, options])
fs.rmSync(path[, options])
fs.statSync(path[, options])
fs.statfsSync(path[, options])
fs.symlinkSync(target, path[, type])
fs.truncateSync(path[, len])
fs.unlinkSync(path)
fs.utimesSync(path, atime, mtime)
fs.writeFileSync(file, data[, options])
fs.writeSync(fd, buffer, offset[, length[, position]])
fs.writeSync(fd, buffer[, options])
fs.writeSync(fd, string[, position[, encoding]])
fs.writevSync(fd, buffers[, position])
Common Objects
Class: fs.Dir
dir.close()
dir.close(callback)
dir.closeSync()
dir.path
dir.read()
dir.read(callback)
dir.readSync()
dir[Symbol.asyncIterator]()
dir[Symbol.asyncDispose]()
dir[Symbol.dispose]()
Class: fs.Dirent
dirent.isBlockDevice()
dirent.isCharacterDevice()
dirent.isDirectory()
dirent.isFIFO()
dirent.isFile()
dirent.isSocket()
dirent.isSymbolicLink()
dirent.name
dirent.parentPath
Class: fs.FSWatcher
Event: 'change'
Event: 'close'
Event: 'error'
watcher.close()
watcher.ref()
watcher.unref()
Class: fs.StatWatcher
watcher.ref()
watcher.unref()
Class: fs.ReadStream
Event: 'close'
Event: 'open'
Event: 'ready'
readStream.bytesRead
readStream.path
readStream.pending
Class: fs.Stats
stats.isBlockDevice()
stats.isCharacterDevice()
stats.isDirectory()
stats.isFIFO()
stats.isFile()
stats.isSocket()
stats.isSymbolicLink()
stats.dev
stats.ino
stats.mode
stats.nlink
stats.uid
stats.gid
stats.rdev
stats.size
stats.blksize
stats.blocks
stats.atimeMs
stats.mtimeMs
stats.ctimeMs
stats.birthtimeMs
stats.atimeNs
stats.mtimeNs
stats.ctimeNs
stats.birthtimeNs
stats.atime
stats.mtime
stats.ctime
stats.birthtime
Stat time values
Class: fs.StatFs
statfs.bavail
statfs.bfree
statfs.blocks
statfs.bsize
statfs.ffree
statfs.files
statfs.type
Class: fs.WriteStream
Event: 'close'
Event: 'open'
Event: 'ready'
writeStream.bytesWritten
writeStream.close([callback])
writeStream.path
writeStream.pending
fs.constants
FS constants
File access constants
File copy constants
File open constants
File type constants
File mode constants
Notes
Ordering of callback and promise-based operations
File paths
String paths
File URL paths
Platform-specific considerations
Buffer paths
Per-drive working directories on Windows
File descriptors
Threadpool usage
File system flags
File system
#
Stability: 2 - Stable
Source Code: lib/fs.js
The node:fs module enables interacting with the file system in a way modeled on standard POSIX functions.
To use the promise-based APIs:
const fs = require('node:fs/promises');
copy
To use the callback and sync APIs:
const fs = require('node:fs');
copy
All file system operations have synchronous, callback, and promise-based forms, and are accessible using both CommonJS syntax and ES6 Modules (ESM).
Promise example
#
Promise-based operations return a promise that is fulfilled when the asynchronous operation is complete.
const { unlink } = require('node:fs/promises');

(async function(path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello');
copy
Callback example
#
The callback form takes a completion callback function as its last argument and invokes the operation asynchronously. The arguments passed to the completion callback depend on the method, but the first argument is always reserved for an exception. If the operation is completed successfully, then the first argument is null or undefined.
const { unlink } = require('node:fs');

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
copy
The callback-based versions of the node:fs module APIs are preferable over the use of the promise APIs when maximal performance (both in terms of execution time and memory allocation) is required.
Synchronous example
#
The synchronous APIs block the Node.js event loop and further JavaScript execution until the operation is complete. Exceptions are thrown immediately and can be handled using try…catch, or can be allowed to bubble up.
const { unlinkSync } = require('node:fs');

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
copy
Promises API
#
History





















The fs/promises API provides asynchronous file system methods that return promises.
The promise APIs use the underlying Node.js threadpool to perform file system operations off the event loop thread. These operations are not synchronized or threadsafe. Care must be taken when performing multiple concurrent modifications on the same file or data corruption may occur.
Class: FileHandle
#
Added in: v10.0.0
A <FileHandle> object is an object wrapper for a numeric file descriptor.
Instances of the <FileHandle> object are created by the fsPromises.open() method.
All <FileHandle> objects are <EventEmitter>s.
If a <FileHandle> is not closed using the filehandle.close() method, it will try to automatically close the file descriptor and emit a process warning, helping to prevent memory leaks. Please do not rely on this behavior because it can be unreliable and the file may not be closed. Instead, always explicitly close <FileHandle>s. Node.js may change this behavior in the future.
Event: 'close'
#
Added in: v15.4.0
The 'close' event is emitted when the <FileHandle> has been closed and can no longer be used.
filehandle.appendFile(data[, options])
#
History





















data <string> | <Buffer> | <TypedArray> | <DataView> | <AsyncIterable> | <Iterable> | <Stream>
options <Object> | <string>
encoding <string> | <null> Default: 'utf8'
signal <AbortSignal> | <undefined> allows aborting an in-progress writeFile. Default: undefined
Returns: <Promise> Fulfills with undefined upon success.
Alias of filehandle.writeFile().
When operating on file handles, the mode cannot be changed from what it was set to with fsPromises.open(). Therefore, this is equivalent to filehandle.writeFile().
filehandle.chmod(mode)
#
Added in: v10.0.0
mode <integer> the file mode bit mask.
Returns: <Promise> Fulfills with undefined upon success.
Modifies the permissions on the file. See chmod(2).
filehandle.chown(uid, gid)
#
Added in: v10.0.0
uid <integer> The file's new owner's user id.
gid <integer> The file's new group's group id.
Returns: <Promise> Fulfills with undefined upon success.
Changes the ownership of the file. A wrapper for chown(2).
filehandle.close()
#
Added in: v10.0.0
Returns: <Promise> Fulfills with undefined upon success.
Closes the file handle after waiting for any pending operation on the handle to complete.
import { open } from 'node:fs/promises';

let filehandle;
try {
  filehandle = await open('thefile.txt', 'r');
} finally {
  await filehandle?.close();
}
copy
filehandle.createReadStream([options])
#
Added in: v16.11.0
options <Object>
encoding <string> Default: null
autoClose <boolean> Default: true
emitClose <boolean> Default: true
start <integer>
end <integer> Default: Infinity
highWaterMark <integer> Default: 64 * 1024
signal <AbortSignal> | <undefined> Default: undefined
Returns: <fs.ReadStream>
options can include start and end values to read a range of bytes from the file instead of the entire file. Both start and end are inclusive and start counting at 0, allowed values are in the [0, Number.MAX_SAFE_INTEGER] range. If start is omitted or undefined, filehandle.createReadStream() reads sequentially from the current file position. The encoding can be any one of those accepted by <Buffer>.
If the FileHandle points to a character device that only supports blocking reads (such as keyboard or sound card), read operations do not finish until data is available. This can prevent the process from exiting and the stream from closing naturally.
By default, the stream will emit a 'close' event after it has been destroyed. Set the emitClose option to false to change this behavior.
import { open } from 'node:fs/promises';

const fd = await open('/dev/input/event0');
// Create a stream from some character device.
const stream = fd.createReadStream();
setTimeout(() => {
  stream.close(); // This may not close the stream.
  // Artificially marking end-of-stream, as if the underlying resource had
  // indicated end-of-file by itself, allows the stream to close.
  // This does not cancel pending read operations, and if there is such an
  // operation, the process may still not be able to exit successfully
  // until it finishes.
  stream.push(null);
  stream.read(0);
}, 100);
copy
If autoClose is false, then the file descriptor won't be closed, even if there's an error. It is the application's responsibility to close it and make sure there's no file descriptor leak. If autoClose is set to true (default behavior), on 'error' or 'end' the file descriptor will be closed automatically.
An example to read the last 10 bytes of a file which is 100 bytes long:
import { open } from 'node:fs/promises';

const fd = await open('sample.txt');
fd.createReadStream({ start: 90, end: 99 });
copy
filehandle.createWriteStream([options])
#
History













options <Object>
encoding <string> Default: 'utf8'
autoClose <boolean> Default: true
emitClose <boolean> Default: true
start <integer>
highWaterMark <number> Default: 16384
flush <boolean> If true, the underlying file descriptor is flushed prior to closing it. Default: false.
Returns: <fs.WriteStream>
options may also include a start option to allow writing data at some position past the beginning of the file, allowed values are in the [0, Number.MAX_SAFE_INTEGER] range. Modifying a file rather than replacing it may require the flags open option to be set to r+ rather than the default r. The encoding can be any one of those accepted by <Buffer>.
If autoClose is set to true (default behavior) on 'error' or 'finish' the file descriptor will be closed automatically. If autoClose is false, then the file descriptor won't be closed, even if there's an error. It is the application's responsibility to close it and make sure there's no file descriptor leak.
By default, the stream will emit a 'close' event after it has been destroyed. Set the emitClose option to false to change this behavior.
filehandle.datasync()
#
Added in: v10.0.0
Returns: <Promise> Fulfills with undefined upon success.
Forces all currently queued I/O operations associated with the file to the operating system's synchronized I/O completion state. Refer to the POSIX fdatasync(2) documentation for details.
Unlike filehandle.sync this method does not flush modified metadata.
filehandle.fd
#
Added in: v10.0.0
<number> The numeric file descriptor managed by the <FileHandle> object.
filehandle.read(buffer, offset, length, position)
#
History













buffer <Buffer> | <TypedArray> | <DataView> A buffer that will be filled with the file data read.
offset <integer> The location in the buffer at which to start filling. Default: 0
length <integer> The number of bytes to read. Default: buffer.byteLength - offset
position <integer> | <bigint> | <null> The location where to begin reading data from the file. If null or -1, data will be read from the current file position, and the position will be updated. If position is a non-negative integer, the current file position will remain unchanged. Default:: null
Returns: <Promise> Fulfills upon success with an object with two properties:
bytesRead <integer> The number of bytes read
buffer <Buffer> | <TypedArray> | <DataView> A reference to the passed in buffer argument.
Reads data from the file and stores that in the given buffer.
If the file is not modified concurrently, the end-of-file is reached when the number of bytes read is zero.
filehandle.read([options])
#
History













options <Object>
buffer <Buffer> | <TypedArray> | <DataView> A buffer that will be filled with the file data read. Default: Buffer.alloc(16384)
offset <integer> The location in the buffer at which to start filling. Default: 0
length <integer> The number of bytes to read. Default: buffer.byteLength - offset
position <integer> | <bigint> | <null> The location where to begin reading data from the file. If null or -1, data will be read from the current file position, and the position will be updated. If position is a non-negative integer, the current file position will remain unchanged. Default:: null
Returns: <Promise> Fulfills upon success with an object with two properties:
bytesRead <integer> The number of bytes read
buffer <Buffer> | <TypedArray> | <DataView> A reference to the passed in buffer argument.
Reads data from the file and stores that in the given buffer.
If the file is not modified concurrently, the end-of-file is reached when the number of bytes read is zero.
filehandle.read(buffer[, options])
#
History













buffer <Buffer> | <TypedArray> | <DataView> A buffer that will be filled with the file data read.
options <Object>
offset <integer> The location in the buffer at which to start filling. Default: 0
length <integer> The number of bytes to read. Default: buffer.byteLength - offset
position <integer> | <bigint> | <null> The location where to begin reading data from the file. If null or -1, data will be read from the current file position, and the position will be updated. If position is a non-negative integer, the current file position will remain unchanged. Default:: null
Returns: <Promise> Fulfills upon success with an object with two properties:
bytesRead <integer> The number of bytes read
buffer <Buffer> | <TypedArray> | <DataView> A reference to the passed in buffer argument.
Reads data from the file and stores that in the given buffer.
If the file is not modified concurrently, the end-of-file is reached when the number of bytes read is zero.
filehandle.readableWebStream([options])
#
History

























options <Object>
autoClose <boolean> When true, causes the <FileHandle> to be closed when the stream is closed. Default: false
Returns: <ReadableStream>
Returns a byte-oriented ReadableStream that may be used to read the file's contents.
An error will be thrown if this method is called more than once or is called after the FileHandle is closed or closing.
const {
  open,
} = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const chunk of file.readableWebStream())
    console.log(chunk);

  await file.close();
})();
copy
While the ReadableStream will read the file to completion, it will not close the FileHandle automatically. User code must still call the fileHandle.close() method.
filehandle.readFile(options)
#
Added in: v10.0.0
options <Object> | <string>
encoding <string> | <null> Default: null
signal <AbortSignal> allows aborting an in-progress readFile
Returns: <Promise> Fulfills upon a successful read with the contents of the file. If no encoding is specified (using options.encoding), the data is returned as a <Buffer> object. Otherwise, the data will be a string.
Asynchronously reads the entire contents of a file.
If options is a string, then it specifies the encoding.
The <FileHandle> has to support reading.
If one or more filehandle.read() calls are made on a file handle and then a filehandle.readFile() call is made, the data will be read from the current position till the end of the file. It doesn't always read from the beginning of the file.
filehandle.readLines([options])
#
Added in: v18.11.0
options <Object>
encoding <string> Default: null
autoClose <boolean> Default: true
emitClose <boolean> Default: true
start <integer>
end <integer> Default: Infinity
highWaterMark <integer> Default: 64 * 1024
Returns: <readline.InterfaceConstructor>
Convenience method to create a readline interface and stream over the file. See filehandle.createReadStream() for the options.
const { open } = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const line of file.readLines()) {
    console.log(line);
  }
})();
copy
filehandle.readv(buffers[, position])
#
Added in: v13.13.0, v12.17.0
buffers <Buffer[]> | <TypedArray[]> | <DataView[]>
position <integer> | <null> The offset from the beginning of the file where the data should be read from. If position is not a number, the data will be read from the current position. Default: null
Returns: <Promise> Fulfills upon success an object containing two properties:
bytesRead <integer> the number of bytes read
buffers <Buffer[]> | <TypedArray[]> | <DataView[]> property containing a reference to the buffers input.
Read from a file and write to an array of <ArrayBufferView>s
filehandle.stat([options])
#
History













options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
Returns: <Promise> Fulfills with an <fs.Stats> for the file.
filehandle.sync()
#
Added in: v10.0.0
Returns: <Promise> Fulfills with undefined upon success.
Request that all data for the open file descriptor is flushed to the storage device. The specific implementation is operating system and device specific. Refer to the POSIX fsync(2) documentation for more detail.
filehandle.truncate(len)
#
Added in: v10.0.0
len <integer> Default: 0
Returns: <Promise> Fulfills with undefined upon success.
Truncates the file.
If the file was larger than len bytes, only the first len bytes will be retained in the file.
The following example retains only the first four bytes of the file:
import { open } from 'node:fs/promises';

let filehandle = null;
try {
  filehandle = await open('temp.txt', 'r+');
  await filehandle.truncate(4);
} finally {
  await filehandle?.close();
}
copy
If the file previously was shorter than len bytes, it is extended, and the extended part is filled with null bytes ('\0'):
If len is negative then 0 will be used.
filehandle.utimes(atime, mtime)
#
Added in: v10.0.0
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
Returns: <Promise>
Change the file system timestamps of the object referenced by the <FileHandle> then fulfills the promise with no arguments upon success.
filehandle.write(buffer, offset[, length[, position]])
#
History













buffer <Buffer> | <TypedArray> | <DataView>
offset <integer> The start position from within buffer where the data to write begins.
length <integer> The number of bytes from buffer to write. Default: buffer.byteLength - offset
position <integer> | <null> The offset from the beginning of the file where the data from buffer should be written. If position is not a number, the data will be written at the current position. See the POSIX pwrite(2) documentation for more detail. Default: null
Returns: <Promise>
Write buffer to the file.
The promise is fulfilled with an object containing two properties:
bytesWritten <integer> the number of bytes written
buffer <Buffer> | <TypedArray> | <DataView> a reference to the buffer written.
It is unsafe to use filehandle.write() multiple times on the same file without waiting for the promise to be fulfilled (or rejected). For this scenario, use filehandle.createWriteStream().
On Linux, positional writes do not work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
filehandle.write(buffer[, options])
#
Added in: v18.3.0, v16.17.0
buffer <Buffer> | <TypedArray> | <DataView>
options <Object>
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <null> Default: null
Returns: <Promise>
Write buffer to the file.
Similar to the above filehandle.write function, this version takes an optional options object. If no options object is specified, it will default with the above values.
filehandle.write(string[, position[, encoding]])
#
History













string <string>
position <integer> | <null> The offset from the beginning of the file where the data from string should be written. If position is not a number the data will be written at the current position. See the POSIX pwrite(2) documentation for more detail. Default: null
encoding <string> The expected string encoding. Default: 'utf8'
Returns: <Promise>
Write string to the file. If string is not a string, the promise is rejected with an error.
The promise is fulfilled with an object containing two properties:
bytesWritten <integer> the number of bytes written
buffer <string> a reference to the string written.
It is unsafe to use filehandle.write() multiple times on the same file without waiting for the promise to be fulfilled (or rejected). For this scenario, use filehandle.createWriteStream().
On Linux, positional writes do not work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
filehandle.writeFile(data, options)
#
History

















data <string> | <Buffer> | <TypedArray> | <DataView> | <AsyncIterable> | <Iterable> | <Stream>
options <Object> | <string>
encoding <string> | <null> The expected character encoding when data is a string. Default: 'utf8'
signal <AbortSignal> | <undefined> allows aborting an in-progress writeFile. Default: undefined
Returns: <Promise>
Asynchronously writes data to a file, replacing the file if it already exists. data can be a string, a buffer, an <AsyncIterable>, or an <Iterable> object. The promise is fulfilled with no arguments upon success.
If options is a string, then it specifies the encoding.
The <FileHandle> has to support writing.
It is unsafe to use filehandle.writeFile() multiple times on the same file without waiting for the promise to be fulfilled (or rejected).
If one or more filehandle.write() calls are made on a file handle and then a filehandle.writeFile() call is made, the data will be written from the current position till the end of the file. It doesn't always write from the beginning of the file.
filehandle.writev(buffers[, position])
#
Added in: v12.9.0
buffers <Buffer[]> | <TypedArray[]> | <DataView[]>
position <integer> | <null> The offset from the beginning of the file where the data from buffers should be written. If position is not a number, the data will be written at the current position. Default: null
Returns: <Promise>
Write an array of <ArrayBufferView>s to the file.
The promise is fulfilled with an object containing a two properties:
bytesWritten <integer> the number of bytes written
buffers <Buffer[]> | <TypedArray[]> | <DataView[]> a reference to the buffers input.
It is unsafe to call writev() multiple times on the same file without waiting for the promise to be fulfilled (or rejected).
On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
filehandle[Symbol.asyncDispose]()
#
History













Calls filehandle.close() and returns a promise that fulfills when the filehandle is closed.
fsPromises.access(path[, mode])
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
mode <integer> Default: fs.constants.F_OK
Returns: <Promise> Fulfills with undefined upon success.
Tests a user's permissions for the file or directory specified by path. The mode argument is an optional integer that specifies the accessibility checks to be performed. mode should be either the value fs.constants.F_OK or a mask consisting of the bitwise OR of any of fs.constants.R_OK, fs.constants.W_OK, and fs.constants.X_OK (e.g. fs.constants.W_OK | fs.constants.R_OK). Check File access constants for possible values of mode.
If the accessibility check is successful, the promise is fulfilled with no value. If any of the accessibility checks fail, the promise is rejected with an <Error> object. The following example checks if the file /etc/passwd can be read and written by the current process.
import { access, constants } from 'node:fs/promises';

try {
  await access('/etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can access');
} catch {
  console.error('cannot access');
}
copy
Using fsPromises.access() to check for the accessibility of a file before calling fsPromises.open() is not recommended. Doing so introduces a race condition, since other processes may change the file's state between the two calls. Instead, user code should open/read/write the file directly and handle the error raised if the file is not accessible.
fsPromises.appendFile(path, data[, options])
#
History













path <string> | <Buffer> | <URL> | <FileHandle> filename or <FileHandle>
data <string> | <Buffer>
options <Object> | <string>
encoding <string> | <null> Default: 'utf8'
mode <integer> Default: 0o666
flag <string> See support of file system flags. Default: 'a'.
flush <boolean> If true, the underlying file descriptor is flushed prior to closing it. Default: false.
Returns: <Promise> Fulfills with undefined upon success.
Asynchronously append data to a file, creating the file if it does not yet exist. data can be a string or a <Buffer>.
If options is a string, then it specifies the encoding.
The mode option only affects the newly created file. See fs.open() for more details.
The path may be specified as a <FileHandle> that has been opened for appending (using fsPromises.open()).
fsPromises.chmod(path, mode)
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
mode <string> | <integer>
Returns: <Promise> Fulfills with undefined upon success.
Changes the permissions of a file.
fsPromises.chown(path, uid, gid)
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
uid <integer>
gid <integer>
Returns: <Promise> Fulfills with undefined upon success.
Changes the ownership of a file.
fsPromises.copyFile(src, dest[, mode])
#
History













src <string> | <Buffer> | <URL> source filename to copy
dest <string> | <Buffer> | <URL> destination filename of the copy operation
mode <integer> Optional modifiers that specify the behavior of the copy operation. It is possible to create a mask consisting of the bitwise OR of two or more values (e.g. fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE) Default: 0.
fs.constants.COPYFILE_EXCL: The copy operation will fail if dest already exists.
fs.constants.COPYFILE_FICLONE: The copy operation will attempt to create a copy-on-write reflink. If the platform does not support copy-on-write, then a fallback copy mechanism is used.
fs.constants.COPYFILE_FICLONE_FORCE: The copy operation will attempt to create a copy-on-write reflink. If the platform does not support copy-on-write, then the operation will fail.
Returns: <Promise> Fulfills with undefined upon success.
Asynchronously copies src to dest. By default, dest is overwritten if it already exists.
No guarantees are made about the atomicity of the copy operation. If an error occurs after the destination file has been opened for writing, an attempt will be made to remove the destination.
import { copyFile, constants } from 'node:fs/promises';

try {
  await copyFile('source.txt', 'destination.txt');
  console.log('source.txt was copied to destination.txt');
} catch {
  console.error('The file could not be copied');
}

// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
try {
  await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
  console.log('source.txt was copied to destination.txt');
} catch {
  console.error('The file could not be copied');
}
copy
fsPromises.cp(src, dest[, options])
#
History





















src <string> | <URL> source path to copy.
dest <string> | <URL> destination path to copy to.
options <Object>
dereference <boolean> dereference symlinks. Default: false.
errorOnExist <boolean> when force is false, and the destination exists, throw an error. Default: false.
filter <Function> Function to filter copied files/directories. Return true to copy the item, false to ignore it. When ignoring a directory, all of its contents will be skipped as well. Can also return a Promise that resolves to true or false Default: undefined.
src <string> source path to copy.
dest <string> destination path to copy to.
Returns: <boolean> | <Promise> A value that is coercible to boolean or a Promise that fulfils with such value.
force <boolean> overwrite existing file or directory. The copy operation will ignore errors if you set this to false and the destination exists. Use the errorOnExist option to change this behavior. Default: true.
mode <integer> modifiers for copy operation. Default: 0. See mode flag of fsPromises.copyFile().
preserveTimestamps <boolean> When true timestamps from src will be preserved. Default: false.
recursive <boolean> copy directories recursively Default: false
verbatimSymlinks <boolean> When true, path resolution for symlinks will be skipped. Default: false
Returns: <Promise> Fulfills with undefined upon success.
Asynchronously copies the entire directory structure from src to dest, including subdirectories and files.
When copying a directory to another directory, globs are not supported and behavior is similar to cp dir1/ dir2/.
fsPromises.glob(pattern[, options])
#
History

























pattern <string> | <string[]>
options <Object>
cwd <string> | <URL> current working directory. Default: process.cwd()
exclude <Function> | <string[]> Function to filter out files/directories or a list of glob patterns to be excluded. If a function is provided, return true to exclude the item, false to include it. Default: undefined.
withFileTypes <boolean> true if the glob should return paths as Dirents, false otherwise. Default: false.
Returns: <AsyncIterator> An AsyncIterator that yields the paths of files that match the pattern.
const { glob } = require('node:fs/promises');

(async () => {
  for await (const entry of glob('**/*.js'))
    console.log(entry);
})();
copy
fsPromises.lchmod(path, mode)
#
Deprecated since: v10.0.0
Stability: 0 - Deprecated
path <string> | <Buffer> | <URL>
mode <integer>
Returns: <Promise> Fulfills with undefined upon success.
Changes the permissions on a symbolic link.
This method is only implemented on macOS.
fsPromises.lchown(path, uid, gid)
#
History













path <string> | <Buffer> | <URL>
uid <integer>
gid <integer>
Returns: <Promise> Fulfills with undefined upon success.
Changes the ownership on a symbolic link.
fsPromises.lutimes(path, atime, mtime)
#
Added in: v14.5.0, v12.19.0
path <string> | <Buffer> | <URL>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
Returns: <Promise> Fulfills with undefined upon success.
Changes the access and modification times of a file in the same way as fsPromises.utimes(), with the difference that if the path refers to a symbolic link, then the link is not dereferenced: instead, the timestamps of the symbolic link itself are changed.
fsPromises.link(existingPath, newPath)
#
Added in: v10.0.0
existingPath <string> | <Buffer> | <URL>
newPath <string> | <Buffer> | <URL>
Returns: <Promise> Fulfills with undefined upon success.
Creates a new link from the existingPath to the newPath. See the POSIX link(2) documentation for more detail.
fsPromises.lstat(path[, options])
#
History













path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
Returns: <Promise> Fulfills with the <fs.Stats> object for the given symbolic link path.
Equivalent to fsPromises.stat() unless path refers to a symbolic link, in which case the link itself is stat-ed, not the file that it refers to. Refer to the POSIX lstat(2) document for more detail.
fsPromises.mkdir(path[, options])
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
options <Object> | <integer>
recursive <boolean> Default: false
mode <string> | <integer> Not supported on Windows. Default: 0o777.
Returns: <Promise> Upon success, fulfills with undefined if recursive is false, or the first directory path created if recursive is true.
Asynchronously creates a directory.
The optional options argument can be an integer specifying mode (permission and sticky bits), or an object with a mode property and a recursive property indicating whether parent directories should be created. Calling fsPromises.mkdir() when path is a directory that exists results in a rejection only when recursive is false.
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');

async function makeDirectory() {
  const projectFolder = join(__dirname, 'test', 'project');
  const dirCreation = await mkdir(projectFolder, { recursive: true });

  console.log(dirCreation);
  return dirCreation;
}

makeDirectory().catch(console.error);
copy
fsPromises.mkdtemp(prefix[, options])
#
History

















prefix <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <Promise> Fulfills with a string containing the file system path of the newly created temporary directory.
Creates a unique temporary directory. A unique directory name is generated by appending six random characters to the end of the provided prefix. Due to platform inconsistencies, avoid trailing X characters in prefix. Some platforms, notably the BSDs, can return more than six random characters, and replace trailing X characters in prefix with random characters.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use.
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

try {
  await mkdtemp(join(tmpdir(), 'foo-'));
} catch (err) {
  console.error(err);
}
copy
The fsPromises.mkdtemp() method will append the six randomly selected characters directly to the prefix string. For instance, given a directory /tmp, if the intention is to create a temporary directory within /tmp, the prefix must end with a trailing platform-specific path separator (require('node:path').sep).
fsPromises.mkdtempDisposable(prefix[, options])
#
Added in: v24.4.0
prefix <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <Promise> Fulfills with a Promise for an async-disposable Object:
path <string> The path of the created directory.
remove <AsyncFunction> A function which removes the created directory.
[Symbol.asyncDispose] <AsyncFunction> The same as remove.
The resulting Promise holds an async-disposable object whose path property holds the created directory path. When the object is disposed, the directory and its contents will be removed asynchronously if it still exists. If the directory cannot be deleted, disposal will throw an error. The object has an async remove() method which will perform the same task.
Both this function and the disposal function on the resulting object are async, so it should be used with await + await using as in await using dir = await fsPromises.mkdtempDisposable('prefix').
For detailed information, see the documentation of fsPromises.mkdtemp().
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use.
fsPromises.open(path, flags[, mode])
#
History













path <string> | <Buffer> | <URL>
flags <string> | <number> See support of file system flags. Default: 'r'.
mode <string> | <integer> Sets the file mode (permission and sticky bits) if the file is created. Default: 0o666 (readable and writable)
Returns: <Promise> Fulfills with a <FileHandle> object.
Opens a <FileHandle>.
Refer to the POSIX open(2) documentation for more detail.
Some characters (< > : " / \ | ? *) are reserved under Windows as documented by Naming Files, Paths, and Namespaces. Under NTFS, if the filename contains a colon, Node.js will open a file system stream, as described by this MSDN page.
fsPromises.opendir(path[, options])
#
History

















path <string> | <Buffer> | <URL>
options <Object>
encoding <string> | <null> Default: 'utf8'
bufferSize <number> Number of directory entries that are buffered internally when reading from the directory. Higher values lead to better performance but higher memory usage. Default: 32
recursive <boolean> Resolved Dir will be an <AsyncIterable> containing all sub files and directories. Default: false
Returns: <Promise> Fulfills with an <fs.Dir>.
Asynchronously open a directory for iterative scanning. See the POSIX opendir(3) documentation for more detail.
Creates an <fs.Dir>, which contains all further functions for reading from and cleaning up the directory.
The encoding option sets the encoding for the path while opening the directory and subsequent read operations.
Example using async iteration:
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
copy
When using the async iterator, the <fs.Dir> object will be automatically closed after the iterator exits.
fsPromises.readdir(path[, options])
#
History

















path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
withFileTypes <boolean> Default: false
recursive <boolean> If true, reads the contents of a directory recursively. In recursive mode, it will list all files, sub files, and directories. Default: false.
Returns: <Promise> Fulfills with an array of the names of the files in the directory excluding '.' and '..'.
Reads the contents of a directory.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the filenames. If the encoding is set to 'buffer', the filenames returned will be passed as <Buffer> objects.
If options.withFileTypes is set to true, the returned array will contain <fs.Dirent> objects.
import { readdir } from 'node:fs/promises';

try {
  const files = await readdir(path);
  for (const file of files)
    console.log(file);
} catch (err) {
  console.error(err);
}
copy
fsPromises.readFile(path[, options])
#
History













path <string> | <Buffer> | <URL> | <FileHandle> filename or FileHandle
options <Object> | <string>
encoding <string> | <null> Default: null
flag <string> See support of file system flags. Default: 'r'.
signal <AbortSignal> allows aborting an in-progress readFile
Returns: <Promise> Fulfills with the contents of the file.
Asynchronously reads the entire contents of a file.
If no encoding is specified (using options.encoding), the data is returned as a <Buffer> object. Otherwise, the data will be a string.
If options is a string, then it specifies the encoding.
When the path is a directory, the behavior of fsPromises.readFile() is platform-specific. On macOS, Linux, and Windows, the promise will be rejected with an error. On FreeBSD, a representation of the directory's contents will be returned.
An example of reading a package.json file located in the same directory of the running code:
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
async function logFile() {
  try {
    const filePath = resolve('./package.json');
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
copy
It is possible to abort an ongoing readFile using an <AbortSignal>. If a request is aborted the promise returned is rejected with an AbortError:
import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
copy
Aborting an ongoing request does not abort individual operating system requests but rather the internal buffering fs.readFile performs.
Any specified <FileHandle> has to support reading.
fsPromises.readlink(path[, options])
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <Promise> Fulfills with the linkString upon success.
Reads the contents of the symbolic link referred to by path. See the POSIX readlink(2) documentation for more detail. The promise is fulfilled with the linkString upon success.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the link path returned. If the encoding is set to 'buffer', the link path returned will be passed as a <Buffer> object.
fsPromises.realpath(path[, options])
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <Promise> Fulfills with the resolved path upon success.
Determines the actual location of path using the same semantics as the fs.realpath.native() function.
Only paths that can be converted to UTF8 strings are supported.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the path. If the encoding is set to 'buffer', the path returned will be passed as a <Buffer> object.
On Linux, when Node.js is linked against musl libc, the procfs file system must be mounted on /proc in order for this function to work. Glibc does not have this restriction.
fsPromises.rename(oldPath, newPath)
#
Added in: v10.0.0
oldPath <string> | <Buffer> | <URL>
newPath <string> | <Buffer> | <URL>
Returns: <Promise> Fulfills with undefined upon success.
Renames oldPath to newPath.
fsPromises.rmdir(path[, options])
#
History

































path <string> | <Buffer> | <URL>
options <Object>
maxRetries <integer> If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered, Node.js retries the operation with a linear backoff wait of retryDelay milliseconds longer on each try. This option represents the number of retries. This option is ignored if the recursive option is not true. Default: 0.
recursive <boolean> If true, perform a recursive directory removal. In recursive mode, operations are retried on failure. Default: false. Deprecated.
retryDelay <integer> The amount of time in milliseconds to wait between retries. This option is ignored if the recursive option is not true. Default: 100.
Returns: <Promise> Fulfills with undefined upon success.
Removes the directory identified by path.
Using fsPromises.rmdir() on a file (not a directory) results in the promise being rejected with an ENOENT error on Windows and an ENOTDIR error on POSIX.
To get a behavior similar to the rm -rf Unix command, use fsPromises.rm() with options { recursive: true, force: true }.
fsPromises.rm(path[, options])
#
Added in: v14.14.0
path <string> | <Buffer> | <URL>
options <Object>
force <boolean> When true, exceptions will be ignored if path does not exist. Default: false.
maxRetries <integer> If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered, Node.js will retry the operation with a linear backoff wait of retryDelay milliseconds longer on each try. This option represents the number of retries. This option is ignored if the recursive option is not true. Default: 0.
recursive <boolean> If true, perform a recursive directory removal. In recursive mode operations are retried on failure. Default: false.
retryDelay <integer> The amount of time in milliseconds to wait between retries. This option is ignored if the recursive option is not true. Default: 100.
Returns: <Promise> Fulfills with undefined upon success.
Removes files and directories (modeled on the standard POSIX rm utility).
fsPromises.stat(path[, options])
#
History













path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
Returns: <Promise> Fulfills with the <fs.Stats> object for the given path.
fsPromises.statfs(path[, options])
#
Added in: v19.6.0, v18.15.0
path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.StatFs> object should be bigint. Default: false.
Returns: <Promise> Fulfills with the <fs.StatFs> object for the given path.
fsPromises.symlink(target, path[, type])
#
History













target <string> | <Buffer> | <URL>
path <string> | <Buffer> | <URL>
type <string> | <null> Default: null
Returns: <Promise> Fulfills with undefined upon success.
Creates a symbolic link.
The type argument is only used on Windows platforms and can be one of 'dir', 'file', or 'junction'. If the type argument is null, Node.js will autodetect target type and use 'file' or 'dir'. If the target does not exist, 'file' will be used. Windows junction points require the destination path to be absolute. When using 'junction', the target argument will automatically be normalized to absolute path. Junction points on NTFS volumes can only point to directories.
fsPromises.truncate(path[, len])
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
len <integer> Default: 0
Returns: <Promise> Fulfills with undefined upon success.
Truncates (shortens or extends the length) of the content at path to len bytes.
fsPromises.unlink(path)
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
Returns: <Promise> Fulfills with undefined upon success.
If path refers to a symbolic link, then the link is removed without affecting the file or directory to which that link refers. If the path refers to a file path that is not a symbolic link, the file is deleted. See the POSIX unlink(2) documentation for more detail.
fsPromises.utimes(path, atime, mtime)
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
Returns: <Promise> Fulfills with undefined upon success.
Change the file system timestamps of the object referenced by path.
The atime and mtime arguments follow these rules:
Values can be either numbers representing Unix epoch time, Dates, or a numeric string like '123456789.0'.
If the value can not be converted to a number, or is NaN, Infinity, or -Infinity, an Error will be thrown.
fsPromises.watch(filename[, options])
#
Added in: v15.9.0, v14.18.0
filename <string> | <Buffer> | <URL>
options <string> | <Object>
persistent <boolean> Indicates whether the process should continue to run as long as files are being watched. Default: true.
recursive <boolean> Indicates whether all subdirectories should be watched, or only the current directory. This applies when a directory is specified, and only on supported platforms (See caveats). Default: false.
encoding <string> Specifies the character encoding to be used for the filename passed to the listener. Default: 'utf8'.
signal <AbortSignal> An <AbortSignal> used to signal when the watcher should stop.
maxQueue <number> Specifies the number of events to queue between iterations of the <AsyncIterator> returned. Default: 2048.
overflow <string> Either 'ignore' or 'throw' when there are more events to be queued than maxQueue allows. 'ignore' means overflow events are dropped and a warning is emitted, while 'throw' means to throw an exception. Default: 'ignore'.
Returns: <AsyncIterator> of objects with the properties:
eventType <string> The type of change
filename <string> | <Buffer> | <null> The name of the file changed.
Returns an async iterator that watches for changes on filename, where filename is either a file or a directory.
const { watch } = require('node:fs/promises');

const ac = new AbortController();
const { signal } = ac;
setTimeout(() => ac.abort(), 10000);

(async () => {
  try {
    const watcher = watch(__filename, { signal });
    for await (const event of watcher)
      console.log(event);
  } catch (err) {
    if (err.name === 'AbortError')
      return;
    throw err;
  }
})();
copy
On most platforms, 'rename' is emitted whenever a filename appears or disappears in the directory.
All the caveats for fs.watch() also apply to fsPromises.watch().
fsPromises.writeFile(file, data[, options])
#
History

























file <string> | <Buffer> | <URL> | <FileHandle> filename or FileHandle
data <string> | <Buffer> | <TypedArray> | <DataView> | <AsyncIterable> | <Iterable> | <Stream>
options <Object> | <string>
encoding <string> | <null> Default: 'utf8'
mode <integer> Default: 0o666
flag <string> See support of file system flags. Default: 'w'.
flush <boolean> If all data is successfully written to the file, and flush is true, filehandle.sync() is used to flush the data. Default: false.
signal <AbortSignal> allows aborting an in-progress writeFile
Returns: <Promise> Fulfills with undefined upon success.
Asynchronously writes data to a file, replacing the file if it already exists. data can be a string, a buffer, an <AsyncIterable>, or an <Iterable> object.
The encoding option is ignored if data is a buffer.
If options is a string, then it specifies the encoding.
The mode option only affects the newly created file. See fs.open() for more details.
Any specified <FileHandle> has to support writing.
It is unsafe to use fsPromises.writeFile() multiple times on the same file without waiting for the promise to be settled.
Similarly to fsPromises.readFile - fsPromises.writeFile is a convenience method that performs multiple write calls internally to write the buffer passed to it. For performance sensitive code consider using fs.createWriteStream() or filehandle.createWriteStream().
It is possible to use an <AbortSignal> to cancel an fsPromises.writeFile(). Cancelation is "best effort", and some amount of data is likely still to be written.
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
copy
Aborting an ongoing request does not abort individual operating system requests but rather the internal buffering fs.writeFile performs.
fsPromises.constants
#
Added in: v18.4.0, v16.17.0
<Object>
Returns an object containing commonly used constants for file system operations. The object is the same as fs.constants. See FS constants for more details.
Callback API
#
The callback APIs perform all operations asynchronously, without blocking the event loop, then invoke a callback function upon completion or error.
The callback APIs use the underlying Node.js threadpool to perform file system operations off the event loop thread. These operations are not synchronized or threadsafe. Care must be taken when performing multiple concurrent modifications on the same file or data corruption may occur.
fs.access(path[, mode], callback)
#
History

























path <string> | <Buffer> | <URL>
mode <integer> Default: fs.constants.F_OK
callback <Function>
err <Error>
Tests a user's permissions for the file or directory specified by path. The mode argument is an optional integer that specifies the accessibility checks to be performed. mode should be either the value fs.constants.F_OK or a mask consisting of the bitwise OR of any of fs.constants.R_OK, fs.constants.W_OK, and fs.constants.X_OK (e.g. fs.constants.W_OK | fs.constants.R_OK). Check File access constants for possible values of mode.
The final argument, callback, is a callback function that is invoked with a possible error argument. If any of the accessibility checks fail, the error argument will be an Error object. The following examples check if package.json exists, and if it is readable or writable.
import { access, constants } from 'node:fs';

const file = 'package.json';

// Check if the file exists in the current directory.
access(file, constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
});

// Check if the file is readable.
access(file, constants.R_OK, (err) => {
  console.log(`${file} ${err ? 'is not readable' : 'is readable'}`);
});

// Check if the file is writable.
access(file, constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'is not writable' : 'is writable'}`);
});

// Check if the file is readable and writable.
access(file, constants.R_OK | constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'is not' : 'is'} readable and writable`);
});
copy
Do not use fs.access() to check for the accessibility of a file before calling fs.open(), fs.readFile(), or fs.writeFile(). Doing so introduces a race condition, since other processes may change the file's state between the two calls. Instead, user code should open/read/write the file directly and handle the error raised if the file is not accessible.
write (NOT RECOMMENDED)
import { access, open, close } from 'node:fs';

access('myfile', (err) => {
  if (!err) {
    console.error('myfile already exists');
    return;
  }

  open('myfile', 'wx', (err, fd) => {
    if (err) throw err;

    try {
      writeMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
copy
write (RECOMMENDED)
import { open, close } from 'node:fs';

open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
copy
read (NOT RECOMMENDED)
import { access, open, close } from 'node:fs';
access('myfile', (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  open('myfile', 'r', (err, fd) => {
    if (err) throw err;

    try {
      readMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
copy
read (RECOMMENDED)
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
copy
The "not recommended" examples above check for accessibility and then use the file; the "recommended" examples are better because they use the file directly and handle the error, if any.
In general, check for the accessibility of a file only if the file will not be used directly, for example when its accessibility is a signal from another process.
On Windows, access-control policies (ACLs) on a directory may limit access to a file or directory. The fs.access() function, however, does not check the ACL and therefore may report that a path is accessible even if the ACL restricts the user from reading or writing to it.
fs.appendFile(path, data[, options], callback)
#
History

































path <string> | <Buffer> | <URL> | <number> filename or file descriptor
data <string> | <Buffer>
options <Object> | <string>
encoding <string> | <null> Default: 'utf8'
mode <integer> Default: 0o666
flag <string> See support of file system flags. Default: 'a'.
flush <boolean> If true, the underlying file descriptor is flushed prior to closing it. Default: false.
callback <Function>
err <Error>
Asynchronously append data to a file, creating the file if it does not yet exist. data can be a string or a <Buffer>.
The mode option only affects the newly created file. See fs.open() for more details.
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
copy
If options is a string, then it specifies the encoding:
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', 'utf8', callback);
copy
The path may be specified as a numeric file descriptor that has been opened for appending (using fs.open() or fs.openSync()). The file descriptor will not be closed automatically.
import { open, close, appendFile } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('message.txt', 'a', (err, fd) => {
  if (err) throw err;

  try {
    appendFile(fd, 'data to append', 'utf8', (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
copy
fs.chmod(path, mode, callback)
#
History

























path <string> | <Buffer> | <URL>
mode <string> | <integer>
callback <Function>
err <Error>
Asynchronously changes the permissions of a file. No arguments other than a possible exception are given to the completion callback.
See the POSIX chmod(2) documentation for more detail.
import { chmod } from 'node:fs';

chmod('my_file.txt', 0o775, (err) => {
  if (err) throw err;
  console.log('The permissions for file "my_file.txt" have been changed!');
});
copy
File modes
#
The mode argument used in both the fs.chmod() and fs.chmodSync() methods is a numeric bitmask created using a logical OR of the following constants:
Constant
Octal
Description
fs.constants.S_IRUSR
0o400
read by owner
fs.constants.S_IWUSR
0o200
write by owner
fs.constants.S_IXUSR
0o100
execute/search by owner
fs.constants.S_IRGRP
0o40
read by group
fs.constants.S_IWGRP
0o20
write by group
fs.constants.S_IXGRP
0o10
execute/search by group
fs.constants.S_IROTH
0o4
read by others
fs.constants.S_IWOTH
0o2
write by others
fs.constants.S_IXOTH
0o1
execute/search by others

An easier method of constructing the mode is to use a sequence of three octal digits (e.g. 765). The left-most digit (7 in the example), specifies the permissions for the file owner. The middle digit (6 in the example), specifies permissions for the group. The right-most digit (5 in the example), specifies the permissions for others.
Number
Description
7
read, write, and execute
6
read and write
5
read and execute
4
read only
3
write and execute
2
write only
1
execute only
0
no permission

For example, the octal value 0o765 means:
The owner may read, write, and execute the file.
The group may read and write the file.
Others may read and execute the file.
When using raw numbers where file modes are expected, any value larger than 0o777 may result in platform-specific behaviors that are not supported to work consistently. Therefore constants like S_ISVTX, S_ISGID, or S_ISUID are not exposed in fs.constants.
Caveats: on Windows only the write permission can be changed, and the distinction among the permissions of group, owner, or others is not implemented.
fs.chown(path, uid, gid, callback)
#
History

























path <string> | <Buffer> | <URL>
uid <integer>
gid <integer>
callback <Function>
err <Error>
Asynchronously changes owner and group of a file. No arguments other than a possible exception are given to the completion callback.
See the POSIX chown(2) documentation for more detail.
fs.close(fd[, callback])
#
History

























fd <integer>
callback <Function>
err <Error>
Closes the file descriptor. No arguments other than a possible exception are given to the completion callback.
Calling fs.close() on any file descriptor (fd) that is currently in use through any other fs operation may lead to undefined behavior.
See the POSIX close(2) documentation for more detail.
fs.copyFile(src, dest[, mode], callback)
#
History

















src <string> | <Buffer> | <URL> source filename to copy
dest <string> | <Buffer> | <URL> destination filename of the copy operation
mode <integer> modifiers for copy operation. Default: 0.
callback <Function>
err <Error>
Asynchronously copies src to dest. By default, dest is overwritten if it already exists. No arguments other than a possible exception are given to the callback function. Node.js makes no guarantees about the atomicity of the copy operation. If an error occurs after the destination file has been opened for writing, Node.js will attempt to remove the destination.
mode is an optional integer that specifies the behavior of the copy operation. It is possible to create a mask consisting of the bitwise OR of two or more values (e.g. fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE).
fs.constants.COPYFILE_EXCL: The copy operation will fail if dest already exists.
fs.constants.COPYFILE_FICLONE: The copy operation will attempt to create a copy-on-write reflink. If the platform does not support copy-on-write, then a fallback copy mechanism is used.
fs.constants.COPYFILE_FICLONE_FORCE: The copy operation will attempt to create a copy-on-write reflink. If the platform does not support copy-on-write, then the operation will fail.
import { copyFile, constants } from 'node:fs';

function callback(err) {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
}

// destination.txt will be created or overwritten by default.
copyFile('source.txt', 'destination.txt', callback);

// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
copy
fs.cp(src, dest[, options], callback)
#
History

























src <string> | <URL> source path to copy.
dest <string> | <URL> destination path to copy to.
options <Object>
dereference <boolean> dereference symlinks. Default: false.
errorOnExist <boolean> when force is false, and the destination exists, throw an error. Default: false.
filter <Function> Function to filter copied files/directories. Return true to copy the item, false to ignore it. When ignoring a directory, all of its contents will be skipped as well. Can also return a Promise that resolves to true or false Default: undefined.
src <string> source path to copy.
dest <string> destination path to copy to.
Returns: <boolean> | <Promise> A value that is coercible to boolean or a Promise that fulfils with such value.
force <boolean> overwrite existing file or directory. The copy operation will ignore errors if you set this to false and the destination exists. Use the errorOnExist option to change this behavior. Default: true.
mode <integer> modifiers for copy operation. Default: 0. See mode flag of fs.copyFile().
preserveTimestamps <boolean> When true timestamps from src will be preserved. Default: false.
recursive <boolean> copy directories recursively Default: false
verbatimSymlinks <boolean> When true, path resolution for symlinks will be skipped. Default: false
callback <Function>
err <Error>
Asynchronously copies the entire directory structure from src to dest, including subdirectories and files.
When copying a directory to another directory, globs are not supported and behavior is similar to cp dir1/ dir2/.
fs.createReadStream(path[, options])
#
History





















































path <string> | <Buffer> | <URL>
options <string> | <Object>
flags <string> See support of file system flags. Default: 'r'.
encoding <string> Default: null
fd <integer> | <FileHandle> Default: null
mode <integer> Default: 0o666
autoClose <boolean> Default: true
emitClose <boolean> Default: true
start <integer>
end <integer> Default: Infinity
highWaterMark <integer> Default: 64 * 1024
fs <Object> | <null> Default: null
signal <AbortSignal> | <null> Default: null
Returns: <fs.ReadStream>
options can include start and end values to read a range of bytes from the file instead of the entire file. Both start and end are inclusive and start counting at 0, allowed values are in the [0, Number.MAX_SAFE_INTEGER] range. If fd is specified and start is omitted or undefined, fs.createReadStream() reads sequentially from the current file position. The encoding can be any one of those accepted by <Buffer>.
If fd is specified, ReadStream will ignore the path argument and will use the specified file descriptor. This means that no 'open' event will be emitted. fd should be blocking; non-blocking fds should be passed to <net.Socket>.
If fd points to a character device that only supports blocking reads (such as keyboard or sound card), read operations do not finish until data is available. This can prevent the process from exiting and the stream from closing naturally.
By default, the stream will emit a 'close' event after it has been destroyed. Set the emitClose option to false to change this behavior.
By providing the fs option, it is possible to override the corresponding fs implementations for open, read, and close. When providing the fs option, an override for read is required. If no fd is provided, an override for open is also required. If autoClose is true, an override for close is also required.
import { createReadStream } from 'node:fs';

// Create a stream from some character device.
const stream = createReadStream('/dev/input/event0');
setTimeout(() => {
  stream.close(); // This may not close the stream.
  // Artificially marking end-of-stream, as if the underlying resource had
  // indicated end-of-file by itself, allows the stream to close.
  // This does not cancel pending read operations, and if there is such an
  // operation, the process may still not be able to exit successfully
  // until it finishes.
  stream.push(null);
  stream.read(0);
}, 100);
copy
If autoClose is false, then the file descriptor won't be closed, even if there's an error. It is the application's responsibility to close it and make sure there's no file descriptor leak. If autoClose is set to true (default behavior), on 'error' or 'end' the file descriptor will be closed automatically.
mode sets the file mode (permission and sticky bits), but only if the file was created.
An example to read the last 10 bytes of a file which is 100 bytes long:
import { createReadStream } from 'node:fs';

createReadStream('sample.txt', { start: 90, end: 99 });
copy
If options is a string, then it specifies the encoding.
fs.createWriteStream(path[, options])
#
History

























































path <string> | <Buffer> | <URL>
options <string> | <Object>
flags <string> See support of file system flags. Default: 'w'.
encoding <string> Default: 'utf8'
fd <integer> | <FileHandle> Default: null
mode <integer> Default: 0o666
autoClose <boolean> Default: true
emitClose <boolean> Default: true
start <integer>
fs <Object> | <null> Default: null
signal <AbortSignal> | <null> Default: null
highWaterMark <number> Default: 16384
flush <boolean> If true, the underlying file descriptor is flushed prior to closing it. Default: false.
Returns: <fs.WriteStream>
options may also include a start option to allow writing data at some position past the beginning of the file, allowed values are in the [0, Number.MAX_SAFE_INTEGER] range. Modifying a file rather than replacing it may require the flags option to be set to r+ rather than the default w. The encoding can be any one of those accepted by <Buffer>.
If autoClose is set to true (default behavior) on 'error' or 'finish' the file descriptor will be closed automatically. If autoClose is false, then the file descriptor won't be closed, even if there's an error. It is the application's responsibility to close it and make sure there's no file descriptor leak.
By default, the stream will emit a 'close' event after it has been destroyed. Set the emitClose option to false to change this behavior.
By providing the fs option it is possible to override the corresponding fs implementations for open, write, writev, and close. Overriding write() without writev() can reduce performance as some optimizations (_writev()) will be disabled. When providing the fs option, overrides for at least one of write and writev are required. If no fd option is supplied, an override for open is also required. If autoClose is true, an override for close is also required.
Like <fs.ReadStream>, if fd is specified, <fs.WriteStream> will ignore the path argument and will use the specified file descriptor. This means that no 'open' event will be emitted. fd should be blocking; non-blocking fds should be passed to <net.Socket>.
If options is a string, then it specifies the encoding.
fs.exists(path, callback)
#
History





















Stability: 0 - Deprecated: Use fs.stat() or fs.access() instead.
path <string> | <Buffer> | <URL>
callback <Function>
exists <boolean>
Test whether or not the element at the given path exists by checking with the file system. Then call the callback argument with either true or false:
import { exists } from 'node:fs';

exists('/etc/passwd', (e) => {
  console.log(e ? 'it exists' : 'no passwd!');
});
copy
The parameters for this callback are not consistent with other Node.js callbacks. Normally, the first parameter to a Node.js callback is an err parameter, optionally followed by other parameters. The fs.exists() callback has only one boolean parameter. This is one reason fs.access() is recommended instead of fs.exists().
If path is a symbolic link, it is followed. Thus, if path exists but points to a non-existent element, the callback will receive the value false.
Using fs.exists() to check for the existence of a file before calling fs.open(), fs.readFile(), or fs.writeFile() is not recommended. Doing so introduces a race condition, since other processes may change the file's state between the two calls. Instead, user code should open/read/write the file directly and handle the error raised if the file does not exist.
write (NOT RECOMMENDED)
import { exists, open, close } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    console.error('myfile already exists');
  } else {
    open('myfile', 'wx', (err, fd) => {
      if (err) throw err;

      try {
        writeMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  }
});
copy
write (RECOMMENDED)
import { open, close } from 'node:fs';
open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
copy
read (NOT RECOMMENDED)
import { open, close, exists } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    open('myfile', 'r', (err, fd) => {
      if (err) throw err;

      try {
        readMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  } else {
    console.error('myfile does not exist');
  }
});
copy
read (RECOMMENDED)
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
copy
The "not recommended" examples above check for existence and then use the file; the "recommended" examples are better because they use the file directly and handle the error, if any.
In general, check for the existence of a file only if the file won't be used directly, for example when its existence is a signal from another process.
fs.fchmod(fd, mode, callback)
#
History





















fd <integer>
mode <string> | <integer>
callback <Function>
err <Error>
Sets the permissions on the file. No arguments other than a possible exception are given to the completion callback.
See the POSIX fchmod(2) documentation for more detail.
fs.fchown(fd, uid, gid, callback)
#
History





















fd <integer>
uid <integer>
gid <integer>
callback <Function>
err <Error>
Sets the owner of the file. No arguments other than a possible exception are given to the completion callback.
See the POSIX fchown(2) documentation for more detail.
fs.fdatasync(fd, callback)
#
History





















fd <integer>
callback <Function>
err <Error>
Forces all currently queued I/O operations associated with the file to the operating system's synchronized I/O completion state. Refer to the POSIX fdatasync(2) documentation for details. No arguments other than a possible exception are given to the completion callback.
fs.fstat(fd[, options], callback)
#
History

























fd <integer>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
callback <Function>
err <Error>
stats <fs.Stats>
Invokes the callback with the <fs.Stats> for the file descriptor.
See the POSIX fstat(2) documentation for more detail.
fs.fsync(fd, callback)
#
History





















fd <integer>
callback <Function>
err <Error>
Request that all data for the open file descriptor is flushed to the storage device. The specific implementation is operating system and device specific. Refer to the POSIX fsync(2) documentation for more detail. No arguments other than a possible exception are given to the completion callback.
fs.ftruncate(fd[, len], callback)
#
History





















fd <integer>
len <integer> Default: 0
callback <Function>
err <Error>
Truncates the file descriptor. No arguments other than a possible exception are given to the completion callback.
See the POSIX ftruncate(2) documentation for more detail.
If the file referred to by the file descriptor was larger than len bytes, only the first len bytes will be retained in the file.
For example, the following program retains only the first four bytes of the file:
import { open, close, ftruncate } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('temp.txt', 'r+', (err, fd) => {
  if (err) throw err;

  try {
    ftruncate(fd, 4, (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    if (err) throw err;
  }
});
copy
If the file previously was shorter than len bytes, it is extended, and the extended part is filled with null bytes ('\0'):
If len is negative then 0 will be used.
fs.futimes(fd, atime, mtime, callback)
#
History

























fd <integer>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
callback <Function>
err <Error>
Change the file system timestamps of the object referenced by the supplied file descriptor. See fs.utimes().
fs.glob(pattern[, options], callback)
#
History


























pattern <string> | <string[]>
options <Object>
cwd <string> | <URL> current working directory. Default: process.cwd()
exclude <Function> | <string[]> Function to filter out files/directories or a list of glob patterns to be excluded. If a function is provided, return true to exclude the item, false to include it. Default: undefined.
withFileTypes <boolean> true if the glob should return paths as Dirents, false otherwise. Default: false.
callback <Function>
err <Error>
Retrieves the files matching the specified pattern.
const { glob } = require('node:fs');

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
copy
fs.lchmod(path, mode, callback)
#
History

























Stability: 0 - Deprecated
path <string> | <Buffer> | <URL>
mode <integer>
callback <Function>
err <Error> | <AggregateError>
Changes the permissions on a symbolic link. No arguments other than a possible exception are given to the completion callback.
This method is only implemented on macOS.
See the POSIX lchmod(2) documentation for more detail.
fs.lchown(path, uid, gid, callback)
#
History

























path <string> | <Buffer> | <URL>
uid <integer>
gid <integer>
callback <Function>
err <Error>
Set the owner of the symbolic link. No arguments other than a possible exception are given to the completion callback.
See the POSIX lchown(2) documentation for more detail.
fs.lutimes(path, atime, mtime, callback)
#
History













path <string> | <Buffer> | <URL>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
callback <Function>
err <Error>
Changes the access and modification times of a file in the same way as fs.utimes(), with the difference that if the path refers to a symbolic link, then the link is not dereferenced: instead, the timestamps of the symbolic link itself are changed.
No arguments other than a possible exception are given to the completion callback.
fs.link(existingPath, newPath, callback)
#
History

























existingPath <string> | <Buffer> | <URL>
newPath <string> | <Buffer> | <URL>
callback <Function>
err <Error>
Creates a new link from the existingPath to the newPath. See the POSIX link(2) documentation for more detail. No arguments other than a possible exception are given to the completion callback.
fs.lstat(path[, options], callback)
#
History





























path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
callback <Function>
err <Error>
stats <fs.Stats>
Retrieves the <fs.Stats> for the symbolic link referred to by the path. The callback gets two arguments (err, stats) where stats is a <fs.Stats> object. lstat() is identical to stat(), except that if path is a symbolic link, then the link itself is stat-ed, not the file that it refers to.
See the POSIX lstat(2) documentation for more details.
fs.mkdir(path[, options], callback)
#
History

































path <string> | <Buffer> | <URL>
options <Object> | <integer>
recursive <boolean> Default: false
mode <string> | <integer> Not supported on Windows. Default: 0o777.
callback <Function>
err <Error>
path <string> | <undefined> Present only if a directory is created with recursive set to true.
Asynchronously creates a directory.
The callback is given a possible exception and, if recursive is true, the first directory path created, (err[, path]). path can still be undefined when recursive is true, if no directory was created (for instance, if it was previously created).
The optional options argument can be an integer specifying mode (permission and sticky bits), or an object with a mode property and a recursive property indicating whether parent directories should be created. Calling fs.mkdir() when path is a directory that exists results in an error only when recursive is false. If recursive is false and the directory exists, an EEXIST error occurs.
import { mkdir } from 'node:fs';

// Create ./tmp/a/apple, regardless of whether ./tmp and ./tmp/a exist.
mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
copy
On Windows, using fs.mkdir() on the root directory even with recursion will result in an error:
import { mkdir } from 'node:fs';

mkdir('/', { recursive: true }, (err) => {
  // => [Error: EPERM: operation not permitted, mkdir 'C:\']
});
copy
See the POSIX mkdir(2) documentation for more details.
fs.mkdtemp(prefix[, options], callback)
#
History

































prefix <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
callback <Function>
err <Error>
directory <string>
Creates a unique temporary directory.
Generates six random characters to be appended behind a required prefix to create a unique temporary directory. Due to platform inconsistencies, avoid trailing X characters in prefix. Some platforms, notably the BSDs, can return more than six random characters, and replace trailing X characters in prefix with random characters.
The created directory path is passed as a string to the callback's second parameter.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use.
import { mkdtemp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

mkdtemp(join(tmpdir(), 'foo-'), (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Prints: /tmp/foo-itXde2 or C:\Users\...\AppData\Local\Temp\foo-itXde2
});
copy
The fs.mkdtemp() method will append the six randomly selected characters directly to the prefix string. For instance, given a directory /tmp, if the intention is to create a temporary directory within /tmp, the prefix must end with a trailing platform-specific path separator (require('node:path').sep).
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs';

// The parent directory for the new temporary directory
const tmpDir = tmpdir();

// This method is *INCORRECT*:
mkdtemp(tmpDir, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Will print something similar to `/tmpabc123`.
  // A new temporary directory is created at the file system root
  // rather than *within* the /tmp directory.
});

// This method is *CORRECT*:
import { sep } from 'node:path';
mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Will print something similar to `/tmp/abc123`.
  // A new temporary directory is created within
  // the /tmp directory.
});
copy
fs.open(path[, flags[, mode]], callback)
#
History

























path <string> | <Buffer> | <URL>
flags <string> | <number> See support of file system flags. Default: 'r'.
mode <string> | <integer> Default: 0o666 (readable and writable)
callback <Function>
err <Error>
fd <integer>
Asynchronous file open. See the POSIX open(2) documentation for more details.
mode sets the file mode (permission and sticky bits), but only if the file was created. On Windows, only the write permission can be manipulated; see fs.chmod().
The callback gets two arguments (err, fd).
Some characters (< > : " / \ | ? *) are reserved under Windows as documented by Naming Files, Paths, and Namespaces. Under NTFS, if the filename contains a colon, Node.js will open a file system stream, as described by this MSDN page.
Functions based on fs.open() exhibit this behavior as well: fs.writeFile(), fs.readFile(), etc.
fs.openAsBlob(path[, options])
#
History













path <string> | <Buffer> | <URL>
options <Object>
type <string> An optional mime type for the blob.
Returns: <Promise> Fulfills with a <Blob> upon success.
Returns a <Blob> whose data is backed by the given file.
The file must not be modified after the <Blob> is created. Any modifications will cause reading the <Blob> data to fail with a DOMException error. Synchronous stat operations on the file when the Blob is created, and before each read in order to detect whether the file data has been modified on disk.
const { openAsBlob } = require('node:fs');

(async () => {
  const blob = await openAsBlob('the.file.txt');
  const ab = await blob.arrayBuffer();
  blob.stream();
})();
copy
fs.opendir(path[, options], callback)
#
History





















path <string> | <Buffer> | <URL>
options <Object>
encoding <string> | <null> Default: 'utf8'
bufferSize <number> Number of directory entries that are buffered internally when reading from the directory. Higher values lead to better performance but higher memory usage. Default: 32
recursive <boolean> Default: false
callback <Function>
err <Error>
dir <fs.Dir>
Asynchronously open a directory. See the POSIX opendir(3) documentation for more details.
Creates an <fs.Dir>, which contains all further functions for reading from and cleaning up the directory.
The encoding option sets the encoding for the path while opening the directory and subsequent read operations.
fs.read(fd, buffer, offset, length, position, callback)
#
History

























fd <integer>
buffer <Buffer> | <TypedArray> | <DataView> The buffer that the data will be written to.
offset <integer> The position in buffer to write the data to.
length <integer> The number of bytes to read.
position <integer> | <bigint> | <null> Specifies where to begin reading from in the file. If position is null or -1 , data will be read from the current file position, and the file position will be updated. If position is a non-negative integer, the file position will be unchanged.
callback <Function>
err <Error>
bytesRead <integer>
buffer <Buffer>
Read data from the file specified by fd.
The callback is given the three arguments, (err, bytesRead, buffer).
If the file is not modified concurrently, the end-of-file is reached when the number of bytes read is zero.
If this method is invoked as its util.promisify()ed version, it returns a promise for an Object with bytesRead and buffer properties.
The fs.read() method reads data from the file specified by the file descriptor (fd). The length argument indicates the maximum number of bytes that Node.js will attempt to read from the kernel. However, the actual number of bytes read (bytesRead) can be lower than the specified length for various reasons.
For example:
If the file is shorter than the specified length, bytesRead will be set to the actual number of bytes read.
If the file encounters EOF (End of File) before the buffer could be filled, Node.js will read all available bytes until EOF is encountered, and the bytesRead parameter in the callback will indicate the actual number of bytes read, which may be less than the specified length.
If the file is on a slow network filesystem or encounters any other issue during reading, bytesRead can be lower than the specified length.
Therefore, when using fs.read(), it's important to check the bytesRead value to determine how many bytes were actually read from the file. Depending on your application logic, you may need to handle cases where bytesRead is lower than the specified length, such as by wrapping the read call in a loop if you require a minimum amount of bytes.
This behavior is similar to the POSIX preadv2 function.
fs.read(fd[, options], callback)
#
History













fd <integer>
options <Object>
buffer <Buffer> | <TypedArray> | <DataView> Default: Buffer.alloc(16384)
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <bigint> | <null> Default: null
callback <Function>
err <Error>
bytesRead <integer>
buffer <Buffer>
Similar to the fs.read() function, this version takes an optional options object. If no options object is specified, it will default with the above values.
fs.read(fd, buffer[, options], callback)
#
Added in: v18.2.0, v16.17.0
fd <integer>
buffer <Buffer> | <TypedArray> | <DataView> The buffer that the data will be written to.
options <Object>
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <bigint> Default: null
callback <Function>
err <Error>
bytesRead <integer>
buffer <Buffer>
Similar to the fs.read() function, this version takes an optional options object. If no options object is specified, it will default with the above values.
fs.readdir(path[, options], callback)
#
History





































path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
withFileTypes <boolean> Default: false
recursive <boolean> If true, reads the contents of a directory recursively. In recursive mode, it will list all files, sub files and directories. Default: false.
callback <Function>
err <Error>
files <string[]> | <Buffer[]> | <fs.Dirent[]>
Reads the contents of a directory. The callback gets two arguments (err, files) where files is an array of the names of the files in the directory excluding '.' and '..'.
See the POSIX readdir(3) documentation for more details.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the filenames passed to the callback. If the encoding is set to 'buffer', the filenames returned will be passed as <Buffer> objects.
If options.withFileTypes is set to true, the files array will contain <fs.Dirent> objects.
fs.readFile(path[, options], callback)
#
History









































path <string> | <Buffer> | <URL> | <integer> filename or file descriptor
options <Object> | <string>
encoding <string> | <null> Default: null
flag <string> See support of file system flags. Default: 'r'.
signal <AbortSignal> allows aborting an in-progress readFile
callback <Function>
err <Error> | <AggregateError>
data <string> | <Buffer>
Asynchronously reads the entire contents of a file.
import { readFile } from 'node:fs';

readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
copy
The callback is passed two arguments (err, data), where data is the contents of the file.
If no encoding is specified, then the raw buffer is returned.
If options is a string, then it specifies the encoding:
import { readFile } from 'node:fs';

readFile('/etc/passwd', 'utf8', callback);
copy
When the path is a directory, the behavior of fs.readFile() and fs.readFileSync() is platform-specific. On macOS, Linux, and Windows, an error will be returned. On FreeBSD, a representation of the directory's contents will be returned.
import { readFile } from 'node:fs';

// macOS, Linux, and Windows
readFile('<directory>', (err, data) => {
  // => [Error: EISDIR: illegal operation on a directory, read <directory>]
});

//  FreeBSD
readFile('<directory>', (err, data) => {
  // => null, <data>
});
copy
It is possible to abort an ongoing request using an AbortSignal. If a request is aborted the callback is called with an AbortError:
import { readFile } from 'node:fs';

const controller = new AbortController();
const signal = controller.signal;
readFile(fileInfo[0].name, { signal }, (err, buf) => {
  // ...
});
// When you want to abort the request
controller.abort();
copy
The fs.readFile() function buffers the entire file. To minimize memory costs, when possible prefer streaming via fs.createReadStream().
Aborting an ongoing request does not abort individual operating system requests but rather the internal buffering fs.readFile performs.
File descriptors
#
Any specified file descriptor has to support reading.
If a file descriptor is specified as the path, it will not be closed automatically.
The reading will begin at the current position. For example, if the file already had 'Hello World' and six bytes are read with the file descriptor, the call to fs.readFile() with the same file descriptor, would give 'World', rather than 'Hello World'.
Performance Considerations
#
The fs.readFile() method asynchronously reads the contents of a file into memory one chunk at a time, allowing the event loop to turn between each chunk. This allows the read operation to have less impact on other activity that may be using the underlying libuv thread pool but means that it will take longer to read a complete file into memory.
The additional read overhead can vary broadly on different systems and depends on the type of file being read. If the file type is not a regular file (a pipe for instance) and Node.js is unable to determine an actual file size, each read operation will load on 64 KiB of data. For regular files, each read will process 512 KiB of data.
For applications that require as-fast-as-possible reading of file contents, it is better to use fs.read() directly and for application code to manage reading the full contents of the file itself.
The Node.js GitHub issue #25741 provides more information and a detailed analysis on the performance of fs.readFile() for multiple file sizes in different Node.js versions.
fs.readlink(path[, options], callback)
#
History

























path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
callback <Function>
err <Error>
linkString <string> | <Buffer>
Reads the contents of the symbolic link referred to by path. The callback gets two arguments (err, linkString).
See the POSIX readlink(2) documentation for more details.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the link path passed to the callback. If the encoding is set to 'buffer', the link path returned will be passed as a <Buffer> object.
fs.readv(fd, buffers[, position], callback)
#
History













fd <integer>
buffers <ArrayBufferView[]>
position <integer> | <null> Default: null
callback <Function>
err <Error>
bytesRead <integer>
buffers <ArrayBufferView[]>
Read from a file specified by fd and write to an array of ArrayBufferViews using readv().
position is the offset from the beginning of the file from where data should be read. If typeof position !== 'number', the data will be read from the current position.
The callback will be given three arguments: err, bytesRead, and buffers. bytesRead is how many bytes were read from the file.
If this method is invoked as its util.promisify()ed version, it returns a promise for an Object with bytesRead and buffers properties.
fs.realpath(path[, options], callback)
#
History





































path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
callback <Function>
err <Error>
resolvedPath <string> | <Buffer>
Asynchronously computes the canonical pathname by resolving ., .., and symbolic links.
A canonical pathname is not necessarily unique. Hard links and bind mounts can expose a file system entity through many pathnames.
This function behaves like realpath(3), with some exceptions:
No case conversion is performed on case-insensitive file systems.
The maximum number of symbolic links is platform-independent and generally (much) higher than what the native realpath(3) implementation supports.
The callback gets two arguments (err, resolvedPath). May use process.cwd to resolve relative paths.
Only paths that can be converted to UTF8 strings are supported.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the path passed to the callback. If the encoding is set to 'buffer', the path returned will be passed as a <Buffer> object.
If path resolves to a socket or a pipe, the function will return a system dependent name for that object.
A path that does not exist results in an ENOENT error. error.path is the absolute file path.
fs.realpath.native(path[, options], callback)
#
History













path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
callback <Function>
err <Error>
resolvedPath <string> | <Buffer>
Asynchronous realpath(3).
The callback gets two arguments (err, resolvedPath).
Only paths that can be converted to UTF8 strings are supported.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the path passed to the callback. If the encoding is set to 'buffer', the path returned will be passed as a <Buffer> object.
On Linux, when Node.js is linked against musl libc, the procfs file system must be mounted on /proc in order for this function to work. Glibc does not have this restriction.
fs.rename(oldPath, newPath, callback)
#
History

























oldPath <string> | <Buffer> | <URL>
newPath <string> | <Buffer> | <URL>
callback <Function>
err <Error>
Asynchronously rename file at oldPath to the pathname provided as newPath. In the case that newPath already exists, it will be overwritten. If there is a directory at newPath, an error will be raised instead. No arguments other than a possible exception are given to the completion callback.
See also: rename(2).
import { rename } from 'node:fs';

rename('oldFile.txt', 'newFile.txt', (err) => {
  if (err) throw err;
  console.log('Rename complete!');
});
copy
fs.rmdir(path[, options], callback)
#
History

















































path <string> | <Buffer> | <URL>
options <Object>
maxRetries <integer> If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered, Node.js retries the operation with a linear backoff wait of retryDelay milliseconds longer on each try. This option represents the number of retries. This option is ignored if the recursive option is not true. Default: 0.
recursive <boolean> If true, perform a recursive directory removal. In recursive mode, operations are retried on failure. Default: false. Deprecated.
retryDelay <integer> The amount of time in milliseconds to wait between retries. This option is ignored if the recursive option is not true. Default: 100.
callback <Function>
err <Error>
Asynchronous rmdir(2). No arguments other than a possible exception are given to the completion callback.
Using fs.rmdir() on a file (not a directory) results in an ENOENT error on Windows and an ENOTDIR error on POSIX.
To get a behavior similar to the rm -rf Unix command, use fs.rm() with options { recursive: true, force: true }.
fs.rm(path[, options], callback)
#
History













path <string> | <Buffer> | <URL>
options <Object>
force <boolean> When true, exceptions will be ignored if path does not exist. Default: false.
maxRetries <integer> If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered, Node.js will retry the operation with a linear backoff wait of retryDelay milliseconds longer on each try. This option represents the number of retries. This option is ignored if the recursive option is not true. Default: 0.
recursive <boolean> If true, perform a recursive removal. In recursive mode operations are retried on failure. Default: false.
retryDelay <integer> The amount of time in milliseconds to wait between retries. This option is ignored if the recursive option is not true. Default: 100.
callback <Function>
err <Error>
Asynchronously removes files and directories (modeled on the standard POSIX rm utility). No arguments other than a possible exception are given to the completion callback.
fs.stat(path[, options], callback)
#
History





























path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
callback <Function>
err <Error>
stats <fs.Stats>
Asynchronous stat(2). The callback gets two arguments (err, stats) where stats is an <fs.Stats> object.
In case of an error, the err.code will be one of Common System Errors.
fs.stat() follows symbolic links. Use fs.lstat() to look at the links themselves.
Using fs.stat() to check for the existence of a file before calling fs.open(), fs.readFile(), or fs.writeFile() is not recommended. Instead, user code should open/read/write the file directly and handle the error raised if the file is not available.
To check if a file exists without manipulating it afterwards, fs.access() is recommended.
For example, given the following directory structure:
- txtDir
-- file.txt
- app.js
copy
The next program will check for the stats of the given paths:
import { stat } from 'node:fs';

const pathsToCheck = ['./txtDir', './txtDir/file.txt'];

for (let i = 0; i < pathsToCheck.length; i++) {
  stat(pathsToCheck[i], (err, stats) => {
    console.log(stats.isDirectory());
    console.log(stats);
  });
}
copy
The resulting output will resemble:
true
Stats {
  dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214262,
  size: 96,
  blocks: 0,
  atimeMs: 1561174653071.963,
  mtimeMs: 1561174614583.3518,
  ctimeMs: 1561174626623.5366,
  birthtimeMs: 1561174126937.2893,
  atime: 2019-06-22T03:37:33.072Z,
  mtime: 2019-06-22T03:36:54.583Z,
  ctime: 2019-06-22T03:37:06.624Z,
  birthtime: 2019-06-22T03:28:46.937Z
}
false
Stats {
  dev: 16777220,
  mode: 33188,
  nlink: 1,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214074,
  size: 8,
  blocks: 8,
  atimeMs: 1561174616618.8555,
  mtimeMs: 1561174614584,
  ctimeMs: 1561174614583.8145,
  birthtimeMs: 1561174007710.7478,
  atime: 2019-06-22T03:36:56.619Z,
  mtime: 2019-06-22T03:36:54.584Z,
  ctime: 2019-06-22T03:36:54.584Z,
  birthtime: 2019-06-22T03:26:47.711Z
}
copy
fs.statfs(path[, options], callback)
#
Added in: v19.6.0, v18.15.0
path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.StatFs> object should be bigint. Default: false.
callback <Function>
err <Error>
stats <fs.StatFs>
Asynchronous statfs(2). Returns information about the mounted file system which contains path. The callback gets two arguments (err, stats) where stats is an <fs.StatFs> object.
In case of an error, the err.code will be one of Common System Errors.
fs.symlink(target, path[, type], callback)
#
History





















target <string> | <Buffer> | <URL>
path <string> | <Buffer> | <URL>
type <string> | <null> Default: null
callback <Function>
err <Error>
Creates the link called path pointing to target. No arguments other than a possible exception are given to the completion callback.
See the POSIX symlink(2) documentation for more details.
The type argument is only available on Windows and ignored on other platforms. It can be set to 'dir', 'file', or 'junction'. If the type argument is null, Node.js will autodetect target type and use 'file' or 'dir'. If the target does not exist, 'file' will be used. Windows junction points require the destination path to be absolute. When using 'junction', the target argument will automatically be normalized to absolute path. Junction points on NTFS volumes can only point to directories.
Relative targets are relative to the link's parent directory.
import { symlink } from 'node:fs';

symlink('./mew', './mewtwo', callback);
copy
The above example creates a symbolic link mewtwo which points to mew in the same directory:
$ tree .
.
├── mew
└── mewtwo -> ./mew
copy
fs.truncate(path[, len], callback)
#
History

























path <string> | <Buffer> | <URL>
len <integer> Default: 0
callback <Function>
err <Error> | <AggregateError>
Truncates the file. No arguments other than a possible exception are given to the completion callback. A file descriptor can also be passed as the first argument. In this case, fs.ftruncate() is called.
const { truncate } = require('node:fs');
// Assuming that 'path/file.txt' is a regular file.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was truncated');
});
copy
Passing a file descriptor is deprecated and may result in an error being thrown in the future.
See the POSIX truncate(2) documentation for more details.
fs.unlink(path, callback)
#
History

























path <string> | <Buffer> | <URL>
callback <Function>
err <Error>
Asynchronously removes a file or symbolic link. No arguments other than a possible exception are given to the completion callback.
import { unlink } from 'node:fs';
// Assuming that 'path/file.txt' is a regular file.
unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was deleted');
});
copy
fs.unlink() will not work on a directory, empty or otherwise. To remove a directory, use fs.rmdir().
See the POSIX unlink(2) documentation for more details.
fs.unwatchFile(filename[, listener])
#
Added in: v0.1.31
filename <string> | <Buffer> | <URL>
listener <Function> Optional, a listener previously attached using fs.watchFile()
Stop watching for changes on filename. If listener is specified, only that particular listener is removed. Otherwise, all listeners are removed, effectively stopping watching of filename.
Calling fs.unwatchFile() with a filename that is not being watched is a no-op, not an error.
Using fs.watch() is more efficient than fs.watchFile() and fs.unwatchFile(). fs.watch() should be used instead of fs.watchFile() and fs.unwatchFile() when possible.
fs.utimes(path, atime, mtime, callback)
#
History

































path <string> | <Buffer> | <URL>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
callback <Function>
err <Error>
Change the file system timestamps of the object referenced by path.
The atime and mtime arguments follow these rules:
Values can be either numbers representing Unix epoch time in seconds, Dates, or a numeric string like '123456789.0'.
If the value can not be converted to a number, or is NaN, Infinity, or -Infinity, an Error will be thrown.
fs.watch(filename[, options][, listener])
#
History

























filename <string> | <Buffer> | <URL>
options <string> | <Object>
persistent <boolean> Indicates whether the process should continue to run as long as files are being watched. Default: true.
recursive <boolean> Indicates whether all subdirectories should be watched, or only the current directory. This applies when a directory is specified, and only on supported platforms (See caveats). Default: false.
encoding <string> Specifies the character encoding to be used for the filename passed to the listener. Default: 'utf8'.
signal <AbortSignal> allows closing the watcher with an AbortSignal.
listener <Function> | <undefined> Default: undefined
eventType <string>
filename <string> | <Buffer> | <null>
Returns: <fs.FSWatcher>
Watch for changes on filename, where filename is either a file or a directory.
The second argument is optional. If options is provided as a string, it specifies the encoding. Otherwise options should be passed as an object.
The listener callback gets two arguments (eventType, filename). eventType is either 'rename' or 'change', and filename is the name of the file which triggered the event.
On most platforms, 'rename' is emitted whenever a filename appears or disappears in the directory.
The listener callback is attached to the 'change' event fired by <fs.FSWatcher>, but it is not the same thing as the 'change' value of eventType.
If a signal is passed, aborting the corresponding AbortController will close the returned <fs.FSWatcher>.
Caveats
#
The fs.watch API is not 100% consistent across platforms, and is unavailable in some situations.
On Windows, no events will be emitted if the watched directory is moved or renamed. An EPERM error is reported when the watched directory is deleted.
The fs.watch API does not provide any protection with respect to malicious actions on the file system. For example, on Windows it is implemented by monitoring changes in a directory versus specific files. This allows substitution of a file and fs reporting changes on the new file with the same filename.
Availability
#
This feature depends on the underlying operating system providing a way to be notified of file system changes.
On Linux systems, this uses inotify(7).
On BSD systems, this uses kqueue(2).
On macOS, this uses kqueue(2) for files and FSEvents for directories.
On SunOS systems (including Solaris and SmartOS), this uses event ports.
On Windows systems, this feature depends on ReadDirectoryChangesW.
On AIX systems, this feature depends on AHAFS, which must be enabled.
On IBM i systems, this feature is not supported.
If the underlying functionality is not available for some reason, then fs.watch() will not be able to function and may throw an exception. For example, watching files or directories can be unreliable, and in some cases impossible, on network file systems (NFS, SMB, etc) or host file systems when using virtualization software such as Vagrant or Docker.
It is still possible to use fs.watchFile(), which uses stat polling, but this method is slower and less reliable.
Inodes
#
On Linux and macOS systems, fs.watch() resolves the path to an inode and watches the inode. If the watched path is deleted and recreated, it is assigned a new inode. The watch will emit an event for the delete but will continue watching the original inode. Events for the new inode will not be emitted. This is expected behavior.
AIX files retain the same inode for the lifetime of a file. Saving and closing a watched file on AIX will result in two notifications (one for adding new content, and one for truncation).
Filename argument
#
Providing filename argument in the callback is only supported on Linux, macOS, Windows, and AIX. Even on supported platforms, filename is not always guaranteed to be provided. Therefore, don't assume that filename argument is always provided in the callback, and have some fallback logic if it is null.
import { watch } from 'node:fs';
watch('somedir', (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log('filename not provided');
  }
});
copy
fs.watchFile(filename[, options], listener)
#
History

















filename <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Default: false
persistent <boolean> Default: true
interval <integer> Default: 5007
listener <Function>
current <fs.Stats>
previous <fs.Stats>
Returns: <fs.StatWatcher>
Watch for changes on filename. The callback listener will be called each time the file is accessed.
The options argument may be omitted. If provided, it should be an object. The options object may contain a boolean named persistent that indicates whether the process should continue to run as long as files are being watched. The options object may specify an interval property indicating how often the target should be polled in milliseconds.
The listener gets two arguments the current stat object and the previous stat object:
import { watchFile } from 'node:fs';

watchFile('message.text', (curr, prev) => {
  console.log(`the current mtime is: ${curr.mtime}`);
  console.log(`the previous mtime was: ${prev.mtime}`);
});
copy
These stat objects are instances of fs.Stat. If the bigint option is true, the numeric values in these objects are specified as BigInts.
To be notified when the file was modified, not just accessed, it is necessary to compare curr.mtimeMs and prev.mtimeMs.
When an fs.watchFile operation results in an ENOENT error, it will invoke the listener once, with all the fields zeroed (or, for dates, the Unix Epoch). If the file is created later on, the listener will be called again, with the latest stat objects. This is a change in functionality since v0.10.
Using fs.watch() is more efficient than fs.watchFile and fs.unwatchFile. fs.watch should be used instead of fs.watchFile and fs.unwatchFile when possible.
When a file being watched by fs.watchFile() disappears and reappears, then the contents of previous in the second callback event (the file's reappearance) will be the same as the contents of previous in the first callback event (its disappearance).
This happens when:
the file is deleted, followed by a restore
the file is renamed and then renamed a second time back to its original name
fs.write(fd, buffer, offset[, length[, position]], callback)
#
History





































fd <integer>
buffer <Buffer> | <TypedArray> | <DataView>
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <null> Default: null
callback <Function>
err <Error>
bytesWritten <integer>
buffer <Buffer> | <TypedArray> | <DataView>
Write buffer to the file specified by fd.
offset determines the part of the buffer to be written, and length is an integer specifying the number of bytes to write.
position refers to the offset from the beginning of the file where this data should be written. If typeof position !== 'number', the data will be written at the current position. See pwrite(2).
The callback will be given three arguments (err, bytesWritten, buffer) where bytesWritten specifies how many bytes were written from buffer.
If this method is invoked as its util.promisify()ed version, it returns a promise for an Object with bytesWritten and buffer properties.
It is unsafe to use fs.write() multiple times on the same file without waiting for the callback. For this scenario, fs.createWriteStream() is recommended.
On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
fs.write(fd, buffer[, options], callback)
#
Added in: v18.3.0, v16.17.0
fd <integer>
buffer <Buffer> | <TypedArray> | <DataView>
options <Object>
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <null> Default: null
callback <Function>
err <Error>
bytesWritten <integer>
buffer <Buffer> | <TypedArray> | <DataView>
Write buffer to the file specified by fd.
Similar to the above fs.write function, this version takes an optional options object. If no options object is specified, it will default with the above values.
fs.write(fd, string[, position[, encoding]], callback)
#
History





































fd <integer>
string <string>
position <integer> | <null> Default: null
encoding <string> Default: 'utf8'
callback <Function>
err <Error>
written <integer>
string <string>
Write string to the file specified by fd. If string is not a string, an exception is thrown.
position refers to the offset from the beginning of the file where this data should be written. If typeof position !== 'number' the data will be written at the current position. See pwrite(2).
encoding is the expected string encoding.
The callback will receive the arguments (err, written, string) where written specifies how many bytes the passed string required to be written. Bytes written is not necessarily the same as string characters written. See Buffer.byteLength.
It is unsafe to use fs.write() multiple times on the same file without waiting for the callback. For this scenario, fs.createWriteStream() is recommended.
On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
On Windows, if the file descriptor is connected to the console (e.g. fd == 1 or stdout) a string containing non-ASCII characters will not be rendered properly by default, regardless of the encoding used. It is possible to configure the console to render UTF-8 properly by changing the active codepage with the chcp 65001 command. See the chcp docs for more details.
fs.writeFile(file, data[, options], callback)
#
History





























































file <string> | <Buffer> | <URL> | <integer> filename or file descriptor
data <string> | <Buffer> | <TypedArray> | <DataView>
options <Object> | <string>
encoding <string> | <null> Default: 'utf8'
mode <integer> Default: 0o666
flag <string> See support of file system flags. Default: 'w'.
flush <boolean> If all data is successfully written to the file, and flush is true, fs.fsync() is used to flush the data. Default: false.
signal <AbortSignal> allows aborting an in-progress writeFile
callback <Function>
err <Error> | <AggregateError>
When file is a filename, asynchronously writes data to the file, replacing the file if it already exists. data can be a string or a buffer.
When file is a file descriptor, the behavior is similar to calling fs.write() directly (which is recommended). See the notes below on using a file descriptor.
The encoding option is ignored if data is a buffer.
The mode option only affects the newly created file. See fs.open() for more details.
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
copy
If options is a string, then it specifies the encoding:
import { writeFile } from 'node:fs';

writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
copy
It is unsafe to use fs.writeFile() multiple times on the same file without waiting for the callback. For this scenario, fs.createWriteStream() is recommended.
Similarly to fs.readFile - fs.writeFile is a convenience method that performs multiple write calls internally to write the buffer passed to it. For performance sensitive code consider using fs.createWriteStream().
It is possible to use an <AbortSignal> to cancel an fs.writeFile(). Cancelation is "best effort", and some amount of data is likely still to be written.
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const controller = new AbortController();
const { signal } = controller;
const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, { signal }, (err) => {
  // When a request is aborted - the callback is called with an AbortError
});
// When the request should be aborted
controller.abort();
copy
Aborting an ongoing request does not abort individual operating system requests but rather the internal buffering fs.writeFile performs.
Using fs.writeFile() with file descriptors
#
When file is a file descriptor, the behavior is almost identical to directly calling fs.write() like:
import { write } from 'node:fs';
import { Buffer } from 'node:buffer';

write(fd, Buffer.from(data, options.encoding), callback);
copy
The difference from directly calling fs.write() is that under some unusual conditions, fs.write() might write only part of the buffer and need to be retried to write the remaining data, whereas fs.writeFile() retries until the data is entirely written (or an error occurs).
The implications of this are a common source of confusion. In the file descriptor case, the file is not replaced! The data is not necessarily written to the beginning of the file, and the file's original data may remain before and/or after the newly written data.
For example, if fs.writeFile() is called twice in a row, first to write the string 'Hello', then to write the string ', World', the file would contain 'Hello, World', and might contain some of the file's original data (depending on the size of the original file, and the position of the file descriptor). If a file name had been used instead of a descriptor, the file would be guaranteed to contain only ', World'.
fs.writev(fd, buffers[, position], callback)
#
History













fd <integer>
buffers <ArrayBufferView[]>
position <integer> | <null> Default: null
callback <Function>
err <Error>
bytesWritten <integer>
buffers <ArrayBufferView[]>
Write an array of ArrayBufferViews to the file specified by fd using writev().
position is the offset from the beginning of the file where this data should be written. If typeof position !== 'number', the data will be written at the current position.
The callback will be given three arguments: err, bytesWritten, and buffers. bytesWritten is how many bytes were written from buffers.
If this method is util.promisify()ed, it returns a promise for an Object with bytesWritten and buffers properties.
It is unsafe to use fs.writev() multiple times on the same file without waiting for the callback. For this scenario, use fs.createWriteStream().
On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
Synchronous API
#
The synchronous APIs perform all operations synchronously, blocking the event loop until the operation completes or fails.
fs.accessSync(path[, mode])
#
History













path <string> | <Buffer> | <URL>
mode <integer> Default: fs.constants.F_OK
Synchronously tests a user's permissions for the file or directory specified by path. The mode argument is an optional integer that specifies the accessibility checks to be performed. mode should be either the value fs.constants.F_OK or a mask consisting of the bitwise OR of any of fs.constants.R_OK, fs.constants.W_OK, and fs.constants.X_OK (e.g. fs.constants.W_OK | fs.constants.R_OK). Check File access constants for possible values of mode.
If any of the accessibility checks fail, an Error will be thrown. Otherwise, the method will return undefined.
import { accessSync, constants } from 'node:fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}
copy
fs.appendFileSync(path, data[, options])
#
History





















path <string> | <Buffer> | <URL> | <number> filename or file descriptor
data <string> | <Buffer>
options <Object> | <string>
encoding <string> | <null> Default: 'utf8'
mode <integer> Default: 0o666
flag <string> See support of file system flags. Default: 'a'.
flush <boolean> If true, the underlying file descriptor is flushed prior to closing it. Default: false.
Synchronously append data to a file, creating the file if it does not yet exist. data can be a string or a <Buffer>.
The mode option only affects the newly created file. See fs.open() for more details.
import { appendFileSync } from 'node:fs';

try {
  appendFileSync('message.txt', 'data to append');
  console.log('The "data to append" was appended to file!');
} catch (err) {
  /* Handle the error */
}
copy
If options is a string, then it specifies the encoding:
import { appendFileSync } from 'node:fs';

appendFileSync('message.txt', 'data to append', 'utf8');
copy
The path may be specified as a numeric file descriptor that has been opened for appending (using fs.open() or fs.openSync()). The file descriptor will not be closed automatically.
import { openSync, closeSync, appendFileSync } from 'node:fs';

let fd;

try {
  fd = openSync('message.txt', 'a');
  appendFileSync(fd, 'data to append', 'utf8');
} catch (err) {
  /* Handle the error */
} finally {
  if (fd !== undefined)
    closeSync(fd);
}
copy
fs.chmodSync(path, mode)
#
History













path <string> | <Buffer> | <URL>
mode <string> | <integer>
For detailed information, see the documentation of the asynchronous version of this API: fs.chmod().
See the POSIX chmod(2) documentation for more detail.
fs.chownSync(path, uid, gid)
#
History













path <string> | <Buffer> | <URL>
uid <integer>
gid <integer>
Synchronously changes owner and group of a file. Returns undefined. This is the synchronous version of fs.chown().
See the POSIX chown(2) documentation for more detail.
fs.closeSync(fd)
#
Added in: v0.1.21
fd <integer>
Closes the file descriptor. Returns undefined.
Calling fs.closeSync() on any file descriptor (fd) that is currently in use through any other fs operation may lead to undefined behavior.
See the POSIX close(2) documentation for more detail.
fs.copyFileSync(src, dest[, mode])
#
History













src <string> | <Buffer> | <URL> source filename to copy
dest <string> | <Buffer> | <URL> destination filename of the copy operation
mode <integer> modifiers for copy operation. Default: 0.
Synchronously copies src to dest. By default, dest is overwritten if it already exists. Returns undefined. Node.js makes no guarantees about the atomicity of the copy operation. If an error occurs after the destination file has been opened for writing, Node.js will attempt to remove the destination.
mode is an optional integer that specifies the behavior of the copy operation. It is possible to create a mask consisting of the bitwise OR of two or more values (e.g. fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE).
fs.constants.COPYFILE_EXCL: The copy operation will fail if dest already exists.
fs.constants.COPYFILE_FICLONE: The copy operation will attempt to create a copy-on-write reflink. If the platform does not support copy-on-write, then a fallback copy mechanism is used.
fs.constants.COPYFILE_FICLONE_FORCE: The copy operation will attempt to create a copy-on-write reflink. If the platform does not support copy-on-write, then the operation will fail.
import { copyFileSync, constants } from 'node:fs';

// destination.txt will be created or overwritten by default.
copyFileSync('source.txt', 'destination.txt');
console.log('source.txt was copied to destination.txt');

// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
copyFileSync('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
copy
fs.cpSync(src, dest[, options])
#
History





















src <string> | <URL> source path to copy.
dest <string> | <URL> destination path to copy to.
options <Object>
dereference <boolean> dereference symlinks. Default: false.
errorOnExist <boolean> when force is false, and the destination exists, throw an error. Default: false.
filter <Function> Function to filter copied files/directories. Return true to copy the item, false to ignore it. When ignoring a directory, all of its contents will be skipped as well. Default: undefined
src <string> source path to copy.
dest <string> destination path to copy to.
Returns: <boolean> Any non-Promise value that is coercible to boolean.
force <boolean> overwrite existing file or directory. The copy operation will ignore errors if you set this to false and the destination exists. Use the errorOnExist option to change this behavior. Default: true.
mode <integer> modifiers for copy operation. Default: 0. See mode flag of fs.copyFileSync().
preserveTimestamps <boolean> When true timestamps from src will be preserved. Default: false.
recursive <boolean> copy directories recursively Default: false
verbatimSymlinks <boolean> When true, path resolution for symlinks will be skipped. Default: false
Synchronously copies the entire directory structure from src to dest, including subdirectories and files.
When copying a directory to another directory, globs are not supported and behavior is similar to cp dir1/ dir2/.
fs.existsSync(path)
#
History













path <string> | <Buffer> | <URL>
Returns: <boolean>
Returns true if the path exists, false otherwise.
For detailed information, see the documentation of the asynchronous version of this API: fs.exists().
fs.exists() is deprecated, but fs.existsSync() is not. The callback parameter to fs.exists() accepts parameters that are inconsistent with other Node.js callbacks. fs.existsSync() does not use a callback.
import { existsSync } from 'node:fs';

if (existsSync('/etc/passwd'))
  console.log('The path exists.');
copy
fs.fchmodSync(fd, mode)
#
Added in: v0.4.7
fd <integer>
mode <string> | <integer>
Sets the permissions on the file. Returns undefined.
See the POSIX fchmod(2) documentation for more detail.
fs.fchownSync(fd, uid, gid)
#
Added in: v0.4.7
fd <integer>
uid <integer> The file's new owner's user id.
gid <integer> The file's new group's group id.
Sets the owner of the file. Returns undefined.
See the POSIX fchown(2) documentation for more detail.
fs.fdatasyncSync(fd)
#
Added in: v0.1.96
fd <integer>
Forces all currently queued I/O operations associated with the file to the operating system's synchronized I/O completion state. Refer to the POSIX fdatasync(2) documentation for details. Returns undefined.
fs.fstatSync(fd[, options])
#
History













fd <integer>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
Returns: <fs.Stats>
Retrieves the <fs.Stats> for the file descriptor.
See the POSIX fstat(2) documentation for more detail.
fs.fsyncSync(fd)
#
Added in: v0.1.96
fd <integer>
Request that all data for the open file descriptor is flushed to the storage device. The specific implementation is operating system and device specific. Refer to the POSIX fsync(2) documentation for more detail. Returns undefined.
fs.ftruncateSync(fd[, len])
#
Added in: v0.8.6
fd <integer>
len <integer> Default: 0
Truncates the file descriptor. Returns undefined.
For detailed information, see the documentation of the asynchronous version of this API: fs.ftruncate().
fs.futimesSync(fd, atime, mtime)
#
History













fd <integer>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
Synchronous version of fs.futimes(). Returns undefined.
fs.globSync(pattern[, options])
#
History

























pattern <string> | <string[]>
options <Object>
cwd <string> | <URL> current working directory. Default: process.cwd()
exclude <Function> | <string[]> Function to filter out files/directories or a list of glob patterns to be excluded. If a function is provided, return true to exclude the item, false to include it. Default: undefined.
withFileTypes <boolean> true if the glob should return paths as Dirents, false otherwise. Default: false.
Returns: <string[]> paths of files that match the pattern.
const { globSync } = require('node:fs');

console.log(globSync('**/*.js'));
copy
fs.lchmodSync(path, mode)
#
Deprecated since: v0.4.7
Stability: 0 - Deprecated
path <string> | <Buffer> | <URL>
mode <integer>
Changes the permissions on a symbolic link. Returns undefined.
This method is only implemented on macOS.
See the POSIX lchmod(2) documentation for more detail.
fs.lchownSync(path, uid, gid)
#
History













path <string> | <Buffer> | <URL>
uid <integer> The file's new owner's user id.
gid <integer> The file's new group's group id.
Set the owner for the path. Returns undefined.
See the POSIX lchown(2) documentation for more details.
fs.lutimesSync(path, atime, mtime)
#
Added in: v14.5.0, v12.19.0
path <string> | <Buffer> | <URL>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
Change the file system timestamps of the symbolic link referenced by path. Returns undefined, or throws an exception when parameters are incorrect or the operation fails. This is the synchronous version of fs.lutimes().
fs.linkSync(existingPath, newPath)
#
History













existingPath <string> | <Buffer> | <URL>
newPath <string> | <Buffer> | <URL>
Creates a new link from the existingPath to the newPath. See the POSIX link(2) documentation for more detail. Returns undefined.
fs.lstatSync(path[, options])
#
History





















path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
throwIfNoEntry <boolean> Whether an exception will be thrown if no file system entry exists, rather than returning undefined. Default: true.
Returns: <fs.Stats>
Retrieves the <fs.Stats> for the symbolic link referred to by path.
See the POSIX lstat(2) documentation for more details.
fs.mkdirSync(path[, options])
#
History





















path <string> | <Buffer> | <URL>
options <Object> | <integer>
recursive <boolean> Default: false
mode <string> | <integer> Not supported on Windows. Default: 0o777.
Returns: <string> | <undefined>
Synchronously creates a directory. Returns undefined, or if recursive is true, the first directory path created. This is the synchronous version of fs.mkdir().
See the POSIX mkdir(2) documentation for more details.
fs.mkdtempSync(prefix[, options])
#
History

















prefix <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <string>
Returns the created directory path.
For detailed information, see the documentation of the asynchronous version of this API: fs.mkdtemp().
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use.
fs.mkdtempDisposableSync(prefix[, options])
#
Added in: v24.4.0
prefix <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <Object> A disposable object:
path <string> The path of the created directory.
remove <Function> A function which removes the created directory.
[Symbol.dispose] <Function> The same as remove.
Returns a disposable object whose path property holds the created directory path. When the object is disposed, the directory and its contents will be removed if it still exists. If the directory cannot be deleted, disposal will throw an error. The object has a remove() method which will perform the same task.
For detailed information, see the documentation of fs.mkdtemp().
There is no callback-based version of this API because it is designed for use with the using syntax.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use.
fs.opendirSync(path[, options])
#
History

















path <string> | <Buffer> | <URL>
options <Object>
encoding <string> | <null> Default: 'utf8'
bufferSize <number> Number of directory entries that are buffered internally when reading from the directory. Higher values lead to better performance but higher memory usage. Default: 32
recursive <boolean> Default: false
Returns: <fs.Dir>
Synchronously open a directory. See opendir(3).
Creates an <fs.Dir>, which contains all further functions for reading from and cleaning up the directory.
The encoding option sets the encoding for the path while opening the directory and subsequent read operations.
fs.openSync(path[, flags[, mode]])
#
History





















path <string> | <Buffer> | <URL>
flags <string> | <number> Default: 'r'. See support of file system flags.
mode <string> | <integer> Default: 0o666
Returns: <number>
Returns an integer representing the file descriptor.
For detailed information, see the documentation of the asynchronous version of this API: fs.open().
fs.readdirSync(path[, options])
#
History





















path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
withFileTypes <boolean> Default: false
recursive <boolean> If true, reads the contents of a directory recursively. In recursive mode, it will list all files, sub files, and directories. Default: false.
Returns: <string[]> | <Buffer[]> | <fs.Dirent[]>
Reads the contents of the directory.
See the POSIX readdir(3) documentation for more details.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the filenames returned. If the encoding is set to 'buffer', the filenames returned will be passed as <Buffer> objects.
If options.withFileTypes is set to true, the result will contain <fs.Dirent> objects.
fs.readFileSync(path[, options])
#
History

















path <string> | <Buffer> | <URL> | <integer> filename or file descriptor
options <Object> | <string>
encoding <string> | <null> Default: null
flag <string> See support of file system flags. Default: 'r'.
Returns: <string> | <Buffer>
Returns the contents of the path.
For detailed information, see the documentation of the asynchronous version of this API: fs.readFile().
If the encoding option is specified then this function returns a string. Otherwise it returns a buffer.
Similar to fs.readFile(), when the path is a directory, the behavior of fs.readFileSync() is platform-specific.
import { readFileSync } from 'node:fs';

// macOS, Linux, and Windows
readFileSync('<directory>');
// => [Error: EISDIR: illegal operation on a directory, read <directory>]

//  FreeBSD
readFileSync('<directory>'); // => <data>
copy
fs.readlinkSync(path[, options])
#
History













path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <string> | <Buffer>
Returns the symbolic link's string value.
See the POSIX readlink(2) documentation for more details.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the link path returned. If the encoding is set to 'buffer', the link path returned will be passed as a <Buffer> object.
fs.readSync(fd, buffer, offset, length[, position])
#
History

















fd <integer>
buffer <Buffer> | <TypedArray> | <DataView>
offset <integer>
length <integer>
position <integer> | <bigint> | <null> Default: null
Returns: <number>
Returns the number of bytesRead.
For detailed information, see the documentation of the asynchronous version of this API: fs.read().
fs.readSync(fd, buffer[, options])
#
History













fd <integer>
buffer <Buffer> | <TypedArray> | <DataView>
options <Object>
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <bigint> | <null> Default: null
Returns: <number>
Returns the number of bytesRead.
Similar to the above fs.readSync function, this version takes an optional options object. If no options object is specified, it will default with the above values.
For detailed information, see the documentation of the asynchronous version of this API: fs.read().
fs.readvSync(fd, buffers[, position])
#
Added in: v13.13.0, v12.17.0
fd <integer>
buffers <ArrayBufferView[]>
position <integer> | <null> Default: null
Returns: <number> The number of bytes read.
For detailed information, see the documentation of the asynchronous version of this API: fs.readv().
fs.realpathSync(path[, options])
#
History

























path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <string> | <Buffer>
Returns the resolved pathname.
For detailed information, see the documentation of the asynchronous version of this API: fs.realpath().
fs.realpathSync.native(path[, options])
#
Added in: v9.2.0
path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <string> | <Buffer>
Synchronous realpath(3).
Only paths that can be converted to UTF8 strings are supported.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the path returned. If the encoding is set to 'buffer', the path returned will be passed as a <Buffer> object.
On Linux, when Node.js is linked against musl libc, the procfs file system must be mounted on /proc in order for this function to work. Glibc does not have this restriction.
fs.renameSync(oldPath, newPath)
#
History













oldPath <string> | <Buffer> | <URL>
newPath <string> | <Buffer> | <URL>
Renames the file from oldPath to newPath. Returns undefined.
See the POSIX rename(2) documentation for more details.
fs.rmdirSync(path[, options])
#
History





































path <string> | <Buffer> | <URL>
options <Object>
maxRetries <integer> If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered, Node.js retries the operation with a linear backoff wait of retryDelay milliseconds longer on each try. This option represents the number of retries. This option is ignored if the recursive option is not true. Default: 0.
recursive <boolean> If true, perform a recursive directory removal. In recursive mode, operations are retried on failure. Default: false. Deprecated.
retryDelay <integer> The amount of time in milliseconds to wait between retries. This option is ignored if the recursive option is not true. Default: 100.
Synchronous rmdir(2). Returns undefined.
Using fs.rmdirSync() on a file (not a directory) results in an ENOENT error on Windows and an ENOTDIR error on POSIX.
To get a behavior similar to the rm -rf Unix command, use fs.rmSync() with options { recursive: true, force: true }.
fs.rmSync(path[, options])
#
History













path <string> | <Buffer> | <URL>
options <Object>
force <boolean> When true, exceptions will be ignored if path does not exist. Default: false.
maxRetries <integer> If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered, Node.js will retry the operation with a linear backoff wait of retryDelay milliseconds longer on each try. This option represents the number of retries. This option is ignored if the recursive option is not true. Default: 0.
recursive <boolean> If true, perform a recursive directory removal. In recursive mode operations are retried on failure. Default: false.
retryDelay <integer> The amount of time in milliseconds to wait between retries. This option is ignored if the recursive option is not true. Default: 100.
Synchronously removes files and directories (modeled on the standard POSIX rm utility). Returns undefined.
fs.statSync(path[, options])
#
History





















path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
throwIfNoEntry <boolean> Whether an exception will be thrown if no file system entry exists, rather than returning undefined. Default: true.
Returns: <fs.Stats>
Retrieves the <fs.Stats> for the path.
fs.statfsSync(path[, options])
#
Added in: v19.6.0, v18.15.0
path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.StatFs> object should be bigint. Default: false.
Returns: <fs.StatFs>
Synchronous statfs(2). Returns information about the mounted file system which contains path.
In case of an error, the err.code will be one of Common System Errors.
fs.symlinkSync(target, path[, type])
#
History

















target <string> | <Buffer> | <URL>
path <string> | <Buffer> | <URL>
type <string> | <null> Default: null
Returns undefined.
For detailed information, see the documentation of the asynchronous version of this API: fs.symlink().
fs.truncateSync(path[, len])
#
Added in: v0.8.6
path <string> | <Buffer> | <URL>
len <integer> Default: 0
Truncates the file. Returns undefined. A file descriptor can also be passed as the first argument. In this case, fs.ftruncateSync() is called.
Passing a file descriptor is deprecated and may result in an error being thrown in the future.
fs.unlinkSync(path)
#
History













path <string> | <Buffer> | <URL>
Synchronous unlink(2). Returns undefined.
fs.utimesSync(path, atime, mtime)
#
History





















path <string> | <Buffer> | <URL>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
Returns undefined.
For detailed information, see the documentation of the asynchronous version of this API: fs.utimes().
fs.writeFileSync(file, data[, options])
#
History









































file <string> | <Buffer> | <URL> | <integer> filename or file descriptor
data <string> | <Buffer> | <TypedArray> | <DataView>
options <Object> | <string>
encoding <string> | <null> Default: 'utf8'
mode <integer> Default: 0o666
flag <string> See support of file system flags. Default: 'w'.
flush <boolean> If all data is successfully written to the file, and flush is true, fs.fsyncSync() is used to flush the data.
Returns undefined.
The mode option only affects the newly created file. See fs.open() for more details.
For detailed information, see the documentation of the asynchronous version of this API: fs.writeFile().
fs.writeSync(fd, buffer, offset[, length[, position]])
#
History

























fd <integer>
buffer <Buffer> | <TypedArray> | <DataView>
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <null> Default: null
Returns: <number> The number of bytes written.
For detailed information, see the documentation of the asynchronous version of this API: fs.write(fd, buffer...).
fs.writeSync(fd, buffer[, options])
#
Added in: v18.3.0, v16.17.0
fd <integer>
buffer <Buffer> | <TypedArray> | <DataView>
options <Object>
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <null> Default: null
Returns: <number> The number of bytes written.
For detailed information, see the documentation of the asynchronous version of this API: fs.write(fd, buffer...).
fs.writeSync(fd, string[, position[, encoding]])
#
History

















fd <integer>
string <string>
position <integer> | <null> Default: null
encoding <string> Default: 'utf8'
Returns: <number> The number of bytes written.
For detailed information, see the documentation of the asynchronous version of this API: fs.write(fd, string...).
fs.writevSync(fd, buffers[, position])
#
Added in: v12.9.0
fd <integer>
buffers <ArrayBufferView[]>
position <integer> | <null> Default: null
Returns: <number> The number of bytes written.
For detailed information, see the documentation of the asynchronous version of this API: fs.writev().
Common Objects
#
The common objects are shared by all of the file system API variants (promise, callback, and synchronous).
Class: fs.Dir
#
Added in: v12.12.0
A class representing a directory stream.
Created by fs.opendir(), fs.opendirSync(), or fsPromises.opendir().
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
copy
When using the async iterator, the <fs.Dir> object will be automatically closed after the iterator exits.
dir.close()
#
Added in: v12.12.0
Returns: <Promise>
Asynchronously close the directory's underlying resource handle. Subsequent reads will result in errors.
A promise is returned that will be fulfilled after the resource has been closed.
dir.close(callback)
#
History













callback <Function>
err <Error>
Asynchronously close the directory's underlying resource handle. Subsequent reads will result in errors.
The callback will be called after the resource handle has been closed.
dir.closeSync()
#
Added in: v12.12.0
Synchronously close the directory's underlying resource handle. Subsequent reads will result in errors.
dir.path
#
Added in: v12.12.0
<string>
The read-only path of this directory as was provided to fs.opendir(), fs.opendirSync(), or fsPromises.opendir().
dir.read()
#
Added in: v12.12.0
Returns: <Promise> Fulfills with a <fs.Dirent> | <null>
Asynchronously read the next directory entry via readdir(3) as an <fs.Dirent>.
A promise is returned that will be fulfilled with an <fs.Dirent>, or null if there are no more directory entries to read.
Directory entries returned by this function are in no particular order as provided by the operating system's underlying directory mechanisms. Entries added or removed while iterating over the directory might not be included in the iteration results.
dir.read(callback)
#
Added in: v12.12.0
callback <Function>
err <Error>
dirent <fs.Dirent> | <null>
Asynchronously read the next directory entry via readdir(3) as an <fs.Dirent>.
After the read is completed, the callback will be called with an <fs.Dirent>, or null if there are no more directory entries to read.
Directory entries returned by this function are in no particular order as provided by the operating system's underlying directory mechanisms. Entries added or removed while iterating over the directory might not be included in the iteration results.
dir.readSync()
#
Added in: v12.12.0
Returns: <fs.Dirent> | <null>
Synchronously read the next directory entry as an <fs.Dirent>. See the POSIX readdir(3) documentation for more detail.
If there are no more directory entries to read, null will be returned.
Directory entries returned by this function are in no particular order as provided by the operating system's underlying directory mechanisms. Entries added or removed while iterating over the directory might not be included in the iteration results.
dir[Symbol.asyncIterator]()
#
Added in: v12.12.0
Returns: <AsyncIterator> An AsyncIterator of <fs.Dirent>
Asynchronously iterates over the directory until all entries have been read. Refer to the POSIX readdir(3) documentation for more detail.
Entries returned by the async iterator are always an <fs.Dirent>. The null case from dir.read() is handled internally.
See <fs.Dir> for an example.
Directory entries returned by this iterator are in no particular order as provided by the operating system's underlying directory mechanisms. Entries added or removed while iterating over the directory might not be included in the iteration results.
dir[Symbol.asyncDispose]()
#
History













Calls dir.close() if the directory handle is open, and returns a promise that fulfills when disposal is complete.
dir[Symbol.dispose]()
#
History













Calls dir.closeSync() if the directory handle is open, and returns undefined.
Class: fs.Dirent
#
Added in: v10.10.0
A representation of a directory entry, which can be a file or a subdirectory within the directory, as returned by reading from an <fs.Dir>. The directory entry is a combination of the file name and file type pairs.
Additionally, when fs.readdir() or fs.readdirSync() is called with the withFileTypes option set to true, the resulting array is filled with <fs.Dirent> objects, rather than strings or <Buffer>s.
dirent.isBlockDevice()
#
Added in: v10.10.0
Returns: <boolean>
Returns true if the <fs.Dirent> object describes a block device.
dirent.isCharacterDevice()
#
Added in: v10.10.0
Returns: <boolean>
Returns true if the <fs.Dirent> object describes a character device.
dirent.isDirectory()
#
Added in: v10.10.0
Returns: <boolean>
Returns true if the <fs.Dirent> object describes a file system directory.
dirent.isFIFO()
#
Added in: v10.10.0
Returns: <boolean>
Returns true if the <fs.Dirent> object describes a first-in-first-out (FIFO) pipe.
dirent.isFile()
#
Added in: v10.10.0
Returns: <boolean>
Returns true if the <fs.Dirent> object describes a regular file.
dirent.isSocket()
#
Added in: v10.10.0
Returns: <boolean>
Returns true if the <fs.Dirent> object describes a socket.
dirent.isSymbolicLink()
#
Added in: v10.10.0
Returns: <boolean>
Returns true if the <fs.Dirent> object describes a symbolic link.
dirent.name
#
Added in: v10.10.0
<string> | <Buffer>
The file name that this <fs.Dirent> object refers to. The type of this value is determined by the options.encoding passed to fs.readdir() or fs.readdirSync().
dirent.parentPath
#
History













<string>
The path to the parent directory of the file this <fs.Dirent> object refers to.
Class: fs.FSWatcher
#
Added in: v0.5.8
Extends <EventEmitter>
A successful call to fs.watch() method will return a new <fs.FSWatcher> object.
All <fs.FSWatcher> objects emit a 'change' event whenever a specific watched file is modified.
Event: 'change'
#
Added in: v0.5.8
eventType <string> The type of change event that has occurred
filename <string> | <Buffer> The filename that changed (if relevant/available)
Emitted when something changes in a watched directory or file. See more details in fs.watch().
The filename argument may not be provided depending on operating system support. If filename is provided, it will be provided as a <Buffer> if fs.watch() is called with its encoding option set to 'buffer', otherwise filename will be a UTF-8 string.
import { watch } from 'node:fs';
// Example when handled through fs.watch() listener
watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // Prints: <Buffer ...>
  }
});
copy
Event: 'close'
#
Added in: v10.0.0
Emitted when the watcher stops watching for changes. The closed <fs.FSWatcher> object is no longer usable in the event handler.
Event: 'error'
#
Added in: v0.5.8
error <Error>
Emitted when an error occurs while watching the file. The errored <fs.FSWatcher> object is no longer usable in the event handler.
watcher.close()
#
Added in: v0.5.8
Stop watching for changes on the given <fs.FSWatcher>. Once stopped, the <fs.FSWatcher> object is no longer usable.
watcher.ref()
#
Added in: v14.3.0, v12.20.0
Returns: <fs.FSWatcher>
When called, requests that the Node.js event loop not exit so long as the <fs.FSWatcher> is active. Calling watcher.ref() multiple times will have no effect.
By default, all <fs.FSWatcher> objects are "ref'ed", making it normally unnecessary to call watcher.ref() unless watcher.unref() had been called previously.
watcher.unref()
#
Added in: v14.3.0, v12.20.0
Returns: <fs.FSWatcher>
When called, the active <fs.FSWatcher> object will not require the Node.js event loop to remain active. If there is no other activity keeping the event loop running, the process may exit before the <fs.FSWatcher> object's callback is invoked. Calling watcher.unref() multiple times will have no effect.
Class: fs.StatWatcher
#
Added in: v14.3.0, v12.20.0
Extends <EventEmitter>
A successful call to fs.watchFile() method will return a new <fs.StatWatcher> object.
watcher.ref()
#
Added in: v14.3.0, v12.20.0
Returns: <fs.StatWatcher>
When called, requests that the Node.js event loop not exit so long as the <fs.StatWatcher> is active. Calling watcher.ref() multiple times will have no effect.
By default, all <fs.StatWatcher> objects are "ref'ed", making it normally unnecessary to call watcher.ref() unless watcher.unref() had been called previously.
watcher.unref()
#
Added in: v14.3.0, v12.20.0
Returns: <fs.StatWatcher>
When called, the active <fs.StatWatcher> object will not require the Node.js event loop to remain active. If there is no other activity keeping the event loop running, the process may exit before the <fs.StatWatcher> object's callback is invoked. Calling watcher.unref() multiple times will have no effect.
Class: fs.ReadStream
#
Added in: v0.1.93
Extends: <stream.Readable>
Instances of <fs.ReadStream> are created and returned using the fs.createReadStream() function.
Event: 'close'
#
Added in: v0.1.93
Emitted when the <fs.ReadStream>'s underlying file descriptor has been closed.
Event: 'open'
#
Added in: v0.1.93
fd <integer> Integer file descriptor used by the <fs.ReadStream>.
Emitted when the <fs.ReadStream>'s file descriptor has been opened.
Event: 'ready'
#
Added in: v9.11.0
Emitted when the <fs.ReadStream> is ready to be used.
Fires immediately after 'open'.
readStream.bytesRead
#
Added in: v6.4.0
<number>
The number of bytes that have been read so far.
readStream.path
#
Added in: v0.1.93
<string> | <Buffer>
The path to the file the stream is reading from as specified in the first argument to fs.createReadStream(). If path is passed as a string, then readStream.path will be a string. If path is passed as a <Buffer>, then readStream.path will be a <Buffer>. If fd is specified, then readStream.path will be undefined.
readStream.pending
#
Added in: v11.2.0, v10.16.0
<boolean>
This property is true if the underlying file has not been opened yet, i.e. before the 'ready' event is emitted.
Class: fs.Stats
#
History

















A <fs.Stats> object provides information about a file.
Objects returned from fs.stat(), fs.lstat(), fs.fstat(), and their synchronous counterparts are of this type. If bigint in the options passed to those methods is true, the numeric values will be bigint instead of number, and the object will contain additional nanosecond-precision properties suffixed with Ns. Stat objects are not to be created directly using the new keyword.
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
copy
bigint version:
BigIntStats {
  dev: 2114n,
  ino: 48064969n,
  mode: 33188n,
  nlink: 1n,
  uid: 85n,
  gid: 100n,
  rdev: 0n,
  size: 527n,
  blksize: 4096n,
  blocks: 8n,
  atimeMs: 1318289051000n,
  mtimeMs: 1318289051000n,
  ctimeMs: 1318289051000n,
  birthtimeMs: 1318289051000n,
  atimeNs: 1318289051000000000n,
  mtimeNs: 1318289051000000000n,
  ctimeNs: 1318289051000000000n,
  birthtimeNs: 1318289051000000000n,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
copy
stats.isBlockDevice()
#
Added in: v0.1.10
Returns: <boolean>
Returns true if the <fs.Stats> object describes a block device.
stats.isCharacterDevice()
#
Added in: v0.1.10
Returns: <boolean>
Returns true if the <fs.Stats> object describes a character device.
stats.isDirectory()
#
Added in: v0.1.10
Returns: <boolean>
Returns true if the <fs.Stats> object describes a file system directory.
If the <fs.Stats> object was obtained from calling fs.lstat() on a symbolic link which resolves to a directory, this method will return false. This is because fs.lstat() returns information about a symbolic link itself and not the path it resolves to.
stats.isFIFO()
#
Added in: v0.1.10
Returns: <boolean>
Returns true if the <fs.Stats> object describes a first-in-first-out (FIFO) pipe.
stats.isFile()
#
Added in: v0.1.10
Returns: <boolean>
Returns true if the <fs.Stats> object describes a regular file.
stats.isSocket()
#
Added in: v0.1.10
Returns: <boolean>
Returns true if the <fs.Stats> object describes a socket.
stats.isSymbolicLink()
#
Added in: v0.1.10
Returns: <boolean>
Returns true if the <fs.Stats> object describes a symbolic link.
This method is only valid when using fs.lstat().
stats.dev
#
<number> | <bigint>
The numeric identifier of the device containing the file.
stats.ino
#
<number> | <bigint>
The file system specific "Inode" number for the file.
stats.mode
#
<number> | <bigint>
A bit-field describing the file type and mode.
stats.nlink
#
<number> | <bigint>
The number of hard-links that exist for the file.
stats.uid
#
<number> | <bigint>
The numeric user identifier of the user that owns the file (POSIX).
stats.gid
#
<number> | <bigint>
The numeric group identifier of the group that owns the file (POSIX).
stats.rdev
#
<number> | <bigint>
A numeric device identifier if the file represents a device.
stats.size
#
<number> | <bigint>
The size of the file in bytes.
If the underlying file system does not support getting the size of the file, this will be 0.
stats.blksize
#
<number> | <bigint>
The file system block size for i/o operations.
stats.blocks
#
<number> | <bigint>
The number of blocks allocated for this file.
stats.atimeMs
#
Added in: v8.1.0
<number> | <bigint>
The timestamp indicating the last time this file was accessed expressed in milliseconds since the POSIX Epoch.
stats.mtimeMs
#
Added in: v8.1.0
<number> | <bigint>
The timestamp indicating the last time this file was modified expressed in milliseconds since the POSIX Epoch.
stats.ctimeMs
#
Added in: v8.1.0
<number> | <bigint>
The timestamp indicating the last time the file status was changed expressed in milliseconds since the POSIX Epoch.
stats.birthtimeMs
#
Added in: v8.1.0
<number> | <bigint>
The timestamp indicating the creation time of this file expressed in milliseconds since the POSIX Epoch.
stats.atimeNs
#
Added in: v12.10.0
<bigint>
Only present when bigint: true is passed into the method that generates the object. The timestamp indicating the last time this file was accessed expressed in nanoseconds since the POSIX Epoch.
stats.mtimeNs
#
Added in: v12.10.0
<bigint>
Only present when bigint: true is passed into the method that generates the object. The timestamp indicating the last time this file was modified expressed in nanoseconds since the POSIX Epoch.
stats.ctimeNs
#
Added in: v12.10.0
<bigint>
Only present when bigint: true is passed into the method that generates the object. The timestamp indicating the last time the file status was changed expressed in nanoseconds since the POSIX Epoch.
stats.birthtimeNs
#
Added in: v12.10.0
<bigint>
Only present when bigint: true is passed into the method that generates the object. The timestamp indicating the creation time of this file expressed in nanoseconds since the POSIX Epoch.
stats.atime
#
Added in: v0.11.13
<Date>
The timestamp indicating the last time this file was accessed.
stats.mtime
#
Added in: v0.11.13
<Date>
The timestamp indicating the last time this file was modified.
stats.ctime
#
Added in: v0.11.13
<Date>
The timestamp indicating the last time the file status was changed.
stats.birthtime
#
Added in: v0.11.13
<Date>
The timestamp indicating the creation time of this file.
Stat time values
#
The atimeMs, mtimeMs, ctimeMs, birthtimeMs properties are numeric values that hold the corresponding times in milliseconds. Their precision is platform specific. When bigint: true is passed into the method that generates the object, the properties will be bigints, otherwise they will be numbers.
The atimeNs, mtimeNs, ctimeNs, birthtimeNs properties are bigints that hold the corresponding times in nanoseconds. They are only present when bigint: true is passed into the method that generates the object. Their precision is platform specific.
atime, mtime, ctime, and birthtime are Date object alternate representations of the various times. The Date and number values are not connected. Assigning a new number value, or mutating the Date value, will not be reflected in the corresponding alternate representation.
The times in the stat object have the following semantics:
atime "Access Time": Time when file data last accessed. Changed by the mknod(2), utimes(2), and read(2) system calls.
mtime "Modified Time": Time when file data last modified. Changed by the mknod(2), utimes(2), and write(2) system calls.
ctime "Change Time": Time when file status was last changed (inode data modification). Changed by the chmod(2), chown(2), link(2), mknod(2), rename(2), unlink(2), utimes(2), read(2), and write(2) system calls.
birthtime "Birth Time": Time of file creation. Set once when the file is created. On file systems where birthtime is not available, this field may instead hold either the ctime or 1970-01-01T00:00Z (ie, Unix epoch timestamp 0). This value may be greater than atime or mtime in this case. On Darwin and other FreeBSD variants, also set if the atime is explicitly set to an earlier value than the current birthtime using the utimes(2) system call.
Prior to Node.js 0.12, the ctime held the birthtime on Windows systems. As of 0.12, ctime is not "creation time", and on Unix systems, it never was.
Class: fs.StatFs
#
Added in: v19.6.0, v18.15.0
Provides information about a mounted file system.
Objects returned from fs.statfs() and its synchronous counterpart are of this type. If bigint in the options passed to those methods is true, the numeric values will be bigint instead of number.
StatFs {
  type: 1397114950,
  bsize: 4096,
  blocks: 121938943,
  bfree: 61058895,
  bavail: 61058895,
  files: 999,
  ffree: 1000000
}
copy
bigint version:
StatFs {
  type: 1397114950n,
  bsize: 4096n,
  blocks: 121938943n,
  bfree: 61058895n,
  bavail: 61058895n,
  files: 999n,
  ffree: 1000000n
}
copy
statfs.bavail
#
Added in: v19.6.0, v18.15.0
<number> | <bigint>
Free blocks available to unprivileged users.
statfs.bfree
#
Added in: v19.6.0, v18.15.0
<number> | <bigint>
Free blocks in file system.
statfs.blocks
#
Added in: v19.6.0, v18.15.0
<number> | <bigint>
Total data blocks in file system.
statfs.bsize
#
Added in: v19.6.0, v18.15.0
<number> | <bigint>
Optimal transfer block size.
statfs.ffree
#
Added in: v19.6.0, v18.15.0
<number> | <bigint>
Free file nodes in file system.
statfs.files
#
Added in: v19.6.0, v18.15.0
<number> | <bigint>
Total file nodes in file system.
statfs.type
#
Added in: v19.6.0, v18.15.0
<number> | <bigint>
Type of file system.
Class: fs.WriteStream
#
Added in: v0.1.93
Extends <stream.Writable>
Instances of <fs.WriteStream> are created and returned using the fs.createWriteStream() function.
Event: 'close'
#
Added in: v0.1.93
Emitted when the <fs.WriteStream>'s underlying file descriptor has been closed.
Event: 'open'
#
Added in: v0.1.93
fd <integer> Integer file descriptor used by the <fs.WriteStream>.
Emitted when the <fs.WriteStream>'s file is opened.
Event: 'ready'
#
Added in: v9.11.0
Emitted when the <fs.WriteStream> is ready to be used.
Fires immediately after 'open'.
writeStream.bytesWritten
#
Added in: v0.4.7
The number of bytes written so far. Does not include data that is still queued for writing.
writeStream.close([callback])
#
Added in: v0.9.4
callback <Function>
err <Error>
Closes writeStream. Optionally accepts a callback that will be executed once the writeStream is closed.
writeStream.path
#
Added in: v0.1.93
The path to the file the stream is writing to as specified in the first argument to fs.createWriteStream(). If path is passed as a string, then writeStream.path will be a string. If path is passed as a <Buffer>, then writeStream.path will be a <Buffer>.
writeStream.pending
#
Added in: v11.2.0
<boolean>
This property is true if the underlying file has not been opened yet, i.e. before the 'ready' event is emitted.
fs.constants
#
<Object>
Returns an object containing commonly used constants for file system operations.
FS constants
#
The following constants are exported by fs.constants and fsPromises.constants.
Not every constant will be available on every operating system; this is especially important for Windows, where many of the POSIX specific definitions are not available. For portable applications it is recommended to check for their presence before use.
To use more than one constant, use the bitwise OR | operator.
Example:
import { open, constants } from 'node:fs';

const {
  O_RDWR,
  O_CREAT,
  O_EXCL,
} = constants;

open('/path/to/my/file', O_RDWR | O_CREAT | O_EXCL, (err, fd) => {
  // ...
});
copy
File access constants
#
The following constants are meant for use as the mode parameter passed to fsPromises.access(), fs.access(), and fs.accessSync().
Constant
Description
F_OK
Flag indicating that the file is visible to the calling process. This is useful for determining if a file exists, but says nothing about rwx permissions. Default if no mode is specified.
R_OK
Flag indicating that the file can be read by the calling process.
W_OK
Flag indicating that the file can be written by the calling process.
X_OK
Flag indicating that the file can be executed by the calling process. This has no effect on Windows (will behave like fs.constants.F_OK).

The definitions are also available on Windows.
File copy constants
#
The following constants are meant for use with fs.copyFile().
Constant
Description
COPYFILE_EXCL
If present, the copy operation will fail with an error if the destination path already exists.
COPYFILE_FICLONE
If present, the copy operation will attempt to create a copy-on-write reflink. If the underlying platform does not support copy-on-write, then a fallback copy mechanism is used.
COPYFILE_FICLONE_FORCE
If present, the copy operation will attempt to create a copy-on-write reflink. If the underlying platform does not support copy-on-write, then the operation will fail with an error.

The definitions are also available on Windows.
File open constants
#
The following constants are meant for use with fs.open().
Constant
Description
O_RDONLY
Flag indicating to open a file for read-only access.
O_WRONLY
Flag indicating to open a file for write-only access.
O_RDWR
Flag indicating to open a file for read-write access.
O_CREAT
Flag indicating to create the file if it does not already exist.
O_EXCL
Flag indicating that opening a file should fail if the O_CREAT flag is set and the file already exists.
O_NOCTTY
Flag indicating that if path identifies a terminal device, opening the path shall not cause that terminal to become the controlling terminal for the process (if the process does not already have one).
O_TRUNC
Flag indicating that if the file exists and is a regular file, and the file is opened successfully for write access, its length shall be truncated to zero.
O_APPEND
Flag indicating that data will be appended to the end of the file.
O_DIRECTORY
Flag indicating that the open should fail if the path is not a directory.
O_NOATIME
Flag indicating reading accesses to the file system will no longer result in an update to the atime information associated with the file. This flag is available on Linux operating systems only.
O_NOFOLLOW
Flag indicating that the open should fail if the path is a symbolic link.
O_SYNC
Flag indicating that the file is opened for synchronized I/O with write operations waiting for file integrity.
O_DSYNC
Flag indicating that the file is opened for synchronized I/O with write operations waiting for data integrity.
O_SYMLINK
Flag indicating to open the symbolic link itself rather than the resource it is pointing to.
O_DIRECT
When set, an attempt will be made to minimize caching effects of file I/O.
O_NONBLOCK
Flag indicating to open the file in nonblocking mode when possible.
UV_FS_O_FILEMAP
When set, a memory file mapping is used to access the file. This flag is available on Windows operating systems only. On other operating systems, this flag is ignored.

On Windows, only O_APPEND, O_CREAT, O_EXCL, O_RDONLY, O_RDWR, O_TRUNC, O_WRONLY, and UV_FS_O_FILEMAP are available.
File type constants
#
The following constants are meant for use with the <fs.Stats> object's mode property for determining a file's type.
Constant
Description
S_IFMT
Bit mask used to extract the file type code.
S_IFREG
File type constant for a regular file.
S_IFDIR
File type constant for a directory.
S_IFCHR
File type constant for a character-oriented device file.
S_IFBLK
File type constant for a block-oriented device file.
S_IFIFO
File type constant for a FIFO/pipe.
S_IFLNK
File type constant for a symbolic link.
S_IFSOCK
File type constant for a socket.

On Windows, only S_IFCHR, S_IFDIR, S_IFLNK, S_IFMT, and S_IFREG, are available.
File mode constants
#
The following constants are meant for use with the <fs.Stats> object's mode property for determining the access permissions for a file.
Constant
Description
S_IRWXU
File mode indicating readable, writable, and executable by owner.
S_IRUSR
File mode indicating readable by owner.
S_IWUSR
File mode indicating writable by owner.
S_IXUSR
File mode indicating executable by owner.
S_IRWXG
File mode indicating readable, writable, and executable by group.
S_IRGRP
File mode indicating readable by group.
S_IWGRP
File mode indicating writable by group.
S_IXGRP
File mode indicating executable by group.
S_IRWXO
File mode indicating readable, writable, and executable by others.
S_IROTH
File mode indicating readable by others.
S_IWOTH
File mode indicating writable by others.
S_IXOTH
File mode indicating executable by others.

On Windows, only S_IRUSR and S_IWUSR are available.
Notes
#
Ordering of callback and promise-based operations
#
Because they are executed asynchronously by the underlying thread pool, there is no guaranteed ordering when using either the callback or promise-based methods.
For example, the following is prone to error because the fs.stat() operation might complete before the fs.rename() operation:
const fs = require('node:fs');

fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('renamed complete');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
copy
It is important to correctly order the operations by awaiting the results of one before invoking the other:
const { rename, stat } = require('node:fs/promises');

(async function(oldPath, newPath) {
  try {
    await rename(oldPath, newPath);
    const stats = await stat(newPath);
    console.log(`stats: ${JSON.stringify(stats)}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello', '/tmp/world');
copy
Or, when using the callback APIs, move the fs.stat() call into the callback of the fs.rename() operation:
const { rename, stat } = require('node:fs/promises');

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
copy
File paths
#
Most fs operations accept file paths that may be specified in the form of a string, a <Buffer>, or a <URL> object using the file: protocol.
String paths
#
String paths are interpreted as UTF-8 character sequences identifying the absolute or relative filename. Relative paths will be resolved relative to the current working directory as determined by calling process.cwd().
Example using an absolute path on POSIX:
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('/open/some/file.txt', 'r');
  // Do something with the file
} finally {
  await fd?.close();
}
copy
Example using a relative path on POSIX (relative to process.cwd()):
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('file.txt', 'r');
  // Do something with the file
} finally {
  await fd?.close();
}
copy
File URL paths
#
Added in: v7.6.0
For most node:fs module functions, the path or filename argument may be passed as a <URL> object using the file: protocol.
import { readFileSync } from 'node:fs';

readFileSync(new URL('file:///tmp/hello'));
copy
file: URLs are always absolute paths.
Platform-specific considerations
#
On Windows, file: <URL>s with a host name convert to UNC paths, while file: <URL>s with drive letters convert to local absolute paths. file: <URL>s with no host name and no drive letter will result in an error:
import { readFileSync } from 'node:fs';
// On Windows :

// - WHATWG file URLs with hostname convert to UNC path
// file://hostname/p/a/t/h/file => \\hostname\p\a\t\h\file
readFileSync(new URL('file://hostname/p/a/t/h/file'));

// - WHATWG file URLs with drive letters convert to absolute path
// file:///C:/tmp/hello => C:\tmp\hello
readFileSync(new URL('file:///C:/tmp/hello'));

// - WHATWG file URLs without hostname must have a drive letters
readFileSync(new URL('file:///notdriveletter/p/a/t/h/file'));
readFileSync(new URL('file:///c/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must be absolute
copy
file: <URL>s with drive letters must use : as a separator just after the drive letter. Using another separator will result in an error.
On all other platforms, file: <URL>s with a host name are unsupported and will result in an error:
import { readFileSync } from 'node:fs';
// On other platforms:

// - WHATWG file URLs with hostname are unsupported
// file://hostname/p/a/t/h/file => throw!
readFileSync(new URL('file://hostname/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: must be absolute

// - WHATWG file URLs convert to absolute path
// file:///tmp/hello => /tmp/hello
readFileSync(new URL('file:///tmp/hello'));
copy
A file: <URL> having encoded slash characters will result in an error on all platforms:
import { readFileSync } from 'node:fs';

// On Windows
readFileSync(new URL('file:///C:/p/a/t/h/%2F'));
readFileSync(new URL('file:///C:/p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */

// On POSIX
readFileSync(new URL('file:///p/a/t/h/%2F'));
readFileSync(new URL('file:///p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
/ characters */
copy
On Windows, file: <URL>s having encoded backslash will result in an error:
import { readFileSync } from 'node:fs';

// On Windows
readFileSync(new URL('file:///C:/path/%5C'));
readFileSync(new URL('file:///C:/path/%5c'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */
copy
Buffer paths
#
Paths specified using a <Buffer> are useful primarily on certain POSIX operating systems that treat file paths as opaque byte sequences. On such systems, it is possible for a single file path to contain sub-sequences that use multiple character encodings. As with string paths, <Buffer> paths may be relative or absolute:
Example using an absolute path on POSIX:
import { open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

let fd;
try {
  fd = await open(Buffer.from('/open/some/file.txt'), 'r');
  // Do something with the file
} finally {
  await fd?.close();
}
copy
Per-drive working directories on Windows
#
On Windows, Node.js follows the concept of per-drive working directory. This behavior can be observed when using a drive path without a backslash. For example fs.readdirSync('C:\\') can potentially return a different result than fs.readdirSync('C:'). For more information, see this MSDN page.
File descriptors
#
On POSIX systems, for every process, the kernel maintains a table of currently open files and resources. Each open file is assigned a simple numeric identifier called a file descriptor. At the system-level, all file system operations use these file descriptors to identify and track each specific file. Windows systems use a different but conceptually similar mechanism for tracking resources. To simplify things for users, Node.js abstracts away the differences between operating systems and assigns all open files a numeric file descriptor.
The callback-based fs.open(), and synchronous fs.openSync() methods open a file and allocate a new file descriptor. Once allocated, the file descriptor may be used to read data from, write data to, or request information about the file.
Operating systems limit the number of file descriptors that may be open at any given time so it is critical to close the descriptor when operations are completed. Failure to do so will result in a memory leak that will eventually cause an application to crash.
import { open, close, fstat } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  try {
    fstat(fd, (err, stat) => {
      if (err) {
        closeFd(fd);
        throw err;
      }

      // use stat

      closeFd(fd);
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
copy
The promise-based APIs use a <FileHandle> object in place of the numeric file descriptor. These objects are better managed by the system to ensure that resources are not leaked. However, it is still required that they are closed when operations are completed:
import { open } from 'node:fs/promises';

let file;
try {
  file = await open('/open/some/file.txt', 'r');
  const stat = await file.stat();
  // use stat
} finally {
  await file.close();
}
copy
Threadpool usage
#
All callback and promise-based file system APIs (with the exception of fs.FSWatcher()) use libuv's threadpool. This can have surprising and negative performance implications for some applications. See the UV_THREADPOOL_SIZE documentation for more information.
File system flags
#
The following flags are available wherever the flag option takes a string.
'a': Open file for appending. The file is created if it does not exist.
'ax': Like 'a' but fails if the path exists.
'a+': Open file for reading and appending. The file is created if it does not exist.
'ax+': Like 'a+' but fails if the path exists.
'as': Open file for appending in synchronous mode. The file is created if it does not exist.
'as+': Open file for reading and appending in synchronous mode. The file is created if it does not exist.
'r': Open file for reading. An exception occurs if the file does not exist.
'rs': Open file for reading in synchronous mode. An exception occurs if the file does not exist.
'r+': Open file for reading and writing. An exception occurs if the file does not exist.
'rs+': Open file for reading and writing in synchronous mode. Instructs the operating system to bypass the local file system cache.
This is primarily useful for opening files on NFS mounts as it allows skipping the potentially stale local cache. It has a very real impact on I/O performance so using this flag is not recommended unless it is needed.
This doesn't turn fs.open() or fsPromises.open() into a synchronous blocking call. If synchronous operation is desired, something like fs.openSync() should be used.
'w': Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
'wx': Like 'w' but fails if the path exists.
'w+': Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
'wx+': Like 'w+' but fails if the path exists.
flag can also be a number as documented by open(2); commonly used constants are available from fs.constants. On Windows, flags are translated to their equivalent ones where applicable, e.g. O_WRONLY to FILE_GENERIC_WRITE, or O_EXCL|O_CREAT to CREATE_NEW, as accepted by CreateFileW.
The exclusive flag 'x' (O_EXCL flag in open(2)) causes the operation to return an error if the path already exists. On POSIX, if the path is a symbolic link, using O_EXCL returns an error even if the link is to a path that does not exist. The exclusive flag might not work with network file systems.
On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
Modifying a file rather than replacing it may require the flag option to be set to 'r+' rather than the default 'w'.
The behavior of some flags are platform-specific. As such, opening a directory on macOS and Linux with the 'a+' flag, as in the example below, will return an error. In contrast, on Windows and FreeBSD, a file descriptor or a FileHandle will be returned.
// macOS and Linux
fs.open('<directory>', 'a+', (err, fd) => {
  // => [Error: EISDIR: illegal operation on a directory, open <directory>]
});

// Windows and FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
  // => null, <fd>
});
copy
On Windows, opening an existing hidden file using the 'w' flag (either through fs.open(), fs.writeFile(), or fsPromises.open()) will fail with EPERM. Existing hidden files can be opened for writing with the 'r+' flag.
A call to fs.ftruncate() or filehandle.truncate() can be used to reset the file contents.
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
 Other versions rOptions
Table of contents
File system
Promise example
Callback example
Synchronous example
Promises API
Class: FileHandle
Event: 'close'
filehandle.appendFile(data[, options])
filehandle.chmod(mode)
filehandle.chown(uid, gid)
filehandle.close()
filehandle.createReadStream([options])
filehandle.createWriteStream([options])
filehandle.datasync()
filehandle.fd
filehandle.read(buffer, offset, length, position)
filehandle.read([options])
filehandle.read(buffer[, options])
filehandle.readableWebStream([options])
filehandle.readFile(options)
filehandle.readLines([options])
filehandle.readv(buffers[, position])
filehandle.stat([options])
filehandle.sync()
filehandle.truncate(len)
filehandle.utimes(atime, mtime)
filehandle.write(buffer, offset[, length[, position]])
filehandle.write(buffer[, options])
filehandle.write(string[, position[, encoding]])
filehandle.writeFile(data, options)
filehandle.writev(buffers[, position])
filehandle[Symbol.asyncDispose]()
fsPromises.access(path[, mode])
fsPromises.appendFile(path, data[, options])
fsPromises.chmod(path, mode)
fsPromises.chown(path, uid, gid)
fsPromises.copyFile(src, dest[, mode])
fsPromises.cp(src, dest[, options])
fsPromises.glob(pattern[, options])
fsPromises.lchmod(path, mode)
fsPromises.lchown(path, uid, gid)
fsPromises.lutimes(path, atime, mtime)
fsPromises.link(existingPath, newPath)
fsPromises.lstat(path[, options])
fsPromises.mkdir(path[, options])
fsPromises.mkdtemp(prefix[, options])
fsPromises.mkdtempDisposable(prefix[, options])
fsPromises.open(path, flags[, mode])
fsPromises.opendir(path[, options])
fsPromises.readdir(path[, options])
fsPromises.readFile(path[, options])
fsPromises.readlink(path[, options])
fsPromises.realpath(path[, options])
fsPromises.rename(oldPath, newPath)
fsPromises.rmdir(path[, options])
fsPromises.rm(path[, options])
fsPromises.stat(path[, options])
fsPromises.statfs(path[, options])
fsPromises.symlink(target, path[, type])
fsPromises.truncate(path[, len])
fsPromises.unlink(path)
fsPromises.utimes(path, atime, mtime)
fsPromises.watch(filename[, options])
fsPromises.writeFile(file, data[, options])
fsPromises.constants
Callback API
fs.access(path[, mode], callback)
fs.appendFile(path, data[, options], callback)
fs.chmod(path, mode, callback)
File modes
fs.chown(path, uid, gid, callback)
fs.close(fd[, callback])
fs.copyFile(src, dest[, mode], callback)
fs.cp(src, dest[, options], callback)
fs.createReadStream(path[, options])
fs.createWriteStream(path[, options])
fs.exists(path, callback)
fs.fchmod(fd, mode, callback)
fs.fchown(fd, uid, gid, callback)
fs.fdatasync(fd, callback)
fs.fstat(fd[, options], callback)
fs.fsync(fd, callback)
fs.ftruncate(fd[, len], callback)
fs.futimes(fd, atime, mtime, callback)
fs.glob(pattern[, options], callback)
fs.lchmod(path, mode, callback)
fs.lchown(path, uid, gid, callback)
fs.lutimes(path, atime, mtime, callback)
fs.link(existingPath, newPath, callback)
fs.lstat(path[, options], callback)
fs.mkdir(path[, options], callback)
fs.mkdtemp(prefix[, options], callback)
fs.open(path[, flags[, mode]], callback)
fs.openAsBlob(path[, options])
fs.opendir(path[, options], callback)
fs.read(fd, buffer, offset, length, position, callback)
fs.read(fd[, options], callback)
fs.read(fd, buffer[, options], callback)
fs.readdir(path[, options], callback)
fs.readFile(path[, options], callback)
File descriptors
Performance Considerations
fs.readlink(path[, options], callback)
fs.readv(fd, buffers[, position], callback)
fs.realpath(path[, options], callback)
fs.realpath.native(path[, options], callback)
fs.rename(oldPath, newPath, callback)
fs.rmdir(path[, options], callback)
fs.rm(path[, options], callback)
fs.stat(path[, options], callback)
fs.statfs(path[, options], callback)
fs.symlink(target, path[, type], callback)
fs.truncate(path[, len], callback)
fs.unlink(path, callback)
fs.unwatchFile(filename[, listener])
fs.utimes(path, atime, mtime, callback)
fs.watch(filename[, options][, listener])
Caveats
Availability
Inodes
Filename argument
fs.watchFile(filename[, options], listener)
fs.write(fd, buffer, offset[, length[, position]], callback)
fs.write(fd, buffer[, options], callback)
fs.write(fd, string[, position[, encoding]], callback)
fs.writeFile(file, data[, options], callback)
Using fs.writeFile() with file descriptors
fs.writev(fd, buffers[, position], callback)
Synchronous API
fs.accessSync(path[, mode])
fs.appendFileSync(path, data[, options])
fs.chmodSync(path, mode)
fs.chownSync(path, uid, gid)
fs.closeSync(fd)
fs.copyFileSync(src, dest[, mode])
fs.cpSync(src, dest[, options])
fs.existsSync(path)
fs.fchmodSync(fd, mode)
fs.fchownSync(fd, uid, gid)
fs.fdatasyncSync(fd)
fs.fstatSync(fd[, options])
fs.fsyncSync(fd)
fs.ftruncateSync(fd[, len])
fs.futimesSync(fd, atime, mtime)
fs.globSync(pattern[, options])
fs.lchmodSync(path, mode)
fs.lchownSync(path, uid, gid)
fs.lutimesSync(path, atime, mtime)
fs.linkSync(existingPath, newPath)
fs.lstatSync(path[, options])
fs.mkdirSync(path[, options])
fs.mkdtempSync(prefix[, options])
fs.mkdtempDisposableSync(prefix[, options])
fs.opendirSync(path[, options])
fs.openSync(path[, flags[, mode]])
fs.readdirSync(path[, options])
fs.readFileSync(path[, options])
fs.readlinkSync(path[, options])
fs.readSync(fd, buffer, offset, length[, position])
fs.readSync(fd, buffer[, options])
fs.readvSync(fd, buffers[, position])
fs.realpathSync(path[, options])
fs.realpathSync.native(path[, options])
fs.renameSync(oldPath, newPath)
fs.rmdirSync(path[, options])
fs.rmSync(path[, options])
fs.statSync(path[, options])
fs.statfsSync(path[, options])
fs.symlinkSync(target, path[, type])
fs.truncateSync(path[, len])
fs.unlinkSync(path)
fs.utimesSync(path, atime, mtime)
fs.writeFileSync(file, data[, options])
fs.writeSync(fd, buffer, offset[, length[, position]])
fs.writeSync(fd, buffer[, options])
fs.writeSync(fd, string[, position[, encoding]])
fs.writevSync(fd, buffers[, position])
Common Objects
Class: fs.Dir
dir.close()
dir.close(callback)
dir.closeSync()
dir.path
dir.read()
dir.read(callback)
dir.readSync()
dir[Symbol.asyncIterator]()
dir[Symbol.asyncDispose]()
dir[Symbol.dispose]()
Class: fs.Dirent
dirent.isBlockDevice()
dirent.isCharacterDevice()
dirent.isDirectory()
dirent.isFIFO()
dirent.isFile()
dirent.isSocket()
dirent.isSymbolicLink()
dirent.name
dirent.parentPath
Class: fs.FSWatcher
Event: 'change'
Event: 'close'
Event: 'error'
watcher.close()
watcher.ref()
watcher.unref()
Class: fs.StatWatcher
watcher.ref()
watcher.unref()
Class: fs.ReadStream
Event: 'close'
Event: 'open'
Event: 'ready'
readStream.bytesRead
readStream.path
readStream.pending
Class: fs.Stats
stats.isBlockDevice()
stats.isCharacterDevice()
stats.isDirectory()
stats.isFIFO()
stats.isFile()
stats.isSocket()
stats.isSymbolicLink()
stats.dev
stats.ino
stats.mode
stats.nlink
stats.uid
stats.gid
stats.rdev
stats.size
stats.blksize
stats.blocks
stats.atimeMs
stats.mtimeMs
stats.ctimeMs
stats.birthtimeMs
stats.atimeNs
stats.mtimeNs
stats.ctimeNs
stats.birthtimeNs
stats.atime
stats.mtime
stats.ctime
stats.birthtime
Stat time values
Class: fs.StatFs
statfs.bavail
statfs.bfree
statfs.blocks
statfs.bsize
statfs.ffree
statfs.files
statfs.type
Class: fs.WriteStream
Event: 'close'
Event: 'open'
Event: 'ready'
writeStream.bytesWritten
writeStream.close([callback])
writeStream.path
writeStream.pending
fs.constants
FS constants
File access constants
File copy constants
File open constants
File type constants
File mode constants
Notes
Ordering of callback and promise-based operations
File paths
String paths
File URL paths
Platform-specific considerations
Buffer paths
Per-drive working directories on Windows
File descriptors
Threadpool usage
File system flags
File system
#
Stability: 2 - Stable
Source Code: lib/fs.js
The node:fs module enables interacting with the file system in a way modeled on standard POSIX functions.
To use the promise-based APIs:
const fs = require('node:fs/promises');
copy
To use the callback and sync APIs:
const fs = require('node:fs');
copy
All file system operations have synchronous, callback, and promise-based forms, and are accessible using both CommonJS syntax and ES6 Modules (ESM).
Promise example
#
Promise-based operations return a promise that is fulfilled when the asynchronous operation is complete.
const { unlink } = require('node:fs/promises');

(async function(path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello');
copy
Callback example
#
The callback form takes a completion callback function as its last argument and invokes the operation asynchronously. The arguments passed to the completion callback depend on the method, but the first argument is always reserved for an exception. If the operation is completed successfully, then the first argument is null or undefined.
const { unlink } = require('node:fs');

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
copy
The callback-based versions of the node:fs module APIs are preferable over the use of the promise APIs when maximal performance (both in terms of execution time and memory allocation) is required.
Synchronous example
#
The synchronous APIs block the Node.js event loop and further JavaScript execution until the operation is complete. Exceptions are thrown immediately and can be handled using try…catch, or can be allowed to bubble up.
const { unlinkSync } = require('node:fs');

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
copy
Promises API
#
History





















The fs/promises API provides asynchronous file system methods that return promises.
The promise APIs use the underlying Node.js threadpool to perform file system operations off the event loop thread. These operations are not synchronized or threadsafe. Care must be taken when performing multiple concurrent modifications on the same file or data corruption may occur.
Class: FileHandle
#
Added in: v10.0.0
A <FileHandle> object is an object wrapper for a numeric file descriptor.
Instances of the <FileHandle> object are created by the fsPromises.open() method.
All <FileHandle> objects are <EventEmitter>s.
If a <FileHandle> is not closed using the filehandle.close() method, it will try to automatically close the file descriptor and emit a process warning, helping to prevent memory leaks. Please do not rely on this behavior because it can be unreliable and the file may not be closed. Instead, always explicitly close <FileHandle>s. Node.js may change this behavior in the future.
Event: 'close'
#
Added in: v15.4.0
The 'close' event is emitted when the <FileHandle> has been closed and can no longer be used.
filehandle.appendFile(data[, options])
#
History





















data <string> | <Buffer> | <TypedArray> | <DataView> | <AsyncIterable> | <Iterable> | <Stream>
options <Object> | <string>
encoding <string> | <null> Default: 'utf8'
signal <AbortSignal> | <undefined> allows aborting an in-progress writeFile. Default: undefined
Returns: <Promise> Fulfills with undefined upon success.
Alias of filehandle.writeFile().
When operating on file handles, the mode cannot be changed from what it was set to with fsPromises.open(). Therefore, this is equivalent to filehandle.writeFile().
filehandle.chmod(mode)
#
Added in: v10.0.0
mode <integer> the file mode bit mask.
Returns: <Promise> Fulfills with undefined upon success.
Modifies the permissions on the file. See chmod(2).
filehandle.chown(uid, gid)
#
Added in: v10.0.0
uid <integer> The file's new owner's user id.
gid <integer> The file's new group's group id.
Returns: <Promise> Fulfills with undefined upon success.
Changes the ownership of the file. A wrapper for chown(2).
filehandle.close()
#
Added in: v10.0.0
Returns: <Promise> Fulfills with undefined upon success.
Closes the file handle after waiting for any pending operation on the handle to complete.
import { open } from 'node:fs/promises';

let filehandle;
try {
  filehandle = await open('thefile.txt', 'r');
} finally {
  await filehandle?.close();
}
copy
filehandle.createReadStream([options])
#
Added in: v16.11.0
options <Object>
encoding <string> Default: null
autoClose <boolean> Default: true
emitClose <boolean> Default: true
start <integer>
end <integer> Default: Infinity
highWaterMark <integer> Default: 64 * 1024
signal <AbortSignal> | <undefined> Default: undefined
Returns: <fs.ReadStream>
options can include start and end values to read a range of bytes from the file instead of the entire file. Both start and end are inclusive and start counting at 0, allowed values are in the [0, Number.MAX_SAFE_INTEGER] range. If start is omitted or undefined, filehandle.createReadStream() reads sequentially from the current file position. The encoding can be any one of those accepted by <Buffer>.
If the FileHandle points to a character device that only supports blocking reads (such as keyboard or sound card), read operations do not finish until data is available. This can prevent the process from exiting and the stream from closing naturally.
By default, the stream will emit a 'close' event after it has been destroyed. Set the emitClose option to false to change this behavior.
import { open } from 'node:fs/promises';

const fd = await open('/dev/input/event0');
// Create a stream from some character device.
const stream = fd.createReadStream();
setTimeout(() => {
  stream.close(); // This may not close the stream.
  // Artificially marking end-of-stream, as if the underlying resource had
  // indicated end-of-file by itself, allows the stream to close.
  // This does not cancel pending read operations, and if there is such an
  // operation, the process may still not be able to exit successfully
  // until it finishes.
  stream.push(null);
  stream.read(0);
}, 100);
copy
If autoClose is false, then the file descriptor won't be closed, even if there's an error. It is the application's responsibility to close it and make sure there's no file descriptor leak. If autoClose is set to true (default behavior), on 'error' or 'end' the file descriptor will be closed automatically.
An example to read the last 10 bytes of a file which is 100 bytes long:
import { open } from 'node:fs/promises';

const fd = await open('sample.txt');
fd.createReadStream({ start: 90, end: 99 });
copy
filehandle.createWriteStream([options])
#
History













options <Object>
encoding <string> Default: 'utf8'
autoClose <boolean> Default: true
emitClose <boolean> Default: true
start <integer>
highWaterMark <number> Default: 16384
flush <boolean> If true, the underlying file descriptor is flushed prior to closing it. Default: false.
Returns: <fs.WriteStream>
options may also include a start option to allow writing data at some position past the beginning of the file, allowed values are in the [0, Number.MAX_SAFE_INTEGER] range. Modifying a file rather than replacing it may require the flags open option to be set to r+ rather than the default r. The encoding can be any one of those accepted by <Buffer>.
If autoClose is set to true (default behavior) on 'error' or 'finish' the file descriptor will be closed automatically. If autoClose is false, then the file descriptor won't be closed, even if there's an error. It is the application's responsibility to close it and make sure there's no file descriptor leak.
By default, the stream will emit a 'close' event after it has been destroyed. Set the emitClose option to false to change this behavior.
filehandle.datasync()
#
Added in: v10.0.0
Returns: <Promise> Fulfills with undefined upon success.
Forces all currently queued I/O operations associated with the file to the operating system's synchronized I/O completion state. Refer to the POSIX fdatasync(2) documentation for details.
Unlike filehandle.sync this method does not flush modified metadata.
filehandle.fd
#
Added in: v10.0.0
<number> The numeric file descriptor managed by the <FileHandle> object.
filehandle.read(buffer, offset, length, position)
#
History













buffer <Buffer> | <TypedArray> | <DataView> A buffer that will be filled with the file data read.
offset <integer> The location in the buffer at which to start filling. Default: 0
length <integer> The number of bytes to read. Default: buffer.byteLength - offset
position <integer> | <bigint> | <null> The location where to begin reading data from the file. If null or -1, data will be read from the current file position, and the position will be updated. If position is a non-negative integer, the current file position will remain unchanged. Default:: null
Returns: <Promise> Fulfills upon success with an object with two properties:
bytesRead <integer> The number of bytes read
buffer <Buffer> | <TypedArray> | <DataView> A reference to the passed in buffer argument.
Reads data from the file and stores that in the given buffer.
If the file is not modified concurrently, the end-of-file is reached when the number of bytes read is zero.
filehandle.read([options])
#
History













options <Object>
buffer <Buffer> | <TypedArray> | <DataView> A buffer that will be filled with the file data read. Default: Buffer.alloc(16384)
offset <integer> The location in the buffer at which to start filling. Default: 0
length <integer> The number of bytes to read. Default: buffer.byteLength - offset
position <integer> | <bigint> | <null> The location where to begin reading data from the file. If null or -1, data will be read from the current file position, and the position will be updated. If position is a non-negative integer, the current file position will remain unchanged. Default:: null
Returns: <Promise> Fulfills upon success with an object with two properties:
bytesRead <integer> The number of bytes read
buffer <Buffer> | <TypedArray> | <DataView> A reference to the passed in buffer argument.
Reads data from the file and stores that in the given buffer.
If the file is not modified concurrently, the end-of-file is reached when the number of bytes read is zero.
filehandle.read(buffer[, options])
#
History













buffer <Buffer> | <TypedArray> | <DataView> A buffer that will be filled with the file data read.
options <Object>
offset <integer> The location in the buffer at which to start filling. Default: 0
length <integer> The number of bytes to read. Default: buffer.byteLength - offset
position <integer> | <bigint> | <null> The location where to begin reading data from the file. If null or -1, data will be read from the current file position, and the position will be updated. If position is a non-negative integer, the current file position will remain unchanged. Default:: null
Returns: <Promise> Fulfills upon success with an object with two properties:
bytesRead <integer> The number of bytes read
buffer <Buffer> | <TypedArray> | <DataView> A reference to the passed in buffer argument.
Reads data from the file and stores that in the given buffer.
If the file is not modified concurrently, the end-of-file is reached when the number of bytes read is zero.
filehandle.readableWebStream([options])
#
History

























options <Object>
autoClose <boolean> When true, causes the <FileHandle> to be closed when the stream is closed. Default: false
Returns: <ReadableStream>
Returns a byte-oriented ReadableStream that may be used to read the file's contents.
An error will be thrown if this method is called more than once or is called after the FileHandle is closed or closing.
const {
  open,
} = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const chunk of file.readableWebStream())
    console.log(chunk);

  await file.close();
})();
copy
While the ReadableStream will read the file to completion, it will not close the FileHandle automatically. User code must still call the fileHandle.close() method.
filehandle.readFile(options)
#
Added in: v10.0.0
options <Object> | <string>
encoding <string> | <null> Default: null
signal <AbortSignal> allows aborting an in-progress readFile
Returns: <Promise> Fulfills upon a successful read with the contents of the file. If no encoding is specified (using options.encoding), the data is returned as a <Buffer> object. Otherwise, the data will be a string.
Asynchronously reads the entire contents of a file.
If options is a string, then it specifies the encoding.
The <FileHandle> has to support reading.
If one or more filehandle.read() calls are made on a file handle and then a filehandle.readFile() call is made, the data will be read from the current position till the end of the file. It doesn't always read from the beginning of the file.
filehandle.readLines([options])
#
Added in: v18.11.0
options <Object>
encoding <string> Default: null
autoClose <boolean> Default: true
emitClose <boolean> Default: true
start <integer>
end <integer> Default: Infinity
highWaterMark <integer> Default: 64 * 1024
Returns: <readline.InterfaceConstructor>
Convenience method to create a readline interface and stream over the file. See filehandle.createReadStream() for the options.
const { open } = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const line of file.readLines()) {
    console.log(line);
  }
})();
copy
filehandle.readv(buffers[, position])
#
Added in: v13.13.0, v12.17.0
buffers <Buffer[]> | <TypedArray[]> | <DataView[]>
position <integer> | <null> The offset from the beginning of the file where the data should be read from. If position is not a number, the data will be read from the current position. Default: null
Returns: <Promise> Fulfills upon success an object containing two properties:
bytesRead <integer> the number of bytes read
buffers <Buffer[]> | <TypedArray[]> | <DataView[]> property containing a reference to the buffers input.
Read from a file and write to an array of <ArrayBufferView>s
filehandle.stat([options])
#
History













options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
Returns: <Promise> Fulfills with an <fs.Stats> for the file.
filehandle.sync()
#
Added in: v10.0.0
Returns: <Promise> Fulfills with undefined upon success.
Request that all data for the open file descriptor is flushed to the storage device. The specific implementation is operating system and device specific. Refer to the POSIX fsync(2) documentation for more detail.
filehandle.truncate(len)
#
Added in: v10.0.0
len <integer> Default: 0
Returns: <Promise> Fulfills with undefined upon success.
Truncates the file.
If the file was larger than len bytes, only the first len bytes will be retained in the file.
The following example retains only the first four bytes of the file:
import { open } from 'node:fs/promises';

let filehandle = null;
try {
  filehandle = await open('temp.txt', 'r+');
  await filehandle.truncate(4);
} finally {
  await filehandle?.close();
}
copy
If the file previously was shorter than len bytes, it is extended, and the extended part is filled with null bytes ('\0'):
If len is negative then 0 will be used.
filehandle.utimes(atime, mtime)
#
Added in: v10.0.0
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
Returns: <Promise>
Change the file system timestamps of the object referenced by the <FileHandle> then fulfills the promise with no arguments upon success.
filehandle.write(buffer, offset[, length[, position]])
#
History













buffer <Buffer> | <TypedArray> | <DataView>
offset <integer> The start position from within buffer where the data to write begins.
length <integer> The number of bytes from buffer to write. Default: buffer.byteLength - offset
position <integer> | <null> The offset from the beginning of the file where the data from buffer should be written. If position is not a number, the data will be written at the current position. See the POSIX pwrite(2) documentation for more detail. Default: null
Returns: <Promise>
Write buffer to the file.
The promise is fulfilled with an object containing two properties:
bytesWritten <integer> the number of bytes written
buffer <Buffer> | <TypedArray> | <DataView> a reference to the buffer written.
It is unsafe to use filehandle.write() multiple times on the same file without waiting for the promise to be fulfilled (or rejected). For this scenario, use filehandle.createWriteStream().
On Linux, positional writes do not work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
filehandle.write(buffer[, options])
#
Added in: v18.3.0, v16.17.0
buffer <Buffer> | <TypedArray> | <DataView>
options <Object>
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <null> Default: null
Returns: <Promise>
Write buffer to the file.
Similar to the above filehandle.write function, this version takes an optional options object. If no options object is specified, it will default with the above values.
filehandle.write(string[, position[, encoding]])
#
History













string <string>
position <integer> | <null> The offset from the beginning of the file where the data from string should be written. If position is not a number the data will be written at the current position. See the POSIX pwrite(2) documentation for more detail. Default: null
encoding <string> The expected string encoding. Default: 'utf8'
Returns: <Promise>
Write string to the file. If string is not a string, the promise is rejected with an error.
The promise is fulfilled with an object containing two properties:
bytesWritten <integer> the number of bytes written
buffer <string> a reference to the string written.
It is unsafe to use filehandle.write() multiple times on the same file without waiting for the promise to be fulfilled (or rejected). For this scenario, use filehandle.createWriteStream().
On Linux, positional writes do not work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
filehandle.writeFile(data, options)
#
History

















data <string> | <Buffer> | <TypedArray> | <DataView> | <AsyncIterable> | <Iterable> | <Stream>
options <Object> | <string>
encoding <string> | <null> The expected character encoding when data is a string. Default: 'utf8'
signal <AbortSignal> | <undefined> allows aborting an in-progress writeFile. Default: undefined
Returns: <Promise>
Asynchronously writes data to a file, replacing the file if it already exists. data can be a string, a buffer, an <AsyncIterable>, or an <Iterable> object. The promise is fulfilled with no arguments upon success.
If options is a string, then it specifies the encoding.
The <FileHandle> has to support writing.
It is unsafe to use filehandle.writeFile() multiple times on the same file without waiting for the promise to be fulfilled (or rejected).
If one or more filehandle.write() calls are made on a file handle and then a filehandle.writeFile() call is made, the data will be written from the current position till the end of the file. It doesn't always write from the beginning of the file.
filehandle.writev(buffers[, position])
#
Added in: v12.9.0
buffers <Buffer[]> | <TypedArray[]> | <DataView[]>
position <integer> | <null> The offset from the beginning of the file where the data from buffers should be written. If position is not a number, the data will be written at the current position. Default: null
Returns: <Promise>
Write an array of <ArrayBufferView>s to the file.
The promise is fulfilled with an object containing a two properties:
bytesWritten <integer> the number of bytes written
buffers <Buffer[]> | <TypedArray[]> | <DataView[]> a reference to the buffers input.
It is unsafe to call writev() multiple times on the same file without waiting for the promise to be fulfilled (or rejected).
On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
filehandle[Symbol.asyncDispose]()
#
History













Calls filehandle.close() and returns a promise that fulfills when the filehandle is closed.
fsPromises.access(path[, mode])
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
mode <integer> Default: fs.constants.F_OK
Returns: <Promise> Fulfills with undefined upon success.
Tests a user's permissions for the file or directory specified by path. The mode argument is an optional integer that specifies the accessibility checks to be performed. mode should be either the value fs.constants.F_OK or a mask consisting of the bitwise OR of any of fs.constants.R_OK, fs.constants.W_OK, and fs.constants.X_OK (e.g. fs.constants.W_OK | fs.constants.R_OK). Check File access constants for possible values of mode.
If the accessibility check is successful, the promise is fulfilled with no value. If any of the accessibility checks fail, the promise is rejected with an <Error> object. The following example checks if the file /etc/passwd can be read and written by the current process.
import { access, constants } from 'node:fs/promises';

try {
  await access('/etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can access');
} catch {
  console.error('cannot access');
}
copy
Using fsPromises.access() to check for the accessibility of a file before calling fsPromises.open() is not recommended. Doing so introduces a race condition, since other processes may change the file's state between the two calls. Instead, user code should open/read/write the file directly and handle the error raised if the file is not accessible.
fsPromises.appendFile(path, data[, options])
#
History













path <string> | <Buffer> | <URL> | <FileHandle> filename or <FileHandle>
data <string> | <Buffer>
options <Object> | <string>
encoding <string> | <null> Default: 'utf8'
mode <integer> Default: 0o666
flag <string> See support of file system flags. Default: 'a'.
flush <boolean> If true, the underlying file descriptor is flushed prior to closing it. Default: false.
Returns: <Promise> Fulfills with undefined upon success.
Asynchronously append data to a file, creating the file if it does not yet exist. data can be a string or a <Buffer>.
If options is a string, then it specifies the encoding.
The mode option only affects the newly created file. See fs.open() for more details.
The path may be specified as a <FileHandle> that has been opened for appending (using fsPromises.open()).
fsPromises.chmod(path, mode)
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
mode <string> | <integer>
Returns: <Promise> Fulfills with undefined upon success.
Changes the permissions of a file.
fsPromises.chown(path, uid, gid)
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
uid <integer>
gid <integer>
Returns: <Promise> Fulfills with undefined upon success.
Changes the ownership of a file.
fsPromises.copyFile(src, dest[, mode])
#
History













src <string> | <Buffer> | <URL> source filename to copy
dest <string> | <Buffer> | <URL> destination filename of the copy operation
mode <integer> Optional modifiers that specify the behavior of the copy operation. It is possible to create a mask consisting of the bitwise OR of two or more values (e.g. fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE) Default: 0.
fs.constants.COPYFILE_EXCL: The copy operation will fail if dest already exists.
fs.constants.COPYFILE_FICLONE: The copy operation will attempt to create a copy-on-write reflink. If the platform does not support copy-on-write, then a fallback copy mechanism is used.
fs.constants.COPYFILE_FICLONE_FORCE: The copy operation will attempt to create a copy-on-write reflink. If the platform does not support copy-on-write, then the operation will fail.
Returns: <Promise> Fulfills with undefined upon success.
Asynchronously copies src to dest. By default, dest is overwritten if it already exists.
No guarantees are made about the atomicity of the copy operation. If an error occurs after the destination file has been opened for writing, an attempt will be made to remove the destination.
import { copyFile, constants } from 'node:fs/promises';

try {
  await copyFile('source.txt', 'destination.txt');
  console.log('source.txt was copied to destination.txt');
} catch {
  console.error('The file could not be copied');
}

// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
try {
  await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
  console.log('source.txt was copied to destination.txt');
} catch {
  console.error('The file could not be copied');
}
copy
fsPromises.cp(src, dest[, options])
#
History





















src <string> | <URL> source path to copy.
dest <string> | <URL> destination path to copy to.
options <Object>
dereference <boolean> dereference symlinks. Default: false.
errorOnExist <boolean> when force is false, and the destination exists, throw an error. Default: false.
filter <Function> Function to filter copied files/directories. Return true to copy the item, false to ignore it. When ignoring a directory, all of its contents will be skipped as well. Can also return a Promise that resolves to true or false Default: undefined.
src <string> source path to copy.
dest <string> destination path to copy to.
Returns: <boolean> | <Promise> A value that is coercible to boolean or a Promise that fulfils with such value.
force <boolean> overwrite existing file or directory. The copy operation will ignore errors if you set this to false and the destination exists. Use the errorOnExist option to change this behavior. Default: true.
mode <integer> modifiers for copy operation. Default: 0. See mode flag of fsPromises.copyFile().
preserveTimestamps <boolean> When true timestamps from src will be preserved. Default: false.
recursive <boolean> copy directories recursively Default: false
verbatimSymlinks <boolean> When true, path resolution for symlinks will be skipped. Default: false
Returns: <Promise> Fulfills with undefined upon success.
Asynchronously copies the entire directory structure from src to dest, including subdirectories and files.
When copying a directory to another directory, globs are not supported and behavior is similar to cp dir1/ dir2/.
fsPromises.glob(pattern[, options])
#
History

























pattern <string> | <string[]>
options <Object>
cwd <string> | <URL> current working directory. Default: process.cwd()
exclude <Function> | <string[]> Function to filter out files/directories or a list of glob patterns to be excluded. If a function is provided, return true to exclude the item, false to include it. Default: undefined.
withFileTypes <boolean> true if the glob should return paths as Dirents, false otherwise. Default: false.
Returns: <AsyncIterator> An AsyncIterator that yields the paths of files that match the pattern.
const { glob } = require('node:fs/promises');

(async () => {
  for await (const entry of glob('**/*.js'))
    console.log(entry);
})();
copy
fsPromises.lchmod(path, mode)
#
Deprecated since: v10.0.0
Stability: 0 - Deprecated
path <string> | <Buffer> | <URL>
mode <integer>
Returns: <Promise> Fulfills with undefined upon success.
Changes the permissions on a symbolic link.
This method is only implemented on macOS.
fsPromises.lchown(path, uid, gid)
#
History













path <string> | <Buffer> | <URL>
uid <integer>
gid <integer>
Returns: <Promise> Fulfills with undefined upon success.
Changes the ownership on a symbolic link.
fsPromises.lutimes(path, atime, mtime)
#
Added in: v14.5.0, v12.19.0
path <string> | <Buffer> | <URL>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
Returns: <Promise> Fulfills with undefined upon success.
Changes the access and modification times of a file in the same way as fsPromises.utimes(), with the difference that if the path refers to a symbolic link, then the link is not dereferenced: instead, the timestamps of the symbolic link itself are changed.
fsPromises.link(existingPath, newPath)
#
Added in: v10.0.0
existingPath <string> | <Buffer> | <URL>
newPath <string> | <Buffer> | <URL>
Returns: <Promise> Fulfills with undefined upon success.
Creates a new link from the existingPath to the newPath. See the POSIX link(2) documentation for more detail.
fsPromises.lstat(path[, options])
#
History













path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
Returns: <Promise> Fulfills with the <fs.Stats> object for the given symbolic link path.
Equivalent to fsPromises.stat() unless path refers to a symbolic link, in which case the link itself is stat-ed, not the file that it refers to. Refer to the POSIX lstat(2) document for more detail.
fsPromises.mkdir(path[, options])
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
options <Object> | <integer>
recursive <boolean> Default: false
mode <string> | <integer> Not supported on Windows. Default: 0o777.
Returns: <Promise> Upon success, fulfills with undefined if recursive is false, or the first directory path created if recursive is true.
Asynchronously creates a directory.
The optional options argument can be an integer specifying mode (permission and sticky bits), or an object with a mode property and a recursive property indicating whether parent directories should be created. Calling fsPromises.mkdir() when path is a directory that exists results in a rejection only when recursive is false.
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');

async function makeDirectory() {
  const projectFolder = join(__dirname, 'test', 'project');
  const dirCreation = await mkdir(projectFolder, { recursive: true });

  console.log(dirCreation);
  return dirCreation;
}

makeDirectory().catch(console.error);
copy
fsPromises.mkdtemp(prefix[, options])
#
History

















prefix <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <Promise> Fulfills with a string containing the file system path of the newly created temporary directory.
Creates a unique temporary directory. A unique directory name is generated by appending six random characters to the end of the provided prefix. Due to platform inconsistencies, avoid trailing X characters in prefix. Some platforms, notably the BSDs, can return more than six random characters, and replace trailing X characters in prefix with random characters.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use.
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

try {
  await mkdtemp(join(tmpdir(), 'foo-'));
} catch (err) {
  console.error(err);
}
copy
The fsPromises.mkdtemp() method will append the six randomly selected characters directly to the prefix string. For instance, given a directory /tmp, if the intention is to create a temporary directory within /tmp, the prefix must end with a trailing platform-specific path separator (require('node:path').sep).
fsPromises.mkdtempDisposable(prefix[, options])
#
Added in: v24.4.0
prefix <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <Promise> Fulfills with a Promise for an async-disposable Object:
path <string> The path of the created directory.
remove <AsyncFunction> A function which removes the created directory.
[Symbol.asyncDispose] <AsyncFunction> The same as remove.
The resulting Promise holds an async-disposable object whose path property holds the created directory path. When the object is disposed, the directory and its contents will be removed asynchronously if it still exists. If the directory cannot be deleted, disposal will throw an error. The object has an async remove() method which will perform the same task.
Both this function and the disposal function on the resulting object are async, so it should be used with await + await using as in await using dir = await fsPromises.mkdtempDisposable('prefix').
For detailed information, see the documentation of fsPromises.mkdtemp().
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use.
fsPromises.open(path, flags[, mode])
#
History













path <string> | <Buffer> | <URL>
flags <string> | <number> See support of file system flags. Default: 'r'.
mode <string> | <integer> Sets the file mode (permission and sticky bits) if the file is created. Default: 0o666 (readable and writable)
Returns: <Promise> Fulfills with a <FileHandle> object.
Opens a <FileHandle>.
Refer to the POSIX open(2) documentation for more detail.
Some characters (< > : " / \ | ? *) are reserved under Windows as documented by Naming Files, Paths, and Namespaces. Under NTFS, if the filename contains a colon, Node.js will open a file system stream, as described by this MSDN page.
fsPromises.opendir(path[, options])
#
History

















path <string> | <Buffer> | <URL>
options <Object>
encoding <string> | <null> Default: 'utf8'
bufferSize <number> Number of directory entries that are buffered internally when reading from the directory. Higher values lead to better performance but higher memory usage. Default: 32
recursive <boolean> Resolved Dir will be an <AsyncIterable> containing all sub files and directories. Default: false
Returns: <Promise> Fulfills with an <fs.Dir>.
Asynchronously open a directory for iterative scanning. See the POSIX opendir(3) documentation for more detail.
Creates an <fs.Dir>, which contains all further functions for reading from and cleaning up the directory.
The encoding option sets the encoding for the path while opening the directory and subsequent read operations.
Example using async iteration:
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
copy
When using the async iterator, the <fs.Dir> object will be automatically closed after the iterator exits.
fsPromises.readdir(path[, options])
#
History

















path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
withFileTypes <boolean> Default: false
recursive <boolean> If true, reads the contents of a directory recursively. In recursive mode, it will list all files, sub files, and directories. Default: false.
Returns: <Promise> Fulfills with an array of the names of the files in the directory excluding '.' and '..'.
Reads the contents of a directory.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the filenames. If the encoding is set to 'buffer', the filenames returned will be passed as <Buffer> objects.
If options.withFileTypes is set to true, the returned array will contain <fs.Dirent> objects.
import { readdir } from 'node:fs/promises';

try {
  const files = await readdir(path);
  for (const file of files)
    console.log(file);
} catch (err) {
  console.error(err);
}
copy
fsPromises.readFile(path[, options])
#
History













path <string> | <Buffer> | <URL> | <FileHandle> filename or FileHandle
options <Object> | <string>
encoding <string> | <null> Default: null
flag <string> See support of file system flags. Default: 'r'.
signal <AbortSignal> allows aborting an in-progress readFile
Returns: <Promise> Fulfills with the contents of the file.
Asynchronously reads the entire contents of a file.
If no encoding is specified (using options.encoding), the data is returned as a <Buffer> object. Otherwise, the data will be a string.
If options is a string, then it specifies the encoding.
When the path is a directory, the behavior of fsPromises.readFile() is platform-specific. On macOS, Linux, and Windows, the promise will be rejected with an error. On FreeBSD, a representation of the directory's contents will be returned.
An example of reading a package.json file located in the same directory of the running code:
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
async function logFile() {
  try {
    const filePath = resolve('./package.json');
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
copy
It is possible to abort an ongoing readFile using an <AbortSignal>. If a request is aborted the promise returned is rejected with an AbortError:
import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
copy
Aborting an ongoing request does not abort individual operating system requests but rather the internal buffering fs.readFile performs.
Any specified <FileHandle> has to support reading.
fsPromises.readlink(path[, options])
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <Promise> Fulfills with the linkString upon success.
Reads the contents of the symbolic link referred to by path. See the POSIX readlink(2) documentation for more detail. The promise is fulfilled with the linkString upon success.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the link path returned. If the encoding is set to 'buffer', the link path returned will be passed as a <Buffer> object.
fsPromises.realpath(path[, options])
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <Promise> Fulfills with the resolved path upon success.
Determines the actual location of path using the same semantics as the fs.realpath.native() function.
Only paths that can be converted to UTF8 strings are supported.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the path. If the encoding is set to 'buffer', the path returned will be passed as a <Buffer> object.
On Linux, when Node.js is linked against musl libc, the procfs file system must be mounted on /proc in order for this function to work. Glibc does not have this restriction.
fsPromises.rename(oldPath, newPath)
#
Added in: v10.0.0
oldPath <string> | <Buffer> | <URL>
newPath <string> | <Buffer> | <URL>
Returns: <Promise> Fulfills with undefined upon success.
Renames oldPath to newPath.
fsPromises.rmdir(path[, options])
#
History

































path <string> | <Buffer> | <URL>
options <Object>
maxRetries <integer> If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered, Node.js retries the operation with a linear backoff wait of retryDelay milliseconds longer on each try. This option represents the number of retries. This option is ignored if the recursive option is not true. Default: 0.
recursive <boolean> If true, perform a recursive directory removal. In recursive mode, operations are retried on failure. Default: false. Deprecated.
retryDelay <integer> The amount of time in milliseconds to wait between retries. This option is ignored if the recursive option is not true. Default: 100.
Returns: <Promise> Fulfills with undefined upon success.
Removes the directory identified by path.
Using fsPromises.rmdir() on a file (not a directory) results in the promise being rejected with an ENOENT error on Windows and an ENOTDIR error on POSIX.
To get a behavior similar to the rm -rf Unix command, use fsPromises.rm() with options { recursive: true, force: true }.
fsPromises.rm(path[, options])
#
Added in: v14.14.0
path <string> | <Buffer> | <URL>
options <Object>
force <boolean> When true, exceptions will be ignored if path does not exist. Default: false.
maxRetries <integer> If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered, Node.js will retry the operation with a linear backoff wait of retryDelay milliseconds longer on each try. This option represents the number of retries. This option is ignored if the recursive option is not true. Default: 0.
recursive <boolean> If true, perform a recursive directory removal. In recursive mode operations are retried on failure. Default: false.
retryDelay <integer> The amount of time in milliseconds to wait between retries. This option is ignored if the recursive option is not true. Default: 100.
Returns: <Promise> Fulfills with undefined upon success.
Removes files and directories (modeled on the standard POSIX rm utility).
fsPromises.stat(path[, options])
#
History













path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
Returns: <Promise> Fulfills with the <fs.Stats> object for the given path.
fsPromises.statfs(path[, options])
#
Added in: v19.6.0, v18.15.0
path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.StatFs> object should be bigint. Default: false.
Returns: <Promise> Fulfills with the <fs.StatFs> object for the given path.
fsPromises.symlink(target, path[, type])
#
History













target <string> | <Buffer> | <URL>
path <string> | <Buffer> | <URL>
type <string> | <null> Default: null
Returns: <Promise> Fulfills with undefined upon success.
Creates a symbolic link.
The type argument is only used on Windows platforms and can be one of 'dir', 'file', or 'junction'. If the type argument is null, Node.js will autodetect target type and use 'file' or 'dir'. If the target does not exist, 'file' will be used. Windows junction points require the destination path to be absolute. When using 'junction', the target argument will automatically be normalized to absolute path. Junction points on NTFS volumes can only point to directories.
fsPromises.truncate(path[, len])
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
len <integer> Default: 0
Returns: <Promise> Fulfills with undefined upon success.
Truncates (shortens or extends the length) of the content at path to len bytes.
fsPromises.unlink(path)
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
Returns: <Promise> Fulfills with undefined upon success.
If path refers to a symbolic link, then the link is removed without affecting the file or directory to which that link refers. If the path refers to a file path that is not a symbolic link, the file is deleted. See the POSIX unlink(2) documentation for more detail.
fsPromises.utimes(path, atime, mtime)
#
Added in: v10.0.0
path <string> | <Buffer> | <URL>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
Returns: <Promise> Fulfills with undefined upon success.
Change the file system timestamps of the object referenced by path.
The atime and mtime arguments follow these rules:
Values can be either numbers representing Unix epoch time, Dates, or a numeric string like '123456789.0'.
If the value can not be converted to a number, or is NaN, Infinity, or -Infinity, an Error will be thrown.
fsPromises.watch(filename[, options])
#
Added in: v15.9.0, v14.18.0
filename <string> | <Buffer> | <URL>
options <string> | <Object>
persistent <boolean> Indicates whether the process should continue to run as long as files are being watched. Default: true.
recursive <boolean> Indicates whether all subdirectories should be watched, or only the current directory. This applies when a directory is specified, and only on supported platforms (See caveats). Default: false.
encoding <string> Specifies the character encoding to be used for the filename passed to the listener. Default: 'utf8'.
signal <AbortSignal> An <AbortSignal> used to signal when the watcher should stop.
maxQueue <number> Specifies the number of events to queue between iterations of the <AsyncIterator> returned. Default: 2048.
overflow <string> Either 'ignore' or 'throw' when there are more events to be queued than maxQueue allows. 'ignore' means overflow events are dropped and a warning is emitted, while 'throw' means to throw an exception. Default: 'ignore'.
Returns: <AsyncIterator> of objects with the properties:
eventType <string> The type of change
filename <string> | <Buffer> | <null> The name of the file changed.
Returns an async iterator that watches for changes on filename, where filename is either a file or a directory.
const { watch } = require('node:fs/promises');

const ac = new AbortController();
const { signal } = ac;
setTimeout(() => ac.abort(), 10000);

(async () => {
  try {
    const watcher = watch(__filename, { signal });
    for await (const event of watcher)
      console.log(event);
  } catch (err) {
    if (err.name === 'AbortError')
      return;
    throw err;
  }
})();
copy
On most platforms, 'rename' is emitted whenever a filename appears or disappears in the directory.
All the caveats for fs.watch() also apply to fsPromises.watch().
fsPromises.writeFile(file, data[, options])
#
History

























file <string> | <Buffer> | <URL> | <FileHandle> filename or FileHandle
data <string> | <Buffer> | <TypedArray> | <DataView> | <AsyncIterable> | <Iterable> | <Stream>
options <Object> | <string>
encoding <string> | <null> Default: 'utf8'
mode <integer> Default: 0o666
flag <string> See support of file system flags. Default: 'w'.
flush <boolean> If all data is successfully written to the file, and flush is true, filehandle.sync() is used to flush the data. Default: false.
signal <AbortSignal> allows aborting an in-progress writeFile
Returns: <Promise> Fulfills with undefined upon success.
Asynchronously writes data to a file, replacing the file if it already exists. data can be a string, a buffer, an <AsyncIterable>, or an <Iterable> object.
The encoding option is ignored if data is a buffer.
If options is a string, then it specifies the encoding.
The mode option only affects the newly created file. See fs.open() for more details.
Any specified <FileHandle> has to support writing.
It is unsafe to use fsPromises.writeFile() multiple times on the same file without waiting for the promise to be settled.
Similarly to fsPromises.readFile - fsPromises.writeFile is a convenience method that performs multiple write calls internally to write the buffer passed to it. For performance sensitive code consider using fs.createWriteStream() or filehandle.createWriteStream().
It is possible to use an <AbortSignal> to cancel an fsPromises.writeFile(). Cancelation is "best effort", and some amount of data is likely still to be written.
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
copy
Aborting an ongoing request does not abort individual operating system requests but rather the internal buffering fs.writeFile performs.
fsPromises.constants
#
Added in: v18.4.0, v16.17.0
<Object>
Returns an object containing commonly used constants for file system operations. The object is the same as fs.constants. See FS constants for more details.
Callback API
#
The callback APIs perform all operations asynchronously, without blocking the event loop, then invoke a callback function upon completion or error.
The callback APIs use the underlying Node.js threadpool to perform file system operations off the event loop thread. These operations are not synchronized or threadsafe. Care must be taken when performing multiple concurrent modifications on the same file or data corruption may occur.
fs.access(path[, mode], callback)
#
History

























path <string> | <Buffer> | <URL>
mode <integer> Default: fs.constants.F_OK
callback <Function>
err <Error>
Tests a user's permissions for the file or directory specified by path. The mode argument is an optional integer that specifies the accessibility checks to be performed. mode should be either the value fs.constants.F_OK or a mask consisting of the bitwise OR of any of fs.constants.R_OK, fs.constants.W_OK, and fs.constants.X_OK (e.g. fs.constants.W_OK | fs.constants.R_OK). Check File access constants for possible values of mode.
The final argument, callback, is a callback function that is invoked with a possible error argument. If any of the accessibility checks fail, the error argument will be an Error object. The following examples check if package.json exists, and if it is readable or writable.
import { access, constants } from 'node:fs';

const file = 'package.json';

// Check if the file exists in the current directory.
access(file, constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
});

// Check if the file is readable.
access(file, constants.R_OK, (err) => {
  console.log(`${file} ${err ? 'is not readable' : 'is readable'}`);
});

// Check if the file is writable.
access(file, constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'is not writable' : 'is writable'}`);
});

// Check if the file is readable and writable.
access(file, constants.R_OK | constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'is not' : 'is'} readable and writable`);
});
copy
Do not use fs.access() to check for the accessibility of a file before calling fs.open(), fs.readFile(), or fs.writeFile(). Doing so introduces a race condition, since other processes may change the file's state between the two calls. Instead, user code should open/read/write the file directly and handle the error raised if the file is not accessible.
write (NOT RECOMMENDED)
import { access, open, close } from 'node:fs';

access('myfile', (err) => {
  if (!err) {
    console.error('myfile already exists');
    return;
  }

  open('myfile', 'wx', (err, fd) => {
    if (err) throw err;

    try {
      writeMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
copy
write (RECOMMENDED)
import { open, close } from 'node:fs';

open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
copy
read (NOT RECOMMENDED)
import { access, open, close } from 'node:fs';
access('myfile', (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  open('myfile', 'r', (err, fd) => {
    if (err) throw err;

    try {
      readMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
copy
read (RECOMMENDED)
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
copy
The "not recommended" examples above check for accessibility and then use the file; the "recommended" examples are better because they use the file directly and handle the error, if any.
In general, check for the accessibility of a file only if the file will not be used directly, for example when its accessibility is a signal from another process.
On Windows, access-control policies (ACLs) on a directory may limit access to a file or directory. The fs.access() function, however, does not check the ACL and therefore may report that a path is accessible even if the ACL restricts the user from reading or writing to it.
fs.appendFile(path, data[, options], callback)
#
History

































path <string> | <Buffer> | <URL> | <number> filename or file descriptor
data <string> | <Buffer>
options <Object> | <string>
encoding <string> | <null> Default: 'utf8'
mode <integer> Default: 0o666
flag <string> See support of file system flags. Default: 'a'.
flush <boolean> If true, the underlying file descriptor is flushed prior to closing it. Default: false.
callback <Function>
err <Error>
Asynchronously append data to a file, creating the file if it does not yet exist. data can be a string or a <Buffer>.
The mode option only affects the newly created file. See fs.open() for more details.
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
copy
If options is a string, then it specifies the encoding:
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', 'utf8', callback);
copy
The path may be specified as a numeric file descriptor that has been opened for appending (using fs.open() or fs.openSync()). The file descriptor will not be closed automatically.
import { open, close, appendFile } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('message.txt', 'a', (err, fd) => {
  if (err) throw err;

  try {
    appendFile(fd, 'data to append', 'utf8', (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
copy
fs.chmod(path, mode, callback)
#
History

























path <string> | <Buffer> | <URL>
mode <string> | <integer>
callback <Function>
err <Error>
Asynchronously changes the permissions of a file. No arguments other than a possible exception are given to the completion callback.
See the POSIX chmod(2) documentation for more detail.
import { chmod } from 'node:fs';

chmod('my_file.txt', 0o775, (err) => {
  if (err) throw err;
  console.log('The permissions for file "my_file.txt" have been changed!');
});
copy
File modes
#
The mode argument used in both the fs.chmod() and fs.chmodSync() methods is a numeric bitmask created using a logical OR of the following constants:
Constant
Octal
Description
fs.constants.S_IRUSR
0o400
read by owner
fs.constants.S_IWUSR
0o200
write by owner
fs.constants.S_IXUSR
0o100
execute/search by owner
fs.constants.S_IRGRP
0o40
read by group
fs.constants.S_IWGRP
0o20
write by group
fs.constants.S_IXGRP
0o10
execute/search by group
fs.constants.S_IROTH
0o4
read by others
fs.constants.S_IWOTH
0o2
write by others
fs.constants.S_IXOTH
0o1
execute/search by others

An easier method of constructing the mode is to use a sequence of three octal digits (e.g. 765). The left-most digit (7 in the example), specifies the permissions for the file owner. The middle digit (6 in the example), specifies permissions for the group. The right-most digit (5 in the example), specifies the permissions for others.
Number
Description
7
read, write, and execute
6
read and write
5
read and execute
4
read only
3
write and execute
2
write only
1
execute only
0
no permission

For example, the octal value 0o765 means:
The owner may read, write, and execute the file.
The group may read and write the file.
Others may read and execute the file.
When using raw numbers where file modes are expected, any value larger than 0o777 may result in platform-specific behaviors that are not supported to work consistently. Therefore constants like S_ISVTX, S_ISGID, or S_ISUID are not exposed in fs.constants.
Caveats: on Windows only the write permission can be changed, and the distinction among the permissions of group, owner, or others is not implemented.
fs.chown(path, uid, gid, callback)
#
History

























path <string> | <Buffer> | <URL>
uid <integer>
gid <integer>
callback <Function>
err <Error>
Asynchronously changes owner and group of a file. No arguments other than a possible exception are given to the completion callback.
See the POSIX chown(2) documentation for more detail.
fs.close(fd[, callback])
#
History

























fd <integer>
callback <Function>
err <Error>
Closes the file descriptor. No arguments other than a possible exception are given to the completion callback.
Calling fs.close() on any file descriptor (fd) that is currently in use through any other fs operation may lead to undefined behavior.
See the POSIX close(2) documentation for more detail.
fs.copyFile(src, dest[, mode], callback)
#
History

















src <string> | <Buffer> | <URL> source filename to copy
dest <string> | <Buffer> | <URL> destination filename of the copy operation
mode <integer> modifiers for copy operation. Default: 0.
callback <Function>
err <Error>
Asynchronously copies src to dest. By default, dest is overwritten if it already exists. No arguments other than a possible exception are given to the callback function. Node.js makes no guarantees about the atomicity of the copy operation. If an error occurs after the destination file has been opened for writing, Node.js will attempt to remove the destination.
mode is an optional integer that specifies the behavior of the copy operation. It is possible to create a mask consisting of the bitwise OR of two or more values (e.g. fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE).
fs.constants.COPYFILE_EXCL: The copy operation will fail if dest already exists.
fs.constants.COPYFILE_FICLONE: The copy operation will attempt to create a copy-on-write reflink. If the platform does not support copy-on-write, then a fallback copy mechanism is used.
fs.constants.COPYFILE_FICLONE_FORCE: The copy operation will attempt to create a copy-on-write reflink. If the platform does not support copy-on-write, then the operation will fail.
import { copyFile, constants } from 'node:fs';

function callback(err) {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
}

// destination.txt will be created or overwritten by default.
copyFile('source.txt', 'destination.txt', callback);

// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
copy
fs.cp(src, dest[, options], callback)
#
History

























src <string> | <URL> source path to copy.
dest <string> | <URL> destination path to copy to.
options <Object>
dereference <boolean> dereference symlinks. Default: false.
errorOnExist <boolean> when force is false, and the destination exists, throw an error. Default: false.
filter <Function> Function to filter copied files/directories. Return true to copy the item, false to ignore it. When ignoring a directory, all of its contents will be skipped as well. Can also return a Promise that resolves to true or false Default: undefined.
src <string> source path to copy.
dest <string> destination path to copy to.
Returns: <boolean> | <Promise> A value that is coercible to boolean or a Promise that fulfils with such value.
force <boolean> overwrite existing file or directory. The copy operation will ignore errors if you set this to false and the destination exists. Use the errorOnExist option to change this behavior. Default: true.
mode <integer> modifiers for copy operation. Default: 0. See mode flag of fs.copyFile().
preserveTimestamps <boolean> When true timestamps from src will be preserved. Default: false.
recursive <boolean> copy directories recursively Default: false
verbatimSymlinks <boolean> When true, path resolution for symlinks will be skipped. Default: false
callback <Function>
err <Error>
Asynchronously copies the entire directory structure from src to dest, including subdirectories and files.
When copying a directory to another directory, globs are not supported and behavior is similar to cp dir1/ dir2/.
fs.createReadStream(path[, options])
#
History





















































path <string> | <Buffer> | <URL>
options <string> | <Object>
flags <string> See support of file system flags. Default: 'r'.
encoding <string> Default: null
fd <integer> | <FileHandle> Default: null
mode <integer> Default: 0o666
autoClose <boolean> Default: true
emitClose <boolean> Default: true
start <integer>
end <integer> Default: Infinity
highWaterMark <integer> Default: 64 * 1024
fs <Object> | <null> Default: null
signal <AbortSignal> | <null> Default: null
Returns: <fs.ReadStream>
options can include start and end values to read a range of bytes from the file instead of the entire file. Both start and end are inclusive and start counting at 0, allowed values are in the [0, Number.MAX_SAFE_INTEGER] range. If fd is specified and start is omitted or undefined, fs.createReadStream() reads sequentially from the current file position. The encoding can be any one of those accepted by <Buffer>.
If fd is specified, ReadStream will ignore the path argument and will use the specified file descriptor. This means that no 'open' event will be emitted. fd should be blocking; non-blocking fds should be passed to <net.Socket>.
If fd points to a character device that only supports blocking reads (such as keyboard or sound card), read operations do not finish until data is available. This can prevent the process from exiting and the stream from closing naturally.
By default, the stream will emit a 'close' event after it has been destroyed. Set the emitClose option to false to change this behavior.
By providing the fs option, it is possible to override the corresponding fs implementations for open, read, and close. When providing the fs option, an override for read is required. If no fd is provided, an override for open is also required. If autoClose is true, an override for close is also required.
import { createReadStream } from 'node:fs';

// Create a stream from some character device.
const stream = createReadStream('/dev/input/event0');
setTimeout(() => {
  stream.close(); // This may not close the stream.
  // Artificially marking end-of-stream, as if the underlying resource had
  // indicated end-of-file by itself, allows the stream to close.
  // This does not cancel pending read operations, and if there is such an
  // operation, the process may still not be able to exit successfully
  // until it finishes.
  stream.push(null);
  stream.read(0);
}, 100);
copy
If autoClose is false, then the file descriptor won't be closed, even if there's an error. It is the application's responsibility to close it and make sure there's no file descriptor leak. If autoClose is set to true (default behavior), on 'error' or 'end' the file descriptor will be closed automatically.
mode sets the file mode (permission and sticky bits), but only if the file was created.
An example to read the last 10 bytes of a file which is 100 bytes long:
import { createReadStream } from 'node:fs';

createReadStream('sample.txt', { start: 90, end: 99 });
copy
If options is a string, then it specifies the encoding.
fs.createWriteStream(path[, options])
#
History

























































path <string> | <Buffer> | <URL>
options <string> | <Object>
flags <string> See support of file system flags. Default: 'w'.
encoding <string> Default: 'utf8'
fd <integer> | <FileHandle> Default: null
mode <integer> Default: 0o666
autoClose <boolean> Default: true
emitClose <boolean> Default: true
start <integer>
fs <Object> | <null> Default: null
signal <AbortSignal> | <null> Default: null
highWaterMark <number> Default: 16384
flush <boolean> If true, the underlying file descriptor is flushed prior to closing it. Default: false.
Returns: <fs.WriteStream>
options may also include a start option to allow writing data at some position past the beginning of the file, allowed values are in the [0, Number.MAX_SAFE_INTEGER] range. Modifying a file rather than replacing it may require the flags option to be set to r+ rather than the default w. The encoding can be any one of those accepted by <Buffer>.
If autoClose is set to true (default behavior) on 'error' or 'finish' the file descriptor will be closed automatically. If autoClose is false, then the file descriptor won't be closed, even if there's an error. It is the application's responsibility to close it and make sure there's no file descriptor leak.
By default, the stream will emit a 'close' event after it has been destroyed. Set the emitClose option to false to change this behavior.
By providing the fs option it is possible to override the corresponding fs implementations for open, write, writev, and close. Overriding write() without writev() can reduce performance as some optimizations (_writev()) will be disabled. When providing the fs option, overrides for at least one of write and writev are required. If no fd option is supplied, an override for open is also required. If autoClose is true, an override for close is also required.
Like <fs.ReadStream>, if fd is specified, <fs.WriteStream> will ignore the path argument and will use the specified file descriptor. This means that no 'open' event will be emitted. fd should be blocking; non-blocking fds should be passed to <net.Socket>.
If options is a string, then it specifies the encoding.
fs.exists(path, callback)
#
History





















Stability: 0 - Deprecated: Use fs.stat() or fs.access() instead.
path <string> | <Buffer> | <URL>
callback <Function>
exists <boolean>
Test whether or not the element at the given path exists by checking with the file system. Then call the callback argument with either true or false:
import { exists } from 'node:fs';

exists('/etc/passwd', (e) => {
  console.log(e ? 'it exists' : 'no passwd!');
});
copy
The parameters for this callback are not consistent with other Node.js callbacks. Normally, the first parameter to a Node.js callback is an err parameter, optionally followed by other parameters. The fs.exists() callback has only one boolean parameter. This is one reason fs.access() is recommended instead of fs.exists().
If path is a symbolic link, it is followed. Thus, if path exists but points to a non-existent element, the callback will receive the value false.
Using fs.exists() to check for the existence of a file before calling fs.open(), fs.readFile(), or fs.writeFile() is not recommended. Doing so introduces a race condition, since other processes may change the file's state between the two calls. Instead, user code should open/read/write the file directly and handle the error raised if the file does not exist.
write (NOT RECOMMENDED)
import { exists, open, close } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    console.error('myfile already exists');
  } else {
    open('myfile', 'wx', (err, fd) => {
      if (err) throw err;

      try {
        writeMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  }
});
copy
write (RECOMMENDED)
import { open, close } from 'node:fs';
open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
copy
read (NOT RECOMMENDED)
import { open, close, exists } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    open('myfile', 'r', (err, fd) => {
      if (err) throw err;

      try {
        readMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  } else {
    console.error('myfile does not exist');
  }
});
copy
read (RECOMMENDED)
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
copy
The "not recommended" examples above check for existence and then use the file; the "recommended" examples are better because they use the file directly and handle the error, if any.
In general, check for the existence of a file only if the file won't be used directly, for example when its existence is a signal from another process.
fs.fchmod(fd, mode, callback)
#
History





















fd <integer>
mode <string> | <integer>
callback <Function>
err <Error>
Sets the permissions on the file. No arguments other than a possible exception are given to the completion callback.
See the POSIX fchmod(2) documentation for more detail.
fs.fchown(fd, uid, gid, callback)
#
History





















fd <integer>
uid <integer>
gid <integer>
callback <Function>
err <Error>
Sets the owner of the file. No arguments other than a possible exception are given to the completion callback.
See the POSIX fchown(2) documentation for more detail.
fs.fdatasync(fd, callback)
#
History





















fd <integer>
callback <Function>
err <Error>
Forces all currently queued I/O operations associated with the file to the operating system's synchronized I/O completion state. Refer to the POSIX fdatasync(2) documentation for details. No arguments other than a possible exception are given to the completion callback.
fs.fstat(fd[, options], callback)
#
History

























fd <integer>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
callback <Function>
err <Error>
stats <fs.Stats>
Invokes the callback with the <fs.Stats> for the file descriptor.
See the POSIX fstat(2) documentation for more detail.
fs.fsync(fd, callback)
#
History





















fd <integer>
callback <Function>
err <Error>
Request that all data for the open file descriptor is flushed to the storage device. The specific implementation is operating system and device specific. Refer to the POSIX fsync(2) documentation for more detail. No arguments other than a possible exception are given to the completion callback.
fs.ftruncate(fd[, len], callback)
#
History





















fd <integer>
len <integer> Default: 0
callback <Function>
err <Error>
Truncates the file descriptor. No arguments other than a possible exception are given to the completion callback.
See the POSIX ftruncate(2) documentation for more detail.
If the file referred to by the file descriptor was larger than len bytes, only the first len bytes will be retained in the file.
For example, the following program retains only the first four bytes of the file:
import { open, close, ftruncate } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('temp.txt', 'r+', (err, fd) => {
  if (err) throw err;

  try {
    ftruncate(fd, 4, (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    if (err) throw err;
  }
});
copy
If the file previously was shorter than len bytes, it is extended, and the extended part is filled with null bytes ('\0'):
If len is negative then 0 will be used.
fs.futimes(fd, atime, mtime, callback)
#
History

























fd <integer>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
callback <Function>
err <Error>
Change the file system timestamps of the object referenced by the supplied file descriptor. See fs.utimes().
fs.glob(pattern[, options], callback)
#
History


























pattern <string> | <string[]>
options <Object>
cwd <string> | <URL> current working directory. Default: process.cwd()
exclude <Function> | <string[]> Function to filter out files/directories or a list of glob patterns to be excluded. If a function is provided, return true to exclude the item, false to include it. Default: undefined.
withFileTypes <boolean> true if the glob should return paths as Dirents, false otherwise. Default: false.
callback <Function>
err <Error>
Retrieves the files matching the specified pattern.
const { glob } = require('node:fs');

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
copy
fs.lchmod(path, mode, callback)
#
History

























Stability: 0 - Deprecated
path <string> | <Buffer> | <URL>
mode <integer>
callback <Function>
err <Error> | <AggregateError>
Changes the permissions on a symbolic link. No arguments other than a possible exception are given to the completion callback.
This method is only implemented on macOS.
See the POSIX lchmod(2) documentation for more detail.
fs.lchown(path, uid, gid, callback)
#
History

























path <string> | <Buffer> | <URL>
uid <integer>
gid <integer>
callback <Function>
err <Error>
Set the owner of the symbolic link. No arguments other than a possible exception are given to the completion callback.
See the POSIX lchown(2) documentation for more detail.
fs.lutimes(path, atime, mtime, callback)
#
History













path <string> | <Buffer> | <URL>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
callback <Function>
err <Error>
Changes the access and modification times of a file in the same way as fs.utimes(), with the difference that if the path refers to a symbolic link, then the link is not dereferenced: instead, the timestamps of the symbolic link itself are changed.
No arguments other than a possible exception are given to the completion callback.
fs.link(existingPath, newPath, callback)
#
History

























existingPath <string> | <Buffer> | <URL>
newPath <string> | <Buffer> | <URL>
callback <Function>
err <Error>
Creates a new link from the existingPath to the newPath. See the POSIX link(2) documentation for more detail. No arguments other than a possible exception are given to the completion callback.
fs.lstat(path[, options], callback)
#
History





























path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
callback <Function>
err <Error>
stats <fs.Stats>
Retrieves the <fs.Stats> for the symbolic link referred to by the path. The callback gets two arguments (err, stats) where stats is a <fs.Stats> object. lstat() is identical to stat(), except that if path is a symbolic link, then the link itself is stat-ed, not the file that it refers to.
See the POSIX lstat(2) documentation for more details.
fs.mkdir(path[, options], callback)
#
History

































path <string> | <Buffer> | <URL>
options <Object> | <integer>
recursive <boolean> Default: false
mode <string> | <integer> Not supported on Windows. Default: 0o777.
callback <Function>
err <Error>
path <string> | <undefined> Present only if a directory is created with recursive set to true.
Asynchronously creates a directory.
The callback is given a possible exception and, if recursive is true, the first directory path created, (err[, path]). path can still be undefined when recursive is true, if no directory was created (for instance, if it was previously created).
The optional options argument can be an integer specifying mode (permission and sticky bits), or an object with a mode property and a recursive property indicating whether parent directories should be created. Calling fs.mkdir() when path is a directory that exists results in an error only when recursive is false. If recursive is false and the directory exists, an EEXIST error occurs.
import { mkdir } from 'node:fs';

// Create ./tmp/a/apple, regardless of whether ./tmp and ./tmp/a exist.
mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
copy
On Windows, using fs.mkdir() on the root directory even with recursion will result in an error:
import { mkdir } from 'node:fs';

mkdir('/', { recursive: true }, (err) => {
  // => [Error: EPERM: operation not permitted, mkdir 'C:\']
});
copy
See the POSIX mkdir(2) documentation for more details.
fs.mkdtemp(prefix[, options], callback)
#
History

































prefix <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
callback <Function>
err <Error>
directory <string>
Creates a unique temporary directory.
Generates six random characters to be appended behind a required prefix to create a unique temporary directory. Due to platform inconsistencies, avoid trailing X characters in prefix. Some platforms, notably the BSDs, can return more than six random characters, and replace trailing X characters in prefix with random characters.
The created directory path is passed as a string to the callback's second parameter.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use.
import { mkdtemp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

mkdtemp(join(tmpdir(), 'foo-'), (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Prints: /tmp/foo-itXde2 or C:\Users\...\AppData\Local\Temp\foo-itXde2
});
copy
The fs.mkdtemp() method will append the six randomly selected characters directly to the prefix string. For instance, given a directory /tmp, if the intention is to create a temporary directory within /tmp, the prefix must end with a trailing platform-specific path separator (require('node:path').sep).
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs';

// The parent directory for the new temporary directory
const tmpDir = tmpdir();

// This method is *INCORRECT*:
mkdtemp(tmpDir, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Will print something similar to `/tmpabc123`.
  // A new temporary directory is created at the file system root
  // rather than *within* the /tmp directory.
});

// This method is *CORRECT*:
import { sep } from 'node:path';
mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Will print something similar to `/tmp/abc123`.
  // A new temporary directory is created within
  // the /tmp directory.
});
copy
fs.open(path[, flags[, mode]], callback)
#
History

























path <string> | <Buffer> | <URL>
flags <string> | <number> See support of file system flags. Default: 'r'.
mode <string> | <integer> Default: 0o666 (readable and writable)
callback <Function>
err <Error>
fd <integer>
Asynchronous file open. See the POSIX open(2) documentation for more details.
mode sets the file mode (permission and sticky bits), but only if the file was created. On Windows, only the write permission can be manipulated; see fs.chmod().
The callback gets two arguments (err, fd).
Some characters (< > : " / \ | ? *) are reserved under Windows as documented by Naming Files, Paths, and Namespaces. Under NTFS, if the filename contains a colon, Node.js will open a file system stream, as described by this MSDN page.
Functions based on fs.open() exhibit this behavior as well: fs.writeFile(), fs.readFile(), etc.
fs.openAsBlob(path[, options])
#
History













path <string> | <Buffer> | <URL>
options <Object>
type <string> An optional mime type for the blob.
Returns: <Promise> Fulfills with a <Blob> upon success.
Returns a <Blob> whose data is backed by the given file.
The file must not be modified after the <Blob> is created. Any modifications will cause reading the <Blob> data to fail with a DOMException error. Synchronous stat operations on the file when the Blob is created, and before each read in order to detect whether the file data has been modified on disk.
const { openAsBlob } = require('node:fs');

(async () => {
  const blob = await openAsBlob('the.file.txt');
  const ab = await blob.arrayBuffer();
  blob.stream();
})();
copy
fs.opendir(path[, options], callback)
#
History





















path <string> | <Buffer> | <URL>
options <Object>
encoding <string> | <null> Default: 'utf8'
bufferSize <number> Number of directory entries that are buffered internally when reading from the directory. Higher values lead to better performance but higher memory usage. Default: 32
recursive <boolean> Default: false
callback <Function>
err <Error>
dir <fs.Dir>
Asynchronously open a directory. See the POSIX opendir(3) documentation for more details.
Creates an <fs.Dir>, which contains all further functions for reading from and cleaning up the directory.
The encoding option sets the encoding for the path while opening the directory and subsequent read operations.
fs.read(fd, buffer, offset, length, position, callback)
#
History

























fd <integer>
buffer <Buffer> | <TypedArray> | <DataView> The buffer that the data will be written to.
offset <integer> The position in buffer to write the data to.
length <integer> The number of bytes to read.
position <integer> | <bigint> | <null> Specifies where to begin reading from in the file. If position is null or -1 , data will be read from the current file position, and the file position will be updated. If position is a non-negative integer, the file position will be unchanged.
callback <Function>
err <Error>
bytesRead <integer>
buffer <Buffer>
Read data from the file specified by fd.
The callback is given the three arguments, (err, bytesRead, buffer).
If the file is not modified concurrently, the end-of-file is reached when the number of bytes read is zero.
If this method is invoked as its util.promisify()ed version, it returns a promise for an Object with bytesRead and buffer properties.
The fs.read() method reads data from the file specified by the file descriptor (fd). The length argument indicates the maximum number of bytes that Node.js will attempt to read from the kernel. However, the actual number of bytes read (bytesRead) can be lower than the specified length for various reasons.
For example:
If the file is shorter than the specified length, bytesRead will be set to the actual number of bytes read.
If the file encounters EOF (End of File) before the buffer could be filled, Node.js will read all available bytes until EOF is encountered, and the bytesRead parameter in the callback will indicate the actual number of bytes read, which may be less than the specified length.
If the file is on a slow network filesystem or encounters any other issue during reading, bytesRead can be lower than the specified length.
Therefore, when using fs.read(), it's important to check the bytesRead value to determine how many bytes were actually read from the file. Depending on your application logic, you may need to handle cases where bytesRead is lower than the specified length, such as by wrapping the read call in a loop if you require a minimum amount of bytes.
This behavior is similar to the POSIX preadv2 function.
fs.read(fd[, options], callback)
#
History













fd <integer>
options <Object>
buffer <Buffer> | <TypedArray> | <DataView> Default: Buffer.alloc(16384)
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <bigint> | <null> Default: null
callback <Function>
err <Error>
bytesRead <integer>
buffer <Buffer>
Similar to the fs.read() function, this version takes an optional options object. If no options object is specified, it will default with the above values.
fs.read(fd, buffer[, options], callback)
#
Added in: v18.2.0, v16.17.0
fd <integer>
buffer <Buffer> | <TypedArray> | <DataView> The buffer that the data will be written to.
options <Object>
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <bigint> Default: null
callback <Function>
err <Error>
bytesRead <integer>
buffer <Buffer>
Similar to the fs.read() function, this version takes an optional options object. If no options object is specified, it will default with the above values.
fs.readdir(path[, options], callback)
#
History





































path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
withFileTypes <boolean> Default: false
recursive <boolean> If true, reads the contents of a directory recursively. In recursive mode, it will list all files, sub files and directories. Default: false.
callback <Function>
err <Error>
files <string[]> | <Buffer[]> | <fs.Dirent[]>
Reads the contents of a directory. The callback gets two arguments (err, files) where files is an array of the names of the files in the directory excluding '.' and '..'.
See the POSIX readdir(3) documentation for more details.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the filenames passed to the callback. If the encoding is set to 'buffer', the filenames returned will be passed as <Buffer> objects.
If options.withFileTypes is set to true, the files array will contain <fs.Dirent> objects.
fs.readFile(path[, options], callback)
#
History









































path <string> | <Buffer> | <URL> | <integer> filename or file descriptor
options <Object> | <string>
encoding <string> | <null> Default: null
flag <string> See support of file system flags. Default: 'r'.
signal <AbortSignal> allows aborting an in-progress readFile
callback <Function>
err <Error> | <AggregateError>
data <string> | <Buffer>
Asynchronously reads the entire contents of a file.
import { readFile } from 'node:fs';

readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
copy
The callback is passed two arguments (err, data), where data is the contents of the file.
If no encoding is specified, then the raw buffer is returned.
If options is a string, then it specifies the encoding:
import { readFile } from 'node:fs';

readFile('/etc/passwd', 'utf8', callback);
copy
When the path is a directory, the behavior of fs.readFile() and fs.readFileSync() is platform-specific. On macOS, Linux, and Windows, an error will be returned. On FreeBSD, a representation of the directory's contents will be returned.
import { readFile } from 'node:fs';

// macOS, Linux, and Windows
readFile('<directory>', (err, data) => {
  // => [Error: EISDIR: illegal operation on a directory, read <directory>]
});

//  FreeBSD
readFile('<directory>', (err, data) => {
  // => null, <data>
});
copy
It is possible to abort an ongoing request using an AbortSignal. If a request is aborted the callback is called with an AbortError:
import { readFile } from 'node:fs';

const controller = new AbortController();
const signal = controller.signal;
readFile(fileInfo[0].name, { signal }, (err, buf) => {
  // ...
});
// When you want to abort the request
controller.abort();
copy
The fs.readFile() function buffers the entire file. To minimize memory costs, when possible prefer streaming via fs.createReadStream().
Aborting an ongoing request does not abort individual operating system requests but rather the internal buffering fs.readFile performs.
File descriptors
#
Any specified file descriptor has to support reading.
If a file descriptor is specified as the path, it will not be closed automatically.
The reading will begin at the current position. For example, if the file already had 'Hello World' and six bytes are read with the file descriptor, the call to fs.readFile() with the same file descriptor, would give 'World', rather than 'Hello World'.
Performance Considerations
#
The fs.readFile() method asynchronously reads the contents of a file into memory one chunk at a time, allowing the event loop to turn between each chunk. This allows the read operation to have less impact on other activity that may be using the underlying libuv thread pool but means that it will take longer to read a complete file into memory.
The additional read overhead can vary broadly on different systems and depends on the type of file being read. If the file type is not a regular file (a pipe for instance) and Node.js is unable to determine an actual file size, each read operation will load on 64 KiB of data. For regular files, each read will process 512 KiB of data.
For applications that require as-fast-as-possible reading of file contents, it is better to use fs.read() directly and for application code to manage reading the full contents of the file itself.
The Node.js GitHub issue #25741 provides more information and a detailed analysis on the performance of fs.readFile() for multiple file sizes in different Node.js versions.
fs.readlink(path[, options], callback)
#
History

























path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
callback <Function>
err <Error>
linkString <string> | <Buffer>
Reads the contents of the symbolic link referred to by path. The callback gets two arguments (err, linkString).
See the POSIX readlink(2) documentation for more details.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the link path passed to the callback. If the encoding is set to 'buffer', the link path returned will be passed as a <Buffer> object.
fs.readv(fd, buffers[, position], callback)
#
History













fd <integer>
buffers <ArrayBufferView[]>
position <integer> | <null> Default: null
callback <Function>
err <Error>
bytesRead <integer>
buffers <ArrayBufferView[]>
Read from a file specified by fd and write to an array of ArrayBufferViews using readv().
position is the offset from the beginning of the file from where data should be read. If typeof position !== 'number', the data will be read from the current position.
The callback will be given three arguments: err, bytesRead, and buffers. bytesRead is how many bytes were read from the file.
If this method is invoked as its util.promisify()ed version, it returns a promise for an Object with bytesRead and buffers properties.
fs.realpath(path[, options], callback)
#
History





































path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
callback <Function>
err <Error>
resolvedPath <string> | <Buffer>
Asynchronously computes the canonical pathname by resolving ., .., and symbolic links.
A canonical pathname is not necessarily unique. Hard links and bind mounts can expose a file system entity through many pathnames.
This function behaves like realpath(3), with some exceptions:
No case conversion is performed on case-insensitive file systems.
The maximum number of symbolic links is platform-independent and generally (much) higher than what the native realpath(3) implementation supports.
The callback gets two arguments (err, resolvedPath). May use process.cwd to resolve relative paths.
Only paths that can be converted to UTF8 strings are supported.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the path passed to the callback. If the encoding is set to 'buffer', the path returned will be passed as a <Buffer> object.
If path resolves to a socket or a pipe, the function will return a system dependent name for that object.
A path that does not exist results in an ENOENT error. error.path is the absolute file path.
fs.realpath.native(path[, options], callback)
#
History













path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
callback <Function>
err <Error>
resolvedPath <string> | <Buffer>
Asynchronous realpath(3).
The callback gets two arguments (err, resolvedPath).
Only paths that can be converted to UTF8 strings are supported.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the path passed to the callback. If the encoding is set to 'buffer', the path returned will be passed as a <Buffer> object.
On Linux, when Node.js is linked against musl libc, the procfs file system must be mounted on /proc in order for this function to work. Glibc does not have this restriction.
fs.rename(oldPath, newPath, callback)
#
History

























oldPath <string> | <Buffer> | <URL>
newPath <string> | <Buffer> | <URL>
callback <Function>
err <Error>
Asynchronously rename file at oldPath to the pathname provided as newPath. In the case that newPath already exists, it will be overwritten. If there is a directory at newPath, an error will be raised instead. No arguments other than a possible exception are given to the completion callback.
See also: rename(2).
import { rename } from 'node:fs';

rename('oldFile.txt', 'newFile.txt', (err) => {
  if (err) throw err;
  console.log('Rename complete!');
});
copy
fs.rmdir(path[, options], callback)
#
History

















































path <string> | <Buffer> | <URL>
options <Object>
maxRetries <integer> If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered, Node.js retries the operation with a linear backoff wait of retryDelay milliseconds longer on each try. This option represents the number of retries. This option is ignored if the recursive option is not true. Default: 0.
recursive <boolean> If true, perform a recursive directory removal. In recursive mode, operations are retried on failure. Default: false. Deprecated.
retryDelay <integer> The amount of time in milliseconds to wait between retries. This option is ignored if the recursive option is not true. Default: 100.
callback <Function>
err <Error>
Asynchronous rmdir(2). No arguments other than a possible exception are given to the completion callback.
Using fs.rmdir() on a file (not a directory) results in an ENOENT error on Windows and an ENOTDIR error on POSIX.
To get a behavior similar to the rm -rf Unix command, use fs.rm() with options { recursive: true, force: true }.
fs.rm(path[, options], callback)
#
History













path <string> | <Buffer> | <URL>
options <Object>
force <boolean> When true, exceptions will be ignored if path does not exist. Default: false.
maxRetries <integer> If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered, Node.js will retry the operation with a linear backoff wait of retryDelay milliseconds longer on each try. This option represents the number of retries. This option is ignored if the recursive option is not true. Default: 0.
recursive <boolean> If true, perform a recursive removal. In recursive mode operations are retried on failure. Default: false.
retryDelay <integer> The amount of time in milliseconds to wait between retries. This option is ignored if the recursive option is not true. Default: 100.
callback <Function>
err <Error>
Asynchronously removes files and directories (modeled on the standard POSIX rm utility). No arguments other than a possible exception are given to the completion callback.
fs.stat(path[, options], callback)
#
History





























path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
callback <Function>
err <Error>
stats <fs.Stats>
Asynchronous stat(2). The callback gets two arguments (err, stats) where stats is an <fs.Stats> object.
In case of an error, the err.code will be one of Common System Errors.
fs.stat() follows symbolic links. Use fs.lstat() to look at the links themselves.
Using fs.stat() to check for the existence of a file before calling fs.open(), fs.readFile(), or fs.writeFile() is not recommended. Instead, user code should open/read/write the file directly and handle the error raised if the file is not available.
To check if a file exists without manipulating it afterwards, fs.access() is recommended.
For example, given the following directory structure:
- txtDir
-- file.txt
- app.js
copy
The next program will check for the stats of the given paths:
import { stat } from 'node:fs';

const pathsToCheck = ['./txtDir', './txtDir/file.txt'];

for (let i = 0; i < pathsToCheck.length; i++) {
  stat(pathsToCheck[i], (err, stats) => {
    console.log(stats.isDirectory());
    console.log(stats);
  });
}
copy
The resulting output will resemble:
true
Stats {
  dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214262,
  size: 96,
  blocks: 0,
  atimeMs: 1561174653071.963,
  mtimeMs: 1561174614583.3518,
  ctimeMs: 1561174626623.5366,
  birthtimeMs: 1561174126937.2893,
  atime: 2019-06-22T03:37:33.072Z,
  mtime: 2019-06-22T03:36:54.583Z,
  ctime: 2019-06-22T03:37:06.624Z,
  birthtime: 2019-06-22T03:28:46.937Z
}
false
Stats {
  dev: 16777220,
  mode: 33188,
  nlink: 1,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214074,
  size: 8,
  blocks: 8,
  atimeMs: 1561174616618.8555,
  mtimeMs: 1561174614584,
  ctimeMs: 1561174614583.8145,
  birthtimeMs: 1561174007710.7478,
  atime: 2019-06-22T03:36:56.619Z,
  mtime: 2019-06-22T03:36:54.584Z,
  ctime: 2019-06-22T03:36:54.584Z,
  birthtime: 2019-06-22T03:26:47.711Z
}
copy
fs.statfs(path[, options], callback)
#
Added in: v19.6.0, v18.15.0
path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.StatFs> object should be bigint. Default: false.
callback <Function>
err <Error>
stats <fs.StatFs>
Asynchronous statfs(2). Returns information about the mounted file system which contains path. The callback gets two arguments (err, stats) where stats is an <fs.StatFs> object.
In case of an error, the err.code will be one of Common System Errors.
fs.symlink(target, path[, type], callback)
#
History





















target <string> | <Buffer> | <URL>
path <string> | <Buffer> | <URL>
type <string> | <null> Default: null
callback <Function>
err <Error>
Creates the link called path pointing to target. No arguments other than a possible exception are given to the completion callback.
See the POSIX symlink(2) documentation for more details.
The type argument is only available on Windows and ignored on other platforms. It can be set to 'dir', 'file', or 'junction'. If the type argument is null, Node.js will autodetect target type and use 'file' or 'dir'. If the target does not exist, 'file' will be used. Windows junction points require the destination path to be absolute. When using 'junction', the target argument will automatically be normalized to absolute path. Junction points on NTFS volumes can only point to directories.
Relative targets are relative to the link's parent directory.
import { symlink } from 'node:fs';

symlink('./mew', './mewtwo', callback);
copy
The above example creates a symbolic link mewtwo which points to mew in the same directory:
$ tree .
.
├── mew
└── mewtwo -> ./mew
copy
fs.truncate(path[, len], callback)
#
History

























path <string> | <Buffer> | <URL>
len <integer> Default: 0
callback <Function>
err <Error> | <AggregateError>
Truncates the file. No arguments other than a possible exception are given to the completion callback. A file descriptor can also be passed as the first argument. In this case, fs.ftruncate() is called.
const { truncate } = require('node:fs');
// Assuming that 'path/file.txt' is a regular file.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was truncated');
});
copy
Passing a file descriptor is deprecated and may result in an error being thrown in the future.
See the POSIX truncate(2) documentation for more details.
fs.unlink(path, callback)
#
History

























path <string> | <Buffer> | <URL>
callback <Function>
err <Error>
Asynchronously removes a file or symbolic link. No arguments other than a possible exception are given to the completion callback.
import { unlink } from 'node:fs';
// Assuming that 'path/file.txt' is a regular file.
unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was deleted');
});
copy
fs.unlink() will not work on a directory, empty or otherwise. To remove a directory, use fs.rmdir().
See the POSIX unlink(2) documentation for more details.
fs.unwatchFile(filename[, listener])
#
Added in: v0.1.31
filename <string> | <Buffer> | <URL>
listener <Function> Optional, a listener previously attached using fs.watchFile()
Stop watching for changes on filename. If listener is specified, only that particular listener is removed. Otherwise, all listeners are removed, effectively stopping watching of filename.
Calling fs.unwatchFile() with a filename that is not being watched is a no-op, not an error.
Using fs.watch() is more efficient than fs.watchFile() and fs.unwatchFile(). fs.watch() should be used instead of fs.watchFile() and fs.unwatchFile() when possible.
fs.utimes(path, atime, mtime, callback)
#
History

































path <string> | <Buffer> | <URL>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
callback <Function>
err <Error>
Change the file system timestamps of the object referenced by path.
The atime and mtime arguments follow these rules:
Values can be either numbers representing Unix epoch time in seconds, Dates, or a numeric string like '123456789.0'.
If the value can not be converted to a number, or is NaN, Infinity, or -Infinity, an Error will be thrown.
fs.watch(filename[, options][, listener])
#
History

























filename <string> | <Buffer> | <URL>
options <string> | <Object>
persistent <boolean> Indicates whether the process should continue to run as long as files are being watched. Default: true.
recursive <boolean> Indicates whether all subdirectories should be watched, or only the current directory. This applies when a directory is specified, and only on supported platforms (See caveats). Default: false.
encoding <string> Specifies the character encoding to be used for the filename passed to the listener. Default: 'utf8'.
signal <AbortSignal> allows closing the watcher with an AbortSignal.
listener <Function> | <undefined> Default: undefined
eventType <string>
filename <string> | <Buffer> | <null>
Returns: <fs.FSWatcher>
Watch for changes on filename, where filename is either a file or a directory.
The second argument is optional. If options is provided as a string, it specifies the encoding. Otherwise options should be passed as an object.
The listener callback gets two arguments (eventType, filename). eventType is either 'rename' or 'change', and filename is the name of the file which triggered the event.
On most platforms, 'rename' is emitted whenever a filename appears or disappears in the directory.
The listener callback is attached to the 'change' event fired by <fs.FSWatcher>, but it is not the same thing as the 'change' value of eventType.
If a signal is passed, aborting the corresponding AbortController will close the returned <fs.FSWatcher>.
Caveats
#
The fs.watch API is not 100% consistent across platforms, and is unavailable in some situations.
On Windows, no events will be emitted if the watched directory is moved or renamed. An EPERM error is reported when the watched directory is deleted.
The fs.watch API does not provide any protection with respect to malicious actions on the file system. For example, on Windows it is implemented by monitoring changes in a directory versus specific files. This allows substitution of a file and fs reporting changes on the new file with the same filename.
Availability
#
This feature depends on the underlying operating system providing a way to be notified of file system changes.
On Linux systems, this uses inotify(7).
On BSD systems, this uses kqueue(2).
On macOS, this uses kqueue(2) for files and FSEvents for directories.
On SunOS systems (including Solaris and SmartOS), this uses event ports.
On Windows systems, this feature depends on ReadDirectoryChangesW.
On AIX systems, this feature depends on AHAFS, which must be enabled.
On IBM i systems, this feature is not supported.
If the underlying functionality is not available for some reason, then fs.watch() will not be able to function and may throw an exception. For example, watching files or directories can be unreliable, and in some cases impossible, on network file systems (NFS, SMB, etc) or host file systems when using virtualization software such as Vagrant or Docker.
It is still possible to use fs.watchFile(), which uses stat polling, but this method is slower and less reliable.
Inodes
#
On Linux and macOS systems, fs.watch() resolves the path to an inode and watches the inode. If the watched path is deleted and recreated, it is assigned a new inode. The watch will emit an event for the delete but will continue watching the original inode. Events for the new inode will not be emitted. This is expected behavior.
AIX files retain the same inode for the lifetime of a file. Saving and closing a watched file on AIX will result in two notifications (one for adding new content, and one for truncation).
Filename argument
#
Providing filename argument in the callback is only supported on Linux, macOS, Windows, and AIX. Even on supported platforms, filename is not always guaranteed to be provided. Therefore, don't assume that filename argument is always provided in the callback, and have some fallback logic if it is null.
import { watch } from 'node:fs';
watch('somedir', (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log('filename not provided');
  }
});
copy
fs.watchFile(filename[, options], listener)
#
History

















filename <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Default: false
persistent <boolean> Default: true
interval <integer> Default: 5007
listener <Function>
current <fs.Stats>
previous <fs.Stats>
Returns: <fs.StatWatcher>
Watch for changes on filename. The callback listener will be called each time the file is accessed.
The options argument may be omitted. If provided, it should be an object. The options object may contain a boolean named persistent that indicates whether the process should continue to run as long as files are being watched. The options object may specify an interval property indicating how often the target should be polled in milliseconds.
The listener gets two arguments the current stat object and the previous stat object:
import { watchFile } from 'node:fs';

watchFile('message.text', (curr, prev) => {
  console.log(`the current mtime is: ${curr.mtime}`);
  console.log(`the previous mtime was: ${prev.mtime}`);
});
copy
These stat objects are instances of fs.Stat. If the bigint option is true, the numeric values in these objects are specified as BigInts.
To be notified when the file was modified, not just accessed, it is necessary to compare curr.mtimeMs and prev.mtimeMs.
When an fs.watchFile operation results in an ENOENT error, it will invoke the listener once, with all the fields zeroed (or, for dates, the Unix Epoch). If the file is created later on, the listener will be called again, with the latest stat objects. This is a change in functionality since v0.10.
Using fs.watch() is more efficient than fs.watchFile and fs.unwatchFile. fs.watch should be used instead of fs.watchFile and fs.unwatchFile when possible.
When a file being watched by fs.watchFile() disappears and reappears, then the contents of previous in the second callback event (the file's reappearance) will be the same as the contents of previous in the first callback event (its disappearance).
This happens when:
the file is deleted, followed by a restore
the file is renamed and then renamed a second time back to its original name
fs.write(fd, buffer, offset[, length[, position]], callback)
#
History





































fd <integer>
buffer <Buffer> | <TypedArray> | <DataView>
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <null> Default: null
callback <Function>
err <Error>
bytesWritten <integer>
buffer <Buffer> | <TypedArray> | <DataView>
Write buffer to the file specified by fd.
offset determines the part of the buffer to be written, and length is an integer specifying the number of bytes to write.
position refers to the offset from the beginning of the file where this data should be written. If typeof position !== 'number', the data will be written at the current position. See pwrite(2).
The callback will be given three arguments (err, bytesWritten, buffer) where bytesWritten specifies how many bytes were written from buffer.
If this method is invoked as its util.promisify()ed version, it returns a promise for an Object with bytesWritten and buffer properties.
It is unsafe to use fs.write() multiple times on the same file without waiting for the callback. For this scenario, fs.createWriteStream() is recommended.
On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
fs.write(fd, buffer[, options], callback)
#
Added in: v18.3.0, v16.17.0
fd <integer>
buffer <Buffer> | <TypedArray> | <DataView>
options <Object>
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <null> Default: null
callback <Function>
err <Error>
bytesWritten <integer>
buffer <Buffer> | <TypedArray> | <DataView>
Write buffer to the file specified by fd.
Similar to the above fs.write function, this version takes an optional options object. If no options object is specified, it will default with the above values.
fs.write(fd, string[, position[, encoding]], callback)
#
History





































fd <integer>
string <string>
position <integer> | <null> Default: null
encoding <string> Default: 'utf8'
callback <Function>
err <Error>
written <integer>
string <string>
Write string to the file specified by fd. If string is not a string, an exception is thrown.
position refers to the offset from the beginning of the file where this data should be written. If typeof position !== 'number' the data will be written at the current position. See pwrite(2).
encoding is the expected string encoding.
The callback will receive the arguments (err, written, string) where written specifies how many bytes the passed string required to be written. Bytes written is not necessarily the same as string characters written. See Buffer.byteLength.
It is unsafe to use fs.write() multiple times on the same file without waiting for the callback. For this scenario, fs.createWriteStream() is recommended.
On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
On Windows, if the file descriptor is connected to the console (e.g. fd == 1 or stdout) a string containing non-ASCII characters will not be rendered properly by default, regardless of the encoding used. It is possible to configure the console to render UTF-8 properly by changing the active codepage with the chcp 65001 command. See the chcp docs for more details.
fs.writeFile(file, data[, options], callback)
#
History





























































file <string> | <Buffer> | <URL> | <integer> filename or file descriptor
data <string> | <Buffer> | <TypedArray> | <DataView>
options <Object> | <string>
encoding <string> | <null> Default: 'utf8'
mode <integer> Default: 0o666
flag <string> See support of file system flags. Default: 'w'.
flush <boolean> If all data is successfully written to the file, and flush is true, fs.fsync() is used to flush the data. Default: false.
signal <AbortSignal> allows aborting an in-progress writeFile
callback <Function>
err <Error> | <AggregateError>
When file is a filename, asynchronously writes data to the file, replacing the file if it already exists. data can be a string or a buffer.
When file is a file descriptor, the behavior is similar to calling fs.write() directly (which is recommended). See the notes below on using a file descriptor.
The encoding option is ignored if data is a buffer.
The mode option only affects the newly created file. See fs.open() for more details.
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
copy
If options is a string, then it specifies the encoding:
import { writeFile } from 'node:fs';

writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
copy
It is unsafe to use fs.writeFile() multiple times on the same file without waiting for the callback. For this scenario, fs.createWriteStream() is recommended.
Similarly to fs.readFile - fs.writeFile is a convenience method that performs multiple write calls internally to write the buffer passed to it. For performance sensitive code consider using fs.createWriteStream().
It is possible to use an <AbortSignal> to cancel an fs.writeFile(). Cancelation is "best effort", and some amount of data is likely still to be written.
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const controller = new AbortController();
const { signal } = controller;
const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, { signal }, (err) => {
  // When a request is aborted - the callback is called with an AbortError
});
// When the request should be aborted
controller.abort();
copy
Aborting an ongoing request does not abort individual operating system requests but rather the internal buffering fs.writeFile performs.
Using fs.writeFile() with file descriptors
#
When file is a file descriptor, the behavior is almost identical to directly calling fs.write() like:
import { write } from 'node:fs';
import { Buffer } from 'node:buffer';

write(fd, Buffer.from(data, options.encoding), callback);
copy
The difference from directly calling fs.write() is that under some unusual conditions, fs.write() might write only part of the buffer and need to be retried to write the remaining data, whereas fs.writeFile() retries until the data is entirely written (or an error occurs).
The implications of this are a common source of confusion. In the file descriptor case, the file is not replaced! The data is not necessarily written to the beginning of the file, and the file's original data may remain before and/or after the newly written data.
For example, if fs.writeFile() is called twice in a row, first to write the string 'Hello', then to write the string ', World', the file would contain 'Hello, World', and might contain some of the file's original data (depending on the size of the original file, and the position of the file descriptor). If a file name had been used instead of a descriptor, the file would be guaranteed to contain only ', World'.
fs.writev(fd, buffers[, position], callback)
#
History













fd <integer>
buffers <ArrayBufferView[]>
position <integer> | <null> Default: null
callback <Function>
err <Error>
bytesWritten <integer>
buffers <ArrayBufferView[]>
Write an array of ArrayBufferViews to the file specified by fd using writev().
position is the offset from the beginning of the file where this data should be written. If typeof position !== 'number', the data will be written at the current position.
The callback will be given three arguments: err, bytesWritten, and buffers. bytesWritten is how many bytes were written from buffers.
If this method is util.promisify()ed, it returns a promise for an Object with bytesWritten and buffers properties.
It is unsafe to use fs.writev() multiple times on the same file without waiting for the callback. For this scenario, use fs.createWriteStream().
On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
Synchronous API
#
The synchronous APIs perform all operations synchronously, blocking the event loop until the operation completes or fails.
fs.accessSync(path[, mode])
#
History













path <string> | <Buffer> | <URL>
mode <integer> Default: fs.constants.F_OK
Synchronously tests a user's permissions for the file or directory specified by path. The mode argument is an optional integer that specifies the accessibility checks to be performed. mode should be either the value fs.constants.F_OK or a mask consisting of the bitwise OR of any of fs.constants.R_OK, fs.constants.W_OK, and fs.constants.X_OK (e.g. fs.constants.W_OK | fs.constants.R_OK). Check File access constants for possible values of mode.
If any of the accessibility checks fail, an Error will be thrown. Otherwise, the method will return undefined.
import { accessSync, constants } from 'node:fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}
copy
fs.appendFileSync(path, data[, options])
#
History





















path <string> | <Buffer> | <URL> | <number> filename or file descriptor
data <string> | <Buffer>
options <Object> | <string>
encoding <string> | <null> Default: 'utf8'
mode <integer> Default: 0o666
flag <string> See support of file system flags. Default: 'a'.
flush <boolean> If true, the underlying file descriptor is flushed prior to closing it. Default: false.
Synchronously append data to a file, creating the file if it does not yet exist. data can be a string or a <Buffer>.
The mode option only affects the newly created file. See fs.open() for more details.
import { appendFileSync } from 'node:fs';

try {
  appendFileSync('message.txt', 'data to append');
  console.log('The "data to append" was appended to file!');
} catch (err) {
  /* Handle the error */
}
copy
If options is a string, then it specifies the encoding:
import { appendFileSync } from 'node:fs';

appendFileSync('message.txt', 'data to append', 'utf8');
copy
The path may be specified as a numeric file descriptor that has been opened for appending (using fs.open() or fs.openSync()). The file descriptor will not be closed automatically.
import { openSync, closeSync, appendFileSync } from 'node:fs';

let fd;

try {
  fd = openSync('message.txt', 'a');
  appendFileSync(fd, 'data to append', 'utf8');
} catch (err) {
  /* Handle the error */
} finally {
  if (fd !== undefined)
    closeSync(fd);
}
copy
fs.chmodSync(path, mode)
#
History













path <string> | <Buffer> | <URL>
mode <string> | <integer>
For detailed information, see the documentation of the asynchronous version of this API: fs.chmod().
See the POSIX chmod(2) documentation for more detail.
fs.chownSync(path, uid, gid)
#
History













path <string> | <Buffer> | <URL>
uid <integer>
gid <integer>
Synchronously changes owner and group of a file. Returns undefined. This is the synchronous version of fs.chown().
See the POSIX chown(2) documentation for more detail.
fs.closeSync(fd)
#
Added in: v0.1.21
fd <integer>
Closes the file descriptor. Returns undefined.
Calling fs.closeSync() on any file descriptor (fd) that is currently in use through any other fs operation may lead to undefined behavior.
See the POSIX close(2) documentation for more detail.
fs.copyFileSync(src, dest[, mode])
#
History













src <string> | <Buffer> | <URL> source filename to copy
dest <string> | <Buffer> | <URL> destination filename of the copy operation
mode <integer> modifiers for copy operation. Default: 0.
Synchronously copies src to dest. By default, dest is overwritten if it already exists. Returns undefined. Node.js makes no guarantees about the atomicity of the copy operation. If an error occurs after the destination file has been opened for writing, Node.js will attempt to remove the destination.
mode is an optional integer that specifies the behavior of the copy operation. It is possible to create a mask consisting of the bitwise OR of two or more values (e.g. fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE).
fs.constants.COPYFILE_EXCL: The copy operation will fail if dest already exists.
fs.constants.COPYFILE_FICLONE: The copy operation will attempt to create a copy-on-write reflink. If the platform does not support copy-on-write, then a fallback copy mechanism is used.
fs.constants.COPYFILE_FICLONE_FORCE: The copy operation will attempt to create a copy-on-write reflink. If the platform does not support copy-on-write, then the operation will fail.
import { copyFileSync, constants } from 'node:fs';

// destination.txt will be created or overwritten by default.
copyFileSync('source.txt', 'destination.txt');
console.log('source.txt was copied to destination.txt');

// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
copyFileSync('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
copy
fs.cpSync(src, dest[, options])
#
History





















src <string> | <URL> source path to copy.
dest <string> | <URL> destination path to copy to.
options <Object>
dereference <boolean> dereference symlinks. Default: false.
errorOnExist <boolean> when force is false, and the destination exists, throw an error. Default: false.
filter <Function> Function to filter copied files/directories. Return true to copy the item, false to ignore it. When ignoring a directory, all of its contents will be skipped as well. Default: undefined
src <string> source path to copy.
dest <string> destination path to copy to.
Returns: <boolean> Any non-Promise value that is coercible to boolean.
force <boolean> overwrite existing file or directory. The copy operation will ignore errors if you set this to false and the destination exists. Use the errorOnExist option to change this behavior. Default: true.
mode <integer> modifiers for copy operation. Default: 0. See mode flag of fs.copyFileSync().
preserveTimestamps <boolean> When true timestamps from src will be preserved. Default: false.
recursive <boolean> copy directories recursively Default: false
verbatimSymlinks <boolean> When true, path resolution for symlinks will be skipped. Default: false
Synchronously copies the entire directory structure from src to dest, including subdirectories and files.
When copying a directory to another directory, globs are not supported and behavior is similar to cp dir1/ dir2/.
fs.existsSync(path)
#
History













path <string> | <Buffer> | <URL>
Returns: <boolean>
Returns true if the path exists, false otherwise.
For detailed information, see the documentation of the asynchronous version of this API: fs.exists().
fs.exists() is deprecated, but fs.existsSync() is not. The callback parameter to fs.exists() accepts parameters that are inconsistent with other Node.js callbacks. fs.existsSync() does not use a callback.
import { existsSync } from 'node:fs';

if (existsSync('/etc/passwd'))
  console.log('The path exists.');
copy
fs.fchmodSync(fd, mode)
#
Added in: v0.4.7
fd <integer>
mode <string> | <integer>
Sets the permissions on the file. Returns undefined.
See the POSIX fchmod(2) documentation for more detail.
fs.fchownSync(fd, uid, gid)
#
Added in: v0.4.7
fd <integer>
uid <integer> The file's new owner's user id.
gid <integer> The file's new group's group id.
Sets the owner of the file. Returns undefined.
See the POSIX fchown(2) documentation for more detail.
fs.fdatasyncSync(fd)
#
Added in: v0.1.96
fd <integer>
Forces all currently queued I/O operations associated with the file to the operating system's synchronized I/O completion state. Refer to the POSIX fdatasync(2) documentation for details. Returns undefined.
fs.fstatSync(fd[, options])
#
History













fd <integer>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
Returns: <fs.Stats>
Retrieves the <fs.Stats> for the file descriptor.
See the POSIX fstat(2) documentation for more detail.
fs.fsyncSync(fd)
#
Added in: v0.1.96
fd <integer>
Request that all data for the open file descriptor is flushed to the storage device. The specific implementation is operating system and device specific. Refer to the POSIX fsync(2) documentation for more detail. Returns undefined.
fs.ftruncateSync(fd[, len])
#
Added in: v0.8.6
fd <integer>
len <integer> Default: 0
Truncates the file descriptor. Returns undefined.
For detailed information, see the documentation of the asynchronous version of this API: fs.ftruncate().
fs.futimesSync(fd, atime, mtime)
#
History













fd <integer>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
Synchronous version of fs.futimes(). Returns undefined.
fs.globSync(pattern[, options])
#
History

























pattern <string> | <string[]>
options <Object>
cwd <string> | <URL> current working directory. Default: process.cwd()
exclude <Function> | <string[]> Function to filter out files/directories or a list of glob patterns to be excluded. If a function is provided, return true to exclude the item, false to include it. Default: undefined.
withFileTypes <boolean> true if the glob should return paths as Dirents, false otherwise. Default: false.
Returns: <string[]> paths of files that match the pattern.
const { globSync } = require('node:fs');

console.log(globSync('**/*.js'));
copy
fs.lchmodSync(path, mode)
#
Deprecated since: v0.4.7
Stability: 0 - Deprecated
path <string> | <Buffer> | <URL>
mode <integer>
Changes the permissions on a symbolic link. Returns undefined.
This method is only implemented on macOS.
See the POSIX lchmod(2) documentation for more detail.
fs.lchownSync(path, uid, gid)
#
History













path <string> | <Buffer> | <URL>
uid <integer> The file's new owner's user id.
gid <integer> The file's new group's group id.
Set the owner for the path. Returns undefined.
See the POSIX lchown(2) documentation for more details.
fs.lutimesSync(path, atime, mtime)
#
Added in: v14.5.0, v12.19.0
path <string> | <Buffer> | <URL>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
Change the file system timestamps of the symbolic link referenced by path. Returns undefined, or throws an exception when parameters are incorrect or the operation fails. This is the synchronous version of fs.lutimes().
fs.linkSync(existingPath, newPath)
#
History













existingPath <string> | <Buffer> | <URL>
newPath <string> | <Buffer> | <URL>
Creates a new link from the existingPath to the newPath. See the POSIX link(2) documentation for more detail. Returns undefined.
fs.lstatSync(path[, options])
#
History





















path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
throwIfNoEntry <boolean> Whether an exception will be thrown if no file system entry exists, rather than returning undefined. Default: true.
Returns: <fs.Stats>
Retrieves the <fs.Stats> for the symbolic link referred to by path.
See the POSIX lstat(2) documentation for more details.
fs.mkdirSync(path[, options])
#
History





















path <string> | <Buffer> | <URL>
options <Object> | <integer>
recursive <boolean> Default: false
mode <string> | <integer> Not supported on Windows. Default: 0o777.
Returns: <string> | <undefined>
Synchronously creates a directory. Returns undefined, or if recursive is true, the first directory path created. This is the synchronous version of fs.mkdir().
See the POSIX mkdir(2) documentation for more details.
fs.mkdtempSync(prefix[, options])
#
History

















prefix <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <string>
Returns the created directory path.
For detailed information, see the documentation of the asynchronous version of this API: fs.mkdtemp().
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use.
fs.mkdtempDisposableSync(prefix[, options])
#
Added in: v24.4.0
prefix <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <Object> A disposable object:
path <string> The path of the created directory.
remove <Function> A function which removes the created directory.
[Symbol.dispose] <Function> The same as remove.
Returns a disposable object whose path property holds the created directory path. When the object is disposed, the directory and its contents will be removed if it still exists. If the directory cannot be deleted, disposal will throw an error. The object has a remove() method which will perform the same task.
For detailed information, see the documentation of fs.mkdtemp().
There is no callback-based version of this API because it is designed for use with the using syntax.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use.
fs.opendirSync(path[, options])
#
History

















path <string> | <Buffer> | <URL>
options <Object>
encoding <string> | <null> Default: 'utf8'
bufferSize <number> Number of directory entries that are buffered internally when reading from the directory. Higher values lead to better performance but higher memory usage. Default: 32
recursive <boolean> Default: false
Returns: <fs.Dir>
Synchronously open a directory. See opendir(3).
Creates an <fs.Dir>, which contains all further functions for reading from and cleaning up the directory.
The encoding option sets the encoding for the path while opening the directory and subsequent read operations.
fs.openSync(path[, flags[, mode]])
#
History





















path <string> | <Buffer> | <URL>
flags <string> | <number> Default: 'r'. See support of file system flags.
mode <string> | <integer> Default: 0o666
Returns: <number>
Returns an integer representing the file descriptor.
For detailed information, see the documentation of the asynchronous version of this API: fs.open().
fs.readdirSync(path[, options])
#
History





















path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
withFileTypes <boolean> Default: false
recursive <boolean> If true, reads the contents of a directory recursively. In recursive mode, it will list all files, sub files, and directories. Default: false.
Returns: <string[]> | <Buffer[]> | <fs.Dirent[]>
Reads the contents of the directory.
See the POSIX readdir(3) documentation for more details.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the filenames returned. If the encoding is set to 'buffer', the filenames returned will be passed as <Buffer> objects.
If options.withFileTypes is set to true, the result will contain <fs.Dirent> objects.
fs.readFileSync(path[, options])
#
History

















path <string> | <Buffer> | <URL> | <integer> filename or file descriptor
options <Object> | <string>
encoding <string> | <null> Default: null
flag <string> See support of file system flags. Default: 'r'.
Returns: <string> | <Buffer>
Returns the contents of the path.
For detailed information, see the documentation of the asynchronous version of this API: fs.readFile().
If the encoding option is specified then this function returns a string. Otherwise it returns a buffer.
Similar to fs.readFile(), when the path is a directory, the behavior of fs.readFileSync() is platform-specific.
import { readFileSync } from 'node:fs';

// macOS, Linux, and Windows
readFileSync('<directory>');
// => [Error: EISDIR: illegal operation on a directory, read <directory>]

//  FreeBSD
readFileSync('<directory>'); // => <data>
copy
fs.readlinkSync(path[, options])
#
History













path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <string> | <Buffer>
Returns the symbolic link's string value.
See the POSIX readlink(2) documentation for more details.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the link path returned. If the encoding is set to 'buffer', the link path returned will be passed as a <Buffer> object.
fs.readSync(fd, buffer, offset, length[, position])
#
History

















fd <integer>
buffer <Buffer> | <TypedArray> | <DataView>
offset <integer>
length <integer>
position <integer> | <bigint> | <null> Default: null
Returns: <number>
Returns the number of bytesRead.
For detailed information, see the documentation of the asynchronous version of this API: fs.read().
fs.readSync(fd, buffer[, options])
#
History













fd <integer>
buffer <Buffer> | <TypedArray> | <DataView>
options <Object>
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <bigint> | <null> Default: null
Returns: <number>
Returns the number of bytesRead.
Similar to the above fs.readSync function, this version takes an optional options object. If no options object is specified, it will default with the above values.
For detailed information, see the documentation of the asynchronous version of this API: fs.read().
fs.readvSync(fd, buffers[, position])
#
Added in: v13.13.0, v12.17.0
fd <integer>
buffers <ArrayBufferView[]>
position <integer> | <null> Default: null
Returns: <number> The number of bytes read.
For detailed information, see the documentation of the asynchronous version of this API: fs.readv().
fs.realpathSync(path[, options])
#
History

























path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <string> | <Buffer>
Returns the resolved pathname.
For detailed information, see the documentation of the asynchronous version of this API: fs.realpath().
fs.realpathSync.native(path[, options])
#
Added in: v9.2.0
path <string> | <Buffer> | <URL>
options <string> | <Object>
encoding <string> Default: 'utf8'
Returns: <string> | <Buffer>
Synchronous realpath(3).
Only paths that can be converted to UTF8 strings are supported.
The optional options argument can be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use for the path returned. If the encoding is set to 'buffer', the path returned will be passed as a <Buffer> object.
On Linux, when Node.js is linked against musl libc, the procfs file system must be mounted on /proc in order for this function to work. Glibc does not have this restriction.
fs.renameSync(oldPath, newPath)
#
History













oldPath <string> | <Buffer> | <URL>
newPath <string> | <Buffer> | <URL>
Renames the file from oldPath to newPath. Returns undefined.
See the POSIX rename(2) documentation for more details.
fs.rmdirSync(path[, options])
#
History





































path <string> | <Buffer> | <URL>
options <Object>
maxRetries <integer> If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered, Node.js retries the operation with a linear backoff wait of retryDelay milliseconds longer on each try. This option represents the number of retries. This option is ignored if the recursive option is not true. Default: 0.
recursive <boolean> If true, perform a recursive directory removal. In recursive mode, operations are retried on failure. Default: false. Deprecated.
retryDelay <integer> The amount of time in milliseconds to wait between retries. This option is ignored if the recursive option is not true. Default: 100.
Synchronous rmdir(2). Returns undefined.
Using fs.rmdirSync() on a file (not a directory) results in an ENOENT error on Windows and an ENOTDIR error on POSIX.
To get a behavior similar to the rm -rf Unix command, use fs.rmSync() with options { recursive: true, force: true }.
fs.rmSync(path[, options])
#
History













path <string> | <Buffer> | <URL>
options <Object>
force <boolean> When true, exceptions will be ignored if path does not exist. Default: false.
maxRetries <integer> If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered, Node.js will retry the operation with a linear backoff wait of retryDelay milliseconds longer on each try. This option represents the number of retries. This option is ignored if the recursive option is not true. Default: 0.
recursive <boolean> If true, perform a recursive directory removal. In recursive mode operations are retried on failure. Default: false.
retryDelay <integer> The amount of time in milliseconds to wait between retries. This option is ignored if the recursive option is not true. Default: 100.
Synchronously removes files and directories (modeled on the standard POSIX rm utility). Returns undefined.
fs.statSync(path[, options])
#
History





















path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.Stats> object should be bigint. Default: false.
throwIfNoEntry <boolean> Whether an exception will be thrown if no file system entry exists, rather than returning undefined. Default: true.
Returns: <fs.Stats>
Retrieves the <fs.Stats> for the path.
fs.statfsSync(path[, options])
#
Added in: v19.6.0, v18.15.0
path <string> | <Buffer> | <URL>
options <Object>
bigint <boolean> Whether the numeric values in the returned <fs.StatFs> object should be bigint. Default: false.
Returns: <fs.StatFs>
Synchronous statfs(2). Returns information about the mounted file system which contains path.
In case of an error, the err.code will be one of Common System Errors.
fs.symlinkSync(target, path[, type])
#
History

















target <string> | <Buffer> | <URL>
path <string> | <Buffer> | <URL>
type <string> | <null> Default: null
Returns undefined.
For detailed information, see the documentation of the asynchronous version of this API: fs.symlink().
fs.truncateSync(path[, len])
#
Added in: v0.8.6
path <string> | <Buffer> | <URL>
len <integer> Default: 0
Truncates the file. Returns undefined. A file descriptor can also be passed as the first argument. In this case, fs.ftruncateSync() is called.
Passing a file descriptor is deprecated and may result in an error being thrown in the future.
fs.unlinkSync(path)
#
History













path <string> | <Buffer> | <URL>
Synchronous unlink(2). Returns undefined.
fs.utimesSync(path, atime, mtime)
#
History





















path <string> | <Buffer> | <URL>
atime <number> | <string> | <Date>
mtime <number> | <string> | <Date>
Returns undefined.
For detailed information, see the documentation of the asynchronous version of this API: fs.utimes().
fs.writeFileSync(file, data[, options])
#
History









































file <string> | <Buffer> | <URL> | <integer> filename or file descriptor
data <string> | <Buffer> | <TypedArray> | <DataView>
options <Object> | <string>
encoding <string> | <null> Default: 'utf8'
mode <integer> Default: 0o666
flag <string> See support of file system flags. Default: 'w'.
flush <boolean> If all data is successfully written to the file, and flush is true, fs.fsyncSync() is used to flush the data.
Returns undefined.
The mode option only affects the newly created file. See fs.open() for more details.
For detailed information, see the documentation of the asynchronous version of this API: fs.writeFile().
fs.writeSync(fd, buffer, offset[, length[, position]])
#
History

























fd <integer>
buffer <Buffer> | <TypedArray> | <DataView>
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <null> Default: null
Returns: <number> The number of bytes written.
For detailed information, see the documentation of the asynchronous version of this API: fs.write(fd, buffer...).
fs.writeSync(fd, buffer[, options])
#
Added in: v18.3.0, v16.17.0
fd <integer>
buffer <Buffer> | <TypedArray> | <DataView>
options <Object>
offset <integer> Default: 0
length <integer> Default: buffer.byteLength - offset
position <integer> | <null> Default: null
Returns: <number> The number of bytes written.
For detailed information, see the documentation of the asynchronous version of this API: fs.write(fd, buffer...).
fs.writeSync(fd, string[, position[, encoding]])
#
History

















fd <integer>
string <string>
position <integer> | <null> Default: null
encoding <string> Default: 'utf8'
Returns: <number> The number of bytes written.
For detailed information, see the documentation of the asynchronous version of this API: fs.write(fd, string...).
fs.writevSync(fd, buffers[, position])
#
Added in: v12.9.0
fd <integer>
buffers <ArrayBufferView[]>
position <integer> | <null> Default: null
Returns: <number> The number of bytes written.
For detailed information, see the documentation of the asynchronous version of this API: fs.writev().
Common Objects
#
The common objects are shared by all of the file system API variants (promise, callback, and synchronous).
Class: fs.Dir
#
Added in: v12.12.0
A class representing a directory stream.
Created by fs.opendir(), fs.opendirSync(), or fsPromises.opendir().
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
copy
When using the async iterator, the <fs.Dir> object will be automatically closed after the iterator exits.
dir.close()
#
Added in: v12.12.0
Returns: <Promise>
Asynchronously close the directory's underlying resource handle. Subsequent reads will result in errors.
A promise is returned that will be fulfilled after the resource has been closed.
dir.close(callback)
#
History













callback <Function>
err <Error>
Asynchronously close the directory's underlying resource handle. Subsequent reads will result in errors.
The callback will be called after the resource handle has been closed.
dir.closeSync()
#
Added in: v12.12.0
Synchronously close the directory's underlying resource handle. Subsequent reads will result in errors.
dir.path
#
Added in: v12.12.0
<string>
The read-only path of this directory as was provided to fs.opendir(), fs.opendirSync(), or fsPromises.opendir().
dir.read()
#
Added in: v12.12.0
Returns: <Promise> Fulfills with a <fs.Dirent> | <null>
Asynchronously read the next directory entry via readdir(3) as an <fs.Dirent>.
A promise is returned that will be fulfilled with an <fs.Dirent>, or null if there are no more directory entries to read.
Directory entries returned by this function are in no particular order as provided by the operating system's underlying directory mechanisms. Entries added or removed while iterating over the directory might not be included in the iteration results.
dir.read(callback)
#
Added in: v12.12.0
callback <Function>
err <Error>
dirent <fs.Dirent> | <null>
Asynchronously read the next directory entry via readdir(3) as an <fs.Dirent>.
After the read is completed, the callback will be called with an <fs.Dirent>, or null if there are no more directory entries to read.
Directory entries returned by this function are in no particular order as provided by the operating system's underlying directory mechanisms. Entries added or removed while iterating over the directory might not be included in the iteration results.
dir.readSync()
#
Added in: v12.12.0
Returns: <fs.Dirent> | <null>
Synchronously read the next directory entry as an <fs.Dirent>. See the POSIX readdir(3) documentation for more detail.
If there are no more directory entries to read, null will be returned.
Directory entries returned by this function are in no particular order as provided by the operating system's underlying directory mechanisms. Entries added or removed while iterating over the directory might not be included in the iteration results.
dir[Symbol.asyncIterator]()
#
Added in: v12.12.0
Returns: <AsyncIterator> An AsyncIterator of <fs.Dirent>
Asynchronously iterates over the directory until all entries have been read. Refer to the POSIX readdir(3) documentation for more detail.
Entries returned by the async iterator are always an <fs.Dirent>. The null case from dir.read() is handled internally.
See <fs.Dir> for an example.
Directory entries returned by this iterator are in no particular order as provided by the operating system's underlying directory mechanisms. Entries added or removed while iterating over the directory might not be included in the iteration results.
dir[Symbol.asyncDispose]()
#
History













Calls dir.close() if the directory handle is open, and returns a promise that fulfills when disposal is complete.
dir[Symbol.dispose]()
#
History













Calls dir.closeSync() if the directory handle is open, and returns undefined.
Class: fs.Dirent
#
Added in: v10.10.0
A representation of a directory entry, which can be a file or a subdirectory within the directory, as returned by reading from an <fs.Dir>. The directory entry is a combination of the file name and file type pairs.
Additionally, when fs.readdir() or fs.readdirSync() is called with the withFileTypes option set to true, the resulting array is filled with <fs.Dirent> objects, rather than strings or <Buffer>s.
dirent.isBlockDevice()
#
Added in: v10.10.0
Returns: <boolean>
Returns true if the <fs.Dirent> object describes a block device.
dirent.isCharacterDevice()
#
Added in: v10.10.0
Returns: <boolean>
Returns true if the <fs.Dirent> object describes a character device.
dirent.isDirectory()
#
Added in: v10.10.0
Returns: <boolean>
Returns true if the <fs.Dirent> object describes a file system directory.
dirent.isFIFO()
#
Added in: v10.10.0
Returns: <boolean>
Returns true if the <fs.Dirent> object describes a first-in-first-out (FIFO) pipe.
dirent.isFile()
#
Added in: v10.10.0
Returns: <boolean>
Returns true if the <fs.Dirent> object describes a regular file.
dirent.isSocket()
#
Added in: v10.10.0
Returns: <boolean>
Returns true if the <fs.Dirent> object describes a socket.
dirent.isSymbolicLink()
#
Added in: v10.10.0
Returns: <boolean>
Returns true if the <fs.Dirent> object describes a symbolic link.
dirent.name
#
Added in: v10.10.0
<string> | <Buffer>
The file name that this <fs.Dirent> object refers to. The type of this value is determined by the options.encoding passed to fs.readdir() or fs.readdirSync().
dirent.parentPath
#
History













<string>
The path to the parent directory of the file this <fs.Dirent> object refers to.
Class: fs.FSWatcher
#
Added in: v0.5.8
Extends <EventEmitter>
A successful call to fs.watch() method will return a new <fs.FSWatcher> object.
All <fs.FSWatcher> objects emit a 'change' event whenever a specific watched file is modified.
Event: 'change'
#
Added in: v0.5.8
eventType <string> The type of change event that has occurred
filename <string> | <Buffer> The filename that changed (if relevant/available)
Emitted when something changes in a watched directory or file. See more details in fs.watch().
The filename argument may not be provided depending on operating system support. If filename is provided, it will be provided as a <Buffer> if fs.watch() is called with its encoding option set to 'buffer', otherwise filename will be a UTF-8 string.
import { watch } from 'node:fs';
// Example when handled through fs.watch() listener
watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // Prints: <Buffer ...>
  }
});
copy
Event: 'close'
#
Added in: v10.0.0
Emitted when the watcher stops watching for changes. The closed <fs.FSWatcher> object is no longer usable in the event handler.
Event: 'error'
#
Added in: v0.5.8
error <Error>
Emitted when an error occurs while watching the file. The errored <fs.FSWatcher> object is no longer usable in the event handler.
watcher.close()
#
Added in: v0.5.8
Stop watching for changes on the given <fs.FSWatcher>. Once stopped, the <fs.FSWatcher> object is no longer usable.
watcher.ref()
#
Added in: v14.3.0, v12.20.0
Returns: <fs.FSWatcher>
When called, requests that the Node.js event loop not exit so long as the <fs.FSWatcher> is active. Calling watcher.ref() multiple times will have no effect.
By default, all <fs.FSWatcher> objects are "ref'ed", making it normally unnecessary to call watcher.ref() unless watcher.unref() had been called previously.
watcher.unref()
#
Added in: v14.3.0, v12.20.0
Returns: <fs.FSWatcher>
When called, the active <fs.FSWatcher> object will not require the Node.js event loop to remain active. If there is no other activity keeping the event loop running, the process may exit before the <fs.FSWatcher> object's callback is invoked. Calling watcher.unref() multiple times will have no effect.
Class: fs.StatWatcher
#
Added in: v14.3.0, v12.20.0
Extends <EventEmitter>
A successful call to fs.watchFile() method will return a new <fs.StatWatcher> object.
watcher.ref()
#
Added in: v14.3.0, v12.20.0
Returns: <fs.StatWatcher>
When called, requests that the Node.js event loop not exit so long as the <fs.StatWatcher> is active. Calling watcher.ref() multiple times will have no effect.
By default, all <fs.StatWatcher> objects are "ref'ed", making it normally unnecessary to call watcher.ref() unless watcher.unref() had been called previously.
watcher.unref()
#
Added in: v14.3.0, v12.20.0
Returns: <fs.StatWatcher>
When called, the active <fs.StatWatcher> object will not require the Node.js event loop to remain active. If there is no other activity keeping the event loop running, the process may exit before the <fs.StatWatcher> object's callback is invoked. Calling watcher.unref() multiple times will have no effect.
Class: fs.ReadStream
#
Added in: v0.1.93
Extends: <stream.Readable>
Instances of <fs.ReadStream> are created and returned using the fs.createReadStream() function.
Event: 'close'
#
Added in: v0.1.93
Emitted when the <fs.ReadStream>'s underlying file descriptor has been closed.
Event: 'open'
#
Added in: v0.1.93
fd <integer> Integer file descriptor used by the <fs.ReadStream>.
Emitted when the <fs.ReadStream>'s file descriptor has been opened.
Event: 'ready'
#
Added in: v9.11.0
Emitted when the <fs.ReadStream> is ready to be used.
Fires immediately after 'open'.
readStream.bytesRead
#
Added in: v6.4.0
<number>
The number of bytes that have been read so far.
readStream.path
#
Added in: v0.1.93
<string> | <Buffer>
The path to the file the stream is reading from as specified in the first argument to fs.createReadStream(). If path is passed as a string, then readStream.path will be a string. If path is passed as a <Buffer>, then readStream.path will be a <Buffer>. If fd is specified, then readStream.path will be undefined.
readStream.pending
#
Added in: v11.2.0, v10.16.0
<boolean>
This property is true if the underlying file has not been opened yet, i.e. before the 'ready' event is emitted.
Class: fs.Stats
#
History

















A <fs.Stats> object provides information about a file.
Objects returned from fs.stat(), fs.lstat(), fs.fstat(), and their synchronous counterparts are of this type. If bigint in the options passed to those methods is true, the numeric values will be bigint instead of number, and the object will contain additional nanosecond-precision properties suffixed with Ns. Stat objects are not to be created directly using the new keyword.
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
copy
bigint version:
BigIntStats {
  dev: 2114n,
  ino: 48064969n,
  mode: 33188n,
  nlink: 1n,
  uid: 85n,
  gid: 100n,
  rdev: 0n,
  size: 527n,
  blksize: 4096n,
  blocks: 8n,
  atimeMs: 1318289051000n,
  mtimeMs: 1318289051000n,
  ctimeMs: 1318289051000n,
  birthtimeMs: 1318289051000n,
  atimeNs: 1318289051000000000n,
  mtimeNs: 1318289051000000000n,
  ctimeNs: 1318289051000000000n,
  birthtimeNs: 1318289051000000000n,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
copy
stats.isBlockDevice()
#
Added in: v0.1.10
Returns: <boolean>
Returns true if the <fs.Stats> object describes a block device.
stats.isCharacterDevice()
#
Added in: v0.1.10
Returns: <boolean>
Returns true if the <fs.Stats> object describes a character device.
stats.isDirectory()
#
Added in: v0.1.10
Returns: <boolean>
Returns true if the <fs.Stats> object describes a file system directory.
If the <fs.Stats> object was obtained from calling fs.lstat() on a symbolic link which resolves to a directory, this method will return false. This is because fs.lstat() returns information about a symbolic link itself and not the path it resolves to.
stats.isFIFO()
#
Added in: v0.1.10
Returns: <boolean>
Returns true if the <fs.Stats> object describes a first-in-first-out (FIFO) pipe.
stats.isFile()
#
Added in: v0.1.10
Returns: <boolean>
Returns true if the <fs.Stats> object describes a regular file.
stats.isSocket()
#
Added in: v0.1.10
Returns: <boolean>
Returns true if the <fs.Stats> object describes a socket.
stats.isSymbolicLink()
#
Added in: v0.1.10
Returns: <boolean>
Returns true if the <fs.Stats> object describes a symbolic link.
This method is only valid when using fs.lstat().
stats.dev
#
<number> | <bigint>
The numeric identifier of the device containing the file.
stats.ino
#
<number> | <bigint>
The file system specific "Inode" number for the file.
stats.mode
#
<number> | <bigint>
A bit-field describing the file type and mode.
stats.nlink
#
<number> | <bigint>
The number of hard-links that exist for the file.
stats.uid
#
<number> | <bigint>
The numeric user identifier of the user that owns the file (POSIX).
stats.gid
#
<number> | <bigint>
The numeric group identifier of the group that owns the file (POSIX).
stats.rdev
#
<number> | <bigint>
A numeric device identifier if the file represents a device.
stats.size
#
<number> | <bigint>
The size of the file in bytes.
If the underlying file system does not support getting the size of the file, this will be 0.
stats.blksize
#
<number> | <bigint>
The file system block size for i/o operations.
stats.blocks
#
<number> | <bigint>
The number of blocks allocated for this file.
stats.atimeMs
#
Added in: v8.1.0
<number> | <bigint>
The timestamp indicating the last time this file was accessed expressed in milliseconds since the POSIX Epoch.
stats.mtimeMs
#
Added in: v8.1.0
<number> | <bigint>
The timestamp indicating the last time this file was modified expressed in milliseconds since the POSIX Epoch.
stats.ctimeMs
#
Added in: v8.1.0
<number> | <bigint>
The timestamp indicating the last time the file status was changed expressed in milliseconds since the POSIX Epoch.
stats.birthtimeMs
#
Added in: v8.1.0
<number> | <bigint>
The timestamp indicating the creation time of this file expressed in milliseconds since the POSIX Epoch.
stats.atimeNs
#
Added in: v12.10.0
<bigint>
Only present when bigint: true is passed into the method that generates the object. The timestamp indicating the last time this file was accessed expressed in nanoseconds since the POSIX Epoch.
stats.mtimeNs
#
Added in: v12.10.0
<bigint>
Only present when bigint: true is passed into the method that generates the object. The timestamp indicating the last time this file was modified expressed in nanoseconds since the POSIX Epoch.
stats.ctimeNs
#
Added in: v12.10.0
<bigint>
Only present when bigint: true is passed into the method that generates the object. The timestamp indicating the last time the file status was changed expressed in nanoseconds since the POSIX Epoch.
stats.birthtimeNs
#
Added in: v12.10.0
<bigint>
Only present when bigint: true is passed into the method that generates the object. The timestamp indicating the creation time of this file expressed in nanoseconds since the POSIX Epoch.
stats.atime
#
Added in: v0.11.13
<Date>
The timestamp indicating the last time this file was accessed.
stats.mtime
#
Added in: v0.11.13
<Date>
The timestamp indicating the last time this file was modified.
stats.ctime
#
Added in: v0.11.13
<Date>
The timestamp indicating the last time the file status was changed.
stats.birthtime
#
Added in: v0.11.13
<Date>
The timestamp indicating the creation time of this file.
Stat time values
#
The atimeMs, mtimeMs, ctimeMs, birthtimeMs properties are numeric values that hold the corresponding times in milliseconds. Their precision is platform specific. When bigint: true is passed into the method that generates the object, the properties will be bigints, otherwise they will be numbers.
The atimeNs, mtimeNs, ctimeNs, birthtimeNs properties are bigints that hold the corresponding times in nanoseconds. They are only present when bigint: true is passed into the method that generates the object. Their precision is platform specific.
atime, mtime, ctime, and birthtime are Date object alternate representations of the various times. The Date and number values are not connected. Assigning a new number value, or mutating the Date value, will not be reflected in the corresponding alternate representation.
The times in the stat object have the following semantics:
atime "Access Time": Time when file data last accessed. Changed by the mknod(2), utimes(2), and read(2) system calls.
mtime "Modified Time": Time when file data last modified. Changed by the mknod(2), utimes(2), and write(2) system calls.
ctime "Change Time": Time when file status was last changed (inode data modification). Changed by the chmod(2), chown(2), link(2), mknod(2), rename(2), unlink(2), utimes(2), read(2), and write(2) system calls.
birthtime "Birth Time": Time of file creation. Set once when the file is created. On file systems where birthtime is not available, this field may instead hold either the ctime or 1970-01-01T00:00Z (ie, Unix epoch timestamp 0). This value may be greater than atime or mtime in this case. On Darwin and other FreeBSD variants, also set if the atime is explicitly set to an earlier value than the current birthtime using the utimes(2) system call.
Prior to Node.js 0.12, the ctime held the birthtime on Windows systems. As of 0.12, ctime is not "creation time", and on Unix systems, it never was.
Class: fs.StatFs
#
Added in: v19.6.0, v18.15.0
Provides information about a mounted file system.
Objects returned from fs.statfs() and its synchronous counterpart are of this type. If bigint in the options passed to those methods is true, the numeric values will be bigint instead of number.
StatFs {
  type: 1397114950,
  bsize: 4096,
  blocks: 121938943,
  bfree: 61058895,
  bavail: 61058895,
  files: 999,
  ffree: 1000000
}
copy
bigint version:
StatFs {
  type: 1397114950n,
  bsize: 4096n,
  blocks: 121938943n,
  bfree: 61058895n,
  bavail: 61058895n,
  files: 999n,
  ffree: 1000000n
}
copy
statfs.bavail
#
Added in: v19.6.0, v18.15.0
<number> | <bigint>
Free blocks available to unprivileged users.
statfs.bfree
#
Added in: v19.6.0, v18.15.0
<number> | <bigint>
Free blocks in file system.
statfs.blocks
#
Added in: v19.6.0, v18.15.0
<number> | <bigint>
Total data blocks in file system.
statfs.bsize
#
Added in: v19.6.0, v18.15.0
<number> | <bigint>
Optimal transfer block size.
statfs.ffree
#
Added in: v19.6.0, v18.15.0
<number> | <bigint>
Free file nodes in file system.
statfs.files
#
Added in: v19.6.0, v18.15.0
<number> | <bigint>
Total file nodes in file system.
statfs.type
#
Added in: v19.6.0, v18.15.0
<number> | <bigint>
Type of file system.
Class: fs.WriteStream
#
Added in: v0.1.93
Extends <stream.Writable>
Instances of <fs.WriteStream> are created and returned using the fs.createWriteStream() function.
Event: 'close'
#
Added in: v0.1.93
Emitted when the <fs.WriteStream>'s underlying file descriptor has been closed.
Event: 'open'
#
Added in: v0.1.93
fd <integer> Integer file descriptor used by the <fs.WriteStream>.
Emitted when the <fs.WriteStream>'s file is opened.
Event: 'ready'
#
Added in: v9.11.0
Emitted when the <fs.WriteStream> is ready to be used.
Fires immediately after 'open'.
writeStream.bytesWritten
#
Added in: v0.4.7
The number of bytes written so far. Does not include data that is still queued for writing.
writeStream.close([callback])
#
Added in: v0.9.4
callback <Function>
err <Error>
Closes writeStream. Optionally accepts a callback that will be executed once the writeStream is closed.
writeStream.path
#
Added in: v0.1.93
The path to the file the stream is writing to as specified in the first argument to fs.createWriteStream(). If path is passed as a string, then writeStream.path will be a string. If path is passed as a <Buffer>, then writeStream.path will be a <Buffer>.
writeStream.pending
#
Added in: v11.2.0
<boolean>
This property is true if the underlying file has not been opened yet, i.e. before the 'ready' event is emitted.
fs.constants
#
<Object>
Returns an object containing commonly used constants for file system operations.
FS constants
#
The following constants are exported by fs.constants and fsPromises.constants.
Not every constant will be available on every operating system; this is especially important for Windows, where many of the POSIX specific definitions are not available. For portable applications it is recommended to check for their presence before use.
To use more than one constant, use the bitwise OR | operator.
Example:
import { open, constants } from 'node:fs';

const {
  O_RDWR,
  O_CREAT,
  O_EXCL,
} = constants;

open('/path/to/my/file', O_RDWR | O_CREAT | O_EXCL, (err, fd) => {
  // ...
});
copy
File access constants
#
The following constants are meant for use as the mode parameter passed to fsPromises.access(), fs.access(), and fs.accessSync().
Constant
Description
F_OK
Flag indicating that the file is visible to the calling process. This is useful for determining if a file exists, but says nothing about rwx permissions. Default if no mode is specified.
R_OK
Flag indicating that the file can be read by the calling process.
W_OK
Flag indicating that the file can be written by the calling process.
X_OK
Flag indicating that the file can be executed by the calling process. This has no effect on Windows (will behave like fs.constants.F_OK).

The definitions are also available on Windows.
File copy constants
#
The following constants are meant for use with fs.copyFile().
Constant
Description
COPYFILE_EXCL
If present, the copy operation will fail with an error if the destination path already exists.
COPYFILE_FICLONE
If present, the copy operation will attempt to create a copy-on-write reflink. If the underlying platform does not support copy-on-write, then a fallback copy mechanism is used.
COPYFILE_FICLONE_FORCE
If present, the copy operation will attempt to create a copy-on-write reflink. If the underlying platform does not support copy-on-write, then the operation will fail with an error.

The definitions are also available on Windows.
File open constants
#
The following constants are meant for use with fs.open().
Constant
Description
O_RDONLY
Flag indicating to open a file for read-only access.
O_WRONLY
Flag indicating to open a file for write-only access.
O_RDWR
Flag indicating to open a file for read-write access.
O_CREAT
Flag indicating to create the file if it does not already exist.
O_EXCL
Flag indicating that opening a file should fail if the O_CREAT flag is set and the file already exists.
O_NOCTTY
Flag indicating that if path identifies a terminal device, opening the path shall not cause that terminal to become the controlling terminal for the process (if the process does not already have one).
O_TRUNC
Flag indicating that if the file exists and is a regular file, and the file is opened successfully for write access, its length shall be truncated to zero.
O_APPEND
Flag indicating that data will be appended to the end of the file.
O_DIRECTORY
Flag indicating that the open should fail if the path is not a directory.
O_NOATIME
Flag indicating reading accesses to the file system will no longer result in an update to the atime information associated with the file. This flag is available on Linux operating systems only.
O_NOFOLLOW
Flag indicating that the open should fail if the path is a symbolic link.
O_SYNC
Flag indicating that the file is opened for synchronized I/O with write operations waiting for file integrity.
O_DSYNC
Flag indicating that the file is opened for synchronized I/O with write operations waiting for data integrity.
O_SYMLINK
Flag indicating to open the symbolic link itself rather than the resource it is pointing to.
O_DIRECT
When set, an attempt will be made to minimize caching effects of file I/O.
O_NONBLOCK
Flag indicating to open the file in nonblocking mode when possible.
UV_FS_O_FILEMAP
When set, a memory file mapping is used to access the file. This flag is available on Windows operating systems only. On other operating systems, this flag is ignored.

On Windows, only O_APPEND, O_CREAT, O_EXCL, O_RDONLY, O_RDWR, O_TRUNC, O_WRONLY, and UV_FS_O_FILEMAP are available.
File type constants
#
The following constants are meant for use with the <fs.Stats> object's mode property for determining a file's type.
Constant
Description
S_IFMT
Bit mask used to extract the file type code.
S_IFREG
File type constant for a regular file.
S_IFDIR
File type constant for a directory.
S_IFCHR
File type constant for a character-oriented device file.
S_IFBLK
File type constant for a block-oriented device file.
S_IFIFO
File type constant for a FIFO/pipe.
S_IFLNK
File type constant for a symbolic link.
S_IFSOCK
File type constant for a socket.

On Windows, only S_IFCHR, S_IFDIR, S_IFLNK, S_IFMT, and S_IFREG, are available.
File mode constants
#
The following constants are meant for use with the <fs.Stats> object's mode property for determining the access permissions for a file.
Constant
Description
S_IRWXU
File mode indicating readable, writable, and executable by owner.
S_IRUSR
File mode indicating readable by owner.
S_IWUSR
File mode indicating writable by owner.
S_IXUSR
File mode indicating executable by owner.
S_IRWXG
File mode indicating readable, writable, and executable by group.
S_IRGRP
File mode indicating readable by group.
S_IWGRP
File mode indicating writable by group.
S_IXGRP
File mode indicating executable by group.
S_IRWXO
File mode indicating readable, writable, and executable by others.
S_IROTH
File mode indicating readable by others.
S_IWOTH
File mode indicating writable by others.
S_IXOTH
File mode indicating executable by others.

On Windows, only S_IRUSR and S_IWUSR are available.
Notes
#
Ordering of callback and promise-based operations
#
Because they are executed asynchronously by the underlying thread pool, there is no guaranteed ordering when using either the callback or promise-based methods.
For example, the following is prone to error because the fs.stat() operation might complete before the fs.rename() operation:
const fs = require('node:fs');

fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('renamed complete');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
copy
It is important to correctly order the operations by awaiting the results of one before invoking the other:
const { rename, stat } = require('node:fs/promises');

(async function(oldPath, newPath) {
  try {
    await rename(oldPath, newPath);
    const stats = await stat(newPath);
    console.log(`stats: ${JSON.stringify(stats)}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello', '/tmp/world');
copy
Or, when using the callback APIs, move the fs.stat() call into the callback of the fs.rename() operation:
const { rename, stat } = require('node:fs/promises');

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
copy
File paths
#
Most fs operations accept file paths that may be specified in the form of a string, a <Buffer>, or a <URL> object using the file: protocol.
String paths
#
String paths are interpreted as UTF-8 character sequences identifying the absolute or relative filename. Relative paths will be resolved relative to the current working directory as determined by calling process.cwd().
Example using an absolute path on POSIX:
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('/open/some/file.txt', 'r');
  // Do something with the file
} finally {
  await fd?.close();
}
copy
Example using a relative path on POSIX (relative to process.cwd()):
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('file.txt', 'r');
  // Do something with the file
} finally {
  await fd?.close();
}
copy
File URL paths
#
Added in: v7.6.0
For most node:fs module functions, the path or filename argument may be passed as a <URL> object using the file: protocol.
import { readFileSync } from 'node:fs';

readFileSync(new URL('file:///tmp/hello'));
copy
file: URLs are always absolute paths.
Platform-specific considerations
#
On Windows, file: <URL>s with a host name convert to UNC paths, while file: <URL>s with drive letters convert to local absolute paths. file: <URL>s with no host name and no drive letter will result in an error:
import { readFileSync } from 'node:fs';
// On Windows :

// - WHATWG file URLs with hostname convert to UNC path
// file://hostname/p/a/t/h/file => \\hostname\p\a\t\h\file
readFileSync(new URL('file://hostname/p/a/t/h/file'));

// - WHATWG file URLs with drive letters convert to absolute path
// file:///C:/tmp/hello => C:\tmp\hello
readFileSync(new URL('file:///C:/tmp/hello'));

// - WHATWG file URLs without hostname must have a drive letters
readFileSync(new URL('file:///notdriveletter/p/a/t/h/file'));
readFileSync(new URL('file:///c/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must be absolute
copy
file: <URL>s with drive letters must use : as a separator just after the drive letter. Using another separator will result in an error.
On all other platforms, file: <URL>s with a host name are unsupported and will result in an error:
import { readFileSync } from 'node:fs';
// On other platforms:

// - WHATWG file URLs with hostname are unsupported
// file://hostname/p/a/t/h/file => throw!
readFileSync(new URL('file://hostname/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: must be absolute

// - WHATWG file URLs convert to absolute path
// file:///tmp/hello => /tmp/hello
readFileSync(new URL('file:///tmp/hello'));
copy
A file: <URL> having encoded slash characters will result in an error on all platforms:
import { readFileSync } from 'node:fs';

// On Windows
readFileSync(new URL('file:///C:/p/a/t/h/%2F'));
readFileSync(new URL('file:///C:/p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */

// On POSIX
readFileSync(new URL('file:///p/a/t/h/%2F'));
readFileSync(new URL('file:///p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
/ characters */
copy
On Windows, file: <URL>s having encoded backslash will result in an error:
import { readFileSync } from 'node:fs';

// On Windows
readFileSync(new URL('file:///C:/path/%5C'));
readFileSync(new URL('file:///C:/path/%5c'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */
copy
Buffer paths
#
Paths specified using a <Buffer> are useful primarily on certain POSIX operating systems that treat file paths as opaque byte sequences. On such systems, it is possible for a single file path to contain sub-sequences that use multiple character encodings. As with string paths, <Buffer> paths may be relative or absolute:
Example using an absolute path on POSIX:
import { open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

let fd;
try {
  fd = await open(Buffer.from('/open/some/file.txt'), 'r');
  // Do something with the file
} finally {
  await fd?.close();
}
copy
Per-drive working directories on Windows
#
On Windows, Node.js follows the concept of per-drive working directory. This behavior can be observed when using a drive path without a backslash. For example fs.readdirSync('C:\\') can potentially return a different result than fs.readdirSync('C:'). For more information, see this MSDN page.
File descriptors
#
On POSIX systems, for every process, the kernel maintains a table of currently open files and resources. Each open file is assigned a simple numeric identifier called a file descriptor. At the system-level, all file system operations use these file descriptors to identify and track each specific file. Windows systems use a different but conceptually similar mechanism for tracking resources. To simplify things for users, Node.js abstracts away the differences between operating systems and assigns all open files a numeric file descriptor.
The callback-based fs.open(), and synchronous fs.openSync() methods open a file and allocate a new file descriptor. Once allocated, the file descriptor may be used to read data from, write data to, or request information about the file.
Operating systems limit the number of file descriptors that may be open at any given time so it is critical to close the descriptor when operations are completed. Failure to do so will result in a memory leak that will eventually cause an application to crash.
import { open, close, fstat } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  try {
    fstat(fd, (err, stat) => {
      if (err) {
        closeFd(fd);
        throw err;
      }

      // use stat

      closeFd(fd);
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
copy
The promise-based APIs use a <FileHandle> object in place of the numeric file descriptor. These objects are better managed by the system to ensure that resources are not leaked. However, it is still required that they are closed when operations are completed:
import { open } from 'node:fs/promises';

let file;
try {
  file = await open('/open/some/file.txt', 'r');
  const stat = await file.stat();
  // use stat
} finally {
  await file.close();
}
copy
Threadpool usage
#
All callback and promise-based file system APIs (with the exception of fs.FSWatcher()) use libuv's threadpool. This can have surprising and negative performance implications for some applications. See the UV_THREADPOOL_SIZE documentation for more information.
File system flags
#
The following flags are available wherever the flag option takes a string.
'a': Open file for appending. The file is created if it does not exist.
'ax': Like 'a' but fails if the path exists.
'a+': Open file for reading and appending. The file is created if it does not exist.
'ax+': Like 'a+' but fails if the path exists.
'as': Open file for appending in synchronous mode. The file is created if it does not exist.
'as+': Open file for reading and appending in synchronous mode. The file is created if it does not exist.
'r': Open file for reading. An exception occurs if the file does not exist.
'rs': Open file for reading in synchronous mode. An exception occurs if the file does not exist.
'r+': Open file for reading and writing. An exception occurs if the file does not exist.
'rs+': Open file for reading and writing in synchronous mode. Instructs the operating system to bypass the local file system cache.
This is primarily useful for opening files on NFS mounts as it allows skipping the potentially stale local cache. It has a very real impact on I/O performance so using this flag is not recommended unless it is needed.
This doesn't turn fs.open() or fsPromises.open() into a synchronous blocking call. If synchronous operation is desired, something like fs.openSync() should be used.
'w': Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
'wx': Like 'w' but fails if the path exists.
'w+': Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
'wx+': Like 'w+' but fails if the path exists.
flag can also be a number as documented by open(2); commonly used constants are available from fs.constants. On Windows, flags are translated to their equivalent ones where applicable, e.g. O_WRONLY to FILE_GENERIC_WRITE, or O_EXCL|O_CREAT to CREATE_NEW, as accepted by CreateFileW.
The exclusive flag 'x' (O_EXCL flag in open(2)) causes the operation to return an error if the path already exists. On POSIX, if the path is a symbolic link, using O_EXCL returns an error even if the link is to a path that does not exist. The exclusive flag might not work with network file systems.
On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
Modifying a file rather than replacing it may require the flag option to be set to 'r+' rather than the default 'w'.
The behavior of some flags are platform-specific. As such, opening a directory on macOS and Linux with the 'a+' flag, as in the example below, will return an error. In contrast, on Windows and FreeBSD, a file descriptor or a FileHandle will be returned.
// macOS and Linux
fs.open('<directory>', 'a+', (err, fd) => {
  // => [Error: EISDIR: illegal operation on a directory, open <directory>]
});

// Windows and FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
  // => null, <fd>
});
copy
On Windows, opening an existing hidden file using the 'w' flag (either through fs.open(), fs.writeFile(), or fsPromises.open()) will fail with EPERM. Existing hidden files can be opened for writing with the 'r+' flag.
A call to fs.ftruncate() or filehandle.truncate() can be used to reset the file contents.


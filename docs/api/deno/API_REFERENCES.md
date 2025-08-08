# Deno API Reference

> **Note:** This document covers the Deno runtime APIs available as of January 2025. For the most up-to-date information, please refer to the [official Deno documentation](https://docs.deno.com/).

## Table of Contents

- [Deno Namespace](#deno-namespace)
- [Classes](#classes)
- [Enums](#enums)
- [Functions](#functions)
- [Interfaces](#interfaces)
- [Type Aliases](#type-aliases)
- [Variables](#variables)
- [Web APIs](#web-apis)
- [Node.js Compatibility](#nodejs-compatibility)

## Deno Namespace

The global namespace where Deno specific, non-standard APIs are located.

```typescript
namespace Deno
```

## Classes

### Deno.AtomicOperation

An operation on a `Deno.Kv` that can be performed atomically. Atomic operations do not auto-commit, and must be committed explicitly by calling the `commit` method.

**Methods:**
- `check()` - Add a check to the operation
- `commit()` - Commit the atomic operation
- `delete()` - Delete a key-value pair
- `enqueue()` - Enqueue a message
- `max()` - Set a value to the maximum of current and new
- `min()` - Set a value to the minimum of current and new
- `mutate()` - Mutate a value using a function
- `set()` - Set a key-value pair
- `sum()` - Add to a numeric value

### Deno.ChildProcess

The interface for handling a child process returned from `Deno.Command.spawn`.

**Methods:**
- `kill()` - Kill the child process
- `output()` - Get the output of the process
- `pid` - Process ID
- `ref()` - Prevent the event loop from exiting
- `status` - Process status
- `stderr` - Standard error stream
- `stdin` - Standard input stream
- `stdout` - Standard output stream
- `unref()` - Allow the event loop to exit

### Deno.Command

Create and manage child processes.

**Methods:**
- `output()` - Execute and collect output
- `outputSync()` - Synchronously execute and collect output
- `spawn()` - Spawn the process

**Example:**
```typescript
const command = new Deno.Command("echo", {
  args: ["Hello", "World"],
});
const { code, stdout } = await command.output();
```

### Deno.FsFile

The Deno abstraction for reading and writing files.

**Methods:**
- `close()` - Close the file
- `isTerminal()` - Check if file is a terminal
- `lock()` - Lock the file
- `read()` - Read from the file
- `readable` - Readable stream
- `seek()` - Seek to position
- `stat()` - Get file information
- `sync()` - Sync file to disk
- `truncate()` - Truncate the file
- `unlock()` - Unlock the file
- `utime()` - Update file times
- `writable` - Writable stream
- `write()` - Write to the file

### Deno.HttpClient

A custom HttpClient for use with the `fetch` function. This allows custom certificates or proxies to be used.

**Methods:**
- `close()` - Close the HTTP client

### Deno.Kv

A key-value database that can be used to store and retrieve data.

**Methods:**
- `atomic()` - Create an atomic operation
- `close()` - Close the database connection
- `delete()` - Delete a key-value pair
- `get()` - Get a value by key
- `getMany()` - Get multiple values
- `list()` - List key-value pairs
- `set()` - Set a key-value pair
- `watch()` - Watch for changes

**Example:**
```typescript
const kv = await Deno.openKv();
await kv.set(["users", "alice"], { name: "Alice", age: 30 });
const result = await kv.get(["users", "alice"]);
```

### Deno.Permissions

Deno's permission management API.

**Methods:**
- `query()` - Query permission status
- `request()` - Request permission
- `revoke()` - Revoke permission

**Example:**
```typescript
const status = await Deno.permissions.query({ name: "read", path: "/etc" });
if (status.state === "granted") {
  // Permission granted
}
```

## Enums

### Deno.SeekMode

Defines the seek mode for IO related APIs that support seeking.

- `Start` - Seek from the start
- `Current` - Seek from current position  
- `End` - Seek from the end

## Functions

### File System Operations

#### Deno.readFile(path, options?)

Reads and resolves to the entire contents of a file as an array of bytes.

```typescript
const data = await Deno.readFile("./file.txt");
const text = new TextDecoder().decode(data);
```

#### Deno.writeFile(path, data, options?)

Write data to the given path, creating a new file if needed.

```typescript
const data = new TextEncoder().encode("Hello World");
await Deno.writeFile("./hello.txt", data);
```

#### Deno.mkdir(path, options?)

Creates a new directory with the specified path.

```typescript
await Deno.mkdir("./new-directory", { recursive: true });
```

#### Deno.remove(path, options?)

Removes the named file or directory.

```typescript
await Deno.remove("./file.txt");
await Deno.remove("./directory", { recursive: true });
```

### Network Operations

#### Deno.connect(options)

Connects to a hostname and port on the named transport.

```typescript
const conn = await Deno.connect({ 
  hostname: "example.com", 
  port: 80 
});
```

#### Deno.listen(options)

Listen announces on the local transport address.

```typescript
const listener = Deno.listen({ port: 8080 });
for await (const conn of listener) {
  // Handle connection
}
```

#### Deno.serve(handler, options?)

Serves HTTP requests with the given handler.

```typescript
Deno.serve((req) => {
  return new Response("Hello World!");
});
```

### Process Operations

#### Deno.exit(code?)

Exit the Deno process with optional exit code.

```typescript
Deno.exit(0); // Success
Deno.exit(1); // Error
```

#### Deno.cwd()

Return a string representing the current working directory.

```typescript
const currentDir = Deno.cwd();
console.log(`Current directory: ${currentDir}`);
```

## Interfaces

### Deno.FileInfo

Provides information about a file returned by `Deno.stat()`.

**Properties:**
- `isFile` - Whether it's a file
- `isDirectory` - Whether it's a directory
- `isSymlink` - Whether it's a symlink
- `size` - File size in bytes
- `mtime` - Modification time
- `atime` - Access time
- `birthtime` - Creation time
- `mode` - File permissions
- `uid` - User ID
- `gid` - Group ID

### Deno.ConnectOptions

Options for `Deno.connect()`.

**Properties:**
- `hostname` - Hostname to connect to
- `port` - Port number
- `transport?` - Transport protocol ("tcp" | "udp")

### Deno.ServeOptions

Options for `Deno.serve()`.

**Properties:**
- `port?` - Port to listen on
- `hostname?` - Hostname to bind to
- `signal?` - AbortSignal to stop the server
- `onListen?` - Callback when server starts
- `onError?` - Error handler

## Variables

### Deno.args

Returns the script arguments to the program.

```typescript
console.log(Deno.args); // Command line arguments
```

### Deno.env

An interface containing methods to interact with environment variables.

```typescript
const path = Deno.env.get("PATH");
Deno.env.set("MY_VAR", "value");
```

### Deno.pid

The current process ID.

```typescript
console.log(`Process ID: ${Deno.pid}`);
```

### Deno.version

Version information for the Deno runtime.

```typescript
console.log(Deno.version.deno);      // Deno version
console.log(Deno.version.v8);       // V8 version
console.log(Deno.version.typescript); // TypeScript version
```

## Web APIs

Deno supports many standard Web APIs including:

- **Fetch API** - `fetch()`, `Request`, `Response`, `Headers`
- **Streams API** - `ReadableStream`, `WritableStream`, `TransformStream`
- **Web Crypto API** - `crypto.subtle`, `CryptoKey`
- **URL API** - `URL`, `URLSearchParams`
- **Console API** - `console.log()`, `console.error()`, etc.
- **Timers** - `setTimeout()`, `setInterval()`, `clearTimeout()`, `clearInterval()`

## Node.js Compatibility

Deno provides Node.js compatibility through the `node:` specifier:

```typescript
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { Buffer } from "node:buffer";
```

### Supported Node.js APIs

- `node:assert` - Assertion functions
- `node:buffer` - Buffer class
- `node:crypto` - Cryptographic functionality
- `node:events` - Event emitter
- `node:fs` - File system operations
- `node:http` - HTTP server and client
- `node:path` - Path utilities
- `node:process` - Process information
- `node:stream` - Stream interface
- `node:url` - URL utilities
- `node:util` - Utility functions

## Best Practices

### Error Handling

```typescript
try {
  const data = await Deno.readFile("./file.txt");
  // Process data
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.log("File not found");
  } else {
    console.error("Error reading file:", error);
  }
}
```

### Permissions

Always request the minimum permissions needed:

```typescript
// Request specific read permission
const status = await Deno.permissions.request({ 
  name: "read", 
  path: "./data" 
});

if (status.state === "granted") {
  // Proceed with file operations
}
```

### Resource Management

Use `using` declarations for automatic resource cleanup:

```typescript
using file = await Deno.open("./file.txt");
// File will be automatically closed when going out of scope
```

## Security Model

Deno is secure by default and requires explicit permissions for:

- **File system access** (`--allow-read`, `--allow-write`)
- **Network access** (`--allow-net`)
- **Environment variables** (`--allow-env`)
- **System information** (`--allow-sys`)
- **Running subprocesses** (`--allow-run`)
- **Foreign function interface** (`--allow-ffi`)

## Additional Resources

- [Official Deno Documentation](https://docs.deno.com/)
- [Deno Standard Library](https://jsr.io/@std)
- [Deno Deploy](https://deno.com/deploy)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Copyright © 2025 the Deno authors. This documentation is licensed under the MIT License.*

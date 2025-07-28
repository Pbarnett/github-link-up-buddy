Deno
Deno
namespace Deno
The global namespace where Deno specific, non-standard APIs are located.
Classes
Deno.AtomicOperation
An operation on a Deno.Kv that can be performed atomically. Atomic operations do not auto-commit, and must be committed explicitly by calling the commit method.
check
commit
delete
enqueue
max
min
mutate
set
sum
Deno.ChildProcess
The interface for handling a child process returned from Deno.Command.spawn.
kill
output
pid
ref
status
stderr
stdin
stdout
unref
Deno.Command
Create a child process.
output
outputSync
spawn
Deno.FsFile
The Deno abstraction for reading and writing files.
close
isTerminal
lock
lockSync
read
readSync
readable
seek
seekSync
setRaw
stat
statSync
sync
syncData
syncDataSync
syncSync
truncate
truncateSync
unlock
unlockSync
utime
utimeSync
writable
write
writeSync
Deno.HttpClient
A custom HttpClient for use with fetch function. This is designed to allow custom certificates or proxies to be used with fetch().
close
Deno.Kv
A key-value database that can be used to store and retrieve data.
atomic
close
commitVersionstamp
delete
enqueue
get
getMany
list
listenQueue
set
watch
Deno.KvListIterator
An iterator over a range of data entries in a Deno.Kv.
cursor
next
Deno.KvU64
Wrapper type for 64-bit unsigned integers for use as values in a Deno.Kv.
value
Deno.Permissions
Deno's permission management API.
query
querySync
request
requestSync
revoke
revokeSync
Deno.PermissionStatus
An EventTarget returned from the Deno.permissions API which can provide updates to any state changes of the permission.
addEventListener
onchange
partial
removeEventListener
state
Deno.QuicEndpoint
No documentation available
addr
close
listen
Deno.UnsafeCallback
An unsafe function pointer for passing JavaScript functions as C function pointers to foreign function calls.
callback
close
definition
pointer
ref
threadSafe
unref
Deno.UnsafeFnPointer
An unsafe pointer to a function, for calling functions that are not present as symbols.
call
definition
pointer
Deno.UnsafePointer
A collection of static functions for interacting with pointer objects.
create
equals
of
offset
value
Deno.UnsafePointerView
An unsafe pointer view to a memory location as specified by the pointer value. The UnsafePointerView API follows the standard built in interface DataView for accessing the underlying types at an memory location (numbers, strings and raw bytes).
copyInto
getArrayBuffer
getBigInt64
getBigUint64
getBool
getCString
getFloat32
getFloat64
getInt16
getInt32
getInt8
getPointer
getUint16
getUint32
getUint8
pointer
Deno.UnsafeWindowSurface
Creates a presentable WebGPU surface from given window and display handles.
getContext
present
resize
Enums
Deno.SeekMode
A enum which defines the seek mode for IO related APIs that support seeking.
Functions
Deno.addSignalListener
Registers the given function as a listener of the given signal event.
Deno.bench
Register a benchmark test which will be run when deno bench is used on the command line and the containing module looks like a bench module.
Deno.chdir
Change the current working directory to the specified path.
Deno.chmod
Changes the permission of a specific file/directory of specified path. Ignores the process's umask.
Deno.chmodSync
Synchronously changes the permission of a specific file/directory of specified path. Ignores the process's umask.
Deno.chown
Change owner of a regular file or directory.
Deno.chownSync
Synchronously change owner of a regular file or directory.
Deno.connect
Connects to the hostname (default is "127.0.0.1") and port on the named transport (default is "tcp"), and resolves to the connection (Conn).
Deno.connectQuic
Establishes a secure connection over QUIC using a hostname and port. The cert file is optional and if not included Mozilla's root certificates will be used. See also https://github.com/ctz/webpki-roots for specifics.
Deno.connectTls
Establishes a secure connection over TLS (transport layer security) using an optional list of CA certs, hostname (default is "127.0.0.1") and port.
Deno.consoleSize
Gets the size of the console as columns/rows.
Deno.copyFile
Copies the contents and permissions of one file to another specified path, by default creating a new file if needed, else overwriting. Fails if target path is a directory or is unwritable.
Deno.copyFileSync
Synchronously copies the contents and permissions of one file to another specified path, by default creating a new file if needed, else overwriting. Fails if target path is a directory or is unwritable.
Deno.create
Creates a file if none exists or truncates an existing file and resolves to an instance of Deno.FsFile.
Deno.createHttpClient
Create a custom HttpClient to use with fetch. This is an extension of the web platform Fetch API which allows Deno to use custom TLS CA certificates and connect via a proxy while using fetch().
Deno.createSync
Creates a file if none exists or truncates an existing file and returns an instance of Deno.FsFile.
Deno.cron
Create a cron job that will periodically execute the provided handler callback based on the specified schedule.
Deno.cwd
Return a string representing the current working directory.
Deno.dlopen
Opens an external dynamic library and registers symbols, making foreign functions available to be called.
Deno.execPath
Returns the path to the current deno executable.
Deno.exit
Exit the Deno process with optional exit code.
Deno.gid
Returns the group id of the process on POSIX platforms. Returns null on windows.
Deno.hostname
Get the hostname of the machine the Deno process is running on.
Deno.inspect
Converts the input into a string that has the same format as printed by console.log().
Deno.kill
Send a signal to process under given pid. The value and meaning of the signal to the process is operating system and process dependant. Signal provides the most common signals. Default signal is "SIGTERM".
Deno.link
Creates newpath as a hard link to oldpath.
Deno.linkSync
Synchronously creates newpath as a hard link to oldpath.
Deno.listen
Listen announces on the local transport address.
Deno.listenDatagram
Listen announces on the local transport address.
Deno.listenTls
Listen announces on the local transport address over TLS (transport layer security).
Deno.loadavg
Returns an array containing the 1, 5, and 15 minute load averages. The load average is a measure of CPU and IO utilization of the last one, five, and 15 minute periods expressed as a fractional number. Zero means there is no load. On Windows, the three values are always the same and represent the current load, not the 1, 5 and 15 minute load averages.
Deno.lstat
Resolves to a Deno.FileInfo for the specified path. If path is a symlink, information for the symlink will be returned instead of what it points to.
Deno.lstatSync
Synchronously returns a Deno.FileInfo for the specified path. If path is a symlink, information for the symlink will be returned instead of what it points to.
Deno.makeTempDir
Creates a new temporary directory in the default directory for temporary files, unless dir is specified. Other optional options include prefixing and suffixing the directory name with prefix and suffix respectively.
Deno.makeTempDirSync
Synchronously creates a new temporary directory in the default directory for temporary files, unless dir is specified. Other optional options include prefixing and suffixing the directory name with prefix and suffix respectively.
Deno.makeTempFile
Creates a new temporary file in the default directory for temporary files, unless dir is specified.
Deno.makeTempFileSync
Synchronously creates a new temporary file in the default directory for temporary files, unless dir is specified.
Deno.memoryUsage
Returns an object describing the memory usage of the Deno process and the V8 subsystem measured in bytes.
Deno.mkdir
Creates a new directory with the specified path.
Deno.mkdirSync
Synchronously creates a new directory with the specified path.
Deno.networkInterfaces
Returns an array of the network interface information.
Deno.open
Open a file and resolve to an instance of Deno.FsFile. The file does not need to previously exist if using the create or createNew open options. The caller may have the resulting file automatically closed by the runtime once it's out of scope by declaring the file variable with the using keyword.
Deno.openKv
Open a new Deno.Kv connection to persist data.
Deno.openSync
Synchronously open a file and return an instance of Deno.FsFile. The file does not need to previously exist if using the create or createNew open options. The caller may have the resulting file automatically closed by the runtime once it's out of scope by declaring the file variable with the using keyword.
Deno.osRelease
Returns the release version of the Operating System.
Deno.osUptime
Returns the Operating System uptime in number of seconds.
Deno.readDir
Reads the directory given by path and returns an async iterable of Deno.DirEntry. The order of entries is not guaranteed.
Deno.readDirSync
Synchronously reads the directory given by path and returns an iterable of Deno.DirEntry. The order of entries is not guaranteed.
Deno.readFile
Reads and resolves to the entire contents of a file as an array of bytes. TextDecoder can be used to transform the bytes to string if required. Rejects with an error when reading a directory.
Deno.readFileSync
Synchronously reads and returns the entire contents of a file as an array of bytes. TextDecoder can be used to transform the bytes to string if required. Throws an error when reading a directory.
Deno.readLink
Resolves to the full path destination of the named symbolic link.
Deno.readLinkSync
Synchronously returns the full path destination of the named symbolic link.
Deno.readTextFile
Asynchronously reads and returns the entire contents of a file as an UTF-8 decoded string. Reading a directory throws an error.
Deno.readTextFileSync
Synchronously reads and returns the entire contents of a file as an UTF-8 decoded string. Reading a directory throws an error.
Deno.realPath
Resolves to the absolute normalized path, with symbolic links resolved.
Deno.realPathSync
Synchronously returns absolute normalized path, with symbolic links resolved.
Deno.refTimer
Make the timer of the given id block the event loop from finishing.
Deno.remove
Removes the named file or directory.
Deno.removeSignalListener
Removes the given signal listener that has been registered with Deno.addSignalListener.
Deno.removeSync
Synchronously removes the named file or directory.
Deno.rename
Renames (moves) oldpath to newpath. Paths may be files or directories. If newpath already exists and is not a directory, rename() replaces it. OS-specific restrictions may apply when oldpath and newpath are in different directories.
Deno.renameSync
Synchronously renames (moves) oldpath to newpath. Paths may be files or directories. If newpath already exists and is not a directory, renameSync() replaces it. OS-specific restrictions may apply when oldpath and newpath are in different directories.
Deno.resolveDns
Performs DNS resolution against the given query, returning resolved records.
Deno.serve
Serves HTTP requests with the given handler.
Deno.startTls
Start TLS handshake from an existing connection using an optional list of CA certificates, and hostname (default is "127.0.0.1"). Specifying CA certs is optional. By default the configured root certificates are used. Using this function requires that the other end of the connection is prepared for a TLS handshake.
Deno.stat
Resolves to a Deno.FileInfo for the specified path. Will always follow symlinks.
Deno.statSync
Synchronously returns a Deno.FileInfo for the specified path. Will always follow symlinks.
Deno.symlink
Creates newpath as a symbolic link to oldpath.
Deno.symlinkSync
Creates newpath as a symbolic link to oldpath.
Deno.systemMemoryInfo
Displays the total amount of free and used physical and swap memory in the system, as well as the buffers and caches used by the kernel.
Deno.truncate
Truncates (or extends) the specified file, to reach the specified len. If len is not specified then the entire file contents are truncated.
Deno.truncateSync
Synchronously truncates (or extends) the specified file, to reach the specified len. If len is not specified then the entire file contents are truncated.
Deno.uid
Returns the user id of the process on POSIX platforms. Returns null on Windows.
Deno.umask
Retrieve the process umask. If mask is provided, sets the process umask. This call always returns what the umask was before the call.
Deno.unrefTimer
Make the timer of the given id not block the event loop from finishing.
Deno.upgradeWebSocket
Upgrade an incoming HTTP request to a WebSocket.
Deno.upgradeWebTransport
Upgrade a QUIC connection into a WebTransport instance.
Deno.utime
Changes the access (atime) and modification (mtime) times of a file system object referenced by path. Given times are either in seconds (UNIX epoch time) or as Date objects.
Deno.utimeSync
Synchronously changes the access (atime) and modification (mtime) times of a file system object referenced by path. Given times are either in seconds (UNIX epoch time) or as Date objects.
Deno.watchFs
Watch for file system events against one or more paths, which can be files or directories. These paths must exist already. One user action (e.g. touch test.file) can generate multiple file system events. Likewise, one user action can result in multiple file paths in one event (e.g. mv old_name.txt new_name.txt).
Deno.writeFile
Write data to the given path, by default creating a new file if needed, else overwriting.
Deno.writeFileSync
Synchronously write data to the given path, by default creating a new file if needed, else overwriting.
Deno.writeTextFile
Write string data to the given path, by default creating a new file if needed, else overwriting.
Deno.writeTextFileSync
Synchronously write string data to the given path, by default creating a new file if needed, else overwriting.
Interfaces
Deno.AtomicCheck
A check to perform as part of a Deno.AtomicOperation. The check will fail if the versionstamp for the key-value pair in the KV store does not match the given versionstamp. A check with a null versionstamp checks that the key-value pair does not currently exist in the KV store.
key
versionstamp
Deno.BasicAuth
Basic authentication credentials to be used with a Deno.Proxy server when specifying Deno.CreateHttpClientOptions.
password
username
Deno.BenchContext
Context that is passed to a benchmarked function. The instance is shared between iterations of the benchmark. Its methods can be used for example to override of the measured portion of the function.
end
name
origin
start
Deno.BenchDefinition
The interface for defining a benchmark test using Deno.bench.
baseline
fn
group
ignore
n
name
only
permissions
sanitizeExit
warmup
Deno.CaaRecord
If Deno.resolveDns is called with "CAA" record type specified, it will resolve with an array of objects with this interface.
critical
tag
value
Deno.CommandOptions
Options which can be set when calling Deno.Command.
args
clearEnv
cwd
detached
env
gid
signal
stderr
stdin
stdout
uid
windowsRawArguments
Deno.CommandOutput
The interface returned from calling Deno.Command.output or Deno.Command.outputSync which represents the result of spawning the child process.
stderr
stdout
Deno.CommandStatus
No documentation available
code
signal
success
Deno.Conn
No documentation available
close
closeWrite
localAddr
read
readable
ref
remoteAddr
unref
writable
write
Deno.ConnectOptions
No documentation available
hostname
port
signal
transport
Deno.ConnectQuicOptions
No documentation available
alpnProtocols
caCerts
endpoint
hostname
port
serverName
zeroRtt
Deno.ConnectTlsOptions
No documentation available
alpnProtocols
caCerts
hostname
port
Deno.CreateHttpClientOptions
The options used when creating a Deno.HttpClient.
allowHost
caCerts
http1
http2
localAddress
poolIdleTimeout
poolMaxIdlePerHost
proxy
Deno.CronSchedule
CronSchedule is the interface used for JSON format cron schedule.
dayOfMonth
dayOfWeek
hour
minute
month
Deno.DatagramConn
A generic transport listener for message-oriented protocols.
addr
close
joinMulticastV4
joinMulticastV6
receive
send
Deno.DenoTest
No documentation available
ignore
only
Deno.DirEntry
Information about a directory entry returned from Deno.readDir and Deno.readDirSync.
isDirectory
isFile
isSymlink
name
Deno.DynamicLibrary
A dynamic library resource. Use Deno.dlopen to load a dynamic library and return this interface.
close
symbols
Deno.Env
An interface containing methods to interact with the process environment variables.
delete
get
has
set
toObject
Deno.EnvPermissionDescriptor
The permission descriptor for the allow-env and deny-env permissions, which controls access to being able to read and write to the process environment variables as well as access other information about the environment. The option variable allows scoping the permission to a specific environment variable.
name
variable
Deno.FfiPermissionDescriptor
The permission descriptor for the allow-ffi and deny-ffi permissions, which controls access to loading foreign code and interfacing with it via the Foreign Function Interface API available in Deno. The option path allows scoping the permission to a specific path on the host.
name
path
Deno.FileInfo
Provides information about a file and is returned by Deno.stat, Deno.lstat, Deno.statSync, and Deno.lstatSync or from calling stat() and statSync() on an Deno.FsFile instance.
atime
birthtime
blksize
blocks
ctime
dev
gid
ino
isBlockDevice
isCharDevice
isDirectory
isFifo
isFile
isSocket
isSymlink
mode
mtime
nlink
rdev
size
uid
Deno.ForeignFunction
The interface for a foreign function as defined by its parameter and result types.
name
nonblocking
optional
parameters
result
Deno.ForeignLibraryInterface
A foreign library interface descriptor.
Deno.ForeignStatic
No documentation available
name
optional
type
Deno.FsEvent
Represents a unique file system event yielded by a Deno.FsWatcher.
flag
kind
paths
Deno.FsWatcher
Returned by Deno.watchFs. It is an async iterator yielding up system events. To stop watching the file system by calling .close() method.
close
return
Deno.HttpServer
An instance of the server created using Deno.serve() API.
addr
finished
ref
shutdown
unref
Deno.ImportPermissionDescriptor
The permission descriptor for the allow-import and deny-import permissions, which controls access to importing from remote hosts via the network. The option host allows scoping the permission for outbound connection to a specific host and port.
host
name
Deno.InspectOptions
Option which can be specified when performing Deno.inspect.
breakLength
colors
compact
depth
escapeSequences
getters
iterableLimit
showHidden
showProxy
sorted
strAbbreviateSize
trailingComma
Deno.KvCommitError
No documentation available
ok
Deno.KvCommitResult
No documentation available
ok
versionstamp
Deno.KvEntry
A versioned pair of key and value in a Deno.Kv.
key
value
versionstamp
Deno.KvListOptions
Options for listing key-value pairs in a Deno.Kv.
batchSize
consistency
cursor
limit
reverse
Deno.Listener
A generic network listener for stream-oriented protocols.
accept
addr
close
ref
unref
Deno.ListenOptions
No documentation available
hostname
port
Deno.ListenTlsOptions
No documentation available
alpnProtocols
transport
Deno.MakeTempOptions
Options which can be set when using Deno.makeTempDir, Deno.makeTempDirSync, Deno.makeTempFile, and Deno.makeTempFileSync.
dir
prefix
suffix
Deno.MemoryUsage
No documentation available
external
heapTotal
heapUsed
rss
Deno.MkdirOptions
Options which can be set when using Deno.mkdir and Deno.mkdirSync.
mode
recursive
Deno.MulticastV4Membership
Represents membership of a IPv4 multicast group.
leave
setLoopback
setTTL
Deno.MulticastV6Membership
Represents membership of a IPv6 multicast group.
leave
setLoopback
Deno.MxRecord
If Deno.resolveDns is called with "MX" record type specified, it will return an array of objects with this interface.
exchange
preference
Deno.NaptrRecord
If Deno.resolveDns is called with "NAPTR" record type specified, it will return an array of objects with this interface.
flags
order
preference
regexp
replacement
services
Deno.NativeStructType
The native struct type for interfacing with foreign functions.
struct
Deno.NetAddr
No documentation available
hostname
port
transport
Deno.NetPermissionDescriptor
The permission descriptor for the allow-net and deny-net permissions, which controls access to opening network ports and connecting to remote hosts via the network. The option host allows scoping the permission for outbound connection to a specific host and port.
host
name
Deno.NetworkInterfaceInfo
The information for a network interface returned from a call to Deno.networkInterfaces.
address
cidr
family
mac
name
netmask
scopeid
Deno.OpenOptions
Options which can be set when doing Deno.open and Deno.openSync.
append
create
createNew
mode
read
truncate
write
Deno.PermissionOptionsObject
A set of options which can define the permissions within a test or worker context at a highly specific level.
env
ffi
import
net
read
run
sys
write
Deno.PermissionStatusEventMap
The interface which defines what event types are supported by PermissionStatus instances.
change
Deno.PointerObject
A non-null pointer, represented as an object at runtime. The object's prototype is null and cannot be changed. The object cannot be assigned to either and is thus entirely read-only.
brand
Deno.QuicAcceptOptions
No documentation available
alpnProtocols
zeroRtt
Deno.QuicBidirectionalStream
No documentation available
readable
writable
Deno.QuicCloseInfo
No documentation available
closeCode
reason
Deno.QuicConn
No documentation available
close
closed
createBidirectionalStream
createUnidirectionalStream
endpoint
handshake
incomingBidirectionalStreams
incomingUnidirectionalStreams
maxDatagramSize
protocol
readDatagram
remoteAddr
sendDatagram
serverName
Deno.QuicEndpointOptions
No documentation available
hostname
port
Deno.QuicIncoming
An incoming connection for which the server has not yet begun its part of the handshake.
accept
ignore
localIp
refuse
remoteAddr
remoteAddressValidated
Deno.QuicListener
Specialized listener that accepts QUIC connections.
accept
endpoint
incoming
stop
Deno.QuicListenOptions
No documentation available
alpnProtocols
cert
key
Deno.QuicReceiveStream
No documentation available
id
Deno.QuicSendStream
No documentation available
id
sendOrder
Deno.QuicSendStreamOptions
No documentation available
sendOrder
waitUntilAvailable
Deno.QuicServerTransportOptions
No documentation available
preferredAddressV4
preferredAddressV6
Deno.QuicTransportOptions
No documentation available
congestionControl
keepAliveInterval
maxConcurrentBidirectionalStreams
maxConcurrentUnidirectionalStreams
maxIdleTimeout
Deno.ReadFileOptions
Options which can be set when using Deno.readFile or Deno.readFileSync.
signal
Deno.ReadPermissionDescriptor
The permission descriptor for the allow-read and deny-read permissions, which controls access to reading resources from the local host. The option path allows scoping the permission to a specific path (and if the path is a directory any sub paths).
name
path
Deno.RemoveOptions
Options which can be set when using Deno.remove and Deno.removeSync.
recursive
Deno.ResolveDnsOptions
Options which can be set when using Deno.resolveDns.
nameServer
signal
Deno.RunPermissionDescriptor
The permission descriptor for the allow-run and deny-run permissions, which controls access to what sub-processes can be executed by Deno. The option command allows scoping the permission to a specific executable.
command
name
Deno.ServeDefaultExport
Interface that module run with deno serve subcommand must conform to.
fetch
onListen
Deno.ServeHandlerInfo
Additional information for an HTTP request and its connection.
completed
remoteAddr
Deno.ServeInit
No documentation available
handler
Deno.ServeOptions
Options which can be set when calling Deno.serve.
onError
onListen
signal
Deno.ServeTcpOptions
Options that can be passed to Deno.serve to create a server listening on a TCP port.
hostname
port
reusePort
transport
Deno.ServeUnixOptions
Options that can be passed to Deno.serve to create a server listening on a Unix domain socket.
path
transport
Deno.ServeVsockOptions
Options that can be passed to Deno.serve to create a server listening on a VSOCK socket.
cid
port
transport
Deno.SetRawOptions
No documentation available
cbreak
Deno.SoaRecord
If Deno.resolveDns is called with "SOA" record type specified, it will return an array of objects with this interface.
expire
minimum
mname
refresh
retry
rname
serial
Deno.SrvRecord
If Deno.resolveDns is called with "SRV" record type specified, it will return an array of objects with this interface.
port
priority
target
weight
Deno.StartTlsOptions
No documentation available
alpnProtocols
caCerts
hostname
Deno.SymlinkOptions
Options that can be used with symlink and symlinkSync.
type
Deno.SysPermissionDescriptor
The permission descriptor for the allow-sys and deny-sys permissions, which controls access to sensitive host system information, which malicious code might attempt to exploit. The option kind allows scoping the permission to a specific piece of information.
kind
name
Deno.SystemMemoryInfo
Information returned from a call to Deno.systemMemoryInfo.
available
buffers
cached
free
swapFree
swapTotal
total
Deno.TcpConn
No documentation available
setKeepAlive
setNoDelay
Deno.TcpListenOptions
No documentation available
reusePort
Deno.TestContext
Context that is passed to a testing function, which can be used to either gain information about the current test, or register additional test steps within the current test.
name
origin
parent
step
Deno.TestDefinition
No documentation available
fn
ignore
name
only
permissions
sanitizeExit
sanitizeOps
sanitizeResources
Deno.TestStepDefinition
No documentation available
fn
ignore
name
sanitizeExit
sanitizeOps
sanitizeResources
Deno.TlsCertifiedKeyPem
Provides certified key material from strings. The key material is provided in PEM-format (Privacy Enhanced Mail, https://www.rfc-editor.org/rfc/rfc1422) which can be identified by having -----BEGIN----- and -----END----- markers at the beginning and end of the strings. This type of key is not compatible with DER-format keys which are binary.
cert
key
keyFormat
Deno.TlsConn
No documentation available
handshake
Deno.TlsHandshakeInfo
No documentation available
alpnProtocol
Deno.UdpListenOptions
Unstable options which can be set when opening a datagram listener via Deno.listenDatagram.
loopback
reuseAddress
Deno.UnixAddr
No documentation available
path
transport
Deno.UnixConn
No documentation available
Deno.UnixConnectOptions
No documentation available
path
transport
Deno.UnixListenOptions
Options which can be set when opening a Unix listener via Deno.listen or Deno.listenDatagram.
path
Deno.UnsafeCallbackDefinition
Definition of a unsafe callback function.
parameters
result
Deno.UpgradeWebSocketOptions
Options which can be set when performing a Deno.upgradeWebSocket upgrade of a Request
idleTimeout
protocol
Deno.VsockAddr
No documentation available
cid
port
transport
Deno.VsockConn
No documentation available
Deno.VsockConnectOptions
No documentation available
cid
port
transport
Deno.VsockListenOptions
Options which can be set when opening a VSOCK listener via Deno.listen.
cid
port
Deno.WebSocketUpgrade
The object that is returned from a Deno.upgradeWebSocket request.
response
socket
Deno.WriteFileOptions
Options for writing to a file.
append
create
createNew
mode
signal
Deno.WritePermissionDescriptor
The permission descriptor for the allow-write and deny-write permissions, which controls access to writing to resources from the local host. The option path allow scoping the permission to a specific path (and if the path is a directory any sub paths).
name
path
Namespaces
Deno.errors
A set of error constructors that are raised by Deno APIs.
Deno.jupyter
A namespace containing runtime APIs available in Jupyter notebooks.
Deno.lint
No documentation available
Deno.telemetry
APIs for working with the OpenTelemetry observability framework. Deno can export traces, metrics, and logs to OpenTelemetry compatible backends via the OTLP protocol.
Deno.webgpu
The webgpu namespace provides additional APIs that the WebGPU specification does not specify.
Type Aliases
Deno.Addr
No documentation available
Deno.ConditionalAsync
No documentation available
Deno.CronScheduleExpression
CronScheduleExpression is used as the type of minute, hour, dayOfMonth, month, and dayOfWeek in CronSchedule.
Deno.FromForeignFunction
No documentation available
Deno.FromNativeParameterTypes
No documentation available
Deno.FromNativeResultType
Type conversion for foreign symbol return types.
Deno.FromNativeType
Type conversion for foreign symbol return types and unsafe callback parameters.
Deno.FsEventFlag
Additional information for FsEvent objects with the "other" kind.
Deno.KvConsistencyLevel
Consistency level of a KV operation.
Deno.KvEntryMaybe
An optional versioned pair of key and value in a Deno.Kv.
Deno.KvKey
A key to be persisted in a Deno.Kv. A key is a sequence of Deno.KvKeyParts.
Deno.KvKeyPart
A single part of a Deno.KvKey. Parts are ordered lexicographically, first by their type, and within a given type by their value.
Deno.KvListSelector
A selector that selects the range of data returned by a list operation on a Deno.Kv.
Deno.KvMutation
A mutation to a key in a Deno.Kv. A mutation is a combination of a key, a value, and a type. The type determines how the mutation is applied to the key.
Deno.NativeBigIntType
All BigInt number types for interfacing with foreign functions.
Deno.NativeBooleanType
The native boolean type for interfacing to foreign functions.
Deno.NativeBufferType
The native buffer type for interfacing to foreign functions.
Deno.NativeFunctionType
The native function type for interfacing with foreign functions.
Deno.NativeI16Enum
No documentation available
Deno.NativeI32Enum
No documentation available
Deno.NativeI8Enum
No documentation available
Deno.NativeNumberType
All plain number types for interfacing with foreign functions.
Deno.NativePointerType
The native pointer type for interfacing to foreign functions.
Deno.NativeResultType
No documentation available
Deno.NativeType
All supported types for interfacing with foreign functions.
Deno.NativeTypedFunction
No documentation available
Deno.NativeTypedPointer
No documentation available
Deno.NativeU16Enum
No documentation available
Deno.NativeU32Enum
No documentation available
Deno.NativeU8Enum
No documentation available
Deno.NativeVoidType
The native void type for interfacing with foreign functions.
Deno.PermissionDescriptor
Permission descriptors which define a permission and can be queried, requested, or revoked.
Deno.PermissionName
The name of a privileged feature which needs permission.
Deno.PermissionOptions
Options which define the permissions within a test or worker context.
Deno.PermissionState
The current status of the permission:
Deno.PointerValue
Pointers are represented either with a PointerObject object or a null if the pointer is null.
Deno.Proxy
The definition for alternative transports (or proxies) in Deno.CreateHttpClientOptions.
Deno.RecordType
The type of the resource record to resolve via DNS using Deno.resolveDns.
Deno.ServeHandler
A handler for HTTP requests. Consumes a request and returns a response.
Deno.Signal
Operating signals which can be listened for or sent to sub-processes. What signals and what their standard behaviors are OS dependent.
Deno.StaticForeignLibraryInterface
A utility type that infers a foreign library interface.
Deno.StaticForeignSymbol
A utility type that infers a foreign symbol.
Deno.StaticForeignSymbolReturnType
No documentation available
Deno.TcpListener
Specialized listener that accepts TCP connections.
Deno.TlsListener
Specialized listener that accepts TLS connections.
Deno.ToNativeParameterTypes
A utility type for conversion of parameter types of foreign functions.
Deno.ToNativeResultType
Type conversion for unsafe callback return types.
Deno.ToNativeType
Type conversion for foreign symbol parameters and unsafe callback return types.
Deno.UnixListener
Specialized listener that accepts Unix connections.
Deno.UnsafeCallbackFunction
An unsafe callback function.
Deno.VsockListener
Specialized listener that accepts VSOCK connections.
Variables
Deno.args
Returns the script arguments to the program.
Deno.brand
No documentation available
Deno.build
Information related to the build of the current Deno runtime.
arch
env
os
standalone
target
vendor
Deno.env
An interface containing methods to interact with the process environment variables.
Deno.exitCode
The exit code for the Deno process.
Deno.mainModule
The URL of the entrypoint module entered from the command-line. It requires read permission to the CWD.
Deno.noColor
Reflects the NO_COLOR environment variable at program start.
Deno.permissions
Deno's permission management API.
Deno.pid
The current process ID of this instance of the Deno CLI.
Deno.ppid
The process ID of parent process of this instance of the Deno CLI.
Deno.stderr
A reference to stderr which can be used to write directly to stderr. It implements the Deno specific Writer, WriterSync, and Closer interfaces as well as provides a WritableStream interface.
close
isTerminal
writable
write
writeSync
Deno.stdin
A reference to stdin which can be used to read directly from stdin.
close
isTerminal
read
readSync
readable
setRaw
Deno.stdout
A reference to stdout which can be used to write directly to stdout. It implements the Deno specific Writer, WriterSync, and Closer interfaces as well as provides a WritableStream interface.
close
isTerminal
writable
write
writeSync
Deno.test
Register a test which will be run when deno test is used on the command line and the containing module looks like a test module.
Deno.version
Version information related to the current Deno CLI runtime environment.
deno
typescript
v8
Web
all symbols
AbortController
A controller object that allows you to abort one or more DOM requests as and when desired.
abort
prototype
signal
AbortSignal
A signal object that allows you to communicate with a DOM request (such as a Fetch) and abort it if required via an AbortController object.
abort
aborted
addEventListener
any
onabort
prototype
reason
removeEventListener
throwIfAborted
timeout
AbortSignalEventMap
No documentation available
abort
AbstractWorkerEventMap
No documentation available
error
addEventListener
Registers an event listener in the global scope, which will be called synchronously whenever the event type is dispatched.
AddEventListenerOptions
Options for configuring an event listener via addEventListener.
once
passive
signal
AesCbcParams
No documentation available
iv
AesCtrParams
No documentation available
counter
length
AesDerivedKeyParams
No documentation available
length
AesGcmParams
No documentation available
additionalData
iv
tagLength
AesKeyAlgorithm
No documentation available
length
AesKeyGenParams
No documentation available
length
alert
Shows the given message and waits for the enter key pressed.
Algorithm
No documentation available
name
AlgorithmIdentifier
No documentation available
atob
Decodes a string of data which has been encoded using base-64 encoding.
Atomics
No documentation available
pause
BinaryType
Specifies the type of binary data being received over a WebSocket connection.
Blob
A file-like object of immutable, raw data. Blobs represent data that isn't necessarily in a JavaScript-native format. The File interface is based on Blob, inheriting blob functionality and expanding it to support files on the user's system.
arrayBuffer
bytes
prototype
size
slice
stream
text
type
BlobPart
No documentation available
BlobPropertyBag
No documentation available
endings
type
Body
No documentation available
arrayBuffer
blob
body
bodyUsed
bytes
formData
json
text
BodyInit
No documentation available
BroadcastChannel
No documentation available
addEventListener
close
name
onmessage
onmessageerror
postMessage
prototype
removeEventListener
BroadcastChannelEventMap
No documentation available
message
messageerror
btoa
Creates a base-64 ASCII encoded string from the input string.
BufferSource
No documentation available
ByteLengthQueuingStrategy
No documentation available
highWaterMark
prototype
size
Cache
No documentation available
delete
match
prototype
put
CacheQueryOptions
No documentation available
ignoreMethod
ignoreSearch
ignoreVary
caches
No documentation available
CacheStorage
No documentation available
delete
has
open
prototype
clearInterval
Cancels a timed, repeating action which was previously started by a call to setInterval()
clearTimeout
Cancels a scheduled action initiated by setTimeout()
close
Exits the current Deno process.
closed
Indicates whether the current window (context) is closed. In Deno, this property is primarily for API compatibility with browsers.
CloseEvent
The CloseEvent interface represents an event that occurs when a WebSocket connection is closed.
code
prototype
reason
wasClean
CloseEventInit
Configuration options for a WebSocket "close" event.
code
reason
wasClean
ColorSpaceConversion
Specifies whether the image should be decoded using color space conversion. Either none or default (default). The value default indicates that implementation-specific behavior is used.
CompressionFormat
No documentation available
CompressionStream
An API for compressing a stream of data.
prototype
readable
writable
confirm
Shows the given message and waits for the answer. Returns the user's answer as boolean.
Console
The Console interface provides methods for logging information to the console, as well as other utility methods for debugging and inspecting code. Methods include logging, debugging, and timing functionality.
assert
clear
count
countReset
debug
dir
error
group
groupCollapsed
groupEnd
info
log
profile
profileEnd
table
time
timeEnd
timeLog
timeStamp
trace
warn
console
A global console object that provides methods for logging, debugging, and error reporting. The console object provides access to the browser's or runtime's debugging console functionality. It allows developers to output text and data for debugging purposes.
CountQueuingStrategy
This Streams API interface provides a built-in byte length queuing strategy that can be used when constructing streams.
highWaterMark
prototype
size
createImageBitmap
Create a new ImageBitmap object from a given source.
Crypto
No documentation available
getRandomValues
prototype
randomUUID
subtle
crypto
No documentation available
CryptoKey
The CryptoKey dictionary of the Web Crypto API represents a cryptographic key.
algorithm
extractable
prototype
type
usages
CryptoKeyPair
The CryptoKeyPair dictionary of the Web Crypto API represents a key pair for an asymmetric cryptography algorithm, also known as a public-key algorithm.
privateKey
prototype
publicKey
CustomEvent
No documentation available
detail
prototype
CustomEventInit
No documentation available
detail
Date
No documentation available
toTemporalInstant
DecompressionStream
An API for decompressing a stream of data.
prototype
readable
writable
dispatchEvent
Dispatches an event in the global scope, synchronously invoking any registered event listeners for this event in the appropriate order. Returns false if event is cancelable and at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
DOMException
No documentation available
ABORT_ERR
DATA_CLONE_ERR
DOMSTRING_SIZE_ERR
HIERARCHY_REQUEST_ERR
INDEX_SIZE_ERR
INUSE_ATTRIBUTE_ERR
INVALID_ACCESS_ERR
INVALID_CHARACTER_ERR
INVALID_MODIFICATION_ERR
INVALID_NODE_TYPE_ERR
INVALID_STATE_ERR
NAMESPACE_ERR
NETWORK_ERR
NOT_FOUND_ERR
NOT_SUPPORTED_ERR
NO_DATA_ALLOWED_ERR
NO_MODIFICATION_ALLOWED_ERR
QUOTA_EXCEEDED_ERR
SECURITY_ERR
SYNTAX_ERR
TIMEOUT_ERR
TYPE_MISMATCH_ERR
URL_MISMATCH_ERR
VALIDATION_ERR
WRONG_DOCUMENT_ERR
code
message
name
prototype
DomIterable
No documentation available
entries
forEach
keys
values
DOMStringList
No documentation available
contains
item
length
EcdhKeyDeriveParams
No documentation available
public
EcdsaParams
No documentation available
hash
EcKeyAlgorithm
No documentation available
namedCurve
EcKeyGenParams
No documentation available
namedCurve
EcKeyImportParams
No documentation available
namedCurve
EndingType
No documentation available
ErrorConstructor
No documentation available
captureStackTrace
isError
stackTraceLimit
ErrorEvent
No documentation available
colno
error
filename
lineno
message
prototype
ErrorEventInit
No documentation available
colno
error
filename
lineno
message
Event
An event which takes place in the DOM.
AT_TARGET
BUBBLING_PHASE
CAPTURING_PHASE
NONE
bubbles
cancelBubble
cancelable
composed
composedPath
currentTarget
defaultPrevented
eventPhase
initEvent
isTrusted
preventDefault
prototype
returnValue
srcElement
stopImmediatePropagation
stopPropagation
target
timeStamp
type
EventInit
No documentation available
bubbles
cancelable
composed
EventListener
No documentation available
EventListenerObject
The EventListenerObject interface represents an object that can handle events dispatched by an EventTarget object.
handleEvent
EventListenerOptions
No documentation available
capture
EventListenerOrEventListenerObject
No documentation available
EventSource
No documentation available
CLOSED
CONNECTING
OPEN
addEventListener
close
onerror
onmessage
onopen
prototype
readyState
removeEventListener
url
withCredentials
EventSourceEventMap
No documentation available
error
message
open
EventSourceInit
No documentation available
withCredentials
EventTarget
EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them.
addEventListener
dispatchEvent
prototype
removeEventListener
fetch
Fetch a resource from the network. It returns a Promise that resolves to the Response to that Request, whether it is successful or not.
File
Provides information about files and allows JavaScript in a web page to access their content.
lastModified
name
prototype
webkitRelativePath
FilePropertyBag
No documentation available
lastModified
FileReader
Lets web applications asynchronously read the contents of files (or raw data buffers) stored on the user's computer, using File or Blob objects to specify the file or data to read.
DONE
EMPTY
LOADING
abort
addEventListener
error
onabort
onerror
onload
onloadend
onloadstart
onprogress
prototype
readAsArrayBuffer
readAsBinaryString
readAsDataURL
readAsText
readyState
removeEventListener
result
FileReaderEventMap
No documentation available
abort
error
load
loadend
loadstart
progress
FormData
Provides a way to easily construct a set of key/value pairs representing form fields and their values, which can then be easily sent using the XMLHttpRequest.send() method. It uses the same format a form would use if the encoding type were set to "multipart/form-data".
append
delete
get
getAll
has
prototype
set
FormDataEntryValue
No documentation available
GenericTransformStream
No documentation available
readable
writable
GPU
The entry point to WebGPU in Deno, accessed via the global navigator.gpu property.
getPreferredCanvasFormat
requestAdapter
GPUAdapter
Represents a physical GPU device that can be used to create a logical GPU device.
features
info
limits
requestDevice
GPUAdapterInfo
No documentation available
architecture
description
device
isFallbackAdapter
subgroupMaxSize
subgroupMinSize
vendor
GPUAddressMode
No documentation available
GPUAutoLayoutMode
No documentation available
GPUBindGroup
No documentation available
label
GPUBindGroupDescriptor
No documentation available
entries
layout
GPUBindGroupEntry
No documentation available
binding
resource
GPUBindGroupLayout
No documentation available
label
GPUBindGroupLayoutDescriptor
No documentation available
entries
GPUBindGroupLayoutEntry
No documentation available
binding
buffer
sampler
storageTexture
texture
visibility
GPUBindingResource
No documentation available
GPUBlendComponent
No documentation available
dstFactor
operation
srcFactor
GPUBlendFactor
No documentation available
GPUBlendOperation
No documentation available
GPUBlendState
No documentation available
alpha
color
GPUBuffer
Represents a block of memory allocated on the GPU.
destroy
getMappedRange
label
mapAsync
mapState
size
unmap
usage
GPUBufferBinding
No documentation available
buffer
offset
size
GPUBufferBindingLayout
No documentation available
hasDynamicOffset
minBindingSize
type
GPUBufferBindingType
No documentation available
GPUBufferDescriptor
No documentation available
mappedAtCreation
size
usage
GPUBufferMapState
No documentation available
GPUBufferUsage
No documentation available
COPY_DST
COPY_SRC
INDEX
INDIRECT
MAP_READ
MAP_WRITE
QUERY_RESOLVE
STORAGE
UNIFORM
VERTEX
GPUBufferUsageFlags
No documentation available
GPUCanvasAlphaMode
No documentation available
GPUCanvasConfiguration
No documentation available
alphaMode
colorSpace
device
format
usage
viewFormats
GPUCanvasContext
No documentation available
configure
getCurrentTexture
unconfigure
GPUColor
No documentation available
GPUColorDict
No documentation available
a
b
g
r
GPUColorTargetState
No documentation available
blend
format
writeMask
GPUColorWrite
No documentation available
ALL
ALPHA
BLUE
GREEN
RED
GPUColorWriteFlags
No documentation available
GPUCommandBuffer
No documentation available
label
GPUCommandBufferDescriptor
No documentation available
GPUCommandEncoder
Used to record GPU commands for later execution by the GPU.
beginComputePass
beginRenderPass
clearBuffer
copyBufferToBuffer
copyBufferToTexture
copyTextureToBuffer
copyTextureToTexture
finish
insertDebugMarker
label
popDebugGroup
pushDebugGroup
resolveQuerySet
writeTimestamp
GPUCommandEncoderDescriptor
No documentation available
GPUCompareFunction
No documentation available
GPUCompilationInfo
No documentation available
messages
GPUCompilationMessage
No documentation available
lineNum
linePos
message
type
GPUCompilationMessageType
No documentation available
GPUComputePassDescriptor
No documentation available
timestampWrites
GPUComputePassEncoder
No documentation available
dispatchWorkgroups
dispatchWorkgroupsIndirect
end
insertDebugMarker
label
popDebugGroup
pushDebugGroup
setBindGroup
setPipeline
GPUComputePassTimestampWrites
No documentation available
beginningOfPassWriteIndex
endOfPassWriteIndex
querySet
GPUComputePipeline
No documentation available
getBindGroupLayout
label
GPUComputePipelineDescriptor
No documentation available
compute
GPUCullMode
No documentation available
GPUDepthStencilState
No documentation available
depthBias
depthBiasClamp
depthBiasSlopeScale
depthCompare
depthWriteEnabled
format
stencilBack
stencilFront
stencilReadMask
stencilWriteMask
GPUDevice
The primary interface for interacting with a WebGPU device.
adapterInfo
createBindGroup
createBindGroupLayout
createBuffer
createCommandEncoder
createComputePipeline
createComputePipelineAsync
createPipelineLayout
createQuerySet
createRenderBundleEncoder
createRenderPipeline
createRenderPipelineAsync
createSampler
createShaderModule
createTexture
destroy
features
label
limits
lost
popErrorScope
pushErrorScope
queue
GPUDeviceDescriptor
No documentation available
requiredFeatures
requiredLimits
GPUDeviceLostInfo
No documentation available
message
reason
GPUDeviceLostReason
No documentation available
GPUError
No documentation available
message
GPUErrorFilter
No documentation available
GPUExtent3D
No documentation available
GPUExtent3DDict
No documentation available
depthOrArrayLayers
height
width
GPUFeatureName
No documentation available
GPUFilterMode
No documentation available
GPUFlagsConstant
No documentation available
GPUFragmentState
No documentation available
targets
GPUFrontFace
No documentation available
GPUIndexFormat
No documentation available
GPUInternalError
No documentation available
GPULoadOp
No documentation available
GPUMapMode
No documentation available
READ
WRITE
GPUMapModeFlags
No documentation available
GPUMipmapFilterMode
No documentation available
GPUMultisampleState
No documentation available
alphaToCoverageEnabled
count
mask
GPUObjectBase
No documentation available
label
GPUObjectDescriptorBase
No documentation available
label
GPUOrigin3D
No documentation available
GPUOrigin3DDict
No documentation available
x
y
z
GPUOutOfMemoryError
No documentation available
GPUPipelineBase
No documentation available
getBindGroupLayout
GPUPipelineDescriptorBase
No documentation available
layout
GPUPipelineError
No documentation available
reason
GPUPipelineErrorInit
No documentation available
reason
GPUPipelineErrorReason
No documentation available
GPUPipelineLayout
No documentation available
label
GPUPipelineLayoutDescriptor
No documentation available
bindGroupLayouts
GPUPowerPreference
No documentation available
GPUPrimitiveState
No documentation available
cullMode
frontFace
stripIndexFormat
topology
unclippedDepth
GPUPrimitiveTopology
No documentation available
GPUProgrammablePassEncoder
No documentation available
insertDebugMarker
popDebugGroup
pushDebugGroup
setBindGroup
GPUProgrammableStage
No documentation available
constants
entryPoint
module
GPUQuerySet
No documentation available
count
destroy
label
type
GPUQuerySetDescriptor
No documentation available
count
type
GPUQueryType
No documentation available
GPUQueue
Represents a queue to submit commands to the GPU.
label
onSubmittedWorkDone
submit
writeBuffer
writeTexture
GPURenderBundle
No documentation available
label
GPURenderBundleDescriptor
No documentation available
GPURenderBundleEncoder
No documentation available
draw
drawIndexed
drawIndexedIndirect
drawIndirect
finish
insertDebugMarker
label
popDebugGroup
pushDebugGroup
setBindGroup
setIndexBuffer
setPipeline
setVertexBuffer
GPURenderBundleEncoderDescriptor
No documentation available
depthReadOnly
stencilReadOnly
GPURenderEncoderBase
No documentation available
draw
drawIndexed
drawIndexedIndirect
drawIndirect
setIndexBuffer
setPipeline
setVertexBuffer
GPURenderPassColorAttachment
No documentation available
clearValue
loadOp
resolveTarget
storeOp
view
GPURenderPassDepthStencilAttachment
No documentation available
depthClearValue
depthLoadOp
depthReadOnly
depthStoreOp
stencilClearValue
stencilLoadOp
stencilReadOnly
stencilStoreOp
view
GPURenderPassDescriptor
No documentation available
colorAttachments
depthStencilAttachment
occlusionQuerySet
timestampWrites
GPURenderPassEncoder
No documentation available
beginOcclusionQuery
draw
drawIndexed
drawIndexedIndirect
drawIndirect
end
endOcclusionQuery
executeBundles
insertDebugMarker
label
popDebugGroup
pushDebugGroup
setBindGroup
setBlendConstant
setIndexBuffer
setPipeline
setScissorRect
setStencilReference
setVertexBuffer
setViewport
GPURenderPassLayout
No documentation available
colorFormats
depthStencilFormat
sampleCount
GPURenderPassTimestampWrites
No documentation available
beginningOfPassWriteIndex
endOfPassWriteIndex
querySet
GPURenderPipeline
No documentation available
getBindGroupLayout
label
GPURenderPipelineDescriptor
No documentation available
depthStencil
fragment
multisample
primitive
vertex
GPURequestAdapterOptions
No documentation available
forceFallbackAdapter
powerPreference
GPUSampler
No documentation available
label
GPUSamplerBindingLayout
No documentation available
type
GPUSamplerBindingType
No documentation available
GPUSamplerDescriptor
No documentation available
addressModeU
addressModeV
addressModeW
compare
lodMaxClamp
lodMinClamp
magFilter
maxAnisotropy
minFilter
mipmapFilter
GPUShaderModule
Represents a compiled shader module that can be used to create graphics or compute pipelines.
getCompilationInfo
label
GPUShaderModuleDescriptor
No documentation available
code
sourceMap
GPUShaderStage
No documentation available
COMPUTE
FRAGMENT
VERTEX
GPUShaderStageFlags
No documentation available
GPUStencilFaceState
No documentation available
compare
depthFailOp
failOp
passOp
GPUStencilOperation
No documentation available
GPUStorageTextureAccess
No documentation available
GPUStorageTextureBindingLayout
No documentation available
access
format
viewDimension
GPUStoreOp
No documentation available
GPUSupportedFeatures
No documentation available
entries
forEach
has
keys
size
values
GPUSupportedLimits
No documentation available
maxBindGroups
maxBindGroupsPlusVertexBuffers
maxBindingsPerBindGroup
maxBufferSize
maxColorAttachmentBytesPerSample
maxColorAttachments
maxComputeInvocationsPerWorkgroup
maxComputeWorkgroupSizeX
maxComputeWorkgroupSizeY
maxComputeWorkgroupSizeZ
maxComputeWorkgroupStorageSize
maxComputeWorkgroupsPerDimension
maxDynamicStorageBuffersPerPipelineLayout
maxDynamicUniformBuffersPerPipelineLayout
maxInterStageShaderVariables
maxSampledTexturesPerShaderStage
maxSamplersPerShaderStage
maxStorageBufferBindingSize
maxStorageBuffersPerShaderStage
maxStorageTexturesPerShaderStage
maxTextureArrayLayers
maxTextureDimension1D
maxTextureDimension2D
maxTextureDimension3D
maxUniformBufferBindingSize
maxUniformBuffersPerShaderStage
maxVertexAttributes
maxVertexBufferArrayStride
maxVertexBuffers
minStorageBufferOffsetAlignment
minUniformBufferOffsetAlignment
GPUTexelCopyBufferInfo
No documentation available
buffer
GPUTexelCopyBufferLayout
No documentation available
bytesPerRow
offset
rowsPerImage
GPUTexelCopyTextureInfo
No documentation available
aspect
mipLevel
origin
texture
GPUTexture
Represents a texture (image) in GPU memory.
createView
depthOrArrayLayers
destroy
dimension
format
height
label
mipLevelCount
sampleCount
usage
width
GPUTextureAspect
No documentation available
GPUTextureBindingLayout
No documentation available
multisampled
sampleType
viewDimension
GPUTextureDescriptor
No documentation available
dimension
format
mipLevelCount
sampleCount
size
usage
viewFormats
GPUTextureDimension
No documentation available
GPUTextureFormat
No documentation available
GPUTextureSampleType
No documentation available
GPUTextureUsage
No documentation available
COPY_DST
COPY_SRC
RENDER_ATTACHMENT
STORAGE_BINDING
TEXTURE_BINDING
GPUTextureUsageFlags
No documentation available
GPUTextureView
No documentation available
label
GPUTextureViewDescriptor
No documentation available
arrayLayerCount
aspect
baseArrayLayer
baseMipLevel
dimension
format
mipLevelCount
usage
GPUTextureViewDimension
No documentation available
GPUUncapturedErrorEvent
No documentation available
error
GPUUncapturedErrorEventInit
No documentation available
error
GPUValidationError
No documentation available
GPUVertexAttribute
No documentation available
format
offset
shaderLocation
GPUVertexBufferLayout
No documentation available
arrayStride
attributes
stepMode
GPUVertexFormat
No documentation available
GPUVertexState
No documentation available
buffers
GPUVertexStepMode
No documentation available
HashAlgorithmIdentifier
No documentation available
Headers
This Fetch API interface allows you to perform various actions on HTTP request and response headers. These actions include retrieving, setting, adding to, and removing. A Headers object has an associated header list, which is initially empty and consists of zero or more name and value pairs. You can add to this using methods like append() (see Examples). In all methods of this interface, header names are matched by case-insensitive byte sequence.
append
delete
get
getSetCookie
has
prototype
set
HeadersInit
No documentation available
HkdfParams
No documentation available
hash
info
salt
HmacImportParams
No documentation available
hash
length
HmacKeyAlgorithm
No documentation available
hash
length
HmacKeyGenParams
No documentation available
hash
length
ImageBitmap
ImageBitmap interface represents a bitmap image which can be drawn to a canvas.
close
height
prototype
width
ImageBitmapOptions
The options of createImageBitmap.
colorSpaceConversion
imageOrientation
premultiplyAlpha
resizeHeight
resizeQuality
resizeWidth
ImageBitmapSource
The ImageBitmapSource type represents an image data source that can be used to create an ImageBitmap.
ImageData
No documentation available
colorSpace
data
height
prototype
width
ImageDataSettings
No documentation available
colorSpace
ImageOrientation
Specifies how the bitmap image should be oriented.
ImportMeta
Deno provides extra properties on import.meta. These are included here to ensure that these are still available when using the Deno namespace in conjunction with other type libs, like dom.
dirname
filename
main
resolve
url
Intl
No documentation available
Intl.DateTimeFormat
No documentation available
format
formatRange
formatRangeToParts
formatToParts
Intl.DateTimeFormatOptions
No documentation available
dateStyle
dayPeriod
timeStyle
Intl.DateTimeFormatRangePart
Represents a part of a formatted date range produced by Intl.DateTimeFormat.formatRange().
source
type
value
Intl.Formattable
Types that can be formatted using Intl.DateTimeFormat methods.
JsonWebKey
No documentation available
alg
crv
d
dp
dq
e
ext
k
key_ops
kty
n
oth
p
q
qi
use
x
y
KeyAlgorithm
No documentation available
name
KeyFormat
No documentation available
KeyType
No documentation available
KeyUsage
No documentation available
localStorage
Deno's localStorage API provides a way to store key-value pairs in a web-like environment, similar to the Web Storage API found in browsers. It allows developers to persist data across sessions in a Deno application. This API is particularly useful for applications that require a simple and effective way to store data locally.
Location
The location (URL) of the object it is linked to. Changes done on it are reflected on the object it relates to. Accessible via globalThis.location.
ancestorOrigins
assign
hash
host
hostname
href
origin
pathname
port
protocol
prototype
reload
replace
search
toString
location
No documentation available
MessageChannel
The MessageChannel interface of the Channel Messaging API allows us to create a new message channel and send data through it via its two MessagePort properties.
port1
port2
prototype
MessageEvent
No documentation available
data
initMessageEvent
lastEventId
origin
ports
prototype
source
MessageEventInit
No documentation available
data
lastEventId
origin
ports
source
MessageEventSource
No documentation available
MessagePort
The MessagePort interface of the Channel Messaging API represents one of the two ports of a MessageChannel, allowing messages to be sent from one port and listening out for them arriving at the other.
addEventListener
close
onmessage
onmessageerror
postMessage
prototype
removeEventListener
start
MessagePortEventMap
No documentation available
message
messageerror
name
No documentation available
NamedCurve
No documentation available
Navigator
Provides information about the Deno runtime environment and the system on which it's running. Similar to the browser Navigator object but adapted for the Deno context.
gpu
hardwareConcurrency
language
languages
prototype
userAgent
navigator
Provides access to the Deno runtime's Navigator interface, which contains information about the environment in which the script is running.
onbeforeunload
Before unload event handler for the window. In Deno, this is primarily for API compatibility with browsers.
onerror
Error event handler for the window. Triggered when an uncaught error occurs in the global scope.
onload
Load event handler for the window. In Deno, this is primarily for API compatibility with browsers.
onunhandledrejection
Event handler for unhandled promise rejections. Triggered when a Promise is rejected and no rejection handler is attached to it.
onunload
Unload event handler for the window. In Deno, this is primarily for API compatibility with browsers.
Pbkdf2Params
No documentation available
hash
iterations
salt
Performance
Deno supports User Timing Level 3 which is not widely supported yet in other runtimes.
clearMarks
clearMeasures
getEntries
getEntriesByName
getEntriesByType
mark
measure
now
prototype
timeOrigin
toJSON
performance
No documentation available
PerformanceEntry
Encapsulates a single performance metric that is part of the performance timeline. A performance entry can be directly created by making a performance mark or measure (for example by calling the .mark() method) at an explicit point in an application.
duration
entryType
name
prototype
startTime
toJSON
PerformanceEntryList
No documentation available
PerformanceMark
PerformanceMark is an abstract interface for PerformanceEntry objects with an entryType of "mark". Entries of this type are created by calling performance.mark() to add a named DOMHighResTimeStamp (the mark) to the performance timeline.
detail
entryType
prototype
PerformanceMarkOptions
Options which are used in conjunction with performance.mark. Check out the MDN performance.mark() documentation for more details.
detail
startTime
PerformanceMeasure
PerformanceMeasure is an abstract interface for PerformanceEntry objects with an entryType of "measure". Entries of this type are created by calling performance.measure() to add a named DOMHighResTimeStamp (the measure) between two marks to the performance timeline.
detail
entryType
prototype
PerformanceMeasureOptions
Options which are used in conjunction with performance.measure. Check out the MDN performance.mark() documentation for more details.
detail
duration
end
start
PredefinedColorSpace
No documentation available
PremultiplyAlpha
Specifies whether the bitmap's color channels should be premultiplied by the alpha channel.
ProgressEvent
Events measuring progress of an underlying process, like an HTTP request (for an XMLHttpRequest, or the loading of the underlying resource of an ,

Node
assert
The node:assert module provides a set of assertion functions for verifying invariants.
async_hooks
We strongly discourage the use of the async_hooks API. Other APIs that can cover most of its use cases include:
buffer
Buffer objects are used to represent a fixed-length sequence of bytes. Many Node.js APIs support Buffers.
child_process
The node:child_process module provides the ability to spawn subprocesses in a manner that is similar, but not identical, to popen(3). This capability is primarily provided by the spawn function:
cluster
console
The node:console module provides a simple debugging console that is similar to the JavaScript console mechanism provided by web browsers.
constants
crypto
The node:crypto module provides cryptographic functionality that includes a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions.
dgram
The node:dgram module provides an implementation of UDP datagram sockets.
diagnostics_channel
The node:diagnostics_channel module provides an API to create named channels to report arbitrary message data for diagnostics purposes.
dns
The node:dns module enables name resolution. For example, use it to look up IP addresses of host names.
dns/promises
The dns.promises API provides an alternative set of asynchronous DNS methods that return Promise objects rather than using callbacks. The API is accessible via import { promises as dnsPromises } from 'node:dns' or import dnsPromises from 'node:dns/promises'.
domain
events
Much of the Node.js core API is built around an idiomatic asynchronous event-driven architecture in which certain kinds of objects (called "emitters") emit named events that cause Function objects ("listeners") to be called.
fs
The node:fs module enables interacting with the file system in a way modeled on standard POSIX functions.
fs/promises
The fs/promises API provides asynchronous file system methods that return promises.
http
To use the HTTP server and client one must import the node:http module.
http2
The node:http2 module provides an implementation of the HTTP/2 protocol. It can be accessed using:
https
HTTPS is the HTTP protocol over TLS/SSL. In Node.js this is implemented as a separate module.
inspector
inspector/promises
The node:inspector/promises module provides an API for interacting with the V8 inspector.
module
net
Stability: 2 - Stable
os
The node:os module provides operating system-related utility methods and properties. It can be accessed using:
path
The node:path module provides utilities for working with file and directory paths. It can be accessed using:
perf_hooks
This module provides an implementation of a subset of the W3C Web Performance APIs as well as additional APIs for Node.js-specific performance measurements.
process
punycode
**The version of the punycode module bundled in Node.js is being deprecated. **In a future major version of Node.js this module will be removed. Users currently depending on the punycode module should switch to using the userland-provided Punycode.js module instead. For punycode-based URL encoding, see url.domainToASCII or, more generally, the WHATWG URL API.
querystring
The node:querystring module provides utilities for parsing and formatting URL query strings. It can be accessed using:
readline
The node:readline module provides an interface for reading data from a Readable stream (such as process.stdin) one line at a time.
readline/promises
repl
sea
sqlite
stream
A stream is an abstract interface for working with streaming data in Node.js. The node:stream module provides an API for implementing the stream interface.
stream/consumers
The utility consumer functions provide common options for consuming streams.
stream/promises
stream/web
string_decoder
The node:string_decoder module provides an API for decoding Buffer objects into strings in a manner that preserves encoded multi-byte UTF-8 and UTF-16 characters. It can be accessed using:
test/reporters
The node:test/reporters module exposes the builtin-reporters for node:test. To access it:
timers
The timer module exposes a global API for scheduling functions to be called at some future period of time. Because the timer functions are globals, there is no need to import node:timers to use the API.
timers/promises
The timers/promises API provides an alternative set of timer functions that return Promise objects. The API is accessible via require('node:timers/promises').
tls
The node:tls module provides an implementation of the Transport Layer Security (TLS) and Secure Socket Layer (SSL) protocols that is built on top of OpenSSL. The module can be accessed using:
trace_events
tty
The node:tty module provides the tty.ReadStream and tty.WriteStream classes. In most cases, it will not be necessary or possible to use this module directly. However, it can be accessed using:
url
The node:url module provides utilities for URL resolution and parsing. It can be accessed using:
util
The node:util module supports the needs of Node.js internal APIs. Many of the utilities are useful for application and module developers as well. To access it:
util/types
v8
vm
The node:vm module enables compiling and running code within V8 Virtual Machine contexts.
wasi
worker_threads
The node:worker_threads module enables the use of threads that execute JavaScript in parallel. To access it:
zlib
The node:zlib module provides compression functionality implemented using Gzip, Deflate/Inflate, and Brotli.
Deno Docs
Deno Runtime
Deno Deploy
Deno Subhosting
Examples
Standard Library
Community
Discord
GitHub
Twitter
YouTube
Newsletter
Help & Feedback
Community Support
Deploy System Status
Deploy Feedback
Report a Problem
Company
Blog
Careers
Merch
Privacy Policy
Copyright © 2025 the Deno authors.


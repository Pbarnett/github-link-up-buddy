# NodeJS Documentation 2
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Child process
Asynchronous process creation
Spawning .bat and .cmd files on Windows
child_process.exec(command[, options][, callback])
child_process.execFile(file[, args][, options][, callback])
child_process.fork(modulePath[, args][, options])
child_process.spawn(command[, args][, options])
options.detached
options.stdio
Synchronous process creation
child_process.execFileSync(file[, args][, options])
child_process.execSync(command[, options])
child_process.spawnSync(command[, args][, options])
Class: ChildProcess
Event: 'close'
Event: 'disconnect'
Event: 'error'
Event: 'exit'
Event: 'message'
Event: 'spawn'
subprocess.channel
subprocess.channel.ref()
subprocess.channel.unref()
subprocess.connected
subprocess.disconnect()
subprocess.exitCode
subprocess.kill([signal])
subprocess[Symbol.dispose]()
subprocess.killed
subprocess.pid
subprocess.ref()
subprocess.send(message[, sendHandle[, options]][, callback])
Example: sending a server object
Example: sending a socket object
subprocess.signalCode
subprocess.spawnargs
subprocess.spawnfile
subprocess.stderr
subprocess.stdin
subprocess.stdio
subprocess.stdout
subprocess.unref()
maxBuffer and Unicode
Shell requirements
Default Windows shell
Advanced serialization
Child process
#
Stability: 2 - Stable
Source Code: lib/child_process.js
The node:child_process module provides the ability to spawn subprocesses in a manner that is similar, but not identical, to popen(3). This capability is primarily provided by the child_process.spawn() function:
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
copy
By default, pipes for stdin, stdout, and stderr are established between the parent Node.js process and the spawned subprocess. These pipes have limited (and platform-specific) capacity. If the subprocess writes to stdout in excess of that limit without the output being captured, the subprocess blocks, waiting for the pipe buffer to accept more data. This is identical to the behavior of pipes in the shell. Use the { stdio: 'ignore' } option if the output will not be consumed.
The command lookup is performed using the options.env.PATH environment variable if env is in the options object. Otherwise, process.env.PATH is used. If options.env is set without PATH, lookup on Unix is performed on a default search path search of /usr/bin:/bin (see your operating system's manual for execvpe/execvp), on Windows the current processes environment variable PATH is used.
On Windows, environment variables are case-insensitive. Node.js lexicographically sorts the env keys and uses the first one that case-insensitively matches. Only first (in lexicographic order) entry will be passed to the subprocess. This might lead to issues on Windows when passing objects to the env option that have multiple variants of the same key, such as PATH and Path.
The child_process.spawn() method spawns the child process asynchronously, without blocking the Node.js event loop. The child_process.spawnSync() function provides equivalent functionality in a synchronous manner that blocks the event loop until the spawned process either exits or is terminated.
For convenience, the node:child_process module provides a handful of synchronous and asynchronous alternatives to child_process.spawn() and child_process.spawnSync(). Each of these alternatives are implemented on top of child_process.spawn() or child_process.spawnSync().
child_process.exec(): spawns a shell and runs a command within that shell, passing the stdout and stderr to a callback function when complete.
child_process.execFile(): similar to child_process.exec() except that it spawns the command directly without first spawning a shell by default.
child_process.fork(): spawns a new Node.js process and invokes a specified module with an IPC communication channel established that allows sending messages between parent and child.
child_process.execSync(): a synchronous version of child_process.exec() that will block the Node.js event loop.
child_process.execFileSync(): a synchronous version of child_process.execFile() that will block the Node.js event loop.
For certain use cases, such as automating shell scripts, the synchronous counterparts may be more convenient. In many cases, however, the synchronous methods can have significant impact on performance due to stalling the event loop while spawned processes complete.
Asynchronous process creation
#
The child_process.spawn(), child_process.fork(), child_process.exec(), and child_process.execFile() methods all follow the idiomatic asynchronous programming pattern typical of other Node.js APIs.
Each of the methods returns a ChildProcess instance. These objects implement the Node.js EventEmitter API, allowing the parent process to register listener functions that are called when certain events occur during the life cycle of the child process.
The child_process.exec() and child_process.execFile() methods additionally allow for an optional callback function to be specified that is invoked when the child process terminates.
Spawning .bat and .cmd files on Windows
#
The importance of the distinction between child_process.exec() and child_process.execFile() can vary based on platform. On Unix-type operating systems (Unix, Linux, macOS) child_process.execFile() can be more efficient because it does not spawn a shell by default. On Windows, however, .bat and .cmd files are not executable on their own without a terminal, and therefore cannot be launched using child_process.execFile(). When running on Windows, .bat and .cmd files can be invoked using child_process.spawn() with the shell option set, with child_process.exec(), or by spawning cmd.exe and passing the .bat or .cmd file as an argument (which is what the shell option and child_process.exec() do). In any case, if the script filename contains spaces it needs to be quoted.
// OR...
const { exec, spawn } = require('node:child_process');

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script with spaces in the filename:
const bat = spawn('"my script.cmd" a b', { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
copy
child_process.exec(command[, options][, callback])
#
History





















command <string> The command to run, with space-separated arguments.
options <Object>
cwd <string> | <URL> Current working directory of the child process. Default: process.cwd().
env <Object> Environment key-value pairs. Default: process.env.
encoding <string> Default: 'utf8'
shell <string> Shell to execute the command with. See Shell requirements and Default Windows shell. Default: '/bin/sh' on Unix, process.env.ComSpec on Windows.
signal <AbortSignal> allows aborting the child process using an AbortSignal.
timeout <number> Default: 0
maxBuffer <number> Largest amount of data in bytes allowed on stdout or stderr. If exceeded, the child process is terminated and any output is truncated. See caveat at maxBuffer and Unicode. Default: 1024 * 1024.
killSignal <string> | <integer> Default: 'SIGTERM'
uid <number> Sets the user identity of the process (see setuid(2)).
gid <number> Sets the group identity of the process (see setgid(2)).
windowsHide <boolean> Hide the subprocess console window that would normally be created on Windows systems. Default: false.
callback <Function> called with the output when process terminates.
error <Error>
stdout <string> | <Buffer>
stderr <string> | <Buffer>
Returns: <ChildProcess>
Spawns a shell then executes the command within that shell, buffering any generated output. The command string passed to the exec function is processed directly by the shell and special characters (vary based on shell) need to be dealt with accordingly:
const { exec } = require('node:child_process');

exec('"/path/to/test file/test.sh" arg1 arg2');
// Double quotes are used so that the space in the path is not interpreted as
// a delimiter of multiple arguments.

exec('echo "The \\$HOME variable is $HOME"');
// The $HOME variable is escaped in the first instance, but not in the second.
copy
Never pass unsanitized user input to this function. Any input containing shell metacharacters may be used to trigger arbitrary command execution.
If a callback function is provided, it is called with the arguments (error, stdout, stderr). On success, error will be null. On error, error will be an instance of Error. The error.code property will be the exit code of the process. By convention, any exit code other than 0 indicates an error. error.signal will be the signal that terminated the process.
The stdout and stderr arguments passed to the callback will contain the stdout and stderr output of the child process. By default, Node.js will decode the output as UTF-8 and pass strings to the callback. The encoding option can be used to specify the character encoding used to decode the stdout and stderr output. If encoding is 'buffer', or an unrecognized character encoding, Buffer objects will be passed to the callback instead.
const { exec } = require('node:child_process');
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
copy
If timeout is greater than 0, the parent process will send the signal identified by the killSignal property (the default is 'SIGTERM') if the child process runs longer than timeout milliseconds.
Unlike the exec(3) POSIX system call, child_process.exec() does not replace the existing process and uses a shell to execute the command.
If this method is invoked as its util.promisify()ed version, it returns a Promise for an Object with stdout and stderr properties. The returned ChildProcess instance is attached to the Promise as a child property. In case of an error (including any error resulting in an exit code other than 0), a rejected promise is returned, with the same error object given in the callback, but with two additional properties stdout and stderr.
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
copy
If the signal option is enabled, calling .abort() on the corresponding AbortController is similar to calling .kill() on the child process except the error passed to the callback will be an AbortError:
const { exec } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
copy
child_process.execFile(file[, args][, options][, callback])
#
History

























file <string> The name or path of the executable file to run.
args <string[]> List of string arguments.
options <Object>
cwd <string> | <URL> Current working directory of the child process.
env <Object> Environment key-value pairs. Default: process.env.
encoding <string> Default: 'utf8'
timeout <number> Default: 0
maxBuffer <number> Largest amount of data in bytes allowed on stdout or stderr. If exceeded, the child process is terminated and any output is truncated. See caveat at maxBuffer and Unicode. Default: 1024 * 1024.
killSignal <string> | <integer> Default: 'SIGTERM'
uid <number> Sets the user identity of the process (see setuid(2)).
gid <number> Sets the group identity of the process (see setgid(2)).
windowsHide <boolean> Hide the subprocess console window that would normally be created on Windows systems. Default: false.
windowsVerbatimArguments <boolean> No quoting or escaping of arguments is done on Windows. Ignored on Unix. Default: false.
shell <boolean> | <string> If true, runs command inside of a shell. Uses '/bin/sh' on Unix, and process.env.ComSpec on Windows. A different shell can be specified as a string. See Shell requirements and Default Windows shell. Default: false (no shell).
signal <AbortSignal> allows aborting the child process using an AbortSignal.
callback <Function> Called with the output when process terminates.
error <Error>
stdout <string> | <Buffer>
stderr <string> | <Buffer>
Returns: <ChildProcess>
The child_process.execFile() function is similar to child_process.exec() except that it does not spawn a shell by default. Rather, the specified executable file is spawned directly as a new process making it slightly more efficient than child_process.exec().
The same options as child_process.exec() are supported. Since a shell is not spawned, behaviors such as I/O redirection and file globbing are not supported.
const { execFile } = require('node:child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
copy
The stdout and stderr arguments passed to the callback will contain the stdout and stderr output of the child process. By default, Node.js will decode the output as UTF-8 and pass strings to the callback. The encoding option can be used to specify the character encoding used to decode the stdout and stderr output. If encoding is 'buffer', or an unrecognized character encoding, Buffer objects will be passed to the callback instead.
If this method is invoked as its util.promisify()ed version, it returns a Promise for an Object with stdout and stderr properties. The returned ChildProcess instance is attached to the Promise as a child property. In case of an error (including any error resulting in an exit code other than 0), a rejected promise is returned, with the same error object given in the callback, but with two additional properties stdout and stderr.
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
copy
If the shell option is enabled, do not pass unsanitized user input to this function. Any input containing shell metacharacters may be used to trigger arbitrary command execution.
If the signal option is enabled, calling .abort() on the corresponding AbortController is similar to calling .kill() on the child process except the error passed to the callback will be an AbortError:
const { execFile } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
copy
child_process.fork(modulePath[, args][, options])
#
History









































modulePath <string> | <URL> The module to run in the child.
args <string[]> List of string arguments.
options <Object>
cwd <string> | <URL> Current working directory of the child process.
detached <boolean> Prepare child process to run independently of its parent process. Specific behavior depends on the platform (see options.detached).
env <Object> Environment key-value pairs. Default: process.env.
execPath <string> Executable used to create the child process.
execArgv <string[]> List of string arguments passed to the executable. Default: process.execArgv.
gid <number> Sets the group identity of the process (see setgid(2)).
serialization <string> Specify the kind of serialization used for sending messages between processes. Possible values are 'json' and 'advanced'. See Advanced serialization for more details. Default: 'json'.
signal <AbortSignal> Allows closing the child process using an AbortSignal.
killSignal <string> | <integer> The signal value to be used when the spawned process will be killed by timeout or abort signal. Default: 'SIGTERM'.
silent <boolean> If true, stdin, stdout, and stderr of the child process will be piped to the parent process, otherwise they will be inherited from the parent process, see the 'pipe' and 'inherit' options for child_process.spawn()'s stdio for more details. Default: false.
stdio <Array> | <string> See child_process.spawn()'s stdio. When this option is provided, it overrides silent. If the array variant is used, it must contain exactly one item with value 'ipc' or an error will be thrown. For instance [0, 1, 2, 'ipc'].
uid <number> Sets the user identity of the process (see setuid(2)).
windowsVerbatimArguments <boolean> No quoting or escaping of arguments is done on Windows. Ignored on Unix. Default: false.
timeout <number> In milliseconds the maximum amount of time the process is allowed to run. Default: undefined.
Returns: <ChildProcess>
The child_process.fork() method is a special case of child_process.spawn() used specifically to spawn new Node.js processes. Like child_process.spawn(), a ChildProcess object is returned. The returned ChildProcess will have an additional communication channel built-in that allows messages to be passed back and forth between the parent and child. See subprocess.send() for details.
Keep in mind that spawned Node.js child processes are independent of the parent with exception of the IPC communication channel that is established between the two. Each process has its own memory, with their own V8 instances. Because of the additional resource allocations required, spawning a large number of child Node.js processes is not recommended.
By default, child_process.fork() will spawn new Node.js instances using the process.execPath of the parent process. The execPath property in the options object allows for an alternative execution path to be used.
Node.js processes launched with a custom execPath will communicate with the parent process using the file descriptor (fd) identified using the environment variable NODE_CHANNEL_FD on the child process.
Unlike the fork(2) POSIX system call, child_process.fork() does not clone the current process.
The shell option available in child_process.spawn() is not supported by child_process.fork() and will be ignored if set.
If the signal option is enabled, calling .abort() on the corresponding AbortController is similar to calling .kill() on the child process except the error passed to the callback will be an AbortError:
const { fork } = require('node:child_process');
const process = require('node:process');

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(__filename, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
copy
child_process.spawn(command[, args][, options])
#
History













































command <string> The command to run.
args <string[]> List of string arguments.
options <Object>
cwd <string> | <URL> Current working directory of the child process.
env <Object> Environment key-value pairs. Default: process.env.
argv0 <string> Explicitly set the value of argv[0] sent to the child process. This will be set to command if not specified.
stdio <Array> | <string> Child's stdio configuration (see options.stdio).
detached <boolean> Prepare child process to run independently of its parent process. Specific behavior depends on the platform (see options.detached).
uid <number> Sets the user identity of the process (see setuid(2)).
gid <number> Sets the group identity of the process (see setgid(2)).
serialization <string> Specify the kind of serialization used for sending messages between processes. Possible values are 'json' and 'advanced'. See Advanced serialization for more details. Default: 'json'.
shell <boolean> | <string> If true, runs command inside of a shell. Uses '/bin/sh' on Unix, and process.env.ComSpec on Windows. A different shell can be specified as a string. See Shell requirements and Default Windows shell. Default: false (no shell).
windowsVerbatimArguments <boolean> No quoting or escaping of arguments is done on Windows. Ignored on Unix. This is set to true automatically when shell is specified and is CMD. Default: false.
windowsHide <boolean> Hide the subprocess console window that would normally be created on Windows systems. Default: false.
signal <AbortSignal> allows aborting the child process using an AbortSignal.
timeout <number> In milliseconds the maximum amount of time the process is allowed to run. Default: undefined.
killSignal <string> | <integer> The signal value to be used when the spawned process will be killed by timeout or abort signal. Default: 'SIGTERM'.
Returns: <ChildProcess>
The child_process.spawn() method spawns a new process using the given command, with command-line arguments in args. If omitted, args defaults to an empty array.
If the shell option is enabled, do not pass unsanitized user input to this function. Any input containing shell metacharacters may be used to trigger arbitrary command execution.
A third argument may be used to specify additional options, with these defaults:
const defaults = {
  cwd: undefined,
  env: process.env,
};
copy
Use cwd to specify the working directory from which the process is spawned. If not given, the default is to inherit the current working directory. If given, but the path does not exist, the child process emits an ENOENT error and exits immediately. ENOENT is also emitted when the command does not exist.
Use env to specify environment variables that will be visible to the new process, the default is process.env.
undefined values in env will be ignored.
Example of running ls -lh /usr, capturing stdout, stderr, and the exit code:
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
copy
Example: A very elaborate way to run ps ax | grep ssh
const { spawn } = require('node:child_process');
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
copy
Example of checking for failed spawn:
const { spawn } = require('node:child_process');
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
copy
Certain platforms (macOS, Linux) will use the value of argv[0] for the process title while others (Windows, SunOS) will use command.
Node.js overwrites argv[0] with process.execPath on startup, so process.argv[0] in a Node.js child process will not match the argv0 parameter passed to spawn from the parent. Retrieve it with the process.argv0 property instead.
If the signal option is enabled, calling .abort() on the corresponding AbortController is similar to calling .kill() on the child process except the error passed to the callback will be an AbortError:
const { spawn } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // Stops the child process
copy
options.detached
#
Added in: v0.7.10
On Windows, setting options.detached to true makes it possible for the child process to continue running after the parent exits. The child process will have its own console window. Once enabled for a child process, it cannot be disabled.
On non-Windows platforms, if options.detached is set to true, the child process will be made the leader of a new process group and session. Child processes may continue running after the parent exits regardless of whether they are detached or not. See setsid(2) for more information.
By default, the parent will wait for the detached child process to exit. To prevent the parent process from waiting for a given subprocess to exit, use the subprocess.unref() method. Doing so will cause the parent process' event loop to not include the child process in its reference count, allowing the parent process to exit independently of the child process, unless there is an established IPC channel between the child and the parent processes.
When using the detached option to start a long-running process, the process will not stay running in the background after the parent exits unless it is provided with a stdio configuration that is not connected to the parent. If the parent process' stdio is inherited, the child process will remain attached to the controlling terminal.
Example of a long-running process, by detaching and also ignoring its parent stdio file descriptors, in order to ignore the parent's termination:
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
copy
Alternatively one can redirect the child process' output into files:
const { openSync } = require('node:fs');
const { spawn } = require('node:child_process');
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
copy
options.stdio
#
History

















The options.stdio option is used to configure the pipes that are established between the parent and child process. By default, the child's stdin, stdout, and stderr are redirected to corresponding subprocess.stdin, subprocess.stdout, and subprocess.stderr streams on the ChildProcess object. This is equivalent to setting the options.stdio equal to ['pipe', 'pipe', 'pipe'].
For convenience, options.stdio may be one of the following strings:
'pipe': equivalent to ['pipe', 'pipe', 'pipe'] (the default)
'overlapped': equivalent to ['overlapped', 'overlapped', 'overlapped']
'ignore': equivalent to ['ignore', 'ignore', 'ignore']
'inherit': equivalent to ['inherit', 'inherit', 'inherit'] or [0, 1, 2]
Otherwise, the value of options.stdio is an array where each index corresponds to an fd in the child. The fds 0, 1, and 2 correspond to stdin, stdout, and stderr, respectively. Additional fds can be specified to create additional pipes between the parent and child. The value is one of the following:
'pipe': Create a pipe between the child process and the parent process. The parent end of the pipe is exposed to the parent as a property on the child_process object as subprocess.stdio[fd]. Pipes created for fds 0, 1, and 2 are also available as subprocess.stdin, subprocess.stdout and subprocess.stderr, respectively. These are not actual Unix pipes and therefore the child process can not use them by their descriptor files, e.g. /dev/fd/2 or /dev/stdout.
'overlapped': Same as 'pipe' except that the FILE_FLAG_OVERLAPPED flag is set on the handle. This is necessary for overlapped I/O on the child process's stdio handles. See the docs for more details. This is exactly the same as 'pipe' on non-Windows systems.
'ipc': Create an IPC channel for passing messages/file descriptors between parent and child. A ChildProcess may have at most one IPC stdio file descriptor. Setting this option enables the subprocess.send() method. If the child process is a Node.js instance, the presence of an IPC channel will enable process.send() and process.disconnect() methods, as well as 'disconnect' and 'message' events within the child process.
Accessing the IPC channel fd in any way other than process.send() or using the IPC channel with a child process that is not a Node.js instance is not supported.
'ignore': Instructs Node.js to ignore the fd in the child. While Node.js will always open fds 0, 1, and 2 for the processes it spawns, setting the fd to 'ignore' will cause Node.js to open /dev/null and attach it to the child's fd.
'inherit': Pass through the corresponding stdio stream to/from the parent process. In the first three positions, this is equivalent to process.stdin, process.stdout, and process.stderr, respectively. In any other position, equivalent to 'ignore'.
<Stream> object: Share a readable or writable stream that refers to a tty, file, socket, or a pipe with the child process. The stream's underlying file descriptor is duplicated in the child process to the fd that corresponds to the index in the stdio array. The stream must have an underlying descriptor (file streams do not start until the 'open' event has occurred). NOTE: While it is technically possible to pass stdin as a writable or stdout/stderr as readable, it is not recommended. Readable and writable streams are designed with distinct behaviors, and using them incorrectly (e.g., passing a readable stream where a writable stream is expected) can lead to unexpected results or errors. This practice is discouraged as it may result in undefined behavior or dropped callbacks if the stream encounters errors. Always ensure that stdin is used as writable and stdout/stderr as readable to maintain the intended flow of data between the parent and child processes.
Positive integer: The integer value is interpreted as a file descriptor that is open in the parent process. It is shared with the child process, similar to how <Stream> objects can be shared. Passing sockets is not supported on Windows.
null, undefined: Use default value. For stdio fds 0, 1, and 2 (in other words, stdin, stdout, and stderr) a pipe is created. For fd 3 and up, the default is 'ignore'.
const { spawn } = require('node:child_process');
const process = require('node:process');

// Child will use parent's stdios.
spawn('prg', [], { stdio: 'inherit' });

// Spawn child sharing only stderr.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Open an extra fd=4, to interact with programs presenting a
// startd-style interface.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
copy
It is worth noting that when an IPC channel is established between the parent and child processes, and the child process is a Node.js instance, the child process is launched with the IPC channel unreferenced (using unref()) until the child process registers an event handler for the 'disconnect' event or the 'message' event. This allows the child process to exit normally without the process being held open by the open IPC channel. See also: child_process.exec() and child_process.fork().
Synchronous process creation
#
The child_process.spawnSync(), child_process.execSync(), and child_process.execFileSync() methods are synchronous and will block the Node.js event loop, pausing execution of any additional code until the spawned process exits.
Blocking calls like these are mostly useful for simplifying general-purpose scripting tasks and for simplifying the loading/processing of application configuration at startup.
child_process.execFileSync(file[, args][, options])
#
History





























file <string> The name or path of the executable file to run.
args <string[]> List of string arguments.
options <Object>
cwd <string> | <URL> Current working directory of the child process.
input <string> | <Buffer> | <TypedArray> | <DataView> The value which will be passed as stdin to the spawned process. If stdio[0] is set to 'pipe', Supplying this value will override stdio[0].
stdio <string> | <Array> Child's stdio configuration. See child_process.spawn()'s stdio. stderr by default will be output to the parent process' stderr unless stdio is specified. Default: 'pipe'.
env <Object> Environment key-value pairs. Default: process.env.
uid <number> Sets the user identity of the process (see setuid(2)).
gid <number> Sets the group identity of the process (see setgid(2)).
timeout <number> In milliseconds the maximum amount of time the process is allowed to run. Default: undefined.
killSignal <string> | <integer> The signal value to be used when the spawned process will be killed. Default: 'SIGTERM'.
maxBuffer <number> Largest amount of data in bytes allowed on stdout or stderr. If exceeded, the child process is terminated. See caveat at maxBuffer and Unicode. Default: 1024 * 1024.
encoding <string> The encoding used for all stdio inputs and outputs. Default: 'buffer'.
windowsHide <boolean> Hide the subprocess console window that would normally be created on Windows systems. Default: false.
shell <boolean> | <string> If true, runs command inside of a shell. Uses '/bin/sh' on Unix, and process.env.ComSpec on Windows. A different shell can be specified as a string. See Shell requirements and Default Windows shell. Default: false (no shell).
Returns: <Buffer> | <string> The stdout from the command.
The child_process.execFileSync() method is generally identical to child_process.execFile() with the exception that the method will not return until the child process has fully closed. When a timeout has been encountered and killSignal is sent, the method won't return until the process has completely exited.
If the child process intercepts and handles the SIGTERM signal and does not exit, the parent process will still wait until the child process has exited.
If the process times out or has a non-zero exit code, this method will throw an Error that will include the full result of the underlying child_process.spawnSync().
If the shell option is enabled, do not pass unsanitized user input to this function. Any input containing shell metacharacters may be used to trigger arbitrary command execution.
const { execFileSync } = require('node:child_process');

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Capture stdout and stderr from child process. Overrides the
    // default behavior of streaming child stderr to the parent stderr
    stdio: 'pipe',

    // Use utf8 encoding for stdio pipes
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Spawning child process failed
    console.error(err.code);
  } else {
    // Child was spawned but exited with non-zero exit code
    // Error contains any stdout and stderr from the child
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
copy
child_process.execSync(command[, options])
#
History

























command <string> The command to run.
options <Object>
cwd <string> | <URL> Current working directory of the child process.
input <string> | <Buffer> | <TypedArray> | <DataView> The value which will be passed as stdin to the spawned process. If stdio[0] is set to 'pipe', Supplying this value will override stdio[0].
stdio <string> | <Array> Child's stdio configuration. See child_process.spawn()'s stdio. stderr by default will be output to the parent process' stderr unless stdio is specified. Default: 'pipe'.
env <Object> Environment key-value pairs. Default: process.env.
shell <string> Shell to execute the command with. See Shell requirements and Default Windows shell. Default: '/bin/sh' on Unix, process.env.ComSpec on Windows.
uid <number> Sets the user identity of the process. (See setuid(2)).
gid <number> Sets the group identity of the process. (See setgid(2)).
timeout <number> In milliseconds the maximum amount of time the process is allowed to run. Default: undefined.
killSignal <string> | <integer> The signal value to be used when the spawned process will be killed. Default: 'SIGTERM'.
maxBuffer <number> Largest amount of data in bytes allowed on stdout or stderr. If exceeded, the child process is terminated and any output is truncated. See caveat at maxBuffer and Unicode. Default: 1024 * 1024.
encoding <string> The encoding used for all stdio inputs and outputs. Default: 'buffer'.
windowsHide <boolean> Hide the subprocess console window that would normally be created on Windows systems. Default: false.
Returns: <Buffer> | <string> The stdout from the command.
The child_process.execSync() method is generally identical to child_process.exec() with the exception that the method will not return until the child process has fully closed. When a timeout has been encountered and killSignal is sent, the method won't return until the process has completely exited. If the child process intercepts and handles the SIGTERM signal and doesn't exit, the parent process will wait until the child process has exited.
If the process times out or has a non-zero exit code, this method will throw. The Error object will contain the entire result from child_process.spawnSync().
Never pass unsanitized user input to this function. Any input containing shell metacharacters may be used to trigger arbitrary command execution.
child_process.spawnSync(command[, args][, options])
#
History

































command <string> The command to run.
args <string[]> List of string arguments.
options <Object>
cwd <string> | <URL> Current working directory of the child process.
input <string> | <Buffer> | <TypedArray> | <DataView> The value which will be passed as stdin to the spawned process. If stdio[0] is set to 'pipe', Supplying this value will override stdio[0].
argv0 <string> Explicitly set the value of argv[0] sent to the child process. This will be set to command if not specified.
stdio <string> | <Array> Child's stdio configuration. See child_process.spawn()'s stdio. Default: 'pipe'.
env <Object> Environment key-value pairs. Default: process.env.
uid <number> Sets the user identity of the process (see setuid(2)).
gid <number> Sets the group identity of the process (see setgid(2)).
timeout <number> In milliseconds the maximum amount of time the process is allowed to run. Default: undefined.
killSignal <string> | <integer> The signal value to be used when the spawned process will be killed. Default: 'SIGTERM'.
maxBuffer <number> Largest amount of data in bytes allowed on stdout or stderr. If exceeded, the child process is terminated and any output is truncated. See caveat at maxBuffer and Unicode. Default: 1024 * 1024.
encoding <string> The encoding used for all stdio inputs and outputs. Default: 'buffer'.
shell <boolean> | <string> If true, runs command inside of a shell. Uses '/bin/sh' on Unix, and process.env.ComSpec on Windows. A different shell can be specified as a string. See Shell requirements and Default Windows shell. Default: false (no shell).
windowsVerbatimArguments <boolean> No quoting or escaping of arguments is done on Windows. Ignored on Unix. This is set to true automatically when shell is specified and is CMD. Default: false.
windowsHide <boolean> Hide the subprocess console window that would normally be created on Windows systems. Default: false.
Returns: <Object>
pid <number> Pid of the child process.
output <Array> Array of results from stdio output.
stdout <Buffer> | <string> The contents of output[1].
stderr <Buffer> | <string> The contents of output[2].
status <number> | <null> The exit code of the subprocess, or null if the subprocess terminated due to a signal.
signal <string> | <null> The signal used to kill the subprocess, or null if the subprocess did not terminate due to a signal.
error <Error> The error object if the child process failed or timed out.
The child_process.spawnSync() method is generally identical to child_process.spawn() with the exception that the function will not return until the child process has fully closed. When a timeout has been encountered and killSignal is sent, the method won't return until the process has completely exited. If the process intercepts and handles the SIGTERM signal and doesn't exit, the parent process will wait until the child process has exited.
If the shell option is enabled, do not pass unsanitized user input to this function. Any input containing shell metacharacters may be used to trigger arbitrary command execution.
Class: ChildProcess
#
Added in: v2.2.0
Extends: <EventEmitter>
Instances of the ChildProcess represent spawned child processes.
Instances of ChildProcess are not intended to be created directly. Rather, use the child_process.spawn(), child_process.exec(), child_process.execFile(), or child_process.fork() methods to create instances of ChildProcess.
Event: 'close'
#
Added in: v0.7.7
code <number> The exit code if the child process exited on its own, or null if the child process terminated due to a signal.
signal <string> The signal by which the child process was terminated, or null if the child process did not terminated due to a signal.
The 'close' event is emitted after a process has ended and the stdio streams of a child process have been closed. This is distinct from the 'exit' event, since multiple processes might share the same stdio streams. The 'close' event will always emit after 'exit' was already emitted, or 'error' if the child process failed to spawn.
If the process exited, code is the final exit code of the process, otherwise null. If the process terminated due to receipt of a signal, signal is the string name of the signal, otherwise null. One of the two will always be non-null.
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
copy
Event: 'disconnect'
#
Added in: v0.7.2
The 'disconnect' event is emitted after calling the subprocess.disconnect() method in parent process or process.disconnect() in child process. After disconnecting it is no longer possible to send or receive messages, and the subprocess.connected property is false.
Event: 'error'
#
err <Error> The error.
The 'error' event is emitted whenever:
The process could not be spawned.
The process could not be killed.
Sending a message to the child process failed.
The child process was aborted via the signal option.
The 'exit' event may or may not fire after an error has occurred. When listening to both the 'exit' and 'error' events, guard against accidentally invoking handler functions multiple times.
See also subprocess.kill() and subprocess.send().
Event: 'exit'
#
Added in: v0.1.90
code <number> The exit code if the child process exited on its own, or null if the child process terminated due to a signal.
signal <string> The signal by which the child process was terminated, or null if the child process did not terminated due to a signal.
The 'exit' event is emitted after the child process ends. If the process exited, code is the final exit code of the process, otherwise null. If the process terminated due to receipt of a signal, signal is the string name of the signal, otherwise null. One of the two will always be non-null.
When the 'exit' event is triggered, child process stdio streams might still be open.
Node.js establishes signal handlers for SIGINT and SIGTERM and Node.js processes will not terminate immediately due to receipt of those signals. Rather, Node.js will perform a sequence of cleanup actions and then will re-raise the handled signal.
See waitpid(2).
Event: 'message'
#
Added in: v0.5.9
message <Object> A parsed JSON object or primitive value.
sendHandle <Handle> | <undefined> undefined or a net.Socket, net.Server, or dgram.Socket object.
The 'message' event is triggered when a child process uses process.send() to send messages.
The message goes through serialization and parsing. The resulting message might not be the same as what is originally sent.
If the serialization option was set to 'advanced' used when spawning the child process, the message argument can contain data that JSON is not able to represent. See Advanced serialization for more details.
Event: 'spawn'
#
Added in: v15.1.0, v14.17.0
The 'spawn' event is emitted once the child process has spawned successfully. If the child process does not spawn successfully, the 'spawn' event is not emitted and the 'error' event is emitted instead.
If emitted, the 'spawn' event comes before all other events and before any data is received via stdout or stderr.
The 'spawn' event will fire regardless of whether an error occurs within the spawned process. For example, if bash some-command spawns successfully, the 'spawn' event will fire, though bash may fail to spawn some-command. This caveat also applies when using { shell: true }.
subprocess.channel
#
History













<Object> A pipe representing the IPC channel to the child process.
The subprocess.channel property is a reference to the child's IPC channel. If no IPC channel exists, this property is undefined.
subprocess.channel.ref()
#
Added in: v7.1.0
This method makes the IPC channel keep the event loop of the parent process running if .unref() has been called before.
subprocess.channel.unref()
#
Added in: v7.1.0
This method makes the IPC channel not keep the event loop of the parent process running, and lets it finish even while the channel is open.
subprocess.connected
#
Added in: v0.7.2
<boolean> Set to false after subprocess.disconnect() is called.
The subprocess.connected property indicates whether it is still possible to send and receive messages from a child process. When subprocess.connected is false, it is no longer possible to send or receive messages.
subprocess.disconnect()
#
Added in: v0.7.2
Closes the IPC channel between parent and child processes, allowing the child process to exit gracefully once there are no other connections keeping it alive. After calling this method the subprocess.connected and process.connected properties in both the parent and child processes (respectively) will be set to false, and it will be no longer possible to pass messages between the processes.
The 'disconnect' event will be emitted when there are no messages in the process of being received. This will most often be triggered immediately after calling subprocess.disconnect().
When the child process is a Node.js instance (e.g. spawned using child_process.fork()), the process.disconnect() method can be invoked within the child process to close the IPC channel as well.
subprocess.exitCode
#
<integer>
The subprocess.exitCode property indicates the exit code of the child process. If the child process is still running, the field will be null.
subprocess.kill([signal])
#
Added in: v0.1.90
signal <number> | <string>
Returns: <boolean>
The subprocess.kill() method sends a signal to the child process. If no argument is given, the process will be sent the 'SIGTERM' signal. See signal(7) for a list of available signals. This function returns true if kill(2) succeeds, and false otherwise.
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
copy
The ChildProcess object may emit an 'error' event if the signal cannot be delivered. Sending a signal to a child process that has already exited is not an error but may have unforeseen consequences. Specifically, if the process identifier (PID) has been reassigned to another process, the signal will be delivered to that process instead which can have unexpected results.
While the function is called kill, the signal delivered to the child process may not actually terminate the process.
See kill(2) for reference.
On Windows, where POSIX signals do not exist, the signal argument will be ignored except for 'SIGKILL', 'SIGTERM', 'SIGINT' and 'SIGQUIT', and the process will always be killed forcefully and abruptly (similar to 'SIGKILL'). See Signal Events for more details.
On Linux, child processes of child processes will not be terminated when attempting to kill their parent. This is likely to happen when running a new process in a shell or with the use of the shell option of ChildProcess:
const { spawn } = require('node:child_process');

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
copy
subprocess[Symbol.dispose]()
#
History













Calls subprocess.kill() with 'SIGTERM'.
subprocess.killed
#
Added in: v0.5.10
<boolean> Set to true after subprocess.kill() is used to successfully send a signal to the child process.
The subprocess.killed property indicates whether the child process successfully received a signal from subprocess.kill(). The killed property does not indicate that the child process has been terminated.
subprocess.pid
#
Added in: v0.1.90
<integer> | <undefined>
Returns the process identifier (PID) of the child process. If the child process fails to spawn due to errors, then the value is undefined and error is emitted.
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
copy
subprocess.ref()
#
Added in: v0.7.10
Calling subprocess.ref() after making a call to subprocess.unref() will restore the removed reference count for the child process, forcing the parent process to wait for the child process to exit before exiting itself.
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
copy
subprocess.send(message[, sendHandle[, options]][, callback])
#
History





















message <Object>
sendHandle <Handle> | <undefined> undefined, or a net.Socket, net.Server, or dgram.Socket object.
options <Object> The options argument, if present, is an object used to parameterize the sending of certain types of handles. options supports the following properties:
keepOpen <boolean> A value that can be used when passing instances of net.Socket. When true, the socket is kept open in the sending process. Default: false.
callback <Function>
Returns: <boolean>
When an IPC channel has been established between the parent and child processes ( i.e. when using child_process.fork()), the subprocess.send() method can be used to send messages to the child process. When the child process is a Node.js instance, these messages can be received via the 'message' event.
The message goes through serialization and parsing. The resulting message might not be the same as what is originally sent.
For example, in the parent script:
const { fork } = require('node:child_process');
const forkedProcess = fork(`${__dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Causes the child to print: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
copy
And then the child script, 'sub.js' might look like this:
process.on('message', (message) => {
  console.log('CHILD got message:', message);
});

// Causes the parent to print: PARENT got message: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });
copy
Child Node.js processes will have a process.send() method of their own that allows the child process to send messages back to the parent process.
There is a special case when sending a {cmd: 'NODE_foo'} message. Messages containing a NODE_ prefix in the cmd property are reserved for use within Node.js core and will not be emitted in the child's 'message' event. Rather, such messages are emitted using the 'internalMessage' event and are consumed internally by Node.js. Applications should avoid using such messages or listening for 'internalMessage' events as it is subject to change without notice.
The optional sendHandle argument that may be passed to subprocess.send() is for passing a TCP server or socket object to the child process. The child process will receive the object as the second argument passed to the callback function registered on the 'message' event. Any data that is received and buffered in the socket will not be sent to the child. Sending IPC sockets is not supported on Windows.
The optional callback is a function that is invoked after the message is sent but before the child process may have received it. The function is called with a single argument: null on success, or an Error object on failure.
If no callback function is provided and the message cannot be sent, an 'error' event will be emitted by the ChildProcess object. This can happen, for instance, when the child process has already exited.
subprocess.send() will return false if the channel has closed or when the backlog of unsent messages exceeds a threshold that makes it unwise to send more. Otherwise, the method returns true. The callback function can be used to implement flow control.
Example: sending a server object
#
The sendHandle argument can be used, for instance, to pass the handle of a TCP server object to the child process as illustrated in the example below:
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const subprocess = fork('subprocess.js');

// Open up the server object and send the handle.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
copy
The child process would then receive the server object as:
process.on('message', (m, server) => {
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.end('handled by child');
    });
  }
});
copy
Once the server is now shared between the parent and child, some connections can be handled by the parent and some by the child.
While the example above uses a server created using the node:net module, node:dgram module servers use exactly the same workflow with the exceptions of listening on a 'message' event instead of 'connection' and using server.bind() instead of server.listen(). This is, however, only supported on Unix platforms.
Example: sending a socket object
#
Similarly, the sendHandler argument can be used to pass the handle of a socket to the child process. The example below spawns two children that each handle connections with "normal" or "special" priority:
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Open up the server and send sockets to child. Use pauseOnConnect to prevent
// the sockets from being read before they are sent to the child process.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // If this is special priority...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // This is normal priority.
  normal.send('socket', socket);
});
server.listen(1337);
copy
The subprocess.js would receive the socket handle as the second argument passed to the event callback function:
process.on('message', (m, socket) => {
  if (m === 'socket') {
    if (socket) {
      // Check that the client socket exists.
      // It is possible for the socket to be closed between the time it is
      // sent and the time it is received in the child process.
      socket.end(`Request handled with ${process.argv[2]} priority`);
    }
  }
});
copy
Do not use .maxConnections on a socket that has been passed to a subprocess. The parent cannot track when the socket is destroyed.
Any 'message' handlers in the subprocess should verify that socket exists, as the connection may have been closed during the time it takes to send the connection to the child.
subprocess.signalCode
#
<string> | <null>
The subprocess.signalCode property indicates the signal received by the child process if any, else null.
subprocess.spawnargs
#
<Array>
The subprocess.spawnargs property represents the full list of command-line arguments the child process was launched with.
subprocess.spawnfile
#
<string>
The subprocess.spawnfile property indicates the executable file name of the child process that is launched.
For child_process.fork(), its value will be equal to process.execPath. For child_process.spawn(), its value will be the name of the executable file. For child_process.exec(), its value will be the name of the shell in which the child process is launched.
subprocess.stderr
#
Added in: v0.1.90
<stream.Readable> | <null> | <undefined>
A Readable Stream that represents the child process's stderr.
If the child process was spawned with stdio[2] set to anything other than 'pipe', then this will be null.
subprocess.stderr is an alias for subprocess.stdio[2]. Both properties will refer to the same value.
The subprocess.stderr property can be null or undefined if the child process could not be successfully spawned.
subprocess.stdin
#
Added in: v0.1.90
<stream.Writable> | <null> | <undefined>
A Writable Stream that represents the child process's stdin.
If a child process waits to read all of its input, the child process will not continue until this stream has been closed via end().
If the child process was spawned with stdio[0] set to anything other than 'pipe', then this will be null.
subprocess.stdin is an alias for subprocess.stdio[0]. Both properties will refer to the same value.
The subprocess.stdin property can be null or undefined if the child process could not be successfully spawned.
subprocess.stdio
#
Added in: v0.7.10
<Array>
A sparse array of pipes to the child process, corresponding with positions in the stdio option passed to child_process.spawn() that have been set to the value 'pipe'. subprocess.stdio[0], subprocess.stdio[1], and subprocess.stdio[2] are also available as subprocess.stdin, subprocess.stdout, and subprocess.stderr, respectively.
In the following example, only the child's fd 1 (stdout) is configured as a pipe, so only the parent's subprocess.stdio[1] is a stream, all other values in the array are null.
const assert = require('node:assert');
const fs = require('node:fs');
const child_process = require('node:child_process');

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
copy
The subprocess.stdio property can be undefined if the child process could not be successfully spawned.
subprocess.stdout
#
Added in: v0.1.90
<stream.Readable> | <null> | <undefined>
A Readable Stream that represents the child process's stdout.
If the child process was spawned with stdio[1] set to anything other than 'pipe', then this will be null.
subprocess.stdout is an alias for subprocess.stdio[1]. Both properties will refer to the same value.
const { spawn } = require('node:child_process');

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
copy
The subprocess.stdout property can be null or undefined if the child process could not be successfully spawned.
subprocess.unref()
#
Added in: v0.7.10
By default, the parent process will wait for the detached child process to exit. To prevent the parent process from waiting for a given subprocess to exit, use the subprocess.unref() method. Doing so will cause the parent's event loop to not include the child process in its reference count, allowing the parent to exit independently of the child, unless there is an established IPC channel between the child and the parent processes.
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
copy
maxBuffer and Unicode
#
The maxBuffer option specifies the largest number of bytes allowed on stdout or stderr. If this value is exceeded, then the child process is terminated. This impacts output that includes multibyte character encodings such as UTF-8 or UTF-16. For instance, console.log('中文测试') will send 13 UTF-8 encoded bytes to stdout although there are only 4 characters.
Shell requirements
#
The shell should understand the -c switch. If the shell is 'cmd.exe', it should understand the /d /s /c switches and command-line parsing should be compatible.
Default Windows shell
#
Although Microsoft specifies %COMSPEC% must contain the path to 'cmd.exe' in the root environment, child processes are not always subject to the same requirement. Thus, in child_process functions where a shell can be spawned, 'cmd.exe' is used as a fallback if process.env.ComSpec is unavailable.
Advanced serialization
#
Added in: v13.2.0, v12.16.0
Child processes support a serialization mechanism for IPC that is based on the serialization API of the node:v8 module, based on the HTML structured clone algorithm. This is generally more powerful and supports more built-in JavaScript object types, such as BigInt, Map and Set, ArrayBuffer and TypedArray, Buffer, Error, RegExp etc.
However, this format is not a full superset of JSON, and e.g. properties set on objects of such built-in types will not be passed on through the serialization step. Additionally, performance may not be equivalent to that of JSON, depending on the structure of the passed data. Therefore, this feature requires opting in by setting the serialization option to 'advanced' when calling child_process.spawn() or child_process.fork().


Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Cluster
How it works
Class: Worker
Event: 'disconnect'
Event: 'error'
Event: 'exit'
Event: 'listening'
Event: 'message'
Event: 'online'
worker.disconnect()
worker.exitedAfterDisconnect
worker.id
worker.isConnected()
worker.isDead()
worker.kill([signal])
worker.process
worker.send(message[, sendHandle[, options]][, callback])
Event: 'disconnect'
Event: 'exit'
Event: 'fork'
Event: 'listening'
Event: 'message'
Event: 'online'
Event: 'setup'
cluster.disconnect([callback])
cluster.fork([env])
cluster.isMaster
cluster.isPrimary
cluster.isWorker
cluster.schedulingPolicy
cluster.settings
cluster.setupMaster([settings])
cluster.setupPrimary([settings])
cluster.worker
cluster.workers
Cluster
#
Stability: 2 - Stable
Source Code: lib/cluster.js
Clusters of Node.js processes can be used to run multiple instances of Node.js that can distribute workloads among their application threads. When process isolation is not needed, use the worker_threads module instead, which allows running multiple application threads within a single Node.js instance.
The cluster module allows easy creation of child processes that all share server ports.
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
copy
Running Node.js will now share port 8000 between the workers:
$ node server.js
Primary 3596 is running
Worker 4324 started
Worker 4520 started
Worker 6056 started
Worker 5644 started
copy
On Windows, it is not yet possible to set up a named pipe server in a worker.
How it works
#
The worker processes are spawned using the child_process.fork() method, so that they can communicate with the parent via IPC and pass server handles back and forth.
The cluster module supports two methods of distributing incoming connections.
The first one (and the default one on all platforms except Windows) is the round-robin approach, where the primary process listens on a port, accepts new connections and distributes them across the workers in a round-robin fashion, with some built-in smarts to avoid overloading a worker process.
The second approach is where the primary process creates the listen socket and sends it to interested workers. The workers then accept incoming connections directly.
The second approach should, in theory, give the best performance. In practice however, distribution tends to be very unbalanced due to operating system scheduler vagaries. Loads have been observed where over 70% of all connections ended up in just two processes, out of a total of eight.
Because server.listen() hands off most of the work to the primary process, there are three cases where the behavior between a normal Node.js process and a cluster worker differs:
server.listen({fd: 7}) Because the message is passed to the primary, file descriptor 7 in the parent will be listened on, and the handle passed to the worker, rather than listening to the worker's idea of what the number 7 file descriptor references.
server.listen(handle) Listening on handles explicitly will cause the worker to use the supplied handle, rather than talk to the primary process.
server.listen(0) Normally, this will cause servers to listen on a random port. However, in a cluster, each worker will receive the same "random" port each time they do listen(0). In essence, the port is random the first time, but predictable thereafter. To listen on a unique port, generate a port number based on the cluster worker ID.
Node.js does not provide routing logic. It is therefore important to design an application such that it does not rely too heavily on in-memory data objects for things like sessions and login.
Because workers are all separate processes, they can be killed or re-spawned depending on a program's needs, without affecting other workers. As long as there are some workers still alive, the server will continue to accept connections. If no workers are alive, existing connections will be dropped and new connections will be refused. Node.js does not automatically manage the number of workers, however. It is the application's responsibility to manage the worker pool based on its own needs.
Although a primary use case for the node:cluster module is networking, it can also be used for other use cases requiring worker processes.
Class: Worker
#
Added in: v0.7.0
Extends: <EventEmitter>
A Worker object contains all public information and method about a worker. In the primary it can be obtained using cluster.workers. In a worker it can be obtained using cluster.worker.
Event: 'disconnect'
#
Added in: v0.7.7
Similar to the cluster.on('disconnect') event, but specific to this worker.
cluster.fork().on('disconnect', () => {
  // Worker has disconnected
});
copy
Event: 'error'
#
Added in: v0.7.3
This event is the same as the one provided by child_process.fork().
Within a worker, process.on('error') may also be used.
Event: 'exit'
#
Added in: v0.11.2
code <number> The exit code, if it exited normally.
signal <string> The name of the signal (e.g. 'SIGHUP') that caused the process to be killed.
Similar to the cluster.on('exit') event, but specific to this worker.
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker exited with error code: ${code}`);
    } else {
      console.log('worker success!');
    }
  });
}
copy
Event: 'listening'
#
Added in: v0.7.0
address <Object>
Similar to the cluster.on('listening') event, but specific to this worker.
cluster.fork().on('listening', (address) => {
  // Worker is listening
});
copy
It is not emitted in the worker.
Event: 'message'
#
Added in: v0.7.0
message <Object>
handle <undefined> | <Object>
Similar to the 'message' event of cluster, but specific to this worker.
Within a worker, process.on('message') may also be used.
See process event: 'message'.
Here is an example using the message system. It keeps a count in the primary process of the number of HTTP requests received by the workers:
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {

  // Keep track of http requests
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // Count requests
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // Start workers and listen for messages containing notifyRequest
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // Worker processes have a http server.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // Notify primary about the request
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
copy
Event: 'online'
#
Added in: v0.7.0
Similar to the cluster.on('online') event, but specific to this worker.
cluster.fork().on('online', () => {
  // Worker is online
});
copy
It is not emitted in the worker.
worker.disconnect()
#
History













Returns: <cluster.Worker> A reference to worker.
In a worker, this function will close all servers, wait for the 'close' event on those servers, and then disconnect the IPC channel.
In the primary, an internal message is sent to the worker causing it to call .disconnect() on itself.
Causes .exitedAfterDisconnect to be set.
After a server is closed, it will no longer accept new connections, but connections may be accepted by any other listening worker. Existing connections will be allowed to close as usual. When no more connections exist, see server.close(), the IPC channel to the worker will close allowing it to die gracefully.
The above applies only to server connections, client connections are not automatically closed by workers, and disconnect does not wait for them to close before exiting.
In a worker, process.disconnect exists, but it is not this function; it is disconnect().
Because long living server connections may block workers from disconnecting, it may be useful to send a message, so application specific actions may be taken to close them. It also may be useful to implement a timeout, killing a worker if the 'disconnect' event has not been emitted after some time.
if (cluster.isPrimary) {
  const worker = cluster.fork();
  let timeout;

  worker.on('listening', (address) => {
    worker.send('shutdown');
    worker.disconnect();
    timeout = setTimeout(() => {
      worker.kill();
    }, 2000);
  });

  worker.on('disconnect', () => {
    clearTimeout(timeout);
  });

} else if (cluster.isWorker) {
  const net = require('node:net');
  const server = net.createServer((socket) => {
    // Connections never end
  });

  server.listen(8000);

  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      // Initiate graceful close of any connections to server
    }
  });
}
copy
worker.exitedAfterDisconnect
#
Added in: v6.0.0
<boolean>
This property is true if the worker exited due to .disconnect(). If the worker exited any other way, it is false. If the worker has not exited, it is undefined.
The boolean worker.exitedAfterDisconnect allows distinguishing between voluntary and accidental exit, the primary may choose not to respawn a worker based on this value.
cluster.on('exit', (worker, code, signal) => {
  if (worker.exitedAfterDisconnect === true) {
    console.log('Oh, it was just voluntary – no need to worry');
  }
});

// kill worker
worker.kill();
copy
worker.id
#
Added in: v0.8.0
<integer>
Each new worker is given its own unique id, this id is stored in the id.
While a worker is alive, this is the key that indexes it in cluster.workers.
worker.isConnected()
#
Added in: v0.11.14
This function returns true if the worker is connected to its primary via its IPC channel, false otherwise. A worker is connected to its primary after it has been created. It is disconnected after the 'disconnect' event is emitted.
worker.isDead()
#
Added in: v0.11.14
This function returns true if the worker's process has terminated (either because of exiting or being signaled). Otherwise, it returns false.
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log('worker is dead:', worker.isDead());
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker is dead:', worker.isDead());
  });
} else {
  // Workers can share any TCP connection. In this case, it is an HTTP server.
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Current process\n ${process.pid}`);
    process.kill(process.pid);
  }).listen(8000);
}
copy
worker.kill([signal])
#
Added in: v0.9.12
signal <string> Name of the kill signal to send to the worker process. Default: 'SIGTERM'
This function will kill the worker. In the primary worker, it does this by disconnecting the worker.process, and once disconnected, killing with signal. In the worker, it does it by killing the process with signal.
The kill() function kills the worker process without waiting for a graceful disconnect, it has the same behavior as worker.process.kill().
This method is aliased as worker.destroy() for backwards compatibility.
In a worker, process.kill() exists, but it is not this function; it is kill().
worker.process
#
Added in: v0.7.0
<ChildProcess>
All workers are created using child_process.fork(), the returned object from this function is stored as .process. In a worker, the global process is stored.
See: Child Process module.
Workers will call process.exit(0) if the 'disconnect' event occurs on process and .exitedAfterDisconnect is not true. This protects against accidental disconnection.
worker.send(message[, sendHandle[, options]][, callback])
#
History













message <Object>
sendHandle <Handle>
options <Object> The options argument, if present, is an object used to parameterize the sending of certain types of handles. options supports the following properties:
keepOpen <boolean> A value that can be used when passing instances of net.Socket. When true, the socket is kept open in the sending process. Default: false.
callback <Function>
Returns: <boolean>
Send a message to a worker or primary, optionally with a handle.
In the primary, this sends a message to a specific worker. It is identical to ChildProcess.send().
In a worker, this sends a message to the primary. It is identical to process.send().
This example will echo back all messages from the primary:
if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.send('hi there');

} else if (cluster.isWorker) {
  process.on('message', (msg) => {
    process.send(msg);
  });
}
copy
Event: 'disconnect'
#
Added in: v0.7.9
worker <cluster.Worker>
Emitted after the worker IPC channel has disconnected. This can occur when a worker exits gracefully, is killed, or is disconnected manually (such as with worker.disconnect()).
There may be a delay between the 'disconnect' and 'exit' events. These events can be used to detect if the process is stuck in a cleanup or if there are long-living connections.
cluster.on('disconnect', (worker) => {
  console.log(`The worker #${worker.id} has disconnected`);
});
copy
Event: 'exit'
#
Added in: v0.7.9
worker <cluster.Worker>
code <number> The exit code, if it exited normally.
signal <string> The name of the signal (e.g. 'SIGHUP') that caused the process to be killed.
When any of the workers die the cluster module will emit the 'exit' event.
This can be used to restart the worker by calling .fork() again.
cluster.on('exit', (worker, code, signal) => {
  console.log('worker %d died (%s). restarting...',
              worker.process.pid, signal || code);
  cluster.fork();
});
copy
See child_process event: 'exit'.
Event: 'fork'
#
Added in: v0.7.0
worker <cluster.Worker>
When a new worker is forked the cluster module will emit a 'fork' event. This can be used to log worker activity, and create a custom timeout.
const timeouts = [];
function errorMsg() {
  console.error('Something must be wrong with the connection ...');
}

cluster.on('fork', (worker) => {
  timeouts[worker.id] = setTimeout(errorMsg, 2000);
});
cluster.on('listening', (worker, address) => {
  clearTimeout(timeouts[worker.id]);
});
cluster.on('exit', (worker, code, signal) => {
  clearTimeout(timeouts[worker.id]);
  errorMsg();
});
copy
Event: 'listening'
#
Added in: v0.7.0
worker <cluster.Worker>
address <Object>
After calling listen() from a worker, when the 'listening' event is emitted on the server, a 'listening' event will also be emitted on cluster in the primary.
The event handler is executed with two arguments, the worker contains the worker object and the address object contains the following connection properties: address, port, and addressType. This is very useful if the worker is listening on more than one address.
cluster.on('listening', (worker, address) => {
  console.log(
    `A worker is now connected to ${address.address}:${address.port}`);
});
copy
The addressType is one of:
4 (TCPv4)
6 (TCPv6)
-1 (Unix domain socket)
'udp4' or 'udp6' (UDPv4 or UDPv6)
Event: 'message'
#
History













worker <cluster.Worker>
message <Object>
handle <undefined> | <Object>
Emitted when the cluster primary receives a message from any worker.
See child_process event: 'message'.
Event: 'online'
#
Added in: v0.7.0
worker <cluster.Worker>
After forking a new worker, the worker should respond with an online message. When the primary receives an online message it will emit this event. The difference between 'fork' and 'online' is that fork is emitted when the primary forks a worker, and 'online' is emitted when the worker is running.
cluster.on('online', (worker) => {
  console.log('Yay, the worker responded after it was forked');
});
copy
Event: 'setup'
#
Added in: v0.7.1
settings <Object>
Emitted every time .setupPrimary() is called.
The settings object is the cluster.settings object at the time .setupPrimary() was called and is advisory only, since multiple calls to .setupPrimary() can be made in a single tick.
If accuracy is important, use cluster.settings.
cluster.disconnect([callback])
#
Added in: v0.7.7
callback <Function> Called when all workers are disconnected and handles are closed.
Calls .disconnect() on each worker in cluster.workers.
When they are disconnected all internal handles will be closed, allowing the primary process to die gracefully if no other event is waiting.
The method takes an optional callback argument which will be called when finished.
This can only be called from the primary process.
cluster.fork([env])
#
Added in: v0.6.0
env <Object> Key/value pairs to add to worker process environment.
Returns: <cluster.Worker>
Spawn a new worker process.
This can only be called from the primary process.
cluster.isMaster
#
Added in: v0.8.1Deprecated since: v16.0.0
Stability: 0 - Deprecated
Deprecated alias for cluster.isPrimary.
cluster.isPrimary
#
Added in: v16.0.0
<boolean>
True if the process is a primary. This is determined by the process.env.NODE_UNIQUE_ID. If process.env.NODE_UNIQUE_ID is undefined, then isPrimary is true.
cluster.isWorker
#
Added in: v0.6.0
<boolean>
True if the process is not a primary (it is the negation of cluster.isPrimary).
cluster.schedulingPolicy
#
Added in: v0.11.2
The scheduling policy, either cluster.SCHED_RR for round-robin or cluster.SCHED_NONE to leave it to the operating system. This is a global setting and effectively frozen once either the first worker is spawned, or .setupPrimary() is called, whichever comes first.
SCHED_RR is the default on all operating systems except Windows. Windows will change to SCHED_RR once libuv is able to effectively distribute IOCP handles without incurring a large performance hit.
cluster.schedulingPolicy can also be set through the NODE_CLUSTER_SCHED_POLICY environment variable. Valid values are 'rr' and 'none'.
cluster.settings
#
History





























<Object>
execArgv <string[]> List of string arguments passed to the Node.js executable. Default: process.execArgv.
exec <string> File path to worker file. Default: process.argv[1].
args <string[]> String arguments passed to worker. Default: process.argv.slice(2).
cwd <string> Current working directory of the worker process. Default: undefined (inherits from parent process).
serialization <string> Specify the kind of serialization used for sending messages between processes. Possible values are 'json' and 'advanced'. See Advanced serialization for child_process for more details. Default: false.
silent <boolean> Whether or not to send output to parent's stdio. Default: false.
stdio <Array> Configures the stdio of forked processes. Because the cluster module relies on IPC to function, this configuration must contain an 'ipc' entry. When this option is provided, it overrides silent. See child_process.spawn()'s stdio.
uid <number> Sets the user identity of the process. (See setuid(2).)
gid <number> Sets the group identity of the process. (See setgid(2).)
inspectPort <number> | <Function> Sets inspector port of worker. This can be a number, or a function that takes no arguments and returns a number. By default each worker gets its own port, incremented from the primary's process.debugPort.
windowsHide <boolean> Hide the forked processes console window that would normally be created on Windows systems. Default: false.
After calling .setupPrimary() (or .fork()) this settings object will contain the settings, including the default values.
This object is not intended to be changed or set manually.
cluster.setupMaster([settings])
#
History

















Stability: 0 - Deprecated
Deprecated alias for .setupPrimary().
cluster.setupPrimary([settings])
#
Added in: v16.0.0
settings <Object> See cluster.settings.
setupPrimary is used to change the default 'fork' behavior. Once called, the settings will be present in cluster.settings.
Any settings changes only affect future calls to .fork() and have no effect on workers that are already running.
The only attribute of a worker that cannot be set via .setupPrimary() is the env passed to .fork().
The defaults above apply to the first call only; the defaults for later calls are the current values at the time of cluster.setupPrimary() is called.
const cluster = require('node:cluster');

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // https worker
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // http worker
copy
This can only be called from the primary process.
cluster.worker
#
Added in: v0.7.0
<Object>
A reference to the current worker object. Not available in the primary process.
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  console.log('I am primary');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`I am worker #${cluster.worker.id}`);
}
copy
cluster.workers
#
Added in: v0.7.0
<Object>
A hash that stores the active worker objects, keyed by id field. This makes it easy to loop through all the workers. It is only available in the primary process.
A worker is removed from cluster.workers after the worker has disconnected and exited. The order between these two events cannot be determined in advance. However, it is guaranteed that the removal from the cluster.workers list happens before the last 'disconnect' or 'exit' event is emitted.
const cluster = require('node:cluster');

for (const worker of Object.values(cluster.workers)) {
  worker.send('big announcement to all workers');
}
copy
Node.jNode.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Command-line API
Synopsis
Program entry point
ECMAScript modules loader entry point caveat
Options
-
--
--abort-on-uncaught-exception
--allow-addons
--allow-child-process
--allow-fs-read
--allow-fs-write
--allow-wasi
--allow-worker
--build-snapshot
--build-snapshot-config
-c, --check
--completion-bash
-C condition, --conditions=condition
--cpu-prof
--cpu-prof-dir
--cpu-prof-interval
--cpu-prof-name
--diagnostic-dir=directory
--disable-proto=mode
--disable-sigusr1
--disable-warning=code-or-type
--disable-wasm-trap-handler
--disallow-code-generation-from-strings
--dns-result-order=order
--enable-fips
--enable-network-family-autoselection
--enable-source-maps
--entry-url
--env-file-if-exists=config
--env-file=config
-e, --eval "script"
--experimental-addon-modules
--experimental-config-file=config
--experimental-default-config-file
--experimental-eventsource
--experimental-import-meta-resolve
--experimental-loader=module
--experimental-network-inspection
--experimental-print-required-tla
--experimental-require-module
--experimental-sea-config
--experimental-shadow-realm
--experimental-test-coverage
--experimental-test-module-mocks
--experimental-transform-types
--experimental-vm-modules
--experimental-wasi-unstable-preview1
--experimental-wasm-modules
--experimental-webstorage
--experimental-worker-inspection
--expose-gc
--force-context-aware
--force-fips
--force-node-api-uncaught-exceptions-policy
--frozen-intrinsics
--heap-prof
--heap-prof-dir
--heap-prof-interval
--heap-prof-name
--heapsnapshot-near-heap-limit=max_count
--heapsnapshot-signal=signal
-h, --help
--icu-data-dir=file
--import=module
--input-type=type
--insecure-http-parser
Warning: binding inspector to a public IP:port combination is insecure
--inspect-brk[=[host:]port]
--inspect-port=[host:]port
--inspect-publish-uid=stderr,http
--inspect-wait[=[host:]port]
--inspect[=[host:]port]
-i, --interactive
--jitless
--localstorage-file=file
--max-http-header-size=size
--napi-modules
--network-family-autoselection-attempt-timeout
--no-addons
--no-async-context-frame
--no-deprecation
--no-experimental-detect-module
--no-experimental-global-navigator
--no-experimental-repl-await
--no-experimental-require-module
--no-experimental-sqlite
--no-experimental-strip-types
--no-experimental-websocket
--no-extra-info-on-fatal-exception
--no-force-async-hooks-checks
--no-global-search-paths
--no-network-family-autoselection
--no-warnings
--node-memory-debug
--openssl-config=file
--openssl-legacy-provider
--openssl-shared-config
--pending-deprecation
--permission
--preserve-symlinks
--preserve-symlinks-main
-p, --print "script"
--prof
--prof-process
--redirect-warnings=file
--report-compact
--report-dir=directory, report-directory=directory
--report-exclude-env
--report-exclude-network
--report-filename=filename
--report-on-fatalerror
--report-on-signal
--report-signal=signal
--report-uncaught-exception
-r, --require module
--run
Intentional limitations
Environment variables
--secure-heap-min=n
--secure-heap=n
--snapshot-blob=path
--test
--test-concurrency
--test-coverage-branches=threshold
--test-coverage-exclude
--test-coverage-functions=threshold
--test-coverage-include
--test-coverage-lines=threshold
--test-force-exit
--test-global-setup=module
--test-isolation=mode
--test-name-pattern
--test-only
--test-reporter
--test-reporter-destination
--test-shard
--test-skip-pattern
--test-timeout
--test-update-snapshots
--throw-deprecation
--title=title
--tls-cipher-list=list
--tls-keylog=file
--tls-max-v1.2
--tls-max-v1.3
--tls-min-v1.0
--tls-min-v1.1
--tls-min-v1.2
--tls-min-v1.3
--trace-deprecation
--trace-env
--trace-env-js-stack
--trace-env-native-stack
--trace-event-categories
--trace-event-file-pattern
--trace-events-enabled
--trace-exit
--trace-require-module=mode
--trace-sigint
--trace-sync-io
--trace-tls
--trace-uncaught
--trace-warnings
--track-heap-objects
--unhandled-rejections=mode
--use-bundled-ca, --use-openssl-ca
--use-largepages=mode
--use-system-ca
--v8-options
--v8-pool-size=num
-v, --version
--watch
--watch-kill-signal
--watch-path
--watch-preserve-output
--zero-fill-buffers
Environment variables
FORCE_COLOR=[1, 2, 3]
NODE_COMPILE_CACHE=dir
NODE_DEBUG=module[,…]
NODE_DEBUG_NATIVE=module[,…]
NODE_DISABLE_COLORS=1
NODE_DISABLE_COMPILE_CACHE=1
NODE_EXTRA_CA_CERTS=file
NODE_ICU_DATA=file
NODE_NO_WARNINGS=1
NODE_OPTIONS=options...
NODE_PATH=path[:…]
NODE_PENDING_DEPRECATION=1
NODE_PENDING_PIPE_INSTANCES=instances
NODE_PRESERVE_SYMLINKS=1
NODE_REDIRECT_WARNINGS=file
NODE_REPL_EXTERNAL_MODULE=file
NODE_REPL_HISTORY=file
NODE_SKIP_PLATFORM_CHECK=value
NODE_TEST_CONTEXT=value
NODE_TLS_REJECT_UNAUTHORIZED=value
NODE_USE_ENV_PROXY=1
NODE_V8_COVERAGE=dir
Coverage output
Source map cache
NO_COLOR=<any>
OPENSSL_CONF=file
SSL_CERT_DIR=dir
SSL_CERT_FILE=file
TZ
UV_THREADPOOL_SIZE=size
Useful V8 options
--abort-on-uncaught-exception
--disallow-code-generation-from-strings
--enable-etw-stack-walking
--expose-gc
--harmony-shadow-realm
--interpreted-frames-native-stack
--jitless
--max-old-space-size=SIZE (in MiB)
--max-semi-space-size=SIZE (in MiB)
--perf-basic-prof
--perf-basic-prof-only-functions
--perf-prof
--perf-prof-unwinding-info
--prof
--security-revert
--stack-trace-limit=limit
Command-line API
#
Node.js comes with a variety of CLI options. These options expose built-in debugging, multiple ways to execute scripts, and other helpful runtime options.
To view this documentation as a manual page in a terminal, run man node.
Synopsis
#
node [options] [V8 options] [<program-entry-point> | -e "script" | -] [--] [arguments]
node inspect [<program-entry-point> | -e "script" | <host>:<port>] …
node --v8-options
Execute without arguments to start the REPL.
For more info about node inspect, see the debugger documentation.
Program entry point
#
The program entry point is a specifier-like string. If the string is not an absolute path, it's resolved as a relative path from the current working directory. That path is then resolved by CommonJS module loader. If no corresponding file is found, an error is thrown.
If a file is found, its path will be passed to the ES module loader under any of the following conditions:
The program was started with a command-line flag that forces the entry point to be loaded with ECMAScript module loader, such as --import.
The file has an .mjs or .wasm (with --experimental-wasm-modules) extension.
The file does not have a .cjs extension, and the nearest parent package.json file contains a top-level "type" field with a value of "module".
Otherwise, the file is loaded using the CommonJS module loader. See Modules loaders for more details.
ECMAScript modules loader entry point caveat
#
When loading, the ES module loader loads the program entry point, the node command will accept as input only files with .js, .mjs, or .cjs extensions. With the following flags, additional file extensions are enabled:
--experimental-wasm-modules for files with .wasm extension.
--experimental-addon-modules for files with .node extension.
Options
#
History









Stability: 2 - Stable
All options, including V8 options, allow words to be separated by both dashes (-) or underscores (_). For example, --pending-deprecation is equivalent to --pending_deprecation.
If an option that takes a single value (such as --max-http-header-size) is passed more than once, then the last passed value is used. Options from the command line take precedence over options passed through the NODE_OPTIONS environment variable.
-
#
Added in: v8.0.0
Alias for stdin. Analogous to the use of - in other command-line utilities, meaning that the script is read from stdin, and the rest of the options are passed to that script.
--
#
Added in: v6.11.0
Indicate the end of node options. Pass the rest of the arguments to the script. If no script filename or eval/print script is supplied prior to this, then the next argument is used as a script filename.
--abort-on-uncaught-exception
#
Added in: v0.10.8
Aborting instead of exiting causes a core file to be generated for post-mortem analysis using a debugger (such as lldb, gdb, and mdb).
If this flag is passed, the behavior can still be set to not abort through process.setUncaughtExceptionCaptureCallback() (and through usage of the node:domain module that uses it).
--allow-addons
#
Added in: v21.6.0, v20.12.0
Stability: 1.1 - Active development
When using the Permission Model, the process will not be able to use native addons by default. Attempts to do so will throw an ERR_DLOPEN_DISABLED unless the user explicitly passes the --allow-addons flag when starting Node.js.
Example:
// Attempt to require an native addon
require('nodejs-addon-example');
copy
$ node --permission --allow-fs-read=* index.js
node:internal/modules/cjs/loader:1319
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^


Error: Cannot load native addon because loading addons is disabled.
    at Module._extensions..node (node:internal/modules/cjs/loader:1319:18)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Module.require (node:internal/modules/cjs/loader:1115:19)
    at require (node:internal/modules/helpers:130:18)
    at Object.<anonymous> (/home/index.js:1:15)
    at Module._compile (node:internal/modules/cjs/loader:1233:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1287:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12) {
  code: 'ERR_DLOPEN_DISABLED'
}
copy
--allow-child-process
#
History













Stability: 1.1 - Active development
When using the Permission Model, the process will not be able to spawn any child process by default. Attempts to do so will throw an ERR_ACCESS_DENIED unless the user explicitly passes the --allow-child-process flag when starting Node.js.
Example:
const childProcess = require('node:child_process');
// Attempt to bypass the permission
childProcess.spawn('node', ['-e', 'require("fs").writeFileSync("/new-file", "example")']);
copy
$ node --permission --allow-fs-read=* index.js
node:internal/child_process:388
  const err = this._handle.spawn(options);
                           ^
Error: Access to this API has been restricted
    at ChildProcess.spawn (node:internal/child_process:388:28)
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'ChildProcess'
}
copy
The child_process.fork() API inherits the execution arguments from the parent process. This means that if Node.js is started with the Permission Model enabled and the --allow-child-process flag is set, any child process created using child_process.fork() will automatically receive all relevant Permission Model flags.
This behavior also applies to child_process.spawn(), but in that case, the flags are propagated via the NODE_OPTIONS environment variable rather than directly through the process arguments.
--allow-fs-read
#
History





















This flag configures file system read permissions using the Permission Model.
The valid arguments for the --allow-fs-read flag are:
* - To allow all FileSystemRead operations.
Multiple paths can be allowed using multiple --allow-fs-read flags. Example --allow-fs-read=/folder1/ --allow-fs-read=/folder1/
Examples can be found in the File System Permissions documentation.
The initializer module and custom --require modules has a implicit read permission.
$ node --permission -r custom-require.js -r custom-require-2.js index.js
copy
The custom-require.js, custom-require-2.js, and index.js will be by default in the allowed read list.
process.has('fs.read', 'index.js'); // true
process.has('fs.read', 'custom-require.js'); // true
process.has('fs.read', 'custom-require-2.js'); // true
copy
--allow-fs-write
#
History

















This flag configures file system write permissions using the Permission Model.
The valid arguments for the --allow-fs-write flag are:
* - To allow all FileSystemWrite operations.
Multiple paths can be allowed using multiple --allow-fs-write flags. Example --allow-fs-write=/folder1/ --allow-fs-write=/folder1/
Paths delimited by comma (,) are no longer allowed. When passing a single flag with a comma a warning will be displayed.
Examples can be found in the File System Permissions documentation.
--allow-wasi
#
Added in: v22.3.0, v20.16.0
Stability: 1.1 - Active development
When using the Permission Model, the process will not be capable of creating any WASI instances by default. For security reasons, the call will throw an ERR_ACCESS_DENIED unless the user explicitly passes the flag --allow-wasi in the main Node.js process.
Example:
const { WASI } = require('node:wasi');
// Attempt to bypass the permission
new WASI({
  version: 'preview1',
  // Attempt to mount the whole filesystem
  preopens: {
    '/': '/',
  },
});
copy
$ node --permission --allow-fs-read=* index.js


Error: Access to this API has been restricted
    at node:internal/main/run_main_module:30:49 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WASI',
}
copy
--allow-worker
#
Added in: v20.0.0
Stability: 1.1 - Active development
When using the Permission Model, the process will not be able to create any worker threads by default. For security reasons, the call will throw an ERR_ACCESS_DENIED unless the user explicitly pass the flag --allow-worker in the main Node.js process.
Example:
const { Worker } = require('node:worker_threads');
// Attempt to bypass the permission
new Worker(__filename);
copy
$ node --permission --allow-fs-read=* index.js


Error: Access to this API has been restricted
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WorkerThreads'
}
copy
--build-snapshot
#
Added in: v18.8.0
Stability: 1 - Experimental
Generates a snapshot blob when the process exits and writes it to disk, which can be loaded later with --snapshot-blob.
When building the snapshot, if --snapshot-blob is not specified, the generated blob will be written, by default, to snapshot.blob in the current working directory. Otherwise it will be written to the path specified by --snapshot-blob.
$ echo "globalThis.foo = 'I am from the snapshot'" > snapshot.js


# Run snapshot.js to initialize the application and snapshot the
# state of it into snapshot.blob.
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js


$ echo "console.log(globalThis.foo)" > index.js


# Load the generated snapshot and start the application from index.js.
$ node --snapshot-blob snapshot.blob index.js
I am from the snapshot
copy
The v8.startupSnapshot API can be used to specify an entry point at snapshot building time, thus avoiding the need of an additional entry script at deserialization time:
$ echo "require('v8').startupSnapshot.setDeserializeMainFunction(() => console.log('I am from the snapshot'))" > snapshot.js
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js
$ node --snapshot-blob snapshot.blob
I am from the snapshot
copy
For more information, check out the v8.startupSnapshot API documentation.
Currently the support for run-time snapshot is experimental in that:
User-land modules are not yet supported in the snapshot, so only one single file can be snapshotted. Users can bundle their applications into a single script with their bundler of choice before building a snapshot, however.
Only a subset of the built-in modules work in the snapshot, though the Node.js core test suite checks that a few fairly complex applications can be snapshotted. Support for more modules are being added. If any crashes or buggy behaviors occur when building a snapshot, please file a report in the Node.js issue tracker and link to it in the tracking issue for user-land snapshots.
--build-snapshot-config
#
Added in: v21.6.0, v20.12.0
Stability: 1 - Experimental
Specifies the path to a JSON configuration file which configures snapshot creation behavior.
The following options are currently supported:
builder <string> Required. Provides the name to the script that is executed before building the snapshot, as if --build-snapshot had been passed with builder as the main script name.
withoutCodeCache <boolean> Optional. Including the code cache reduces the time spent on compiling functions included in the snapshot at the expense of a bigger snapshot size and potentially breaking portability of the snapshot.
When using this flag, additional script files provided on the command line will not be executed and instead be interpreted as regular command line arguments.
-c, --check
#
History













Syntax check the script without executing.
--completion-bash
#
Added in: v10.12.0
Print source-able bash completion script for Node.js.
node --completion-bash > node_bash_completion
source node_bash_completion
copy
-C condition, --conditions=condition
#
History













Provide custom conditional exports resolution conditions.
Any number of custom string condition names are permitted.
The default Node.js conditions of "node", "default", "import", and "require" will always apply as defined.
For example, to run a module with "development" resolutions:
node -C development app.js
copy
--cpu-prof
#
History













Starts the V8 CPU profiler on start up, and writes the CPU profile to disk before exit.
If --cpu-prof-dir is not specified, the generated profile is placed in the current working directory.
If --cpu-prof-name is not specified, the generated profile is named CPU.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.cpuprofile.
$ node --cpu-prof index.js
$ ls *.cpuprofile
CPU.20190409.202950.15293.0.0.cpuprofile
copy
If --cpu-prof-name is specified, the provided value will be used as-is; patterns such as ${hhmmss} or ${pid} are not supported.
$ node --cpu-prof --cpu-prof-name 'CPU.${pid}.cpuprofile' index.js
$ ls *.cpuprofile
'CPU.${pid}.cpuprofile'
copy
--cpu-prof-dir
#
History













Specify the directory where the CPU profiles generated by --cpu-prof will be placed.
The default value is controlled by the --diagnostic-dir command-line option.
--cpu-prof-interval
#
History













Specify the sampling interval in microseconds for the CPU profiles generated by --cpu-prof. The default is 1000 microseconds.
--cpu-prof-name
#
History













Specify the file name of the CPU profile generated by --cpu-prof.
--diagnostic-dir=directory
#
Set the directory to which all diagnostic output files are written. Defaults to current working directory.
Affects the default output directory of:
--cpu-prof-dir
--heap-prof-dir
--redirect-warnings
--disable-proto=mode
#
Added in: v13.12.0, v12.17.0
Disable the Object.prototype.__proto__ property. If mode is delete, the property is removed entirely. If mode is throw, accesses to the property throw an exception with the code ERR_PROTO_ACCESS.
--disable-sigusr1
#
Added in: v23.7.0, v22.14.0
Stability: 1.2 - Release candidate
Disable the ability of starting a debugging session by sending a SIGUSR1 signal to the process.
--disable-warning=code-or-type
#
Added in: v21.3.0, v20.11.0
Stability: 1.1 - Active development
Disable specific process warnings by code or type.
Warnings emitted from process.emitWarning() may contain a code and a type. This option will not-emit warnings that have a matching code or type.
List of deprecation warnings.
The Node.js core warning types are: DeprecationWarning and ExperimentalWarning
For example, the following script will not emit DEP0025 require('node:sys') when executed with node --disable-warning=DEP0025:
const sys = require('node:sys');
copy
For example, the following script will emit the DEP0025 require('node:sys'), but not any Experimental Warnings (such as ExperimentalWarning: vm.measureMemory is an experimental feature in <=v21) when executed with node --disable-warning=ExperimentalWarning:
const sys = require('node:sys');
const vm = require('node:vm');


vm.measureMemory();
copy
--disable-wasm-trap-handler
#
Added in: v22.2.0, v20.15.0
By default, Node.js enables trap-handler-based WebAssembly bound checks. As a result, V8 does not need to insert inline bound checks int the code compiled from WebAssembly which may speedup WebAssembly execution significantly, but this optimization requires allocating a big virtual memory cage (currently 10GB). If the Node.js process does not have access to a large enough virtual memory address space due to system configurations or hardware limitations, users won't be able to run any WebAssembly that involves allocation in this virtual memory cage and will see an out-of-memory error.
$ ulimit -v 5000000
$ node -p "new WebAssembly.Memory({ initial: 10, maximum: 100 });"
[eval]:1
new WebAssembly.Memory({ initial: 10, maximum: 100 });
^


RangeError: WebAssembly.Memory(): could not allocate memory
    at [eval]:1:1
    at runScriptInThisContext (node:internal/vm:209:10)
    at node:internal/process/execution:118:14
    at [eval]-wrapper:6:24
    at runScript (node:internal/process/execution:101:62)
    at evalScript (node:internal/process/execution:136:3)
    at node:internal/main/eval_string:49:3

copy
--disable-wasm-trap-handler disables this optimization so that users can at least run WebAssembly (with less optimal performance) when the virtual memory address space available to their Node.js process is lower than what the V8 WebAssembly memory cage needs.
--disallow-code-generation-from-strings
#
Added in: v9.8.0
Make built-in language features like eval and new Function that generate code from strings throw an exception instead. This does not affect the Node.js node:vm module.
--dns-result-order=order
#
History

















Set the default value of order in dns.lookup() and dnsPromises.lookup(). The value could be:
ipv4first: sets default order to ipv4first.
ipv6first: sets default order to ipv6first.
verbatim: sets default order to verbatim.
The default is verbatim and dns.setDefaultResultOrder() have higher priority than --dns-result-order.
--enable-fips
#
Added in: v6.0.0
Enable FIPS-compliant crypto at startup. (Requires Node.js to be built against FIPS-compatible OpenSSL.)
--enable-network-family-autoselection
#
Added in: v18.18.0
Enables the family autoselection algorithm unless connection options explicitly disables it.
--enable-source-maps
#
History













Enable Source Map support for stack traces.
When using a transpiler, such as TypeScript, stack traces thrown by an application reference the transpiled code, not the original source position. --enable-source-maps enables caching of Source Maps and makes a best effort to report stack traces relative to the original source file.
Overriding Error.prepareStackTrace may prevent --enable-source-maps from modifying the stack trace. Call and return the results of the original Error.prepareStackTrace in the overriding function to modify the stack trace with source maps.
const originalPrepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (error, trace) => {
  // Modify error and trace and format stack trace with
  // original Error.prepareStackTrace.
  return originalPrepareStackTrace(error, trace);
};
copy
Note, enabling source maps can introduce latency to your application when Error.stack is accessed. If you access Error.stack frequently in your application, take into account the performance implications of --enable-source-maps.
--entry-url
#
Added in: v23.0.0, v22.10.0
Stability: 1 - Experimental
When present, Node.js will interpret the entry point as a URL, rather than a path.
Follows ECMAScript module resolution rules.
Any query parameter or hash in the URL will be accessible via import.meta.url.
node --entry-url 'file:///path/to/file.js?queryparams=work#and-hashes-too'
node --entry-url 'file.ts?query#hash'
node --entry-url 'data:text/javascript,console.log("Hello")'
copy
--env-file-if-exists=config
#
Added in: v22.9.0
Stability: 1.1 - Active development
Behavior is the same as --env-file, but an error is not thrown if the file does not exist.
--env-file=config
#
History













Stability: 1.1 - Active development
Loads environment variables from a file relative to the current directory, making them available to applications on process.env. The environment variables which configure Node.js, such as NODE_OPTIONS, are parsed and applied. If the same variable is defined in the environment and in the file, the value from the environment takes precedence.
You can pass multiple --env-file arguments. Subsequent files override pre-existing variables defined in previous files.
An error is thrown if the file does not exist.
node --env-file=.env --env-file=.development.env index.js
copy
The format of the file should be one line per key-value pair of environment variable name and value separated by =:
PORT=3000
copy
Any text after a # is treated as a comment:
# This is a comment
PORT=3000 # This is also a comment
copy
Values can start and end with the following quotes: `, " or '. They are omitted from the values.
USERNAME="nodejs" # will result in `nodejs` as the value.
copy
Multi-line values are supported:
MULTI_LINE="THIS IS
A MULTILINE"
# will result in `THIS IS\nA MULTILINE` as the value.
copy
Export keyword before a key is ignored:
export USERNAME="nodejs" # will result in `nodejs` as the value.
copy
If you want to load environment variables from a file that may not exist, you can use the --env-file-if-exists flag instead.
-e, --eval "script"
#
History

















Evaluate the following argument as JavaScript. The modules which are predefined in the REPL can also be used in script.
On Windows, using cmd.exe a single quote will not work correctly because it only recognizes double " for quoting. In Powershell or Git bash, both ' and " are usable.
It is possible to run code containing inline types unless the --no-experimental-strip-types flag is provided.
--experimental-addon-modules
#
Added in: v23.6.0
Stability: 1.0 - Early development
Enable experimental import support for .node addons.
--experimental-config-file=config
#
Added in: v23.10.0
Stability: 1.0 - Early development
If present, Node.js will look for a configuration file at the specified path. Node.js will read the configuration file and apply the settings. The configuration file should be a JSON file with the following structure. vX.Y.Z in the $schema must be replaced with the version of Node.js you are using.
{
  "$schema": "https://nodejs.org/dist/vX.Y.Z/docs/node-config-schema.json",
  "nodeOptions": {
    "import": [
      "amaro/strip"
    ],
    "watch-path": "src",
    "watch-preserve-output": true
  },
  "testRunner": {
    "test-isolation": "process"
  }
}
copy
The configuration file supports namespace-specific options:
The nodeOptions field contains CLI flags that are allowed in NODE_OPTIONS.
Namespace fields like testRunner contain configuration specific to that subsystem.
No-op flags are not supported. Not all V8 flags are currently supported.
It is possible to use the official JSON schema to validate the configuration file, which may vary depending on the Node.js version. Each key in the configuration file corresponds to a flag that can be passed as a command-line argument. The value of the key is the value that would be passed to the flag.
For example, the configuration file above is equivalent to the following command-line arguments:
node --import amaro/strip --watch-path=src --watch-preserve-output --test-isolation=process
copy
The priority in configuration is as follows:
NODE_OPTIONS and command-line options
Configuration file
Dotenv NODE_OPTIONS
Values in the configuration file will not override the values in the environment variables and command-line options, but will override the values in the NODE_OPTIONS env file parsed by the --env-file flag.
Keys cannot be duplicated within the same or different namespaces.
The configuration parser will throw an error if the configuration file contains unknown keys or keys that cannot be used in a namespace.
Node.js will not sanitize or perform validation on the user-provided configuration, so NEVER use untrusted configuration files.
--experimental-default-config-file
#
Added in: v23.10.0
Stability: 1.0 - Early development
If the --experimental-default-config-file flag is present, Node.js will look for a node.config.json file in the current working directory and load it as a as configuration file.
--experimental-eventsource
#
Added in: v22.3.0, v20.18.0
Enable exposition of EventSource Web API on the global scope.
--experimental-import-meta-resolve
#
History













Enable experimental import.meta.resolve() parent URL support, which allows passing a second parentURL argument for contextual resolution.
Previously gated the entire import.meta.resolve feature.
--experimental-loader=module
#
History

















This flag is discouraged and may be removed in a future version of Node.js. Please use --import with register() instead.
Specify the module containing exported module customization hooks. module may be any string accepted as an import specifier.
This feature requires --allow-worker if used with the Permission Model.
--experimental-network-inspection
#
Added in: v22.6.0, v20.18.0
Stability: 1 - Experimental
Enable experimental support for the network inspection with Chrome DevTools.
--experimental-print-required-tla
#
Added in: v22.0.0, v20.17.0
If the ES module being require()'d contains top-level await, this flag allows Node.js to evaluate the module, try to locate the top-level awaits, and print their location to help users find them.
--experimental-require-module
#
History













Stability: 1.1 - Active Development
Supports loading a synchronous ES module graph in require().
See Loading ECMAScript modules using require().
--experimental-sea-config
#
Added in: v20.0.0
Stability: 1 - Experimental
Use this flag to generate a blob that can be injected into the Node.js binary to produce a single executable application. See the documentation about this configuration for details.
--experimental-shadow-realm
#
Added in: v19.0.0, v18.13.0
Use this flag to enable ShadowRealm support.
--experimental-test-coverage
#
History













When used in conjunction with the node:test module, a code coverage report is generated as part of the test runner output. If no tests are run, a coverage report is not generated. See the documentation on collecting code coverage from tests for more details.
--experimental-test-module-mocks
#
History













Stability: 1.0 - Early development
Enable module mocking in the test runner.
This feature requires --allow-worker if used with the Permission Model.
--experimental-transform-types
#
Added in: v22.7.0
Stability: 1.2 - Release candidate
Enables the transformation of TypeScript-only syntax into JavaScript code. Implies --enable-source-maps.
--experimental-vm-modules
#
Added in: v9.6.0
Enable experimental ES Module support in the node:vm module.
--experimental-wasi-unstable-preview1
#
History

















Enable experimental WebAssembly System Interface (WASI) support.
--experimental-wasm-modules
#
Added in: v12.3.0
Enable experimental WebAssembly module support.
--experimental-webstorage
#
Added in: v22.4.0
Enable experimental Web Storage support.
--experimental-worker-inspection
#
Added in: v24.1.0
Stability: 1.1 - Active Development
Enable experimental support for the worker inspection with Chrome DevTools.
--expose-gc
#
Added in: v22.3.0, v20.18.0
Stability: 1 - Experimental. This flag is inherited from V8 and is subject to change upstream.
This flag will expose the gc extension from V8.
if (globalThis.gc) {
  globalThis.gc();
}
copy
--force-context-aware
#
Added in: v12.12.0
Disable loading native addons that are not context-aware.
--force-fips
#
Added in: v6.0.0
Force FIPS-compliant crypto on startup. (Cannot be disabled from script code.) (Same requirements as --enable-fips.)
--force-node-api-uncaught-exceptions-policy
#
Added in: v18.3.0, v16.17.0
Enforces uncaughtException event on Node-API asynchronous callbacks.
To prevent from an existing add-on from crashing the process, this flag is not enabled by default. In the future, this flag will be enabled by default to enforce the correct behavior.
--frozen-intrinsics
#
Added in: v11.12.0
Stability: 1 - Experimental
Enable experimental frozen intrinsics like Array and Object.
Only the root context is supported. There is no guarantee that globalThis.Array is indeed the default intrinsic reference. Code may break under this flag.
To allow polyfills to be added, --require and --import both run before freezing intrinsics.
--heap-prof
#
History













Starts the V8 heap profiler on start up, and writes the heap profile to disk before exit.
If --heap-prof-dir is not specified, the generated profile is placed in the current working directory.
If --heap-prof-name is not specified, the generated profile is named Heap.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.heapprofile.
$ node --heap-prof index.js
$ ls *.heapprofile
Heap.20190409.202950.15293.0.001.heapprofile
copy
--heap-prof-dir
#
History













Specify the directory where the heap profiles generated by --heap-prof will be placed.
The default value is controlled by the --diagnostic-dir command-line option.
--heap-prof-interval
#
History













Specify the average sampling interval in bytes for the heap profiles generated by --heap-prof. The default is 512 * 1024 bytes.
--heap-prof-name
#
History













Specify the file name of the heap profile generated by --heap-prof.
--heapsnapshot-near-heap-limit=max_count
#
Added in: v15.1.0, v14.18.0
Stability: 1 - Experimental
Writes a V8 heap snapshot to disk when the V8 heap usage is approaching the heap limit. count should be a non-negative integer (in which case Node.js will write no more than max_count snapshots to disk).
When generating snapshots, garbage collection may be triggered and bring the heap usage down. Therefore multiple snapshots may be written to disk before the Node.js instance finally runs out of memory. These heap snapshots can be compared to determine what objects are being allocated during the time consecutive snapshots are taken. It's not guaranteed that Node.js will write exactly max_count snapshots to disk, but it will try its best to generate at least one and up to max_count snapshots before the Node.js instance runs out of memory when max_count is greater than 0.
Generating V8 snapshots takes time and memory (both memory managed by the V8 heap and native memory outside the V8 heap). The bigger the heap is, the more resources it needs. Node.js will adjust the V8 heap to accommodate the additional V8 heap memory overhead, and try its best to avoid using up all the memory available to the process. When the process uses more memory than the system deems appropriate, the process may be terminated abruptly by the system, depending on the system configuration.
$ node --max-old-space-size=100 --heapsnapshot-near-heap-limit=3 index.js
Wrote snapshot to Heap.20200430.100036.49580.0.001.heapsnapshot
Wrote snapshot to Heap.20200430.100037.49580.0.002.heapsnapshot
Wrote snapshot to Heap.20200430.100038.49580.0.003.heapsnapshot


<--- Last few GCs --->


[49580:0x110000000]     4826 ms: Mark-sweep 130.6 (147.8) -> 130.5 (147.8) MB, 27.4 / 0.0 ms  (average mu = 0.126, current mu = 0.034) allocation failure scavenge might not succeed
[49580:0x110000000]     4845 ms: Mark-sweep 130.6 (147.8) -> 130.6 (147.8) MB, 18.8 / 0.0 ms  (average mu = 0.088, current mu = 0.031) allocation failure scavenge might not succeed




<--- JS stacktrace --->


FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
....
copy
--heapsnapshot-signal=signal
#
Added in: v12.0.0
Enables a signal handler that causes the Node.js process to write a heap dump when the specified signal is received. signal must be a valid signal name. Disabled by default.
$ node --heapsnapshot-signal=SIGUSR2 index.js &
$ ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
node         1  5.5  6.1 787252 247004 ?       Ssl  16:43   0:02 node --heapsnapshot-signal=SIGUSR2 index.js
$ kill -USR2 1
$ ls
Heap.20190718.133405.15554.0.001.heapsnapshot
copy
-h, --help
#
Added in: v0.1.3
Print node command-line options. The output of this option is less detailed than this document.
--icu-data-dir=file
#
Added in: v0.11.15
Specify ICU data load path. (Overrides NODE_ICU_DATA.)
--import=module
#
Added in: v19.0.0, v18.18.0
Stability: 1 - Experimental
Preload the specified module at startup. If the flag is provided several times, each module will be executed sequentially in the order they appear, starting with the ones provided in NODE_OPTIONS.
Follows ECMAScript module resolution rules. Use --require to load a CommonJS module. Modules preloaded with --require will run before modules preloaded with --import.
Modules are preloaded into the main thread as well as any worker threads, forked processes, or clustered processes.
--input-type=type
#
History

















This configures Node.js to interpret --eval or STDIN input as CommonJS or as an ES module. Valid values are "commonjs", "module", "module-typescript" and "commonjs-typescript". The "-typescript" values are not available with the flag --no-experimental-strip-types. The default is no value, or "commonjs" if --no-experimental-detect-module is passed.
If --input-type is not provided, Node.js will try to detect the syntax with the following steps:
Run the input as CommonJS.
If step 1 fails, run the input as an ES module.
If step 2 fails with a SyntaxError, strip the types.
If step 3 fails with an error code ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX or ERR_INVALID_TYPESCRIPT_SYNTAX, throw the error from step 2, including the TypeScript error in the message, else run as CommonJS.
If step 4 fails, run the input as an ES module.
To avoid the delay of multiple syntax detection passes, the --input-type=type flag can be used to specify how the --eval input should be interpreted.
The REPL does not support this option. Usage of --input-type=module with --print will throw an error, as --print does not support ES module syntax.
--insecure-http-parser
#
Added in: v13.4.0, v12.15.0, v10.19.0
Enable leniency flags on the HTTP parser. This may allow interoperability with non-conformant HTTP implementations.
When enabled, the parser will accept the following:
Invalid HTTP headers values.
Invalid HTTP versions.
Allow message containing both Transfer-Encoding and Content-Length headers.
Allow extra data after message when Connection: close is present.
Allow extra transfer encodings after chunked has been provided.
Allow \n to be used as token separator instead of \r\n.
Allow \r\n not to be provided after a chunk.
Allow spaces to be present after a chunk size and before \r\n.
All the above will expose your application to request smuggling or poisoning attack. Avoid using this option.
Warning: binding inspector to a public IP:port combination is insecure
#
Binding the inspector to a public IP (including 0.0.0.0) with an open port is insecure, as it allows external hosts to connect to the inspector and perform a remote code execution attack.
If specifying a host, make sure that either:
The host is not accessible from public networks.
A firewall disallows unwanted connections on the port.
More specifically, --inspect=0.0.0.0 is insecure if the port (9229 by default) is not firewall-protected.
See the debugging security implications section for more information.
--inspect-brk[=[host:]port]
#
Added in: v7.6.0
Activate inspector on host:port and break at start of user script. Default host:port is 127.0.0.1:9229. If port 0 is specified, a random available port will be used.
See V8 Inspector integration for Node.js for further explanation on Node.js debugger.
--inspect-port=[host:]port
#
Added in: v7.6.0
Set the host:port to be used when the inspector is activated. Useful when activating the inspector by sending the SIGUSR1 signal. Except when --disable-sigusr1 is passed.
Default host is 127.0.0.1. If port 0 is specified, a random available port will be used.
See the security warning below regarding the host parameter usage.
--inspect-publish-uid=stderr,http
#
Specify ways of the inspector web socket url exposure.
By default inspector websocket url is available in stderr and under /json/list endpoint on http://host:port/json/list.
--inspect-wait[=[host:]port]
#
Added in: v22.2.0, v20.15.0
Activate inspector on host:port and wait for debugger to be attached. Default host:port is 127.0.0.1:9229. If port 0 is specified, a random available port will be used.
See V8 Inspector integration for Node.js for further explanation on Node.js debugger.
--inspect[=[host:]port]
#
Added in: v6.3.0
Activate inspector on host:port. Default is 127.0.0.1:9229. If port 0 is specified, a random available port will be used.
V8 inspector integration allows tools such as Chrome DevTools and IDEs to debug and profile Node.js instances. The tools attach to Node.js instances via a tcp port and communicate using the Chrome DevTools Protocol. See V8 Inspector integration for Node.js for further explanation on Node.js debugger.
-i, --interactive
#
Added in: v0.7.7
Opens the REPL even if stdin does not appear to be a terminal.
--jitless
#
Added in: v12.0.0
Stability: 1 - Experimental. This flag is inherited from V8 and is subject to change upstream.
Disable runtime allocation of executable memory. This may be required on some platforms for security reasons. It can also reduce attack surface on other platforms, but the performance impact may be severe.
--localstorage-file=file
#
Added in: v22.4.0
The file used to store localStorage data. If the file does not exist, it is created the first time localStorage is accessed. The same file may be shared between multiple Node.js processes concurrently. This flag is a no-op unless Node.js is started with the --experimental-webstorage flag.
--max-http-header-size=size
#
History













Specify the maximum size, in bytes, of HTTP headers. Defaults to 16 KiB.
--napi-modules
#
Added in: v7.10.0
This option is a no-op. It is kept for compatibility.
--network-family-autoselection-attempt-timeout
#
Added in: v22.1.0, v20.13.0
Sets the default value for the network family autoselection attempt timeout. For more information, see net.getDefaultAutoSelectFamilyAttemptTimeout().
--no-addons
#
Added in: v16.10.0, v14.19.0
Disable the node-addons exports condition as well as disable loading native addons. When --no-addons is specified, calling process.dlopen or requiring a native C++ addon will fail and throw an exception.
--no-async-context-frame
#
Added in: v24.0.0
Disables the use of AsyncLocalStorage backed by AsyncContextFrame and uses the prior implementation which relied on async_hooks. The previous model is retained for compatibility with Electron and for cases where the context flow may differ. However, if a difference in flow is found please report it.
--no-deprecation
#
Added in: v0.8.0
Silence deprecation warnings.
--no-experimental-detect-module
#
History













Disable using syntax detection to determine module type.
--no-experimental-global-navigator
#
Added in: v21.2.0
Stability: 1 - Experimental
Disable exposition of Navigator API on the global scope.
--no-experimental-repl-await
#
Added in: v16.6.0
Use this flag to disable top-level await in REPL.
--no-experimental-require-module
#
History













Stability: 1.1 - Active Development
Disable support for loading a synchronous ES module graph in require().
See Loading ECMAScript modules using require().
--no-experimental-sqlite
#
History













Disable the experimental node:sqlite module.
--no-experimental-strip-types
#
History













Stability: 1.2 - Release candidate
Disable experimental type-stripping for TypeScript files. For more information, see the TypeScript type-stripping documentation.
--no-experimental-websocket
#
Added in: v22.0.0
Disable exposition of <WebSocket> on the global scope.
--no-extra-info-on-fatal-exception
#
Added in: v17.0.0
Hide extra information on fatal exception that causes exit.
--no-force-async-hooks-checks
#
Added in: v9.0.0
Disables runtime checks for async_hooks. These will still be enabled dynamically when async_hooks is enabled.
--no-global-search-paths
#
Added in: v16.10.0
Do not search modules from global paths like $HOME/.node_modules and $NODE_PATH.
--no-network-family-autoselection
#
History













Disables the family autoselection algorithm unless connection options explicitly enables it.
--no-warnings
#
Added in: v6.0.0
Silence all process warnings (including deprecations).
--node-memory-debug
#
Added in: v15.0.0, v14.18.0
Enable extra debug checks for memory leaks in Node.js internals. This is usually only useful for developers debugging Node.js itself.
--openssl-config=file
#
Added in: v6.9.0
Load an OpenSSL configuration file on startup. Among other uses, this can be used to enable FIPS-compliant crypto if Node.js is built against FIPS-enabled OpenSSL.
--openssl-legacy-provider
#
Added in: v17.0.0, v16.17.0
Enable OpenSSL 3.0 legacy provider. For more information please see OSSL_PROVIDER-legacy.
--openssl-shared-config
#
Added in: v18.5.0, v16.17.0, v14.21.0
Enable OpenSSL default configuration section, openssl_conf to be read from the OpenSSL configuration file. The default configuration file is named openssl.cnf but this can be changed using the environment variable OPENSSL_CONF, or by using the command line option --openssl-config. The location of the default OpenSSL configuration file depends on how OpenSSL is being linked to Node.js. Sharing the OpenSSL configuration may have unwanted implications and it is recommended to use a configuration section specific to Node.js which is nodejs_conf and is default when this option is not used.
--pending-deprecation
#
Added in: v8.0.0
Emit pending deprecation warnings.
Pending deprecations are generally identical to a runtime deprecation with the notable exception that they are turned off by default and will not be emitted unless either the --pending-deprecation command-line flag, or the NODE_PENDING_DEPRECATION=1 environment variable, is set. Pending deprecations are used to provide a kind of selective "early warning" mechanism that developers may leverage to detect deprecated API usage.
--permission
#
History













Enable the Permission Model for current process. When enabled, the following permissions are restricted:
File System - manageable through --allow-fs-read, --allow-fs-write flags
Child Process - manageable through --allow-child-process flag
Worker Threads - manageable through --allow-worker flag
WASI - manageable through --allow-wasi flag
Addons - manageable through --allow-addons flag
--preserve-symlinks
#
Added in: v6.3.0
Instructs the module loader to preserve symbolic links when resolving and caching modules.
By default, when Node.js loads a module from a path that is symbolically linked to a different on-disk location, Node.js will dereference the link and use the actual on-disk "real path" of the module as both an identifier and as a root path to locate other dependency modules. In most cases, this default behavior is acceptable. However, when using symbolically linked peer dependencies, as illustrated in the example below, the default behavior causes an exception to be thrown if moduleA attempts to require moduleB as a peer dependency:
{appDir}
 ├── app
 │   ├── index.js
 │   └── node_modules
 │       ├── moduleA -> {appDir}/moduleA
 │       └── moduleB
 │           ├── index.js
 │           └── package.json
 └── moduleA
     ├── index.js
     └── package.json
copy
The --preserve-symlinks command-line flag instructs Node.js to use the symlink path for modules as opposed to the real path, allowing symbolically linked peer dependencies to be found.
Note, however, that using --preserve-symlinks can have other side effects. Specifically, symbolically linked native modules can fail to load if those are linked from more than one location in the dependency tree (Node.js would see those as two separate modules and would attempt to load the module multiple times, causing an exception to be thrown).
The --preserve-symlinks flag does not apply to the main module, which allows node --preserve-symlinks node_module/.bin/<foo> to work. To apply the same behavior for the main module, also use --preserve-symlinks-main.
--preserve-symlinks-main
#
Added in: v10.2.0
Instructs the module loader to preserve symbolic links when resolving and caching the main module (require.main).
This flag exists so that the main module can be opted-in to the same behavior that --preserve-symlinks gives to all other imports; they are separate flags, however, for backward compatibility with older Node.js versions.
--preserve-symlinks-main does not imply --preserve-symlinks; use --preserve-symlinks-main in addition to --preserve-symlinks when it is not desirable to follow symlinks before resolving relative paths.
See --preserve-symlinks for more information.
-p, --print "script"
#
History













Identical to -e but prints the result.
--prof
#
Added in: v2.0.0
Generate V8 profiler output.
--prof-process
#
Added in: v5.2.0
Process V8 profiler output generated using the V8 option --prof.
--redirect-warnings=file
#
Added in: v8.0.0
Write process warnings to the given file instead of printing to stderr. The file will be created if it does not exist, and will be appended to if it does. If an error occurs while attempting to write the warning to the file, the warning will be written to stderr instead.
The file name may be an absolute path. If it is not, the default directory it will be written to is controlled by the --diagnostic-dir command-line option.
--report-compact
#
Added in: v13.12.0, v12.17.0
Write reports in a compact format, single-line JSON, more easily consumable by log processing systems than the default multi-line format designed for human consumption.
--report-dir=directory, report-directory=directory
#
History

















Location at which the report will be generated.
--report-exclude-env
#
Added in: v23.3.0, v22.13.0
When --report-exclude-env is passed the diagnostic report generated will not contain the environmentVariables data.
--report-exclude-network
#
Added in: v22.0.0, v20.13.0
Exclude header.networkInterfaces from the diagnostic report. By default this is not set and the network interfaces are included.
--report-filename=filename
#
History

















Name of the file to which the report will be written.
If the filename is set to 'stdout' or 'stderr', the report is written to the stdout or stderr of the process respectively.
--report-on-fatalerror
#
History

















Enables the report to be triggered on fatal errors (internal errors within the Node.js runtime such as out of memory) that lead to termination of the application. Useful to inspect various diagnostic data elements such as heap, stack, event loop state, resource consumption etc. to reason about the fatal error.
--report-on-signal
#
History

















Enables report to be generated upon receiving the specified (or predefined) signal to the running Node.js process. The signal to trigger the report is specified through --report-signal.
--report-signal=signal
#
History

















Sets or resets the signal for report generation (not supported on Windows). Default signal is SIGUSR2.
--report-uncaught-exception
#
History





















Enables report to be generated when the process exits due to an uncaught exception. Useful when inspecting the JavaScript stack in conjunction with native stack and other runtime environment data.
-r, --require module
#
History













Preload the specified module at startup.
Follows require()'s module resolution rules. module may be either a path to a file, or a node module name.
Modules preloaded with --require will run before modules preloaded with --import.
Modules are preloaded into the main thread as well as any worker threads, forked processes, or clustered processes.
--run
#
History





















This runs a specified command from a package.json's "scripts" object. If a missing "command" is provided, it will list the available scripts.
--run will traverse up to the root directory and finds a package.json file to run the command from.
--run prepends ./node_modules/.bin for each ancestor of the current directory, to the PATH in order to execute the binaries from different folders where multiple node_modules directories are present, if ancestor-folder/node_modules/.bin is a directory.
--run executes the command in the directory containing the related package.json.
For example, the following command will run the test script of the package.json in the current folder:
$ node --run test
copy
You can also pass arguments to the command. Any argument after -- will be appended to the script:
$ node --run test -- --verbose
copy
Intentional limitations
#
node --run is not meant to match the behaviors of npm run or of the run commands of other package managers. The Node.js implementation is intentionally more limited, in order to focus on top performance for the most common use cases. Some features of other run implementations that are intentionally excluded are:
Running pre or post scripts in addition to the specified script.
Defining package manager-specific environment variables.
Environment variables
#
The following environment variables are set when running a script with --run:
NODE_RUN_SCRIPT_NAME: The name of the script being run. For example, if --run is used to run test, the value of this variable will be test.
NODE_RUN_PACKAGE_JSON_PATH: The path to the package.json that is being processed.
--secure-heap-min=n
#
Added in: v15.6.0
When using --secure-heap, the --secure-heap-min flag specifies the minimum allocation from the secure heap. The minimum value is 2. The maximum value is the lesser of --secure-heap or 2147483647. The value given must be a power of two.
--secure-heap=n
#
Added in: v15.6.0
Initializes an OpenSSL secure heap of n bytes. When initialized, the secure heap is used for selected types of allocations within OpenSSL during key generation and other operations. This is useful, for instance, to prevent sensitive information from leaking due to pointer overruns or underruns.
The secure heap is a fixed size and cannot be resized at runtime so, if used, it is important to select a large enough heap to cover all application uses.
The heap size given must be a power of two. Any value less than 2 will disable the secure heap.
The secure heap is disabled by default.
The secure heap is not available on Windows.
See CRYPTO_secure_malloc_init for more details.
--snapshot-blob=path
#
Added in: v18.8.0
Stability: 1 - Experimental
When used with --build-snapshot, --snapshot-blob specifies the path where the generated snapshot blob is written to. If not specified, the generated blob is written to snapshot.blob in the current working directory.
When used without --build-snapshot, --snapshot-blob specifies the path to the blob that is used to restore the application state.
When loading a snapshot, Node.js checks that:
The version, architecture, and platform of the running Node.js binary are exactly the same as that of the binary that generates the snapshot.
The V8 flags and CPU features are compatible with that of the binary that generates the snapshot.
If they don't match, Node.js refuses to load the snapshot and exits with status code 1.
--test
#
History

















Starts the Node.js command line test runner. This flag cannot be combined with --watch-path, --check, --eval, --interactive, or the inspector. See the documentation on running tests from the command line for more details.
--test-concurrency
#
Added in: v21.0.0, v20.10.0, v18.19.0
The maximum number of test files that the test runner CLI will execute concurrently. If --test-isolation is set to 'none', this flag is ignored and concurrency is one. Otherwise, concurrency defaults to os.availableParallelism() - 1.
--test-coverage-branches=threshold
#
Added in: v22.8.0
Stability: 1 - Experimental
Require a minimum percent of covered branches. If code coverage does not reach the threshold specified, the process will exit with code 1.
--test-coverage-exclude
#
Added in: v22.5.0
Stability: 1 - Experimental
Excludes specific files from code coverage using a glob pattern, which can match both absolute and relative file paths.
This option may be specified multiple times to exclude multiple glob patterns.
If both --test-coverage-exclude and --test-coverage-include are provided, files must meet both criteria to be included in the coverage report.
By default all the matching test files are excluded from the coverage report. Specifying this option will override the default behavior.
--test-coverage-functions=threshold
#
Added in: v22.8.0
Stability: 1 - Experimental
Require a minimum percent of covered functions. If code coverage does not reach the threshold specified, the process will exit with code 1.
--test-coverage-include
#
Added in: v22.5.0
Stability: 1 - Experimental
Includes specific files in code coverage using a glob pattern, which can match both absolute and relative file paths.
This option may be specified multiple times to include multiple glob patterns.
If both --test-coverage-exclude and --test-coverage-include are provided, files must meet both criteria to be included in the coverage report.
--test-coverage-lines=threshold
#
Added in: v22.8.0
Stability: 1 - Experimental
Require a minimum percent of covered lines. If code coverage does not reach the threshold specified, the process will exit with code 1.
--test-force-exit
#
Added in: v22.0.0, v20.14.0
Configures the test runner to exit the process once all known tests have finished executing even if the event loop would otherwise remain active.
--test-global-setup=module
#
Added in: v24.0.0
Stability: 1.0 - Early development
Specify a module that will be evaluated before all tests are executed and can be used to setup global state or fixtures for tests.
See the documentation on global setup and teardown for more details.
--test-isolation=mode
#
History













Configures the type of test isolation used in the test runner. When mode is 'process', each test file is run in a separate child process. When mode is 'none', all test files run in the same process as the test runner. The default isolation mode is 'process'. This flag is ignored if the --test flag is not present. See the test runner execution model section for more information.
--test-name-pattern
#
History













A regular expression that configures the test runner to only execute tests whose name matches the provided pattern. See the documentation on filtering tests by name for more details.
If both --test-name-pattern and --test-skip-pattern are supplied, tests must satisfy both requirements in order to be executed.
--test-only
#
History













Configures the test runner to only execute top level tests that have the only option set. This flag is not necessary when test isolation is disabled.
--test-reporter
#
History













A test reporter to use when running tests. See the documentation on test reporters for more details.
--test-reporter-destination
#
History













The destination for the corresponding test reporter. See the documentation on test reporters for more details.
--test-shard
#
Added in: v20.5.0, v18.19.0
Test suite shard to execute in a format of <index>/<total>, where
index is a positive integer, index of divided parts.
total is a positive integer, total of divided part.
This command will divide all tests files into total equal parts, and will run only those that happen to be in an index part.
For example, to split your tests suite into three parts, use this:
node --test --test-shard=1/3
node --test --test-shard=2/3
node --test --test-shard=3/3
copy
--test-skip-pattern
#
Added in: v22.1.0
A regular expression that configures the test runner to skip tests whose name matches the provided pattern. See the documentation on filtering tests by name for more details.
If both --test-name-pattern and --test-skip-pattern are supplied, tests must satisfy both requirements in order to be executed.
--test-timeout
#
Added in: v21.2.0, v20.11.0
A number of milliseconds the test execution will fail after. If unspecified, subtests inherit this value from their parent. The default value is Infinity.
--test-update-snapshots
#
History













Regenerates the snapshot files used by the test runner for snapshot testing.
--throw-deprecation
#
Added in: v0.11.14
Throw errors for deprecations.
--title=title
#
Added in: v10.7.0
Set process.title on startup.
--tls-cipher-list=list
#
Added in: v4.0.0
Specify an alternative default TLS cipher list. Requires Node.js to be built with crypto support (default).
--tls-keylog=file
#
Added in: v13.2.0, v12.16.0
Log TLS key material to a file. The key material is in NSS SSLKEYLOGFILE format and can be used by software (such as Wireshark) to decrypt the TLS traffic.
--tls-max-v1.2
#
Added in: v12.0.0, v10.20.0
Set tls.DEFAULT_MAX_VERSION to 'TLSv1.2'. Use to disable support for TLSv1.3.
--tls-max-v1.3
#
Added in: v12.0.0
Set default tls.DEFAULT_MAX_VERSION to 'TLSv1.3'. Use to enable support for TLSv1.3.
--tls-min-v1.0
#
Added in: v12.0.0, v10.20.0
Set default tls.DEFAULT_MIN_VERSION to 'TLSv1'. Use for compatibility with old TLS clients or servers.
--tls-min-v1.1
#
Added in: v12.0.0, v10.20.0
Set default tls.DEFAULT_MIN_VERSION to 'TLSv1.1'. Use for compatibility with old TLS clients or servers.
--tls-min-v1.2
#
Added in: v12.2.0, v10.20.0
Set default tls.DEFAULT_MIN_VERSION to 'TLSv1.2'. This is the default for 12.x and later, but the option is supported for compatibility with older Node.js versions.
--tls-min-v1.3
#
Added in: v12.0.0
Set default tls.DEFAULT_MIN_VERSION to 'TLSv1.3'. Use to disable support for TLSv1.2, which is not as secure as TLSv1.3.
--trace-deprecation
#
Added in: v0.8.0
Print stack traces for deprecations.
--trace-env
#
Added in: v23.4.0, v22.13.0
Print information about any access to environment variables done in the current Node.js instance to stderr, including:
The environment variable reads that Node.js does internally.
Writes in the form of process.env.KEY = "SOME VALUE".
Reads in the form of process.env.KEY.
Definitions in the form of Object.defineProperty(process.env, 'KEY', {...}).
Queries in the form of Object.hasOwn(process.env, 'KEY'), process.env.hasOwnProperty('KEY') or 'KEY' in process.env.
Deletions in the form of delete process.env.KEY.
Enumerations inf the form of ...process.env or Object.keys(process.env).
Only the names of the environment variables being accessed are printed. The values are not printed.
To print the stack trace of the access, use --trace-env-js-stack and/or --trace-env-native-stack.
--trace-env-js-stack
#
Added in: v23.4.0, v22.13.0
In addition to what --trace-env does, this prints the JavaScript stack trace of the access.
--trace-env-native-stack
#
Added in: v23.4.0, v22.13.0
In addition to what --trace-env does, this prints the native stack trace of the access.
--trace-event-categories
#
Added in: v7.7.0
A comma separated list of categories that should be traced when trace event tracing is enabled using --trace-events-enabled.
--trace-event-file-pattern
#
Added in: v9.8.0
Template string specifying the filepath for the trace event data, it supports ${rotation} and ${pid}.
--trace-events-enabled
#
Added in: v7.7.0
Enables the collection of trace event tracing information.
--trace-exit
#
Added in: v13.5.0, v12.16.0
Prints a stack trace whenever an environment is exited proactively, i.e. invoking process.exit().
--trace-require-module=mode
#
Added in: v23.5.0, v22.13.0, v20.19.0
Prints information about usage of Loading ECMAScript modules using require().
When mode is all, all usage is printed. When mode is no-node-modules, usage from the node_modules folder is excluded.
--trace-sigint
#
Added in: v13.9.0, v12.17.0
Prints a stack trace on SIGINT.
--trace-sync-io
#
Added in: v2.1.0
Prints a stack trace whenever synchronous I/O is detected after the first turn of the event loop.
--trace-tls
#
Added in: v12.2.0
Prints TLS packet trace information to stderr. This can be used to debug TLS connection problems.
--trace-uncaught
#
Added in: v13.1.0
Print stack traces for uncaught exceptions; usually, the stack trace associated with the creation of an Error is printed, whereas this makes Node.js also print the stack trace associated with throwing the value (which does not need to be an Error instance).
Enabling this option may affect garbage collection behavior negatively.
--trace-warnings
#
Added in: v6.0.0
Print stack traces for process warnings (including deprecations).
--track-heap-objects
#
Added in: v2.4.0
Track heap object allocations for heap snapshots.
--unhandled-rejections=mode
#
History













Using this flag allows to change what should happen when an unhandled rejection occurs. One of the following modes can be chosen:
throw: Emit unhandledRejection. If this hook is not set, raise the unhandled rejection as an uncaught exception. This is the default.
strict: Raise the unhandled rejection as an uncaught exception. If the exception is handled, unhandledRejection is emitted.
warn: Always trigger a warning, no matter if the unhandledRejection hook is set or not but do not print the deprecation warning.
warn-with-error-code: Emit unhandledRejection. If this hook is not set, trigger a warning, and set the process exit code to 1.
none: Silence all warnings.
If a rejection happens during the command line entry point's ES module static loading phase, it will always raise it as an uncaught exception.
--use-bundled-ca, --use-openssl-ca
#
Added in: v6.11.0
Use bundled Mozilla CA store as supplied by current Node.js version or use OpenSSL's default CA store. The default store is selectable at build-time.
The bundled CA store, as supplied by Node.js, is a snapshot of Mozilla CA store that is fixed at release time. It is identical on all supported platforms.
Using OpenSSL store allows for external modifications of the store. For most Linux and BSD distributions, this store is maintained by the distribution maintainers and system administrators. OpenSSL CA store location is dependent on configuration of the OpenSSL library but this can be altered at runtime using environment variables.
See SSL_CERT_DIR and SSL_CERT_FILE.
--use-largepages=mode
#
Added in: v13.6.0, v12.17.0
Re-map the Node.js static code to large memory pages at startup. If supported on the target system, this will cause the Node.js static code to be moved onto 2 MiB pages instead of 4 KiB pages.
The following values are valid for mode:
off: No mapping will be attempted. This is the default.
on: If supported by the OS, mapping will be attempted. Failure to map will be ignored and a message will be printed to standard error.
silent: If supported by the OS, mapping will be attempted. Failure to map will be ignored and will not be reported.
--use-system-ca
#
History













Node.js uses the trusted CA certificates present in the system store along with the --use-bundled-ca option and the NODE_EXTRA_CA_CERTS environment variable. On platforms other than Windows and macOS, this loads certificates from the directory and file trusted by OpenSSL, similar to --use-openssl-ca, with the difference being that it caches the certificates after first load.
On Windows and macOS, the certificate trust policy is planned to follow Chromium's policy for locally trusted certificates:
On macOS, the following settings are respected:
Default and System Keychains
Trust:
Any certificate where the “When using this certificate” flag is set to “Always Trust” or
Any certificate where the “Secure Sockets Layer (SSL)” flag is set to “Always Trust.”
Distrust:
Any certificate where the “When using this certificate” flag is set to “Never Trust” or
Any certificate where the “Secure Sockets Layer (SSL)” flag is set to “Never Trust.”
On Windows, the following settings are respected (unlike Chromium's policy, distrust and intermediate CA are not currently supported):
Local Machine (accessed via certlm.msc)
Trust:
Trusted Root Certification Authorities
Trusted People
Enterprise Trust -> Enterprise -> Trusted Root Certification Authorities
Enterprise Trust -> Enterprise -> Trusted People
Enterprise Trust -> Group Policy -> Trusted Root Certification Authorities
Enterprise Trust -> Group Policy -> Trusted People
Current User (accessed via certmgr.msc)
Trust:
Trusted Root Certification Authorities
Enterprise Trust -> Group Policy -> Trusted Root Certification Authorities
On Windows and macOS, Node.js would check that the user settings for the certificates do not forbid them for TLS server authentication before using them.
On other systems, Node.js loads certificates from the default certificate file (typically /etc/ssl/cert.pem) and default certificate directory (typically /etc/ssl/certs) that the version of OpenSSL that Node.js links to respects. This typically works with the convention on major Linux distributions and other Unix-like systems. If the overriding OpenSSL environment variables (typically SSL_CERT_FILE and SSL_CERT_DIR, depending on the configuration of the OpenSSL that Node.js links to) are set, the specified paths will be used to load certificates instead. These environment variables can be used as workarounds if the conventional paths used by the version of OpenSSL Node.js links to are not consistent with the system configuration that the users have for some reason.
--v8-options
#
Added in: v0.1.3
Print V8 command-line options.
--v8-pool-size=num
#
Added in: v5.10.0
Set V8's thread pool size which will be used to allocate background jobs.
If set to 0 then Node.js will choose an appropriate size of the thread pool based on an estimate of the amount of parallelism.
The amount of parallelism refers to the number of computations that can be carried out simultaneously in a given machine. In general, it's the same as the amount of CPUs, but it may diverge in environments such as VMs or containers.
-v, --version
#
Added in: v0.1.3
Print node's version.
--watch
#
History

















Starts Node.js in watch mode. When in watch mode, changes in the watched files cause the Node.js process to restart. By default, watch mode will watch the entry point and any required or imported module. Use --watch-path to specify what paths to watch.
This flag cannot be combined with --check, --eval, --interactive, or the REPL.
Note: The --watch flag requires a file path as an argument and is incompatible with --run or inline script input, as --run takes precedence and ignores watch mode. If no file is provided, Node.js will exit with status code 9.
node --watch index.js
copy
--watch-kill-signal
#
Added in: v24.4.0
Customizes the signal sent to the process on watch mode restarts.
node --watch --watch-kill-signal SIGINT test.js
copy
--watch-path
#
History













Starts Node.js in watch mode and specifies what paths to watch. When in watch mode, changes in the watched paths cause the Node.js process to restart. This will turn off watching of required or imported modules, even when used in combination with --watch.
This flag cannot be combined with --check, --eval, --interactive, --test, or the REPL.
Note: Using --watch-path implicitly enables --watch, which requires a file path and is incompatible with --run, as --run takes precedence and ignores watch mode.
node --watch-path=./src --watch-path=./tests index.js
copy
This option is only supported on macOS and Windows. An ERR_FEATURE_UNAVAILABLE_ON_PLATFORM exception will be thrown when the option is used on a platform that does not support it.
--watch-preserve-output
#
Added in: v19.3.0, v18.13.0
Disable the clearing of the console when watch mode restarts the process.
node --watch --watch-preserve-output test.js
copy
--zero-fill-buffers
#
Added in: v6.0.0
Automatically zero-fills all newly allocated Buffer and SlowBuffer instances.
Environment variables
#
Stability: 2 - Stable
FORCE_COLOR=[1, 2, 3]
#
The FORCE_COLOR environment variable is used to enable ANSI colorized output. The value may be:
1, true, or the empty string '' indicate 16-color support,
2 to indicate 256-color support, or
3 to indicate 16 million-color support.
When FORCE_COLOR is used and set to a supported value, both the NO_COLOR, and NODE_DISABLE_COLORS environment variables are ignored.
Any other value will result in colorized output being disabled.
NODE_COMPILE_CACHE=dir
#
Added in: v22.1.0
Stability: 1.1 - Active Development
Enable the module compile cache for the Node.js instance. See the documentation of module compile cache for details.
NODE_DEBUG=module[,…]
#
Added in: v0.1.32
','-separated list of core modules that should print debug information.
NODE_DEBUG_NATIVE=module[,…]
#
','-separated list of core C++ modules that should print debug information.
NODE_DISABLE_COLORS=1
#
Added in: v0.3.0
When set, colors will not be used in the REPL.
NODE_DISABLE_COMPILE_CACHE=1
#
Added in: v22.8.0
Stability: 1.1 - Active Development
Disable the module compile cache for the Node.js instance. See the documentation of module compile cache for details.
NODE_EXTRA_CA_CERTS=file
#
Added in: v7.3.0
When set, the well known "root" CAs (like VeriSign) will be extended with the extra certificates in file. The file should consist of one or more trusted certificates in PEM format. A message will be emitted (once) with process.emitWarning() if the file is missing or malformed, but any errors are otherwise ignored.
Neither the well known nor extra certificates are used when the ca options property is explicitly specified for a TLS or HTTPS client or server.
This environment variable is ignored when node runs as setuid root or has Linux file capabilities set.
The NODE_EXTRA_CA_CERTS environment variable is only read when the Node.js process is first launched. Changing the value at runtime using process.env.NODE_EXTRA_CA_CERTS has no effect on the current process.
NODE_ICU_DATA=file
#
Added in: v0.11.15
Data path for ICU (Intl object) data. Will extend linked-in data when compiled with small-icu support.
NODE_NO_WARNINGS=1
#
Added in: v6.11.0
When set to 1, process warnings are silenced.
NODE_OPTIONS=options...
#
Added in: v8.0.0
A space-separated list of command-line options. options... are interpreted before command-line options, so command-line options will override or compound after anything in options.... Node.js will exit with an error if an option that is not allowed in the environment is used, such as -p or a script file.
If an option value contains a space, it can be escaped using double quotes:
NODE_OPTIONS='--require "./my path/file.js"'
copy
A singleton flag passed as a command-line option will override the same flag passed into NODE_OPTIONS:
# The inspector will be available on port 5555
NODE_OPTIONS='--inspect=localhost:4444' node --inspect=localhost:5555
copy
A flag that can be passed multiple times will be treated as if its NODE_OPTIONS instances were passed first, and then its command-line instances afterwards:
NODE_OPTIONS='--require "./a.js"' node --require "./b.js"
# is equivalent to:
node --require "./a.js" --require "./b.js"
copy
Node.js options that are allowed are in the following list. If an option supports both --XX and --no-XX variants, they are both supported but only one is included in the list below.
--allow-addons
--allow-child-process
--allow-fs-read
--allow-fs-write
--allow-wasi
--allow-worker
--conditions, -C
--cpu-prof-dir
--cpu-prof-interval
--cpu-prof-name
--cpu-prof
--diagnostic-dir
--disable-proto
--disable-sigusr1
--disable-warning
--disable-wasm-trap-handler
--dns-result-order
--enable-fips
--enable-network-family-autoselection
--enable-source-maps
--entry-url
--experimental-abortcontroller
--experimental-addon-modules
--experimental-detect-module
--experimental-eventsource
--experimental-import-meta-resolve
--experimental-json-modules
--experimental-loader
--experimental-modules
--experimental-print-required-tla
--experimental-require-module
--experimental-shadow-realm
--experimental-specifier-resolution
--experimental-test-isolation
--experimental-top-level-await
--experimental-transform-types
--experimental-vm-modules
--experimental-wasi-unstable-preview1
--experimental-wasm-modules
--experimental-webstorage
--force-context-aware
--force-fips
--force-node-api-uncaught-exceptions-policy
--frozen-intrinsics
--heap-prof-dir
--heap-prof-interval
--heap-prof-name
--heap-prof
--heapsnapshot-near-heap-limit
--heapsnapshot-signal
--http-parser
--icu-data-dir
--import
--input-type
--insecure-http-parser
--inspect-brk
--inspect-port, --debug-port
--inspect-publish-uid
--inspect-wait
--inspect
--localstorage-file
--max-http-header-size
--napi-modules
--network-family-autoselection-attempt-timeout
--no-addons
--no-async-context-frame
--no-deprecation
--no-experimental-global-navigator
--no-experimental-repl-await
--no-experimental-sqlite
--no-experimental-strip-types
--no-experimental-websocket
--no-extra-info-on-fatal-exception
--no-force-async-hooks-checks
--no-global-search-paths
--no-network-family-autoselection
--no-warnings
--node-memory-debug
--openssl-config
--openssl-legacy-provider
--openssl-shared-config
--pending-deprecation
--permission
--preserve-symlinks-main
--preserve-symlinks
--prof-process
--redirect-warnings
--report-compact
--report-dir, --report-directory
--report-exclude-env
--report-exclude-network
--report-filename
--report-on-fatalerror
--report-on-signal
--report-signal
--report-uncaught-exception
--require, -r
--secure-heap-min
--secure-heap
--snapshot-blob
--test-coverage-branches
--test-coverage-exclude
--test-coverage-functions
--test-coverage-include
--test-coverage-lines
--test-global-setup
--test-isolation
--test-name-pattern
--test-only
--test-reporter-destination
--test-reporter
--test-shard
--test-skip-pattern
--throw-deprecation
--title
--tls-cipher-list
--tls-keylog
--tls-max-v1.2
--tls-max-v1.3
--tls-min-v1.0
--tls-min-v1.1
--tls-min-v1.2
--tls-min-v1.3
--trace-deprecation
--trace-env-js-stack
--trace-env-native-stack
--trace-env
--trace-event-categories
--trace-event-file-pattern
--trace-events-enabled
--trace-exit
--trace-require-module
--trace-sigint
--trace-sync-io
--trace-tls
--trace-uncaught
--trace-warnings
--track-heap-objects
--unhandled-rejections
--use-bundled-ca
--use-largepages
--use-openssl-ca
--use-system-ca
--v8-pool-size
--watch-kill-signal
--watch-path
--watch-preserve-output
--watch
--zero-fill-buffers
V8 options that are allowed are:
--abort-on-uncaught-exception
--disallow-code-generation-from-strings
--enable-etw-stack-walking
--expose-gc
--interpreted-frames-native-stack
--jitless
--max-old-space-size
--max-semi-space-size
--perf-basic-prof-only-functions
--perf-basic-prof
--perf-prof-unwinding-info
--perf-prof
--stack-trace-limit
--perf-basic-prof-only-functions, --perf-basic-prof, --perf-prof-unwinding-info, and --perf-prof are only available on Linux.
--enable-etw-stack-walking is only available on Windows.
NODE_PATH=path[:…]
#
Added in: v0.1.32
':'-separated list of directories prefixed to the module search path.
On Windows, this is a ';'-separated list instead.
NODE_PENDING_DEPRECATION=1
#
Added in: v8.0.0
When set to 1, emit pending deprecation warnings.
Pending deprecations are generally identical to a runtime deprecation with the notable exception that they are turned off by default and will not be emitted unless either the --pending-deprecation command-line flag, or the NODE_PENDING_DEPRECATION=1 environment variable, is set. Pending deprecations are used to provide a kind of selective "early warning" mechanism that developers may leverage to detect deprecated API usage.
NODE_PENDING_PIPE_INSTANCES=instances
#
Set the number of pending pipe instance handles when the pipe server is waiting for connections. This setting applies to Windows only.
NODE_PRESERVE_SYMLINKS=1
#
Added in: v7.1.0
When set to 1, instructs the module loader to preserve symbolic links when resolving and caching modules.
NODE_REDIRECT_WARNINGS=file
#
Added in: v8.0.0
When set, process warnings will be emitted to the given file instead of printing to stderr. The file will be created if it does not exist, and will be appended to if it does. If an error occurs while attempting to write the warning to the file, the warning will be written to stderr instead. This is equivalent to using the --redirect-warnings=file command-line flag.
NODE_REPL_EXTERNAL_MODULE=file
#
History













Path to a Node.js module which will be loaded in place of the built-in REPL. Overriding this value to an empty string ('') will use the built-in REPL.
NODE_REPL_HISTORY=file
#
Added in: v3.0.0
Path to the file used to store the persistent REPL history. The default path is ~/.node_repl_history, which is overridden by this variable. Setting the value to an empty string ('' or ' ') disables persistent REPL history.
NODE_SKIP_PLATFORM_CHECK=value
#
Added in: v14.5.0
If value equals '1', the check for a supported platform is skipped during Node.js startup. Node.js might not execute correctly. Any issues encountered on unsupported platforms will not be fixed.
NODE_TEST_CONTEXT=value
#
If value equals 'child', test reporter options will be overridden and test output will be sent to stdout in the TAP format. If any other value is provided, Node.js makes no guarantees about the reporter format used or its stability.
NODE_TLS_REJECT_UNAUTHORIZED=value
#
If value equals '0', certificate validation is disabled for TLS connections. This makes TLS, and HTTPS by extension, insecure. The use of this environment variable is strongly discouraged.
NODE_USE_ENV_PROXY=1
#
Added in: v24.0.0
Stability: 1.1 - Active Development
When enabled, Node.js parses the HTTP_PROXY, HTTPS_PROXY and NO_PROXY environment variables during startup, and tunnels requests over the specified proxy.
This currently only affects requests sent over fetch(). Support for other built-in http and https methods is under way.
NODE_V8_COVERAGE=dir
#
When set, Node.js will begin outputting V8 JavaScript code coverage and Source Map data to the directory provided as an argument (coverage information is written as JSON to files with a coverage prefix).
NODE_V8_COVERAGE will automatically propagate to subprocesses, making it easier to instrument applications that call the child_process.spawn() family of functions. NODE_V8_COVERAGE can be set to an empty string, to prevent propagation.
Coverage output
#
Coverage is output as an array of ScriptCoverage objects on the top-level key result:
{
  "result": [
    {
      "scriptId": "67",
      "url": "internal/tty.js",
      "functions": []
    }
  ]
}
copy
Source map cache
#
Stability: 1 - Experimental
If found, source map data is appended to the top-level key source-map-cache on the JSON coverage object.
source-map-cache is an object with keys representing the files source maps were extracted from, and values which include the raw source-map URL (in the key url), the parsed Source Map v3 information (in the key data), and the line lengths of the source file (in the key lineLengths).
{
  "result": [
    {
      "scriptId": "68",
      "url": "file:///absolute/path/to/source.js",
      "functions": []
    }
  ],
  "source-map-cache": {
    "file:///absolute/path/to/source.js": {
      "url": "./path-to-map.json",
      "data": {
        "version": 3,
        "sources": [
          "file:///absolute/path/to/original.js"
        ],
        "names": [
          "Foo",
          "console",
          "info"
        ],
        "mappings": "MAAMA,IACJC,YAAaC",
        "sourceRoot": "./"
      },
      "lineLengths": [
        13,
        62,
        38,
        27
      ]
    }
  }
}
copy
NO_COLOR=<any>
#
NO_COLOR is an alias for NODE_DISABLE_COLORS. The value of the environment variable is arbitrary.
OPENSSL_CONF=file
#
Added in: v6.11.0
Load an OpenSSL configuration file on startup. Among other uses, this can be used to enable FIPS-compliant crypto if Node.js is built with ./configure --openssl-fips.
If the --openssl-config command-line option is used, the environment variable is ignored.
SSL_CERT_DIR=dir
#
Added in: v7.7.0
If --use-openssl-ca is enabled, or if --use-system-ca is enabled on platforms other than macOS and Windows, this overrides and sets OpenSSL's directory containing trusted certificates.
Be aware that unless the child environment is explicitly set, this environment variable will be inherited by any child processes, and if they use OpenSSL, it may cause them to trust the same CAs as node.
SSL_CERT_FILE=file
#
Added in: v7.7.0
If --use-openssl-ca is enabled, or if --use-system-ca is enabled on platforms other than macOS and Windows, this overrides and sets OpenSSL's file containing trusted certificates.
Be aware that unless the child environment is explicitly set, this environment variable will be inherited by any child processes, and if they use OpenSSL, it may cause them to trust the same CAs as node.
TZ
#
History

















The TZ environment variable is used to specify the timezone configuration.
While Node.js does not support all of the various ways that TZ is handled in other environments, it does support basic timezone IDs (such as 'Etc/UTC', 'Europe/Paris', or 'America/New_York'). It may support a few other abbreviations or aliases, but these are strongly discouraged and not guaranteed.
$ TZ=Europe/Dublin node -pe "new Date().toString()"
Wed May 12 2021 20:30:48 GMT+0100 (Irish Standard Time)
copy
UV_THREADPOOL_SIZE=size
#
Set the number of threads used in libuv's threadpool to size threads.
Asynchronous system APIs are used by Node.js whenever possible, but where they do not exist, libuv's threadpool is used to create asynchronous node APIs based on synchronous system APIs. Node.js APIs that use the threadpool are:
all fs APIs, other than the file watcher APIs and those that are explicitly synchronous
asynchronous crypto APIs such as crypto.pbkdf2(), crypto.scrypt(), crypto.randomBytes(), crypto.randomFill(), crypto.generateKeyPair()
dns.lookup()
all zlib APIs, other than those that are explicitly synchronous
Because libuv's threadpool has a fixed size, it means that if for whatever reason any of these APIs takes a long time, other (seemingly unrelated) APIs that run in libuv's threadpool will experience degraded performance. In order to mitigate this issue, one potential solution is to increase the size of libuv's threadpool by setting the 'UV_THREADPOOL_SIZE' environment variable to a value greater than 4 (its current default value). However, setting this from inside the process using process.env.UV_THREADPOOL_SIZE=size is not guranteed to work as the threadpool would have been created as part of the runtime initialisation much before user code is run. For more information, see the libuv threadpool documentation.
Useful V8 options
#
V8 has its own set of CLI options. Any V8 CLI option that is provided to node will be passed on to V8 to handle. V8's options have no stability guarantee. The V8 team themselves don't consider them to be part of their formal API, and reserve the right to change them at any time. Likewise, they are not covered by the Node.js stability guarantees. Many of the V8 options are of interest only to V8 developers. Despite this, there is a small set of V8 options that are widely applicable to Node.js, and they are documented here:
--abort-on-uncaught-exception
#
--disallow-code-generation-from-strings
#
--enable-etw-stack-walking
#
--expose-gc
#
--harmony-shadow-realm
#
--interpreted-frames-native-stack
#
--jitless
#
--max-old-space-size=SIZE (in MiB)
#
Sets the max memory size of V8's old memory section. As memory consumption approaches the limit, V8 will spend more time on garbage collection in an effort to free unused memory.
On a machine with 2 GiB of memory, consider setting this to 1536 (1.5 GiB) to leave some memory for other uses and avoid swapping.
node --max-old-space-size=1536 index.js
copy
--max-semi-space-size=SIZE (in MiB)
#
Sets the maximum semi-space size for V8's scavenge garbage collector in MiB (mebibytes). Increasing the max size of a semi-space may improve throughput for Node.js at the cost of more memory consumption.
Since the young generation size of the V8 heap is three times (see YoungGenerationSizeFromSemiSpaceSize in V8) the size of the semi-space, an increase of 1 MiB to semi-space applies to each of the three individual semi-spaces and causes the heap size to increase by 3 MiB. The throughput improvement depends on your workload (see #42511).
The default value depends on the memory limit. For example, on 64-bit systems with a memory limit of 512 MiB, the max size of a semi-space defaults to 1 MiB. For memory limits up to and including 2GiB, the default max size of a semi-space will be less than 16 MiB on 64-bit systems.
To get the best configuration for your application, you should try different max-semi-space-size values when running benchmarks for your application.
For example, benchmark on a 64-bit systems:
for MiB in 16 32 64 128; do
    node --max-semi-space-size=$MiB index.js
done
copy
--perf-basic-prof
#
--perf-basic-prof-only-functions
#
--perf-prof
#
--perf-prof-unwinding-info
#
--prof
#
--security-revert
#
--stack-trace-limit=limit
#
The maximum number of stack frames to collect in an error's stack trace. Setting it to 0 disables stack trace collection. The default value is 10.
node --stack-trace-limit=12 -p -e "Error.stackTraceLimit" # prints 12
copy
s v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Command-line API
Synopsis
Program entry point
ECMAScript modules loader entry point caveat
Options
-
--
--abort-on-uncaught-exception
--allow-addons
--allow-child-process
--allow-fs-read
--allow-fs-write
--allow-wasi
--allow-worker
--build-snapshot
--build-snapshot-config
-c, --check
--completion-bash
-C condition, --conditions=condition
--cpu-prof
--cpu-prof-dir
--cpu-prof-interval
--cpu-prof-name
--diagnostic-dir=directory
--disable-proto=mode
--disable-sigusr1
--disable-warning=code-or-type
--disable-wasm-trap-handler
--disallow-code-generation-from-strings
--dns-result-order=order
--enable-fips
--enable-network-family-autoselection
--enable-source-maps
--entry-url
--env-file-if-exists=config
--env-file=config
-e, --eval "script"
--experimental-addon-modules
--experimental-config-file=config
--experimental-default-config-file
--experimental-eventsource
--experimental-import-meta-resolve
--experimental-loader=module
--experimental-network-inspection
--experimental-print-required-tla
--experimental-require-module
--experimental-sea-config
--experimental-shadow-realm
--experimental-test-coverage
--experimental-test-module-mocks
--experimental-transform-types
--experimental-vm-modules
--experimental-wasi-unstable-preview1
--experimental-wasm-modules
--experimental-webstorage
--experimental-worker-inspection
--expose-gc
--force-context-aware
--force-fips
--force-node-api-uncaught-exceptions-policy
--frozen-intrinsics
--heap-prof
--heap-prof-dir
--heap-prof-interval
--heap-prof-name
--heapsnapshot-near-heap-limit=max_count
--heapsnapshot-signal=signal
-h, --help
--icu-data-dir=file
--import=module
--input-type=type
--insecure-http-parser
Warning: binding inspector to a public IP:port combination is insecure
--inspect-brk[=[host:]port]
--inspect-port=[host:]port
--inspect-publish-uid=stderr,http
--inspect-wait[=[host:]port]
--inspect[=[host:]port]
-i, --interactive
--jitless
--localstorage-file=file
--max-http-header-size=size
--napi-modules
--network-family-autoselection-attempt-timeout
--no-addons
--no-async-context-frame
--no-deprecation
--no-experimental-detect-module
--no-experimental-global-navigator
--no-experimental-repl-await
--no-experimental-require-module
--no-experimental-sqlite
--no-experimental-strip-types
--no-experimental-websocket
--no-extra-info-on-fatal-exception
--no-force-async-hooks-checks
--no-global-search-paths
--no-network-family-autoselection
--no-warnings
--node-memory-debug
--openssl-config=file
--openssl-legacy-provider
--openssl-shared-config
--pending-deprecation
--permission
--preserve-symlinks
--preserve-symlinks-main
-p, --print "script"
--prof
--prof-process
--redirect-warnings=file
--report-compact
--report-dir=directory, report-directory=directory
--report-exclude-env
--report-exclude-network
--report-filename=filename
--report-on-fatalerror
--report-on-signal
--report-signal=signal
--report-uncaught-exception
-r, --require module
--run
Intentional limitations
Environment variables
--secure-heap-min=n
--secure-heap=n
--snapshot-blob=path
--test
--test-concurrency
--test-coverage-branches=threshold
--test-coverage-exclude
--test-coverage-functions=threshold
--test-coverage-include
--test-coverage-lines=threshold
--test-force-exit
--test-global-setup=module
--test-isolation=mode
--test-name-pattern
--test-only
--test-reporter
--test-reporter-destination
--test-shard
--test-skip-pattern
--test-timeout
--test-update-snapshots
--throw-deprecation
--title=title
--tls-cipher-list=list
--tls-keylog=file
--tls-max-v1.2
--tls-max-v1.3
--tls-min-v1.0
--tls-min-v1.1
--tls-min-v1.2
--tls-min-v1.3
--trace-deprecation
--trace-env
--trace-env-js-stack
--trace-env-native-stack
--trace-event-categories
--trace-event-file-pattern
--trace-events-enabled
--trace-exit
--trace-require-module=mode
--trace-sigint
--trace-sync-io
--trace-tls
--trace-uncaught
--trace-warnings
--track-heap-objects
--unhandled-rejections=mode
--use-bundled-ca, --use-openssl-ca
--use-largepages=mode
--use-system-ca
--v8-options
--v8-pool-size=num
-v, --version
--watch
--watch-kill-signal
--watch-path
--watch-preserve-output
--zero-fill-buffers
Environment variables
FORCE_COLOR=[1, 2, 3]
NODE_COMPILE_CACHE=dir
NODE_DEBUG=module[,…]
NODE_DEBUG_NATIVE=module[,…]
NODE_DISABLE_COLORS=1
NODE_DISABLE_COMPILE_CACHE=1
NODE_EXTRA_CA_CERTS=file
NODE_ICU_DATA=file
NODE_NO_WARNINGS=1
NODE_OPTIONS=options...
NODE_PATH=path[:…]
NODE_PENDING_DEPRECATION=1
NODE_PENDING_PIPE_INSTANCES=instances
NODE_PRESERVE_SYMLINKS=1
NODE_REDIRECT_WARNINGS=file
NODE_REPL_EXTERNAL_MODULE=file
NODE_REPL_HISTORY=file
NODE_SKIP_PLATFORM_CHECK=value
NODE_TEST_CONTEXT=value
NODE_TLS_REJECT_UNAUTHORIZED=value
NODE_USE_ENV_PROXY=1
NODE_V8_COVERAGE=dir
Coverage output
Source map cache
NO_COLOR=<any>
OPENSSL_CONF=file
SSL_CERT_DIR=dir
SSL_CERT_FILE=file
TZ
UV_THREADPOOL_SIZE=size
Useful V8 options
--abort-on-uncaught-exception
--disallow-code-generation-from-strings
--enable-etw-stack-walking
--expose-gc
--harmony-shadow-realm
--interpreted-frames-native-stack
--jitless
--max-old-space-size=SIZE (in MiB)
--max-semi-space-size=SIZE (in MiB)
--perf-basic-prof
--perf-basic-prof-only-functions
--perf-prof
--perf-prof-unwinding-info
--prof
--security-revert
--stack-trace-limit=limit
Command-line API
#
Node.js comes with a variety of CLI options. These options expose built-in debugging, multiple ways to execute scripts, and other helpful runtime options.
To view this documentation as a manual page in a terminal, run man node.
Synopsis
#
node [options] [V8 options] [<program-entry-point> | -e "script" | -] [--] [arguments]
node inspect [<program-entry-point> | -e "script" | <host>:<port>] …
node --v8-options
Execute without arguments to start the REPL.
For more info about node inspect, see the debugger documentation.
Program entry point
#
The program entry point is a specifier-like string. If the string is not an absolute path, it's resolved as a relative path from the current working directory. That path is then resolved by CommonJS module loader. If no corresponding file is found, an error is thrown.
If a file is found, its path will be passed to the ES module loader under any of the following conditions:
The program was started with a command-line flag that forces the entry point to be loaded with ECMAScript module loader, such as --import.
The file has an .mjs or .wasm (with --experimental-wasm-modules) extension.
The file does not have a .cjs extension, and the nearest parent package.json file contains a top-level "type" field with a value of "module".
Otherwise, the file is loaded using the CommonJS module loader. See Modules loaders for more details.
ECMAScript modules loader entry point caveat
#
When loading, the ES module loader loads the program entry point, the node command will accept as input only files with .js, .mjs, or .cjs extensions. With the following flags, additional file extensions are enabled:
--experimental-wasm-modules for files with .wasm extension.
--experimental-addon-modules for files with .node extension.
Options
#
History









Stability: 2 - Stable
All options, including V8 options, allow words to be separated by both dashes (-) or underscores (_). For example, --pending-deprecation is equivalent to --pending_deprecation.
If an option that takes a single value (such as --max-http-header-size) is passed more than once, then the last passed value is used. Options from the command line take precedence over options passed through the NODE_OPTIONS environment variable.
-
#
Added in: v8.0.0
Alias for stdin. Analogous to the use of - in other command-line utilities, meaning that the script is read from stdin, and the rest of the options are passed to that script.
--
#
Added in: v6.11.0
Indicate the end of node options. Pass the rest of the arguments to the script. If no script filename or eval/print script is supplied prior to this, then the next argument is used as a script filename.
--abort-on-uncaught-exception
#
Added in: v0.10.8
Aborting instead of exiting causes a core file to be generated for post-mortem analysis using a debugger (such as lldb, gdb, and mdb).
If this flag is passed, the behavior can still be set to not abort through process.setUncaughtExceptionCaptureCallback() (and through usage of the node:domain module that uses it).
--allow-addons
#
Added in: v21.6.0, v20.12.0
Stability: 1.1 - Active development
When using the Permission Model, the process will not be able to use native addons by default. Attempts to do so will throw an ERR_DLOPEN_DISABLED unless the user explicitly passes the --allow-addons flag when starting Node.js.
Example:
// Attempt to require an native addon
require('nodejs-addon-example');
copy
$ node --permission --allow-fs-read=* index.js
node:internal/modules/cjs/loader:1319
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Cannot load native addon because loading addons is disabled.
    at Module._extensions..node (node:internal/modules/cjs/loader:1319:18)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Module.require (node:internal/modules/cjs/loader:1115:19)
    at require (node:internal/modules/helpers:130:18)
    at Object.<anonymous> (/home/index.js:1:15)
    at Module._compile (node:internal/modules/cjs/loader:1233:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1287:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12) {
  code: 'ERR_DLOPEN_DISABLED'
}
copy
--allow-child-process
#
History













Stability: 1.1 - Active development
When using the Permission Model, the process will not be able to spawn any child process by default. Attempts to do so will throw an ERR_ACCESS_DENIED unless the user explicitly passes the --allow-child-process flag when starting Node.js.
Example:
const childProcess = require('node:child_process');
// Attempt to bypass the permission
childProcess.spawn('node', ['-e', 'require("fs").writeFileSync("/new-file", "example")']);
copy
$ node --permission --allow-fs-read=* index.js
node:internal/child_process:388
  const err = this._handle.spawn(options);
                           ^
Error: Access to this API has been restricted
    at ChildProcess.spawn (node:internal/child_process:388:28)
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'ChildProcess'
}
copy
The child_process.fork() API inherits the execution arguments from the parent process. This means that if Node.js is started with the Permission Model enabled and the --allow-child-process flag is set, any child process created using child_process.fork() will automatically receive all relevant Permission Model flags.
This behavior also applies to child_process.spawn(), but in that case, the flags are propagated via the NODE_OPTIONS environment variable rather than directly through the process arguments.
--allow-fs-read
#
History





















This flag configures file system read permissions using the Permission Model.
The valid arguments for the --allow-fs-read flag are:
* - To allow all FileSystemRead operations.
Multiple paths can be allowed using multiple --allow-fs-read flags. Example --allow-fs-read=/folder1/ --allow-fs-read=/folder1/
Examples can be found in the File System Permissions documentation.
The initializer module and custom --require modules has a implicit read permission.
$ node --permission -r custom-require.js -r custom-require-2.js index.js
copy
The custom-require.js, custom-require-2.js, and index.js will be by default in the allowed read list.
process.has('fs.read', 'index.js'); // true
process.has('fs.read', 'custom-require.js'); // true
process.has('fs.read', 'custom-require-2.js'); // true
copy
--allow-fs-write
#
History

















This flag configures file system write permissions using the Permission Model.
The valid arguments for the --allow-fs-write flag are:
* - To allow all FileSystemWrite operations.
Multiple paths can be allowed using multiple --allow-fs-write flags. Example --allow-fs-write=/folder1/ --allow-fs-write=/folder1/
Paths delimited by comma (,) are no longer allowed. When passing a single flag with a comma a warning will be displayed.
Examples can be found in the File System Permissions documentation.
--allow-wasi
#
Added in: v22.3.0, v20.16.0
Stability: 1.1 - Active development
When using the Permission Model, the process will not be capable of creating any WASI instances by default. For security reasons, the call will throw an ERR_ACCESS_DENIED unless the user explicitly passes the flag --allow-wasi in the main Node.js process.
Example:
const { WASI } = require('node:wasi');
// Attempt to bypass the permission
new WASI({
  version: 'preview1',
  // Attempt to mount the whole filesystem
  preopens: {
    '/': '/',
  },
});
copy
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:30:49 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WASI',
}
copy
--allow-worker
#
Added in: v20.0.0
Stability: 1.1 - Active development
When using the Permission Model, the process will not be able to create any worker threads by default. For security reasons, the call will throw an ERR_ACCESS_DENIED unless the user explicitly pass the flag --allow-worker in the main Node.js process.
Example:
const { Worker } = require('node:worker_threads');
// Attempt to bypass the permission
new Worker(__filename);
copy
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WorkerThreads'
}
copy
--build-snapshot
#
Added in: v18.8.0
Stability: 1 - Experimental
Generates a snapshot blob when the process exits and writes it to disk, which can be loaded later with --snapshot-blob.
When building the snapshot, if --snapshot-blob is not specified, the generated blob will be written, by default, to snapshot.blob in the current working directory. Otherwise it will be written to the path specified by --snapshot-blob.
$ echo "globalThis.foo = 'I am from the snapshot'" > snapshot.js

# Run snapshot.js to initialize the application and snapshot the
# state of it into snapshot.blob.
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js

$ echo "console.log(globalThis.foo)" > index.js

# Load the generated snapshot and start the application from index.js.
$ node --snapshot-blob snapshot.blob index.js
I am from the snapshot
copy
The v8.startupSnapshot API can be used to specify an entry point at snapshot building time, thus avoiding the need of an additional entry script at deserialization time:
$ echo "require('v8').startupSnapshot.setDeserializeMainFunction(() => console.log('I am from the snapshot'))" > snapshot.js
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js
$ node --snapshot-blob snapshot.blob
I am from the snapshot
copy
For more information, check out the v8.startupSnapshot API documentation.
Currently the support for run-time snapshot is experimental in that:
User-land modules are not yet supported in the snapshot, so only one single file can be snapshotted. Users can bundle their applications into a single script with their bundler of choice before building a snapshot, however.
Only a subset of the built-in modules work in the snapshot, though the Node.js core test suite checks that a few fairly complex applications can be snapshotted. Support for more modules are being added. If any crashes or buggy behaviors occur when building a snapshot, please file a report in the Node.js issue tracker and link to it in the tracking issue for user-land snapshots.
--build-snapshot-config
#
Added in: v21.6.0, v20.12.0
Stability: 1 - Experimental
Specifies the path to a JSON configuration file which configures snapshot creation behavior.
The following options are currently supported:
builder <string> Required. Provides the name to the script that is executed before building the snapshot, as if --build-snapshot had been passed with builder as the main script name.
withoutCodeCache <boolean> Optional. Including the code cache reduces the time spent on compiling functions included in the snapshot at the expense of a bigger snapshot size and potentially breaking portability of the snapshot.
When using this flag, additional script files provided on the command line will not be executed and instead be interpreted as regular command line arguments.
-c, --check
#
History













Syntax check the script without executing.
--completion-bash
#
Added in: v10.12.0
Print source-able bash completion script for Node.js.
node --completion-bash > node_bash_completion
source node_bash_completion
copy
-C condition, --conditions=condition
#
History













Provide custom conditional exports resolution conditions.
Any number of custom string condition names are permitted.
The default Node.js conditions of "node", "default", "import", and "require" will always apply as defined.
For example, to run a module with "development" resolutions:
node -C development app.js
copy
--cpu-prof
#
History













Starts the V8 CPU profiler on start up, and writes the CPU profile to disk before exit.
If --cpu-prof-dir is not specified, the generated profile is placed in the current working directory.
If --cpu-prof-name is not specified, the generated profile is named CPU.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.cpuprofile.
$ node --cpu-prof index.js
$ ls *.cpuprofile
CPU.20190409.202950.15293.0.0.cpuprofile
copy
If --cpu-prof-name is specified, the provided value will be used as-is; patterns such as ${hhmmss} or ${pid} are not supported.
$ node --cpu-prof --cpu-prof-name 'CPU.${pid}.cpuprofile' index.js
$ ls *.cpuprofile
'CPU.${pid}.cpuprofile'
copy
--cpu-prof-dir
#
History













Specify the directory where the CPU profiles generated by --cpu-prof will be placed.
The default value is controlled by the --diagnostic-dir command-line option.
--cpu-prof-interval
#
History













Specify the sampling interval in microseconds for the CPU profiles generated by --cpu-prof. The default is 1000 microseconds.
--cpu-prof-name
#
History













Specify the file name of the CPU profile generated by --cpu-prof.
--diagnostic-dir=directory
#
Set the directory to which all diagnostic output files are written. Defaults to current working directory.
Affects the default output directory of:
--cpu-prof-dir
--heap-prof-dir
--redirect-warnings
--disable-proto=mode
#
Added in: v13.12.0, v12.17.0
Disable the Object.prototype.__proto__ property. If mode is delete, the property is removed entirely. If mode is throw, accesses to the property throw an exception with the code ERR_PROTO_ACCESS.
--disable-sigusr1
#
Added in: v23.7.0, v22.14.0
Stability: 1.2 - Release candidate
Disable the ability of starting a debugging session by sending a SIGUSR1 signal to the process.
--disable-warning=code-or-type
#
Added in: v21.3.0, v20.11.0
Stability: 1.1 - Active development
Disable specific process warnings by code or type.
Warnings emitted from process.emitWarning() may contain a code and a type. This option will not-emit warnings that have a matching code or type.
List of deprecation warnings.
The Node.js core warning types are: DeprecationWarning and ExperimentalWarning
For example, the following script will not emit DEP0025 require('node:sys') when executed with node --disable-warning=DEP0025:
const sys = require('node:sys');
copy
For example, the following script will emit the DEP0025 require('node:sys'), but not any Experimental Warnings (such as ExperimentalWarning: vm.measureMemory is an experimental feature in <=v21) when executed with node --disable-warning=ExperimentalWarning:
const sys = require('node:sys');
const vm = require('node:vm');

vm.measureMemory();
copy
--disable-wasm-trap-handler
#
Added in: v22.2.0, v20.15.0
By default, Node.js enables trap-handler-based WebAssembly bound checks. As a result, V8 does not need to insert inline bound checks int the code compiled from WebAssembly which may speedup WebAssembly execution significantly, but this optimization requires allocating a big virtual memory cage (currently 10GB). If the Node.js process does not have access to a large enough virtual memory address space due to system configurations or hardware limitations, users won't be able to run any WebAssembly that involves allocation in this virtual memory cage and will see an out-of-memory error.
$ ulimit -v 5000000
$ node -p "new WebAssembly.Memory({ initial: 10, maximum: 100 });"
[eval]:1
new WebAssembly.Memory({ initial: 10, maximum: 100 });
^

RangeError: WebAssembly.Memory(): could not allocate memory
    at [eval]:1:1
    at runScriptInThisContext (node:internal/vm:209:10)
    at node:internal/process/execution:118:14
    at [eval]-wrapper:6:24
    at runScript (node:internal/process/execution:101:62)
    at evalScript (node:internal/process/execution:136:3)
    at node:internal/main/eval_string:49:3

copy
--disable-wasm-trap-handler disables this optimization so that users can at least run WebAssembly (with less optimal performance) when the virtual memory address space available to their Node.js process is lower than what the V8 WebAssembly memory cage needs.
--disallow-code-generation-from-strings
#
Added in: v9.8.0
Make built-in language features like eval and new Function that generate code from strings throw an exception instead. This does not affect the Node.js node:vm module.
--dns-result-order=order
#
History

















Set the default value of order in dns.lookup() and dnsPromises.lookup(). The value could be:
ipv4first: sets default order to ipv4first.
ipv6first: sets default order to ipv6first.
verbatim: sets default order to verbatim.
The default is verbatim and dns.setDefaultResultOrder() have higher priority than --dns-result-order.
--enable-fips
#
Added in: v6.0.0
Enable FIPS-compliant crypto at startup. (Requires Node.js to be built against FIPS-compatible OpenSSL.)
--enable-network-family-autoselection
#
Added in: v18.18.0
Enables the family autoselection algorithm unless connection options explicitly disables it.
--enable-source-maps
#
History













Enable Source Map support for stack traces.
When using a transpiler, such as TypeScript, stack traces thrown by an application reference the transpiled code, not the original source position. --enable-source-maps enables caching of Source Maps and makes a best effort to report stack traces relative to the original source file.
Overriding Error.prepareStackTrace may prevent --enable-source-maps from modifying the stack trace. Call and return the results of the original Error.prepareStackTrace in the overriding function to modify the stack trace with source maps.
const originalPrepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (error, trace) => {
  // Modify error and trace and format stack trace with
  // original Error.prepareStackTrace.
  return originalPrepareStackTrace(error, trace);
};
copy
Note, enabling source maps can introduce latency to your application when Error.stack is accessed. If you access Error.stack frequently in your application, take into account the performance implications of --enable-source-maps.
--entry-url
#
Added in: v23.0.0, v22.10.0
Stability: 1 - Experimental
When present, Node.js will interpret the entry point as a URL, rather than a path.
Follows ECMAScript module resolution rules.
Any query parameter or hash in the URL will be accessible via import.meta.url.
node --entry-url 'file:///path/to/file.js?queryparams=work#and-hashes-too'
node --entry-url 'file.ts?query#hash'
node --entry-url 'data:text/javascript,console.log("Hello")'
copy
--env-file-if-exists=config
#
Added in: v22.9.0
Stability: 1.1 - Active development
Behavior is the same as --env-file, but an error is not thrown if the file does not exist.
--env-file=config
#
History













Stability: 1.1 - Active development
Loads environment variables from a file relative to the current directory, making them available to applications on process.env. The environment variables which configure Node.js, such as NODE_OPTIONS, are parsed and applied. If the same variable is defined in the environment and in the file, the value from the environment takes precedence.
You can pass multiple --env-file arguments. Subsequent files override pre-existing variables defined in previous files.
An error is thrown if the file does not exist.
node --env-file=.env --env-file=.development.env index.js
copy
The format of the file should be one line per key-value pair of environment variable name and value separated by =:
PORT=3000
copy
Any text after a # is treated as a comment:
# This is a comment
PORT=3000 # This is also a comment
copy
Values can start and end with the following quotes: `, " or '. They are omitted from the values.
USERNAME="nodejs" # will result in `nodejs` as the value.
copy
Multi-line values are supported:
MULTI_LINE="THIS IS
A MULTILINE"
# will result in `THIS IS\nA MULTILINE` as the value.
copy
Export keyword before a key is ignored:
export USERNAME="nodejs" # will result in `nodejs` as the value.
copy
If you want to load environment variables from a file that may not exist, you can use the --env-file-if-exists flag instead.
-e, --eval "script"
#
History

















Evaluate the following argument as JavaScript. The modules which are predefined in the REPL can also be used in script.
On Windows, using cmd.exe a single quote will not work correctly because it only recognizes double " for quoting. In Powershell or Git bash, both ' and " are usable.
It is possible to run code containing inline types unless the --no-experimental-strip-types flag is provided.
--experimental-addon-modules
#
Added in: v23.6.0
Stability: 1.0 - Early development
Enable experimental import support for .node addons.
--experimental-config-file=config
#
Added in: v23.10.0
Stability: 1.0 - Early development
If present, Node.js will look for a configuration file at the specified path. Node.js will read the configuration file and apply the settings. The configuration file should be a JSON file with the following structure. vX.Y.Z in the $schema must be replaced with the version of Node.js you are using.
{
  "$schema": "https://nodejs.org/dist/vX.Y.Z/docs/node-config-schema.json",
  "nodeOptions": {
    "import": [
      "amaro/strip"
    ],
    "watch-path": "src",
    "watch-preserve-output": true
  },
  "testRunner": {
    "test-isolation": "process"
  }
}
copy
The configuration file supports namespace-specific options:
The nodeOptions field contains CLI flags that are allowed in NODE_OPTIONS.
Namespace fields like testRunner contain configuration specific to that subsystem.
No-op flags are not supported. Not all V8 flags are currently supported.
It is possible to use the official JSON schema to validate the configuration file, which may vary depending on the Node.js version. Each key in the configuration file corresponds to a flag that can be passed as a command-line argument. The value of the key is the value that would be passed to the flag.
For example, the configuration file above is equivalent to the following command-line arguments:
node --import amaro/strip --watch-path=src --watch-preserve-output --test-isolation=process
copy
The priority in configuration is as follows:
NODE_OPTIONS and command-line options
Configuration file
Dotenv NODE_OPTIONS
Values in the configuration file will not override the values in the environment variables and command-line options, but will override the values in the NODE_OPTIONS env file parsed by the --env-file flag.
Keys cannot be duplicated within the same or different namespaces.
The configuration parser will throw an error if the configuration file contains unknown keys or keys that cannot be used in a namespace.
Node.js will not sanitize or perform validation on the user-provided configuration, so NEVER use untrusted configuration files.
--experimental-default-config-file
#
Added in: v23.10.0
Stability: 1.0 - Early development
If the --experimental-default-config-file flag is present, Node.js will look for a node.config.json file in the current working directory and load it as a as configuration file.
--experimental-eventsource
#
Added in: v22.3.0, v20.18.0
Enable exposition of EventSource Web API on the global scope.
--experimental-import-meta-resolve
#
History













Enable experimental import.meta.resolve() parent URL support, which allows passing a second parentURL argument for contextual resolution.
Previously gated the entire import.meta.resolve feature.
--experimental-loader=module
#
History

















This flag is discouraged and may be removed in a future version of Node.js. Please use --import with register() instead.
Specify the module containing exported module customization hooks. module may be any string accepted as an import specifier.
This feature requires --allow-worker if used with the Permission Model.
--experimental-network-inspection
#
Added in: v22.6.0, v20.18.0
Stability: 1 - Experimental
Enable experimental support for the network inspection with Chrome DevTools.
--experimental-print-required-tla
#
Added in: v22.0.0, v20.17.0
If the ES module being require()'d contains top-level await, this flag allows Node.js to evaluate the module, try to locate the top-level awaits, and print their location to help users find them.
--experimental-require-module
#
History













Stability: 1.1 - Active Development
Supports loading a synchronous ES module graph in require().
See Loading ECMAScript modules using require().
--experimental-sea-config
#
Added in: v20.0.0
Stability: 1 - Experimental
Use this flag to generate a blob that can be injected into the Node.js binary to produce a single executable application. See the documentation about this configuration for details.
--experimental-shadow-realm
#
Added in: v19.0.0, v18.13.0
Use this flag to enable ShadowRealm support.
--experimental-test-coverage
#
History













When used in conjunction with the node:test module, a code coverage report is generated as part of the test runner output. If no tests are run, a coverage report is not generated. See the documentation on collecting code coverage from tests for more details.
--experimental-test-module-mocks
#
History













Stability: 1.0 - Early development
Enable module mocking in the test runner.
This feature requires --allow-worker if used with the Permission Model.
--experimental-transform-types
#
Added in: v22.7.0
Stability: 1.2 - Release candidate
Enables the transformation of TypeScript-only syntax into JavaScript code. Implies --enable-source-maps.
--experimental-vm-modules
#
Added in: v9.6.0
Enable experimental ES Module support in the node:vm module.
--experimental-wasi-unstable-preview1
#
History

















Enable experimental WebAssembly System Interface (WASI) support.
--experimental-wasm-modules
#
Added in: v12.3.0
Enable experimental WebAssembly module support.
--experimental-webstorage
#
Added in: v22.4.0
Enable experimental Web Storage support.
--experimental-worker-inspection
#
Added in: v24.1.0
Stability: 1.1 - Active Development
Enable experimental support for the worker inspection with Chrome DevTools.
--expose-gc
#
Added in: v22.3.0, v20.18.0
Stability: 1 - Experimental. This flag is inherited from V8 and is subject to change upstream.
This flag will expose the gc extension from V8.
if (globalThis.gc) {
  globalThis.gc();
}
copy
--force-context-aware
#
Added in: v12.12.0
Disable loading native addons that are not context-aware.
--force-fips
#
Added in: v6.0.0
Force FIPS-compliant crypto on startup. (Cannot be disabled from script code.) (Same requirements as --enable-fips.)
--force-node-api-uncaught-exceptions-policy
#
Added in: v18.3.0, v16.17.0
Enforces uncaughtException event on Node-API asynchronous callbacks.
To prevent from an existing add-on from crashing the process, this flag is not enabled by default. In the future, this flag will be enabled by default to enforce the correct behavior.
--frozen-intrinsics
#
Added in: v11.12.0
Stability: 1 - Experimental
Enable experimental frozen intrinsics like Array and Object.
Only the root context is supported. There is no guarantee that globalThis.Array is indeed the default intrinsic reference. Code may break under this flag.
To allow polyfills to be added, --require and --import both run before freezing intrinsics.
--heap-prof
#
History













Starts the V8 heap profiler on start up, and writes the heap profile to disk before exit.
If --heap-prof-dir is not specified, the generated profile is placed in the current working directory.
If --heap-prof-name is not specified, the generated profile is named Heap.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.heapprofile.
$ node --heap-prof index.js
$ ls *.heapprofile
Heap.20190409.202950.15293.0.001.heapprofile
copy
--heap-prof-dir
#
History













Specify the directory where the heap profiles generated by --heap-prof will be placed.
The default value is controlled by the --diagnostic-dir command-line option.
--heap-prof-interval
#
History













Specify the average sampling interval in bytes for the heap profiles generated by --heap-prof. The default is 512 * 1024 bytes.
--heap-prof-name
#
History













Specify the file name of the heap profile generated by --heap-prof.
--heapsnapshot-near-heap-limit=max_count
#
Added in: v15.1.0, v14.18.0
Stability: 1 - Experimental
Writes a V8 heap snapshot to disk when the V8 heap usage is approaching the heap limit. count should be a non-negative integer (in which case Node.js will write no more than max_count snapshots to disk).
When generating snapshots, garbage collection may be triggered and bring the heap usage down. Therefore multiple snapshots may be written to disk before the Node.js instance finally runs out of memory. These heap snapshots can be compared to determine what objects are being allocated during the time consecutive snapshots are taken. It's not guaranteed that Node.js will write exactly max_count snapshots to disk, but it will try its best to generate at least one and up to max_count snapshots before the Node.js instance runs out of memory when max_count is greater than 0.
Generating V8 snapshots takes time and memory (both memory managed by the V8 heap and native memory outside the V8 heap). The bigger the heap is, the more resources it needs. Node.js will adjust the V8 heap to accommodate the additional V8 heap memory overhead, and try its best to avoid using up all the memory available to the process. When the process uses more memory than the system deems appropriate, the process may be terminated abruptly by the system, depending on the system configuration.
$ node --max-old-space-size=100 --heapsnapshot-near-heap-limit=3 index.js
Wrote snapshot to Heap.20200430.100036.49580.0.001.heapsnapshot
Wrote snapshot to Heap.20200430.100037.49580.0.002.heapsnapshot
Wrote snapshot to Heap.20200430.100038.49580.0.003.heapsnapshot

<--- Last few GCs --->

[49580:0x110000000]     4826 ms: Mark-sweep 130.6 (147.8) -> 130.5 (147.8) MB, 27.4 / 0.0 ms  (average mu = 0.126, current mu = 0.034) allocation failure scavenge might not succeed
[49580:0x110000000]     4845 ms: Mark-sweep 130.6 (147.8) -> 130.6 (147.8) MB, 18.8 / 0.0 ms  (average mu = 0.088, current mu = 0.031) allocation failure scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
....
copy
--heapsnapshot-signal=signal
#
Added in: v12.0.0
Enables a signal handler that causes the Node.js process to write a heap dump when the specified signal is received. signal must be a valid signal name. Disabled by default.
$ node --heapsnapshot-signal=SIGUSR2 index.js &
$ ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
node         1  5.5  6.1 787252 247004 ?       Ssl  16:43   0:02 node --heapsnapshot-signal=SIGUSR2 index.js
$ kill -USR2 1
$ ls
Heap.20190718.133405.15554.0.001.heapsnapshot
copy
-h, --help
#
Added in: v0.1.3
Print node command-line options. The output of this option is less detailed than this document.
--icu-data-dir=file
#
Added in: v0.11.15
Specify ICU data load path. (Overrides NODE_ICU_DATA.)
--import=module
#
Added in: v19.0.0, v18.18.0
Stability: 1 - Experimental
Preload the specified module at startup. If the flag is provided several times, each module will be executed sequentially in the order they appear, starting with the ones provided in NODE_OPTIONS.
Follows ECMAScript module resolution rules. Use --require to load a CommonJS module. Modules preloaded with --require will run before modules preloaded with --import.
Modules are preloaded into the main thread as well as any worker threads, forked processes, or clustered processes.
--input-type=type
#
History

















This configures Node.js to interpret --eval or STDIN input as CommonJS or as an ES module. Valid values are "commonjs", "module", "module-typescript" and "commonjs-typescript". The "-typescript" values are not available with the flag --no-experimental-strip-types. The default is no value, or "commonjs" if --no-experimental-detect-module is passed.
If --input-type is not provided, Node.js will try to detect the syntax with the following steps:
Run the input as CommonJS.
If step 1 fails, run the input as an ES module.
If step 2 fails with a SyntaxError, strip the types.
If step 3 fails with an error code ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX or ERR_INVALID_TYPESCRIPT_SYNTAX, throw the error from step 2, including the TypeScript error in the message, else run as CommonJS.
If step 4 fails, run the input as an ES module.
To avoid the delay of multiple syntax detection passes, the --input-type=type flag can be used to specify how the --eval input should be interpreted.
The REPL does not support this option. Usage of --input-type=module with --print will throw an error, as --print does not support ES module syntax.
--insecure-http-parser
#
Added in: v13.4.0, v12.15.0, v10.19.0
Enable leniency flags on the HTTP parser. This may allow interoperability with non-conformant HTTP implementations.
When enabled, the parser will accept the following:
Invalid HTTP headers values.
Invalid HTTP versions.
Allow message containing both Transfer-Encoding and Content-Length headers.
Allow extra data after message when Connection: close is present.
Allow extra transfer encodings after chunked has been provided.
Allow \n to be used as token separator instead of \r\n.
Allow \r\n not to be provided after a chunk.
Allow spaces to be present after a chunk size and before \r\n.
All the above will expose your application to request smuggling or poisoning attack. Avoid using this option.
Warning: binding inspector to a public IP:port combination is insecure
#
Binding the inspector to a public IP (including 0.0.0.0) with an open port is insecure, as it allows external hosts to connect to the inspector and perform a remote code execution attack.
If specifying a host, make sure that either:
The host is not accessible from public networks.
A firewall disallows unwanted connections on the port.
More specifically, --inspect=0.0.0.0 is insecure if the port (9229 by default) is not firewall-protected.
See the debugging security implications section for more information.
--inspect-brk[=[host:]port]
#
Added in: v7.6.0
Activate inspector on host:port and break at start of user script. Default host:port is 127.0.0.1:9229. If port 0 is specified, a random available port will be used.
See V8 Inspector integration for Node.js for further explanation on Node.js debugger.
--inspect-port=[host:]port
#
Added in: v7.6.0
Set the host:port to be used when the inspector is activated. Useful when activating the inspector by sending the SIGUSR1 signal. Except when --disable-sigusr1 is passed.
Default host is 127.0.0.1. If port 0 is specified, a random available port will be used.
See the security warning below regarding the host parameter usage.
--inspect-publish-uid=stderr,http
#
Specify ways of the inspector web socket url exposure.
By default inspector websocket url is available in stderr and under /json/list endpoint on http://host:port/json/list.
--inspect-wait[=[host:]port]
#
Added in: v22.2.0, v20.15.0
Activate inspector on host:port and wait for debugger to be attached. Default host:port is 127.0.0.1:9229. If port 0 is specified, a random available port will be used.
See V8 Inspector integration for Node.js for further explanation on Node.js debugger.
--inspect[=[host:]port]
#
Added in: v6.3.0
Activate inspector on host:port. Default is 127.0.0.1:9229. If port 0 is specified, a random available port will be used.
V8 inspector integration allows tools such as Chrome DevTools and IDEs to debug and profile Node.js instances. The tools attach to Node.js instances via a tcp port and communicate using the Chrome DevTools Protocol. See V8 Inspector integration for Node.js for further explanation on Node.js debugger.
-i, --interactive
#
Added in: v0.7.7
Opens the REPL even if stdin does not appear to be a terminal.
--jitless
#
Added in: v12.0.0
Stability: 1 - Experimental. This flag is inherited from V8 and is subject to change upstream.
Disable runtime allocation of executable memory. This may be required on some platforms for security reasons. It can also reduce attack surface on other platforms, but the performance impact may be severe.
--localstorage-file=file
#
Added in: v22.4.0
The file used to store localStorage data. If the file does not exist, it is created the first time localStorage is accessed. The same file may be shared between multiple Node.js processes concurrently. This flag is a no-op unless Node.js is started with the --experimental-webstorage flag.
--max-http-header-size=size
#
History













Specify the maximum size, in bytes, of HTTP headers. Defaults to 16 KiB.
--napi-modules
#
Added in: v7.10.0
This option is a no-op. It is kept for compatibility.
--network-family-autoselection-attempt-timeout
#
Added in: v22.1.0, v20.13.0
Sets the default value for the network family autoselection attempt timeout. For more information, see net.getDefaultAutoSelectFamilyAttemptTimeout().
--no-addons
#
Added in: v16.10.0, v14.19.0
Disable the node-addons exports condition as well as disable loading native addons. When --no-addons is specified, calling process.dlopen or requiring a native C++ addon will fail and throw an exception.
--no-async-context-frame
#
Added in: v24.0.0
Disables the use of AsyncLocalStorage backed by AsyncContextFrame and uses the prior implementation which relied on async_hooks. The previous model is retained for compatibility with Electron and for cases where the context flow may differ. However, if a difference in flow is found please report it.
--no-deprecation
#
Added in: v0.8.0
Silence deprecation warnings.
--no-experimental-detect-module
#
History













Disable using syntax detection to determine module type.
--no-experimental-global-navigator
#
Added in: v21.2.0
Stability: 1 - Experimental
Disable exposition of Navigator API on the global scope.
--no-experimental-repl-await
#
Added in: v16.6.0
Use this flag to disable top-level await in REPL.
--no-experimental-require-module
#
History













Stability: 1.1 - Active Development
Disable support for loading a synchronous ES module graph in require().
See Loading ECMAScript modules using require().
--no-experimental-sqlite
#
History













Disable the experimental node:sqlite module.
--no-experimental-strip-types
#
History













Stability: 1.2 - Release candidate
Disable experimental type-stripping for TypeScript files. For more information, see the TypeScript type-stripping documentation.
--no-experimental-websocket
#
Added in: v22.0.0
Disable exposition of <WebSocket> on the global scope.
--no-extra-info-on-fatal-exception
#
Added in: v17.0.0
Hide extra information on fatal exception that causes exit.
--no-force-async-hooks-checks
#
Added in: v9.0.0
Disables runtime checks for async_hooks. These will still be enabled dynamically when async_hooks is enabled.
--no-global-search-paths
#
Added in: v16.10.0
Do not search modules from global paths like $HOME/.node_modules and $NODE_PATH.
--no-network-family-autoselection
#
History













Disables the family autoselection algorithm unless connection options explicitly enables it.
--no-warnings
#
Added in: v6.0.0
Silence all process warnings (including deprecations).
--node-memory-debug
#
Added in: v15.0.0, v14.18.0
Enable extra debug checks for memory leaks in Node.js internals. This is usually only useful for developers debugging Node.js itself.
--openssl-config=file
#
Added in: v6.9.0
Load an OpenSSL configuration file on startup. Among other uses, this can be used to enable FIPS-compliant crypto if Node.js is built against FIPS-enabled OpenSSL.
--openssl-legacy-provider
#
Added in: v17.0.0, v16.17.0
Enable OpenSSL 3.0 legacy provider. For more information please see OSSL_PROVIDER-legacy.
--openssl-shared-config
#
Added in: v18.5.0, v16.17.0, v14.21.0
Enable OpenSSL default configuration section, openssl_conf to be read from the OpenSSL configuration file. The default configuration file is named openssl.cnf but this can be changed using the environment variable OPENSSL_CONF, or by using the command line option --openssl-config. The location of the default OpenSSL configuration file depends on how OpenSSL is being linked to Node.js. Sharing the OpenSSL configuration may have unwanted implications and it is recommended to use a configuration section specific to Node.js which is nodejs_conf and is default when this option is not used.
--pending-deprecation
#
Added in: v8.0.0
Emit pending deprecation warnings.
Pending deprecations are generally identical to a runtime deprecation with the notable exception that they are turned off by default and will not be emitted unless either the --pending-deprecation command-line flag, or the NODE_PENDING_DEPRECATION=1 environment variable, is set. Pending deprecations are used to provide a kind of selective "early warning" mechanism that developers may leverage to detect deprecated API usage.
--permission
#
History













Enable the Permission Model for current process. When enabled, the following permissions are restricted:
File System - manageable through --allow-fs-read, --allow-fs-write flags
Child Process - manageable through --allow-child-process flag
Worker Threads - manageable through --allow-worker flag
WASI - manageable through --allow-wasi flag
Addons - manageable through --allow-addons flag
--preserve-symlinks
#
Added in: v6.3.0
Instructs the module loader to preserve symbolic links when resolving and caching modules.
By default, when Node.js loads a module from a path that is symbolically linked to a different on-disk location, Node.js will dereference the link and use the actual on-disk "real path" of the module as both an identifier and as a root path to locate other dependency modules. In most cases, this default behavior is acceptable. However, when using symbolically linked peer dependencies, as illustrated in the example below, the default behavior causes an exception to be thrown if moduleA attempts to require moduleB as a peer dependency:
{appDir}
 ├── app
 │   ├── index.js
 │   └── node_modules
 │       ├── moduleA -> {appDir}/moduleA
 │       └── moduleB
 │           ├── index.js
 │           └── package.json
 └── moduleA
     ├── index.js
     └── package.json
copy
The --preserve-symlinks command-line flag instructs Node.js to use the symlink path for modules as opposed to the real path, allowing symbolically linked peer dependencies to be found.
Note, however, that using --preserve-symlinks can have other side effects. Specifically, symbolically linked native modules can fail to load if those are linked from more than one location in the dependency tree (Node.js would see those as two separate modules and would attempt to load the module multiple times, causing an exception to be thrown).
The --preserve-symlinks flag does not apply to the main module, which allows node --preserve-symlinks node_module/.bin/<foo> to work. To apply the same behavior for the main module, also use --preserve-symlinks-main.
--preserve-symlinks-main
#
Added in: v10.2.0
Instructs the module loader to preserve symbolic links when resolving and caching the main module (require.main).
This flag exists so that the main module can be opted-in to the same behavior that --preserve-symlinks gives to all other imports; they are separate flags, however, for backward compatibility with older Node.js versions.
--preserve-symlinks-main does not imply --preserve-symlinks; use --preserve-symlinks-main in addition to --preserve-symlinks when it is not desirable to follow symlinks before resolving relative paths.
See --preserve-symlinks for more information.
-p, --print "script"
#
History













Identical to -e but prints the result.
--prof
#
Added in: v2.0.0
Generate V8 profiler output.
--prof-process
#
Added in: v5.2.0
Process V8 profiler output generated using the V8 option --prof.
--redirect-warnings=file
#
Added in: v8.0.0
Write process warnings to the given file instead of printing to stderr. The file will be created if it does not exist, and will be appended to if it does. If an error occurs while attempting to write the warning to the file, the warning will be written to stderr instead.
The file name may be an absolute path. If it is not, the default directory it will be written to is controlled by the --diagnostic-dir command-line option.
--report-compact
#
Added in: v13.12.0, v12.17.0
Write reports in a compact format, single-line JSON, more easily consumable by log processing systems than the default multi-line format designed for human consumption.
--report-dir=directory, report-directory=directory
#
History

















Location at which the report will be generated.
--report-exclude-env
#
Added in: v23.3.0, v22.13.0
When --report-exclude-env is passed the diagnostic report generated will not contain the environmentVariables data.
--report-exclude-network
#
Added in: v22.0.0, v20.13.0
Exclude header.networkInterfaces from the diagnostic report. By default this is not set and the network interfaces are included.
--report-filename=filename
#
History

















Name of the file to which the report will be written.
If the filename is set to 'stdout' or 'stderr', the report is written to the stdout or stderr of the process respectively.
--report-on-fatalerror
#
History

















Enables the report to be triggered on fatal errors (internal errors within the Node.js runtime such as out of memory) that lead to termination of the application. Useful to inspect various diagnostic data elements such as heap, stack, event loop state, resource consumption etc. to reason about the fatal error.
--report-on-signal
#
History

















Enables report to be generated upon receiving the specified (or predefined) signal to the running Node.js process. The signal to trigger the report is specified through --report-signal.
--report-signal=signal
#
History

















Sets or resets the signal for report generation (not supported on Windows). Default signal is SIGUSR2.
--report-uncaught-exception
#
History





















Enables report to be generated when the process exits due to an uncaught exception. Useful when inspecting the JavaScript stack in conjunction with native stack and other runtime environment data.
-r, --require module
#
History













Preload the specified module at startup.
Follows require()'s module resolution rules. module may be either a path to a file, or a node module name.
Modules preloaded with --require will run before modules preloaded with --import.
Modules are preloaded into the main thread as well as any worker threads, forked processes, or clustered processes.
--run
#
History





















This runs a specified command from a package.json's "scripts" object. If a missing "command" is provided, it will list the available scripts.
--run will traverse up to the root directory and finds a package.json file to run the command from.
--run prepends ./node_modules/.bin for each ancestor of the current directory, to the PATH in order to execute the binaries from different folders where multiple node_modules directories are present, if ancestor-folder/node_modules/.bin is a directory.
--run executes the command in the directory containing the related package.json.
For example, the following command will run the test script of the package.json in the current folder:
$ node --run test
copy
You can also pass arguments to the command. Any argument after -- will be appended to the script:
$ node --run test -- --verbose
copy
Intentional limitations
#
node --run is not meant to match the behaviors of npm run or of the run commands of other package managers. The Node.js implementation is intentionally more limited, in order to focus on top performance for the most common use cases. Some features of other run implementations that are intentionally excluded are:
Running pre or post scripts in addition to the specified script.
Defining package manager-specific environment variables.
Environment variables
#
The following environment variables are set when running a script with --run:
NODE_RUN_SCRIPT_NAME: The name of the script being run. For example, if --run is used to run test, the value of this variable will be test.
NODE_RUN_PACKAGE_JSON_PATH: The path to the package.json that is being processed.
--secure-heap-min=n
#
Added in: v15.6.0
When using --secure-heap, the --secure-heap-min flag specifies the minimum allocation from the secure heap. The minimum value is 2. The maximum value is the lesser of --secure-heap or 2147483647. The value given must be a power of two.
--secure-heap=n
#
Added in: v15.6.0
Initializes an OpenSSL secure heap of n bytes. When initialized, the secure heap is used for selected types of allocations within OpenSSL during key generation and other operations. This is useful, for instance, to prevent sensitive information from leaking due to pointer overruns or underruns.
The secure heap is a fixed size and cannot be resized at runtime so, if used, it is important to select a large enough heap to cover all application uses.
The heap size given must be a power of two. Any value less than 2 will disable the secure heap.
The secure heap is disabled by default.
The secure heap is not available on Windows.
See CRYPTO_secure_malloc_init for more details.
--snapshot-blob=path
#
Added in: v18.8.0
Stability: 1 - Experimental
When used with --build-snapshot, --snapshot-blob specifies the path where the generated snapshot blob is written to. If not specified, the generated blob is written to snapshot.blob in the current working directory.
When used without --build-snapshot, --snapshot-blob specifies the path to the blob that is used to restore the application state.
When loading a snapshot, Node.js checks that:
The version, architecture, and platform of the running Node.js binary are exactly the same as that of the binary that generates the snapshot.
The V8 flags and CPU features are compatible with that of the binary that generates the snapshot.
If they don't match, Node.js refuses to load the snapshot and exits with status code 1.
--test
#
History

















Starts the Node.js command line test runner. This flag cannot be combined with --watch-path, --check, --eval, --interactive, or the inspector. See the documentation on running tests from the command line for more details.
--test-concurrency
#
Added in: v21.0.0, v20.10.0, v18.19.0
The maximum number of test files that the test runner CLI will execute concurrently. If --test-isolation is set to 'none', this flag is ignored and concurrency is one. Otherwise, concurrency defaults to os.availableParallelism() - 1.
--test-coverage-branches=threshold
#
Added in: v22.8.0
Stability: 1 - Experimental
Require a minimum percent of covered branches. If code coverage does not reach the threshold specified, the process will exit with code 1.
--test-coverage-exclude
#
Added in: v22.5.0
Stability: 1 - Experimental
Excludes specific files from code coverage using a glob pattern, which can match both absolute and relative file paths.
This option may be specified multiple times to exclude multiple glob patterns.
If both --test-coverage-exclude and --test-coverage-include are provided, files must meet both criteria to be included in the coverage report.
By default all the matching test files are excluded from the coverage report. Specifying this option will override the default behavior.
--test-coverage-functions=threshold
#
Added in: v22.8.0
Stability: 1 - Experimental
Require a minimum percent of covered functions. If code coverage does not reach the threshold specified, the process will exit with code 1.
--test-coverage-include
#
Added in: v22.5.0
Stability: 1 - Experimental
Includes specific files in code coverage using a glob pattern, which can match both absolute and relative file paths.
This option may be specified multiple times to include multiple glob patterns.
If both --test-coverage-exclude and --test-coverage-include are provided, files must meet both criteria to be included in the coverage report.
--test-coverage-lines=threshold
#
Added in: v22.8.0
Stability: 1 - Experimental
Require a minimum percent of covered lines. If code coverage does not reach the threshold specified, the process will exit with code 1.
--test-force-exit
#
Added in: v22.0.0, v20.14.0
Configures the test runner to exit the process once all known tests have finished executing even if the event loop would otherwise remain active.
--test-global-setup=module
#
Added in: v24.0.0
Stability: 1.0 - Early development
Specify a module that will be evaluated before all tests are executed and can be used to setup global state or fixtures for tests.
See the documentation on global setup and teardown for more details.
--test-isolation=mode
#
History













Configures the type of test isolation used in the test runner. When mode is 'process', each test file is run in a separate child process. When mode is 'none', all test files run in the same process as the test runner. The default isolation mode is 'process'. This flag is ignored if the --test flag is not present. See the test runner execution model section for more information.
--test-name-pattern
#
History













A regular expression that configures the test runner to only execute tests whose name matches the provided pattern. See the documentation on filtering tests by name for more details.
If both --test-name-pattern and --test-skip-pattern are supplied, tests must satisfy both requirements in order to be executed.
--test-only
#
History













Configures the test runner to only execute top level tests that have the only option set. This flag is not necessary when test isolation is disabled.
--test-reporter
#
History













A test reporter to use when running tests. See the documentation on test reporters for more details.
--test-reporter-destination
#
History













The destination for the corresponding test reporter. See the documentation on test reporters for more details.
--test-shard
#
Added in: v20.5.0, v18.19.0
Test suite shard to execute in a format of <index>/<total>, where
index is a positive integer, index of divided parts.
total is a positive integer, total of divided part.
This command will divide all tests files into total equal parts, and will run only those that happen to be in an index part.
For example, to split your tests suite into three parts, use this:
node --test --test-shard=1/3
node --test --test-shard=2/3
node --test --test-shard=3/3
copy
--test-skip-pattern
#
Added in: v22.1.0
A regular expression that configures the test runner to skip tests whose name matches the provided pattern. See the documentation on filtering tests by name for more details.
If both --test-name-pattern and --test-skip-pattern are supplied, tests must satisfy both requirements in order to be executed.
--test-timeout
#
Added in: v21.2.0, v20.11.0
A number of milliseconds the test execution will fail after. If unspecified, subtests inherit this value from their parent. The default value is Infinity.
--test-update-snapshots
#
History













Regenerates the snapshot files used by the test runner for snapshot testing.
--throw-deprecation
#
Added in: v0.11.14
Throw errors for deprecations.
--title=title
#
Added in: v10.7.0
Set process.title on startup.
--tls-cipher-list=list
#
Added in: v4.0.0
Specify an alternative default TLS cipher list. Requires Node.js to be built with crypto support (default).
--tls-keylog=file
#
Added in: v13.2.0, v12.16.0
Log TLS key material to a file. The key material is in NSS SSLKEYLOGFILE format and can be used by software (such as Wireshark) to decrypt the TLS traffic.
--tls-max-v1.2
#
Added in: v12.0.0, v10.20.0
Set tls.DEFAULT_MAX_VERSION to 'TLSv1.2'. Use to disable support for TLSv1.3.
--tls-max-v1.3
#
Added in: v12.0.0
Set default tls.DEFAULT_MAX_VERSION to 'TLSv1.3'. Use to enable support for TLSv1.3.
--tls-min-v1.0
#
Added in: v12.0.0, v10.20.0
Set default tls.DEFAULT_MIN_VERSION to 'TLSv1'. Use for compatibility with old TLS clients or servers.
--tls-min-v1.1
#
Added in: v12.0.0, v10.20.0
Set default tls.DEFAULT_MIN_VERSION to 'TLSv1.1'. Use for compatibility with old TLS clients or servers.
--tls-min-v1.2
#
Added in: v12.2.0, v10.20.0
Set default tls.DEFAULT_MIN_VERSION to 'TLSv1.2'. This is the default for 12.x and later, but the option is supported for compatibility with older Node.js versions.
--tls-min-v1.3
#
Added in: v12.0.0
Set default tls.DEFAULT_MIN_VERSION to 'TLSv1.3'. Use to disable support for TLSv1.2, which is not as secure as TLSv1.3.
--trace-deprecation
#
Added in: v0.8.0
Print stack traces for deprecations.
--trace-env
#
Added in: v23.4.0, v22.13.0
Print information about any access to environment variables done in the current Node.js instance to stderr, including:
The environment variable reads that Node.js does internally.
Writes in the form of process.env.KEY = "SOME VALUE".
Reads in the form of process.env.KEY.
Definitions in the form of Object.defineProperty(process.env, 'KEY', {...}).
Queries in the form of Object.hasOwn(process.env, 'KEY'), process.env.hasOwnProperty('KEY') or 'KEY' in process.env.
Deletions in the form of delete process.env.KEY.
Enumerations inf the form of ...process.env or Object.keys(process.env).
Only the names of the environment variables being accessed are printed. The values are not printed.
To print the stack trace of the access, use --trace-env-js-stack and/or --trace-env-native-stack.
--trace-env-js-stack
#
Added in: v23.4.0, v22.13.0
In addition to what --trace-env does, this prints the JavaScript stack trace of the access.
--trace-env-native-stack
#
Added in: v23.4.0, v22.13.0
In addition to what --trace-env does, this prints the native stack trace of the access.
--trace-event-categories
#
Added in: v7.7.0
A comma separated list of categories that should be traced when trace event tracing is enabled using --trace-events-enabled.
--trace-event-file-pattern
#
Added in: v9.8.0
Template string specifying the filepath for the trace event data, it supports ${rotation} and ${pid}.
--trace-events-enabled
#
Added in: v7.7.0
Enables the collection of trace event tracing information.
--trace-exit
#
Added in: v13.5.0, v12.16.0
Prints a stack trace whenever an environment is exited proactively, i.e. invoking process.exit().
--trace-require-module=mode
#
Added in: v23.5.0, v22.13.0, v20.19.0
Prints information about usage of Loading ECMAScript modules using require().
When mode is all, all usage is printed. When mode is no-node-modules, usage from the node_modules folder is excluded.
--trace-sigint
#
Added in: v13.9.0, v12.17.0
Prints a stack trace on SIGINT.
--trace-sync-io
#
Added in: v2.1.0
Prints a stack trace whenever synchronous I/O is detected after the first turn of the event loop.
--trace-tls
#
Added in: v12.2.0
Prints TLS packet trace information to stderr. This can be used to debug TLS connection problems.
--trace-uncaught
#
Added in: v13.1.0
Print stack traces for uncaught exceptions; usually, the stack trace associated with the creation of an Error is printed, whereas this makes Node.js also print the stack trace associated with throwing the value (which does not need to be an Error instance).
Enabling this option may affect garbage collection behavior negatively.
--trace-warnings
#
Added in: v6.0.0
Print stack traces for process warnings (including deprecations).
--track-heap-objects
#
Added in: v2.4.0
Track heap object allocations for heap snapshots.
--unhandled-rejections=mode
#
History













Using this flag allows to change what should happen when an unhandled rejection occurs. One of the following modes can be chosen:
throw: Emit unhandledRejection. If this hook is not set, raise the unhandled rejection as an uncaught exception. This is the default.
strict: Raise the unhandled rejection as an uncaught exception. If the exception is handled, unhandledRejection is emitted.
warn: Always trigger a warning, no matter if the unhandledRejection hook is set or not but do not print the deprecation warning.
warn-with-error-code: Emit unhandledRejection. If this hook is not set, trigger a warning, and set the process exit code to 1.
none: Silence all warnings.
If a rejection happens during the command line entry point's ES module static loading phase, it will always raise it as an uncaught exception.
--use-bundled-ca, --use-openssl-ca
#
Added in: v6.11.0
Use bundled Mozilla CA store as supplied by current Node.js version or use OpenSSL's default CA store. The default store is selectable at build-time.
The bundled CA store, as supplied by Node.js, is a snapshot of Mozilla CA store that is fixed at release time. It is identical on all supported platforms.
Using OpenSSL store allows for external modifications of the store. For most Linux and BSD distributions, this store is maintained by the distribution maintainers and system administrators. OpenSSL CA store location is dependent on configuration of the OpenSSL library but this can be altered at runtime using environment variables.
See SSL_CERT_DIR and SSL_CERT_FILE.
--use-largepages=mode
#
Added in: v13.6.0, v12.17.0
Re-map the Node.js static code to large memory pages at startup. If supported on the target system, this will cause the Node.js static code to be moved onto 2 MiB pages instead of 4 KiB pages.
The following values are valid for mode:
off: No mapping will be attempted. This is the default.
on: If supported by the OS, mapping will be attempted. Failure to map will be ignored and a message will be printed to standard error.
silent: If supported by the OS, mapping will be attempted. Failure to map will be ignored and will not be reported.
--use-system-ca
#
History













Node.js uses the trusted CA certificates present in the system store along with the --use-bundled-ca option and the NODE_EXTRA_CA_CERTS environment variable. On platforms other than Windows and macOS, this loads certificates from the directory and file trusted by OpenSSL, similar to --use-openssl-ca, with the difference being that it caches the certificates after first load.
On Windows and macOS, the certificate trust policy is planned to follow Chromium's policy for locally trusted certificates:
On macOS, the following settings are respected:
Default and System Keychains
Trust:
Any certificate where the “When using this certificate” flag is set to “Always Trust” or
Any certificate where the “Secure Sockets Layer (SSL)” flag is set to “Always Trust.”
Distrust:
Any certificate where the “When using this certificate” flag is set to “Never Trust” or
Any certificate where the “Secure Sockets Layer (SSL)” flag is set to “Never Trust.”
On Windows, the following settings are respected (unlike Chromium's policy, distrust and intermediate CA are not currently supported):
Local Machine (accessed via certlm.msc)
Trust:
Trusted Root Certification Authorities
Trusted People
Enterprise Trust -> Enterprise -> Trusted Root Certification Authorities
Enterprise Trust -> Enterprise -> Trusted People
Enterprise Trust -> Group Policy -> Trusted Root Certification Authorities
Enterprise Trust -> Group Policy -> Trusted People
Current User (accessed via certmgr.msc)
Trust:
Trusted Root Certification Authorities
Enterprise Trust -> Group Policy -> Trusted Root Certification Authorities
On Windows and macOS, Node.js would check that the user settings for the certificates do not forbid them for TLS server authentication before using them.
On other systems, Node.js loads certificates from the default certificate file (typically /etc/ssl/cert.pem) and default certificate directory (typically /etc/ssl/certs) that the version of OpenSSL that Node.js links to respects. This typically works with the convention on major Linux distributions and other Unix-like systems. If the overriding OpenSSL environment variables (typically SSL_CERT_FILE and SSL_CERT_DIR, depending on the configuration of the OpenSSL that Node.js links to) are set, the specified paths will be used to load certificates instead. These environment variables can be used as workarounds if the conventional paths used by the version of OpenSSL Node.js links to are not consistent with the system configuration that the users have for some reason.
--v8-options
#
Added in: v0.1.3
Print V8 command-line options.
--v8-pool-size=num
#
Added in: v5.10.0
Set V8's thread pool size which will be used to allocate background jobs.
If set to 0 then Node.js will choose an appropriate size of the thread pool based on an estimate of the amount of parallelism.
The amount of parallelism refers to the number of computations that can be carried out simultaneously in a given machine. In general, it's the same as the amount of CPUs, but it may diverge in environments such as VMs or containers.
-v, --version
#
Added in: v0.1.3
Print node's version.
--watch
#
History

















Starts Node.js in watch mode. When in watch mode, changes in the watched files cause the Node.js process to restart. By default, watch mode will watch the entry point and any required or imported module. Use --watch-path to specify what paths to watch.
This flag cannot be combined with --check, --eval, --interactive, or the REPL.
Note: The --watch flag requires a file path as an argument and is incompatible with --run or inline script input, as --run takes precedence and ignores watch mode. If no file is provided, Node.js will exit with status code 9.
node --watch index.js
copy
--watch-kill-signal
#
Added in: v24.4.0
Customizes the signal sent to the process on watch mode restarts.
node --watch --watch-kill-signal SIGINT test.js
copy
--watch-path
#
History













Starts Node.js in watch mode and specifies what paths to watch. When in watch mode, changes in the watched paths cause the Node.js process to restart. This will turn off watching of required or imported modules, even when used in combination with --watch.
This flag cannot be combined with --check, --eval, --interactive, --test, or the REPL.
Note: Using --watch-path implicitly enables --watch, which requires a file path and is incompatible with --run, as --run takes precedence and ignores watch mode.
node --watch-path=./src --watch-path=./tests index.js
copy
This option is only supported on macOS and Windows. An ERR_FEATURE_UNAVAILABLE_ON_PLATFORM exception will be thrown when the option is used on a platform that does not support it.
--watch-preserve-output
#
Added in: v19.3.0, v18.13.0
Disable the clearing of the console when watch mode restarts the process.
node --watch --watch-preserve-output test.js
copy
--zero-fill-buffers
#
Added in: v6.0.0
Automatically zero-fills all newly allocated Buffer and SlowBuffer instances.
Environment variables
#
Stability: 2 - Stable
FORCE_COLOR=[1, 2, 3]
#
The FORCE_COLOR environment variable is used to enable ANSI colorized output. The value may be:
1, true, or the empty string '' indicate 16-color support,
2 to indicate 256-color support, or
3 to indicate 16 million-color support.
When FORCE_COLOR is used and set to a supported value, both the NO_COLOR, and NODE_DISABLE_COLORS environment variables are ignored.
Any other value will result in colorized output being disabled.
NODE_COMPILE_CACHE=dir
#
Added in: v22.1.0
Stability: 1.1 - Active Development
Enable the module compile cache for the Node.js instance. See the documentation of module compile cache for details.
NODE_DEBUG=module[,…]
#
Added in: v0.1.32
','-separated list of core modules that should print debug information.
NODE_DEBUG_NATIVE=module[,…]
#
','-separated list of core C++ modules that should print debug information.
NODE_DISABLE_COLORS=1
#
Added in: v0.3.0
When set, colors will not be used in the REPL.
NODE_DISABLE_COMPILE_CACHE=1
#
Added in: v22.8.0
Stability: 1.1 - Active Development
Disable the module compile cache for the Node.js instance. See the documentation of module compile cache for details.
NODE_EXTRA_CA_CERTS=file
#
Added in: v7.3.0
When set, the well known "root" CAs (like VeriSign) will be extended with the extra certificates in file. The file should consist of one or more trusted certificates in PEM format. A message will be emitted (once) with process.emitWarning() if the file is missing or malformed, but any errors are otherwise ignored.
Neither the well known nor extra certificates are used when the ca options property is explicitly specified for a TLS or HTTPS client or server.
This environment variable is ignored when node runs as setuid root or has Linux file capabilities set.
The NODE_EXTRA_CA_CERTS environment variable is only read when the Node.js process is first launched. Changing the value at runtime using process.env.NODE_EXTRA_CA_CERTS has no effect on the current process.
NODE_ICU_DATA=file
#
Added in: v0.11.15
Data path for ICU (Intl object) data. Will extend linked-in data when compiled with small-icu support.
NODE_NO_WARNINGS=1
#
Added in: v6.11.0
When set to 1, process warnings are silenced.
NODE_OPTIONS=options...
#
Added in: v8.0.0
A space-separated list of command-line options. options... are interpreted before command-line options, so command-line options will override or compound after anything in options.... Node.js will exit with an error if an option that is not allowed in the environment is used, such as -p or a script file.
If an option value contains a space, it can be escaped using double quotes:
NODE_OPTIONS='--require "./my path/file.js"'
copy
A singleton flag passed as a command-line option will override the same flag passed into NODE_OPTIONS:
# The inspector will be available on port 5555
NODE_OPTIONS='--inspect=localhost:4444' node --inspect=localhost:5555
copy
A flag that can be passed multiple times will be treated as if its NODE_OPTIONS instances were passed first, and then its command-line instances afterwards:
NODE_OPTIONS='--require "./a.js"' node --require "./b.js"
# is equivalent to:
node --require "./a.js" --require "./b.js"
copy
Node.js options that are allowed are in the following list. If an option supports both --XX and --no-XX variants, they are both supported but only one is included in the list below.
--allow-addons
--allow-child-process
--allow-fs-read
--allow-fs-write
--allow-wasi
--allow-worker
--conditions, -C
--cpu-prof-dir
--cpu-prof-interval
--cpu-prof-name
--cpu-prof
--diagnostic-dir
--disable-proto
--disable-sigusr1
--disable-warning
--disable-wasm-trap-handler
--dns-result-order
--enable-fips
--enable-network-family-autoselection
--enable-source-maps
--entry-url
--experimental-abortcontroller
--experimental-addon-modules
--experimental-detect-module
--experimental-eventsource
--experimental-import-meta-resolve
--experimental-json-modules
--experimental-loader
--experimental-modules
--experimental-print-required-tla
--experimental-require-module
--experimental-shadow-realm
--experimental-specifier-resolution
--experimental-test-isolation
--experimental-top-level-await
--experimental-transform-types
--experimental-vm-modules
--experimental-wasi-unstable-preview1
--experimental-wasm-modules
--experimental-webstorage
--force-context-aware
--force-fips
--force-node-api-uncaught-exceptions-policy
--frozen-intrinsics
--heap-prof-dir
--heap-prof-interval
--heap-prof-name
--heap-prof
--heapsnapshot-near-heap-limit
--heapsnapshot-signal
--http-parser
--icu-data-dir
--import
--input-type
--insecure-http-parser
--inspect-brk
--inspect-port, --debug-port
--inspect-publish-uid
--inspect-wait
--inspect
--localstorage-file
--max-http-header-size
--napi-modules
--network-family-autoselection-attempt-timeout
--no-addons
--no-async-context-frame
--no-deprecation
--no-experimental-global-navigator
--no-experimental-repl-await
--no-experimental-sqlite
--no-experimental-strip-types
--no-experimental-websocket
--no-extra-info-on-fatal-exception
--no-force-async-hooks-checks
--no-global-search-paths
--no-network-family-autoselection
--no-warnings
--node-memory-debug
--openssl-config
--openssl-legacy-provider
--openssl-shared-config
--pending-deprecation
--permission
--preserve-symlinks-main
--preserve-symlinks
--prof-process
--redirect-warnings
--report-compact
--report-dir, --report-directory
--report-exclude-env
--report-exclude-network
--report-filename
--report-on-fatalerror
--report-on-signal
--report-signal
--report-uncaught-exception
--require, -r
--secure-heap-min
--secure-heap
--snapshot-blob
--test-coverage-branches
--test-coverage-exclude
--test-coverage-functions
--test-coverage-include
--test-coverage-lines
--test-global-setup
--test-isolation
--test-name-pattern
--test-only
--test-reporter-destination
--test-reporter
--test-shard
--test-skip-pattern
--throw-deprecation
--title
--tls-cipher-list
--tls-keylog
--tls-max-v1.2
--tls-max-v1.3
--tls-min-v1.0
--tls-min-v1.1
--tls-min-v1.2
--tls-min-v1.3
--trace-deprecation
--trace-env-js-stack
--trace-env-native-stack
--trace-env
--trace-event-categories
--trace-event-file-pattern
--trace-events-enabled
--trace-exit
--trace-require-module
--trace-sigint
--trace-sync-io
--trace-tls
--trace-uncaught
--trace-warnings
--track-heap-objects
--unhandled-rejections
--use-bundled-ca
--use-largepages
--use-openssl-ca
--use-system-ca
--v8-pool-size
--watch-kill-signal
--watch-path
--watch-preserve-output
--watch
--zero-fill-buffers
V8 options that are allowed are:
--abort-on-uncaught-exception
--disallow-code-generation-from-strings
--enable-etw-stack-walking
--expose-gc
--interpreted-frames-native-stack
--jitless
--max-old-space-size
--max-semi-space-size
--perf-basic-prof-only-functions
--perf-basic-prof
--perf-prof-unwinding-info
--perf-prof
--stack-trace-limit
--perf-basic-prof-only-functions, --perf-basic-prof, --perf-prof-unwinding-info, and --perf-prof are only available on Linux.
--enable-etw-stack-walking is only available on Windows.
NODE_PATH=path[:…]
#
Added in: v0.1.32
':'-separated list of directories prefixed to the module search path.
On Windows, this is a ';'-separated list instead.
NODE_PENDING_DEPRECATION=1
#
Added in: v8.0.0
When set to 1, emit pending deprecation warnings.
Pending deprecations are generally identical to a runtime deprecation with the notable exception that they are turned off by default and will not be emitted unless either the --pending-deprecation command-line flag, or the NODE_PENDING_DEPRECATION=1 environment variable, is set. Pending deprecations are used to provide a kind of selective "early warning" mechanism that developers may leverage to detect deprecated API usage.
NODE_PENDING_PIPE_INSTANCES=instances
#
Set the number of pending pipe instance handles when the pipe server is waiting for connections. This setting applies to Windows only.
NODE_PRESERVE_SYMLINKS=1
#
Added in: v7.1.0
When set to 1, instructs the module loader to preserve symbolic links when resolving and caching modules.
NODE_REDIRECT_WARNINGS=file
#
Added in: v8.0.0
When set, process warnings will be emitted to the given file instead of printing to stderr. The file will be created if it does not exist, and will be appended to if it does. If an error occurs while attempting to write the warning to the file, the warning will be written to stderr instead. This is equivalent to using the --redirect-warnings=file command-line flag.
NODE_REPL_EXTERNAL_MODULE=file
#
History













Path to a Node.js module which will be loaded in place of the built-in REPL. Overriding this value to an empty string ('') will use the built-in REPL.
NODE_REPL_HISTORY=file
#
Added in: v3.0.0
Path to the file used to store the persistent REPL history. The default path is ~/.node_repl_history, which is overridden by this variable. Setting the value to an empty string ('' or ' ') disables persistent REPL history.
NODE_SKIP_PLATFORM_CHECK=value
#
Added in: v14.5.0
If value equals '1', the check for a supported platform is skipped during Node.js startup. Node.js might not execute correctly. Any issues encountered on unsupported platforms will not be fixed.
NODE_TEST_CONTEXT=value
#
If value equals 'child', test reporter options will be overridden and test output will be sent to stdout in the TAP format. If any other value is provided, Node.js makes no guarantees about the reporter format used or its stability.
NODE_TLS_REJECT_UNAUTHORIZED=value
#
If value equals '0', certificate validation is disabled for TLS connections. This makes TLS, and HTTPS by extension, insecure. The use of this environment variable is strongly discouraged.
NODE_USE_ENV_PROXY=1
#
Added in: v24.0.0
Stability: 1.1 - Active Development
When enabled, Node.js parses the HTTP_PROXY, HTTPS_PROXY and NO_PROXY environment variables during startup, and tunnels requests over the specified proxy.
This currently only affects requests sent over fetch(). Support for other built-in http and https methods is under way.
NODE_V8_COVERAGE=dir
#
When set, Node.js will begin outputting V8 JavaScript code coverage and Source Map data to the directory provided as an argument (coverage information is written as JSON to files with a coverage prefix).
NODE_V8_COVERAGE will automatically propagate to subprocesses, making it easier to instrument applications that call the child_process.spawn() family of functions. NODE_V8_COVERAGE can be set to an empty string, to prevent propagation.
Coverage output
#
Coverage is output as an array of ScriptCoverage objects on the top-level key result:
{
  "result": [
    {
      "scriptId": "67",
      "url": "internal/tty.js",
      "functions": []
    }
  ]
}
copy
Source map cache
#
Stability: 1 - Experimental
If found, source map data is appended to the top-level key source-map-cache on the JSON coverage object.
source-map-cache is an object with keys representing the files source maps were extracted from, and values which include the raw source-map URL (in the key url), the parsed Source Map v3 information (in the key data), and the line lengths of the source file (in the key lineLengths).
{
  "result": [
    {
      "scriptId": "68",
      "url": "file:///absolute/path/to/source.js",
      "functions": []
    }
  ],
  "source-map-cache": {
    "file:///absolute/path/to/source.js": {
      "url": "./path-to-map.json",
      "data": {
        "version": 3,
        "sources": [
          "file:///absolute/path/to/original.js"
        ],
        "names": [
          "Foo",
          "console",
          "info"
        ],
        "mappings": "MAAMA,IACJC,YAAaC",
        "sourceRoot": "./"
      },
      "lineLengths": [
        13,
        62,
        38,
        27
      ]
    }
  }
}
copy
NO_COLOR=<any>
#
NO_COLOR is an alias for NODE_DISABLE_COLORS. The value of the environment variable is arbitrary.
OPENSSL_CONF=file
#
Added in: v6.11.0
Load an OpenSSL configuration file on startup. Among other uses, this can be used to enable FIPS-compliant crypto if Node.js is built with ./configure --openssl-fips.
If the --openssl-config command-line option is used, the environment variable is ignored.
SSL_CERT_DIR=dir
#
Added in: v7.7.0
If --use-openssl-ca is enabled, or if --use-system-ca is enabled on platforms other than macOS and Windows, this overrides and sets OpenSSL's directory containing trusted certificates.
Be aware that unless the child environment is explicitly set, this environment variable will be inherited by any child processes, and if they use OpenSSL, it may cause them to trust the same CAs as node.
SSL_CERT_FILE=file
#
Added in: v7.7.0
If --use-openssl-ca is enabled, or if --use-system-ca is enabled on platforms other than macOS and Windows, this overrides and sets OpenSSL's file containing trusted certificates.
Be aware that unless the child environment is explicitly set, this environment variable will be inherited by any child processes, and if they use OpenSSL, it may cause them to trust the same CAs as node.
TZ
#
History

















The TZ environment variable is used to specify the timezone configuration.
While Node.js does not support all of the various ways that TZ is handled in other environments, it does support basic timezone IDs (such as 'Etc/UTC', 'Europe/Paris', or 'America/New_York'). It may support a few other abbreviations or aliases, but these are strongly discouraged and not guaranteed.
$ TZ=Europe/Dublin node -pe "new Date().toString()"
Wed May 12 2021 20:30:48 GMT+0100 (Irish Standard Time)
copy
UV_THREADPOOL_SIZE=size
#
Set the number of threads used in libuv's threadpool to size threads.
Asynchronous system APIs are used by Node.js whenever possible, but where they do not exist, libuv's threadpool is used to create asynchronous node APIs based on synchronous system APIs. Node.js APIs that use the threadpool are:
all fs APIs, other than the file watcher APIs and those that are explicitly synchronous
asynchronous crypto APIs such as crypto.pbkdf2(), crypto.scrypt(), crypto.randomBytes(), crypto.randomFill(), crypto.generateKeyPair()
dns.lookup()
all zlib APIs, other than those that are explicitly synchronous
Because libuv's threadpool has a fixed size, it means that if for whatever reason any of these APIs takes a long time, other (seemingly unrelated) APIs that run in libuv's threadpool will experience degraded performance. In order to mitigate this issue, one potential solution is to increase the size of libuv's threadpool by setting the 'UV_THREADPOOL_SIZE' environment variable to a value greater than 4 (its current default value). However, setting this from inside the process using process.env.UV_THREADPOOL_SIZE=size is not guranteed to work as the threadpool would have been created as part of the runtime initialisation much before user code is run. For more information, see the libuv threadpool documentation.
Useful V8 options
#
V8 has its own set of CLI options. Any V8 CLI option that is provided to node will be passed on to V8 to handle. V8's options have no stability guarantee. The V8 team themselves don't consider them to be part of their formal API, and reserve the right to change them at any time. Likewise, they are not covered by the Node.js stability guarantees. Many of the V8 options are of interest only to V8 developers. Despite this, there is a small set of V8 options that are widely applicable to Node.js, and they are documented here:
--abort-on-uncaught-exception
#
--disallow-code-generation-from-strings
#
--enable-etw-stack-walking
#
--expose-gc
#
--harmony-shadow-realm
#
--interpreted-frames-native-stack
#
--jitless
#
--max-old-space-size=SIZE (in MiB)
#
Sets the max memory size of V8's old memory section. As memory consumption approaches the limit, V8 will spend more time on garbage collection in an effort to free unused memory.
On a machine with 2 GiB of memory, consider setting this to 1536 (1.5 GiB) to leave some memory for other uses and avoid swapping.
node --max-old-space-size=1536 index.js
copy
--max-semi-space-size=SIZE (in MiB)
#
Sets the maximum semi-space size for V8's scavenge garbage collector in MiB (mebibytes). Increasing the max size of a semi-space may improve throughput for Node.js at the cost of more memory consumption.
Since the young generation size of the V8 heap is three times (see YoungGenerationSizeFromSemiSpaceSize in V8) the size of the semi-space, an increase of 1 MiB to semi-space applies to each of the three individual semi-spaces and causes the heap size to increase by 3 MiB. The throughput improvement depends on your workload (see #42511).
The default value depends on the memory limit. For example, on 64-bit systems with a memory limit of 512 MiB, the max size of a semi-space defaults to 1 MiB. For memory limits up to and including 2GiB, the default max size of a semi-space will be less than 16 MiB on 64-bit systems.
To get the best configuration for your application, you should try different max-semi-space-size values when running benchmarks for your application.
For example, benchmark on a 64-bit systems:
for MiB in 16 32 64 128; do
    node --max-semi-space-size=$MiB index.js
done
copy
--perf-basic-prof
#
--perf-basic-prof-only-functions
#
--perf-prof
#
--perf-prof-unwinding-info
#
--prof
#
--security-revert
#
--stack-trace-limit=limit
#
The maximum number of stack frames to collect in an error's stack trace. Setting it to 0 disables stack trace collection. The default value is 10.
node --stack-trace-limit=12 -p -e "Error.stackTraceLimit" # prints 12
copy
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Console
Class: Console
new Console(stdout[, stderr][, ignoreErrors])
new Console(options)
console.assert(value[, ...message])
console.clear()
console.count([label])
console.countReset([label])
console.debug(data[, ...args])
console.dir(obj[, options])
console.dirxml(...data)
console.error([data][, ...args])
console.group([...label])
console.groupCollapsed()
console.groupEnd()
console.info([data][, ...args])
console.log([data][, ...args])
console.table(tabularData[, properties])
console.time([label])
console.timeEnd([label])
console.timeLog([label][, ...data])
console.trace([message][, ...args])
console.warn([data][, ...args])
Inspector only methods
console.profile([label])
console.profileEnd([label])
console.timeStamp([label])
Console
#
Stability: 2 - Stable
Source Code: lib/console.js
The node:console module provides a simple debugging console that is similar to the JavaScript console mechanism provided by web browsers.
The module exports two specific components:
A Console class with methods such as console.log(), console.error(), and console.warn() that can be used to write to any Node.js stream.
A global console instance configured to write to process.stdout and process.stderr. The global console can be used without calling require('node:console').
Warning: The global console object's methods are neither consistently synchronous like the browser APIs they resemble, nor are they consistently asynchronous like all other Node.js streams. Programs that desire to depend on the synchronous / asynchronous behavior of the console functions should first figure out the nature of console's backing stream. This is because the stream is dependent on the underlying platform and standard stream configuration of the current process. See the note on process I/O for more information.
Example using the global console:
console.log('hello world');
// Prints: hello world, to stdout
console.log('hello %s', 'world');
// Prints: hello world, to stdout
console.error(new Error('Whoops, something bad happened'));
// Prints error message and stack trace to stderr:
//   Error: Whoops, something bad happened
//     at [eval]:5:15
//     at Script.runInThisContext (node:vm:132:18)
//     at Object.runInThisContext (node:vm:309:38)
//     at node:internal/process/execution:77:19
//     at [eval]-wrapper:6:22
//     at evalScript (node:internal/process/execution:76:60)
//     at node:internal/main/eval_string:23:3

const name = 'Will Robinson';
console.warn(`Danger ${name}! Danger!`);
// Prints: Danger Will Robinson! Danger!, to stderr
copy
Example using the Console class:
const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);

myConsole.log('hello world');
// Prints: hello world, to out
myConsole.log('hello %s', 'world');
// Prints: hello world, to out
myConsole.error(new Error('Whoops, something bad happened'));
// Prints: [Error: Whoops, something bad happened], to err

const name = 'Will Robinson';
myConsole.warn(`Danger ${name}! Danger!`);
// Prints: Danger Will Robinson! Danger!, to err
copy
Class: Console
#
History









The Console class can be used to create a simple logger with configurable output streams and can be accessed using either require('node:console').Console or console.Console (or their destructured counterparts):
const { Console } = require('node:console');
copy
const { Console } = console;
copy
new Console(stdout[, stderr][, ignoreErrors])
#
new Console(options)
#
History





















options <Object>
stdout <stream.Writable>
stderr <stream.Writable>
ignoreErrors <boolean> Ignore errors when writing to the underlying streams. Default: true.
colorMode <boolean> | <string> Set color support for this Console instance. Setting to true enables coloring while inspecting values. Setting to false disables coloring while inspecting values. Setting to 'auto' makes color support depend on the value of the isTTY property and the value returned by getColorDepth() on the respective stream. This option can not be used, if inspectOptions.colors is set as well. Default: 'auto'.
inspectOptions <Object> Specifies options that are passed along to util.inspect().
groupIndentation <number> Set group indentation. Default: 2.
Creates a new Console with one or two writable stream instances. stdout is a writable stream to print log or info output. stderr is used for warning or error output. If stderr is not provided, stdout is used for stderr.
const fs = require('node:fs');
const { Console } = require('node:console');
// Alternatively
// const { Console } = console;

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
copy
The global console is a special Console whose output is sent to process.stdout and process.stderr. It is equivalent to calling:
new Console({ stdout: process.stdout, stderr: process.stderr });
copy
console.assert(value[, ...message])
#
History













value <any> The value tested for being truthy.
...message <any> All arguments besides value are used as error message.
console.assert() writes a message if value is falsy or omitted. It only writes a message and does not otherwise affect execution. The output always starts with "Assertion failed". If provided, message is formatted using util.format().
If value is truthy, nothing happens.
console.assert(true, 'does nothing');

console.assert(false, 'Whoops %s work', 'didn\'t');
// Assertion failed: Whoops didn't work

console.assert();
// Assertion failed
copy
console.clear()
#
Added in: v8.3.0
When stdout is a TTY, calling console.clear() will attempt to clear the TTY. When stdout is not a TTY, this method does nothing.
The specific operation of console.clear() can vary across operating systems and terminal types. For most Linux operating systems, console.clear() operates similarly to the clear shell command. On Windows, console.clear() will clear only the output in the current terminal viewport for the Node.js binary.
console.count([label])
#
Added in: v8.3.0
label <string> The display label for the counter. Default: 'default'.
Maintains an internal counter specific to label and outputs to stdout the number of times console.count() has been called with the given label.
> console.count()
default: 1
undefined
> console.count('default')
default: 2
undefined
> console.count('abc')
abc: 1
undefined
> console.count('xyz')
xyz: 1
undefined
> console.count('abc')
abc: 2
undefined
> console.count()
default: 3
undefined
>
copy
console.countReset([label])
#
Added in: v8.3.0
label <string> The display label for the counter. Default: 'default'.
Resets the internal counter specific to label.
> console.count('abc');
abc: 1
undefined
> console.countReset('abc');
undefined
> console.count('abc');
abc: 1
undefined
>
copy
console.debug(data[, ...args])
#
History













data <any>
...args <any>
The console.debug() function is an alias for console.log().
console.dir(obj[, options])
#
Added in: v0.1.101
obj <any>
options <Object>
showHidden <boolean> If true then the object's non-enumerable and symbol properties will be shown too. Default: false.
depth <number> Tells util.inspect() how many times to recurse while formatting the object. This is useful for inspecting large complicated objects. To make it recurse indefinitely, pass null. Default: 2.
colors <boolean> If true, then the output will be styled with ANSI color codes. Colors are customizable; see customizing util.inspect() colors. Default: false.
Uses util.inspect() on obj and prints the resulting string to stdout. This function bypasses any custom inspect() function defined on obj.
console.dirxml(...data)
#
History













...data <any>
This method calls console.log() passing it the arguments received. This method does not produce any XML formatting.
console.error([data][, ...args])
#
Added in: v0.1.100
data <any>
...args <any>
Prints to stderr with newline. Multiple arguments can be passed, with the first used as the primary message and all additional used as substitution values similar to printf(3) (the arguments are all passed to util.format()).
const code = 5;
console.error('error #%d', code);
// Prints: error #5, to stderr
console.error('error', code);
// Prints: error 5, to stderr
copy
If formatting elements (e.g. %d) are not found in the first string then util.inspect() is called on each argument and the resulting string values are concatenated. See util.format() for more information.
console.group([...label])
#
Added in: v8.5.0
...label <any>
Increases indentation of subsequent lines by spaces for groupIndentation length.
If one or more labels are provided, those are printed first without the additional indentation.
console.groupCollapsed()
#
Added in: v8.5.0
An alias for console.group().
console.groupEnd()
#
Added in: v8.5.0
Decreases indentation of subsequent lines by spaces for groupIndentation length.
console.info([data][, ...args])
#
Added in: v0.1.100
data <any>
...args <any>
The console.info() function is an alias for console.log().
console.log([data][, ...args])
#
Added in: v0.1.100
data <any>
...args <any>
Prints to stdout with newline. Multiple arguments can be passed, with the first used as the primary message and all additional used as substitution values similar to printf(3) (the arguments are all passed to util.format()).
const count = 5;
console.log('count: %d', count);
// Prints: count: 5, to stdout
console.log('count:', count);
// Prints: count: 5, to stdout
copy
See util.format() for more information.
console.table(tabularData[, properties])
#
Added in: v10.0.0
tabularData <any>
properties <string[]> Alternate properties for constructing the table.
Try to construct a table with the columns of the properties of tabularData (or use properties) and rows of tabularData and log it. Falls back to just logging the argument if it can't be parsed as tabular.
// These can't be parsed as tabular data
console.table(Symbol());
// Symbol()

console.table(undefined);
// undefined

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// ┌─────────┬─────┬─────┐
// │ (index) │ a   │ b   │
// ├─────────┼─────┼─────┤
// │ 0       │ 1   │ 'Y' │
// │ 1       │ 'Z' │ 2   │
// └─────────┴─────┴─────┘

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
// ┌─────────┬─────┐
// │ (index) │ a   │
// ├─────────┼─────┤
// │ 0       │ 1   │
// │ 1       │ 'Z' │
// └─────────┴─────┘
copy
console.time([label])
#
Added in: v0.1.104
label <string> Default: 'default'
Starts a timer that can be used to compute the duration of an operation. Timers are identified by a unique label. Use the same label when calling console.timeEnd() to stop the timer and output the elapsed time in suitable time units to stdout. For example, if the elapsed time is 3869ms, console.timeEnd() displays "3.869s".
console.timeEnd([label])
#
History

















label <string> Default: 'default'
Stops a timer that was previously started by calling console.time() and prints the result to stdout:
console.time('bunch-of-stuff');
// Do a bunch of stuff.
console.timeEnd('bunch-of-stuff');
// Prints: bunch-of-stuff: 225.438ms
copy
console.timeLog([label][, ...data])
#
Added in: v10.7.0
label <string> Default: 'default'
...data <any>
For a timer that was previously started by calling console.time(), prints the elapsed time and other data arguments to stdout:
console.time('process');
const value = expensiveProcess1(); // Returns 42
console.timeLog('process', value);
// Prints "process: 365.227ms 42".
doExpensiveProcess2(value);
console.timeEnd('process');
copy
console.trace([message][, ...args])
#
Added in: v0.1.104
message <any>
...args <any>
Prints to stderr the string 'Trace: ', followed by the util.format() formatted message and stack trace to the current position in the code.
console.trace('Show me');
// Prints: (stack trace will vary based on where trace is called)
//  Trace: Show me
//    at repl:2:9
//    at REPLServer.defaultEval (repl.js:248:27)
//    at bound (domain.js:287:14)
//    at REPLServer.runBound [as eval] (domain.js:300:12)
//    at REPLServer.<anonymous> (repl.js:412:12)
//    at emitOne (events.js:82:20)
//    at REPLServer.emit (events.js:169:7)
//    at REPLServer.Interface._onLine (readline.js:210:10)
//    at REPLServer.Interface._line (readline.js:549:8)
//    at REPLServer.Interface._ttyWrite (readline.js:826:14)
copy
console.warn([data][, ...args])
#
Added in: v0.1.100
data <any>
...args <any>
The console.warn() function is an alias for console.error().
Inspector only methods
#
The following methods are exposed by the V8 engine in the general API but do not display anything unless used in conjunction with the inspector (--inspect flag).
console.profile([label])
#
Added in: v8.0.0
label <string>
This method does not display anything unless used in the inspector. The console.profile() method starts a JavaScript CPU profile with an optional label until console.profileEnd() is called. The profile is then added to the Profile panel of the inspector.
console.profile('MyLabel');
// Some code
console.profileEnd('MyLabel');
// Adds the profile 'MyLabel' to the Profiles panel of the inspector.
copy
console.profileEnd([label])
#
Added in: v8.0.0
label <string>
This method does not display anything unless used in the inspector. Stops the current JavaScript CPU profiling session if one has been started and prints the report to the Profiles panel of the inspector. See console.profile() for an example.
If this method is called without a label, the most recently started profile is stopped.
console.timeStamp([label])
#
Added in: v8.0.0
label <string>
This method does not display anything unless used in the inspector. The console.timeStamp() method adds an event with the label 'label' to the Timeline panel of the inspector.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Crypto
Determining if crypto support is unavailable
Class: Certificate
Static method: Certificate.exportChallenge(spkac[, encoding])
Static method: Certificate.exportPublicKey(spkac[, encoding])
Static method: Certificate.verifySpkac(spkac[, encoding])
Legacy API
new crypto.Certificate()
certificate.exportChallenge(spkac[, encoding])
certificate.exportPublicKey(spkac[, encoding])
certificate.verifySpkac(spkac[, encoding])
Class: Cipheriv
cipher.final([outputEncoding])
cipher.getAuthTag()
cipher.setAAD(buffer[, options])
cipher.setAutoPadding([autoPadding])
cipher.update(data[, inputEncoding][, outputEncoding])
Class: Decipheriv
decipher.final([outputEncoding])
decipher.setAAD(buffer[, options])
decipher.setAuthTag(buffer[, encoding])
decipher.setAutoPadding([autoPadding])
decipher.update(data[, inputEncoding][, outputEncoding])
Class: DiffieHellman
diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])
diffieHellman.generateKeys([encoding])
diffieHellman.getGenerator([encoding])
diffieHellman.getPrime([encoding])
diffieHellman.getPrivateKey([encoding])
diffieHellman.getPublicKey([encoding])
diffieHellman.setPrivateKey(privateKey[, encoding])
diffieHellman.setPublicKey(publicKey[, encoding])
diffieHellman.verifyError
Class: DiffieHellmanGroup
Class: ECDH
Static method: ECDH.convertKey(key, curve[, inputEncoding[, outputEncoding[, format]]])
ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])
ecdh.generateKeys([encoding[, format]])
ecdh.getPrivateKey([encoding])
ecdh.getPublicKey([encoding][, format])
ecdh.setPrivateKey(privateKey[, encoding])
ecdh.setPublicKey(publicKey[, encoding])
Class: Hash
hash.copy([options])
hash.digest([encoding])
hash.update(data[, inputEncoding])
Class: Hmac
hmac.digest([encoding])
hmac.update(data[, inputEncoding])
Class: KeyObject
Static method: KeyObject.from(key)
keyObject.asymmetricKeyDetails
keyObject.asymmetricKeyType
keyObject.equals(otherKeyObject)
keyObject.export([options])
keyObject.symmetricKeySize
keyObject.toCryptoKey(algorithm, extractable, keyUsages)
keyObject.type
Class: Sign
sign.sign(privateKey[, outputEncoding])
sign.update(data[, inputEncoding])
Class: Verify
verify.update(data[, inputEncoding])
verify.verify(object, signature[, signatureEncoding])
Class: X509Certificate
new X509Certificate(buffer)
x509.ca
x509.checkEmail(email[, options])
x509.checkHost(name[, options])
x509.checkIP(ip)
x509.checkIssued(otherCert)
x509.checkPrivateKey(privateKey)
x509.extKeyUsage
x509.fingerprint
x509.fingerprint256
x509.fingerprint512
x509.infoAccess
x509.issuer
x509.issuerCertificate
x509.publicKey
x509.raw
x509.serialNumber
x509.subject
x509.subjectAltName
x509.toJSON()
x509.toLegacyObject()
x509.toString()
x509.validFrom
x509.validFromDate
x509.validTo
x509.validToDate
x509.verify(publicKey)
node:crypto module methods and properties
crypto.checkPrime(candidate[, options], callback)
crypto.checkPrimeSync(candidate[, options])
crypto.constants
crypto.createCipheriv(algorithm, key, iv[, options])
crypto.createDecipheriv(algorithm, key, iv[, options])
crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])
crypto.createDiffieHellman(primeLength[, generator])
crypto.createDiffieHellmanGroup(name)
crypto.createECDH(curveName)
crypto.createHash(algorithm[, options])
crypto.createHmac(algorithm, key[, options])
crypto.createPrivateKey(key)
crypto.createPublicKey(key)
crypto.createSecretKey(key[, encoding])
crypto.createSign(algorithm[, options])
crypto.createVerify(algorithm[, options])
crypto.diffieHellman(options[, callback])
crypto.fips
crypto.generateKey(type, options, callback)
crypto.generateKeyPair(type, options, callback)
crypto.generateKeyPairSync(type, options)
crypto.generateKeySync(type, options)
crypto.generatePrime(size[, options], callback)
crypto.generatePrimeSync(size[, options])
crypto.getCipherInfo(nameOrNid[, options])
crypto.getCiphers()
crypto.getCurves()
crypto.getDiffieHellman(groupName)
crypto.getFips()
crypto.getHashes()
crypto.getRandomValues(typedArray)
crypto.hash(algorithm, data[, options])
crypto.hkdf(digest, ikm, salt, info, keylen, callback)
crypto.hkdfSync(digest, ikm, salt, info, keylen)
crypto.pbkdf2(password, salt, iterations, keylen, digest, callback)
crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)
crypto.privateDecrypt(privateKey, buffer)
crypto.privateEncrypt(privateKey, buffer)
crypto.publicDecrypt(key, buffer)
crypto.publicEncrypt(key, buffer)
crypto.randomBytes(size[, callback])
crypto.randomFill(buffer[, offset][, size], callback)
crypto.randomFillSync(buffer[, offset][, size])
crypto.randomInt([min, ]max[, callback])
crypto.randomUUID([options])
crypto.scrypt(password, salt, keylen[, options], callback)
crypto.scryptSync(password, salt, keylen[, options])
crypto.secureHeapUsed()
crypto.setEngine(engine[, flags])
crypto.setFips(bool)
crypto.sign(algorithm, data, key[, callback])
crypto.subtle
crypto.timingSafeEqual(a, b)
crypto.verify(algorithm, data, key, signature[, callback])
crypto.webcrypto
Notes
Using strings as inputs to cryptographic APIs
Legacy streams API (prior to Node.js 0.10)
Support for weak or compromised algorithms
CCM mode
FIPS mode
Crypto constants
OpenSSL options
OpenSSL engine constants
Other OpenSSL constants
Node.js crypto constants
Crypto
#
Stability: 2 - Stable
Source Code: lib/crypto.js
The node:crypto module provides cryptographic functionality that includes a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions.
const { createHmac } = require('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
copy
Determining if crypto support is unavailable
#
It is possible for Node.js to be built without including support for the node:crypto module. In such cases, attempting to import from crypto or calling require('node:crypto') will result in an error being thrown.
When using CommonJS, the error thrown can be caught using try/catch:
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
copy
When using the lexical ESM import keyword, the error can only be caught if a handler for process.on('uncaughtException') is registered before any attempt to load the module is made (using, for instance, a preload module).
When using ESM, if there is a chance that the code may be run on a build of Node.js where crypto support is not enabled, consider using the import() function instead of the lexical import keyword:
let crypto;
try {
  crypto = await import('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
copy
Class: Certificate
#
Added in: v0.11.8
SPKAC is a Certificate Signing Request mechanism originally implemented by Netscape and was specified formally as part of HTML5's keygen element.
<keygen> is deprecated since HTML 5.2 and new projects should not use this element anymore.
The node:crypto module provides the Certificate class for working with SPKAC data. The most common usage is handling output generated by the HTML5 <keygen> element. Node.js uses OpenSSL's SPKAC implementation internally.
Static method: Certificate.exportChallenge(spkac[, encoding])
#
History













spkac <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
encoding <string> The encoding of the spkac string.
Returns: <Buffer> The challenge component of the spkac data structure, which includes a public key and a challenge.
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
copy
Static method: Certificate.exportPublicKey(spkac[, encoding])
#
History













spkac <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
encoding <string> The encoding of the spkac string.
Returns: <Buffer> The public key component of the spkac data structure, which includes a public key and a challenge.
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
copy
Static method: Certificate.verifySpkac(spkac[, encoding])
#
History













spkac <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
encoding <string> The encoding of the spkac string.
Returns: <boolean> true if the given spkac data structure is valid, false otherwise.
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
copy
Legacy API
#
Stability: 0 - Deprecated
As a legacy interface, it is possible to create new instances of the crypto.Certificate class as illustrated in the examples below.
new crypto.Certificate()
#
Instances of the Certificate class can be created using the new keyword or by calling crypto.Certificate() as a function:
const { Certificate } = require('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
copy
certificate.exportChallenge(spkac[, encoding])
#
Added in: v0.11.8
spkac <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
encoding <string> The encoding of the spkac string.
Returns: <Buffer> The challenge component of the spkac data structure, which includes a public key and a challenge.
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
copy
certificate.exportPublicKey(spkac[, encoding])
#
Added in: v0.11.8
spkac <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
encoding <string> The encoding of the spkac string.
Returns: <Buffer> The public key component of the spkac data structure, which includes a public key and a challenge.
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
copy
certificate.verifySpkac(spkac[, encoding])
#
Added in: v0.11.8
spkac <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
encoding <string> The encoding of the spkac string.
Returns: <boolean> true if the given spkac data structure is valid, false otherwise.
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
copy
Class: Cipheriv
#
Added in: v0.1.94
Extends: <stream.Transform>
Instances of the Cipheriv class are used to encrypt data. The class can be used in one of two ways:
As a stream that is both readable and writable, where plain unencrypted data is written to produce encrypted data on the readable side, or
Using the cipher.update() and cipher.final() methods to produce the encrypted data.
The crypto.createCipheriv() method is used to create Cipheriv instances. Cipheriv objects are not to be created directly using the new keyword.
Example: Using Cipheriv objects as streams:
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Once we have the key and iv, we can create and use the cipher...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('some clear text data');
    cipher.end();
  });
});
copy
Example: Using Cipheriv and piped streams:
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');

const {
  pipeline,
} = require('node:stream');

const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
copy
Example: Using the cipher.update() and cipher.final() methods:
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
copy
cipher.final([outputEncoding])
#
Added in: v0.1.94
outputEncoding <string> The encoding of the return value.
Returns: <Buffer> | <string> Any remaining enciphered contents. If outputEncoding is specified, a string is returned. If an outputEncoding is not provided, a Buffer is returned.
Once the cipher.final() method has been called, the Cipheriv object can no longer be used to encrypt data. Attempts to call cipher.final() more than once will result in an error being thrown.
cipher.getAuthTag()
#
Added in: v1.0.0
Returns: <Buffer> When using an authenticated encryption mode (GCM, CCM, OCB, and chacha20-poly1305 are currently supported), the cipher.getAuthTag() method returns a Buffer containing the authentication tag that has been computed from the given data.
The cipher.getAuthTag() method should only be called after encryption has been completed using the cipher.final() method.
If the authTagLength option was set during the cipher instance's creation, this function will return exactly authTagLength bytes.
cipher.setAAD(buffer[, options])
#
Added in: v1.0.0
buffer <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
options <Object> stream.transform options
plaintextLength <number>
encoding <string> The string encoding to use when buffer is a string.
Returns: <Cipheriv> The same Cipheriv instance for method chaining.
When using an authenticated encryption mode (GCM, CCM, OCB, and chacha20-poly1305 are currently supported), the cipher.setAAD() method sets the value used for the additional authenticated data (AAD) input parameter.
The plaintextLength option is optional for GCM and OCB. When using CCM, the plaintextLength option must be specified and its value must match the length of the plaintext in bytes. See CCM mode.
The cipher.setAAD() method must be called before cipher.update().
cipher.setAutoPadding([autoPadding])
#
Added in: v0.7.1
autoPadding <boolean> Default: true
Returns: <Cipheriv> The same Cipheriv instance for method chaining.
When using block encryption algorithms, the Cipheriv class will automatically add padding to the input data to the appropriate block size. To disable the default padding call cipher.setAutoPadding(false).
When autoPadding is false, the length of the entire input data must be a multiple of the cipher's block size or cipher.final() will throw an error. Disabling automatic padding is useful for non-standard padding, for instance using 0x0 instead of PKCS padding.
The cipher.setAutoPadding() method must be called before cipher.final().
cipher.update(data[, inputEncoding][, outputEncoding])
#
History













data <string> | <Buffer> | <TypedArray> | <DataView>
inputEncoding <string> The encoding of the data.
outputEncoding <string> The encoding of the return value.
Returns: <Buffer> | <string>
Updates the cipher with data. If the inputEncoding argument is given, the data argument is a string using the specified encoding. If the inputEncoding argument is not given, data must be a Buffer, TypedArray, or DataView. If data is a Buffer, TypedArray, or DataView, then inputEncoding is ignored.
The outputEncoding specifies the output format of the enciphered data. If the outputEncoding is specified, a string using the specified encoding is returned. If no outputEncoding is provided, a Buffer is returned.
The cipher.update() method can be called multiple times with new data until cipher.final() is called. Calling cipher.update() after cipher.final() will result in an error being thrown.
Class: Decipheriv
#
Added in: v0.1.94
Extends: <stream.Transform>
Instances of the Decipheriv class are used to decrypt data. The class can be used in one of two ways:
As a stream that is both readable and writable, where plain encrypted data is written to produce unencrypted data on the readable side, or
Using the decipher.update() and decipher.final() methods to produce the unencrypted data.
The crypto.createDecipheriv() method is used to create Decipheriv instances. Decipheriv objects are not to be created directly using the new keyword.
Example: Using Decipheriv objects as streams:
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
copy
Example: Using Decipheriv and piped streams:
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
copy
Example: Using the decipher.update() and decipher.final() methods:
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

// Encrypted using same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
copy
decipher.final([outputEncoding])
#
Added in: v0.1.94
outputEncoding <string> The encoding of the return value.
Returns: <Buffer> | <string> Any remaining deciphered contents. If outputEncoding is specified, a string is returned. If an outputEncoding is not provided, a Buffer is returned.
Once the decipher.final() method has been called, the Decipheriv object can no longer be used to decrypt data. Attempts to call decipher.final() more than once will result in an error being thrown.
decipher.setAAD(buffer[, options])
#
History

















buffer <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
options <Object> stream.transform options
plaintextLength <number>
encoding <string> String encoding to use when buffer is a string.
Returns: <Decipheriv> The same Decipher for method chaining.
When using an authenticated encryption mode (GCM, CCM, OCB, and chacha20-poly1305 are currently supported), the decipher.setAAD() method sets the value used for the additional authenticated data (AAD) input parameter.
The options argument is optional for GCM. When using CCM, the plaintextLength option must be specified and its value must match the length of the ciphertext in bytes. See CCM mode.
The decipher.setAAD() method must be called before decipher.update().
When passing a string as the buffer, please consider caveats when using strings as inputs to cryptographic APIs.
decipher.setAuthTag(buffer[, encoding])
#
History

























buffer <string> | <Buffer> | <ArrayBuffer> | <TypedArray> | <DataView>
encoding <string> String encoding to use when buffer is a string.
Returns: <Decipheriv> The same Decipher for method chaining.
When using an authenticated encryption mode (GCM, CCM, OCB, and chacha20-poly1305 are currently supported), the decipher.setAuthTag() method is used to pass in the received authentication tag. If no tag is provided, or if the cipher text has been tampered with, decipher.final() will throw, indicating that the cipher text should be discarded due to failed authentication. If the tag length is invalid according to NIST SP 800-38D or does not match the value of the authTagLength option, decipher.setAuthTag() will throw an error.
The decipher.setAuthTag() method must be called before decipher.update() for CCM mode or before decipher.final() for GCM and OCB modes and chacha20-poly1305. decipher.setAuthTag() can only be called once.
When passing a string as the authentication tag, please consider caveats when using strings as inputs to cryptographic APIs.
decipher.setAutoPadding([autoPadding])
#
Added in: v0.7.1
autoPadding <boolean> Default: true
Returns: <Decipheriv> The same Decipher for method chaining.
When data has been encrypted without standard block padding, calling decipher.setAutoPadding(false) will disable automatic padding to prevent decipher.final() from checking for and removing padding.
Turning auto padding off will only work if the input data's length is a multiple of the ciphers block size.
The decipher.setAutoPadding() method must be called before decipher.final().
decipher.update(data[, inputEncoding][, outputEncoding])
#
History













data <string> | <Buffer> | <TypedArray> | <DataView>
inputEncoding <string> The encoding of the data string.
outputEncoding <string> The encoding of the return value.
Returns: <Buffer> | <string>
Updates the decipher with data. If the inputEncoding argument is given, the data argument is a string using the specified encoding. If the inputEncoding argument is not given, data must be a Buffer. If data is a Buffer then inputEncoding is ignored.
The outputEncoding specifies the output format of the enciphered data. If the outputEncoding is specified, a string using the specified encoding is returned. If no outputEncoding is provided, a Buffer is returned.
The decipher.update() method can be called multiple times with new data until decipher.final() is called. Calling decipher.update() after decipher.final() will result in an error being thrown.
Even if the underlying cipher implements authentication, the authenticity and integrity of the plaintext returned from this function may be uncertain at this time. For authenticated encryption algorithms, authenticity is generally only established when the application calls decipher.final().
Class: DiffieHellman
#
Added in: v0.5.0
The DiffieHellman class is a utility for creating Diffie-Hellman key exchanges.
Instances of the DiffieHellman class can be created using the crypto.createDiffieHellman() function.
const assert = require('node:assert');

const {
  createDiffieHellman,
} = require('node:crypto');

// Generate Alice's keys...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
copy
diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])
#
Added in: v0.5.0
otherPublicKey <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
inputEncoding <string> The encoding of an otherPublicKey string.
outputEncoding <string> The encoding of the return value.
Returns: <Buffer> | <string>
Computes the shared secret using otherPublicKey as the other party's public key and returns the computed shared secret. The supplied key is interpreted using the specified inputEncoding, and secret is encoded using specified outputEncoding. If the inputEncoding is not provided, otherPublicKey is expected to be a Buffer, TypedArray, or DataView.
If outputEncoding is given a string is returned; otherwise, a Buffer is returned.
diffieHellman.generateKeys([encoding])
#
Added in: v0.5.0
encoding <string> The encoding of the return value.
Returns: <Buffer> | <string>
Generates private and public Diffie-Hellman key values unless they have been generated or computed already, and returns the public key in the specified encoding. This key should be transferred to the other party. If encoding is provided a string is returned; otherwise a Buffer is returned.
This function is a thin wrapper around DH_generate_key(). In particular, once a private key has been generated or set, calling this function only updates the public key but does not generate a new private key.
diffieHellman.getGenerator([encoding])
#
Added in: v0.5.0
encoding <string> The encoding of the return value.
Returns: <Buffer> | <string>
Returns the Diffie-Hellman generator in the specified encoding. If encoding is provided a string is returned; otherwise a Buffer is returned.
diffieHellman.getPrime([encoding])
#
Added in: v0.5.0
encoding <string> The encoding of the return value.
Returns: <Buffer> | <string>
Returns the Diffie-Hellman prime in the specified encoding. If encoding is provided a string is returned; otherwise a Buffer is returned.
diffieHellman.getPrivateKey([encoding])
#
Added in: v0.5.0
encoding <string> The encoding of the return value.
Returns: <Buffer> | <string>
Returns the Diffie-Hellman private key in the specified encoding. If encoding is provided a string is returned; otherwise a Buffer is returned.
diffieHellman.getPublicKey([encoding])
#
Added in: v0.5.0
encoding <string> The encoding of the return value.
Returns: <Buffer> | <string>
Returns the Diffie-Hellman public key in the specified encoding. If encoding is provided a string is returned; otherwise a Buffer is returned.
diffieHellman.setPrivateKey(privateKey[, encoding])
#
Added in: v0.5.0
privateKey <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
encoding <string> The encoding of the privateKey string.
Sets the Diffie-Hellman private key. If the encoding argument is provided, privateKey is expected to be a string. If no encoding is provided, privateKey is expected to be a Buffer, TypedArray, or DataView.
This function does not automatically compute the associated public key. Either diffieHellman.setPublicKey() or diffieHellman.generateKeys() can be used to manually provide the public key or to automatically derive it.
diffieHellman.setPublicKey(publicKey[, encoding])
#
Added in: v0.5.0
publicKey <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
encoding <string> The encoding of the publicKey string.
Sets the Diffie-Hellman public key. If the encoding argument is provided, publicKey is expected to be a string. If no encoding is provided, publicKey is expected to be a Buffer, TypedArray, or DataView.
diffieHellman.verifyError
#
Added in: v0.11.12
A bit field containing any warnings and/or errors resulting from a check performed during initialization of the DiffieHellman object.
The following values are valid for this property (as defined in node:constants module):
DH_CHECK_P_NOT_SAFE_PRIME
DH_CHECK_P_NOT_PRIME
DH_UNABLE_TO_CHECK_GENERATOR
DH_NOT_SUITABLE_GENERATOR
Class: DiffieHellmanGroup
#
Added in: v0.7.5
The DiffieHellmanGroup class takes a well-known modp group as its argument. It works the same as DiffieHellman, except that it does not allow changing its keys after creation. In other words, it does not implement setPublicKey() or setPrivateKey() methods.
const { createDiffieHellmanGroup } = require('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
copy
The following groups are supported:
'modp14' (2048 bits, RFC 3526 Section 3)
'modp15' (3072 bits, RFC 3526 Section 4)
'modp16' (4096 bits, RFC 3526 Section 5)
'modp17' (6144 bits, RFC 3526 Section 6)
'modp18' (8192 bits, RFC 3526 Section 7)
The following groups are still supported but deprecated (see Caveats):
'modp1' (768 bits, RFC 2409 Section 6.1) 
'modp2' (1024 bits, RFC 2409 Section 6.2) 
'modp5' (1536 bits, RFC 3526 Section 2) 
These deprecated groups might be removed in future versions of Node.js.
Class: ECDH
#
Added in: v0.11.14
The ECDH class is a utility for creating Elliptic Curve Diffie-Hellman (ECDH) key exchanges.
Instances of the ECDH class can be created using the crypto.createECDH() function.
const assert = require('node:assert');

const {
  createECDH,
} = require('node:crypto');

// Generate Alice's keys...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
copy
Static method: ECDH.convertKey(key, curve[, inputEncoding[, outputEncoding[, format]]])
#
Added in: v10.0.0
key <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
curve <string>
inputEncoding <string> The encoding of the key string.
outputEncoding <string> The encoding of the return value.
format <string> Default: 'uncompressed'
Returns: <Buffer> | <string>
Converts the EC Diffie-Hellman public key specified by key and curve to the format specified by format. The format argument specifies point encoding and can be 'compressed', 'uncompressed' or 'hybrid'. The supplied key is interpreted using the specified inputEncoding, and the returned key is encoded using the specified outputEncoding.
Use crypto.getCurves() to obtain a list of available curve names. On recent OpenSSL releases, openssl ecparam -list_curves will also display the name and description of each available elliptic curve.
If format is not specified the point will be returned in 'uncompressed' format.
If the inputEncoding is not provided, key is expected to be a Buffer, TypedArray, or DataView.
Example (uncompressing a key):
const {
  createECDH,
  ECDH,
} = require('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// The converted key and the uncompressed public key should be the same
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
copy
ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])
#
History

















otherPublicKey <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
inputEncoding <string> The encoding of the otherPublicKey string.
outputEncoding <string> The encoding of the return value.
Returns: <Buffer> | <string>
Computes the shared secret using otherPublicKey as the other party's public key and returns the computed shared secret. The supplied key is interpreted using specified inputEncoding, and the returned secret is encoded using the specified outputEncoding. If the inputEncoding is not provided, otherPublicKey is expected to be a Buffer, TypedArray, or DataView.
If outputEncoding is given a string will be returned; otherwise a Buffer is returned.
ecdh.computeSecret will throw an ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY error when otherPublicKey lies outside of the elliptic curve. Since otherPublicKey is usually supplied from a remote user over an insecure network, be sure to handle this exception accordingly.
ecdh.generateKeys([encoding[, format]])
#
Added in: v0.11.14
encoding <string> The encoding of the return value.
format <string> Default: 'uncompressed'
Returns: <Buffer> | <string>
Generates private and public EC Diffie-Hellman key values, and returns the public key in the specified format and encoding. This key should be transferred to the other party.
The format argument specifies point encoding and can be 'compressed' or 'uncompressed'. If format is not specified, the point will be returned in 'uncompressed' format.
If encoding is provided a string is returned; otherwise a Buffer is returned.
ecdh.getPrivateKey([encoding])
#
Added in: v0.11.14
encoding <string> The encoding of the return value.
Returns: <Buffer> | <string> The EC Diffie-Hellman in the specified encoding.
If encoding is specified, a string is returned; otherwise a Buffer is returned.
ecdh.getPublicKey([encoding][, format])
#
Added in: v0.11.14
encoding <string> The encoding of the return value.
format <string> Default: 'uncompressed'
Returns: <Buffer> | <string> The EC Diffie-Hellman public key in the specified encoding and format.
The format argument specifies point encoding and can be 'compressed' or 'uncompressed'. If format is not specified the point will be returned in 'uncompressed' format.
If encoding is specified, a string is returned; otherwise a Buffer is returned.
ecdh.setPrivateKey(privateKey[, encoding])
#
Added in: v0.11.14
privateKey <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
encoding <string> The encoding of the privateKey string.
Sets the EC Diffie-Hellman private key. If encoding is provided, privateKey is expected to be a string; otherwise privateKey is expected to be a Buffer, TypedArray, or DataView.
If privateKey is not valid for the curve specified when the ECDH object was created, an error is thrown. Upon setting the private key, the associated public point (key) is also generated and set in the ECDH object.
ecdh.setPublicKey(publicKey[, encoding])
#
Added in: v0.11.14Deprecated since: v5.2.0
Stability: 0 - Deprecated
publicKey <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
encoding <string> The encoding of the publicKey string.
Sets the EC Diffie-Hellman public key. If encoding is provided publicKey is expected to be a string; otherwise a Buffer, TypedArray, or DataView is expected.
There is not normally a reason to call this method because ECDH only requires a private key and the other party's public key to compute the shared secret. Typically either ecdh.generateKeys() or ecdh.setPrivateKey() will be called. The ecdh.setPrivateKey() method attempts to generate the public point/key associated with the private key being set.
Example (obtaining a shared secret):
const {
  createECDH,
  createHash,
} = require('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// This is a shortcut way of specifying one of Alice's previous private
// keys. It would be unwise to use such a predictable private key in a real
// application.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bob uses a newly generated cryptographically strong
// pseudorandom key pair
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret and bobSecret should be the same shared secret value
console.log(aliceSecret === bobSecret);
copy
Class: Hash
#
Added in: v0.1.92
Extends: <stream.Transform>
The Hash class is a utility for creating hash digests of data. It can be used in one of two ways:
As a stream that is both readable and writable, where data is written to produce a computed hash digest on the readable side, or
Using the hash.update() and hash.digest() methods to produce the computed hash.
The crypto.createHash() method is used to create Hash instances. Hash objects are not to be created directly using the new keyword.
Example: Using Hash objects as streams:
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
copy
Example: Using Hash and piped streams:
const { createReadStream } = require('node:fs');
const { createHash } = require('node:crypto');
const { stdout } = require('node:process');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
copy
Example: Using the hash.update() and hash.digest() methods:
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Prints:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
copy
hash.copy([options])
#
Added in: v13.1.0
options <Object> stream.transform options
Returns: <Hash>
Creates a new Hash object that contains a deep copy of the internal state of the current Hash object.
The optional options argument controls stream behavior. For XOF hash functions such as 'shake256', the outputLength option can be used to specify the desired output length in bytes.
An error is thrown when an attempt is made to copy the Hash object after its hash.digest() method has been called.
// Calculate a rolling hash.
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// Etc.
copy
hash.digest([encoding])
#
Added in: v0.1.92
encoding <string> The encoding of the return value.
Returns: <Buffer> | <string>
Calculates the digest of all of the data passed to be hashed (using the hash.update() method). If encoding is provided a string will be returned; otherwise a Buffer is returned.
The Hash object can not be used again after hash.digest() method has been called. Multiple calls will cause an error to be thrown.
hash.update(data[, inputEncoding])
#
History













data <string> | <Buffer> | <TypedArray> | <DataView>
inputEncoding <string> The encoding of the data string.
Updates the hash content with the given data, the encoding of which is given in inputEncoding. If encoding is not provided, and the data is a string, an encoding of 'utf8' is enforced. If data is a Buffer, TypedArray, or DataView, then inputEncoding is ignored.
This can be called many times with new data as it is streamed.
Class: Hmac
#
Added in: v0.1.94
Extends: <stream.Transform>
The Hmac class is a utility for creating cryptographic HMAC digests. It can be used in one of two ways:
As a stream that is both readable and writable, where data is written to produce a computed HMAC digest on the readable side, or
Using the hmac.update() and hmac.digest() methods to produce the computed HMAC digest.
The crypto.createHmac() method is used to create Hmac instances. Hmac objects are not to be created directly using the new keyword.
Example: Using Hmac objects as streams:
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
copy
Example: Using Hmac and piped streams:
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { stdout } = require('node:process');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
copy
Example: Using the hmac.update() and hmac.digest() methods:
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Prints:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
copy
hmac.digest([encoding])
#
Added in: v0.1.94
encoding <string> The encoding of the return value.
Returns: <Buffer> | <string>
Calculates the HMAC digest of all of the data passed using hmac.update(). If encoding is provided a string is returned; otherwise a Buffer is returned;
The Hmac object can not be used again after hmac.digest() has been called. Multiple calls to hmac.digest() will result in an error being thrown.
hmac.update(data[, inputEncoding])
#
History













data <string> | <Buffer> | <TypedArray> | <DataView>
inputEncoding <string> The encoding of the data string.
Updates the Hmac content with the given data, the encoding of which is given in inputEncoding. If encoding is not provided, and the data is a string, an encoding of 'utf8' is enforced. If data is a Buffer, TypedArray, or DataView, then inputEncoding is ignored.
This can be called many times with new data as it is streamed.
Class: KeyObject
#
History

















Node.js uses a KeyObject class to represent a symmetric or asymmetric key, and each kind of key exposes different functions. The crypto.createSecretKey(), crypto.createPublicKey() and crypto.createPrivateKey() methods are used to create KeyObject instances. KeyObject objects are not to be created directly using the new keyword.
Most applications should consider using the new KeyObject API instead of passing keys as strings or Buffers due to improved security features.
KeyObject instances can be passed to other threads via postMessage(). The receiver obtains a cloned KeyObject, and the KeyObject does not need to be listed in the transferList argument.
Static method: KeyObject.from(key)
#
Added in: v15.0.0
key <CryptoKey>
Returns: <KeyObject>
Example: Converting a CryptoKey instance to a KeyObject:
const { KeyObject } = require('node:crypto');
const { subtle } = globalThis.crypto;

(async function() {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);

  const keyObject = KeyObject.from(key);
  console.log(keyObject.symmetricKeySize);
  // Prints: 32 (symmetric key size in bytes)
})();
copy
keyObject.asymmetricKeyDetails
#
History













<Object>
modulusLength: <number> Key size in bits (RSA, DSA).
publicExponent: <bigint> Public exponent (RSA).
hashAlgorithm: <string> Name of the message digest (RSA-PSS).
mgf1HashAlgorithm: <string> Name of the message digest used by MGF1 (RSA-PSS).
saltLength: <number> Minimal salt length in bytes (RSA-PSS).
divisorLength: <number> Size of q in bits (DSA).
namedCurve: <string> Name of the curve (EC).
This property exists only on asymmetric keys. Depending on the type of the key, this object contains information about the key. None of the information obtained through this property can be used to uniquely identify a key or to compromise the security of the key.
For RSA-PSS keys, if the key material contains a RSASSA-PSS-params sequence, the hashAlgorithm, mgf1HashAlgorithm, and saltLength properties will be set.
Other key details might be exposed via this API using additional attributes.
keyObject.asymmetricKeyType
#
History





























<string>
For asymmetric keys, this property represents the type of the key. Supported key types are:
'rsa' (OID 1.2.840.113549.1.1.1)
'rsa-pss' (OID 1.2.840.113549.1.1.10)
'dsa' (OID 1.2.840.10040.4.1)
'ec' (OID 1.2.840.10045.2.1)
'x25519' (OID 1.3.101.110)
'x448' (OID 1.3.101.111)
'ed25519' (OID 1.3.101.112)
'ed448' (OID 1.3.101.113)
'dh' (OID 1.2.840.113549.1.3.1)
This property is undefined for unrecognized KeyObject types and symmetric keys.
keyObject.equals(otherKeyObject)
#
Added in: v17.7.0, v16.15.0
otherKeyObject: <KeyObject> A KeyObject with which to compare keyObject.
Returns: <boolean>
Returns true or false depending on whether the keys have exactly the same type, value, and parameters. This method is not constant time.
keyObject.export([options])
#
History













options: <Object>
Returns: <string> | <Buffer> | <Object>
For symmetric keys, the following encoding options can be used:
format: <string> Must be 'buffer' (default) or 'jwk'.
For public keys, the following encoding options can be used:
type: <string> Must be one of 'pkcs1' (RSA only) or 'spki'.
format: <string> Must be 'pem', 'der', or 'jwk'.
For private keys, the following encoding options can be used:
type: <string> Must be one of 'pkcs1' (RSA only), 'pkcs8' or 'sec1' (EC only).
format: <string> Must be 'pem', 'der', or 'jwk'.
cipher: <string> If specified, the private key will be encrypted with the given cipher and passphrase using PKCS#5 v2.0 password based encryption.
passphrase: <string> | <Buffer> The passphrase to use for encryption, see cipher.
The result type depends on the selected encoding format, when PEM the result is a string, when DER it will be a buffer containing the data encoded as DER, when JWK it will be an object.
When JWK encoding format was selected, all other encoding options are ignored.
PKCS#1, SEC1, and PKCS#8 type keys can be encrypted by using a combination of the cipher and format options. The PKCS#8 type can be used with any format to encrypt any key algorithm (RSA, EC, or DH) by specifying a cipher. PKCS#1 and SEC1 can only be encrypted by specifying a cipher when the PEM format is used. For maximum compatibility, use PKCS#8 for encrypted private keys. Since PKCS#8 defines its own encryption mechanism, PEM-level encryption is not supported when encrypting a PKCS#8 key. See RFC 5208 for PKCS#8 encryption and RFC 1421 for PKCS#1 and SEC1 encryption.
keyObject.symmetricKeySize
#
Added in: v11.6.0
<number>
For secret keys, this property represents the size of the key in bytes. This property is undefined for asymmetric keys.
keyObject.toCryptoKey(algorithm, extractable, keyUsages)
#
Added in: v23.0.0, v22.10.0
algorithm: <string> | <Algorithm> | <RsaHashedImportParams> | <EcKeyImportParams> | <HmacImportParams>
extractable: <boolean>
keyUsages: <string[]> See Key usages.
Returns: <CryptoKey>
Converts a KeyObject instance to a CryptoKey.
keyObject.type
#
Added in: v11.6.0
<string>
Depending on the type of this KeyObject, this property is either 'secret' for secret (symmetric) keys, 'public' for public (asymmetric) keys or 'private' for private (asymmetric) keys.
Class: Sign
#
Added in: v0.1.92
Extends: <stream.Writable>
The Sign class is a utility for generating signatures. It can be used in one of two ways:
As a writable stream, where data to be signed is written and the sign.sign() method is used to generate and return the signature, or
Using the sign.update() and sign.sign() methods to produce the signature.
The crypto.createSign() method is used to create Sign instances. The argument is the string name of the hash function to use. Sign objects are not to be created directly using the new keyword.
Example: Using Sign and Verify objects as streams:
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Prints: true
copy
Example: Using the sign.update() and verify.update() methods:
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Prints: true
copy
sign.sign(privateKey[, outputEncoding])
#
History





























privateKey <Object> | <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> | <CryptoKey>
dsaEncoding <string>
padding <integer>
saltLength <integer>
outputEncoding <string> The encoding of the return value.
Returns: <Buffer> | <string>
Calculates the signature on all the data passed through using either sign.update() or sign.write().
If privateKey is not a KeyObject, this function behaves as if privateKey had been passed to crypto.createPrivateKey(). If it is an object, the following additional properties can be passed:
dsaEncoding <string> For DSA and ECDSA, this option specifies the format of the generated signature. It can be one of the following:
'der' (default): DER-encoded ASN.1 signature structure encoding (r, s).
'ieee-p1363': Signature format r || s as proposed in IEEE-P1363.
padding <integer> Optional padding value for RSA, one of the following:
crypto.constants.RSA_PKCS1_PADDING (default)
crypto.constants.RSA_PKCS1_PSS_PADDING
RSA_PKCS1_PSS_PADDING will use MGF1 with the same hash function used to sign the message as specified in section 3.1 of RFC 4055, unless an MGF1 hash function has been specified as part of the key in compliance with section 3.3 of RFC 4055.
saltLength <integer> Salt length for when padding is RSA_PKCS1_PSS_PADDING. The special value crypto.constants.RSA_PSS_SALTLEN_DIGEST sets the salt length to the digest size, crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN (default) sets it to the maximum permissible value.
If outputEncoding is provided a string is returned; otherwise a Buffer is returned.
The Sign object can not be again used after sign.sign() method has been called. Multiple calls to sign.sign() will result in an error being thrown.
sign.update(data[, inputEncoding])
#
History













data <string> | <Buffer> | <TypedArray> | <DataView>
inputEncoding <string> The encoding of the data string.
Updates the Sign content with the given data, the encoding of which is given in inputEncoding. If encoding is not provided, and the data is a string, an encoding of 'utf8' is enforced. If data is a Buffer, TypedArray, or DataView, then inputEncoding is ignored.
This can be called many times with new data as it is streamed.
Class: Verify
#
Added in: v0.1.92
Extends: <stream.Writable>
The Verify class is a utility for verifying signatures. It can be used in one of two ways:
As a writable stream where written data is used to validate against the supplied signature, or
Using the verify.update() and verify.verify() methods to verify the signature.
The crypto.createVerify() method is used to create Verify instances. Verify objects are not to be created directly using the new keyword.
See Sign for examples.
verify.update(data[, inputEncoding])
#
History













data <string> | <Buffer> | <TypedArray> | <DataView>
inputEncoding <string> The encoding of the data string.
Updates the Verify content with the given data, the encoding of which is given in inputEncoding. If inputEncoding is not provided, and the data is a string, an encoding of 'utf8' is enforced. If data is a Buffer, TypedArray, or DataView, then inputEncoding is ignored.
This can be called many times with new data as it is streamed.
verify.verify(object, signature[, signatureEncoding])
#
History





























object <Object> | <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> | <CryptoKey>
dsaEncoding <string>
padding <integer>
saltLength <integer>
signature <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
signatureEncoding <string> The encoding of the signature string.
Returns: <boolean> true or false depending on the validity of the signature for the data and public key.
Verifies the provided data using the given object and signature.
If object is not a KeyObject, this function behaves as if object had been passed to crypto.createPublicKey(). If it is an object, the following additional properties can be passed:
dsaEncoding <string> For DSA and ECDSA, this option specifies the format of the signature. It can be one of the following:
'der' (default): DER-encoded ASN.1 signature structure encoding (r, s).
'ieee-p1363': Signature format r || s as proposed in IEEE-P1363.
padding <integer> Optional padding value for RSA, one of the following:
crypto.constants.RSA_PKCS1_PADDING (default)
crypto.constants.RSA_PKCS1_PSS_PADDING
RSA_PKCS1_PSS_PADDING will use MGF1 with the same hash function used to verify the message as specified in section 3.1 of RFC 4055, unless an MGF1 hash function has been specified as part of the key in compliance with section 3.3 of RFC 4055.
saltLength <integer> Salt length for when padding is RSA_PKCS1_PSS_PADDING. The special value crypto.constants.RSA_PSS_SALTLEN_DIGEST sets the salt length to the digest size, crypto.constants.RSA_PSS_SALTLEN_AUTO (default) causes it to be determined automatically.
The signature argument is the previously calculated signature for the data, in the signatureEncoding. If a signatureEncoding is specified, the signature is expected to be a string; otherwise signature is expected to be a Buffer, TypedArray, or DataView.
The verify object can not be used again after verify.verify() has been called. Multiple calls to verify.verify() will result in an error being thrown.
Because public keys can be derived from private keys, a private key may be passed instead of a public key.
Class: X509Certificate
#
Added in: v15.6.0
Encapsulates an X509 certificate and provides read-only access to its information.
const { X509Certificate } = require('node:crypto');

const x509 = new X509Certificate('{... pem encoded cert ...}');

console.log(x509.subject);
copy
new X509Certificate(buffer)
#
Added in: v15.6.0
buffer <string> | <TypedArray> | <Buffer> | <DataView> A PEM or DER encoded X509 Certificate.
x509.ca
#
Added in: v15.6.0
Type: <boolean> Will be true if this is a Certificate Authority (CA) certificate.
x509.checkEmail(email[, options])
#
History





















email <string>
options <Object>
subject <string> 'default', 'always', or 'never'. Default: 'default'.
Returns: <string> | <undefined> Returns email if the certificate matches, undefined if it does not.
Checks whether the certificate matches the given email address.
If the 'subject' option is undefined or set to 'default', the certificate subject is only considered if the subject alternative name extension either does not exist or does not contain any email addresses.
If the 'subject' option is set to 'always' and if the subject alternative name extension either does not exist or does not contain a matching email address, the certificate subject is considered.
If the 'subject' option is set to 'never', the certificate subject is never considered, even if the certificate contains no subject alternative names.
x509.checkHost(name[, options])
#
History

















name <string>
options <Object>
subject <string> 'default', 'always', or 'never'. Default: 'default'.
wildcards <boolean> Default: true.
partialWildcards <boolean> Default: true.
multiLabelWildcards <boolean> Default: false.
singleLabelSubdomains <boolean> Default: false.
Returns: <string> | <undefined> Returns a subject name that matches name, or undefined if no subject name matches name.
Checks whether the certificate matches the given host name.
If the certificate matches the given host name, the matching subject name is returned. The returned name might be an exact match (e.g., foo.example.com) or it might contain wildcards (e.g., *.example.com). Because host name comparisons are case-insensitive, the returned subject name might also differ from the given name in capitalization.
If the 'subject' option is undefined or set to 'default', the certificate subject is only considered if the subject alternative name extension either does not exist or does not contain any DNS names. This behavior is consistent with RFC 2818 ("HTTP Over TLS").
If the 'subject' option is set to 'always' and if the subject alternative name extension either does not exist or does not contain a matching DNS name, the certificate subject is considered.
If the 'subject' option is set to 'never', the certificate subject is never considered, even if the certificate contains no subject alternative names.
x509.checkIP(ip)
#
History













ip <string>
Returns: <string> | <undefined> Returns ip if the certificate matches, undefined if it does not.
Checks whether the certificate matches the given IP address (IPv4 or IPv6).
Only RFC 5280 iPAddress subject alternative names are considered, and they must match the given ip address exactly. Other subject alternative names as well as the subject field of the certificate are ignored.
x509.checkIssued(otherCert)
#
Added in: v15.6.0
otherCert <X509Certificate>
Returns: <boolean>
Checks whether this certificate was potentially issued by the given otherCert by comparing the certificate metadata.
This is useful for pruning a list of possible issuer certificates which have been selected using a more rudimentary filtering routine, i.e. just based on subject and issuer names.
Finally, to verify that this certificate's signature was produced by a private key corresponding to otherCert's public key use x509.verify(publicKey) with otherCert's public key represented as a KeyObject like so
if (!x509.verify(otherCert.publicKey)) {
  throw new Error('otherCert did not issue x509');
}
copy
x509.checkPrivateKey(privateKey)
#
Added in: v15.6.0
privateKey <KeyObject> A private key.
Returns: <boolean>
Checks whether the public key for this certificate is consistent with the given private key.
x509.extKeyUsage
#
Added in: v15.6.0
Type: <string[]>
An array detailing the key extended usages for this certificate.
x509.fingerprint
#
Added in: v15.6.0
Type: <string>
The SHA-1 fingerprint of this certificate.
Because SHA-1 is cryptographically broken and because the security of SHA-1 is significantly worse than that of algorithms that are commonly used to sign certificates, consider using x509.fingerprint256 instead.
x509.fingerprint256
#
Added in: v15.6.0
Type: <string>
The SHA-256 fingerprint of this certificate.
x509.fingerprint512
#
Added in: v17.2.0, v16.14.0
Type: <string>
The SHA-512 fingerprint of this certificate.
Because computing the SHA-256 fingerprint is usually faster and because it is only half the size of the SHA-512 fingerprint, x509.fingerprint256 may be a better choice. While SHA-512 presumably provides a higher level of security in general, the security of SHA-256 matches that of most algorithms that are commonly used to sign certificates.
x509.infoAccess
#
History













Type: <string>
A textual representation of the certificate's authority information access extension.
This is a line feed separated list of access descriptions. Each line begins with the access method and the kind of the access location, followed by a colon and the value associated with the access location.
After the prefix denoting the access method and the kind of the access location, the remainder of each line might be enclosed in quotes to indicate that the value is a JSON string literal. For backward compatibility, Node.js only uses JSON string literals within this property when necessary to avoid ambiguity. Third-party code should be prepared to handle both possible entry formats.
x509.issuer
#
Added in: v15.6.0
Type: <string>
The issuer identification included in this certificate.
x509.issuerCertificate
#
Added in: v15.9.0
Type: <X509Certificate>
The issuer certificate or undefined if the issuer certificate is not available.
x509.publicKey
#
Added in: v15.6.0
Type: <KeyObject>
The public key <KeyObject> for this certificate.
x509.raw
#
Added in: v15.6.0
Type: <Buffer>
A Buffer containing the DER encoding of this certificate.
x509.serialNumber
#
Added in: v15.6.0
Type: <string>
The serial number of this certificate.
Serial numbers are assigned by certificate authorities and do not uniquely identify certificates. Consider using x509.fingerprint256 as a unique identifier instead.
x509.subject
#
Added in: v15.6.0
Type: <string>
The complete subject of this certificate.
x509.subjectAltName
#
History













Type: <string>
The subject alternative name specified for this certificate.
This is a comma-separated list of subject alternative names. Each entry begins with a string identifying the kind of the subject alternative name followed by a colon and the value associated with the entry.
Earlier versions of Node.js incorrectly assumed that it is safe to split this property at the two-character sequence ', ' (see CVE-2021-44532). However, both malicious and legitimate certificates can contain subject alternative names that include this sequence when represented as a string.
After the prefix denoting the type of the entry, the remainder of each entry might be enclosed in quotes to indicate that the value is a JSON string literal. For backward compatibility, Node.js only uses JSON string literals within this property when necessary to avoid ambiguity. Third-party code should be prepared to handle both possible entry formats.
x509.toJSON()
#
Added in: v15.6.0
Type: <string>
There is no standard JSON encoding for X509 certificates. The toJSON() method returns a string containing the PEM encoded certificate.
x509.toLegacyObject()
#
Added in: v15.6.0
Type: <Object>
Returns information about this certificate using the legacy certificate object encoding.
x509.toString()
#
Added in: v15.6.0
Type: <string>
Returns the PEM-encoded certificate.
x509.validFrom
#
Added in: v15.6.0
Type: <string>
The date/time from which this certificate is valid.
x509.validFromDate
#
Added in: v23.0.0, v22.10.0
Type: <Date>
The date/time from which this certificate is valid, encapsulated in a Date object.
x509.validTo
#
Added in: v15.6.0
Type: <string>
The date/time until which this certificate is valid.
x509.validToDate
#
Added in: v23.0.0, v22.10.0
Type: <Date>
The date/time until which this certificate is valid, encapsulated in a Date object.
x509.verify(publicKey)
#
Added in: v15.6.0
publicKey <KeyObject> A public key.
Returns: <boolean>
Verifies that this certificate was signed by the given public key. Does not perform any other validation checks on the certificate.
node:crypto module methods and properties
#
crypto.checkPrime(candidate[, options], callback)
#
History













candidate <ArrayBuffer> | <SharedArrayBuffer> | <TypedArray> | <Buffer> | <DataView> | <bigint> A possible prime encoded as a sequence of big endian octets of arbitrary length.
options <Object>
checks <number> The number of Miller-Rabin probabilistic primality iterations to perform. When the value is 0 (zero), a number of checks is used that yields a false positive rate of at most 2-64 for random input. Care must be used when selecting a number of checks. Refer to the OpenSSL documentation for the BN_is_prime_ex function nchecks options for more details. Default: 0
callback <Function>
err <Error> Set to an <Error> object if an error occurred during check.
result <boolean> true if the candidate is a prime with an error probability less than 0.25 ** options.checks.
Checks the primality of the candidate.
crypto.checkPrimeSync(candidate[, options])
#
Added in: v15.8.0
candidate <ArrayBuffer> | <SharedArrayBuffer> | <TypedArray> | <Buffer> | <DataView> | <bigint> A possible prime encoded as a sequence of big endian octets of arbitrary length.
options <Object>
checks <number> The number of Miller-Rabin probabilistic primality iterations to perform. When the value is 0 (zero), a number of checks is used that yields a false positive rate of at most 2-64 for random input. Care must be used when selecting a number of checks. Refer to the OpenSSL documentation for the BN_is_prime_ex function nchecks options for more details. Default: 0
Returns: <boolean> true if the candidate is a prime with an error probability less than 0.25 ** options.checks.
Checks the primality of the candidate.
crypto.constants
#
Added in: v6.3.0
<Object>
An object containing commonly used constants for crypto and security related operations. The specific constants currently defined are described in Crypto constants.
crypto.createCipheriv(algorithm, key, iv[, options])
#
History





































algorithm <string>
key <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> | <CryptoKey>
iv <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <null>
options <Object> stream.transform options
Returns: <Cipheriv>
Creates and returns a Cipheriv object, with the given algorithm, key and initialization vector (iv).
The options argument controls stream behavior and is optional except when a cipher in CCM or OCB mode (e.g. 'aes-128-ccm') is used. In that case, the authTagLength option is required and specifies the length of the authentication tag in bytes, see CCM mode. In GCM mode, the authTagLength option is not required but can be used to set the length of the authentication tag that will be returned by getAuthTag() and defaults to 16 bytes. For chacha20-poly1305, the authTagLength option defaults to 16 bytes.
The algorithm is dependent on OpenSSL, examples are 'aes192', etc. On recent OpenSSL releases, openssl list -cipher-algorithms will display the available cipher algorithms.
The key is the raw key used by the algorithm and iv is an initialization vector. Both arguments must be 'utf8' encoded strings, Buffers, TypedArray, or DataViews. The key may optionally be a KeyObject of type secret. If the cipher does not need an initialization vector, iv may be null.
When passing strings for key or iv, please consider caveats when using strings as inputs to cryptographic APIs.
Initialization vectors should be unpredictable and unique; ideally, they will be cryptographically random. They do not have to be secret: IVs are typically just added to ciphertext messages unencrypted. It may sound contradictory that something has to be unpredictable and unique, but does not have to be secret; remember that an attacker must not be able to predict ahead of time what a given IV will be.
crypto.createDecipheriv(algorithm, key, iv[, options])
#
History

































algorithm <string>
key <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> | <CryptoKey>
iv <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <null>
options <Object> stream.transform options
Returns: <Decipheriv>
Creates and returns a Decipheriv object that uses the given algorithm, key and initialization vector (iv).
The options argument controls stream behavior and is optional except when a cipher in CCM or OCB mode (e.g. 'aes-128-ccm') is used. In that case, the authTagLength option is required and specifies the length of the authentication tag in bytes, see CCM mode. For AES-GCM and chacha20-poly1305, the authTagLength option defaults to 16 bytes and must be set to a different value if a different length is used.
The algorithm is dependent on OpenSSL, examples are 'aes192', etc. On recent OpenSSL releases, openssl list -cipher-algorithms will display the available cipher algorithms.
The key is the raw key used by the algorithm and iv is an initialization vector. Both arguments must be 'utf8' encoded strings, Buffers, TypedArray, or DataViews. The key may optionally be a KeyObject of type secret. If the cipher does not need an initialization vector, iv may be null.
When passing strings for key or iv, please consider caveats when using strings as inputs to cryptographic APIs.
Initialization vectors should be unpredictable and unique; ideally, they will be cryptographically random. They do not have to be secret: IVs are typically just added to ciphertext messages unencrypted. It may sound contradictory that something has to be unpredictable and unique, but does not have to be secret; remember that an attacker must not be able to predict ahead of time what a given IV will be.
crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])
#
History





















prime <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
primeEncoding <string> The encoding of the prime string.
generator <number> | <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> Default: 2
generatorEncoding <string> The encoding of the generator string.
Returns: <DiffieHellman>
Creates a DiffieHellman key exchange object using the supplied prime and an optional specific generator.
The generator argument can be a number, string, or Buffer. If generator is not specified, the value 2 is used.
If primeEncoding is specified, prime is expected to be a string; otherwise a Buffer, TypedArray, or DataView is expected.
If generatorEncoding is specified, generator is expected to be a string; otherwise a number, Buffer, TypedArray, or DataView is expected.
crypto.createDiffieHellman(primeLength[, generator])
#
Added in: v0.5.0
primeLength <number>
generator <number> Default: 2
Returns: <DiffieHellman>
Creates a DiffieHellman key exchange object and generates a prime of primeLength bits using an optional specific numeric generator. If generator is not specified, the value 2 is used.
crypto.createDiffieHellmanGroup(name)
#
Added in: v0.9.3
name <string>
Returns: <DiffieHellmanGroup>
An alias for crypto.getDiffieHellman()
crypto.createECDH(curveName)
#
Added in: v0.11.14
curveName <string>
Returns: <ECDH>
Creates an Elliptic Curve Diffie-Hellman (ECDH) key exchange object using a predefined curve specified by the curveName string. Use crypto.getCurves() to obtain a list of available curve names. On recent OpenSSL releases, openssl ecparam -list_curves will also display the name and description of each available elliptic curve.
crypto.createHash(algorithm[, options])
#
History













algorithm <string>
options <Object> stream.transform options
Returns: <Hash>
Creates and returns a Hash object that can be used to generate hash digests using the given algorithm. Optional options argument controls stream behavior. For XOF hash functions such as 'shake256', the outputLength option can be used to specify the desired output length in bytes.
The algorithm is dependent on the available algorithms supported by the version of OpenSSL on the platform. Examples are 'sha256', 'sha512', etc. On recent releases of OpenSSL, openssl list -digest-algorithms will display the available digest algorithms.
Example: generating the sha256 sum of a file
const {
  createReadStream,
} = require('node:fs');
const {
  createHash,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
copy
crypto.createHmac(algorithm, key[, options])
#
History

















algorithm <string>
key <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> | <CryptoKey>
options <Object> stream.transform options
encoding <string> The string encoding to use when key is a string.
Returns: <Hmac>
Creates and returns an Hmac object that uses the given algorithm and key. Optional options argument controls stream behavior.
The algorithm is dependent on the available algorithms supported by the version of OpenSSL on the platform. Examples are 'sha256', 'sha512', etc. On recent releases of OpenSSL, openssl list -digest-algorithms will display the available digest algorithms.
The key is the HMAC key used to generate the cryptographic HMAC hash. If it is a KeyObject, its type must be secret. If it is a string, please consider caveats when using strings as inputs to cryptographic APIs. If it was obtained from a cryptographically secure source of entropy, such as crypto.randomBytes() or crypto.generateKey(), its length should not exceed the block size of algorithm (e.g., 512 bits for SHA-256).
Example: generating the sha256 HMAC of a file
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
copy
crypto.createPrivateKey(key)
#
History

















key <Object> | <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
key: <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <Object> The key material, either in PEM, DER, or JWK format.
format: <string> Must be 'pem', 'der', or ''jwk'. Default: 'pem'.
type: <string> Must be 'pkcs1', 'pkcs8' or 'sec1'. This option is required only if the format is 'der' and ignored otherwise.
passphrase: <string> | <Buffer> The passphrase to use for decryption.
encoding: <string> The string encoding to use when key is a string.
Returns: <KeyObject>
Creates and returns a new key object containing a private key. If key is a string or Buffer, format is assumed to be 'pem'; otherwise, key must be an object with the properties described above.
If the private key is encrypted, a passphrase must be specified. The length of the passphrase is limited to 1024 bytes.
crypto.createPublicKey(key)
#
History

























key <Object> | <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
key: <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <Object> The key material, either in PEM, DER, or JWK format.
format: <string> Must be 'pem', 'der', or 'jwk'. Default: 'pem'.
type: <string> Must be 'pkcs1' or 'spki'. This option is required only if the format is 'der' and ignored otherwise.
encoding <string> The string encoding to use when key is a string.
Returns: <KeyObject>
Creates and returns a new key object containing a public key. If key is a string or Buffer, format is assumed to be 'pem'; if key is a KeyObject with type 'private', the public key is derived from the given private key; otherwise, key must be an object with the properties described above.
If the format is 'pem', the 'key' may also be an X.509 certificate.
Because public keys can be derived from private keys, a private key may be passed instead of a public key. In that case, this function behaves as if crypto.createPrivateKey() had been called, except that the type of the returned KeyObject will be 'public' and that the private key cannot be extracted from the returned KeyObject. Similarly, if a KeyObject with type 'private' is given, a new KeyObject with type 'public' will be returned and it will be impossible to extract the private key from the returned object.
crypto.createSecretKey(key[, encoding])
#
History

















key <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
encoding <string> The string encoding when key is a string.
Returns: <KeyObject>
Creates and returns a new key object containing a secret key for symmetric encryption or Hmac.
crypto.createSign(algorithm[, options])
#
Added in: v0.1.92
algorithm <string>
options <Object> stream.Writable options
Returns: <Sign>
Creates and returns a Sign object that uses the given algorithm. Use crypto.getHashes() to obtain the names of the available digest algorithms. Optional options argument controls the stream.Writable behavior.
In some cases, a Sign instance can be created using the name of a signature algorithm, such as 'RSA-SHA256', instead of a digest algorithm. This will use the corresponding digest algorithm. This does not work for all signature algorithms, such as 'ecdsa-with-SHA256', so it is best to always use digest algorithm names.
crypto.createVerify(algorithm[, options])
#
Added in: v0.1.92
algorithm <string>
options <Object> stream.Writable options
Returns: <Verify>
Creates and returns a Verify object that uses the given algorithm. Use crypto.getHashes() to obtain an array of names of the available signing algorithms. Optional options argument controls the stream.Writable behavior.
In some cases, a Verify instance can be created using the name of a signature algorithm, such as 'RSA-SHA256', instead of a digest algorithm. This will use the corresponding digest algorithm. This does not work for all signature algorithms, such as 'ecdsa-with-SHA256', so it is best to always use digest algorithm names.
crypto.diffieHellman(options[, callback])
#
History













options: <Object>
privateKey: <KeyObject>
publicKey: <KeyObject>
callback <Function>
err <Error>
secret <Buffer>
Returns: <Buffer> if the callback function is not provided.
Computes the Diffie-Hellman secret based on a privateKey and a publicKey. Both keys must have the same asymmetricKeyType, which must be one of 'dh' (for Diffie-Hellman), 'ec', 'x448', or 'x25519' (for ECDH).
If the callback function is provided this function uses libuv's threadpool.
crypto.fips
#
Added in: v6.0.0Deprecated since: v10.0.0
Stability: 0 - Deprecated
Property for checking and controlling whether a FIPS compliant crypto provider is currently in use. Setting to true requires a FIPS build of Node.js.
This property is deprecated. Please use crypto.setFips() and crypto.getFips() instead.
crypto.generateKey(type, options, callback)
#
History













type: <string> The intended use of the generated secret key. Currently accepted values are 'hmac' and 'aes'.
options: <Object>
length: <number> The bit length of the key to generate. This must be a value greater than 0.
If type is 'hmac', the minimum is 8, and the maximum length is 231-1. If the value is not a multiple of 8, the generated key will be truncated to Math.floor(length / 8).
If type is 'aes', the length must be one of 128, 192, or 256.
callback: <Function>
err: <Error>
key: <KeyObject>
Asynchronously generates a new random secret key of the given length. The type will determine which validations will be performed on the length.
const {
  generateKey,
} = require('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
copy
The size of a generated HMAC key should not exceed the block size of the underlying hash function. See crypto.createHmac() for more information.
crypto.generateKeyPair(type, options, callback)
#
History





































type: <string> Must be 'rsa', 'rsa-pss', 'dsa', 'ec', 'ed25519', 'ed448', 'x25519', 'x448', or 'dh'.
options: <Object>
modulusLength: <number> Key size in bits (RSA, DSA).
publicExponent: <number> Public exponent (RSA). Default: 0x10001.
hashAlgorithm: <string> Name of the message digest (RSA-PSS).
mgf1HashAlgorithm: <string> Name of the message digest used by MGF1 (RSA-PSS).
saltLength: <number> Minimal salt length in bytes (RSA-PSS).
divisorLength: <number> Size of q in bits (DSA).
namedCurve: <string> Name of the curve to use (EC).
prime: <Buffer> The prime parameter (DH).
primeLength: <number> Prime length in bits (DH).
generator: <number> Custom generator (DH). Default: 2.
groupName: <string> Diffie-Hellman group name (DH). See crypto.getDiffieHellman().
paramEncoding: <string> Must be 'named' or 'explicit' (EC). Default: 'named'.
publicKeyEncoding: <Object> See keyObject.export().
privateKeyEncoding: <Object> See keyObject.export().
callback: <Function>
err: <Error>
publicKey: <string> | <Buffer> | <KeyObject>
privateKey: <string> | <Buffer> | <KeyObject>
Generates a new asymmetric key pair of the given type. RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448, and DH are currently supported.
If a publicKeyEncoding or privateKeyEncoding was specified, this function behaves as if keyObject.export() had been called on its result. Otherwise, the respective part of the key is returned as a KeyObject.
It is recommended to encode public keys as 'spki' and private keys as 'pkcs8' with encryption for long-term storage:
const {
  generateKeyPair,
} = require('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
});
copy
On completion, callback will be called with err set to undefined and publicKey / privateKey representing the generated key pair.
If this method is invoked as its util.promisify()ed version, it returns a Promise for an Object with publicKey and privateKey properties.
crypto.generateKeyPairSync(type, options)
#
History

































type: <string> Must be 'rsa', 'rsa-pss', 'dsa', 'ec', 'ed25519', 'ed448', 'x25519', 'x448', or 'dh'.
options: <Object>
modulusLength: <number> Key size in bits (RSA, DSA).
publicExponent: <number> Public exponent (RSA). Default: 0x10001.
hashAlgorithm: <string> Name of the message digest (RSA-PSS).
mgf1HashAlgorithm: <string> Name of the message digest used by MGF1 (RSA-PSS).
saltLength: <number> Minimal salt length in bytes (RSA-PSS).
divisorLength: <number> Size of q in bits (DSA).
namedCurve: <string> Name of the curve to use (EC).
prime: <Buffer> The prime parameter (DH).
primeLength: <number> Prime length in bits (DH).
generator: <number> Custom generator (DH). Default: 2.
groupName: <string> Diffie-Hellman group name (DH). See crypto.getDiffieHellman().
paramEncoding: <string> Must be 'named' or 'explicit' (EC). Default: 'named'.
publicKeyEncoding: <Object> See keyObject.export().
privateKeyEncoding: <Object> See keyObject.export().
Returns: <Object>
publicKey: <string> | <Buffer> | <KeyObject>
privateKey: <string> | <Buffer> | <KeyObject>
Generates a new asymmetric key pair of the given type. RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448, and DH are currently supported.
If a publicKeyEncoding or privateKeyEncoding was specified, this function behaves as if keyObject.export() had been called on its result. Otherwise, the respective part of the key is returned as a KeyObject.
When encoding public keys, it is recommended to use 'spki'. When encoding private keys, it is recommended to use 'pkcs8' with a strong passphrase, and to keep the passphrase confidential.
const {
  generateKeyPairSync,
} = require('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
copy
The return value { publicKey, privateKey } represents the generated key pair. When PEM encoding was selected, the respective key will be a string, otherwise it will be a buffer containing the data encoded as DER.
crypto.generateKeySync(type, options)
#
Added in: v15.0.0
type: <string> The intended use of the generated secret key. Currently accepted values are 'hmac' and 'aes'.
options: <Object>
length: <number> The bit length of the key to generate.
If type is 'hmac', the minimum is 8, and the maximum length is 231-1. If the value is not a multiple of 8, the generated key will be truncated to Math.floor(length / 8).
If type is 'aes', the length must be one of 128, 192, or 256.
Returns: <KeyObject>
Synchronously generates a new random secret key of the given length. The type will determine which validations will be performed on the length.
const {
  generateKeySync,
} = require('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
copy
The size of a generated HMAC key should not exceed the block size of the underlying hash function. See crypto.createHmac() for more information.
crypto.generatePrime(size[, options], callback)
#
History













size <number> The size (in bits) of the prime to generate.
options <Object>
add <ArrayBuffer> | <SharedArrayBuffer> | <TypedArray> | <Buffer> | <DataView> | <bigint>
rem <ArrayBuffer> | <SharedArrayBuffer> | <TypedArray> | <Buffer> | <DataView> | <bigint>
safe <boolean> Default: false.
bigint <boolean> When true, the generated prime is returned as a bigint.
callback <Function>
err <Error>
prime <ArrayBuffer> | <bigint>
Generates a pseudorandom prime of size bits.
If options.safe is true, the prime will be a safe prime -- that is, (prime - 1) / 2 will also be a prime.
The options.add and options.rem parameters can be used to enforce additional requirements, e.g., for Diffie-Hellman:
If options.add and options.rem are both set, the prime will satisfy the condition that prime % add = rem.
If only options.add is set and options.safe is not true, the prime will satisfy the condition that prime % add = 1.
If only options.add is set and options.safe is set to true, the prime will instead satisfy the condition that prime % add = 3. This is necessary because prime % add = 1 for options.add > 2 would contradict the condition enforced by options.safe.
options.rem is ignored if options.add is not given.
Both options.add and options.rem must be encoded as big-endian sequences if given as an ArrayBuffer, SharedArrayBuffer, TypedArray, Buffer, or DataView.
By default, the prime is encoded as a big-endian sequence of octets in an <ArrayBuffer>. If the bigint option is true, then a <bigint> is provided.
The size of the prime will have a direct impact on how long it takes to generate the prime. The larger the size, the longer it will take. Because we use OpenSSL's BN_generate_prime_ex function, which provides only minimal control over our ability to interrupt the generation process, it is not recommended to generate overly large primes, as doing so may make the process unresponsive.
crypto.generatePrimeSync(size[, options])
#
Added in: v15.8.0
size <number> The size (in bits) of the prime to generate.
options <Object>
add <ArrayBuffer> | <SharedArrayBuffer> | <TypedArray> | <Buffer> | <DataView> | <bigint>
rem <ArrayBuffer> | <SharedArrayBuffer> | <TypedArray> | <Buffer> | <DataView> | <bigint>
safe <boolean> Default: false.
bigint <boolean> When true, the generated prime is returned as a bigint.
Returns: <ArrayBuffer> | <bigint>
Generates a pseudorandom prime of size bits.
If options.safe is true, the prime will be a safe prime -- that is, (prime - 1) / 2 will also be a prime.
The options.add and options.rem parameters can be used to enforce additional requirements, e.g., for Diffie-Hellman:
If options.add and options.rem are both set, the prime will satisfy the condition that prime % add = rem.
If only options.add is set and options.safe is not true, the prime will satisfy the condition that prime % add = 1.
If only options.add is set and options.safe is set to true, the prime will instead satisfy the condition that prime % add = 3. This is necessary because prime % add = 1 for options.add > 2 would contradict the condition enforced by options.safe.
options.rem is ignored if options.add is not given.
Both options.add and options.rem must be encoded as big-endian sequences if given as an ArrayBuffer, SharedArrayBuffer, TypedArray, Buffer, or DataView.
By default, the prime is encoded as a big-endian sequence of octets in an <ArrayBuffer>. If the bigint option is true, then a <bigint> is provided.
The size of the prime will have a direct impact on how long it takes to generate the prime. The larger the size, the longer it will take. Because we use OpenSSL's BN_generate_prime_ex function, which provides only minimal control over our ability to interrupt the generation process, it is not recommended to generate overly large primes, as doing so may make the process unresponsive.
crypto.getCipherInfo(nameOrNid[, options])
#
Added in: v15.0.0
nameOrNid: <string> | <number> The name or nid of the cipher to query.
options: <Object>
keyLength: <number> A test key length.
ivLength: <number> A test IV length.
Returns: <Object>
name <string> The name of the cipher
nid <number> The nid of the cipher
blockSize <number> The block size of the cipher in bytes. This property is omitted when mode is 'stream'.
ivLength <number> The expected or default initialization vector length in bytes. This property is omitted if the cipher does not use an initialization vector.
keyLength <number> The expected or default key length in bytes.
mode <string> The cipher mode. One of 'cbc', 'ccm', 'cfb', 'ctr', 'ecb', 'gcm', 'ocb', 'ofb', 'stream', 'wrap', 'xts'.
Returns information about a given cipher.
Some ciphers accept variable length keys and initialization vectors. By default, the crypto.getCipherInfo() method will return the default values for these ciphers. To test if a given key length or iv length is acceptable for given cipher, use the keyLength and ivLength options. If the given values are unacceptable, undefined will be returned.
crypto.getCiphers()
#
Added in: v0.9.3
Returns: <string[]> An array with the names of the supported cipher algorithms.
const {
  getCiphers,
} = require('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
copy
crypto.getCurves()
#
Added in: v2.3.0
Returns: <string[]> An array with the names of the supported elliptic curves.
const {
  getCurves,
} = require('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
copy
crypto.getDiffieHellman(groupName)
#
Added in: v0.7.5
groupName <string>
Returns: <DiffieHellmanGroup>
Creates a predefined DiffieHellmanGroup key exchange object. The supported groups are listed in the documentation for DiffieHellmanGroup.
The returned object mimics the interface of objects created by crypto.createDiffieHellman(), but will not allow changing the keys (with diffieHellman.setPublicKey(), for example). The advantage of using this method is that the parties do not have to generate nor exchange a group modulus beforehand, saving both processor and communication time.
Example (obtaining a shared secret):
const {
  getDiffieHellman,
} = require('node:crypto');

const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret and bobSecret should be the same */
console.log(aliceSecret === bobSecret);
copy
crypto.getFips()
#
Added in: v10.0.0
Returns: <number> 1 if and only if a FIPS compliant crypto provider is currently in use, 0 otherwise. A future semver-major release may change the return type of this API to a <boolean>.
crypto.getHashes()
#
Added in: v0.9.3
Returns: <string[]> An array of the names of the supported hash algorithms, such as 'RSA-SHA256'. Hash algorithms are also called "digest" algorithms.
const {
  getHashes,
} = require('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
copy
crypto.getRandomValues(typedArray)
#
Added in: v17.4.0
typedArray <Buffer> | <TypedArray> | <DataView> | <ArrayBuffer>
Returns: <Buffer> | <TypedArray> | <DataView> | <ArrayBuffer> Returns typedArray.
A convenient alias for crypto.webcrypto.getRandomValues(). This implementation is not compliant with the Web Crypto spec, to write web-compatible code use crypto.webcrypto.getRandomValues() instead.
crypto.hash(algorithm, data[, options])
#
History













Stability: 1.2 - Release candidate
algorithm <string> | <undefined>
data <string> | <Buffer> | <TypedArray> | <DataView> When data is a string, it will be encoded as UTF-8 before being hashed. If a different input encoding is desired for a string input, user could encode the string into a TypedArray using either TextEncoder or Buffer.from() and passing the encoded TypedArray into this API instead.
options <Object> | <string>
outputEncoding <string> Encoding used to encode the returned digest. Default: 'hex'.
outputLength <number> For XOF hash functions such as 'shake256', the outputLength option can be used to specify the desired output length in bytes.
Returns: <string> | <Buffer>
A utility for creating one-shot hash digests of data. It can be faster than the object-based crypto.createHash() when hashing a smaller amount of data (<= 5MB) that's readily available. If the data can be big or if it is streamed, it's still recommended to use crypto.createHash() instead.
The algorithm is dependent on the available algorithms supported by the version of OpenSSL on the platform. Examples are 'sha256', 'sha512', etc. On recent releases of OpenSSL, openssl list -digest-algorithms will display the available digest algorithms.
If options is a string, then it specifies the outputEncoding.
Example:
const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

// Hashing a string and return the result as a hex-encoded string.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Encode a base64-encoded string into a Buffer, hash it and return
// the result as a buffer.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
copy
crypto.hkdf(digest, ikm, salt, info, keylen, callback)
#
History

















digest <string> The digest algorithm to use.
ikm <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> The input keying material. Must be provided but can be zero-length.
salt <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> The salt value. Must be provided but can be zero-length.
info <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> Additional info value. Must be provided but can be zero-length, and cannot be more than 1024 bytes.
keylen <number> The length of the key to generate. Must be greater than 0. The maximum allowable value is 255 times the number of bytes produced by the selected digest function (e.g. sha512 generates 64-byte hashes, making the maximum HKDF output 16320 bytes).
callback <Function>
err <Error>
derivedKey <ArrayBuffer>
HKDF is a simple key derivation function defined in RFC 5869. The given ikm, salt and info are used with the digest to derive a key of keylen bytes.
The supplied callback function is called with two arguments: err and derivedKey. If an errors occurs while deriving the key, err will be set; otherwise err will be null. The successfully generated derivedKey will be passed to the callback as an <ArrayBuffer>. An error will be thrown if any of the input arguments specify invalid values or types.
const {
  hkdf,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
copy
crypto.hkdfSync(digest, ikm, salt, info, keylen)
#
History













digest <string> The digest algorithm to use.
ikm <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> The input keying material. Must be provided but can be zero-length.
salt <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> The salt value. Must be provided but can be zero-length.
info <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> Additional info value. Must be provided but can be zero-length, and cannot be more than 1024 bytes.
keylen <number> The length of the key to generate. Must be greater than 0. The maximum allowable value is 255 times the number of bytes produced by the selected digest function (e.g. sha512 generates 64-byte hashes, making the maximum HKDF output 16320 bytes).
Returns: <ArrayBuffer>
Provides a synchronous HKDF key derivation function as defined in RFC 5869. The given ikm, salt and info are used with the digest to derive a key of keylen bytes.
The successfully generated derivedKey will be returned as an <ArrayBuffer>.
An error will be thrown if any of the input arguments specify invalid values or types, or if the derived key cannot be generated.
const {
  hkdfSync,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
copy
crypto.pbkdf2(password, salt, iterations, keylen, digest, callback)
#
History

































password <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
salt <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
iterations <number>
keylen <number>
digest <string>
callback <Function>
err <Error>
derivedKey <Buffer>
Provides an asynchronous Password-Based Key Derivation Function 2 (PBKDF2) implementation. A selected HMAC digest algorithm specified by digest is applied to derive a key of the requested byte length (keylen) from the password, salt and iterations.
The supplied callback function is called with two arguments: err and derivedKey. If an error occurs while deriving the key, err will be set; otherwise err will be null. By default, the successfully generated derivedKey will be passed to the callback as a Buffer. An error will be thrown if any of the input arguments specify invalid values or types.
The iterations argument must be a number set as high as possible. The higher the number of iterations, the more secure the derived key will be, but will take a longer amount of time to complete.
The salt should be as unique as possible. It is recommended that a salt is random and at least 16 bytes long. See NIST SP 800-132 for details.
When passing strings for password or salt, please consider caveats when using strings as inputs to cryptographic APIs.
const {
  pbkdf2,
} = require('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
copy
An array of supported digest functions can be retrieved using crypto.getHashes().
This API uses libuv's threadpool, which can have surprising and negative performance implications for some applications; see the UV_THREADPOOL_SIZE documentation for more information.
crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)
#
History





















password <string> | <Buffer> | <TypedArray> | <DataView>
salt <string> | <Buffer> | <TypedArray> | <DataView>
iterations <number>
keylen <number>
digest <string>
Returns: <Buffer>
Provides a synchronous Password-Based Key Derivation Function 2 (PBKDF2) implementation. A selected HMAC digest algorithm specified by digest is applied to derive a key of the requested byte length (keylen) from the password, salt and iterations.
If an error occurs an Error will be thrown, otherwise the derived key will be returned as a Buffer.
The iterations argument must be a number set as high as possible. The higher the number of iterations, the more secure the derived key will be, but will take a longer amount of time to complete.
The salt should be as unique as possible. It is recommended that a salt is random and at least 16 bytes long. See NIST SP 800-132 for details.
When passing strings for password or salt, please consider caveats when using strings as inputs to cryptographic APIs.
const {
  pbkdf2Sync,
} = require('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
copy
An array of supported digest functions can be retrieved using crypto.getHashes().
crypto.privateDecrypt(privateKey, buffer)
#
History





























privateKey <Object> | <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> | <CryptoKey>
oaepHash <string> The hash function to use for OAEP padding and MGF1. Default: 'sha1'
oaepLabel <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> The label to use for OAEP padding. If not specified, no label is used.
padding <crypto.constants> An optional padding value defined in crypto.constants, which may be: crypto.constants.RSA_NO_PADDING, crypto.constants.RSA_PKCS1_PADDING, or crypto.constants.RSA_PKCS1_OAEP_PADDING.
buffer <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
Returns: <Buffer> A new Buffer with the decrypted content.
Decrypts buffer with privateKey. buffer was previously encrypted using the corresponding public key, for example using crypto.publicEncrypt().
If privateKey is not a KeyObject, this function behaves as if privateKey had been passed to crypto.createPrivateKey(). If it is an object, the padding property can be passed. Otherwise, this function uses RSA_PKCS1_OAEP_PADDING.
Using crypto.constants.RSA_PKCS1_PADDING in crypto.privateDecrypt() requires OpenSSL to support implicit rejection (rsa_pkcs1_implicit_rejection). If the version of OpenSSL used by Node.js does not support this feature, attempting to use RSA_PKCS1_PADDING will fail.
crypto.privateEncrypt(privateKey, buffer)
#
History

















privateKey <Object> | <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> | <CryptoKey>
key <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> | <CryptoKey> A PEM encoded private key.
passphrase <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> An optional passphrase for the private key.
padding <crypto.constants> An optional padding value defined in crypto.constants, which may be: crypto.constants.RSA_NO_PADDING or crypto.constants.RSA_PKCS1_PADDING.
encoding <string> The string encoding to use when buffer, key, or passphrase are strings.
buffer <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
Returns: <Buffer> A new Buffer with the encrypted content.
Encrypts buffer with privateKey. The returned data can be decrypted using the corresponding public key, for example using crypto.publicDecrypt().
If privateKey is not a KeyObject, this function behaves as if privateKey had been passed to crypto.createPrivateKey(). If it is an object, the padding property can be passed. Otherwise, this function uses RSA_PKCS1_PADDING.
crypto.publicDecrypt(key, buffer)
#
History

















key <Object> | <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> | <CryptoKey>
passphrase <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> An optional passphrase for the private key.
padding <crypto.constants> An optional padding value defined in crypto.constants, which may be: crypto.constants.RSA_NO_PADDING or crypto.constants.RSA_PKCS1_PADDING.
encoding <string> The string encoding to use when buffer, key, or passphrase are strings.
buffer <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
Returns: <Buffer> A new Buffer with the decrypted content.
Decrypts buffer with key.buffer was previously encrypted using the corresponding private key, for example using crypto.privateEncrypt().
If key is not a KeyObject, this function behaves as if key had been passed to crypto.createPublicKey(). If it is an object, the padding property can be passed. Otherwise, this function uses RSA_PKCS1_PADDING.
Because RSA public keys can be derived from private keys, a private key may be passed instead of a public key.
crypto.publicEncrypt(key, buffer)
#
History

























key <Object> | <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> | <CryptoKey>
key <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> | <CryptoKey> A PEM encoded public or private key, <KeyObject>, or <CryptoKey>.
oaepHash <string> The hash function to use for OAEP padding and MGF1. Default: 'sha1'
oaepLabel <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> The label to use for OAEP padding. If not specified, no label is used.
passphrase <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> An optional passphrase for the private key.
padding <crypto.constants> An optional padding value defined in crypto.constants, which may be: crypto.constants.RSA_NO_PADDING, crypto.constants.RSA_PKCS1_PADDING, or crypto.constants.RSA_PKCS1_OAEP_PADDING.
encoding <string> The string encoding to use when buffer, key, oaepLabel, or passphrase are strings.
buffer <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
Returns: <Buffer> A new Buffer with the encrypted content.
Encrypts the content of buffer with key and returns a new Buffer with encrypted content. The returned data can be decrypted using the corresponding private key, for example using crypto.privateDecrypt().
If key is not a KeyObject, this function behaves as if key had been passed to crypto.createPublicKey(). If it is an object, the padding property can be passed. Otherwise, this function uses RSA_PKCS1_OAEP_PADDING.
Because RSA public keys can be derived from private keys, a private key may be passed instead of a public key.
crypto.randomBytes(size[, callback])
#
History

















size <number> The number of bytes to generate. The size must not be larger than 2**31 - 1.
callback <Function>
err <Error>
buf <Buffer>
Returns: <Buffer> if the callback function is not provided.
Generates cryptographically strong pseudorandom data. The size argument is a number indicating the number of bytes to generate.
If a callback function is provided, the bytes are generated asynchronously and the callback function is invoked with two arguments: err and buf. If an error occurs, err will be an Error object; otherwise it is null. The buf argument is a Buffer containing the generated bytes.
// Asynchronous
const {
  randomBytes,
} = require('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});
copy
If the callback function is not provided, the random bytes are generated synchronously and returned as a Buffer. An error will be thrown if there is a problem generating the bytes.
// Synchronous
const {
  randomBytes,
} = require('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes of random data: ${buf.toString('hex')}`);
copy
The crypto.randomBytes() method will not complete until there is sufficient entropy available. This should normally never take longer than a few milliseconds. The only time when generating the random bytes may conceivably block for a longer period of time is right after boot, when the whole system is still low on entropy.
This API uses libuv's threadpool, which can have surprising and negative performance implications for some applications; see the UV_THREADPOOL_SIZE documentation for more information.
The asynchronous version of crypto.randomBytes() is carried out in a single threadpool request. To minimize threadpool task length variation, partition large randomBytes requests when doing so as part of fulfilling a client request.
crypto.randomFill(buffer[, offset][, size], callback)
#
History

















buffer <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> Must be supplied. The size of the provided buffer must not be larger than 2**31 - 1.
offset <number> Default: 0
size <number> Default: buffer.length - offset. The size must not be larger than 2**31 - 1.
callback <Function> function(err, buf) {}.
This function is similar to crypto.randomBytes() but requires the first argument to be a Buffer that will be filled. It also requires that a callback is passed in.
If the callback function is not provided, an error will be thrown.
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// The above is equivalent to the following:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
copy
Any ArrayBuffer, TypedArray, or DataView instance may be passed as buffer.
While this includes instances of Float32Array and Float64Array, this function should not be used to generate random floating-point numbers. The result may contain +Infinity, -Infinity, and NaN, and even if the array contains finite numbers only, they are not drawn from a uniform random distribution and have no meaningful lower or upper bounds.
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
copy
This API uses libuv's threadpool, which can have surprising and negative performance implications for some applications; see the UV_THREADPOOL_SIZE documentation for more information.
The asynchronous version of crypto.randomFill() is carried out in a single threadpool request. To minimize threadpool task length variation, partition large randomFill requests when doing so as part of fulfilling a client request.
crypto.randomFillSync(buffer[, offset][, size])
#
History













buffer <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> Must be supplied. The size of the provided buffer must not be larger than 2**31 - 1.
offset <number> Default: 0
size <number> Default: buffer.length - offset. The size must not be larger than 2**31 - 1.
Returns: <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> The object passed as buffer argument.
Synchronous version of crypto.randomFill().
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// The above is equivalent to the following:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
copy
Any ArrayBuffer, TypedArray or DataView instance may be passed as buffer.
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
copy
crypto.randomInt([min, ]max[, callback])
#
History













min <integer> Start of random range (inclusive). Default: 0.
max <integer> End of random range (exclusive).
callback <Function> function(err, n) {}.
Return a random integer n such that min <= n < max. This implementation avoids modulo bias.
The range (max - min) must be less than 248. min and max must be safe integers.
If the callback function is not provided, the random integer is generated synchronously.
// Asynchronous
const {
  randomInt,
} = require('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Random number chosen from (0, 1, 2): ${n}`);
});
copy
// Synchronous
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(3);
console.log(`Random number chosen from (0, 1, 2): ${n}`);
copy
// With `min` argument
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(1, 7);
console.log(`The dice rolled: ${n}`);
copy
crypto.randomUUID([options])
#
Added in: v15.6.0, v14.17.0
options <Object>
disableEntropyCache <boolean> By default, to improve performance, Node.js generates and caches enough random data to generate up to 128 random UUIDs. To generate a UUID without using the cache, set disableEntropyCache to true. Default: false.
Returns: <string>
Generates a random RFC 4122 version 4 UUID. The UUID is generated using a cryptographic pseudorandom number generator.
crypto.scrypt(password, salt, keylen[, options], callback)
#
History

























password <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
salt <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
keylen <number>
options <Object>
cost <number> CPU/memory cost parameter. Must be a power of two greater than one. Default: 16384.
blockSize <number> Block size parameter. Default: 8.
parallelization <number> Parallelization parameter. Default: 1.
N <number> Alias for cost. Only one of both may be specified.
r <number> Alias for blockSize. Only one of both may be specified.
p <number> Alias for parallelization. Only one of both may be specified.
maxmem <number> Memory upper bound. It is an error when (approximately) 128 * N * r > maxmem. Default: 32 * 1024 * 1024.
callback <Function>
err <Error>
derivedKey <Buffer>
Provides an asynchronous scrypt implementation. Scrypt is a password-based key derivation function that is designed to be expensive computationally and memory-wise in order to make brute-force attacks unrewarding.
The salt should be as unique as possible. It is recommended that a salt is random and at least 16 bytes long. See NIST SP 800-132 for details.
When passing strings for password or salt, please consider caveats when using strings as inputs to cryptographic APIs.
The callback function is called with two arguments: err and derivedKey. err is an exception object when key derivation fails, otherwise err is null. derivedKey is passed to the callback as a Buffer.
An exception is thrown when any of the input arguments specify invalid values or types.
const {
  scrypt,
} = require('node:crypto');

// Using the factory defaults.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Using a custom N parameter. Must be a power of two.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
copy
crypto.scryptSync(password, salt, keylen[, options])
#
History

















password <string> | <Buffer> | <TypedArray> | <DataView>
salt <string> | <Buffer> | <TypedArray> | <DataView>
keylen <number>
options <Object>
cost <number> CPU/memory cost parameter. Must be a power of two greater than one. Default: 16384.
blockSize <number> Block size parameter. Default: 8.
parallelization <number> Parallelization parameter. Default: 1.
N <number> Alias for cost. Only one of both may be specified.
r <number> Alias for blockSize. Only one of both may be specified.
p <number> Alias for parallelization. Only one of both may be specified.
maxmem <number> Memory upper bound. It is an error when (approximately) 128 * N * r > maxmem. Default: 32 * 1024 * 1024.
Returns: <Buffer>
Provides a synchronous scrypt implementation. Scrypt is a password-based key derivation function that is designed to be expensive computationally and memory-wise in order to make brute-force attacks unrewarding.
The salt should be as unique as possible. It is recommended that a salt is random and at least 16 bytes long. See NIST SP 800-132 for details.
When passing strings for password or salt, please consider caveats when using strings as inputs to cryptographic APIs.
An exception is thrown when key derivation fails, otherwise the derived key is returned as a Buffer.
An exception is thrown when any of the input arguments specify invalid values or types.
const {
  scryptSync,
} = require('node:crypto');
// Using the factory defaults.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Using a custom N parameter. Must be a power of two.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
copy
crypto.secureHeapUsed()
#
Added in: v15.6.0
Returns: <Object>
total <number> The total allocated secure heap size as specified using the --secure-heap=n command-line flag.
min <number> The minimum allocation from the secure heap as specified using the --secure-heap-min command-line flag.
used <number> The total number of bytes currently allocated from the secure heap.
utilization <number> The calculated ratio of used to total allocated bytes.
crypto.setEngine(engine[, flags])
#
History













engine <string>
flags <crypto.constants> Default: crypto.constants.ENGINE_METHOD_ALL
Load and set the engine for some or all OpenSSL functions (selected by flags). Support for custom engines in OpenSSL is deprecated from OpenSSL 3.
engine could be either an id or a path to the engine's shared library.
The optional flags argument uses ENGINE_METHOD_ALL by default. The flags is a bit field taking one of or a mix of the following flags (defined in crypto.constants):
crypto.constants.ENGINE_METHOD_RSA
crypto.constants.ENGINE_METHOD_DSA
crypto.constants.ENGINE_METHOD_DH
crypto.constants.ENGINE_METHOD_RAND
crypto.constants.ENGINE_METHOD_EC
crypto.constants.ENGINE_METHOD_CIPHERS
crypto.constants.ENGINE_METHOD_DIGESTS
crypto.constants.ENGINE_METHOD_PKEY_METHS
crypto.constants.ENGINE_METHOD_PKEY_ASN1_METHS
crypto.constants.ENGINE_METHOD_ALL
crypto.constants.ENGINE_METHOD_NONE
crypto.setFips(bool)
#
Added in: v10.0.0
bool <boolean> true to enable FIPS mode.
Enables the FIPS compliant crypto provider in a FIPS-enabled Node.js build. Throws an error if FIPS mode is not available.
crypto.sign(algorithm, data, key[, callback])
#
History





















algorithm <string> | <null> | <undefined>
data <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
key <Object> | <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> | <CryptoKey>
callback <Function>
err <Error>
signature <Buffer>
Returns: <Buffer> if the callback function is not provided.
Calculates and returns the signature for data using the given private key and algorithm. If algorithm is null or undefined, then the algorithm is dependent upon the key type (especially Ed25519 and Ed448).
If key is not a KeyObject, this function behaves as if key had been passed to crypto.createPrivateKey(). If it is an object, the following additional properties can be passed:
dsaEncoding <string> For DSA and ECDSA, this option specifies the format of the generated signature. It can be one of the following:
'der' (default): DER-encoded ASN.1 signature structure encoding (r, s).
'ieee-p1363': Signature format r || s as proposed in IEEE-P1363.
padding <integer> Optional padding value for RSA, one of the following:
crypto.constants.RSA_PKCS1_PADDING (default)
crypto.constants.RSA_PKCS1_PSS_PADDING
RSA_PKCS1_PSS_PADDING will use MGF1 with the same hash function used to sign the message as specified in section 3.1 of RFC 4055.
saltLength <integer> Salt length for when padding is RSA_PKCS1_PSS_PADDING. The special value crypto.constants.RSA_PSS_SALTLEN_DIGEST sets the salt length to the digest size, crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN (default) sets it to the maximum permissible value.
If the callback function is provided this function uses libuv's threadpool.
crypto.subtle
#
Added in: v17.4.0
Type: <SubtleCrypto>
A convenient alias for crypto.webcrypto.subtle.
crypto.timingSafeEqual(a, b)
#
History













a <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
b <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
Returns: <boolean>
This function compares the underlying bytes that represent the given ArrayBuffer, TypedArray, or DataView instances using a constant-time algorithm.
This function does not leak timing information that would allow an attacker to guess one of the values. This is suitable for comparing HMAC digests or secret values like authentication cookies or capability urls.
a and b must both be Buffers, TypedArrays, or DataViews, and they must have the same byte length. An error is thrown if a and b have different byte lengths.
If at least one of a and b is a TypedArray with more than one byte per entry, such as Uint16Array, the result will be computed using the platform byte order.
When both of the inputs are Float32Arrays or Float64Arrays, this function might return unexpected results due to IEEE 754 encoding of floating-point numbers. In particular, neither x === y nor Object.is(x, y) implies that the byte representations of two floating-point numbers x and y are equal.
Use of crypto.timingSafeEqual does not guarantee that the surrounding code is timing-safe. Care should be taken to ensure that the surrounding code does not introduce timing vulnerabilities.
crypto.verify(algorithm, data, key, signature[, callback])
#
History

























algorithm <string> | <null> | <undefined>
data <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
key <Object> | <string> | <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView> | <KeyObject> | <CryptoKey>
signature <ArrayBuffer> | <Buffer> | <TypedArray> | <DataView>
callback <Function>
err <Error>
result <boolean>
Returns: <boolean> true or false depending on the validity of the signature for the data and public key if the callback function is not provided.
Verifies the given signature for data using the given key and algorithm. If algorithm is null or undefined, then the algorithm is dependent upon the key type (especially Ed25519 and Ed448).
If key is not a KeyObject, this function behaves as if key had been passed to crypto.createPublicKey(). If it is an object, the following additional properties can be passed:
dsaEncoding <string> For DSA and ECDSA, this option specifies the format of the signature. It can be one of the following:
'der' (default): DER-encoded ASN.1 signature structure encoding (r, s).
'ieee-p1363': Signature format r || s as proposed in IEEE-P1363.
padding <integer> Optional padding value for RSA, one of the following:
crypto.constants.RSA_PKCS1_PADDING (default)
crypto.constants.RSA_PKCS1_PSS_PADDING
RSA_PKCS1_PSS_PADDING will use MGF1 with the same hash function used to sign the message as specified in section 3.1 of RFC 4055.
saltLength <integer> Salt length for when padding is RSA_PKCS1_PSS_PADDING. The special value crypto.constants.RSA_PSS_SALTLEN_DIGEST sets the salt length to the digest size, crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN (default) sets it to the maximum permissible value.
The signature argument is the previously calculated signature for the data.
Because public keys can be derived from private keys, a private key or a public key may be passed for key.
If the callback function is provided this function uses libuv's threadpool.
crypto.webcrypto
#
Added in: v15.0.0
Type: <Crypto> An implementation of the Web Crypto API standard.
See the Web Crypto API documentation for details.
Notes
#
Using strings as inputs to cryptographic APIs
#
For historical reasons, many cryptographic APIs provided by Node.js accept strings as inputs where the underlying cryptographic algorithm works on byte sequences. These instances include plaintexts, ciphertexts, symmetric keys, initialization vectors, passphrases, salts, authentication tags, and additional authenticated data.
When passing strings to cryptographic APIs, consider the following factors.
Not all byte sequences are valid UTF-8 strings. Therefore, when a byte sequence of length n is derived from a string, its entropy is generally lower than the entropy of a random or pseudorandom n byte sequence. For example, no UTF-8 string will result in the byte sequence c0 af. Secret keys should almost exclusively be random or pseudorandom byte sequences.
Similarly, when converting random or pseudorandom byte sequences to UTF-8 strings, subsequences that do not represent valid code points may be replaced by the Unicode replacement character (U+FFFD). The byte representation of the resulting Unicode string may, therefore, not be equal to the byte sequence that the string was created from.
const original = [0xc0, 0xaf];
const bytesAsString = Buffer.from(original).toString('utf8');
const stringAsBytes = Buffer.from(bytesAsString, 'utf8');
console.log(stringAsBytes);
// Prints '<Buffer ef bf bd ef bf bd>'.
copy
The outputs of ciphers, hash functions, signature algorithms, and key derivation functions are pseudorandom byte sequences and should not be used as Unicode strings.
When strings are obtained from user input, some Unicode characters can be represented in multiple equivalent ways that result in different byte sequences. For example, when passing a user passphrase to a key derivation function, such as PBKDF2 or scrypt, the result of the key derivation function depends on whether the string uses composed or decomposed characters. Node.js does not normalize character representations. Developers should consider using String.prototype.normalize() on user inputs before passing them to cryptographic APIs.
Legacy streams API (prior to Node.js 0.10)
#
The Crypto module was added to Node.js before there was the concept of a unified Stream API, and before there were Buffer objects for handling binary data. As such, many crypto classes have methods not typically found on other Node.js classes that implement the streams API (e.g. update(), final(), or digest()). Also, many methods accepted and returned 'latin1' encoded strings by default rather than Buffers. This default was changed after Node.js v0.8 to use Buffer objects by default instead.
Support for weak or compromised algorithms
#
The node:crypto module still supports some algorithms which are already compromised and are not recommended for use. The API also allows the use of ciphers and hashes with a small key size that are too weak for safe use.
Users should take full responsibility for selecting the crypto algorithm and key size according to their security requirements.
Based on the recommendations of NIST SP 800-131A:
MD5 and SHA-1 are no longer acceptable where collision resistance is required such as digital signatures.
The key used with RSA, DSA, and DH algorithms is recommended to have at least 2048 bits and that of the curve of ECDSA and ECDH at least 224 bits, to be safe to use for several years.
The DH groups of modp1, modp2 and modp5 have a key size smaller than 2048 bits and are not recommended.
See the reference for other recommendations and details.
Some algorithms that have known weaknesses and are of little relevance in practice are only available through the legacy provider, which is not enabled by default.
CCM mode
#
CCM is one of the supported AEAD algorithms. Applications which use this mode must adhere to certain restrictions when using the cipher API:
The authentication tag length must be specified during cipher creation by setting the authTagLength option and must be one of 4, 6, 8, 10, 12, 14 or 16 bytes.
The length of the initialization vector (nonce) N must be between 7 and 13 bytes (7 ≤ N ≤ 13).
The length of the plaintext is limited to 2 ** (8 * (15 - N)) bytes.
When decrypting, the authentication tag must be set via setAuthTag() before calling update(). Otherwise, decryption will fail and final() will throw an error in compliance with section 2.6 of RFC 3610.
Using stream methods such as write(data), end(data) or pipe() in CCM mode might fail as CCM cannot handle more than one chunk of data per instance.
When passing additional authenticated data (AAD), the length of the actual message in bytes must be passed to setAAD() via the plaintextLength option. Many crypto libraries include the authentication tag in the ciphertext, which means that they produce ciphertexts of the length plaintextLength + authTagLength. Node.js does not include the authentication tag, so the ciphertext length is always plaintextLength. This is not necessary if no AAD is used.
As CCM processes the whole message at once, update() must be called exactly once.
Even though calling update() is sufficient to encrypt/decrypt the message, applications must call final() to compute or verify the authentication tag.
const { Buffer } = require('node:buffer');
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = require('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
copy
FIPS mode
#
When using OpenSSL 3, Node.js supports FIPS 140-2 when used with an appropriate OpenSSL 3 provider, such as the FIPS provider from OpenSSL 3 which can be installed by following the instructions in OpenSSL's FIPS README file.
For FIPS support in Node.js you will need:
A correctly installed OpenSSL 3 FIPS provider.
An OpenSSL 3 FIPS module configuration file.
An OpenSSL 3 configuration file that references the FIPS module configuration file.
Node.js will need to be configured with an OpenSSL configuration file that points to the FIPS provider. An example configuration file looks like this:
nodejs_conf = nodejs_init

.include /<absolute path>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect

[provider_sect]
default = default_sect
# The fips section name should match the section name inside the
# included fipsmodule.cnf.
fips = fips_sect

[default_sect]
activate = 1
copy
where fipsmodule.cnf is the FIPS module configuration file generated from the FIPS provider installation step:
openssl fipsinstall
copy
Set the OPENSSL_CONF environment variable to point to your configuration file and OPENSSL_MODULES to the location of the FIPS provider dynamic library. e.g.
export OPENSSL_CONF=/<path to configuration file>/nodejs.cnf
export OPENSSL_MODULES=/<path to openssl lib>/ossl-modules
copy
FIPS mode can then be enabled in Node.js either by:
Starting Node.js with --enable-fips or --force-fips command line flags.
Programmatically calling crypto.setFips(true).
Optionally FIPS mode can be enabled in Node.js via the OpenSSL configuration file. e.g.
nodejs_conf = nodejs_init

.include /<absolute path>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect
alg_section = algorithm_sect

[provider_sect]
default = default_sect
# The fips section name should match the section name inside the
# included fipsmodule.cnf.
fips = fips_sect

[default_sect]
activate = 1

[algorithm_sect]
default_properties = fips=yes
copy
Crypto constants
#
The following constants exported by crypto.constants apply to various uses of the node:crypto, node:tls, and node:https modules and are generally specific to OpenSSL.
OpenSSL options
#
See the list of SSL OP Flags for details.
Constant
Description
SSL_OP_ALL
Applies multiple bug workarounds within OpenSSL. See https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html for detail.
SSL_OP_ALLOW_NO_DHE_KEX
Instructs OpenSSL to allow a non-[EC]DHE-based key exchange mode for TLS v1.3
SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION
Allows legacy insecure renegotiation between OpenSSL and unpatched clients or servers. See https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html.
SSL_OP_CIPHER_SERVER_PREFERENCE
Attempts to use the server's preferences instead of the client's when selecting a cipher. Behavior depends on protocol version. See https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html.
SSL_OP_CISCO_ANYCONNECT
Instructs OpenSSL to use Cisco's version identifier of DTLS_BAD_VER.
SSL_OP_COOKIE_EXCHANGE
Instructs OpenSSL to turn on cookie exchange.
SSL_OP_CRYPTOPRO_TLSEXT_BUG
Instructs OpenSSL to add server-hello extension from an early version of the cryptopro draft.
SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS
Instructs OpenSSL to disable a SSL 3.0/TLS 1.0 vulnerability workaround added in OpenSSL 0.9.6d.
SSL_OP_LEGACY_SERVER_CONNECT
Allows initial connection to servers that do not support RI.
SSL_OP_NO_COMPRESSION
Instructs OpenSSL to disable support for SSL/TLS compression.
SSL_OP_NO_ENCRYPT_THEN_MAC
Instructs OpenSSL to disable encrypt-then-MAC.
SSL_OP_NO_QUERY_MTU


SSL_OP_NO_RENEGOTIATION
Instructs OpenSSL to disable renegotiation.
SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION
Instructs OpenSSL to always start a new session when performing renegotiation.
SSL_OP_NO_SSLv2
Instructs OpenSSL to turn off SSL v2
SSL_OP_NO_SSLv3
Instructs OpenSSL to turn off SSL v3
SSL_OP_NO_TICKET
Instructs OpenSSL to disable use of RFC4507bis tickets.
SSL_OP_NO_TLSv1
Instructs OpenSSL to turn off TLS v1
SSL_OP_NO_TLSv1_1
Instructs OpenSSL to turn off TLS v1.1
SSL_OP_NO_TLSv1_2
Instructs OpenSSL to turn off TLS v1.2
SSL_OP_NO_TLSv1_3
Instructs OpenSSL to turn off TLS v1.3
SSL_OP_PRIORITIZE_CHACHA
Instructs OpenSSL server to prioritize ChaCha20-Poly1305 when the client does. This option has no effect if SSL_OP_CIPHER_SERVER_PREFERENCE is not enabled.
SSL_OP_TLS_ROLLBACK_BUG
Instructs OpenSSL to disable version rollback attack detection.

OpenSSL engine constants
#
Constant
Description
ENGINE_METHOD_RSA
Limit engine usage to RSA
ENGINE_METHOD_DSA
Limit engine usage to DSA
ENGINE_METHOD_DH
Limit engine usage to DH
ENGINE_METHOD_RAND
Limit engine usage to RAND
ENGINE_METHOD_EC
Limit engine usage to EC
ENGINE_METHOD_CIPHERS
Limit engine usage to CIPHERS
ENGINE_METHOD_DIGESTS
Limit engine usage to DIGESTS
ENGINE_METHOD_PKEY_METHS
Limit engine usage to PKEY_METHS
ENGINE_METHOD_PKEY_ASN1_METHS
Limit engine usage to PKEY_ASN1_METHS
ENGINE_METHOD_ALL


ENGINE_METHOD_NONE



Other OpenSSL constants
#
Constant
Description
DH_CHECK_P_NOT_SAFE_PRIME


DH_CHECK_P_NOT_PRIME


DH_UNABLE_TO_CHECK_GENERATOR


DH_NOT_SUITABLE_GENERATOR


RSA_PKCS1_PADDING


RSA_SSLV23_PADDING


RSA_NO_PADDING


RSA_PKCS1_OAEP_PADDING


RSA_X931_PADDING


RSA_PKCS1_PSS_PADDING


RSA_PSS_SALTLEN_DIGEST
Sets the salt length for RSA_PKCS1_PSS_PADDING to the digest size when signing or verifying.
RSA_PSS_SALTLEN_MAX_SIGN
Sets the salt length for RSA_PKCS1_PSS_PADDING to the maximum permissible value when signing data.
RSA_PSS_SALTLEN_AUTO
Causes the salt length for RSA_PKCS1_PSS_PADDING to be determined automatically when verifying a signature.
POINT_CONVERSION_COMPRESSED


POINT_CONVERSION_UNCOMPRESSED


POINT_CONVERSION_HYBRID



Node.js crypto constants
#
Constant
Description
defaultCoreCipherList
Specifies the built-in default cipher list used by Node.js.
defaultCipherList
Specifies the active default cipher list used by the current Node.js process.

Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Debugger
Watchers
Command reference
Stepping
Breakpoints
Information
Execution control
Various
Advanced usage
V8 inspector integration for Node.js
Debugger
#
Stability: 2 - Stable
Node.js includes a command-line debugging utility. The Node.js debugger client is not a full-featured debugger, but simple stepping and inspection are possible.
To use it, start Node.js with the inspect argument followed by the path to the script to debug.
$ node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/621111f9-ffcb-4e82-b718-48a145fa5db8
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
 ok
Break on start in myscript.js:2
  1 // myscript.js
> 2 global.x = 5;
  3 setTimeout(() => {
  4   debugger;
debug>
copy
The debugger automatically breaks on the first executable line. To instead run until the first breakpoint (specified by a debugger statement), set the NODE_INSPECT_RESUME_ON_START environment variable to 1.
$ cat myscript.js
// myscript.js
global.x = 5;
setTimeout(() => {
  debugger;
  console.log('world');
}, 1000);
console.log('hello');
$ NODE_INSPECT_RESUME_ON_START=1 node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/f1ed133e-7876-495b-83ae-c32c6fc319c2
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
< hello
<
break in myscript.js:4
  2 global.x = 5;
  3 setTimeout(() => {
> 4   debugger;
  5   console.log('world');
  6 }, 1000);
debug> next
break in myscript.js:5
  3 setTimeout(() => {
  4   debugger;
> 5   console.log('world');
  6 }, 1000);
  7 console.log('hello');
debug> repl
Press Ctrl+C to leave debug repl
> x
5
> 2 + 2
4
debug> next
< world
<
break in myscript.js:6
  4   debugger;
  5   console.log('world');
> 6 }, 1000);
  7 console.log('hello');
  8
debug> .exit
$
copy
The repl command allows code to be evaluated remotely. The next command steps to the next line. Type help to see what other commands are available.
Pressing enter without typing a command will repeat the previous debugger command.
Watchers
#
It is possible to watch expression and variable values while debugging. On every breakpoint, each expression from the watchers list will be evaluated in the current context and displayed immediately before the breakpoint's source code listing.
To begin watching an expression, type watch('my_expression'). The command watchers will print the active watchers. To remove a watcher, type unwatch('my_expression').
Command reference
#
Stepping
#
cont, c: Continue execution
next, n: Step next
step, s: Step in
out, o: Step out
pause: Pause running code (like pause button in Developer Tools)
Breakpoints
#
setBreakpoint(), sb(): Set breakpoint on current line
setBreakpoint(line), sb(line): Set breakpoint on specific line
setBreakpoint('fn()'), sb(...): Set breakpoint on a first statement in function's body
setBreakpoint('script.js', 1), sb(...): Set breakpoint on first line of script.js
setBreakpoint('script.js', 1, 'num < 4'), sb(...): Set conditional breakpoint on first line of script.js that only breaks when num < 4 evaluates to true
clearBreakpoint('script.js', 1), cb(...): Clear breakpoint in script.js on line 1
It is also possible to set a breakpoint in a file (module) that is not loaded yet:
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/48a5b28a-550c-471b-b5e1-d13dd7165df9
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
Break on start in main.js:1
> 1 const mod = require('./mod.js');
  2 mod.hello();
  3 mod.hello();
debug> setBreakpoint('mod.js', 22)
Warning: script 'mod.js' was not loaded yet.
debug> c
break in mod.js:22
 20 // USE OR OTHER DEALINGS IN THE SOFTWARE.
 21
>22 exports.hello = function() {
 23   return 'hello from module';
 24 };
debug>
copy
It is also possible to set a conditional breakpoint that only breaks when a given expression evaluates to true:
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/ce24daa8-3816-44d4-b8ab-8273c8a66d35
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
Break on start in main.js:7
  5 }
  6
> 7 addOne(10);
  8 addOne(-1);
  9
debug> setBreakpoint('main.js', 4, 'num < 0')
  1 'use strict';
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
  7 addOne(10);
  8 addOne(-1);
  9
debug> cont
break in main.js:4
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
debug> exec('num')
-1
debug>
copy
Information
#
backtrace, bt: Print backtrace of current execution frame
list(5): List scripts source code with 5 line context (5 lines before and after)
watch(expr): Add expression to watch list
unwatch(expr): Remove expression from watch list
unwatch(index): Remove expression at specific index from watch list
watchers: List all watchers and their values (automatically listed on each breakpoint)
repl: Open debugger's repl for evaluation in debugging script's context
exec expr, p expr: Execute an expression in debugging script's context and print its value
profile: Start CPU profiling session
profileEnd: Stop current CPU profiling session
profiles: List all completed CPU profiling sessions
profiles[n].save(filepath = 'node.cpuprofile'): Save CPU profiling session to disk as JSON
takeHeapSnapshot(filepath = 'node.heapsnapshot'): Take a heap snapshot and save to disk as JSON
Execution control
#
run: Run script (automatically runs on debugger's start)
restart: Restart script
kill: Kill script
Various
#
scripts: List all loaded scripts
version: Display V8's version
Advanced usage
#
V8 inspector integration for Node.js
#
V8 Inspector integration allows attaching Chrome DevTools to Node.js instances for debugging and profiling. It uses the Chrome DevTools Protocol.
V8 Inspector can be enabled by passing the --inspect flag when starting a Node.js application. It is also possible to supply a custom port with that flag, e.g. --inspect=9222 will accept DevTools connections on port 9222.
Using the --inspect flag will execute the code immediately before debugger is connected. This means that the code will start running before you can start debugging, which might not be ideal if you want to debug from the very beginning.
In such cases, you have two alternatives:
--inspect-wait flag: This flag will wait for debugger to be attached before executing the code. This allows you to start debugging right from the beginning of the execution.
--inspect-brk flag: Unlike --inspect, this flag will break on the first line of the code as soon as debugger is attached. This is useful when you want to debug the code step by step from the very beginning, without any code execution prior to debugging.
So, when deciding between --inspect, --inspect-wait, and --inspect-brk, consider whether you want the code to start executing immediately, wait for debugger to be attached before execution, or break on the first line for step-by-step debugging.
$ node --inspect index.js
Debugger listening on ws://127.0.0.1:9229/dc9010dd-f8b8-4ac5-a510-c1a114ec7d29
For help, see: https://nodejs.org/en/docs/inspector
copy
(In the example above, the UUID dc9010dd-f8b8-4ac5-a510-c1a114ec7d29 at the end of the URL is generated on the fly, it varies in different debugging sessions.)
If the Chrome browser is older than 66.0.3345.0, use inspector.html instead of js_app.html in the above URL.
Chrome DevTools doesn't support debugging worker threads yet. ndb can be used to debug them.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Deprecated APIs
Revoking deprecations
List of deprecated APIs
DEP0001: http.OutgoingMessage.prototype.flush
DEP0002: require('_linklist')
DEP0003: _writableState.buffer
DEP0004: CryptoStream.prototype.readyState
DEP0005: Buffer() constructor
DEP0006: child_process options.customFds
DEP0007: Replace cluster worker.suicide with worker.exitedAfterDisconnect
DEP0008: require('node:constants')
DEP0009: crypto.pbkdf2 without digest
DEP0010: crypto.createCredentials
DEP0011: crypto.Credentials
DEP0012: Domain.dispose
DEP0013: fs asynchronous function without callback
DEP0014: fs.read legacy String interface
DEP0015: fs.readSync legacy String interface
DEP0016: GLOBAL/root
DEP0017: Intl.v8BreakIterator
DEP0018: Unhandled promise rejections
DEP0019: require('.') resolved outside directory
DEP0020: Server.connections
DEP0021: Server.listenFD
DEP0022: os.tmpDir()
DEP0023: os.getNetworkInterfaces()
DEP0024: REPLServer.prototype.convertToContext()
DEP0025: require('node:sys')
DEP0026: util.print()
DEP0027: util.puts()
DEP0028: util.debug()
DEP0029: util.error()
DEP0030: SlowBuffer
DEP0031: ecdh.setPublicKey()
DEP0032: node:domain module
DEP0033: EventEmitter.listenerCount()
DEP0034: fs.exists(path, callback)
DEP0035: fs.lchmod(path, mode, callback)
DEP0036: fs.lchmodSync(path, mode)
DEP0037: fs.lchown(path, uid, gid, callback)
DEP0038: fs.lchownSync(path, uid, gid)
DEP0039: require.extensions
DEP0040: node:punycode module
DEP0041: NODE_REPL_HISTORY_FILE environment variable
DEP0042: tls.CryptoStream
DEP0043: tls.SecurePair
DEP0044: util.isArray()
DEP0045: util.isBoolean()
DEP0046: util.isBuffer()
DEP0047: util.isDate()
DEP0048: util.isError()
DEP0049: util.isFunction()
DEP0050: util.isNull()
DEP0051: util.isNullOrUndefined()
DEP0052: util.isNumber()
DEP0053: util.isObject()
DEP0054: util.isPrimitive()
DEP0055: util.isRegExp()
DEP0056: util.isString()
DEP0057: util.isSymbol()
DEP0058: util.isUndefined()
DEP0059: util.log()
DEP0060: util._extend()
DEP0061: fs.SyncWriteStream
DEP0062: node --debug
DEP0063: ServerResponse.prototype.writeHeader()
DEP0064: tls.createSecurePair()
DEP0065: repl.REPL_MODE_MAGIC and NODE_REPL_MODE=magic
DEP0066: OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames
DEP0067: OutgoingMessage.prototype._renderHeaders
DEP0068: node debug
DEP0069: vm.runInDebugContext(string)
DEP0070: async_hooks.currentId()
DEP0071: async_hooks.triggerId()
DEP0072: async_hooks.AsyncResource.triggerId()
DEP0073: Several internal properties of net.Server
DEP0074: REPLServer.bufferedCommand
DEP0075: REPLServer.parseREPLKeyword()
DEP0076: tls.parseCertString()
DEP0077: Module._debug()
DEP0078: REPLServer.turnOffEditorMode()
DEP0079: Custom inspection function on objects via .inspect()
DEP0080: path._makeLong()
DEP0081: fs.truncate() using a file descriptor
DEP0082: REPLServer.prototype.memory()
DEP0083: Disabling ECDH by setting ecdhCurve to false
DEP0084: requiring bundled internal dependencies
DEP0085: AsyncHooks sensitive API
DEP0086: Remove runInAsyncIdScope
DEP0089: require('node:assert')
DEP0090: Invalid GCM authentication tag lengths
DEP0091: crypto.DEFAULT_ENCODING
DEP0092: Top-level this bound to module.exports
DEP0093: crypto.fips is deprecated and replaced
DEP0094: Using assert.fail() with more than one argument
DEP0095: timers.enroll()
DEP0096: timers.unenroll()
DEP0097: MakeCallback with domain property
DEP0098: AsyncHooks embedder AsyncResource.emitBefore and AsyncResource.emitAfter APIs
DEP0099: Async context-unaware node::MakeCallback C++ APIs
DEP0100: process.assert()
DEP0101: --with-lttng
DEP0102: Using noAssert in Buffer#(read|write) operations
DEP0103: process.binding('util').is[...] typechecks
DEP0104: process.env string coercion
DEP0105: decipher.finaltol
DEP0106: crypto.createCipher and crypto.createDecipher
DEP0107: tls.convertNPNProtocols()
DEP0108: zlib.bytesRead
DEP0109: http, https, and tls support for invalid URLs
DEP0110: vm.Script cached data
DEP0111: process.binding()
DEP0112: dgram private APIs
DEP0113: Cipher.setAuthTag(), Decipher.getAuthTag()
DEP0114: crypto._toBuf()
DEP0115: crypto.prng(), crypto.pseudoRandomBytes(), crypto.rng()
DEP0116: Legacy URL API
DEP0117: Native crypto handles
DEP0118: dns.lookup() support for a falsy host name
DEP0119: process.binding('uv').errname() private API
DEP0120: Windows Performance Counter support
DEP0121: net._setSimultaneousAccepts()
DEP0122: tls Server.prototype.setOptions()
DEP0123: setting the TLS ServerName to an IP address
DEP0124: using REPLServer.rli
DEP0125: require('node:_stream_wrap')
DEP0126: timers.active()
DEP0127: timers._unrefActive()
DEP0128: modules with an invalid main entry and an index.js file
DEP0129: ChildProcess._channel
DEP0130: Module.createRequireFromPath()
DEP0131: Legacy HTTP parser
DEP0132: worker.terminate() with callback
DEP0133: http connection
DEP0134: process._tickCallback
DEP0135: WriteStream.open() and ReadStream.open() are internal
DEP0136: http finished
DEP0137: Closing fs.FileHandle on garbage collection
DEP0138: process.mainModule
DEP0139: process.umask() with no arguments
DEP0140: Use request.destroy() instead of request.abort()
DEP0141: repl.inputStream and repl.outputStream
DEP0142: repl._builtinLibs
DEP0143: Transform._transformState
DEP0144: module.parent
DEP0145: socket.bufferSize
DEP0146: new crypto.Certificate()
DEP0147: fs.rmdir(path, { recursive: true })
DEP0148: Folder mappings in "exports" (trailing "/")
DEP0149: http.IncomingMessage#connection
DEP0150: Changing the value of process.config
DEP0151: Main index lookup and extension searching
DEP0152: Extension PerformanceEntry properties
DEP0153: dns.lookup and dnsPromises.lookup options type coercion
DEP0154: RSA-PSS generate key pair options
DEP0155: Trailing slashes in pattern specifier resolutions
DEP0156: .aborted property and 'abort', 'aborted' event in http
DEP0157: Thenable support in streams
DEP0158: buffer.slice(start, end)
DEP0159: ERR_INVALID_CALLBACK
DEP0160: process.on('multipleResolves', handler)
DEP0161: process._getActiveRequests() and process._getActiveHandles()
DEP0162: fs.write(), fs.writeFileSync() coercion to string
DEP0163: channel.subscribe(onMessage), channel.unsubscribe(onMessage)
DEP0164: process.exit(code), process.exitCode coercion to integer
DEP0165: --trace-atomics-wait
DEP0166: Double slashes in imports and exports targets
DEP0167: Weak DiffieHellmanGroup instances (modp1, modp2, modp5)
DEP0168: Unhandled exception in Node-API callbacks
DEP0169: Insecure url.parse()
DEP0170: Invalid port when using url.parse()
DEP0171: Setters for http.IncomingMessage headers and trailers
DEP0172: The asyncResource property of AsyncResource bound functions
DEP0173: the assert.CallTracker class
DEP0174: calling promisify on a function that returns a Promise
DEP0175: util.toUSVString
DEP0176: fs.F_OK, fs.R_OK, fs.W_OK, fs.X_OK
DEP0177: util.types.isWebAssemblyCompiledModule
DEP0178: dirent.path
DEP0179: Hash constructor
DEP0180: fs.Stats constructor
DEP0181: Hmac constructor
DEP0182: Short GCM authentication tags without explicit authTagLength
DEP0183: OpenSSL engine-based APIs
DEP0184: Instantiating node:zlib classes without new
DEP0185: Instantiating node:repl classes without new
DEP0187: Passing invalid argument types to fs.existsSync
DEP0188: process.features.ipv6 and process.features.uv
DEP0189: process.features.tls_*
DEP0190: Passing args to node:child_process execFile/spawn with shell option true
DEP0191: repl.builtinModules
DEP0192: require('node:_tls_common') and require('node:_tls_wrap')
DEP0193: require('node:_stream_*')
DEP0194: HTTP/2 priority signaling
DEP0195: Instantiating node:http classes without new
DEP0196: Calling node:child_process functions with options.shell as an empty string
DEP0197: util.types.isNativeError()
DEP0198: Creating SHAKE-128 and SHAKE-256 digests without an explicit options.outputLength
Deprecated APIs
#
Node.js APIs might be deprecated for any of the following reasons:
Use of the API is unsafe.
An improved alternative API is available.
Breaking changes to the API are expected in a future major release.
Node.js uses four kinds of deprecations:
Documentation-only
Application (non-node_modules code only)
Runtime (all code)
End-of-Life
A Documentation-only deprecation is one that is expressed only within the Node.js API docs. These generate no side-effects while running Node.js. Some Documentation-only deprecations trigger a runtime warning when launched with --pending-deprecation flag (or its alternative, NODE_PENDING_DEPRECATION=1 environment variable), similarly to Runtime deprecations below. Documentation-only deprecations that support that flag are explicitly labeled as such in the list of Deprecated APIs.
An Application deprecation for only non-node_modules code will, by default, generate a process warning that will be printed to stderr the first time the deprecated API is used in code that's not loaded from node_modules. When the --throw-deprecation command-line flag is used, a Runtime deprecation will cause an error to be thrown. When --pending-deprecation is used, warnings will also be emitted for code loaded from node_modules.
A runtime deprecation for all code is similar to the runtime deprecation for non-node_modules code, except that it also emits a warning for code loaded from node_modules.
An End-of-Life deprecation is used when functionality is or will soon be removed from Node.js.
Revoking deprecations
#
Occasionally, the deprecation of an API might be reversed. In such situations, this document will be updated with information relevant to the decision. However, the deprecation identifier will not be modified.
List of deprecated APIs
#
DEP0001: http.OutgoingMessage.prototype.flush
#
History

















Type: End-of-Life
OutgoingMessage.prototype.flush() has been removed. Use OutgoingMessage.prototype.flushHeaders() instead.
DEP0002: require('_linklist')
#
History

















Type: End-of-Life
The _linklist module is deprecated. Please use a userland alternative.
DEP0003: _writableState.buffer
#
History

















Type: End-of-Life
The _writableState.buffer has been removed. Use _writableState.getBuffer() instead.
DEP0004: CryptoStream.prototype.readyState
#
History

















Type: End-of-Life
The CryptoStream.prototype.readyState property was removed.
DEP0005: Buffer() constructor
#
History

















Type: Application (non-node_modules code only)
The Buffer() function and new Buffer() constructor are deprecated due to API usability issues that can lead to accidental security issues.
As an alternative, use one of the following methods of constructing Buffer objects:
Buffer.alloc(size[, fill[, encoding]]): Create a Buffer with initialized memory.
Buffer.allocUnsafe(size): Create a Buffer with uninitialized memory.
Buffer.allocUnsafeSlow(size): Create a Buffer with uninitialized memory.
Buffer.from(array): Create a Buffer with a copy of array
Buffer.from(arrayBuffer[, byteOffset[, length]]) - Create a Buffer that wraps the given arrayBuffer.
Buffer.from(buffer): Create a Buffer that copies buffer.
Buffer.from(string[, encoding]): Create a Buffer that copies string.
Without --pending-deprecation, runtime warnings occur only for code not in node_modules. This means there will not be deprecation warnings for Buffer() usage in dependencies. With --pending-deprecation, a runtime warning results no matter where the Buffer() usage occurs.
DEP0006: child_process options.customFds
#
History





















Type: End-of-Life
Within the child_process module's spawn(), fork(), and exec() methods, the options.customFds option is deprecated. The options.stdio option should be used instead.
DEP0007: Replace cluster worker.suicide with worker.exitedAfterDisconnect
#
History





















Type: End-of-Life
In an earlier version of the Node.js cluster, a boolean property with the name suicide was added to the Worker object. The intent of this property was to provide an indication of how and why the Worker instance exited. In Node.js 6.0.0, the old property was deprecated and replaced with a new worker.exitedAfterDisconnect property. The old property name did not precisely describe the actual semantics and was unnecessarily emotion-laden.
DEP0008: require('node:constants')
#
History













Type: Documentation-only
The node:constants module is deprecated. When requiring access to constants relevant to specific Node.js builtin modules, developers should instead refer to the constants property exposed by the relevant module. For instance, require('node:fs').constants and require('node:os').constants.
DEP0009: crypto.pbkdf2 without digest
#
History

























Type: End-of-Life
Use of the crypto.pbkdf2() API without specifying a digest was deprecated in Node.js 6.0 because the method defaulted to using the non-recommended 'SHA1' digest. Previously, a deprecation warning was printed. Starting in Node.js 8.0.0, calling crypto.pbkdf2() or crypto.pbkdf2Sync() with digest set to undefined will throw a TypeError.
Beginning in Node.js v11.0.0, calling these functions with digest set to null would print a deprecation warning to align with the behavior when digest is undefined.
Now, however, passing either undefined or null will throw a TypeError.
DEP0010: crypto.createCredentials
#
History

















Type: End-of-Life
The crypto.createCredentials() API was removed. Please use tls.createSecureContext() instead.
DEP0011: crypto.Credentials
#
History

















Type: End-of-Life
The crypto.Credentials class was removed. Please use tls.SecureContext instead.
DEP0012: Domain.dispose
#
History

















Type: End-of-Life
Domain.dispose() has been removed. Recover from failed I/O actions explicitly via error event handlers set on the domain instead.
DEP0013: fs asynchronous function without callback
#
History













Type: End-of-Life
Calling an asynchronous function without a callback throws a TypeError in Node.js 10.0.0 onwards. See https://github.com/nodejs/node/pull/12562.
DEP0014: fs.read legacy String interface
#
History





















Type: End-of-Life
The fs.read() legacy String interface is deprecated. Use the Buffer API as mentioned in the documentation instead.
DEP0015: fs.readSync legacy String interface
#
History





















Type: End-of-Life
The fs.readSync() legacy String interface is deprecated. Use the Buffer API as mentioned in the documentation instead.
DEP0016: GLOBAL/root
#
History

















Type: End-of-Life
The GLOBAL and root aliases for the global property were deprecated in Node.js 6.0.0 and have since been removed.
DEP0017: Intl.v8BreakIterator
#
History













Type: End-of-Life
Intl.v8BreakIterator was a non-standard extension and has been removed. See Intl.Segmenter.
DEP0018: Unhandled promise rejections
#
History













Type: End-of-Life
Unhandled promise rejections are deprecated. By default, promise rejections that are not handled terminate the Node.js process with a non-zero exit code. To change the way Node.js treats unhandled rejections, use the --unhandled-rejections command-line option.
DEP0019: require('.') resolved outside directory
#
History

















Type: End-of-Life
In certain cases, require('.') could resolve outside the package directory. This behavior has been removed.
DEP0020: Server.connections
#
History

















Type: End-of-Life
The Server.connections property was deprecated in Node.js v0.9.7 and has been removed. Please use the Server.getConnections() method instead.
DEP0021: Server.listenFD
#
History

















Type: End-of-Life
The Server.listenFD() method was deprecated and removed. Please use Server.listen({fd: <number>}) instead.
DEP0022: os.tmpDir()
#
History













Type: End-of-Life
The os.tmpDir() API was deprecated in Node.js 7.0.0 and has since been removed. Please use os.tmpdir() instead.
DEP0023: os.getNetworkInterfaces()
#
History

















Type: End-of-Life
The os.getNetworkInterfaces() method is deprecated. Please use the os.networkInterfaces() method instead.
DEP0024: REPLServer.prototype.convertToContext()
#
History













Type: End-of-Life
The REPLServer.prototype.convertToContext() API has been removed.
DEP0025: require('node:sys')
#
History













Type: Runtime
The node:sys module is deprecated. Please use the util module instead.
DEP0026: util.print()
#
History

















Type: End-of-Life
util.print() has been removed. Please use console.log() instead.
DEP0027: util.puts()
#
History

















Type: End-of-Life
util.puts() has been removed. Please use console.log() instead.
DEP0028: util.debug()
#
History

















Type: End-of-Life
util.debug() has been removed. Please use console.error() instead.
DEP0029: util.error()
#
History

















Type: End-of-Life
util.error() has been removed. Please use console.error() instead.
DEP0030: SlowBuffer
#
History

















Type: Runtime
The SlowBuffer class is deprecated. Please use Buffer.allocUnsafeSlow(size) instead.
DEP0031: ecdh.setPublicKey()
#
History













Type: Documentation-only
The ecdh.setPublicKey() method is now deprecated as its inclusion in the API is not useful.
DEP0032: node:domain module
#
History













Type: Documentation-only
The domain module is deprecated and should not be used.
DEP0033: EventEmitter.listenerCount()
#
History













Type: Documentation-only
The events.listenerCount(emitter, eventName) API is deprecated. Please use emitter.listenerCount(eventName) instead.
DEP0034: fs.exists(path, callback)
#
History













Type: Documentation-only
The fs.exists(path, callback) API is deprecated. Please use fs.stat() or fs.access() instead.
DEP0035: fs.lchmod(path, mode, callback)
#
History













Type: Documentation-only
The fs.lchmod(path, mode, callback) API is deprecated.
DEP0036: fs.lchmodSync(path, mode)
#
History













Type: Documentation-only
The fs.lchmodSync(path, mode) API is deprecated.
DEP0037: fs.lchown(path, uid, gid, callback)
#
History

















Type: Deprecation revoked
The fs.lchown(path, uid, gid, callback) API was deprecated. The deprecation was revoked because the requisite supporting APIs were added in libuv.
DEP0038: fs.lchownSync(path, uid, gid)
#
History

















Type: Deprecation revoked
The fs.lchownSync(path, uid, gid) API was deprecated. The deprecation was revoked because the requisite supporting APIs were added in libuv.
DEP0039: require.extensions
#
History













Type: Documentation-only
The require.extensions property is deprecated.
DEP0040: node:punycode module
#
History

















Type: Runtime
The punycode module is deprecated. Please use a userland alternative instead.
DEP0041: NODE_REPL_HISTORY_FILE environment variable
#
History

















Type: End-of-Life
The NODE_REPL_HISTORY_FILE environment variable was removed. Please use NODE_REPL_HISTORY instead.
DEP0042: tls.CryptoStream
#
History

















Type: End-of-Life
The tls.CryptoStream class was removed. Please use tls.TLSSocket instead.
DEP0043: tls.SecurePair
#
History





























Type: End-of-Life
The tls.SecurePair class is deprecated. Please use tls.TLSSocket instead.
DEP0044: util.isArray()
#
History

















Type: Runtime
The util.isArray() API is deprecated. Please use Array.isArray() instead.
DEP0045: util.isBoolean()
#
History





















Type: End-of-Life
The util.isBoolean() API has been removed. Please use typeof arg === 'boolean' instead.
DEP0046: util.isBuffer()
#
History





















Type: End-of-Life
The util.isBuffer() API has been removed. Please use Buffer.isBuffer() instead.
DEP0047: util.isDate()
#
History





















Type: End-of-Life
The util.isDate() API has been removed. Please use arg instanceof Date instead.
DEP0048: util.isError()
#
History





















Type: End-of-Life
The util.isError() API has been removed. Please use Object.prototype.toString(arg) === '[object Error]' || arg instanceof Error instead.
DEP0049: util.isFunction()
#
History





















Type: End-of-Life
The util.isFunction() API has been removed. Please use typeof arg === 'function' instead.
DEP0050: util.isNull()
#
History





















Type: End-of-Life
The util.isNull() API has been removed. Please use arg === null instead.
DEP0051: util.isNullOrUndefined()
#
History





















Type: End-of-Life
The util.isNullOrUndefined() API has been removed. Please use arg === null || arg === undefined instead.
DEP0052: util.isNumber()
#
History





















Type: End-of-Life
The util.isNumber() API has been removed. Please use typeof arg === 'number' instead.
DEP0053: util.isObject()
#
History





















Type: End-of-Life
The util.isObject() API has been removed. Please use arg && typeof arg === 'object' instead.
DEP0054: util.isPrimitive()
#
History





















Type: End-of-Life
The util.isPrimitive() API has been removed. Please use arg === null || (typeof arg !=='object' && typeof arg !== 'function') instead.
DEP0055: util.isRegExp()
#
History





















Type: End-of-Life
The util.isRegExp() API has been removed. Please use arg instanceof RegExp instead.
DEP0056: util.isString()
#
History





















Type: End-of-Life
The util.isString() API has been removed. Please use typeof arg === 'string' instead.
DEP0057: util.isSymbol()
#
History





















Type: End-of-Life
The util.isSymbol() API has been removed. Please use typeof arg === 'symbol' instead.
DEP0058: util.isUndefined()
#
History





















Type: End-of-Life
The util.isUndefined() API has been removed. Please use arg === undefined instead.
DEP0059: util.log()
#
History





















Type: End-of-Life
The util.log() API has been removed because it's an unmaintained legacy API that was exposed to user land by accident. Instead, consider the following alternatives based on your specific needs:
Third-Party Logging Libraries
Use console.log(new Date().toLocaleString(), message)
By adopting one of these alternatives, you can transition away from util.log() and choose a logging strategy that aligns with the specific requirements and complexity of your application.
DEP0060: util._extend()
#
History

















Type: Runtime
The util._extend() API is deprecated because it's an unmaintained legacy API that was exposed to user land by accident. Please use target = Object.assign(target, source) instead.
DEP0061: fs.SyncWriteStream
#
History

















Type: End-of-Life
The fs.SyncWriteStream class was never intended to be a publicly accessible API and has been removed. No alternative API is available. Please use a userland alternative.
DEP0062: node --debug
#
History













Type: End-of-Life
--debug activates the legacy V8 debugger interface, which was removed as of V8 5.8. It is replaced by Inspector which is activated with --inspect instead.
DEP0063: ServerResponse.prototype.writeHeader()
#
History









Type: Documentation-only
The node:http module ServerResponse.prototype.writeHeader() API is deprecated. Please use ServerResponse.prototype.writeHead() instead.
The ServerResponse.prototype.writeHeader() method was never documented as an officially supported API.
DEP0064: tls.createSecurePair()
#
History





























Type: End-of-Life
The tls.createSecurePair() API was deprecated in documentation in Node.js 0.11.3. Users should use tls.Socket instead.
DEP0065: repl.REPL_MODE_MAGIC and NODE_REPL_MODE=magic
#
History













Type: End-of-Life
The node:repl module's REPL_MODE_MAGIC constant, used for replMode option, has been removed. Its behavior has been functionally identical to that of REPL_MODE_SLOPPY since Node.js 6.0.0, when V8 5.0 was imported. Please use REPL_MODE_SLOPPY instead.
The NODE_REPL_MODE environment variable is used to set the underlying replMode of an interactive node session. Its value, magic, is also removed. Please use sloppy instead.
DEP0066: OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames
#
History

















Type: End-of-Life
The node:http module OutgoingMessage.prototype._headers and OutgoingMessage.prototype._headerNames properties are deprecated. Use one of the public methods (e.g. OutgoingMessage.prototype.getHeader(), OutgoingMessage.prototype.getHeaders(), OutgoingMessage.prototype.getHeaderNames(), OutgoingMessage.prototype.getRawHeaderNames(), OutgoingMessage.prototype.hasHeader(), OutgoingMessage.prototype.removeHeader(), OutgoingMessage.prototype.setHeader()) for working with outgoing headers.
The OutgoingMessage.prototype._headers and OutgoingMessage.prototype._headerNames properties were never documented as officially supported properties.
DEP0067: OutgoingMessage.prototype._renderHeaders
#
History









Type: Documentation-only
The node:http module OutgoingMessage.prototype._renderHeaders() API is deprecated.
The OutgoingMessage.prototype._renderHeaders property was never documented as an officially supported API.
DEP0068: node debug
#
History













Type: End-of-Life
node debug corresponds to the legacy CLI debugger which has been replaced with a V8-inspector based CLI debugger available through node inspect.
DEP0069: vm.runInDebugContext(string)
#
History

















Type: End-of-Life
DebugContext has been removed in V8 and is not available in Node.js 10+.
DebugContext was an experimental API.
DEP0070: async_hooks.currentId()
#
History













Type: End-of-Life
async_hooks.currentId() was renamed to async_hooks.executionAsyncId() for clarity.
This change was made while async_hooks was an experimental API.
DEP0071: async_hooks.triggerId()
#
History













Type: End-of-Life
async_hooks.triggerId() was renamed to async_hooks.triggerAsyncId() for clarity.
This change was made while async_hooks was an experimental API.
DEP0072: async_hooks.AsyncResource.triggerId()
#
History













Type: End-of-Life
async_hooks.AsyncResource.triggerId() was renamed to async_hooks.AsyncResource.triggerAsyncId() for clarity.
This change was made while async_hooks was an experimental API.
DEP0073: Several internal properties of net.Server
#
History













Type: End-of-Life
Accessing several internal, undocumented properties of net.Server instances with inappropriate names is deprecated.
As the original API was undocumented and not generally useful for non-internal code, no replacement API is provided.
DEP0074: REPLServer.bufferedCommand
#
History













Type: End-of-Life
The REPLServer.bufferedCommand property was deprecated in favor of REPLServer.clearBufferedCommand().
DEP0075: REPLServer.parseREPLKeyword()
#
History













Type: End-of-Life
REPLServer.parseREPLKeyword() was removed from userland visibility.
DEP0076: tls.parseCertString()
#
History

















Type: End-of-Life
tls.parseCertString() was a trivial parsing helper that was made public by mistake. While it was supposed to parse certificate subject and issuer strings, it never handled multi-value Relative Distinguished Names correctly.
Earlier versions of this document suggested using querystring.parse() as an alternative to tls.parseCertString(). However, querystring.parse() also does not handle all certificate subjects correctly and should not be used.
DEP0077: Module._debug()
#
History









Type: Runtime
Module._debug() is deprecated.
The Module._debug() function was never documented as an officially supported API.
DEP0078: REPLServer.turnOffEditorMode()
#
History













Type: End-of-Life
REPLServer.turnOffEditorMode() was removed from userland visibility.
DEP0079: Custom inspection function on objects via .inspect()
#
History

















Type: End-of-Life
Using a property named inspect on an object to specify a custom inspection function for util.inspect() is deprecated. Use util.inspect.custom instead. For backward compatibility with Node.js prior to version 6.4.0, both can be specified.
DEP0080: path._makeLong()
#
History









Type: Documentation-only
The internal path._makeLong() was not intended for public use. However, userland modules have found it useful. The internal API is deprecated and replaced with an identical, public path.toNamespacedPath() method.
DEP0081: fs.truncate() using a file descriptor
#
History













Type: End-of-Life
fs.truncate() fs.truncateSync() usage with a file descriptor is deprecated. Please use fs.ftruncate() or fs.ftruncateSync() to work with file descriptors.
DEP0082: REPLServer.prototype.memory()
#
History













Type: End-of-Life
REPLServer.prototype.memory() is only necessary for the internal mechanics of the REPLServer itself. Do not use this function.
DEP0083: Disabling ECDH by setting ecdhCurve to false
#
History













Type: End-of-Life
The ecdhCurve option to tls.createSecureContext() and tls.TLSSocket could be set to false to disable ECDH entirely on the server only. This mode was deprecated in preparation for migrating to OpenSSL 1.1.0 and consistency with the client and is now unsupported. Use the ciphers parameter instead.
DEP0084: requiring bundled internal dependencies
#
History













Type: End-of-Life
Since Node.js versions 4.4.0 and 5.2.0, several modules only intended for internal usage were mistakenly exposed to user code through require(). These modules were:
v8/tools/codemap
v8/tools/consarray
v8/tools/csvparser
v8/tools/logreader
v8/tools/profile_view
v8/tools/profile
v8/tools/SourceMap
v8/tools/splaytree
v8/tools/tickprocessor-driver
v8/tools/tickprocessor
node-inspect/lib/_inspect (from 7.6.0)
node-inspect/lib/internal/inspect_client (from 7.6.0)
node-inspect/lib/internal/inspect_repl (from 7.6.0)
The v8/* modules do not have any exports, and if not imported in a specific order would in fact throw errors. As such there are virtually no legitimate use cases for importing them through require().
On the other hand, node-inspect can be installed locally through a package manager, as it is published on the npm registry under the same name. No source code modification is necessary if that is done.
DEP0085: AsyncHooks sensitive API
#
History













Type: End-of-Life
The AsyncHooks sensitive API was never documented and had various minor issues. Use the AsyncResource API instead. See https://github.com/nodejs/node/issues/15572.
DEP0086: Remove runInAsyncIdScope
#
History













Type: End-of-Life
runInAsyncIdScope doesn't emit the 'before' or 'after' event and can thus cause a lot of issues. See https://github.com/nodejs/node/issues/14328.
DEP0089: require('node:assert')
#
History













Type: Deprecation revoked
Importing assert directly was not recommended as the exposed functions use loose equality checks. The deprecation was revoked because use of the node:assert module is not discouraged, and the deprecation caused developer confusion.
DEP0090: Invalid GCM authentication tag lengths
#
History













Type: End-of-Life
Node.js used to support all GCM authentication tag lengths which are accepted by OpenSSL when calling decipher.setAuthTag(). Beginning with Node.js v11.0.0, only authentication tag lengths of 128, 120, 112, 104, 96, 64, and 32 bits are allowed. Authentication tags of other lengths are invalid per NIST SP 800-38D.
DEP0091: crypto.DEFAULT_ENCODING
#
History













Type: End-of-Life
The crypto.DEFAULT_ENCODING property only existed for compatibility with Node.js releases prior to versions 0.9.3 and has been removed.
DEP0092: Top-level this bound to module.exports
#
History









Type: Documentation-only
Assigning properties to the top-level this as an alternative to module.exports is deprecated. Developers should use exports or module.exports instead.
DEP0093: crypto.fips is deprecated and replaced
#
History













Type: Runtime
The crypto.fips property is deprecated. Please use crypto.setFips() and crypto.getFips() instead.
DEP0094: Using assert.fail() with more than one argument
#
History









Type: Runtime
Using assert.fail() with more than one argument is deprecated. Use assert.fail() with only one argument or use a different node:assert module method.
DEP0095: timers.enroll()
#
History













Type: End-of-Life
timers.enroll() has been removed. Please use the publicly documented setTimeout() or setInterval() instead.
DEP0096: timers.unenroll()
#
History













Type: End-of-Life
timers.unenroll() has been removed. Please use the publicly documented clearTimeout() or clearInterval() instead.
DEP0097: MakeCallback with domain property
#
History









Type: Runtime
Users of MakeCallback that add the domain property to carry context, should start using the async_context variant of MakeCallback or CallbackScope, or the high-level AsyncResource class.
DEP0098: AsyncHooks embedder AsyncResource.emitBefore and AsyncResource.emitAfter APIs
#
History













Type: End-of-Life
The embedded API provided by AsyncHooks exposes .emitBefore() and .emitAfter() methods which are very easy to use incorrectly which can lead to unrecoverable errors.
Use asyncResource.runInAsyncScope() API instead which provides a much safer, and more convenient, alternative. See https://github.com/nodejs/node/pull/18513.
DEP0099: Async context-unaware node::MakeCallback C++ APIs
#
History









Type: Compile-time
Certain versions of node::MakeCallback APIs available to native addons are deprecated. Please use the versions of the API that accept an async_context parameter.
DEP0100: process.assert()
#
History

















Type: End-of-Life
process.assert() is deprecated. Please use the assert module instead.
This was never a documented feature.
DEP0101: --with-lttng
#
History









Type: End-of-Life
The --with-lttng compile-time option has been removed.
DEP0102: Using noAssert in Buffer#(read|write) operations
#
History









Type: End-of-Life
Using the noAssert argument has no functionality anymore. All input is verified regardless of the value of noAssert. Skipping the verification could lead to hard-to-find errors and crashes.
DEP0103: process.binding('util').is[...] typechecks
#
History













Type: Documentation-only (supports --pending-deprecation)
Using process.binding() in general should be avoided. The type checking methods in particular can be replaced by using util.types.
This deprecation has been superseded by the deprecation of the process.binding() API (DEP0111).
DEP0104: process.env string coercion
#
History









Type: Documentation-only (supports --pending-deprecation)
When assigning a non-string property to process.env, the assigned value is implicitly converted to a string. This behavior is deprecated if the assigned value is not a string, boolean, or number. In the future, such assignment might result in a thrown error. Please convert the property to a string before assigning it to process.env.
DEP0105: decipher.finaltol
#
History













Type: End-of-Life
decipher.finaltol() has never been documented and was an alias for decipher.final(). This API has been removed, and it is recommended to use decipher.final() instead.
DEP0106: crypto.createCipher and crypto.createDecipher
#
History

















Type: End-of-Life
crypto.createCipher() and crypto.createDecipher() have been removed as they use a weak key derivation function (MD5 with no salt) and static initialization vectors. It is recommended to derive a key using crypto.pbkdf2() or crypto.scrypt() with random salts and to use crypto.createCipheriv() and crypto.createDecipheriv() to obtain the Cipheriv and Decipheriv objects respectively.
DEP0107: tls.convertNPNProtocols()
#
History













Type: End-of-Life
This was an undocumented helper function not intended for use outside Node.js core and obsoleted by the removal of NPN (Next Protocol Negotiation) support.
DEP0108: zlib.bytesRead
#
History

















Type: End-of-Life
Deprecated alias for zlib.bytesWritten. This original name was chosen because it also made sense to interpret the value as the number of bytes read by the engine, but is inconsistent with other streams in Node.js that expose values under these names.
DEP0109: http, https, and tls support for invalid URLs
#
History













Type: End-of-Life
Some previously supported (but strictly invalid) URLs were accepted through the http.request(), http.get(), https.request(), https.get(), and tls.checkServerIdentity() APIs because those were accepted by the legacy url.parse() API. The mentioned APIs now use the WHATWG URL parser that requires strictly valid URLs. Passing an invalid URL is deprecated and support will be removed in the future.
DEP0110: vm.Script cached data
#
History









Type: Documentation-only
The produceCachedData option is deprecated. Use script.createCachedData() instead.
DEP0111: process.binding()
#
History













Type: Documentation-only (supports --pending-deprecation)
process.binding() is for use by Node.js internal code only.
While process.binding() has not reached End-of-Life status in general, it is unavailable when the permission model is enabled.
DEP0112: dgram private APIs
#
History









Type: Runtime
The node:dgram module previously contained several APIs that were never meant to accessed outside of Node.js core: Socket.prototype._handle, Socket.prototype._receiving, Socket.prototype._bindState, Socket.prototype._queue, Socket.prototype._reuseAddr, Socket.prototype._healthCheck(), Socket.prototype._stopReceiving(), and dgram._createSocketHandle().
DEP0113: Cipher.setAuthTag(), Decipher.getAuthTag()
#
History













Type: End-of-Life
Cipher.setAuthTag() and Decipher.getAuthTag() are no longer available. They were never documented and would throw when called.
DEP0114: crypto._toBuf()
#
History













Type: End-of-Life
The crypto._toBuf() function was not designed to be used by modules outside of Node.js core and was removed.
DEP0115: crypto.prng(), crypto.pseudoRandomBytes(), crypto.rng()
#
History









Type: Documentation-only (supports --pending-deprecation)
In recent versions of Node.js, there is no difference between crypto.randomBytes() and crypto.pseudoRandomBytes(). The latter is deprecated along with the undocumented aliases crypto.prng() and crypto.rng() in favor of crypto.randomBytes() and might be removed in a future release.
DEP0116: Legacy URL API
#
History

















Type: Deprecation revoked
The legacy URL API is deprecated. This includes url.format(), url.parse(), url.resolve(), and the legacy urlObject. Please use the WHATWG URL API instead.
DEP0117: Native crypto handles
#
History













Type: End-of-Life
Previous versions of Node.js exposed handles to internal native objects through the _handle property of the Cipher, Decipher, DiffieHellman, DiffieHellmanGroup, ECDH, Hash, Hmac, Sign, and Verify classes. The _handle property has been removed because improper use of the native object can lead to crashing the application.
DEP0118: dns.lookup() support for a falsy host name
#
History









Type: Runtime
Previous versions of Node.js supported dns.lookup() with a falsy host name like dns.lookup(false) due to backward compatibility. This behavior is undocumented and is thought to be unused in real world apps. It will become an error in future versions of Node.js.
DEP0119: process.binding('uv').errname() private API
#
History









Type: Documentation-only (supports --pending-deprecation)
process.binding('uv').errname() is deprecated. Please use util.getSystemErrorName() instead.
DEP0120: Windows Performance Counter support
#
History













Type: End-of-Life
Windows Performance Counter support has been removed from Node.js. The undocumented COUNTER_NET_SERVER_CONNECTION(), COUNTER_NET_SERVER_CONNECTION_CLOSE(), COUNTER_HTTP_SERVER_REQUEST(), COUNTER_HTTP_SERVER_RESPONSE(), COUNTER_HTTP_CLIENT_REQUEST(), and COUNTER_HTTP_CLIENT_RESPONSE() functions have been deprecated.
DEP0121: net._setSimultaneousAccepts()
#
History













Type: End-of-Life
The undocumented net._setSimultaneousAccepts() function was originally intended for debugging and performance tuning when using the node:child_process and node:cluster modules on Windows. The function is not generally useful and is being removed. See discussion here: https://github.com/nodejs/node/issues/18391
DEP0122: tls Server.prototype.setOptions()
#
History













Type: End-of-Life
Please use Server.prototype.setSecureContext() instead.
DEP0123: setting the TLS ServerName to an IP address
#
History









Type: Runtime
Setting the TLS ServerName to an IP address is not permitted by RFC 6066. This will be ignored in a future version.
DEP0124: using REPLServer.rli
#
History













Type: End-of-Life
This property is a reference to the instance itself.
DEP0125: require('node:_stream_wrap')
#
History









Type: Runtime
The node:_stream_wrap module is deprecated.
DEP0126: timers.active()
#
History













Type: End-of-Life
The previously undocumented timers.active() has been removed. Please use the publicly documented timeout.refresh() instead. If re-referencing the timeout is necessary, timeout.ref() can be used with no performance impact since Node.js 10.
DEP0127: timers._unrefActive()
#
History













Type: End-of-Life
The previously undocumented and "private" timers._unrefActive() has been removed. Please use the publicly documented timeout.refresh() instead. If unreferencing the timeout is necessary, timeout.unref() can be used with no performance impact since Node.js 10.
DEP0128: modules with an invalid main entry and an index.js file
#
History













Type: Runtime
Modules that have an invalid main entry (e.g., ./does-not-exist.js) and also have an index.js file in the top level directory will resolve the index.js file. That is deprecated and is going to throw an error in future Node.js versions.
DEP0129: ChildProcess._channel
#
History













Type: Runtime
The _channel property of child process objects returned by spawn() and similar functions is not intended for public use. Use ChildProcess.channel instead.
DEP0130: Module.createRequireFromPath()
#
History

















Type: End-of-Life
Use module.createRequire() instead.
DEP0131: Legacy HTTP parser
#
History

















Type: End-of-Life
The legacy HTTP parser, used by default in versions of Node.js prior to 12.0.0, is deprecated and has been removed in v13.0.0. Prior to v13.0.0, the --http-parser=legacy command-line flag could be used to revert to using the legacy parser.
DEP0132: worker.terminate() with callback
#
History









Type: Runtime
Passing a callback to worker.terminate() is deprecated. Use the returned Promise instead, or a listener to the worker's 'exit' event.
DEP0133: http connection
#
History









Type: Documentation-only
Prefer response.socket over response.connection and request.socket over request.connection.
DEP0134: process._tickCallback
#
History









Type: Documentation-only (supports --pending-deprecation)
The process._tickCallback property was never documented as an officially supported API.
DEP0135: WriteStream.open() and ReadStream.open() are internal
#
History









Type: Runtime
WriteStream.open() and ReadStream.open() are undocumented internal APIs that do not make sense to use in userland. File streams should always be opened through their corresponding factory methods fs.createWriteStream() and fs.createReadStream()) or by passing a file descriptor in options.
DEP0136: http finished
#
History









Type: Documentation-only
response.finished indicates whether response.end() has been called, not whether 'finish' has been emitted and the underlying data is flushed.
Use response.writableFinished or response.writableEnded accordingly instead to avoid the ambiguity.
To maintain existing behavior response.finished should be replaced with response.writableEnded.
DEP0137: Closing fs.FileHandle on garbage collection
#
History









Type: Runtime
Allowing a fs.FileHandle object to be closed on garbage collection is deprecated. In the future, doing so might result in a thrown error that will terminate the process.
Please ensure that all fs.FileHandle objects are explicitly closed using FileHandle.prototype.close() when the fs.FileHandle is no longer needed:
const fsPromises = require('node:fs').promises;
async function openAndClose() {
  let filehandle;
  try {
    filehandle = await fsPromises.open('thefile.txt', 'r');
  } finally {
    if (filehandle !== undefined)
      await filehandle.close();
  }
}
copy
DEP0138: process.mainModule
#
History









Type: Documentation-only
process.mainModule is a CommonJS-only feature while process global object is shared with non-CommonJS environment. Its use within ECMAScript modules is unsupported.
It is deprecated in favor of require.main, because it serves the same purpose and is only available on CommonJS environment.
DEP0139: process.umask() with no arguments
#
History









Type: Documentation-only
Calling process.umask() with no argument causes the process-wide umask to be written twice. This introduces a race condition between threads, and is a potential security vulnerability. There is no safe, cross-platform alternative API.
DEP0140: Use request.destroy() instead of request.abort()
#
History









Type: Documentation-only
Use request.destroy() instead of request.abort().
DEP0141: repl.inputStream and repl.outputStream
#
History









Type: Documentation-only (supports --pending-deprecation)
The node:repl module exported the input and output stream twice. Use .input instead of .inputStream and .output instead of .outputStream.
DEP0142: repl._builtinLibs
#
History









Type: Documentation-only (supports --pending-deprecation)
The node:repl module exports a _builtinLibs property that contains an array of built-in modules. It was incomplete so far and instead it's better to rely upon require('node:module').builtinModules.
DEP0143: Transform._transformState
#
History













Type: End-of-Life
Transform._transformState will be removed in future versions where it is no longer required due to simplification of the implementation.
DEP0144: module.parent
#
History









Type: Documentation-only (supports --pending-deprecation)
A CommonJS module can access the first module that required it using module.parent. This feature is deprecated because it does not work consistently in the presence of ECMAScript modules and because it gives an inaccurate representation of the CommonJS module graph.
Some modules use it to check if they are the entry point of the current process. Instead, it is recommended to compare require.main and module:
if (require.main === module) {
  // Code section that will run only if current file is the entry point.
}
copy
When looking for the CommonJS modules that have required the current one, require.cache and module.children can be used:
const moduleParents = Object.values(require.cache)
  .filter((m) => m.children.includes(module));
copy
DEP0145: socket.bufferSize
#
History









Type: Documentation-only
socket.bufferSize is just an alias for writable.writableLength.
DEP0146: new crypto.Certificate()
#
History









Type: Documentation-only
The crypto.Certificate() constructor is deprecated. Use static methods of crypto.Certificate() instead.
DEP0147: fs.rmdir(path, { recursive: true })
#
History

















Type: Runtime
In future versions of Node.js, recursive option will be ignored for fs.rmdir, fs.rmdirSync, and fs.promises.rmdir.
Use fs.rm(path, { recursive: true, force: true }), fs.rmSync(path, { recursive: true, force: true }) or fs.promises.rm(path, { recursive: true, force: true }) instead.
DEP0148: Folder mappings in "exports" (trailing "/")
#
History





















Type: End-of-Life
Using a trailing "/" to define subpath folder mappings in the subpath exports or subpath imports fields is no longer supported. Use subpath patterns instead.
DEP0149: http.IncomingMessage#connection
#
History









Type: Documentation-only
Prefer message.socket over message.connection.
DEP0150: Changing the value of process.config
#
History













Type: End-of-Life
The process.config property provides access to Node.js compile-time settings. However, the property is mutable and therefore subject to tampering. The ability to change the value will be removed in a future version of Node.js.
DEP0151: Main index lookup and extension searching
#
History













Type: Runtime
Previously, index.js and extension searching lookups would apply to import 'pkg' main entry point resolution, even when resolving ES modules.
With this deprecation, all ES module main entry point resolutions require an explicit "exports" or "main" entry with the exact file extension.
DEP0152: Extension PerformanceEntry properties
#
History









Type: Runtime
The 'gc', 'http2', and 'http' <PerformanceEntry> object types have additional properties assigned to them that provide additional information. These properties are now available within the standard detail property of the PerformanceEntry object. The existing accessors have been deprecated and should no longer be used.
DEP0153: dns.lookup and dnsPromises.lookup options type coercion
#
History

















Type: End-of-Life
Using a non-nullish non-integer value for family option, a non-nullish non-number value for hints option, a non-nullish non-boolean value for all option, or a non-nullish non-boolean value for verbatim option in dns.lookup() and dnsPromises.lookup() throws an ERR_INVALID_ARG_TYPE error.
DEP0154: RSA-PSS generate key pair options
#
History













Type: Runtime
The 'hash' and 'mgf1Hash' options are replaced with 'hashAlgorithm' and 'mgf1HashAlgorithm'.
DEP0155: Trailing slashes in pattern specifier resolutions
#
History













Type: Runtime
The remapping of specifiers ending in "/" like import 'pkg/x/' is deprecated for package "exports" and "imports" pattern resolutions.
DEP0156: .aborted property and 'abort', 'aborted' event in http
#
History









Type: Documentation-only
Move to <Stream> API instead, as the http.ClientRequest, http.ServerResponse, and http.IncomingMessage are all stream-based. Check stream.destroyed instead of the .aborted property, and listen for 'close' instead of 'abort', 'aborted' event.
The .aborted property and 'abort' event are only useful for detecting .abort() calls. For closing a request early, use the Stream .destroy([error]) then check the .destroyed property and 'close' event should have the same effect. The receiving end should also check the readable.readableEnded value on http.IncomingMessage to get whether it was an aborted or graceful destroy.
DEP0157: Thenable support in streams
#
History













Type: End-of-Life
An undocumented feature of Node.js streams was to support thenables in implementation methods. This is now deprecated, use callbacks instead and avoid use of async function for streams implementation methods.
This feature caused users to encounter unexpected problems where the user implements the function in callback style but uses e.g. an async method which would cause an error since mixing promise and callback semantics is not valid.
const w = new Writable({
  async final(callback) {
    await someOp();
    callback();
  },
});
copy
DEP0158: buffer.slice(start, end)
#
History









Type: Documentation-only
This method was deprecated because it is not compatible with Uint8Array.prototype.slice(), which is a superclass of Buffer.
Use buffer.subarray which does the same thing instead.
DEP0159: ERR_INVALID_CALLBACK
#
History









Type: End-of-Life
This error code was removed due to adding more confusion to the errors used for value type validation.
DEP0160: process.on('multipleResolves', handler)
#
History













Type: Runtime
This event was deprecated because it did not work with V8 promise combinators which diminished its usefulness.
DEP0161: process._getActiveRequests() and process._getActiveHandles()
#
History









Type: Documentation-only
The process._getActiveHandles() and process._getActiveRequests() functions are not intended for public use and can be removed in future releases.
Use process.getActiveResourcesInfo() to get a list of types of active resources and not the actual references.
DEP0162: fs.write(), fs.writeFileSync() coercion to string
#
History

















Type: End-of-Life
Implicit coercion of objects with own toString property, passed as second parameter in fs.write(), fs.writeFile(), fs.appendFile(), fs.writeFileSync(), and fs.appendFileSync() is deprecated. Convert them to primitive strings.
DEP0163: channel.subscribe(onMessage), channel.unsubscribe(onMessage)
#
History









Type: Documentation-only
These methods were deprecated because they can be used in a way which does not hold the channel reference alive long enough to receive the events.
Use diagnostics_channel.subscribe(name, onMessage) or diagnostics_channel.unsubscribe(name, onMessage) which does the same thing instead.
DEP0164: process.exit(code), process.exitCode coercion to integer
#
History





















Type: End-of-Life
Values other than undefined, null, integer numbers, and integer strings (e.g., '1') are deprecated as value for the code parameter in process.exit() and as value to assign to process.exitCode.
DEP0165: --trace-atomics-wait
#
History

















Type: End-of-Life
The --trace-atomics-wait flag has been removed because it uses the V8 hook SetAtomicsWaitCallback, that will be removed in a future V8 release.
DEP0166: Double slashes in imports and exports targets
#
History













Type: Runtime
Package imports and exports targets mapping into paths including a double slash (of "/" or "\") are deprecated and will fail with a resolution validation error in a future release. This same deprecation also applies to pattern matches starting or ending in a slash.
DEP0167: Weak DiffieHellmanGroup instances (modp1, modp2, modp5)
#
History









Type: Documentation-only
The well-known MODP groups modp1, modp2, and modp5 are deprecated because they are not secure against practical attacks. See RFC 8247 Section 2.4 for details.
These groups might be removed in future versions of Node.js. Applications that rely on these groups should evaluate using stronger MODP groups instead.
DEP0168: Unhandled exception in Node-API callbacks
#
History









Type: Runtime
The implicit suppression of uncaught exceptions in Node-API callbacks is now deprecated.
Set the flag --force-node-api-uncaught-exceptions-policy to force Node.js to emit an 'uncaughtException' event if the exception is not handled in Node-API callbacks.
DEP0169: Insecure url.parse()
#
History

















Type: Application (non-node_modules code only)
url.parse() behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for url.parse() vulnerabilities.
DEP0170: Invalid port when using url.parse()
#
History













Type: Runtime
url.parse() accepts URLs with ports that are not numbers. This behavior might result in host name spoofing with unexpected input. These URLs will throw an error in future versions of Node.js, as the WHATWG URL API does already.
DEP0171: Setters for http.IncomingMessage headers and trailers
#
History









Type: Documentation-only
In a future version of Node.js, message.headers, message.headersDistinct, message.trailers, and message.trailersDistinct will be read-only.
DEP0172: The asyncResource property of AsyncResource bound functions
#
History









Type: Runtime
In a future version of Node.js, the asyncResource property will no longer be added when a function is bound to an AsyncResource.
DEP0173: the assert.CallTracker class
#
History









Type: Runtime
In a future version of Node.js, assert.CallTracker, will be removed. Consider using alternatives such as the mock helper function.
DEP0174: calling promisify on a function that returns a Promise
#
History













Type: Runtime
Calling util.promisify on a function that returns a Promise will ignore the result of said promise, which can lead to unhandled promise rejections.
DEP0175: util.toUSVString
#
History









Type: Documentation-only
The util.toUSVString() API is deprecated. Please use String.prototype.toWellFormed instead.
DEP0176: fs.F_OK, fs.R_OK, fs.W_OK, fs.X_OK
#
History













Type: Runtime
F_OK, R_OK, W_OK and X_OK getters exposed directly on node:fs are deprecated. Get them from fs.constants or fs.promises.constants instead.
DEP0177: util.types.isWebAssemblyCompiledModule
#
History

















Type: End-of-Life
The util.types.isWebAssemblyCompiledModule API has been removed. Please use value instanceof WebAssembly.Module instead.
DEP0178: dirent.path
#
History

















Type: End-of-Life
The dirent.path property has been removed due to its lack of consistency across release lines. Please use dirent.parentPath instead.
DEP0179: Hash constructor
#
History













Type: Runtime
Calling Hash class directly with Hash() or new Hash() is deprecated due to being internals, not intended for public use. Please use the crypto.createHash() method to create Hash instances.
DEP0180: fs.Stats constructor
#
History













Type: Runtime
Calling fs.Stats class directly with Stats() or new Stats() is deprecated due to being internals, not intended for public use.
DEP0181: Hmac constructor
#
History













Type: Runtime
Calling Hmac class directly with Hmac() or new Hmac() is deprecated due to being internals, not intended for public use. Please use the crypto.createHmac() method to create Hmac instances.
DEP0182: Short GCM authentication tags without explicit authTagLength
#
History













Type: Runtime
Applications that intend to use authentication tags that are shorter than the default authentication tag length must set the authTagLength option of the crypto.createDecipheriv() function to the appropriate length.
For ciphers in GCM mode, the decipher.setAuthTag() function accepts authentication tags of any valid length (see DEP0090). This behavior is deprecated to better align with recommendations per NIST SP 800-38D.
DEP0183: OpenSSL engine-based APIs
#
History









Type: Documentation-only
OpenSSL 3 has deprecated support for custom engines with a recommendation to switch to its new provider model. The clientCertEngine option for https.request(), tls.createSecureContext(), and tls.createServer(); the privateKeyEngine and privateKeyIdentifier for tls.createSecureContext(); and crypto.setEngine() all depend on this functionality from OpenSSL.
DEP0184: Instantiating node:zlib classes without new
#
History













Type: Runtime
Instantiating classes without the new qualifier exported by the node:zlib module is deprecated. It is recommended to use the new qualifier instead. This applies to all Zlib classes, such as Deflate, DeflateRaw, Gunzip, Inflate, InflateRaw, Unzip, and Zlib.
DEP0185: Instantiating node:repl classes without new
#
History













Type: Runtime
Instantiating classes without the new qualifier exported by the node:repl module is deprecated. It is recommended to use the new qualifier instead. This applies to all REPL classes, including REPLServer and Recoverable.
DEP0187: Passing invalid argument types to fs.existsSync
#
History













Type: Runtime
Passing non-supported argument types is deprecated and, instead of returning false, will throw an error in a future version.
DEP0188: process.features.ipv6 and process.features.uv
#
History









Type: Documentation-only
These properties are unconditionally true. Any checks based on these properties are redundant.
DEP0189: process.features.tls_*
#
History









Type: Documentation-only
process.features.tls_alpn, process.features.tls_ocsp, and process.features.tls_sni are deprecated, as their values are guaranteed to be identical to that of process.features.tls.
DEP0190: Passing args to node:child_process execFile/spawn with shell option true
#
History













Type: Runtime
When an args array is passed to child_process.execFile or child_process.spawn with the option { shell: true }, the values are not escaped, only space-separated, which can lead to shell injection.
DEP0191: repl.builtinModules
#
History









Type: Documentation-only (supports --pending-deprecation)
The node:repl module exports a builtinModules property that contains an array of built-in modules. This was incomplete and matched the already deprecated repl._builtinLibs (DEP0142) instead it's better to rely upon require('node:module').builtinModules.
DEP0192: require('node:_tls_common') and require('node:_tls_wrap')
#
History









Type: Documentation-only
The node:_tls_common and node:_tls_wrap modules are deprecated as they should be considered an internal nodejs implementation rather than a public facing API, use node:tls instead.
DEP0193: require('node:_stream_*')
#
History









Type: Documentation-only
The node:_stream_duplex, node:_stream_passthrough, node:_stream_readable, node:_stream_transform, node:_stream_wrap and node:_stream_writable modules are deprecated as they should be considered an internal nodejs implementation rather than a public facing API, use node:stream instead.
DEP0194: HTTP/2 priority signaling
#
History













Type: End-of-Life
The support for priority signaling has been removed following its deprecation in the RFC 9113.
DEP0195: Instantiating node:http classes without new
#
History









Type: Documentation-only
Instantiating classes without the new qualifier exported by the node:http module is deprecated. It is recommended to use the new qualifier instead. This applies to all http classes, such as OutgoingMessage, IncomingMessage, ServerResponse and ClientRequest.
DEP0196: Calling node:child_process functions with options.shell as an empty string
#
History









Type: Documentation-only
Calling the process-spawning functions with { shell: '' } is almost certainly unintentional, and can cause aberrant behavior.
To make child_process.execFile or child_process.spawn invoke the default shell, use { shell: true }. If the intention is not to invoke a shell (default behavior), either omit the shell option, or set it to false or a nullish value.
To make child_process.exec invoke the default shell, either omit the shell option, or set it to a nullish value. If the intention is not to invoke a shell, use child_process.execFile instead.
DEP0197: util.types.isNativeError()
#
History









Type: Documentation-only
The util.types.isNativeError API is deprecated. Please use Error.isError instead.
DEP0198: Creating SHAKE-128 and SHAKE-256 digests without an explicit options.outputLength
#
History









Type: Documentation-only (supports --pending-deprecation)
Creating SHAKE-128 and SHAKE-256 digests without an explicit options.outputLength is deprecated.

Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Deprecated APIs
Revoking deprecations
List of deprecated APIs
DEP0001: http.OutgoingMessage.prototype.flush
DEP0002: require('_linklist')
DEP0003: _writableState.buffer
DEP0004: CryptoStream.prototype.readyState
DEP0005: Buffer() constructor
DEP0006: child_process options.customFds
DEP0007: Replace cluster worker.suicide with worker.exitedAfterDisconnect
DEP0008: require('node:constants')
DEP0009: crypto.pbkdf2 without digest
DEP0010: crypto.createCredentials
DEP0011: crypto.Credentials
DEP0012: Domain.dispose
DEP0013: fs asynchronous function without callback
DEP0014: fs.read legacy String interface
DEP0015: fs.readSync legacy String interface
DEP0016: GLOBAL/root
DEP0017: Intl.v8BreakIterator
DEP0018: Unhandled promise rejections
DEP0019: require('.') resolved outside directory
DEP0020: Server.connections
DEP0021: Server.listenFD
DEP0022: os.tmpDir()
DEP0023: os.getNetworkInterfaces()
DEP0024: REPLServer.prototype.convertToContext()
DEP0025: require('node:sys')
DEP0026: util.print()
DEP0027: util.puts()
DEP0028: util.debug()
DEP0029: util.error()
DEP0030: SlowBuffer
DEP0031: ecdh.setPublicKey()
DEP0032: node:domain module
DEP0033: EventEmitter.listenerCount()
DEP0034: fs.exists(path, callback)
DEP0035: fs.lchmod(path, mode, callback)
DEP0036: fs.lchmodSync(path, mode)
DEP0037: fs.lchown(path, uid, gid, callback)
DEP0038: fs.lchownSync(path, uid, gid)
DEP0039: require.extensions
DEP0040: node:punycode module
DEP0041: NODE_REPL_HISTORY_FILE environment variable
DEP0042: tls.CryptoStream
DEP0043: tls.SecurePair
DEP0044: util.isArray()
DEP0045: util.isBoolean()
DEP0046: util.isBuffer()
DEP0047: util.isDate()
DEP0048: util.isError()
DEP0049: util.isFunction()
DEP0050: util.isNull()
DEP0051: util.isNullOrUndefined()
DEP0052: util.isNumber()
DEP0053: util.isObject()
DEP0054: util.isPrimitive()
DEP0055: util.isRegExp()
DEP0056: util.isString()
DEP0057: util.isSymbol()
DEP0058: util.isUndefined()
DEP0059: util.log()
DEP0060: util._extend()
DEP0061: fs.SyncWriteStream
DEP0062: node --debug
DEP0063: ServerResponse.prototype.writeHeader()
DEP0064: tls.createSecurePair()
DEP0065: repl.REPL_MODE_MAGIC and NODE_REPL_MODE=magic
DEP0066: OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames
DEP0067: OutgoingMessage.prototype._renderHeaders
DEP0068: node debug
DEP0069: vm.runInDebugContext(string)
DEP0070: async_hooks.currentId()
DEP0071: async_hooks.triggerId()
DEP0072: async_hooks.AsyncResource.triggerId()
DEP0073: Several internal properties of net.Server
DEP0074: REPLServer.bufferedCommand
DEP0075: REPLServer.parseREPLKeyword()
DEP0076: tls.parseCertString()
DEP0077: Module._debug()
DEP0078: REPLServer.turnOffEditorMode()
DEP0079: Custom inspection function on objects via .inspect()
DEP0080: path._makeLong()
DEP0081: fs.truncate() using a file descriptor
DEP0082: REPLServer.prototype.memory()
DEP0083: Disabling ECDH by setting ecdhCurve to false
DEP0084: requiring bundled internal dependencies
DEP0085: AsyncHooks sensitive API
DEP0086: Remove runInAsyncIdScope
DEP0089: require('node:assert')
DEP0090: Invalid GCM authentication tag lengths
DEP0091: crypto.DEFAULT_ENCODING
DEP0092: Top-level this bound to module.exports
DEP0093: crypto.fips is deprecated and replaced
DEP0094: Using assert.fail() with more than one argument
DEP0095: timers.enroll()
DEP0096: timers.unenroll()
DEP0097: MakeCallback with domain property
DEP0098: AsyncHooks embedder AsyncResource.emitBefore and AsyncResource.emitAfter APIs
DEP0099: Async context-unaware node::MakeCallback C++ APIs
DEP0100: process.assert()
DEP0101: --with-lttng
DEP0102: Using noAssert in Buffer#(read|write) operations
DEP0103: process.binding('util').is[...] typechecks
DEP0104: process.env string coercion
DEP0105: decipher.finaltol
DEP0106: crypto.createCipher and crypto.createDecipher
DEP0107: tls.convertNPNProtocols()
DEP0108: zlib.bytesRead
DEP0109: http, https, and tls support for invalid URLs
DEP0110: vm.Script cached data
DEP0111: process.binding()
DEP0112: dgram private APIs
DEP0113: Cipher.setAuthTag(), Decipher.getAuthTag()
DEP0114: crypto._toBuf()
DEP0115: crypto.prng(), crypto.pseudoRandomBytes(), crypto.rng()
DEP0116: Legacy URL API
DEP0117: Native crypto handles
DEP0118: dns.lookup() support for a falsy host name
DEP0119: process.binding('uv').errname() private API
DEP0120: Windows Performance Counter support
DEP0121: net._setSimultaneousAccepts()
DEP0122: tls Server.prototype.setOptions()
DEP0123: setting the TLS ServerName to an IP address
DEP0124: using REPLServer.rli
DEP0125: require('node:_stream_wrap')
DEP0126: timers.active()
DEP0127: timers._unrefActive()
DEP0128: modules with an invalid main entry and an index.js file
DEP0129: ChildProcess._channel
DEP0130: Module.createRequireFromPath()
DEP0131: Legacy HTTP parser
DEP0132: worker.terminate() with callback
DEP0133: http connection
DEP0134: process._tickCallback
DEP0135: WriteStream.open() and ReadStream.open() are internal
DEP0136: http finished
DEP0137: Closing fs.FileHandle on garbage collection
DEP0138: process.mainModule
DEP0139: process.umask() with no arguments
DEP0140: Use request.destroy() instead of request.abort()
DEP0141: repl.inputStream and repl.outputStream
DEP0142: repl._builtinLibs
DEP0143: Transform._transformState
DEP0144: module.parent
DEP0145: socket.bufferSize
DEP0146: new crypto.Certificate()
DEP0147: fs.rmdir(path, { recursive: true })
DEP0148: Folder mappings in "exports" (trailing "/")
DEP0149: http.IncomingMessage#connection
DEP0150: Changing the value of process.config
DEP0151: Main index lookup and extension searching
DEP0152: Extension PerformanceEntry properties
DEP0153: dns.lookup and dnsPromises.lookup options type coercion
DEP0154: RSA-PSS generate key pair options
DEP0155: Trailing slashes in pattern specifier resolutions
DEP0156: .aborted property and 'abort', 'aborted' event in http
DEP0157: Thenable support in streams
DEP0158: buffer.slice(start, end)
DEP0159: ERR_INVALID_CALLBACK
DEP0160: process.on('multipleResolves', handler)
DEP0161: process._getActiveRequests() and process._getActiveHandles()
DEP0162: fs.write(), fs.writeFileSync() coercion to string
DEP0163: channel.subscribe(onMessage), channel.unsubscribe(onMessage)
DEP0164: process.exit(code), process.exitCode coercion to integer
DEP0165: --trace-atomics-wait
DEP0166: Double slashes in imports and exports targets
DEP0167: Weak DiffieHellmanGroup instances (modp1, modp2, modp5)
DEP0168: Unhandled exception in Node-API callbacks
DEP0169: Insecure url.parse()
DEP0170: Invalid port when using url.parse()
DEP0171: Setters for http.IncomingMessage headers and trailers
DEP0172: The asyncResource property of AsyncResource bound functions
DEP0173: the assert.CallTracker class
DEP0174: calling promisify on a function that returns a Promise
DEP0175: util.toUSVString
DEP0176: fs.F_OK, fs.R_OK, fs.W_OK, fs.X_OK
DEP0177: util.types.isWebAssemblyCompiledModule
DEP0178: dirent.path
DEP0179: Hash constructor
DEP0180: fs.Stats constructor
DEP0181: Hmac constructor
DEP0182: Short GCM authentication tags without explicit authTagLength
DEP0183: OpenSSL engine-based APIs
DEP0184: Instantiating node:zlib classes without new
DEP0185: Instantiating node:repl classes without new
DEP0187: Passing invalid argument types to fs.existsSync
DEP0188: process.features.ipv6 and process.features.uv
DEP0189: process.features.tls_*
DEP0190: Passing args to node:child_process execFile/spawn with shell option true
DEP0191: repl.builtinModules
DEP0192: require('node:_tls_common') and require('node:_tls_wrap')
DEP0193: require('node:_stream_*')
DEP0194: HTTP/2 priority signaling
DEP0195: Instantiating node:http classes without new
DEP0196: Calling node:child_process functions with options.shell as an empty string
DEP0197: util.types.isNativeError()
DEP0198: Creating SHAKE-128 and SHAKE-256 digests without an explicit options.outputLength
Deprecated APIs
#
Node.js APIs might be deprecated for any of the following reasons:
Use of the API is unsafe.
An improved alternative API is available.
Breaking changes to the API are expected in a future major release.
Node.js uses four kinds of deprecations:
Documentation-only
Application (non-node_modules code only)
Runtime (all code)
End-of-Life
A Documentation-only deprecation is one that is expressed only within the Node.js API docs. These generate no side-effects while running Node.js. Some Documentation-only deprecations trigger a runtime warning when launched with --pending-deprecation flag (or its alternative, NODE_PENDING_DEPRECATION=1 environment variable), similarly to Runtime deprecations below. Documentation-only deprecations that support that flag are explicitly labeled as such in the list of Deprecated APIs.
An Application deprecation for only non-node_modules code will, by default, generate a process warning that will be printed to stderr the first time the deprecated API is used in code that's not loaded from node_modules. When the --throw-deprecation command-line flag is used, a Runtime deprecation will cause an error to be thrown. When --pending-deprecation is used, warnings will also be emitted for code loaded from node_modules.
A runtime deprecation for all code is similar to the runtime deprecation for non-node_modules code, except that it also emits a warning for code loaded from node_modules.
An End-of-Life deprecation is used when functionality is or will soon be removed from Node.js.
Revoking deprecations
#
Occasionally, the deprecation of an API might be reversed. In such situations, this document will be updated with information relevant to the decision. However, the deprecation identifier will not be modified.
List of deprecated APIs
#
DEP0001: http.OutgoingMessage.prototype.flush
#
History

















Type: End-of-Life
OutgoingMessage.prototype.flush() has been removed. Use OutgoingMessage.prototype.flushHeaders() instead.
DEP0002: require('_linklist')
#
History

















Type: End-of-Life
The _linklist module is deprecated. Please use a userland alternative.
DEP0003: _writableState.buffer
#
History

















Type: End-of-Life
The _writableState.buffer has been removed. Use _writableState.getBuffer() instead.
DEP0004: CryptoStream.prototype.readyState
#
History

















Type: End-of-Life
The CryptoStream.prototype.readyState property was removed.
DEP0005: Buffer() constructor
#
History

















Type: Application (non-node_modules code only)
The Buffer() function and new Buffer() constructor are deprecated due to API usability issues that can lead to accidental security issues.
As an alternative, use one of the following methods of constructing Buffer objects:
Buffer.alloc(size[, fill[, encoding]]): Create a Buffer with initialized memory.
Buffer.allocUnsafe(size): Create a Buffer with uninitialized memory.
Buffer.allocUnsafeSlow(size): Create a Buffer with uninitialized memory.
Buffer.from(array): Create a Buffer with a copy of array
Buffer.from(arrayBuffer[, byteOffset[, length]]) - Create a Buffer that wraps the given arrayBuffer.
Buffer.from(buffer): Create a Buffer that copies buffer.
Buffer.from(string[, encoding]): Create a Buffer that copies string.
Without --pending-deprecation, runtime warnings occur only for code not in node_modules. This means there will not be deprecation warnings for Buffer() usage in dependencies. With --pending-deprecation, a runtime warning results no matter where the Buffer() usage occurs.
DEP0006: child_process options.customFds
#
History





















Type: End-of-Life
Within the child_process module's spawn(), fork(), and exec() methods, the options.customFds option is deprecated. The options.stdio option should be used instead.
DEP0007: Replace cluster worker.suicide with worker.exitedAfterDisconnect
#
History





















Type: End-of-Life
In an earlier version of the Node.js cluster, a boolean property with the name suicide was added to the Worker object. The intent of this property was to provide an indication of how and why the Worker instance exited. In Node.js 6.0.0, the old property was deprecated and replaced with a new worker.exitedAfterDisconnect property. The old property name did not precisely describe the actual semantics and was unnecessarily emotion-laden.
DEP0008: require('node:constants')
#
History













Type: Documentation-only
The node:constants module is deprecated. When requiring access to constants relevant to specific Node.js builtin modules, developers should instead refer to the constants property exposed by the relevant module. For instance, require('node:fs').constants and require('node:os').constants.
DEP0009: crypto.pbkdf2 without digest
#
History

























Type: End-of-Life
Use of the crypto.pbkdf2() API without specifying a digest was deprecated in Node.js 6.0 because the method defaulted to using the non-recommended 'SHA1' digest. Previously, a deprecation warning was printed. Starting in Node.js 8.0.0, calling crypto.pbkdf2() or crypto.pbkdf2Sync() with digest set to undefined will throw a TypeError.
Beginning in Node.js v11.0.0, calling these functions with digest set to null would print a deprecation warning to align with the behavior when digest is undefined.
Now, however, passing either undefined or null will throw a TypeError.
DEP0010: crypto.createCredentials
#
History

















Type: End-of-Life
The crypto.createCredentials() API was removed. Please use tls.createSecureContext() instead.
DEP0011: crypto.Credentials
#
History

















Type: End-of-Life
The crypto.Credentials class was removed. Please use tls.SecureContext instead.
DEP0012: Domain.dispose
#
History

















Type: End-of-Life
Domain.dispose() has been removed. Recover from failed I/O actions explicitly via error event handlers set on the domain instead.
DEP0013: fs asynchronous function without callback
#
History













Type: End-of-Life
Calling an asynchronous function without a callback throws a TypeError in Node.js 10.0.0 onwards. See https://github.com/nodejs/node/pull/12562.
DEP0014: fs.read legacy String interface
#
History





















Type: End-of-Life
The fs.read() legacy String interface is deprecated. Use the Buffer API as mentioned in the documentation instead.
DEP0015: fs.readSync legacy String interface
#
History





















Type: End-of-Life
The fs.readSync() legacy String interface is deprecated. Use the Buffer API as mentioned in the documentation instead.
DEP0016: GLOBAL/root
#
History

















Type: End-of-Life
The GLOBAL and root aliases for the global property were deprecated in Node.js 6.0.0 and have since been removed.
DEP0017: Intl.v8BreakIterator
#
History













Type: End-of-Life
Intl.v8BreakIterator was a non-standard extension and has been removed. See Intl.Segmenter.
DEP0018: Unhandled promise rejections
#
History













Type: End-of-Life
Unhandled promise rejections are deprecated. By default, promise rejections that are not handled terminate the Node.js process with a non-zero exit code. To change the way Node.js treats unhandled rejections, use the --unhandled-rejections command-line option.
DEP0019: require('.') resolved outside directory
#
History

















Type: End-of-Life
In certain cases, require('.') could resolve outside the package directory. This behavior has been removed.
DEP0020: Server.connections
#
History

















Type: End-of-Life
The Server.connections property was deprecated in Node.js v0.9.7 and has been removed. Please use the Server.getConnections() method instead.
DEP0021: Server.listenFD
#
History

















Type: End-of-Life
The Server.listenFD() method was deprecated and removed. Please use Server.listen({fd: <number>}) instead.
DEP0022: os.tmpDir()
#
History













Type: End-of-Life
The os.tmpDir() API was deprecated in Node.js 7.0.0 and has since been removed. Please use os.tmpdir() instead.
DEP0023: os.getNetworkInterfaces()
#
History

















Type: End-of-Life
The os.getNetworkInterfaces() method is deprecated. Please use the os.networkInterfaces() method instead.
DEP0024: REPLServer.prototype.convertToContext()
#
History













Type: End-of-Life
The REPLServer.prototype.convertToContext() API has been removed.
DEP0025: require('node:sys')
#
History













Type: Runtime
The node:sys module is deprecated. Please use the util module instead.
DEP0026: util.print()
#
History

















Type: End-of-Life
util.print() has been removed. Please use console.log() instead.
DEP0027: util.puts()
#
History

















Type: End-of-Life
util.puts() has been removed. Please use console.log() instead.
DEP0028: util.debug()
#
History

















Type: End-of-Life
util.debug() has been removed. Please use console.error() instead.
DEP0029: util.error()
#
History

















Type: End-of-Life
util.error() has been removed. Please use console.error() instead.
DEP0030: SlowBuffer
#
History

















Type: Runtime
The SlowBuffer class is deprecated. Please use Buffer.allocUnsafeSlow(size) instead.
DEP0031: ecdh.setPublicKey()
#
History













Type: Documentation-only
The ecdh.setPublicKey() method is now deprecated as its inclusion in the API is not useful.
DEP0032: node:domain module
#
History













Type: Documentation-only
The domain module is deprecated and should not be used.
DEP0033: EventEmitter.listenerCount()
#
History













Type: Documentation-only
The events.listenerCount(emitter, eventName) API is deprecated. Please use emitter.listenerCount(eventName) instead.
DEP0034: fs.exists(path, callback)
#
History













Type: Documentation-only
The fs.exists(path, callback) API is deprecated. Please use fs.stat() or fs.access() instead.
DEP0035: fs.lchmod(path, mode, callback)
#
History













Type: Documentation-only
The fs.lchmod(path, mode, callback) API is deprecated.
DEP0036: fs.lchmodSync(path, mode)
#
History













Type: Documentation-only
The fs.lchmodSync(path, mode) API is deprecated.
DEP0037: fs.lchown(path, uid, gid, callback)
#
History

















Type: Deprecation revoked
The fs.lchown(path, uid, gid, callback) API was deprecated. The deprecation was revoked because the requisite supporting APIs were added in libuv.
DEP0038: fs.lchownSync(path, uid, gid)
#
History

















Type: Deprecation revoked
The fs.lchownSync(path, uid, gid) API was deprecated. The deprecation was revoked because the requisite supporting APIs were added in libuv.
DEP0039: require.extensions
#
History













Type: Documentation-only
The require.extensions property is deprecated.
DEP0040: node:punycode module
#
History

















Type: Runtime
The punycode module is deprecated. Please use a userland alternative instead.
DEP0041: NODE_REPL_HISTORY_FILE environment variable
#
History

















Type: End-of-Life
The NODE_REPL_HISTORY_FILE environment variable was removed. Please use NODE_REPL_HISTORY instead.
DEP0042: tls.CryptoStream
#
History

















Type: End-of-Life
The tls.CryptoStream class was removed. Please use tls.TLSSocket instead.
DEP0043: tls.SecurePair
#
History





























Type: End-of-Life
The tls.SecurePair class is deprecated. Please use tls.TLSSocket instead.
DEP0044: util.isArray()
#
History

















Type: Runtime
The util.isArray() API is deprecated. Please use Array.isArray() instead.
DEP0045: util.isBoolean()
#
History





















Type: End-of-Life
The util.isBoolean() API has been removed. Please use typeof arg === 'boolean' instead.
DEP0046: util.isBuffer()
#
History





















Type: End-of-Life
The util.isBuffer() API has been removed. Please use Buffer.isBuffer() instead.
DEP0047: util.isDate()
#
History





















Type: End-of-Life
The util.isDate() API has been removed. Please use arg instanceof Date instead.
DEP0048: util.isError()
#
History





















Type: End-of-Life
The util.isError() API has been removed. Please use Object.prototype.toString(arg) === '[object Error]' || arg instanceof Error instead.
DEP0049: util.isFunction()
#
History





















Type: End-of-Life
The util.isFunction() API has been removed. Please use typeof arg === 'function' instead.
DEP0050: util.isNull()
#
History





















Type: End-of-Life
The util.isNull() API has been removed. Please use arg === null instead.
DEP0051: util.isNullOrUndefined()
#
History





















Type: End-of-Life
The util.isNullOrUndefined() API has been removed. Please use arg === null || arg === undefined instead.
DEP0052: util.isNumber()
#
History





















Type: End-of-Life
The util.isNumber() API has been removed. Please use typeof arg === 'number' instead.
DEP0053: util.isObject()
#
History





















Type: End-of-Life
The util.isObject() API has been removed. Please use arg && typeof arg === 'object' instead.
DEP0054: util.isPrimitive()
#
History





















Type: End-of-Life
The util.isPrimitive() API has been removed. Please use arg === null || (typeof arg !=='object' && typeof arg !== 'function') instead.
DEP0055: util.isRegExp()
#
History





















Type: End-of-Life
The util.isRegExp() API has been removed. Please use arg instanceof RegExp instead.
DEP0056: util.isString()
#
History





















Type: End-of-Life
The util.isString() API has been removed. Please use typeof arg === 'string' instead.
DEP0057: util.isSymbol()
#
History





















Type: End-of-Life
The util.isSymbol() API has been removed. Please use typeof arg === 'symbol' instead.
DEP0058: util.isUndefined()
#
History





















Type: End-of-Life
The util.isUndefined() API has been removed. Please use arg === undefined instead.
DEP0059: util.log()
#
History





















Type: End-of-Life
The util.log() API has been removed because it's an unmaintained legacy API that was exposed to user land by accident. Instead, consider the following alternatives based on your specific needs:
Third-Party Logging Libraries
Use console.log(new Date().toLocaleString(), message)
By adopting one of these alternatives, you can transition away from util.log() and choose a logging strategy that aligns with the specific requirements and complexity of your application.
DEP0060: util._extend()
#
History

















Type: Runtime
The util._extend() API is deprecated because it's an unmaintained legacy API that was exposed to user land by accident. Please use target = Object.assign(target, source) instead.
DEP0061: fs.SyncWriteStream
#
History

















Type: End-of-Life
The fs.SyncWriteStream class was never intended to be a publicly accessible API and has been removed. No alternative API is available. Please use a userland alternative.
DEP0062: node --debug
#
History













Type: End-of-Life
--debug activates the legacy V8 debugger interface, which was removed as of V8 5.8. It is replaced by Inspector which is activated with --inspect instead.
DEP0063: ServerResponse.prototype.writeHeader()
#
History









Type: Documentation-only
The node:http module ServerResponse.prototype.writeHeader() API is deprecated. Please use ServerResponse.prototype.writeHead() instead.
The ServerResponse.prototype.writeHeader() method was never documented as an officially supported API.
DEP0064: tls.createSecurePair()
#
History





























Type: End-of-Life
The tls.createSecurePair() API was deprecated in documentation in Node.js 0.11.3. Users should use tls.Socket instead.
DEP0065: repl.REPL_MODE_MAGIC and NODE_REPL_MODE=magic
#
History













Type: End-of-Life
The node:repl module's REPL_MODE_MAGIC constant, used for replMode option, has been removed. Its behavior has been functionally identical to that of REPL_MODE_SLOPPY since Node.js 6.0.0, when V8 5.0 was imported. Please use REPL_MODE_SLOPPY instead.
The NODE_REPL_MODE environment variable is used to set the underlying replMode of an interactive node session. Its value, magic, is also removed. Please use sloppy instead.
DEP0066: OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames
#
History

















Type: End-of-Life
The node:http module OutgoingMessage.prototype._headers and OutgoingMessage.prototype._headerNames properties are deprecated. Use one of the public methods (e.g. OutgoingMessage.prototype.getHeader(), OutgoingMessage.prototype.getHeaders(), OutgoingMessage.prototype.getHeaderNames(), OutgoingMessage.prototype.getRawHeaderNames(), OutgoingMessage.prototype.hasHeader(), OutgoingMessage.prototype.removeHeader(), OutgoingMessage.prototype.setHeader()) for working with outgoing headers.
The OutgoingMessage.prototype._headers and OutgoingMessage.prototype._headerNames properties were never documented as officially supported properties.
DEP0067: OutgoingMessage.prototype._renderHeaders
#
History









Type: Documentation-only
The node:http module OutgoingMessage.prototype._renderHeaders() API is deprecated.
The OutgoingMessage.prototype._renderHeaders property was never documented as an officially supported API.
DEP0068: node debug
#
History













Type: End-of-Life
node debug corresponds to the legacy CLI debugger which has been replaced with a V8-inspector based CLI debugger available through node inspect.
DEP0069: vm.runInDebugContext(string)
#
History

















Type: End-of-Life
DebugContext has been removed in V8 and is not available in Node.js 10+.
DebugContext was an experimental API.
DEP0070: async_hooks.currentId()
#
History













Type: End-of-Life
async_hooks.currentId() was renamed to async_hooks.executionAsyncId() for clarity.
This change was made while async_hooks was an experimental API.
DEP0071: async_hooks.triggerId()
#
History













Type: End-of-Life
async_hooks.triggerId() was renamed to async_hooks.triggerAsyncId() for clarity.
This change was made while async_hooks was an experimental API.
DEP0072: async_hooks.AsyncResource.triggerId()
#
History













Type: End-of-Life
async_hooks.AsyncResource.triggerId() was renamed to async_hooks.AsyncResource.triggerAsyncId() for clarity.
This change was made while async_hooks was an experimental API.
DEP0073: Several internal properties of net.Server
#
History













Type: End-of-Life
Accessing several internal, undocumented properties of net.Server instances with inappropriate names is deprecated.
As the original API was undocumented and not generally useful for non-internal code, no replacement API is provided.
DEP0074: REPLServer.bufferedCommand
#
History













Type: End-of-Life
The REPLServer.bufferedCommand property was deprecated in favor of REPLServer.clearBufferedCommand().
DEP0075: REPLServer.parseREPLKeyword()
#
History













Type: End-of-Life
REPLServer.parseREPLKeyword() was removed from userland visibility.
DEP0076: tls.parseCertString()
#
History

















Type: End-of-Life
tls.parseCertString() was a trivial parsing helper that was made public by mistake. While it was supposed to parse certificate subject and issuer strings, it never handled multi-value Relative Distinguished Names correctly.
Earlier versions of this document suggested using querystring.parse() as an alternative to tls.parseCertString(). However, querystring.parse() also does not handle all certificate subjects correctly and should not be used.
DEP0077: Module._debug()
#
History









Type: Runtime
Module._debug() is deprecated.
The Module._debug() function was never documented as an officially supported API.
DEP0078: REPLServer.turnOffEditorMode()
#
History













Type: End-of-Life
REPLServer.turnOffEditorMode() was removed from userland visibility.
DEP0079: Custom inspection function on objects via .inspect()
#
History

















Type: End-of-Life
Using a property named inspect on an object to specify a custom inspection function for util.inspect() is deprecated. Use util.inspect.custom instead. For backward compatibility with Node.js prior to version 6.4.0, both can be specified.
DEP0080: path._makeLong()
#
History









Type: Documentation-only
The internal path._makeLong() was not intended for public use. However, userland modules have found it useful. The internal API is deprecated and replaced with an identical, public path.toNamespacedPath() method.
DEP0081: fs.truncate() using a file descriptor
#
History













Type: End-of-Life
fs.truncate() fs.truncateSync() usage with a file descriptor is deprecated. Please use fs.ftruncate() or fs.ftruncateSync() to work with file descriptors.
DEP0082: REPLServer.prototype.memory()
#
History













Type: End-of-Life
REPLServer.prototype.memory() is only necessary for the internal mechanics of the REPLServer itself. Do not use this function.
DEP0083: Disabling ECDH by setting ecdhCurve to false
#
History













Type: End-of-Life
The ecdhCurve option to tls.createSecureContext() and tls.TLSSocket could be set to false to disable ECDH entirely on the server only. This mode was deprecated in preparation for migrating to OpenSSL 1.1.0 and consistency with the client and is now unsupported. Use the ciphers parameter instead.
DEP0084: requiring bundled internal dependencies
#
History













Type: End-of-Life
Since Node.js versions 4.4.0 and 5.2.0, several modules only intended for internal usage were mistakenly exposed to user code through require(). These modules were:
v8/tools/codemap
v8/tools/consarray
v8/tools/csvparser
v8/tools/logreader
v8/tools/profile_view
v8/tools/profile
v8/tools/SourceMap
v8/tools/splaytree
v8/tools/tickprocessor-driver
v8/tools/tickprocessor
node-inspect/lib/_inspect (from 7.6.0)
node-inspect/lib/internal/inspect_client (from 7.6.0)
node-inspect/lib/internal/inspect_repl (from 7.6.0)
The v8/* modules do not have any exports, and if not imported in a specific order would in fact throw errors. As such there are virtually no legitimate use cases for importing them through require().
On the other hand, node-inspect can be installed locally through a package manager, as it is published on the npm registry under the same name. No source code modification is necessary if that is done.
DEP0085: AsyncHooks sensitive API
#
History













Type: End-of-Life
The AsyncHooks sensitive API was never documented and had various minor issues. Use the AsyncResource API instead. See https://github.com/nodejs/node/issues/15572.
DEP0086: Remove runInAsyncIdScope
#
History













Type: End-of-Life
runInAsyncIdScope doesn't emit the 'before' or 'after' event and can thus cause a lot of issues. See https://github.com/nodejs/node/issues/14328.
DEP0089: require('node:assert')
#
History













Type: Deprecation revoked
Importing assert directly was not recommended as the exposed functions use loose equality checks. The deprecation was revoked because use of the node:assert module is not discouraged, and the deprecation caused developer confusion.
DEP0090: Invalid GCM authentication tag lengths
#
History













Type: End-of-Life
Node.js used to support all GCM authentication tag lengths which are accepted by OpenSSL when calling decipher.setAuthTag(). Beginning with Node.js v11.0.0, only authentication tag lengths of 128, 120, 112, 104, 96, 64, and 32 bits are allowed. Authentication tags of other lengths are invalid per NIST SP 800-38D.
DEP0091: crypto.DEFAULT_ENCODING
#
History













Type: End-of-Life
The crypto.DEFAULT_ENCODING property only existed for compatibility with Node.js releases prior to versions 0.9.3 and has been removed.
DEP0092: Top-level this bound to module.exports
#
History









Type: Documentation-only
Assigning properties to the top-level this as an alternative to module.exports is deprecated. Developers should use exports or module.exports instead.
DEP0093: crypto.fips is deprecated and replaced
#
History













Type: Runtime
The crypto.fips property is deprecated. Please use crypto.setFips() and crypto.getFips() instead.
DEP0094: Using assert.fail() with more than one argument
#
History









Type: Runtime
Using assert.fail() with more than one argument is deprecated. Use assert.fail() with only one argument or use a different node:assert module method.
DEP0095: timers.enroll()
#
History













Type: End-of-Life
timers.enroll() has been removed. Please use the publicly documented setTimeout() or setInterval() instead.
DEP0096: timers.unenroll()
#
History













Type: End-of-Life
timers.unenroll() has been removed. Please use the publicly documented clearTimeout() or clearInterval() instead.
DEP0097: MakeCallback with domain property
#
History









Type: Runtime
Users of MakeCallback that add the domain property to carry context, should start using the async_context variant of MakeCallback or CallbackScope, or the high-level AsyncResource class.
DEP0098: AsyncHooks embedder AsyncResource.emitBefore and AsyncResource.emitAfter APIs
#
History













Type: End-of-Life
The embedded API provided by AsyncHooks exposes .emitBefore() and .emitAfter() methods which are very easy to use incorrectly which can lead to unrecoverable errors.
Use asyncResource.runInAsyncScope() API instead which provides a much safer, and more convenient, alternative. See https://github.com/nodejs/node/pull/18513.
DEP0099: Async context-unaware node::MakeCallback C++ APIs
#
History









Type: Compile-time
Certain versions of node::MakeCallback APIs available to native addons are deprecated. Please use the versions of the API that accept an async_context parameter.
DEP0100: process.assert()
#
History

















Type: End-of-Life
process.assert() is deprecated. Please use the assert module instead.
This was never a documented feature.
DEP0101: --with-lttng
#
History









Type: End-of-Life
The --with-lttng compile-time option has been removed.
DEP0102: Using noAssert in Buffer#(read|write) operations
#
History









Type: End-of-Life
Using the noAssert argument has no functionality anymore. All input is verified regardless of the value of noAssert. Skipping the verification could lead to hard-to-find errors and crashes.
DEP0103: process.binding('util').is[...] typechecks
#
History













Type: Documentation-only (supports --pending-deprecation)
Using process.binding() in general should be avoided. The type checking methods in particular can be replaced by using util.types.
This deprecation has been superseded by the deprecation of the process.binding() API (DEP0111).
DEP0104: process.env string coercion
#
History









Type: Documentation-only (supports --pending-deprecation)
When assigning a non-string property to process.env, the assigned value is implicitly converted to a string. This behavior is deprecated if the assigned value is not a string, boolean, or number. In the future, such assignment might result in a thrown error. Please convert the property to a string before assigning it to process.env.
DEP0105: decipher.finaltol
#
History













Type: End-of-Life
decipher.finaltol() has never been documented and was an alias for decipher.final(). This API has been removed, and it is recommended to use decipher.final() instead.
DEP0106: crypto.createCipher and crypto.createDecipher
#
History

















Type: End-of-Life
crypto.createCipher() and crypto.createDecipher() have been removed as they use a weak key derivation function (MD5 with no salt) and static initialization vectors. It is recommended to derive a key using crypto.pbkdf2() or crypto.scrypt() with random salts and to use crypto.createCipheriv() and crypto.createDecipheriv() to obtain the Cipheriv and Decipheriv objects respectively.
DEP0107: tls.convertNPNProtocols()
#
History













Type: End-of-Life
This was an undocumented helper function not intended for use outside Node.js core and obsoleted by the removal of NPN (Next Protocol Negotiation) support.
DEP0108: zlib.bytesRead
#
History

















Type: End-of-Life
Deprecated alias for zlib.bytesWritten. This original name was chosen because it also made sense to interpret the value as the number of bytes read by the engine, but is inconsistent with other streams in Node.js that expose values under these names.
DEP0109: http, https, and tls support for invalid URLs
#
History













Type: End-of-Life
Some previously supported (but strictly invalid) URLs were accepted through the http.request(), http.get(), https.request(), https.get(), and tls.checkServerIdentity() APIs because those were accepted by the legacy url.parse() API. The mentioned APIs now use the WHATWG URL parser that requires strictly valid URLs. Passing an invalid URL is deprecated and support will be removed in the future.
DEP0110: vm.Script cached data
#
History









Type: Documentation-only
The produceCachedData option is deprecated. Use script.createCachedData() instead.
DEP0111: process.binding()
#
History













Type: Documentation-only (supports --pending-deprecation)
process.binding() is for use by Node.js internal code only.
While process.binding() has not reached End-of-Life status in general, it is unavailable when the permission model is enabled.
DEP0112: dgram private APIs
#
History









Type: Runtime
The node:dgram module previously contained several APIs that were never meant to accessed outside of Node.js core: Socket.prototype._handle, Socket.prototype._receiving, Socket.prototype._bindState, Socket.prototype._queue, Socket.prototype._reuseAddr, Socket.prototype._healthCheck(), Socket.prototype._stopReceiving(), and dgram._createSocketHandle().
DEP0113: Cipher.setAuthTag(), Decipher.getAuthTag()
#
History













Type: End-of-Life
Cipher.setAuthTag() and Decipher.getAuthTag() are no longer available. They were never documented and would throw when called.
DEP0114: crypto._toBuf()
#
History













Type: End-of-Life
The crypto._toBuf() function was not designed to be used by modules outside of Node.js core and was removed.
DEP0115: crypto.prng(), crypto.pseudoRandomBytes(), crypto.rng()
#
History









Type: Documentation-only (supports --pending-deprecation)
In recent versions of Node.js, there is no difference between crypto.randomBytes() and crypto.pseudoRandomBytes(). The latter is deprecated along with the undocumented aliases crypto.prng() and crypto.rng() in favor of crypto.randomBytes() and might be removed in a future release.
DEP0116: Legacy URL API
#
History

















Type: Deprecation revoked
The legacy URL API is deprecated. This includes url.format(), url.parse(), url.resolve(), and the legacy urlObject. Please use the WHATWG URL API instead.
DEP0117: Native crypto handles
#
History













Type: End-of-Life
Previous versions of Node.js exposed handles to internal native objects through the _handle property of the Cipher, Decipher, DiffieHellman, DiffieHellmanGroup, ECDH, Hash, Hmac, Sign, and Verify classes. The _handle property has been removed because improper use of the native object can lead to crashing the application.
DEP0118: dns.lookup() support for a falsy host name
#
History









Type: Runtime
Previous versions of Node.js supported dns.lookup() with a falsy host name like dns.lookup(false) due to backward compatibility. This behavior is undocumented and is thought to be unused in real world apps. It will become an error in future versions of Node.js.
DEP0119: process.binding('uv').errname() private API
#
History









Type: Documentation-only (supports --pending-deprecation)
process.binding('uv').errname() is deprecated. Please use util.getSystemErrorName() instead.
DEP0120: Windows Performance Counter support
#
History













Type: End-of-Life
Windows Performance Counter support has been removed from Node.js. The undocumented COUNTER_NET_SERVER_CONNECTION(), COUNTER_NET_SERVER_CONNECTION_CLOSE(), COUNTER_HTTP_SERVER_REQUEST(), COUNTER_HTTP_SERVER_RESPONSE(), COUNTER_HTTP_CLIENT_REQUEST(), and COUNTER_HTTP_CLIENT_RESPONSE() functions have been deprecated.
DEP0121: net._setSimultaneousAccepts()
#
History













Type: End-of-Life
The undocumented net._setSimultaneousAccepts() function was originally intended for debugging and performance tuning when using the node:child_process and node:cluster modules on Windows. The function is not generally useful and is being removed. See discussion here: https://github.com/nodejs/node/issues/18391
DEP0122: tls Server.prototype.setOptions()
#
History













Type: End-of-Life
Please use Server.prototype.setSecureContext() instead.
DEP0123: setting the TLS ServerName to an IP address
#
History









Type: Runtime
Setting the TLS ServerName to an IP address is not permitted by RFC 6066. This will be ignored in a future version.
DEP0124: using REPLServer.rli
#
History













Type: End-of-Life
This property is a reference to the instance itself.
DEP0125: require('node:_stream_wrap')
#
History









Type: Runtime
The node:_stream_wrap module is deprecated.
DEP0126: timers.active()
#
History













Type: End-of-Life
The previously undocumented timers.active() has been removed. Please use the publicly documented timeout.refresh() instead. If re-referencing the timeout is necessary, timeout.ref() can be used with no performance impact since Node.js 10.
DEP0127: timers._unrefActive()
#
History













Type: End-of-Life
The previously undocumented and "private" timers._unrefActive() has been removed. Please use the publicly documented timeout.refresh() instead. If unreferencing the timeout is necessary, timeout.unref() can be used with no performance impact since Node.js 10.
DEP0128: modules with an invalid main entry and an index.js file
#
History













Type: Runtime
Modules that have an invalid main entry (e.g., ./does-not-exist.js) and also have an index.js file in the top level directory will resolve the index.js file. That is deprecated and is going to throw an error in future Node.js versions.
DEP0129: ChildProcess._channel
#
History













Type: Runtime
The _channel property of child process objects returned by spawn() and similar functions is not intended for public use. Use ChildProcess.channel instead.
DEP0130: Module.createRequireFromPath()
#
History

















Type: End-of-Life
Use module.createRequire() instead.
DEP0131: Legacy HTTP parser
#
History

















Type: End-of-Life
The legacy HTTP parser, used by default in versions of Node.js prior to 12.0.0, is deprecated and has been removed in v13.0.0. Prior to v13.0.0, the --http-parser=legacy command-line flag could be used to revert to using the legacy parser.
DEP0132: worker.terminate() with callback
#
History









Type: Runtime
Passing a callback to worker.terminate() is deprecated. Use the returned Promise instead, or a listener to the worker's 'exit' event.
DEP0133: http connection
#
History









Type: Documentation-only
Prefer response.socket over response.connection and request.socket over request.connection.
DEP0134: process._tickCallback
#
History









Type: Documentation-only (supports --pending-deprecation)
The process._tickCallback property was never documented as an officially supported API.
DEP0135: WriteStream.open() and ReadStream.open() are internal
#
History









Type: Runtime
WriteStream.open() and ReadStream.open() are undocumented internal APIs that do not make sense to use in userland. File streams should always be opened through their corresponding factory methods fs.createWriteStream() and fs.createReadStream()) or by passing a file descriptor in options.
DEP0136: http finished
#
History









Type: Documentation-only
response.finished indicates whether response.end() has been called, not whether 'finish' has been emitted and the underlying data is flushed.
Use response.writableFinished or response.writableEnded accordingly instead to avoid the ambiguity.
To maintain existing behavior response.finished should be replaced with response.writableEnded.
DEP0137: Closing fs.FileHandle on garbage collection
#
History









Type: Runtime
Allowing a fs.FileHandle object to be closed on garbage collection is deprecated. In the future, doing so might result in a thrown error that will terminate the process.
Please ensure that all fs.FileHandle objects are explicitly closed using FileHandle.prototype.close() when the fs.FileHandle is no longer needed:
const fsPromises = require('node:fs').promises;
async function openAndClose() {
  let filehandle;
  try {
    filehandle = await fsPromises.open('thefile.txt', 'r');
  } finally {
    if (filehandle !== undefined)
      await filehandle.close();
  }
}
copy
DEP0138: process.mainModule
#
History









Type: Documentation-only
process.mainModule is a CommonJS-only feature while process global object is shared with non-CommonJS environment. Its use within ECMAScript modules is unsupported.
It is deprecated in favor of require.main, because it serves the same purpose and is only available on CommonJS environment.
DEP0139: process.umask() with no arguments
#
History









Type: Documentation-only
Calling process.umask() with no argument causes the process-wide umask to be written twice. This introduces a race condition between threads, and is a potential security vulnerability. There is no safe, cross-platform alternative API.
DEP0140: Use request.destroy() instead of request.abort()
#
History









Type: Documentation-only
Use request.destroy() instead of request.abort().
DEP0141: repl.inputStream and repl.outputStream
#
History









Type: Documentation-only (supports --pending-deprecation)
The node:repl module exported the input and output stream twice. Use .input instead of .inputStream and .output instead of .outputStream.
DEP0142: repl._builtinLibs
#
History









Type: Documentation-only (supports --pending-deprecation)
The node:repl module exports a _builtinLibs property that contains an array of built-in modules. It was incomplete so far and instead it's better to rely upon require('node:module').builtinModules.
DEP0143: Transform._transformState
#
History













Type: End-of-Life
Transform._transformState will be removed in future versions where it is no longer required due to simplification of the implementation.
DEP0144: module.parent
#
History









Type: Documentation-only (supports --pending-deprecation)
A CommonJS module can access the first module that required it using module.parent. This feature is deprecated because it does not work consistently in the presence of ECMAScript modules and because it gives an inaccurate representation of the CommonJS module graph.
Some modules use it to check if they are the entry point of the current process. Instead, it is recommended to compare require.main and module:
if (require.main === module) {
  // Code section that will run only if current file is the entry point.
}
copy
When looking for the CommonJS modules that have required the current one, require.cache and module.children can be used:
const moduleParents = Object.values(require.cache)
  .filter((m) => m.children.includes(module));
copy
DEP0145: socket.bufferSize
#
History









Type: Documentation-only
socket.bufferSize is just an alias for writable.writableLength.
DEP0146: new crypto.Certificate()
#
History









Type: Documentation-only
The crypto.Certificate() constructor is deprecated. Use static methods of crypto.Certificate() instead.
DEP0147: fs.rmdir(path, { recursive: true })
#
History

















Type: Runtime
In future versions of Node.js, recursive option will be ignored for fs.rmdir, fs.rmdirSync, and fs.promises.rmdir.
Use fs.rm(path, { recursive: true, force: true }), fs.rmSync(path, { recursive: true, force: true }) or fs.promises.rm(path, { recursive: true, force: true }) instead.
DEP0148: Folder mappings in "exports" (trailing "/")
#
History





















Type: End-of-Life
Using a trailing "/" to define subpath folder mappings in the subpath exports or subpath imports fields is no longer supported. Use subpath patterns instead.
DEP0149: http.IncomingMessage#connection
#
History









Type: Documentation-only
Prefer message.socket over message.connection.
DEP0150: Changing the value of process.config
#
History













Type: End-of-Life
The process.config property provides access to Node.js compile-time settings. However, the property is mutable and therefore subject to tampering. The ability to change the value will be removed in a future version of Node.js.
DEP0151: Main index lookup and extension searching
#
History













Type: Runtime
Previously, index.js and extension searching lookups would apply to import 'pkg' main entry point resolution, even when resolving ES modules.
With this deprecation, all ES module main entry point resolutions require an explicit "exports" or "main" entry with the exact file extension.
DEP0152: Extension PerformanceEntry properties
#
History









Type: Runtime
The 'gc', 'http2', and 'http' <PerformanceEntry> object types have additional properties assigned to them that provide additional information. These properties are now available within the standard detail property of the PerformanceEntry object. The existing accessors have been deprecated and should no longer be used.
DEP0153: dns.lookup and dnsPromises.lookup options type coercion
#
History

















Type: End-of-Life
Using a non-nullish non-integer value for family option, a non-nullish non-number value for hints option, a non-nullish non-boolean value for all option, or a non-nullish non-boolean value for verbatim option in dns.lookup() and dnsPromises.lookup() throws an ERR_INVALID_ARG_TYPE error.
DEP0154: RSA-PSS generate key pair options
#
History













Type: Runtime
The 'hash' and 'mgf1Hash' options are replaced with 'hashAlgorithm' and 'mgf1HashAlgorithm'.
DEP0155: Trailing slashes in pattern specifier resolutions
#
History













Type: Runtime
The remapping of specifiers ending in "/" like import 'pkg/x/' is deprecated for package "exports" and "imports" pattern resolutions.
DEP0156: .aborted property and 'abort', 'aborted' event in http
#
History









Type: Documentation-only
Move to <Stream> API instead, as the http.ClientRequest, http.ServerResponse, and http.IncomingMessage are all stream-based. Check stream.destroyed instead of the .aborted property, and listen for 'close' instead of 'abort', 'aborted' event.
The .aborted property and 'abort' event are only useful for detecting .abort() calls. For closing a request early, use the Stream .destroy([error]) then check the .destroyed property and 'close' event should have the same effect. The receiving end should also check the readable.readableEnded value on http.IncomingMessage to get whether it was an aborted or graceful destroy.
DEP0157: Thenable support in streams
#
History













Type: End-of-Life
An undocumented feature of Node.js streams was to support thenables in implementation methods. This is now deprecated, use callbacks instead and avoid use of async function for streams implementation methods.
This feature caused users to encounter unexpected problems where the user implements the function in callback style but uses e.g. an async method which would cause an error since mixing promise and callback semantics is not valid.
const w = new Writable({
  async final(callback) {
    await someOp();
    callback();
  },
});
copy
DEP0158: buffer.slice(start, end)
#
History









Type: Documentation-only
This method was deprecated because it is not compatible with Uint8Array.prototype.slice(), which is a superclass of Buffer.
Use buffer.subarray which does the same thing instead.
DEP0159: ERR_INVALID_CALLBACK
#
History









Type: End-of-Life
This error code was removed due to adding more confusion to the errors used for value type validation.
DEP0160: process.on('multipleResolves', handler)
#
History













Type: Runtime
This event was deprecated because it did not work with V8 promise combinators which diminished its usefulness.
DEP0161: process._getActiveRequests() and process._getActiveHandles()
#
History









Type: Documentation-only
The process._getActiveHandles() and process._getActiveRequests() functions are not intended for public use and can be removed in future releases.
Use process.getActiveResourcesInfo() to get a list of types of active resources and not the actual references.
DEP0162: fs.write(), fs.writeFileSync() coercion to string
#
History

















Type: End-of-Life
Implicit coercion of objects with own toString property, passed as second parameter in fs.write(), fs.writeFile(), fs.appendFile(), fs.writeFileSync(), and fs.appendFileSync() is deprecated. Convert them to primitive strings.
DEP0163: channel.subscribe(onMessage), channel.unsubscribe(onMessage)
#
History









Type: Documentation-only
These methods were deprecated because they can be used in a way which does not hold the channel reference alive long enough to receive the events.
Use diagnostics_channel.subscribe(name, onMessage) or diagnostics_channel.unsubscribe(name, onMessage) which does the same thing instead.
DEP0164: process.exit(code), process.exitCode coercion to integer
#
History





















Type: End-of-Life
Values other than undefined, null, integer numbers, and integer strings (e.g., '1') are deprecated as value for the code parameter in process.exit() and as value to assign to process.exitCode.
DEP0165: --trace-atomics-wait
#
History

















Type: End-of-Life
The --trace-atomics-wait flag has been removed because it uses the V8 hook SetAtomicsWaitCallback, that will be removed in a future V8 release.
DEP0166: Double slashes in imports and exports targets
#
History













Type: Runtime
Package imports and exports targets mapping into paths including a double slash (of "/" or "\") are deprecated and will fail with a resolution validation error in a future release. This same deprecation also applies to pattern matches starting or ending in a slash.
DEP0167: Weak DiffieHellmanGroup instances (modp1, modp2, modp5)
#
History









Type: Documentation-only
The well-known MODP groups modp1, modp2, and modp5 are deprecated because they are not secure against practical attacks. See RFC 8247 Section 2.4 for details.
These groups might be removed in future versions of Node.js. Applications that rely on these groups should evaluate using stronger MODP groups instead.
DEP0168: Unhandled exception in Node-API callbacks
#
History









Type: Runtime
The implicit suppression of uncaught exceptions in Node-API callbacks is now deprecated.
Set the flag --force-node-api-uncaught-exceptions-policy to force Node.js to emit an 'uncaughtException' event if the exception is not handled in Node-API callbacks.
DEP0169: Insecure url.parse()
#
History

















Type: Application (non-node_modules code only)
url.parse() behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for url.parse() vulnerabilities.
DEP0170: Invalid port when using url.parse()
#
History













Type: Runtime
url.parse() accepts URLs with ports that are not numbers. This behavior might result in host name spoofing with unexpected input. These URLs will throw an error in future versions of Node.js, as the WHATWG URL API does already.
DEP0171: Setters for http.IncomingMessage headers and trailers
#
History









Type: Documentation-only
In a future version of Node.js, message.headers, message.headersDistinct, message.trailers, and message.trailersDistinct will be read-only.
DEP0172: The asyncResource property of AsyncResource bound functions
#
History









Type: Runtime
In a future version of Node.js, the asyncResource property will no longer be added when a function is bound to an AsyncResource.
DEP0173: the assert.CallTracker class
#
History









Type: Runtime
In a future version of Node.js, assert.CallTracker, will be removed. Consider using alternatives such as the mock helper function.
DEP0174: calling promisify on a function that returns a Promise
#
History













Type: Runtime
Calling util.promisify on a function that returns a Promise will ignore the result of said promise, which can lead to unhandled promise rejections.
DEP0175: util.toUSVString
#
History









Type: Documentation-only
The util.toUSVString() API is deprecated. Please use String.prototype.toWellFormed instead.
DEP0176: fs.F_OK, fs.R_OK, fs.W_OK, fs.X_OK
#
History













Type: Runtime
F_OK, R_OK, W_OK and X_OK getters exposed directly on node:fs are deprecated. Get them from fs.constants or fs.promises.constants instead.
DEP0177: util.types.isWebAssemblyCompiledModule
#
History

















Type: End-of-Life
The util.types.isWebAssemblyCompiledModule API has been removed. Please use value instanceof WebAssembly.Module instead.
DEP0178: dirent.path
#
History

















Type: End-of-Life
The dirent.path property has been removed due to its lack of consistency across release lines. Please use dirent.parentPath instead.
DEP0179: Hash constructor
#
History













Type: Runtime
Calling Hash class directly with Hash() or new Hash() is deprecated due to being internals, not intended for public use. Please use the crypto.createHash() method to create Hash instances.
DEP0180: fs.Stats constructor
#
History













Type: Runtime
Calling fs.Stats class directly with Stats() or new Stats() is deprecated due to being internals, not intended for public use.
DEP0181: Hmac constructor
#
History













Type: Runtime
Calling Hmac class directly with Hmac() or new Hmac() is deprecated due to being internals, not intended for public use. Please use the crypto.createHmac() method to create Hmac instances.
DEP0182: Short GCM authentication tags without explicit authTagLength
#
History













Type: Runtime
Applications that intend to use authentication tags that are shorter than the default authentication tag length must set the authTagLength option of the crypto.createDecipheriv() function to the appropriate length.
For ciphers in GCM mode, the decipher.setAuthTag() function accepts authentication tags of any valid length (see DEP0090). This behavior is deprecated to better align with recommendations per NIST SP 800-38D.
DEP0183: OpenSSL engine-based APIs
#
History









Type: Documentation-only
OpenSSL 3 has deprecated support for custom engines with a recommendation to switch to its new provider model. The clientCertEngine option for https.request(), tls.createSecureContext(), and tls.createServer(); the privateKeyEngine and privateKeyIdentifier for tls.createSecureContext(); and crypto.setEngine() all depend on this functionality from OpenSSL.
DEP0184: Instantiating node:zlib classes without new
#
History













Type: Runtime
Instantiating classes without the new qualifier exported by the node:zlib module is deprecated. It is recommended to use the new qualifier instead. This applies to all Zlib classes, such as Deflate, DeflateRaw, Gunzip, Inflate, InflateRaw, Unzip, and Zlib.
DEP0185: Instantiating node:repl classes without new
#
History













Type: Runtime
Instantiating classes without the new qualifier exported by the node:repl module is deprecated. It is recommended to use the new qualifier instead. This applies to all REPL classes, including REPLServer and Recoverable.
DEP0187: Passing invalid argument types to fs.existsSync
#
History













Type: Runtime
Passing non-supported argument types is deprecated and, instead of returning false, will throw an error in a future version.
DEP0188: process.features.ipv6 and process.features.uv
#
History









Type: Documentation-only
These properties are unconditionally true. Any checks based on these properties are redundant.
DEP0189: process.features.tls_*
#
History









Type: Documentation-only
process.features.tls_alpn, process.features.tls_ocsp, and process.features.tls_sni are deprecated, as their values are guaranteed to be identical to that of process.features.tls.
DEP0190: Passing args to node:child_process execFile/spawn with shell option true
#
History













Type: Runtime
When an args array is passed to child_process.execFile or child_process.spawn with the option { shell: true }, the values are not escaped, only space-separated, which can lead to shell injection.
DEP0191: repl.builtinModules
#
History









Type: Documentation-only (supports --pending-deprecation)
The node:repl module exports a builtinModules property that contains an array of built-in modules. This was incomplete and matched the already deprecated repl._builtinLibs (DEP0142) instead it's better to rely upon require('node:module').builtinModules.
DEP0192: require('node:_tls_common') and require('node:_tls_wrap')
#
History









Type: Documentation-only
The node:_tls_common and node:_tls_wrap modules are deprecated as they should be considered an internal nodejs implementation rather than a public facing API, use node:tls instead.
DEP0193: require('node:_stream_*')
#
History









Type: Documentation-only
The node:_stream_duplex, node:_stream_passthrough, node:_stream_readable, node:_stream_transform, node:_stream_wrap and node:_stream_writable modules are deprecated as they should be considered an internal nodejs implementation rather than a public facing API, use node:stream instead.
DEP0194: HTTP/2 priority signaling
#
History













Type: End-of-Life
The support for priority signaling has been removed following its deprecation in the RFC 9113.
DEP0195: Instantiating node:http classes without new
#
History









Type: Documentation-only
Instantiating classes without the new qualifier exported by the node:http module is deprecated. It is recommended to use the new qualifier instead. This applies to all http classes, such as OutgoingMessage, IncomingMessage, ServerResponse and ClientRequest.
DEP0196: Calling node:child_process functions with options.shell as an empty string
#
History









Type: Documentation-only
Calling the process-spawning functions with { shell: '' } is almost certainly unintentional, and can cause aberrant behavior.
To make child_process.execFile or child_process.spawn invoke the default shell, use { shell: true }. If the intention is not to invoke a shell (default behavior), either omit the shell option, or set it to false or a nullish value.
To make child_process.exec invoke the default shell, either omit the shell option, or set it to a nullish value. If the intention is not to invoke a shell, use child_process.execFile instead.
DEP0197: util.types.isNativeError()
#
History









Type: Documentation-only
The util.types.isNativeError API is deprecated. Please use Error.isError instead.
DEP0198: Creating SHAKE-128 and SHAKE-256 digests without an explicit options.outputLength
#
History









Type: Documentation-only (supports --pending-deprecation)
Creating SHAKE-128 and SHAKE-256 digests without an explicit options.outputLength is deprecated.


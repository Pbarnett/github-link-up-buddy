# Vitest Advanced API

## Overview
This document covers advanced Vitest features, patterns, and APIs for complex testing scenarios in the github-link-up-buddy project.
Getting Started
WARNING
This guide lists advanced APIs to run tests via a Node.js script. If you just want to run tests, you probably don't need this. It is primarily used by library authors.
You can import any method from the vitest/node entry-point.
startVitest
function startVitest(
  mode: VitestRunMode,
  cliFilters: string[] = [],
  options: CliOptions = {},
  viteOverrides?: ViteUserConfig,
  vitestOptions?: VitestOptions,
): Promise<Vitest>
You can start running Vitest tests using its Node API:
import { startVitest } from 'vitest/node'

const vitest = await startVitest('test')

await vitest.close()
startVitest function returns Vitest instance if tests can be started.
If watch mode is not enabled, Vitest will call close method automatically.
If watch mode is enabled and the terminal supports TTY, Vitest will register console shortcuts.
You can pass down a list of filters as a second argument. Vitest will run only tests that contain at least one of the passed-down strings in their file path.
Additionally, you can use the third argument to pass in CLI arguments, which will override any test config options. Alternatively, you can pass in the complete Vite config as the fourth argument, which will take precedence over any other user-defined options.
After running the tests, you can get the results from the state.getTestModules API:
import type { TestModule } from 'vitest/node'

const vitest = await startVitest('test')

console.log(vitest.state.getTestModules()) // [TestModule]
TIP
The "Running Tests" guide has a usage example.
createVitest
function createVitest(
  mode: VitestRunMode,
  options: CliOptions,
  viteOverrides: ViteUserConfig = {},
  vitestOptions: VitestOptions = {},
): Promise<Vitest>
You can create Vitest instance by using createVitest function. It returns the same Vitest instance as startVitest, but it doesn't start tests and doesn't validate installed packages.
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test', {
  watch: false,
})
TIP
The "Running Tests" guide has a usage example.
resolveConfig
function resolveConfig(
  options: UserConfig = {},
  viteOverrides: ViteUserConfig = {},
): Promise<{
  vitestConfig: ResolvedConfig
  viteConfig: ResolvedViteConfig
}>
This method resolves the config with custom parameters. If no parameters are given, the root will be process.cwd().
import { resolveConfig } from 'vitest/node'

// vitestConfig only has resolved "test" properties
const { vitestConfig, viteConfig } = await resolveConfig({
  mode: 'custom',
  configFile: false,
  resolve: {
    conditions: ['custom']
  },
  test: {
    setupFiles: ['/my-setup-file.js'],
    pool: 'threads',
  },
})
INFO
Due to how Vite's createServer works, Vitest has to resolve the config during the plugin's configResolve hook. Therefore, this method is not actually used internally and is exposed exclusively as a public API.
If you pass down the config to the startVitest or createVitest APIs, Vitest will still resolve the config again.
WARNING
The resolveConfig doesn't resolve projects. To resolve projects configs, Vitest needs an established Vite server.
Also note that viteConfig.test will not be fully resolved. If you need Vitest config, use vitestConfig instead.
parseCLI
function parseCLI(argv: string | string[], config: CliParseOptions = {}): {
  filter: string[]
  options: CliOptions
}
You can use this method to parse CLI arguments. It accepts a string (where arguments are split by a single space) or a strings array of CLI arguments in the same format that Vitest CLI uses. It returns a filter and options that you can later pass down to createVitest or startVitest methods.
import { parseCLI } from 'vitest/node'

const result = parseCLI('vitest ./files.ts --coverage --browser=chrome')

result.options
// {
//   coverage: { enabled: true },
//   browser: { name: 'chrome', enabled: true }
// }

result.filter
// ['./files.ts']
Suggest changes to this page
Last updated: 5/5/25, 11:49 AM
Pager
Next page
Vitest
Vitest
Vitest instance requires the current test mode. It can be either:
test when running runtime tests
benchmark when running benchmarks experimental






































































mode
test
Test mode will only call functions inside test or it, and throws an error when bench is encountered. This mode uses include and exclude options in the config to find test files.
benchmark experimental
Benchmark mode calls bench functions and throws an error, when it encounters test or it. This mode uses benchmark.include and benchmark.exclude options in the config to find benchmark files.
config
The root (or global) config. If projects are defined, they will reference this as globalConfig.
WARNING
This is Vitest config, it doesn't extend Vite config. It only has resolved values from the test property.
vite
This is a global ViteDevServer.
state experimental
WARNING
Public state is an experimental API (except vitest.state.getReportedEntity). Breaking changes might not follow SemVer, please pin Vitest's version when using it.
Global state stores information about the current tests. It uses the same API from @vitest/runner by default, but we recommend using the Reported Tasks API instead by calling state.getReportedEntity() on the @vitest/runner API:
const task = vitest.state.idMap.get(taskId) // old API
const testCase = vitest.state.getReportedEntity(task) // new API
In the future, the old API won't be exposed anymore.
snapshot
The global snapshot manager. Vitest keeps track of all snapshots using the snapshot.add method.
You can get the latest summary of snapshots via the vitest.snapshot.summary property.
cache
Cache manager that stores information about latest test results and test file stats. In Vitest itself this is only used by the default sequencer to sort tests.
projects
An array of test projects that belong to user's projects. If the user did not specify a them, this array will only contain a root project.
Vitest will ensure that there is always at least one project in this array. If the user specifies a non-existent --project name, Vitest will throw an error before this array is defined.
getRootProject
function getRootProject(): TestProject
This returns the root test project. The root project generally doesn't run any tests and is not included in vitest.projects unless the user explicitly includes the root config in their configuration, or projects are not defined at all.
The primary goal of the root project is to setup the global config. In fact, rootProject.config references rootProject.globalConfig and vitest.config directly:
rootProject.config === rootProject.globalConfig === rootProject.vitest.config
provide
function provide<T extends keyof ProvidedContext & string>(
  key: T,
  value: ProvidedContext[T],
): void
Vitest exposes provide method which is a shorthand for vitest.getRootProject().provide. With this method you can pass down values from the main thread to tests. All values are checked with structuredClone before they are stored, but the values themselves are not cloned.
To receive the values in the test, you need to import inject method from vitest entrypoint:
import { inject } from 'vitest'
const port = inject('wsPort') // 3000
For better type safety, we encourage you to augment the type of ProvidedContext:
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test', {
  watch: false,
})
vitest.provide('wsPort', 3000)

declare module 'vitest' {
  export interface ProvidedContext {
    wsPort: number
  }
}
WARNING
Technically, provide is a method of TestProject, so it is limited to the specific project. However, all projects inherit the values from the root project which makes vitest.provide universal way of passing down values to tests.
getProvidedContext
function getProvidedContext(): ProvidedContext
This returns the root context object. This is a shorthand for vitest.getRootProject().getProvidedContext.
getProjectByName
function getProjectByName(name: string): TestProject
This method returns the project by its name. Similar to calling vitest.projects.find.
WARNING
In case the project doesn't exist, this method will return the root project - make sure to check the names again if the project you are looking for is the one returned.
If user didn't customize a name, the Vitest will assign an empty string as a name.
globTestSpecifications
function globTestSpecifications(
  filters?: string[],
): Promise<TestSpecification[]>
This method constructs new test specifications by collecting every test in all projects with project.globTestFiles. It accepts string filters to match the test files - these are the same filters that CLI supports.
This method automatically caches all test specifications. When you call getModuleSpecifications next time, it will return the same specifications unless clearSpecificationsCache was called before that.
WARNING
As of Vitest 3, it's possible to have multiple test specifications with the same module ID (file path) if poolMatchGlob has several pools or if typecheck is enabled. This possibility will be removed in Vitest 4.
const specifications = await vitest.globTestSpecifications(['my-filter'])
// [TestSpecification{ moduleId: '/tests/my-filter.test.ts' }]
console.log(specifications)
getRelevantTestSpecifications
function getRelevantTestSpecifications(
  filters?: string[]
): Promise<TestSpecification[]>
This method resolves every test specification by calling project.globTestFiles. It accepts string filters to match the test files - these are the same filters that CLI supports. If --changed flag was specified, the list will be filtered to include only files that changed. getRelevantTestSpecifications doesn't run any test files.
WARNING
This method can be slow because it needs to filter --changed flags. Do not use it if you just need a list of test files.
If you need to get the list of specifications for known test files, use getModuleSpecifications instead.
If you need to get the list of all possible test files, use globTestSpecifications.
mergeReports
function mergeReports(directory?: string): Promise<TestRunResult>
Merge reports from multiple runs located in the specified directory (value from --merge-reports if not specified). This value can also be set on config.mergeReports (by default, it will read .vitest-reports folder).
Note that the directory will always be resolved relative to the working directory.
This method is called automatically by startVitest if config.mergeReports is set.
collect
function collect(filters?: string[]): Promise<TestRunResult>
Execute test files without running test callbacks. collect returns unhandled errors and an array of test modules. It accepts string filters to match the test files - these are the same filters that CLI supports.
This method resolves tests specifications based on the config include, exclude, and includeSource values. Read more at project.globTestFiles. If --changed flag was specified, the list will be filtered to include only files that changed.
WARNING
Note that Vitest doesn't use static analysis to collect tests. Vitest will run every test file in isolation, just like it runs regular tests.
This makes this method very slow, unless you disable isolation before collecting tests.
start
function start(filters?: string[]): Promise<TestRunResult>
Initialize reporters, the coverage provider, and run tests. This method accepts string filters to match the test files - these are the same filters that CLI supports.
WARNING
This method should not be called if vitest.init() is also invoked. Use runTestSpecifications or rerunTestSpecifications instead if you need to run tests after Vitest was inititalised.
This method is called automatically by startVitest if config.mergeReports and config.standalone are not set.
init
function init(): Promise<void>
Initialize reporters and the coverage provider. This method doesn't run any tests. If the --watch flag is provided, Vitest will still run changed tests even if this method was not called.
Internally, this method is called only if --standalone flag is enabled.
WARNING
This method should not be called if vitest.start() is also invoked.
This method is called automatically by startVitest if config.standalone is set.
getModuleSpecifications
function getModuleSpecifications(moduleId: string): TestSpecification[]
Returns a list of test specifications related to the module ID. The ID should already be resolved to an absolute file path. If ID doesn't match include or includeSource patterns, the returned array will be empty.
This method can return already cached specifications based on the moduleId and pool. But note that project.createSpecification always returns a new instance and it's not cached automatically. However, specifications are automatically cached when runTestSpecifications is called.
WARNING
As of Vitest 3, this method uses a cache to check if the file is a test. To make sure that the cache is not empty, call globTestSpecifications at least once.
clearSpecificationsCache
function clearSpecificationsCache(moduleId?: string): void
Vitest automatically caches test specifications for each file when globTestSpecifications or runTestSpecifications is called. This method clears the cache for the given file or the whole cache altogether depending on the first argument.
runTestSpecifications
function runTestSpecifications(
  specifications: TestSpecification[],
  allTestsRun = false
): Promise<TestRunResult>
This method runs every test based on the received specifications. The second argument, allTestsRun, is used by the coverage provider to determine if it needs to instrument coverage on every file in the root (this only matters if coverage is enabled and coverage.all is set to true).
WARNING
This method doesn't trigger onWatcherRerun, onWatcherStart and onTestsRerun callbacks. If you are rerunning tests based on the file change, consider using rerunTestSpecifications instead.
rerunTestSpecifications
function rerunTestSpecifications(
  specifications: TestSpecification[],
  allTestsRun = false
): Promise<TestRunResult>
This method emits reporter.onWatcherRerun and onTestsRerun events, then it runs tests with runTestSpecifications. If there were no errors in the main process, it will emit reporter.onWatcherStart event.
updateSnapshot
function updateSnapshot(files?: string[]): Promise<TestRunResult>
Update snapshots in specified files. If no files are provided, it will update files with failed tests and obsolete snapshots.
collectTests
function collectTests(
  specifications: TestSpecification[]
): Promise<TestRunResult>
Execute test files without running test callbacks. collectTests returns unhandled errors and an array of test modules.
This method works exactly the same as collect, but you need to provide test specifications yourself.
WARNING
Note that Vitest doesn't use static analysis to collect tests. Vitest will run every test file in isolation, just like it runs regular tests.
This makes this method very slow, unless you disable isolation before collecting tests.
cancelCurrentRun
function cancelCurrentRun(reason: CancelReason): Promise<void>
This method will gracefully cancel all ongoing tests. It will wait for started tests to finish running and will not run tests that were scheduled to run but haven't started yet.
setGlobalTestNamePattern
function setGlobalTestNamePattern(pattern: string | RegExp): void
This methods overrides the global test name pattern.
WARNING
This method doesn't start running any tests. To run tests with updated pattern, call runTestSpecifications.
resetGlobalTestNamePattern
function resetGlobalTestNamePattern(): void
This methods resets the test name pattern. It means Vitest won't skip any tests now.
WARNING
This method doesn't start running any tests. To run tests without a pattern, call runTestSpecifications.
enableSnapshotUpdate
function enableSnapshotUpdate(): void
Enable the mode that allows updating snapshots when running tests. Every test that runs after this method is called will update snapshots. To disable the mode, call resetSnapshotUpdate.
WARNING
This method doesn't start running any tests. To update snapshots, run tests with runTestSpecifications.
resetSnapshotUpdate
function resetSnapshotUpdate(): void
Disable the mode that allows updating snapshots when running tests. This method doesn't start running any tests.
invalidateFile
function invalidateFile(filepath: string): void
This method invalidates the file in the cache of every project. It is mostly useful if you rely on your own watcher because Vite's cache persist in memory.
DANGER
If you disable Vitest's watcher but keep Vitest running, it is important to manually clear the cache with this method because there is no way to disable the cache. This method will also invalidate file's importers.
import
function import<T>(moduleId: string): Promise<T>
Import a file using Vite module runner. The file will be transformed by Vite with the global config and executed in a separate context. Note that moduleId will be relative to the config.root.
DANGER
project.import reuses Vite's module graph, so importing the same module using a regular import will return a different module:
import * as staticExample from './example.js'
const dynamicExample = await vitest.import('./example.js')

dynamicExample !== staticExample // ✅
INFO
Internally, Vitest uses this method to import global setups, custom coverage providers, and custom reporters, meaning all of them share the same module graph as long as they belong to the same Vite server.
close
function close(): Promise<void>
Closes all projects and their associated resources. This can only be called once; the closing promise is cached until the server restarts.
exit
function exit(force = false): Promise<void>
Closes all projects and exit the process. If force is set to true, the process will exit immediately after closing the projects.
This method will also forcefully call process.exit() if the process is still active after config.teardownTimeout milliseconds.
shouldKeepServer
function shouldKeepServer(): boolean
This method will return true if the server should be kept running after the tests are done. This usually means that the watch mode was enabled.
onServerRestart
function onServerRestart(fn: OnServerRestartHandler): void
Register a handler that will be called when the server is restarted due to a config change.
onCancel
function onCancel(fn: (reason: CancelReason) => Awaitable<void>): void
Register a handler that will be called when the test run is cancelled with vitest.cancelCurrentRun.
onClose
function onClose(fn: () => Awaitable<void>): void
Register a handler that will be called when the server is closed.
onTestsRerun
function onTestsRerun(fn: OnTestsRerunHandler): void
Register a handler that will be called when the tests are rerunning. The tests can rerun when rerunTestSpecifications is called manually or when a file is changed and the built-in watcher schedules a rerun.
onFilterWatchedSpecification
function onFilterWatchedSpecification(
  fn: (specification: TestSpecification) => boolean
): void
Register a handler that will be called when a file is changed. This callback should return true or false, indicating whether the test file needs to be rerun.
With this method, you can hook into the default watcher logic to delay or discard tests that the user doesn't want to keep track of at the moment:
const continuesTests: string[] = []

myCustomWrapper.onContinuesRunEnabled(testItem =>
  continuesTests.push(item.fsPath)
)

vitest.onFilterWatchedSpecification(specification =>
  continuesTests.includes(specification.moduleId)
)
Vitest can create different specifications for the same file depending on the pool or locations options, so do not rely on the reference. Vitest can also return cached specification from vitest.getModuleSpecifications - the cache is based on the moduleId and pool. Note that project.createSpecification always returns a new instance.
matchesProjectFilter 3.1.0+
function matchesProjectFilter(name: string): boolean
Check if the name matches the current project filter. If there is no project filter, this will always return true.
It is not possible to programmatically change the --project CLI option.
Suggest changes to this page
Last updated: 5/5/25, 11:49 AM
Pager
Previous page
Getting Started
Next page
TestProject
TestProject 3.0.0+
WARNING
This guide describes the advanced Node.js API. If you just want to define projects, follow the "Test Projects" guide.
name
The name is a unique string assigned by the user or interpreted by Vitest. If user did not provide a name, Vitest tries to load a package.json in the root of the project and takes the name property from there. If there is no package.json, Vitest uses the name of the folder by default. Inline projects use numbers as the name (converted to string).
node.js
vitest.config.js
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test')
vitest.projects.map(p => p.name) === [
  '@pkg/server',
  'utils',
  '2',
  'custom'
]
INFO
If the root project is not part of user projects, its name will not be resolved.
vitest
vitest references the global Vitest process.
serializedConfig
This is the config that test processes receive. Vitest serializes config manually by removing all functions and properties that are not possible to serialize. Since this value is available in both tests and node, its type is exported from the main entry point.
import type { SerializedConfig } from 'vitest'

const config: SerializedConfig = vitest.projects[0].serializedConfig
WARNING
The serializedConfig property is a getter. Every time it's accessed Vitest serializes the config again in case it was changed. This also means that it always returns a different reference:
project.serializedConfig === project.serializedConfig // ❌
globalConfig
The test config that Vitest was initialized with. If this is the root project, globalConfig and config will reference the same object. This config is useful for values that cannot be set on the project level, like coverage or reporters.
import type { ResolvedConfig } from 'vitest/node'

vitest.config === vitest.projects[0].globalConfig
config
This is the project's resolved test config.
hash 3.2.0+
The unique hash of this project. This value is consistent between the reruns.
It is based on the root of the project and its name. Note that the root path is not consistent between different OS, so the hash will also be different.
vite
This is project's ViteDevServer. All projects have their own Vite servers.
browser
This value will be set only if tests are running in the browser. If browser is enabled, but tests didn't run yet, this will be undefined. If you need to check if the project supports browser tests, use project.isBrowserEnabled() method.
WARNING
The browser API is even more experimental and doesn't follow SemVer. The browser API will be standardized separately from the rest of the APIs.
provide
function provide<T extends keyof ProvidedContext & string>(
  key: T,
  value: ProvidedContext[T],
): void
A way to provide custom values to tests in addition to config.provide field. All values are validated with structuredClone before they are stored, but the values on providedContext themselves are not cloned.
node.js
test.spec.js
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test')
const project = vitest.projects.find(p => p.name === 'custom')
project.provide('key', 'value')
await vitest.start()
The values can be provided dynamically. Provided value in tests will be updated on their next run.
TIP
This method is also available to global setup files for cases where you cannot use the public API:
export default function setup({ provide }) {
  provide('wsPort', 3000)
}
getProvidedContext
function getProvidedContext(): ProvidedContext
This returns the context object. Every project also inherits the global context set by vitest.provide.
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test')
vitest.provide('global', true)
const project = vitest.projects.find(p => p.name === 'custom')
project.provide('key', 'value')

// { global: true, key: 'value' }
const context = project.getProvidedContext()
TIP
Project context values will always override root project's context.
createSpecification
function createSpecification(
  moduleId: string,
  locations?: number[],
): TestSpecification
Create a test specification that can be used in vitest.runTestSpecifications. Specification scopes the test file to a specific project and test locations (optional). Test locations are code lines where the test is defined in the source code. If locations are provided, Vitest will only run tests defined on those lines. Note that if testNamePattern is defined, then it will also be applied.
import { createVitest } from 'vitest/node'
import { resolve } from 'node:path/posix'

const vitest = await createVitest('test')
const project = vitest.projects[0]
const specification = project.createSpecification(
  resolve('./example.test.ts'),
  [20, 40], // optional test lines
)
await vitest.runTestSpecifications([specification])
WARNING
createSpecification expects resolved module ID. It doesn't auto-resolve the file or check that it exists on the file system.
Also note that project.createSpecification always returns a new instance.
isRootProject
function isRootProject(): boolean
Checks if the current project is the root project. You can also get the root project by calling vitest.getRootProject().
globTestFiles
function globTestFiles(filters?: string[]): {
  /**
   * Test files that match the filters.
   */
  testFiles: string[]
  /**
   * Typecheck test files that match the filters. This will be empty unless `typecheck.enabled` is `true`.
   */
  typecheckTestFiles: string[]
}
Globs all test files. This function returns an object with regular tests and typecheck tests.
This method accepts filters. Filters can only a part of the file path, unlike in other methods on the Vitest instance:
project.globTestFiles(['foo']) // ✅
project.globTestFiles(['basic/foo.js:10']) // ❌
TIP
Vitest uses fast-glob to find test files. test.dir, test.root, root or process.cwd() define the cwd option.
This method looks at several config options:
test.include, test.exclude to find regular test files
test.includeSource, test.exclude to find in-source tests
test.typecheck.include, test.typecheck.exclude to find typecheck tests
matchesTestGlob
function matchesTestGlob(
  moduleId: string,
  source?: () => string
): boolean
This method checks if the file is a regular test file. It uses the same config properties that globTestFiles uses for validation.
This method also accepts a second parameter, which is the source code. This is used to validate if the file is an in-source test. If you are calling this method several times for several projects it is recommended to read the file once and pass it down directly. If the file is not a test file, but matches the includeSource glob, Vitest will synchronously read the file unless the source is provided.
import { createVitest } from 'vitest/node'
import { resolve } from 'node:path/posix'

const vitest = await createVitest('test')
const project = vitest.projects[0]

project.matchesTestGlob(resolve('./basic.test.ts')) // true
project.matchesTestGlob(resolve('./basic.ts')) // false
project.matchesTestGlob(resolve('./basic.ts'), () => `
if (import.meta.vitest) {
  // ...
}
`) // true if `includeSource` is set
import
function import<T>(moduleId: string): Promise<T>
Import a file using Vite module runner. The file will be transformed by Vite with provided project's config and executed in a separate context. Note that moduleId will be relative to the config.root.
DANGER
project.import reuses Vite's module graph, so importing the same module using a regular import will return a different module:
import * as staticExample from './example.js'
const dynamicExample = await project.import('./example.js')

dynamicExample !== staticExample // ✅
INFO
Internally, Vitest uses this method to import global setups, custom coverage providers and custom reporters, meaning all of them share the same module graph as long as they belong to the same Vite server.
onTestsRerun
function onTestsRerun(cb: OnTestsRerunHandler): void
This is a shorthand for project.vitest.onTestsRerun. It accepts a callback that will be awaited when the tests have been scheduled to rerun (usually, due to a file change).
project.onTestsRerun((specs) => {
  console.log(specs)
})
isBrowserEnabled
function isBrowserEnabled(): boolean
Returns true if this project runs tests in the browser.
close
function close(): Promise<void>
Closes the project and all associated resources. This can only be called once; the closing promise is cached until the server restarts. If the resources are needed again, create a new project.
In detail, this method closes the Vite server, stops the typechecker service, closes the browser if it's running, deletes the temporary directory that holds the source code, and resets the provided context.
Suggest changes to this page
Last updated: 5/16/25, 10:15 AM
Pager
Previous page
Vitest
Next page
TestSpecification
TestSpecification
The TestSpecification class describes what module to run as a test and its parameters.
You can only create a specification by calling createSpecification method on a test project:
const specification = project.createSpecification(
  resolve('./example.test.ts'),
  [20, 40], // optional test lines
)
createSpecification expects resolved module ID. It doesn't auto-resolve the file or check that it exists on the file system.
taskId
Test module's identifier.
project
This references the TestProject that the test module belongs to.
moduleId
The ID of the module in Vite's module graph. Usually, it's an absolute file path using posix separator:
'C:/Users/Documents/project/example.test.ts' // ✅
'/Users/mac/project/example.test.ts' // ✅
'C:\\Users\\Documents\\project\\example.test.ts' // ❌
testModule
Instance of TestModule associated with the specification. If test wasn't queued yet, this will be undefined.
pool experimental
The pool in which the test module will run.
DANGER
It's possible to have multiple pools in a single test project with poolMatchGlob and typecheck.enabled. This means it's possible to have several specifications with the same moduleId but different pool. In Vitest 4, the project will only support a single pool, and this property will be removed.
testLines
This is an array of lines in the source code where the test files are defined. This field is defined only if the createSpecification method received an array.
Note that if there is no test on at least one of the lines, the whole suite will fail. An example of a correct testLines configuration:
script.js
example.test.js
const specification = project.createSpecification(
  resolve('./example.test.ts'),
  [3, 8, 9],
)
toJSON
function toJSON(): SerializedTestSpecification
toJSON generates a JSON-friendly object that can be consumed by the Browser Mode or Vitest UI.
Suggest changes to this page
Last updated: 3/14/25, 3:20 AM
Pager
Previous page
TestProject
Next page
TestCase
TestCase
The TestCase class represents a single test. This class is only available in the main thread. Refer to the "Runner API" if you are working with runtime tasks.
The TestCase instance always has a type property with the value of test. You can use it to distinguish between different task types:
if (task.type === 'test') {
  task // TestCase
}
project
This references the TestProject that the test belongs to.
module
This is a direct reference to the TestModule where the test is defined.
name
This is a test name that was passed to the test function.
import { test } from 'vitest'

test('the validation works correctly', () => {
  // ...
})
fullName
The name of the test including all parent suites separated with > symbol. This test has a full name "the validation logic > the validation works correctly":
import { describe, test } from 'vitest'

describe('the validation logic', () => {
  test('the validation works correctly', () => {
    // ...
  })
})
id
This is test's unique identifier. This ID is deterministic and will be the same for the same test across multiple runs. The ID is based on the project name, module ID and test order.
The ID looks like this:
1223128da3_0_0
^^^^^^^^^^ the file hash
           ^ suite index
             ^ test index
TIP
You can generate file hash with generateFileHash function from vitest/node which is available since Vitest 3:
import { generateFileHash } from 'vitest/node'

const hash = generateFileHash(
  '/file/path.js', // relative path
  undefined, // the project name or `undefined` is not set
)
DANGER
Don't try to parse the ID. It can have a minus at the start: -1223128da3_0_0_0.
location
The location in the module where the test was defined. Locations are collected only if includeTaskLocation is enabled in the config. Note that this option is automatically enabled if --reporter=html, --ui or --browser flags are used.
The location of this test will be equal to { line: 3, column: 1 }:
import { test } from 'vitest'

test('the validation works correctly', () => {
  // ...
})
1
2
3
4
5
parent
Parent suite. If the test was called directly inside the module, the parent will be the module itself.
options
interface TaskOptions {
  readonly each: boolean | undefined
  readonly fails: boolean | undefined
  readonly concurrent: boolean | undefined
  readonly shuffle: boolean | undefined
  readonly retry: number | undefined
  readonly repeats: number | undefined
  readonly mode: 'run' | 'only' | 'skip' | 'todo'
}
The options that test was collected with.
ok
function ok(): boolean
Checks if the test did not fail the suite. If the test is not finished yet or was skipped, it will return true.
meta
function meta(): TaskMeta
Custom metadata that was attached to the test during its execution. The meta can be attached by assigning a property to the ctx.task.meta object during a test run:
import { test } from 'vitest'

test('the validation works correctly', ({ task }) => {
  // ...

  task.meta.decorated = false
})
If the test did not finish running yet, the meta will be an empty object.
result
function result(): TestResult
Test results. If test is not finished yet or was just collected, it will be equal to TestResultPending:
export interface TestResultPending {
  /**
   * The test was collected, but didn't finish running yet.
   */
  readonly state: 'pending'
  /**
   * Pending tests have no errors.
   */
  readonly errors: undefined
}
If the test was skipped, the return value will be TestResultSkipped:
interface TestResultSkipped {
  /**
   * The test was skipped with `skip` or `todo` flag.
   * You can see which one was used in the `options.mode` option.
   */
  readonly state: 'skipped'
  /**
   * Skipped tests have no errors.
   */
  readonly errors: undefined
  /**
   * A custom note passed down to `ctx.skip(note)`.
   */
  readonly note: string | undefined
}
TIP
If the test was skipped because another test has only flag, the options.mode will be equal to skip.
If the test failed, the return value will be TestResultFailed:
interface TestResultFailed {
  /**
   * The test failed to execute.
   */
  readonly state: 'failed'
  /**
   * Errors that were thrown during the test execution.
   */
  readonly errors: ReadonlyArray<TestError>
}
If the test passed, the return value will be TestResultPassed:
interface TestResultPassed {
  /**
   * The test passed successfully.
   */
  readonly state: 'passed'
  /**
   * Errors that were thrown during the test execution.
   */
  readonly errors: ReadonlyArray<TestError> | undefined
}
WARNING
Note that the test with passed state can still have errors attached - this can happen if retry was triggered at least once.
diagnostic
function diagnostic(): TestDiagnostic | undefined
Useful information about the test like duration, memory usage, etc:
interface TestDiagnostic {
  /**
   * If the duration of the test is above `slowTestThreshold`.
   */
  readonly slow: boolean
  /**
   * The amount of memory used by the test in bytes.
   * This value is only available if the test was executed with `logHeapUsage` flag.
   */
  readonly heap: number | undefined
  /**
   * The time it takes to execute the test in ms.
   */
  readonly duration: number
  /**
   * The time in ms when the test started.
   */
  readonly startTime: number
  /**
   * The amount of times the test was retried.
   */
  readonly retryCount: number
  /**
   * The amount of times the test was repeated as configured by `repeats` option.
   * This value can be lower if the test failed during the repeat and no `retry` is configured.
   */
  readonly repeatCount: number
  /**
   * If test passed on a second retry.
   */
  readonly flaky: boolean
}
INFO
diagnostic() will return undefined if the test was not scheduled to run yet.
Suggest changes to this page
Last updated: 3/31/25, 5:12 AM
Pager
Previous page
TestSpecification
Next page
TestSuite
TestSuite
The TestSuite class represents a single suite. This class is only available in the main thread. Refer to the "Runner API" if you are working with runtime tasks.
The TestSuite instance always has a type property with the value of suite. You can use it to distinguish between different task types:
if (task.type === 'suite') {
  task // TestSuite
}
project
This references the TestProject that the test belongs to.
module
This is a direct reference to the TestModule where the test is defined.
name
This is a suite name that was passed to the describe function.
import { describe } from 'vitest'

describe('the validation logic', () => {
  // ...
})
fullName
The name of the suite including all parent suites separated with > symbol. This suite has a full name "the validation logic > validating cities":
import { describe, test } from 'vitest'

describe('the validation logic', () => {
  describe('validating cities', () => {
    // ...
  })
})
id
This is suite's unique identifier. This ID is deterministic and will be the same for the same suite across multiple runs. The ID is based on the project name, module ID and suite order.
The ID looks like this:
1223128da3_0_0_0
^^^^^^^^^^ the file hash
           ^ suite index
             ^ nested suite index
               ^ test index
TIP
You can generate file hash with generateFileHash function from vitest/node which is available since Vitest 3:
import { generateFileHash } from 'vitest/node'

const hash = generateFileHash(
  '/file/path.js', // relative path
  undefined, // the project name or `undefined` is not set
)
DANGER
Don't try to parse the ID. It can have a minus at the start: -1223128da3_0_0_0.
location
The location in the module where the suite was defined. Locations are collected only if includeTaskLocation is enabled in the config. Note that this option is automatically enabled if --reporter=html, --ui or --browser flags are used.
The location of this suite will be equal to { line: 3, column: 1 }:
import { describe } from 'vitest'

describe('the validation works correctly', () => {
  // ...
})
1
2
3
4
5
parent
Parent suite. If the suite was called directly inside the module, the parent will be the module itself.
options
interface TaskOptions {
  readonly each: boolean | undefined
  readonly fails: boolean | undefined
  readonly concurrent: boolean | undefined
  readonly shuffle: boolean | undefined
  readonly retry: number | undefined
  readonly repeats: number | undefined
  readonly mode: 'run' | 'only' | 'skip' | 'todo'
}
The options that suite was collected with.
children
This is a collection of all suites and tests inside the current suite.
for (const task of suite.children) {
  if (task.type === 'test') {
    console.log('test', task.fullName)
  }
  else {
    // task is TaskSuite
    console.log('suite', task.name)
  }
}
WARNING
Note that suite.children will only iterate the first level of nesting, it won't go deeper. If you need to iterate over all tests or suites, use children.allTests() or children.allSuites(). If you need to iterate over everything, use recursive function:
function visit(collection: TestCollection) {
  for (const task of collection) {
    if (task.type === 'suite') {
      // report a suite
      visit(task.children)
    }
    else {
      // report a test
    }
  }
}
ok
function ok(): boolean
Checks if the suite has any failed tests. This will also return false if suite failed during collection. In that case, check the errors() for thrown errors.
state
function state(): TestSuiteState
Checks the running state of the suite. Possible return values:
pending: the tests in this suite did not finish running yet.
failed: this suite has failed tests or they couldn't be collected. If errors() is not empty, it means the suite failed to collect tests.
passed: every test inside this suite has passed.
skipped: this suite was skipped during collection.
WARNING
Note that test module also has a state method that returns the same values, but it can also return an additional queued state if the module wasn't executed yet.
errors
function errors(): TestError[]
Errors that happened outside of the test run during collection, like syntax errors.
import { describe } from 'vitest'

describe('collection failed', () => {
  throw new Error('a custom error')
})
WARNING
Note that errors are serialized into simple objects: instanceof Error will always return false.
meta 3.1.0+
function meta(): TaskMeta
Custom metadata that was attached to the suite during its execution or collection. The meta can be attached by assigning a property to the task.meta object during a test run:
import { test } from 'vitest'

describe('the validation works correctly', (task) => {
  // assign "decorated" during collection
  task.meta.decorated = false

  test('some test', ({ task }) => {
    // assign "decorated" during test run, it will be available
    // only in onTestCaseReady hook
    task.suite.meta.decorated = false
  })
})
TIP
If metadata was attached during collection (outside of the test function), then it will be available in onTestModuleCollected hook in the custom reporter.
Suggest changes to this page
Last updated: 3/31/25, 5:12 AM
Pager
Previous page
TestCase
Next page
TestModule
TestModule
The TestModule class represents a single module in a single project. This class is only available in the main thread. Refer to the "Runner API" if you are working with runtime tasks.
The TestModule instance always has a type property with the value of module. You can use it to distinguish between different task types:
if (task.type === 'module') {
  task // TestModule
}
Extending Suite Methods
The TestModule class inherits all methods and properties from the TestSuite. This guide will only list methods and properties unique to the TestModule.
moduleId
This is usually an absolute unix file path (even on Windows). It can be a virtual id if the file is not on the disk. This value corresponds to Vite's ModuleGraph id.
'C:/Users/Documents/project/example.test.ts' // ✅
'/Users/mac/project/example.test.ts' // ✅
'C:\\Users\\Documents\\project\\example.test.ts' // ❌
state
function state(): TestModuleState
Works the same way as testSuite.state(), but can also return queued if module wasn't executed yet.
meta 3.1.0+
function meta(): TaskMeta
Custom metadata that was attached to the module during its execution or collection. The meta can be attached by assigning a property to the task.meta object during a test run:
import { test } from 'vitest'

describe('the validation works correctly', (task) => {
  // assign "decorated" during collection
  task.file.meta.decorated = false

  test('some test', ({ task }) => {
    // assign "decorated" during test run, it will be available
    // only in onTestCaseReady hook
    task.file.meta.decorated = false
  })
})
TIP
If metadata was attached during collection (outside of the test function), then it will be available in onTestModuleCollected hook in the custom reporter.
diagnostic
function diagnostic(): ModuleDiagnostic
Useful information about the module like duration, memory usage, etc. If the module was not executed yet, all diagnostic values will return 0.
interface ModuleDiagnostic {
  /**
   * The time it takes to import and initiate an environment.
   */
  readonly environmentSetupDuration: number
  /**
   * The time it takes Vitest to setup test harness (runner, mocks, etc.).
   */
  readonly prepareDuration: number
  /**
   * The time it takes to import the test module.
   * This includes importing everything in the module and executing suite callbacks.
   */
  readonly collectDuration: number
  /**
   * The time it takes to import the setup module.
   */
  readonly setupDuration: number
  /**
   * Accumulated duration of all tests and hooks in the module.
   */
  readonly duration: number
  /**
   * The amount of memory used by the module in bytes.
   * This value is only available if the test was executed with `logHeapUsage` flag.
   */
  readonly heap: number | undefined
  /**
   * The time spent importing every non-externalized dependency that Vitest has processed.
   */
  readonly importDurations: Record<string, ImportDuration>
}

/** The time spent importing & executing a non-externalized file. */
interface ImportDuration {
  /** The time spent importing & executing the file itself, not counting all non-externalized imports that the file does. */
  selfTime: number

  /** The time spent importing & executing the file and all its imports. */
  totalTime: number
}
Suggest changes to this page
Last updated: 5/29/25, 3:39 AM
Pager
Previous page
TestSuite
Next page
TestCollection
TestCollection
TestCollection represents a collection of top-level suites and tests in a suite or a module. It also provides useful methods to iterate over itself.
INFO
Most methods return an iterator instead of an array for better performance in case you don't need every item in the collection. If you prefer working with array, you can spread the iterator: [...children.allSuites()].
Also note that the collection itself is an iterator:
for (const child of module.children) {
  console.log(child.type, child.name)
}
size
The number of tests and suites in the collection.
WARNING
This number includes only tests and suites at the top-level, it doesn't include nested suites and tests.
at
function at(index: number): TestCase | TestSuite | undefined
Returns the test or suite at a specific index. This method accepts negative indexes.
array
function array(): (TestCase | TestSuite)[]
The same collection but as an array. This is useful if you want to use Array methods like map and filter that are not supported by the TaskCollection implementation.
allSuites
function allSuites(): Generator<TestSuite, undefined, void>
Filters all suites that are part of this collection and its children.
for (const suite of module.children.allSuites()) {
  if (suite.errors().length) {
    console.log('failed to collect', suite.errors())
  }
}
allTests
function allTests(state?: TestState): Generator<TestCase, undefined, void>
Filters all tests that are part of this collection and its children.
for (const test of module.children.allTests()) {
  if (test.result().state === 'pending') {
    console.log('test', test.fullName, 'did not finish')
  }
}
You can pass down a state value to filter tests by the state.
tests
function tests(state?: TestState): Generator<TestCase, undefined, void>
Filters only the tests that are part of this collection. You can pass down a state value to filter tests by the state.
suites
function suites(): Generator<TestSuite, undefined, void>
Filters only the suites that are part of this collection.
Suggest changes to this page
Last updated: 1/14/25, 9:46 AM
Pager
Previous page
TestModule
Next page
Plugin API
TestCollection
TestCollection represents a collection of top-level suites and tests in a suite or a module. It also provides useful methods to iterate over itself.
INFO
Most methods return an iterator instead of an array for better performance in case you don't need every item in the collection. If you prefer working with array, you can spread the iterator: [...children.allSuites()].
Also note that the collection itself is an iterator:
for (const child of module.children) {
  console.log(child.type, child.name)
}
size
The number of tests and suites in the collection.
WARNING
This number includes only tests and suites at the top-level, it doesn't include nested suites and tests.
at
function at(index: number): TestCase | TestSuite | undefined
Returns the test or suite at a specific index. This method accepts negative indexes.
array
function array(): (TestCase | TestSuite)[]
The same collection but as an array. This is useful if you want to use Array methods like map and filter that are not supported by the TaskCollection implementation.
allSuites
function allSuites(): Generator<TestSuite, undefined, void>
Filters all suites that are part of this collection and its children.
for (const suite of module.children.allSuites()) {
  if (suite.errors().length) {
    console.log('failed to collect', suite.errors())
  }
}
allTests
function allTests(state?: TestState): Generator<TestCase, undefined, void>
Filters all tests that are part of this collection and its children.
for (const test of module.children.allTests()) {
  if (test.result().state === 'pending') {
    console.log('test', test.fullName, 'did not finish')
  }
}
You can pass down a state value to filter tests by the state.
tests
function tests(state?: TestState): Generator<TestCase, undefined, void>
Filters only the tests that are part of this collection. You can pass down a state value to filter tests by the state.
suites
function suites(): Generator<TestSuite, undefined, void>
Filters only the suites that are part of this collection.
Suggest changes to this page
Last updated: 1/14/25, 9:46 AM
Pager
Previous page
TestModule
Next page
Plugin API
Plugin API 3.1.0+
WARNING
This is an advanced API. If you just want to run tests, you probably don't need this. It is primarily used by library authors.
This guide assumes you know how to work with Vite plugins.
Vitest supports an experimental configureVitest plugin hook hook since version 3.1. Any feedback regarding this API is welcome in GitHub.
only vitest
vite and vitest
import type { Vite, VitestPluginContext } from 'vitest/node'

export function plugin(): Vite.Plugin {
  return {
    name: 'vitest:my-plugin',
    configureVitest(context: VitestPluginContext) {
      // ...
    }
  }
}
TypeScript
Vitest re-exports all Vite type-only imports via a Vite namespace, which you can use to keep your versions in sync. However, if you are writing a plugin for both Vite and Vitest, you can continue using the Plugin type from the vite entrypoint. Just make sure you have vitest/config referenced somewhere so that configureVitest is augmented correctly:
/// <reference types="vitest/config" />
Unlike reporter.onInit, this hooks runs early in Vitest lifecycle allowing you to make changes to configuration like coverage and reporters. A more notable change is that you can manipulate the global config from a test project if your plugin is defined in the project and not in the global config.
Context
project
The current test project that the plugin belongs to.
Browser Mode
Note that if you are relying on a browser feature, the project.browser field is not set yet. Use reporter.onBrowserInit event instead.
vitest
The global Vitest instance. You can change the global configuration by directly mutating the vitest.config property:
vitest.config.coverage.enabled = false
vitest.config.reporters.push([['my-reporter', {}]])
Config is Resolved
Note that Vitest already resolved the config, so some types might be different from the usual user configuration. This also means that some properties will not be resolved again, like setupFile. If you are adding new files, make sure to resolve it first.
At this point reporters are not created yet, so modifying vitest.reporters will have no effect because it will be overwritten. If you need to inject your own reporter, modify the config instead.
injectTestProjects
function injectTestProjects(
  config: TestProjectConfiguration | TestProjectConfiguration[]
): Promise<TestProject[]>
This methods accepts a config glob pattern, a filepath to the config or an inline configuration. It returns an array of resolved test projects.
// inject a single project with a custom alias
const newProjects = await injectTestProjects({
  // you can inherit the current project config by referencing `extends`
  // note that you cannot have a project with the name that already exists,
  // so it's a good practice to define a custom name
  extends: project.vite.config.configFile,
  test: {
    name: 'my-custom-alias',
    alias: {
      customAlias: resolve('./custom-path.js'),
    },
  },
})
Projects are Filtered
Vitest filters projects during the config resolution, so if the user defined a filter, injected project might not be resolved unless it matches the filter. You can update the filter via the vitest.config.project option to always include your test project:
vitest.config.project.push('my-project-name')
Note that this will only affect projects injected with injectTestProjects method.
Referencing the Current Config
If you want to keep the user configuration, you can specify the extends property. All other properties will be merged with the user defined config.
The project's configFile can be accessed in Vite's config: project.vite.config.configFile.
Note that this will also inherit the name - Vitest doesn't allow multiple projects with the same name, so this will throw an error. Make sure you specified a different name. You can access the current name via the project.name property and all used names are available in the vitest.projects array.
Suggest changes to this page
Last updated: 5/5/25, 11:49 AM
Pager
Previous page
TestCollection
Next page
Runner API
Runner API
WARNING
This is advanced API. If you just want to run tests, you probably don't need this. It is primarily used by library authors.
You can specify a path to your test runner with the runner option in your configuration file. This file should have a default export with a class constructor implementing these methods:
export interface VitestRunner {
  /**
   * First thing that's getting called before actually collecting and running tests.
   */
  onBeforeCollect?: (paths: string[]) => unknown
  /**
   * Called after collecting tests and before "onBeforeRun".
   */
  onCollected?: (files: File[]) => unknown

  /**
   * Called when test runner should cancel next test runs.
   * Runner should listen for this method and mark tests and suites as skipped in
   * "onBeforeRunSuite" and "onBeforeRunTask" when called.
   */
  onCancel?: (reason: CancelReason) => unknown

  /**
   * Called before running a single test. Doesn't have "result" yet.
   */
  onBeforeRunTask?: (test: TaskPopulated) => unknown
  /**
   * Called before actually running the test function. Already has "result" with "state" and "startTime".
   */
  onBeforeTryTask?: (test: TaskPopulated, options: { retry: number; repeats: number }) => unknown
  /**
   * Called after result and state are set.
   */
  onAfterRunTask?: (test: TaskPopulated) => unknown
  /**
   * Called right after running the test function. Doesn't have new state yet. Will not be called, if the test function throws.
   */
  onAfterTryTask?: (test: TaskPopulated, options: { retry: number; repeats: number }) => unknown

  /**
   * Called before running a single suite. Doesn't have "result" yet.
   */
  onBeforeRunSuite?: (suite: Suite) => unknown
  /**
   * Called after running a single suite. Has state and result.
   */
  onAfterRunSuite?: (suite: Suite) => unknown

  /**
   * If defined, will be called instead of usual Vitest suite partition and handling.
   * "before" and "after" hooks will not be ignored.
   */
  runSuite?: (suite: Suite) => Promise<void>
  /**
   * If defined, will be called instead of usual Vitest handling. Useful, if you have your custom test function.
   * "before" and "after" hooks will not be ignored.
   */
  runTask?: (test: TaskPopulated) => Promise<void>

  /**
   * Called, when a task is updated. The same as "onTaskUpdate" in a reporter, but this is running in the same thread as tests.
   */
  onTaskUpdate?: (task: [string, TaskResult | undefined, TaskMeta | undefined][]) => Promise<void>

  /**
   * Called before running all tests in collected paths.
   */
  onBeforeRunFiles?: (files: File[]) => unknown
  /**
   * Called right after running all tests in collected paths.
   */
  onAfterRunFiles?: (files: File[]) => unknown
  /**
   * Called when new context for a test is defined. Useful, if you want to add custom properties to the context.
   * If you only want to define custom context with a runner, consider using "beforeAll" in "setupFiles" instead.
   */
  extendTaskContext?: (context: TestContext) => TestContext
  /**
   * Called when certain files are imported. Can be called in two situations: to collect tests and to import setup files.
   */
  importFile: (filepath: string, source: VitestRunnerImportSource) => unknown
  /**
   * Function that is called when the runner attempts to get the value when `test.extend` is used with `{ injected: true }`
   */
  injectValue?: (key: string) => unknown
  /**
   * Publicly available configuration.
   */
  config: VitestRunnerConfig
  /**
   * The name of the current pool. Can affect how stack trace is inferred on the server side.
   */
  pool?: string
}
When initiating this class, Vitest passes down Vitest config, - you should expose it as a config property:
runner.ts
import type { RunnerTestFile } from 'vitest'
import type { VitestRunner, VitestRunnerConfig } from 'vitest/suite'
import { VitestTestRunner } from 'vitest/runners'

class CustomRunner extends VitestTestRunner implements VitestRunner {
  public config: VitestRunnerConfig

  constructor(config: VitestRunnerConfig) {
    this.config = config
  }

  onAfterRunFiles(files: RunnerTestFile[]) {
    console.log('finished running', files)
  }
}

export default CustomRunner
WARNING
Vitest also injects an instance of ViteNodeRunner as __vitest_executor property. You can use it to process files in importFile method (this is default behavior of TestRunner and BenchmarkRunner).
ViteNodeRunner exposes executeId method, which is used to import test files in a Vite-friendly environment. Meaning, it will resolve imports and transform file content at runtime so that Node can understand it:
export default class Runner {
  async importFile(filepath: string) {
    await this.__vitest_executor.executeId(filepath)
  }
}
WARNING
If you don't have a custom runner or didn't define runTest method, Vitest will try to retrieve a task automatically. If you didn't add a function with setFn, it will fail.
TIP
Snapshot support and some other features depend on the runner. If you don't want to lose it, you can extend your runner from VitestTestRunner imported from vitest/runners. It also exposes BenchmarkNodeRunner, if you want to extend benchmark functionality.
Tasks
WARNING
The "Runner Tasks API" is experimental and should primarily be used only in the test runtime. Vitest also exposes the "Reported Tasks API", which should be preferred when working in the main thread (inside the reporter, for example).
The team is currently discussing if "Runner Tasks" should be replaced by "Reported Tasks" in the future.
Suites and tests are called tasks internally. Vitest runner initiates a File task before collecting any tests - this is a superset of Suite with a few additional properties. It is available on every task (including File) as a file property.
interface File extends Suite {
  /**
   * The name of the pool that the file belongs to.
   * @default 'forks'
   */
  pool?: string
  /**
   * The path to the file in UNIX format.
   */
  filepath: string
  /**
   * The name of the test project the file belongs to.
   */
  projectName: string | undefined
  /**
   * The time it took to collect all tests in the file.
   * This time also includes importing all the file dependencies.
   */
  collectDuration?: number
  /**
   * The time it took to import the setup file.
   */
  setupDuration?: number
}
Every suite has a tasks property that is populated during collection phase. It is useful to traverse the task tree from the top down.
interface Suite extends TaskBase {
  type: 'suite'
  /**
   * File task. It's the root task of the file.
   */
  file: File
  /**
   * An array of tasks that are part of the suite.
   */
  tasks: Task[]
}
Every task has a suite property that references a suite it is located in. If test or describe are initiated at the top level, they will not have a suite property (it will not be equal to file!). File also never has a suite property. It is useful to travers the tasks from the bottom up.
interface Test<ExtraContext = object> extends TaskBase {
  type: 'test'
  /**
   * Test context that will be passed to the test function.
   */
  context: TestContext & ExtraContext
  /**
   * File task. It's the root task of the file.
   */
  file: File
  /**
   * Whether the task was skipped by calling `context.skip()`.
   */
  pending?: boolean
  /**
   * Whether the task should succeed if it fails. If the task fails, it will be marked as passed.
   */
  fails?: boolean
  /**
   * Store promises (from async expects) to wait for them before finishing the test
   */
  promises?: Promise<any>[]
}
Every task can have a result field. Suites can only have this field if an error thrown within a suite callback or beforeAll/afterAll callbacks prevents them from collecting tests. Tests always have this field after their callbacks are called - the state and errors fields are present depending on the outcome. If an error was thrown in beforeEach or afterEach callbacks, the thrown error will be present in task.result.errors.
export interface TaskResult {
  /**
   * State of the task. Inherits the `task.mode` during collection.
   * When the task has finished, it will be changed to `pass` or `fail`.
   * - **pass**: task ran successfully
   * - **fail**: task failed
   */
  state: TaskState
  /**
   * Errors that occurred during the task execution. It is possible to have several errors
   * if `expect.soft()` failed multiple times.
   */
  errors?: ErrorWithDiff[]
  /**
   * How long in milliseconds the task took to run.
   */
  duration?: number
  /**
   * Time in milliseconds when the task started running.
   */
  startTime?: number
  /**
   * Heap size in bytes after the task finished.
   * Only available if `logHeapUsage` option is set and `process.memoryUsage` is defined.
   */
  heap?: number
  /**
   * State of related to this task hooks. Useful during reporting.
   */
  hooks?: Partial<Record<'afterAll' | 'beforeAll' | 'beforeEach' | 'afterEach', TaskState>>
  /**
   * The amount of times the task was retried. The task is retried only if it
   * failed and `retry` option is set.
   */
  retryCount?: number
  /**
   * The amount of times the task was repeated. The task is repeated only if
   * `repeats` option is set. This number also contains `retryCount`.
   */
  repeatCount?: number
}
Your Task Function
Vitest exposes createTaskCollector utility to create your own test method. It behaves the same way as a test, but calls a custom method during collection.
A task is an object that is part of a suite. It is automatically added to the current suite with a suite.task method:
custom.js
import { createTaskCollector, getCurrentSuite } from 'vitest/suite'

export { afterAll, beforeAll, describe } from 'vitest'

// this function will be called during collection phase:
// don't call function handler here, add it to suite tasks
// with "getCurrentSuite().task()" method
// note: createTaskCollector provides support for "todo"/"each"/...
export const myCustomTask = createTaskCollector(
  function (name, fn, timeout) {
    getCurrentSuite().task(name, {
      ...this, // so "todo"/"skip"/... is tracked correctly
      meta: {
        customPropertyToDifferentiateTask: true
      },
      handler: fn,
      timeout,
    })
  }
)
tasks.test.js
import {
  afterAll,
  beforeAll,
  describe,
  myCustomTask
} from './custom.js'
import { gardener } from './gardener.js'

describe('take care of the garden', () => {
  beforeAll(() => {
    gardener.putWorkingClothes()
  })

  myCustomTask('weed the grass', () => {
    gardener.weedTheGrass()
  })
  myCustomTask.todo('mow the lawn', () => {
    gardener.mowerTheLawn()
  })
  myCustomTask('water flowers', () => {
    gardener.waterFlowers()
  })

  afterAll(() => {
    gardener.goHome()
  })
})
vitest ./garden/tasks.test.js
Suggest changes to this page
Last updated: 5/5/25, 11:49 AM
Pager
Previous page
Plugin API
Next page
Reporters API
Reporters
WARNING
This is an advanced API. If you just want to configure built-in reporters, read the "Reporters" guide.
Vitest has its own test run lifecycle. These are represented by reporter's methods:
onInit
onTestRunStart
onTestModuleQueued
onTestModuleCollected
onTestModuleStart
onTestSuiteReady
onHookStart(beforeAll)
onHookEnd(beforeAll)
onTestCaseReady
onTestAnnotate 3.2.0+
onHookStart(beforeEach)
onHookEnd(beforeEach)
onHookStart(afterEach)
onHookEnd(afterEach)
onTestCaseResult
onHookStart(afterAll)
onHookEnd(afterAll)
onTestSuiteResult
onTestModuleEnd
onTestRunEnd
Tests and suites within a single module will be reported in order unless they were skipped. All skipped tests are reported at the end of suite/module.
Note that since test modules can run in parallel, Vitest will report them in parallel.
This guide lists all supported reporter methods. However, don't forget that instead of creating your own reporter, you can extend existing one instead:
custom-reporter.js
import { BaseReporter } from 'vitest/reporters'

export default class CustomReporter extends BaseReporter {
  onTestRunEnd(testModules, errors) {
    console.log(testModule.length, 'tests finished running')
    super.onTestRunEnd(testModules, errors)
  }
}
onInit
function onInit(vitest: Vitest): Awaitable<void>
This method is called when Vitest was initiated or started, but before the tests were filtered.
INFO
Internally this method is called inside vitest.start, vitest.init or vitest.mergeReports. If you are using programmatic API, make sure to call either one depending on your needs before calling vitest.runTestSpecifications, for example. Built-in CLI will always run methods in correct order.
Note that you can also get access to vitest instance from test cases, suites and test modules via a project property, but it might also be useful to store a reference to vitest in this method.
onBrowserInit experimental
function onBrowserInit(project: TestProject): Awaitable<void>
This method is called when the browser instance is initiated. It receives an instance of the project for which the browser is initiated. project.browser will always be defined when this method is called.
onTestRunStart
function onTestRunStart(
  specifications: TestSpecification[]
): Awaitable<void>
This method is called when a new test run has started. It receives an array of test specifications scheduled to run. This array is readonly and available only for information purposes.
If Vitest didn't find any test files to run, this event will be invoked with an empty array, and then onTestRunEnd will be called immediately after.
DEPRECATION NOTICE
This method was added in Vitest 3, replacing onPathsCollected and onSpecsCollected, both of which are now deprecated.
onTestRunEnd
function onTestRunEnd(
  testModules: ReadonlyArray<TestModule>,
  unhandledErrors: ReadonlyArray<SerializedError>,
  reason: TestRunEndReason
): Awaitable<void>
This method is called after all tests have finished running and the coverage merged all reports, if it's enabled. Note that you can get the coverage information in onCoverage hook.
It receives a readonly list of test modules. You can iterate over it via a testModule.children property to report the state and errors, if any.
The second argument is a readonly list of unhandled errors that Vitest wasn't able to attribute to any test. These can happen outside of the test run because of an error in a plugin, or inside the test run as a side-effect of a non-awaited function (for example, a timeout that threw an error after the test has finished running).
The third argument indicated why the test run was finished:
passed: test run was finished normally and there are no errors
failed: test run has at least one error (due to a syntax error during collection or an actual error during test execution)
interrupted: test was interrupted by vitest.cancelCurrentRun call or Ctrl+C was pressed in the terminal (note that it's still possible to have failed tests in this case)
If Vitest didn't find any test files to run, this event will be invoked with empty arrays of modules and errors, and the state will depend on the value of config.passWithNoTests.
DEPRECATION NOTICE
This method was added in Vitest 3, replacing onFinished, which is now deprecated.
onCoverage
function onCoverage(coverage: unknown): Awaitable<void>
This hook is called after coverage results have been processed. Coverage provider's reporters are called after this hook. The typings of coverage depends on the coverage.provider. For Vitest's default built-in providers you can import the types from istanbul-lib-coverage package:
import type { CoverageMap } from 'istanbul-lib-coverage'

declare function onCoverage(coverage: CoverageMap): Awaitable<void>
If Vitest didn't perform any coverage, this hook is not called.
onTestModuleQueued
function onTestModuleQueued(testModule: TestModule): Awaitable<void>
This method is called right before Vitest imports the setup file and the test module itself. This means that testModule will have no children yet, but you can start reporting it as the next test to run.
onTestModuleCollected
function onTestModuleCollected(testModule: TestModule): Awaitable<void>
This method is called when all tests inside the file were collected, meaning testModule.children collection is populated, but tests don't have any results yet.
onTestModuleStart
function onTestModuleStart(testModule: TestModule): Awaitable<void>
This method is called right after onTestModuleCollected unless Vitest runs in collection mode (vitest.collect() or vitest collect in the CLI), in this case it will not be called at all because there are no tests to run.
onTestModuleEnd
function onTestModuleEnd(testModule: TestModule): Awaitable<void>
This method is called when every test in the module finished running. This means, every test inside testModule.children will have a test.result() that is not equal to pending.
onHookStart
function onHookStart(context: ReportedHookContext): Awaitable<void>
This method is called when any of these hooks have started running:
beforeAll
afterAll
beforeEach
afterEach
If beforeAll or afterAll are started, the entity will be either TestSuite or TestModule.
If beforeEach or afterEach are started, the entity will always be TestCase.
WARNING
onHookStart method will not be called if the hook did not run during the test run.
onHookEnd
function onHookEnd(context: ReportedHookContext): Awaitable<void>
This method is called when any of these hooks have finished running:
beforeAll
afterAll
beforeEach
afterEach
If beforeAll or afterAll have finished, the entity will be either TestSuite or TestModule.
If beforeEach or afterEach have finished, the entity will always be TestCase.
WARNING
onHookEnd method will not be called if the hook did not run during the test run.
onTestSuiteReady
function onTestSuiteReady(testSuite: TestSuite): Awaitable<void>
This method is called before the suite starts to run its tests. This method is also called if the suite was skipped.
If the file doesn't have any suites, this method will not be called. Consider using onTestModuleStart to cover this use case.
onTestSuiteResult
function onTestSuiteResult(testSuite: TestSuite): Awaitable<void>
This method is called after the suite has finished running tests. This method is also called if the suite was skipped.
If the file doesn't have any suites, this method will not be called. Consider using onTestModuleEnd to cover this use case.
onTestCaseReady
function onTestCaseReady(testCase: TestCase): Awaitable<void>
This method is called before the test starts to run or it was skipped. Note that beforeEach and afterEach hooks are considered part of the test because they can influence the result.
WARNING
Notice that it's possible to have testCase.result() with passed or failed state already when onTestCaseReady is called. This can happen if test was running too fast and both onTestCaseReady and onTestCaseResult were scheduled to run in the same microtask.
onTestCaseResult
function onTestCaseResult(testCase: TestCase): Awaitable<void>
This method is called when the test has finished running or was just skipped. Note that this will be called after the afterEach hook is finished, if there are any.
At this point, testCase.result() will have non-pending state.
onTestAnnotate 3.2.0+
function onTestAnnotate(
  testCase: TestCase,
  annotation: TestAnnotation,
): Awaitable<void>
The onTestAnnotate hook is associated with the context.annotate method. When annotate is invoked, Vitest serialises it and sends the same attachment to the main thread where reporter can interact with it.
If the path is specified, Vitest stores it in a separate directory (configured by attachmentsDir) and modifies the path property to reference it.
Suggest changes to this page
Last updated: 5/30/25, 11:56 AM
Pager
Previous page
Runner API
Next page
Task Metadata
Task Metadata
WARNING
Vitest exposes experimental private API. Breaking changes might not follow SemVer, please pin Vitest's version when using it.
If you are developing a custom reporter or using Vitest Node.js API, you might find it useful to pass data from tests that are being executed in various contexts to your reporter or custom Vitest handler.
To accomplish this, relying on the test context is not feasible since it cannot be serialized. However, with Vitest, you can utilize the meta property available on every task (suite or test) to share data between your tests and the Node.js process. It's important to note that this communication is one-way only, as the meta property can only be modified from within the test context. Any changes made within the Node.js context will not be visible in your tests.
You can populate meta property on test context or inside beforeAll/afterAll hooks for suite tasks.
afterAll((suite) => {
  suite.meta.done = true
})

test('custom', ({ task }) => {
  task.meta.custom = 'some-custom-handler'
})
Once a test is completed, Vitest will send a task including the result and meta to the Node.js process using RPC, and then report it in onTestCaseResult and other hooks that have access to tasks. To process this test case, you can utilize the onTestCaseResult method available in your reporter implementation:
custom-reporter.js
import type { Reporter, TestCase, TestModule } from 'vitest/node'

export default {
  onTestCaseResult(testCase: TestCase) {
    // custom === 'some-custom-handler' ✅
    const { custom } = testCase.meta()
  },
  onTestRunEnd(testModule: TestModule) {
    testModule.meta().done === true
    testModule.children.at(0).meta().custom === 'some-custom-handler'
  }
} satisfies Reporter
BEWARE
Vitest uses different methods to communicate with the Node.js process.
If Vitest runs tests inside worker threads, it will send data via message port
If Vitest uses child process, the data will be send as a serialized Buffer via process.send API
If Vitest runs tests in the browser, the data will be stringified using flatted package
This property is also present on every test in the json reporter, so make sure that data can be serialized into JSON.
Also, make sure you serialize Error properties before you set them.
You can also get this information from Vitest state when tests finished running:
const vitest = await createVitest('test')
const { testModules } = await vitest.start()

const testModule = testModules[0]
testModule.meta().done === true
testModule.children.at(0).meta().custom === 'some-custom-handler'
It's also possible to extend type definitions when using TypeScript:
declare module 'vitest' {
  interface TaskMeta {
    done?: boolean
    custom?: string
  }
}
Suggest changes to this page
Last updated: 1/14/25, 9:46 AM
Pager
Previous page
Reporters API
Next page
Running Tests
Running Tests
WARNING
This guide explains how to use the advanced API to run tests via a Node.js script. If you just want to run tests, you probably don't need this. It is primarily used by library authors.
Breaking changes might not follow SemVer, please pin Vitest's version when using the experimental API.
Vitest exposes two methods to initiate Vitest:
startVitest initiates Vitest, validates the packages are installed and runs tests immediately
createVitest only initiates Vitest and doesn't run any tests
startVitest
import { startVitest } from 'vitest/node'

const vitest = await startVitest(
  'test',
  [], // CLI filters
  {}, // override test config
  {}, // override Vite config
  {}, // custom Vitest options
)
const testModules = vitest.state.getTestModules()
for (const testModule of testModules) {
  console.log(testModule.moduleId, testModule.ok() ? 'passed' : 'failed')
}
TIP
TestModule, TestSuite and TestCase APIs are not experimental and follow SemVer since Vitest 2.1.
createVitest
Creates a Vitest instances without running tests.
createVitest method doesn't validate that required packages are installed. It also doesn't respect config.standalone or config.mergeReports. Vitest won't be closed automatically even if watch is disabled.
import { createVitest } from 'vitest/node'

const vitest = await createVitest(
  'test',
  {}, // override test config
  {}, // override Vite config
  {}, // custom Vitest options
)

// called when `vitest.cancelCurrentRun()` is invoked
vitest.onCancel(() => {})
// called during `vitest.close()` call
vitest.onClose(() => {})
// called when Vitest reruns test files
vitest.onTestsRerun((files) => {})

try {
  // this will set process.exitCode to 1 if tests failed,
  // and won't close the process automatically
  await vitest.start(['my-filter'])
}
catch (err) {
  // this can throw
  // "FilesNotFoundError" if no files were found
  // "GitNotFoundError" with `--changed` and repository is not initialized
}
finally {
  await vitest.close()
}
If you intend to keep the Vitest instance, make sure to at least call init. This will initialise reporters and the coverage provider, but won't run any tests. It is also recommended to enable the watch mode even if you don't intend to use the Vitest watcher, but want to keep the instance running. Vitest relies on this flag for some of its features to work correctly in a continuous process.
After reporters are initialised, use runTestSpecifications or rerunTestSpecifications to run tests if manual run is required:
watcher.on('change', async (file) => {
  const specifications = vitest.getModuleSpecifications(file)
  if (specifications.length) {
    vitest.invalidateFile(file)
    // you can use runTestSpecifications if "reporter.onWatcher*" hooks
    // should not be invoked
    await vitest.rerunTestSpecifications(specifications)
  }
})
WARNING
The example above shows a potential use-case if you disable the default watcher behaviour. By default, Vitest already reruns tests if files change.
Also note that getModuleSpecifications will not resolve test files unless they were already processed by globTestSpecifications. If the file was just created, use project.matchesGlobPattern instead:
watcher.on('add', async (file) => {
  const specifications = []
  for (const project of vitest.projects) {
    if (project.matchesGlobPattern(file)) {
      specifications.push(project.createSpecification(file))
    }
  }

  if (specifications.length) {
    await vitest.rerunTestSpecifications(specifications)
  }
})
In cases where you need to disable the watcher, you can pass down server.watch: null since Vite 5.3 or server.watch: { ignored: ['*/*'] } to a Vite config:
await createVitest(
  'test',
  {},
  {
    plugins: [
      {
        name: 'stop-watcher',
        async configureServer(server) {
          await server.watcher.close()
        }
      }
    ],
    server: {
      watch: null,
    },
  }
)
Suggest changes to this page
Last updated: 3/14/25, 3:20 AM
Pager
Previous page
Task Metadata
Next page
Extending Reporters
Extending Reporters
WARNING
This is an advanced API. If you just want to configure built-in reporters, read the "Reporters" guide.
You can import reporters from vitest/reporters and extend them to create your custom reporters.
Extending Built-in Reporters
In general, you don't need to create your reporter from scratch. vitest comes with several default reporting programs that you can extend.
import { DefaultReporter } from 'vitest/reporters'

export default class MyDefaultReporter extends DefaultReporter {
  // do something
}
Of course, you can create your reporter from scratch. Just extend the BaseReporter class and implement the methods you need.
And here is an example of a custom reporter:
custom-reporter.js
import { BaseReporter } from 'vitest/reporters'

export default class CustomReporter extends BaseReporter {
  onCollected() {
    const files = this.ctx.state.getFiles(this.watchFilters)
    this.reportTestSummary(files)
  }
}
Or implement the Reporter interface:
custom-reporter.js
import type { Reporter } from 'vitest/node'

export default class CustomReporter implements Reporter {
  onCollected() {
    // print something
  }
}
Then you can use your custom reporter in the vitest.config.ts file:
vitest.config.ts
import { defineConfig } from 'vitest/config'
import CustomReporter from './custom-reporter.js'

export default defineConfig({
  test: {
    reporters: [new CustomReporter()],
  },
})
Reported Tasks
Instead of using the tasks that reporters receive, it is recommended to use the Reported Tasks API instead.
You can get access to this API by calling vitest.state.getReportedEntity(runnerTask):
import type { Reporter, RunnerTestFile, TestModule, Vitest } from 'vitest/node'

class MyReporter implements Reporter {
  private vitest!: Vitest

  onInit(vitest: Vitest) {
    this.vitest = vitest
  }

  onFinished(files: RunnerTestFile[]) {
    for (const file of files) {
      // note that the old task implementation uses "file" instead of "module"
      const testModule = this.vitest.state.getReportedEntity(file) as TestModule
      for (const task of testModule.children) {
        console.log('finished', task.type, task.fullName)
      }
    }
  }
}
Exported Reporters
vitest comes with a few built-in reporters that you can use out of the box.
Built-in reporters:
BasicReporter
DefaultReporter
DotReporter
JsonReporter
VerboseReporter
TapReporter
JUnitReporter
TapFlatReporter
HangingProcessReporter
Base Abstract reporters:
BaseReporter
Interface reporters:
Reporter
Suggest changes to this page
Last updated: 1/13/25, 11:42 PM
Pager
Previous page
Running Tests
Next page
Custom Pool
(property) SuiteImplementation.children: TestCollection
Collection of suites and tests that are part of this suite.
Custom Pool
WARNING
This is an advanced and very low-level API. If you just want to run tests, you probably don't need this. It is primarily used by library authors.
Vitest runs tests in pools. By default, there are several pools:
threads to run tests using node:worker_threads (isolation is provided with a new worker context)
forks to run tests using node:child_process (isolation is provided with a new child_process.fork process)
vmThreads to run tests using node:worker_threads (but isolation is provided with vm module instead of a new worker context)
browser to run tests using browser providers
typescript to run typechecking on tests
You can provide your own pool by specifying a file path:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // will run every file with a custom pool by default
    pool: './my-custom-pool.ts',
    // you can provide options using `poolOptions` object
    poolOptions: {
      myCustomPool: {
        customProperty: true,
      },
    },
  },
})
If you need to run tests in different pools, use the projects feature:
vitest.config.ts
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          pool: 'threads',
        },
      },
    ],
  },
})
API
The file specified in pool option should export a function (can be async) that accepts Vitest interface as its first option. This function needs to return an object matching ProcessPool interface:
import type { ProcessPool, TestSpecification } from 'vitest/node'

export interface ProcessPool {
  name: string
  runTests: (files: TestSpecification[], invalidates?: string[]) => Promise<void>
  collectTests: (files: TestSpecification[], invalidates?: string[]) => Promise<void>
  close?: () => Promise<void>
}
The function is called only once (unless the server config was updated), and it's generally a good idea to initialize everything you need for tests inside that function and reuse it when runTests is called.
Vitest calls runTest when new tests are scheduled to run. It will not call it if files is empty. The first argument is an array of TestSpecifications. Files are sorted using sequencer before runTests is called. It's possible (but unlikely) to have the same file twice, but it will always have a different project - this is implemented via projects configuration.
Vitest will wait until runTests is executed before finishing a run (i.e., it will emit onFinished only after runTests is resolved).
If you are using a custom pool, you will have to provide test files and their results yourself - you can reference vitest.state for that (most important are collectFiles and updateTasks). Vitest uses startTests function from @vitest/runner package to do that.
Vitest will call collectTests if vitest.collect is called or vitest list is invoked via a CLI command. It works the same way as runTests, but you don't have to run test callbacks, only report their tasks by calling vitest.state.collectFiles(files).
To communicate between different processes, you can create methods object using createMethodsRPC from vitest/node, and use any form of communication that you prefer. For example, to use WebSockets with birpc you can write something like this:
import { createBirpc } from 'birpc'
import { parse, stringify } from 'flatted'
import { createMethodsRPC, TestProject } from 'vitest/node'

function createRpc(project: TestProject, wss: WebSocketServer) {
  return createBirpc(
    createMethodsRPC(project),
    {
      post: msg => wss.send(msg),
      on: fn => wss.on('message', fn),
      serialize: stringify,
      deserialize: parse,
    },
  )
}
You can see a simple example of a pool made from scratch that doesn't run tests but marks them as collected in pool/custom-pool.ts.
Suggest changes to this page
Last updated: 5/5/25, 11:49 AM
Pager
Previous page
Extending Reporters
Next page
Config Reference


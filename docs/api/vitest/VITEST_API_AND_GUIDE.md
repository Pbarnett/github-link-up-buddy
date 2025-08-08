# Vitest API and Guide

## Overview
Vitest is a blazing fast unit testing framework powered by Vite. This document provides a comprehensive guide to the Vitest API and its usage in the github-link-up-buddy project.
Getting Started
Overview
Vitest (pronounced as "veetest") is a next generation testing framework powered by Vite.
You can learn more about the rationale behind the project in the Why Vitest section.
Trying Vitest Online
You can try Vitest online on StackBlitz. It runs Vitest directly in the browser, and it is almost identical to the local setup but doesn't require installing anything on your machine.
Adding Vitest to Your Project
Learn how to install by Video
npm
yarn
pnpm
bun
npm install -D vitest
TIP
Vitest requires Vite >=v5.0.0 and Node >=v18.0.0
It is recommended that you install a copy of vitest in your package.json, using one of the methods listed above. However, if you would prefer to run vitest directly, you can use npx vitest (the npx tool comes with npm and Node.js).
The npx tool will execute the specified command. By default, npx will first check if the command exists in the local project's binaries. If it is not found there, npx will look in the system's $PATH and execute it if found. If the command is not found in either location, npx will install it in a temporary location prior to execution.
Writing Tests
As an example, we will write a simple test that verifies the output of a function that adds two numbers.
sum.js
export function sum(a, b) {
  return a + b
}
sum.test.js
import { expect, test } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
TIP
By default, tests must contain .test. or .spec. in their file name.
Next, in order to execute the test, add the following section to your package.json:
package.json
{
  "scripts": {
    "test": "vitest"
  }
}
Finally, run npm run test, yarn test or pnpm test, depending on your package manager, and Vitest will print this message:
✓ sum.test.js (1)
  ✓ adds 1 + 2 to equal 3

Test Files  1 passed (1)
     Tests  1 passed (1)
  Start at  02:15:44
  Duration  311ms
WARNING
If you are using Bun as your package manager, make sure to use bun run test command instead of bun test, otherwise Bun will run its own test runner.
Learn more about the usage of Vitest, see the API section.
Configuring Vitest
One of the main advantages of Vitest is its unified configuration with Vite. If present, vitest will read your root vite.config.ts to match with the plugins and setup as your Vite app. For example, your Vite resolve.alias and plugins configuration will work out-of-the-box. If you want a different configuration during testing, you can:
Create vitest.config.ts, which will have the higher priority
Pass --config option to CLI, e.g. vitest --config ./path/to/vitest.config.ts
Use process.env.VITEST or mode property on defineConfig (will be set to test if not overridden) to conditionally apply different configuration in vite.config.ts
Vitest supports the same extensions for your configuration file as Vite does: .js, .mjs, .cjs, .ts, .cts, .mts. Vitest does not support .json extension.
If you are not using Vite as your build tool, you can configure Vitest using the test property in your config file:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // ...
  },
})
TIP
Even if you do not use Vite yourself, Vitest relies heavily on it for its transformation pipeline. For that reason, you can also configure any property described in Vite documentation.
If you are already using Vite, add test property in your Vite config. You'll also need to add a reference to Vitest types using a triple slash directive at the top of your config file.
vite.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // ...
  },
})
The <reference types="vitest" /> will stop working in the next major update, but you can start migrating to vitest/config in Vitest 2.1:
vite.config.ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // ... Specify options here.
  },
})
See the list of config options in the Config Reference
WARNING
If you decide to have two separate config files for Vite and Vitest, make sure to define the same Vite options in your Vitest config file since it will override your Vite file, not extend it. You can also use mergeConfig method from vite or vitest/config entries to merge Vite config with Vitest config:
vitest.config.mjs
vite.config.mjs
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    // ...
  },
}))
However, we recommend using the same file for both Vite and Vitest, instead of creating two separate files.
Projects Support
Run different project configurations inside the same project with Test Projects. You can define a list of files and folders that define your projects in vitest.config file.
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      // you can use a list of glob patterns to define your projects
      // Vitest expects a list of config files
      // or directories where there is a config file
      'packages/*',
      'tests/*/vitest.config.{e2e,unit}.ts',
      // you can even run the same tests,
      // but with different configs in the same "vitest" process
      {
        test: {
          name: 'happy-dom',
          root: './shared_tests',
          environment: 'happy-dom',
          setupFiles: ['./setup.happy-dom.ts'],
        },
      },
      {
        test: {
          name: 'node',
          root: './shared_tests',
          environment: 'node',
          setupFiles: ['./setup.node.ts'],
        },
      },
    ],
  },
})
Command Line Interface
In a project where Vitest is installed, you can use the vitest binary in your npm scripts, or run it directly with npx vitest. Here are the default npm scripts in a scaffolded Vitest project:
package.json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
To run tests once without watching for file changes, use vitest run. You can specify additional CLI options like --port or --https. For a full list of CLI options, run npx vitest --help in your project.
Learn more about the Command Line Interface
Automatic Dependency Installation
Vitest will prompt you to install certain dependencies if they are not already installed. You can disable this behavior by setting the VITEST_SKIP_INSTALL_CHECKS=1 environment variable.
IDE Integrations
We also provided an official extension for Visual Studio Code to enhance your testing experience with Vitest.
Install from VS Code Marketplace
Learn more about IDE Integrations
Examples
Example
Source
Playground
basic
GitHub
Play Online
fastify
GitHub
Play Online
in-source-test
GitHub
Play Online
lit
GitHub
Play Online
vue
GitHub
Play Online
marko
GitHub
Play Online
preact
GitHub
Play Online
react
GitHub
Play Online
solid
GitHub
Play Online
svelte
GitHub
Play Online
sveltekit
GitHub
Play Online
profiling
GitHub
Not Available
typecheck
GitHub
Play Online
projects
GitHub
Play Online

Projects using Vitest
unocss
unplugin-auto-import
unplugin-vue-components
vue
vite
vitesse
vitesse-lite
fluent-vue
vueuse
milkdown
gridjs-svelte
spring-easing
bytemd
faker
million
Vitamin
neodrag
svelte-multiselect
iconify
tdesign-vue-next
cz-git
Using Unreleased Commits
Each commit on main branch and a PR with a cr-tracked label are published to pkg.pr.new. You can install it by npm i https://pkg.pr.new/vitest@{commit}.
If you want to test your own modification locally, you can build and link it yourself (pnpm is required):
git clone https://github.com/vitest-dev/vitest.git
cd vitest
pnpm install
cd packages/vitest
pnpm run build
pnpm link --global # you can use your preferred package manager for this step
Then go to the project where you are using Vitest and run pnpm link --global vitest (or the package manager that you used to link vitest globally).
Community
If you have questions or need help, reach out to the community at Discord and GitHub Discussions.
Suggest changes to this page
Last updated: 5/5/25, 11:49 AM
Pager
Previous page
Why Vitest
Next page
Features


Features
Vite's config, transformers, resolvers, and plugins
Use the same setup from your app to run the tests!
Smart & instant watch mode, like HMR for tests!
Component testing for Vue, React, Svelte, Lit, Marko and more
Out-of-the-box TypeScript / JSX support
ESM first, top level await
Workers multi-threading via Tinypool
Benchmarking support with Tinybench
Filtering, timeouts, concurrent for suite and tests
Projects support
Jest-compatible Snapshot
Chai built-in for assertions + Jest expect compatible APIs
Tinyspy built-in for mocking
happy-dom or jsdom for DOM mocking
Browser Mode for running component tests in the browser
Code coverage via v8 or istanbul
Rust-like in-source testing
Type Testing via expect-type
Sharding Support
Reporting Uncaught Errors
Learn how to write your first test by Video
Shared Config between Test, Dev and Build
Vite's config, transformers, resolvers, and plugins. Use the same setup from your app to run the tests.
Learn more at Configuring Vitest.
Watch Mode
$ vitest
When you modify your source code or the test files, Vitest smartly searches the module graph and only reruns the related tests, just like how HMR works in Vite!
vitest starts in watch mode by default in development environment and run mode in CI environment (when process.env.CI presents) smartly. You can use vitest watch or vitest run to explicitly specify the desired mode.
Start Vitest with the --standalone flag to keep it running in the background. It won't run any tests until they change. Vitest will not run tests if the source code is changed until the test that imports the source has been run
Common Web Idioms Out-Of-The-Box
Out-of-the-box ES Module / TypeScript / JSX support / PostCSS
Threads
By default Vitest runs test files in multiple processes using node:child_process via Tinypool (a lightweight fork of Piscina), allowing tests to run simultaneously. If you want to speed up your test suite even further, consider enabling --pool=threads to run tests using node:worker_threads (beware that some packages might not work with this setup).
To run tests in a single thread or process, see poolOptions.
Vitest also isolates each file's environment so env mutations in one file don't affect others. Isolation can be disabled by passing --no-isolate to the CLI (trading correctness for run performance).
Test Filtering
Vitest provides many ways to narrow down the tests to run in order to speed up testing so you can focus on development.
Learn more about Test Filtering.
Running Tests Concurrently
Use .concurrent in consecutive tests to start them in parallel.
import { describe, it } from 'vitest'

// The two tests marked with concurrent will be started in parallel
describe('suite', () => {
  it('serial test', async () => { /* ... */ })
  it.concurrent('concurrent test 1', async ({ expect }) => { /* ... */ })
  it.concurrent('concurrent test 2', async ({ expect }) => { /* ... */ })
})
If you use .concurrent on a suite, every test in it will be started in parallel.
import { describe, it } from 'vitest'

// All tests within this suite will be started in parallel
describe.concurrent('suite', () => {
  it('concurrent test 1', async ({ expect }) => { /* ... */ })
  it('concurrent test 2', async ({ expect }) => { /* ... */ })
  it.concurrent('concurrent test 3', async ({ expect }) => { /* ... */ })
})
You can also use .skip, .only, and .todo with concurrent suites and tests. Read more in the API Reference.
WARNING
When running concurrent tests, Snapshots and Assertions must use expect from the local Test Context to ensure the right test is detected.
Snapshot
Jest-compatible snapshot support.
import { expect, it } from 'vitest'

it('renders correctly', () => {
  const result = render()
  expect(result).toMatchSnapshot()
})
Learn more at Snapshot.
Chai and Jest expect Compatibility
Chai is built-in for assertions with Jest expect-compatible APIs.
Notice that if you are using third-party libraries that add matchers, setting test.globals to true will provide better compatibility.
Mocking
Tinyspy is built-in for mocking with jest-compatible APIs on vi object.
import { expect, vi } from 'vitest'

const fn = vi.fn()

fn('hello', 1)

expect(vi.isMockFunction(fn)).toBe(true)
expect(fn.mock.calls[0]).toEqual(['hello', 1])

fn.mockImplementation((arg: string) => arg)

fn('world', 2)

expect(fn.mock.results[1].value).toBe('world')
Vitest supports both happy-dom or jsdom for mocking DOM and browser APIs. They don't come with Vitest, you will need to install them separately:
happy-dom
jsdom
$ npm i -D happy-dom
After that, change the environment option in your config file:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom', // or 'jsdom', 'node'
  },
})
Learn more at Mocking.
Coverage
Vitest supports Native code coverage via v8 and instrumented code coverage via istanbul.
package.json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
Learn more at Coverage.
In-Source Testing
Vitest also provides a way to run tests within your source code along with the implementation, similar to Rust's module tests.
This makes the tests share the same closure as the implementations and able to test against private states without exporting. Meanwhile, it also brings the feedback loop closer for development.
src/index.ts
// the implementation
export function add(...args: number[]): number {
  return args.reduce((a, b) => a + b, 0)
}

// in-source test suites
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('add', () => {
    expect(add()).toBe(0)
    expect(add(1)).toBe(1)
    expect(add(1, 2, 3)).toBe(6)
  })
}
Learn more at In-source testing.
Benchmarking Experimental
You can run benchmark tests with bench function via Tinybench to compare performance results.
sort.bench.ts
import { bench, describe } from 'vitest'

describe('sort', () => {
  bench('normal', () => {
    const x = [1, 5, 4, 2, 3]
    x.sort((a, b) => {
      return a - b
    })
  })

  bench('reverse', () => {
    const x = [1, 5, 4, 2, 3]
    x.reverse().sort((a, b) => {
      return a - b
    })
  })
})

Type Testing Experimental
You can write tests to catch type regressions. Vitest comes with expect-type package to provide you with a similar and easy to understand API.
types.test-d.ts
import { assertType, expectTypeOf, test } from 'vitest'
import { mount } from './mount.js'

test('my types work properly', () => {
  expectTypeOf(mount).toBeFunction()
  expectTypeOf(mount).parameter(0).toMatchTypeOf<{ name: string }>()

  // @ts-expect-error name is a string
  assertType(mount({ name: 42 }))
})
Sharding
Run tests on different machines using --shard and --reporter=blob flags. All test and coverage results can be merged at the end of your CI pipeline using --merge-reports command:
vitest --shard=1/2 --reporter=blob --coverage
vitest --shard=2/2 --reporter=blob --coverage
vitest --merge-reports --reporter=junit --coverage
See Improving Performance | Sharding for more information.
Environment Variables
Vitest exclusively autoloads environment variables prefixed with VITE_ from .env files to maintain compatibility with frontend-related tests, adhering to Vite's established convention. To load every environmental variable from .env files anyway, you can use loadEnv method imported from vite:
vitest.config.ts
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
  test: {
    // mode defines what ".env.{mode}" file to choose if exists
    env: loadEnv(mode, process.cwd(), ''),
  },
}))
Unhandled Errors
By default, Vitest catches and reports all unhandled rejections, uncaught exceptions (in Node.js) and error events (in the browser).
You can disable this behaviour by catching them manually. Vitest assumes the callback is handled by you and won't report the error.
setup.node.js
setup.browser.js
// in Node.js
process.on('unhandledRejection', () => {
  // your own handler
})

process.on('uncaughtException', () => {
  // your own handler
})
Alternatively, you can also ignore reported errors with a dangerouslyIgnoreUnhandledErrors option. Vitest will still report them, but they won't affect the test result (exit code won't be changed).
If you need to test that error was not caught, you can create a test that looks like this:
test('my function throws uncaught error', async ({ onTestFinished }) => {
  onTestFinished(() => {
    // if the event was never called during the test,
    // make sure it's removed before the next test starts
    process.removeAllListeners('unhandledrejection')
  })

  return new Promise((resolve, reject) => {
    process.once('unhandledrejection', (error) => {
      try {
        expect(error.message).toBe('my error')
        resolve()
      }
      catch (error) {
        reject(error)
      }
    })

    callMyFunctionThatRejectsError()
  })
})
Suggest changes to this page
Last updated: 5/17/25, 8:16 AM
Pager
Previous page
Getting Started
Next page
Config Reference


Configuring Vitest
If you are using Vite and have a vite.config file, Vitest will read it to match with the plugins and setup as your Vite app. If you want to have a different configuration for testing or your main app doesn't rely on Vite specifically, you could either:
Create vitest.config.ts, which will have the higher priority and will override the configuration from vite.config.ts (Vitest supports all conventional JS and TS extensions, but doesn't support json) - it means all options in your vite.config will be ignored
Pass --config option to CLI, e.g. vitest --config ./path/to/vitest.config.ts
Use process.env.VITEST or mode property on defineConfig (will be set to test/benchmark if not overridden with --mode) to conditionally apply different configuration in vite.config.ts
To configure vitest itself, add test property in your Vite config. You'll also need to add a reference to Vitest types using a triple slash command at the top of your config file, if you are importing defineConfig from vite itself.
WARNING
All listed options on this page are located within a test property inside the configuration:
vitest.config.js
export default defineConfig({
  test: {
    exclude: [],
  },
})
Since Vitest uses Vite config, you can also use any configuration option from Vite. For example, define to define global variables, or resolve.alias to define aliases - these options should be defined on the top level, not within a test property.
Configuration options that are not supported inside a project config have * sign next to them. This means they can only be set in the root Vitest config.
include
Type: string[]
Default: ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
CLI: vitest [...include], vitest **/*.test.js
A list of glob patterns that match your test files.
NOTE
When using coverage, Vitest automatically adds test files include patterns to coverage's default exclude patterns. See coverage.exclude.
exclude
Type: string[]
Default: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*']
CLI: vitest --exclude "**/excluded-file"
A list of glob patterns that should be excluded from your test files.
WARNING
This option does not affect coverage. If you need to remove certain files from the coverage report, use coverage.exclude.
This is the only option that doesn't override your configuration if you provide it with a CLI flag. All glob patterns added via --exclude flag will be added to the config's exclude.
includeSource
Type: string[]
Default: []
Include globs for in-source test files.
When defined, Vitest will run all matched files with import.meta.vitest inside.
name
Type: string | { label: string, color?: LabelColor }
Assign a custom name to the test project or Vitest process. The name will be visible in the CLI and UI, and available in the Node.js API via project.name.
Color used by CLI and UI can be changed by providing an object with color property.
server
Type: { sourcemap?, deps?, ... }
Vite-Node server options.
server.sourcemap
Type: 'inline' | boolean
Default: 'inline'
Inject inline source map to modules.
server.debug
Type: { dumpModules?, loadDumppedModules? }
Vite-Node debugger options.
server.debug.dumpModules
Type: boolean | string
Dump the transformed module to filesystem. Passing a string will dump to the specified path.
server.debug.loadDumppedModules
Type: boolean
Read dumped module from filesystem whenever exists. Useful for debugging by modifying the dump result from the filesystem.
server.deps
Type: { external?, inline?, ... }
Handling for dependencies resolution.
server.deps.external
Type: (string | RegExp)[]
Default: [/\/node_modules\//]
Externalize means that Vite will bypass the package to the native Node. Externalized dependencies will not be applied to Vite's transformers and resolvers, so they do not support HMR on reload. By default, all packages inside node_modules are externalized.
These options support package names as they are written in node_modules or specified inside deps.moduleDirectories. For example, package @company/some-name located inside packages/some-name should be specified as some-name, and packages should be included in deps.moduleDirectories. Basically, Vitest always checks the file path, not the actual package name.
If regexp is used, Vitest calls it on the file path, not the package name.
server.deps.inline
Type: (string | RegExp)[] | true
Default: []
Vite will process inlined modules. This could be helpful to handle packages that ship .js in ESM format (that Node can't handle).
If true, every dependency will be inlined. All dependencies, specified in ssr.noExternal will be inlined by default.
server.deps.fallbackCJS
Type boolean
Default: false
When a dependency is a valid ESM package, try to guess the cjs version based on the path. This might be helpful, if a dependency has the wrong ESM file.
This might potentially cause some misalignment if a package has different logic in ESM and CJS mode.
server.deps.cacheDir
Type string
Default: 'node_modules/.vite'
Directory to save cache files.
deps
Type: { optimizer?, ... }
Handling for dependencies resolution.
deps.optimizer
Type: { ssr?, web? }
See also: Dep Optimization Options
Enable dependency optimization. If you have a lot of tests, this might improve their performance.
When Vitest encounters the external library listed in include, it will be bundled into a single file using esbuild and imported as a whole module. This is good for several reasons:
Importing packages with a lot of imports is expensive. By bundling them into one file we can save a lot of time
Importing UI libraries is expensive because they are not meant to run inside Node.js
Your alias configuration is now respected inside bundled packages
Code in your tests is running closer to how it's running in the browser
Be aware that only packages in deps.optimizer?.[mode].include option are bundled (some plugins populate this automatically, like Svelte). You can read more about available options in Vite docs (Vitest doesn't support disable and noDiscovery options). By default, Vitest uses optimizer.web for jsdom and happy-dom environments, and optimizer.ssr for node and edge environments, but it is configurable by transformMode.
This options also inherits your optimizeDeps configuration (for web Vitest will extend optimizeDeps, for ssr - ssr.optimizeDeps). If you redefine include/exclude option in deps.optimizer it will extend your optimizeDeps when running tests. Vitest automatically removes the same options from include, if they are listed in exclude.
TIP
You will not be able to edit your node_modules code for debugging, since the code is actually located in your cacheDir or test.cache.dir directory. If you want to debug with console.log statements, edit it directly or force rebundling with deps.optimizer?.[mode].force option.
deps.optimizer.{mode}.enabled
Type: boolean
Default: false
Enable dependency optimization.
deps.web
Type: { transformAssets?, ... }
Options that are applied to external files when transform mode is set to web. By default, jsdom and happy-dom use web mode, while node and edge environments use ssr transform mode, so these options will have no affect on files inside those environments.
Usually, files inside node_modules are externalized, but these options also affect files in server.deps.external.
deps.web.transformAssets
Type: boolean
Default: true
Should Vitest process assets (.png, .svg, .jpg, etc) files and resolve them like Vite does in the browser.
This module will have a default export equal to the path to the asset, if no query is specified.
WARNING
At the moment, this option only works with vmThreads and vmForks pools.
deps.web.transformCss
Type: boolean
Default: true
Should Vitest process CSS (.css, .scss, .sass, etc) files and resolve them like Vite does in the browser.
If CSS files are disabled with css options, this option will just silence ERR_UNKNOWN_FILE_EXTENSION errors.
WARNING
At the moment, this option only works with vmThreads and vmForks pools.
deps.web.transformGlobPattern
Type: RegExp | RegExp[]
Default: []
Regexp pattern to match external files that should be transformed.
By default, files inside node_modules are externalized and not transformed, unless it's CSS or an asset, and corresponding option is not disabled.
WARNING
At the moment, this option only works with vmThreads and vmForks pools.
deps.interopDefault
Type: boolean
Default: true
Interpret CJS module's default as named exports. Some dependencies only bundle CJS modules and don't use named exports that Node.js can statically analyze when a package is imported using import syntax instead of require. When importing such dependencies in Node environment using named exports, you will see this error:
import { read } from 'fs-jetpack';
         ^^^^
SyntaxError: Named export 'read' not found. The requested module 'fs-jetpack' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export.
Vitest doesn't do static analysis, and cannot fail before your running code, so you will most likely see this error when running tests, if this feature is disabled:
TypeError: createAsyncThunk is not a function
TypeError: default is not a function
By default, Vitest assumes you are using a bundler to bypass this and will not fail, but you can disable this behaviour manually, if you code is not processed.
deps.moduleDirectories
Type: string[]
Default: ['node_modules']
A list of directories that should be treated as module directories. This config option affects the behavior of vi.mock: when no factory is provided and the path of what you are mocking matches one of the moduleDirectories values, Vitest will try to resolve the mock by looking for a __mocks__ folder in the root of the project.
This option will also affect if a file should be treated as a module when externalizing dependencies. By default, Vitest imports external modules with native Node.js bypassing Vite transformation step.
Setting this option will override the default, if you wish to still search node_modules for packages include it along with any other options:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    deps: {
      moduleDirectories: ['node_modules', path.resolve('../../packages')],
    }
  },
})
runner
Type: VitestRunnerConstructor
Default: node, when running tests, or benchmark, when running benchmarks
Path to a custom test runner. This is an advanced feature and should be used with custom library runners. You can read more about it in the documentation.
benchmark
Type: { include?, exclude?, ... }
Options used when running vitest bench.
benchmark.include
Type: string[]
Default: ['**/*.{bench,benchmark}.?(c|m)[jt]s?(x)']
Include globs for benchmark test files
benchmark.exclude
Type: string[]
Default: ['node_modules', 'dist', '.idea', '.git', '.cache']
Exclude globs for benchmark test files
benchmark.includeSource
Type: string[]
Default: []
Include globs for in-source benchmark test files. This option is similar to includeSource.
When defined, Vitest will run all matched files with import.meta.vitest inside.
benchmark.reporters
Type: Arrayable<BenchmarkBuiltinReporters | Reporter>
Default: 'default'
Custom reporter for output. Can contain one or more built-in report names, reporter instances, and/or paths to custom reporters.
benchmark.outputFile
Deprecated in favor of benchmark.outputJson.
benchmark.outputJson
Type: string | undefined
Default: undefined
A file path to store the benchmark result, which can be used for --compare option later.
For example:
# save main branch's result
git checkout main
vitest bench --outputJson main.json

# change a branch and compare against main
git checkout feature
vitest bench --compare main.json
benchmark.compare
Type: string | undefined
Default: undefined
A file path to a previous benchmark result to compare against current runs.
alias
Type: Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>
Define custom aliases when running inside tests. They will be merged with aliases from resolve.alias.
WARNING
Vitest uses Vite SSR primitives to run tests which has certain pitfalls.
Aliases affect only modules imported directly with an import keyword by an inlined module (all source code is inlined by default).
Vitest does not support aliasing require calls.
If you are aliasing an external dependency (e.g., react -> preact), you may want to alias the actual node_modules packages instead to make it work for externalized dependencies. Both Yarn and pnpm support aliasing via the npm: prefix.
globals
Type: boolean
Default: false
CLI: --globals, --globals=false
By default, vitest does not provide global APIs for explicitness. If you prefer to use the APIs globally like Jest, you can pass the --globals option to CLI or add globals: true in the config.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
  },
})
To get TypeScript working with the global APIs, add vitest/globals to the types field in your tsconfig.json
tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
If you have redefined your typeRoots to include more types in your compilation, you will have to add back the node_modules to make vitest/globals discoverable.
tsconfig.json
{
  "compilerOptions": {
    "typeRoots": ["./types", "./node_modules/@types", "./node_modules"],
    "types": ["vitest/globals"]
  }
}
If you are already using unplugin-auto-import in your project, you can also use it directly for auto importing those APIs.
vitest.config.js
import { defineConfig } from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vitest'],
      dts: true, // generate TypeScript declaration
    }),
  ],
})
environment
Type: 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime' | string
Default: 'node'
CLI: --environment=<env>
The environment that will be used for testing. The default environment in Vitest is a Node.js environment. If you are building a web application, you can use browser-like environment through either jsdom or happy-dom instead. If you are building edge functions, you can use edge-runtime environment
TIP
You can also use Browser Mode to run integration or unit tests in the browser without mocking the environment.
By adding a @vitest-environment docblock or comment at the top of the file, you can specify another environment to be used for all tests in that file:
Docblock style:
/**
 * @vitest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
Comment style:
// @vitest-environment happy-dom

test('use happy-dom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
For compatibility with Jest, there is also a @jest-environment:
/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
If you are running Vitest with --isolate=false flag, your tests will be run in this order: node, jsdom, happy-dom, edge-runtime, custom environments. Meaning, that every test with the same environment is grouped, but is still running sequentially.
Starting from 0.23.0, you can also define custom environment. When non-builtin environment is used, Vitest will try to load package vitest-environment-${name}. That package should export an object with the shape of Environment:
environment.js
import type { Environment } from 'vitest'

export default <Environment>{
  name: 'custom',
  transformMode: 'ssr',
  setup() {
    // custom setup
    return {
      teardown() {
        // called after all tests with this env have been run
      }
    }
  }
}
Vitest also exposes builtinEnvironments through vitest/environments entry, in case you just want to extend it. You can read more about extending environments in our guide.
TIP
jsdom environment exposes jsdom global variable equal to the current JSDOM instance. If you want TypeScript to recognize it, you can add vitest/jsdom to your tsconfig.json when you use this environment:
tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/jsdom"]
  }
}
environmentOptions
Type: Record<'jsdom' | string, unknown>
Default: {}
These options are passed down to setup method of current environment. By default, you can configure only JSDOM options, if you are using it as your test environment.
environmentMatchGlobs
Type: [string, EnvironmentName][]
Default: []
DEPRECATED
This API was deprecated in Vitest 3. Use projects to define different configurations instead.
export default defineConfig({
  test: {
    environmentMatchGlobs: [ 
      ['./*.jsdom.test.ts', 'jsdom'], 
    ], 
    projects: [ 
      { 
        extends: true, 
        test: { 
          environment: 'jsdom', 
        }, 
      }, 
    ], 
  },
})
Automatically assign environment based on globs. The first match will be used.
For example:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environmentMatchGlobs: [
      // all tests in tests/dom will run in jsdom
      ['tests/dom/**', 'jsdom'],
      // all tests in tests/ with .edge.test.ts will run in edge-runtime
      ['**\/*.edge.test.ts', 'edge-runtime'],
      // ...
    ]
  }
})
poolMatchGlobs
Type: [string, 'threads' | 'forks' | 'vmThreads' | 'vmForks' | 'typescript'][]
Default: []
DEPRECATED
This API was deprecated in Vitest 3. Use projects to define different configurations instead:
export default defineConfig({
  test: {
    poolMatchGlobs: [ 
      ['./*.threads.test.ts', 'threads'], 
    ], 
    projects: [ 
      { 
        test: { 
          extends: true, 
          pool: 'threads', 
        }, 
      }, 
    ], 
  },
})
Automatically assign pool in which tests will run based on globs. The first match will be used.
For example:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    poolMatchGlobs: [
      // all tests in "worker-specific" directory will run inside a worker as if you enabled `--pool=threads` for them,
      ['**/tests/worker-specific/**', 'threads'],
      // run all tests in "browser" directory in an actual browser
      ['**/tests/browser/**', 'browser'],
      // all other tests will run based on "browser.enabled" and "threads" options, if you didn't specify other globs
      // ...
    ]
  }
})
update *
Type: boolean
Default: false
CLI: -u, --update, --update=false
Update snapshot files. This will update all changed snapshots and delete obsolete ones.
watch *
Type: boolean
Default: !process.env.CI && process.stdin.isTTY
CLI: -w, --watch, --watch=false
Enable watch mode
In interactive environments, this is the default, unless --run is specified explicitly.
In CI, or when run from a non-interactive shell, "watch" mode is not the default, but can be enabled explicitly with this flag.
watchTriggerPatterns 3.2.0+ *
Type: WatcherTriggerPattern[]
Vitest reruns tests based on the module graph which is populated by static and dynamic import statements. However, if you are reading from the file system or fetching from a proxy, then Vitest cannot detect those dependencies.
To correctly rerun those tests, you can define a regex pattern and a function that retuns a list of test files to run.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watchTriggerPatterns: [
      {
        pattern: /^src\/(mailers|templates)\/(.*)\.(ts|html|txt)$/,
        testsToRun: (id, match) => {
          // relative to the root value
          return `./api/tests/mailers/${match[2]}.test.ts`
        },
      },
    ],
  },
})
WARNING
Returned files should be either absolute or relative to the root. Note that this is a global option, and it cannot be used inside of project configs.
root
Type: string
CLI: -r <path>, --root=<path>
Project root
dir
Type: string
CLI: --dir=<path>
Default: same as root
Base directory to scan for the test files. You can specify this option to speed up test discovery if your root covers the whole project
reporters *
Type: Reporter | Reporter[]
Default: 'default'
CLI: --reporter=<name>, --reporter=<name1> --reporter=<name2>
Custom reporters for output. Reporters can be a Reporter instance, a string to select built-in reporters, or a path to a custom implementation (e.g. './path/to/reporter.ts', '@scope/reporter').
outputFile *
Type: string | Record<string, string>
CLI: --outputFile=<path>, --outputFile.json=./path
Write test results to a file when the --reporter=json, --reporter=html or --reporter=junit option is also specified. By providing an object instead of a string you can define individual outputs when using multiple reporters.
pool *
Type: 'threads' | 'forks' | 'vmThreads' | 'vmForks'
Default: 'forks'
CLI: --pool=threads
Pool used to run tests in.
threads *
Enable multi-threading using tinypool (a lightweight fork of Piscina). When using threads you are unable to use process related APIs such as process.chdir(). Some libraries written in native languages, such as Prisma, bcrypt and canvas, have problems when running in multiple threads and run into segfaults. In these cases it is advised to use forks pool instead.
forks *
Similar as threads pool but uses child_process instead of worker_threads via tinypool. Communication between tests and main process is not as fast as with threads pool. Process related APIs such as process.chdir() are available in forks pool.
vmThreads *
Run tests using VM context (inside a sandboxed environment) in a threads pool.
This makes tests run faster, but the VM module is unstable when running ESM code. Your tests will leak memory - to battle that, consider manually editing poolOptions.vmThreads.memoryLimit value.
WARNING
Running code in a sandbox has some advantages (faster tests), but also comes with a number of disadvantages.
The globals within native modules, such as (fs, path, etc), differ from the globals present in your test environment. As a result, any error thrown by these native modules will reference a different Error constructor compared to the one used in your code:
try {
  fs.writeFileSync('/doesnt exist')
}
catch (err) {
  console.log(err instanceof Error) // false
}
Importing ES modules caches them indefinitely which introduces memory leaks if you have a lot of contexts (test files). There is no API in Node.js that clears that cache.
Accessing globals takes longer in a sandbox environment.
Please, be aware of these issues when using this option. Vitest team cannot fix any of the issues on our side.
vmForks *
Similar as vmThreads pool but uses child_process instead of worker_threads via tinypool. Communication between tests and the main process is not as fast as with vmThreads pool. Process related APIs such as process.chdir() are available in vmForks pool. Please be aware that this pool has the same pitfalls listed in vmThreads.
poolOptions *
Type: Record<'threads' | 'forks' | 'vmThreads' | 'vmForks', {}>
Default: {}
poolOptions.threads
Options for threads pool.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    poolOptions: {
      threads: {
        // Threads related options here
      }
    }
  }
})
poolOptions.threads.maxThreads *
Type: number | string
Default: available CPUs
Maximum number or percentage of threads. You can also use VITEST_MAX_THREADS environment variable.
poolOptions.threads.minThreads *
Type: number | string
Default: available CPUs
Minimum number or percentage of threads. You can also use VITEST_MIN_THREADS environment variable.
poolOptions.threads.singleThread
Type: boolean
Default: false
Run all tests with the same environment inside a single worker thread. This will disable built-in module isolation (your source code or inlined code will still be reevaluated for each test), but can improve test performance.
WARNING
Even though this option will force tests to run one after another, this option is different from Jest's --runInBand. Vitest uses workers not only for running tests in parallel, but also to provide isolation. By disabling this option, your tests will run sequentially, but in the same global context, so you must provide isolation yourself.
This might cause all sorts of issues, if you are relying on global state (frontend frameworks usually do) or your code relies on environment to be defined separately for each test. But can be a speed boost for your tests (up to 3 times faster), that don't necessarily rely on global state or can easily bypass that.
poolOptions.threads.useAtomics *
Type: boolean
Default: false
Use Atomics to synchronize threads.
This can improve performance in some cases, but might cause segfault in older Node versions.
poolOptions.threads.isolate
Type: boolean
Default: true
Isolate environment for each test file.
poolOptions.threads.execArgv *
Type: string[]
Default: []
Pass additional arguments to node in the threads. See Command-line API | Node.js for more information.
WARNING
Be careful when using, it as some options may crash worker, e.g. --prof, --title. See https://github.com/nodejs/node/issues/41103.
poolOptions.forks
Options for forks pool.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    poolOptions: {
      forks: {
        // Forks related options here
      }
    }
  }
})
poolOptions.forks.maxForks *
Type: number | string
Default: available CPUs
Maximum number or percentage of forks. You can also use VITEST_MAX_FORKS environment variable.
poolOptions.forks.minForks *
Type: number | string
Default: available CPUs
Minimum number or percentage of forks. You can also use VITEST_MIN_FORKS environment variable.
poolOptions.forks.isolate
Type: boolean
Default: true
Isolate environment for each test file.
poolOptions.forks.singleFork
Type: boolean
Default: false
Run all tests with the same environment inside a single child process. This will disable built-in module isolation (your source code or inlined code will still be reevaluated for each test), but can improve test performance.
WARNING
Even though this option will force tests to run one after another, this option is different from Jest's --runInBand. Vitest uses child processes not only for running tests in parallel, but also to provide isolation. By disabling this option, your tests will run sequentially, but in the same global context, so you must provide isolation yourself.
This might cause all sorts of issues, if you are relying on global state (frontend frameworks usually do) or your code relies on environment to be defined separately for each test. But can be a speed boost for your tests (up to 3 times faster), that don't necessarily rely on global state or can easily bypass that.
poolOptions.forks.execArgv *
Type: string[]
Default: []
Pass additional arguments to node process in the child processes. See Command-line API | Node.js for more information.
WARNING
Be careful when using, it as some options may crash worker, e.g. --prof, --title. See https://github.com/nodejs/node/issues/41103.
poolOptions.vmThreads
Options for vmThreads pool.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    poolOptions: {
      vmThreads: {
        // VM threads related options here
      }
    }
  }
})
poolOptions.vmThreads.maxThreads *
Type: number | string
Default: available CPUs
Maximum number or percentage of threads. You can also use VITEST_MAX_THREADS environment variable.
poolOptions.vmThreads.minThreads *
Type: number | string
Default: available CPUs
Minimum number or percentage of threads. You can also use VITEST_MIN_THREADS environment variable.
poolOptions.vmThreads.memoryLimit *
Type: string | number
Default: 1 / CPU Cores
Specifies the memory limit for workers before they are recycled. This value heavily depends on your environment, so it's better to specify it manually instead of relying on the default.
TIP
The implementation is based on Jest's workerIdleMemoryLimit.
The limit can be specified in a number of different ways and whatever the result is Math.floor is used to turn it into an integer value:
<= 1 - The value is assumed to be a percentage of system memory. So 0.5 sets the memory limit of the worker to half of the total system memory
\> 1 - Assumed to be a fixed byte value. Because of the previous rule if you wanted a value of 1 byte (I don't know why) you could use 1.1.
With units
50% - As above, a percentage of total system memory
100KB, 65MB, etc - With units to denote a fixed memory limit.
K / KB - Kilobytes (x1000)
KiB - Kibibytes (x1024)
M / MB - Megabytes
MiB - Mebibytes
G / GB - Gigabytes
GiB - Gibibytes
WARNING
Percentage based memory limit does not work on Linux CircleCI workers due to incorrect system memory being reported.
poolOptions.vmThreads.useAtomics *
Type: boolean
Default: false
Use Atomics to synchronize threads.
This can improve performance in some cases, but might cause segfault in older Node versions.
poolOptions.vmThreads.execArgv *
Type: string[]
Default: []
Pass additional arguments to node process in the VM context. See Command-line API | Node.js for more information.
WARNING
Be careful when using, it as some options may crash worker, e.g. --prof, --title. See https://github.com/nodejs/node/issues/41103.
poolOptions.vmForks *
Options for vmForks pool.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    poolOptions: {
      vmForks: {
        // VM forks related options here
      }
    }
  }
})
poolOptions.vmForks.maxForks *
Type: number | string
Default: available CPUs
Maximum number or percentage of forks. You can also use VITEST_MAX_FORKS environment variable.
poolOptions.vmForks.minForks *
Type: number | string
Default: available CPUs
Minimum number or percentage of forks. You can also use VITEST_MIN_FORKS environment variable.
poolOptions.vmForks.memoryLimit *
Type: string | number
Default: 1 / CPU Cores
Specifies the memory limit for workers before they are recycled. This value heavily depends on your environment, so it's better to specify it manually instead of relying on the default. How the value is calculated is described in poolOptions.vmThreads.memoryLimit
poolOptions.vmForks.execArgv *
Type: string[]
Default: []
Pass additional arguments to node process in the VM context. See Command-line API | Node.js for more information.
WARNING
Be careful when using, it as some options may crash worker, e.g. --prof, --title. See https://github.com/nodejs/node/issues/41103.
fileParallelism *
Type: boolean
Default: true
CLI: --no-file-parallelism, --fileParallelism=false
Should all test files run in parallel. Setting this to false will override maxWorkers and minWorkers options to 1.
TIP
This option doesn't affect tests running in the same file. If you want to run those in parallel, use concurrent option on describe or via a config.
maxWorkers *
Type: number | string
Maximum number or percentage of workers to run tests in. poolOptions.{threads,vmThreads}.maxThreads/poolOptions.forks.maxForks has higher priority.
minWorkers *
Type: number | string
Minimum number or percentage of workers to run tests in. poolOptions.{threads,vmThreads}.minThreads/poolOptions.forks.minForks has higher priority.
testTimeout
Type: number
Default: 5_000 in Node.js, 15_000 if browser.enabled is true
CLI: --test-timeout=5000, --testTimeout=5000
Default timeout of a test in milliseconds. Use 0 to disable timeout completely.
hookTimeout
Type: number
Default: 10_000 in Node.js, 30_000 if browser.enabled is true
CLI: --hook-timeout=10000, --hookTimeout=10000
Default timeout of a hook in milliseconds. Use 0 to disable timeout completely.
teardownTimeout *
Type: number
Default: 10000
CLI: --teardown-timeout=5000, --teardownTimeout=5000
Default timeout to wait for close when Vitest shuts down, in milliseconds
silent *
Type: boolean | 'passed-only'
Default: false
CLI: --silent, --silent=false
Silent console output from tests.
Use 'passed-only' to see logs from failing tests only. Logs from failing tests are printed after a test has finished.
setupFiles
Type: string | string[]
Path to setup files. They will be run before each test file.
INFO
Editing a setup file will automatically trigger a rerun of all tests.
You can use process.env.VITEST_POOL_ID (integer-like string) inside to distinguish between threads.
TIP
Note, that if you are running --isolate=false, this setup file will be run in the same global scope multiple times. Meaning, that you are accessing the same global object before each test, so make sure you are not doing the same thing more than you need.
For example, you may rely on a global variable:
import { config } from '@some-testing-lib'

if (!globalThis.defined) {
  config.plugins = [myCoolPlugin]
  computeHeavyThing()
  globalThis.defined = true
}

// hooks are reset before each suite
afterEach(() => {
  cleanup()
})

globalThis.resetBeforeEachTest = true
provide 2.1.0+
Type: Partial<ProvidedContext>
Define values that can be accessed inside your tests using inject method.
vitest.config.js
api.test.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    provide: {
      API_KEY: '123',
    },
  },
})
WARNING
Properties have to be strings and values need to be serializable because this object will be transferred between different processes.
TIP
If you are using TypeScript, you will need to augment ProvidedContext type for type safe access:
vitest.shims.d.ts
declare module 'vitest' {
  export interface ProvidedContext {
    API_KEY: string
  }
}

// mark this file as a module so augmentation works correctly
export {}
globalSetup
Type: string | string[]
Path to global setup files, relative to project root.
A global setup file can either export named functions setup and teardown or a default function that returns a teardown function (example).
INFO
Multiple globalSetup files are possible. setup and teardown are executed sequentially with teardown in reverse order.
WARNING
Global setup runs only if there is at least one running test. This means that global setup might start running during watch mode after test file is changed (the test file will wait for global setup to finish before running).
Beware that the global setup is running in a different global scope, so your tests don't have access to variables defined here. However, you can pass down serializable data to tests via provide method:
example.test.js
globalSetup.ts 3.0.0+
globalSetup.ts 2.0.0+
import { inject } from 'vitest'

inject('wsPort') === 3000
Since Vitest 3, you can define a custom callback function to be called when Vitest reruns tests. If the function is asynchronous, the runner will wait for it to complete before executing tests. Note that you cannot destruct the project like { onTestsRerun } because it relies on the context.
globalSetup.ts
import type { TestProject } from 'vitest/node'

export default function setup(project: TestProject) {
  project.onTestsRerun(async () => {
    await restartDb()
  })
}
forceRerunTriggers *
Type: string[]
Default: ['**/package.json/**', '**/vitest.config.*/**', '**/vite.config.*/**']
Glob pattern of file paths that will trigger the whole suite rerun. When paired with the --changed argument will run the whole test suite if the trigger is found in the git diff.
Useful if you are testing calling CLI commands, because Vite cannot construct a module graph:
test('execute a script', async () => {
  // Vitest cannot rerun this test, if content of `dist/index.js` changes
  await execa('node', ['dist/index.js'])
})
TIP
Make sure that your files are not excluded by server.watch.ignored.
coverage *
You can use v8, istanbul or a custom coverage solution for coverage collection.
You can provide coverage options to CLI with dot notation:
npx vitest --coverage.enabled --coverage.provider=istanbul --coverage.all
WARNING
If you are using coverage options with dot notation, don't forget to specify --coverage.enabled. Do not provide a single --coverage option in that case.
coverage.provider
Type: 'v8' | 'istanbul' | 'custom'
Default: 'v8'
CLI: --coverage.provider=<provider>
Use provider to select the tool for coverage collection.
coverage.enabled
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.enabled, --coverage.enabled=false
Enables coverage collection. Can be overridden using --coverage CLI option.
coverage.include
Type: string[]
Default: ['**']
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.include=<path>, --coverage.include=<path1> --coverage.include=<path2>
List of files included in coverage as glob patterns
coverage.extension
Type: string | string[]
Default: ['.js', '.cjs', '.mjs', '.ts', '.mts', '.tsx', '.jsx', '.vue', '.svelte', '.marko', '.astro']
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.extension=<extension>, --coverage.extension=<extension1> --coverage.extension=<extension2>
coverage.exclude
Type: string[]
Default:
[
  'coverage/**',
  'dist/**',
  '**/node_modules/**',
  '**/[.]**',
  'packages/*/test?(s)/**',
  '**/*.d.ts',
  '**/virtual:*',
  '**/__x00__*',
  '**/\x00*',
  'cypress/**',
  'test?(s)/**',
  'test?(-*).?(c|m)[jt]s?(x)',
  '**/*{.,-}{test,spec,bench,benchmark}?(-d).?(c|m)[jt]s?(x)',
  '**/__tests__/**',
  '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
  '**/vitest.{workspace,projects}.[jt]s?(on)',
  '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
]
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.exclude=<path>, --coverage.exclude=<path1> --coverage.exclude=<path2>
List of files excluded from coverage as glob patterns.
This option overrides all default options. Extend the default options when adding new patterns to ignore:
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['**/custom-pattern/**', ...coverageConfigDefaults.exclude]
    },
  },
})
NOTE
Vitest automatically adds test files include patterns to the coverage.exclude. It's not possible to show coverage of test files.
coverage.all
Type: boolean
Default: true
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.all, --coverage.all=false
Whether to include all files, including the untested ones into report.
coverage.clean
Type: boolean
Default: true
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.clean, --coverage.clean=false
Clean coverage results before running tests
coverage.cleanOnRerun
Type: boolean
Default: true
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.cleanOnRerun, --coverage.cleanOnRerun=false
Clean coverage report on watch rerun. Set to false to preserve coverage results from previous run in watch mode.
coverage.reportsDirectory
Type: string
Default: './coverage'
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.reportsDirectory=<path>
WARNING
Vitest will delete this directory before running tests if coverage.clean is enabled (default value).
Directory to write coverage report to.
To preview the coverage report in the output of HTML reporter, this option must be set as a sub-directory of the html report directory (for example ./html/coverage).
coverage.reporter
Type: string | string[] | [string, {}][]
Default: ['text', 'html', 'clover', 'json']
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.reporter=<reporter>, --coverage.reporter=<reporter1> --coverage.reporter=<reporter2>
Coverage reporters to use. See istanbul documentation for detailed list of all reporters. See @types/istanbul-reporter for details about reporter specific options.
The reporter has three different types:
A single reporter: { reporter: 'html' }
Multiple reporters without options: { reporter: ['html', 'json'] }
A single or multiple reporters with reporter options:
{
  reporter: [
    ['lcov', { 'projectRoot': './src' }],
    ['json', { 'file': 'coverage.json' }],
    ['text']
  ]
}
You can also pass custom coverage reporters. See Guide - Custom Coverage Reporter for more information.
 {
    reporter: [
      // Specify reporter using name of the NPM package
      '@vitest/custom-coverage-reporter',
      ['@vitest/custom-coverage-reporter', { someOption: true }],

      // Specify reporter using local path
      '/absolute/path/to/custom-reporter.cjs',
      ['/absolute/path/to/custom-reporter.cjs', { someOption: true }],
    ]
  }
You can check your coverage report in Vitest UI: check Vitest UI Coverage for more details.
coverage.reportOnFailure
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.reportOnFailure, --coverage.reportOnFailure=false
Generate coverage report even when tests fail.
coverage.allowExternal
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.allowExternal, --coverage.allowExternal=false
Collect coverage of files outside the project root.
coverage.excludeAfterRemap 2.1.0+
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.excludeAfterRemap, --coverage.excludeAfterRemap=false
Apply exclusions again after coverage has been remapped to original sources. This is useful when your source files are transpiled and may contain source maps of non-source files.
Use this option when you are seeing files that show up in report even if they match your coverage.exclude patterns.
coverage.skipFull
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.skipFull, --coverage.skipFull=false
Do not show files with 100% statement, branch, and function coverage.
coverage.thresholds
Options for coverage thresholds.
If a threshold is set to a positive number, it will be interpreted as the minimum percentage of coverage required. For example, setting the lines threshold to 90 means that 90% of lines must be covered.
If a threshold is set to a negative number, it will be treated as the maximum number of uncovered items allowed. For example, setting the lines threshold to -10 means that no more than 10 lines may be uncovered.
{
  coverage: {
    thresholds: {
      // Requires 90% function coverage
      functions: 90,

      // Require that no more than 10 lines are uncovered
      lines: -10,
    }
  }
}
coverage.thresholds.lines
Type: number
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.thresholds.lines=<number>
Global threshold for lines.
coverage.thresholds.functions
Type: number
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.thresholds.functions=<number>
Global threshold for functions.
coverage.thresholds.branches
Type: number
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.thresholds.branches=<number>
Global threshold for branches.
coverage.thresholds.statements
Type: number
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.thresholds.statements=<number>
Global threshold for statements.
coverage.thresholds.perFile
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.thresholds.perFile, --coverage.thresholds.perFile=false
Check thresholds per file.
coverage.thresholds.autoUpdate
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.thresholds.autoUpdate=<boolean>
Update all threshold values lines, functions, branches and statements to configuration file when current coverage is better than the configured thresholds. This option helps to maintain thresholds when coverage is improved.
coverage.thresholds.100
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.thresholds.100, --coverage.thresholds.100=false
Sets global thresholds to 100. Shortcut for --coverage.thresholds.lines 100 --coverage.thresholds.functions 100 --coverage.thresholds.branches 100 --coverage.thresholds.statements 100.
coverage.thresholds[glob-pattern]
Type: { statements?: number functions?: number branches?: number lines?: number }
Default: undefined
Available for providers: 'v8' | 'istanbul'
Sets thresholds for files matching the glob pattern.
NOTE
Vitest counts all files, including those covered by glob-patterns, into the global coverage thresholds. This is different from Jest behavior.
{
  coverage: {
    thresholds: {
      // Thresholds for all files
      functions: 95,
      branches: 70,

      // Thresholds for matching glob pattern
      'src/utils/**.ts': {
        statements: 95,
        functions: 90,
        branches: 85,
        lines: 80,
      },

      // Files matching this pattern will only have lines thresholds set.
      // Global thresholds are not inherited.
      '**/math.ts': {
        lines: 100,
      }
    }
  }
}
coverage.thresholds[glob-pattern].100 2.1.0+
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
Sets thresholds to 100 for files matching the glob pattern.
{
  coverage: {
    thresholds: {
      // Thresholds for all files
      functions: 95,
      branches: 70,

      // Thresholds for matching glob pattern
      'src/utils/**.ts': { 100: true },
      '**/math.ts': { 100: true }
    }
  }
}
coverage.ignoreEmptyLines
Type: boolean
Default: true (false in v1)
Available for providers: 'v8'
CLI: --coverage.ignoreEmptyLines=<boolean>
Ignore empty lines, comments and other non-runtime code, e.g. Typescript types. Requires experimentalAstAwareRemapping: false.
This option works only if the used compiler removes comments and other non-runtime code from the transpiled code. By default Vite uses ESBuild which removes comments and Typescript types from .ts, .tsx and .jsx files.
If you want to apply ESBuild to other files as well, define them in esbuild options:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  esbuild: {
    // Transpile all files with ESBuild to remove comments from code coverage.
    // Required for `test.coverage.ignoreEmptyLines` to work:
    include: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.ts', '**/*.tsx'],
  },
  test: {
    coverage: {
      provider: 'v8',
      ignoreEmptyLines: true,
    },
  },
})
coverage.experimentalAstAwareRemapping
Type: boolean
Default: false
Available for providers: 'v8'
CLI: --coverage.experimentalAstAwareRemapping=<boolean>
Remap coverage with experimental AST based analysis. Provides more accurate results compared to default mode.
coverage.ignoreClassMethods
Type: string[]
Default: []
Available for providers: 'istanbul'
CLI: --coverage.ignoreClassMethods=<method>
Set to array of class method names to ignore for coverage. See istanbul documentation for more information.
coverage.watermarks
Type:
{
  statements?: [number, number],
  functions?: [number, number],
  branches?: [number, number],
  lines?: [number, number]
}
Default:
{
  statements: [50, 80],
  functions: [50, 80],
  branches: [50, 80],
  lines: [50, 80]
}
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.watermarks.statements=50,80, --coverage.watermarks.branches=50,80
Watermarks for statements, lines, branches and functions. See istanbul documentation for more information.
coverage.processingConcurrency
Type: boolean
Default: Math.min(20, os.availableParallelism?.() ?? os.cpus().length)
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.processingConcurrency=<number>
Concurrency limit used when processing the coverage results.
coverage.customProviderModule
Type: string
Available for providers: 'custom'
CLI: --coverage.customProviderModule=<path or module name>
Specifies the module name or path for the custom coverage provider module. See Guide - Custom Coverage Provider for more information.
testNamePattern *
Type string | RegExp
CLI: -t <pattern>, --testNamePattern=<pattern>, --test-name-pattern=<pattern>
Run tests with full names matching the pattern. If you add OnlyRunThis to this property, tests not containing the word OnlyRunThis in the test name will be skipped.
import { expect, test } from 'vitest'

// run
test('OnlyRunThis', () => {
  expect(true).toBe(true)
})

// skipped
test('doNotRun', () => {
  expect(true).toBe(true)
})
open *
Type: boolean
Default: !process.env.CI
CLI: --open, --open=false
Open Vitest UI (WIP)
api
Type: boolean | number
Default: false
CLI: --api, --api.port, --api.host, --api.strictPort
Listen to port and serve API. When set to true, the default port is 51204
browser experimental
Default: { enabled: false }
CLI: --browser=<name>, --browser.name=chrome --browser.headless
Configuration for running browser tests. Please, refer to the "Browser Config Reference" article.
WARNING
This is an experimental feature. Breaking changes might not follow SemVer, please pin Vitest's version when using it.
clearMocks
Type: boolean
Default: false
Will call .mockClear() on all spies before each test. This will clear mock history without affecting mock implementations.
mockReset
Type: boolean
Default: false
Will call .mockReset() on all spies before each test. This will clear mock history and reset each implementation to its original.
restoreMocks
Type: boolean
Default: false
Will call .mockRestore() on all spies before each test. This will clear mock history, restore each implementation to its original, and restore original descriptors of spied-on objects..
unstubEnvs
Type: boolean
Default: false
Will call vi.unstubAllEnvs before each test.
unstubGlobals
Type: boolean
Default: false
Will call vi.unstubAllGlobals before each test.
testTransformMode
Type: { web?, ssr? }
Determine the transform method for all modules imported inside a test that matches the glob pattern. By default, relies on the environment. For example, tests with JSDOM environment will process all files with ssr: false flag and tests with Node environment process all modules with ssr: true.
testTransformMode.ssr
Type: string[]
Default: []
Use SSR transform pipeline for all modules inside specified tests.
Vite plugins will receive ssr: true flag when processing those files.
testTransformMode.web
Type: string[]
Default: []
First do a normal transform pipeline (targeting browser), then do a SSR rewrite to run the code in Node.
Vite plugins will receive ssr: false flag when processing those files.
snapshotFormat *
Type: PrettyFormatOptions
Format options for snapshot testing. These options are passed down to pretty-format.
TIP
Beware that plugins field on this object will be ignored.
If you need to extend snapshot serializer via pretty-format plugins, please, use expect.addSnapshotSerializer API or snapshotSerializers option.
snapshotSerializers *
Type: string[]
Default: []
A list of paths to snapshot serializer modules for snapshot testing, useful if you want add custom snapshot serializers. See Custom Serializer for more information.
resolveSnapshotPath *
Type: (testPath: string, snapExtension: string, context: { config: SerializedConfig }) => string
Default: stores snapshot files in __snapshots__ directory
Overrides default snapshot path. For example, to store snapshots next to test files:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
  },
})
allowOnly
Type: boolean
Default: !process.env.CI
CLI: --allowOnly, --allowOnly=false
Allow tests and suites that are marked as only.
dangerouslyIgnoreUnhandledErrors *
Type: boolean
Default: false
CLI: --dangerouslyIgnoreUnhandledErrors --dangerouslyIgnoreUnhandledErrors=false
Ignore any unhandled errors that occur.
passWithNoTests *
Type: boolean
Default: false
CLI: --passWithNoTests, --passWithNoTests=false
Vitest will not fail, if no tests will be found.
logHeapUsage
Type: boolean
Default: false
CLI: --logHeapUsage, --logHeapUsage=false
Show heap usage after each test. Useful for debugging memory leaks.
css
Type: boolean | { include?, exclude?, modules? }
Configure if CSS should be processed. When excluded, CSS files will be replaced with empty strings to bypass the subsequent processing. CSS Modules will return a proxy to not affect runtime.
css.include
Type: RegExp | RegExp[]
Default: []
RegExp pattern for files that should return actual CSS and will be processed by Vite pipeline.
TIP
To process all CSS files, use /.+/.
css.exclude
Type: RegExp | RegExp[]
Default: []
RegExp pattern for files that will return an empty CSS file.
css.modules
Type: { classNameStrategy? }
Default: {}
css.modules.classNameStrategy
Type: 'stable' | 'scoped' | 'non-scoped'
Default: 'stable'
If you decide to process CSS files, you can configure if class names inside CSS modules should be scoped. You can choose one of the options:
stable: class names will be generated as _${name}_${hashedFilename}, which means that generated class will stay the same, if CSS content is changed, but will change, if the name of the file is modified, or file is moved to another folder. This setting is useful, if you use snapshot feature.
scoped: class names will be generated as usual, respecting css.modules.generateScopedName method, if you have one and CSS processing is enabled. By default, filename will be generated as _${name}_${hash}, where hash includes filename and content of the file.
non-scoped: class names will not be hashed.
WARNING
By default, Vitest exports a proxy, bypassing CSS Modules processing. If you rely on CSS properties on your classes, you have to enable CSS processing using include option.
maxConcurrency
Type: number
Default: 5
CLI: --max-concurrency=10, --maxConcurrency=10
A number of tests that are allowed to run at the same time marked with test.concurrent.
Test above this limit will be queued to run when available slot appears.
cache *
Type: false
CLI: --no-cache, --cache=false
Use this option if you want to disable the cache feature. At the moment Vitest stores cache for test results to run the longer and failed tests first.
The cache directory is controlled by the Vite's cacheDir option:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  cacheDir: 'custom-folder/.vitest'
})
You can limit the directory only for Vitest by using process.env.VITEST:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  cacheDir: process.env.VITEST ? 'custom-folder/.vitest' : undefined
})
sequence
Type: { sequencer?, shuffle?, seed?, hooks?, setupFiles?, groupOrder }
Options for how tests should be sorted.
You can provide sequence options to CLI with dot notation:
npx vitest --sequence.shuffle --sequence.seed=1000
sequence.sequencer *
Type: TestSequencerConstructor
Default: BaseSequencer
A custom class that defines methods for sharding and sorting. You can extend BaseSequencer from vitest/node, if you only need to redefine one of the sort and shard methods, but both should exist.
Sharding is happening before sorting, and only if --shard option is provided.
If sequencer.groupOrder is specified, the sequencer will be called once for each group and pool.
groupOrder 3.2.0+
Type: number
Default: 0
Controls the order in which this project runs its tests when using multiple projects.
Projects with the same group order number will run together, and groups are run from lowest to highest.
If you don’t set this option, all projects run in parallel.
If several projects use the same group order, they will run at the same time.
This setting only affects the order in which projects run, not the order of tests within a project. To control test isolation or the order of tests inside a project, use the isolate and sequence.sequencer options.
sequence.shuffle
Type: boolean | { files?, tests? }
Default: false
CLI: --sequence.shuffle, --sequence.shuffle=false
If you want files and tests to run randomly, you can enable it with this option, or CLI argument --sequence.shuffle.
Vitest usually uses cache to sort tests, so long running tests start earlier - this makes tests run faster. If your files and tests will run in random order you will lose this performance improvement, but it may be useful to track tests that accidentally depend on another run previously.
sequence.shuffle.files
Type: boolean
Default: false
CLI: --sequence.shuffle.files, --sequence.shuffle.files=false
Whether to randomize files, be aware that long running tests will not start earlier if you enable this option.
sequence.shuffle.tests
Type: boolean
Default: false
CLI: --sequence.shuffle.tests, --sequence.shuffle.tests=false
Whether to randomize tests.
sequence.concurrent
Type: boolean
Default: false
CLI: --sequence.concurrent, --sequence.concurrent=false
If you want tests to run in parallel, you can enable it with this option, or CLI argument --sequence.concurrent.
sequence.seed *
Type: number
Default: Date.now()
CLI: --sequence.seed=1000
Sets the randomization seed, if tests are running in random order.
sequence.hooks
Type: 'stack' | 'list' | 'parallel'
Default: 'stack'
CLI: --sequence.hooks=<value>
Changes the order in which hooks are executed.
stack will order "after" hooks in reverse order, "before" hooks will run in the order they were defined
list will order all hooks in the order they are defined
parallel will run hooks in a single group in parallel (hooks in parent suites will still run before the current suite's hooks)
TIP
This option doesn't affect onTestFinished. It is always called in reverse order.
sequence.setupFiles
Type: 'list' | 'parallel'
Default: 'parallel'
CLI: --sequence.setupFiles=<value>
Changes the order in which setup files are executed.
list will run setup files in the order they are defined
parallel will run setup files in parallel
typecheck
Options for configuring typechecking test environment.
typecheck.enabled
Type: boolean
Default: false
CLI: --typecheck, --typecheck.enabled
Enable typechecking alongside your regular tests.
typecheck.only
Type: boolean
Default: false
CLI: --typecheck.only
Run only typecheck tests, when typechecking is enabled. When using CLI, this option will automatically enable typechecking.
typecheck.checker
Type: 'tsc' | 'vue-tsc' | string
Default: tsc
What tools to use for type checking. Vitest will spawn a process with certain parameters for easier parsing, depending on the type. Checker should implement the same output format as tsc.
You need to have a package installed to use typechecker:
tsc requires typescript package
vue-tsc requires vue-tsc package
You can also pass down a path to custom binary or command name that produces the same output as tsc --noEmit --pretty false.
typecheck.include
Type: string[]
Default: ['**/*.{test,spec}-d.?(c|m)[jt]s?(x)']
Glob pattern for files that should be treated as test files
typecheck.exclude
Type: string[]
Default: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**']
Glob pattern for files that should not be treated as test files
typecheck.allowJs
Type: boolean
Default: false
Check JS files that have @ts-check comment. If you have it enabled in tsconfig, this will not overwrite it.
typecheck.ignoreSourceErrors
Type: boolean
Default: false
Do not fail, if Vitest found errors outside the test files. This will not show you non-test errors at all.
By default, if Vitest finds source error, it will fail test suite.
typecheck.tsconfig
Type: string
Default: tries to find closest tsconfig.json
Path to custom tsconfig, relative to the project root.
typecheck.spawnTimeout
Type: number
Default: 10_000
Minimum time in milliseconds it takes to spawn the typechecker.
slowTestThreshold *
Type: number
Default: 300
CLI: --slow-test-threshold=<number>, --slowTestThreshold=<number>
The number of milliseconds after which a test or suite is considered slow and reported as such in the results.
chaiConfig
Type: { includeStack?, showDiff?, truncateThreshold? }
Default: { includeStack: false, showDiff: true, truncateThreshold: 40 }
Equivalent to Chai config.
chaiConfig.includeStack
Type: boolean
Default: false
Influences whether stack trace is included in Assertion error message. Default of false suppresses stack trace in the error message.
chaiConfig.showDiff
Type: boolean
Default: true
Influences whether or not the showDiff flag should be included in the thrown AssertionErrors. false will always be false; true will be true when the assertion has requested a diff to be shown.
chaiConfig.truncateThreshold
Type: number
Default: 40
Sets length threshold for actual and expected values in assertion errors. If this threshold is exceeded, for example for large data structures, the value is replaced with something like [ Array(3) ] or { Object (prop1, prop2) }. Set it to 0 if you want to disable truncating altogether.
This config option affects truncating values in test.each titles and inside the assertion error message.
bail
Type: number
Default: 0
CLI: --bail=<value>
Stop test execution when given number of tests have failed.
By default Vitest will run all of your test cases even if some of them fail. This may not be desired for CI builds where you are only interested in 100% successful builds and would like to stop test execution as early as possible when test failures occur. The bail option can be used to speed up CI runs by preventing it from running more tests when failures have occurred.
retry
Type: number
Default: 0
CLI: --retry=<value>
Retry the test specific number of times if it fails.
onConsoleLog *
Type: (log: string, type: 'stdout' | 'stderr') => boolean | void
Custom handler for console.log in tests. If you return false, Vitest will not print the log to the console.
Can be useful for filtering out logs from third-party libraries.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    onConsoleLog(log: string, type: 'stdout' | 'stderr'): boolean | void {
      return !(log === 'message from third party library' && type === 'stdout')
    },
  },
})
onStackTrace *
Type: (error: Error, frame: ParsedStack) => boolean | void
Apply a filtering function to each frame of each stack trace when handling errors. The first argument, error, is an object with the same properties as a standard Error, but it is not an actual instance.
Can be useful for filtering out stack trace frames from third-party libraries.
import type { ParsedStack } from 'vitest'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    onStackTrace(error: Error, { file }: ParsedStack): boolean | void {
      // If we've encountered a ReferenceError, show the whole stack.
      if (error.name === 'ReferenceError') {
        return
      }

      // Reject all frames from third party libraries.
      if (file.includes('node_modules')) {
        return false
      }
    },
  },
})
diff
Type: string
CLI: --diff=<path>
DiffOptions object or a path to a module which exports DiffOptions. Useful if you want to customize diff display.
For example, as a config object:
import { defineConfig } from 'vitest/config'
import c from 'picocolors'

export default defineConfig({
  test: {
    diff: {
      aIndicator: c.bold('--'),
      bIndicator: c.bold('++'),
      omitAnnotationLines: true,
    },
  },
})
Or as a module:
vitest.config.js
vitest.diff.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    diff: './vitest.diff.ts',
  },
})
diff.expand
Type: boolean
Default: true
CLI: --diff.expand=false
Expand all common lines.
diff.truncateThreshold
Type: number
Default: 0
CLI: --diff.truncateThreshold=<path>
The maximum length of diff result to be displayed. Diffs above this threshold will be truncated. Truncation won't take effect with default value 0.
diff.truncateAnnotation
Type: string
Default: '... Diff result is truncated'
CLI: --diff.truncateAnnotation=<annotation>
Annotation that is output at the end of diff result if it's truncated.
diff.truncateAnnotationColor
Type: DiffOptionsColor = (arg: string) => string
Default: noColor = (string: string): string => string
Color of truncate annotation, default is output with no color.
diff.printBasicPrototype
Type: boolean
Default: false
Print basic prototype Object and Array in diff output
diff.maxDepth
Type: number
Default: 20 (or 8 when comparing different types)
Limit the depth to recurse when printing nested objects
fakeTimers
Type: FakeTimerInstallOpts
Options that Vitest will pass down to @sinon/fake-timers when using vi.useFakeTimers().
fakeTimers.now
Type: number | Date
Default: Date.now()
Installs fake timers with the specified Unix epoch.
fakeTimers.toFake
Type: ('setTimeout' | 'clearTimeout' | 'setImmediate' | 'clearImmediate' | 'setInterval' | 'clearInterval' | 'Date' | 'nextTick' | 'hrtime' | 'requestAnimationFrame' | 'cancelAnimationFrame' | 'requestIdleCallback' | 'cancelIdleCallback' | 'performance' | 'queueMicrotask')[]
Default: everything available globally except nextTick and queueMicrotask
An array with names of global methods and APIs to fake.
To only mock setTimeout() and nextTick(), specify this property as ['setTimeout', 'nextTick'].
Mocking nextTick is not supported when running Vitest inside node:child_process by using --pool=forks. NodeJS uses process.nextTick internally in node:child_process and hangs when it is mocked. Mocking nextTick is supported when running Vitest with --pool=threads.
fakeTimers.loopLimit
Type: number
Default: 10_000
The maximum number of timers that will be run when calling vi.runAllTimers().
fakeTimers.shouldAdvanceTime
Type: boolean
Default: false
Tells @sinonjs/fake-timers to increment mocked time automatically based on the real system time shift (e.g. the mocked time will be incremented by 20ms for every 20ms change in the real system time).
fakeTimers.advanceTimeDelta
Type: number
Default: 20
Relevant only when using with shouldAdvanceTime: true. increment mocked time by advanceTimeDelta ms every advanceTimeDelta ms change in the real system time.
fakeTimers.shouldClearNativeTimers
Type: boolean
Default: true
Tells fake timers to clear "native" (i.e. not fake) timers by delegating to their respective handlers. When disabled, it can lead to potentially unexpected behavior if timers existed prior to starting fake timers session.
workspace *
DEPRECATED
This options is deprecated and will be removed in the next major. Please, use projects instead.
Type: string | TestProjectConfiguration[]
CLI: --workspace=./file.js
Default: vitest.{workspace,projects}.{js,ts,json} close to the config file or root
Path to a workspace config file relative to root.
Since Vitest 3, you can also define the workspace array in the root config. If the workspace is defined in the config manually, Vitest will ignore the vitest.workspace file in the root.
projects *
Type: TestProjectConfiguration[]
Default: []
An array of projects.
isolate
Type: boolean
Default: true
CLI: --no-isolate, --isolate=false
Run tests in an isolated environment. This option has no effect on vmThreads and vmForks pools.
Disabling this option might improve performance if your code doesn't rely on side effects (which is usually true for projects with node environment).
TIP
You can disable isolation for specific pools by using poolOptions property.
includeTaskLocation
Type: boolean
Default: false
Should location property be included when Vitest API receives tasks in reporters. If you have a lot of tests, this might cause a small performance regression.
The location property has column and line values that correspond to the test or describe position in the original file.
This option will be auto-enabled if you don't disable it explicitly, and you are running Vitest with:
Vitest UI
or using the Browser Mode without headless mode
or using HTML Reporter
TIP
This option has no effect if you do not use custom code that relies on this.
snapshotEnvironment
Type: string
Path to a custom snapshot environment implementation. This is useful if you are running your tests in an environment that doesn't support Node.js APIs. This option doesn't have any effect on a browser runner.
This object should have the shape of SnapshotEnvironment and is used to resolve and read/write snapshot files:
export interface SnapshotEnvironment {
  getVersion: () => string
  getHeader: () => string
  resolvePath: (filepath: string) => Promise<string>
  resolveRawPath: (testPath: string, rawPath: string) => Promise<string>
  saveSnapshotFile: (filepath: string, snapshot: string) => Promise<void>
  readSnapshotFile: (filepath: string) => Promise<string | null>
  removeSnapshotFile: (filepath: string) => Promise<void>
}
You can extend default VitestSnapshotEnvironment from vitest/snapshot entry point if you need to overwrite only a part of the API.
WARNING
This is a low-level option and should be used only for advanced cases where you don't have access to default Node.js APIs.
If you just need to configure snapshots feature, use snapshotFormat or resolveSnapshotPath options.
env
Type: Partial<NodeJS.ProcessEnv>
Environment variables available on process.env and import.meta.env during tests. These variables will not be available in the main process (in globalSetup, for example).
expect
Type: ExpectOptions
expect.requireAssertions
Type: boolean
Default: false
The same as calling expect.hasAssertions() at the start of every test. This makes sure that no test will pass accidentally.
TIP
This only works with Vitest's expect. If you use assert or .should assertions, they will not count, and your test will fail due to the lack of expect assertions.
You can change the value of this by calling vi.setConfig({ expect: { requireAssertions: false } }). The config will be applied to every subsequent expect call until the vi.resetConfig is called manually.
expect.poll
Global configuration options for expect.poll. These are the same options you can pass down to expect.poll(condition, options).
expect.poll.interval
Type: number
Default: 50
Polling interval in milliseconds
expect.poll.timeout
Type: number
Default: 1000
Polling timeout in milliseconds
printConsoleTrace
Type: boolean
Default: false
Always print console traces when calling any console method. This is useful for debugging.
attachmentsDir 3.2.0+
Type: string
Default: '.vitest-attachments'
Directory path for storing attachments created by context.annotate relative to the project root.
Suggest changes to this page
Last updated: 6/12/25, 6:35 PM
Pager
Previous page
Features
Next page
Test API Reference

Test API Reference
The following types are used in the type signatures below
type Awaitable<T> = T | PromiseLike<T>
type TestFunction = () => Awaitable<void>

interface TestOptions {
  /**
   * Will fail the test if it takes too long to execute
   */
  timeout?: number
  /**
   * Will retry the test specific number of times if it fails
   *
   * @default 0
   */
  retry?: number
  /**
   * Will repeat the same test several times even if it fails each time
   * If you have "retry" option and it fails, it will use every retry in each cycle
   * Useful for debugging random failings
   *
   * @default 0
   */
  repeats?: number
}
When a test function returns a promise, the runner will wait until it is resolved to collect async expectations. If the promise is rejected, the test will fail.
TIP
In Jest, TestFunction can also be of type (done: DoneCallback) => void. If this form is used, the test will not be concluded until done is called. You can achieve the same using an async function, see the Migration guide Done Callback section.
You can define options by chaining properties on a function:
import { test } from 'vitest'

test.skip('skipped test', () => {
  // some logic that fails right now
})

test.concurrent.skip('skipped concurrent test', () => {
  // some logic that fails right now
})
But you can also provide an object as a second argument instead:
import { test } from 'vitest'

test('skipped test', { skip: true }, () => {
  // some logic that fails right now
})

test('skipped concurrent test', { skip: true, concurrent: true }, () => {
  // some logic that fails right now
})
They both work in exactly the same way. To use either one is purely a stylistic choice.
Note that if you are providing timeout as the last argument, you cannot use options anymore:
import { test } from 'vitest'

// ✅ this works
test.skip('heavy test', () => {
  // ...
}, 10_000)

// ❌ this doesn't work
test('heavy test', { skip: true }, () => {
  // ...
}, 10_000)
However, you can provide a timeout inside the object:
import { test } from 'vitest'

// ✅ this works
test('heavy test', { skip: true, timeout: 10_000 }, () => {
  // ...
})
test
Alias: it
test defines a set of related expectations. It receives the test name and a function that holds the expectations to test.
Optionally, you can provide a timeout (in milliseconds) for specifying how long to wait before terminating. The default is 5 seconds, and can be configured globally with testTimeout
import { expect, test } from 'vitest'

test('should work as expected', () => {
  expect(Math.sqrt(4)).toBe(2)
})
test.extend
Alias: it.extend
Use test.extend to extend the test context with custom fixtures. This will return a new test and it's also extendable, so you can compose more fixtures or override existing ones by extending it as you need. See Extend Test Context for more information.
import { expect, test } from 'vitest'

const todos = []
const archive = []

const myTest = test.extend({
  todos: async ({ task }, use) => {
    todos.push(1, 2, 3)
    await use(todos)
    todos.length = 0
  },
  archive
})

myTest('add item', ({ todos }) => {
  expect(todos.length).toBe(3)

  todos.push(4)
  expect(todos.length).toBe(4)
})
test.skip
Alias: it.skip
If you want to skip running certain tests, but you don't want to delete the code due to any reason, you can use test.skip to avoid running them.
import { assert, test } from 'vitest'

test.skip('skipped test', () => {
  // Test skipped, no error
  assert.equal(Math.sqrt(4), 3)
})
You can also skip test by calling skip on its context dynamically:
import { assert, test } from 'vitest'

test('skipped test', (context) => {
  context.skip()
  // Test skipped, no error
  assert.equal(Math.sqrt(4), 3)
})
Since Vitest 3.1, if the condition is unknown, you can provide it to the skip method as the first arguments:
import { assert, test } from 'vitest'

test('skipped test', (context) => {
  context.skip(Math.random() < 0.5, 'optional message')
  // Test skipped, no error
  assert.equal(Math.sqrt(4), 3)
})
test.skipIf
Alias: it.skipIf
In some cases you might run tests multiple times with different environments, and some of the tests might be environment-specific. Instead of wrapping the test code with if, you can use test.skipIf to skip the test whenever the condition is truthy.
import { assert, test } from 'vitest'

const isDev = process.env.NODE_ENV === 'development'

test.skipIf(isDev)('prod only test', () => {
  // this test only runs in production
})
WARNING
You cannot use this syntax when using Vitest as type checker.
test.runIf
Alias: it.runIf
Opposite of test.skipIf.
import { assert, test } from 'vitest'

const isDev = process.env.NODE_ENV === 'development'

test.runIf(isDev)('dev only test', () => {
  // this test only runs in development
})
WARNING
You cannot use this syntax when using Vitest as type checker.
test.only
Alias: it.only
Use test.only to only run certain tests in a given suite. This is useful when debugging.
Optionally, you can provide a timeout (in milliseconds) for specifying how long to wait before terminating. The default is 5 seconds, and can be configured globally with testTimeout.
import { assert, test } from 'vitest'

test.only('test', () => {
  // Only this test (and others marked with only) are run
  assert.equal(Math.sqrt(4), 2)
})
Sometimes it is very useful to run only tests in a certain file, ignoring all other tests from the whole test suite, which pollute the output.
In order to do that run vitest with specific file containing the tests in question.
# vitest interesting.test.ts
test.concurrent
Alias: it.concurrent
test.concurrent marks consecutive tests to be run in parallel. It receives the test name, an async function with the tests to collect, and an optional timeout (in milliseconds).
import { describe, test } from 'vitest'

// The two tests marked with concurrent will be run in parallel
describe('suite', () => {
  test('serial test', async () => { /* ... */ })
  test.concurrent('concurrent test 1', async () => { /* ... */ })
  test.concurrent('concurrent test 2', async () => { /* ... */ })
})
test.skip, test.only, and test.todo works with concurrent tests. All the following combinations are valid:
test.concurrent(/* ... */)
test.skip.concurrent(/* ... */) // or test.concurrent.skip(/* ... */)
test.only.concurrent(/* ... */) // or test.concurrent.only(/* ... */)
test.todo.concurrent(/* ... */) // or test.concurrent.todo(/* ... */)
When running concurrent tests, Snapshots and Assertions must use expect from the local Test Context to ensure the right test is detected.
test.concurrent('test 1', async ({ expect }) => {
  expect(foo).toMatchSnapshot()
})
test.concurrent('test 2', async ({ expect }) => {
  expect(foo).toMatchSnapshot()
})
WARNING
You cannot use this syntax when using Vitest as type checker.
test.sequential
Alias: it.sequential
test.sequential marks a test as sequential. This is useful if you want to run tests in sequence within describe.concurrent or with the --sequence.concurrent command option.
import { describe, test } from 'vitest'

// with config option { sequence: { concurrent: true } }
test('concurrent test 1', async () => { /* ... */ })
test('concurrent test 2', async () => { /* ... */ })

test.sequential('sequential test 1', async () => { /* ... */ })
test.sequential('sequential test 2', async () => { /* ... */ })

// within concurrent suite
describe.concurrent('suite', () => {
  test('concurrent test 1', async () => { /* ... */ })
  test('concurrent test 2', async () => { /* ... */ })

  test.sequential('sequential test 1', async () => { /* ... */ })
  test.sequential('sequential test 2', async () => { /* ... */ })
})
test.todo
Alias: it.todo
Use test.todo to stub tests to be implemented later. An entry will be shown in the report for the tests so you know how many tests you still need to implement.
// An entry will be shown in the report for this test
test.todo('unimplemented test')
test.fails
Alias: it.fails
Use test.fails to indicate that an assertion will fail explicitly.
import { expect, test } from 'vitest'

function myAsyncFunc() {
  return new Promise(resolve => resolve(1))
}
test.fails('fail test', async () => {
  await expect(myAsyncFunc()).rejects.toBe(1)
})
WARNING
You cannot use this syntax when using Vitest as type checker.
test.each
Alias: it.each
TIP
While test.each is provided for Jest compatibility, Vitest also has test.for with an additional feature to integrate TestContext.
Use test.each when you need to run the same test with different variables. You can inject parameters with printf formatting in the test name in the order of the test function parameters.
%s: string
%d: number
%i: integer
%f: floating point value
%j: json
%o: object
%#: 0-based index of the test case
%$: 1-based index of the test case
%%: single percent sign ('%')
import { expect, test } from 'vitest'

test.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add(%i, %i) -> %i', (a, b, expected) => {
  expect(a + b).toBe(expected)
})

// this will return
// ✓ add(1, 1) -> 2
// ✓ add(1, 2) -> 3
// ✓ add(2, 1) -> 3
You can also access object properties and array elements with $ prefix:
test.each([
  { a: 1, b: 1, expected: 2 },
  { a: 1, b: 2, expected: 3 },
  { a: 2, b: 1, expected: 3 },
])('add($a, $b) -> $expected', ({ a, b, expected }) => {
  expect(a + b).toBe(expected)
})

// this will return
// ✓ add(1, 1) -> 2
// ✓ add(1, 2) -> 3
// ✓ add(2, 1) -> 3

test.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add($0, $1) -> $2', (a, b, expected) => {
  expect(a + b).toBe(expected)
})

// this will return
// ✓ add(1, 1) -> 2
// ✓ add(1, 2) -> 3
// ✓ add(2, 1) -> 3
You can also access Object attributes with ., if you are using objects as arguments:
test.each`
a               | b      | expected
${{ val: 1 }}   | ${'b'} | ${'1b'}
${{ val: 2 }}   | ${'b'} | ${'2b'}
${{ val: 3 }}   | ${'b'} | ${'3b'}
`('add($a.val, $b) -> $expected', ({ a, b, expected }) => {
  expect(a.val + b).toBe(expected)
})

// this will return
// ✓ add(1, b) -> 1b
// ✓ add(2, b) -> 2b
// ✓ add(3, b) -> 3b
Starting from Vitest 0.25.3, you can also use template string table.
First row should be column names, separated by |;
One or more subsequent rows of data supplied as template literal expressions using ${value} syntax.
import { expect, test } from 'vitest'

test.each`
  a               | b      | expected
  ${1}            | ${1}   | ${2}
  ${'a'}          | ${'b'} | ${'ab'}
  ${[]}           | ${'b'} | ${'b'}
  ${{}}           | ${'b'} | ${'[object Object]b'}
  ${{ asd: 1 }}   | ${'b'} | ${'[object Object]b'}
`('returns $expected when $a is added $b', ({ a, b, expected }) => {
  expect(a + b).toBe(expected)
})
TIP
Vitest processes $values with Chai format method. If the value is too truncated, you can increase chaiConfig.truncateThreshold in your config file.
WARNING
You cannot use this syntax when using Vitest as type checker.
test.for
Alias: it.for
Alternative to test.each to provide TestContext.
The difference from test.each lies in how arrays are provided in the arguments. Non-array arguments to test.for (including template string usage) work exactly the same as for test.each.
// `each` spreads arrays
test.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add(%i, %i) -> %i', (a, b, expected) => { 
  expect(a + b).toBe(expected)
})

// `for` doesn't spread arrays (notice the square brackets around the arguments)
test.for([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add(%i, %i) -> %i', ([a, b, expected]) => { 
  expect(a + b).toBe(expected)
})
The 2nd argument is TestContext and can be used for concurrent snapshots, for example:
test.concurrent.for([
  [1, 1],
  [1, 2],
  [2, 1],
])('add(%i, %i)', ([a, b], { expect }) => {
  expect(a + b).matchSnapshot()
})
bench
Type: (name: string | Function, fn: BenchFunction, options?: BenchOptions) => void
bench defines a benchmark. In Vitest terms, benchmark is a function that defines a series of operations. Vitest runs this function multiple times to display different performance results.
Vitest uses the tinybench library under the hood, inheriting all its options that can be used as a third argument.
import { bench } from 'vitest'

bench('normal sorting', () => {
  const x = [1, 5, 4, 2, 3]
  x.sort((a, b) => {
    return a - b
  })
}, { time: 1000 })
export interface Options {
  /**
   * time needed for running a benchmark task (milliseconds)
   * @default 500
   */
  time?: number

  /**
   * number of times that a task should run if even the time option is finished
   * @default 10
   */
  iterations?: number

  /**
   * function to get the current timestamp in milliseconds
   */
  now?: () => number

  /**
   * An AbortSignal for aborting the benchmark
   */
  signal?: AbortSignal

  /**
   * Throw if a task fails (events will not work if true)
   */
  throws?: boolean

  /**
   * warmup time (milliseconds)
   * @default 100ms
   */
  warmupTime?: number

  /**
   * warmup iterations
   * @default 5
   */
  warmupIterations?: number

  /**
   * setup function to run before each benchmark task (cycle)
   */
  setup?: Hook

  /**
   * teardown function to run after each benchmark task (cycle)
   */
  teardown?: Hook
}
After the test case is run, the output structure information is as follows:
 name                      hz     min     max    mean     p75     p99    p995    p999     rme  samples
· normal sorting  6,526,368.12  0.0001  0.3638  0.0002  0.0002  0.0002  0.0002  0.0004  ±1.41%   652638
export interface TaskResult {
  /*
   * the last error that was thrown while running the task
   */
  error?: unknown

  /**
   * The amount of time in milliseconds to run the benchmark task (cycle).
   */
  totalTime: number

  /**
   * the minimum value in the samples
   */
  min: number
  /**
   * the maximum value in the samples
   */
  max: number

  /**
   * the number of operations per second
   */
  hz: number

  /**
   * how long each operation takes (ms)
   */
  period: number

  /**
   * task samples of each task iteration time (ms)
   */
  samples: number[]

  /**
   * samples mean/average (estimate of the population mean)
   */
  mean: number

  /**
   * samples variance (estimate of the population variance)
   */
  variance: number

  /**
   * samples standard deviation (estimate of the population standard deviation)
   */
  sd: number

  /**
   * standard error of the mean (a.k.a. the standard deviation of the sampling distribution of the sample mean)
   */
  sem: number

  /**
   * degrees of freedom
   */
  df: number

  /**
   * critical value of the samples
   */
  critical: number

  /**
   * margin of error
   */
  moe: number

  /**
   * relative margin of error
   */
  rme: number

  /**
   * median absolute deviation
   */
  mad: number

  /**
   * p50/median percentile
   */
  p50: number

  /**
   * p75 percentile
   */
  p75: number

  /**
   * p99 percentile
   */
  p99: number

  /**
   * p995 percentile
   */
  p995: number

  /**
   * p999 percentile
   */
  p999: number
}
bench.skip
Type: (name: string | Function, fn: BenchFunction, options?: BenchOptions) => void
You can use bench.skip syntax to skip running certain benchmarks.
import { bench } from 'vitest'

bench.skip('normal sorting', () => {
  const x = [1, 5, 4, 2, 3]
  x.sort((a, b) => {
    return a - b
  })
})
bench.only
Type: (name: string | Function, fn: BenchFunction, options?: BenchOptions) => void
Use bench.only to only run certain benchmarks in a given suite. This is useful when debugging.
import { bench } from 'vitest'

bench.only('normal sorting', () => {
  const x = [1, 5, 4, 2, 3]
  x.sort((a, b) => {
    return a - b
  })
})
bench.todo
Type: (name: string | Function) => void
Use bench.todo to stub benchmarks to be implemented later.
import { bench } from 'vitest'

bench.todo('unimplemented test')
describe
When you use test or bench in the top level of file, they are collected as part of the implicit suite for it. Using describe you can define a new suite in the current context, as a set of related tests or benchmarks and other nested suites. A suite lets you organize your tests and benchmarks so reports are more clear.
// basic.spec.ts
// organizing tests

import { describe, expect, test } from 'vitest'

const person = {
  isActive: true,
  age: 32,
}

describe('person', () => {
  test('person is defined', () => {
    expect(person).toBeDefined()
  })

  test('is active', () => {
    expect(person.isActive).toBeTruthy()
  })

  test('age limit', () => {
    expect(person.age).toBeLessThanOrEqual(32)
  })
})
// basic.bench.ts
// organizing benchmarks

import { bench, describe } from 'vitest'

describe('sort', () => {
  bench('normal', () => {
    const x = [1, 5, 4, 2, 3]
    x.sort((a, b) => {
      return a - b
    })
  })

  bench('reverse', () => {
    const x = [1, 5, 4, 2, 3]
    x.reverse().sort((a, b) => {
      return a - b
    })
  })
})
You can also nest describe blocks if you have a hierarchy of tests or benchmarks:
import { describe, expect, test } from 'vitest'

function numberToCurrency(value: number | string) {
  if (typeof value !== 'number') {
    throw new TypeError('Value must be a number')
  }

  return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

describe('numberToCurrency', () => {
  describe('given an invalid number', () => {
    test('composed of non-numbers to throw error', () => {
      expect(() => numberToCurrency('abc')).toThrowError()
    })
  })

  describe('given a valid number', () => {
    test('returns the correct currency format', () => {
      expect(numberToCurrency(10000)).toBe('10,000.00')
    })
  })
})
describe.skip
Alias: suite.skip
Use describe.skip in a suite to avoid running a particular describe block.
import { assert, describe, test } from 'vitest'

describe.skip('skipped suite', () => {
  test('sqrt', () => {
    // Suite skipped, no error
    assert.equal(Math.sqrt(4), 3)
  })
})
describe.skipIf
Alias: suite.skipIf
In some cases, you might run suites multiple times with different environments, and some of the suites might be environment-specific. Instead of wrapping the suite with if, you can use describe.skipIf to skip the suite whenever the condition is truthy.
import { describe, test } from 'vitest'

const isDev = process.env.NODE_ENV === 'development'

describe.skipIf(isDev)('prod only test suite', () => {
  // this test suite only runs in production
})
WARNING
You cannot use this syntax when using Vitest as type checker.
describe.runIf
Alias: suite.runIf
Opposite of describe.skipIf.
import { assert, describe, test } from 'vitest'

const isDev = process.env.NODE_ENV === 'development'

describe.runIf(isDev)('dev only test suite', () => {
  // this test suite only runs in development
})
WARNING
You cannot use this syntax when using Vitest as type checker.
describe.only
Type: (name: string | Function, fn: TestFunction, options?: number | TestOptions) => void
Use describe.only to only run certain suites
import { assert, describe, test } from 'vitest'

// Only this suite (and others marked with only) are run
describe.only('suite', () => {
  test('sqrt', () => {
    assert.equal(Math.sqrt(4), 3)
  })
})

describe('other suite', () => {
  // ... will be skipped
})
Sometimes it is very useful to run only tests in a certain file, ignoring all other tests from the whole test suite, which pollute the output.
In order to do that run vitest with specific file containing the tests in question.
# vitest interesting.test.ts
describe.concurrent
Alias: suite.concurrent
describe.concurrent runs all inner suites and tests in parallel
import { describe, test } from 'vitest'

// All suites and tests within this suite will be run in parallel
describe.concurrent('suite', () => {
  test('concurrent test 1', async () => { /* ... */ })
  describe('concurrent suite 2', async () => {
    test('concurrent test inner 1', async () => { /* ... */ })
    test('concurrent test inner 2', async () => { /* ... */ })
  })
  test.concurrent('concurrent test 3', async () => { /* ... */ })
})
.skip, .only, and .todo works with concurrent suites. All the following combinations are valid:
describe.concurrent(/* ... */)
describe.skip.concurrent(/* ... */) // or describe.concurrent.skip(/* ... */)
describe.only.concurrent(/* ... */) // or describe.concurrent.only(/* ... */)
describe.todo.concurrent(/* ... */) // or describe.concurrent.todo(/* ... */)
When running concurrent tests, Snapshots and Assertions must use expect from the local Test Context to ensure the right test is detected.
describe.concurrent('suite', () => {
  test('concurrent test 1', async ({ expect }) => {
    expect(foo).toMatchSnapshot()
  })
  test('concurrent test 2', async ({ expect }) => {
    expect(foo).toMatchSnapshot()
  })
})
WARNING
You cannot use this syntax when using Vitest as type checker.
describe.sequential
Alias: suite.sequential
describe.sequential in a suite marks every test as sequential. This is useful if you want to run tests in sequence within describe.concurrent or with the --sequence.concurrent command option.
import { describe, test } from 'vitest'

describe.concurrent('suite', () => {
  test('concurrent test 1', async () => { /* ... */ })
  test('concurrent test 2', async () => { /* ... */ })

  describe.sequential('', () => {
    test('sequential test 1', async () => { /* ... */ })
    test('sequential test 2', async () => { /* ... */ })
  })
})
describe.shuffle
Alias: suite.shuffle
Vitest provides a way to run all tests in random order via CLI flag --sequence.shuffle or config option sequence.shuffle, but if you want to have only part of your test suite to run tests in random order, you can mark it with this flag.
import { describe, test } from 'vitest'

// or describe('suite', { shuffle: true }, ...)
describe.shuffle('suite', () => {
  test('random test 1', async () => { /* ... */ })
  test('random test 2', async () => { /* ... */ })
  test('random test 3', async () => { /* ... */ })

  // `shuffle` is inherited
  describe('still random', () => {
    test('random 4.1', async () => { /* ... */ })
    test('random 4.2', async () => { /* ... */ })
  })

  // disable shuffle inside
  describe('not random', { shuffle: false }, () => {
    test('in order 5.1', async () => { /* ... */ })
    test('in order 5.2', async () => { /* ... */ })
  })
})
// order depends on sequence.seed option in config (Date.now() by default)
.skip, .only, and .todo works with random suites.
WARNING
You cannot use this syntax when using Vitest as type checker.
describe.todo
Alias: suite.todo
Use describe.todo to stub suites to be implemented later. An entry will be shown in the report for the tests so you know how many tests you still need to implement.
// An entry will be shown in the report for this suite
describe.todo('unimplemented suite')
describe.each
Alias: suite.each
TIP
While describe.each is provided for Jest compatibility, Vitest also has describe.for which simplifies argument types and aligns with test.for.
Use describe.each if you have more than one test that depends on the same data.
import { describe, expect, test } from 'vitest'

describe.each([
  { a: 1, b: 1, expected: 2 },
  { a: 1, b: 2, expected: 3 },
  { a: 2, b: 1, expected: 3 },
])('describe object add($a, $b)', ({ a, b, expected }) => {
  test(`returns ${expected}`, () => {
    expect(a + b).toBe(expected)
  })

  test(`returned value not be greater than ${expected}`, () => {
    expect(a + b).not.toBeGreaterThan(expected)
  })

  test(`returned value not be less than ${expected}`, () => {
    expect(a + b).not.toBeLessThan(expected)
  })
})
Starting from Vitest 0.25.3, you can also use template string table.
First row should be column names, separated by |;
One or more subsequent rows of data supplied as template literal expressions using ${value} syntax.
import { describe, expect, test } from 'vitest'

describe.each`
  a               | b      | expected
  ${1}            | ${1}   | ${2}
  ${'a'}          | ${'b'} | ${'ab'}
  ${[]}           | ${'b'} | ${'b'}
  ${{}}           | ${'b'} | ${'[object Object]b'}
  ${{ asd: 1 }}   | ${'b'} | ${'[object Object]b'}
`('describe template string add($a, $b)', ({ a, b, expected }) => {
  test(`returns ${expected}`, () => {
    expect(a + b).toBe(expected)
  })
})
WARNING
You cannot use this syntax when using Vitest as type checker.
describe.for
Alias: suite.for
The difference from describe.each is how array case is provided in the arguments. Other non array case (including template string usage) works exactly same.
// `each` spreads array case
describe.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add(%i, %i) -> %i', (a, b, expected) => { 
  test('test', () => {
    expect(a + b).toBe(expected)
  })
})

// `for` doesn't spread array case
describe.for([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add(%i, %i) -> %i', ([a, b, expected]) => { 
  test('test', () => {
    expect(a + b).toBe(expected)
  })
})
Setup and Teardown
These functions allow you to hook into the life cycle of tests to avoid repeating setup and teardown code. They apply to the current context: the file if they are used at the top-level or the current suite if they are inside a describe block. These hooks are not called, when you are running Vitest as a type checker.
beforeEach
Type: beforeEach(fn: () => Awaitable<void>, timeout?: number)
Register a callback to be called before each of the tests in the current context runs. If the function returns a promise, Vitest waits until the promise resolve before running the test.
Optionally, you can pass a timeout (in milliseconds) defining how long to wait before terminating. The default is 5 seconds.
import { beforeEach } from 'vitest'

beforeEach(async () => {
  // Clear mocks and add some testing data before each test run
  await stopMocking()
  await addUser({ name: 'John' })
})
Here, the beforeEach ensures that user is added for each test.
beforeEach also accepts an optional cleanup function (equivalent to afterEach).
import { beforeEach } from 'vitest'

beforeEach(async () => {
  // called once before each test run
  await prepareSomething()

  // clean up function, called once after each test run
  return async () => {
    await resetSomething()
  }
})
afterEach
Type: afterEach(fn: () => Awaitable<void>, timeout?: number)
Register a callback to be called after each one of the tests in the current context completes. If the function returns a promise, Vitest waits until the promise resolve before continuing.
Optionally, you can provide a timeout (in milliseconds) for specifying how long to wait before terminating. The default is 5 seconds.
import { afterEach } from 'vitest'

afterEach(async () => {
  await clearTestingData() // clear testing data after each test run
})
Here, the afterEach ensures that testing data is cleared after each test runs.
TIP
Vitest 1.3.0 added onTestFinished hook. You can call it during the test execution to cleanup any state after the test has finished running.
beforeAll
Type: beforeAll(fn: () => Awaitable<void>, timeout?: number)
Register a callback to be called once before starting to run all tests in the current context. If the function returns a promise, Vitest waits until the promise resolve before running tests.
Optionally, you can provide a timeout (in milliseconds) for specifying how long to wait before terminating. The default is 5 seconds.
import { beforeAll } from 'vitest'

beforeAll(async () => {
  await startMocking() // called once before all tests run
})
Here the beforeAll ensures that the mock data is set up before tests run.
beforeAll also accepts an optional cleanup function (equivalent to afterAll).
import { beforeAll } from 'vitest'

beforeAll(async () => {
  // called once before all tests run
  await startMocking()

  // clean up function, called once after all tests run
  return async () => {
    await stopMocking()
  }
})
afterAll
Type: afterAll(fn: () => Awaitable<void>, timeout?: number)
Register a callback to be called once after all tests have run in the current context. If the function returns a promise, Vitest waits until the promise resolve before continuing.
Optionally, you can provide a timeout (in milliseconds) for specifying how long to wait before terminating. The default is 5 seconds.
import { afterAll } from 'vitest'

afterAll(async () => {
  await stopMocking() // this method is called after all tests run
})
Here the afterAll ensures that stopMocking method is called after all tests run.
Test Hooks
Vitest provides a few hooks that you can call during the test execution to cleanup the state when the test has finished running.
WARNING
These hooks will throw an error if they are called outside of the test body.
onTestFinished
This hook is always called after the test has finished running. It is called after afterEach hooks since they can influence the test result. It receives an ExtendedContext object like beforeEach and afterEach.
import { onTestFinished, test } from 'vitest'

test('performs a query', () => {
  const db = connectDb()
  onTestFinished(() => db.close())
  db.query('SELECT * FROM users')
})
WARNING
If you are running tests concurrently, you should always use onTestFinished hook from the test context since Vitest doesn't track concurrent tests in global hooks:
import { test } from 'vitest'

test.concurrent('performs a query', ({ onTestFinished }) => {
  const db = connectDb()
  onTestFinished(() => db.close())
  db.query('SELECT * FROM users')
})
This hook is particularly useful when creating reusable logic:
// this can be in a separate file
function getTestDb() {
  const db = connectMockedDb()
  onTestFinished(() => db.close())
  return db
}

test('performs a user query', async () => {
  const db = getTestDb()
  expect(
    await db.query('SELECT * from users').perform()
  ).toEqual([])
})

test('performs an organization query', async () => {
  const db = getTestDb()
  expect(
    await db.query('SELECT * from organizations').perform()
  ).toEqual([])
})
TIP
This hook is always called in reverse order and is not affected by sequence.hooks option.
onTestFailed
This hook is called only after the test has failed. It is called after afterEach hooks since they can influence the test result. It receives an ExtendedContext object like beforeEach and afterEach. This hook is useful for debugging.
import { onTestFailed, test } from 'vitest'

test('performs a query', () => {
  const db = connectDb()
  onTestFailed(({ task }) => {
    console.log(task.result.errors)
  })
  db.query('SELECT * FROM users')
})
WARNING
If you are running tests concurrently, you should always use onTestFailed hook from the test context since Vitest doesn't track concurrent tests in global hooks:
import { test } from 'vitest'

test.concurrent('performs a query', ({ onTestFailed }) => {
  const db = connectDb()
  onTestFailed(({ task }) => {
    console.log(task.result.errors)
  })
  db.query('SELECT * FROM users')
})
Suggest changes to this page
Last updated: 5/23/25, 10:32 AM
Pager
Previous page
Config Reference
Next page
Mock Functions
Mock Functions
You can create a mock function to track its execution with vi.fn method. If you want to track a method on an already created object, you can use vi.spyOn method:
import { vi } from 'vitest'

const fn = vi.fn()
fn('hello world')
fn.mock.calls[0] === ['hello world']

const market = {
  getApples: () => 100
}

const getApplesSpy = vi.spyOn(market, 'getApples')
market.getApples()
getApplesSpy.mock.calls.length === 1
You should use mock assertions (e.g., toHaveBeenCalled) on expect to assert mock result. This API reference describes available properties and methods to manipulate mock behavior.
TIP
The custom function implementation in the types below is marked with a generic <T>.
getMockImplementation
function getMockImplementation(): T | undefined
Returns current mock implementation if there is one.
If the mock was created with vi.fn, it will use the provided method as the mock implementation.
If the mock was created with vi.spyOn, it will return undefined unless a custom implementation is provided.
getMockName
function getMockName(): string
Use it to return the name assigned to the mock with the .mockName(name) method. By default, it will return vi.fn().
mockClear
function mockClear(): MockInstance<T>
Clears all information about every call. After calling it, all properties on .mock will return to their initial state. This method does not reset implementations. It is useful for cleaning up mocks between different assertions.
const person = {
  greet: (name: string) => `Hello ${name}`,
}
const spy = vi.spyOn(person, 'greet').mockImplementation(() => 'mocked')
expect(person.greet('Alice')).toBe('mocked')
expect(spy.mock.calls).toEqual([['Alice']])

// clear call history but keep mock implementation
spy.mockClear()
expect(spy.mock.calls).toEqual([])
expect(person.greet('Bob')).toBe('mocked')
expect(spy.mock.calls).toEqual([['Bob']])
To automatically call this method before each test, enable the clearMocks setting in the configuration.
mockName
function mockName(name: string): MockInstance<T>
Sets the internal mock name. This is useful for identifying the mock when an assertion fails.
mockImplementation
function mockImplementation(fn: T): MockInstance<T>
Accepts a function to be used as the mock implementation. TypeScript expects the arguments and return type to match those of the original function.
const mockFn = vi.fn().mockImplementation((apples: number) => apples + 1)
// or: vi.fn(apples => apples + 1);

const NelliesBucket = mockFn(0)
const BobsBucket = mockFn(1)

NelliesBucket === 1 // true
BobsBucket === 2 // true

mockFn.mock.calls[0][0] === 0 // true
mockFn.mock.calls[1][0] === 1 // true
mockImplementationOnce
function mockImplementationOnce(fn: T): MockInstance<T>
Accepts a function to be used as the mock implementation. TypeScript expects the arguments and return type to match those of the original function. This method can be chained to produce different results for multiple function calls.
const myMockFn = vi
  .fn()
  .mockImplementationOnce(() => true) // 1st call
  .mockImplementationOnce(() => false) // 2nd call

myMockFn() // 1st call: true
myMockFn() // 2nd call: false
When the mocked function runs out of implementations, it will invoke the default implementation set with vi.fn(() => defaultValue) or .mockImplementation(() => defaultValue) if they were called:
const myMockFn = vi
  .fn(() => 'default')
  .mockImplementationOnce(() => 'first call')
  .mockImplementationOnce(() => 'second call')

// 'first call', 'second call', 'default', 'default'
console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn())
withImplementation
function withImplementation(
  fn: T,
  cb: () => void
): MockInstance<T>
function withImplementation(
  fn: T,
  cb: () => Promise<void>
): Promise<MockInstance<T>>
Overrides the original mock implementation temporarily while the callback is being executed.
const myMockFn = vi.fn(() => 'original')

myMockFn.withImplementation(() => 'temp', () => {
  myMockFn() // 'temp'
})

myMockFn() // 'original'
Can be used with an asynchronous callback. The method has to be awaited to use the original implementation afterward.
test('async callback', () => {
  const myMockFn = vi.fn(() => 'original')

  // We await this call since the callback is async
  await myMockFn.withImplementation(
    () => 'temp',
    async () => {
      myMockFn() // 'temp'
    },
  )

  myMockFn() // 'original'
})
Note that this method takes precedence over the mockImplementationOnce.
mockRejectedValue
function mockRejectedValue(value: unknown): MockInstance<T>
Accepts an error that will be rejected when async function is called.
const asyncMock = vi.fn().mockRejectedValue(new Error('Async error'))

await asyncMock() // throws Error<'Async error'>
mockRejectedValueOnce
function mockRejectedValueOnce(value: unknown): MockInstance<T>
Accepts a value that will be rejected during the next function call. If chained, each consecutive call will reject the specified value.
const asyncMock = vi
  .fn()
  .mockResolvedValueOnce('first call')
  .mockRejectedValueOnce(new Error('Async error'))

await asyncMock() // 'first call'
await asyncMock() // throws Error<'Async error'>
mockReset
function mockReset(): MockInstance<T>
Does what mockClear does and resets inner implementation to the original function. This also resets all "once" implementations.
Note that resetting a mock from vi.fn() will set implementation to an empty function that returns undefined. resetting a mock from vi.fn(impl) will restore implementation to impl.
This is useful when you want to reset a mock to its original state.
const person = {
  greet: (name: string) => `Hello ${name}`,
}
const spy = vi.spyOn(person, 'greet').mockImplementation(() => 'mocked')
expect(person.greet('Alice')).toBe('mocked')
expect(spy.mock.calls).toEqual([['Alice']])

// clear call history and reset implementation, but method is still spied
spy.mockReset()
expect(spy.mock.calls).toEqual([])
expect(person.greet).toBe(spy)
expect(person.greet('Bob')).toBe('Hello Bob')
expect(spy.mock.calls).toEqual([['Bob']])
To automatically call this method before each test, enable the mockReset setting in the configuration.
mockRestore
function mockRestore(): MockInstance<T>
Does what mockReset does and restores original descriptors of spied-on objects.
Note that restoring a mock from vi.fn() will set implementation to an empty function that returns undefined. Restoring a mock from vi.fn(impl) will restore implementation to impl.
const person = {
  greet: (name: string) => `Hello ${name}`,
}
const spy = vi.spyOn(person, 'greet').mockImplementation(() => 'mocked')
expect(person.greet('Alice')).toBe('mocked')
expect(spy.mock.calls).toEqual([['Alice']])

// clear call history and restore spied object method
spy.mockRestore()
expect(spy.mock.calls).toEqual([])
expect(person.greet).not.toBe(spy)
expect(person.greet('Bob')).toBe('Hello Bob')
expect(spy.mock.calls).toEqual([])
To automatically call this method before each test, enable the restoreMocks setting in the configuration.
mockResolvedValue
function mockResolvedValue(value: Awaited<ReturnType<T>>): MockInstance<T>
Accepts a value that will be resolved when the async function is called. TypeScript will only accept values that match the return type of the original function.
const asyncMock = vi.fn().mockResolvedValue(42)

await asyncMock() // 42
mockResolvedValueOnce
function mockResolvedValueOnce(value: Awaited<ReturnType<T>>): MockInstance<T>
Accepts a value that will be resolved during the next function call. TypeScript will only accept values that match the return type of the original function. If chained, each consecutive call will resolve the specified value.
const asyncMock = vi
  .fn()
  .mockResolvedValue('default')
  .mockResolvedValueOnce('first call')
  .mockResolvedValueOnce('second call')

await asyncMock() // first call
await asyncMock() // second call
await asyncMock() // default
await asyncMock() // default
mockReturnThis
function mockReturnThis(): MockInstance<T>
Use this if you need to return the this context from the method without invoking the actual implementation. This is a shorthand for:
spy.mockImplementation(function () {
  return this
})
mockReturnValue
function mockReturnValue(value: ReturnType<T>): MockInstance<T>
Accepts a value that will be returned whenever the mock function is called. TypeScript will only accept values that match the return type of the original function.
const mock = vi.fn()
mock.mockReturnValue(42)
mock() // 42
mock.mockReturnValue(43)
mock() // 43
mockReturnValueOnce
function mockReturnValueOnce(value: ReturnType<T>): MockInstance<T>
Accepts a value that will be returned whenever the mock function is called. TypeScript will only accept values that match the return type of the original function.
When the mocked function runs out of implementations, it will invoke the default implementation set with vi.fn(() => defaultValue) or .mockImplementation(() => defaultValue) if they were called:
const myMockFn = vi
  .fn()
  .mockReturnValue('default')
  .mockReturnValueOnce('first call')
  .mockReturnValueOnce('second call')

// 'first call', 'second call', 'default', 'default'
console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn())
mock.calls
const calls: Parameters<T>[]
This is an array containing all arguments for each call. One item of the array is the arguments of that call.
const fn = vi.fn()

fn('arg1', 'arg2')
fn('arg3')

fn.mock.calls === [
  ['arg1', 'arg2'], // first call
  ['arg3'], // second call
]
mock.lastCall
const lastCall: Parameters<T> | undefined
This contains the arguments of the last call. If mock wasn't called, it will return undefined.
mock.results
interface MockResultReturn<T> {
  type: 'return'
  /**
   * The value that was returned from the function.
   * If function returned a Promise, then this will be a resolved value.
   */
  value: T
}

interface MockResultIncomplete {
  type: 'incomplete'
  value: undefined
}

interface MockResultThrow {
  type: 'throw'
  /**
   * An error that was thrown during function execution.
   */
  value: any
}

type MockResult<T> =
  | MockResultReturn<T>
  | MockResultThrow
  | MockResultIncomplete

const results: MockResult<ReturnType<T>>[]
This is an array containing all values that were returned from the function. One item of the array is an object with properties type and value. Available types are:
'return' - function returned without throwing.
'throw' - function threw a value.
The value property contains the returned value or thrown error. If the function returned a Promise, then result will always be 'return' even if the promise was rejected.
const fn = vi.fn()
  .mockReturnValueOnce('result')
  .mockImplementationOnce(() => { throw new Error('thrown error') })

const result = fn() // returned 'result'

try {
  fn() // threw Error
}
catch {}

fn.mock.results === [
  // first result
  {
    type: 'return',
    value: 'result',
  },
  // last result
  {
    type: 'throw',
    value: Error,
  },
]
mock.settledResults
interface MockSettledResultFulfilled<T> {
  type: 'fulfilled'
  value: T
}

interface MockSettledResultRejected {
  type: 'rejected'
  value: any
}

export type MockSettledResult<T> =
  | MockSettledResultFulfilled<T>
  | MockSettledResultRejected

const settledResults: MockSettledResult<Awaited<ReturnType<T>>>[]
An array containing all values that were resolved or rejected from the function.
This array will be empty if the function was never resolved or rejected.
const fn = vi.fn().mockResolvedValueOnce('result')

const result = fn()

fn.mock.settledResults === []

await result

fn.mock.settledResults === [
  {
    type: 'fulfilled',
    value: 'result',
  },
]
mock.invocationCallOrder
const invocationCallOrder: number[]
This property returns the order of the mock function's execution. It is an array of numbers that are shared between all defined mocks.
const fn1 = vi.fn()
const fn2 = vi.fn()

fn1()
fn2()
fn1()

fn1.mock.invocationCallOrder === [1, 3]
fn2.mock.invocationCallOrder === [2]
mock.contexts
const contexts: ThisParameterType<T>[]
This property is an array of this values used during each call to the mock function.
const fn = vi.fn()
const context = {}

fn.apply(context)
fn.call(context)

fn.mock.contexts[0] === context
fn.mock.contexts[1] === context
mock.instances
const instances: ReturnType<T>[]
This property is an array containing all instances that were created when the mock was called with the new keyword. Note that this is an actual context (this) of the function, not a return value.
WARNING
If mock was instantiated with new MyClass(), then mock.instances will be an array with one value:
const MyClass = vi.fn()
const a = new MyClass()

MyClass.mock.instances[0] === a
If you return a value from constructor, it will not be in instances array, but instead inside results:
const Spy = vi.fn(() => ({ method: vi.fn() }))
const a = new Spy()

Spy.mock.instances[0] !== a
Spy.mock.results[0] === a
Suggest changes to this page
Last updated: 3/11/25, 9:11 AM
Pager
Previous page
Test API Reference
Next page
Vi Utility
Vi
Vitest provides utility functions to help you out through its vi helper. You can access it globally (when globals configuration is enabled), or import it from vitest directly:
import { vi } from 'vitest'
Mock Modules
This section describes the API that you can use when mocking a module. Beware that Vitest doesn't support mocking modules imported using require().
vi.mock
Type: (path: string, factory?: MockOptions | ((importOriginal: () => unknown) => unknown)) => void
Type: <T>(path: Promise<T>, factory?: MockOptions | ((importOriginal: () => T) => T | Promise<T>)) => void
Substitutes all imported modules from provided path with another module. You can use configured Vite aliases inside a path. The call to vi.mock is hoisted, so it doesn't matter where you call it. It will always be executed before all imports. If you need to reference some variables outside of its scope, you can define them inside vi.hoisted and reference them inside vi.mock.
WARNING
vi.mock works only for modules that were imported with the import keyword. It doesn't work with require.
In order to hoist vi.mock, Vitest statically analyzes your files. It indicates that vi that was not directly imported from the vitest package (for example, from some utility file) cannot be used. Use vi.mock with vi imported from vitest, or enable globals config option.
Vitest will not mock modules that were imported inside a setup file because they are cached by the time a test file is running. You can call vi.resetModules() inside vi.hoisted to clear all module caches before running a test file.
If the factory function is defined, all imports will return its result. Vitest calls factory only once and caches results for all subsequent imports until vi.unmock or vi.doUnmock is called.
Unlike in jest, the factory can be asynchronous. You can use vi.importActual or a helper with the factory passed in as the first argument, and get the original module inside.
You can also provide an object with a spy property instead of a factory function. If spy is true, then Vitest will automock the module as usual, but it won't override the implementation of exports. This is useful if you just want to assert that the exported method was called correctly by another method.
import { calculator } from './src/calculator.ts'

vi.mock('./src/calculator.ts', { spy: true })

// calls the original implementation,
// but allows asserting the behaviour later
const result = calculator(1, 2)

expect(result).toBe(3)
expect(calculator).toHaveBeenCalledWith(1, 2)
expect(calculator).toHaveReturned(3)
Vitest also supports a module promise instead of a string in the vi.mock and vi.doMock methods for better IDE support. When the file is moved, the path will be updated, and importOriginal inherits the type automatically. Using this signature will also enforce factory return type to be compatible with the original module (keeping exports optional).
vi.mock(import('./path/to/module.js'), async (importOriginal) => {
  const mod = await importOriginal() // type is inferred
  return {
    ...mod,
    // replace some exports
    total: vi.fn(),
  }
})
Under the hood, Vitest still operates on a string and not a module object.
If you are using TypeScript with paths aliases configured in tsconfig.json however, the compiler won't be able to correctly resolve import types. In order to make it work, make sure to replace all aliased imports, with their corresponding relative paths. Eg. use import('./path/to/module.js') instead of import('@/module').
WARNING
vi.mock is hoisted (in other words, moved) to top of the file. It means that whenever you write it (be it inside beforeEach or test), it will actually be called before that.
This also means that you cannot use any variables inside the factory that are defined outside the factory.
If you need to use variables inside the factory, try vi.doMock. It works the same way but isn't hoisted. Beware that it only mocks subsequent imports.
You can also reference variables defined by vi.hoisted method if it was declared before vi.mock:
import { namedExport } from './path/to/module.js'

const mocks = vi.hoisted(() => {
  return {
    namedExport: vi.fn(),
  }
})

vi.mock('./path/to/module.js', () => {
  return {
    namedExport: mocks.namedExport,
  }
})

vi.mocked(namedExport).mockReturnValue(100)

expect(namedExport()).toBe(100)
expect(namedExport).toBe(mocks.namedExport)
WARNING
If you are mocking a module with default export, you will need to provide a default key within the returned factory function object. This is an ES module-specific caveat; therefore, jest documentation may differ as jest uses CommonJS modules. For example,
vi.mock('./path/to/module.js', () => {
  return {
    default: { myDefaultKey: vi.fn() },
    namedExport: vi.fn(),
    // etc...
  }
})
If there is a __mocks__ folder alongside a file that you are mocking, and the factory is not provided, Vitest will try to find a file with the same name in the __mocks__ subfolder and use it as an actual module. If you are mocking a dependency, Vitest will try to find a __mocks__ folder in the root of the project (default is process.cwd()). You can tell Vitest where the dependencies are located through the deps.moduleDirectories config option.
For example, you have this file structure:
- __mocks__
  - axios.js
- src
  __mocks__
    - increment.js
  - increment.js
- tests
  - increment.test.js
If you call vi.mock in a test file without a factory or options provided, it will find a file in the __mocks__ folder to use as a module:
increment.test.js
import { vi } from 'vitest'

// axios is a default export from `__mocks__/axios.js`
import axios from 'axios'

// increment is a named export from `src/__mocks__/increment.js`
import { increment } from '../increment.js'

vi.mock('axios')
vi.mock('../increment.js')

axios.get(`/apples/${increment(1)}`)
WARNING
Beware that if you don't call vi.mock, modules are not mocked automatically. To replicate Jest's automocking behaviour, you can call vi.mock for each required module inside setupFiles.
If there is no __mocks__ folder or a factory provided, Vitest will import the original module and auto-mock all its exports. For the rules applied, see algorithm.
vi.doMock
Type: (path: string, factory?: MockOptions | ((importOriginal: () => unknown) => unknown)) => void
Type: <T>(path: Promise<T>, factory?: MockOptions | ((importOriginal: () => T) => T | Promise<T>)) => void
The same as vi.mock, but it's not hoisted to the top of the file, so you can reference variables in the global file scope. The next dynamic import of the module will be mocked.
WARNING
This will not mock modules that were imported before this was called. Don't forget that all static imports in ESM are always hoisted, so putting this before static import will not force it to be called before the import:
vi.doMock('./increment.js') // this will be called _after_ the import statement

import { increment } from './increment.js'
increment.js
export function increment(number) {
  return number + 1
}
increment.test.js
import { beforeEach, test } from 'vitest'
import { increment } from './increment.js'

// the module is not mocked, because vi.doMock is not called yet
increment(1) === 2

let mockedIncrement = 100

beforeEach(() => {
  // you can access variables inside a factory
  vi.doMock('./increment.js', () => ({ increment: () => ++mockedIncrement }))
})

test('importing the next module imports mocked one', async () => {
  // original import WAS NOT MOCKED, because vi.doMock is evaluated AFTER imports
  expect(increment(1)).toBe(2)
  const { increment: mockedIncrement } = await import('./increment.js')
  // new dynamic import returns mocked module
  expect(mockedIncrement(1)).toBe(101)
  expect(mockedIncrement(1)).toBe(102)
  expect(mockedIncrement(1)).toBe(103)
})
vi.mocked
Type: <T>(obj: T, deep?: boolean) => MaybeMockedDeep<T>
Type: <T>(obj: T, options?: { partial?: boolean; deep?: boolean }) => MaybePartiallyMockedDeep<T>
Type helper for TypeScript. Just returns the object that was passed.
When partial is true it will expect a Partial<T> as a return value. By default, this will only make TypeScript believe that the first level values are mocked. You can pass down { deep: true } as a second argument to tell TypeScript that the whole object is mocked, if it actually is.
example.ts
export function add(x: number, y: number): number {
  return x + y
}

export function fetchSomething(): Promise<Response> {
  return fetch('https://vitest.dev/')
}
example.test.ts
import * as example from './example'

vi.mock('./example')

test('1 + 1 equals 10', async () => {
  vi.mocked(example.add).mockReturnValue(10)
  expect(example.add(1, 1)).toBe(10)
})

test('mock return value with only partially correct typing', async () => {
  vi.mocked(example.fetchSomething).mockResolvedValue(new Response('hello'))
  vi.mocked(example.fetchSomething, { partial: true }).mockResolvedValue({ ok: false })
  // vi.mocked(example.someFn).mockResolvedValue({ ok: false }) // this is a type error
})
vi.importActual
Type: <T>(path: string) => Promise<T>
Imports module, bypassing all checks if it should be mocked. Can be useful if you want to mock module partially.
vi.mock('./example.js', async () => {
  const originalModule = await vi.importActual('./example.js')

  return { ...originalModule, get: vi.fn() }
})
vi.importMock
Type: <T>(path: string) => Promise<MaybeMockedDeep<T>>
Imports a module with all of its properties (including nested properties) mocked. Follows the same rules that vi.mock does. For the rules applied, see algorithm.
vi.unmock
Type: (path: string | Promise<Module>) => void
Removes module from the mocked registry. All calls to import will return the original module even if it was mocked before. This call is hoisted to the top of the file, so it will only unmock modules that were defined in setupFiles, for example.
vi.doUnmock
Type: (path: string | Promise<Module>) => void
The same as vi.unmock, but is not hoisted to the top of the file. The next import of the module will import the original module instead of the mock. This will not unmock previously imported modules.
increment.js
export function increment(number) {
  return number + 1
}
increment.test.js
import { increment } from './increment.js'

// increment is already mocked, because vi.mock is hoisted
increment(1) === 100

// this is hoisted, and factory is called before the import on line 1
vi.mock('./increment.js', () => ({ increment: () => 100 }))

// all calls are mocked, and `increment` always returns 100
increment(1) === 100
increment(30) === 100

// this is not hoisted, so other import will return unmocked module
vi.doUnmock('./increment.js')

// this STILL returns 100, because `vi.doUnmock` doesn't reevaluate a module
increment(1) === 100
increment(30) === 100

// the next import is unmocked, now `increment` is the original function that returns count + 1
const { increment: unmockedIncrement } = await import('./increment.js')

unmockedIncrement(1) === 2
unmockedIncrement(30) === 31
vi.resetModules
Type: () => Vitest
Resets modules registry by clearing the cache of all modules. This allows modules to be reevaluated when reimported. Top-level imports cannot be re-evaluated. Might be useful to isolate modules where local state conflicts between tests.
import { vi } from 'vitest'

import { data } from './data.js' // Will not get reevaluated beforeEach test

beforeEach(() => {
  vi.resetModules()
})

test('change state', async () => {
  const mod = await import('./some/path.js') // Will get reevaluated
  mod.changeLocalState('new value')
  expect(mod.getLocalState()).toBe('new value')
})

test('module has old state', async () => {
  const mod = await import('./some/path.js') // Will get reevaluated
  expect(mod.getLocalState()).toBe('old value')
})
WARNING
Does not reset mocks registry. To clear mocks registry, use vi.unmock or vi.doUnmock.
vi.dynamicImportSettled
Wait for all imports to load. Useful, if you have a synchronous call that starts importing a module that you cannot wait otherwise.
import { expect, test } from 'vitest'

// cannot track import because Promise is not returned
function renderComponent() {
  import('./component.js').then(({ render }) => {
    render()
  })
}

test('operations are resolved', async () => {
  renderComponent()
  await vi.dynamicImportSettled()
  expect(document.querySelector('.component')).not.toBeNull()
})
TIP
If during a dynamic import another dynamic import is initiated, this method will wait until all of them are resolved.
This method will also wait for the next setTimeout tick after the import is resolved so all synchronous operations should be completed by the time it's resolved.
Mocking Functions and Objects
This section describes how to work with method mocks and replace environmental and global variables.
vi.fn
Type: (fn?: Function) => Mock
Creates a spy on a function, though can be initiated without one. Every time a function is invoked, it stores its call arguments, returns, and instances. Also, you can manipulate its behavior with methods. If no function is given, mock will return undefined, when invoked.
const getApples = vi.fn(() => 0)

getApples()

expect(getApples).toHaveBeenCalled()
expect(getApples).toHaveReturnedWith(0)

getApples.mockReturnValueOnce(5)

const res = getApples()
expect(res).toBe(5)
expect(getApples).toHaveNthReturnedWith(2, 5)
vi.mockObject 3.2.0+
Type: <T>(value: T) => MaybeMockedDeep<T>
Deeply mocks properties and methods of a given object in the same way as vi.mock() mocks module exports. See automocking for the detail.
const original = {
  simple: () => 'value',
  nested: {
    method: () => 'real'
  },
  prop: 'foo',
}

const mocked = vi.mockObject(original)
expect(mocked.simple()).toBe(undefined)
expect(mocked.nested.method()).toBe(undefined)
expect(mocked.prop).toBe('foo')

mocked.simple.mockReturnValue('mocked')
mocked.nested.method.mockReturnValue('mocked nested')

expect(mocked.simple()).toBe('mocked')
expect(mocked.nested.method()).toBe('mocked nested')
vi.isMockFunction
Type: (fn: Function) => boolean
Checks that a given parameter is a mock function. If you are using TypeScript, it will also narrow down its type.
vi.clearAllMocks
Calls .mockClear() on all spies. This will clear mock history without affecting mock implementations.
vi.resetAllMocks
Calls .mockReset() on all spies. This will clear mock history and reset each mock's implementation to its original.
vi.restoreAllMocks
Calls .mockRestore() on all spies. This will clear mock history, restore all original mock implementations, and restore original descriptors of spied-on objects.
vi.spyOn
Type: <T, K extends keyof T>(object: T, method: K, accessType?: 'get' | 'set') => MockInstance
Creates a spy on a method or getter/setter of an object similar to vi.fn(). It returns a mock function.
let apples = 0
const cart = {
  getApples: () => 42,
}

const spy = vi.spyOn(cart, 'getApples').mockImplementation(() => apples)
apples = 1

expect(cart.getApples()).toBe(1)

expect(spy).toHaveBeenCalled()
expect(spy).toHaveReturnedWith(1)
TIP
In environments that support Explicit Resource Management, you can use using instead of const to automatically call mockRestore on any mocked function when the containing block is exited. This is especially useful for spied methods:
it('calls console.log', () => {
  using spy = vi.spyOn(console, 'log').mockImplementation(() => {})
  debug('message')
  expect(spy).toHaveBeenCalled()
})
// console.log is restored here
TIP
You can call vi.restoreAllMocks inside afterEach (or enable test.restoreMocks) to restore all methods to their original implementations. This will restore the original object descriptor, so you won't be able to change method's implementation:
const cart = {
  getApples: () => 42,
}

const spy = vi.spyOn(cart, 'getApples').mockReturnValue(10)

console.log(cart.getApples()) // 10
vi.restoreAllMocks()
console.log(cart.getApples()) // 42
spy.mockReturnValue(10)
console.log(cart.getApples()) // still 42!
TIP
It is not possible to spy on exported methods in Browser Mode. Instead, you can spy on every exported method by calling vi.mock("./file-path.js", { spy: true }). This will mock every export but keep its implementation intact, allowing you to assert if the method was called correctly.
import { calculator } from './src/calculator.ts'

vi.mock('./src/calculator.ts', { spy: true })

calculator(1, 2)

expect(calculator).toHaveBeenCalledWith(1, 2)
expect(calculator).toHaveReturned(3)
And while it is possible to spy on exports in jsdom or other Node.js environments, this might change in the future.
vi.stubEnv
Type: <T extends string>(name: T, value: T extends "PROD" | "DEV" | "SSR" ? boolean : string | undefined) => Vitest
Changes the value of environmental variable on process.env and import.meta.env. You can restore its value by calling vi.unstubAllEnvs.
import { vi } from 'vitest'

// `process.env.NODE_ENV` and `import.meta.env.NODE_ENV`
// are "development" before calling "vi.stubEnv"

vi.stubEnv('NODE_ENV', 'production')

process.env.NODE_ENV === 'production'
import.meta.env.NODE_ENV === 'production'

vi.stubEnv('NODE_ENV', undefined)

process.env.NODE_ENV === undefined
import.meta.env.NODE_ENV === undefined

// doesn't change other envs
import.meta.env.MODE === 'development'
TIP
You can also change the value by simply assigning it, but you won't be able to use vi.unstubAllEnvs to restore previous value:
import.meta.env.MODE = 'test'
vi.unstubAllEnvs
Type: () => Vitest
Restores all import.meta.env and process.env values that were changed with vi.stubEnv. When it's called for the first time, Vitest remembers the original value and will store it, until unstubAllEnvs is called again.
import { vi } from 'vitest'

// `process.env.NODE_ENV` and `import.meta.env.NODE_ENV`
// are "development" before calling stubEnv

vi.stubEnv('NODE_ENV', 'production')

process.env.NODE_ENV === 'production'
import.meta.env.NODE_ENV === 'production'

vi.stubEnv('NODE_ENV', 'staging')

process.env.NODE_ENV === 'staging'
import.meta.env.NODE_ENV === 'staging'

vi.unstubAllEnvs()

// restores to the value that were stored before the first "stubEnv" call
process.env.NODE_ENV === 'development'
import.meta.env.NODE_ENV === 'development'
vi.stubGlobal
Type: (name: string | number | symbol, value: unknown) => Vitest
Changes the value of global variable. You can restore its original value by calling vi.unstubAllGlobals.
import { vi } from 'vitest'

// `innerWidth` is "0" before calling stubGlobal

vi.stubGlobal('innerWidth', 100)

innerWidth === 100
globalThis.innerWidth === 100
// if you are using jsdom or happy-dom
window.innerWidth === 100
TIP
You can also change the value by simply assigning it to globalThis or window (if you are using jsdom or happy-dom environment), but you won't be able to use vi.unstubAllGlobals to restore original value:
globalThis.innerWidth = 100
// if you are using jsdom or happy-dom
window.innerWidth = 100
vi.unstubAllGlobals
Type: () => Vitest
Restores all global values on globalThis/global (and window/top/self/parent, if you are using jsdom or happy-dom environment) that were changed with vi.stubGlobal. When it's called for the first time, Vitest remembers the original value and will store it, until unstubAllGlobals is called again.
import { vi } from 'vitest'

const Mock = vi.fn()

// IntersectionObserver is "undefined" before calling "stubGlobal"

vi.stubGlobal('IntersectionObserver', Mock)

IntersectionObserver === Mock
global.IntersectionObserver === Mock
globalThis.IntersectionObserver === Mock
// if you are using jsdom or happy-dom
window.IntersectionObserver === Mock

vi.unstubAllGlobals()

globalThis.IntersectionObserver === undefined
'IntersectionObserver' in globalThis === false
// throws ReferenceError, because it's not defined
IntersectionObserver === undefined
Fake Timers
This sections describes how to work with fake timers.
vi.advanceTimersByTime
Type: (ms: number) => Vitest
This method will invoke every initiated timer until the specified number of milliseconds is passed or the queue is empty - whatever comes first.
let i = 0
setInterval(() => console.log(++i), 50)

vi.advanceTimersByTime(150)

// log: 1
// log: 2
// log: 3
vi.advanceTimersByTimeAsync
Type: (ms: number) => Promise<Vitest>
This method will invoke every initiated timer until the specified number of milliseconds is passed or the queue is empty - whatever comes first. This will include asynchronously set timers.
let i = 0
setInterval(() => Promise.resolve().then(() => console.log(++i)), 50)

await vi.advanceTimersByTimeAsync(150)

// log: 1
// log: 2
// log: 3
vi.advanceTimersToNextTimer
Type: () => Vitest
Will call next available timer. Useful to make assertions between each timer call. You can chain call it to manage timers by yourself.
let i = 0
setInterval(() => console.log(++i), 50)

vi.advanceTimersToNextTimer() // log: 1
  .advanceTimersToNextTimer() // log: 2
  .advanceTimersToNextTimer() // log: 3
vi.advanceTimersToNextTimerAsync
Type: () => Promise<Vitest>
Will call next available timer and wait until it's resolved if it was set asynchronously. Useful to make assertions between each timer call.
let i = 0
setInterval(() => Promise.resolve().then(() => console.log(++i)), 50)

await vi.advanceTimersToNextTimerAsync() // log: 1
expect(console.log).toHaveBeenCalledWith(1)

await vi.advanceTimersToNextTimerAsync() // log: 2
await vi.advanceTimersToNextTimerAsync() // log: 3
vi.advanceTimersToNextFrame 2.1.0+
Type: () => Vitest
Similar to vi.advanceTimersByTime, but will advance timers by the milliseconds needed to execute callbacks currently scheduled with requestAnimationFrame.
let frameRendered = false

requestAnimationFrame(() => {
  frameRendered = true
})

vi.advanceTimersToNextFrame()

expect(frameRendered).toBe(true)
vi.getTimerCount
Type: () => number
Get the number of waiting timers.
vi.clearAllTimers
Removes all timers that are scheduled to run. These timers will never run in the future.
vi.getMockedSystemTime
Type: () => Date | null
Returns mocked current date. If date is not mocked the method will return null.
vi.getRealSystemTime
Type: () => number
When using vi.useFakeTimers, Date.now calls are mocked. If you need to get real time in milliseconds, you can call this function.
vi.runAllTicks
Type: () => Vitest
Calls every microtask that was queued by process.nextTick. This will also run all microtasks scheduled by themselves.
vi.runAllTimers
Type: () => Vitest
This method will invoke every initiated timer until the timer queue is empty. It means that every timer called during runAllTimers will be fired. If you have an infinite interval, it will throw after 10 000 tries (can be configured with fakeTimers.loopLimit).
let i = 0
setTimeout(() => console.log(++i))
const interval = setInterval(() => {
  console.log(++i)
  if (i === 3) {
    clearInterval(interval)
  }
}, 50)

vi.runAllTimers()

// log: 1
// log: 2
// log: 3
vi.runAllTimersAsync
Type: () => Promise<Vitest>
This method will asynchronously invoke every initiated timer until the timer queue is empty. It means that every timer called during runAllTimersAsync will be fired even asynchronous timers. If you have an infinite interval, it will throw after 10 000 tries (can be configured with fakeTimers.loopLimit).
setTimeout(async () => {
  console.log(await Promise.resolve('result'))
}, 100)

await vi.runAllTimersAsync()

// log: result
vi.runOnlyPendingTimers
Type: () => Vitest
This method will call every timer that was initiated after vi.useFakeTimers call. It will not fire any timer that was initiated during its call.
let i = 0
setInterval(() => console.log(++i), 50)

vi.runOnlyPendingTimers()

// log: 1
vi.runOnlyPendingTimersAsync
Type: () => Promise<Vitest>
This method will asynchronously call every timer that was initiated after vi.useFakeTimers call, even asynchronous ones. It will not fire any timer that was initiated during its call.
setTimeout(() => {
  console.log(1)
}, 100)
setTimeout(() => {
  Promise.resolve().then(() => {
    console.log(2)
    setInterval(() => {
      console.log(3)
    }, 40)
  })
}, 10)

await vi.runOnlyPendingTimersAsync()

// log: 2
// log: 3
// log: 3
// log: 1
vi.setSystemTime
Type: (date: string | number | Date) => void
If fake timers are enabled, this method simulates a user changing the system clock (will affect date related API like hrtime, performance.now or new Date()) - however, it will not fire any timers. If fake timers are not enabled, this method will only mock Date.* calls.
Useful if you need to test anything that depends on the current date - for example Luxon calls inside your code.
Accepts the same string and number arguments as the Date.
const date = new Date(1998, 11, 19)

vi.useFakeTimers()
vi.setSystemTime(date)

expect(Date.now()).toBe(date.valueOf())

vi.useRealTimers()
vi.useFakeTimers
Type: (config?: FakeTimerInstallOpts) => Vitest
To enable mocking timers, you need to call this method. It will wrap all further calls to timers (such as setTimeout, setInterval, clearTimeout, clearInterval, setImmediate, clearImmediate, and Date) until vi.useRealTimers() is called.
Mocking nextTick is not supported when running Vitest inside node:child_process by using --pool=forks. NodeJS uses process.nextTick internally in node:child_process and hangs when it is mocked. Mocking nextTick is supported when running Vitest with --pool=threads.
The implementation is based internally on @sinonjs/fake-timers.
TIP
vi.useFakeTimers() does not automatically mock process.nextTick and queueMicrotask. But you can enable it by specifying the option in toFake argument: vi.useFakeTimers({ toFake: ['nextTick', 'queueMicrotask'] }).
vi.isFakeTimers
Type: () => boolean
Returns true if fake timers are enabled.
vi.useRealTimers
Type: () => Vitest
When timers have run out, you may call this method to return mocked timers to its original implementations. All timers that were scheduled before will be discarded.
Miscellaneous
A set of useful helper functions that Vitest provides.
vi.waitFor
Type: <T>(callback: WaitForCallback<T>, options?: number | WaitForOptions) => Promise<T>
Wait for the callback to execute successfully. If the callback throws an error or returns a rejected promise it will continue to wait until it succeeds or times out.
If options is set to a number, the effect is equivalent to setting { timeout: options }.
This is very useful when you need to wait for some asynchronous action to complete, for example, when you start a server and need to wait for it to start.
import { expect, test, vi } from 'vitest'
import { createServer } from './server.js'

test('Server started successfully', async () => {
  const server = createServer()

  await vi.waitFor(
    () => {
      if (!server.isReady) {
        throw new Error('Server not started')
      }

      console.log('Server started')
    },
    {
      timeout: 500, // default is 1000
      interval: 20, // default is 50
    }
  )
  expect(server.isReady).toBe(true)
})
It also works for asynchronous callbacks
// @vitest-environment jsdom

import { expect, test, vi } from 'vitest'
import { getDOMElementAsync, populateDOMAsync } from './dom.js'

test('Element exists in a DOM', async () => {
  // start populating DOM
  populateDOMAsync()

  const element = await vi.waitFor(async () => {
    // try to get the element until it exists
    const element = await getDOMElementAsync() as HTMLElement | null
    expect(element).toBeTruthy()
    expect(element.dataset.initialized).toBeTruthy()
    return element
  }, {
    timeout: 500, // default is 1000
    interval: 20, // default is 50
  })
  expect(element).toBeInstanceOf(HTMLElement)
})
If vi.useFakeTimers is used, vi.waitFor automatically calls vi.advanceTimersByTime(interval) in every check callback.
vi.waitUntil
Type: <T>(callback: WaitUntilCallback<T>, options?: number | WaitUntilOptions) => Promise<T>
This is similar to vi.waitFor, but if the callback throws any errors, execution is immediately interrupted and an error message is received. If the callback returns falsy value, the next check will continue until truthy value is returned. This is useful when you need to wait for something to exist before taking the next step.
Look at the example below. We can use vi.waitUntil to wait for the element to appear on the page, and then we can do something with the element.
import { expect, test, vi } from 'vitest'

test('Element render correctly', async () => {
  const element = await vi.waitUntil(
    () => document.querySelector('.element'),
    {
      timeout: 500, // default is 1000
      interval: 20, // default is 50
    }
  )

  // do something with the element
  expect(element.querySelector('.element-child')).toBeTruthy()
})
vi.hoisted
Type: <T>(factory: () => T) => T
All static import statements in ES modules are hoisted to the top of the file, so any code that is defined before the imports will actually be executed after imports are evaluated.
However, it can be useful to invoke some side effects like mocking dates before importing a module.
To bypass this limitation, you can rewrite static imports into dynamic ones like this:
callFunctionWithSideEffect()
- import { value } from './some/module.js'
+ const { value } = await import('./some/module.js')
When running vitest, you can do this automatically by using vi.hoisted method. Under the hood, Vitest will convert static imports into dynamic ones with preserved live-bindings.
- callFunctionWithSideEffect()
import { value } from './some/module.js'
+ vi.hoisted(() => callFunctionWithSideEffect())
IMPORTS ARE NOT AVAILABLE
Running code before the imports means that you cannot access imported variables because they are not defined yet:
import { value } from './some/module.js'

vi.hoisted(() => { value }) // throws an error
This code will produce an error:
Cannot access '__vi_import_0__' before initialization
If you need to access a variable from another module inside of vi.hoisted, use dynamic import:
await vi.hoisted(async () => {
  const { value } = await import('./some/module.js')
})
However, it is discourage to import anything inside of vi.hoisted because imports are already hoisted - if you need to execute something before the tests are running, just execute it in the imported module itself.
This method returns the value that was returned from the factory. You can use that value in your vi.mock factories if you need easy access to locally defined variables:
import { expect, vi } from 'vitest'
import { originalMethod } from './path/to/module.js'

const { mockedMethod } = vi.hoisted(() => {
  return { mockedMethod: vi.fn() }
})

vi.mock('./path/to/module.js', () => {
  return { originalMethod: mockedMethod }
})

mockedMethod.mockReturnValue(100)
expect(originalMethod()).toBe(100)
Note that this method can also be called asynchronously even if your environment doesn't support top-level await:
const json = await vi.hoisted(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  return response.json()
})
vi.setConfig
Type: RuntimeConfig
Updates config for the current test file. This method supports only config options that will affect the current test file:
vi.setConfig({
  allowOnly: true,
  testTimeout: 10_000,
  hookTimeout: 10_000,
  clearMocks: true,
  restoreMocks: true,
  fakeTimers: {
    now: new Date(2021, 11, 19),
    // supports the whole object
  },
  maxConcurrency: 10,
  sequence: {
    hooks: 'stack'
    // supports only "sequence.hooks"
  }
})
vi.resetConfig
Type: RuntimeConfig
If vi.setConfig was called before, this will reset config to the original state.
Suggest changes to this page
Last updated: 5/17/25, 8:34 AM
Pager
Previous page
Mock Functions
Next page
Expect
const mod: typeof import("/path/to/module")
expect
The following types are used in the type signatures below
type Awaitable<T> = T | PromiseLike<T>
expect is used to create assertions. In this context assertions are functions that can be called to assert a statement. Vitest provides chai assertions by default and also Jest compatible assertions built on top of chai. Unlike Jest, Vitest supports a message as the second argument - if the assertion fails, the error message will be equal to it.
export interface ExpectStatic extends Chai.ExpectStatic, AsymmetricMatchersContaining {
  <T>(actual: T, message?: string): Assertion<T>
  extend: (expects: MatchersObject) => void
  anything: () => any
  any: (constructor: unknown) => any
  getState: () => MatcherState
  setState: (state: Partial<MatcherState>) => void
  not: AsymmetricMatchersContaining
}
For example, this code asserts that an input value is equal to 2. If it's not, the assertion will throw an error, and the test will fail.
import { expect } from 'vitest'

const input = Math.sqrt(4)

expect(input).to.equal(2) // chai API
expect(input).toBe(2) // jest API
Technically this example doesn't use test function, so in the console you will see Node.js error instead of Vitest output. To learn more about test, please read Test API Reference.
Also, expect can be used statically to access matcher functions, described later, and more.
WARNING
expect has no effect on testing types, if the expression doesn't have a type error. If you want to use Vitest as type checker, use expectTypeOf or assertType.
soft
Type: ExpectStatic & (actual: any) => Assertions
expect.soft functions similarly to expect, but instead of terminating the test execution upon a failed assertion, it continues running and marks the failure as a test failure. All errors encountered during the test will be displayed until the test is completed.
import { expect, test } from 'vitest'

test('expect.soft test', () => {
  expect.soft(1 + 1).toBe(3) // mark the test as fail and continue
  expect.soft(1 + 2).toBe(4) // mark the test as fail and continue
})
// reporter will report both errors at the end of the run
It can also be used with expect. if expect assertion fails, the test will be terminated and all errors will be displayed.
import { expect, test } from 'vitest'

test('expect.soft test', () => {
  expect.soft(1 + 1).toBe(3) // mark the test as fail and continue
  expect(1 + 2).toBe(4) // failed and terminate the test, all previous errors will be output
  expect.soft(1 + 3).toBe(5) // do not run
})
WARNING
expect.soft can only be used inside the test function.
poll
interface ExpectPoll extends ExpectStatic {
  (actual: () => T, options: { interval; timeout; message }): Promise<Assertions<T>>
}
expect.poll reruns the assertion until it is succeeded. You can configure how many times Vitest should rerun the expect.poll callback by setting interval and timeout options.
If an error is thrown inside the expect.poll callback, Vitest will retry again until the timeout runs out.
import { expect, test } from 'vitest'

test('element exists', async () => {
  asyncInjectElement()

  await expect.poll(() => document.querySelector('.element')).toBeTruthy()
})
WARNING
expect.poll makes every assertion asynchronous, so you need to await it. Since Vitest 3, if you forget to await it, the test will fail with a warning to do so.
expect.poll doesn't work with several matchers:
Snapshot matchers are not supported because they will always succeed. If your condition is flaky, consider using vi.waitFor instead to resolve it first:
import { expect, vi } from 'vitest'

const flakyValue = await vi.waitFor(() => getFlakyValue())
expect(flakyValue).toMatchSnapshot()
.resolves and .rejects are not supported. expect.poll already awaits the condition if it's asynchronous.
toThrow and its aliases are not supported because the expect.poll condition is always resolved before the matcher gets the value
not
Using not will negate the assertion. For example, this code asserts that an input value is not equal to 2. If it's equal, the assertion will throw an error, and the test will fail.
import { expect, test } from 'vitest'

const input = Math.sqrt(16)

expect(input).not.to.equal(2) // chai API
expect(input).not.toBe(2) // jest API
toBe
Type: (value: any) => Awaitable<void>
toBe can be used to assert if primitives are equal or that objects share the same reference. It is equivalent of calling expect(Object.is(3, 3)).toBe(true). If the objects are not the same, but you want to check if their structures are identical, you can use toEqual.
For example, the code below checks if the trader has 13 apples.
import { expect, test } from 'vitest'

const stock = {
  type: 'apples',
  count: 13,
}

test('stock has 13 apples', () => {
  expect(stock.type).toBe('apples')
  expect(stock.count).toBe(13)
})

test('stocks are the same', () => {
  const refStock = stock // same reference

  expect(stock).toBe(refStock)
})
Try not to use toBe with floating-point numbers. Since JavaScript rounds them, 0.1 + 0.2 is not strictly 0.3. To reliably assert floating-point numbers, use toBeCloseTo assertion.
toBeCloseTo
Type: (value: number, numDigits?: number) => Awaitable<void>
Use toBeCloseTo to compare floating-point numbers. The optional numDigits argument limits the number of digits to check after the decimal point. For example:
import { expect, test } from 'vitest'

test.fails('decimals are not equal in javascript', () => {
  expect(0.2 + 0.1).toBe(0.3) // 0.2 + 0.1 is 0.30000000000000004
})

test('decimals are rounded to 5 after the point', () => {
  // 0.2 + 0.1 is 0.30000 | "000000000004" removed
  expect(0.2 + 0.1).toBeCloseTo(0.3, 5)
  // nothing from 0.30000000000000004 is removed
  expect(0.2 + 0.1).not.toBeCloseTo(0.3, 50)
})
toBeDefined
Type: () => Awaitable<void>
toBeDefined asserts that the value is not equal to undefined. Useful use case would be to check if function returned anything.
import { expect, test } from 'vitest'

function getApples() {
  return 3
}

test('function returned something', () => {
  expect(getApples()).toBeDefined()
})
toBeUndefined
Type: () => Awaitable<void>
Opposite of toBeDefined, toBeUndefined asserts that the value is equal to undefined. Useful use case would be to check if function hasn't returned anything.
import { expect, test } from 'vitest'

function getApplesFromStock(stock: string) {
  if (stock === 'Bill') {
    return 13
  }
}

test('mary doesn\'t have a stock', () => {
  expect(getApplesFromStock('Mary')).toBeUndefined()
})
toBeTruthy
Type: () => Awaitable<void>
toBeTruthy asserts that the value is true when converted to boolean. Useful if you don't care for the value, but just want to know it can be converted to true.
For example, having this code you don't care for the return value of stocks.getInfo - it maybe a complex object, a string, or anything else. The code will still work.
import { Stocks } from './stocks.js'

const stocks = new Stocks()
stocks.sync('Bill')
if (stocks.getInfo('Bill')) {
  stocks.sell('apples', 'Bill')
}
So if you want to test that stocks.getInfo will be truthy, you could write:
import { expect, test } from 'vitest'
import { Stocks } from './stocks.js'

const stocks = new Stocks()

test('if we know Bill stock, sell apples to him', () => {
  stocks.sync('Bill')
  expect(stocks.getInfo('Bill')).toBeTruthy()
})
Everything in JavaScript is truthy, except false, null, undefined, NaN, 0, -0, 0n, "" and document.all.
toBeFalsy
Type: () => Awaitable<void>
toBeFalsy asserts that the value is false when converted to boolean. Useful if you don't care for the value, but just want to know if it can be converted to false.
For example, having this code you don't care for the return value of stocks.stockFailed - it may return any falsy value, but the code will still work.
import { Stocks } from './stocks.js'

const stocks = new Stocks()
stocks.sync('Bill')
if (!stocks.stockFailed('Bill')) {
  stocks.sell('apples', 'Bill')
}
So if you want to test that stocks.stockFailed will be falsy, you could write:
import { expect, test } from 'vitest'
import { Stocks } from './stocks.js'

const stocks = new Stocks()

test('if Bill stock hasn\'t failed, sell apples to him', () => {
  stocks.syncStocks('Bill')
  expect(stocks.stockFailed('Bill')).toBeFalsy()
})
Everything in JavaScript is truthy, except false, null, undefined, NaN, 0, -0, 0n, "" and document.all.
toBeNull
Type: () => Awaitable<void>
toBeNull simply asserts if something is null. Alias for .toBe(null).
import { expect, test } from 'vitest'

function apples() {
  return null
}

test('we don\'t have apples', () => {
  expect(apples()).toBeNull()
})
toBeNaN
Type: () => Awaitable<void>
toBeNaN simply asserts if something is NaN. Alias for .toBe(NaN).
import { expect, test } from 'vitest'

let i = 0

function getApplesCount() {
  i++
  return i > 1 ? Number.NaN : i
}

test('getApplesCount has some unusual side effects...', () => {
  expect(getApplesCount()).not.toBeNaN()
  expect(getApplesCount()).toBeNaN()
})
toBeOneOf
Type: (sample: Array<any>) => any
toBeOneOf asserts if a value matches any of the values in the provided array.
import { expect, test } from 'vitest'

test('fruit is one of the allowed values', () => {
  expect(fruit).toBeOneOf(['apple', 'banana', 'orange'])
})
The asymmetric matcher is particularly useful when testing optional properties that could be either null or undefined:
test('optional properties can be null or undefined', () => {
  const user = {
    firstName: 'John',
    middleName: undefined,
    lastName: 'Doe'
  }

  expect(user).toEqual({
    firstName: expect.any(String),
    middleName: expect.toBeOneOf([expect.any(String), undefined]),
    lastName: expect.any(String),
  })
})
TIP
You can use expect.not with this matcher to ensure a value does NOT match any of the provided options.
toBeTypeOf
Type: (c: 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined') => Awaitable<void>
toBeTypeOf asserts if an actual value is of type of received type.
import { expect, test } from 'vitest'

const actual = 'stock'

test('stock is type of string', () => {
  expect(actual).toBeTypeOf('string')
})
toBeInstanceOf
Type: (c: any) => Awaitable<void>
toBeInstanceOf asserts if an actual value is instance of received class.
import { expect, test } from 'vitest'
import { Stocks } from './stocks.js'

const stocks = new Stocks()

test('stocks are instance of Stocks', () => {
  expect(stocks).toBeInstanceOf(Stocks)
})
toBeGreaterThan
Type: (n: number | bigint) => Awaitable<void>
toBeGreaterThan asserts if actual value is greater than received one. Equal values will fail the test.
import { expect, test } from 'vitest'
import { getApples } from './stocks.js'

test('have more then 10 apples', () => {
  expect(getApples()).toBeGreaterThan(10)
})
toBeGreaterThanOrEqual
Type: (n: number | bigint) => Awaitable<void>
toBeGreaterThanOrEqual asserts if actual value is greater than received one or equal to it.
import { expect, test } from 'vitest'
import { getApples } from './stocks.js'

test('have 11 apples or more', () => {
  expect(getApples()).toBeGreaterThanOrEqual(11)
})
toBeLessThan
Type: (n: number | bigint) => Awaitable<void>
toBeLessThan asserts if actual value is less than received one. Equal values will fail the test.
import { expect, test } from 'vitest'
import { getApples } from './stocks.js'

test('have less then 20 apples', () => {
  expect(getApples()).toBeLessThan(20)
})
toBeLessThanOrEqual
Type: (n: number | bigint) => Awaitable<void>
toBeLessThanOrEqual asserts if actual value is less than received one or equal to it.
import { expect, test } from 'vitest'
import { getApples } from './stocks.js'

test('have 11 apples or less', () => {
  expect(getApples()).toBeLessThanOrEqual(11)
})
toEqual
Type: (received: any) => Awaitable<void>
toEqual asserts if actual value is equal to received one or has the same structure, if it is an object (compares them recursively). You can see the difference between toEqual and toBe in this example:
import { expect, test } from 'vitest'

const stockBill = {
  type: 'apples',
  count: 13,
}

const stockMary = {
  type: 'apples',
  count: 13,
}

test('stocks have the same properties', () => {
  expect(stockBill).toEqual(stockMary)
})

test('stocks are not the same', () => {
  expect(stockBill).not.toBe(stockMary)
})
WARNING
For Error objects, non-enumerable properties such as name, message, cause and AggregateError.errors are also compared. For Error.cause, the comparison is done asymmetrically:
// success
expect(new Error('hi', { cause: 'x' })).toEqual(new Error('hi'))

// fail
expect(new Error('hi')).toEqual(new Error('hi', { cause: 'x' }))
To test if something was thrown, use toThrowError assertion.
toStrictEqual
Type: (received: any) => Awaitable<void>
toStrictEqual asserts if the actual value is equal to the received one or has the same structure if it is an object (compares them recursively), and of the same type.
Differences from .toEqual:
Keys with undefined properties are checked. e.g. {a: undefined, b: 2} does not match {b: 2} when using .toStrictEqual.
Array sparseness is checked. e.g. [, 1] does not match [undefined, 1] when using .toStrictEqual.
Object types are checked to be equal. e.g. A class instance with fields a and b will not equal a literal object with fields a and b.
import { expect, test } from 'vitest'

class Stock {
  constructor(type) {
    this.type = type
  }
}

test('structurally the same, but semantically different', () => {
  expect(new Stock('apples')).toEqual({ type: 'apples' })
  expect(new Stock('apples')).not.toStrictEqual({ type: 'apples' })
})
toContain
Type: (received: string) => Awaitable<void>
toContain asserts if the actual value is in an array. toContain can also check whether a string is a substring of another string. If you are running tests in a browser-like environment, this assertion can also check if class is contained in a classList, or an element is inside another one.
import { expect, test } from 'vitest'
import { getAllFruits } from './stocks.js'

test('the fruit list contains orange', () => {
  expect(getAllFruits()).toContain('orange')

  const element = document.querySelector('#el')
  // element has a class
  expect(element.classList).toContain('flex')
  // element is inside another one
  expect(document.querySelector('#wrapper')).toContain(element)
})
toContainEqual
Type: (received: any) => Awaitable<void>
toContainEqual asserts if an item with a specific structure and values is contained in an array. It works like toEqual inside for each element.
import { expect, test } from 'vitest'
import { getFruitStock } from './stocks.js'

test('apple available', () => {
  expect(getFruitStock()).toContainEqual({ fruit: 'apple', count: 5 })
})
toHaveLength
Type: (received: number) => Awaitable<void>
toHaveLength asserts if an object has a .length property and it is set to a certain numeric value.
import { expect, test } from 'vitest'

test('toHaveLength', () => {
  expect('abc').toHaveLength(3)
  expect([1, 2, 3]).toHaveLength(3)

  expect('').not.toHaveLength(3) // doesn't have .length of 3
  expect({ length: 3 }).toHaveLength(3)
})
toHaveProperty
Type: (key: any, received?: any) => Awaitable<void>
toHaveProperty asserts if a property at provided reference key exists for an object.
You can provide an optional value argument also known as deep equality, like the toEqual matcher to compare the received property value.
import { expect, test } from 'vitest'

const invoice = {
  'isActive': true,
  'P.O': '12345',
  'customer': {
    first_name: 'John',
    last_name: 'Doe',
    location: 'China',
  },
  'total_amount': 5000,
  'items': [
    {
      type: 'apples',
      quantity: 10,
    },
    {
      type: 'oranges',
      quantity: 5,
    },
  ],
}

test('John Doe Invoice', () => {
  expect(invoice).toHaveProperty('isActive') // assert that the key exists
  expect(invoice).toHaveProperty('total_amount', 5000) // assert that the key exists and the value is equal

  expect(invoice).not.toHaveProperty('account') // assert that this key does not exist

  // Deep referencing using dot notation
  expect(invoice).toHaveProperty('customer.first_name')
  expect(invoice).toHaveProperty('customer.last_name', 'Doe')
  expect(invoice).not.toHaveProperty('customer.location', 'India')

  // Deep referencing using an array containing the key
  expect(invoice).toHaveProperty('items[0].type', 'apples')
  expect(invoice).toHaveProperty('items.0.type', 'apples') // dot notation also works

  // Deep referencing using an array containing the keyPath
  expect(invoice).toHaveProperty(['items', 0, 'type'], 'apples')
  expect(invoice).toHaveProperty(['items', '0', 'type'], 'apples') // string notation also works

  // Wrap your key in an array to avoid the key from being parsed as a deep reference
  expect(invoice).toHaveProperty(['P.O'], '12345')
})
toMatch
Type: (received: string | regexp) => Awaitable<void>
toMatch asserts if a string matches a regular expression or a string.
import { expect, test } from 'vitest'

test('top fruits', () => {
  expect('top fruits include apple, orange and grape').toMatch(/apple/)
  expect('applefruits').toMatch('fruit') // toMatch also accepts a string
})
toMatchObject
Type: (received: object | array) => Awaitable<void>
toMatchObject asserts if an object matches a subset of the properties of an object.
You can also pass an array of objects. This is useful if you want to check that two arrays match in their number of elements, as opposed to arrayContaining, which allows for extra elements in the received array.
import { expect, test } from 'vitest'

const johnInvoice = {
  isActive: true,
  customer: {
    first_name: 'John',
    last_name: 'Doe',
    location: 'China',
  },
  total_amount: 5000,
  items: [
    {
      type: 'apples',
      quantity: 10,
    },
    {
      type: 'oranges',
      quantity: 5,
    },
  ],
}

const johnDetails = {
  customer: {
    first_name: 'John',
    last_name: 'Doe',
    location: 'China',
  },
}

test('invoice has john personal details', () => {
  expect(johnInvoice).toMatchObject(johnDetails)
})

test('the number of elements must match exactly', () => {
  // Assert that an array of object matches
  expect([{ foo: 'bar' }, { baz: 1 }]).toMatchObject([
    { foo: 'bar' },
    { baz: 1 },
  ])
})
toThrowError
Type: (received: any) => Awaitable<void>
Alias: toThrow
toThrowError asserts if a function throws an error when it is called.
You can provide an optional argument to test that a specific error is thrown:
RegExp: error message matches the pattern
string: error message includes the substring
Error, AsymmetricMatcher: compare with a received object similar to toEqual(received)
TIP
You must wrap the code in a function, otherwise the error will not be caught, and test will fail.
This does not apply for async calls as rejects correctly unwraps the promise:
test('expect rejects toThrow', async ({ expect }) => {
  const promise = Promise.reject(new Error('Test'))
  await expect(promise).rejects.toThrowError()
})
For example, if we want to test that getFruitStock('pineapples') throws, we could write:
import { expect, test } from 'vitest'

function getFruitStock(type: string) {
  if (type === 'pineapples') {
    throw new Error('Pineapples are not in stock')
  }

  // Do some other stuff
}

test('throws on pineapples', () => {
  // Test that the error message says "stock" somewhere: these are equivalent
  expect(() => getFruitStock('pineapples')).toThrowError(/stock/)
  expect(() => getFruitStock('pineapples')).toThrowError('stock')

  // Test the exact error message
  expect(() => getFruitStock('pineapples')).toThrowError(
    /^Pineapples are not in stock$/,
  )

  expect(() => getFruitStock('pineapples')).toThrowError(
    new Error('Pineapples are not in stock'),
  )
  expect(() => getFruitStock('pineapples')).toThrowError(expect.objectContaining({
    message: 'Pineapples are not in stock',
  }))
})
TIP
To test async functions, use in combination with rejects.
function getAsyncFruitStock() {
  return Promise.reject(new Error('empty'))
}

test('throws on pineapples', async () => {
  await expect(() => getAsyncFruitStock()).rejects.toThrowError('empty')
})
toMatchSnapshot
Type: <T>(shape?: Partial<T> | string, hint?: string) => void
This ensures that a value matches the most recent snapshot.
You can provide an optional hint string argument that is appended to the test name. Although Vitest always appends a number at the end of a snapshot name, short descriptive hints might be more useful than numbers to differentiate multiple snapshots in a single it or test block. Vitest sorts snapshots by name in the corresponding .snap file.
TIP
When a snapshot mismatches and causes the test to fail, if the mismatch is expected, you can press u key to update the snapshot once. Or you can pass -u or --update CLI options to make Vitest always update the tests.
import { expect, test } from 'vitest'

test('matches snapshot', () => {
  const data = { foo: new Set(['bar', 'snapshot']) }
  expect(data).toMatchSnapshot()
})
You can also provide a shape of an object, if you are testing just a shape of an object, and don't need it to be 100% compatible:
import { expect, test } from 'vitest'

test('matches snapshot', () => {
  const data = { foo: new Set(['bar', 'snapshot']) }
  expect(data).toMatchSnapshot({ foo: expect.any(Set) })
})
toMatchInlineSnapshot
Type: <T>(shape?: Partial<T> | string, snapshot?: string, hint?: string) => void
This ensures that a value matches the most recent snapshot.
Vitest adds and updates the inlineSnapshot string argument to the matcher in the test file (instead of an external .snap file).
import { expect, test } from 'vitest'

test('matches inline snapshot', () => {
  const data = { foo: new Set(['bar', 'snapshot']) }
  // Vitest will update following content when updating the snapshot
  expect(data).toMatchInlineSnapshot(`
    {
      "foo": Set {
        "bar",
        "snapshot",
      },
    }
  `)
})
You can also provide a shape of an object, if you are testing just a shape of an object, and don't need it to be 100% compatible:
import { expect, test } from 'vitest'

test('matches snapshot', () => {
  const data = { foo: new Set(['bar', 'snapshot']) }
  expect(data).toMatchInlineSnapshot(
    { foo: expect.any(Set) },
    `
    {
      "foo": Any<Set>,
    }
  `
  )
})
toMatchFileSnapshot
Type: <T>(filepath: string, hint?: string) => Promise<void>
Compare or update the snapshot with the content of a file explicitly specified (instead of the .snap file).
import { expect, it } from 'vitest'

it('render basic', async () => {
  const result = renderHTML(h('div', { class: 'foo' }))
  await expect(result).toMatchFileSnapshot('./test/basic.output.html')
})
Note that since file system operation is async, you need to use await with toMatchFileSnapshot(). If await is not used, Vitest treats it like expect.soft, meaning the code after the statement will continue to run even if the snapshot mismatches. After the test finishes, Vitest will check the snapshot and fail if there is a mismatch.
toThrowErrorMatchingSnapshot
Type: (hint?: string) => void
The same as toMatchSnapshot, but expects the same value as toThrowError.
toThrowErrorMatchingInlineSnapshot
Type: (snapshot?: string, hint?: string) => void
The same as toMatchInlineSnapshot, but expects the same value as toThrowError.
toHaveBeenCalled
Type: () => Awaitable<void>
This assertion is useful for testing that a function has been called. Requires a spy function to be passed to expect.
import { expect, test, vi } from 'vitest'

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
}

test('spy function', () => {
  const buySpy = vi.spyOn(market, 'buy')

  expect(buySpy).not.toHaveBeenCalled()

  market.buy('apples', 10)

  expect(buySpy).toHaveBeenCalled()
})
toHaveBeenCalledTimes
Type: (amount: number) => Awaitable<void>
This assertion checks if a function was called a certain amount of times. Requires a spy function to be passed to expect.
import { expect, test, vi } from 'vitest'

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
}

test('spy function called two times', () => {
  const buySpy = vi.spyOn(market, 'buy')

  market.buy('apples', 10)
  market.buy('apples', 20)

  expect(buySpy).toHaveBeenCalledTimes(2)
})
toHaveBeenCalledWith
Type: (...args: any[]) => Awaitable<void>
This assertion checks if a function was called at least once with certain parameters. Requires a spy function to be passed to expect.
import { expect, test, vi } from 'vitest'

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
}

test('spy function', () => {
  const buySpy = vi.spyOn(market, 'buy')

  market.buy('apples', 10)
  market.buy('apples', 20)

  expect(buySpy).toHaveBeenCalledWith('apples', 10)
  expect(buySpy).toHaveBeenCalledWith('apples', 20)
})
toHaveBeenCalledBefore 3.0.0+
Type: (mock: MockInstance, failIfNoFirstInvocation?: boolean) => Awaitable<void>
This assertion checks if a Mock was called before another Mock.
test('calls mock1 before mock2', () => {
  const mock1 = vi.fn()
  const mock2 = vi.fn()

  mock1()
  mock2()
  mock1()

  expect(mock1).toHaveBeenCalledBefore(mock2)
})
toHaveBeenCalledAfter 3.0.0+
Type: (mock: MockInstance, failIfNoFirstInvocation?: boolean) => Awaitable<void>
This assertion checks if a Mock was called after another Mock.
test('calls mock1 after mock2', () => {
  const mock1 = vi.fn()
  const mock2 = vi.fn()

  mock2()
  mock1()
  mock2()

  expect(mock1).toHaveBeenCalledAfter(mock2)
})
toHaveBeenCalledExactlyOnceWith 3.0.0+
Type: (...args: any[]) => Awaitable<void>
This assertion checks if a function was called exactly once and with certain parameters. Requires a spy function to be passed to expect.
import { expect, test, vi } from 'vitest'

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
}

test('spy function', () => {
  const buySpy = vi.spyOn(market, 'buy')

  market.buy('apples', 10)

  expect(buySpy).toHaveBeenCalledExactlyOnceWith('apples', 10)
})
toHaveBeenLastCalledWith
Type: (...args: any[]) => Awaitable<void>
This assertion checks if a function was called with certain parameters at its last invocation. Requires a spy function to be passed to expect.
import { expect, test, vi } from 'vitest'

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
}

test('spy function', () => {
  const buySpy = vi.spyOn(market, 'buy')

  market.buy('apples', 10)
  market.buy('apples', 20)

  expect(buySpy).not.toHaveBeenLastCalledWith('apples', 10)
  expect(buySpy).toHaveBeenLastCalledWith('apples', 20)
})
toHaveBeenNthCalledWith
Type: (time: number, ...args: any[]) => Awaitable<void>
This assertion checks if a function was called with certain parameters at the certain time. The count starts at 1. So, to check the second entry, you would write .toHaveBeenNthCalledWith(2, ...).
Requires a spy function to be passed to expect.
import { expect, test, vi } from 'vitest'

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
}

test('first call of spy function called with right params', () => {
  const buySpy = vi.spyOn(market, 'buy')

  market.buy('apples', 10)
  market.buy('apples', 20)

  expect(buySpy).toHaveBeenNthCalledWith(1, 'apples', 10)
})
toHaveReturned
Type: () => Awaitable<void>
This assertion checks if a function has successfully returned a value at least once (i.e., did not throw an error). Requires a spy function to be passed to expect.
import { expect, test, vi } from 'vitest'

function getApplesPrice(amount: number) {
  const PRICE = 10
  return amount * PRICE
}

test('spy function returned a value', () => {
  const getPriceSpy = vi.fn(getApplesPrice)

  const price = getPriceSpy(10)

  expect(price).toBe(100)
  expect(getPriceSpy).toHaveReturned()
})
toHaveReturnedTimes
Type: (amount: number) => Awaitable<void>
This assertion checks if a function has successfully returned a value an exact amount of times (i.e., did not throw an error). Requires a spy function to be passed to expect.
import { expect, test, vi } from 'vitest'

test('spy function returns a value two times', () => {
  const sell = vi.fn((product: string) => ({ product }))

  sell('apples')
  sell('bananas')

  expect(sell).toHaveReturnedTimes(2)
})
toHaveReturnedWith
Type: (returnValue: any) => Awaitable<void>
You can call this assertion to check if a function has successfully returned a value with certain parameters at least once. Requires a spy function to be passed to expect.
import { expect, test, vi } from 'vitest'

test('spy function returns a product', () => {
  const sell = vi.fn((product: string) => ({ product }))

  sell('apples')

  expect(sell).toHaveReturnedWith({ product: 'apples' })
})
toHaveLastReturnedWith
Type: (returnValue: any) => Awaitable<void>
You can call this assertion to check if a function has successfully returned a certain value when it was last invoked. Requires a spy function to be passed to expect.
import { expect, test, vi } from 'vitest'

test('spy function returns bananas on a last call', () => {
  const sell = vi.fn((product: string) => ({ product }))

  sell('apples')
  sell('bananas')

  expect(sell).toHaveLastReturnedWith({ product: 'bananas' })
})
toHaveNthReturnedWith
Type: (time: number, returnValue: any) => Awaitable<void>
You can call this assertion to check if a function has successfully returned a value with certain parameters on a certain call. Requires a spy function to be passed to expect.
import { expect, test, vi } from 'vitest'

test('spy function returns bananas on second call', () => {
  const sell = vi.fn((product: string) => ({ product }))

  sell('apples')
  sell('bananas')

  expect(sell).toHaveNthReturnedWith(2, { product: 'bananas' })
})
toHaveResolved
Type: () => Awaitable<void>
This assertion checks if a function has successfully resolved a value at least once (i.e., did not reject). Requires a spy function to be passed to expect.
If the function returned a promise, but it was not resolved yet, this will fail.
import { expect, test, vi } from 'vitest'
import db from './db/apples.js'

async function getApplesPrice(amount: number) {
  return amount * await db.get('price')
}

test('spy function resolved a value', async () => {
  const getPriceSpy = vi.fn(getApplesPrice)

  const price = await getPriceSpy(10)

  expect(price).toBe(100)
  expect(getPriceSpy).toHaveResolved()
})
toHaveResolvedTimes
Type: (amount: number) => Awaitable<void>
This assertion checks if a function has successfully resolved a value an exact amount of times (i.e., did not reject). Requires a spy function to be passed to expect.
This will only count resolved promises. If the function returned a promise, but it was not resolved yet, it will not be counted.
import { expect, test, vi } from 'vitest'

test('spy function resolved a value two times', async () => {
  const sell = vi.fn((product: string) => Promise.resolve({ product }))

  await sell('apples')
  await sell('bananas')

  expect(sell).toHaveResolvedTimes(2)
})
toHaveResolvedWith
Type: (returnValue: any) => Awaitable<void>
You can call this assertion to check if a function has successfully resolved a certain value at least once. Requires a spy function to be passed to expect.
If the function returned a promise, but it was not resolved yet, this will fail.
import { expect, test, vi } from 'vitest'

test('spy function resolved a product', async () => {
  const sell = vi.fn((product: string) => Promise.resolve({ product }))

  await sell('apples')

  expect(sell).toHaveResolvedWith({ product: 'apples' })
})
toHaveLastResolvedWith
Type: (returnValue: any) => Awaitable<void>
You can call this assertion to check if a function has successfully resolved a certain value when it was last invoked. Requires a spy function to be passed to expect.
If the function returned a promise, but it was not resolved yet, this will fail.
import { expect, test, vi } from 'vitest'

test('spy function resolves bananas on a last call', async () => {
  const sell = vi.fn((product: string) => Promise.resolve({ product }))

  await sell('apples')
  await sell('bananas')

  expect(sell).toHaveLastResolvedWith({ product: 'bananas' })
})
toHaveNthResolvedWith
Type: (time: number, returnValue: any) => Awaitable<void>
You can call this assertion to check if a function has successfully resolved a certain value on a specific invocation. Requires a spy function to be passed to expect.
If the function returned a promise, but it was not resolved yet, this will fail.
import { expect, test, vi } from 'vitest'

test('spy function returns bananas on second call', async () => {
  const sell = vi.fn((product: string) => Promise.resolve({ product }))

  await sell('apples')
  await sell('bananas')

  expect(sell).toHaveNthResolvedWith(2, { product: 'bananas' })
})
toSatisfy
Type: (predicate: (value: any) => boolean) => Awaitable<void>
This assertion checks if a value satisfies a certain predicate.
import { describe, expect, it } from 'vitest'

const isOdd = (value: number) => value % 2 !== 0

describe('toSatisfy()', () => {
  it('pass with 0', () => {
    expect(1).toSatisfy(isOdd)
  })

  it('pass with negation', () => {
    expect(2).not.toSatisfy(isOdd)
  })
})
resolves
Type: Promisify<Assertions>
resolves is intended to remove boilerplate when asserting asynchronous code. Use it to unwrap value from the pending promise and assert its value with usual assertions. If the promise rejects, the assertion will fail.
It returns the same Assertions object, but all matchers now return Promise, so you would need to await it. Also works with chai assertions.
For example, if you have a function, that makes an API call and returns some data, you may use this code to assert its return value:
import { expect, test } from 'vitest'

async function buyApples() {
  return fetch('/buy/apples').then(r => r.json())
}

test('buyApples returns new stock id', async () => {
  // toEqual returns a promise now, so you HAVE to await it
  await expect(buyApples()).resolves.toEqual({ id: 1 }) // jest API
  await expect(buyApples()).resolves.to.equal({ id: 1 }) // chai API
})
WARNING
If the assertion is not awaited, then you will have a false-positive test that will pass every time. To make sure that assertions are actually called, you may use expect.assertions(number).
Since Vitest 3, if a method is not awaited, Vitest will show a warning at the end of the test. In Vitest 4, the test will be marked as "failed" if the assertion is not awaited.
rejects
Type: Promisify<Assertions>
rejects is intended to remove boilerplate when asserting asynchronous code. Use it to unwrap reason why the promise was rejected, and assert its value with usual assertions. If the promise successfully resolves, the assertion will fail.
It returns the same Assertions object, but all matchers now return Promise, so you would need to await it. Also works with chai assertions.
For example, if you have a function that fails when you call it, you may use this code to assert the reason:
import { expect, test } from 'vitest'

async function buyApples(id) {
  if (!id) {
    throw new Error('no id')
  }
}

test('buyApples throws an error when no id provided', async () => {
  // toThrow returns a promise now, so you HAVE to await it
  await expect(buyApples()).rejects.toThrow('no id')
})
WARNING
If the assertion is not awaited, then you will have a false-positive test that will pass every time. To make sure that assertions were actually called, you can use expect.assertions(number).
Since Vitest 3, if a method is not awaited, Vitest will show a warning at the end of the test. In Vitest 4, the test will be marked as "failed" if the assertion is not awaited.
expect.assertions
Type: (count: number) => void
After the test has passed or failed verify that a certain number of assertions was called during a test. A useful case would be to check if an asynchronous code was called.
For example, if we have a function that asynchronously calls two matchers, we can assert that they were actually called.
import { expect, test } from 'vitest'

async function doAsync(...cbs) {
  await Promise.all(
    cbs.map((cb, index) => cb({ index })),
  )
}

test('all assertions are called', async () => {
  expect.assertions(2)
  function callback1(data) {
    expect(data).toBeTruthy()
  }
  function callback2(data) {
    expect(data).toBeTruthy()
  }

  await doAsync(callback1, callback2)
})
WARNING
When using assertions with async concurrent tests, expect from the local Test Context must be used to ensure the right test is detected.
expect.hasAssertions
Type: () => void
After the test has passed or failed verify that at least one assertion was called during a test. A useful case would be to check if an asynchronous code was called.
For example, if you have a code that calls a callback, we can make an assertion inside a callback, but the test will always pass if we don't check if an assertion was called.
import { expect, test } from 'vitest'
import { db } from './db.js'

const cbs = []

function onSelect(cb) {
  cbs.push(cb)
}

// after selecting from db, we call all callbacks
function select(id) {
  return db.select({ id }).then((data) => {
    return Promise.all(
      cbs.map(cb => cb(data)),
    )
  })
}

test('callback was called', async () => {
  expect.hasAssertions()
  onSelect((data) => {
    // should be called on select
    expect(data).toBeTruthy()
  })
  // if not awaited, test will fail
  // if you don't have expect.hasAssertions(), test will pass
  await select(3)
})
expect.unreachable
Type: (message?: string) => never
This method is used to assert that a line should never be reached.
For example, if we want to test that build() throws due to receiving directories having no src folder, and also handle each error separately, we could do this:
import { expect, test } from 'vitest'

async function build(dir) {
  if (dir.includes('no-src')) {
    throw new Error(`${dir}/src does not exist`)
  }
}

const errorDirs = [
  'no-src-folder',
  // ...
]

test.each(errorDirs)('build fails with "%s"', async (dir) => {
  try {
    await build(dir)
    expect.unreachable('Should not pass build')
  }
  catch (err: any) {
    expect(err).toBeInstanceOf(Error)
    expect(err.stack).toContain('build')

    switch (dir) {
      case 'no-src-folder':
        expect(err.message).toBe(`${dir}/src does not exist`)
        break
      default:
        // to exhaust all error tests
        expect.unreachable('All error test must be handled')
        break
    }
  }
})
expect.anything
Type: () => any
This asymmetric matcher, when used with equality check, will always return true. Useful, if you just want to be sure that the property exist.
import { expect, test } from 'vitest'

test('object has "apples" key', () => {
  expect({ apples: 22 }).toEqual({ apples: expect.anything() })
})
expect.any
Type: (constructor: unknown) => any
This asymmetric matcher, when used with an equality check, will return true only if the value is an instance of a specified constructor. Useful, if you have a value that is generated each time, and you only want to know that it exists with a proper type.
import { expect, test } from 'vitest'
import { generateId } from './generators.js'

test('"id" is a number', () => {
  expect({ id: generateId() }).toEqual({ id: expect.any(Number) })
})
expect.closeTo
Type: (expected: any, precision?: number) => any
expect.closeTo is useful when comparing floating point numbers in object properties or array item. If you need to compare a number, please use .toBeCloseTo instead.
The optional precision argument limits the number of digits to check after the decimal point. For the default value 2, the test criterion is Math.abs(expected - received) < 0.005 (that is, 10 ** -2 / 2).
For example, this test passes with a precision of 5 digits:
test('compare float in object properties', () => {
  expect({
    title: '0.1 + 0.2',
    sum: 0.1 + 0.2,
  }).toEqual({
    title: '0.1 + 0.2',
    sum: expect.closeTo(0.3, 5),
  })
})
expect.arrayContaining
Type: <T>(expected: T[]) => any
When used with an equality check, this asymmetric matcher will return true if the value is an array and contains specified items.
import { expect, test } from 'vitest'

test('basket includes fuji', () => {
  const basket = {
    varieties: [
      'Empire',
      'Fuji',
      'Gala',
    ],
    count: 3
  }
  expect(basket).toEqual({
    count: 3,
    varieties: expect.arrayContaining(['Fuji'])
  })
})
TIP
You can use expect.not with this matcher to negate the expected value.
expect.objectContaining
Type: (expected: any) => any
When used with an equality check, this asymmetric matcher will return true if the value has a similar shape.
import { expect, test } from 'vitest'

test('basket has empire apples', () => {
  const basket = {
    varieties: [
      {
        name: 'Empire',
        count: 1,
      }
    ],
  }
  expect(basket).toEqual({
    varieties: [
      expect.objectContaining({ name: 'Empire' }),
    ]
  })
})
TIP
You can use expect.not with this matcher to negate the expected value.
expect.stringContaining
Type: (expected: any) => any
When used with an equality check, this asymmetric matcher will return true if the value is a string and contains a specified substring.
import { expect, test } from 'vitest'

test('variety has "Emp" in its name', () => {
  const variety = {
    name: 'Empire',
    count: 1,
  }
  expect(variety).toEqual({
    name: expect.stringContaining('Emp'),
    count: 1,
  })
})
TIP
You can use expect.not with this matcher to negate the expected value.
expect.stringMatching
Type: (expected: any) => any
When used with an equality check, this asymmetric matcher will return true if the value is a string and contains a specified substring or if the string matches a regular expression.
import { expect, test } from 'vitest'

test('variety ends with "re"', () => {
  const variety = {
    name: 'Empire',
    count: 1,
  }
  expect(variety).toEqual({
    name: expect.stringMatching(/re$/),
    count: 1,
  })
})
TIP
You can use expect.not with this matcher to negate the expected value.
expect.addSnapshotSerializer
Type: (plugin: PrettyFormatPlugin) => void
This method adds custom serializers that are called when creating a snapshot. This is an advanced feature - if you want to know more, please read a guide on custom serializers.
If you are adding custom serializers, you should call this method inside setupFiles. This will affect every snapshot.
TIP
If you previously used Vue CLI with Jest, you might want to install jest-serializer-vue. Otherwise, your snapshots will be wrapped in a string, which cases " to be escaped.
expect.extend
Type: (matchers: MatchersObject) => void
You can extend default matchers with your own. This function is used to extend the matchers object with custom matchers.
When you define matchers that way, you also create asymmetric matchers that can be used like expect.stringContaining.
import { expect, test } from 'vitest'

test('custom matchers', () => {
  expect.extend({
    toBeFoo: (received, expected) => {
      if (received !== 'foo') {
        return {
          message: () => `expected ${received} to be foo`,
          pass: false,
        }
      }
    },
  })

  expect('foo').toBeFoo()
  expect({ foo: 'foo' }).toEqual({ foo: expect.toBeFoo() })
})
TIP
If you want your matchers to appear in every test, you should call this method inside setupFiles.
This function is compatible with Jest's expect.extend, so any library that uses it to create custom matchers will work with Vitest.
If you are using TypeScript, since Vitest 0.31.0 you can extend default Assertion interface in an ambient declaration file (e.g: vitest.d.ts) with the code below:
interface CustomMatchers<R = unknown> {
  toBeFoo: () => R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
WARNING
Don't forget to include the ambient declaration file in your tsconfig.json.
TIP
If you want to know more, checkout guide on extending matchers.
expect.addEqualityTesters
Type: (tester: Array<Tester>) => void
You can use this method to define custom testers, which are methods used by matchers, to test if two objects are equal. It is compatible with Jest's expect.addEqualityTesters.
import { expect, test } from 'vitest'

class AnagramComparator {
  public word: string

  constructor(word: string) {
    this.word = word
  }

  equals(other: AnagramComparator): boolean {
    const cleanStr1 = this.word.replace(/ /g, '').toLowerCase()
    const cleanStr2 = other.word.replace(/ /g, '').toLowerCase()

    const sortedStr1 = cleanStr1.split('').sort().join('')
    const sortedStr2 = cleanStr2.split('').sort().join('')

    return sortedStr1 === sortedStr2
  }
}

function isAnagramComparator(a: unknown): a is AnagramComparator {
  return a instanceof AnagramComparator
}

function areAnagramsEqual(a: unknown, b: unknown): boolean | undefined {
  const isAAnagramComparator = isAnagramComparator(a)
  const isBAnagramComparator = isAnagramComparator(b)

  if (isAAnagramComparator && isBAnagramComparator) {
    return a.equals(b)
  }
  else if (isAAnagramComparator === isBAnagramComparator) {
    return undefined
  }
  else {
    return false
  }
}

expect.addEqualityTesters([areAnagramsEqual])

test('custom equality tester', () => {
  expect(new AnagramComparator('listen')).toEqual(new AnagramComparator('silent'))
})
Suggest changes to this page
Last updated: 5/5/25, 10:11 PM
Pager
Previous page
Vi Utility
Next page
ExpectTypeOf
expectTypeOf
WARNING
During runtime this function doesn't do anything. To enable typechecking, don't forget to pass down --typecheck flag.
Type: <T>(a: unknown) => ExpectTypeOf
not
Type: ExpectTypeOf
You can negate all assertions, using .not property.
toEqualTypeOf
Type: <T>(expected: T) => void
This matcher will check if the types are fully equal to each other. This matcher will not fail if two objects have different values, but the same type. It will fail however if an object is missing a property.
import { expectTypeOf } from 'vitest'

expectTypeOf({ a: 1 }).toEqualTypeOf<{ a: number }>()
expectTypeOf({ a: 1 }).toEqualTypeOf({ a: 1 })
expectTypeOf({ a: 1 }).toEqualTypeOf({ a: 2 })
expectTypeOf({ a: 1, b: 1 }).not.toEqualTypeOf<{ a: number }>()
toMatchTypeOf
Type: <T>(expected: T) => void
This matcher checks if expect type extends provided type. It is different from toEqual and is more similar to expect's toMatchObject(). With this matcher, you can check if an object “matches” a type.
import { expectTypeOf } from 'vitest'

expectTypeOf({ a: 1, b: 1 }).toMatchTypeOf({ a: 1 })
expectTypeOf<number>().toMatchTypeOf<string | number>()
expectTypeOf<string | number>().not.toMatchTypeOf<number>()
extract
Type: ExpectTypeOf<ExtractedUnion>
You can use .extract to narrow down types for further testing.
import { expectTypeOf } from 'vitest'

type ResponsiveProp<T> = T | T[] | { xs?: T; sm?: T; md?: T }

interface CSSProperties { margin?: string; padding?: string }

function getResponsiveProp<T>(_props: T): ResponsiveProp<T> {
  return {}
}

const cssProperties: CSSProperties = { margin: '1px', padding: '2px' }

expectTypeOf(getResponsiveProp(cssProperties))
  .extract<{ xs?: any }>() // extracts the last type from a union
  .toEqualTypeOf<{ xs?: CSSProperties; sm?: CSSProperties; md?: CSSProperties }>()

expectTypeOf(getResponsiveProp(cssProperties))
  .extract<unknown[]>() // extracts an array from a union
  .toEqualTypeOf<CSSProperties[]>()
WARNING
If no type is found in the union, .extract will return never.
exclude
Type: ExpectTypeOf<NonExcludedUnion>
You can use .exclude to remove types from a union for further testing.
import { expectTypeOf } from 'vitest'

type ResponsiveProp<T> = T | T[] | { xs?: T; sm?: T; md?: T }

interface CSSProperties { margin?: string; padding?: string }

function getResponsiveProp<T>(_props: T): ResponsiveProp<T> {
  return {}
}

const cssProperties: CSSProperties = { margin: '1px', padding: '2px' }

expectTypeOf(getResponsiveProp(cssProperties))
  .exclude<unknown[]>()
  .exclude<{ xs?: unknown }>() // or just .exclude<unknown[] | { xs?: unknown }>()
  .toEqualTypeOf<CSSProperties>()
WARNING
If no type is found in the union, .exclude will return never.
returns
Type: ExpectTypeOf<ReturnValue>
You can use .returns to extract return value of a function type.
import { expectTypeOf } from 'vitest'

expectTypeOf(() => {}).returns.toBeVoid()
expectTypeOf((a: number) => [a, a]).returns.toEqualTypeOf([1, 2])
WARNING
If used on a non-function type, it will return never, so you won't be able to chain it with other matchers.
parameters
Type: ExpectTypeOf<Parameters>
You can extract function arguments with .parameters to perform assertions on its value. Parameters are returned as an array.
import { expectTypeOf } from 'vitest'

type NoParam = () => void
type HasParam = (s: string) => void

expectTypeOf<NoParam>().parameters.toEqualTypeOf<[]>()
expectTypeOf<HasParam>().parameters.toEqualTypeOf<[string]>()
WARNING
If used on a non-function type, it will return never, so you won't be able to chain it with other matchers.
TIP
You can also use .toBeCallableWith matcher as a more expressive assertion.
parameter
Type: (nth: number) => ExpectTypeOf
You can extract a certain function argument with .parameter(number) call to perform other assertions on it.
import { expectTypeOf } from 'vitest'

function foo(a: number, b: string) {
  return [a, b]
}

expectTypeOf(foo).parameter(0).toBeNumber()
expectTypeOf(foo).parameter(1).toBeString()
WARNING
If used on a non-function type, it will return never, so you won't be able to chain it with other matchers.
constructorParameters
Type: ExpectTypeOf<ConstructorParameters>
You can extract constructor parameters as an array of values and perform assertions on them with this method.
import { expectTypeOf } from 'vitest'

expectTypeOf(Date).constructorParameters.toEqualTypeOf<[] | [string | number | Date]>()
WARNING
If used on a non-function type, it will return never, so you won't be able to chain it with other matchers.
TIP
You can also use .toBeConstructibleWith matcher as a more expressive assertion.
instance
Type: ExpectTypeOf<ConstructableInstance>
This property gives access to matchers that can be performed on an instance of the provided class.
import { expectTypeOf } from 'vitest'

expectTypeOf(Date).instance.toHaveProperty('toISOString')
WARNING
If used on a non-function type, it will return never, so you won't be able to chain it with other matchers.
items
Type: ExpectTypeOf<T>
You can get array item type with .items to perform further assertions.
import { expectTypeOf } from 'vitest'

expectTypeOf([1, 2, 3]).items.toEqualTypeOf<number>()
expectTypeOf([1, 2, 3]).items.not.toEqualTypeOf<string>()
resolves
Type: ExpectTypeOf<ResolvedPromise>
This matcher extracts resolved value of a Promise, so you can perform other assertions on it.
import { expectTypeOf } from 'vitest'

async function asyncFunc() {
  return 123
}

expectTypeOf(asyncFunc).returns.resolves.toBeNumber()
expectTypeOf(Promise.resolve('string')).resolves.toBeString()
WARNING
If used on a non-promise type, it will return never, so you won't be able to chain it with other matchers.
guards
Type: ExpectTypeOf<Guard>
This matcher extracts guard value (e.g., v is number), so you can perform assertions on it.
import { expectTypeOf } from 'vitest'

function isString(v: any): v is string {
  return typeof v === 'string'
}
expectTypeOf(isString).guards.toBeString()
WARNING
Returns never, if the value is not a guard function, so you won't be able to chain it with other matchers.
asserts
Type: ExpectTypeOf<Assert>
This matcher extracts assert value (e.g., assert v is number), so you can perform assertions on it.
import { expectTypeOf } from 'vitest'

function assertNumber(v: any): asserts v is number {
  if (typeof v !== 'number') {
    throw new TypeError('Nope !')
  }
}

expectTypeOf(assertNumber).asserts.toBeNumber()
WARNING
Returns never, if the value is not an assert function, so you won't be able to chain it with other matchers.
toBeAny
Type: () => void
With this matcher you can check, if provided type is any type. If the type is too specific, the test will fail.
import { expectTypeOf } from 'vitest'

expectTypeOf<any>().toBeAny()
expectTypeOf({} as any).toBeAny()
expectTypeOf('string').not.toBeAny()
toBeUnknown
Type: () => void
This matcher checks, if provided type is unknown type.
import { expectTypeOf } from 'vitest'

expectTypeOf().toBeUnknown()
expectTypeOf({} as unknown).toBeUnknown()
expectTypeOf('string').not.toBeUnknown()
toBeNever
Type: () => void
This matcher checks, if provided type is a never type.
import { expectTypeOf } from 'vitest'

expectTypeOf<never>().toBeNever()
expectTypeOf((): never => {}).returns.toBeNever()
toBeFunction
Type: () => void
This matcher checks, if provided type is a function.
import { expectTypeOf } from 'vitest'

expectTypeOf(42).not.toBeFunction()
expectTypeOf((): never => {}).toBeFunction()
toBeObject
Type: () => void
This matcher checks, if provided type is an object.
import { expectTypeOf } from 'vitest'

expectTypeOf(42).not.toBeObject()
expectTypeOf({}).toBeObject()
toBeArray
Type: () => void
This matcher checks, if provided type is Array<T>.
import { expectTypeOf } from 'vitest'

expectTypeOf(42).not.toBeArray()
expectTypeOf([]).toBeArray()
expectTypeOf([1, 2]).toBeArray()
expectTypeOf([{}, 42]).toBeArray()
toBeString
Type: () => void
This matcher checks, if provided type is a string.
import { expectTypeOf } from 'vitest'

expectTypeOf(42).not.toBeString()
expectTypeOf('').toBeString()
expectTypeOf('a').toBeString()
toBeBoolean
Type: () => void
This matcher checks, if provided type is boolean.
import { expectTypeOf } from 'vitest'

expectTypeOf(42).not.toBeBoolean()
expectTypeOf(true).toBeBoolean()
expectTypeOf<boolean>().toBeBoolean()
toBeVoid
Type: () => void
This matcher checks, if provided type is void.
import { expectTypeOf } from 'vitest'

expectTypeOf(() => {}).returns.toBeVoid()
expectTypeOf<void>().toBeVoid()
toBeSymbol
Type: () => void
This matcher checks, if provided type is a symbol.
import { expectTypeOf } from 'vitest'

expectTypeOf(Symbol(1)).toBeSymbol()
expectTypeOf<symbol>().toBeSymbol()
toBeNull
Type: () => void
This matcher checks, if provided type is null.
import { expectTypeOf } from 'vitest'

expectTypeOf(null).toBeNull()
expectTypeOf<null>().toBeNull()
expectTypeOf(undefined).not.toBeNull()
toBeUndefined
Type: () => void
This matcher checks, if provided type is undefined.
import { expectTypeOf } from 'vitest'

expectTypeOf(undefined).toBeUndefined()
expectTypeOf<undefined>().toBeUndefined()
expectTypeOf(null).not.toBeUndefined()
toBeNullable
Type: () => void
This matcher checks, if you can use null or undefined with provided type.
import { expectTypeOf } from 'vitest'

expectTypeOf<undefined | 1>().toBeNullable()
expectTypeOf<null | 1>().toBeNullable()
expectTypeOf<undefined | null | 1>().toBeNullable()
toBeCallableWith
Type: () => void
This matcher ensures you can call provided function with a set of parameters.
import { expectTypeOf } from 'vitest'

type NoParam = () => void
type HasParam = (s: string) => void

expectTypeOf<NoParam>().toBeCallableWith()
expectTypeOf<HasParam>().toBeCallableWith('some string')
WARNING
If used on a non-function type, it will return never, so you won't be able to chain it with other matchers.
toBeConstructibleWith
Type: () => void
This matcher ensures you can create a new instance with a set of constructor parameters.
import { expectTypeOf } from 'vitest'

expectTypeOf(Date).toBeConstructibleWith(new Date())
expectTypeOf(Date).toBeConstructibleWith('01-01-2000')
WARNING
If used on a non-function type, it will return never, so you won't be able to chain it with other matchers.
toHaveProperty
Type: <K extends keyof T>(property: K) => ExpectTypeOf<T[K>
This matcher checks if a property exists on the provided object. If it exists, it also returns the same set of matchers for the type of this property, so you can chain assertions one after another.
import { expectTypeOf } from 'vitest'

const obj = { a: 1, b: '' }

expectTypeOf(obj).toHaveProperty('a')
expectTypeOf(obj).not.toHaveProperty('c')

expectTypeOf(obj).toHaveProperty('a').toBeNumber()
expectTypeOf(obj).toHaveProperty('b').toBeString()
expectTypeOf(obj).toHaveProperty('a').not.toBeString()
Suggest changes to this page
Last updated: 7/23/24, 7:52 AM
Pager
Previous page
Expect
Next page
Assert
assert
Vitest reexports the assert method from chai for verifying invariants.
assert
Type: (expression: any, message?: string) => asserts expression
Assert that the given expression is truthy, otherwise the assertion fails.
import { assert, test } from 'vitest'

test('assert', () => {
  assert('foo' !== 'bar', 'foo should not be equal to bar')
})
fail
Type:
(message?: string) => never
<T>(actual: T, expected: T, message?: string, operator?: string) => never
Force an assertion failure.
import { assert, test } from 'vitest'

test('assert.fail', () => {
  assert.fail('error message on failure')
  assert.fail('foo', 'bar', 'foo is not bar', '===')
})
isOk
Type: <T>(value: T, message?: string) => void
Alias ok
Assert that the given value is truthy.
import { assert, test } from 'vitest'

test('assert.isOk', () => {
  assert.isOk('foo', 'every truthy is ok')
  assert.isOk(false, 'this will fail since false is not truthy')
})
isNotOk
Type: <T>(value: T, message?: string) => void
Alias notOk
Assert that the given value is falsy.
import { assert, test } from 'vitest'

test('assert.isNotOk', () => {
  assert.isNotOk('foo', 'this will fail, every truthy is not ok')
  assert.isNotOk(false, 'this will pass since false is falsy')
})
equal
Type: <T>(actual: T, expected: T, message?: string) => void
Asserts non-strict equality (==) of actual and expected.
import { assert, test } from 'vitest'

test('assert.equal', () => {
  assert.equal(Math.sqrt(4), '2')
})
notEqual
Type: <T>(actual: T, expected: T, message?: string) => void
Asserts non-strict inequality (!=) of actual and expected.
import { assert, test } from 'vitest'

test('assert.equal', () => {
  assert.notEqual(Math.sqrt(4), 3)
})
strictEqual
Type: <T>(actual: T, expected: T, message?: string) => void
Asserts strict equality (===) of actual and expected.
import { assert, test } from 'vitest'

test('assert.strictEqual', () => {
  assert.strictEqual(Math.sqrt(4), 2)
})
deepEqual
Type: <T>(actual: T, expected: T, message?: string) => void
Asserts that actual is deeply equal to expected.
import { assert, test } from 'vitest'

test('assert.deepEqual', () => {
  assert.deepEqual({ color: 'green' }, { color: 'green' })
})
notDeepEqual
Type: <T>(actual: T, expected: T, message?: string) => void
Assert that actual is not deeply equal to expected.
import { assert, test } from 'vitest'

test('assert.notDeepEqual', () => {
  assert.notDeepEqual({ color: 'green' }, { color: 'red' })
})
isAbove
Type: (valueToCheck: number, valueToBeAbove: number, message?: string) => void
Assert that valueToCheck is strictly greater than (>) valueToBeAbove.
import { assert, test } from 'vitest'

test('assert.isAbove', () => {
  assert.isAbove(5, 2, '5 is strictly greater than 2')
})
isAtLeast
Type: (valueToCheck: number, valueToBeAtLeast: number, message?: string) => void
Assert that valueToCheck is greater than or equal to (>=) valueToBeAtLeast.
import { assert, test } from 'vitest'

test('assert.isAtLeast', () => {
  assert.isAtLeast(5, 2, '5 is greater or equal to 2')
  assert.isAtLeast(3, 3, '3 is greater or equal to 3')
})
isBelow
Type: (valueToCheck: number, valueToBeBelow: number, message?: string) => void
Asserts valueToCheck is strictly less than (<) valueToBeBelow.
import { assert, test } from 'vitest'

test('assert.isBelow', () => {
  assert.isBelow(3, 6, '3 is strictly less than 6')
})
isAtMost
Type: (valueToCheck: number, valueToBeAtMost: number, message?: string) => void
Asserts valueToCheck is less than or equal to (<=) valueToBeAtMost.
import { assert, test } from 'vitest'

test('assert.isAtMost', () => {
  assert.isAtMost(3, 6, '3 is less than or equal to 6')
  assert.isAtMost(4, 4, '4 is less than or equal to 4')
})
isTrue
Type: <T>(value: T, message?: string) => void
Asserts that value is true.
import { assert, test } from 'vitest'

const testPassed = true

test('assert.isTrue', () => {
  assert.isTrue(testPassed)
})
isNotTrue
Type: <T>(value: T, message?: string) => void
Asserts that value is not true.
import { assert, test } from 'vitest'

const testPassed = 'ok'

test('assert.isNotTrue', () => {
  assert.isNotTrue(testPassed)
})
isFalse
Type: <T>(value: T, message?: string) => void
Asserts that value is false.
import { assert, test } from 'vitest'

const testPassed = false

test('assert.isFalse', () => {
  assert.isFalse(testPassed)
})
isNotFalse
Type: <T>(value: T, message?: string) => void
Asserts that value is not false.
import { assert, test } from 'vitest'

const testPassed = 'no'

test('assert.isNotFalse', () => {
  assert.isNotFalse(testPassed)
})
isNull
Type: <T>(value: T, message?: string) => void
Asserts that value is null.
import { assert, test } from 'vitest'

const error = null

test('assert.isNull', () => {
  assert.isNull(error, 'error is null')
})
isNotNull
Type: <T>(value: T, message?: string) => void
Asserts that value is not null.
import { assert, test } from 'vitest'

const error = { message: 'error was occurred' }

test('assert.isNotNull', () => {
  assert.isNotNull(error, 'error is not null but object')
})
isNaN
Type: <T>(value: T, message?: string) => void
Asserts that value is NaN.
import { assert, test } from 'vitest'

const calculation = 1 * 'vitest'

test('assert.isNaN', () => {
  assert.isNaN(calculation, '1 * "vitest" is NaN')
})
isNotNaN
Type: <T>(value: T, message?: string) => void
Asserts that value is not NaN.
import { assert, test } from 'vitest'

const calculation = 1 * 2

test('assert.isNotNaN', () => {
  assert.isNotNaN(calculation, '1 * 2 is Not NaN but 2')
})
exists
Type: <T>(value: T, message?: string) => void
Asserts that value is neither null nor undefined.
import { assert, test } from 'vitest'

const name = 'foo'

test('assert.exists', () => {
  assert.exists(name, 'foo is neither null nor undefined')
})
notExists
Type: <T>(value: T, message?: string) => void
Asserts that value is either null nor undefined.
import { assert, test } from 'vitest'

const foo = null
const bar = undefined

test('assert.notExists', () => {
  assert.notExists(foo, 'foo is null so not exist')
  assert.notExists(bar, 'bar is undefined so not exist')
})
isUndefined
Type: <T>(value: T, message?: string) => void
Asserts that value is undefined.
import { assert, test } from 'vitest'

const name = undefined

test('assert.isUndefined', () => {
  assert.isUndefined(name, 'name is undefined')
})
isDefined
Type: <T>(value: T, message?: string) => void
Asserts that value is not undefined.
import { assert, test } from 'vitest'

const name = 'foo'

test('assert.isDefined', () => {
  assert.isDefined(name, 'name is not undefined')
})
isFunction
Type: <T>(value: T, message?: string) => void
Alias: isCallable Asserts that value is a function.
import { assert, test } from 'vitest'

function name() { return 'foo' };

test('assert.isFunction', () => {
  assert.isFunction(name, 'name is function')
})
isNotFunction
Type: <T>(value: T, message?: string) => void
Alias: isNotCallable
Asserts that value is not a function.
import { assert, test } from 'vitest'

const name = 'foo'

test('assert.isNotFunction', () => {
  assert.isNotFunction(name, 'name is not function but string')
})
isObject
Type: <T>(value: T, message?: string) => void
Asserts that value is an object of type Object (as revealed by Object.prototype.toString). The assertion does not match subclassed objects.
import { assert, test } from 'vitest'

const someThing = { color: 'red', shape: 'circle' }

test('assert.isObject', () => {
  assert.isObject(someThing, 'someThing is object')
})
isNotObject
Type: <T>(value: T, message?: string) => void
Asserts that value is not an object of type Object (as revealed by Object.prototype.toString). The assertion does not match subclassed objects.
import { assert, test } from 'vitest'

const someThing = 'redCircle'

test('assert.isNotObject', () => {
  assert.isNotObject(someThing, 'someThing is not object but string')
})
isArray
Type: <T>(value: T, message?: string) => void
Asserts that value is an array.
import { assert, test } from 'vitest'

const color = ['red', 'green', 'yellow']

test('assert.isArray', () => {
  assert.isArray(color, 'color is array')
})
isNotArray
Type: <T>(value: T, message?: string) => void
Asserts that value is not an array.
import { assert, test } from 'vitest'

const color = 'red'

test('assert.isNotArray', () => {
  assert.isNotArray(color, 'color is not array but string')
})
isString
Type: <T>(value: T, message?: string) => void
Asserts that value is a string.
import { assert, test } from 'vitest'

const color = 'red'

test('assert.isString', () => {
  assert.isString(color, 'color is string')
})
isNotString
Type: <T>(value: T, message?: string) => void
Asserts that value is not a string.
import { assert, test } from 'vitest'

const color = ['red', 'green', 'yellow']

test('assert.isNotString', () => {
  assert.isNotString(color, 'color is not string but array')
})
isNumber
Type: <T>(value: T, message?: string) => void
Asserts that value is a number.
import { assert, test } from 'vitest'

const colors = 3

test('assert.isNumber', () => {
  assert.isNumber(colors, 'colors is number')
})
isNotNumber
Type: <T>(value: T, message?: string) => void
Asserts that value is not a number.
import { assert, test } from 'vitest'

const colors = '3 colors'

test('assert.isNotNumber', () => {
  assert.isNotNumber(colors, 'colors is not number but strings')
})
isFinite
Type: <T>(value: T, message?: string) => void
Asserts that value is a finite number (not NaN, Infinity).
import { assert, test } from 'vitest'

const colors = 3

test('assert.isFinite', () => {
  assert.isFinite(colors, 'colors is number not NaN or Infinity')
})
isBoolean
Type: <T>(value: T, message?: string) => void
Asserts that value is a boolean.
import { assert, test } from 'vitest'

const isReady = true

test('assert.isBoolean', () => {
  assert.isBoolean(isReady, 'isReady is a boolean')
})
isNotBoolean
Type: <T>(value: T, message?: string) => void
Asserts that value is not a boolean.
import { assert, test } from 'vitest'

const isReady = 'sure'

test('assert.isBoolean', () => {
  assert.isBoolean(isReady, 'isReady is not a boolean but string')
})
typeOf
Type: <T>(value: T, name: string, message?: string) => void
Asserts that value’s type is name, as determined by Object.prototype.toString.
import { assert, test } from 'vitest'

test('assert.typeOf', () => {
  assert.typeOf({ color: 'red' }, 'object', 'we have an object')
  assert.typeOf(['red', 'green'], 'array', 'we have an array')
  assert.typeOf('red', 'string', 'we have a string')
  assert.typeOf(/red/, 'regexp', 'we have a regular expression')
  assert.typeOf(null, 'null', 'we have a null')
  assert.typeOf(undefined, 'undefined', 'we have an undefined')
})
notTypeOf
Type: <T>(value: T, name: string, message?: string) => void
Asserts that value’s type is not name, as determined by Object.prototype.toString.
import { assert, test } from 'vitest'

test('assert.notTypeOf', () => {
  assert.notTypeOf('red', 'number', '"red" is not a number')
})
instanceOf
Type: <T>(value: T, constructor: Function, message?: string) => void
Asserts that value is an instance of constructor.
import { assert, test } from 'vitest'

function Person(name) { this.name = name }
const foo = new Person('foo')

class Tea {
  constructor(name) {
    this.name = name
  }
}
const coffee = new Tea('coffee')

test('assert.instanceOf', () => {
  assert.instanceOf(foo, Person, 'foo is an instance of Person')
  assert.instanceOf(coffee, Tea, 'coffee is an instance of Tea')
})
notInstanceOf
Type: <T>(value: T, constructor: Function, message?: string) => void
Asserts that value is not an instance of constructor.
import { assert, test } from 'vitest'

function Person(name) { this.name = name }
const foo = new Person('foo')

class Tea {
  constructor(name) {
    this.name = name
  }
}
const coffee = new Tea('coffee')

test('assert.instanceOf', () => {
  assert.instanceOf(foo, Tea, 'foo is not an instance of Tea')
})
include
Type:
(haystack: string, needle: string, message?: string) => void
<T>(haystack: readonly T[] | ReadonlySet<T> | ReadonlyMap<any, T>, needle: T, message?: string) => void
<T extends object>(haystack: WeakSet<T>, needle: T, message?: string) => void
<T>(haystack: T, needle: Partial<T>, message?: string) => void
Asserts that haystack includes needle. Can be used to assert the inclusion of a value in an array, a substring in a string, or a subset of properties in an object.
import { assert, test } from 'vitest'

test('assert.include', () => {
  assert.include([1, 2, 3], 2, 'array contains value')
  assert.include('foobar', 'foo', 'string contains substring')
  assert.include({ foo: 'bar', hello: 'universe' }, { foo: 'bar' }, 'object contains property')
})
notInclude
Type:
(haystack: string, needle: string, message?: string) => void
<T>(haystack: readonly T[] | ReadonlySet<T> | ReadonlyMap<any, T>, needle: T, message?: string) => void
<T extends object>(haystack: WeakSet<T>, needle: T, message?: string) => void
<T>(haystack: T, needle: Partial<T>, message?: string) => void
Asserts that haystack does not include needle. It can be used to assert the absence of a value in an array, a substring in a string, or a subset of properties in an object.
import { assert, test } from 'vitest'

test('assert.notInclude', () => {
  assert.notInclude([1, 2, 3], 4, 'array doesn\'t contain 4')
  assert.notInclude('foobar', 'baz', 'foobar doesn\'t contain baz')
  assert.notInclude({ foo: 'bar', hello: 'universe' }, { foo: 'baz' }, 'object doesn\'t contain property')
})
deepInclude
Type:
(haystack: string, needle: string, message?: string) => void
<T>(haystack: readonly T[] | ReadonlySet<T> | ReadonlyMap<any, T>, needle: T, message?: string) => void
<T>(haystack: T, needle: T extends WeakSet<any> ? never : Partial<T>, message?: string) => void
Asserts that haystack includes needle. Can be used to assert the inclusion of a value in an array or a subset of properties in an object. Deep equality is used.
import { assert, test } from 'vitest'

const obj1 = { a: 1 }
const obj2 = { b: 2 }

test('assert.deepInclude', () => {
  assert.deepInclude([obj1, obj2], { a: 1 })
  assert.deepInclude({ foo: obj1, bar: obj2 }, { foo: { a: 1 } })
})
notDeepInclude
Type:
(haystack: string, needle: string, message?: string) => void
<T>(haystack: readonly T[] | ReadonlySet<T> | ReadonlyMap<any, T>, needle: T, message?: string) => void
<T>(haystack: T, needle: T extends WeakSet<any> ? never : Partial<T>, message?: string) => void
Asserts that haystack does not include needle. It can be used to assert the absence of a value in an array or a subset of properties in an object. Deep equality is used.
import { assert, test } from 'vitest'

const obj1 = { a: 1 }
const obj2 = { b: 2 }

test('assert.notDeepInclude', () => {
  assert.notDeepInclude([obj1, obj2], { a: 10 })
  assert.notDeepInclude({ foo: obj1, bar: obj2 }, { foo: { a: 10 } })
})
nestedInclude
Type: (haystack: any, needle: any, message?: string) => void
Asserts that haystack includes needle. Can be used to assert the inclusion of a subset of properties in an object. Enables the use of dot- and bracket-notation for referencing nested properties. ‘[]’ and ‘.’ in property names can be escaped using double backslashes.
import { assert, test } from 'vitest'

test('assert.nestedInclude', () => {
  assert.nestedInclude({ '.a': { b: 'x' } }, { '\\.a.[b]': 'x' })
  assert.nestedInclude({ a: { '[b]': 'x' } }, { 'a.\\[b\\]': 'x' })
})
notNestedInclude
Type: (haystack: any, needle: any, message?: string) => void
Asserts that haystack does not include needle. Can be used to assert the inclusion of a subset of properties in an object. Enables the use of dot- and bracket-notation for referencing nested properties. ‘[]’ and ‘.’ in property names can be escaped using double backslashes.
import { assert, test } from 'vitest'

test('assert.nestedInclude', () => {
  assert.notNestedInclude({ '.a': { b: 'x' } }, { '\\.a.b': 'y' })
  assert.notNestedInclude({ a: { '[b]': 'x' } }, { 'a.\\[b\\]': 'y' })
})
deepNestedInclude
Type: (haystack: any, needle: any, message?: string) => void
Asserts that haystack includes needle. Can be used to assert the inclusion of a subset of properties in an object while checking for deep equality. Enables the use of dot- and bracket-notation for referencing nested properties. ‘[]’ and ‘.’ in property names can be escaped using double backslashes.
import { assert, test } from 'vitest'

test('assert.deepNestedInclude', () => {
  assert.deepNestedInclude({ a: { b: [{ x: 1 }] } }, { 'a.b[0]': { x: 1 } })
  assert.deepNestedInclude({ '.a': { '[b]': { x: 1 } } }, { '\\.a.\\[b\\]': { x: 1 } })
})
notDeepNestedInclude
Type: (haystack: any, needle: any, message?: string) => void
Asserts that haystack not includes needle. Can be used to assert the absence of a subset of properties in an object while checking for deep equality. Enables the use of dot- and bracket-notation for referencing nested properties. ‘[]’ and ‘.’ in property names can be escaped using double backslashes.
import { assert, test } from 'vitest'

test('assert.notDeepNestedInclude', () => {
  assert.notDeepNestedInclude({ a: { b: [{ x: 1 }] } }, { 'a.b[0]': { y: 1 } })
  assert.notDeepNestedInclude({ '.a': { '[b]': { x: 1 } } }, { '\\.a.\\[b\\]': { y: 2 } })
})
ownInclude
Type: (haystack: any, needle: any, message?: string) => void
Asserts that haystack includes needle. Can be used to assert the inclusion of a subset of properties in an object while ignoring inherited properties.
import { assert, test } from 'vitest'

test('assert.ownInclude', () => {
  assert.ownInclude({ a: 1 }, { a: 1 })
})
notOwnInclude
Type: (haystack: any, needle: any, message?: string) => void
Asserts that haystack includes needle. Can be used to assert the absence of a subset of properties in an object while ignoring inherited properties.
import { assert, test } from 'vitest'

const obj1 = {
  b: 2
}

const obj2 = object.create(obj1)
obj2.a = 1

test('assert.notOwnInclude', () => {
  assert.notOwnInclude(obj2, { b: 2 })
})
deepOwnInclude
Type: (haystack: any, needle: any, message?: string) => void
Asserts that haystack includes needle. Can be used to assert the inclusion of a subset of properties in an object while ignoring inherited properties and checking for deep equality.
import { assert, test } from 'vitest'

test('assert.deepOwnInclude', () => {
  assert.deepOwnInclude({ a: { b: 2 } }, { a: { b: 2 } })
})
notDeepOwnInclude
Type: (haystack: any, needle: any, message?: string) => void
Asserts that haystack not includes needle. Can be used to assert the absence of a subset of properties in an object while ignoring inherited properties and checking for deep equality.
import { assert, test } from 'vitest'

test('assert.notDeepOwnInclude', () => {
  assert.notDeepOwnInclude({ a: { b: 2 } }, { a: { c: 3 } })
})
match
Type: (value: string, regexp: RegExp, message?: string) => void
Asserts that value matches the regular expression regexp.
import { assert, test } from 'vitest'

test('assert.match', () => {
  assert.match('foobar', /^foo/, 'regexp matches')
})
notMatch
Type: (value: string, regexp: RegExp, message?: string) => void
Asserts that value does not matches the regular expression regexp.
import { assert, test } from 'vitest'

test('assert.notMatch', () => {
  assert.notMatch('foobar', /^foo/, 'regexp does not match')
})
property
Type: <T>(object: T, property: string, message?: string) => void
Asserts that object has a direct or inherited property named by property
import { assert, test } from 'vitest'

test('assert.property', () => {
  assert.property({ tea: { green: 'matcha' } }, 'tea')
  assert.property({ tea: { green: 'matcha' } }, 'toString')
})
notProperty
Type: <T>(object: T, property: string, message?: string) => void
Asserts that object does not have a direct or inherited property named by property
import { assert, test } from 'vitest'

test('assert.notProperty', () => {
  assert.notProperty({ tea: { green: 'matcha' } }, 'coffee')
})
propertyVal
Type: <T, V>(object: T, property: string, value: V, message?: string) => void
Asserts that object has a direct or inherited property named by property with a value given by value. Uses a strict equality check (===).
import { assert, test } from 'vitest'

test('assert.notPropertyVal', () => {
  assert.propertyVal({ tea: 'is good' }, 'tea', 'is good')
})
notPropertyVal
Type: <T, V>(object: T, property: string, value: V, message?: string) => void
Asserts that object does not have a direct or inherited property named by property with a value given by value. Uses a strict equality check (===).
import { assert, test } from 'vitest'

test('assert.notPropertyVal', () => {
  assert.notPropertyVal({ tea: 'is good' }, 'tea', 'is bad')
  assert.notPropertyVal({ tea: 'is good' }, 'coffee', 'is good')
})
deepPropertyVal
Type: <T, V>(object: T, property: string, value: V, message?: string) => void
Asserts that object has a direct or inherited property named by property with a value given by value. Uses a deep equality check.
import { assert, test } from 'vitest'

test('assert.deepPropertyVal', () => {
  assert.deepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'matcha' })
})
notDeepPropertyVal
Type: <T, V>(object: T, property: string, value: V, message?: string) => void
Asserts that object does not have a direct or inherited property named by property with a value given by value. Uses a deep equality check.
import { assert, test } from 'vitest'

test('assert.deepPropertyVal', () => {
  assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { black: 'matcha' })
  assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'oolong' })
  assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'coffee', { green: 'matcha' })
})
nestedProperty
Type: <T>(object: T, property: string, message?: string) => void
Asserts that object has a direct or inherited property named by property, which can be a string using dot- and bracket-notation for nested reference.
import { assert, test } from 'vitest'

test('assert.deepPropertyVal', () => {
  assert.nestedProperty({ tea: { green: 'matcha' } }, 'tea.green')
})
notNestedProperty
Type: <T>(object: T, property: string, message?: string) => void
Asserts that object does not have a direct or inherited property named by property, which can be a string using dot- and bracket-notation for nested reference.
import { assert, test } from 'vitest'

test('assert.deepPropertyVal', () => {
  assert.notNestedProperty({ tea: { green: 'matcha' } }, 'tea.oolong')
})
nestedPropertyVal
Type: <T>(object: T, property: string, value: any, message?: string) => void
Asserts that object has a property named by property with value given by value. property can use dot- and bracket-notation for nested reference. Uses a strict equality check (===).
import { assert, test } from 'vitest'

test('assert.nestedPropertyVal', () => {
  assert.nestedPropertyVal({ tea: { green: 'matcha' } }, 'tea.green', 'matcha')
})
notNestedPropertyVal
Type: <T>(object: T, property: string, value: any, message?: string) => void
Asserts that object does not have a property named by property with value given by value. property can use dot- and bracket-notation for nested reference. Uses a strict equality check (===).
import { assert, test } from 'vitest'

test('assert.notNestedPropertyVal', () => {
  assert.notNestedPropertyVal({ tea: { green: 'matcha' } }, 'tea.green', 'konacha')
  assert.notNestedPropertyVal({ tea: { green: 'matcha' } }, 'coffee.green', 'matcha')
})
deepNestedPropertyVal
Type: <T>(object: T, property: string, value: any, message?: string) => void
Asserts that object has a property named by property with a value given by value. property can use dot- and bracket-notation for nested reference. Uses a deep equality check (===).
import { assert, test } from 'vitest'

test('assert.notNestedPropertyVal', () => {
  assert.notNestedPropertyVal({ tea: { green: 'matcha' } }, 'tea.green', 'konacha')
  assert.notNestedPropertyVal({ tea: { green: 'matcha' } }, 'coffee.green', 'matcha')
})
notDeepNestedPropertyVal
Type: <T>(object: T, property: string, value: any, message?: string) => void
Asserts that object does not have a property named by property with value given by value. property can use dot- and bracket-notation for nested reference. Uses a deep equality check.
import { assert, test } from 'vitest'

test('assert.notDeepNestedPropertyVal', () => {
  assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { oolong: 'yum' })
  assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { matcha: 'yuck' })
  assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.black', { matcha: 'yum' })
})
lengthOf
Type: <T extends { readonly length?: number | undefined } | { readonly size?: number | undefined }>(object: T, length: number, message?: string) => void
Asserts that object has a length or size with the expected value.
import { assert, test } from 'vitest'

test('assert.lengthOf', () => {
  assert.lengthOf([1, 2, 3], 3, 'array has length of 3')
  assert.lengthOf('foobar', 6, 'string has length of 6')
  assert.lengthOf(new Set([1, 2, 3]), 3, 'set has size of 3')
  assert.lengthOf(new Map([['a', 1], ['b', 2], ['c', 3]]), 3, 'map has size of 3')
})
hasAnyKeys
Type: <T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void
Asserts that object has at least one of the keys provided. You can also provide a single object instead of a keys array and its keys will be used as the expected set of keys.
import { assert, test } from 'vitest'

test('assert.hasAnyKeys', () => {
  assert.hasAnyKeys({ foo: 1, bar: 2, baz: 3 }, ['foo', 'iDontExist', 'baz'])
  assert.hasAnyKeys({ foo: 1, bar: 2, baz: 3 }, { foo: 30, iDontExist: 99, baz: 1337 })
  assert.hasAnyKeys(new Map([[{ foo: 1 }, 'bar'], ['key', 'value']]), [{ foo: 1 }, 'key'])
  assert.hasAnyKeys(new Set([{ foo: 'bar' }, 'anotherKey']), [{ foo: 'bar' }, 'anotherKey'])
})
hasAllKeys
Type: <T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void
Asserts that object has all and only all of the keys provided. You can also provide a single object instead of a keys array and its keys will be used as the expected set of keys.
import { assert, test } from 'vitest'

test('assert.hasAllKeys', () => {
  assert.hasAllKeys({ foo: 1, bar: 2, baz: 3 }, ['foo', 'bar', 'baz'])
  assert.hasAllKeys({ foo: 1, bar: 2, baz: 3 }, { foo: 30, bar: 99, baz: 1337 })
  assert.hasAllKeys(new Map([[{ foo: 1 }, 'bar'], ['key', 'value']]), [{ foo: 1 }, 'key'])
  assert.hasAllKeys(new Set([{ foo: 'bar' }, 'anotherKey'], [{ foo: 'bar' }, 'anotherKey']))
})
containsAllKeys
Type: <T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void
Asserts that object has all of the keys provided but may have more keys not listed. You can also provide a single object instead of a keys array and its keys will be used as the expected set of keys.
import { assert, test } from 'vitest'

test('assert.containsAllKeys', () => {
  assert.containsAllKeys({ foo: 1, bar: 2, baz: 3 }, ['foo', 'baz'])
  assert.containsAllKeys({ foo: 1, bar: 2, baz: 3 }, ['foo', 'bar', 'baz'])
  assert.containsAllKeys({ foo: 1, bar: 2, baz: 3 }, { foo: 30, baz: 1337 })
  assert.containsAllKeys({ foo: 1, bar: 2, baz: 3 }, { foo: 30, bar: 99, baz: 1337 })
  assert.containsAllKeys(new Map([[{ foo: 1 }, 'bar'], ['key', 'value']]), [{ foo: 1 }])
  assert.containsAllKeys(new Map([[{ foo: 1 }, 'bar'], ['key', 'value']]), [{ foo: 1 }, 'key'])
  assert.containsAllKeys(new Set([{ foo: 'bar' }, 'anotherKey'], [{ foo: 'bar' }]))
  assert.containsAllKeys(new Set([{ foo: 'bar' }, 'anotherKey'], [{ foo: 'bar' }, 'anotherKey']))
})
doesNotHaveAnyKeys
Type: <T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void
Asserts that object has none of the keys provided. You can also provide a single object instead of a keys array and its keys will be used as the expected set of keys.
import { assert, test } from 'vitest'

test('assert.doesNotHaveAnyKeys', () => {
  assert.doesNotHaveAnyKeys({ foo: 1, bar: 2, baz: 3 }, ['one', 'two', 'example'])
  assert.doesNotHaveAnyKeys({ foo: 1, bar: 2, baz: 3 }, { one: 1, two: 2, example: 'foo' })
  assert.doesNotHaveAnyKeys(new Map([[{ foo: 1 }, 'bar'], ['key', 'value']]), [{ one: 'two' }, 'example'])
  assert.doesNotHaveAnyKeys(new Set([{ foo: 'bar' }, 'anotherKey'], [{ one: 'two' }, 'example']))
})
doesNotHaveAllKeys
Type: <T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void
Asserts that object does not have at least one of the keys provided. You can also provide a single object instead of a keys array and its keys will be used as the expected set of keys.
import { assert, test } from 'vitest'

test('assert.hasAnyKeys', () => {
  assert.doesNotHaveAnyKeys({ foo: 1, bar: 2, baz: 3 }, ['one', 'two', 'example'])
  assert.doesNotHaveAnyKeys({ foo: 1, bar: 2, baz: 3 }, { one: 1, two: 2, example: 'foo' })
  assert.doesNotHaveAnyKeys(new Map([[{ foo: 1 }, 'bar'], ['key', 'value']]), [{ one: 'two' }, 'example'])
  assert.doesNotHaveAnyKeys(new Set([{ foo: 'bar' }, 'anotherKey']), [{ one: 'two' }, 'example'])
})
hasAnyDeepKeys
Type: <T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void
Asserts that object has at least one of the keys provided. Since Sets and Maps can have objects as keys you can use this assertion to perform a deep comparison. You can also provide a single object instead of a keys array and its keys will be used as the expected set of keys.
import { assert, test } from 'vitest'

test('assert.hasAnyDeepKeys', () => {
  assert.hasAnyDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [1, 2]]), { one: 'one' })
  assert.hasAnyDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [1, 2]]), [{ one: 'one' }, { two: 'two' }])
  assert.hasAnyDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [{ two: 'two' }, 'valueTwo']]), [{ one: 'one' }, { two: 'two' }])
  assert.hasAnyDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), { one: 'one' })
  assert.hasAnyDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), [{ one: 'one' }, { three: 'three' }])
  assert.hasAnyDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), [{ one: 'one' }, { two: 'two' }])
})
hasAllDeepKeys
Type: <T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void
Asserts that object has all and only all of the keys provided. Since Sets and Maps can have objects as keys you can use this assertion to perform a deep comparison. You can also provide a single object instead of a keys array and its keys will be used as the expected set of keys.
import { assert, test } from 'vitest'

test('assert.hasAnyDeepKeys', () => {
  assert.hasAllDeepKeys(new Map([[{ one: 'one' }, 'valueOne']]), { one: 'one' })
  assert.hasAllDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [{ two: 'two' }, 'valueTwo']]), [{ one: 'one' }, { two: 'two' }])
  assert.hasAllDeepKeys(new Set([{ one: 'one' }]), { one: 'one' })
  assert.hasAllDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), [{ one: 'one' }, { two: 'two' }])
})
containsAllDeepKeys
Type: <T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void
Asserts that object contains all of the keys provided. Since Sets and Maps can have objects as keys you can use this assertion to perform a deep comparison. You can also provide a single object instead of a keys array and its keys will be used as the expected set of keys.
import { assert, test } from 'vitest'

test('assert.containsAllDeepKeys', () => {
  assert.containsAllDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [1, 2]]), { one: 'one' })
  assert.containsAllDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [{ two: 'two' }, 'valueTwo']]), [{ one: 'one' }, { two: 'two' }])
  assert.containsAllDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), { one: 'one' })
  assert.containsAllDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), [{ one: 'one' }, { two: 'two' }])
})
doesNotHaveAnyDeepKeys
Type: <T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void
Asserts that object has none of the keys provided. Since Sets and Maps can have objects as keys you can use this assertion to perform a deep comparison. You can also provide a single object instead of a keys array and its keys will be used as the expected set of keys.
import { assert, test } from 'vitest'

test('assert.doesNotHaveAnyDeepKeys', () => {
  assert.doesNotHaveAnyDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [1, 2]]), { thisDoesNot: 'exist' })
  assert.doesNotHaveAnyDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [{ two: 'two' }, 'valueTwo']]), [{ twenty: 'twenty' }, { fifty: 'fifty' }])
  assert.doesNotHaveAnyDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), { twenty: 'twenty' })
  assert.doesNotHaveAnyDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), [{ twenty: 'twenty' }, { fifty: 'fifty' }])
})
doesNotHaveAllDeepKeys
Type: <T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void
Asserts that object does not have at least one of the keys provided. Since Sets and Maps can have objects as keys you can use this assertion to perform a deep comparison. You can also provide a single object instead of a keys array and its keys will be used as the expected set of keys.
import { assert, test } from 'vitest'

test('assert.doesNotHaveAllDeepKeys', () => {
  assert.doesNotHaveAllDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [1, 2]]), { thisDoesNot: 'exist' })
  assert.doesNotHaveAllDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [{ two: 'two' }, 'valueTwo']]), [{ twenty: 'twenty' }, { one: 'one' }])
  assert.doesNotHaveAllDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), { twenty: 'twenty' })
  assert.doesNotHaveAllDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), [{ one: 'one' }, { fifty: 'fifty' }])
})
throws
Type:
(fn: () => void, errMsgMatcher?: RegExp | string, ignored?: any, message?: string) => void
(fn: () => void, errorLike?: ErrorConstructor | Error | null, errMsgMatcher?: RegExp | string | null, message?: string) => void
Alias:
throw
Throw
If errorLike is an Error constructor, asserts that fn will throw an error that is an instance of errorLike. If errorLike is an Error instance, asserts that the error thrown is the same instance as errorLike. If errMsgMatcher is provided, it also asserts that the error thrown will have a message matching errMsgMatcher.
import { assert, test } from 'vitest'

test('assert.throws', () => {
  assert.throws(fn, 'Error thrown must have this msg')
  assert.throws(fn, /Error thrown must have a msg that matches this/)
  assert.throws(fn, ReferenceError)
  assert.throws(fn, errorInstance)
  assert.throws(fn, ReferenceError, 'Error thrown must be a ReferenceError and have this msg')
  assert.throws(fn, errorInstance, 'Error thrown must be the same errorInstance and have this msg')
  assert.throws(fn, ReferenceError, /Error thrown must be a ReferenceError and match this/)
  assert.throws(fn, errorInstance, /Error thrown must be the same errorInstance and match this/)
})
doesNotThrow
Type: (fn: () => void, errMsgMatcher?: RegExp | string, ignored?: any, message?: string) => void
Type: (fn: () => void, errorLike?: ErrorConstructor | Error | null, errMsgMatcher?: RegExp | string | null, message?: string) => void
If errorLike is an Error constructor, asserts that fn will not throw an error that is an instance of errorLike. If errorLike is an Error instance, asserts that the error thrown is not the same instance as errorLike. If errMsgMatcher is provided, it also asserts that the error thrown will not have a message matching errMsgMatcher.
import { assert, test } from 'vitest'

test('assert.doesNotThrow', () => {
  assert.doesNotThrow(fn, 'Any Error thrown must not have this message')
  assert.doesNotThrow(fn, /Any Error thrown must not match this/)
  assert.doesNotThrow(fn, Error)
  assert.doesNotThrow(fn, errorInstance)
  assert.doesNotThrow(fn, Error, 'Error must not have this message')
  assert.doesNotThrow(fn, errorInstance, 'Error must not have this message')
  assert.doesNotThrow(fn, Error, /Error must not match this/)
  assert.doesNotThrow(fn, errorInstance, /Error must not match this/)
})
operator
Type: (val1: OperatorComparable, operator: Operator, val2: OperatorComparable, message?: string) => void
Compare val1 and val2 using operator.
import { assert, test } from 'vitest'

test('assert.operator', () => {
  assert.operator(1, '<', 2, 'everything is ok')
})
closeTo
Type: (actual: number, expected: number, delta: number, message?: string) => void
Alias: approximately
Asserts that the actual is equal expected, to within a +/- delta range.
import { assert, test } from 'vitest'

test('assert.closeTo', () => {
  assert.closeTo(1.5, 1, 0.5, 'numbers are close')
})
sameMembers
Type: <T>(set1: T[], set2: T[], message?: string) => void
Asserts that set1 and set2 have the same members in any order. Uses a strict equality check (===).
import { assert, test } from 'vitest'

test('assert.sameMembers', () => {
  assert.sameMembers([1, 2, 3], [2, 1, 3], 'same members')
})
notSameMembers
Type: <T>(set1: T[], set2: T[], message?: string) => void
Asserts that set1 and set2 don't have the same members in any order. Uses a strict equality check (===).
import { assert, test } from 'vitest'

test('assert.sameMembers', () => {
  assert.notSameMembers([1, 2, 3], [5, 1, 3], 'not same members')
})
sameDeepMembers
Type: <T>(set1: T[], set2: T[], message?: string) => void
Asserts that set1 and set2 have the same members in any order. Uses a deep equality check.
import { assert, test } from 'vitest'

test('assert.sameDeepMembers', () => {
  assert.sameDeepMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ b: 2 }, { a: 1 }, { c: 3 }], 'same deep members')
})
notSameDeepMembers
Type: <T>(set1: T[], set2: T[], message?: string) => void
Asserts that set1 and set2 don’t have the same members in any order. Uses a deep equality check.
import { assert, test } from 'vitest'

test('assert.sameDeepMembers', () => {
  assert.sameDeepMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ b: 2 }, { a: 1 }, { c: 3 }], 'same deep members')
})
sameOrderedMembers
Type: <T>(set1: T[], set2: T[], message?: string) => void
Asserts that set1 and set2 have the same members in the same order. Uses a strict equality check (===).
import { assert, test } from 'vitest'

test('assert.sameOrderedMembers', () => {
  assert.sameOrderedMembers([1, 2, 3], [1, 2, 3], 'same ordered members')
})
notSameOrderedMembers
Type: <T>(set1: T[], set2: T[], message?: string) => void
Asserts that set1 and set2 have the same members in the same order. Uses a strict equality check (===).
import { assert, test } from 'vitest'

test('assert.notSameOrderedMembers', () => {
  assert.notSameOrderedMembers([1, 2, 3], [2, 1, 3], 'not same ordered members')
})
sameDeepOrderedMembers
Type: <T>(set1: T[], set2: T[], message?: string) => void
Asserts that set1 and set2 have the same members in the same order. Uses a deep equality check.
import { assert, test } from 'vitest'

test('assert.sameDeepOrderedMembers', () => {
  assert.sameDeepOrderedMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ a: 1 }, { b: 2 }, { c: 3 }], 'same deep ordered members')
})
notSameDeepOrderedMembers
Type: <T>(set1: T[], set2: T[], message?: string) => void
Asserts that set1 and set2 don’t have the same members in the same order. Uses a deep equality check.
import { assert, test } from 'vitest'

test('assert.notSameDeepOrderedMembers', () => {
  assert.notSameDeepOrderedMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ a: 1 }, { b: 2 }, { z: 5 }], 'not same deep ordered members')
  assert.notSameDeepOrderedMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ b: 2 }, { a: 1 }, { c: 3 }], 'not same deep ordered members')
})
includeMembers
Type: <T>(superset: T[], subset: T[], message?: string) => void
Asserts that subset is included in superset in any order. Uses a strict equality check (===). Duplicates are ignored.
import { assert, test } from 'vitest'

test('assert.includeMembers', () => {
  assert.includeMembers([1, 2, 3], [2, 1, 2], 'include members')
})
notIncludeMembers
Type: <T>(superset: T[], subset: T[], message?: string) => void
Asserts that subset isn't included in superset in any order. Uses a strict equality check (===). Duplicates are ignored.
import { assert, test } from 'vitest'

test('assert.notIncludeMembers', () => {
  assert.notIncludeMembers([1, 2, 3], [5, 1], 'not include members')
})
includeDeepMembers
Type: <T>(superset: T[], subset: T[], message?: string) => void
Asserts that subset is included in superset in any order. Uses a deep equality check. Duplicates are ignored.
import { assert, test } from 'vitest'

test('assert.includeDeepMembers', () => {
  assert.includeDeepMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ b: 2 }, { a: 1 }, { b: 2 }], 'include deep members')
})
notIncludeDeepMembers
Type: <T>(superset: T[], subset: T[], message?: string) => void
Asserts that subset isn’t included in superset in any order. Uses a deep equality check. Duplicates are ignored.
import { assert, test } from 'vitest'

test('assert.notIncludeDeepMembers', () => {
  assert.notIncludeDeepMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ b: 2 }, { f: 5 }], 'not include deep members')
})
includeOrderedMembers
Type: <T>(superset: T[], subset: T[], message?: string) => void
Asserts that subset is included in superset in the same order beginning with the first element in superset. Uses a strict equality check (===).
import { assert, test } from 'vitest'

test('assert.includeOrderedMembers', () => {
  assert.includeOrderedMembers([1, 2, 3], [1, 2], 'include ordered members')
})
notIncludeOrderedMembers
Type: <T>(superset: T[], subset: T[], message?: string) => void
Asserts that subset isn't included in superset in the same order beginning with the first element in superset. Uses a strict equality check (===).
import { assert, test } from 'vitest'

test('assert.notIncludeOrderedMembers', () => {
  assert.notIncludeOrderedMembers([1, 2, 3], [2, 1], 'not include ordered members')
  assert.notIncludeOrderedMembers([1, 2, 3], [2, 3], 'not include ordered members')
})
includeDeepOrderedMembers
Type: <T>(superset: T[], subset: T[], message?: string) => void
Asserts that subset is included in superset in the same order beginning with the first element in superset. Uses a deep equality check.
import { assert, test } from 'vitest'

test('assert.includeDeepOrderedMembers', () => {
  assert.includeDeepOrderedMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ a: 1 }, { b: 2 }], 'include deep ordered members')
})
notIncludeDeepOrderedMembers
Type: <T>(superset: T[], subset: T[], message?: string) => void
Asserts that subset isn’t included in superset in the same order beginning with the first element in superset. Uses a deep equality check.
import { assert, test } from 'vitest'

test('assert.includeDeepOrderedMembers', () => {
  assert.notIncludeDeepOrderedMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ a: 1 }, { f: 5 }], 'not include deep ordered members')
  assert.notIncludeDeepOrderedMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ b: 2 }, { a: 1 }], 'not include deep ordered members')
  assert.notIncludeDeepOrderedMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ b: 2 }, { c: 3 }], 'not include deep ordered members')
})
oneOf
Type: <T>(inList: T, list: T[], message?: string) => void
Asserts that non-object, non-array value inList appears in the flat array list.
import { assert, test } from 'vitest'

test('assert.oneOf', () => {
  assert.oneOf(1, [2, 1], 'Not found in list')
})
changes
Type: <T>(modifier: Function, object: T, property: string, message?: string) => void
Asserts that a modifier changes the object of a property.
import { assert, test } from 'vitest'

test('assert.changes', () => {
  const obj = { val: 10 }
  function fn() { obj.val = 22 };
  assert.changes(fn, obj, 'val')
})
changesBy
Type: <T>(modifier: Function, object: T, property: string, change: number, message?: string) => void
Asserts that a modifier changes the object of a property by a change.
import { assert, test } from 'vitest'

test('assert.changesBy', () => {
  const obj = { val: 10 }
  function fn() { obj.val += 2 };
  assert.changesBy(fn, obj, 'val', 2)
})
doesNotChange
Type: <T>(modifier: Function, object: T, property: string, message?: string) => void
Asserts that a modifier does not changes the object of a property.
import { assert, test } from 'vitest'

test('assert.doesNotChange', () => {
  const obj = { val: 10 }
  function fn() { obj.val += 2 };
  assert.doesNotChange(fn, obj, 'val', 2)
})
changesButNotBy
Type: <T>(modifier: Function, object: T, property: string, change:number, message?: string) => void
Asserts that a modifier does not change the object of a property or of a modifier return value by a change.
import { assert, test } from 'vitest'

test('assert.changesButNotBy', () => {
  const obj = { val: 10 }
  function fn() { obj.val += 10 };
  assert.changesButNotBy(fn, obj, 'val', 5)
})
increases
Type: <T>(modifier: Function, object: T, property: string, message?: string) => void
Asserts that a modifier increases a numeric object's property.
import { assert, test } from 'vitest'

test('assert.increases', () => {
  const obj = { val: 10 }
  function fn() { obj.val = 13 };
  assert.increases(fn, obj, 'val')
})
increasesBy
Type: <T>(modifier: Function, object: T, property: string, change: number, message?: string) => void
Asserts that a modifier increases a numeric object's property or a modifier return value by an change.
import { assert, test } from 'vitest'

test('assert.increasesBy', () => {
  const obj = { val: 10 }
  function fn() { obj.val += 10 };
  assert.increasesBy(fn, obj, 'val', 10)
})
doesNotIncrease
Type: <T>(modifier: Function, object: T, property: string, message?: string) => void
Asserts that a modifier does not increases a numeric object's property.
import { assert, test } from 'vitest'

test('assert.doesNotIncrease', () => {
  const obj = { val: 10 }
  function fn() { obj.val = 8 }
  assert.doesNotIncrease(fn, obj, 'val')
})
increasesButNotBy
Type: <T>(modifier: Function, object: T, property: string, change: number, message?: string) => void
Asserts that a modifier does not increases a numeric object's property or a modifier return value by an change.
import { assert, test } from 'vitest'

test('assert.increasesButNotBy', () => {
  const obj = { val: 10 }
  function fn() { obj.val += 15 };
  assert.increasesButNotBy(fn, obj, 'val', 10)
})
decreases
Type: <T>(modifier: Function, object: T, property: string, message?: string) => void
Asserts that a modifier decreases a numeric object's property.
import { assert, test } from 'vitest'

test('assert.decreases', () => {
  const obj = { val: 10 }
  function fn() { obj.val = 5 };
  assert.decreases(fn, obj, 'val')
})
decreasesBy
Type: <T>(modifier: Function, object: T, property: string, change: number, message?: string) => void
Asserts that a modifier decreases a numeric object's property or a modifier return value by a change.
import { assert, test } from 'vitest'

test('assert.decreasesBy', () => {
  const obj = { val: 10 }
  function fn() { obj.val -= 5 };
  assert.decreasesBy(fn, obj, 'val', 5)
})
doesNotDecrease
Type: <T>(modifier: Function, object: T, property: string, message?: string) => void
Asserts that a modifier dose not decrease a numeric object's property.
import { assert, test } from 'vitest'

test('assert.doesNotDecrease', () => {
  const obj = { val: 10 }
  function fn() { obj.val = 15 }
  assert.doesNotDecrease(fn, obj, 'val')
})
doesNotDecreaseBy
Type: <T>(modifier: Function, object: T, property: string, change: number, message?: string) => void
Asserts that a modifier does not decrease a numeric object's property or a modifier return value by a change.
import { assert, test } from 'vitest'

test('assert.doesNotDecreaseBy', () => {
  const obj = { val: 10 }
  function fn() { obj.val = 5 };
  assert.doesNotDecreaseBy(fn, obj, 'val', 1)
})
decreasesButNotBy
Type: <T>(modifier: Function, object: T, property: string, change: number, message?: string) => void
Asserts that a modifier does not decrease a numeric object's property or a modifier return value by a change.
import { assert, test } from 'vitest'

test('assert.decreasesButNotBy', () => {
  const obj = { val: 10 }
  function fn() { obj.val = 5 };
  assert.decreasesButNotBy(fn, obj, 'val', 1)
})
ifError
Type: <T>(object: T, message?: string) => void
Asserts if object is not a false value, and throws if it is a true value. This is added to allow for chai to be a drop-in replacement for Node’s assert class.
import { assert, test } from 'vitest'

test('assert.ifError', () => {
  const err = new Error('I am a custom error')
  assert.ifError(err) // Rethrows err!
})
isExtensible
Type: <T>(object: T, message?: string) => void
Alias: extensible
Asserts that object is extensible (can have new properties added to it).
import { assert, test } from 'vitest'

test('assert.isExtensible', () => {
  assert.isExtensible({})
})
isNotExtensible
Type: <T>(object: T, message?: string) => void
Alias: notExtensible
Asserts that object is not extensible (can not have new properties added to it).
import { assert, test } from 'vitest'

test('assert.isNotExtensible', () => {
  const nonExtensibleObject = Object.preventExtensions({})
  const sealedObject = Object.seal({})
  const frozenObject = Object.freeze({})

  assert.isNotExtensible(nonExtensibleObject)
  assert.isNotExtensible(sealedObject)
  assert.isNotExtensible(frozenObject)
})
isSealed
Type: <T>(object: T, message?: string) => void
Alias: sealed
Asserts that object is sealed (cannot have new properties added to it and its existing properties cannot be removed).
import { assert, test } from 'vitest'

test('assert.isSealed', () => {
  const sealedObject = Object.seal({})
  const frozenObject = Object.seal({})

  assert.isSealed(sealedObject)
  assert.isSealed(frozenObject)
})
isNotSealed
Type: <T>(object: T, message?: string) => void
Alias: notSealed
Asserts that object is not sealed (can have new properties added to it and its existing properties can be removed).
import { assert, test } from 'vitest'

test('assert.isNotSealed', () => {
  assert.isNotSealed({})
})
isFrozen
Type: <T>(object: T, message?: string) => void
Alias: frozen
Asserts that object is frozen (cannot have new properties added to it and its existing properties cannot be modified).
import { assert, test } from 'vitest'

test('assert.isFrozen', () => {
  const frozenObject = Object.freeze({})
  assert.frozen(frozenObject)
})
isNotFrozen
Type: <T>(object: T, message?: string) => void
Alias: notFrozen
Asserts that object is not frozen (can have new properties added to it and its existing properties can be modified).
import { assert, test } from 'vitest'

test('assert.isNotFrozen', () => {
  assert.isNotFrozen({})
})
isEmpty
Type: <T>(target: T, message?: string) => void
Alias: empty
Asserts that the target does not contain any values. For arrays and strings, it checks the length property. For Map and Set instances, it checks the size property. For non-function objects, it gets the count of its own enumerable string keys.
import { assert, test } from 'vitest'

test('assert.isEmpty', () => {
  assert.isEmpty([])
  assert.isEmpty('')
  assert.isEmpty(new Map())
  assert.isEmpty({})
})
isNotEmpty
Type: <T>(object: T, message?: string) => void
Alias: notEmpty
Asserts that the target contains values. For arrays and strings, it checks the length property. For Map and Set instances, it checks the size property. For non-function objects, it gets the count of its own enumerable string keys.
import { assert, test } from 'vitest'

test('assert.isNotEmpty', () => {
  assert.isNotEmpty([1, 2])
  assert.isNotEmpty('34')
  assert.isNotEmpty(new Set([5, 6]))
  assert.isNotEmpty({ key: 7 })
})
Suggest changes to this page
Last updated: 1/8/25, 7:21 AM
Pager
Previous page
ExpectTypeOf
Next page
AssertType
assertType
WARNING
During runtime this function doesn't do anything. To enable typechecking, don't forget to pass down --typecheck flag.
Type: <T>(value: T): void
You can use this function as an alternative for expectTypeOf to easily assert that the argument type is equal to the generic provided.
import { assertType } from 'vitest'

function concat(a: string, b: string): string
function concat(a: number, b: number): number
function concat(a: string | number, b: string | number): string | number

assertType<string>(concat('a', 'b'))
assertType<number>(concat(1, 2))
// @ts-expect-error wrong types
assertType(concat('a', 2))
Suggest changes to this page
Last updated: 11/22/23, 6:01 AM
Pager
Previous page
Assert
Next page
CLI
Command Line Interface
Commands
vitest
Start Vitest in the current directory. Will enter the watch mode in development environment and run mode in CI (or non-interactive terminal) automatically.
You can pass an additional argument as the filter of the test files to run. For example:
vitest foobar
Will run only the test file that contains foobar in their paths. This filter only checks inclusion and doesn't support regexp or glob patterns (unless your terminal processes it before Vitest receives the filter).
Since Vitest 3, you can also specify the test by filename and line number:
$ vitest basic/foo.test.ts:10
WARNING
Note that Vitest requires the full filename for this feature to work. It can be relative to the current working directory or an absolute file path.
$ vitest basic/foo.js:10 # ✅
$ vitest ./basic/foo.js:10 # ✅
$ vitest /users/project/basic/foo.js:10 # ✅
$ vitest foo:10 # ❌
$ vitest ./basic/foo:10 # ❌
At the moment Vitest also doesn't support ranges:
$ vitest basic/foo.test.ts:10, basic/foo.test.ts:25 # ✅
$ vitest basic/foo.test.ts:10-25 # ❌
vitest run
Perform a single run without watch mode.
vitest watch
Run all test suites but watch for changes and rerun tests when they change. Same as calling vitest without an argument. Will fallback to vitest run in CI or when stdin is not a TTY (non-interactive environment).
vitest dev
Alias to vitest watch.
vitest related
Run only tests that cover a list of source files. Works with static imports (e.g., import('./index.js') or import index from './index.js), but not the dynamic ones (e.g., import(filepath)). All files should be relative to root folder.
Useful to run with lint-staged or with your CI setup.
vitest related /src/index.ts /src/hello-world.js
TIP
Don't forget that Vitest runs with enabled watch mode by default. If you are using tools like lint-staged, you should also pass --run option, so that command can exit normally.
.lintstagedrc.js
export default {
  '*.{js,ts}': 'vitest related --run',
}
vitest bench
Run only benchmark tests, which compare performance results.
vitest init
vitest init <name> can be used to setup project configuration. At the moment, it only supports browser value:
vitest init browser
vitest list
vitest list command inherits all vitest options to print the list of all matching tests. This command ignores reporters option. By default, it will print the names of all tests that matched the file filter and name pattern:
vitest list filename.spec.ts -t="some-test"
describe > some-test
describe > some-test > test 1
describe > some-test > test 2
You can pass down --json flag to print tests in JSON format or save it in a separate file:
vitest list filename.spec.ts -t="some-test" --json=./file.json
If --json flag doesn't receive a value, it will output the JSON into stdout.
You also can pass down --filesOnly flag to print the test files only:
vitest list --filesOnly
tests/test1.test.ts
tests/test2.test.ts
Options
TIP
Vitest supports both camel case and kebab case for CLI arguments. For example, --passWithNoTests and --pass-with-no-tests will both work (--no-color and --inspect-brk are the exceptions).
Vitest also supports different ways of specifying the value: --reporter dot and --reporter=dot are both valid.
If option supports an array of values, you need to pass the option multiple times:
vitest --reporter=dot --reporter=default
Boolean options can be negated with no- prefix. Specifying the value as false also works:
vitest --no-api
vitest --api=false
root
CLI: -r, --root <path>
Config: root
Root path
config
CLI: -c, --config <path>
Path to config file
update
CLI: -u, --update
Config: update
Update snapshot
watch
CLI: -w, --watch
Config: watch
Enable watch mode
testNamePattern
CLI: -t, --testNamePattern <pattern>
Config: testNamePattern
Run tests with full names matching the specified regexp pattern
dir
CLI: --dir <path>
Config: dir
Base directory to scan for the test files
ui
CLI: --ui
Config: ui
Enable UI
open
CLI: --open
Config: open
Open UI automatically (default: !process.env.CI)
api.port
CLI: --api.port [port]
Specify server port. Note if the port is already being used, Vite will automatically try the next available port so this may not be the actual port the server ends up listening on. If true will be set to 51204
api.host
CLI: --api.host [host]
Specify which IP addresses the server should listen on. Set this to 0.0.0.0 or true to listen on all addresses, including LAN and public addresses
api.strictPort
CLI: --api.strictPort
Set to true to exit if port is already in use, instead of automatically trying the next available port
silent
CLI: --silent [value]
Config: silent
Silent console output from tests. Use 'passed-only' to see logs from failing tests only.
hideSkippedTests
CLI: --hideSkippedTests
Hide logs for skipped tests
reporters
CLI: --reporter <name>
Config: reporters
Specify reporters (default, basic, blob, verbose, dot, json, tap, tap-flat, junit, hanging-process, github-actions)
outputFile
CLI: --outputFile <filename/-s>
Config: outputFile
Write test results to a file when supporter reporter is also specified, use cac's dot notation for individual outputs of multiple reporters (example: --outputFile.tap=./tap.txt)
coverage.all
CLI: --coverage.all
Config: coverage.all
Whether to include all files, including the untested ones into report
coverage.provider
CLI: --coverage.provider <name>
Config: coverage.provider
Select the tool for coverage collection, available values are: "v8", "istanbul" and "custom"
coverage.enabled
CLI: --coverage.enabled
Config: coverage.enabled
Enables coverage collection. Can be overridden using the --coverage CLI option (default: false)
coverage.include
CLI: --coverage.include <pattern>
Config: coverage.include
Files included in coverage as glob patterns. May be specified more than once when using multiple patterns (default: **)
coverage.exclude
CLI: --coverage.exclude <pattern>
Config: coverage.exclude
Files to be excluded in coverage. May be specified more than once when using multiple extensions (default: Visit coverage.exclude)
coverage.extension
CLI: --coverage.extension <extension>
Config: coverage.extension
Extension to be included in coverage. May be specified more than once when using multiple extensions (default: [".js", ".cjs", ".mjs", ".ts", ".mts", ".tsx", ".jsx", ".vue", ".svelte"])
coverage.clean
CLI: --coverage.clean
Config: coverage.clean
Clean coverage results before running tests (default: true)
coverage.cleanOnRerun
CLI: --coverage.cleanOnRerun
Config: coverage.cleanOnRerun
Clean coverage report on watch rerun (default: true)
coverage.reportsDirectory
CLI: --coverage.reportsDirectory <path>
Config: coverage.reportsDirectory
Directory to write coverage report to (default: ./coverage)
coverage.reporter
CLI: --coverage.reporter <name>
Config: coverage.reporter
Coverage reporters to use. Visit coverage.reporter for more information (default: ["text", "html", "clover", "json"])
coverage.reportOnFailure
CLI: --coverage.reportOnFailure
Config: coverage.reportOnFailure
Generate coverage report even when tests fail (default: false)
coverage.allowExternal
CLI: --coverage.allowExternal
Config: coverage.allowExternal
Collect coverage of files outside the project root (default: false)
coverage.skipFull
CLI: --coverage.skipFull
Config: coverage.skipFull
Do not show files with 100% statement, branch, and function coverage (default: false)
coverage.thresholds.100
CLI: --coverage.thresholds.100
Config: coverage.thresholds.100
Shortcut to set all coverage thresholds to 100 (default: false)
coverage.thresholds.perFile
CLI: --coverage.thresholds.perFile
Config: coverage.thresholds.perFile
Check thresholds per file. See --coverage.thresholds.lines, --coverage.thresholds.functions, --coverage.thresholds.branches and --coverage.thresholds.statements for the actual thresholds (default: false)
coverage.thresholds.autoUpdate
CLI: --coverage.thresholds.autoUpdate
Config: coverage.thresholds.autoUpdate
Update threshold values: "lines", "functions", "branches" and "statements" to configuration file when current coverage is above the configured thresholds (default: false)
coverage.thresholds.lines
CLI: --coverage.thresholds.lines <number>
Threshold for lines. Visit istanbuljs for more information. This option is not available for custom providers
coverage.thresholds.functions
CLI: --coverage.thresholds.functions <number>
Threshold for functions. Visit istanbuljs for more information. This option is not available for custom providers
coverage.thresholds.branches
CLI: --coverage.thresholds.branches <number>
Threshold for branches. Visit istanbuljs for more information. This option is not available for custom providers
coverage.thresholds.statements
CLI: --coverage.thresholds.statements <number>
Threshold for statements. Visit istanbuljs for more information. This option is not available for custom providers
coverage.ignoreClassMethods
CLI: --coverage.ignoreClassMethods <name>
Config: coverage.ignoreClassMethods
Array of class method names to ignore for coverage. Visit istanbuljs for more information. This option is only available for the istanbul providers (default: [])
coverage.processingConcurrency
CLI: --coverage.processingConcurrency <number>
Config: coverage.processingConcurrency
Concurrency limit used when processing the coverage results. (default min between 20 and the number of CPUs)
coverage.customProviderModule
CLI: --coverage.customProviderModule <path>
Config: coverage.customProviderModule
Specifies the module name or path for the custom coverage provider module. Visit Custom Coverage Provider for more information. This option is only available for custom providers
coverage.watermarks.statements
CLI: --coverage.watermarks.statements <watermarks>
High and low watermarks for statements in the format of <high>,<low>
coverage.watermarks.lines
CLI: --coverage.watermarks.lines <watermarks>
High and low watermarks for lines in the format of <high>,<low>
coverage.watermarks.branches
CLI: --coverage.watermarks.branches <watermarks>
High and low watermarks for branches in the format of <high>,<low>
coverage.watermarks.functions
CLI: --coverage.watermarks.functions <watermarks>
High and low watermarks for functions in the format of <high>,<low>
mode
CLI: --mode <name>
Config: mode
Override Vite mode (default: test or benchmark)
workspace
CLI: --workspace <path>
Config: workspace
[deprecated] Path to a workspace configuration file
isolate
CLI: --isolate
Config: isolate
Run every test file in isolation. To disable isolation, use --no-isolate (default: true)
globals
CLI: --globals
Config: globals
Inject apis globally
dom
CLI: --dom
Mock browser API with happy-dom
browser.enabled
CLI: --browser.enabled
Config: browser.enabled
Run tests in the browser. Equivalent to --browser.enabled (default: false)
browser.name
CLI: --browser.name <name>
Config: browser.name
Run all tests in a specific browser. Some browsers are only available for specific providers (see --browser.provider). Visit browser.name for more information
browser.headless
CLI: --browser.headless
Config: browser.headless
Run the browser in headless mode (i.e. without opening the GUI (Graphical User Interface)). If you are running Vitest in CI, it will be enabled by default (default: process.env.CI)
browser.api.port
CLI: --browser.api.port [port]
Config: browser.api.port
Specify server port. Note if the port is already being used, Vite will automatically try the next available port so this may not be the actual port the server ends up listening on. If true will be set to 63315
browser.api.host
CLI: --browser.api.host [host]
Config: browser.api.host
Specify which IP addresses the server should listen on. Set this to 0.0.0.0 or true to listen on all addresses, including LAN and public addresses
browser.api.strictPort
CLI: --browser.api.strictPort
Config: browser.api.strictPort
Set to true to exit if port is already in use, instead of automatically trying the next available port
browser.provider
CLI: --browser.provider <name>
Config: browser.provider
Provider used to run browser tests. Some browsers are only available for specific providers. Can be "webdriverio", "playwright", "preview", or the path to a custom provider. Visit browser.provider for more information (default: "preview")
browser.providerOptions
CLI: --browser.providerOptions <options>
Config: browser.providerOptions
Options that are passed down to a browser provider. Visit browser.providerOptions for more information
browser.isolate
CLI: --browser.isolate
Config: browser.isolate
Run every browser test file in isolation. To disable isolation, use --browser.isolate=false (default: true)
browser.ui
CLI: --browser.ui
Config: browser.ui
Show Vitest UI when running tests (default: !process.env.CI)
browser.fileParallelism
CLI: --browser.fileParallelism
Config: browser.fileParallelism
Should browser test files run in parallel. Use --browser.fileParallelism=false to disable (default: true)
browser.connectTimeout
CLI: --browser.connectTimeout <timeout>
Config: browser.connectTimeout
If connection to the browser takes longer, the test suite will fail (default: 60_000)
pool
CLI: --pool <pool>
Config: pool
Specify pool, if not running in the browser (default: forks)
poolOptions.threads.isolate
CLI: --poolOptions.threads.isolate
Config: poolOptions.threads.isolate
Isolate tests in threads pool (default: true)
poolOptions.threads.singleThread
CLI: --poolOptions.threads.singleThread
Config: poolOptions.threads.singleThread
Run tests inside a single thread (default: false)
poolOptions.threads.maxThreads
CLI: --poolOptions.threads.maxThreads <workers>
Config: poolOptions.threads.maxThreads
Maximum number or percentage of threads to run tests in
poolOptions.threads.minThreads
CLI: --poolOptions.threads.minThreads <workers>
Config: poolOptions.threads.minThreads
Minimum number or percentage of threads to run tests in
poolOptions.threads.useAtomics
CLI: --poolOptions.threads.useAtomics
Config: poolOptions.threads.useAtomics
Use Atomics to synchronize threads. This can improve performance in some cases, but might cause segfault in older Node versions (default: false)
poolOptions.vmThreads.isolate
CLI: --poolOptions.vmThreads.isolate
Config: poolOptions.vmThreads.isolate
Isolate tests in threads pool (default: true)
poolOptions.vmThreads.singleThread
CLI: --poolOptions.vmThreads.singleThread
Config: poolOptions.vmThreads.singleThread
Run tests inside a single thread (default: false)
poolOptions.vmThreads.maxThreads
CLI: --poolOptions.vmThreads.maxThreads <workers>
Config: poolOptions.vmThreads.maxThreads
Maximum number or percentage of threads to run tests in
poolOptions.vmThreads.minThreads
CLI: --poolOptions.vmThreads.minThreads <workers>
Config: poolOptions.vmThreads.minThreads
Minimum number or percentage of threads to run tests in
poolOptions.vmThreads.useAtomics
CLI: --poolOptions.vmThreads.useAtomics
Config: poolOptions.vmThreads.useAtomics
Use Atomics to synchronize threads. This can improve performance in some cases, but might cause segfault in older Node versions (default: false)
poolOptions.vmThreads.memoryLimit
CLI: --poolOptions.vmThreads.memoryLimit <limit>
Config: poolOptions.vmThreads.memoryLimit
Memory limit for VM threads pool. If you see memory leaks, try to tinker this value.
poolOptions.forks.isolate
CLI: --poolOptions.forks.isolate
Config: poolOptions.forks.isolate
Isolate tests in forks pool (default: true)
poolOptions.forks.singleFork
CLI: --poolOptions.forks.singleFork
Config: poolOptions.forks.singleFork
Run tests inside a single child_process (default: false)
poolOptions.forks.maxForks
CLI: --poolOptions.forks.maxForks <workers>
Config: poolOptions.forks.maxForks
Maximum number or percentage of processes to run tests in
poolOptions.forks.minForks
CLI: --poolOptions.forks.minForks <workers>
Config: poolOptions.forks.minForks
Minimum number or percentage of processes to run tests in
poolOptions.vmForks.isolate
CLI: --poolOptions.vmForks.isolate
Config: poolOptions.vmForks.isolate
Isolate tests in forks pool (default: true)
poolOptions.vmForks.singleFork
CLI: --poolOptions.vmForks.singleFork
Config: poolOptions.vmForks.singleFork
Run tests inside a single child_process (default: false)
poolOptions.vmForks.maxForks
CLI: --poolOptions.vmForks.maxForks <workers>
Config: poolOptions.vmForks.maxForks
Maximum number or percentage of processes to run tests in
poolOptions.vmForks.minForks
CLI: --poolOptions.vmForks.minForks <workers>
Config: poolOptions.vmForks.minForks
Minimum number or percentage of processes to run tests in
poolOptions.vmForks.memoryLimit
CLI: --poolOptions.vmForks.memoryLimit <limit>
Config: poolOptions.vmForks.memoryLimit
Memory limit for VM forks pool. If you see memory leaks, try to tinker this value.
fileParallelism
CLI: --fileParallelism
Config: fileParallelism
Should all test files run in parallel. Use --no-file-parallelism to disable (default: true)
maxWorkers
CLI: --maxWorkers <workers>
Config: maxWorkers
Maximum number or percentage of workers to run tests in
minWorkers
CLI: --minWorkers <workers>
Config: minWorkers
Minimum number or percentage of workers to run tests in
environment
CLI: --environment <name>
Config: environment
Specify runner environment, if not running in the browser (default: node)
passWithNoTests
CLI: --passWithNoTests
Config: passWithNoTests
Pass when no tests are found
logHeapUsage
CLI: --logHeapUsage
Config: logHeapUsage
Show the size of heap for each test when running in node
allowOnly
CLI: --allowOnly
Config: allowOnly
Allow tests and suites that are marked as only (default: !process.env.CI)
dangerouslyIgnoreUnhandledErrors
CLI: --dangerouslyIgnoreUnhandledErrors
Config: dangerouslyIgnoreUnhandledErrors
Ignore any unhandled errors that occur
sequence.shuffle.files
CLI: --sequence.shuffle.files
Config: sequence.shuffle.files
Run files in a random order. Long running tests will not start earlier if you enable this option. (default: false)
sequence.shuffle.tests
CLI: --sequence.shuffle.tests
Config: sequence.shuffle.tests
Run tests in a random order (default: false)
sequence.concurrent
CLI: --sequence.concurrent
Config: sequence.concurrent
Make tests run in parallel (default: false)
sequence.seed
CLI: --sequence.seed <seed>
Config: sequence.seed
Set the randomization seed. This option will have no effect if --sequence.shuffle is falsy. Visit "Random Seed" page for more information
sequence.hooks
CLI: --sequence.hooks <order>
Config: sequence.hooks
Changes the order in which hooks are executed. Accepted values are: "stack", "list" and "parallel". Visit sequence.hooks for more information (default: "parallel")
sequence.setupFiles
CLI: --sequence.setupFiles <order>
Config: sequence.setupFiles
Changes the order in which setup files are executed. Accepted values are: "list" and "parallel". If set to "list", will run setup files in the order they are defined. If set to "parallel", will run setup files in parallel (default: "parallel")
inspect
CLI: --inspect [[host:]port]
Config: inspect
Enable Node.js inspector (default: 127.0.0.1:9229)
inspectBrk
CLI: --inspectBrk [[host:]port]
Config: inspectBrk
Enable Node.js inspector and break before the test starts
testTimeout
CLI: --testTimeout <timeout>
Config: testTimeout
Default timeout of a test in milliseconds (default: 5000). Use 0 to disable timeout completely.
hookTimeout
CLI: --hookTimeout <timeout>
Config: hookTimeout
Default hook timeout in milliseconds (default: 10000). Use 0 to disable timeout completely.
bail
CLI: --bail <number>
Config: bail
Stop test execution when given number of tests have failed (default: 0)
retry
CLI: --retry <times>
Config: retry
Retry the test specific number of times if it fails (default: 0)
diff.aAnnotation
CLI: --diff.aAnnotation <annotation>
Config: diff.aAnnotation
Annotation for expected lines (default: Expected)
diff.aIndicator
CLI: --diff.aIndicator <indicator>
Config: diff.aIndicator
Indicator for expected lines (default: -)
diff.bAnnotation
CLI: --diff.bAnnotation <annotation>
Config: diff.bAnnotation
Annotation for received lines (default: Received)
diff.bIndicator
CLI: --diff.bIndicator <indicator>
Config: diff.bIndicator
Indicator for received lines (default: +)
diff.commonIndicator
CLI: --diff.commonIndicator <indicator>
Config: diff.commonIndicator
Indicator for common lines (default: )
diff.contextLines
CLI: --diff.contextLines <lines>
Config: diff.contextLines
Number of lines of context to show around each change (default: 5)
diff.emptyFirstOrLastLinePlaceholder
CLI: --diff.emptyFirstOrLastLinePlaceholder <placeholder>
Config: diff.emptyFirstOrLastLinePlaceholder
Placeholder for an empty first or last line (default: "")
diff.expand
CLI: --diff.expand
Config: diff.expand
Expand all common lines (default: true)
diff.includeChangeCounts
CLI: --diff.includeChangeCounts
Config: diff.includeChangeCounts
Include comparison counts in diff output (default: false)
diff.omitAnnotationLines
CLI: --diff.omitAnnotationLines
Config: diff.omitAnnotationLines
Omit annotation lines from the output (default: false)
diff.printBasicPrototype
CLI: --diff.printBasicPrototype
Config: diff.printBasicPrototype
Print basic prototype Object and Array (default: true)
diff.maxDepth
CLI: --diff.maxDepth <maxDepth>
Config: diff.maxDepth
Limit the depth to recurse when printing nested objects (default: 20)
diff.truncateThreshold
CLI: --diff.truncateThreshold <threshold>
Config: diff.truncateThreshold
Number of lines to show before and after each change (default: 0)
diff.truncateAnnotation
CLI: --diff.truncateAnnotation <annotation>
Config: diff.truncateAnnotation
Annotation for truncated lines (default: ... Diff result is truncated)
exclude
CLI: --exclude <glob>
Config: exclude
Additional file globs to be excluded from test
expandSnapshotDiff
CLI: --expandSnapshotDiff
Config: expandSnapshotDiff
Show full diff when snapshot fails
disableConsoleIntercept
CLI: --disableConsoleIntercept
Config: disableConsoleIntercept
Disable automatic interception of console logging (default: false)
typecheck.enabled
CLI: --typecheck.enabled
Config: typecheck.enabled
Enable typechecking alongside tests (default: false)
typecheck.only
CLI: --typecheck.only
Config: typecheck.only
Run only typecheck tests. This automatically enables typecheck (default: false)
typecheck.checker
CLI: --typecheck.checker <name>
Config: typecheck.checker
Specify the typechecker to use. Available values are: "tsc" and "vue-tsc" and a path to an executable (default: "tsc")
typecheck.allowJs
CLI: --typecheck.allowJs
Config: typecheck.allowJs
Allow JavaScript files to be typechecked. By default takes the value from tsconfig.json
typecheck.ignoreSourceErrors
CLI: --typecheck.ignoreSourceErrors
Config: typecheck.ignoreSourceErrors
Ignore type errors from source files
typecheck.tsconfig
CLI: --typecheck.tsconfig <path>
Config: typecheck.tsconfig
Path to a custom tsconfig file
typecheck.spawnTimeout
CLI: --typecheck.spawnTimeout <time>
Config: typecheck.spawnTimeout
Minimum time in milliseconds it takes to spawn the typechecker
project
CLI: --project <name>
Config: project
The name of the project to run if you are using Vitest workspace feature. This can be repeated for multiple projects: --project=1 --project=2. You can also filter projects using wildcards like --project=packages*, and exclude projects with --project=!pattern.
slowTestThreshold
CLI: --slowTestThreshold <threshold>
Config: slowTestThreshold
Threshold in milliseconds for a test or suite to be considered slow (default: 300)
teardownTimeout
CLI: --teardownTimeout <timeout>
Config: teardownTimeout
Default timeout of a teardown function in milliseconds (default: 10000)
maxConcurrency
CLI: --maxConcurrency <number>
Config: maxConcurrency
Maximum number of concurrent tests in a suite (default: 5)
expect.requireAssertions
CLI: --expect.requireAssertions
Config: expect.requireAssertions
Require that all tests have at least one assertion
expect.poll.interval
CLI: --expect.poll.interval <interval>
Config: expect.poll.interval
Poll interval in milliseconds for expect.poll() assertions (default: 50)
expect.poll.timeout
CLI: --expect.poll.timeout <timeout>
Config: expect.poll.timeout
Poll timeout in milliseconds for expect.poll() assertions (default: 1000)
printConsoleTrace
CLI: --printConsoleTrace
Config: printConsoleTrace
Always print console stack traces
includeTaskLocation
CLI: --includeTaskLocation
Config: includeTaskLocation
Collect test and suite locations in the location property
attachmentsDir
CLI: --attachmentsDir <dir>
Config: attachmentsDir
The directory where attachments from context.annotate are stored in (default: .vitest-attachments)
run
CLI: --run
Disable watch mode
color
CLI: --no-color
Removes colors from the console output
clearScreen
CLI: --clearScreen
Clear terminal screen when re-running tests during watch mode (default: true)
configLoader
CLI: --configLoader <loader>
Use bundle to bundle the config with esbuild or runner (experimental) to process it on the fly. This is only available in vite version 6.1.0 and above. (default: bundle)
standalone
CLI: --standalone
Start Vitest without running tests. File filters will be ignored, tests will be running only on change (default: false)
changed
Type: boolean | string
Default: false
Run tests only against changed files. If no value is provided, it will run tests against uncommitted changes (including staged and unstaged).
To run tests against changes made in the last commit, you can use --changed HEAD~1. You can also pass commit hash (e.g. --changed 09a9920) or branch name (e.g. --changed origin/develop).
When used with code coverage the report will contain only the files that were related to the changes.
If paired with the forceRerunTriggers config option it will run the whole test suite if at least one of the files listed in the forceRerunTriggers list changes. By default, changes to the Vitest config file and package.json will always rerun the whole suite.
shard
Type: string
Default: disabled
Test suite shard to execute in a format of <index>/<count>, where
count is a positive integer, count of divided parts
index is a positive integer, index of divided part
This command will divide all tests into count equal parts, and will run only those that happen to be in an index part. For example, to split your tests suite into three parts, use this:
vitest run --shard=1/3
vitest run --shard=2/3
vitest run --shard=3/3
WARNING
You cannot use this option with --watch enabled (enabled in dev by default).
TIP
If --reporter=blob is used without an output file, the default path will include the current shard config to avoid collisions with other Vitest processes.
merge-reports
Type: boolean | string
Merges every blob report located in the specified folder (.vitest-reports by default). You can use any reporters with this command (except blob):
vitest --merge-reports --reporter=junit
Suggest changes to this page
Last updated: 4/17/25, 5:17 AM
Pager
Previous page
AssertType
Next page
Test Filtering
Test Filtering
Filtering, timeouts, concurrent for suite and tests
CLI
You can use CLI to filter test files by name:
$ vitest basic
Will only execute test files that contain basic, e.g.
basic.test.ts
basic-foo.test.ts
basic/foo.test.ts
You can also use the -t, --testNamePattern <pattern> option to filter tests by full name. This can be helpful when you want to filter by the name defined within a file rather than the filename itself.
Since Vitest 3, you can also specify the test by filename and line number:
$ vitest basic/foo.test.ts:10
WARNING
Note that Vitest requires the full filename for this feature to work. It can be relative to the current working directory or an absolute file path.
$ vitest basic/foo.js:10 # ✅
$ vitest ./basic/foo.js:10 # ✅
$ vitest /users/project/basic/foo.js:10 # ✅
$ vitest foo:10 # ❌
$ vitest ./basic/foo:10 # ❌
At the moment Vitest also doesn't support ranges:
$ vitest basic/foo.test.ts:10, basic/foo.test.ts:25 # ✅
$ vitest basic/foo.test.ts:10-25 # ❌
Specifying a Timeout
You can optionally pass a timeout in milliseconds as a third argument to tests. The default is 5 seconds.
import { test } from 'vitest'

test('name', async () => { /* ... */ }, 1000)
Hooks also can receive a timeout, with the same 5 seconds default.
import { beforeAll } from 'vitest'

beforeAll(async () => { /* ... */ }, 1000)
Skipping Suites and Tests
Use .skip to avoid running certain suites or tests
import { assert, describe, it } from 'vitest'

describe.skip('skipped suite', () => {
  it('test', () => {
    // Suite skipped, no error
    assert.equal(Math.sqrt(4), 3)
  })
})

describe('suite', () => {
  it.skip('skipped test', () => {
    // Test skipped, no error
    assert.equal(Math.sqrt(4), 3)
  })
})
Selecting Suites and Tests to Run
Use .only to only run certain suites or tests
import { assert, describe, it } from 'vitest'

// Only this suite (and others marked with only) are run
describe.only('suite', () => {
  it('test', () => {
    assert.equal(Math.sqrt(4), 3)
  })
})

describe('another suite', () => {
  it('skipped test', () => {
    // Test skipped, as tests are running in Only mode
    assert.equal(Math.sqrt(4), 3)
  })

  it.only('test', () => {
    // Only this test (and others marked with only) are run
    assert.equal(Math.sqrt(4), 2)
  })
})
Unimplemented Suites and Tests
Use .todo to stub suites and tests that should be implemented
import { describe, it } from 'vitest'

// An entry will be shown in the report for this suite
describe.todo('unimplemented suite')

// An entry will be shown in the report for this test
describe('suite', () => {
  it.todo('unimplemented test')
})
Suggest changes to this page
Last updated: 12/10/24, 4:12 AM
Pager
Previous page
CLI
Next page
Test Projects
Test Projects
Sample Project
GitHub - Play Online
WARNING
This feature is also known as a workspace. The workspace is deprecated since 3.2 and replaced with the projects configuration. They are functionally the same.
Vitest provides a way to define multiple project configurations within a single Vitest process. This feature is particularly useful for monorepo setups but can also be used to run tests with different configurations, such as resolve.alias, plugins, or test.browser and more.
Defining Projects
You can define projects in your root config:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*'],
  },
})
Project configurations are inlined configs, files, or glob patterns referencing your projects. For example, if you have a folder named packages that contains your projects, you can define an array in your root Vitest config:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*'],
  },
})
Vitest will treat every folder in packages as a separate project even if it doesn't have a config file inside. If this glob pattern matches any file, it will be considered a Vitest config even if it doesn't have a vitest in its name or has an obscure file extension.
WARNING
Vitest does not treat the root vitest.config file as a project unless it is explicitly specified in the configuration. Consequently, the root configuration will only influence global options such as reporters and coverage. Note that Vitest will always run certain plugin hooks, like apply, config, configResolved or configureServer, specified in the root config file. Vitest also uses the same plugins to execute global setups and custom coverage provider.
You can also reference projects with their config files:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.{e2e,unit}.ts'],
  },
})
This pattern will only include projects with a vitest.config file that contains e2e or unit before the extension.
You can also define projects using inline configuration. The configuration supports both syntaxes simultaneously.
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      // matches every folder and file inside the `packages` folder
      'packages/*',
      {
        // add "extends: true" to inherit the options from the root config
        extends: true,
        test: {
          include: ['tests/**/*.{browser}.test.{ts,js}'],
          // it is recommended to define a name when using inline configs
          name: 'happy-dom',
          environment: 'happy-dom',
        }
      },
      {
        test: {
          include: ['tests/**/*.{node}.test.{ts,js}'],
          // color of the name label can be changed
          name: { label: 'node', color: 'green' },
          environment: 'node',
        }
      }
    ]
  }
})
WARNING
All projects must have unique names; otherwise, Vitest will throw an error. If a name is not provided in the inline configuration, Vitest will assign a number. For project configurations defined with glob syntax, Vitest will default to using the "name" property in the nearest package.json file or, if none exists, the folder name.
Projects do not support all configuration properties. For better type safety, use the defineProject method instead of defineConfig within project configuration files:
packages/a/vitest.config.ts
import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    environment: 'jsdom',
    // "reporters" is not supported in a project config,
    // so it will show an error
    reporters: ['json']
No overload matches this call.
  The last overload gave the following error.
    Object literal may only specify known properties, and 'reporters' does not exist in type 'ProjectConfig'.
 }
})
Running Tests
To run tests, define a script in your root package.json:
package.json
{
  "scripts": {
    "test": "vitest"
  }
}
Now tests can be run using your package manager:
npm
yarn
pnpm
bun
npm run test
If you need to run tests only inside a single project, use the --project CLI option:
npm
yarn
pnpm
bun
npm run test --project e2e
TIP
CLI option --project can be used multiple times to filter out several projects:
npm
yarn
pnpm
bun
npm run test --project e2e --project unit
Configuration
None of the configuration options are inherited from the root-level config file. You can create a shared config file and merge it with the project config yourself:
packages/a/vitest.config.ts
import { defineProject, mergeConfig } from 'vitest/config'
import configShared from '../vitest.shared.js'

export default mergeConfig(
  configShared,
  defineProject({
    test: {
      environment: 'jsdom',
    }
  })
)
Additionally, you can use the extends option to inherit from your root-level configuration. All options will be merged.
vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    pool: 'threads',
    projects: [
      {
        // will inherit options from this config like plugins and pool
        extends: true,
        test: {
          name: 'unit',
          include: ['**/*.unit.test.ts'],
        },
      },
      {
        // won't inherit any options from this config
        // this is the default behaviour
        extends: false,
        test: {
          name: 'integration',
          include: ['**/*.integration.test.ts'],
        },
      },
    ],
  },
})
Unsupported Options
Some of the configuration options are not allowed in a project config. Most notably:
coverage: coverage is done for the whole process
reporters: only root-level reporters can be supported
resolveSnapshotPath: only root-level resolver is respected
all other options that don't affect test runners
All configuration options that are not supported inside a project configuration are marked with a * sign in the "Config" guide. They have to be defined once in the root config file.
Suggest changes to this page
Last updated: 6/10/25, 10:26 AM
Pager
Previous page
Test Filtering
Next page
Reporters
Reporters
Vitest provides several built-in reporters to display test output in different formats, as well as the ability to use custom reporters. You can select different reporters either by using the --reporter command line option, or by including a reporters property in your configuration file. If no reporter is specified, Vitest will use the default reporter as described below.
Using reporters via command line:
npx vitest --reporter=verbose
Using reporters via vitest.config.ts:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['verbose']
  },
})
Some reporters can be customized by passing additional options to them. Reporter specific options are described in sections below.
export default defineConfig({
  test: {
    reporters: [
      'default',
      ['junit', { suiteName: 'UI tests' }]
    ],
  },
})
Reporter Output
By default, Vitest's reporters will print their output to the terminal. When using the json, html or junit reporters, you can instead write your tests' output to a file by including an outputFile configuration option either in your Vite configuration file or via CLI.
CLI
vitest.config.ts
npx vitest --reporter=json --outputFile=./test-output.json
Combining Reporters
You can use multiple reporters simultaneously to print your test results in different formats. For example:
npx vitest --reporter=json --reporter=default
export default defineConfig({
  test: {
    reporters: ['json', 'default'],
    outputFile: './test-output.json'
  },
})
The above example will both print the test results to the terminal in the default style and write them as JSON to the designated output file.
When using multiple reporters, it's also possible to designate multiple output files, as follows:
export default defineConfig({
  test: {
    reporters: ['junit', 'json', 'verbose'],
    outputFile: {
      junit: './junit-report.xml',
      json: './json-report.json',
    },
  },
})
This example will write separate JSON and XML reports as well as printing a verbose report to the terminal.
Built-in Reporters
Default Reporter
By default (i.e. if no reporter is specified), Vitest will display summary of running tests and their status at the bottom. Once a suite passes, its status will be reported on top of the summary.
You can disable the summary by configuring the reporter:
vitest.config.ts
export default defineConfig({
  test: {
    reporters: [
      ['default', { summary: false }]
    ]
  },
})
Example output for tests in progress:
✓ test/example-1.test.ts (5 tests | 1 skipped) 306ms
 ✓ test/example-2.test.ts (5 tests | 1 skipped) 307ms

 ❯ test/example-3.test.ts 3/5
 ❯ test/example-4.test.ts 1/5

 Test Files 2 passed (4)
      Tests 10 passed | 3 skipped (65)
   Start at 11:01:36
   Duration 2.00s
Final output after tests have finished:
✓ test/example-1.test.ts (5 tests | 1 skipped) 306ms
 ✓ test/example-2.test.ts (5 tests | 1 skipped) 307ms
 ✓ test/example-3.test.ts (5 tests | 1 skipped) 307ms
 ✓ test/example-4.test.ts (5 tests | 1 skipped) 307ms

 Test Files  4 passed (4)
      Tests  16 passed | 4 skipped (20)
   Start at  12:34:32
   Duration  1.26s (transform 35ms, setup 1ms, collect 90ms, tests 1.47s, environment 0ms, prepare 267ms)
Basic Reporter
The basic reporter is equivalent to default reporter without summary.
CLI
vitest.config.ts
npx vitest --reporter=basic
Example output using basic reporter:
✓ __tests__/file1.test.ts (2) 725ms
✓ __tests__/file2.test.ts (2) 746ms

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  12:34:32
   Duration  1.26s (transform 35ms, setup 1ms, collect 90ms, tests 1.47s, environment 0ms, prepare 267ms)
Verbose Reporter
Verbose reporter is same as default reporter, but it also displays each individual test after the suite has finished. It also displays currently running tests that are taking longer than slowTestThreshold. Similar to default reporter, you can disable the summary by configuring the reporter.
CLI
vitest.config.ts
npx vitest --reporter=verbose
Example output for tests in progress with default slowTestThreshold: 300:
✓ __tests__/example-1.test.ts (2) 725ms
   ✓ first test file (2) 725ms
     ✓ 2 + 2 should equal 4
     ✓ 4 - 2 should equal 2

 ❯ test/example-2.test.ts 3/5
   ↳ should run longer than three seconds 1.57s
 ❯ test/example-3.test.ts 1/5

 Test Files 2 passed (4)
      Tests 10 passed | 3 skipped (65)
   Start at 11:01:36
   Duration 2.00s
Example of final terminal output for a passing test suite:
✓ __tests__/file1.test.ts (2) 725ms
   ✓ first test file (2) 725ms
     ✓ 2 + 2 should equal 4
     ✓ 4 - 2 should equal 2
✓ __tests__/file2.test.ts (2) 746ms
  ✓ second test file (2) 746ms
    ✓ 1 + 1 should equal 2
    ✓ 2 - 1 should equal 1

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  12:34:32
   Duration  1.26s (transform 35ms, setup 1ms, collect 90ms, tests 1.47s, environment 0ms, prepare 267ms)
Dot Reporter
Prints a single dot for each completed test to provide minimal output while still showing all tests that have run. Details are only provided for failed tests, along with the basic reporter summary for the suite.
CLI
vitest.config.ts
npx vitest --reporter=dot
Example terminal output for a passing test suite:
....

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  12:34:32
   Duration  1.26s (transform 35ms, setup 1ms, collect 90ms, tests 1.47s, environment 0ms, prepare 267ms)
JUnit Reporter
Outputs a report of the test results in JUnit XML format. Can either be printed to the terminal or written to an XML file using the outputFile configuration option.
CLI
vitest.config.ts
npx vitest --reporter=junit
Example of a JUnit XML report:
<?xml version="1.0" encoding="UTF-8" ?>
<testsuites name="vitest tests" tests="2" failures="1" errors="0" time="0.503">
    <testsuite name="__tests__/test-file-1.test.ts" timestamp="2023-10-19T17:41:58.580Z" hostname="My-Computer.local" tests="2" failures="1" errors="0" skipped="0" time="0.013">
        <testcase classname="__tests__/test-file-1.test.ts" name="first test file &gt; 2 + 2 should equal 4" time="0.01">
            <failure message="expected 5 to be 4 // Object.is equality" type="AssertionError">
AssertionError: expected 5 to be 4 // Object.is equality
 ❯ __tests__/test-file-1.test.ts:20:28
            </failure>
        </testcase>
        <testcase classname="__tests__/test-file-1.test.ts" name="first test file &gt; 4 - 2 should equal 2" time="0">
        </testcase>
    </testsuite>
</testsuites>
The outputted XML contains nested testsuites and testcase tags. These can also be customized via reporter options suiteName and classnameTemplate. classnameTemplate can either be a template string or a function.
The supported placeholders for the classnameTemplate option are:
filename
filepath
export default defineConfig({
  test: {
    reporters: [
      ['junit', { suiteName: 'custom suite name', classnameTemplate: 'filename:{filename} - filepath:{filepath}' }]
    ]
  },
})
JSON Reporter
Generates a report of the test results in a JSON format compatible with Jest's --json option. Can either be printed to the terminal or written to a file using the outputFile configuration option.
CLI
vitest.config.ts
npx vitest --reporter=json
Example of a JSON report:
{
  "numTotalTestSuites": 4,
  "numPassedTestSuites": 2,
  "numFailedTestSuites": 1,
  "numPendingTestSuites": 1,
  "numTotalTests": 4,
  "numPassedTests": 1,
  "numFailedTests": 1,
  "numPendingTests": 1,
  "numTodoTests": 1,
  "startTime": 1697737019307,
  "success": false,
  "testResults": [
    {
      "assertionResults": [
        {
          "ancestorTitles": [
            "",
            "first test file"
          ],
          "fullName": " first test file 2 + 2 should equal 4",
          "status": "failed",
          "title": "2 + 2 should equal 4",
          "duration": 9,
          "failureMessages": [
            "expected 5 to be 4 // Object.is equality"
          ],
          "location": {
            "line": 20,
            "column": 28
          },
          "meta": {}
        }
      ],
      "startTime": 1697737019787,
      "endTime": 1697737019797,
      "status": "failed",
      "message": "",
      "name": "/root-directory/__tests__/test-file-1.test.ts"
    }
  ],
  "coverageMap": {}
}
INFO
Since Vitest 3, the JSON reporter includes coverage information in coverageMap if coverage is enabled.
HTML Reporter
Generates an HTML file to view test results through an interactive GUI. After the file has been generated, Vitest will keep a local development server running and provide a link to view the report in a browser.
Output file can be specified using the outputFile configuration option. If no outputFile option is provided, a new HTML file will be created.
CLI
vitest.config.ts
npx vitest --reporter=html
TIP
This reporter requires installed @vitest/ui package.
TAP Reporter
Outputs a report following Test Anything Protocol (TAP).
CLI
vitest.config.ts
npx vitest --reporter=tap
Example of a TAP report:
TAP version 13
1..1
not ok 1 - __tests__/test-file-1.test.ts # time=14.00ms {
    1..1
    not ok 1 - first test file # time=13.00ms {
        1..2
        not ok 1 - 2 + 2 should equal 4 # time=11.00ms
            ---
            error:
                name: "AssertionError"
                message: "expected 5 to be 4 // Object.is equality"
            at: "/root-directory/__tests__/test-file-1.test.ts:20:28"
            actual: "5"
            expected: "4"
            ...
        ok 2 - 4 - 2 should equal 2 # time=1.00ms
    }
}
TAP Flat Reporter
Outputs a TAP flat report. Like the tap reporter, test results are formatted to follow TAP standards, but test suites are formatted as a flat list rather than a nested hierarchy.
CLI
vitest.config.ts
npx vitest --reporter=tap-flat
Example of a TAP flat report:
TAP version 13
1..2
not ok 1 - __tests__/test-file-1.test.ts > first test file > 2 + 2 should equal 4 # time=11.00ms
    ---
    error:
        name: "AssertionError"
        message: "expected 5 to be 4 // Object.is equality"
    at: "/root-directory/__tests__/test-file-1.test.ts:20:28"
    actual: "5"
    expected: "4"
    ...
ok 2 - __tests__/test-file-1.test.ts > first test file > 4 - 2 should equal 2 # time=0.00ms
Hanging Process Reporter
Displays a list of hanging processes, if any are preventing Vitest from exiting safely. The hanging-process reporter does not itself display test results, but can be used in conjunction with another reporter to monitor processes while tests run. Using this reporter can be resource-intensive, so should generally be reserved for debugging purposes in situations where Vitest consistently cannot exit the process.
CLI
vitest.config.ts
npx vitest --reporter=hanging-process
Github Actions Reporter
Output workflow commands to provide annotations for test failures. This reporter is automatically enabled with a default reporter when process.env.GITHUB_ACTIONS === 'true'.

If you configure non-default reporters, you need to explicitly add github-actions.
export default defineConfig({
  test: {
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
  },
})
You can customize the file paths that are printed in GitHub's annotation command format by using the onWritePath option. This is useful when running Vitest in a containerized environment, such as Docker, where the file paths may not match the paths in the GitHub Actions environment.
export default defineConfig({
  test: {
    reporters: process.env.GITHUB_ACTIONS
      ? [
          'default',
          ['github-actions', { onWritePath(path) {
            return path.replace(/^\/app\//, `${process.env.GITHUB_WORKSPACE}/`)
          } }],
        ]
      : ['default'],
  },
})
Blob Reporter
Stores test results on the machine so they can be later merged using --merge-reports command. By default, stores all results in .vitest-reports folder, but can be overridden with --outputFile or --outputFile.blob flags.
npx vitest --reporter=blob --outputFile=reports/blob-1.json
We recommend using this reporter if you are running Vitest on different machines with the --shard flag. All blob reports can be merged into any report by using --merge-reports command at the end of your CI pipeline:
npx vitest --merge-reports=reports --reporter=json --reporter=default
TIP
Both --reporter=blob and --merge-reports do not work in watch mode.
Custom Reporters
You can use third-party custom reporters installed from NPM by specifying their package name in the reporters' option:
CLI
vitest.config.ts
npx vitest --reporter=some-published-vitest-reporter
Additionally, you can define your own custom reporters and use them by specifying their file path:
npx vitest --reporter=./path/to/reporter.ts
Custom reporters should implement the Reporter interface.
Suggest changes to this page
Last updated: 5/26/25, 10:44 AM
Pager
Previous page
Test Projects
Next page
Coverage
Coverage
Vitest supports Native code coverage via v8 and instrumented code coverage via istanbul.
Coverage Providers
Both v8 and istanbul support are optional. By default, v8 will be used.
You can select the coverage tool by setting test.coverage.provider to v8 or istanbul:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul' // or 'v8'
    },
  },
})
When you start the Vitest process, it will prompt you to install the corresponding support package automatically.
Or if you prefer to install them manually:
v8
istanbul
npm i -D @vitest/coverage-v8
V8 Provider
INFO
The description of V8 coverage below is Vitest specific and does not apply to other test runners. Since v3.2.0 Vitest has used AST based coverage remapping for V8 coverage, which produces identical coverage reports to Istanbul.
This allows users to have the speed of V8 coverage with accuracy of Istanbul coverage.
By default Vitest uses 'v8' coverage provider. This provider requires Javascript runtime that's implemented on top of V8 engine, such as NodeJS, Deno or any Chromium based browsers such as Google Chrome.
Coverage collection is performed during runtime by instructing V8 using node:inspector and Chrome DevTools Protocol in browsers. User's source files can be executed as-is without any pre-instrumentation steps.
✅ Recommended option to use
✅ No pre-transpile step. Test files can be executed as-is.
✅ Faster execute times than Istanbul.
✅ Lower memory usage than Istanbul.
✅ Coverage report accuracy is as good as with Istanbul (since Vitest v3.2.0).
⚠️ In some cases can be slower than Istanbul, e.g. when loading lots of different modules. V8 does not support limiting coverage collection to specific modules.
⚠️ There are some minor limitations set by V8 engine. See ast-v8-to-istanbul | Limitations.
❌ Does not work on environments that don't use V8, such as Firefox or Bun. Or on environments that don't expose V8 coverage via profiler, such as Cloudflare Workers.
Test file
Enable V8 runtime coverage collection
Run file
Collect coverage results from V8
Remap coverage results to source files
Coverage report
Istanbul provider
Istanbul code coverage tooling has existed since 2012 and is very well battle-tested. This provider works on any Javascript runtime as coverage tracking is done by instrumenting user's source files.
In practice, instrumenting source files means adding additional Javascript in user's files:
// Simplified example of branch and function coverage counters
const coverage = { 
  branches: { 1: [0, 0] }, 
  functions: { 1: 0 }, 
} 

export function getUsername(id) {
  // Function coverage increased when this is invoked
  coverage.functions['1']++

  if (id == null) {
    // Branch coverage increased when this is invoked
    coverage.branches['1'][0]++

    throw new Error('User ID is required')
  }
  // Implicit else coverage increased when if-statement condition not met
  coverage.branches['1'][1]++

  return database.getUser(id)
}

globalThis.__VITEST_COVERAGE__ ||= {} 
globalThis.__VITEST_COVERAGE__[filename] = coverage
✅ Works on any Javascript runtime
✅ Widely used and battle-tested for over 13 years.
✅ In some cases faster than V8. Coverage instrumentation can be limited to specific files, as opposed to V8 where all modules are instrumented.
❌ Requires pre-instrumentation step
❌ Execution speed is slower than V8 due to instrumentation overhead
❌ Instrumentation increases file sizes
❌ Memory usage is higher than V8
Test file
Pre‑instrumentation with Babel
Run file
Collect coverage results from Javascript scope
Remap coverage results to source files
Coverage report
Coverage Setup
TIP
It's recommended to always define coverage.include in your configuration file. This helps Vitest to reduce the amount of files picked by coverage.all.
To test with coverage enabled, you can pass the --coverage flag in CLI. By default, reporter ['text', 'html', 'clover', 'json'] will be used.
package.json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
To configure it, set test.coverage options in your config file:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
Custom Coverage Reporter
You can use custom coverage reporters by passing either the name of the package or absolute path in test.coverage.reporter:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: [
        // Specify reporter using name of the NPM package
        ['@vitest/custom-coverage-reporter', { someOption: true }],

        // Specify reporter using local path
        '/absolute/path/to/custom-reporter.cjs',
      ],
    },
  },
})
Custom reporters are loaded by Istanbul and must match its reporter interface. See built-in reporters' implementation for reference.
custom-reporter.cjs
const { ReportBase } = require('istanbul-lib-report')

module.exports = class CustomReporter extends ReportBase {
  constructor(opts) {
    super()

    // Options passed from configuration are available here
    this.file = opts.file
  }

  onStart(root, context) {
    this.contentWriter = context.writer.writeFile(this.file)
    this.contentWriter.println('Start of custom coverage report')
  }

  onEnd() {
    this.contentWriter.println('End of custom coverage report')
    this.contentWriter.close()
  }
}
Custom Coverage Provider
It's also possible to provide your custom coverage provider by passing 'custom' in test.coverage.provider:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'custom',
      customProviderModule: 'my-custom-coverage-provider'
    },
  },
})
The custom providers require a customProviderModule option which is a module name or path where to load the CoverageProviderModule from. It must export an object that implements CoverageProviderModule as default export:
my-custom-coverage-provider.ts
import type {
  CoverageProvider,
  CoverageProviderModule,
  ResolvedCoverageOptions,
  Vitest
} from 'vitest'

const CustomCoverageProviderModule: CoverageProviderModule = {
  getProvider(): CoverageProvider {
    return new CustomCoverageProvider()
  },

  // Implements rest of the CoverageProviderModule ...
}

class CustomCoverageProvider implements CoverageProvider {
  name = 'custom-coverage-provider'
  options!: ResolvedCoverageOptions

  initialize(ctx: Vitest) {
    this.options = ctx.config.coverage
  }

  // Implements rest of the CoverageProvider ...
}

export default CustomCoverageProviderModule
Please refer to the type definition for more details.
Changing the Default Coverage Folder Location
When running a coverage report, a coverage folder is created in the root directory of your project. If you want to move it to a different directory, use the test.coverage.reportsDirectory property in the vitest.config.js file.
vitest.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      reportsDirectory: './tests/unit/coverage'
    }
  }
})
Ignoring Code
Both coverage providers have their own ways how to ignore code from coverage reports:
v8
istanbul
v8 with experimentalAstAwareRemapping: true see ast-v8-to-istanbul | Ignoring code
When using TypeScript the source codes are transpiled using esbuild, which strips all comments from the source codes (esbuild#516). Comments which are considered as legal comments are preserved.
You can include a @preserve keyword in the ignore hint. Beware that these ignore hints may now be included in final production build as well.
-/* istanbul ignore if */
+/* istanbul ignore if -- @preserve */
if (condition) {

-/* v8 ignore if */
+/* v8 ignore if -- @preserve */
if (condition) {
Other Options
To see all configurable options for coverage, see the coverage Config Reference.
Coverage Performance
If code coverage generation is slow on your project, see Profiling Test Performance | Code coverage.
Vitest UI
You can check your coverage report in Vitest UI.
Vitest UI will enable coverage report when it is enabled explicitly and the html coverage reporter is present, otherwise it will not be available:
enable coverage.enabled=true in your configuration file or run Vitest with --coverage.enabled=true flag
add html to the coverage.reporter list: you can also enable subdir option to put coverage report in a subdirectory

Suggest changes to this page
Last updated: 6/10/25, 10:26 AM
Pager
Previous page
Reporters
Next page
Snapshot
Snapshot
Learn Snapshot by video from Vue School
Snapshot tests are a very useful tool whenever you want to make sure the output of your functions does not change unexpectedly.
When using snapshot, Vitest will take a snapshot of the given value, then compare it to a reference snapshot file stored alongside the test. The test will fail if the two snapshots do not match: either the change is unexpected, or the reference snapshot needs to be updated to the new version of the result.
Use Snapshots
To snapshot a value, you can use the toMatchSnapshot() from expect() API:
import { expect, it } from 'vitest'

it('toUpperCase', () => {
  const result = toUpperCase('foobar')
  expect(result).toMatchSnapshot()
})
The first time this test is run, Vitest creates a snapshot file that looks like this:
// Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html

exports['toUpperCase 1'] = '"FOOBAR"'
The snapshot artifact should be committed alongside code changes, and reviewed as part of your code review process. On subsequent test runs, Vitest will compare the rendered output with the previous snapshot. If they match, the test will pass. If they don't match, either the test runner found a bug in your code that should be fixed, or the implementation has changed and the snapshot needs to be updated.
WARNING
When using Snapshots with async concurrent tests, expect from the local Test Context must be used to ensure the right test is detected.
Inline Snapshots
Similarly, you can use the toMatchInlineSnapshot() to store the snapshot inline within the test file.
import { expect, it } from 'vitest'

it('toUpperCase', () => {
  const result = toUpperCase('foobar')
  expect(result).toMatchInlineSnapshot()
})
Instead of creating a snapshot file, Vitest will modify the test file directly to update the snapshot as a string:
import { expect, it } from 'vitest'

it('toUpperCase', () => {
  const result = toUpperCase('foobar')
  expect(result).toMatchInlineSnapshot('"FOOBAR"')
})
This allows you to see the expected output directly without jumping across different files.
WARNING
When using Snapshots with async concurrent tests, expect from the local Test Context must be used to ensure the right test is detected.
Updating Snapshots
When the received value doesn't match the snapshot, the test fails and shows you the difference between them. When the snapshot change is expected, you may want to update the snapshot from the current state.
In watch mode, you can press the u key in the terminal to update the failed snapshot directly.
Or you can use the --update or -u flag in the CLI to make Vitest update snapshots.
vitest -u
File Snapshots
When calling toMatchSnapshot(), we store all snapshots in a formatted snap file. That means we need to escape some characters (namely the double-quote " and backtick `) in the snapshot string. Meanwhile, you might lose the syntax highlighting for the snapshot content (if they are in some language).
In light of this, we introduced toMatchFileSnapshot() to explicitly match against a file. This allows you to assign any file extension to the snapshot file, and makes them more readable.
import { expect, it } from 'vitest'

it('render basic', async () => {
  const result = renderHTML(h('div', { class: 'foo' }))
  await expect(result).toMatchFileSnapshot('./test/basic.output.html')
})
It will compare with the content of ./test/basic.output.html. And can be written back with the --update flag.
Image Snapshots
It's also possible to snapshot images using jest-image-snapshot.
npm i -D jest-image-snapshot
test('image snapshot', () => {
  expect(readFileSync('./test/stubs/input-image.png'))
    .toMatchImageSnapshot()
})
Custom Serializer
You can add your own logic to alter how your snapshots are serialized. Like Jest, Vitest has default serializers for built-in JavaScript types, HTML elements, ImmutableJS and for React elements.
You can explicitly add custom serializer by using expect.addSnapshotSerializer API.
expect.addSnapshotSerializer({
  serialize(val, config, indentation, depth, refs, printer) {
    // `printer` is a function that serializes a value using existing plugins.
    return `Pretty foo: ${printer(
      val.foo,
      config,
      indentation,
      depth,
      refs,
    )}`
  },
  test(val) {
    return val && Object.prototype.hasOwnProperty.call(val, 'foo')
  },
})
We also support snapshotSerializers option to implicitly add custom serializers.
path/to/custom-serializer.ts
import { SnapshotSerializer } from 'vitest'

export default {
  serialize(val, config, indentation, depth, refs, printer) {
    // `printer` is a function that serializes a value using existing plugins.
    return `Pretty foo: ${printer(
      val.foo,
      config,
      indentation,
      depth,
      refs,
    )}`
  },
  test(val) {
    return val && Object.prototype.hasOwnProperty.call(val, 'foo')
  },
} satisfies SnapshotSerializer
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    snapshotSerializers: ['path/to/custom-serializer.ts'],
  },
})
After adding a test like this:
test('foo snapshot test', () => {
  const bar = {
    foo: {
      x: 1,
      y: 2,
    },
  }

  expect(bar).toMatchSnapshot()
})
You will get the following snapshot:
Pretty foo: Object {
  "x": 1,
  "y": 2,
}
We are using Jest's pretty-format for serializing snapshots. You can read more about it here: pretty-format.
Difference from Jest
Vitest provides an almost compatible Snapshot feature with Jest's with a few exceptions:
1. Comment header in the snapshot file is different
- // Jest Snapshot v1, https://goo.gl/fbAQLP
+ // Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html
This does not really affect the functionality but might affect your commit diff when migrating from Jest.
2. printBasicPrototype is default to false
Both Jest and Vitest's snapshots are powered by pretty-format. In Vitest we set printBasicPrototype default to false to provide a cleaner snapshot output, while in Jest <29.0.0 it's true by default.
import { expect, test } from 'vitest'

test('snapshot', () => {
  const bar = [
    {
      foo: 'bar',
    },
  ]

  // in Jest
  expect(bar).toMatchInlineSnapshot(`
    Array [
      Object {
        "foo": "bar",
      },
    ]
  `)

  // in Vitest
  expect(bar).toMatchInlineSnapshot(`
    [
      {
        "foo": "bar",
      },
    ]
  `)
})
We believe this is a more reasonable default for readability and overall DX. If you still prefer Jest's behavior, you can change your config:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    snapshotFormat: {
      printBasicPrototype: true,
    },
  },
})
3. Chevron > is used as a separator instead of colon : for custom messages
Vitest uses chevron > as a separator instead of colon : for readability, when a custom message is passed during creation of a snapshot file.
For the following example test code:
test('toThrowErrorMatchingSnapshot', () => {
  expect(() => {
    throw new Error('error')
  }).toThrowErrorMatchingSnapshot('hint')
})
In Jest, the snapshot will be:
exports[`toThrowErrorMatchingSnapshot: hint 1`] = `"error"`;
In Vitest, the equivalent snapshot will be:
exports[`toThrowErrorMatchingSnapshot > hint 1`] = `[Error: error]`;
4. default Error snapshot is different for toThrowErrorMatchingSnapshot and toThrowErrorMatchingInlineSnapshot
import { expect, test } from 'vitest'

test('snapshot', () => {
  // in Jest and Vitest
  expect(new Error('error')).toMatchInlineSnapshot(`[Error: error]`)

  // Jest snapshots `Error.message` for `Error` instance
  // Vitest prints the same value as toMatchInlineSnapshot
  expect(() => {
    throw new Error('error')
  }).toThrowErrorMatchingInlineSnapshot(`"error"`) 
  }).toThrowErrorMatchingInlineSnapshot(`[Error: error]`) 
})
Suggest changes to this page
Last updated: 11/27/24, 2:46 AM
Pager
Previous page
Coverage
Next page
Mocking
Mocking
When writing tests it's only a matter of time before you need to create a "fake" version of an internal — or external — service. This is commonly referred to as mocking. Vitest provides utility functions to help you out through its vi helper. You can import it from vitest or access it globally if global configuration is enabled.
WARNING
Always remember to clear or restore mocks before or after each test run to undo mock state changes between runs! See mockReset docs for more info.
If you are not familiar with vi.fn, vi.mock or vi.spyOn methods, check the API section first.
Dates
Sometimes you need to be in control of the date to ensure consistency when testing. Vitest uses @sinonjs/fake-timers package for manipulating timers, as well as system date. You can find more about the specific API in detail here.
Example
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const businessHours = [9, 17]

function purchase() {
  const currentHour = new Date().getHours()
  const [open, close] = businessHours

  if (currentHour > open && currentHour < close) {
    return { message: 'Success' }
  }

  return { message: 'Error' }
}

describe('purchasing flow', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('allows purchases within business hours', () => {
    // set hour within business hours
    const date = new Date(2000, 1, 1, 13)
    vi.setSystemTime(date)

    // access Date.now() will result in the date set above
    expect(purchase()).toEqual({ message: 'Success' })
  })

  it('disallows purchases outside of business hours', () => {
    // set hour outside business hours
    const date = new Date(2000, 1, 1, 19)
    vi.setSystemTime(date)

    // access Date.now() will result in the date set above
    expect(purchase()).toEqual({ message: 'Error' })
  })
})
Functions
Mocking functions can be split up into two different categories; spying & mocking.
Sometimes all you need is to validate whether or not a specific function has been called (and possibly which arguments were passed). In these cases a spy would be all we need which you can use directly with vi.spyOn() (read more here).
However spies can only help you spy on functions, they are not able to alter the implementation of those functions. In the case where we do need to create a fake (or mocked) version of a function we can use vi.fn() (read more here).
We use Tinyspy as a base for mocking functions, but we have our own wrapper to make it jest compatible. Both vi.fn() and vi.spyOn() share the same methods, however only the return result of vi.fn() is callable.
Example
import { afterEach, describe, expect, it, vi } from 'vitest'

const messages = {
  items: [
    { message: 'Simple test message', from: 'Testman' },
    // ...
  ],
  getLatest, // can also be a `getter or setter if supported`
}

function getLatest(index = messages.items.length - 1) {
  return messages.items[index]
}

describe('reading messages', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should get the latest message with a spy', () => {
    const spy = vi.spyOn(messages, 'getLatest')
    expect(spy.getMockName()).toEqual('getLatest')

    expect(messages.getLatest()).toEqual(
      messages.items[messages.items.length - 1],
    )

    expect(spy).toHaveBeenCalledTimes(1)

    spy.mockImplementationOnce(() => 'access-restricted')
    expect(messages.getLatest()).toEqual('access-restricted')

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('should get with a mock', () => {
    const mock = vi.fn().mockImplementation(getLatest)

    expect(mock()).toEqual(messages.items[messages.items.length - 1])
    expect(mock).toHaveBeenCalledTimes(1)

    mock.mockImplementationOnce(() => 'access-restricted')
    expect(mock()).toEqual('access-restricted')

    expect(mock).toHaveBeenCalledTimes(2)

    expect(mock()).toEqual(messages.items[messages.items.length - 1])
    expect(mock).toHaveBeenCalledTimes(3)
  })
})
More
Jest's Mock Functions
Globals
You can mock global variables that are not present with jsdom or node by using vi.stubGlobal helper. It will put the value of the global variable into a globalThis object.
import { vi } from 'vitest'

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

// now you can access it as `IntersectionObserver` or `window.IntersectionObserver`
Modules
Mock modules observe third-party-libraries, that are invoked in some other code, allowing you to test arguments, output or even redeclare its implementation.
See the vi.mock() API section for a more in-depth detailed API description.
Automocking Algorithm
If your code is importing a mocked module, without any associated __mocks__ file or factory for this module, Vitest will mock the module itself by invoking it and mocking every export.
The following principles apply
All arrays will be emptied
All primitives and collections will stay the same
All objects will be deeply cloned
All instances of classes and their prototypes will be deeply cloned
Virtual Modules
Vitest supports mocking Vite virtual modules. It works differently from how virtual modules are treated in Jest. Instead of passing down virtual: true to a vi.mock function, you need to tell Vite that module exists otherwise it will fail during parsing. You can do that in several ways:
Provide an alias
vitest.config.js
import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'
export default defineConfig({
  test: {
    alias: {
      '$app/forms': resolve('./mocks/forms.js'),
    },
  },
})
Provide a plugin that resolves a virtual module
vitest.config.js
import { defineConfig } from 'vitest/config'
export default defineConfig({
  plugins: [
    {
      name: 'virtual-modules',
      resolveId(id) {
        if (id === '$app/forms') {
          return 'virtual:$app/forms'
        }
      },
    },
  ],
})
The benefit of the second approach is that you can dynamically create different virtual entrypoints. If you redirect several virtual modules into a single file, then all of them will be affected by vi.mock, so make sure to use unique identifiers.
Mocking Pitfalls
Beware that it is not possible to mock calls to methods that are called inside other methods of the same file. For example, in this code:
foobar.js
export function foo() {
  return 'foo'
}

export function foobar() {
  return `${foo()}bar`
}
It is not possible to mock the foo method from the outside because it is referenced directly. So this code will have no effect on the foo call inside foobar (but it will affect the foo call in other modules):
foobar.test.ts
import { vi } from 'vitest'
import * as mod from './foobar.js'

// this will only affect "foo" outside of the original module
vi.spyOn(mod, 'foo')
vi.mock('./foobar.js', async (importOriginal) => {
  return {
    ...await importOriginal<typeof import('./foobar.js')>(),
    // this will only affect "foo" outside of the original module
    foo: () => 'mocked'
  }
})
You can confirm this behaviour by providing the implementation to the foobar method directly:
foobar.test.js
import * as mod from './foobar.js'

vi.spyOn(mod, 'foo')

// exported foo references mocked method
mod.foobar(mod.foo)
foobar.js
export function foo() {
  return 'foo'
}

export function foobar(injectedFoo) {
  return injectedFoo === foo // false
}
This is the intended behaviour. It is usually a sign of bad code when mocking is involved in such a manner. Consider refactoring your code into multiple files or improving your application architecture by using techniques such as dependency injection.
Example
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Client } from 'pg'
import { failure, success } from './handlers.js'

// get todos
export async function getTodos(event, context) {
  const client = new Client({
    // ...clientOptions
  })

  await client.connect()

  try {
    const result = await client.query('SELECT * FROM todos;')

    client.end()

    return success({
      message: `${result.rowCount} item(s) returned`,
      data: result.rows,
      status: true,
    })
  }
  catch (e) {
    console.error(e.stack)

    client.end()

    return failure({ message: e, status: false })
  }
}

vi.mock('pg', () => {
  const Client = vi.fn()
  Client.prototype.connect = vi.fn()
  Client.prototype.query = vi.fn()
  Client.prototype.end = vi.fn()

  return { Client }
})

vi.mock('./handlers.js', () => {
  return {
    success: vi.fn(),
    failure: vi.fn(),
  }
})

describe('get a list of todo items', () => {
  let client

  beforeEach(() => {
    client = new Client()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return items successfully', async () => {
    client.query.mockResolvedValueOnce({ rows: [], rowCount: 0 })

    await getTodos()

    expect(client.connect).toBeCalledTimes(1)
    expect(client.query).toBeCalledWith('SELECT * FROM todos;')
    expect(client.end).toBeCalledTimes(1)

    expect(success).toBeCalledWith({
      message: '0 item(s) returned',
      data: [],
      status: true,
    })
  })

  it('should throw an error', async () => {
    const mError = new Error('Unable to retrieve rows')
    client.query.mockRejectedValueOnce(mError)

    await getTodos()

    expect(client.connect).toBeCalledTimes(1)
    expect(client.query).toBeCalledWith('SELECT * FROM todos;')
    expect(client.end).toBeCalledTimes(1)
    expect(failure).toBeCalledWith({ message: mError, status: false })
  })
})
File System
Mocking the file system ensures that the tests do not depend on the actual file system, making the tests more reliable and predictable. This isolation helps in avoiding side effects from previous tests. It allows for testing error conditions and edge cases that might be difficult or impossible to replicate with an actual file system, such as permission issues, disk full scenarios, or read/write errors.
Vitest doesn't provide any file system mocking API out of the box. You can use vi.mock to mock the fs module manually, but it's hard to maintain. Instead, we recommend using memfs to do that for you. memfs creates an in-memory file system, which simulates file system operations without touching the actual disk. This approach is fast and safe, avoiding any potential side effects on the real file system.
Example
To automatically redirect every fs call to memfs, you can create __mocks__/fs.cjs and __mocks__/fs/promises.cjs files at the root of your project:
__mocks__/fs.cjs
__mocks__/fs/promises.cjs
// we can also use `import`, but then
// every export should be explicitly defined

const { fs } = require('memfs')
module.exports = fs
read-hello-world.js
import { readFileSync } from 'node:fs'

export function readHelloWorld(path) {
  return readFileSync(path, 'utf-8')
}
hello-world.test.js
import { beforeEach, expect, it, vi } from 'vitest'
import { fs, vol } from 'memfs'
import { readHelloWorld } from './read-hello-world.js'

// tell vitest to use fs mock from __mocks__ folder
// this can be done in a setup file if fs should always be mocked
vi.mock('node:fs')
vi.mock('node:fs/promises')

beforeEach(() => {
  // reset the state of in-memory fs
  vol.reset()
})

it('should return correct text', () => {
  const path = '/hello-world.txt'
  fs.writeFileSync(path, 'hello world')

  const text = readHelloWorld(path)
  expect(text).toBe('hello world')
})

it('can return a value multiple times', () => {
  // you can use vol.fromJSON to define several files
  vol.fromJSON(
    {
      './dir1/hw.txt': 'hello dir1',
      './dir2/hw.txt': 'hello dir2',
    },
    // default cwd
    '/tmp',
  )

  expect(readHelloWorld('/tmp/dir1/hw.txt')).toBe('hello dir1')
  expect(readHelloWorld('/tmp/dir2/hw.txt')).toBe('hello dir2')
})
Requests
Because Vitest runs in Node, mocking network requests is tricky; web APIs are not available, so we need something that will mimic network behavior for us. We recommend Mock Service Worker to accomplish this. It allows you to mock http, WebSocket and GraphQL network requests, and is framework agnostic.
Mock Service Worker (MSW) works by intercepting the requests your tests make, allowing you to use it without changing any of your application code. In-browser, this uses the Service Worker API. In Node.js, and for Vitest, it uses the @mswjs/interceptors library. To learn more about MSW, read their introduction
Configuration
You can use it like below in your setup file
HTTP Setup
GraphQL Setup
WebSocket Setup
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const posts = [
  {
    userId: 1,
    id: 1,
    title: 'first post title',
    body: 'first post body',
  },
  // ...
]

export const restHandlers = [
  http.get('https://rest-endpoint.example/path/to/posts', () => {
    return HttpResponse.json(posts)
  }),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers())
Configuring the server with onUnhandledRequest: 'error' ensures that an error is thrown whenever there is a request that does not have a corresponding request handler.
More
There is much more to MSW. You can access cookies and query parameters, define mock error responses, and much more! To see all you can do with MSW, read their documentation.
Timers
When we test code that involves timeouts or intervals, instead of having our tests wait it out or timeout, we can speed up our tests by using "fake" timers that mock calls to setTimeout and setInterval.
See the vi.useFakeTimers API section for a more in depth detailed API description.
Example
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function executeAfterTwoHours(func) {
  setTimeout(func, 1000 * 60 * 60 * 2) // 2 hours
}

function executeEveryMinute(func) {
  setInterval(func, 1000 * 60) // 1 minute
}

const mock = vi.fn(() => console.log('executed'))

describe('delayed execution', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should execute the function', () => {
    executeAfterTwoHours(mock)
    vi.runAllTimers()
    expect(mock).toHaveBeenCalledTimes(1)
  })
  it('should not execute the function', () => {
    executeAfterTwoHours(mock)
    // advancing by 2ms won't trigger the func
    vi.advanceTimersByTime(2)
    expect(mock).not.toHaveBeenCalled()
  })
  it('should execute every minute', () => {
    executeEveryMinute(mock)
    vi.advanceTimersToNextTimer()
    expect(mock).toHaveBeenCalledTimes(1)
    vi.advanceTimersToNextTimer()
    expect(mock).toHaveBeenCalledTimes(2)
  })
})
Classes
You can mock an entire class with a single vi.fn call - since all classes are also functions, this works out of the box. Beware that currently Vitest doesn't respect the new keyword so the new.target is always undefined in the body of a function.
class Dog {
  name: string

  constructor(name: string) {
    this.name = name
  }

  static getType(): string {
    return 'animal'
  }

  greet = (): string => {
    return `Hi! My name is ${this.name}!`
  }

  speak(): string {
    return 'bark!'
  }

  isHungry() {}
  feed() {}
}
We can re-create this class with ES5 functions:
const Dog = vi.fn(function (name) {
  this.name = name
  // mock instance methods in the constructor, each instance will have its own spy
  this.greet = vi.fn(() => `Hi! My name is ${this.name}!`)
})

// notice that static methods are mocked directly on the function,
// not on the instance of the class
Dog.getType = vi.fn(() => 'mocked animal')

// mock the "speak" and "feed" methods on every instance of a class
// all `new Dog()` instances will inherit and share these spies
Dog.prototype.speak = vi.fn(() => 'loud bark!')
Dog.prototype.feed = vi.fn()
WARNING
If a non-primitive is returned from the constructor function, that value will become the result of the new expression. In this case the [[Prototype]] may not be correctly bound:
const CorrectDogClass = vi.fn(function (name) {
  this.name = name
})

const IncorrectDogClass = vi.fn(name => ({
  name
}))

const Marti = new CorrectDogClass('Marti')
const Newt = new IncorrectDogClass('Newt')

Marti instanceof CorrectDogClass // ✅ true
Newt instanceof IncorrectDogClass // ❌ false!
WHEN TO USE?
Generally speaking, you would re-create a class like this inside the module factory if the class is re-exported from another module:
import { Dog } from './dog.js'

vi.mock(import('./dog.js'), () => {
  const Dog = vi.fn()
  Dog.prototype.feed = vi.fn()
  // ... other mocks
  return { Dog }
})
This method can also be used to pass an instance of a class to a function that accepts the same interface:
src/feed.ts
function feed(dog: Dog) {
  // ...
}
tests/dog.test.ts
import { expect, test, vi } from 'vitest'
import { feed } from '../src/feed.js'

const Dog = vi.fn()
Dog.prototype.feed = vi.fn()

test('can feed dogs', () => {
  const dogMax = new Dog('Max')

  feed(dogMax)

  expect(dogMax.feed).toHaveBeenCalled()
  expect(dogMax.isHungry()).toBe(false)
})
Now, when we create a new instance of the Dog class its speak method (alongside feed and greet) is already mocked:
const Cooper = new Dog('Cooper')
Cooper.speak() // loud bark!
Cooper.greet() // Hi! My name is Cooper!

// you can use built-in assertions to check the validity of the call
expect(Cooper.speak).toHaveBeenCalled()
expect(Cooper.greet).toHaveBeenCalled()

const Max = new Dog('Max')

// methods assigned to the prototype are shared between instances
expect(Max.speak).toHaveBeenCalled()
expect(Max.greet).not.toHaveBeenCalled()
We can reassign the return value for a specific instance:
const dog = new Dog('Cooper')

// "vi.mocked" is a type helper, since
// TypeScript doesn't know that Dog is a mocked class,
// it wraps any function in a MockInstance<T> type
// without validating if the function is a mock
vi.mocked(dog.speak).mockReturnValue('woof woof')

dog.speak() // woof woof
To mock the property, we can use the vi.spyOn(dog, 'name', 'get') method. This makes it possible to use spy assertions on the mocked property:
const dog = new Dog('Cooper')

const nameSpy = vi.spyOn(dog, 'name', 'get').mockReturnValue('Max')

expect(dog.name).toBe('Max')
expect(nameSpy).toHaveBeenCalledTimes(1)
TIP
You can also spy on getters and setters using the same method.
Cheat Sheet
INFO
vi in the examples below is imported directly from vitest. You can also use it globally, if you set globals to true in your config.
I want to…
Mock exported variables
example.js
export const getter = 'variable'
example.test.ts
import * as exports from './example.js'

vi.spyOn(exports, 'getter', 'get').mockReturnValue('mocked')
Mock an exported function
Example with vi.mock:
WARNING
Don't forget that a vi.mock call is hoisted to top of the file. It will always be executed before all imports.
example.js
export function method() {}
import { method } from './example.js'

vi.mock('./example.js', () => ({
  method: vi.fn()
}))
Example with vi.spyOn:
import * as exports from './example.js'

vi.spyOn(exports, 'method').mockImplementation(() => {})
Mock an exported class implementation
Example with vi.mock and .prototype:
example.js
export class SomeClass {}
import { SomeClass } from './example.js'

vi.mock(import('./example.js'), () => {
  const SomeClass = vi.fn()
  SomeClass.prototype.someMethod = vi.fn()
  return { SomeClass }
})
// SomeClass.mock.instances will have SomeClass
Example with vi.spyOn:
import * as mod from './example.js'

const SomeClass = vi.fn()
SomeClass.prototype.someMethod = vi.fn()

vi.spyOn(mod, 'SomeClass').mockImplementation(SomeClass)
Spy on an object returned from a function
Example using cache:
example.js
export function useObject() {
  return { method: () => true }
}
useObject.js
import { useObject } from './example.js'

const obj = useObject()
obj.method()
useObject.test.js
import { useObject } from './example.js'

vi.mock(import('./example.js'), () => {
  let _cache
  const useObject = () => {
    if (!_cache) {
      _cache = {
        method: vi.fn(),
      }
    }
    // now every time that useObject() is called it will
    // return the same object reference
    return _cache
  }
  return { useObject }
})

const obj = useObject()
// obj.method was called inside some-path
expect(obj.method).toHaveBeenCalled()
Mock part of a module
import { mocked, original } from './some-path.js'

vi.mock(import('./some-path.js'), async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    mocked: vi.fn()
  }
})
original() // has original behaviour
mocked() // is a spy function
WARNING
Don't forget that this only mocks external access. In this example, if original calls mocked internally, it will always call the function defined in the module, not in the mock factory.
Mock the current date
To mock Date's time, you can use vi.setSystemTime helper function. This value will not automatically reset between different tests.
Beware that using vi.useFakeTimers also changes the Date's time.
const mockDate = new Date(2022, 0, 1)
vi.setSystemTime(mockDate)
const now = new Date()
expect(now.valueOf()).toBe(mockDate.valueOf())
// reset mocked time
vi.useRealTimers()
Mock a global variable
You can set global variable by assigning a value to globalThis or using vi.stubGlobal helper. When using vi.stubGlobal, it will not automatically reset between different tests, unless you enable unstubGlobals config option or call vi.unstubAllGlobals.
vi.stubGlobal('__VERSION__', '1.0.0')
expect(__VERSION__).toBe('1.0.0')
Mock import.meta.env
To change environmental variable, you can just assign a new value to it.
WARNING
The environmental variable value will not automatically reset between different tests.
import { beforeEach, expect, it } from 'vitest'

// you can reset it in beforeEach hook manually
const originalViteEnv = import.meta.env.VITE_ENV

beforeEach(() => {
  import.meta.env.VITE_ENV = originalViteEnv
})

it('changes value', () => {
  import.meta.env.VITE_ENV = 'staging'
  expect(import.meta.env.VITE_ENV).toBe('staging')
})
If you want to automatically reset the value(s), you can use the vi.stubEnv helper with the unstubEnvs config option enabled (or call vi.unstubAllEnvs manually in a beforeEach hook):
import { expect, it, vi } from 'vitest'

// before running tests "VITE_ENV" is "test"
import.meta.env.VITE_ENV === 'test'

it('changes value', () => {
  vi.stubEnv('VITE_ENV', 'staging')
  expect(import.meta.env.VITE_ENV).toBe('staging')
})

it('the value is restored before running an other test', () => {
  expect(import.meta.env.VITE_ENV).toBe('test')
})
vitest.config.ts
export default defineConfig({
  test: {
    unstubEnvs: true,
  },
})
Suggest changes to this page
Last updated: 4/18/25, 11:19 AM
Pager
Previous page
Snapshot
Next page
Parallelism
Parallelism
File Parallelism
By default, Vitest runs test files in parallel. Depending on the specified pool, Vitest uses a different mechanism to parallelize test files:
forks (the default) and vmForks run tests in different child processes
threads and vmThreads run tests in different worker threads
Both "child processes" and "worker threads" are refered to as "workers". You can configure the number of running workers with minWorkers and maxWorkers options. Or more granually with poolOptions configuration.
If you have a lot of tests, it is usually faster to run them in parallel, but it also depends on the project, the environment and isolation state. To disable file parallelisation, you can set fileParallelism to false. To learn more about possible performance improvements, read the Performance Guide.
Test Parallelism
Unlike test files, Vitest runs tests in sequence. This means that tests inside a single test file will run in the order they are defined.
Vitest supports the concurrent option to run tests together. If this option is set, Vitest will group concurrent tests in the same file (the number of simultaneously running tests depends on the maxConcurrency option) and run them with Promise.all.
Vitest doesn't perform any smart analysis and doesn't create additional workers to run these tests. This means that the performance of your tests will improve only if you rely heavily on asynchronous operations. For example, these tests will still run one after another even though the concurrent option is specified. This is because they are synchronous:
test.concurrent('the first test', () => {
  expect(1).toBe(1)
})

test.concurrent('the second test', () => {
  expect(2).toBe(2)
})
If you wish to run all tests concurrently, you can set the sequence.concurrent option to true.
Suggest changes to this page
Last updated: 5/17/25, 8:16 AM
Pager
Previous page
Mocking
Next page
Testing Types
Testing Types
Sample Project
GitHub - Play Online
Vitest allows you to write tests for your types, using expectTypeOf or assertType syntaxes. By default all tests inside *.test-d.ts files are considered type tests, but you can change it with typecheck.include config option.
Under the hood Vitest calls tsc or vue-tsc, depending on your config, and parses results. Vitest will also print out type errors in your source code, if it finds any. You can disable it with typecheck.ignoreSourceErrors config option.
Keep in mind that Vitest doesn't run these files, they are only statically analyzed by the compiler. Meaning, that if you use a dynamic name or test.each or test.for, the test name will not be evaluated - it will be displayed as is.
WARNING
Before Vitest 2.1, your typecheck.include overrode the include pattern, so your runtime tests did not actually run; they were only type-checked.
Since Vitest 2.1, if your include and typecheck.include overlap, Vitest will report type tests and runtime tests as separate entries.
Using CLI flags, like --allowOnly and -t are also supported for type checking.
mount.test-d.ts
import { assertType, expectTypeOf } from 'vitest'
import { mount } from './mount.js'

test('my types work properly', () => {
  expectTypeOf(mount).toBeFunction()
  expectTypeOf(mount).parameter(0).toMatchTypeOf<{ name: string }>()

  // @ts-expect-error name is a string
  assertType(mount({ name: 42 }))
})
Any type error triggered inside a test file will be treated as a test error, so you can use any type trick you want to test types of your project.
You can see a list of possible matchers in API section.
Reading Errors
If you are using expectTypeOf API, refer to the expect-type documentation on its error messages.
When types don't match, .toEqualTypeOf and .toMatchTypeOf use a special helper type to produce error messages that are as actionable as possible. But there's a bit of an nuance to understanding them. Since the assertions are written "fluently", the failure should be on the "expected" type, not the "actual" type (expect<Actual>().toEqualTypeOf<Expected>()). This means that type errors can be a little confusing - so this library produces a MismatchInfo type to try to make explicit what the expectation is. For example:
expectTypeOf({ a: 1 }).toEqualTypeOf<{ a: string }>()
Is an assertion that will fail, since {a: 1} has type {a: number} and not {a: string}. The error message in this case will read something like this:
test/test.ts:999:999 - error TS2344: Type '{ a: string; }' does not satisfy the constraint '{ a: \\"Expected: string, Actual: number\\"; }'.
  Types of property 'a' are incompatible.
    Type 'string' is not assignable to type '\\"Expected: string, Actual: number\\"'.

999 expectTypeOf({a: 1}).toEqualTypeOf<{a: string}>()
Note that the type constraint reported is a human-readable messaging specifying both the "expected" and "actual" types. Rather than taking the sentence Types of property 'a' are incompatible // Type 'string' is not assignable to type "Expected: string, Actual: number" literally - just look at the property name ('a') and the message: Expected: string, Actual: number. This will tell you what's wrong, in most cases. Extremely complex types will of course be more effort to debug, and may require some experimentation. Please raise an issue if the error messages are actually misleading.
The toBe... methods (like toBeString, toBeNumber, toBeVoid etc.) fail by resolving to a non-callable type when the Actual type under test doesn't match up. For example, the failure for an assertion like expectTypeOf(1).toBeString() will look something like this:
test/test.ts:999:999 - error TS2349: This expression is not callable.
  Type 'ExpectString<number>' has no call signatures.

999 expectTypeOf(1).toBeString()
                    ~~~~~~~~~~
The This expression is not callable part isn't all that helpful - the meaningful error is the next line, Type 'ExpectString<number> has no call signatures. This essentially means you passed a number but asserted it should be a string.
If TypeScript added support for "throw" types these error messages could be improved significantly. Until then they will take a certain amount of squinting.
Concrete "expected" objects vs typeargs
Error messages for an assertion like this:
expectTypeOf({ a: 1 }).toEqualTypeOf({ a: '' })
Will be less helpful than for an assertion like this:
expectTypeOf({ a: 1 }).toEqualTypeOf<{ a: string }>()
This is because the TypeScript compiler needs to infer the typearg for the .toEqualTypeOf({a: ''}) style, and this library can only mark it as a failure by comparing it against a generic Mismatch type. So, where possible, use a typearg rather than a concrete type for .toEqualTypeOf and toMatchTypeOf. If it's much more convenient to compare two concrete types, you can use typeof:
const one = valueFromFunctionOne({ some: { complex: inputs } })
const two = valueFromFunctionTwo({ some: { other: inputs } })

expectTypeOf(one).toEqualTypeOf<typeof two>()
If you find it hard working with expectTypeOf API and figuring out errors, you can always use more simple assertType API:
const answer = 42

assertType<number>(answer)
// @ts-expect-error answer is not a string
assertType<string>(answer)
TIP
When using @ts-expect-error syntax, you might want to make sure that you didn't make a typo. You can do that by including your type files in test.include config option, so Vitest will also actually run these tests and fail with ReferenceError.
This will pass, because it expects an error, but the word “answer” has a typo, so it's a false positive error:
// @ts-expect-error answer is not a string
assertType<string>(answr)
Run Typechecking
To enable typechecking, just add --typecheck flag to your Vitest command in package.json:
package.json
{
  "scripts": {
    "test": "vitest --typecheck"
  }
}
Now you can run typecheck:
npm
yarn
pnpm
bun
npm run test
Vitest uses tsc --noEmit or vue-tsc --noEmit, depending on your configuration, so you can remove these scripts from your pipeline.
Suggest changes to this page
Last updated: 5/6/25, 6:22 AM
Pager
Previous page
Parallelism
Next page
Vitest UI
Vitest UI
Powered by Vite, Vitest also has a dev server under the hood when running the tests. This allows Vitest to provide a beautiful UI to view and interact with your tests. The Vitest UI is optional, so you'll need to install it with:
npm i -D @vitest/ui
Then you can start the tests with UI by passing the --ui flag:
vitest --ui
Then you can visit the Vitest UI at http://localhost:51204/__vitest__/
WARNING
The UI is interactive and requires a running Vite server, so make sure to run Vitest in watch mode (the default). Alternatively, you can generate a static HTML report that looks identical to the Vitest UI by specifying html in config's reporters option.

UI can also be used as a reporter. Use 'html' reporter in your Vitest configuration to generate HTML output and preview the results of your tests:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['html'],
  },
})
You can check your coverage report in Vitest UI: see Vitest UI Coverage for more details.
WARNING
If you still want to see how your tests are running in real time in the terminal, don't forget to add default reporter to reporters option: ['default', 'html'].
TIP
To preview your HTML report, you can use the vite preview command:
npx vite preview --outDir ./html
You can configure output with outputFile config option. You need to specify .html path there. For example, ./html/index.html is the default value.
Suggest changes to this page
Last updated: 1/13/25, 10:19 AM
Pager
Previous page
Testing Types
Next page
In-Source Testing
In-Source Testing
Vitest provides a way to run tests within your source code along side the implementation, similar to Rust's module tests.
This makes the tests share the same closure as the implementations and able to test against private states without exporting. Meanwhile, it also brings a closer feedback loop for development.
WARNING
This guide explains how to write tests inside your source code. If you need to write tests in separate test files, follow the "Writing Tests" guide.
Setup
To get started, put a if (import.meta.vitest) block at the end of your source file and write some tests inside it. For example:
src/index.ts
// the implementation
export function add(...args: number[]) {
  return args.reduce((a, b) => a + b, 0)
}

// in-source test suites
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('add', () => {
    expect(add()).toBe(0)
    expect(add(1)).toBe(1)
    expect(add(1, 2, 3)).toBe(6)
  })
}
Update the includeSource config for Vitest to grab the files under src/:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource: ['src/**/*.{js,ts}'], 
  },
})
Then you can start to test!
$ npx vitest
Production Build
For the production build, you will need to set the define options in your config file, letting the bundler do the dead code elimination. For example, in Vite
vite.config.ts
/// <reference types="vitest/config" />

import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    includeSource: ['src/**/*.{js,ts}'],
  },
  define: { 
    'import.meta.vitest': 'undefined', 
  }, 
})
Other Bundlers
TypeScript
To get TypeScript support for import.meta.vitest, add vitest/importMeta to your tsconfig.json:
tsconfig.json
{
  "compilerOptions": {
    "types": [
      "vitest/importMeta"
    ]
  }
}
Reference to examples/in-source-test for the full example.
Notes
This feature could be useful for:
Unit testing for small-scoped functions or utilities
Prototyping
Inline Assertion
It's recommended to use separate test files instead for more complex tests like components or E2E testing.
Suggest changes to this page
Last updated: 5/17/25, 8:28 AM
Pager
Previous page
Vitest UI
Next page
Test Context
Test Context
Inspired by Playwright Fixtures, Vitest's test context allows you to define utils, states, and fixtures that can be used in your tests.
Usage
The first argument for each test callback is a test context.
import { it } from 'vitest'

it('should work', ({ task }) => {
  // prints name of the test
  console.log(task.name)
})
Built-in Test Context
task
A readonly object containing metadata about the test.
expect
The expect API bound to the current test:
import { it } from 'vitest'

it('math is easy', ({ expect }) => {
  expect(2 + 2).toBe(4)
})
This API is useful for running snapshot tests concurrently because global expect cannot track them:
import { it } from 'vitest'

it.concurrent('math is easy', ({ expect }) => {
  expect(2 + 2).toMatchInlineSnapshot()
})

it.concurrent('math is hard', ({ expect }) => {
  expect(2 * 2).toMatchInlineSnapshot()
})
skip
function skip(note?: string): never
function skip(condition: boolean, note?: string): void
Skips subsequent test execution and marks test as skipped:
import { expect, it } from 'vitest'

it('math is hard', ({ skip }) => {
  skip()
  expect(2 + 2).toBe(5)
})
Since Vitest 3.1, it accepts a boolean parameter to skip the test conditionally:
it('math is hard', ({ skip, mind }) => {
  skip(mind === 'foggy')
  expect(2 + 2).toBe(5)
})
annotate 3.2.0+
function annotate(
  message: string,
  attachment?: TestAttachment,
): Promise<TestAnnotation>

function annotate(
  message: string,
  type?: string,
  attachment?: TestAttachment,
): Promise<TestAnnotation>
Add a test annotation that will be displayed by your reporter.
test('annotations API', async ({ annotate }) => {
  await annotate('https://github.com/vitest-dev/vitest/pull/7953', 'issues')
})
signal 3.2.0+
An AbortSignal that can be aborted by Vitest. The signal is aborted in these situations:
Test times out
User manually cancelled the test run with Ctrl+C
vitest.cancelCurrentRun was called programmatically
Another test failed in parallel and the bail flag is set
it('stop request when test times out', async ({ signal }) => {
  await fetch('/resource', { signal })
}, 2000)
onTestFailed
The onTestFailed hook bound to the current test. This API is useful if you are running tests concurrently and need to have a special handling only for this specific test.
onTestFinished
The onTestFinished hook bound to the current test. This API is useful if you are running tests concurrently and need to have a special handling only for this specific test.
Extend Test Context
Vitest provides two different ways to help you extend the test context.
test.extend
Like Playwright, you can use this method to define your own test API with custom fixtures and reuse it anywhere.
For example, we first create the test collector with two fixtures: todos and archive.
my-test.ts
import { test as baseTest } from 'vitest'

const todos = []
const archive = []

export const test = baseTest.extend({
  todos: async ({}, use) => {
    // setup the fixture before each test function
    todos.push(1, 2, 3)

    // use the fixture value
    await use(todos)

    // cleanup the fixture after each test function
    todos.length = 0
  },
  archive
})
Then we can import and use it.
my-test.test.ts
import { expect } from 'vitest'
import { test } from './my-test.js'

test('add items to todos', ({ todos }) => {
  expect(todos.length).toBe(3)

  todos.push(4)
  expect(todos.length).toBe(4)
})

test('move items from todos to archive', ({ todos, archive }) => {
  expect(todos.length).toBe(3)
  expect(archive.length).toBe(0)

  archive.push(todos.pop())
  expect(todos.length).toBe(2)
  expect(archive.length).toBe(1)
})
We can also add more fixtures or override existing fixtures by extending our test.
import { test as todosTest } from './my-test.js'

export const test = todosTest.extend({
  settings: {
    // ...
  }
})
Fixture initialization
Vitest runner will smartly initialize your fixtures and inject them into the test context based on usage.
import { test as baseTest } from 'vitest'

const test = baseTest.extend<{
  todos: number[]
  archive: number[]
}>({
  todos: async ({ task }, use) => {
    await use([1, 2, 3])
  },
  archive: []
})

// todos will not run
test('skip', () => {})
test('skip', ({ archive }) => {})

// todos will run
test('run', ({ todos }) => {})
WARNING
When using test.extend() with fixtures, you should always use the object destructuring pattern { todos } to access context both in fixture function and test function.
test('context must be destructured', (context) => { 
  expect(context.todos.length).toBe(2)
})

test('context must be destructured', ({ todos }) => { 
  expect(todos.length).toBe(2)
})
Automatic fixture
Vitest also supports the tuple syntax for fixtures, allowing you to pass options for each fixture. For example, you can use it to explicitly initialize a fixture, even if it's not being used in tests.
import { test as base } from 'vitest'

const test = base.extend({
  fixture: [
    async ({}, use) => {
      // this function will run
      setup()
      await use()
      teardown()
    },
    { auto: true } // Mark as an automatic fixture
  ],
})

test('works correctly')
Default fixture
Since Vitest 3, you can provide different values in different projects. To enable this feature, pass down { injected: true } to the options. If the key is not specified in the project configuration, then the default value will be used.
fixtures.test.ts
vitest.config.ts
import { test as base } from 'vitest'

const test = base.extend({
  url: [
    // default value if "url" is not defined in the config
    '/default',
    // mark the fixture as "injected" to allow the override
    { injected: true },
  ],
})

test('works correctly', ({ url }) => {
  // url is "/default" in "project-new"
  // url is "/full" in "project-full"
  // url is "/empty" in "project-empty"
})
Scoping Values to Suite 3.1.0+
Since Vitest 3.1, you can override context values per suite and its children by using the test.scoped API:
import { test as baseTest, describe, expect } from 'vitest'

const test = baseTest.extend({
  dependency: 'default',
  dependant: ({ dependency }, use) => use({ dependency })
})

describe('use scoped values', () => {
  test.scoped({ dependency: 'new' })

  test('uses scoped value', ({ dependant }) => {
    // `dependant` uses the new overriden value that is scoped
    // to all tests in this suite
    expect(dependant).toEqual({ dependency: 'new' })
  })

  describe('keeps using scoped value', () => {
    test('uses scoped value', ({ dependant }) => {
      // nested suite inherited the value
      expect(dependant).toEqual({ dependency: 'new' })
    })
  })
})

test('keep using the default values', ({ dependant }) => {
  // the `dependency` is using the default
  // value outside of the suite with .scoped
  expect(dependant).toEqual({ dependency: 'default' })
})
This API is particularly useful if you have a context value that relies on a dynamic variable like a database connection:
const test = baseTest.extend<{
  db: Database
  schema: string
}>({
  db: async ({ schema }, use) => {
    const db = await createDb({ schema })
    await use(db)
    await cleanup(db)
  },
  schema: '',
})

describe('one type of schema', () => {
  test.scoped({ schema: 'schema-1' })

  // ... tests
})

describe('another type of schema', () => {
  test.scoped({ schema: 'schema-2' })

  // ... tests
})
Per-Scope Context 3.2.0+
You can define context that will be initiated once per file or a worker. It is initiated the same way as a regular fixture with an objects parameter:
import { test as baseTest } from 'vitest'

export const test = baseTest.extend({
  perFile: [
    ({}, { use }) => use([]),
    { scope: 'file' },
  ],
  perWorker: [
    ({}, { use }) => use([]),
    { scope: 'worker' },
  ],
})
The value is initialised the first time any test has accessed it, unless the fixture options have auto: true - in this case the value is initialised before any test has run.
const test = baseTest.extend({
  perFile: [
    ({}, { use }) => use([]),
    {
      scope: 'file',
      // always run this hook before any test
      auto: true
    },
  ],
})
The worker scope will run the fixture once per worker. The number of running workers depends on various factors. By default, every file runs in a separate worker, so file and worker scopes work the same way.
However, if you disable isolation, then the number of workers is limited by the maxWorkers or poolOptions configuration.
Note that specifying scope: 'worker' when running tests in vmThreads or vmForks will work the same way as scope: 'file'. This limitation exists because every test file has its own VM context, so if Vitest were to initiate it once, one context could leak to another and create many reference inconsistencies (instances of the same class would reference different constructors, for example).
TypeScript
To provide fixture types for all your custom contexts, you can pass the fixtures type as a generic.
interface MyFixtures {
  todos: number[]
  archive: number[]
}

const test = baseTest.extend<MyFixtures>({
  todos: [],
  archive: []
})

test('types are defined correctly', ({ todos, archive }) => {
  expectTypeOf(todos).toEqualTypeOf<number[]>()
  expectTypeOf(archive).toEqualTypeOf<number[]>()
})
Type Inferring
Note that Vitest doesn't support infering the types when the use function is called. It is always preferable to pass down the whole context type as the generic type when test.extend is called:
import { test as baseTest } from 'vitest'

const test = baseTest.extend<{
  todos: number[]
  schema: string
}>({
  todos: ({ schema }, use) => use([]),
  schema: 'test'
})

test('types are correct', ({
  todos, // number[]
  schema, // string
}) => {
  // ...
})
beforeEach and afterEach
Deprecated
This is an outdated way of extending context and it will not work when the test is extended with test.extend.
The contexts are different for each test. You can access and extend them within the beforeEach and afterEach hooks.
import { beforeEach, it } from 'vitest'

beforeEach(async (context) => {
  // extend context
  context.foo = 'bar'
})

it('should work', ({ foo }) => {
  console.log(foo) // 'bar'
})
TypeScript
To provide property types for all your custom contexts, you can augment the TestContext type by adding
declare module 'vitest' {
  export interface TestContext {
    foo?: string
  }
}
If you want to provide property types only for specific beforeEach, afterEach, it and test hooks, you can pass the type as a generic.
interface LocalTestContext {
  foo: string
}

beforeEach<LocalTestContext>(async (context) => {
  // typeof context is 'TestContext & LocalTestContext'
  context.foo = 'bar'
})

it<LocalTestContext>('should work', ({ foo }) => {
  // typeof foo is 'string'
  console.log(foo) // 'bar'
})
Suggest changes to this page
Last updated: 6/17/25, 11:40 AM
Pager
Previous page
In-Source Testing
Next page
Test Annotations
Test Annotations
Vitest supports annotating your tests with custom messages and files via the context.annotate API. These annotations will be attached to the test case and passed down to reporters in the onTestAnnotate hook.
test('hello world', async ({ annotate }) => {
  await annotate('this is my test')

  if (condition) {
    await annotate('this should\'ve errored', 'error')
  }

  const file = createTestSpecificFile()
  await annotate('creates a file', { body: file })
})
WARNING
The annotate function returns a Promise, so it needs to be awaited if you rely on it somehow. However, Vitest will also automatically await any non-awaited annotation before the test finishes.
Depending on your reporter, you will see these annotations differently.
Built-in Reporters
default
The default reporter prints annotations only if the test has failed:
 ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

  FAIL  example.test.js > an example of a test with annotation
Error: thrown error
  ❯ example.test.js:11:21
      9 |    await annotate('annotation 1')
      10|    await annotate('annotation 2', 'warning')
      11|    throw new Error('thrown error')
        |          ^
      12|  })

  ❯ example.test.js:9:15 notice
    ↳ annotation 1
  ❯ example.test.js:10:15 warning
    ↳ annotation 2

  ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
verbose
In a TTY terminal, the verbose reporter works similarly to the default reporter. However, in a non-TTY environment, the verbose reporter will also print annotations after every test.
✓ example.test.js > an example of a test with annotation

  ❯ example.test.js:9:15 notice
    ↳ annotation 1
  ❯ example.test.js:10:15 warning
    ↳ annotation 2
html
The HTML reporter shows annotations the same way the UI does. You can see the annotation on the line where it was called. At the moment, if the annotation wasn't called in a test file, you cannot see it in the UI. We are planning to support a separate test summary view where it will be visible.

junit
The junit reporter lists annotations inside the testcase's properties tag. The JUnit reporter will ignore all attachments and will print only the type and the message.
<testcase classname="basic/example.test.js" name="an example of a test with annotation" time="0.14315">
    <properties>
        <property name="notice" value="the message of the annotation">
        </property>
    </properties>
</testcase>
github-actions
The github-actions reporter will print the annotation as a notice message by default. You can configure the type by passing down the second argument as notice, warning or error. If type is none of these, Vitest will show the message as a notice.

tap
The tap and tap-flat reporters print annotations as diagnostic messages on a new line starting with a # symbol. They will ignore all attachments and will print only the type and message:
ok 1 - an example of a test with annotation # time=143.15ms
    # notice: the message of the annotation
Suggest changes to this page
Last updated: 6/2/25, 4:53 AM
Pager
Previous page
Test Context
Next page
Environment
Test Environment
Vitest provides environment option to run code inside a specific environment. You can modify how environment behaves with environmentOptions option.
By default, you can use these environments:
node is default environment
jsdom emulates browser environment by providing Browser API, uses jsdom package
happy-dom emulates browser environment by providing Browser API, and considered to be faster than jsdom, but lacks some API, uses happy-dom package
edge-runtime emulates Vercel's edge-runtime, uses @edge-runtime/vm package
INFO
When using jsdom or happy-dom environments, Vitest follows the same rules that Vite does when importing CSS and assets. If importing external dependency fails with unknown extension .css error, you need to inline the whole import chain manually by adding all packages to server.deps.external. For example, if the error happens in package-3 in this import chain: source code -> package-1 -> package-2 -> package-3, you need to add all three packages to server.deps.external.
The require of CSS and assets inside the external dependencies are resolved automatically.
WARNING
"Environments" exist only when running tests in Node.js.
browser is not considered an environment in Vitest. If you wish to run part of your tests using Browser Mode, you can create a test project.
Environments for Specific Files
When setting environment option in your config, it will apply to all the test files in your project. To have more fine-grained control, you can use control comments to specify environment for specific files. Control comments are comments that start with @vitest-environment and are followed by the environment name:
// @vitest-environment jsdom

import { expect, test } from 'vitest'

test('test', () => {
  expect(typeof window).not.toBe('undefined')
})
Or you can also set environmentMatchGlobs option specifying the environment based on the glob patterns.
Custom Environment
You can create your own package to extend Vitest environment. To do so, create package with the name vitest-environment-${name} or specify a path to a valid JS/TS file. That package should export an object with the shape of Environment:
import type { Environment } from 'vitest/environments'

export default <Environment>{
  name: 'custom',
  transformMode: 'ssr',
  // optional - only if you support "experimental-vm" pool
  async setupVM() {
    const vm = await import('node:vm')
    const context = vm.createContext()
    return {
      getVmContext() {
        return context
      },
      teardown() {
        // called after all tests with this env have been run
      }
    }
  },
  setup() {
    // custom setup
    return {
      teardown() {
        // called after all tests with this env have been run
      }
    }
  }
}
WARNING
Vitest requires transformMode option on environment object. It should be equal to ssr or web. This value determines how plugins will transform source code. If it's set to ssr, plugin hooks will receive ssr: true when transforming or resolving files. Otherwise, ssr is set to false.
You also have access to default Vitest environments through vitest/environments entry:
import { builtinEnvironments, populateGlobal } from 'vitest/environments'

console.log(builtinEnvironments) // { jsdom, happy-dom, node, edge-runtime }
Vitest also provides populateGlobal utility function, which can be used to move properties from object into the global namespace:
interface PopulateOptions {
  // should non-class functions be bind to the global namespace
  bindFunctions?: boolean
}

interface PopulateResult {
  // a list of all keys that were copied, even if value doesn't exist on original object
  keys: Set<string>
  // a map of original object that might have been overridden with keys
  // you can return these values inside `teardown` function
  originals: Map<string | symbol, any>
}

export function populateGlobal(global: any, original: any, options: PopulateOptions): PopulateResult
Suggest changes to this page
Last updated: 5/5/25, 11:49 AM
Pager
Previous page
Test Annotations
Next page
Extending Matchers
Extending Matchers
Since Vitest is compatible with both Chai and Jest, you can use either the chai.use API or expect.extend, whichever you prefer.
This guide will explore extending matchers with expect.extend. If you are interested in Chai's API, check their guide.
To extend default matchers, call expect.extend with an object containing your matchers.
expect.extend({
  toBeFoo(received, expected) {
    const { isNot } = this
    return {
      // do not alter your "pass" based on isNot. Vitest does it for you
      pass: received === 'foo',
      message: () => `${received} is${isNot ? ' not' : ''} foo`
    }
  }
})
If you are using TypeScript, you can extend default Assertion interface in an ambient declaration file (e.g: vitest.d.ts) with the code below:
3.2.0+
3.0.0+
import 'vitest'

interface CustomMatchers<R = unknown> {
  toBeFoo: () => R
}

declare module 'vitest' {
  interface Matchers<T = any> extends CustomMatchers<T> {}
}
TIP
Since Vitest 3.2, you can extend the Matchers interface to have type-safe assertions in expect.extend, expect().*, and expect.* methods at the same time. Previously, you had to define separate interfaces for each of them.
WARNING
Don't forget to include the ambient declaration file in your tsconfig.json.
The return value of a matcher should be compatible with the following interface:
interface ExpectationResult {
  pass: boolean
  message: () => string
  // If you pass these, they will automatically appear inside a diff when
  // the matcher does not pass, so you don't need to print the diff yourself
  actual?: unknown
  expected?: unknown
}
WARNING
If you create an asynchronous matcher, don't forget to await the result (await expect('foo').toBeFoo()) in the test itself::
expect.extend({
  async toBeAsyncAssertion() {
    // ...
  }
})

await expect().toBeAsyncAssertion()
The first argument inside a matcher's function is the received value (the one inside expect(received)). The rest are arguments passed directly to the matcher.
Matcher function has access to this context with the following properties:
isNot
Returns true, if matcher was called on not (expect(received).not.toBeFoo()).
promise
If matcher was called on resolved/rejected, this value will contain the name of modifier. Otherwise, it will be an empty string.
equals
This is a utility function that allows you to compare two values. It will return true if values are equal, false otherwise. This function is used internally for almost every matcher. It supports objects with asymmetric matchers by default.
utils
This contains a set of utility functions that you can use to display messages.
this context also contains information about the current test. You can also get it by calling expect.getState(). The most useful properties are:
currentTestName
Full name of the current test (including describe block).
testPath
Path to the current test.
Suggest changes to this page
Last updated: 5/19/25, 8:12 AM
Pager
Previous page
Environment
Next page
IDE Integration
IDE Integrations
VS Code Official

GitHub | VS Code Marketplace

JetBrains IDE
WebStorm, PhpStorm, IntelliJ IDEA Ultimate, and other JetBrains IDEs come with built-in support for Vitest.

WebStorm Help | IntelliJ IDEA Ultimate Help | PhpStorm Help

Wallaby.js Paid (free for OSS)
Created by The Wallaby Team
Wallaby.js runs your Vitest tests immediately as you type, highlighting results in your IDE right next to your code.

VS Code | JetBrains | Visual Studio | Sublime Text

Suggest changes to this page
Last updated: 2/20/24, 7:19 AM
Pager
Previous page
Extending Matchers
Next page
Debugging
Debugging
TIP
When debugging tests you might want to use following options:
--test-timeout=0 to prevent tests from timing out when stopping at breakpoints
--no-file-parallelism to prevent test files from running parallel
VS Code
Quick way to debug tests in VS Code is via JavaScript Debug Terminal. Open a new JavaScript Debug Terminal and run npm run test or vitest directly. this works with any code run in Node, so will work with most JS testing frameworks

You can also add a dedicated launch configuration to debug a test file in VS Code:
{
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Current Test File",
      "autoAttachChildProcesses": true,
      "skipFiles": ["<node_internals>/**", "**/node_modules/**"],
      "program": "${workspaceRoot}/node_modules/vitest/vitest.mjs",
      "args": ["run", "${relativeFile}"],
      "smartStep": true,
      "console": "integratedTerminal"
    }
  ]
}
Then in the debug tab, ensure 'Debug Current Test File' is selected. You can then open the test file you want to debug and press F5 to start debugging.
Browser mode
To debug Vitest Browser Mode, pass --inspect or --inspect-brk in CLI or define it in your Vitest configuration:
CLI
vitest.config.js
vitest --inspect-brk --browser --no-file-parallelism
By default Vitest will use port 9229 as debugging port. You can overwrite it with by passing value in --inspect-brk:
vitest --inspect-brk=127.0.0.1:3000 --browser --no-file-parallelism
Use following VSCode Compound configuration for launching Vitest and attaching debugger in the browser:
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Run Vitest Browser",
      "program": "${workspaceRoot}/node_modules/vitest/vitest.mjs",
      "console": "integratedTerminal",
      "args": ["--inspect-brk", "--browser", "--no-file-parallelism"]
    },
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach to Vitest Browser",
      "port": 9229
    }
  ],
  "compounds": [
    {
      "name": "Debug Vitest Browser",
      "configurations": ["Attach to Vitest Browser", "Run Vitest Browser"],
      "stopAll": true
    }
  ]
}
IntelliJ IDEA
Create a vitest run configuration. Use the following settings to run all tests in debug mode:
Setting
Value
Working directory
/path/to/your-project-root

Then run this configuration in debug mode. The IDE will stop at JS/TS breakpoints set in the editor.
Node Inspector, e.g. Chrome DevTools
Vitest also supports debugging tests without IDEs. However this requires that tests are not run parallel. Use one of the following commands to launch Vitest.
# To run in a single worker
vitest --inspect-brk --pool threads --poolOptions.threads.singleThread

# To run in a single child process
vitest --inspect-brk --pool forks --poolOptions.forks.singleFork

# To run in browser mode
vitest --inspect-brk --browser --no-file-parallelism
If you are using Vitest 1.1 or higher, you can also just provide --no-file-parallelism flag:
# If pool is unknown
vitest --inspect-brk --no-file-parallelism
Once Vitest starts it will stop execution and wait for you to open developer tools that can connect to Node.js inspector. You can use Chrome DevTools for this by opening chrome://inspect on browser.
In watch mode you can keep the debugger open during test re-runs by using the --poolOptions.threads.isolate false options.
Suggest changes to this page
Last updated: 1/15/25, 7:04 AM
Pager
Previous page
IDE Integration
Next page
Common Errors
Common Errors
Cannot find module './relative-path'
If you receive an error that module cannot be found, it might mean several different things:
You misspelled the path. Make sure the path is correct.
It's possible that you rely on baseUrl in your tsconfig.json. Vite doesn't take into account tsconfig.json by default, so you might need to install vite-tsconfig-paths yourself, if you rely on this behaviour.
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()]
})
Or rewrite your path to not be relative to root:
- import helpers from 'src/helpers'
+ import helpers from '../src/helpers'
Make sure you don't have relative aliases. Vite treats them as relative to the file where the import is instead of the root.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '@/': './src/', 
      '@/': new URL('./src/', import.meta.url).pathname, 
    }
  }
})
Failed to terminate worker
This error can happen when NodeJS's fetch is used with default pool: 'threads'. This issue is tracked on issue Timeout abort can leave process(es) running in the background #3077.
As work-around you can switch to pool: 'forks' or pool: 'vmForks'.
vitest.config.js
CLI
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'forks',
  },
})
Segfaults and native code errors
Running native NodeJS modules in pool: 'threads' can run into cryptic errors coming from the native code.
Segmentation fault (core dumped)
thread '<unnamed>' panicked at 'assertion failed
Abort trap: 6
internal error: entered unreachable code
In these cases the native module is likely not built to be multi-thread safe. As work-around, you can switch to pool: 'forks' which runs the test cases in multiple node:child_process instead of multiple node:worker_threads.
vitest.config.js
CLI
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'forks',
  },
})
Suggest changes to this page
Last updated: 6/3/25, 1:20 AM
Pager
Previous page
Debugging
Next page
Migration Guide
Migration Guide
Migrating to Vitest 3.0
Test Options as a Third Argument
Vitest 3.0 prints a warning if you pass down an object as a third argument to test or describe functions:
test('validation works', () => {
  // ...
}, { retry: 3 }) 

test('validation works', { retry: 3 }, () => { 
  // ...
})
The next major version will throw an error if the third argument is an object. Note that the timeout number is not deprecated:
test('validation works', () => {
  // ...
}, 1000) // Ok ✅
browser.name and browser.providerOptions are Deprecated
Both browser.name and browser.providerOptions will be removed in Vitest 4. Instead of them, use the new browser.instances option:
export default defineConfig({
  test: {
    browser: {
      name: 'chromium', 
      providerOptions: { 
        launch: { devtools: true }, 
      }, 
      instances: [ 
        { 
          browser: 'chromium', 
          launch: { devtools: true }, 
        }, 
      ], 
    },
  },
})
With the new browser.instances field you can also specify multiple browser configurations.
spy.mockReset Now Restores the Original Implementation
There was no good way to reset the spy to the original implementation without reapplying the spy. Now, spy.mockReset will reset the implementation function to the original one instead of a fake noop.
const foo = {
  bar: () => 'Hello, world!'
}

vi.spyOn(foo, 'bar').mockImplementation(() => 'Hello, mock!')

foo.bar() // 'Hello, mock!'

foo.bar.mockReset()

foo.bar() // undefined
foo.bar() // 'Hello, world!'
vi.spyOn Reuses Mock if Method is Already Mocked
Previously, Vitest would always assign a new spy when spying on an object. This caused errors with mockRestore because it would restore the spy to the previous spy instead of the original function:
vi.spyOn(fooService, 'foo').mockImplementation(() => 'bar')
vi.spyOn(fooService, 'foo').mockImplementation(() => 'bar')
vi.restoreAllMocks()
vi.isMockFunction(fooService.foo) // true
vi.isMockFunction(fooService.foo) // false
Fake Timers Defaults
Vitest no longer provides default fakeTimers.toFake options. Now, Vitest will mock any timer-related API if it is available (except nextTick). Namely, performance.now() is now mocked when vi.useFakeTimers is called.
vi.useFakeTimers()

performance.now() // original
performance.now() // fake
You can revert to the previous behaviour by specifying timers when calling vi.useFakeTimers or globally in the config:
export default defineConfig({
  test: {
    fakeTimers: {
      toFake: [ 
        'setTimeout', 
        'clearTimeout', 
        'setInterval', 
        'clearInterval', 
        'setImmediate', 
        'clearImmediate', 
        'Date', 
      ] 
    },
  },
})
More Strict Error Equality
Vitest now checks more properties when comparing errors via toEqual or toThrowError. Vitest now compares name, message, cause and AggregateError.errors. For Error.cause, the comparison is done asymmetrically:
expect(new Error('hi', { cause: 'x' })).toEqual(new Error('hi')) // ✅
expect(new Error('hi')).toEqual(new Error('hi', { cause: 'x' })) // ❌
In addition to more properties check, Vitest now compares error prototypes. For example, if TypeError was thrown, the equality check should reference TypeError, not Error:
expect(() => {
  throw new TypeError('type error')
})
  .toThrowError(new Error('type error')) 
  .toThrowError(new TypeError('type error'))
See PR for more details: #5876.
module condition export is not resolved by default on Vite 6
Vite 6 allows more flexible resolve.conditions options and Vitest configures it to exclude module conditional export by default. See also Vite 6 migration guide for the detail of Vite side changes.
Custom Type is Deprecated API
The Custom type is now an alias for the Test type. Note that Vitest updated the public types in 2.1 and changed exported names to RunnerCustomCase and RunnerTestCase:
import {
  RunnerCustomCase, 
  RunnerTestCase, 
} from 'vitest'
If you are using getCurrentSuite().custom(), the type of the returned task is now is equal to 'test'. The Custom type will be removed in Vitest 4.
The WorkspaceSpec Type is No Longer Used API
In the public API this type was used in custom sequencers before. Please, migrate to TestSpecification instead.
onTestFinished and onTestFailed Now Receive a Context
The onTestFinished and onTestFailed hooks previously received a test result as the first argument. Now, they receive a test context, like beforeEach and afterEach.
Changes to the Snapshot API API
The public Snapshot API in @vitest/snapshot was changed to support multiple states within a single run. See PR for more details: #6817
Note that this changes only affect developers using the Snapshot API directly. There were no changes to .toMatchSnapshot API.
Changes to resolveConfig Type Signature API
The resolveConfig is now more useful. Instead of accepting already resolved Vite config, it now accepts a user config and returns resolved config.
This function is not used internally and exposed exclusively as a public API.
Cleaned up vitest/reporters types API
The vitest/reporters entrypoint now only exports reporters implementations and options types. If you need access to TestCase/TestSuite and other task related types, import them additionally from vitest/node.
Coverage ignores test files even when coverage.excludes is overwritten.
It is no longer possible to include test files in coverage report by overwriting coverage.excludes. Test files are now always excluded.
Migrating to Vitest 2.0
Default Pool is forks
Vitest 2.0 changes the default configuration for pool to 'forks' for better stability. You can read the full motivation in PR.
If you've used poolOptions without specifying a pool, you might need to update the configuration:
export default defineConfig({
  test: {
    poolOptions: {
      threads: { 
        singleThread: true, 
      }, 
      forks: { 
        singleFork: true, 
      }, 
    }
  }
})
Hooks are Running in a Stack
Before Vitest 2.0, all hooks ran in parallel. In 2.0, all hooks run serially. Additionally, afterAll/afterEach hooks run in reverse order.
To revert to the parallel execution of hooks, change sequence.hooks to 'parallel':
export default defineConfig({
  test: {
    sequence: { 
      hooks: 'parallel', 
    }, 
  },
})
suite.concurrent Runs All Tests Concurrently
Previously, specifying concurrent on a suite would group concurrent tests by suites, running them sequentially. Now, following Jest's behavior, all tests run concurrently (subject to maxConcurrency limits).
V8 Coverage's coverage.ignoreEmptyLines is Enabled by Default
The default value of coverage.ignoreEmptyLines is now true. This significant change may affect code coverage reports, requiring adjustments to coverage thresholds for some projects. This adjustment only affects the default setting when coverage.provider is 'v8'.
Removal of the watchExclude Option
Vitest uses Vite's watcher. Exclude files or directories by adding them to server.watch.ignored:
export default defineConfig({
  server: { 
    watch: { 
      ignored: ['!node_modules/examplejs'] 
    } 
  } 
})
--segfault-retry Removed
With the changes to default pool, this option is no longer needed. If you experience segfault errors, try switching to 'forks' pool. If the problem persists, please open a new issue with a reproduction.
Empty Task In Suite Tasks Removed
This is the change to the advanced task API. Previously, traversing .suite would eventually lead to the empty internal suite that was used instead of a file task.
This makes .suite optional; if the task is defined at the top level, it will not have a suite. You can fallback to the .file property that is now present on all tasks (including the file task itself, so be careful not to fall into the endless recursion).
This change also removes the file from expect.getState().currentTestName and makes expect.getState().testPath required.
task.meta is Added to the JSON Reporter
JSON reporter now prints task.meta for every assertion result.
Simplified Generic Types of Mock Functions (e.g. vi.fn<T>, Mock<T>)
Previously vi.fn<TArgs, TReturn> accepted two generic types separately for arguments and return value. This is changed to directly accept a function type vi.fn<T> to simplify the usage.
import { vi } from 'vitest'
import type { Mock } from 'vitest'

const add = (x: number, y: number): number => x + y

// using vi.fn<T>
const mockAdd = vi.fn<Parameters<typeof add>, ReturnType<typeof add>>() 
const mockAdd = vi.fn<typeof add>() 

// using Mock<T>
const mockAdd: Mock<Parameters<typeof add>, ReturnType<typeof add>> = vi.fn() 
const mockAdd: Mock<typeof add> = vi.fn()
Accessing Resolved mock.results
Previously Vitest resolved mock.results values if the function returned a Promise. Now there is a separate mock.settledResults property that populates only when the returned Promise is resolved or rejected.
const fn = vi.fn().mockResolvedValueOnce('result')
await fn()

const result = fn.mock.results[0] // 'result'
const result = fn.mock.results[0] // 'Promise<result>'

const settledResult = fn.mock.settledResults[0] // 'result'
With this change, we also introduce new toHaveResolved* matchers similar to toHaveReturned to make migration easier if you used toHaveReturned before:
const fn = vi.fn().mockResolvedValueOnce('result')
await fn()

expect(fn).toHaveReturned('result') 
expect(fn).toHaveResolved('result')
Browser Mode
Vitest Browser Mode had a lot of changes during the beta cycle. You can read about our philosophy on the Browser Mode in the GitHub discussion page.
Most of the changes were additive, but there were some small breaking changes:
none provider was renamed to preview #5842
preview provider is now a default #5842
indexScripts is renamed to orchestratorScripts #5842
Deprecated Options Removed
Some deprecated options were removed:
vitest typecheck command - use vitest --typecheck instead
VITEST_JUNIT_CLASSNAME and VITEST_JUNIT_SUITE_NAME env variables (use reporter options instead)
check for c8 coverage (use coverage-v8 instead)
export of SnapshotEnvironment from vitest - import it from vitest/snapshot instead
SpyInstance is removed in favor of MockInstance
Migrating to Vitest 1.0
Minimum Requirements
Vitest 1.0 requires Vite 5.0 and Node.js 18 or higher.
All @vitest/* sub packages require Vitest version 1.0.
Snapshots Update #3961
Quotes in snapshots are no longer escaped, and all snapshots use backtick quotes (`) even if the string is just a single line.
Quotes are no longer escaped:
expect({ foo: 'bar' }).toMatchInlineSnapshot(`
  Object {
-    \\"foo\\": \\"bar\\",
+    "foo": "bar",
  }
`)
One-line snapshots now use "`" quotes instead of ':
- expect('some string').toMatchInlineSnapshot('"some string"')
+ expect('some string').toMatchInlineSnapshot(`"some string"`)
There were also changes to @vitest/snapshot package. If you are not using it directly, you don't need to change anything.
You no longer need to extend SnapshotClient just to override equalityCheck method: just pass it down as isEqual when initiating an instance
client.setTest was renamed to client.startCurrentRun
client.resetCurrent was renamed to client.finishCurrentRun
Pools are Standardized #4172
We removed a lot of configuration options to make it easier to configure the runner to your needs. Please, have a look at migration examples if you rely on --threads or other related flags.
--threads is now --pool=threads
--no-threads is now --pool=forks
--single-thread is now --poolOptions.threads.singleThread
--experimental-vm-threads is now --pool=vmThreads
--experimental-vm-worker-memory-limit is now --poolOptions.vmThreads.memoryLimit
--isolate is now --poolOptions.<pool-name>.isolate and browser.isolate
test.maxThreads is now test.poolOptions.<pool-name>.maxThreads
test.minThreads is now test.poolOptions.<pool-name>.minThreads
test.useAtomics is now test.poolOptions.<pool-name>.useAtomics
test.poolMatchGlobs.child_process is now test.poolMatchGlobs.forks
test.poolMatchGlobs.experimentalVmThreads is now test.poolMatchGlobs.vmThreads
{
  scripts: {
-    "test": "vitest --no-threads"
     // For identical behaviour:
+    "test": "vitest --pool forks --poolOptions.forks.singleFork"
     // Or multi parallel forks:
+    "test": "vitest --pool forks"

  }
}
{
  scripts: {
-    "test": "vitest --experimental-vm-threads"
+    "test": "vitest --pool vmThreads"
  }
}
{
  scripts: {
-    "test": "vitest --isolate false"
+    "test": "vitest --poolOptions.threads.isolate false"
  }
}
{
  scripts: {
-    "test": "vitest --no-threads --isolate false"
+    "test": "vitest --pool forks --poolOptions.forks.isolate false"
  }
}
Changes to Coverage #4265, #4442
Option coverage.all is now enabled by default. This means that all project files matching coverage.include pattern will be processed even if they are not executed.
Coverage thresholds API's shape was changed, and it now supports specifying thresholds for specific files using glob patterns:
export default defineConfig({
  test: {
    coverage: {
-      perFile: true,
-      thresholdAutoUpdate: true,
-      100: true,
-      lines: 100,
-      functions: 100,
-      branches: 100,
-      statements: 100,
+      thresholds: {
+        perFile: true,
+        autoUpdate: true,
+        100: true,
+        lines: 100,
+        functions: 100,
+        branches: 100,
+        statements: 100,
+      }
    }
  }
})
Mock Types #4400
A few types were removed in favor of Jest-style "Mock" naming.
- import { EnhancedSpy, SpyInstance } from 'vitest'
+ import { MockInstance } from 'vitest'
WARNING
SpyInstance is deprecated in favor of MockInstance and will be removed in the next major release.
Timer mocks #3925
vi.useFakeTimers() no longer automatically mocks process.nextTick. It is still possible to mock process.nextTick by explicitly specifying it by using vi.useFakeTimers({ toFake: ['nextTick'] }).
However, mocking process.nextTick is not possible when using --pool=forks. Use a different --pool option if you need process.nextTick mocking.
Migrating from Jest
Vitest has been designed with a Jest compatible API, in order to make the migration from Jest as simple as possible. Despite those efforts, you may still run into the following differences:
Globals as a Default
Jest has their globals API enabled by default. Vitest does not. You can either enable globals via the globals configuration setting or update your code to use imports from the vitest module instead.
If you decide to keep globals disabled, be aware that common libraries like testing-library will not run auto DOM cleanup.
spy.mockReset
Jest's mockReset replaces the mock implementation with an empty function that returns undefined.
Vitest's mockReset resets the mock implementation to its original. That is, resetting a mock created by vi.fn(impl) will reset the mock implementation to impl.
Module Mocks
When mocking a module in Jest, the factory argument's return value is the default export. In Vitest, the factory argument has to return an object with each export explicitly defined. For example, the following jest.mock would have to be updated as follows:
jest.mock('./some-path', () => 'hello') 
vi.mock('./some-path', () => ({ 
  default: 'hello', 
}))
For more details please refer to the vi.mock api section.
Auto-Mocking Behaviour
Unlike Jest, mocked modules in <root>/__mocks__ are not loaded unless vi.mock() is called. If you need them to be mocked in every test, like in Jest, you can mock them inside setupFiles.
Importing the Original of a Mocked Package
If you are only partially mocking a package, you might have previously used Jest's function requireActual. In Vitest, you should replace these calls with vi.importActual.
const { cloneDeep } = jest.requireActual('lodash/cloneDeep') 
const { cloneDeep } = await vi.importActual('lodash/cloneDeep')
Extends mocking to external libraries
Where Jest does it by default, when mocking a module and wanting this mocking to be extended to other external libraries that use the same module, you should explicitly tell which 3rd-party library you want to be mocked, so the external library would be part of your source code, by using server.deps.inline.
server.deps.inline: ["lib-name"]
expect.getState().currentTestName
Vitest's test names are joined with a > symbol to make it easier to distinguish tests from suites, while Jest uses an empty space ().
- `${describeTitle} ${testTitle}`
+ `${describeTitle} > ${testTitle}`
Envs
Just like Jest, Vitest sets NODE_ENV to test, if it wasn't set before. Vitest also has a counterpart for JEST_WORKER_ID called VITEST_POOL_ID (always less than or equal to maxThreads), so if you rely on it, don't forget to rename it. Vitest also exposes VITEST_WORKER_ID which is a unique ID of a running worker - this number is not affected by maxThreads, and will increase with each created worker.
Replace property
If you want to modify the object, you will use replaceProperty API in Jest, you can use vi.stubEnv or vi.spyOn to do the same also in Vitest.
Done Callback
From Vitest v0.10.0, the callback style of declaring tests is deprecated. You can rewrite them to use async/await functions, or use Promise to mimic the callback style.
it('should work', (done) => {  
it('should work', () => new Promise(done => { 
  // ...
  done()
}) 
}))
Hooks
beforeAll/beforeEach hooks may return teardown function in Vitest. Because of that you may need to rewrite your hooks declarations, if they return something other than undefined or null:
beforeEach(() => setActivePinia(createTestingPinia())) 
beforeEach(() => { setActivePinia(createTestingPinia()) })
In Jest hooks are called sequentially (one after another). By default, Vitest runs hooks in parallel. To use Jest's behavior, update sequence.hooks option:
export default defineConfig({
  test: {
    sequence: { 
      hooks: 'list', 
    } 
  }
})
Types
Vitest doesn't have an equivalent to jest namespace, so you will need to import types directly from vitest:
let fn: jest.Mock<(name: string) => number> 
import type { Mock } from 'vitest'
let fn: Mock<(name: string) => number>
Timers
Vitest doesn't support Jest's legacy timers.
Timeout
If you used jest.setTimeout, you would need to migrate to vi.setConfig:
jest.setTimeout(5_000) 
vi.setConfig({ testTimeout: 5_000 })
Vue Snapshots
This is not a Jest-specific feature, but if you previously were using Jest with vue-cli preset, you will need to install jest-serializer-vue package, and use it inside setupFiles:
vite.config.js
tests/unit/setup.js
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    setupFiles: ['./tests/unit/setup.js']
  }
})
Otherwise your snapshots will have a lot of escaped " characters.
Suggest changes to this page
Last updated: 6/17/25, 11:40 AM
Pager
Previous page
Common Errors
Next page
Profiling Test Performance
Migrating to Vitest 3.0
Test Options as a Third Argument
Vitest 3.0 prints a warning if you pass down an object as a third argument to test or describe functions:
test('validation works', () => {
  // ...
}, { retry: 3 }) 

test('validation works', { retry: 3 }, () => { 
  // ...
})
The next major version will throw an error if the third argument is an object. Note that the timeout number is not deprecated:
test('validation works', () => {
  // ...
}, 1000) // Ok ✅
browser.name and browser.providerOptions are Deprecated
Both browser.name and browser.providerOptions will be removed in Vitest 4. Instead of them, use the new browser.instances option:
export default defineConfig({
  test: {
    browser: {
      name: 'chromium', 
      providerOptions: { 
        launch: { devtools: true }, 
      }, 
      instances: [ 
        { 
          browser: 'chromium', 
          launch: { devtools: true }, 
        }, 
      ], 
    },
  },
})
With the new browser.instances field you can also specify multiple browser configurations.
spy.mockReset Now Restores the Original Implementation
There was no good way to reset the spy to the original implementation without reapplying the spy. Now, spy.mockReset will reset the implementation function to the original one instead of a fake noop.
const foo = {
  bar: () => 'Hello, world!'
}

vi.spyOn(foo, 'bar').mockImplementation(() => 'Hello, mock!')

foo.bar() // 'Hello, mock!'

foo.bar.mockReset()

foo.bar() // undefined
foo.bar() // 'Hello, world!'
vi.spyOn Reuses Mock if Method is Already Mocked
Previously, Vitest would always assign a new spy when spying on an object. This caused errors with mockRestore because it would restore the spy to the previous spy instead of the original function:
vi.spyOn(fooService, 'foo').mockImplementation(() => 'bar')
vi.spyOn(fooService, 'foo').mockImplementation(() => 'bar')
vi.restoreAllMocks()
vi.isMockFunction(fooService.foo) // true
vi.isMockFunction(fooService.foo) // false
Fake Timers Defaults
Vitest no longer provides default fakeTimers.toFake options. Now, Vitest will mock any timer-related API if it is available (except nextTick). Namely, performance.now() is now mocked when vi.useFakeTimers is called.
vi.useFakeTimers()

performance.now() // original
performance.now() // fake
You can revert to the previous behaviour by specifying timers when calling vi.useFakeTimers or globally in the config:
export default defineConfig({
  test: {
    fakeTimers: {
      toFake: [ 
        'setTimeout', 
        'clearTimeout', 
        'setInterval', 
        'clearInterval', 
        'setImmediate', 
        'clearImmediate', 
        'Date', 
      ] 
    },
  },
})
More Strict Error Equality
Vitest now checks more properties when comparing errors via toEqual or toThrowError. Vitest now compares name, message, cause and AggregateError.errors. For Error.cause, the comparison is done asymmetrically:
expect(new Error('hi', { cause: 'x' })).toEqual(new Error('hi')) // ✅
expect(new Error('hi')).toEqual(new Error('hi', { cause: 'x' })) // ❌
In addition to more properties check, Vitest now compares error prototypes. For example, if TypeError was thrown, the equality check should reference TypeError, not Error:
expect(() => {
  throw new TypeError('type error')
})
  .toThrowError(new Error('type error')) 
  .toThrowError(new TypeError('type error'))
See PR for more details: #5876.
module condition export is not resolved by default on Vite 6
Vite 6 allows more flexible resolve.conditions options and Vitest configures it to exclude module conditional export by default. See also Vite 6 migration guide for the detail of Vite side changes.
Custom Type is Deprecated API
The Custom type is now an alias for the Test type. Note that Vitest updated the public types in 2.1 and changed exported names to RunnerCustomCase and RunnerTestCase:
import {
  RunnerCustomCase, 
  RunnerTestCase, 
} from 'vitest'
If you are using getCurrentSuite().custom(), the type of the returned task is now is equal to 'test'. The Custom type will be removed in Vitest 4.
The WorkspaceSpec Type is No Longer Used API
In the public API this type was used in custom sequencers before. Please, migrate to TestSpecification instead.
onTestFinished and onTestFailed Now Receive a Context
The onTestFinished and onTestFailed hooks previously received a test result as the first argument. Now, they receive a test context, like beforeEach and afterEach.
Changes to the Snapshot API API
The public Snapshot API in @vitest/snapshot was changed to support multiple states within a single run. See PR for more details: #6817
Note that this changes only affect developers using the Snapshot API directly. There were no changes to .toMatchSnapshot API.
Changes to resolveConfig Type Signature API
The resolveConfig is now more useful. Instead of accepting already resolved Vite config, it now accepts a user config and returns resolved config.
This function is not used internally and exposed exclusively as a public API.
Cleaned up vitest/reporters types API
The vitest/reporters entrypoint now only exports reporters implementations and options types. If you need access to TestCase/TestSuite and other task related types, import them additionally from vitest/node.
Coverage ignores test files even when coverage.excludes is overwritten.
It is no longer possible to include test files in coverage report by overwriting coverage.excludes. Test files are now always excluded.
Migrating to Vitest 2.0
Default Pool is forks
Vitest 2.0 changes the default configuration for pool to 'forks' for better stability. You can read the full motivation in PR.
If you've used poolOptions without specifying a pool, you might need to update the configuration:
export default defineConfig({
  test: {
    poolOptions: {
      threads: { 
        singleThread: true, 
      }, 
      forks: { 
        singleFork: true, 
      }, 
    }
  }
})
Hooks are Running in a Stack
Before Vitest 2.0, all hooks ran in parallel. In 2.0, all hooks run serially. Additionally, afterAll/afterEach hooks run in reverse order.
To revert to the parallel execution of hooks, change sequence.hooks to 'parallel':
export default defineConfig({
  test: {
    sequence: { 
      hooks: 'parallel', 
    }, 
  },
})
suite.concurrent Runs All Tests Concurrently
Previously, specifying concurrent on a suite would group concurrent tests by suites, running them sequentially. Now, following Jest's behavior, all tests run concurrently (subject to maxConcurrency limits).
V8 Coverage's coverage.ignoreEmptyLines is Enabled by Default
The default value of coverage.ignoreEmptyLines is now true. This significant change may affect code coverage reports, requiring adjustments to coverage thresholds for some projects. This adjustment only affects the default setting when coverage.provider is 'v8'.
Removal of the watchExclude Option
Vitest uses Vite's watcher. Exclude files or directories by adding them to server.watch.ignored:
export default defineConfig({
  server: { 
    watch: { 
      ignored: ['!node_modules/examplejs'] 
    } 
  } 
})
--segfault-retry Removed
With the changes to default pool, this option is no longer needed. If you experience segfault errors, try switching to 'forks' pool. If the problem persists, please open a new issue with a reproduction.
Empty Task In Suite Tasks Removed
This is the change to the advanced task API. Previously, traversing .suite would eventually lead to the empty internal suite that was used instead of a file task.
This makes .suite optional; if the task is defined at the top level, it will not have a suite. You can fallback to the .file property that is now present on all tasks (including the file task itself, so be careful not to fall into the endless recursion).
This change also removes the file from expect.getState().currentTestName and makes expect.getState().testPath required.
task.meta is Added to the JSON Reporter
JSON reporter now prints task.meta for every assertion result.
Simplified Generic Types of Mock Functions (e.g. vi.fn<T>, Mock<T>)
Previously vi.fn<TArgs, TReturn> accepted two generic types separately for arguments and return value. This is changed to directly accept a function type vi.fn<T> to simplify the usage.
import { vi } from 'vitest'
import type { Mock } from 'vitest'

const add = (x: number, y: number): number => x + y

// using vi.fn<T>
const mockAdd = vi.fn<Parameters<typeof add>, ReturnType<typeof add>>() 
const mockAdd = vi.fn<typeof add>() 

// using Mock<T>
const mockAdd: Mock<Parameters<typeof add>, ReturnType<typeof add>> = vi.fn() 
const mockAdd: Mock<typeof add> = vi.fn()
Accessing Resolved mock.results
Previously Vitest resolved mock.results values if the function returned a Promise. Now there is a separate mock.settledResults property that populates only when the returned Promise is resolved or rejected.
const fn = vi.fn().mockResolvedValueOnce('result')
await fn()

const result = fn.mock.results[0] // 'result'
const result = fn.mock.results[0] // 'Promise<result>'

const settledResult = fn.mock.settledResults[0] // 'result'
With this change, we also introduce new toHaveResolved* matchers similar to toHaveReturned to make migration easier if you used toHaveReturned before:
const fn = vi.fn().mockResolvedValueOnce('result')
await fn()

expect(fn).toHaveReturned('result') 
expect(fn).toHaveResolved('result')
Browser Mode
Vitest Browser Mode had a lot of changes during the beta cycle. You can read about our philosophy on the Browser Mode in the GitHub discussion page.
Most of the changes were additive, but there were some small breaking changes:
none provider was renamed to preview #5842
preview provider is now a default #5842
indexScripts is renamed to orchestratorScripts #5842
Deprecated Options Removed
Some deprecated options were removed:
vitest typecheck command - use vitest --typecheck instead
VITEST_JUNIT_CLASSNAME and VITEST_JUNIT_SUITE_NAME env variables (use reporter options instead)
check for c8 coverage (use coverage-v8 instead)
export of SnapshotEnvironment from vitest - import it from vitest/snapshot instead
SpyInstance is removed in favor of MockInstance
Migrating to Vitest 1.0
Minimum Requirements
Vitest 1.0 requires Vite 5.0 and Node.js 18 or higher.
All @vitest/* sub packages require Vitest version 1.0.
Snapshots Update #3961
Quotes in snapshots are no longer escaped, and all snapshots use backtick quotes (`) even if the string is just a single line.
Quotes are no longer escaped:
expect({ foo: 'bar' }).toMatchInlineSnapshot(`
  Object {
-    \\"foo\\": \\"bar\\",
+    "foo": "bar",
  }
`)
One-line snapshots now use "`" quotes instead of ':
- expect('some string').toMatchInlineSnapshot('"some string"')
+ expect('some string').toMatchInlineSnapshot(`"some string"`)
There were also changes to @vitest/snapshot package. If you are not using it directly, you don't need to change anything.
You no longer need to extend SnapshotClient just to override equalityCheck method: just pass it down as isEqual when initiating an instance
client.setTest was renamed to client.startCurrentRun
client.resetCurrent was renamed to client.finishCurrentRun
Pools are Standardized #4172
We removed a lot of configuration options to make it easier to configure the runner to your needs. Please, have a look at migration examples if you rely on --threads or other related flags.
--threads is now --pool=threads
--no-threads is now --pool=forks
--single-thread is now --poolOptions.threads.singleThread
--experimental-vm-threads is now --pool=vmThreads
--experimental-vm-worker-memory-limit is now --poolOptions.vmThreads.memoryLimit
--isolate is now --poolOptions.<pool-name>.isolate and browser.isolate
test.maxThreads is now test.poolOptions.<pool-name>.maxThreads
test.minThreads is now test.poolOptions.<pool-name>.minThreads
test.useAtomics is now test.poolOptions.<pool-name>.useAtomics
test.poolMatchGlobs.child_process is now test.poolMatchGlobs.forks
test.poolMatchGlobs.experimentalVmThreads is now test.poolMatchGlobs.vmThreads
{
  scripts: {
-    "test": "vitest --no-threads"
     // For identical behaviour:
+    "test": "vitest --pool forks --poolOptions.forks.singleFork"
     // Or multi parallel forks:
+    "test": "vitest --pool forks"

  }
}
{
  scripts: {
-    "test": "vitest --experimental-vm-threads"
+    "test": "vitest --pool vmThreads"
  }
}
{
  scripts: {
-    "test": "vitest --isolate false"
+    "test": "vitest --poolOptions.threads.isolate false"
  }
}
{
  scripts: {
-    "test": "vitest --no-threads --isolate false"
+    "test": "vitest --pool forks --poolOptions.forks.isolate false"
  }
}
Changes to Coverage #4265, #4442
Option coverage.all is now enabled by default. This means that all project files matching coverage.include pattern will be processed even if they are not executed.
Coverage thresholds API's shape was changed, and it now supports specifying thresholds for specific files using glob patterns:
export default defineConfig({
  test: {
    coverage: {
-      perFile: true,
-      thresholdAutoUpdate: true,
-      100: true,
-      lines: 100,
-      functions: 100,
-      branches: 100,
-      statements: 100,
+      thresholds: {
+        perFile: true,
+        autoUpdate: true,
+        100: true,
+        lines: 100,
+        functions: 100,
+        branches: 100,
+        statements: 100,
+      }
    }
  }
})
Mock Types #4400
A few types were removed in favor of Jest-style "Mock" naming.
- import { EnhancedSpy, SpyInstance } from 'vitest'
+ import { MockInstance } from 'vitest'
WARNING
SpyInstance is deprecated in favor of MockInstance and will be removed in the next major release.
Timer mocks #3925
vi.useFakeTimers() no longer automatically mocks process.nextTick. It is still possible to mock process.nextTick by explicitly specifying it by using vi.useFakeTimers({ toFake: ['nextTick'] }).
However, mocking process.nextTick is not possible when using --pool=forks. Use a different --pool option if you need process.nextTick mocking.
Migrating from Jest
Vitest has been designed with a Jest compatible API, in order to make the migration from Jest as simple as possible. Despite those efforts, you may still run into the following differences:
Globals as a Default
Jest has their globals API enabled by default. Vitest does not. You can either enable globals via the globals configuration setting or update your code to use imports from the vitest module instead.
If you decide to keep globals disabled, be aware that common libraries like testing-library will not run auto DOM cleanup.
spy.mockReset
Jest's mockReset replaces the mock implementation with an empty function that returns undefined.
Vitest's mockReset resets the mock implementation to its original. That is, resetting a mock created by vi.fn(impl) will reset the mock implementation to impl.
Module Mocks
When mocking a module in Jest, the factory argument's return value is the default export. In Vitest, the factory argument has to return an object with each export explicitly defined. For example, the following jest.mock would have to be updated as follows:
jest.mock('./some-path', () => 'hello') 
vi.mock('./some-path', () => ({ 
  default: 'hello', 
}))
For more details please refer to the vi.mock api section.
Auto-Mocking Behaviour
Unlike Jest, mocked modules in <root>/__mocks__ are not loaded unless vi.mock() is called. If you need them to be mocked in every test, like in Jest, you can mock them inside setupFiles.
Importing the Original of a Mocked Package
If you are only partially mocking a package, you might have previously used Jest's function requireActual. In Vitest, you should replace these calls with vi.importActual.
const { cloneDeep } = jest.requireActual('lodash/cloneDeep') 
const { cloneDeep } = await vi.importActual('lodash/cloneDeep')
Extends mocking to external libraries
Where Jest does it by default, when mocking a module and wanting this mocking to be extended to other external libraries that use the same module, you should explicitly tell which 3rd-party library you want to be mocked, so the external library would be part of your source code, by using server.deps.inline.
server.deps.inline: ["lib-name"]
expect.getState().currentTestName
Vitest's test names are joined with a > symbol to make it easier to distinguish tests from suites, while Jest uses an empty space ().
- `${describeTitle} ${testTitle}`
+ `${describeTitle} > ${testTitle}`
Envs
Just like Jest, Vitest sets NODE_ENV to test, if it wasn't set before. Vitest also has a counterpart for JEST_WORKER_ID called VITEST_POOL_ID (always less than or equal to maxThreads), so if you rely on it, don't forget to rename it. Vitest also exposes VITEST_WORKER_ID which is a unique ID of a running worker - this number is not affected by maxThreads, and will increase with each created worker.
Replace property
If you want to modify the object, you will use replaceProperty API in Jest, you can use vi.stubEnv or vi.spyOn to do the same also in Vitest.
Done Callback
From Vitest v0.10.0, the callback style of declaring tests is deprecated. You can rewrite them to use async/await functions, or use Promise to mimic the callback style.
it('should work', (done) => {  
it('should work', () => new Promise(done => { 
  // ...
  done()
}) 
}))
Hooks
beforeAll/beforeEach hooks may return teardown function in Vitest. Because of that you may need to rewrite your hooks declarations, if they return something other than undefined or null:
beforeEach(() => setActivePinia(createTestingPinia())) 
beforeEach(() => { setActivePinia(createTestingPinia()) })
In Jest hooks are called sequentially (one after another). By default, Vitest runs hooks in parallel. To use Jest's behavior, update sequence.hooks option:
export default defineConfig({
  test: {
    sequence: { 
      hooks: 'list', 
    } 
  }
})
Types
Vitest doesn't have an equivalent to jest namespace, so you will need to import types directly from vitest:
let fn: jest.Mock<(name: string) => number> 
import type { Mock } from 'vitest'
let fn: Mock<(name: string) => number>
Timers
Vitest doesn't support Jest's legacy timers.
Timeout
If you used jest.setTimeout, you would need to migrate to vi.setConfig:
jest.setTimeout(5_000) 
vi.setConfig({ testTimeout: 5_000 })
Vue Snapshots
This is not a Jest-specific feature, but if you previously were using Jest with vue-cli preset, you will need to install jest-serializer-vue package, and use it inside setupFiles:
vite.config.js
tests/unit/setup.js
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    setupFiles: ['./tests/unit/setup.js']
  }
})
Otherwise your snapshots will have a lot of escaped " characters.
Suggest changes to this page
Last updated: 6/17/25, 11:40 AM
Pager
Previous page
Common Errors
Next page
Profiling Test Performance
Migrating from Jest
Vitest has been designed with a Jest compatible API, in order to make the migration from Jest as simple as possible. Despite those efforts, you may still run into the following differences:
Globals as a Default
Jest has their globals API enabled by default. Vitest does not. You can either enable globals via the globals configuration setting or update your code to use imports from the vitest module instead.
If you decide to keep globals disabled, be aware that common libraries like testing-library will not run auto DOM cleanup.
spy.mockReset
Jest's mockReset replaces the mock implementation with an empty function that returns undefined.
Vitest's mockReset resets the mock implementation to its original. That is, resetting a mock created by vi.fn(impl) will reset the mock implementation to impl.
Module Mocks
When mocking a module in Jest, the factory argument's return value is the default export. In Vitest, the factory argument has to return an object with each export explicitly defined. For example, the following jest.mock would have to be updated as follows:
jest.mock('./some-path', () => 'hello') 
vi.mock('./some-path', () => ({ 
  default: 'hello', 
}))
For more details please refer to the vi.mock api section.
Auto-Mocking Behaviour
Unlike Jest, mocked modules in <root>/__mocks__ are not loaded unless vi.mock() is called. If you need them to be mocked in every test, like in Jest, you can mock them inside setupFiles.
Importing the Original of a Mocked Package
If you are only partially mocking a package, you might have previously used Jest's function requireActual. In Vitest, you should replace these calls with vi.importActual.
const { cloneDeep } = jest.requireActual('lodash/cloneDeep') 
const { cloneDeep } = await vi.importActual('lodash/cloneDeep')
Extends mocking to external libraries
Where Jest does it by default, when mocking a module and wanting this mocking to be extended to other external libraries that use the same module, you should explicitly tell which 3rd-party library you want to be mocked, so the external library would be part of your source code, by using server.deps.inline.
server.deps.inline: ["lib-name"]
expect.getState().currentTestName
Vitest's test names are joined with a > symbol to make it easier to distinguish tests from suites, while Jest uses an empty space ().
- `${describeTitle} ${testTitle}`
+ `${describeTitle} > ${testTitle}`
Envs
Just like Jest, Vitest sets NODE_ENV to test, if it wasn't set before. Vitest also has a counterpart for JEST_WORKER_ID called VITEST_POOL_ID (always less than or equal to maxThreads), so if you rely on it, don't forget to rename it. Vitest also exposes VITEST_WORKER_ID which is a unique ID of a running worker - this number is not affected by maxThreads, and will increase with each created worker.
Replace property
If you want to modify the object, you will use replaceProperty API in Jest, you can use vi.stubEnv or vi.spyOn to do the same also in Vitest.
Done Callback
From Vitest v0.10.0, the callback style of declaring tests is deprecated. You can rewrite them to use async/await functions, or use Promise to mimic the callback style.
it('should work', (done) => {  
it('should work', () => new Promise(done => { 
  // ...
  done()
}) 
}))
Hooks
beforeAll/beforeEach hooks may return teardown function in Vitest. Because of that you may need to rewrite your hooks declarations, if they return something other than undefined or null:
beforeEach(() => setActivePinia(createTestingPinia())) 
beforeEach(() => { setActivePinia(createTestingPinia()) })
In Jest hooks are called sequentially (one after another). By default, Vitest runs hooks in parallel. To use Jest's behavior, update sequence.hooks option:
export default defineConfig({
  test: {
    sequence: { 
      hooks: 'list', 
    } 
  }
})
Types
Vitest doesn't have an equivalent to jest namespace, so you will need to import types directly from vitest:
let fn: jest.Mock<(name: string) => number> 
import type { Mock } from 'vitest'
let fn: Mock<(name: string) => number>
Timers
Vitest doesn't support Jest's legacy timers.
Timeout
If you used jest.setTimeout, you would need to migrate to vi.setConfig:
jest.setTimeout(5_000) 
vi.setConfig({ testTimeout: 5_000 })
Vue Snapshots
This is not a Jest-specific feature, but if you previously were using Jest with vue-cli preset, you will need to install jest-serializer-vue package, and use it inside setupFiles:
vite.config.js
tests/unit/setup.js
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    setupFiles: ['./tests/unit/setup.js']
  }
})
Otherwise your snapshots will have a lot of escaped " characters.
Suggest changes to this page
Last updated: 6/17/25, 11:40 AM
Pager
Previous page
Common Errors
Next page
Profiling Test Performance
Profiling Test Performance
When you run Vitest it reports multiple time metrics of your tests:
RUN  v2.1.1 /x/vitest/examples/profiling

✓ test/prime-number.test.ts (1) 4517ms
  ✓ generate prime number 4517ms

Test Files  1 passed (1)
     Tests  1 passed (1)
  Start at  09:32:53
  Duration  4.80s (transform 44ms, setup 0ms, collect 35ms, tests 4.52s, environment 0ms, prepare 81ms)
  # Time metrics ^^
Transform: How much time was spent transforming the files. See File Transform.
Setup: Time spent for running the setupFiles files.
Collect: Time spent for collecting all tests in the test files. This includes the time it took to import all file dependencies.
Tests: Time spent for actually running the test cases.
Environment: Time spent for setting up the test environment, for example JSDOM.
Prepare: Time Vitest uses to prepare the test runner. When running tests in Node, this is the time to import and execute all internal utilities inside the worker. When running tests in the browser, this also includes the time to initiate the iframe.
Test runner
In cases where your test execution time is high, you can generate a profile of the test runner. See NodeJS documentation for following options:
--cpu-prof
--heap-prof
--prof
WARNING
The --prof option does not work with pool: 'threads' due to node:worker_threads limitations.
To pass these options to Vitest's test runner, define poolOptions.<pool>.execArgv in your Vitest configuration:
Forks
Threads
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'forks',
    poolOptions: {
      forks: {
        execArgv: [
          '--cpu-prof',
          '--cpu-prof-dir=test-runner-profile',
          '--heap-prof',
          '--heap-prof-dir=test-runner-profile'
        ],

        // To generate a single profile
        singleFork: true,
      },
    },
  },
})
After the tests have run there should be a test-runner-profile/*.cpuprofile and test-runner-profile/*.heapprofile files generated. See Inspecting profiling records for instructions how to analyze these files.
See Profiling | Examples for example.
Main thread
Profiling main thread is useful for debugging Vitest's Vite usage and globalSetup files. This is also where your Vite plugins are running.
TIP
See Performance | Vite for more tips about Vite specific profiling.
We recommend vite-plugin-inspect for profiling your Vite plugin performance.
To do this you'll need to pass arguments to the Node process that runs Vitest.
$ node --cpu-prof --cpu-prof-dir=main-profile ./node_modules/vitest/vitest.mjs --run
#      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^                                  ^^^^^
#               NodeJS arguments                                           Vitest arguments
After the tests have run there should be a main-profile/*.cpuprofile file generated. See Inspecting profiling records for instructions how to analyze these files.
File transform
In cases where your test transform and collection time is high, you can use DEBUG=vite-node:* environment variable to see which files are being transformed and executed by vite-node.
$ DEBUG=vite-node:* vitest --run

 RUN  v2.1.1 /x/vitest/examples/profiling

  vite-node:server:request /x/vitest/examples/profiling/global-setup.ts +0ms
  vite-node:client:execute /x/vitest/examples/profiling/global-setup.ts +0ms
  vite-node:server:request /x/vitest/examples/profiling/test/prime-number.test.ts +45ms
  vite-node:client:execute /x/vitest/examples/profiling/test/prime-number.test.ts +26ms
  vite-node:server:request /src/prime-number.ts +9ms
  vite-node:client:execute /x/vitest/examples/profiling/src/prime-number.ts +9ms
  vite-node:server:request /src/unnecessary-file.ts +6ms
  vite-node:client:execute /x/vitest/examples/profiling/src/unnecessary-file.ts +4ms
...
This profiling strategy is a good way to identify unnecessary transforms caused by barrel files. If these logs contain files that should not be loaded when your test is run, you might have barrel files that are importing files unnecessarily.
You can also use Vitest UI to debug slowness caused by barrel file. The example below shows how importing files without barrel file reduces amount of transformed files by ~85%.
File tree
example.test.ts
├── src
│   └── utils
│       ├── currency.ts
│       ├── formatters.ts  <-- File to test
│       ├── index.ts
│       ├── location.ts
│       ├── math.ts
│       ├── time.ts
│       └── users.ts
├── test
│   └── formatters.test.ts
└── vitest.config.ts

To see how files are transformed, you can use VITE_NODE_DEBUG_DUMP environment variable to write transformed files in the file system:
$ VITE_NODE_DEBUG_DUMP=true vitest --run

[vite-node] [debug] dump modules to /x/examples/profiling/.vite-node/dump

 RUN  v2.1.1 /x/vitest/examples/profiling
...

$ ls .vite-node/dump/
_x_examples_profiling_global-setup_ts-1292904907.js
_x_examples_profiling_test_prime-number_test_ts-1413378098.js
_src_prime-number_ts-525172412.js
Code coverage
If code coverage generation is slow on your project you can use DEBUG=vitest:coverage environment variable to enable performance logging.
$ DEBUG=vitest:coverage vitest --run --coverage

 RUN  v3.1.1 /x/vitest-example

  vitest:coverage Reading coverage results 2/2
  vitest:coverage Converting 1/2
  vitest:coverage 4 ms /x/src/multiply.ts
  vitest:coverage Converting 2/2
  vitest:coverage 552 ms /x/src/add.ts
  vitest:coverage Uncovered files 1/2
  vitest:coverage File "/x/src/large-file.ts" is taking longer than 3s
  vitest:coverage 3027 ms /x/src/large-file.ts
  vitest:coverage Uncovered files 2/2
  vitest:coverage 4 ms /x/src/untested-file.ts
  vitest:coverage Generate coverage total time 3521 ms
This profiling approach is great for detecting large files that are accidentally picked by coverage providers. For example if your configuration is accidentally including large built minified Javascript files in code coverage, they should appear in logs. In these cases you might want to adjust your coverage.include and coverage.exclude options.
Inspecting profiling records
You can inspect the contents of *.cpuprofile and *.heapprofile with various tools. See list below for examples.
Speedscope
Performance Profiling JavaScript in Visual Studio Code
Profile Node.js performance with the Performance panel | developer.chrome.com
Memory panel overview | developer.chrome.com
Suggest changes to this page
Last updated: 6/5/25, 3:45 AM
Pager
Previous page
Migration Guide
Next page
Improving Performance
Improving Performance
Test isolation
By default Vitest runs every test file in an isolated environment based on the pool:
threads pool runs every test file in a separate Worker
forks pool runs every test file in a separate forked child process
vmThreads pool runs every test file in a separate VM context, but it uses workers for parallelism
This greatly increases test times, which might not be desirable for projects that don't rely on side effects and properly cleanup their state (which is usually true for projects with node environment). In this case disabling isolation will improve the speed of your tests. To do that, you can provide --no-isolate flag to the CLI or set test.isolate property in the config to false.
CLI
vitest.config.js
vitest --no-isolate
TIP
If you are using vmThreads pool, you cannot disable isolation. Use threads pool instead to improve your tests performance.
For some projects, it might also be desirable to disable parallelism to improve startup time. To do that, provide --no-file-parallelism flag to the CLI or set test.fileParallelism property in the config to false.
CLI
vitest.config.js
vitest --no-file-parallelism
Pool
By default Vitest runs tests in pool: 'forks'. While 'forks' pool is better for compatibility issues (hanging process and segfaults), it may be slightly slower than pool: 'threads' in larger projects.
You can try to improve test run time by switching pool option in configuration:
CLI
vitest.config.js
vitest --pool=threads
Sharding
Test sharding is a process of splitting your test suite into groups, or shards. This can be useful when you have a large test suite and multiple matchines that could run subsets of that suite simultaneously.
To split Vitest tests on multiple different runs, use --shard option with --reporter=blob option:
vitest run --reporter=blob --shard=1/3 # 1st machine
vitest run --reporter=blob --shard=2/3 # 2nd machine
vitest run --reporter=blob --shard=3/3 # 3rd machine
Vitest splits your test files, not your test cases, into shards. If you've got 1000 test files, the --shard=1/4 option will run 250 test files, no matter how many test cases individual files have.
Collect the results stored in .vitest-reports directory from each machine and merge them with --merge-reports option:
vitest run --merge-reports
TIP
Test sharding can also become useful on high CPU-count machines.
Vitest will run only a single Vite server in its main thread. Rest of the threads are used to run test files. In a high CPU-count machine the main thread can become a bottleneck as it cannot handle all the requests coming from the threads. For example in 32 CPU machine the main thread is responsible to handle load coming from 31 test threads.
To reduce the load from main thread's Vite server you can use test sharding. The load can be balanced on multiple Vite server.
# Example for splitting tests on 32 CPU to 4 shards.
# As each process needs 1 main thread, there's 7 threads for test runners (1+7)*4 = 32
# Use VITEST_MAX_THREADS or VITEST_MAX_FORKS depending on the pool:
VITEST_MAX_THREADS=7 vitest run --reporter=blob --shard=1/4 & \
VITEST_MAX_THREADS=7 vitest run --reporter=blob --shard=2/4 & \
VITEST_MAX_THREADS=7 vitest run --reporter=blob --shard=3/4 & \
VITEST_MAX_THREADS=7 vitest run --reporter=blob --shard=4/4 & \
wait # https://man7.org/linux/man-pages/man2/waitpid.2.html

vitest run --merge-reports
Suggest changes to this page
Last updated: 6/2/25, 12:19 PM
Pager
Previous page
Profiling Test Performance
Next page
Browser Mode
Browser Mode Experimental
This page provides information about the experimental browser mode feature in the Vitest API, which allows you to run your tests in the browser natively, providing access to browser globals like window and document. This feature is currently under development, and APIs may change in the future.
TIP
If you are looking for documentation for expect, vi or any general API like test projects or type testing, refer to the "Getting Started" guide.

Installation
For easier setup, you can use vitest init browser command to install required dependencies and create browser configuration.
npm
yarn
pnpm
bun
npx vitest init browser
Manual Installation
You can also install packages manually. By default, Browser Mode doesn't require any additional E2E provider to run tests locally because it reuses your existing browser.
npm
yarn
pnpm
bun
npm install -D vitest @vitest/browser
WARNING
However, to run tests in CI you need to install either playwright or webdriverio. We also recommend switching to either one of them for testing locally instead of using the default preview provider since it relies on simulating events instead of using Chrome DevTools Protocol.
If you don't already use one of these tools, we recommend starting with Playwright because it supports parallel execution, which makes your tests run faster. Additionally, Playwright uses Chrome DevTools Protocol which is generally faster than WebDriver.
PlaywrightWebdriverIO
Playwright is a framework for Web Testing and Automation.
npm
yarn
pnpm
bun
npm install -D vitest @vitest/browser playwright
Configuration
To activate browser mode in your Vitest configuration, set the browser.enabled field to true in your Vitest configuration file. Here is an example configuration using the browser field:
vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    browser: {
      provider: 'playwright', // or 'webdriverio'
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
  }
})
INFO
Vitest assigns port 63315 to avoid conflicts with the development server, allowing you to run both in parallel. You can change that with the browser.api option.
Since Vitest 2.1.5, the CLI no longer prints the Vite URL automatically. You can press "b" to print the URL when running in watch mode.
If you have not used Vite before, make sure you have your framework's plugin installed and specified in the config. Some frameworks might require extra configuration to work - check their Vite related documentation to be sure.
react
vue
svelte
solid
marko
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        { browser: 'chromium' },
      ],
    }
  }
})
If you need to run some tests using Node-based runner, you can define a projects option with separate configurations for different testing strategies:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          // an example of file based convention,
          // you don't have to follow it
          include: [
            'tests/unit/**/*.{test,spec}.ts',
            'tests/**/*.unit.{test,spec}.ts',
          ],
          name: 'unit',
          environment: 'node',
        },
      },
      {
        test: {
          // an example of file based convention,
          // you don't have to follow it
          include: [
            'tests/browser/**/*.{test,spec}.ts',
            'tests/**/*.browser.{test,spec}.ts',
          ],
          name: 'browser',
          browser: {
            enabled: true,
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
    ],
  },
})
Browser Option Types
The browser option in Vitest depends on the provider. Vitest will fail, if you pass --browser and don't specify its name in the config file. Available options:
webdriverio supports these browsers:
firefox
chrome
edge
safari
playwright supports these browsers:
firefox
webkit
chromium
TypeScript
By default, TypeScript doesn't recognize providers options and extra expect properties. If you don't use any providers, make sure the @vitest/browser/matchers is referenced somewhere in your tests, setup file or a config file to pick up the extra expect definitions. If you are using custom providers, make sure to add @vitest/browser/providers/playwright or @vitest/browser/providers/webdriverio to the same file so TypeScript can pick up definitions for custom options:
default
playwright
webdriverio
/// <reference types="@vitest/browser/matchers" />
Alternatively, you can also add them to compilerOptions.types field in your tsconfig.json file. Note that specifying anything in this field will disable auto loading of @types/* packages.
default
playwright
webdriverio
{
  "compilerOptions": {
    "types": ["@vitest/browser/matchers"]
  }
}
Browser Compatibility
Vitest uses Vite dev server to run your tests, so we only support features specified in the esbuild.target option (esnext by default).
By default, Vite targets browsers which support the native ES Modules, native ESM dynamic import, and import.meta. On top of that, we utilize BroadcastChannel to communicate between iframes:
Chrome >=87
Firefox >=78
Safari >=15.4
Edge >=88
Running Tests
When you specify a browser name in the browser option, Vitest will try to run the specified browser using preview by default, and then run the tests there. If you don't want to use preview, you can configure the custom browser provider by using browser.provider option.
To specify a browser using the CLI, use the --browser flag followed by the browser name, like this:
npx vitest --browser=chromium
Or you can provide browser options to CLI with dot notation:
npx vitest --browser.headless
WARNING
Since Vitest 3.2, if you don't have the browser option in your config but specify the --browser flag, Vitest will fail because it can't assume that config is meant for the browser and not Node.js tests.
By default, Vitest will automatically open the browser UI for development. Your tests will run inside an iframe in the center. You can configure the viewport by selecting the preferred dimensions, calling page.viewport inside the test, or setting default values in the config.
Headless
Headless mode is another option available in the browser mode. In headless mode, the browser runs in the background without a user interface, which makes it useful for running automated tests. The headless option in Vitest can be set to a boolean value to enable or disable headless mode.
When using headless mode, Vitest won't open the UI automatically. If you want to continue using the UI but have tests run headlessly, you can install the @vitest/ui package and pass the --ui flag when running Vitest.
Here's an example configuration enabling headless mode:
vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    browser: {
      provider: 'playwright',
      enabled: true,
      headless: true,
    },
  }
})
You can also set headless mode using the --browser.headless flag in the CLI, like this:
npx vitest --browser.headless
In this case, Vitest will run in headless mode using the Chrome browser.
WARNING
Headless mode is not available by default. You need to use either playwright or webdriverio providers to enable this feature.
Examples
By default, you don't need any external packages to work with the Browser Mode:
example.test.js
import { expect, test } from 'vitest'
import { page } from '@vitest/browser/context'
import { render } from './my-render-function.js'

test('properly handles form inputs', async () => {
  render() // mount DOM elements

  // Asserts initial state.
  await expect.element(page.getByText('Hi, my name is Alice')).toBeInTheDocument()

  // Get the input DOM node by querying the associated label.
  const usernameInput = page.getByLabelText(/username/i)

  // Type the name into the input. This already validates that the input
  // is filled correctly, no need to check the value manually.
  await usernameInput.fill('Bob')

  await expect.element(page.getByText('Hi, my name is Bob')).toBeInTheDocument()
})
However, Vitest also provides packages to render components for several popular frameworks out of the box:
vitest-browser-vue to render vue components
vitest-browser-svelte to render svelte components
vitest-browser-react to render react components
Community packages are available for other frameworks:
vitest-browser-lit to render lit components
vitest-browser-preact to render preact components
If your framework is not represented, feel free to create your own package - it is a simple wrapper around the framework renderer and page.elementLocator API. We will add a link to it on this page. Make sure it has a name starting with vitest-browser-.
Besides rendering components and locating elements, you will also need to make assertions. Vitest forks the @testing-library/jest-dom library to provide a wide range of DOM assertions out of the box. Read more at the Assertions API.
import { expect } from 'vitest'
import { page } from '@vitest/browser/context'
// element is rendered correctly
await expect.element(page.getByText('Hello World')).toBeInTheDocument()
Vitest exposes a Context API with a small set of utilities that might be useful to you in tests. For example, if you need to make an interaction, like clicking an element or typing text into an input, you can use userEvent from @vitest/browser/context. Read more at the Interactivity API.
import { page, userEvent } from '@vitest/browser/context'
await userEvent.fill(page.getByLabelText(/username/i), 'Alice')
// or just locator.fill
await page.getByLabelText(/username/i).fill('Alice')
vue
svelte
react
lit
preact
import { render } from 'vitest-browser-vue'
import Component from './Component.vue'

test('properly handles v-model', async () => {
  const screen = render(Component)

  // Asserts initial state.
  await expect.element(screen.getByText('Hi, my name is Alice')).toBeInTheDocument()

  // Get the input DOM node by querying the associated label.
  const usernameInput = screen.getByLabelText(/username/i)

  // Type the name into the input. This already validates that the input
  // is filled correctly, no need to check the value manually.
  await usernameInput.fill('Bob')

  await expect.element(screen.getByText('Hi, my name is Bob')).toBeInTheDocument()
})
Vitest doesn't support all frameworks out of the box, but you can use external tools to run tests with these frameworks. We also encourage the community to create their own vitest-browser wrappers - if you have one, feel free to add it to the examples above.
For unsupported frameworks, we recommend using testing-library packages:
@solidjs/testing-library to render solid components
@marko/testing-library to render marko components
You can also see more examples in browser-examples repository.
WARNING
testing-library provides a package @testing-library/user-event. We do not recommend using it directly because it simulates events instead of actually triggering them - instead, use userEvent imported from @vitest/browser/context that uses Chrome DevTools Protocol or Webdriver (depending on the provider) under the hood.
solid
marko
// based on @testing-library/solid API
// https://testing-library.com/docs/solid-testing-library/api

import { render } from '@testing-library/solid'

it('uses params', async () => {
  const App = () => (
    <>
      <Route
        path="/ids/:id"
        component={() => (
          <p>
            Id:
            {useParams()?.id}
          </p>
        )}
      />
      <Route path="/" component={() => <p>Start</p>} />
    </>
  )
  const { baseElement } = render(() => <App />, { location: 'ids/1234' })
  const screen = page.elementLocator(baseElement)

  await expect.screen(screen.getByText('Id: 1234')).toBeInTheDocument()
})
Limitations
Thread Blocking Dialogs
When using Vitest Browser, it's important to note that thread blocking dialogs like alert or confirm cannot be used natively. This is because they block the web page, which means Vitest cannot continue communicating with the page, causing the execution to hang.
In such situations, Vitest provides default mocks with default returned values for these APIs. This ensures that if the user accidentally uses synchronous popup web APIs, the execution would not hang. However, it's still recommended for the user to mock these web APIs for better experience. Read more in Mocking.
Spying on Module Exports
Browser Mode uses the browser's native ESM support to serve modules. The module namespace object is sealed and can't be reconfigured, unlike in Node.js tests where Vitest can patch the Module Runner. This means you can't call vi.spyOn on an imported object:
import { vi } from 'vitest'
import * as module from './module.js'

vi.spyOn(module, 'method') // ❌ throws an error
To bypass this limitation, Vitest supports { spy: true } option in vi.mock('./module.js'). This will automatically spy on every export in the module without replacing them with fake ones.
import { vi } from 'vitest'
import * as module from './module.js'

vi.mock('./module.js', { spy: true })

vi.mocked(module.method).mockImplementation(() => {
  // ...
})
However, the only way to mock exported variables is to export a method that will change the internal value:
module.js
module.test.ts
export let MODE = 'test'
export function changeMode(newMode) {
  MODE = newMode
}
Suggest changes to this page
Last updated: 6/17/25, 12:03 PM
Pager
Previous page
Why Browser Mode | Browser Mode
Next page
Browser Config Reference | Browser Mode
Why Browser Mode
Motivation
We developed the Vitest browser mode feature to help improve testing workflows and achieve more accurate and reliable test results. This experimental addition to our testing API allows developers to run tests in a native browser environment. In this section, we'll explore the motivations behind this feature and its benefits for testing.
Different Ways of Testing
There are different ways to test JavaScript code. Some testing frameworks simulate browser environments in Node.js, while others run tests in real browsers. In this context, jsdom is an example of a spec implementation that simulates a browser environment by being used with a test runner like Jest or Vitest, while other testing tools such as WebdriverIO or Cypress allow developers to test their applications in a real browser or in case of Playwright provide you a browser engine.
The Simulation Caveat
Testing JavaScript programs in simulated environments such as jsdom or happy-dom has simplified the test setup and provided an easy-to-use API, making them suitable for many projects and increasing confidence in test results. However, it is crucial to keep in mind that these tools only simulate a browser environment and not an actual browser, which may result in some discrepancies between the simulated environment and the real environment. Therefore, false positives or negatives in test results may occur.
To achieve the highest level of confidence in our tests, it's crucial to test in a real browser environment. This is why we developed the browser mode feature in Vitest, allowing developers to run tests natively in a browser and gain more accurate and reliable test results. With browser-level testing, developers can be more confident that their application will work as intended in a real-world scenario.
Drawbacks
When using Vitest browser, it is important to consider the following drawbacks:
Early Development
The browser mode feature of Vitest is still in its early stages of development. As such, it may not yet be fully optimized, and there may be some bugs or issues that have not yet been ironed out. It is recommended that users augment their Vitest browser experience with a standalone browser-side test runner like WebdriverIO, Cypress or Playwright.
Longer Initialization
Vitest browser requires spinning up the provider and the browser during the initialization process, which can take some time. This can result in longer initialization times compared to other testing patterns.
Suggest changes to this page
Last updated: 11/27/24, 2:46 AM
Pager
Next page
Getting Started | Browser Mode
Browser Config Reference
You can change the browser configuration by updating the test.browser field in your config file. An example of a simple config file:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        {
          browser: 'chromium',
          setupFile: './chromium-setup.js',
        },
      ],
    },
  },
})
Please, refer to the "Config Reference" article for different config examples.
WARNING
All listed options on this page are located within a test property inside the configuration:
vitest.config.js
export default defineConfig({
  test: {
    browser: {},
  },
})
browser.enabled
Type: boolean
Default: false
CLI: --browser, --browser.enabled=false
Run all tests inside a browser by default. Note that --browser only works if you have at least one browser.instances item.
browser.instances
Type: BrowserConfig
Default: [{ browser: name }]
Defines multiple browser setups. Every config has to have at least a browser field. The config supports your providers configurations:
Configuring Playwright
Configuring WebdriverIO
TIP
To have a better type safety when using built-in providers, you should reference one of these types (for provider that you are using) in your config file:
/// <reference types="@vitest/browser/providers/playwright" />
/// <reference types="@vitest/browser/providers/webdriverio" />
In addition to that, you can also specify most of the project options (not marked with a * icon) and some of the browser options like browser.testerHtmlPath.
WARNING
Every browser config inherits options from the root config:
vitest.config.ts
export default defineConfig({
  test: {
    setupFile: ['./root-setup-file.js'],
    browser: {
      enabled: true,
      testerHtmlPath: './custom-path.html',
      instances: [
        {
          // will have both setup files: "root" and "browser"
          setupFile: ['./browser-setup-file.js'],
          // implicitly has "testerHtmlPath" from the root config
          // testerHtmlPath: './custom-path.html',
        },
      ],
    },
  },
})
During development, Vitest supports only one non-headless configuration. You can limit the headed project yourself by specifying headless: false in the config, or by providing the --browser.headless=false flag, or by filtering projects with --project=chromium flag.
For more examples, refer to the "Multiple Setups" guide.
List of available browser options:
browser.headless
browser.locators
browser.viewport
browser.testerHtmlPath
browser.screenshotDirectory
browser.screenshotFailures
By default, Vitest creates an array with a single element which uses the browser.name field as a browser. Note that this behaviour will be removed with Vitest 4.
Under the hood, Vitest transforms these instances into separate test projects sharing a single Vite server for better caching performance.
browser.name deprecated
Type: string
CLI: --browser=safari
DEPRECATED
This API is deprecated an will be removed in Vitest 4. Please, use browser.instances option instead.
Run all tests in a specific browser. Possible options in different providers:
webdriverio: firefox, chrome, edge, safari
playwright: firefox, webkit, chromium
custom: any string that will be passed to the provider
browser.headless
Type: boolean
Default: process.env.CI
CLI: --browser.headless, --browser.headless=false
Run the browser in a headless mode. If you are running Vitest in CI, it will be enabled by default.
browser.isolate
Type: boolean
Default: true
CLI: --browser.isolate, --browser.isolate=false
Run every test in a separate iframe.
browser.testerHtmlPath
Type: string
A path to the HTML entry point. Can be relative to the root of the project. This file will be processed with transformIndexHtml hook.
browser.api
Type: number | { port?, strictPort?, host? }
Default: 63315
CLI: --browser.api=63315, --browser.api.port=1234, --browser.api.host=example.com
Configure options for Vite server that serves code in the browser. Does not affect test.api option. By default, Vitest assigns port 63315 to avoid conflicts with the development server, allowing you to run both in parallel.
browser.provider
Type: 'webdriverio' | 'playwright' | 'preview' | string
Default: 'preview'
CLI: --browser.provider=playwright
Path to a provider that will be used when running browser tests. Vitest provides three providers which are preview (default), webdriverio and playwright. Custom providers should be exported using default export and have this shape:
export interface BrowserProvider {
  name: string
  supportsParallelism: boolean
  getSupportedBrowsers: () => readonly string[]
  beforeCommand?: (command: string, args: unknown[]) => Awaitable<void>
  afterCommand?: (command: string, args: unknown[]) => Awaitable<void>
  getCommandsContext: (sessionId: string) => Record<string, unknown>
  openPage: (sessionId: string, url: string, beforeNavigate?: () => Promise<void>) => Promise<void>
  getCDPSession?: (sessionId: string) => Promise<CDPSession>
  close: () => Awaitable<void>
  initialize(
    ctx: TestProject,
    options: BrowserProviderInitializationOptions
  ): Awaitable<void>
}
ADVANCED API
The custom provider API is highly experimental and can change between patches. If you just need to run tests in a browser, use the browser.instances option instead.
browser.providerOptions deprecated
Type: BrowserProviderOptions
DEPRECATED
This API is deprecated an will be removed in Vitest 4. Please, use browser.instances option instead.
Options that will be passed down to provider when calling provider.initialize.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      providerOptions: {
        launch: {
          devtools: true,
        },
      },
    },
  },
})
TIP
To have a better type safety when using built-in providers, you should reference one of these types (for provider that you are using) in your config file:
/// <reference types="@vitest/browser/providers/playwright" />
/// <reference types="@vitest/browser/providers/webdriverio" />
browser.ui
Type: boolean
Default: !isCI
CLI: --browser.ui=false
Should Vitest UI be injected into the page. By default, injects UI iframe during development.
browser.viewport
Type: { width, height }
Default: 414x896
Default iframe's viewport.
browser.locators
Options for built-in browser locators.
browser.locators.testIdAttribute
Type: string
Default: data-testid
Attribute used to find elements with getByTestId locator.
browser.screenshotDirectory
Type: string
Default: __screenshots__ in the test file directory
Path to the screenshots directory relative to the root.
browser.screenshotFailures
Type: boolean
Default: !browser.ui
Should Vitest take screenshots if the test fails.
browser.orchestratorScripts
Type: BrowserScript[]
Default: []
Custom scripts that should be injected into the orchestrator HTML before test iframes are initiated. This HTML document only sets up iframes and doesn't actually import your code.
The script src and content will be processed by Vite plugins. Script should be provided in the following shape:
export interface BrowserScript {
  /**
   * If "content" is provided and type is "module", this will be its identifier.
   *
   * If you are using TypeScript, you can add `.ts` extension here for example.
   * @default `injected-${index}.js`
   */
  id?: string
  /**
   * JavaScript content to be injected. This string is processed by Vite plugins if type is "module".
   *
   * You can use `id` to give Vite a hint about the file extension.
   */
  content?: string
  /**
   * Path to the script. This value is resolved by Vite so it can be a node module or a file path.
   */
  src?: string
  /**
   * If the script should be loaded asynchronously.
   */
  async?: boolean
  /**
   * Script type.
   * @default 'module'
   */
  type?: string
}
browser.testerScripts
Type: BrowserScript[]
Default: []
DEPRECATED
This API is deprecated an will be removed in Vitest 4. Please, use browser.testerHtmlPath field instead.
Custom scripts that should be injected into the tester HTML before the tests environment is initiated. This is useful to inject polyfills required for Vitest browser implementation. It is recommended to use setupFiles in almost all cases instead of this.
The script src and content will be processed by Vite plugins.
browser.commands
Type: Record<string, BrowserCommand>
Default: { readFile, writeFile, ... }
Custom commands that can be imported during browser tests from @vitest/browser/commands.
browser.connectTimeout
Type: number
Default: 60_000
The timeout in milliseconds. If connection to the browser takes longer, the test suite will fail.
INFO
This is the time it should take for the browser to establish the WebSocket connection with the Vitest server. In normal circumstances, this timeout should never be reached.
Suggest changes to this page
Last updated: 4/18/25, 2:15 AM
Pager
Previous page
Getting Started | Browser Mode
Next page
Configuring Playwright | Browser Mode
Configuring Playwright
By default, TypeScript doesn't recognize providers options and extra expect properties. Make sure to reference @vitest/browser/providers/playwright so TypeScript can pick up definitions for custom options:
vitest.shims.d.ts
/// <reference types="@vitest/browser/providers/playwright" />
Alternatively, you can also add it to compilerOptions.types field in your tsconfig.json file. Note that specifying anything in this field will disable auto loading of @types/* packages.
tsconfig.json
{
  "compilerOptions": {
    "types": ["@vitest/browser/providers/playwright"]
  }
}
Vitest opens a single page to run all tests in the same file. You can configure the launch, connect and context properties in instances:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      instances: [
        {
          browser: 'firefox',
          launch: {},
          connect: {},
          context: {},
        },
      ],
    },
  },
})
WARNING
Before Vitest 3, these options were located on test.browser.providerOptions property:
vitest.config.ts
export default defineConfig({
  test: {
    browser: {
      providerOptions: {
        launch: {},
        context: {},
      },
    },
  },
})
providerOptions is deprecated in favour of instances.
launch
These options are directly passed down to playwright[browser].launch command. You can read more about the command and available arguments in the Playwright documentation.
WARNING
Vitest will ignore launch.headless option. Instead, use test.browser.headless.
Note that Vitest will push debugging flags to launch.args if --inspect is enabled.
connect 3.2.0+
These options are directly passed down to playwright[browser].connect command. You can read more about the command and available arguments in the Playwright documentation.
WARNING
Since this command connects to an existing Playwright server, any launch options will be ignored.
context
Vitest creates a new context for every test file by calling browser.newContext(). You can configure this behaviour by specifying custom arguments.
TIP
Note that the context is created for every test file, not every test like in playwright test runner.
WARNING
Vitest always sets ignoreHTTPSErrors to true in case your server is served via HTTPS and serviceWorkers to 'allow' to support module mocking via MSW.
It is also recommended to use test.browser.viewport instead of specifying it here as it will be lost when tests are running in headless mode.
actionTimeout 3.0.0+
Default: no timeout, 1 second before 3.0.0
This value configures the default timeout it takes for Playwright to wait until all accessibility checks pass and the action is actually done.
You can also configure the action timeout per-action:
import { page, userEvent } from '@vitest/browser/context'

await userEvent.click(page.getByRole('button'), {
  timeout: 1_000,
})
Suggest changes to this page
Last updated: 5/5/25, 9:29 AM
Pager
Previous page
Browser Config Reference | Browser Mode
Next page
Configuring WebdriverIO | Browser Mode
Configuring WebdriverIO
Playwright vs WebdriverIO
If you do not already use WebdriverIO in your project, we recommend starting with Playwright as it is easier to configure and has more flexible API.
By default, TypeScript doesn't recognize providers options and extra expect properties. Make sure to reference @vitest/browser/providers/webdriverio so TypeScript can pick up definitions for custom options:
vitest.shims.d.ts
/// <reference types="@vitest/browser/providers/webdriverio" />
Alternatively, you can also add it to compilerOptions.types field in your tsconfig.json file. Note that specifying anything in this field will disable auto loading of @types/* packages.
tsconfig.json
{
  "compilerOptions": {
    "types": ["@vitest/browser/providers/webdriverio"]
  }
}
Vitest opens a single page to run all tests in the same file. You can configure any property specified in RemoteOptions in instances:
vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      instances: [
        {
          browser: 'chrome',
          capabilities: {
            browserVersion: 86,
            platformName: 'Windows 10',
          },
        },
      ],
    },
  },
})
WARNING
Before Vitest 3, these options were located on test.browser.providerOptions property:
vitest.config.ts
export default defineConfig({
  test: {
    browser: {
      providerOptions: {
        capabilities: {},
      },
    },
  },
})
providerOptions is deprecated in favour of instances.
You can find most available options in the WebdriverIO documentation. Note that Vitest will ignore all test runner options because we only use webdriverio's browser capabilities.
TIP
Most useful options are located on capabilities object. WebdriverIO allows nested capabilities, but Vitest will ignore those options because we rely on a different mechanism to spawn several browsers.
Note that Vitest will ignore capabilities.browserName. Use test.browser.instances.name instead.
Suggest changes to this page
Last updated: 12/19/24, 7:21 AM
Pager
Previous page
Configuring Playwright | Browser Mode
Next page
Context API | Browser Mode
Context API
Vitest exposes a context module via @vitest/browser/context entry point. As of 2.0, it exposes a small set of utilities that might be useful to you in tests.
userEvent
TIP
The userEvent API is explained in detail at Interactivity API.
/**
 * Handler for user interactions. The support is implemented by the browser provider (`playwright` or `webdriverio`).
 * If used with `preview` provider, fallbacks to simulated events via `@testing-library/user-event`.
 * @experimental
 */
export const userEvent: {
  setup: () => UserEvent
  cleanup: () => Promise<void>
  click: (element: Element, options?: UserEventClickOptions) => Promise<void>
  dblClick: (element: Element, options?: UserEventDoubleClickOptions) => Promise<void>
  tripleClick: (element: Element, options?: UserEventTripleClickOptions) => Promise<void>
  selectOptions: (
    element: Element,
    values: HTMLElement | HTMLElement[] | string | string[],
    options?: UserEventSelectOptions,
  ) => Promise<void>
  keyboard: (text: string) => Promise<void>
  type: (element: Element, text: string, options?: UserEventTypeOptions) => Promise<void>
  clear: (element: Element) => Promise<void>
  tab: (options?: UserEventTabOptions) => Promise<void>
  hover: (element: Element, options?: UserEventHoverOptions) => Promise<void>
  unhover: (element: Element, options?: UserEventHoverOptions) => Promise<void>
  fill: (element: Element, text: string, options?: UserEventFillOptions) => Promise<void>
  dragAndDrop: (source: Element, target: Element, options?: UserEventDragAndDropOptions) => Promise<void>
}
commands
TIP
This API is explained in detail at Commands API.
/**
 * Available commands for the browser.
 * A shortcut to `server.commands`.
 */
export const commands: BrowserCommands
page
The page export provides utilities to interact with the current page.
WARNING
While it exposes some utilities from Playwright's page, it is not the same object. Since the browser context is evaluated in the browser, your tests don't have access to Playwright's page because it runs on the server.
Use Commands API if you need to have access to Playwright's page object.
export const page: {
  /**
   * Change the size of iframe's viewport.
   */
  viewport(width: number, height: number): Promise<void>
  /**
   * Make a screenshot of the test iframe or a specific element.
   * @returns Path to the screenshot file or path and base64.
   */
  screenshot(options: Omit<ScreenshotOptions, 'base64'> & { base64: true }): Promise<{
    path: string
    base64: string
  }>
  screenshot(options?: ScreenshotOptions): Promise<string>
  /**
   * Extend default `page` object with custom methods.
   */
  extend(methods: Partial<BrowserPage>): BrowserPage
  /**
   * Wrap an HTML element in a `Locator`. When querying for elements, the search will always return this element.
   */
  elementLocator(element: Element): Locator

  /**
   * Locator APIs. See its documentation for more details.
   */
  getByRole(role: ARIARole | string, options?: LocatorByRoleOptions): Locator
  getByLabelText(text: string | RegExp, options?: LocatorOptions): Locator
  getByTestId(text: string | RegExp): Locator
  getByAltText(text: string | RegExp, options?: LocatorOptions): Locator
  getByPlaceholder(text: string | RegExp, options?: LocatorOptions): Locator
  getByText(text: string | RegExp, options?: LocatorOptions): Locator
  getByTitle(text: string | RegExp, options?: LocatorOptions): Locator
}
TIP
The getBy* API is explained at Locators API.
WARNING 3.2.0+
Note that screenshot will always return a base64 string if save is set to false. The path is also ignored in that case.
cdp
The cdp export returns the current Chrome DevTools Protocol session. It is mostly useful to library authors to build tools on top of it.
WARNING
CDP session works only with playwright provider and only when using chromium browser. You can read more about it in playwright's CDPSession documentation.
export const cdp: () => CDPSession
server
The server export represents the Node.js environment where the Vitest server is running. It is mostly useful for debugging or limiting your tests based on the environment.
export const server: {
  /**
   * Platform the Vitest server is running on.
   * The same as calling `process.platform` on the server.
   */
  platform: Platform
  /**
   * Runtime version of the Vitest server.
   * The same as calling `process.version` on the server.
   */
  version: string
  /**
   * Name of the browser provider.
   */
  provider: string
  /**
   * Name of the current browser.
   */
  browser: string
  /**
   * Available commands for the browser.
   */
  commands: BrowserCommands
  /**
   * Serialized test config.
   */
  config: SerializedConfig
}
Suggest changes to this page
Last updated: 5/17/25, 8:44 AM
Pager
Previous page
Configuring WebdriverIO | Browser Mode
Next page
Interactivity API | Browser Mode
Interactivity API
Vitest implements a subset of @testing-library/user-event APIs using Chrome DevTools Protocol or webdriver instead of faking events which makes the browser behaviour more reliable and consistent with how users interact with a page.
import { userEvent } from '@vitest/browser/context'

await userEvent.click(document.querySelector('.button'))
Almost every userEvent method inherits its provider options. To see all available options in your IDE, add webdriver or playwright types (depending on your provider) to your setup file or a config file (depending on what is in included in your tsconfig.json):
playwright
webdriverio
/// <reference types="@vitest/browser/providers/playwright" />
userEvent.setup
function setup(): UserEvent
Creates a new user event instance. This is useful if you need to keep the state of keyboard to press and release buttons correctly.
WARNING
Unlike @testing-library/user-event, the default userEvent instance from @vitest/browser/context is created once, not every time its methods are called! You can see the difference in how it works in this snippet:
import { userEvent as vitestUserEvent } from '@vitest/browser/context'
import { userEvent as originalUserEvent } from '@testing-library/user-event'

await vitestUserEvent.keyboard('{Shift}') // press shift without releasing
await vitestUserEvent.keyboard('{/Shift}') // releases shift

await originalUserEvent.keyboard('{Shift}') // press shift without releasing
await originalUserEvent.keyboard('{/Shift}') // DID NOT release shift because the state is different
This behaviour is more useful because we do not emulate the keyboard, we actually press the Shift, so keeping the original behaviour would cause unexpected issues when typing in the field.
userEvent.click
function click(
  element: Element | Locator,
  options?: UserEventClickOptions,
): Promise<void>
Click on an element. Inherits provider's options. Please refer to your provider's documentation for detailed explanation about how this method works.
import { page, userEvent } from '@vitest/browser/context'

test('clicks on an element', async () => {
  const logo = page.getByRole('img', { name: /logo/ })

  await userEvent.click(logo)
  // or you can access it directly on the locator
  await logo.click()
})
References:
Playwright locator.click API
WebdriverIO element.click API
testing-library click API
userEvent.dblClick
function dblClick(
  element: Element | Locator,
  options?: UserEventDoubleClickOptions,
): Promise<void>
Triggers a double click event on an element.
Please refer to your provider's documentation for detailed explanation about how this method works.
import { page, userEvent } from '@vitest/browser/context'

test('triggers a double click on an element', async () => {
  const logo = page.getByRole('img', { name: /logo/ })

  await userEvent.dblClick(logo)
  // or you can access it directly on the locator
  await logo.dblClick()
})
References:
Playwright locator.dblclick API
WebdriverIO element.doubleClick API
testing-library dblClick API
userEvent.tripleClick
function tripleClick(
  element: Element | Locator,
  options?: UserEventTripleClickOptions,
): Promise<void>
Triggers a triple click event on an element. Since there is no tripleclick in browser api, this method will fire three click events in a row, and so you must check click event detail to filter the event: evt.detail === 3.
Please refer to your provider's documentation for detailed explanation about how this method works.
import { page, userEvent } from '@vitest/browser/context'

test('triggers a triple click on an element', async () => {
  const logo = page.getByRole('img', { name: /logo/ })
  let tripleClickFired = false
  logo.addEventListener('click', (evt) => {
    if (evt.detail === 3) {
      tripleClickFired = true
    }
  })

  await userEvent.tripleClick(logo)
  // or you can access it directly on the locator
  await logo.tripleClick()

  expect(tripleClickFired).toBe(true)
})
References:
Playwright locator.click API: implemented via click with clickCount: 3 .
WebdriverIO browser.action API: implemented via actions api with move plus three down + up + pause events in a row
testing-library tripleClick API
userEvent.fill
function fill(
  element: Element | Locator,
  text: string,
): Promise<void>
Set a value to the input/textarea/contenteditable field. This will remove any existing text in the input before setting the new value.
import { page, userEvent } from '@vitest/browser/context'

test('update input', async () => {
  const input = page.getByRole('input')

  await userEvent.fill(input, 'foo') // input.value == foo
  await userEvent.fill(input, '{{a[[') // input.value == {{a[[
  await userEvent.fill(input, '{Shift}') // input.value == {Shift}

  // or you can access it directly on the locator
  await input.fill('foo') // input.value == foo
})
This methods focuses the element, fills it and triggers an input event after filling. You can use an empty string to clear the field.
TIP
This API is faster than using userEvent.type or userEvent.keyboard, but it doesn't support user-event keyboard syntax (e.g., {Shift}{selectall}).
We recommend using this API over userEvent.type in situations when you don't need to enter special characters or have granular control over keypress events.
References:
Playwright locator.fill API
WebdriverIO element.setValue API
testing-library type API
userEvent.keyboard
function keyboard(text: string): Promise<void>
The userEvent.keyboard allows you to trigger keyboard strokes. If any input has a focus, it will type characters into that input. Otherwise, it will trigger keyboard events on the currently focused element (document.body if there are no focused elements).
This API supports user-event keyboard syntax.
import { userEvent } from '@vitest/browser/context'

test('trigger keystrokes', async () => {
  await userEvent.keyboard('foo') // translates to: f, o, o
  await userEvent.keyboard('{{a[[') // translates to: {, a, [
  await userEvent.keyboard('{Shift}{f}{o}{o}') // translates to: Shift, f, o, o
  await userEvent.keyboard('{a>5}') // press a without releasing it and trigger 5 keydown
  await userEvent.keyboard('{a>5/}') // press a for 5 keydown and then release it
})
References:
Playwright Keyboard API
WebdriverIO action('key') API
testing-library type API
userEvent.tab
function tab(options?: UserEventTabOptions): Promise<void>
Sends a Tab key event. This is a shorthand for userEvent.keyboard('{tab}').
import { page, userEvent } from '@vitest/browser/context'

test('tab works', async () => {
  const [input1, input2] = page.getByRole('input').elements()

  expect(input1).toHaveFocus()

  await userEvent.tab()

  expect(input2).toHaveFocus()

  await userEvent.tab({ shift: true })

  expect(input1).toHaveFocus()
})
References:
Playwright Keyboard API
WebdriverIO action('key') API
testing-library tab API
userEvent.type
function type(
  element: Element | Locator,
  text: string,
  options?: UserEventTypeOptions,
): Promise<void>
WARNING
If you don't rely on special characters (e.g., {shift} or {selectall}), it is recommended to use userEvent.fill instead for better performance.
The type method implements @testing-library/user-event's type utility built on top of keyboard API.
This function allows you to type characters into an input/textarea/contenteditable element. It supports user-event keyboard syntax.
If you just need to press characters without an input, use userEvent.keyboard API.
import { page, userEvent } from '@vitest/browser/context'

test('update input', async () => {
  const input = page.getByRole('input')

  await userEvent.type(input, 'foo') // input.value == foo
  await userEvent.type(input, '{{a[[') // input.value == foo{a[
  await userEvent.type(input, '{Shift}') // input.value == foo{a[
})
INFO
Vitest doesn't expose .type method on the locator like input.type because it exists only for compatibility with the userEvent library. Consider using .fill instead as it is faster.
References:
Playwright locator.press API
WebdriverIO action('key') API
testing-library type API
userEvent.clear
function clear(element: Element | Locator, options?: UserEventClearOptions): Promise<void>
This method clears the input element content.
import { page, userEvent } from '@vitest/browser/context'

test('clears input', async () => {
  const input = page.getByRole('input')

  await userEvent.fill(input, 'foo')
  expect(input).toHaveValue('foo')

  await userEvent.clear(input)
  // or you can access it directly on the locator
  await input.clear()

  expect(input).toHaveValue('')
})
References:
Playwright locator.clear API
WebdriverIO element.clearValue API
testing-library clear API
userEvent.selectOptions
function selectOptions(
  element: Element | Locator,
  values:
    | HTMLElement
    | HTMLElement[]
    | Locator
    | Locator[]
    | string
    | string[],
  options?: UserEventSelectOptions,
): Promise<void>
The userEvent.selectOptions allows selecting a value in a <select> element.
WARNING
If select element doesn't have multiple attribute, Vitest will select only the first element in the array.
Unlike @testing-library, Vitest doesn't support listbox at the moment, but we plan to add support for it in the future.
import { page, userEvent } from '@vitest/browser/context'

test('clears input', async () => {
  const select = page.getByRole('select')

  await userEvent.selectOptions(select, 'Option 1')
  // or you can access it directly on the locator
  await select.selectOptions('Option 1')

  expect(select).toHaveValue('option-1')

  await userEvent.selectOptions(select, 'option-1')
  expect(select).toHaveValue('option-1')

  await userEvent.selectOptions(select, [
    page.getByRole('option', { name: 'Option 1' }),
    page.getByRole('option', { name: 'Option 2' }),
  ])
  expect(select).toHaveValue(['option-1', 'option-2'])
})
WARNING
webdriverio provider doesn't support selecting multiple elements because it doesn't provide API to do so.
References:
Playwright locator.selectOption API
WebdriverIO element.selectByIndex API
testing-library selectOptions API
userEvent.hover
function hover(
  element: Element | Locator,
  options?: UserEventHoverOptions,
): Promise<void>
This method moves the cursor position to the selected element. Please refer to your provider's documentation for detailed explanation about how this method works.
WARNING
If you are using webdriverio provider, the cursor will move to the center of the element by default.
If you are using playwright provider, the cursor moves to "some" visible point of the element.
import { page, userEvent } from '@vitest/browser/context'

test('hovers logo element', async () => {
  const logo = page.getByRole('img', { name: /logo/ })

  await userEvent.hover(logo)
  // or you can access it directly on the locator
  await logo.hover()
})
References:
Playwright locator.hover API
WebdriverIO element.moveTo API
testing-library hover API
userEvent.unhover
function unhover(
  element: Element | Locator,
  options?: UserEventHoverOptions,
): Promise<void>
This works the same as userEvent.hover, but moves the cursor to the document.body element instead.
WARNING
By default, the cursor position is in "some" visible place (in playwright provider) or in the center (in webdriverio provider) of the body element, so if the currently hovered element is already in the same position, this method will have no effect.
import { page, userEvent } from '@vitest/browser/context'

test('unhover logo element', async () => {
  const logo = page.getByRole('img', { name: /logo/ })

  await userEvent.unhover(logo)
  // or you can access it directly on the locator
  await logo.unhover()
})
References:
Playwright locator.hover API
WebdriverIO element.moveTo API
testing-library hover API
userEvent.upload
function upload(
  element: Element | Locator,
  files: string[] | string | File[] | File,
  options?: UserEventUploadOptions,
): Promise<void>
Change a file input element to have the specified files.
import { page, userEvent } from '@vitest/browser/context'

test('can upload a file', async () => {
  const input = page.getByRole('button', { name: /Upload files/ })

  const file = new File(['file'], 'file.png', { type: 'image/png' })

  await userEvent.upload(input, file)
  // or you can access it directly on the locator
  await input.upload(file)

  // you can also use file paths relative to the root of the project
  await userEvent.upload(input, './fixtures/file.png')
})
WARNING
webdriverio provider supports this command only in chrome and edge browsers. It also only supports string types at the moment.
References:
Playwright locator.setInputFiles API
WebdriverIO browser.uploadFile API
testing-library upload API
userEvent.dragAndDrop
function dragAndDrop(
  source: Element | Locator,
  target: Element | Locator,
  options?: UserEventDragAndDropOptions,
): Promise<void>
Drags the source element on top of the target element. Don't forget that the source element has to have the draggable attribute set to true.
import { page, userEvent } from '@vitest/browser/context'

test('drag and drop works', async () => {
  const source = page.getByRole('img', { name: /logo/ })
  const target = page.getByTestId('logo-target')

  await userEvent.dragAndDrop(source, target)
  // or you can access it directly on the locator
  await source.dropTo(target)

  await expect.element(target).toHaveTextContent('Logo is processed')
})
WARNING
This API is not supported by the default preview provider.
References:
Playwright frame.dragAndDrop API
WebdriverIO element.dragAndDrop API
userEvent.copy
function copy(): Promise<void>
Copy the selected text to the clipboard.
import { page, userEvent } from '@vitest/browser/context'

test('copy and paste', async () => {
  // write to 'source'
  await userEvent.click(page.getByPlaceholder('source'))
  await userEvent.keyboard('hello')

  // select and copy 'source'
  await userEvent.dblClick(page.getByPlaceholder('source'))
  await userEvent.copy()

  // paste to 'target'
  await userEvent.click(page.getByPlaceholder('target'))
  await userEvent.paste()

  await expect.element(page.getByPlaceholder('source')).toHaveTextContent('hello')
  await expect.element(page.getByPlaceholder('target')).toHaveTextContent('hello')
})
References:
testing-library copy API
userEvent.cut
function cut(): Promise<void>
Cut the selected text to the clipboard.
import { page, userEvent } from '@vitest/browser/context'

test('copy and paste', async () => {
  // write to 'source'
  await userEvent.click(page.getByPlaceholder('source'))
  await userEvent.keyboard('hello')

  // select and cut 'source'
  await userEvent.dblClick(page.getByPlaceholder('source'))
  await userEvent.cut()

  // paste to 'target'
  await userEvent.click(page.getByPlaceholder('target'))
  await userEvent.paste()

  await expect.element(page.getByPlaceholder('source')).toHaveTextContent('')
  await expect.element(page.getByPlaceholder('target')).toHaveTextContent('hello')
})
References:
testing-library cut API
userEvent.paste
function paste(): Promise<void>
Paste the text from the clipboard. See userEvent.copy and userEvent.cut for usage examples.
References:
testing-library paste API
Suggest changes to this page
Last updated: 5/28/25, 8:08 AM
Pager
Previous page
Context API | Browser Mode
Next page
Locators | Browser Mode
Locators
A locator is a representation of an element or a number of elements. Every locator is defined by a string called a selector. Vitest abstracts this selector by providing convenient methods that generate them behind the scenes.
The locator API uses a fork of Playwright's locators called Ivya. However, Vitest provides this API to every provider, not just playwright.
TIP
This page covers API usage. To better understand locators and their usage, read Playwright's "Locators" documentation.
getByRole
function getByRole(
  role: ARIARole | string,
  options?: LocatorByRoleOptions,
): Locator
Creates a way to locate an element by its ARIA role, ARIA attributes and accessible name.
TIP
If you only query for a single element with getByText('The name') it's oftentimes better to use getByRole(expectedRole, { name: 'The name' }). The accessible name query does not replace other queries such as *ByAltText or *ByTitle. While the accessible name can be equal to these attributes, it does not replace the functionality of these attributes.
Consider the following DOM structure.
<h3>Sign up</h3>
<label>
  Login
  <input type="text" />
</label>
<label>
  Password
  <input type="password" />
</label>
<br/>
<button>Submit</button>
You can locate each element by its implicit role:
await expect.element(
  page.getByRole('heading', { name: 'Sign up' })
).toBeVisible()

await page.getByRole('textbox', { name: 'Login' }).fill('admin')
await page.getByRole('textbox', { name: 'Password' }).fill('admin')

await page.getByRole('button', { name: /submit/i }).click()
WARNING
Roles are matched by string equality, without inheriting from the ARIA role hierarchy. As a result, querying a superclass role like checkbox will not include elements with a subclass role like switch.
By default, many semantic elements in HTML have a role; for example, <input type="radio"> has the "radio" role. Non-semantic elements in HTML do not have a role; <div> and <span> without added semantics return null. The role attribute can provide semantics.
Providing roles via role or aria-* attributes to built-in elements that already have an implicit role is highly discouraged by ARIA guidelines.
Options
exact: boolean
Whether the name is matched exactly: case-sensitive and whole-string. Disabled by default. This option is ignored if name is a regular expression. Note that exact match still trims whitespace.
<button>Hello World</button>

page.getByRole('button', { name: 'hello world' }) // ✅
page.getByRole('button', { name: 'hello world', exact: true }) // ❌
page.getByRole('button', { name: 'Hello World', exact: true }) // ✅
checked: boolean
Should checked elements (set by aria-checked or <input type="checkbox"/>) be included or not. By default, the filter is not applied.
See aria-checked for more information
<>
  <button role="checkbox" aria-checked="true" />
  <input type="checkbox" checked />
</>

page.getByRole('checkbox', { checked: true }) // ✅
page.getByRole('checkbox', { checked: false }) // ❌
disabled: boolean
Should disabled elements be included or not. By default, the filter is not applied. Note that unlike other attributes, disable state is inherited.
See aria-disabled for more information
<input type="text" disabled />

page.getByRole('textbox', { disabled: true }) // ✅
page.getByRole('textbox', { disabled: false }) // ❌
expanded: boolean
Should expanded elements be included or not. By default, the filter is not applied.
See aria-expanded for more information
<a aria-expanded="true" href="example.com">Link</a>

page.getByRole('link', { expanded: true }) // ✅
page.getByRole('link', { expanded: false }) // ❌
includeHidden: boolean
Should elements that are normally excluded from the accessibility tree be queried. By default, only non-hidden elements are matched by role selector.
Note that roles none and presentation are always included.
<button style="display: none" />

page.getByRole('button') // ❌
page.getByRole('button', { includeHidden: false }) // ❌
page.getByRole('button', { includeHidden: true }) // ✅
level: number
A number attribute that is usually present for heading, listitem, row, treeitem roles with default values for <h1>-<h6> elements. By default, the filter is not applied.
See aria-level for more information
<>
  <h1>Heading Level One</h1>
  <div role="heading" aria-level="1">Second Heading Level One</div>
</>

page.getByRole('heading', { level: 1 }) // ✅
page.getByRole('heading', { level: 2 }) // ❌
name: string | RegExp
An accessible name. By default, matching is case-insensitive and searches for a substring. Use exact option to control this behavior.
<button>Click Me!</button>

page.getByRole('button', { name: 'Click Me!' }) // ✅
page.getByRole('button', { name: 'click me!' }) // ✅
page.getByRole('button', { name: 'Click Me?' }) // ❌
pressed: boolean
Should pressed elements be included or not. By default, the filter is not applied.
See aria-pressed for more information
<button aria-pressed="true">👍</button>

page.getByRole('button', { pressed: true }) // ✅
page.getByRole('button', { pressed: false }) // ❌
selected: boolean
Should selected elements be included or not. By default, the filter is not applied.
See aria-selected for more information
<button role="tab" aria-selected="true">Vue</button>

page.getByRole('button', { selected: true }) // ✅
page.getByRole('button', { selected: false }) // ❌
See also
List of ARIA roles at MDN
List of ARIA roles at w3.org
testing-library's ByRole
getByAltText
function getByAltText(
  text: string | RegExp,
  options?: LocatorOptions,
): Locator
Creates a locator capable of finding an element with an alt attribute that matches the text. Unlike testing-library's implementation, Vitest will match any element that has a matching alt attribute.
<img alt="Incredibles 2 Poster" src="/incredibles-2.png" />

page.getByAltText(/incredibles.*? poster/i) // ✅
page.getByAltText('non existing alt text') // ❌
Options
exact: boolean
Whether the text is matched exactly: case-sensitive and whole-string. Disabled by default. This option is ignored if text is a regular expression. Note that exact match still trims whitespace.
See also
testing-library's ByAltText
getByLabelText
function getByLabelText(
  text: string | RegExp,
  options?: LocatorOptions,
): Locator
Creates a locator capable of finding an element that has an associated label.
The page.getByLabelText('Username') locator will find every input in the example bellow:
// for/htmlFor relationship between label and form element id
<label for="username-input">Username</label>
<input id="username-input" />

// The aria-labelledby attribute with form elements
<label id="username-label">Username</label>
<input aria-labelledby="username-label" />

// Wrapper labels
<label>Username <input /></label>

// Wrapper labels where the label text is in another child element
<label>
  <span>Username</span>
  <input />
</label>

// aria-label attributes
// Take care because this is not a label that users can see on the page,
// so the purpose of your input must be obvious to visual users.
<input aria-label="Username" />
Options
exact: boolean
Whether the text is matched exactly: case-sensitive and whole-string. Disabled by default. This option is ignored if text is a regular expression. Note that exact match still trims whitespace.
See also
testing-library's ByLabelText
getByPlaceholder
function getByPlaceholder(
  text: string | RegExp,
  options?: LocatorOptions,
): Locator
Creates a locator capable of finding an element that has the specified placeholder attribute. Vitest will match any element that has a matching placeholder attribute, not just input.
<input placeholder="Username" />

page.getByPlaceholder('Username') // ✅
page.getByPlaceholder('not found') // ❌
WARNING
It is generally better to rely on a label using getByLabelText than a placeholder.
Options
exact: boolean
Whether the text is matched exactly: case-sensitive and whole-string. Disabled by default. This option is ignored if text is a regular expression. Note that exact match still trims whitespace.
See also
testing-library's ByPlaceholderText
getByText
function getByText(
  text: string | RegExp,
  options?: LocatorOptions,
): Locator
Creates a locator capable of finding an element that contains the specified text. The text will be matched against TextNode's nodeValue or input's value if the type is button or reset. Matching by text always normalizes whitespace, even with exact match. For example, it turns multiple spaces into one, turns line breaks into spaces and ignores leading and trailing whitespace.
<a href="/about">About ℹ️</a>

page.getByText(/about/i) // ✅
page.getByText('about', { exact: true }) // ❌
TIP
This locator is useful for locating non-interactive elements. If you need to locate an interactive element, like a button or an input, prefer getByRole.
Options
exact: boolean
Whether the text is matched exactly: case-sensitive and whole-string. Disabled by default. This option is ignored if text is a regular expression. Note that exact match still trims whitespace.
See also
testing-library's ByText
getByTitle
function getByTitle(
  text: string | RegExp,
  options?: LocatorOptions,
): Locator
Creates a locator capable of finding an element that has the specified title attribute. Unlike testing-library's getByTitle, Vitest cannot find title elements within an SVG.
<span title="Delete" id="2"></span>

page.getByTitle('Delete') // ✅
page.getByTitle('Create') // ❌
Options
exact: boolean
Whether the text is matched exactly: case-sensitive and whole-string. Disabled by default. This option is ignored if text is a regular expression. Note that exact match still trims whitespace.
See also
testing-library's ByTitle
getByTestId
function getByTestId(text: string | RegExp): Locator
Creates a locator capable of finding an element that matches the specified test id attribute. You can configure the attribute name with browser.locators.testIdAttribute.
<div data-testid="custom-element" />

page.getByTestId('custom-element') // ✅
page.getByTestId('non-existing-element') // ❌
WARNING
It is recommended to use this only after the other locators don't work for your use case. Using data-testid attributes does not resemble how your software is used and should be avoided if possible.
Options
exact: boolean
Whether the text is matched exactly: case-sensitive and whole-string. Disabled by default. This option is ignored if text is a regular expression. Note that exact match still trims whitespace.
See also
testing-library's ByTestId
nth
function nth(index: number): Locator
This method returns a new locator that matches only a specific index within a multi-element query result. It's zero based, nth(0) selects the first element. Unlike elements()[n], the nth locator will be retried until the element is present.
<div aria-label="one"><input/><input/><input/></div>
<div aria-label="two"><input/></div>
page.getByRole('textbox').nth(0) // ✅
page.getByRole('textbox').nth(4) // ❌
TIP
Before resorting to nth, you may find it useful to use chained locators to narrow down your search. Sometimes there is no better way to distinguish than by element position; although this can lead to flake, it's better than nothing.
page.getByLabel('two').getByRole('input') // ✅ better alternative to page.getByRole('textbox').nth(3)
page.getByLabel('one').getByRole('input') // ❌ too ambiguous
page.getByLabel('one').getByRole('input').nth(1) // ✅ pragmatic compromise
first
function first(): Locator
This method returns a new locator that matches only the first index of a multi-element query result. It is sugar for nth(0).
<input/> <input/> <input/>
page.getByRole('textbox').first() // ✅
last
function last(): Locator
This method returns a new locator that matches only the last index of a multi-element query result. It is sugar for nth(-1).
<input/> <input/> <input/>
page.getByRole('textbox').last() // ✅
and
function and(locator: Locator): Locator
This method creates a new locator that matches both the parent and provided locator. The following example finds a button with a specific title:
page.getByRole('button').and(page.getByTitle('Subscribe'))
or
function or(locator: Locator): Locator
This method creates a new locator that matches either one or both locators.
WARNING
Note that if locator matches more than a single element, calling another method might throw an error if it expects a single element:
<>
  <button>Click me</button>
  <a href="https://vitest.dev">Error happened!</a>
</>

page.getByRole('button')
  .or(page.getByRole('link'))
  .click() // ❌ matches multiple elements
filter
function filter(options: LocatorOptions): Locator
This methods narrows down the locator according to the options, such as filtering by text. It can be chained to apply multiple filters.
has
Type: Locator
This options narrows down the selector to match elements that contain other elements matching provided locator. For example, with this HTML:
<article>
  <div>Vitest</div>
</article>
<article>
  <div>Rolldown</div>
</article>
We can narrow down the locator to only find the article with Vitest text inside:
page.getByRole('article').filter({ has: page.getByText('Vitest') }) // ✅
WARNING
Provided locator (page.getByText('Vitest') in the example) must be relative to the parent locator (page.getByRole('article') in the example). It will be queried starting with the parent locator, not the document root.
Meaning, you cannot pass down a locator that queries the element outside of the parent locator:
page.getByText('Vitest').filter({ has: page.getByRole('article') }) // ❌
This example will fail because the article element is outside the element with Vitest text.
TIP
This method can be chained to narrow down the element even further:
page.getByRole('article')
  .filter({ has: page.getByRole('button', { name: 'delete row' }) })
  .filter({ has: page.getByText('Vitest') })
hasNot
Type: Locator
This option narrows down the selector to match elements that do not contain other elements matching provided locator. For example, with this HTML:
<article>
  <div>Vitest</div>
</article>
<article>
  <div>Rolldown</div>
</article>
We can narrow down the locator to only find the article that doesn't have Rolldown inside.
page.getByRole('article')
  .filter({ hasNot: page.getByText('Rolldown') }) // ✅
page.getByRole('article')
  .filter({ hasNot: page.getByText('Vitest') }) // ❌
WARNING
Note that provided locator is queried against the parent, not the document root, just like has option.
hasText
Type: string | RegExp
This options narrows down the selector to only match elements that contain provided text somewhere inside. When the string is passed, matching is case-insensitive and searches for a substring.
<article>
  <div>Vitest</div>
</article>
<article>
  <div>Rolldown</div>
</article>
Both locators will find the same element because the search is case-insensitive:
page.getByRole('article').filter({ hasText: 'Vitest' }) // ✅
page.getByRole('article').filter({ hasText: 'Vite' }) // ✅
hasNotText
Type: string | RegExp
This options narrows down the selector to only match elements that do not contain provided text somewhere inside. When the string is passed, matching is case-insensitive and searches for a substring.
Methods
All methods are asynchronous and must be awaited. Since Vitest 3, tests will fail if a method is not awaited.
click
function click(options?: UserEventClickOptions): Promise<void>
Click on an element. You can use the options to set the cursor position.
import { page } from '@vitest/browser/context'

await page.getByRole('img', { name: 'Rose' }).click()
See more at userEvent.click
dblClick
function dblClick(options?: UserEventDoubleClickOptions): Promise<void>
Triggers a double click event on an element. You can use the options to set the cursor position.
import { page } from '@vitest/browser/context'

await page.getByRole('img', { name: 'Rose' }).dblClick()
See more at userEvent.dblClick
tripleClick
function tripleClick(options?: UserEventTripleClickOptions): Promise<void>
Triggers a triple click event on an element. Since there is no tripleclick in browser api, this method will fire three click events in a row.
import { page } from '@vitest/browser/context'

await page.getByRole('img', { name: 'Rose' }).tripleClick()
See more at userEvent.tripleClick
clear
function clear(options?: UserEventClearOptions): Promise<void>
Clears the input element content.
import { page } from '@vitest/browser/context'

await page.getByRole('textbox', { name: 'Full Name' }).clear()
See more at userEvent.clear
hover
function hover(options?: UserEventHoverOptions): Promise<void>
Moves the cursor position to the selected element.
import { page } from '@vitest/browser/context'

await page.getByRole('img', { name: 'Rose' }).hover()
See more at userEvent.hover
unhover
function unhover(options?: UserEventHoverOptions): Promise<void>
This works the same as locator.hover, but moves the cursor to the document.body element instead.
import { page } from '@vitest/browser/context'

await page.getByRole('img', { name: 'Rose' }).unhover()
See more at userEvent.unhover
fill
function fill(text: string, options?: UserEventFillOptions): Promise<void>
Sets the value of the current input, textarea or contenteditable element.
import { page } from '@vitest/browser/context'

await page.getByRole('input', { name: 'Full Name' }).fill('Mr. Bean')
See more at userEvent.fill
dropTo
function dropTo(
  target: Locator,
  options?: UserEventDragAndDropOptions,
): Promise<void>
Drags the current element to the target location.
import { page } from '@vitest/browser/context'

const paris = page.getByText('Paris')
const france = page.getByText('France')

await paris.dropTo(france)
See more at userEvent.dragAndDrop
selectOptions
function selectOptions(
  values:
    | HTMLElement
    | HTMLElement[]
    | Locator
    | Locator[]
    | string
    | string[],
  options?: UserEventSelectOptions,
): Promise<void>
Choose one or more values from a <select> element.
import { page } from '@vitest/browser/context'

const languages = page.getByRole('select', { name: 'Languages' })

await languages.selectOptions('EN')
await languages.selectOptions(['ES', 'FR'])
await languages.selectOptions([
  languages.getByRole('option', { name: 'Spanish' }),
  languages.getByRole('option', { name: 'French' }),
])
See more at userEvent.selectOptions
screenshot
function screenshot(options: LocatorScreenshotOptions & { save: false }): Promise<string>
function screenshot(options: LocatorScreenshotOptions & { base64: true }): Promise<{
  path: string
  base64: string
}>
function screenshot(options?: LocatorScreenshotOptions & { base64?: false }): Promise<string>
Creates a screenshot of the element matching the locator's selector.
You can specify the save location for the screenshot using the path option, which is relative to the current test file. If the path option is not set, Vitest will default to using browser.screenshotDirectory (__screenshot__ by default), along with the names of the file and the test to determine the screenshot's filepath.
If you also need the content of the screenshot, you can specify base64: true to return it alongside the filepath where the screenshot is saved.
import { page } from '@vitest/browser/context'

const button = page.getByRole('button', { name: 'Click Me!' })

const path = await button.screenshot()

const { path, base64 } = await button.screenshot({
  path: './button-click-me.png',
  base64: true, // also return base64 string
})
// path - fullpath to the screenshot
// bas64 - base64 encoded string of the screenshot
WARNING 3.2.0+
Note that screenshot will always return a base64 string if save is set to false. The path is also ignored in that case.
query
function query(): Element | null
This method returns a single element matching the locator's selector or null if no element is found.
If multiple elements match the selector, this method will throw an error. Use .elements() when you need all matching DOM Elements or .all() if you need an array of locators matching the selector.
Consider the following DOM structure:
<div>Hello <span>World</span></div>
<div>Hello</div>
These locators will not throw an error:
page.getByText('Hello World').query() // ✅ HTMLDivElement
page.getByText('Hello Germany').query() // ✅ null
page.getByText('World').query() // ✅ HTMLSpanElement
page.getByText('Hello', { exact: true }).query() // ✅ HTMLSpanElement
These locators will throw an error:
// returns multiple elements
page.getByText('Hello').query() // ❌
page.getByText(/^Hello/).query() // ❌
element
function element(): Element
This method returns a single element matching the locator's selector.
If no element matches the selector, an error is thrown. Consider using .query() when you just need to check if the element exists.
If multiple elements match the selector, an error is thrown. Use .elements() when you need all matching DOM Elements or .all() if you need an array of locators matching the selector.
TIP
This method can be useful if you need to pass it down to an external library. It is called automatically when locator is used with expect.element every time the assertion is retried:
await expect.element(page.getByRole('button')).toBeDisabled()
Consider the following DOM structure:
<div>Hello <span>World</span></div>
<div>Hello Germany</div>
<div>Hello</div>
These locators will not throw an error:
page.getByText('Hello World').element() // ✅
page.getByText('Hello Germany').element() // ✅
page.getByText('World').element() // ✅
page.getByText('Hello', { exact: true }).element() // ✅
These locators will throw an error:
// returns multiple elements
page.getByText('Hello').element() // ❌
page.getByText(/^Hello/).element() // ❌

// returns no elements
page.getByText('Hello USA').element() // ❌
elements
function elements(): Element[]
This method returns an array of elements matching the locator's selector.
This function never throws an error. If there are no elements matching the selector, this method will return an empty array.
Consider the following DOM structure:
<div>Hello <span>World</span></div>
<div>Hello</div>
These locators will always succeed:
page.getByText('Hello World').elements() // ✅ [HTMLElement]
page.getByText('World').elements() // ✅ [HTMLElement]
page.getByText('Hello', { exact: true }).elements() // ✅ [HTMLElement]
page.getByText('Hello').element() // ✅ [HTMLElement, HTMLElement]
page.getByText('Hello USA').elements() // ✅ []
all
function all(): Locator[]
This method returns an array of new locators that match the selector.
Internally, this method calls .elements and wraps every element using page.elementLocator.
See locator.elements()
Properties
selector
The selector is a string that will be used to locate the element by the browser provider. Playwright will use a playwright locator syntax while preview and webdriverio will use CSS.
DANGER
You should not use this string in your test code. The selector string should only be used when working with the Commands API:
commands.ts
import type { BrowserCommand } from 'vitest/node'

const test: BrowserCommand<string> = function test(context, selector) {
  // playwright
  await context.iframe.locator(selector).click()
  // webdriverio
  await context.browser.$(selector).click()
}
example.test.ts
import { test } from 'vitest'
import { commands, page } from '@vitest/browser/context'

test('works correctly', async () => {
  await commands.test(page.getByText('Hello').selector) // ✅
  // vitest will automatically unwrap it to a string
  await commands.test(page.getByText('Hello')) // ✅
})
Custom Locators 3.2.0+ advanced
You can extend built-in locators API by defining an object of locator factories. These methods will exist as methods on the page object and any created locator.
These locators can be useful if built-in locators are not enough. For example, when you use a custom framework for your UI.
The locator factory needs to return a selector string or a locator itself.
TIP
The selector syntax is identical to Playwright locators. Please, read their guide to better understand how to work with them.
import { locators } from '@vitest/browser/context'

locators.extend({
  getByArticleTitle(title) {
    return `[data-title="${title}"]`
  },
  getByArticleCommentsCount(count) {
    return `.comments :text("${count} comments")`
  },
  async previewComments() {
    // you have access to the current locator via "this"
    // beware that if the method was called on `page`, `this` will be `page`,
    // not the locator!
    if (this !== page) {
      await this.click()
    }
    // ...
  }
})

// if you are using typescript, you can extend LocatorSelectors interface
// to have the autocompletion in locators.extend, page.* and locator.* methods
declare module '@vitest/browser/context' {
  interface LocatorSelectors {
    // if the custom method returns a string, it will be converted into a locator
    // if it returns anything else, then it will be returned as usual
    getByArticleTitle(title: string): Locator
    getByArticleCommentsCount(count: number): Locator

    // Vitest will return a promise and won't try to convert it into a locator
    previewComments(this: Locator): Promise<void>
  }
}
If the method is called on the global page object, then selector will be applied to the whole page. In the example bellow, getByArticleTitle will find all elements with an attribute data-title with the value of title. However, if the method is called on the locator, then it will be scoped to that locator.
<article data-title="Hello, World!">
  Hello, World!
  <button id="comments">2 comments</button>
</article>

<article data-title="Hello, Vitest!">
  Hello, Vitest!
  <button id="comments">0 comments</button>
</article>
const articles = page.getByRole('article')
const worldArticle = page.getByArticleTitle('Hello, World!') // ✅
const commentsElement = worldArticle.getByArticleCommentsCount(2) // ✅
const wrongCommentsElement = worldArticle.getByArticleCommentsCount(0) // ❌
const wrongElement = page.getByArticleTitle('No Article!') // ❌

await commentsElement.previewComments() // ✅
await wrongCommentsElement.previewComments() // ❌
Suggest changes to this page
Last updated: 5/25/25, 9:51 PM
Pager
Previous page
Interactivity API | Browser Mode
Next page
Assertion API | Browser Mode
Assertion API
Vitest provides a wide range of DOM assertions out of the box forked from @testing-library/jest-dom library with the added support for locators and built-in retry-ability.
TypeScript Support
If you are using TypeScript or want to have correct type hints in expect, make sure you have @vitest/browser/context referenced somewhere. If you never imported from there, you can add a reference comment in any file that's covered by your tsconfig.json:
/// <reference types="@vitest/browser/context" />
Tests in the browser might fail inconsistently due to their asynchronous nature. Because of this, it is important to have a way to guarantee that assertions succeed even if the condition is delayed (by a timeout, network request, or animation, for example). For this purpose, Vitest provides retriable assertions out of the box via the expect.poll and expect.element APIs:
import { expect, test } from 'vitest'
import { page } from '@vitest/browser/context'

test('error banner is rendered', async () => {
  triggerError()

  // This creates a locator that will try to find the element
  // when any of its methods are called.
  // This call by itself doesn't check the existence of the element.
  const banner = page.getByRole('alert', {
    name: /error/i,
  })

  // Vitest provides `expect.element` with built-in retry-ability
  // It will repeatedly check that the element exists in the DOM and that
  // the content of `element.textContent` is equal to "Error!"
  // until all the conditions are met
  await expect.element(banner).toHaveTextContent('Error!')
})
We recommend to always use expect.element when working with page.getBy* locators to reduce test flakiness. Note that expect.element accepts a second option:
interface ExpectPollOptions {
  // The interval to retry the assertion for in milliseconds
  // Defaults to "expect.poll.interval" config option
  interval?: number
  // Time to retry the assertion for in milliseconds
  // Defaults to "expect.poll.timeout" config option
  timeout?: number
  // The message printed when the assertion fails
  message?: string
}
TIP
expect.element is a shorthand for expect.poll(() => element) and works in exactly the same way.
toHaveTextContent and all other assertions are still available on a regular expect without a built-in retry-ability mechanism:
// will fail immediately if .textContent is not `'Error!'`
expect(banner).toHaveTextContent('Error!')
toBeDisabled
function toBeDisabled(): Promise<void>
Allows you to check whether an element is disabled from the user's perspective.
Matches if the element is a form control and the disabled attribute is specified on this element or the element is a descendant of a form element with a disabled attribute.
Note that only native control elements such as HTML button, input, select, textarea, option, optgroup can be disabled by setting "disabled" attribute. "disabled" attribute on other elements is ignored, unless it's a custom element.
<button
  data-testid="button"
  type="submit"
  disabled
>
  submit
</button>
await expect.element(getByTestId('button')).toBeDisabled() // ✅
await expect.element(getByTestId('button')).not.toBeDisabled() // ❌
toBeEnabled
function toBeEnabled(): Promise<void>
Allows you to check whether an element is not disabled from the user's perspective.
Works like not.toBeDisabled(). Use this matcher to avoid double negation in your tests.
<button
  data-testid="button"
  type="submit"
  disabled
>
  submit
</button>
await expect.element(getByTestId('button')).toBeEnabled() // ✅
await expect.element(getByTestId('button')).not.toBeEnabled() // ❌
toBeEmptyDOMElement
function toBeEmptyDOMElement(): Promise<void>
This allows you to assert whether an element has no visible content for the user. It ignores comments but will fail if the element contains white-space.
<span data-testid="not-empty"><span data-testid="empty"></span></span>
<span data-testid="with-whitespace"> </span>
<span data-testid="with-comment"><!-- comment --></span>
await expect.element(getByTestId('empty')).toBeEmptyDOMElement()
await expect.element(getByTestId('not-empty')).not.toBeEmptyDOMElement()
await expect.element(
  getByTestId('with-whitespace')
).not.toBeEmptyDOMElement()
toBeInTheDocument
function toBeInTheDocument(): Promise<void>
Assert whether an element is present in the document or not.
<svg data-testid="svg-element"></svg>
await expect.element(getByTestId('svg-element')).toBeInTheDocument()
await expect.element(getByTestId('does-not-exist')).not.toBeInTheDocument()
WARNING
This matcher does not find detached elements. The element must be added to the document to be found by toBeInTheDocument. If you desire to search in a detached element, please use: toContainElement.
toBeInvalid
function toBeInvalid(): Promise<void>
This allows you to check if an element, is currently invalid.
An element is invalid if it has an aria-invalid attribute with no value or a value of "true", or if the result of checkValidity() is false.
<input data-testid="no-aria-invalid" />
<input data-testid="aria-invalid" aria-invalid />
<input data-testid="aria-invalid-value" aria-invalid="true" />
<input data-testid="aria-invalid-false" aria-invalid="false" />

<form data-testid="valid-form">
  <input />
</form>

<form data-testid="invalid-form">
  <input required />
</form>
await expect.element(getByTestId('no-aria-invalid')).not.toBeInvalid()
await expect.element(getByTestId('aria-invalid')).toBeInvalid()
await expect.element(getByTestId('aria-invalid-value')).toBeInvalid()
await expect.element(getByTestId('aria-invalid-false')).not.toBeInvalid()

await expect.element(getByTestId('valid-form')).not.toBeInvalid()
await expect.element(getByTestId('invalid-form')).toBeInvalid()
toBeRequired
function toBeRequired(): Promise<void>
This allows you to check if a form element is currently required.
An element is required if it is having a required or aria-required="true" attribute.
<input data-testid="required-input" required />
<input data-testid="aria-required-input" aria-required="true" />
<input data-testid="conflicted-input" required aria-required="false" />
<input data-testid="aria-not-required-input" aria-required="false" />
<input data-testid="optional-input" />
<input data-testid="unsupported-type" type="image" required />
<select data-testid="select" required></select>
<textarea data-testid="textarea" required></textarea>
<div data-testid="supported-role" role="tree" required></div>
<div data-testid="supported-role-aria" role="tree" aria-required="true"></div>
await expect.element(getByTestId('required-input')).toBeRequired()
await expect.element(getByTestId('aria-required-input')).toBeRequired()
await expect.element(getByTestId('conflicted-input')).toBeRequired()
await expect.element(getByTestId('aria-not-required-input')).not.toBeRequired()
await expect.element(getByTestId('optional-input')).not.toBeRequired()
await expect.element(getByTestId('unsupported-type')).not.toBeRequired()
await expect.element(getByTestId('select')).toBeRequired()
await expect.element(getByTestId('textarea')).toBeRequired()
await expect.element(getByTestId('supported-role')).not.toBeRequired()
await expect.element(getByTestId('supported-role-aria')).toBeRequired()
toBeValid
function toBeValid(): Promise<void>
This allows you to check if the value of an element, is currently valid.
An element is valid if it has no aria-invalid attribute or an attribute value of "false". The result of checkValidity() must also be true if it's a form element.
<input data-testid="no-aria-invalid" />
<input data-testid="aria-invalid" aria-invalid />
<input data-testid="aria-invalid-value" aria-invalid="true" />
<input data-testid="aria-invalid-false" aria-invalid="false" />

<form data-testid="valid-form">
  <input />
</form>

<form data-testid="invalid-form">
  <input required />
</form>
await expect.element(getByTestId('no-aria-invalid')).toBeValid()
await expect.element(getByTestId('aria-invalid')).not.toBeValid()
await expect.element(getByTestId('aria-invalid-value')).not.toBeValid()
await expect.element(getByTestId('aria-invalid-false')).toBeValid()

await expect.element(getByTestId('valid-form')).toBeValid()
await expect.element(getByTestId('invalid-form')).not.toBeValid()
toBeVisible
function toBeVisible(): Promise<void>
This allows you to check if an element is currently visible to the user.
Element is considered visible when it has non-empty bounding box and does not have visibility:hidden computed style.
Note that according to this definition:
Elements of zero size are not considered visible.
Elements with display:none are not considered visible.
Elements with opacity:0 are considered visible.
To check that at least one element from the list is visible, use locator.first().
// A specific element is visible.
await expect.element(page.getByText('Welcome')).toBeVisible()

// At least one item in the list is visible.
await expect.element(page.getByTestId('todo-item').first()).toBeVisible()

// At least one of the two elements is visible, possibly both.
await expect.element(
  page.getByRole('button', { name: 'Sign in' })
    .or(page.getByRole('button', { name: 'Sign up' }))
    .first()
).toBeVisible()
toContainElement
function toContainElement(element: HTMLElement | SVGElement | null): Promise<void>
This allows you to assert whether an element contains another element as a descendant or not.
<span data-testid="ancestor"><span data-testid="descendant"></span></span>
const ancestor = getByTestId('ancestor')
const descendant = getByTestId('descendant')
const nonExistantElement = getByTestId('does-not-exist')

await expect.element(ancestor).toContainElement(descendant)
await expect.element(descendant).not.toContainElement(ancestor)
await expect.element(ancestor).not.toContainElement(nonExistantElement)
toContainHTML
function toContainHTML(htmlText: string): Promise<void>
Assert whether a string representing a HTML element is contained in another element. The string should contain valid html, and not any incomplete html.
<span data-testid="parent"><span data-testid="child"></span></span>
// These are valid usages
await expect.element(getByTestId('parent')).toContainHTML('<span data-testid="child"></span>')
await expect.element(getByTestId('parent')).toContainHTML('<span data-testid="child" />')
await expect.element(getByTestId('parent')).not.toContainHTML('<br />')

// These won't work
await expect.element(getByTestId('parent')).toContainHTML('data-testid="child"')
await expect.element(getByTestId('parent')).toContainHTML('data-testid')
await expect.element(getByTestId('parent')).toContainHTML('</span>')
WARNING
Chances are you probably do not need to use this matcher. We encourage testing from the perspective of how the user perceives the app in a browser. That's why testing against a specific DOM structure is not advised.
It could be useful in situations where the code being tested renders html that was obtained from an external source, and you want to validate that that html code was used as intended.
It should not be used to check DOM structure that you control. Please, use toContainElement instead.
toHaveAccessibleDescription
function toHaveAccessibleDescription(description?: string | RegExp): Promise<void>
This allows you to assert that an element has the expected accessible description.
You can pass the exact string of the expected accessible description, or you can make a partial match passing a regular expression, or by using expect.stringContaining or expect.stringMatching.
<a
  data-testid="link"
  href="/"
  aria-label="Home page"
  title="A link to start over"
  >Start</a
>
<a data-testid="extra-link" href="/about" aria-label="About page">About</a>
<img src="avatar.jpg" data-testid="avatar" alt="User profile pic" />
<img
  src="logo.jpg"
  data-testid="logo"
  alt="Company logo"
  aria-describedby="t1"
/>
<span id="t1" role="presentation">The logo of Our Company</span>
<img
  src="logo.jpg"
  data-testid="logo2"
  alt="Company logo"
  aria-description="The logo of Our Company"
/>
await expect.element(getByTestId('link')).toHaveAccessibleDescription()
await expect.element(getByTestId('link')).toHaveAccessibleDescription('A link to start over')
await expect.element(getByTestId('link')).not.toHaveAccessibleDescription('Home page')
await expect.element(getByTestId('extra-link')).not.toHaveAccessibleDescription()
await expect.element(getByTestId('avatar')).not.toHaveAccessibleDescription()
await expect.element(getByTestId('logo')).not.toHaveAccessibleDescription('Company logo')
await expect.element(getByTestId('logo')).toHaveAccessibleDescription(
  'The logo of Our Company',
)
await expect.element(getByTestId('logo2')).toHaveAccessibleDescription(
  'The logo of Our Company',
)
toHaveAccessibleErrorMessage
function toHaveAccessibleErrorMessage(message?: string | RegExp): Promise<void>
This allows you to assert that an element has the expected accessible error message.
You can pass the exact string of the expected accessible error message. Alternatively, you can perform a partial match by passing a regular expression or by using expect.stringContaining or expect.stringMatching.
<input
  aria-label="Has Error"
  aria-invalid="true"
  aria-errormessage="error-message"
/>
<div id="error-message" role="alert">This field is invalid</div>

<input aria-label="No Error Attributes" />
<input
  aria-label="Not Invalid"
  aria-invalid="false"
  aria-errormessage="error-message"
/>
// Inputs with Valid Error Messages
await expect.element(getByRole('textbox', { name: 'Has Error' })).toHaveAccessibleErrorMessage()
await expect.element(getByRole('textbox', { name: 'Has Error' })).toHaveAccessibleErrorMessage(
  'This field is invalid',
)
await expect.element(getByRole('textbox', { name: 'Has Error' })).toHaveAccessibleErrorMessage(
  /invalid/i,
)
await expect.element(
  getByRole('textbox', { name: 'Has Error' }),
).not.toHaveAccessibleErrorMessage('This field is absolutely correct!')

// Inputs without Valid Error Messages
await expect.element(
  getByRole('textbox', { name: 'No Error Attributes' }),
).not.toHaveAccessibleErrorMessage()

await expect.element(
  getByRole('textbox', { name: 'Not Invalid' }),
).not.toHaveAccessibleErrorMessage()
toHaveAccessibleName
function toHaveAccessibleName(name?: string | RegExp): Promise<void>
This allows you to assert that an element has the expected accessible name. It is useful, for instance, to assert that form elements and buttons are properly labelled.
You can pass the exact string of the expected accessible name, or you can make a partial match passing a regular expression, or by using expect.stringContaining or expect.stringMatching.
<img data-testid="img-alt" src="" alt="Test alt" />
<img data-testid="img-empty-alt" src="" alt="" />
<svg data-testid="svg-title"><title>Test title</title></svg>
<button data-testid="button-img-alt"><img src="" alt="Test" /></button>
<p><img data-testid="img-paragraph" src="" alt="" /> Test content</p>
<button data-testid="svg-button"><svg><title>Test</title></svg></p>
<div><svg data-testid="svg-without-title"></svg></div>
<input data-testid="input-title" title="test" />
await expect.element(getByTestId('img-alt')).toHaveAccessibleName('Test alt')
await expect.element(getByTestId('img-empty-alt')).not.toHaveAccessibleName()
await expect.element(getByTestId('svg-title')).toHaveAccessibleName('Test title')
await expect.element(getByTestId('button-img-alt')).toHaveAccessibleName()
await expect.element(getByTestId('img-paragraph')).not.toHaveAccessibleName()
await expect.element(getByTestId('svg-button')).toHaveAccessibleName()
await expect.element(getByTestId('svg-without-title')).not.toHaveAccessibleName()
await expect.element(getByTestId('input-title')).toHaveAccessibleName()
toHaveAttribute
function toHaveAttribute(attribute: string, value?: unknown): Promise<void>
This allows you to check whether the given element has an attribute or not. You can also optionally check that the attribute has a specific expected value or partial match using expect.stringContaining or expect.stringMatching.
<button data-testid="ok-button" type="submit" disabled>ok</button>
const button = getByTestId('ok-button')

await expect.element(button).toHaveAttribute('disabled')
await expect.element(button).toHaveAttribute('type', 'submit')
await expect.element(button).not.toHaveAttribute('type', 'button')

await expect.element(button).toHaveAttribute(
  'type',
  expect.stringContaining('sub')
)
await expect.element(button).toHaveAttribute(
  'type',
  expect.not.stringContaining('but')
)
toHaveClass
function toHaveClass(...classNames: string[], options?: { exact: boolean }): Promise<void>
function toHaveClass(...classNames: (string | RegExp)[]): Promise<void>
This allows you to check whether the given element has certain classes within its class attribute. You must provide at least one class, unless you are asserting that an element does not have any classes.
The list of class names may include strings and regular expressions. Regular expressions are matched against each individual class in the target element, and it is NOT matched against its full class attribute value as whole.
WARNING
Note that you cannot use exact: true option when only regular expressions are provided.
<button data-testid="delete-button" class="btn extra btn-danger">
  Delete item
</button>
<button data-testid="no-classes">No Classes</button>
const deleteButton = getByTestId('delete-button')
const noClasses = getByTestId('no-classes')

await expect.element(deleteButton).toHaveClass('extra')
await expect.element(deleteButton).toHaveClass('btn-danger btn')
await expect.element(deleteButton).toHaveClass(/danger/, 'btn')
await expect.element(deleteButton).toHaveClass('btn-danger', 'btn')
await expect.element(deleteButton).not.toHaveClass('btn-link')
await expect.element(deleteButton).not.toHaveClass(/link/)

// ⚠️ regexp matches against individual classes, not the whole classList
await expect.element(deleteButton).not.toHaveClass(/btn extra/)

// the element has EXACTLY a set of classes (in any order)
await expect.element(deleteButton).toHaveClass('btn-danger extra btn', {
  exact: true
})
// if it has more than expected it is going to fail
await expect.element(deleteButton).not.toHaveClass('btn-danger extra', {
  exact: true
})

await expect.element(noClasses).not.toHaveClass()
toHaveFocus
function toHaveFocus(): Promise<void>
This allows you to assert whether an element has focus or not.
<div><input type="text" data-testid="element-to-focus" /></div>
const input = page.getByTestId('element-to-focus')
input.element().focus()
await expect.element(input).toHaveFocus()
input.element().blur()
await expect.element(input).not.toHaveFocus()
toHaveFormValues
function toHaveFormValues(expectedValues: Record<string, unknown>): Promise<void>
This allows you to check if a form or fieldset contains form controls for each given name, and having the specified value.
TIP
It is important to stress that this matcher can only be invoked on a form or a fieldset element.
This allows it to take advantage of the .elements property in form and fieldset to reliably fetch all form controls within them.
This also avoids the possibility that users provide a container that contains more than one form, thereby intermixing form controls that are not related, and could even conflict with one another.
This matcher abstracts away the particularities with which a form control value is obtained depending on the type of form control. For instance, <input> elements have a value attribute, but <select> elements do not. Here's a list of all cases covered:
<input type="number"> elements return the value as a number, instead of a string.
<input type="checkbox"> elements:
if there's a single one with the given name attribute, it is treated as a boolean, returning true if the checkbox is checked, false if unchecked.
if there's more than one checkbox with the same name attribute, they are all treated collectively as a single form control, which returns the value as an array containing all the values of the selected checkboxes in the collection.
<input type="radio"> elements are all grouped by the name attribute, and such a group treated as a single form control. This form control returns the value as a string corresponding to the value attribute of the selected radio button within the group.
<input type="text"> elements return the value as a string. This also applies to <input> elements having any other possible type attribute that's not explicitly covered in different rules above (e.g. search, email, date, password, hidden, etc.)
<select> elements without the multiple attribute return the value as a string corresponding to the value attribute of the selected option, or undefined if there's no selected option.
<select multiple> elements return the value as an array containing all the values of the selected options.
<textarea> elements return their value as a string. The value corresponds to their node content.
The above rules make it easy, for instance, to switch from using a single select control to using a group of radio buttons. Or to switch from a multi select control, to using a group of checkboxes. The resulting set of form values used by this matcher to compare against would be the same.
<form data-testid="login-form">
  <input type="text" name="username" value="jane.doe" />
  <input type="password" name="password" value="12345678" />
  <input type="checkbox" name="rememberMe" checked />
  <button type="submit">Sign in</button>
</form>
await expect.element(getByTestId('login-form')).toHaveFormValues({
  username: 'jane.doe',
  rememberMe: true,
})
toHaveStyle
function toHaveStyle(css: string | Partial<CSSStyleDeclaration>): Promise<void>
This allows you to check if a certain element has some specific css properties with specific values applied. It matches only if the element has all the expected properties applied, not just some of them.
<button
  data-testid="delete-button"
  style="display: none; background-color: red"
>
  Delete item
</button>
const button = getByTestId('delete-button')

await expect.element(button).toHaveStyle('display: none')
await expect.element(button).toHaveStyle({ display: 'none' })
await expect.element(button).toHaveStyle(`
  background-color: red;
  display: none;
`)
await expect.element(button).toHaveStyle({
  backgroundColor: 'red',
  display: 'none',
})
await expect.element(button).not.toHaveStyle(`
  background-color: blue;
  display: none;
`)
await expect.element(button).not.toHaveStyle({
  backgroundColor: 'blue',
  display: 'none',
})
This also works with rules that are applied to the element via a class name for which some rules are defined in a stylesheet currently active in the document. The usual rules of css precedence apply.
toHaveTextContent
function toHaveTextContent(
  text: string | RegExp,
  options?: { normalizeWhitespace: boolean }
): Promise<void>
This allows you to check whether the given node has a text content or not. This supports elements, but also text nodes and fragments.
When a string argument is passed through, it will perform a partial case-sensitive match to the node content.
To perform a case-insensitive match, you can use a RegExp with the /i modifier.
If you want to match the whole content, you can use a RegExp to do it.
<span data-testid="text-content">Text Content</span>
const element = getByTestId('text-content')

await expect.element(element).toHaveTextContent('Content')
// to match the whole content
await expect.element(element).toHaveTextContent(/^Text Content$/)
// to use case-insensitive match
await expect.element(element).toHaveTextContent(/content$/i)
await expect.element(element).not.toHaveTextContent('content')
toHaveValue
function toHaveValue(value: string | string[] | number | null): Promise<void>
This allows you to check whether the given form element has the specified value. It accepts <input>, <select> and <textarea> elements with the exception of <input type="checkbox"> and <input type="radio">, which can be meaningfully matched only using toBeChecked or toHaveFormValues.
It also accepts elements with roles meter, progressbar, slider or spinbutton and checks their aria-valuenow attribute (as a number).
For all other form elements, the value is matched using the same algorithm as in toHaveFormValues does.
<input type="text" value="text" data-testid="input-text" />
<input type="number" value="5" data-testid="input-number" />
<input type="text" data-testid="input-empty" />
<select multiple data-testid="select-number">
  <option value="first">First Value</option>
  <option value="second" selected>Second Value</option>
  <option value="third" selected>Third Value</option>
</select>
const textInput = getByTestId('input-text')
const numberInput = getByTestId('input-number')
const emptyInput = getByTestId('input-empty')
const selectInput = getByTestId('select-number')

await expect.element(textInput).toHaveValue('text')
await expect.element(numberInput).toHaveValue(5)
await expect.element(emptyInput).not.toHaveValue()
await expect.element(selectInput).toHaveValue(['second', 'third'])
toHaveDisplayValue
function toHaveDisplayValue(
  value: string | RegExp | (string | RegExp)[]
): Promise<void>
This allows you to check whether the given form element has the specified displayed value (the one the end user will see). It accepts <input>, <select> and <textarea> elements with the exception of <input type="checkbox"> and <input type="radio">, which can be meaningfully matched only using toBeChecked or toHaveFormValues.
<label for="input-example">First name</label>
<input type="text" id="input-example" value="Luca" />

<label for="textarea-example">Description</label>
<textarea id="textarea-example">An example description here.</textarea>

<label for="single-select-example">Fruit</label>
<select id="single-select-example">
  <option value="">Select a fruit...</option>
  <option value="banana">Banana</option>
  <option value="ananas">Ananas</option>
  <option value="avocado">Avocado</option>
</select>

<label for="multiple-select-example">Fruits</label>
<select id="multiple-select-example" multiple>
  <option value="">Select a fruit...</option>
  <option value="banana" selected>Banana</option>
  <option value="ananas">Ananas</option>
  <option value="avocado" selected>Avocado</option>
</select>
const input = page.getByLabelText('First name')
const textarea = page.getByLabelText('Description')
const selectSingle = page.getByLabelText('Fruit')
const selectMultiple = page.getByLabelText('Fruits')

await expect.element(input).toHaveDisplayValue('Luca')
await expect.element(input).toHaveDisplayValue(/Luc/)
await expect.element(textarea).toHaveDisplayValue('An example description here.')
await expect.element(textarea).toHaveDisplayValue(/example/)
await expect.element(selectSingle).toHaveDisplayValue('Select a fruit...')
await expect.element(selectSingle).toHaveDisplayValue(/Select/)
await expect.element(selectMultiple).toHaveDisplayValue([/Avocado/, 'Banana'])
toBeChecked
function toBeChecked(): Promise<void>
This allows you to check whether the given element is checked. It accepts an input of type checkbox or radio and elements with a role of checkbox, radio or switch with a valid aria-checked attribute of "true" or "false".
<input type="checkbox" checked data-testid="input-checkbox-checked" />
<input type="checkbox" data-testid="input-checkbox-unchecked" />
<div role="checkbox" aria-checked="true" data-testid="aria-checkbox-checked" />
<div
  role="checkbox"
  aria-checked="false"
  data-testid="aria-checkbox-unchecked"
/>

<input type="radio" checked value="foo" data-testid="input-radio-checked" />
<input type="radio" value="foo" data-testid="input-radio-unchecked" />
<div role="radio" aria-checked="true" data-testid="aria-radio-checked" />
<div role="radio" aria-checked="false" data-testid="aria-radio-unchecked" />
<div role="switch" aria-checked="true" data-testid="aria-switch-checked" />
<div role="switch" aria-checked="false" data-testid="aria-switch-unchecked" />
const inputCheckboxChecked = getByTestId('input-checkbox-checked')
const inputCheckboxUnchecked = getByTestId('input-checkbox-unchecked')
const ariaCheckboxChecked = getByTestId('aria-checkbox-checked')
const ariaCheckboxUnchecked = getByTestId('aria-checkbox-unchecked')
await expect.element(inputCheckboxChecked).toBeChecked()
await expect.element(inputCheckboxUnchecked).not.toBeChecked()
await expect.element(ariaCheckboxChecked).toBeChecked()
await expect.element(ariaCheckboxUnchecked).not.toBeChecked()

const inputRadioChecked = getByTestId('input-radio-checked')
const inputRadioUnchecked = getByTestId('input-radio-unchecked')
const ariaRadioChecked = getByTestId('aria-radio-checked')
const ariaRadioUnchecked = getByTestId('aria-radio-unchecked')
await expect.element(inputRadioChecked).toBeChecked()
await expect.element(inputRadioUnchecked).not.toBeChecked()
await expect.element(ariaRadioChecked).toBeChecked()
await expect.element(ariaRadioUnchecked).not.toBeChecked()

const ariaSwitchChecked = getByTestId('aria-switch-checked')
const ariaSwitchUnchecked = getByTestId('aria-switch-unchecked')
await expect.element(ariaSwitchChecked).toBeChecked()
await expect.element(ariaSwitchUnchecked).not.toBeChecked()
toBePartiallyChecked
function toBePartiallyChecked(): Promise<void>
This allows you to check whether the given element is partially checked. It accepts an input of type checkbox and elements with a role of checkbox with a aria-checked="mixed", or input of type checkbox with indeterminate set to true
<input type="checkbox" aria-checked="mixed" data-testid="aria-checkbox-mixed" />
<input type="checkbox" checked data-testid="input-checkbox-checked" />
<input type="checkbox" data-testid="input-checkbox-unchecked" />
<div role="checkbox" aria-checked="true" data-testid="aria-checkbox-checked" />
<div
  role="checkbox"
  aria-checked="false"
  data-testid="aria-checkbox-unchecked"
/>
<input type="checkbox" data-testid="input-checkbox-indeterminate" />
const ariaCheckboxMixed = getByTestId('aria-checkbox-mixed')
const inputCheckboxChecked = getByTestId('input-checkbox-checked')
const inputCheckboxUnchecked = getByTestId('input-checkbox-unchecked')
const ariaCheckboxChecked = getByTestId('aria-checkbox-checked')
const ariaCheckboxUnchecked = getByTestId('aria-checkbox-unchecked')
const inputCheckboxIndeterminate = getByTestId('input-checkbox-indeterminate')

await expect.element(ariaCheckboxMixed).toBePartiallyChecked()
await expect.element(inputCheckboxChecked).not.toBePartiallyChecked()
await expect.element(inputCheckboxUnchecked).not.toBePartiallyChecked()
await expect.element(ariaCheckboxChecked).not.toBePartiallyChecked()
await expect.element(ariaCheckboxUnchecked).not.toBePartiallyChecked()

inputCheckboxIndeterminate.element().indeterminate = true
await expect.element(inputCheckboxIndeterminate).toBePartiallyChecked()
toHaveRole
function toHaveRole(role: ARIARole): Promise<void>
This allows you to assert that an element has the expected role.
This is useful in cases where you already have access to an element via some query other than the role itself, and want to make additional assertions regarding its accessibility.
The role can match either an explicit role (via the role attribute), or an implicit one via the implicit ARIA semantics.
<button data-testid="button">Continue</button>
<div role="button" data-testid="button-explicit">Continue</button>
<button role="switch button" data-testid="button-explicit-multiple">Continue</button>
<a href="/about" data-testid="link">About</a>
<a data-testid="link-invalid">Invalid link<a/>
await expect.element(getByTestId('button')).toHaveRole('button')
await expect.element(getByTestId('button-explicit')).toHaveRole('button')
await expect.element(getByTestId('button-explicit-multiple')).toHaveRole('button')
await expect.element(getByTestId('button-explicit-multiple')).toHaveRole('switch')
await expect.element(getByTestId('link')).toHaveRole('link')
await expect.element(getByTestId('link-invalid')).not.toHaveRole('link')
await expect.element(getByTestId('link-invalid')).toHaveRole('generic')
WARNING
Roles are matched literally by string equality, without inheriting from the ARIA role hierarchy. As a result, querying a superclass role like checkbox will not include elements with a subclass role like switch.
Also note that unlike testing-library, Vitest ignores all custom roles except the first valid one, following Playwright's behaviour:
<div data-testid="switch" role="switch alert"></div>

await expect.element(getByTestId('switch')).toHaveRole('switch') // ✅
await expect.element(getByTestId('switch')).toHaveRole('alert') // ❌
toHaveSelection
function toHaveSelection(selection?: string): Promise<void>
This allows to assert that an element has a text selection.
This is useful to check if text or part of the text is selected within an element. The element can be either an input of type text, a textarea, or any other element that contains text, such as a paragraph, span, div etc.
WARNING
The expected selection is a string, it does not allow to check for selection range indeces.
<div>
  <input type="text" value="text selected text" data-testid="text" />
  <textarea data-testid="textarea">text selected text</textarea>
  <p data-testid="prev">prev</p>
  <p data-testid="parent">
    text <span data-testid="child">selected</span> text
  </p>
  <p data-testid="next">next</p>
</div>
getByTestId('text').element().setSelectionRange(5, 13)
await expect.element(getByTestId('text')).toHaveSelection('selected')

getByTestId('textarea').element().setSelectionRange(0, 5)
await expect.element('textarea').toHaveSelection('text ')

const selection = document.getSelection()
const range = document.createRange()
selection.removeAllRanges()
selection.empty()
selection.addRange(range)

// selection of child applies to the parent as well
range.selectNodeContents(getByTestId('child').element())
await expect.element(getByTestId('child')).toHaveSelection('selected')
await expect.element(getByTestId('parent')).toHaveSelection('selected')

// selection that applies from prev all, parent text before child, and part child.
range.setStart(getByTestId('prev').element(), 0)
range.setEnd(getByTestId('child').element().childNodes[0], 3)
await expect.element(queryByTestId('prev')).toHaveSelection('prev')
await expect.element(queryByTestId('child')).toHaveSelection('sel')
await expect.element(queryByTestId('parent')).toHaveSelection('text sel')
await expect.element(queryByTestId('next')).not.toHaveSelection()

// selection that applies from part child, parent text after child and part next.
range.setStart(getByTestId('child').element().childNodes[0], 3)
range.setEnd(getByTestId('next').element().childNodes[0], 2)
await expect.element(queryByTestId('child')).toHaveSelection('ected')
await expect.element(queryByTestId('parent')).toHaveSelection('ected text')
await expect.element(queryByTestId('prev')).not.toHaveSelection()
await expect.element(queryByTestId('next')).toHaveSelection('ne')
Suggest changes to this page
Last updated: 3/26/25, 4:07 AM
Pager
Previous page
Locators | Browser Mode
Next page
Commands | Browser Mode
Commands
Command is a function that invokes another function on the server and passes down the result back to the browser. Vitest exposes several built-in commands you can use in your browser tests.
Built-in Commands
Files Handling
You can use the readFile, writeFile, and removeFile APIs to handle files in your browser tests. Since Vitest 3.2, all paths are resolved relative to the project root (which is process.cwd(), unless overriden manually). Previously, paths were resolved relative to the test file.
By default, Vitest uses utf-8 encoding but you can override it with options.
TIP
This API follows server.fs limitations for security reasons.
import { server } from '@vitest/browser/context'

const { readFile, writeFile, removeFile } = server.commands

it('handles files', async () => {
  const file = './test.txt'

  await writeFile(file, 'hello world')
  const content = await readFile(file)

  expect(content).toBe('hello world')

  await removeFile(file)
})
CDP Session
Vitest exposes access to raw Chrome Devtools Protocol via the cdp method exported from @vitest/browser/context. It is mostly useful to library authors to build tools on top of it.
import { cdp } from '@vitest/browser/context'

const input = document.createElement('input')
document.body.appendChild(input)
input.focus()

await cdp().send('Input.dispatchKeyEvent', {
  type: 'keyDown',
  text: 'a',
})

expect(input).toHaveValue('a')
WARNING
CDP session works only with playwright provider and only when using chromium browser. You can read more about it in playwright's CDPSession documentation.
Custom Commands
You can also add your own commands via browser.commands config option. If you develop a library, you can provide them via a config hook inside a plugin:
import type { Plugin } from 'vitest/config'
import type { BrowserCommand } from 'vitest/node'

const myCustomCommand: BrowserCommand<[arg1: string, arg2: string]> = ({
  testPath,
  provider
}, arg1, arg2) => {
  if (provider.name === 'playwright') {
    console.log(testPath, arg1, arg2)
    return { someValue: true }
  }

  throw new Error(`provider ${provider.name} is not supported`)
}

export default function BrowserCommands(): Plugin {
  return {
    name: 'vitest:custom-commands',
    config() {
      return {
        test: {
          browser: {
            commands: {
              myCustomCommand,
            }
          }
        }
      }
    }
  }
}
Then you can call it inside your test by importing it from @vitest/browser/context:
import { commands } from '@vitest/browser/context'
import { expect, test } from 'vitest'

test('custom command works correctly', async () => {
  const result = await commands.myCustomCommand('test1', 'test2')
  expect(result).toEqual({ someValue: true })
})

// if you are using TypeScript, you can augment the module
declare module '@vitest/browser/context' {
  interface BrowserCommands {
    myCustomCommand: (arg1: string, arg2: string) => Promise<{
      someValue: true
    }>
  }
}
WARNING
Custom functions will override built-in ones if they have the same name.
Custom playwright commands
Vitest exposes several playwright specific properties on the command context.
page references the full page that contains the test iframe. This is the orchestrator HTML and you most likely shouldn't touch it to not break things.
frame is an async method that will resolve tester Frame. It has a similar API to the page, but it doesn't support certain methods. If you need to query an element, you should prefer using context.iframe instead because it is more stable and faster.
iframe is a FrameLocator that should be used to query other elements on the page.
context refers to the unique BrowserContext.
import { BrowserCommand } from 'vitest/node'

export const myCommand: BrowserCommand<[string, number]> = async (
  ctx,
  arg1: string,
  arg2: number
) => {
  if (ctx.provider.name === 'playwright') {
    const element = await ctx.iframe.findByRole('alert')
    const screenshot = await element.screenshot()
    // do something with the screenshot
    return difference
  }
}
TIP
If you are using TypeScript, don't forget to reference @vitest/browser/providers/playwright in your setup file or a config file to get autocompletion in the config and in userEvent and page options:
/// <reference types="@vitest/browser/providers/playwright" />
Custom webdriverio commands
Vitest exposes some webdriverio specific properties on the context object.
browser is the WebdriverIO.Browser API.
Vitest automatically switches the webdriver context to the test iframe by calling browser.switchToFrame before the command is called, so $ and $$ methods refer to the elements inside the iframe, not in the orchestrator, but non-webdriver APIs will still refer to the parent frame context.
TIP
If you are using TypeScript, don't forget to reference @vitest/browser/providers/webdriverio in your setup file or a config file to get autocompletion:
/// <reference types="@vitest/browser/providers/webdriverio" />
Suggest changes to this page
Last updated: 5/5/25, 11:49 AM
Pager
Previous page
Assertion API | Browser Mode
Next page
Multiple Setups | Browser Mode
Multiple Setups
Since Vitest 3, you can specify several different browser setups using the new browser.instances option.
The main advantage of using the browser.instances over the test projects is improved caching. Every project will use the same Vite server meaning the file transform and dependency pre-bundling has to happen only once.
Several Browsers
You can use the browser.instances field to specify options for different browsers. For example, if you want to run the same tests in different browsers, the minimal configuration will look like this:
vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [
        { browser: 'chromium' },
        { browser: 'firefox' },
        { browser: 'webkit' },
      ],
    },
  },
})
Different Setups
You can also specify different config options independently from the browser (although, the instances can also have browser fields):
vitest.config.ts
example.test.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [
        {
          browser: 'chromium',
          name: 'chromium-1',
          setupFiles: ['./ratio-setup.ts'],
          provide: {
            ratio: 1,
          }
        },
        {
          browser: 'chromium',
          name: 'chromium-2',
          provide: {
            ratio: 2,
          }
        },
      ],
    },
  },
})
In this example Vitest will run all tests in chromium browser, but execute a './ratio-setup.ts' file only in the first configuration and inject a different ratio value depending on the provide field.
WARNING
Note that you need to define the custom name value if you are using the same browser name because Vitest will assign the browser as the project name otherwise.
Filtering
You can filter what projects to run with the --project flag. Vitest will automatically assign the browser name as a project name if it is not assigned manually. If the root config already has a name, Vitest will merge them: custom -> custom (browser).
$ vitest --project=chromium
default
custom
export default defineConfig({
  test: {
    browser: {
      instances: [
        // name: chromium
        { browser: 'chromium' },
        // name: custom
        { browser: 'firefox', name: 'custom' },
      ]
    }
  }
})
WARNING
Vitest cannot run multiple instances that have headless mode set to false (the default behaviour). During development, you can select what project to run in your terminal:
? Found multiple projects that run browser tests in headed mode: "chromium", "firefox".
Vitest cannot run multiple headed browsers at the same time. Select a single project
to run or cancel and run tests with "headless: true" option. Note that you can also
start tests with --browser=name or --project=name flag. › - Use arrow-keys. Return to submit.
❯   chromium
    firefox
If you have several non-headless projects in CI (i.e. the headless: false is set manually in the config and not overridden in CI env), Vitest will fail the run and won't start any tests.
The ability to run tests in headless mode is not affected by this. You can still run all instances in parallel as long as they don't have headless: false.
Suggest changes to this page
Last updated: 5/5/25, 11:49 AM
Pager
Previous page
Commands | Browser Mode
Next page
Config Reference
Configuring Vitest
If you are using Vite and have a vite.config file, Vitest will read it to match with the plugins and setup as your Vite app. If you want to have a different configuration for testing or your main app doesn't rely on Vite specifically, you could either:
Create vitest.config.ts, which will have the higher priority and will override the configuration from vite.config.ts (Vitest supports all conventional JS and TS extensions, but doesn't support json) - it means all options in your vite.config will be ignored
Pass --config option to CLI, e.g. vitest --config ./path/to/vitest.config.ts
Use process.env.VITEST or mode property on defineConfig (will be set to test/benchmark if not overridden with --mode) to conditionally apply different configuration in vite.config.ts
To configure vitest itself, add test property in your Vite config. You'll also need to add a reference to Vitest types using a triple slash command at the top of your config file, if you are importing defineConfig from vite itself.
WARNING
All listed options on this page are located within a test property inside the configuration:
vitest.config.js
export default defineConfig({
  test: {
    exclude: [],
  },
})
Since Vitest uses Vite config, you can also use any configuration option from Vite. For example, define to define global variables, or resolve.alias to define aliases - these options should be defined on the top level, not within a test property.
Configuration options that are not supported inside a project config have * sign next to them. This means they can only be set in the root Vitest config.
include
Type: string[]
Default: ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
CLI: vitest [...include], vitest **/*.test.js
A list of glob patterns that match your test files.
NOTE
When using coverage, Vitest automatically adds test files include patterns to coverage's default exclude patterns. See coverage.exclude.
exclude
Type: string[]
Default: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*']
CLI: vitest --exclude "**/excluded-file"
A list of glob patterns that should be excluded from your test files.
WARNING
This option does not affect coverage. If you need to remove certain files from the coverage report, use coverage.exclude.
This is the only option that doesn't override your configuration if you provide it with a CLI flag. All glob patterns added via --exclude flag will be added to the config's exclude.
includeSource
Type: string[]
Default: []
Include globs for in-source test files.
When defined, Vitest will run all matched files with import.meta.vitest inside.
name
Type: string | { label: string, color?: LabelColor }
Assign a custom name to the test project or Vitest process. The name will be visible in the CLI and UI, and available in the Node.js API via project.name.
Color used by CLI and UI can be changed by providing an object with color property.
server
Type: { sourcemap?, deps?, ... }
Vite-Node server options.
server.sourcemap
Type: 'inline' | boolean
Default: 'inline'
Inject inline source map to modules.
server.debug
Type: { dumpModules?, loadDumppedModules? }
Vite-Node debugger options.
server.debug.dumpModules
Type: boolean | string
Dump the transformed module to filesystem. Passing a string will dump to the specified path.
server.debug.loadDumppedModules
Type: boolean
Read dumped module from filesystem whenever exists. Useful for debugging by modifying the dump result from the filesystem.
server.deps
Type: { external?, inline?, ... }
Handling for dependencies resolution.
server.deps.external
Type: (string | RegExp)[]
Default: [/\/node_modules\//]
Externalize means that Vite will bypass the package to the native Node. Externalized dependencies will not be applied to Vite's transformers and resolvers, so they do not support HMR on reload. By default, all packages inside node_modules are externalized.
These options support package names as they are written in node_modules or specified inside deps.moduleDirectories. For example, package @company/some-name located inside packages/some-name should be specified as some-name, and packages should be included in deps.moduleDirectories. Basically, Vitest always checks the file path, not the actual package name.
If regexp is used, Vitest calls it on the file path, not the package name.
server.deps.inline
Type: (string | RegExp)[] | true
Default: []
Vite will process inlined modules. This could be helpful to handle packages that ship .js in ESM format (that Node can't handle).
If true, every dependency will be inlined. All dependencies, specified in ssr.noExternal will be inlined by default.
server.deps.fallbackCJS
Type boolean
Default: false
When a dependency is a valid ESM package, try to guess the cjs version based on the path. This might be helpful, if a dependency has the wrong ESM file.
This might potentially cause some misalignment if a package has different logic in ESM and CJS mode.
server.deps.cacheDir
Type string
Default: 'node_modules/.vite'
Directory to save cache files.
deps
Type: { optimizer?, ... }
Handling for dependencies resolution.
deps.optimizer
Type: { ssr?, web? }
See also: Dep Optimization Options
Enable dependency optimization. If you have a lot of tests, this might improve their performance.
When Vitest encounters the external library listed in include, it will be bundled into a single file using esbuild and imported as a whole module. This is good for several reasons:
Importing packages with a lot of imports is expensive. By bundling them into one file we can save a lot of time
Importing UI libraries is expensive because they are not meant to run inside Node.js
Your alias configuration is now respected inside bundled packages
Code in your tests is running closer to how it's running in the browser
Be aware that only packages in deps.optimizer?.[mode].include option are bundled (some plugins populate this automatically, like Svelte). You can read more about available options in Vite docs (Vitest doesn't support disable and noDiscovery options). By default, Vitest uses optimizer.web for jsdom and happy-dom environments, and optimizer.ssr for node and edge environments, but it is configurable by transformMode.
This options also inherits your optimizeDeps configuration (for web Vitest will extend optimizeDeps, for ssr - ssr.optimizeDeps). If you redefine include/exclude option in deps.optimizer it will extend your optimizeDeps when running tests. Vitest automatically removes the same options from include, if they are listed in exclude.
TIP
You will not be able to edit your node_modules code for debugging, since the code is actually located in your cacheDir or test.cache.dir directory. If you want to debug with console.log statements, edit it directly or force rebundling with deps.optimizer?.[mode].force option.
deps.optimizer.{mode}.enabled
Type: boolean
Default: false
Enable dependency optimization.
deps.web
Type: { transformAssets?, ... }
Options that are applied to external files when transform mode is set to web. By default, jsdom and happy-dom use web mode, while node and edge environments use ssr transform mode, so these options will have no affect on files inside those environments.
Usually, files inside node_modules are externalized, but these options also affect files in server.deps.external.
deps.web.transformAssets
Type: boolean
Default: true
Should Vitest process assets (.png, .svg, .jpg, etc) files and resolve them like Vite does in the browser.
This module will have a default export equal to the path to the asset, if no query is specified.
WARNING
At the moment, this option only works with vmThreads and vmForks pools.
deps.web.transformCss
Type: boolean
Default: true
Should Vitest process CSS (.css, .scss, .sass, etc) files and resolve them like Vite does in the browser.
If CSS files are disabled with css options, this option will just silence ERR_UNKNOWN_FILE_EXTENSION errors.
WARNING
At the moment, this option only works with vmThreads and vmForks pools.
deps.web.transformGlobPattern
Type: RegExp | RegExp[]
Default: []
Regexp pattern to match external files that should be transformed.
By default, files inside node_modules are externalized and not transformed, unless it's CSS or an asset, and corresponding option is not disabled.
WARNING
At the moment, this option only works with vmThreads and vmForks pools.
deps.interopDefault
Type: boolean
Default: true
Interpret CJS module's default as named exports. Some dependencies only bundle CJS modules and don't use named exports that Node.js can statically analyze when a package is imported using import syntax instead of require. When importing such dependencies in Node environment using named exports, you will see this error:
import { read } from 'fs-jetpack';
         ^^^^
SyntaxError: Named export 'read' not found. The requested module 'fs-jetpack' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export.
Vitest doesn't do static analysis, and cannot fail before your running code, so you will most likely see this error when running tests, if this feature is disabled:
TypeError: createAsyncThunk is not a function
TypeError: default is not a function
By default, Vitest assumes you are using a bundler to bypass this and will not fail, but you can disable this behaviour manually, if you code is not processed.
deps.moduleDirectories
Type: string[]
Default: ['node_modules']
A list of directories that should be treated as module directories. This config option affects the behavior of vi.mock: when no factory is provided and the path of what you are mocking matches one of the moduleDirectories values, Vitest will try to resolve the mock by looking for a __mocks__ folder in the root of the project.
This option will also affect if a file should be treated as a module when externalizing dependencies. By default, Vitest imports external modules with native Node.js bypassing Vite transformation step.
Setting this option will override the default, if you wish to still search node_modules for packages include it along with any other options:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    deps: {
      moduleDirectories: ['node_modules', path.resolve('../../packages')],
    }
  },
})
runner
Type: VitestRunnerConstructor
Default: node, when running tests, or benchmark, when running benchmarks
Path to a custom test runner. This is an advanced feature and should be used with custom library runners. You can read more about it in the documentation.
benchmark
Type: { include?, exclude?, ... }
Options used when running vitest bench.
benchmark.include
Type: string[]
Default: ['**/*.{bench,benchmark}.?(c|m)[jt]s?(x)']
Include globs for benchmark test files
benchmark.exclude
Type: string[]
Default: ['node_modules', 'dist', '.idea', '.git', '.cache']
Exclude globs for benchmark test files
benchmark.includeSource
Type: string[]
Default: []
Include globs for in-source benchmark test files. This option is similar to includeSource.
When defined, Vitest will run all matched files with import.meta.vitest inside.
benchmark.reporters
Type: Arrayable<BenchmarkBuiltinReporters | Reporter>
Default: 'default'
Custom reporter for output. Can contain one or more built-in report names, reporter instances, and/or paths to custom reporters.
benchmark.outputFile
Deprecated in favor of benchmark.outputJson.
benchmark.outputJson
Type: string | undefined
Default: undefined
A file path to store the benchmark result, which can be used for --compare option later.
For example:
# save main branch's result
git checkout main
vitest bench --outputJson main.json

# change a branch and compare against main
git checkout feature
vitest bench --compare main.json
benchmark.compare
Type: string | undefined
Default: undefined
A file path to a previous benchmark result to compare against current runs.
alias
Type: Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>
Define custom aliases when running inside tests. They will be merged with aliases from resolve.alias.
WARNING
Vitest uses Vite SSR primitives to run tests which has certain pitfalls.
Aliases affect only modules imported directly with an import keyword by an inlined module (all source code is inlined by default).
Vitest does not support aliasing require calls.
If you are aliasing an external dependency (e.g., react -> preact), you may want to alias the actual node_modules packages instead to make it work for externalized dependencies. Both Yarn and pnpm support aliasing via the npm: prefix.
globals
Type: boolean
Default: false
CLI: --globals, --globals=false
By default, vitest does not provide global APIs for explicitness. If you prefer to use the APIs globally like Jest, you can pass the --globals option to CLI or add globals: true in the config.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
  },
})
To get TypeScript working with the global APIs, add vitest/globals to the types field in your tsconfig.json
tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
If you have redefined your typeRoots to include more types in your compilation, you will have to add back the node_modules to make vitest/globals discoverable.
tsconfig.json
{
  "compilerOptions": {
    "typeRoots": ["./types", "./node_modules/@types", "./node_modules"],
    "types": ["vitest/globals"]
  }
}
If you are already using unplugin-auto-import in your project, you can also use it directly for auto importing those APIs.
vitest.config.js
import { defineConfig } from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vitest'],
      dts: true, // generate TypeScript declaration
    }),
  ],
})
environment
Type: 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime' | string
Default: 'node'
CLI: --environment=<env>
The environment that will be used for testing. The default environment in Vitest is a Node.js environment. If you are building a web application, you can use browser-like environment through either jsdom or happy-dom instead. If you are building edge functions, you can use edge-runtime environment
TIP
You can also use Browser Mode to run integration or unit tests in the browser without mocking the environment.
By adding a @vitest-environment docblock or comment at the top of the file, you can specify another environment to be used for all tests in that file:
Docblock style:
/**
 * @vitest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
Comment style:
// @vitest-environment happy-dom

test('use happy-dom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
For compatibility with Jest, there is also a @jest-environment:
/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
If you are running Vitest with --isolate=false flag, your tests will be run in this order: node, jsdom, happy-dom, edge-runtime, custom environments. Meaning, that every test with the same environment is grouped, but is still running sequentially.
Starting from 0.23.0, you can also define custom environment. When non-builtin environment is used, Vitest will try to load package vitest-environment-${name}. That package should export an object with the shape of Environment:
environment.js
import type { Environment } from 'vitest'

export default <Environment>{
  name: 'custom',
  transformMode: 'ssr',
  setup() {
    // custom setup
    return {
      teardown() {
        // called after all tests with this env have been run
      }
    }
  }
}
Vitest also exposes builtinEnvironments through vitest/environments entry, in case you just want to extend it. You can read more about extending environments in our guide.
TIP
jsdom environment exposes jsdom global variable equal to the current JSDOM instance. If you want TypeScript to recognize it, you can add vitest/jsdom to your tsconfig.json when you use this environment:
tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/jsdom"]
  }
}
environmentOptions
Type: Record<'jsdom' | string, unknown>
Default: {}
These options are passed down to setup method of current environment. By default, you can configure only JSDOM options, if you are using it as your test environment.
environmentMatchGlobs
Type: [string, EnvironmentName][]
Default: []
DEPRECATED
This API was deprecated in Vitest 3. Use projects to define different configurations instead.
export default defineConfig({
  test: {
    environmentMatchGlobs: [ 
      ['./*.jsdom.test.ts', 'jsdom'], 
    ], 
    projects: [ 
      { 
        extends: true, 
        test: { 
          environment: 'jsdom', 
        }, 
      }, 
    ], 
  },
})
Automatically assign environment based on globs. The first match will be used.
For example:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environmentMatchGlobs: [
      // all tests in tests/dom will run in jsdom
      ['tests/dom/**', 'jsdom'],
      // all tests in tests/ with .edge.test.ts will run in edge-runtime
      ['**\/*.edge.test.ts', 'edge-runtime'],
      // ...
    ]
  }
})
poolMatchGlobs
Type: [string, 'threads' | 'forks' | 'vmThreads' | 'vmForks' | 'typescript'][]
Default: []
DEPRECATED
This API was deprecated in Vitest 3. Use projects to define different configurations instead:
export default defineConfig({
  test: {
    poolMatchGlobs: [ 
      ['./*.threads.test.ts', 'threads'], 
    ], 
    projects: [ 
      { 
        test: { 
          extends: true, 
          pool: 'threads', 
        }, 
      }, 
    ], 
  },
})
Automatically assign pool in which tests will run based on globs. The first match will be used.
For example:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    poolMatchGlobs: [
      // all tests in "worker-specific" directory will run inside a worker as if you enabled `--pool=threads` for them,
      ['**/tests/worker-specific/**', 'threads'],
      // run all tests in "browser" directory in an actual browser
      ['**/tests/browser/**', 'browser'],
      // all other tests will run based on "browser.enabled" and "threads" options, if you didn't specify other globs
      // ...
    ]
  }
})
update *
Type: boolean
Default: false
CLI: -u, --update, --update=false
Update snapshot files. This will update all changed snapshots and delete obsolete ones.
watch *
Type: boolean
Default: !process.env.CI && process.stdin.isTTY
CLI: -w, --watch, --watch=false
Enable watch mode
In interactive environments, this is the default, unless --run is specified explicitly.
In CI, or when run from a non-interactive shell, "watch" mode is not the default, but can be enabled explicitly with this flag.
watchTriggerPatterns 3.2.0+ *
Type: WatcherTriggerPattern[]
Vitest reruns tests based on the module graph which is populated by static and dynamic import statements. However, if you are reading from the file system or fetching from a proxy, then Vitest cannot detect those dependencies.
To correctly rerun those tests, you can define a regex pattern and a function that retuns a list of test files to run.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watchTriggerPatterns: [
      {
        pattern: /^src\/(mailers|templates)\/(.*)\.(ts|html|txt)$/,
        testsToRun: (id, match) => {
          // relative to the root value
          return `./api/tests/mailers/${match[2]}.test.ts`
        },
      },
    ],
  },
})
WARNING
Returned files should be either absolute or relative to the root. Note that this is a global option, and it cannot be used inside of project configs.
root
Type: string
CLI: -r <path>, --root=<path>
Project root
dir
Type: string
CLI: --dir=<path>
Default: same as root
Base directory to scan for the test files. You can specify this option to speed up test discovery if your root covers the whole project
reporters *
Type: Reporter | Reporter[]
Default: 'default'
CLI: --reporter=<name>, --reporter=<name1> --reporter=<name2>
Custom reporters for output. Reporters can be a Reporter instance, a string to select built-in reporters, or a path to a custom implementation (e.g. './path/to/reporter.ts', '@scope/reporter').
outputFile *
Type: string | Record<string, string>
CLI: --outputFile=<path>, --outputFile.json=./path
Write test results to a file when the --reporter=json, --reporter=html or --reporter=junit option is also specified. By providing an object instead of a string you can define individual outputs when using multiple reporters.
pool *
Type: 'threads' | 'forks' | 'vmThreads' | 'vmForks'
Default: 'forks'
CLI: --pool=threads
Pool used to run tests in.
threads *
Enable multi-threading using tinypool (a lightweight fork of Piscina). When using threads you are unable to use process related APIs such as process.chdir(). Some libraries written in native languages, such as Prisma, bcrypt and canvas, have problems when running in multiple threads and run into segfaults. In these cases it is advised to use forks pool instead.
forks *
Similar as threads pool but uses child_process instead of worker_threads via tinypool. Communication between tests and main process is not as fast as with threads pool. Process related APIs such as process.chdir() are available in forks pool.
vmThreads *
Run tests using VM context (inside a sandboxed environment) in a threads pool.
This makes tests run faster, but the VM module is unstable when running ESM code. Your tests will leak memory - to battle that, consider manually editing poolOptions.vmThreads.memoryLimit value.
WARNING
Running code in a sandbox has some advantages (faster tests), but also comes with a number of disadvantages.
The globals within native modules, such as (fs, path, etc), differ from the globals present in your test environment. As a result, any error thrown by these native modules will reference a different Error constructor compared to the one used in your code:
try {
  fs.writeFileSync('/doesnt exist')
}
catch (err) {
  console.log(err instanceof Error) // false
}
Importing ES modules caches them indefinitely which introduces memory leaks if you have a lot of contexts (test files). There is no API in Node.js that clears that cache.
Accessing globals takes longer in a sandbox environment.
Please, be aware of these issues when using this option. Vitest team cannot fix any of the issues on our side.
vmForks *
Similar as vmThreads pool but uses child_process instead of worker_threads via tinypool. Communication between tests and the main process is not as fast as with vmThreads pool. Process related APIs such as process.chdir() are available in vmForks pool. Please be aware that this pool has the same pitfalls listed in vmThreads.
poolOptions *
Type: Record<'threads' | 'forks' | 'vmThreads' | 'vmForks', {}>
Default: {}
poolOptions.threads
Options for threads pool.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    poolOptions: {
      threads: {
        // Threads related options here
      }
    }
  }
})
poolOptions.threads.maxThreads *
Type: number | string
Default: available CPUs
Maximum number or percentage of threads. You can also use VITEST_MAX_THREADS environment variable.
poolOptions.threads.minThreads *
Type: number | string
Default: available CPUs
Minimum number or percentage of threads. You can also use VITEST_MIN_THREADS environment variable.
poolOptions.threads.singleThread
Type: boolean
Default: false
Run all tests with the same environment inside a single worker thread. This will disable built-in module isolation (your source code or inlined code will still be reevaluated for each test), but can improve test performance.
WARNING
Even though this option will force tests to run one after another, this option is different from Jest's --runInBand. Vitest uses workers not only for running tests in parallel, but also to provide isolation. By disabling this option, your tests will run sequentially, but in the same global context, so you must provide isolation yourself.
This might cause all sorts of issues, if you are relying on global state (frontend frameworks usually do) or your code relies on environment to be defined separately for each test. But can be a speed boost for your tests (up to 3 times faster), that don't necessarily rely on global state or can easily bypass that.
poolOptions.threads.useAtomics *
Type: boolean
Default: false
Use Atomics to synchronize threads.
This can improve performance in some cases, but might cause segfault in older Node versions.
poolOptions.threads.isolate
Type: boolean
Default: true
Isolate environment for each test file.
poolOptions.threads.execArgv *
Type: string[]
Default: []
Pass additional arguments to node in the threads. See Command-line API | Node.js for more information.
WARNING
Be careful when using, it as some options may crash worker, e.g. --prof, --title. See https://github.com/nodejs/node/issues/41103.
poolOptions.forks
Options for forks pool.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    poolOptions: {
      forks: {
        // Forks related options here
      }
    }
  }
})
poolOptions.forks.maxForks *
Type: number | string
Default: available CPUs
Maximum number or percentage of forks. You can also use VITEST_MAX_FORKS environment variable.
poolOptions.forks.minForks *
Type: number | string
Default: available CPUs
Minimum number or percentage of forks. You can also use VITEST_MIN_FORKS environment variable.
poolOptions.forks.isolate
Type: boolean
Default: true
Isolate environment for each test file.
poolOptions.forks.singleFork
Type: boolean
Default: false
Run all tests with the same environment inside a single child process. This will disable built-in module isolation (your source code or inlined code will still be reevaluated for each test), but can improve test performance.
WARNING
Even though this option will force tests to run one after another, this option is different from Jest's --runInBand. Vitest uses child processes not only for running tests in parallel, but also to provide isolation. By disabling this option, your tests will run sequentially, but in the same global context, so you must provide isolation yourself.
This might cause all sorts of issues, if you are relying on global state (frontend frameworks usually do) or your code relies on environment to be defined separately for each test. But can be a speed boost for your tests (up to 3 times faster), that don't necessarily rely on global state or can easily bypass that.
poolOptions.forks.execArgv *
Type: string[]
Default: []
Pass additional arguments to node process in the child processes. See Command-line API | Node.js for more information.
WARNING
Be careful when using, it as some options may crash worker, e.g. --prof, --title. See https://github.com/nodejs/node/issues/41103.
poolOptions.vmThreads
Options for vmThreads pool.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    poolOptions: {
      vmThreads: {
        // VM threads related options here
      }
    }
  }
})
poolOptions.vmThreads.maxThreads *
Type: number | string
Default: available CPUs
Maximum number or percentage of threads. You can also use VITEST_MAX_THREADS environment variable.
poolOptions.vmThreads.minThreads *
Type: number | string
Default: available CPUs
Minimum number or percentage of threads. You can also use VITEST_MIN_THREADS environment variable.
poolOptions.vmThreads.memoryLimit *
Type: string | number
Default: 1 / CPU Cores
Specifies the memory limit for workers before they are recycled. This value heavily depends on your environment, so it's better to specify it manually instead of relying on the default.
TIP
The implementation is based on Jest's workerIdleMemoryLimit.
The limit can be specified in a number of different ways and whatever the result is Math.floor is used to turn it into an integer value:
<= 1 - The value is assumed to be a percentage of system memory. So 0.5 sets the memory limit of the worker to half of the total system memory
\> 1 - Assumed to be a fixed byte value. Because of the previous rule if you wanted a value of 1 byte (I don't know why) you could use 1.1.
With units
50% - As above, a percentage of total system memory
100KB, 65MB, etc - With units to denote a fixed memory limit.
K / KB - Kilobytes (x1000)
KiB - Kibibytes (x1024)
M / MB - Megabytes
MiB - Mebibytes
G / GB - Gigabytes
GiB - Gibibytes
WARNING
Percentage based memory limit does not work on Linux CircleCI workers due to incorrect system memory being reported.
poolOptions.vmThreads.useAtomics *
Type: boolean
Default: false
Use Atomics to synchronize threads.
This can improve performance in some cases, but might cause segfault in older Node versions.
poolOptions.vmThreads.execArgv *
Type: string[]
Default: []
Pass additional arguments to node process in the VM context. See Command-line API | Node.js for more information.
WARNING
Be careful when using, it as some options may crash worker, e.g. --prof, --title. See https://github.com/nodejs/node/issues/41103.
poolOptions.vmForks *
Options for vmForks pool.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    poolOptions: {
      vmForks: {
        // VM forks related options here
      }
    }
  }
})
poolOptions.vmForks.maxForks *
Type: number | string
Default: available CPUs
Maximum number or percentage of forks. You can also use VITEST_MAX_FORKS environment variable.
poolOptions.vmForks.minForks *
Type: number | string
Default: available CPUs
Minimum number or percentage of forks. You can also use VITEST_MIN_FORKS environment variable.
poolOptions.vmForks.memoryLimit *
Type: string | number
Default: 1 / CPU Cores
Specifies the memory limit for workers before they are recycled. This value heavily depends on your environment, so it's better to specify it manually instead of relying on the default. How the value is calculated is described in poolOptions.vmThreads.memoryLimit
poolOptions.vmForks.execArgv *
Type: string[]
Default: []
Pass additional arguments to node process in the VM context. See Command-line API | Node.js for more information.
WARNING
Be careful when using, it as some options may crash worker, e.g. --prof, --title. See https://github.com/nodejs/node/issues/41103.
fileParallelism *
Type: boolean
Default: true
CLI: --no-file-parallelism, --fileParallelism=false
Should all test files run in parallel. Setting this to false will override maxWorkers and minWorkers options to 1.
TIP
This option doesn't affect tests running in the same file. If you want to run those in parallel, use concurrent option on describe or via a config.
maxWorkers *
Type: number | string
Maximum number or percentage of workers to run tests in. poolOptions.{threads,vmThreads}.maxThreads/poolOptions.forks.maxForks has higher priority.
minWorkers *
Type: number | string
Minimum number or percentage of workers to run tests in. poolOptions.{threads,vmThreads}.minThreads/poolOptions.forks.minForks has higher priority.
testTimeout
Type: number
Default: 5_000 in Node.js, 15_000 if browser.enabled is true
CLI: --test-timeout=5000, --testTimeout=5000
Default timeout of a test in milliseconds. Use 0 to disable timeout completely.
hookTimeout
Type: number
Default: 10_000 in Node.js, 30_000 if browser.enabled is true
CLI: --hook-timeout=10000, --hookTimeout=10000
Default timeout of a hook in milliseconds. Use 0 to disable timeout completely.
teardownTimeout *
Type: number
Default: 10000
CLI: --teardown-timeout=5000, --teardownTimeout=5000
Default timeout to wait for close when Vitest shuts down, in milliseconds
silent *
Type: boolean | 'passed-only'
Default: false
CLI: --silent, --silent=false
Silent console output from tests.
Use 'passed-only' to see logs from failing tests only. Logs from failing tests are printed after a test has finished.
setupFiles
Type: string | string[]
Path to setup files. They will be run before each test file.
INFO
Editing a setup file will automatically trigger a rerun of all tests.
You can use process.env.VITEST_POOL_ID (integer-like string) inside to distinguish between threads.
TIP
Note, that if you are running --isolate=false, this setup file will be run in the same global scope multiple times. Meaning, that you are accessing the same global object before each test, so make sure you are not doing the same thing more than you need.
For example, you may rely on a global variable:
import { config } from '@some-testing-lib'

if (!globalThis.defined) {
  config.plugins = [myCoolPlugin]
  computeHeavyThing()
  globalThis.defined = true
}

// hooks are reset before each suite
afterEach(() => {
  cleanup()
})

globalThis.resetBeforeEachTest = true
provide 2.1.0+
Type: Partial<ProvidedContext>
Define values that can be accessed inside your tests using inject method.
vitest.config.js
api.test.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    provide: {
      API_KEY: '123',
    },
  },
})
WARNING
Properties have to be strings and values need to be serializable because this object will be transferred between different processes.
TIP
If you are using TypeScript, you will need to augment ProvidedContext type for type safe access:
vitest.shims.d.ts
declare module 'vitest' {
  export interface ProvidedContext {
    API_KEY: string
  }
}

// mark this file as a module so augmentation works correctly
export {}
globalSetup
Type: string | string[]
Path to global setup files, relative to project root.
A global setup file can either export named functions setup and teardown or a default function that returns a teardown function (example).
INFO
Multiple globalSetup files are possible. setup and teardown are executed sequentially with teardown in reverse order.
WARNING
Global setup runs only if there is at least one running test. This means that global setup might start running during watch mode after test file is changed (the test file will wait for global setup to finish before running).
Beware that the global setup is running in a different global scope, so your tests don't have access to variables defined here. However, you can pass down serializable data to tests via provide method:
example.test.js
globalSetup.ts 3.0.0+
globalSetup.ts 2.0.0+
import { inject } from 'vitest'

inject('wsPort') === 3000
Since Vitest 3, you can define a custom callback function to be called when Vitest reruns tests. If the function is asynchronous, the runner will wait for it to complete before executing tests. Note that you cannot destruct the project like { onTestsRerun } because it relies on the context.
globalSetup.ts
import type { TestProject } from 'vitest/node'

export default function setup(project: TestProject) {
  project.onTestsRerun(async () => {
    await restartDb()
  })
}
forceRerunTriggers *
Type: string[]
Default: ['**/package.json/**', '**/vitest.config.*/**', '**/vite.config.*/**']
Glob pattern of file paths that will trigger the whole suite rerun. When paired with the --changed argument will run the whole test suite if the trigger is found in the git diff.
Useful if you are testing calling CLI commands, because Vite cannot construct a module graph:
test('execute a script', async () => {
  // Vitest cannot rerun this test, if content of `dist/index.js` changes
  await execa('node', ['dist/index.js'])
})
TIP
Make sure that your files are not excluded by server.watch.ignored.
coverage *
You can use v8, istanbul or a custom coverage solution for coverage collection.
You can provide coverage options to CLI with dot notation:
npx vitest --coverage.enabled --coverage.provider=istanbul --coverage.all
WARNING
If you are using coverage options with dot notation, don't forget to specify --coverage.enabled. Do not provide a single --coverage option in that case.
coverage.provider
Type: 'v8' | 'istanbul' | 'custom'
Default: 'v8'
CLI: --coverage.provider=<provider>
Use provider to select the tool for coverage collection.
coverage.enabled
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.enabled, --coverage.enabled=false
Enables coverage collection. Can be overridden using --coverage CLI option.
coverage.include
Type: string[]
Default: ['**']
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.include=<path>, --coverage.include=<path1> --coverage.include=<path2>
List of files included in coverage as glob patterns
coverage.extension
Type: string | string[]
Default: ['.js', '.cjs', '.mjs', '.ts', '.mts', '.tsx', '.jsx', '.vue', '.svelte', '.marko', '.astro']
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.extension=<extension>, --coverage.extension=<extension1> --coverage.extension=<extension2>
coverage.exclude
Type: string[]
Default:
[
  'coverage/**',
  'dist/**',
  '**/node_modules/**',
  '**/[.]**',
  'packages/*/test?(s)/**',
  '**/*.d.ts',
  '**/virtual:*',
  '**/__x00__*',
  '**/\x00*',
  'cypress/**',
  'test?(s)/**',
  'test?(-*).?(c|m)[jt]s?(x)',
  '**/*{.,-}{test,spec,bench,benchmark}?(-d).?(c|m)[jt]s?(x)',
  '**/__tests__/**',
  '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
  '**/vitest.{workspace,projects}.[jt]s?(on)',
  '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
]
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.exclude=<path>, --coverage.exclude=<path1> --coverage.exclude=<path2>
List of files excluded from coverage as glob patterns.
This option overrides all default options. Extend the default options when adding new patterns to ignore:
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['**/custom-pattern/**', ...coverageConfigDefaults.exclude]
    },
  },
})
NOTE
Vitest automatically adds test files include patterns to the coverage.exclude. It's not possible to show coverage of test files.
coverage.all
Type: boolean
Default: true
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.all, --coverage.all=false
Whether to include all files, including the untested ones into report.
coverage.clean
Type: boolean
Default: true
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.clean, --coverage.clean=false
Clean coverage results before running tests
coverage.cleanOnRerun
Type: boolean
Default: true
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.cleanOnRerun, --coverage.cleanOnRerun=false
Clean coverage report on watch rerun. Set to false to preserve coverage results from previous run in watch mode.
coverage.reportsDirectory
Type: string
Default: './coverage'
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.reportsDirectory=<path>
WARNING
Vitest will delete this directory before running tests if coverage.clean is enabled (default value).
Directory to write coverage report to.
To preview the coverage report in the output of HTML reporter, this option must be set as a sub-directory of the html report directory (for example ./html/coverage).
coverage.reporter
Type: string | string[] | [string, {}][]
Default: ['text', 'html', 'clover', 'json']
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.reporter=<reporter>, --coverage.reporter=<reporter1> --coverage.reporter=<reporter2>
Coverage reporters to use. See istanbul documentation for detailed list of all reporters. See @types/istanbul-reporter for details about reporter specific options.
The reporter has three different types:
A single reporter: { reporter: 'html' }
Multiple reporters without options: { reporter: ['html', 'json'] }
A single or multiple reporters with reporter options:
{
  reporter: [
    ['lcov', { 'projectRoot': './src' }],
    ['json', { 'file': 'coverage.json' }],
    ['text']
  ]
}
You can also pass custom coverage reporters. See Guide - Custom Coverage Reporter for more information.
 {
    reporter: [
      // Specify reporter using name of the NPM package
      '@vitest/custom-coverage-reporter',
      ['@vitest/custom-coverage-reporter', { someOption: true }],

      // Specify reporter using local path
      '/absolute/path/to/custom-reporter.cjs',
      ['/absolute/path/to/custom-reporter.cjs', { someOption: true }],
    ]
  }
You can check your coverage report in Vitest UI: check Vitest UI Coverage for more details.
coverage.reportOnFailure
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.reportOnFailure, --coverage.reportOnFailure=false
Generate coverage report even when tests fail.
coverage.allowExternal
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.allowExternal, --coverage.allowExternal=false
Collect coverage of files outside the project root.
coverage.excludeAfterRemap 2.1.0+
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.excludeAfterRemap, --coverage.excludeAfterRemap=false
Apply exclusions again after coverage has been remapped to original sources. This is useful when your source files are transpiled and may contain source maps of non-source files.
Use this option when you are seeing files that show up in report even if they match your coverage.exclude patterns.
coverage.skipFull
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.skipFull, --coverage.skipFull=false
Do not show files with 100% statement, branch, and function coverage.
coverage.thresholds
Options for coverage thresholds.
If a threshold is set to a positive number, it will be interpreted as the minimum percentage of coverage required. For example, setting the lines threshold to 90 means that 90% of lines must be covered.
If a threshold is set to a negative number, it will be treated as the maximum number of uncovered items allowed. For example, setting the lines threshold to -10 means that no more than 10 lines may be uncovered.
{
  coverage: {
    thresholds: {
      // Requires 90% function coverage
      functions: 90,

      // Require that no more than 10 lines are uncovered
      lines: -10,
    }
  }
}
coverage.thresholds.lines
Type: number
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.thresholds.lines=<number>
Global threshold for lines.
coverage.thresholds.functions
Type: number
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.thresholds.functions=<number>
Global threshold for functions.
coverage.thresholds.branches
Type: number
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.thresholds.branches=<number>
Global threshold for branches.
coverage.thresholds.statements
Type: number
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.thresholds.statements=<number>
Global threshold for statements.
coverage.thresholds.perFile
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.thresholds.perFile, --coverage.thresholds.perFile=false
Check thresholds per file.
coverage.thresholds.autoUpdate
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.thresholds.autoUpdate=<boolean>
Update all threshold values lines, functions, branches and statements to configuration file when current coverage is better than the configured thresholds. This option helps to maintain thresholds when coverage is improved.
coverage.thresholds.100
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.thresholds.100, --coverage.thresholds.100=false
Sets global thresholds to 100. Shortcut for --coverage.thresholds.lines 100 --coverage.thresholds.functions 100 --coverage.thresholds.branches 100 --coverage.thresholds.statements 100.
coverage.thresholds[glob-pattern]
Type: { statements?: number functions?: number branches?: number lines?: number }
Default: undefined
Available for providers: 'v8' | 'istanbul'
Sets thresholds for files matching the glob pattern.
NOTE
Vitest counts all files, including those covered by glob-patterns, into the global coverage thresholds. This is different from Jest behavior.
{
  coverage: {
    thresholds: {
      // Thresholds for all files
      functions: 95,
      branches: 70,

      // Thresholds for matching glob pattern
      'src/utils/**.ts': {
        statements: 95,
        functions: 90,
        branches: 85,
        lines: 80,
      },

      // Files matching this pattern will only have lines thresholds set.
      // Global thresholds are not inherited.
      '**/math.ts': {
        lines: 100,
      }
    }
  }
}
coverage.thresholds[glob-pattern].100 2.1.0+
Type: boolean
Default: false
Available for providers: 'v8' | 'istanbul'
Sets thresholds to 100 for files matching the glob pattern.
{
  coverage: {
    thresholds: {
      // Thresholds for all files
      functions: 95,
      branches: 70,

      // Thresholds for matching glob pattern
      'src/utils/**.ts': { 100: true },
      '**/math.ts': { 100: true }
    }
  }
}
coverage.ignoreEmptyLines
Type: boolean
Default: true (false in v1)
Available for providers: 'v8'
CLI: --coverage.ignoreEmptyLines=<boolean>
Ignore empty lines, comments and other non-runtime code, e.g. Typescript types. Requires experimentalAstAwareRemapping: false.
This option works only if the used compiler removes comments and other non-runtime code from the transpiled code. By default Vite uses ESBuild which removes comments and Typescript types from .ts, .tsx and .jsx files.
If you want to apply ESBuild to other files as well, define them in esbuild options:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  esbuild: {
    // Transpile all files with ESBuild to remove comments from code coverage.
    // Required for `test.coverage.ignoreEmptyLines` to work:
    include: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.ts', '**/*.tsx'],
  },
  test: {
    coverage: {
      provider: 'v8',
      ignoreEmptyLines: true,
    },
  },
})
coverage.experimentalAstAwareRemapping
Type: boolean
Default: false
Available for providers: 'v8'
CLI: --coverage.experimentalAstAwareRemapping=<boolean>
Remap coverage with experimental AST based analysis. Provides more accurate results compared to default mode.
coverage.ignoreClassMethods
Type: string[]
Default: []
Available for providers: 'istanbul'
CLI: --coverage.ignoreClassMethods=<method>
Set to array of class method names to ignore for coverage. See istanbul documentation for more information.
coverage.watermarks
Type:
{
  statements?: [number, number],
  functions?: [number, number],
  branches?: [number, number],
  lines?: [number, number]
}
Default:
{
  statements: [50, 80],
  functions: [50, 80],
  branches: [50, 80],
  lines: [50, 80]
}
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.watermarks.statements=50,80, --coverage.watermarks.branches=50,80
Watermarks for statements, lines, branches and functions. See istanbul documentation for more information.
coverage.processingConcurrency
Type: boolean
Default: Math.min(20, os.availableParallelism?.() ?? os.cpus().length)
Available for providers: 'v8' | 'istanbul'
CLI: --coverage.processingConcurrency=<number>
Concurrency limit used when processing the coverage results.
coverage.customProviderModule
Type: string
Available for providers: 'custom'
CLI: --coverage.customProviderModule=<path or module name>
Specifies the module name or path for the custom coverage provider module. See Guide - Custom Coverage Provider for more information.
testNamePattern *
Type string | RegExp
CLI: -t <pattern>, --testNamePattern=<pattern>, --test-name-pattern=<pattern>
Run tests with full names matching the pattern. If you add OnlyRunThis to this property, tests not containing the word OnlyRunThis in the test name will be skipped.
import { expect, test } from 'vitest'

// run
test('OnlyRunThis', () => {
  expect(true).toBe(true)
})

// skipped
test('doNotRun', () => {
  expect(true).toBe(true)
})
open *
Type: boolean
Default: !process.env.CI
CLI: --open, --open=false
Open Vitest UI (WIP)
api
Type: boolean | number
Default: false
CLI: --api, --api.port, --api.host, --api.strictPort
Listen to port and serve API. When set to true, the default port is 51204
browser experimental
Default: { enabled: false }
CLI: --browser=<name>, --browser.name=chrome --browser.headless
Configuration for running browser tests. Please, refer to the "Browser Config Reference" article.
WARNING
This is an experimental feature. Breaking changes might not follow SemVer, please pin Vitest's version when using it.
clearMocks
Type: boolean
Default: false
Will call .mockClear() on all spies before each test. This will clear mock history without affecting mock implementations.
mockReset
Type: boolean
Default: false
Will call .mockReset() on all spies before each test. This will clear mock history and reset each implementation to its original.
restoreMocks
Type: boolean
Default: false
Will call .mockRestore() on all spies before each test. This will clear mock history, restore each implementation to its original, and restore original descriptors of spied-on objects..
unstubEnvs
Type: boolean
Default: false
Will call vi.unstubAllEnvs before each test.
unstubGlobals
Type: boolean
Default: false
Will call vi.unstubAllGlobals before each test.
testTransformMode
Type: { web?, ssr? }
Determine the transform method for all modules imported inside a test that matches the glob pattern. By default, relies on the environment. For example, tests with JSDOM environment will process all files with ssr: false flag and tests with Node environment process all modules with ssr: true.
testTransformMode.ssr
Type: string[]
Default: []
Use SSR transform pipeline for all modules inside specified tests.
Vite plugins will receive ssr: true flag when processing those files.
testTransformMode.web
Type: string[]
Default: []
First do a normal transform pipeline (targeting browser), then do a SSR rewrite to run the code in Node.
Vite plugins will receive ssr: false flag when processing those files.
snapshotFormat *
Type: PrettyFormatOptions
Format options for snapshot testing. These options are passed down to pretty-format.
TIP
Beware that plugins field on this object will be ignored.
If you need to extend snapshot serializer via pretty-format plugins, please, use expect.addSnapshotSerializer API or snapshotSerializers option.
snapshotSerializers *
Type: string[]
Default: []
A list of paths to snapshot serializer modules for snapshot testing, useful if you want add custom snapshot serializers. See Custom Serializer for more information.
resolveSnapshotPath *
Type: (testPath: string, snapExtension: string, context: { config: SerializedConfig }) => string
Default: stores snapshot files in __snapshots__ directory
Overrides default snapshot path. For example, to store snapshots next to test files:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
  },
})
allowOnly
Type: boolean
Default: !process.env.CI
CLI: --allowOnly, --allowOnly=false
Allow tests and suites that are marked as only.
dangerouslyIgnoreUnhandledErrors *
Type: boolean
Default: false
CLI: --dangerouslyIgnoreUnhandledErrors --dangerouslyIgnoreUnhandledErrors=false
Ignore any unhandled errors that occur.
passWithNoTests *
Type: boolean
Default: false
CLI: --passWithNoTests, --passWithNoTests=false
Vitest will not fail, if no tests will be found.
logHeapUsage
Type: boolean
Default: false
CLI: --logHeapUsage, --logHeapUsage=false
Show heap usage after each test. Useful for debugging memory leaks.
css
Type: boolean | { include?, exclude?, modules? }
Configure if CSS should be processed. When excluded, CSS files will be replaced with empty strings to bypass the subsequent processing. CSS Modules will return a proxy to not affect runtime.
css.include
Type: RegExp | RegExp[]
Default: []
RegExp pattern for files that should return actual CSS and will be processed by Vite pipeline.
TIP
To process all CSS files, use /.+/.
css.exclude
Type: RegExp | RegExp[]
Default: []
RegExp pattern for files that will return an empty CSS file.
css.modules
Type: { classNameStrategy? }
Default: {}
css.modules.classNameStrategy
Type: 'stable' | 'scoped' | 'non-scoped'
Default: 'stable'
If you decide to process CSS files, you can configure if class names inside CSS modules should be scoped. You can choose one of the options:
stable: class names will be generated as _${name}_${hashedFilename}, which means that generated class will stay the same, if CSS content is changed, but will change, if the name of the file is modified, or file is moved to another folder. This setting is useful, if you use snapshot feature.
scoped: class names will be generated as usual, respecting css.modules.generateScopedName method, if you have one and CSS processing is enabled. By default, filename will be generated as _${name}_${hash}, where hash includes filename and content of the file.
non-scoped: class names will not be hashed.
WARNING
By default, Vitest exports a proxy, bypassing CSS Modules processing. If you rely on CSS properties on your classes, you have to enable CSS processing using include option.
maxConcurrency
Type: number
Default: 5
CLI: --max-concurrency=10, --maxConcurrency=10
A number of tests that are allowed to run at the same time marked with test.concurrent.
Test above this limit will be queued to run when available slot appears.
cache *
Type: false
CLI: --no-cache, --cache=false
Use this option if you want to disable the cache feature. At the moment Vitest stores cache for test results to run the longer and failed tests first.
The cache directory is controlled by the Vite's cacheDir option:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  cacheDir: 'custom-folder/.vitest'
})
You can limit the directory only for Vitest by using process.env.VITEST:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  cacheDir: process.env.VITEST ? 'custom-folder/.vitest' : undefined
})
sequence
Type: { sequencer?, shuffle?, seed?, hooks?, setupFiles?, groupOrder }
Options for how tests should be sorted.
You can provide sequence options to CLI with dot notation:
npx vitest --sequence.shuffle --sequence.seed=1000
sequence.sequencer *
Type: TestSequencerConstructor
Default: BaseSequencer
A custom class that defines methods for sharding and sorting. You can extend BaseSequencer from vitest/node, if you only need to redefine one of the sort and shard methods, but both should exist.
Sharding is happening before sorting, and only if --shard option is provided.
If sequencer.groupOrder is specified, the sequencer will be called once for each group and pool.
groupOrder 3.2.0+
Type: number
Default: 0
Controls the order in which this project runs its tests when using multiple projects.
Projects with the same group order number will run together, and groups are run from lowest to highest.
If you don’t set this option, all projects run in parallel.
If several projects use the same group order, they will run at the same time.
This setting only affects the order in which projects run, not the order of tests within a project. To control test isolation or the order of tests inside a project, use the isolate and sequence.sequencer options.
sequence.shuffle
Type: boolean | { files?, tests? }
Default: false
CLI: --sequence.shuffle, --sequence.shuffle=false
If you want files and tests to run randomly, you can enable it with this option, or CLI argument --sequence.shuffle.
Vitest usually uses cache to sort tests, so long running tests start earlier - this makes tests run faster. If your files and tests will run in random order you will lose this performance improvement, but it may be useful to track tests that accidentally depend on another run previously.
sequence.shuffle.files
Type: boolean
Default: false
CLI: --sequence.shuffle.files, --sequence.shuffle.files=false
Whether to randomize files, be aware that long running tests will not start earlier if you enable this option.
sequence.shuffle.tests
Type: boolean
Default: false
CLI: --sequence.shuffle.tests, --sequence.shuffle.tests=false
Whether to randomize tests.
sequence.concurrent
Type: boolean
Default: false
CLI: --sequence.concurrent, --sequence.concurrent=false
If you want tests to run in parallel, you can enable it with this option, or CLI argument --sequence.concurrent.
sequence.seed *
Type: number
Default: Date.now()
CLI: --sequence.seed=1000
Sets the randomization seed, if tests are running in random order.
sequence.hooks
Type: 'stack' | 'list' | 'parallel'
Default: 'stack'
CLI: --sequence.hooks=<value>
Changes the order in which hooks are executed.
stack will order "after" hooks in reverse order, "before" hooks will run in the order they were defined
list will order all hooks in the order they are defined
parallel will run hooks in a single group in parallel (hooks in parent suites will still run before the current suite's hooks)
TIP
This option doesn't affect onTestFinished. It is always called in reverse order.
sequence.setupFiles
Type: 'list' | 'parallel'
Default: 'parallel'
CLI: --sequence.setupFiles=<value>
Changes the order in which setup files are executed.
list will run setup files in the order they are defined
parallel will run setup files in parallel
typecheck
Options for configuring typechecking test environment.
typecheck.enabled
Type: boolean
Default: false
CLI: --typecheck, --typecheck.enabled
Enable typechecking alongside your regular tests.
typecheck.only
Type: boolean
Default: false
CLI: --typecheck.only
Run only typecheck tests, when typechecking is enabled. When using CLI, this option will automatically enable typechecking.
typecheck.checker
Type: 'tsc' | 'vue-tsc' | string
Default: tsc
What tools to use for type checking. Vitest will spawn a process with certain parameters for easier parsing, depending on the type. Checker should implement the same output format as tsc.
You need to have a package installed to use typechecker:
tsc requires typescript package
vue-tsc requires vue-tsc package
You can also pass down a path to custom binary or command name that produces the same output as tsc --noEmit --pretty false.
typecheck.include
Type: string[]
Default: ['**/*.{test,spec}-d.?(c|m)[jt]s?(x)']
Glob pattern for files that should be treated as test files
typecheck.exclude
Type: string[]
Default: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**']
Glob pattern for files that should not be treated as test files
typecheck.allowJs
Type: boolean
Default: false
Check JS files that have @ts-check comment. If you have it enabled in tsconfig, this will not overwrite it.
typecheck.ignoreSourceErrors
Type: boolean
Default: false
Do not fail, if Vitest found errors outside the test files. This will not show you non-test errors at all.
By default, if Vitest finds source error, it will fail test suite.
typecheck.tsconfig
Type: string
Default: tries to find closest tsconfig.json
Path to custom tsconfig, relative to the project root.
typecheck.spawnTimeout
Type: number
Default: 10_000
Minimum time in milliseconds it takes to spawn the typechecker.
slowTestThreshold *
Type: number
Default: 300
CLI: --slow-test-threshold=<number>, --slowTestThreshold=<number>
The number of milliseconds after which a test or suite is considered slow and reported as such in the results.
chaiConfig
Type: { includeStack?, showDiff?, truncateThreshold? }
Default: { includeStack: false, showDiff: true, truncateThreshold: 40 }
Equivalent to Chai config.
chaiConfig.includeStack
Type: boolean
Default: false
Influences whether stack trace is included in Assertion error message. Default of false suppresses stack trace in the error message.
chaiConfig.showDiff
Type: boolean
Default: true
Influences whether or not the showDiff flag should be included in the thrown AssertionErrors. false will always be false; true will be true when the assertion has requested a diff to be shown.
chaiConfig.truncateThreshold
Type: number
Default: 40
Sets length threshold for actual and expected values in assertion errors. If this threshold is exceeded, for example for large data structures, the value is replaced with something like [ Array(3) ] or { Object (prop1, prop2) }. Set it to 0 if you want to disable truncating altogether.
This config option affects truncating values in test.each titles and inside the assertion error message.
bail
Type: number
Default: 0
CLI: --bail=<value>
Stop test execution when given number of tests have failed.
By default Vitest will run all of your test cases even if some of them fail. This may not be desired for CI builds where you are only interested in 100% successful builds and would like to stop test execution as early as possible when test failures occur. The bail option can be used to speed up CI runs by preventing it from running more tests when failures have occurred.
retry
Type: number
Default: 0
CLI: --retry=<value>
Retry the test specific number of times if it fails.
onConsoleLog *
Type: (log: string, type: 'stdout' | 'stderr') => boolean | void
Custom handler for console.log in tests. If you return false, Vitest will not print the log to the console.
Can be useful for filtering out logs from third-party libraries.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    onConsoleLog(log: string, type: 'stdout' | 'stderr'): boolean | void {
      return !(log === 'message from third party library' && type === 'stdout')
    },
  },
})
onStackTrace *
Type: (error: Error, frame: ParsedStack) => boolean | void
Apply a filtering function to each frame of each stack trace when handling errors. The first argument, error, is an object with the same properties as a standard Error, but it is not an actual instance.
Can be useful for filtering out stack trace frames from third-party libraries.
import type { ParsedStack } from 'vitest'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    onStackTrace(error: Error, { file }: ParsedStack): boolean | void {
      // If we've encountered a ReferenceError, show the whole stack.
      if (error.name === 'ReferenceError') {
        return
      }

      // Reject all frames from third party libraries.
      if (file.includes('node_modules')) {
        return false
      }
    },
  },
})
diff
Type: string
CLI: --diff=<path>
DiffOptions object or a path to a module which exports DiffOptions. Useful if you want to customize diff display.
For example, as a config object:
import { defineConfig } from 'vitest/config'
import c from 'picocolors'

export default defineConfig({
  test: {
    diff: {
      aIndicator: c.bold('--'),
      bIndicator: c.bold('++'),
      omitAnnotationLines: true,
    },
  },
})
Or as a module:
vitest.config.js
vitest.diff.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    diff: './vitest.diff.ts',
  },
})
diff.expand
Type: boolean
Default: true
CLI: --diff.expand=false
Expand all common lines.
diff.truncateThreshold
Type: number
Default: 0
CLI: --diff.truncateThreshold=<path>
The maximum length of diff result to be displayed. Diffs above this threshold will be truncated. Truncation won't take effect with default value 0.
diff.truncateAnnotation
Type: string
Default: '... Diff result is truncated'
CLI: --diff.truncateAnnotation=<annotation>
Annotation that is output at the end of diff result if it's truncated.
diff.truncateAnnotationColor
Type: DiffOptionsColor = (arg: string) => string
Default: noColor = (string: string): string => string
Color of truncate annotation, default is output with no color.
diff.printBasicPrototype
Type: boolean
Default: false
Print basic prototype Object and Array in diff output
diff.maxDepth
Type: number
Default: 20 (or 8 when comparing different types)
Limit the depth to recurse when printing nested objects
fakeTimers
Type: FakeTimerInstallOpts
Options that Vitest will pass down to @sinon/fake-timers when using vi.useFakeTimers().
fakeTimers.now
Type: number | Date
Default: Date.now()
Installs fake timers with the specified Unix epoch.
fakeTimers.toFake
Type: ('setTimeout' | 'clearTimeout' | 'setImmediate' | 'clearImmediate' | 'setInterval' | 'clearInterval' | 'Date' | 'nextTick' | 'hrtime' | 'requestAnimationFrame' | 'cancelAnimationFrame' | 'requestIdleCallback' | 'cancelIdleCallback' | 'performance' | 'queueMicrotask')[]
Default: everything available globally except nextTick and queueMicrotask
An array with names of global methods and APIs to fake.
To only mock setTimeout() and nextTick(), specify this property as ['setTimeout', 'nextTick'].
Mocking nextTick is not supported when running Vitest inside node:child_process by using --pool=forks. NodeJS uses process.nextTick internally in node:child_process and hangs when it is mocked. Mocking nextTick is supported when running Vitest with --pool=threads.
fakeTimers.loopLimit
Type: number
Default: 10_000
The maximum number of timers that will be run when calling vi.runAllTimers().
fakeTimers.shouldAdvanceTime
Type: boolean
Default: false
Tells @sinonjs/fake-timers to increment mocked time automatically based on the real system time shift (e.g. the mocked time will be incremented by 20ms for every 20ms change in the real system time).
fakeTimers.advanceTimeDelta
Type: number
Default: 20
Relevant only when using with shouldAdvanceTime: true. increment mocked time by advanceTimeDelta ms every advanceTimeDelta ms change in the real system time.
fakeTimers.shouldClearNativeTimers
Type: boolean
Default: true
Tells fake timers to clear "native" (i.e. not fake) timers by delegating to their respective handlers. When disabled, it can lead to potentially unexpected behavior if timers existed prior to starting fake timers session.
workspace *
DEPRECATED
This options is deprecated and will be removed in the next major. Please, use projects instead.
Type: string | TestProjectConfiguration[]
CLI: --workspace=./file.js
Default: vitest.{workspace,projects}.{js,ts,json} close to the config file or root
Path to a workspace config file relative to root.
Since Vitest 3, you can also define the workspace array in the root config. If the workspace is defined in the config manually, Vitest will ignore the vitest.workspace file in the root.
projects *
Type: TestProjectConfiguration[]
Default: []
An array of projects.
isolate
Type: boolean
Default: true
CLI: --no-isolate, --isolate=false
Run tests in an isolated environment. This option has no effect on vmThreads and vmForks pools.
Disabling this option might improve performance if your code doesn't rely on side effects (which is usually true for projects with node environment).
TIP
You can disable isolation for specific pools by using poolOptions property.
includeTaskLocation
Type: boolean
Default: false
Should location property be included when Vitest API receives tasks in reporters. If you have a lot of tests, this might cause a small performance regression.
The location property has column and line values that correspond to the test or describe position in the original file.
This option will be auto-enabled if you don't disable it explicitly, and you are running Vitest with:
Vitest UI
or using the Browser Mode without headless mode
or using HTML Reporter
TIP
This option has no effect if you do not use custom code that relies on this.
snapshotEnvironment
Type: string
Path to a custom snapshot environment implementation. This is useful if you are running your tests in an environment that doesn't support Node.js APIs. This option doesn't have any effect on a browser runner.
This object should have the shape of SnapshotEnvironment and is used to resolve and read/write snapshot files:
export interface SnapshotEnvironment {
  getVersion: () => string
  getHeader: () => string
  resolvePath: (filepath: string) => Promise<string>
  resolveRawPath: (testPath: string, rawPath: string) => Promise<string>
  saveSnapshotFile: (filepath: string, snapshot: string) => Promise<void>
  readSnapshotFile: (filepath: string) => Promise<string | null>
  removeSnapshotFile: (filepath: string) => Promise<void>
}
You can extend default VitestSnapshotEnvironment from vitest/snapshot entry point if you need to overwrite only a part of the API.
WARNING
This is a low-level option and should be used only for advanced cases where you don't have access to default Node.js APIs.
If you just need to configure snapshots feature, use snapshotFormat or resolveSnapshotPath options.
env
Type: Partial<NodeJS.ProcessEnv>
Environment variables available on process.env and import.meta.env during tests. These variables will not be available in the main process (in globalSetup, for example).
expect
Type: ExpectOptions
expect.requireAssertions
Type: boolean
Default: false
The same as calling expect.hasAssertions() at the start of every test. This makes sure that no test will pass accidentally.
TIP
This only works with Vitest's expect. If you use assert or .should assertions, they will not count, and your test will fail due to the lack of expect assertions.
You can change the value of this by calling vi.setConfig({ expect: { requireAssertions: false } }). The config will be applied to every subsequent expect call until the vi.resetConfig is called manually.
expect.poll
Global configuration options for expect.poll. These are the same options you can pass down to expect.poll(condition, options).
expect.poll.interval
Type: number
Default: 50
Polling interval in milliseconds
expect.poll.timeout
Type: number
Default: 1000
Polling timeout in milliseconds
printConsoleTrace
Type: boolean
Default: false
Always print console traces when calling any console method. This is useful for debugging.
attachmentsDir 3.2.0+
Type: string
Default: '.vitest-attachments'
Directory path for storing attachments created by context.annotate relative to the project root.
Suggest changes to this page
Last updated: 6/12/25, 6:35 PM
Pager
Previous page
Features
Next page
Test API Reference


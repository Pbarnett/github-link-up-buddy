# Playwright API Reference

Playwright Test
Playwright Test provides a test function to declare tests and expect function to write assertions.
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
 await page.goto('https://playwright.dev/');
 const name = await page.innerText('.navbar__title');
 expect(name).toBe('Playwright');
});

Methods
test
Added in: v1.10 
Declares a test.
test(title, body)
test(title, details, body)
Usage
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
 await page.goto('https://playwright.dev/');
 // ...
});
Tags
You can tag tests by providing additional test details. Alternatively, you can include tags in the test title. Note that each tag must start with @ symbol.
import { test, expect } from '@playwright/test';

test('basic test', {
 tag: '@smoke',
}, async ({ page }) => {
 await page.goto('https://playwright.dev/');
 // ...
});

test('another test @smoke', async ({ page }) => {
 await page.goto('https://playwright.dev/');
 // ...
});
Test tags are displayed in the test report, and are available to a custom reporter via TestCase.tags property.
You can also filter tests by their tags during test execution:
in the command line;
in the config with testConfig.grep and testProject.grep;
Learn more about tagging.
Annotations
You can annotate tests by providing additional test details.
import { test, expect } from '@playwright/test';

test('basic test', {
 annotation: {
   type: 'issue',
   description: 'https://github.com/microsoft/playwright/issues/23180',
 },
}, async ({ page }) => {
 await page.goto('https://playwright.dev/');
 // ...
});
Test annotations are displayed in the test report, and are available to a custom reporter via TestCase.annotations property.
You can also add annotations during runtime by manipulating testInfo.annotations.
Learn more about test annotations.
Arguments
title string#
Test title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
Annotation type, for example 'issue'.
description string (optional)
Optional annotation description, for example an issue url.
Additional test details.
body function(Fixtures, TestInfo)#
Test body that takes one or two arguments: an object with fixtures and optional TestInfo.

test.afterAll
Added in: v1.10 
Declares an afterAll hook that is executed once per worker after all tests.
When called in the scope of a test file, runs after all tests in the file. When called inside a test.describe() group, runs after all tests in the group.
Usage
test.afterAll(async () => {
 console.log('Done with tests');
 // ...
});
Alternatively, you can declare a hook with a title.
test.afterAll('Teardown', async () => {
 console.log('Done with tests');
 // ...
});
Arguments
title string (optional) Added in: v1.38#
Hook title.
hookFunction function(Fixtures, TestInfo)#
Hook function that takes one or two arguments: an object with worker fixtures and optional TestInfo.
Details
When multiple afterAll hooks are added, they will run in the order of their registration.
Note that worker process is restarted on test failures, and afterAll hook runs again in the new worker. Learn more about workers and failures.
Playwright will continue running all applicable hooks even if some of them have failed.
test.afterAll(hookFunction)
test.afterAll(title, hookFunction)

test.afterEach
Added in: v1.10 
Declares an afterEach hook that is executed after each test.
When called in the scope of a test file, runs after each test in the file. When called inside a test.describe() group, runs after each test in the group.
You can access all the same Fixtures as the test body itself, and also the TestInfo object that gives a lot of useful information. For example, you can check whether the test succeeded or failed.
test.afterEach(hookFunction)
test.afterEach(title, hookFunction)
Usage
example.spec.ts
import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }) => {
 console.log(`Finished ${test.info().title} with status ${test.info().status}`);

 if (test.info().status !== test.info().expectedStatus)
   console.log(`Did not run as expected, ended up at ${page.url()}`);
});

test('my test', async ({ page }) => {
 // ...
});
Alternatively, you can declare a hook with a title.
example.spec.ts
test.afterEach('Status check', async ({ page }) => {
 if (test.info().status !== test.info().expectedStatus)
   console.log(`Did not run as expected, ended up at ${page.url()}`);
});
Arguments
title string (optional) Added in: v1.38#
Hook title.
hookFunction function(Fixtures, TestInfo)#
Hook function that takes one or two arguments: an object with fixtures and optional TestInfo.
Details
When multiple afterEach hooks are added, they will run in the order of their registration.
Playwright will continue running all applicable hooks even if some of them have failed.

test.beforeAll
Added in: v1.10 
Declares a beforeAll hook that is executed once per worker process before all tests.
When called in the scope of a test file, runs before all tests in the file. When called inside a test.describe() group, runs before all tests in the group.
You can use test.afterAll() to teardown any resources set up in beforeAll.
test.beforeAll(hookFunction)
test.beforeAll(title, hookFunction)
Usage
example.spec.ts
import { test, expect } from '@playwright/test';

test.beforeAll(async () => {
 console.log('Before tests');
});

test.afterAll(async () => {
 console.log('After tests');
});

test('my test', async ({ page }) => {
 // ...
});
Alternatively, you can declare a hook with a title.
example.spec.ts
test.beforeAll('Setup', async () => {
 console.log('Before tests');
});
Arguments
title string (optional) Added in: v1.38#
Hook title.
hookFunction function(Fixtures, TestInfo)#
Hook function that takes one or two arguments: an object with worker fixtures and optional TestInfo.
Details
When multiple beforeAll hooks are added, they will run in the order of their registration.
Note that worker process is restarted on test failures, and beforeAll hook runs again in the new worker. Learn more about workers and failures.
Playwright will continue running all applicable hooks even if some of them have failed.

test.beforeEach
Added in: v1.10 
Declares a beforeEach hook that is executed before each test.
When called in the scope of a test file, runs before each test in the file. When called inside a test.describe() group, runs before each test in the group.
You can access all the same Fixtures as the test body itself, and also the TestInfo object that gives a lot of useful information. For example, you can navigate the page before starting the test.
You can use test.afterEach() to teardown any resources set up in beforeEach.
test.beforeEach(hookFunction)
test.beforeEach(title, hookFunction)
Usage
example.spec.ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
 console.log(`Running ${test.info().title}`);
 await page.goto('https://my.start.url/');
});

test('my test', async ({ page }) => {
 expect(page.url()).toBe('https://my.start.url/');
});
Alternatively, you can declare a hook with a title.
example.spec.ts
test.beforeEach('Open start URL', async ({ page }) => {
 console.log(`Running ${test.info().title}`);
 await page.goto('https://my.start.url/');
});
Arguments
title string (optional) Added in: v1.38#
Hook title.
hookFunction function(Fixtures, TestInfo)#
Hook function that takes one or two arguments: an object with fixtures and optional TestInfo.
Details
When multiple beforeEach hooks are added, they will run in the order of their registration.
Playwright will continue running all applicable hooks even if some of them have failed.

test.describe
Added in: v1.10 
Declares a group of tests.
test.describe(title, callback)
test.describe(callback)
test.describe(title, details, callback)
Usage
You can declare a group of tests with a title. The title will be visible in the test report as a part of each test's title.
test.describe('two tests', () => {
 test('one', async ({ page }) => {
   // ...
 });

 test('two', async ({ page }) => {
   // ...
 });
});
Anonymous group
You can also declare a test group without a title. This is convenient to give a group of tests a common option with test.use().
test.describe(() => {
 test.use({ colorScheme: 'dark' });

 test('one', async ({ page }) => {
   // ...
 });

 test('two', async ({ page }) => {
   // ...
 });
});
Tags
You can tag all tests in a group by providing additional details. Note that each tag must start with @ symbol.
import { test, expect } from '@playwright/test';

test.describe('two tagged tests', {
 tag: '@smoke',
}, () => {
 test('one', async ({ page }) => {
   // ...
 });

 test('two', async ({ page }) => {
   // ...
 });
});
Learn more about tagging.
Annotations
You can annotate all tests in a group by providing additional details.
import { test, expect } from '@playwright/test';

test.describe('two annotated tests', {
 annotation: {
   type: 'issue',
   description: 'https://github.com/microsoft/playwright/issues/23180',
 },
}, () => {
 test('one', async ({ page }) => {
   // ...
 });

 test('two', async ({ page }) => {
   // ...
 });
});
Learn more about test annotations.
Arguments
title string (optional)#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
Additional details for all tests in the group.
callback function#
A callback that is run immediately when calling test.describe(). Any tests declared in this callback will belong to the group.

test.describe.configure
Added in: v1.10 
Configures the enclosing scope. Can be executed either on the top level or inside a describe. Configuration applies to the entire scope, regardless of whether it run before or after the test declaration.
Learn more about the execution modes here.
Usage
Running tests in parallel.
// Run all the tests in the file concurrently using parallel workers.
test.describe.configure({ mode: 'parallel' });
test('runs in parallel 1', async ({ page }) => {});
test('runs in parallel 2', async ({ page }) => {});


Running tests in order, retrying each failed test independently.
This is the default mode. It can be useful to set it explicitly to override project configuration that uses fullyParallel.
// Tests in this file run in order. Retries, if any, run independently.
test.describe.configure({ mode: 'default' });
test('runs first', async ({ page }) => {});
test('runs second', async ({ page }) => {});


Running tests serially, retrying from the start. If one of the serial tests fails, all subsequent tests are skipped.
NOTE
Running serially is not recommended. It is usually better to make your tests isolated, so they can be run independently.
// Annotate tests as inter-dependent.
test.describe.configure({ mode: 'serial' });
test('runs first', async ({ page }) => {});
test('runs second', async ({ page }) => {});


Configuring retries and timeout for each test.
// Each test in the file will be retried twice and have a timeout of 20 seconds.
test.describe.configure({ retries: 2, timeout: 20_000 });
test('runs first', async ({ page }) => {});
test('runs second', async ({ page }) => {});


Run multiple describes in parallel, but tests inside each describe in order.
test.describe.configure({ mode: 'parallel' });

test.describe('A, runs in parallel with B', () => {
  test.describe.configure({ mode: 'default' });
  test('in order A1', async ({ page }) => {});
  test('in order A2', async ({ page }) => {});
});

test.describe('B, runs in parallel with A', () => {
  test.describe.configure({ mode: 'default' });
  test('in order B1', async ({ page }) => {});
  test('in order B2', async ({ page }) => {});
});


Arguments
options Object (optional)
mode "default" | "parallel" | "serial" (optional)#
Execution mode. Learn more about the execution modes here.
retries number (optional) Added in: v1.28#
The number of retries for each test.
timeout number (optional) Added in: v1.28#
Timeout for each test in milliseconds. Overrides testProject.timeout and testConfig.timeout.

test.describe.fixme
Added in: v1.25 
Declares a test group similarly to test.describe(). Tests in this group are marked as "fixme" and will not be executed.
test.describe.fixme(title, callback)
test.describe.fixme(callback)
test.describe.fixme(title, details, callback)
Usage
test.describe.fixme('broken tests that should be fixed', () => {
 test('example', async ({ page }) => {
   // This test will not run
 });
});
You can also omit the title.
test.describe.fixme(() => {
 // ...
});
Arguments
title string (optional)#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for details description.
callback function#
A callback that is run immediately when calling test.describe.fixme(). Any tests added in this callback will belong to the group, and will not be run.

test.describe.only
Added in: v1.10 
Declares a focused group of tests. If there are some focused tests or suites, all of them will be run but nothing else.
test.describe.only(title, callback)
test.describe.only(callback)
test.describe.only(title, details, callback)
Usage
test.describe.only('focused group', () => {
 test('in the focused group', async ({ page }) => {
   // This test will run
 });
});
test('not in the focused group', async ({ page }) => {
 // This test will not run
});
You can also omit the title.
test.describe.only(() => {
 // ...
});
Arguments
title string (optional)#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for details description.
callback function#
A callback that is run immediately when calling test.describe.only(). Any tests added in this callback will belong to the group.

test.describe.skip
Added in: v1.10 
Declares a skipped test group, similarly to test.describe(). Tests in the skipped group are never run.
test.describe.skip(title, callback)
test.describe.skip(title)
test.describe.skip(title, details, callback)
Usage
test.describe.skip('skipped group', () => {
 test('example', async ({ page }) => {
   // This test will not run
 });
});
You can also omit the title.
test.describe.skip(() => {
 // ...
});
Arguments
title string#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for details description.
callback function#
A callback that is run immediately when calling test.describe.skip(). Any tests added in this callback will belong to the group, and will not be run.

test.extend
Added in: v1.10 
Extends the test object by defining fixtures and/or options that can be used in the tests.
Usage
First define a fixture and/or an option.
TypeScript
JavaScript
import { test as base } from '@playwright/test';
import { TodoPage } from './todo-page';

export type Options = { defaultItem: string };

// Extend basic test by providing a "defaultItem" option and a "todoPage" fixture.
export const test = base.extend<Options & { todoPage: TodoPage }>({
 // Define an option and provide a default value.
 // We can later override it in the config.
 defaultItem: ['Do stuff', { option: true }],

 // Define a fixture. Note that it can use built-in fixture "page"
 // and a new option "defaultItem".
 todoPage: async ({ page, defaultItem }, use) => {
   const todoPage = new TodoPage(page);
   await todoPage.goto();
   await todoPage.addToDo(defaultItem);
   await use(todoPage);
   await todoPage.removeAll();
 },
});
Then use the fixture in the test.
example.spec.ts
import { test } from './my-test';

test('test 1', async ({ todoPage }) => {
 await todoPage.addToDo('my todo');
 // ...
});
Configure the option in config file.
TypeScript
JavaScript
playwright.config.ts
import { defineConfig } from '@playwright/test';
import type { Options } from './my-test';

export default defineConfig<Options>({
 projects: [
   {
     name: 'shopping',
     use: { defaultItem: 'Buy milk' },
   },
   {
     name: 'wellbeing',
     use: { defaultItem: 'Exercise!' },
   },
 ]
});
Learn more about fixtures and parametrizing tests.
Arguments
fixtures Object#
An object containing fixtures and/or options. Learn more about fixtures format.
Returns
Test#

test.fail
Added in: v1.10 
Marks a test as "should fail". Playwright runs this test and ensures that it is actually failing. This is useful for documentation purposes to acknowledge that some functionality is broken until it is fixed.
To declare a "failing" test:
test.fail(title, body)
test.fail(title, details, body)
To annotate test as "failing" at runtime:
test.fail(condition, description)
test.fail(callback, description)
test.fail()
Usage
You can declare a test as failing, so that Playwright ensures it actually fails.
import { test, expect } from '@playwright/test';

test.fail('not yet ready', async ({ page }) => {
 // ...
});
If your test fails in some configurations, but not all, you can mark the test as failing inside the test body based on some condition. We recommend passing a description argument in this case.
import { test, expect } from '@playwright/test';

test('fail in WebKit', async ({ page, browserName }) => {
 test.fail(browserName === 'webkit', 'This feature is not implemented for Mac yet');
 // ...
});
You can mark all tests in a file or test.describe() group as "should fail" based on some condition with a single test.fail(callback, description) call.
import { test, expect } from '@playwright/test';

test.fail(({ browserName }) => browserName === 'webkit', 'not implemented yet');

test('fail in WebKit 1', async ({ page }) => {
 // ...
});
test('fail in WebKit 2', async ({ page }) => {
 // ...
});
You can also call test.fail() without arguments inside the test body to always mark the test as failed. We recommend declaring a failing test with test.fail(title, body) instead.
import { test, expect } from '@playwright/test';

test('less readable', async ({ page }) => {
 test.fail();
 // ...
});
Arguments
title string (optional) Added in: v1.42#
Test title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test() for test details description.
body function(Fixtures, TestInfo) (optional) Added in: v1.42#
Test body that takes one or two arguments: an object with fixtures and optional TestInfo.
condition boolean (optional)#
Test is marked as "should fail" when the condition is true.
callback function(Fixtures):boolean (optional)#
A function that returns whether to mark as "should fail", based on test fixtures. Test or tests are marked as "should fail" when the return value is true.
description string (optional)#
Optional description that will be reflected in a test report.

test.fail.only
Added in: v1.49 
You can use test.fail.only to focus on a specific test that is expected to fail. This is particularly useful when debugging a failing test or working on a specific issue.
To declare a focused "failing" test:
test.fail.only(title, body)
test.fail.only(title, details, body)
Usage
You can declare a focused failing test, so that Playwright runs only this test and ensures it actually fails.
import { test, expect } from '@playwright/test';

test.fail.only('focused failing test', async ({ page }) => {
 // This test is expected to fail
});
test('not in the focused group', async ({ page }) => {
 // This test will not run
});
Arguments
title string (optional)#
Test title.
details Object (optional)#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for test details description.
body function(Fixtures, TestInfo) (optional)#
Test body that takes one or two arguments: an object with fixtures and optional TestInfo.

test.fixme
Added in: v1.10 
Mark a test as "fixme", with the intention to fix it. Playwright will not run the test past the test.fixme() call.
To declare a "fixme" test:
test.fixme(title, body)
test.fixme(title, details, body)
To annotate test as "fixme" at runtime:
test.fixme(condition, description)
test.fixme(callback, description)
test.fixme()
Usage
You can declare a test as to be fixed, and Playwright will not run it.
import { test, expect } from '@playwright/test';

test.fixme('to be fixed', async ({ page }) => {
 // ...
});
If your test should be fixed in some configurations, but not all, you can mark the test as "fixme" inside the test body based on some condition. We recommend passing a description argument in this case. Playwright will run the test, but abort it immediately after the test.fixme call.
import { test, expect } from '@playwright/test';

test('to be fixed in Safari', async ({ page, browserName }) => {
 test.fixme(browserName === 'webkit', 'This feature breaks in Safari for some reason');
 // ...
});
You can mark all tests in a file or test.describe() group as "fixme" based on some condition with a single test.fixme(callback, description) call.
import { test, expect } from '@playwright/test';

test.fixme(({ browserName }) => browserName === 'webkit', 'Should figure out the issue');

test('to be fixed in Safari 1', async ({ page }) => {
 // ...
});
test('to be fixed in Safari 2', async ({ page }) => {
 // ...
});
You can also call test.fixme() without arguments inside the test body to always mark the test as failed. We recommend using test.fixme(title, body) instead.
import { test, expect } from '@playwright/test';

test('less readable', async ({ page }) => {
 test.fixme();
 // ...
});
Arguments
title string (optional)#
Test title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test() for test details description.
body function(Fixtures, TestInfo) (optional)#
Test body that takes one or two arguments: an object with fixtures and optional TestInfo.
condition boolean (optional)#
Test is marked as "should fail" when the condition is true.
callback function(Fixtures):boolean (optional)#
A function that returns whether to mark as "should fail", based on test fixtures. Test or tests are marked as "should fail" when the return value is true.
description string (optional)#
Optional description that will be reflected in a test report.

test.info
Added in: v1.10 
Returns information about the currently running test. This method can only be called during the test execution, otherwise it throws.
Usage
test('example test', async ({ page }) => {
 // ...
 await test.info().attach('screenshot', {
   body: await page.screenshot(),
   contentType: 'image/png',
 });
});
Returns
TestInfo#

test.only
Added in: v1.10 
Declares a focused test. If there are some focused tests or suites, all of them will be run but nothing else.
test.only(title, body)
test.only(title, details, body)
Usage
test.only('focus this test', async ({ page }) => {
 // Run only focused tests in the entire project.
});
Arguments
title string#
Test title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test() for test details description.
body function(Fixtures, TestInfo)#
Test body that takes one or two arguments: an object with fixtures and optional TestInfo.

test.setTimeout
Added in: v1.10 
Changes the timeout for the test. Zero means no timeout. Learn more about various timeouts.
Timeout for the currently running test is available through testInfo.timeout.
Usage
Changing test timeout.
test('very slow test', async ({ page }) => {
 test.setTimeout(120000);
  // ...
});


Changing timeout from a slow beforeEach hook. Note that this affects the test timeout that is shared with beforeEach hooks.
test.beforeEach(async ({ page }, testInfo) => {
 // Extend timeout for all tests running this hook by 30 seconds.
  test.setTimeout(testInfo.timeout + 30000);
});


Changing timeout for a beforeAll or afterAll hook. Note this affects the hook's timeout, not the test timeout.
test.beforeAll(async () => {
 // Set timeout for this hook.
  test.setTimeout(60000);
});


Changing timeout for all tests in a test.describe() group.
test.describe('group', () => {
 // Applies to all tests in this group.
  test.describe.configure({ timeout: 60000 });

  test('test one', async () => { /* ... */ });
  test('test two', async () => { /* ... */ });
  test('test three', async () => { /* ... */ });
});


Arguments
timeout number#
Timeout in milliseconds.

test.skip
Added in: v1.10 
Skip a test. Playwright will not run the test past the test.skip() call.
Skipped tests are not supposed to be ever run. If you intend to fix the test, use test.fixme() instead.
To declare a skipped test:
test.skip(title, body)
test.skip(title, details, body)
To skip a test at runtime:
test.skip(condition, description)
test.skip(callback, description)
test.skip()
Usage
You can declare a skipped test, and Playwright will not run it.
import { test, expect } from '@playwright/test';

test.skip('never run', async ({ page }) => {
 // ...
});
If your test should be skipped in some configurations, but not all, you can skip the test inside the test body based on some condition. We recommend passing a description argument in this case. Playwright will run the test, but abort it immediately after the test.skip call.
import { test, expect } from '@playwright/test';

test('Safari-only test', async ({ page, browserName }) => {
 test.skip(browserName !== 'webkit', 'This feature is Safari-only');
 // ...
});
You can skip all tests in a file or test.describe() group based on some condition with a single test.skip(callback, description) call.
import { test, expect } from '@playwright/test';

test.skip(({ browserName }) => browserName !== 'webkit', 'Safari-only');

test('Safari-only test 1', async ({ page }) => {
 // ...
});
test('Safari-only test 2', async ({ page }) => {
 // ...
});
You can also call test.skip() without arguments inside the test body to always mark the test as failed. We recommend using test.skip(title, body) instead.
import { test, expect } from '@playwright/test';

test('less readable', async ({ page }) => {
 test.skip();
 // ...
});
Arguments
title string (optional)#
Test title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test() for test details description.
body function(Fixtures, TestInfo) (optional)#
Test body that takes one or two arguments: an object with fixtures and optional TestInfo.
condition boolean (optional)#
Test is marked as "should fail" when the condition is true.
callback function(Fixtures):boolean (optional)#
A function that returns whether to mark as "should fail", based on test fixtures. Test or tests are marked as "should fail" when the return value is true.
description string (optional)#
Optional description that will be reflected in a test report.

test.slow
Added in: v1.10 
Marks a test as "slow". Slow test will be given triple the default timeout.
Note that test.slow() cannot be used in a beforeAll or afterAll hook. Use test.setTimeout() instead.
test.slow()
test.slow(condition, description)
test.slow(callback, description)
Usage
You can mark a test as slow by calling test.slow() inside the test body.
import { test, expect } from '@playwright/test';

test('slow test', async ({ page }) => {
 test.slow();
 // ...
});
If your test is slow in some configurations, but not all, you can mark it as slow based on a condition. We recommend passing a description argument in this case.
import { test, expect } from '@playwright/test';

test('slow in Safari', async ({ page, browserName }) => {
 test.slow(browserName === 'webkit', 'This feature is slow in Safari');
 // ...
});
You can mark all tests in a file or test.describe() group as "slow" based on some condition by passing a callback.
import { test, expect } from '@playwright/test';

test.slow(({ browserName }) => browserName === 'webkit', 'all tests are slow in Safari');

test('slow in Safari 1', async ({ page }) => {
 // ...
});
test('fail in Safari 2', async ({ page }) => {
 // ...
});
Arguments
condition boolean (optional)#
Test is marked as "slow" when the condition is true.
callback function(Fixtures):boolean (optional)#
A function that returns whether to mark as "slow", based on test fixtures. Test or tests are marked as "slow" when the return value is true.
description string (optional)#
Optional description that will be reflected in a test report.

test.step
Added in: v1.10 
Declares a test step that is shown in the report.
Usage
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
 await test.step('Log in', async () => {
   // ...
 });

 await test.step('Outer step', async () => {
   // ...
   // You can nest steps inside each other.
   await test.step('Inner step', async () => {
     // ...
   });
 });
});
Arguments
title string#
Step name.
body function(TestStepInfo):Promise<Object>#
Step body.
options Object (optional)
box boolean (optional) Added in: v1.39#
Whether to box the step in the report. Defaults to false. When the step is boxed, errors thrown from the step internals point to the step call site. See below for more details.
location Location (optional) Added in: v1.48#
Specifies a custom location for the step to be shown in test reports and trace viewer. By default, location of the test.step() call is shown.
timeout number (optional) Added in: v1.50#
The maximum time, in milliseconds, allowed for the step to complete. If the step does not complete within the specified timeout, the test.step() method will throw a TimeoutError. Defaults to 0 (no timeout).
Returns
Promise<Object>#
Details
The method returns the value returned by the step callback.
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
 const user = await test.step('Log in', async () => {
   // ...
   return 'john';
 });
 expect(user).toBe('john');
});
Decorator
You can use TypeScript method decorators to turn a method into a step. Each call to the decorated method will show up as a step in the report.
function step(target: Function, context: ClassMethodDecoratorContext) {
 return function replacementMethod(...args: any) {
   const name = this.constructor.name + '.' + (context.name as string);
   return test.step(name, async () => {
     return await target.call(this, ...args);
   });
 };
}

class LoginPage {
 constructor(readonly page: Page) {}

 @step
 async login() {
   const account = { username: 'Alice', password: 's3cr3t' };
   await this.page.getByLabel('Username or email address').fill(account.username);
   await this.page.getByLabel('Password').fill(account.password);
   await this.page.getByRole('button', { name: 'Sign in' }).click();
   await expect(this.page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
 }
}

test('example', async ({ page }) => {
 const loginPage = new LoginPage(page);
 await loginPage.login();
});
Boxing
When something inside a step fails, you would usually see the error pointing to the exact action that failed. For example, consider the following login step:
async function login(page) {
 await test.step('login', async () => {
   const account = { username: 'Alice', password: 's3cr3t' };
   await page.getByLabel('Username or email address').fill(account.username);
   await page.getByLabel('Password').fill(account.password);
   await page.getByRole('button', { name: 'Sign in' }).click();
   await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
 });
}

test('example', async ({ page }) => {
 await page.goto('https://github.com/login');
 await login(page);
});
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
 ... error details omitted ...

  8 |     await page.getByRole('button', { name: 'Sign in' }).click();
>  9 |     await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
    |                                                                               ^
 10 |   });
As we see above, the test may fail with an error pointing inside the step. If you would like the error to highlight the "login" step instead of its internals, use the box option. An error inside a boxed step points to the step call site.
async function login(page) {
 await test.step('login', async () => {
   // ...
 }, { box: true });  // Note the "box" option here.
}
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
 ... error details omitted ...

 14 |   await page.goto('https://github.com/login');
> 15 |   await login(page);
    |         ^
 16 | });
You can also create a TypeScript decorator for a boxed step, similar to a regular step decorator above:
function boxedStep(target: Function, context: ClassMethodDecoratorContext) {
 return function replacementMethod(...args: any) {
   const name = this.constructor.name + '.' + (context.name as string);
   return test.step(name, async () => {
     return await target.call(this, ...args);
   }, { box: true });  // Note the "box" option here.
 };
}

class LoginPage {
 constructor(readonly page: Page) {}

 @boxedStep
 async login() {
   // ....
 }
}

test('example', async ({ page }) => {
 const loginPage = new LoginPage(page);
 await loginPage.login();  // <-- Error will be reported on this line.
});

test.step.skip
Added in: v1.50 
Mark a test step as "skip" to temporarily disable its execution, useful for steps that are currently failing and planned for a near-term fix. Playwright will not run the step. See also testStepInfo.skip().
We recommend testStepInfo.skip() instead.
Usage
You can declare a skipped step, and Playwright will not run it.
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
 // ...
 await test.step.skip('not yet ready', async () => {
   // ...
 });
});
Arguments
title string#
Step name.
body function():Promise<Object>#
Step body.
options Object (optional)
box boolean (optional)#
Whether to box the step in the report. Defaults to false. When the step is boxed, errors thrown from the step internals point to the step call site. See below for more details.
location Location (optional)#
Specifies a custom location for the step to be shown in test reports and trace viewer. By default, location of the test.step() call is shown.
timeout number (optional)#
Maximum time in milliseconds for the step to finish. Defaults to 0 (no timeout).
Returns
Promise<void>#

test.use
Added in: v1.10 
Specifies options or fixtures to use in a single test file or a test.describe() group. Most useful to set an option, for example set locale to configure context fixture.
Usage
import { test, expect } from '@playwright/test';

test.use({ locale: 'en-US' });

test('test with locale', async ({ page }) => {
 // Default context and page have locale as specified
});
Arguments
options TestOptions#
An object with local options.
Details
test.use can be called either in the global scope or inside test.describe. It is an error to call it within beforeEach or beforeAll.
It is also possible to override a fixture by providing a function.
import { test, expect } from '@playwright/test';

test.use({
 locale: async ({}, use) => {
   // Read locale from some configuration file.
   const locale = await fs.promises.readFile('test-locale', 'utf-8');
   await use(locale);
 },
});

test('test with locale', async ({ page }) => {
 // Default context and page have locale as specified
});

Properties
test.expect
Added in: v1.10 
expect function can be used to create test assertions. Read more about test assertions.
Usage
test('example', async ({ page }) => {
 await test.expect(page).toHaveTitle('Title');
});
Type
Object

Deprecated
test.describe.parallel
Added in: v1.10 
DISCOURAGED
See test.describe.configure() for the preferred way of configuring the execution mode.
Declares a group of tests that could be run in parallel. By default, tests in a single test file run one after another, but using test.describe.parallel() allows them to run in parallel.
test.describe.parallel(title, callback)
test.describe.parallel(callback)
test.describe.parallel(title, details, callback)
Usage
test.describe.parallel('group', () => {
 test('runs in parallel 1', async ({ page }) => {});
 test('runs in parallel 2', async ({ page }) => {});
});
Note that parallel tests are executed in separate processes and cannot share any state or global variables. Each of the parallel tests executes all relevant hooks.
You can also omit the title.
test.describe.parallel(() => {
 // ...
});
Arguments
title string (optional)#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for details description.
callback function#
A callback that is run immediately when calling test.describe.parallel(). Any tests added in this callback will belong to the group.

test.describe.parallel.only
Added in: v1.10 
DISCOURAGED
See test.describe.configure() for the preferred way of configuring the execution mode.
Declares a focused group of tests that could be run in parallel. This is similar to test.describe.parallel(), but focuses the group. If there are some focused tests or suites, all of them will be run but nothing else.
test.describe.parallel.only(title, callback)
test.describe.parallel.only(callback)
test.describe.parallel.only(title, details, callback)
Usage
test.describe.parallel.only('group', () => {
 test('runs in parallel 1', async ({ page }) => {});
 test('runs in parallel 2', async ({ page }) => {});
});
You can also omit the title.
test.describe.parallel.only(() => {
 // ...
});
Arguments
title string (optional)#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for details description.
callback function#
A callback that is run immediately when calling test.describe.parallel.only(). Any tests added in this callback will belong to the group.

test.describe.serial
Added in: v1.10 
DISCOURAGED
See test.describe.configure() for the preferred way of configuring the execution mode.
Declares a group of tests that should always be run serially. If one of the tests fails, all subsequent tests are skipped. All tests in a group are retried together.
NOTE
Using serial is not recommended. It is usually better to make your tests isolated, so they can be run independently.
test.describe.serial(title, callback)
test.describe.serial(title)
test.describe.serial(title, details, callback)
Usage
test.describe.serial('group', () => {
 test('runs first', async ({ page }) => {});
 test('runs second', async ({ page }) => {});
});
You can also omit the title.
test.describe.serial(() => {
 // ...
});
Arguments
title string (optional)#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for details description.
callback function#
A callback that is run immediately when calling test.describe.serial(). Any tests added in this callback will belong to the group.

test.describe.serial.only
Added in: v1.10 
DISCOURAGED
See test.describe.configure() for the preferred way of configuring the execution mode.
Declares a focused group of tests that should always be run serially. If one of the tests fails, all subsequent tests are skipped. All tests in a group are retried together. If there are some focused tests or suites, all of them will be run but nothing else.
NOTE
Using serial is not recommended. It is usually better to make your tests isolated, so they can be run independently.
test.describe.serial.only(title, callback)
test.describe.serial.only(title)
test.describe.serial.only(title, details, callback)
Usage
test.describe.serial.only('group', () => {
 test('runs first', async ({ page }) => {
 });
 test('runs second', async ({ page }) => {
 });
});
You can also omit the title.
test.describe.serial.only(() => {
 // ...
});
Arguments
title string#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for details description.
callback function#
A callback that is run immediately when calling test.describe.serial.only(). Any tests added in this callback will belong to the group.
Next
Playwright Library
Methods
test
test.afterAll
test.afterEach
test.beforeAll
test.beforeEach
test.describe
test.describe.configure
test.describe.fixme
test.describe.only
test.describe.skip
test.extend
test.fail
test.fail.only
test.fixme
test.info
test.only
test.setTimeout
test.skip
test.slow
test.step
test.step.skip
test.use
Properties
test.expect
Deprecated
test.describe.parallel
test.describe.parallel.only
test.describe.serial
test.describe.serial.only
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Playwright Library
Playwright module provides a method to launch a browser instance. The following is a typical example of using Playwright to drive automation:
const { chromium, firefox, webkit } = require('playwright');

(async () => {
 const browser = await chromium.launch();  // Or 'firefox' or 'webkit'.
 const page = await browser.newPage();
 await page.goto('http://example.com');
 // other actions...
 await browser.close();
})();

Properties
chromium
Added before v1.9 
This object can be used to launch or connect to Chromium, returning instances of Browser.
Usage
playwright.chromium
Type
BrowserType

devices
Added before v1.9 
Returns a dictionary of devices to be used with browser.newContext() or browser.newPage().
const { webkit, devices } = require('playwright');
const iPhone = devices['iPhone 6'];

(async () => {
 const browser = await webkit.launch();
 const context = await browser.newContext({
   ...iPhone
 });
 const page = await context.newPage();
 await page.goto('http://example.com');
 // other actions...
 await browser.close();
})();
Usage
playwright.devices
Type
Object

errors
Added before v1.9 
Playwright methods might throw errors if they are unable to fulfill a request. For example, locator.waitFor() might fail if the selector doesn't match any nodes during the given timeframe.
For certain types of errors Playwright uses specific error classes. These classes are available via playwright.errors.
An example of handling a timeout error:
try {
 await page.locator('.foo').waitFor();
} catch (e) {
 if (e instanceof playwright.errors.TimeoutError) {
   // Do something if this is a timeout.
 }
}
Usage
playwright.errors
Type
Object
TimeoutError function
A class of TimeoutError.

firefox
Added before v1.9 
This object can be used to launch or connect to Firefox, returning instances of Browser.
Usage
playwright.firefox
Type
BrowserType

request
Added in: v1.16 
Exposes API that can be used for the Web API testing.
Usage
playwright.request
Type
APIRequest

selectors
Added before v1.9 
Selectors can be used to install custom selector engines. See extensibility for more information.
Usage
playwright.selectors
Type
Selectors

webkit
Added before v1.9 
This object can be used to launch or connect to WebKit, returning instances of Browser.
Usage
playwright.webkit
Type
BrowserType
Previous
Playwright Test
Next
APIRequest
Properties
chromium
devices
errors
firefox
request
selectors
webkit
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft


APIRequest
Exposes API that can be used for the Web API testing. This class is used for creating APIRequestContext instance which in turn can be used for sending web requests. An instance of this class can be obtained via playwright.request. For more information see APIRequestContext.

Methods
newContext
Added in: v1.16 
Creates new instances of APIRequestContext.
Usage
await apiRequest.newContext();
await apiRequest.newContext(options);
Arguments
options Object (optional)
baseURL string (optional)#
Methods like apiRequestContext.get() take the base URL into consideration by using the URL() constructor for building the corresponding URL. Examples:
baseURL: http://localhost:3000 and sending request to /bar.html results in http://localhost:3000/bar.html
baseURL: http://localhost:3000/foo/ and sending request to ./bar.html results in http://localhost:3000/foo/bar.html
baseURL: http://localhost:3000/foo (without trailing slash) and navigating to ./bar.html results in http://localhost:3000/bar.html
clientCertificates Array<Object> (optional) Added in: 1.46#
origin string
Exact origin that the certificate is valid for. Origin includes https protocol, a hostname and optionally a port.
certPath string (optional)
Path to the file with the certificate in PEM format.
cert Buffer (optional)
Direct value of the certificate in PEM format.
keyPath string (optional)
Path to the file with the private key in PEM format.
key Buffer (optional)
Direct value of the private key in PEM format.
pfxPath string (optional)
Path to the PFX or PKCS12 encoded private key and certificate chain.
pfx Buffer (optional)
Direct value of the PFX or PKCS12 encoded private key and certificate chain.
passphrase string (optional)
Passphrase for the private key (PEM or PFX).
TLS Client Authentication allows the server to request a client certificate and verify it.
Details
An array of client certificates to be used. Each certificate object must have either both certPath and keyPath, a single pfxPath, or their corresponding direct value equivalents (cert and key, or pfx). Optionally, passphrase property should be provided if the certificate is encrypted. The origin property should be provided with an exact match to the request origin that the certificate is valid for.
NOTE
When using WebKit on macOS, accessing localhost will not pick up client certificates. You can make it work by replacing localhost with local.playwright.
extraHTTPHeaders Object<string, string> (optional)#
An object containing additional HTTP headers to be sent with every request. Defaults to none.
failOnStatusCode boolean (optional) Added in: v1.51#
Whether to throw on response codes other than 2xx and 3xx. By default response object is returned for all status codes.
httpCredentials Object (optional)#
username string
password string
origin string (optional)
Restrain sending http credentials on specific origin (scheme://host:port).
send "unauthorized" | "always" (optional)
This option only applies to the requests sent from corresponding APIRequestContext and does not affect requests sent from the browser. 'always' - Authorization header with basic authentication credentials will be sent with the each API request. 'unauthorized - the credentials are only sent when 401 (Unauthorized) response with WWW-Authenticate header is received. Defaults to 'unauthorized'.
Credentials for HTTP authentication. If no origin is specified, the username and password are sent to any servers upon unauthorized responses.
ignoreHTTPSErrors boolean (optional)#
Whether to ignore HTTPS errors when sending network requests. Defaults to false.
maxRedirects number (optional) Added in: v1.52#
Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded. Defaults to 20. Pass 0 to not follow redirects. This can be overwritten for each request individually.
proxy Object (optional)#
server string
Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example http://myproxy.com:3128 or socks5://myproxy.com:3128. Short form myproxy.com:3128 is considered an HTTP proxy.
bypass string (optional)
Optional comma-separated domains to bypass proxy, for example ".com, chromium.org, .domain.com".
username string (optional)
Optional username to use if HTTP proxy requires authentication.
password string (optional)
Optional password to use if HTTP proxy requires authentication.
Network proxy settings.
storageState string | Object (optional)#
cookies Array<Object>
name string
value string
domain string
path string
expires number
Unix time in seconds.
httpOnly boolean
secure boolean
sameSite "Strict" | "Lax" | "None"
origins Array<Object>
origin string
localStorage Array<Object>
name string
value string
Populates context with given storage state. This option can be used to initialize context with logged-in information obtained via browserContext.storageState() or apiRequestContext.storageState(). Either a path to the file with saved storage, or the value returned by one of browserContext.storageState() or apiRequestContext.storageState() methods.
timeout number (optional)#
Maximum time in milliseconds to wait for the response. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
userAgent string (optional)#
Specific user agent to use in this context.
Returns
Promise<APIRequestContext>#
Previous
Playwright Library
Next
APIRequestContext
Methods
newContext
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
APIRequestContext
This API is used for the Web API testing. You can use it to trigger API endpoints, configure micro-services, prepare environment or the service to your e2e test.
Each Playwright browser context has associated with it APIRequestContext instance which shares cookie storage with the browser context and can be accessed via browserContext.request or page.request. It is also possible to create a new APIRequestContext instance manually by calling apiRequest.newContext().
Cookie management
APIRequestContext returned by browserContext.request and page.request shares cookie storage with the corresponding BrowserContext. Each API request will have Cookie header populated with the values from the browser context. If the API response contains Set-Cookie header it will automatically update BrowserContext cookies and requests made from the page will pick them up. This means that if you log in using this API, your e2e test will be logged in and vice versa.
If you want API requests to not interfere with the browser cookies you should create a new APIRequestContext by calling apiRequest.newContext(). Such APIRequestContext object will have its own isolated cookie storage.

Methods
delete
Added in: v1.16 
Sends HTTP(S) DELETE request and returns its response. The method will populate request cookies from the context and update context cookies from the response. The method will automatically follow redirects.
Usage
await apiRequestContext.delete(url);
await apiRequestContext.delete(url, options);
Arguments
url string#
Target URL.
options Object (optional)
data string | Buffer | Serializable (optional) Added in: v1.17#
Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string and content-type header will be set to application/json if not explicitly set. Otherwise the content-type header will be set to application/octet-stream if not explicitly set.
failOnStatusCode boolean (optional)#
Whether to throw on response codes other than 2xx and 3xx. By default response object is returned for all status codes.
form Object<string, string | number | boolean> | FormData (optional) Added in: v1.17#
Provides an object that will be serialized as html form using application/x-www-form-urlencoded encoding and sent as this request body. If this parameter is specified content-type header will be set to application/x-www-form-urlencoded unless explicitly provided.
headers Object<string, string> (optional)#
Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
ignoreHTTPSErrors boolean (optional)#
Whether to ignore HTTPS errors when sending network requests. Defaults to false.
maxRedirects number (optional) Added in: v1.26#
Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded. Defaults to 20. Pass 0 to not follow redirects.
maxRetries number (optional) Added in: v1.46#
Maximum number of times network errors should be retried. Currently only ECONNRESET error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to 0 - no retries.
multipart FormData | Object<string, string | number | boolean | ReadStream | Object> (optional) Added in: v1.17#
name string
File name
mimeType string
File type
buffer Buffer
File content
Provides an object that will be serialized as html form using multipart/form-data encoding and sent as this request body. If this parameter is specified content-type header will be set to multipart/form-data unless explicitly provided. File values can be passed either as fs.ReadStream or as file-like object containing file name, mime-type and its content.
params Object<string, string | number | boolean> | URLSearchParams | string (optional)#
Query parameters to be sent with the URL.
timeout number (optional)#
Request timeout in milliseconds. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
Returns
Promise<APIResponse>#

dispose
Added in: v1.16 
All responses returned by apiRequestContext.get() and similar methods are stored in the memory, so that you can later call apiResponse.body().This method discards all its resources, calling any method on disposed APIRequestContext will throw an exception.
Usage
await apiRequestContext.dispose();
await apiRequestContext.dispose(options);
Arguments
options Object (optional)
reason string (optional) Added in: v1.45#
The reason to be reported to the operations interrupted by the context disposal.
Returns
Promise<void>#

fetch
Added in: v1.16 
Sends HTTP(S) request and returns its response. The method will populate request cookies from the context and update context cookies from the response. The method will automatically follow redirects.
Usage
JSON objects can be passed directly to the request:
await request.fetch('https://example.com/api/createBook', {
 method: 'post',
 data: {
   title: 'Book Title',
   author: 'John Doe',
 }
});
The common way to send file(s) in the body of a request is to upload them as form fields with multipart/form-data encoding, by specifiying the multipart parameter:
const form = new FormData();
form.set('name', 'John');
form.append('name', 'Doe');
// Send two file fields with the same name.
form.append('file', new File(['console.log(2024);'], 'f1.js', { type: 'text/javascript' }));
form.append('file', new File(['hello'], 'f2.txt', { type: 'text/plain' }));
await request.fetch('https://example.com/api/uploadForm', {
 multipart: form
});
Arguments
urlOrRequest string | Request#
Target URL or Request to get all parameters from.
options Object (optional)
data string | Buffer | Serializable (optional)#
Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string and content-type header will be set to application/json if not explicitly set. Otherwise the content-type header will be set to application/octet-stream if not explicitly set.
failOnStatusCode boolean (optional)#
Whether to throw on response codes other than 2xx and 3xx. By default response object is returned for all status codes.
form Object<string, string | number | boolean> | FormData (optional)#
Provides an object that will be serialized as html form using application/x-www-form-urlencoded encoding and sent as this request body. If this parameter is specified content-type header will be set to application/x-www-form-urlencoded unless explicitly provided.
headers Object<string, string> (optional)#
Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
ignoreHTTPSErrors boolean (optional)#
Whether to ignore HTTPS errors when sending network requests. Defaults to false.
maxRedirects number (optional) Added in: v1.26#
Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded. Defaults to 20. Pass 0 to not follow redirects.
maxRetries number (optional) Added in: v1.46#
Maximum number of times network errors should be retried. Currently only ECONNRESET error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to 0 - no retries.
method string (optional)#
If set changes the fetch method (e.g. PUT or POST). If not specified, GET method is used.
multipart FormData | Object<string, string | number | boolean | ReadStream | Object> (optional)#
name string
File name
mimeType string
File type
buffer Buffer
File content
Provides an object that will be serialized as html form using multipart/form-data encoding and sent as this request body. If this parameter is specified content-type header will be set to multipart/form-data unless explicitly provided. File values can be passed either as fs.ReadStream or as file-like object containing file name, mime-type and its content.
params Object<string, string | number | boolean> | URLSearchParams | string (optional)#
Query parameters to be sent with the URL.
timeout number (optional)#
Request timeout in milliseconds. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
Returns
Promise<APIResponse>#

get
Added in: v1.16 
Sends HTTP(S) GET request and returns its response. The method will populate request cookies from the context and update context cookies from the response. The method will automatically follow redirects.
Usage
Request parameters can be configured with params option, they will be serialized into the URL search parameters:
// Passing params as object
await request.get('https://example.com/api/getText', {
 params: {
   'isbn': '1234',
   'page': 23,
 }
});

// Passing params as URLSearchParams
const searchParams = new URLSearchParams();
searchParams.set('isbn', '1234');
searchParams.append('page', 23);
searchParams.append('page', 24);
await request.get('https://example.com/api/getText', { params: searchParams });

// Passing params as string
const queryString = 'isbn=1234&page=23&page=24';
await request.get('https://example.com/api/getText', { params: queryString });
Arguments
url string#
Target URL.
options Object (optional)
data string | Buffer | Serializable (optional) Added in: v1.26#
Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string and content-type header will be set to application/json if not explicitly set. Otherwise the content-type header will be set to application/octet-stream if not explicitly set.
failOnStatusCode boolean (optional)#
Whether to throw on response codes other than 2xx and 3xx. By default response object is returned for all status codes.
form Object<string, string | number | boolean> | FormData (optional) Added in: v1.26#
Provides an object that will be serialized as html form using application/x-www-form-urlencoded encoding and sent as this request body. If this parameter is specified content-type header will be set to application/x-www-form-urlencoded unless explicitly provided.
headers Object<string, string> (optional)#
Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
ignoreHTTPSErrors boolean (optional)#
Whether to ignore HTTPS errors when sending network requests. Defaults to false.
maxRedirects number (optional) Added in: v1.26#
Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded. Defaults to 20. Pass 0 to not follow redirects.
maxRetries number (optional) Added in: v1.46#
Maximum number of times network errors should be retried. Currently only ECONNRESET error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to 0 - no retries.
multipart FormData | Object<string, string | number | boolean | ReadStream | Object> (optional) Added in: v1.26#
name string
File name
mimeType string
File type
buffer Buffer
File content
Provides an object that will be serialized as html form using multipart/form-data encoding and sent as this request body. If this parameter is specified content-type header will be set to multipart/form-data unless explicitly provided. File values can be passed either as fs.ReadStream or as file-like object containing file name, mime-type and its content.
params Object<string, string | number | boolean> | URLSearchParams | string (optional)#
Query parameters to be sent with the URL.
timeout number (optional)#
Request timeout in milliseconds. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
Returns
Promise<APIResponse>#

head
Added in: v1.16 
Sends HTTP(S) HEAD request and returns its response. The method will populate request cookies from the context and update context cookies from the response. The method will automatically follow redirects.
Usage
await apiRequestContext.head(url);
await apiRequestContext.head(url, options);
Arguments
url string#
Target URL.
options Object (optional)
data string | Buffer | Serializable (optional) Added in: v1.26#
Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string and content-type header will be set to application/json if not explicitly set. Otherwise the content-type header will be set to application/octet-stream if not explicitly set.
failOnStatusCode boolean (optional)#
Whether to throw on response codes other than 2xx and 3xx. By default response object is returned for all status codes.
form Object<string, string | number | boolean> | FormData (optional) Added in: v1.26#
Provides an object that will be serialized as html form using application/x-www-form-urlencoded encoding and sent as this request body. If this parameter is specified content-type header will be set to application/x-www-form-urlencoded unless explicitly provided.
headers Object<string, string> (optional)#
Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
ignoreHTTPSErrors boolean (optional)#
Whether to ignore HTTPS errors when sending network requests. Defaults to false.
maxRedirects number (optional) Added in: v1.26#
Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded. Defaults to 20. Pass 0 to not follow redirects.
maxRetries number (optional) Added in: v1.46#
Maximum number of times network errors should be retried. Currently only ECONNRESET error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to 0 - no retries.
multipart FormData | Object<string, string | number | boolean | ReadStream | Object> (optional) Added in: v1.26#
name string
File name
mimeType string
File type
buffer Buffer
File content
Provides an object that will be serialized as html form using multipart/form-data encoding and sent as this request body. If this parameter is specified content-type header will be set to multipart/form-data unless explicitly provided. File values can be passed either as fs.ReadStream or as file-like object containing file name, mime-type and its content.
params Object<string, string | number | boolean> | URLSearchParams | string (optional)#
Query parameters to be sent with the URL.
timeout number (optional)#
Request timeout in milliseconds. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
Returns
Promise<APIResponse>#

patch
Added in: v1.16 
Sends HTTP(S) PATCH request and returns its response. The method will populate request cookies from the context and update context cookies from the response. The method will automatically follow redirects.
Usage
await apiRequestContext.patch(url);
await apiRequestContext.patch(url, options);
Arguments
url string#
Target URL.
options Object (optional)
data string | Buffer | Serializable (optional)#
Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string and content-type header will be set to application/json if not explicitly set. Otherwise the content-type header will be set to application/octet-stream if not explicitly set.
failOnStatusCode boolean (optional)#
Whether to throw on response codes other than 2xx and 3xx. By default response object is returned for all status codes.
form Object<string, string | number | boolean> | FormData (optional)#
Provides an object that will be serialized as html form using application/x-www-form-urlencoded encoding and sent as this request body. If this parameter is specified content-type header will be set to application/x-www-form-urlencoded unless explicitly provided.
headers Object<string, string> (optional)#
Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
ignoreHTTPSErrors boolean (optional)#
Whether to ignore HTTPS errors when sending network requests. Defaults to false.
maxRedirects number (optional) Added in: v1.26#
Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded. Defaults to 20. Pass 0 to not follow redirects.
maxRetries number (optional) Added in: v1.46#
Maximum number of times network errors should be retried. Currently only ECONNRESET error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to 0 - no retries.
multipart FormData | Object<string, string | number | boolean | ReadStream | Object> (optional)#
name string
File name
mimeType string
File type
buffer Buffer
File content
Provides an object that will be serialized as html form using multipart/form-data encoding and sent as this request body. If this parameter is specified content-type header will be set to multipart/form-data unless explicitly provided. File values can be passed either as fs.ReadStream or as file-like object containing file name, mime-type and its content.
params Object<string, string | number | boolean> | URLSearchParams | string (optional)#
Query parameters to be sent with the URL.
timeout number (optional)#
Request timeout in milliseconds. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
Returns
Promise<APIResponse>#

post
Added in: v1.16 
Sends HTTP(S) POST request and returns its response. The method will populate request cookies from the context and update context cookies from the response. The method will automatically follow redirects.
Usage
JSON objects can be passed directly to the request:
await request.post('https://example.com/api/createBook', {
 data: {
   title: 'Book Title',
   author: 'John Doe',
 }
});
To send form data to the server use form option. Its value will be encoded into the request body with application/x-www-form-urlencoded encoding (see below how to use multipart/form-data form encoding to send files):
await request.post('https://example.com/api/findBook', {
 form: {
   title: 'Book Title',
   author: 'John Doe',
 }
});
The common way to send file(s) in the body of a request is to upload them as form fields with multipart/form-data encoding. Use FormData to construct request body and pass it to the request as multipart parameter:
const form = new FormData();
form.set('name', 'John');
form.append('name', 'Doe');
// Send two file fields with the same name.
form.append('file', new File(['console.log(2024);'], 'f1.js', { type: 'text/javascript' }));
form.append('file', new File(['hello'], 'f2.txt', { type: 'text/plain' }));
await request.post('https://example.com/api/uploadForm', {
 multipart: form
});
Arguments
url string#
Target URL.
options Object (optional)
data string | Buffer | Serializable (optional)#
Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string and content-type header will be set to application/json if not explicitly set. Otherwise the content-type header will be set to application/octet-stream if not explicitly set.
failOnStatusCode boolean (optional)#
Whether to throw on response codes other than 2xx and 3xx. By default response object is returned for all status codes.
form Object<string, string | number | boolean> | FormData (optional)#
Provides an object that will be serialized as html form using application/x-www-form-urlencoded encoding and sent as this request body. If this parameter is specified content-type header will be set to application/x-www-form-urlencoded unless explicitly provided.
headers Object<string, string> (optional)#
Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
ignoreHTTPSErrors boolean (optional)#
Whether to ignore HTTPS errors when sending network requests. Defaults to false.
maxRedirects number (optional) Added in: v1.26#
Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded. Defaults to 20. Pass 0 to not follow redirects.
maxRetries number (optional) Added in: v1.46#
Maximum number of times network errors should be retried. Currently only ECONNRESET error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to 0 - no retries.
multipart FormData | Object<string, string | number | boolean | ReadStream | Object> (optional)#
name string
File name
mimeType string
File type
buffer Buffer
File content
Provides an object that will be serialized as html form using multipart/form-data encoding and sent as this request body. If this parameter is specified content-type header will be set to multipart/form-data unless explicitly provided. File values can be passed either as fs.ReadStream or as file-like object containing file name, mime-type and its content.
params Object<string, string | number | boolean> | URLSearchParams | string (optional)#
Query parameters to be sent with the URL.
timeout number (optional)#
Request timeout in milliseconds. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
Returns
Promise<APIResponse>#

put
Added in: v1.16 
Sends HTTP(S) PUT request and returns its response. The method will populate request cookies from the context and update context cookies from the response. The method will automatically follow redirects.
Usage
await apiRequestContext.put(url);
await apiRequestContext.put(url, options);
Arguments
url string#
Target URL.
options Object (optional)
data string | Buffer | Serializable (optional)#
Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string and content-type header will be set to application/json if not explicitly set. Otherwise the content-type header will be set to application/octet-stream if not explicitly set.
failOnStatusCode boolean (optional)#
Whether to throw on response codes other than 2xx and 3xx. By default response object is returned for all status codes.
form Object<string, string | number | boolean> | FormData (optional)#
Provides an object that will be serialized as html form using application/x-www-form-urlencoded encoding and sent as this request body. If this parameter is specified content-type header will be set to application/x-www-form-urlencoded unless explicitly provided.
headers Object<string, string> (optional)#
Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
ignoreHTTPSErrors boolean (optional)#
Whether to ignore HTTPS errors when sending network requests. Defaults to false.
maxRedirects number (optional) Added in: v1.26#
Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded. Defaults to 20. Pass 0 to not follow redirects.
maxRetries number (optional) Added in: v1.46#
Maximum number of times network errors should be retried. Currently only ECONNRESET error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to 0 - no retries.
multipart FormData | Object<string, string | number | boolean | ReadStream | Object> (optional)#
name string
File name
mimeType string
File type
buffer Buffer
File content
Provides an object that will be serialized as html form using multipart/form-data encoding and sent as this request body. If this parameter is specified content-type header will be set to multipart/form-data unless explicitly provided. File values can be passed either as fs.ReadStream or as file-like object containing file name, mime-type and its content.
params Object<string, string | number | boolean> | URLSearchParams | string (optional)#
Query parameters to be sent with the URL.
timeout number (optional)#
Request timeout in milliseconds. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
Returns
Promise<APIResponse>#

storageState
Added in: v1.16 
Returns storage state for this request context, contains current cookies and local storage snapshot if it was passed to the constructor.
Usage
await apiRequestContext.storageState();
await apiRequestContext.storageState(options);
Arguments
options Object (optional)
indexedDB boolean (optional) Added in: v1.51#
Set to true to include IndexedDB in the storage state snapshot.
path string (optional)#
The file path to save the storage state to. If path is a relative path, then it is resolved relative to current working directory. If no path is provided, storage state is still returned, but won't be saved to the disk.
Returns
Promise<Object>#
cookies Array<Object>
name string
value string
domain string
path string
expires number
Unix time in seconds.
httpOnly boolean
secure boolean
sameSite "Strict" | "Lax" | "None"
origins Array<Object>
origin string
localStorage Array<Object>
name string
value string
Previous
APIRequest
Next
APIResponse
Methods
delete
dispose
fetch
get
head
patch
post
put
storageState
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
APIResponse
APIResponse class represents responses returned by apiRequestContext.get() and similar methods.

Methods
body
Added in: v1.16 
Returns the buffer with response body.
Usage
await apiResponse.body();
Returns
Promise<Buffer>#

dispose
Added in: v1.16 
Disposes the body of this response. If not called then the body will stay in memory until the context closes.
Usage
await apiResponse.dispose();
Returns
Promise<void>#

headers
Added in: v1.16 
An object with all the response HTTP headers associated with this response.
Usage
apiResponse.headers();
Returns
Object<string, string>#

headersArray
Added in: v1.16 
An array with all the response HTTP headers associated with this response. Header names are not lower-cased. Headers with multiple entries, such as Set-Cookie, appear in the array multiple times.
Usage
apiResponse.headersArray();
Returns
Array<Object>#
name string
Name of the header.
value string
Value of the header.

json
Added in: v1.16 
Returns the JSON representation of response body.
This method will throw if the response body is not parsable via JSON.parse.
Usage
await apiResponse.json();
Returns
Promise<Serializable>#

ok
Added in: v1.16 
Contains a boolean stating whether the response was successful (status in the range 200-299) or not.
Usage
apiResponse.ok();
Returns
boolean#

status
Added in: v1.16 
Contains the status code of the response (e.g., 200 for a success).
Usage
apiResponse.status();
Returns
number#

statusText
Added in: v1.16 
Contains the status text of the response (e.g. usually an "OK" for a success).
Usage
apiResponse.statusText();
Returns
string#

text
Added in: v1.16 
Returns the text representation of response body.
Usage
await apiResponse.text();
Returns
Promise<string>#

url
Added in: v1.16 
Contains the URL of the response.
Usage
apiResponse.url();
Returns
string#
Previous
APIRequestContext
Next
Accessibility
Methods
body
dispose
headers
headersArray
json
ok
status
statusText
text
url
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Accessibility
DEPRECATED
This class is deprecated. Please use other libraries such as Axe if you need to test page accessibility. See our Node.js guide for integration with Axe.
The Accessibility class provides methods for inspecting Chromium's accessibility tree. The accessibility tree is used by assistive technology such as screen readers or switches.
Accessibility is a very platform-specific thing. On different platforms, there are different screen readers that might have wildly different output.
Rendering engines of Chromium, Firefox and WebKit have a concept of "accessibility tree", which is then translated into different platform-specific APIs. Accessibility namespace gives access to this Accessibility Tree.
Most of the accessibility tree gets filtered out when converting from internal browser AX Tree to Platform-specific AX-Tree or by assistive technologies themselves. By default, Playwright tries to approximate this filtering, exposing only the "interesting" nodes of the tree.

Deprecated
snapshot
Added before v1.9 
DEPRECATED
This method is deprecated. Please use other libraries such as Axe if you need to test page accessibility. See our Node.js guide for integration with Axe.
Captures the current state of the accessibility tree. The returned object represents the root accessible node of the page.
NOTE
The Chromium accessibility tree contains nodes that go unused on most platforms and by most screen readers. Playwright will discard them as well for an easier to process tree, unless interestingOnly is set to false.
Usage
An example of dumping the entire accessibility tree:
const snapshot = await page.accessibility.snapshot();
console.log(snapshot);
An example of logging the focused node's name:
const snapshot = await page.accessibility.snapshot();
const node = findFocusedNode(snapshot);
console.log(node && node.name);

function findFocusedNode(node) {
 if (node.focused)
   return node;
 for (const child of node.children || []) {
   const foundNode = findFocusedNode(child);
   if (foundNode)
     return foundNode;
 }
 return null;
}
Arguments
options Object (optional)
interestingOnly boolean (optional)#
Prune uninteresting nodes from the tree. Defaults to true.
root ElementHandle (optional)#
The root DOM element for the snapshot. Defaults to the whole page.
Returns
Promise<null | Object>#
role string
The role.
name string
A human readable name for the node.
value string | number
The current value of the node, if applicable.
description string
An additional human readable description of the node, if applicable.
keyshortcuts string
Keyboard shortcuts associated with this node, if applicable.
roledescription string
A human readable alternative to the role, if applicable.
valuetext string
A description of the current value, if applicable.
disabled boolean
Whether the node is disabled, if applicable.
expanded boolean
Whether the node is expanded or collapsed, if applicable.
focused boolean
Whether the node is focused, if applicable.
modal boolean
Whether the node is modal, if applicable.
multiline boolean
Whether the node text input supports multiline, if applicable.
multiselectable boolean
Whether more than one child can be selected, if applicable.
readonly boolean
Whether the node is read only, if applicable.
required boolean
Whether the node is required, if applicable.
selected boolean
Whether the node is selected in its parent node, if applicable.
checked boolean | "mixed"
Whether the checkbox is checked, or "mixed", if applicable.
pressed boolean | "mixed"
Whether the toggle button is checked, or "mixed", if applicable.
level number
The level of a heading, if applicable.
valuemin number
The minimum value in a node, if applicable.
valuemax number
The maximum value in a node, if applicable.
autocomplete string
What kind of autocomplete is supported by a control, if applicable.
haspopup string
What kind of popup is currently being shown for a node, if applicable.
invalid string
Whether and in what way this node's value is invalid, if applicable.
orientation string
Whether the node is oriented horizontally or vertically, if applicable.
children Array<Object>
Child nodes, if any, if applicable.
Previous
APIResponse
Next
Browser
Deprecated
snapshot
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Browser
A Browser is created via browserType.launch(). An example of using a Browser to create a Page:
const { firefox } = require('playwright');  // Or 'chromium' or 'webkit'.

(async () => {
 const browser = await firefox.launch();
 const page = await browser.newPage();
 await page.goto('https://example.com');
 await browser.close();
})();

Methods
browserType
Added in: v1.23 
Get the browser type (chromium, firefox or webkit) that the browser belongs to.
Usage
browser.browserType();
Returns
BrowserType#

close
Added before v1.9 
In case this browser is obtained using browserType.launch(), closes the browser and all of its pages (if any were opened).
In case this browser is connected to, clears all created contexts belonging to this browser and disconnects from the browser server.
NOTE
This is similar to force-quitting the browser. To close pages gracefully and ensure you receive page close events, call browserContext.close() on any BrowserContext instances you explicitly created earlier using browser.newContext() before calling browser.close().
The Browser object itself is considered to be disposed and cannot be used anymore.
Usage
await browser.close();
await browser.close(options);
Arguments
options Object (optional)
reason string (optional) Added in: v1.40#
The reason to be reported to the operations interrupted by the browser closure.
Returns
Promise<void>#

contexts
Added before v1.9 
Returns an array of all open browser contexts. In a newly created browser, this will return zero browser contexts.
Usage
const browser = await pw.webkit.launch();
console.log(browser.contexts().length); // prints `0`

const context = await browser.newContext();
console.log(browser.contexts().length); // prints `1`
Returns
Array<BrowserContext>#

isConnected
Added before v1.9 
Indicates that the browser is connected.
Usage
browser.isConnected();
Returns
boolean#

newBrowserCDPSession
Added in: v1.11 
NOTE
CDP Sessions are only supported on Chromium-based browsers.
Returns the newly created browser session.
Usage
await browser.newBrowserCDPSession();
Returns
Promise<CDPSession>#

newContext
Added before v1.9 
Creates a new browser context. It won't share cookies/cache with other browser contexts.
NOTE
If directly using this method to create BrowserContexts, it is best practice to explicitly close the returned context via browserContext.close() when your code is done with the BrowserContext, and before calling browser.close(). This will ensure the context is closed gracefully and any artifacts—like HARs and videos—are fully flushed and saved.
Usage
(async () => {
 const browser = await playwright.firefox.launch();  // Or 'chromium' or 'webkit'.
 // Create a new incognito browser context.
 const context = await browser.newContext();
 // Create a new page in a pristine context.
 const page = await context.newPage();
 await page.goto('https://example.com');

 // Gracefully close up everything
 await context.close();
 await browser.close();
})();
Arguments
options Object (optional)
acceptDownloads boolean (optional)#
Whether to automatically download all the attachments. Defaults to true where all the downloads are accepted.
baseURL string (optional)#
When using page.goto(), page.route(), page.waitForURL(), page.waitForRequest(), or page.waitForResponse() it takes the base URL in consideration by using the URL() constructor for building the corresponding URL. Unset by default. Examples:
baseURL: http://localhost:3000 and navigating to /bar.html results in http://localhost:3000/bar.html
baseURL: http://localhost:3000/foo/ and navigating to ./bar.html results in http://localhost:3000/foo/bar.html
baseURL: http://localhost:3000/foo (without trailing slash) and navigating to ./bar.html results in http://localhost:3000/bar.html
bypassCSP boolean (optional)#
Toggles bypassing page's Content-Security-Policy. Defaults to false.
clientCertificates Array<Object> (optional) Added in: 1.46#
origin string
Exact origin that the certificate is valid for. Origin includes https protocol, a hostname and optionally a port.
certPath string (optional)
Path to the file with the certificate in PEM format.
cert Buffer (optional)
Direct value of the certificate in PEM format.
keyPath string (optional)
Path to the file with the private key in PEM format.
key Buffer (optional)
Direct value of the private key in PEM format.
pfxPath string (optional)
Path to the PFX or PKCS12 encoded private key and certificate chain.
pfx Buffer (optional)
Direct value of the PFX or PKCS12 encoded private key and certificate chain.
passphrase string (optional)
Passphrase for the private key (PEM or PFX).
TLS Client Authentication allows the server to request a client certificate and verify it.
Details
An array of client certificates to be used. Each certificate object must have either both certPath and keyPath, a single pfxPath, or their corresponding direct value equivalents (cert and key, or pfx). Optionally, passphrase property should be provided if the certificate is encrypted. The origin property should be provided with an exact match to the request origin that the certificate is valid for.
NOTE
When using WebKit on macOS, accessing localhost will not pick up client certificates. You can make it work by replacing localhost with local.playwright.
colorScheme null | "light" | "dark" | "no-preference" (optional)#
Emulates prefers-colors-scheme media feature, supported values are 'light' and 'dark'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'light'.
contrast null | "no-preference" | "more" (optional)#
Emulates 'prefers-contrast' media feature, supported values are 'no-preference', 'more'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'no-preference'.
deviceScaleFactor number (optional)#
Specify device scale factor (can be thought of as dpr). Defaults to 1. Learn more about emulating devices with device scale factor.
extraHTTPHeaders Object<string, string> (optional)#
An object containing additional HTTP headers to be sent with every request. Defaults to none.
forcedColors null | "active" | "none" (optional)#
Emulates 'forced-colors' media feature, supported values are 'active', 'none'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'none'.
geolocation Object (optional)#
latitude number
Latitude between -90 and 90.
longitude number
Longitude between -180 and 180.
accuracy number (optional)
Non-negative accuracy value. Defaults to 0.
hasTouch boolean (optional)#
Specifies if viewport supports touch events. Defaults to false. Learn more about mobile emulation.
httpCredentials Object (optional)#
username string
password string
origin string (optional)
Restrain sending http credentials on specific origin (scheme://host:port).
send "unauthorized" | "always" (optional)
This option only applies to the requests sent from corresponding APIRequestContext and does not affect requests sent from the browser. 'always' - Authorization header with basic authentication credentials will be sent with the each API request. 'unauthorized - the credentials are only sent when 401 (Unauthorized) response with WWW-Authenticate header is received. Defaults to 'unauthorized'.
Credentials for HTTP authentication. If no origin is specified, the username and password are sent to any servers upon unauthorized responses.
ignoreHTTPSErrors boolean (optional)#
Whether to ignore HTTPS errors when sending network requests. Defaults to false.
isMobile boolean (optional)#
Whether the meta viewport tag is taken into account and touch events are enabled. isMobile is a part of device, so you don't actually need to set it manually. Defaults to false and is not supported in Firefox. Learn more about mobile emulation.
javaScriptEnabled boolean (optional)#
Whether or not to enable JavaScript in the context. Defaults to true. Learn more about disabling JavaScript.
locale string (optional)#
Specify user locale, for example en-GB, de-DE, etc. Locale will affect navigator.language value, Accept-Language request header value as well as number and date formatting rules. Defaults to the system default locale. Learn more about emulation in our emulation guide.
logger Logger (optional)#
DEPRECATED
The logs received by the logger are incomplete. Please use tracing instead.
Logger sink for Playwright logging.
offline boolean (optional)#
Whether to emulate network being offline. Defaults to false. Learn more about network emulation.
permissions Array<string> (optional)#
A list of permissions to grant to all pages in this context. See browserContext.grantPermissions() for more details. Defaults to none.
proxy Object (optional)#
server string
Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example http://myproxy.com:3128 or socks5://myproxy.com:3128. Short form myproxy.com:3128 is considered an HTTP proxy.
bypass string (optional)
Optional comma-separated domains to bypass proxy, for example ".com, chromium.org, .domain.com".
username string (optional)
Optional username to use if HTTP proxy requires authentication.
password string (optional)
Optional password to use if HTTP proxy requires authentication.
Network proxy settings to use with this context. Defaults to none.
recordHar Object (optional)#
omitContent boolean (optional)
Optional setting to control whether to omit request content from the HAR. Defaults to false. Deprecated, use content policy instead.
content "omit" | "embed" | "attach" (optional)
Optional setting to control resource content management. If omit is specified, content is not persisted. If attach is specified, resources are persisted as separate files or entries in the ZIP archive. If embed is specified, content is stored inline the HAR file as per HAR specification. Defaults to attach for .zip output files and to embed for all other file extensions.
path string
Path on the filesystem to write the HAR file to. If the file name ends with .zip, content: 'attach' is used by default.
mode "full" | "minimal" (optional)
When set to minimal, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to full.
urlFilter string | RegExp (optional)
A glob or regex pattern to filter requests that are stored in the HAR. When a baseURL via the context options was provided and the passed URL is a path, it gets merged via the new URL() constructor. Defaults to none.
Enables HAR recording for all pages into recordHar.path file. If not specified, the HAR is not recorded. Make sure to await browserContext.close() for the HAR to be saved.
recordVideo Object (optional)#
dir string
Path to the directory to put videos into.
size Object (optional)
width number
Video frame width.
height number
Video frame height.
Optional dimensions of the recorded videos. If not specified the size will be equal to viewport scaled down to fit into 800x800. If viewport is not configured explicitly the video size defaults to 800x450. Actual picture of each page will be scaled down if necessary to fit the specified size.
Enables video recording for all pages into recordVideo.dir directory. If not specified videos are not recorded. Make sure to await browserContext.close() for videos to be saved.
reducedMotion null | "reduce" | "no-preference" (optional)#
Emulates 'prefers-reduced-motion' media feature, supported values are 'reduce', 'no-preference'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'no-preference'.
screen Object (optional)#
width number
page width in pixels.
height number
page height in pixels.
Emulates consistent window screen size available inside web page via window.screen. Is only used when the viewport is set.
serviceWorkers "allow" | "block" (optional)#
Whether to allow sites to register Service workers. Defaults to 'allow'.
'allow': Service Workers can be registered.
'block': Playwright will block all registration of Service Workers.
storageState string | Object (optional)#
cookies Array<Object>
name string
value string
domain string
Domain and path are required. For the cookie to apply to all subdomains as well, prefix domain with a dot, like this: ".example.com"
path string
Domain and path are required
expires number
Unix time in seconds.
httpOnly boolean
secure boolean
sameSite "Strict" | "Lax" | "None"
sameSite flag
Cookies to set for context
origins Array<Object>
origin string
localStorage Array<Object>
name string
value string
localStorage to set for context
Learn more about storage state and auth.
Populates context with given storage state. This option can be used to initialize context with logged-in information obtained via browserContext.storageState().
strictSelectors boolean (optional)#
If set to true, enables strict selectors mode for this context. In the strict selectors mode all operations on selectors that imply single target DOM element will throw when more than one element matches the selector. This option does not affect any Locator APIs (Locators are always strict). Defaults to false. See Locator to learn more about the strict mode.
timezoneId string (optional)#
Changes the timezone of the context. See ICU's metaZones.txt for a list of supported timezone IDs. Defaults to the system timezone.
userAgent string (optional)#
Specific user agent to use in this context.
videoSize Object (optional)#
DEPRECATED
Use recordVideo instead.
width number
Video frame width.
height number
Video frame height.
videosPath string (optional)#
DEPRECATED
Use recordVideo instead.
viewport null | Object (optional)#
width number
page width in pixels.
height number
page height in pixels.
Emulates consistent viewport for each page. Defaults to an 1280x720 viewport. Use null to disable the consistent viewport emulation. Learn more about viewport emulation.
NOTE
The null value opts out from the default presets, makes viewport depend on the host window size defined by the operating system. It makes the execution of the tests non-deterministic.
Returns
Promise<BrowserContext>#

newPage
Added before v1.9 
Creates a new page in a new browser context. Closing this page will close the context as well.
This is a convenience API that should only be used for the single-page scenarios and short snippets. Production code and testing frameworks should explicitly create browser.newContext() followed by the browserContext.newPage() to control their exact life times.
Usage
await browser.newPage();
await browser.newPage(options);
Arguments
options Object (optional)
acceptDownloads boolean (optional)#
Whether to automatically download all the attachments. Defaults to true where all the downloads are accepted.
baseURL string (optional)#
When using page.goto(), page.route(), page.waitForURL(), page.waitForRequest(), or page.waitForResponse() it takes the base URL in consideration by using the URL() constructor for building the corresponding URL. Unset by default. Examples:
baseURL: http://localhost:3000 and navigating to /bar.html results in http://localhost:3000/bar.html
baseURL: http://localhost:3000/foo/ and navigating to ./bar.html results in http://localhost:3000/foo/bar.html
baseURL: http://localhost:3000/foo (without trailing slash) and navigating to ./bar.html results in http://localhost:3000/bar.html
bypassCSP boolean (optional)#
Toggles bypassing page's Content-Security-Policy. Defaults to false.
clientCertificates Array<Object> (optional) Added in: 1.46#
origin string
Exact origin that the certificate is valid for. Origin includes https protocol, a hostname and optionally a port.
certPath string (optional)
Path to the file with the certificate in PEM format.
cert Buffer (optional)
Direct value of the certificate in PEM format.
keyPath string (optional)
Path to the file with the private key in PEM format.
key Buffer (optional)
Direct value of the private key in PEM format.
pfxPath string (optional)
Path to the PFX or PKCS12 encoded private key and certificate chain.
pfx Buffer (optional)
Direct value of the PFX or PKCS12 encoded private key and certificate chain.
passphrase string (optional)
Passphrase for the private key (PEM or PFX).
TLS Client Authentication allows the server to request a client certificate and verify it.
Details
An array of client certificates to be used. Each certificate object must have either both certPath and keyPath, a single pfxPath, or their corresponding direct value equivalents (cert and key, or pfx). Optionally, passphrase property should be provided if the certificate is encrypted. The origin property should be provided with an exact match to the request origin that the certificate is valid for.
NOTE
When using WebKit on macOS, accessing localhost will not pick up client certificates. You can make it work by replacing localhost with local.playwright.
colorScheme null | "light" | "dark" | "no-preference" (optional)#
Emulates prefers-colors-scheme media feature, supported values are 'light' and 'dark'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'light'.
contrast null | "no-preference" | "more" (optional)#
Emulates 'prefers-contrast' media feature, supported values are 'no-preference', 'more'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'no-preference'.
deviceScaleFactor number (optional)#
Specify device scale factor (can be thought of as dpr). Defaults to 1. Learn more about emulating devices with device scale factor.
extraHTTPHeaders Object<string, string> (optional)#
An object containing additional HTTP headers to be sent with every request. Defaults to none.
forcedColors null | "active" | "none" (optional)#
Emulates 'forced-colors' media feature, supported values are 'active', 'none'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'none'.
geolocation Object (optional)#
latitude number
Latitude between -90 and 90.
longitude number
Longitude between -180 and 180.
accuracy number (optional)
Non-negative accuracy value. Defaults to 0.
hasTouch boolean (optional)#
Specifies if viewport supports touch events. Defaults to false. Learn more about mobile emulation.
httpCredentials Object (optional)#
username string
password string
origin string (optional)
Restrain sending http credentials on specific origin (scheme://host:port).
send "unauthorized" | "always" (optional)
This option only applies to the requests sent from corresponding APIRequestContext and does not affect requests sent from the browser. 'always' - Authorization header with basic authentication credentials will be sent with the each API request. 'unauthorized - the credentials are only sent when 401 (Unauthorized) response with WWW-Authenticate header is received. Defaults to 'unauthorized'.
Credentials for HTTP authentication. If no origin is specified, the username and password are sent to any servers upon unauthorized responses.
ignoreHTTPSErrors boolean (optional)#
Whether to ignore HTTPS errors when sending network requests. Defaults to false.
isMobile boolean (optional)#
Whether the meta viewport tag is taken into account and touch events are enabled. isMobile is a part of device, so you don't actually need to set it manually. Defaults to false and is not supported in Firefox. Learn more about mobile emulation.
javaScriptEnabled boolean (optional)#
Whether or not to enable JavaScript in the context. Defaults to true. Learn more about disabling JavaScript.
locale string (optional)#
Specify user locale, for example en-GB, de-DE, etc. Locale will affect navigator.language value, Accept-Language request header value as well as number and date formatting rules. Defaults to the system default locale. Learn more about emulation in our emulation guide.
logger Logger (optional)#
DEPRECATED
The logs received by the logger are incomplete. Please use tracing instead.
Logger sink for Playwright logging.
offline boolean (optional)#
Whether to emulate network being offline. Defaults to false. Learn more about network emulation.
permissions Array<string> (optional)#
A list of permissions to grant to all pages in this context. See browserContext.grantPermissions() for more details. Defaults to none.
proxy Object (optional)#
server string
Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example http://myproxy.com:3128 or socks5://myproxy.com:3128. Short form myproxy.com:3128 is considered an HTTP proxy.
bypass string (optional)
Optional comma-separated domains to bypass proxy, for example ".com, chromium.org, .domain.com".
username string (optional)
Optional username to use if HTTP proxy requires authentication.
password string (optional)
Optional password to use if HTTP proxy requires authentication.
Network proxy settings to use with this context. Defaults to none.
recordHar Object (optional)#
omitContent boolean (optional)
Optional setting to control whether to omit request content from the HAR. Defaults to false. Deprecated, use content policy instead.
content "omit" | "embed" | "attach" (optional)
Optional setting to control resource content management. If omit is specified, content is not persisted. If attach is specified, resources are persisted as separate files or entries in the ZIP archive. If embed is specified, content is stored inline the HAR file as per HAR specification. Defaults to attach for .zip output files and to embed for all other file extensions.
path string
Path on the filesystem to write the HAR file to. If the file name ends with .zip, content: 'attach' is used by default.
mode "full" | "minimal" (optional)
When set to minimal, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to full.
urlFilter string | RegExp (optional)
A glob or regex pattern to filter requests that are stored in the HAR. When a baseURL via the context options was provided and the passed URL is a path, it gets merged via the new URL() constructor. Defaults to none.
Enables HAR recording for all pages into recordHar.path file. If not specified, the HAR is not recorded. Make sure to await browserContext.close() for the HAR to be saved.
recordVideo Object (optional)#
dir string
Path to the directory to put videos into.
size Object (optional)
width number
Video frame width.
height number
Video frame height.
Optional dimensions of the recorded videos. If not specified the size will be equal to viewport scaled down to fit into 800x800. If viewport is not configured explicitly the video size defaults to 800x450. Actual picture of each page will be scaled down if necessary to fit the specified size.
Enables video recording for all pages into recordVideo.dir directory. If not specified videos are not recorded. Make sure to await browserContext.close() for videos to be saved.
reducedMotion null | "reduce" | "no-preference" (optional)#
Emulates 'prefers-reduced-motion' media feature, supported values are 'reduce', 'no-preference'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'no-preference'.
screen Object (optional)#
width number
page width in pixels.
height number
page height in pixels.
Emulates consistent window screen size available inside web page via window.screen. Is only used when the viewport is set.
serviceWorkers "allow" | "block" (optional)#
Whether to allow sites to register Service workers. Defaults to 'allow'.
'allow': Service Workers can be registered.
'block': Playwright will block all registration of Service Workers.
storageState string | Object (optional)#
cookies Array<Object>
name string
value string
domain string
Domain and path are required. For the cookie to apply to all subdomains as well, prefix domain with a dot, like this: ".example.com"
path string
Domain and path are required
expires number
Unix time in seconds.
httpOnly boolean
secure boolean
sameSite "Strict" | "Lax" | "None"
sameSite flag
Cookies to set for context
origins Array<Object>
origin string
localStorage Array<Object>
name string
value string
localStorage to set for context
Learn more about storage state and auth.
Populates context with given storage state. This option can be used to initialize context with logged-in information obtained via browserContext.storageState().
strictSelectors boolean (optional)#
If set to true, enables strict selectors mode for this context. In the strict selectors mode all operations on selectors that imply single target DOM element will throw when more than one element matches the selector. This option does not affect any Locator APIs (Locators are always strict). Defaults to false. See Locator to learn more about the strict mode.
timezoneId string (optional)#
Changes the timezone of the context. See ICU's metaZones.txt for a list of supported timezone IDs. Defaults to the system timezone.
userAgent string (optional)#
Specific user agent to use in this context.
videoSize Object (optional)#
DEPRECATED
Use recordVideo instead.
width number
Video frame width.
height number
Video frame height.
videosPath string (optional)#
DEPRECATED
Use recordVideo instead.
viewport null | Object (optional)#
width number
page width in pixels.
height number
page height in pixels.
Emulates consistent viewport for each page. Defaults to an 1280x720 viewport. Use null to disable the consistent viewport emulation. Learn more about viewport emulation.
NOTE
The null value opts out from the default presets, makes viewport depend on the host window size defined by the operating system. It makes the execution of the tests non-deterministic.
Returns
Promise<Page>#

removeAllListeners
Added in: v1.47 
Removes all the listeners of the given type (or all registered listeners if no type given). Allows to wait for async listeners to complete or to ignore subsequent errors from these listeners.
Usage
await browser.removeAllListeners();
await browser.removeAllListeners(type, options);
Arguments
type string (optional)#
options Object (optional)
behavior "wait" | "ignoreErrors" | "default" (optional)#
Specifies whether to wait for already running listeners and what to do if they throw errors:
'default' - do not wait for current listener calls (if any) to finish, if the listener throws, it may result in unhandled error
'wait' - wait for current listener calls (if any) to finish
'ignoreErrors' - do not wait for current listener calls (if any) to finish, all errors thrown by the listeners after removal are silently caught
Returns
Promise<void>#

startTracing
Added in: v1.11 
NOTE
This API controls Chromium Tracing which is a low-level chromium-specific debugging tool. API to control Playwright Tracing could be found here.
You can use browser.startTracing() and browser.stopTracing() to create a trace file that can be opened in Chrome DevTools performance panel.
Usage
await browser.startTracing(page, { path: 'trace.json' });
await page.goto('https://www.google.com');
await browser.stopTracing();
Arguments
page Page (optional)#
Optional, if specified, tracing includes screenshots of the given page.
options Object (optional)
categories Array<string> (optional)#
specify custom categories to use instead of default.
path string (optional)#
A path to write the trace file to.
screenshots boolean (optional)#
captures screenshots in the trace.
Returns
Promise<void>#

stopTracing
Added in: v1.11 
NOTE
This API controls Chromium Tracing which is a low-level chromium-specific debugging tool. API to control Playwright Tracing could be found here.
Returns the buffer with trace data.
Usage
await browser.stopTracing();
Returns
Promise<Buffer>#

version
Added before v1.9 
Returns the browser version.
Usage
browser.version();
Returns
string#

Events
on('disconnected')
Added before v1.9 
Emitted when Browser gets disconnected from the browser application. This might happen because of one of the following:
Browser application is closed or crashed.
The browser.close() method was called.
Usage
browser.on('disconnected', data => {});
Event data
Browser
Previous
Accessibility
Next
BrowserContext
Methods
browserType
close
contexts
isConnected
newBrowserCDPSession
newContext
newPage
removeAllListeners
startTracing
stopTracing
version
Events
on('disconnected')
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
BrowserContext
BrowserContexts provide a way to operate multiple independent browser sessions.
If a page opens another page, e.g. with a window.open call, the popup will belong to the parent page's browser context.
Playwright allows creating isolated non-persistent browser contexts with browser.newContext() method. Non-persistent browser contexts don't write any browsing data to disk.
// Create a new incognito browser context
const context = await browser.newContext();
// Create a new page inside context.
const page = await context.newPage();
await page.goto('https://example.com');
// Dispose context once it's no longer needed.
await context.close();

Methods
addCookies
Added before v1.9 
Adds cookies into this browser context. All pages within this context will have these cookies installed. Cookies can be obtained via browserContext.cookies().
Usage
await browserContext.addCookies([cookieObject1, cookieObject2]);
Arguments
cookies Array<Object>#
name string
value string
url string (optional)
Either url or domain / path are required. Optional.
domain string (optional)
For the cookie to apply to all subdomains as well, prefix domain with a dot, like this: ".example.com". Either url or domain / path are required. Optional.
path string (optional)
Either url or domain / path are required Optional.
expires number (optional)
Unix time in seconds. Optional.
httpOnly boolean (optional)
Optional.
secure boolean (optional)
Optional.
sameSite "Strict" | "Lax" | "None" (optional)
Optional.
partitionKey string (optional)
For partitioned third-party cookies (aka CHIPS), the partition key. Optional.
Returns
Promise<void>#

addInitScript
Added before v1.9 
Adds a script which would be evaluated in one of the following scenarios:
Whenever a page is created in the browser context or is navigated.
Whenever a child frame is attached or navigated in any page in the browser context. In this case, the script is evaluated in the context of the newly attached frame.
The script is evaluated after the document was created but before any of its scripts were run. This is useful to amend the JavaScript environment, e.g. to seed Math.random.
Usage
An example of overriding Math.random before the page loads:
// preload.js
Math.random = () => 42;
// In your playwright script, assuming the preload.js file is in same directory.
await browserContext.addInitScript({
 path: 'preload.js'
});
NOTE
The order of evaluation of multiple scripts installed via browserContext.addInitScript() and page.addInitScript() is not defined.
Arguments
script function | string | Object#
path string (optional)
Path to the JavaScript file. If path is a relative path, then it is resolved relative to the current working directory. Optional.
content string (optional)
Raw script content. Optional.
Script to be evaluated in all pages in the browser context.
arg Serializable (optional)#
Optional argument to pass to script (only supported when passing a function).
Returns
Promise<void>#

backgroundPages
Added in: v1.11 
NOTE
Background pages are only supported on Chromium-based browsers.
All existing background pages in the context.
Usage
browserContext.backgroundPages();
Returns
Array<Page>#

browser
Added before v1.9 
Gets the browser instance that owns the context. Returns null if the context is created outside of normal browser, e.g. Android or Electron.
Usage
browserContext.browser();
Returns
null | Browser#

clearCookies
Added before v1.9 
Removes cookies from context. Accepts optional filter.
Usage
await context.clearCookies();
await context.clearCookies({ name: 'session-id' });
await context.clearCookies({ domain: 'my-origin.com' });
await context.clearCookies({ domain: /.*my-origin\.com/ });
await context.clearCookies({ path: '/api/v1' });
await context.clearCookies({ name: 'session-id', domain: 'my-origin.com' });
Arguments
options Object (optional)
domain string | RegExp (optional) Added in: v1.43#
Only removes cookies with the given domain.
name string | RegExp (optional) Added in: v1.43#
Only removes cookies with the given name.
path string | RegExp (optional) Added in: v1.43#
Only removes cookies with the given path.
Returns
Promise<void>#

clearPermissions
Added before v1.9 
Clears all permission overrides for the browser context.
Usage
const context = await browser.newContext();
await context.grantPermissions(['clipboard-read']);
// do stuff ..
context.clearPermissions();
Returns
Promise<void>#

close
Added before v1.9 
Closes the browser context. All the pages that belong to the browser context will be closed.
NOTE
The default browser context cannot be closed.
Usage
await browserContext.close();
await browserContext.close(options);
Arguments
options Object (optional)
reason string (optional) Added in: v1.40#
The reason to be reported to the operations interrupted by the context closure.
Returns
Promise<void>#

cookies
Added before v1.9 
If no URLs are specified, this method returns all cookies. If URLs are specified, only cookies that affect those URLs are returned.
Usage
await browserContext.cookies();
await browserContext.cookies(urls);
Arguments
urls string | Array<string> (optional)#
Optional list of URLs.
Returns
Promise<Array<Object>>#
name string
value string
domain string
path string
expires number
Unix time in seconds.
httpOnly boolean
secure boolean
sameSite "Strict" | "Lax" | "None"
partitionKey string (optional)

exposeBinding
Added before v1.9 
The method adds a function called name on the window object of every frame in every page in the context. When called, the function executes callback and returns a Promise which resolves to the return value of callback. If the callback returns a Promise, it will be awaited.
The first argument of the callback function contains information about the caller: { browserContext: BrowserContext, page: Page, frame: Frame }.
See page.exposeBinding() for page-only version.
Usage
An example of exposing page URL to all frames in all pages in the context:
const { webkit } = require('playwright');  // Or 'chromium' or 'firefox'.

(async () => {
 const browser = await webkit.launch({ headless: false });
 const context = await browser.newContext();
 await context.exposeBinding('pageURL', ({ page }) => page.url());
 const page = await context.newPage();
 await page.setContent(`
   <script>
     async function onClick() {
       document.querySelector('div').textContent = await window.pageURL();
     }
   </script>
   <button onclick="onClick()">Click me</button>
   <div></div>
 `);
 await page.getByRole('button').click();
})();
Arguments
name string#
Name of the function on the window object.
callback function#
Callback function that will be called in the Playwright's context.
options Object (optional)
handle boolean (optional)#
DEPRECATED
This option will be removed in the future.
Whether to pass the argument as a handle, instead of passing by value. When passing a handle, only one argument is supported. When passing by value, multiple arguments are supported.
Returns
Promise<void>#

exposeFunction
Added before v1.9 
The method adds a function called name on the window object of every frame in every page in the context. When called, the function executes callback and returns a Promise which resolves to the return value of callback.
If the callback returns a Promise, it will be awaited.
See page.exposeFunction() for page-only version.
Usage
An example of adding a sha256 function to all pages in the context:
const { webkit } = require('playwright');  // Or 'chromium' or 'firefox'.
const crypto = require('crypto');

(async () => {
 const browser = await webkit.launch({ headless: false });
 const context = await browser.newContext();
 await context.exposeFunction('sha256', text =>
   crypto.createHash('sha256').update(text).digest('hex'),
 );
 const page = await context.newPage();
 await page.setContent(`
   <script>
     async function onClick() {
       document.querySelector('div').textContent = await window.sha256('PLAYWRIGHT');
     }
   </script>
   <button onclick="onClick()">Click me</button>
   <div></div>
 `);
 await page.getByRole('button').click();
})();
Arguments
name string#
Name of the function on the window object.
callback function#
Callback function that will be called in the Playwright's context.
Returns
Promise<void>#

grantPermissions
Added before v1.9 
Grants specified permissions to the browser context. Only grants corresponding permissions to the given origin if specified.
Usage
await browserContext.grantPermissions(permissions);
await browserContext.grantPermissions(permissions, options);
Arguments
permissions Array<string>#
A list of permissions to grant.
DANGER
Supported permissions differ between browsers, and even between different versions of the same browser. Any permission may stop working after an update.
Here are some permissions that may be supported by some browsers:
'accelerometer'
'ambient-light-sensor'
'background-sync'
'camera'
'clipboard-read'
'clipboard-write'
'geolocation'
'gyroscope'
'magnetometer'
'microphone'
'midi-sysex' (system-exclusive midi)
'midi'
'notifications'
'payment-handler'
'storage-access'
'local-fonts'
options Object (optional)
origin string (optional)#
The origin to grant permissions to, e.g. "https://example.com".
Returns
Promise<void>#

newCDPSession
Added in: v1.11 
NOTE
CDP sessions are only supported on Chromium-based browsers.
Returns the newly created session.
Usage
await browserContext.newCDPSession(page);
Arguments
page Page | Frame#
Target to create new session for. For backwards-compatibility, this parameter is named page, but it can be a Page or Frame type.
Returns
Promise<CDPSession>#

newPage
Added before v1.9 
Creates a new page in the browser context.
Usage
await browserContext.newPage();
Returns
Promise<Page>#

pages
Added before v1.9 
Returns all open pages in the context.
Usage
browserContext.pages();
Returns
Array<Page>#

removeAllListeners
Added in: v1.47 
Removes all the listeners of the given type (or all registered listeners if no type given). Allows to wait for async listeners to complete or to ignore subsequent errors from these listeners.
Usage
await browserContext.removeAllListeners();
await browserContext.removeAllListeners(type, options);
Arguments
type string (optional)#
options Object (optional)
behavior "wait" | "ignoreErrors" | "default" (optional)#
Specifies whether to wait for already running listeners and what to do if they throw errors:
'default' - do not wait for current listener calls (if any) to finish, if the listener throws, it may result in unhandled error
'wait' - wait for current listener calls (if any) to finish
'ignoreErrors' - do not wait for current listener calls (if any) to finish, all errors thrown by the listeners after removal are silently caught
Returns
Promise<void>#

route
Added before v1.9 
Routing provides the capability to modify network requests that are made by any page in the browser context. Once route is enabled, every request matching the url pattern will stall unless it's continued, fulfilled or aborted.
NOTE
browserContext.route() will not intercept requests intercepted by Service Worker. See this issue. We recommend disabling Service Workers when using request interception by setting serviceWorkers to 'block'.
Usage
An example of a naive handler that aborts all image requests:
const context = await browser.newContext();
await context.route('**/*.{png,jpg,jpeg}', route => route.abort());
const page = await context.newPage();
await page.goto('https://example.com');
await browser.close();
or the same snippet using a regex pattern instead:
const context = await browser.newContext();
await context.route(/(\.png$)|(\.jpg$)/, route => route.abort());
const page = await context.newPage();
await page.goto('https://example.com');
await browser.close();
It is possible to examine the request to decide the route action. For example, mocking all requests that contain some post data, and leaving all other requests as is:
await context.route('/api/**', async route => {
 if (route.request().postData().includes('my-string'))
   await route.fulfill({ body: 'mocked-data' });
 else
   await route.continue();
});
Page routes (set up with page.route()) take precedence over browser context routes when request matches both handlers.
To remove a route with its handler you can use browserContext.unroute().
NOTE
Enabling routing disables http cache.
Arguments
url string | RegExp | function(URL):boolean#
A glob pattern, regex pattern, or predicate that receives a URL to match during routing. If baseURL is set in the context options and the provided URL is a string that does not start with *, it is resolved using the new URL() constructor.
handler function(Route, Request):Promise<Object> | Object#
handler function to route the request.
options Object (optional)
times number (optional) Added in: v1.15#
How often a route should be used. By default it will be used every time.
Returns
Promise<void>#

routeFromHAR
Added in: v1.23 
If specified the network requests that are made in the context will be served from the HAR file. Read more about Replaying from HAR.
Playwright will not serve requests intercepted by Service Worker from the HAR file. See this issue. We recommend disabling Service Workers when using request interception by setting serviceWorkers to 'block'.
Usage
await browserContext.routeFromHAR(har);
await browserContext.routeFromHAR(har, options);
Arguments
har string#
Path to a HAR file with prerecorded network data. If path is a relative path, then it is resolved relative to the current working directory.
options Object (optional)
notFound "abort" | "fallback" (optional)#
If set to 'abort' any request not found in the HAR file will be aborted.
If set to 'fallback' falls through to the next route handler in the handler chain.
Defaults to abort.
update boolean (optional)#
If specified, updates the given HAR with the actual network information instead of serving from file. The file is written to disk when browserContext.close() is called.
updateContent "embed" | "attach" (optional) Added in: v1.32#
Optional setting to control resource content management. If attach is specified, resources are persisted as separate files or entries in the ZIP archive. If embed is specified, content is stored inline the HAR file.
updateMode "full" | "minimal" (optional) Added in: v1.32#
When set to minimal, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to minimal.
url string | RegExp (optional)#
A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.
Returns
Promise<void>#

routeWebSocket
Added in: v1.48 
This method allows to modify websocket connections that are made by any page in the browser context.
Note that only WebSockets created after this method was called will be routed. It is recommended to call this method before creating any pages.
Usage
Below is an example of a simple handler that blocks some websocket messages. See WebSocketRoute for more details and examples.
await context.routeWebSocket('/ws', async ws => {
 ws.routeSend(message => {
   if (message === 'to-be-blocked')
     return;
   ws.send(message);
 });
 await ws.connect();
});
Arguments
url string | RegExp | function(URL):boolean#
Only WebSockets with the url matching this pattern will be routed. A string pattern can be relative to the baseURL context option.
handler function(WebSocketRoute):Promise<Object> | Object#
Handler function to route the WebSocket.
Returns
Promise<void>#

serviceWorkers
Added in: v1.11 
NOTE
Service workers are only supported on Chromium-based browsers.
All existing service workers in the context.
Usage
browserContext.serviceWorkers();
Returns
Array<Worker>#

setDefaultNavigationTimeout
Added before v1.9 
This setting will change the default maximum navigation time for the following methods and related shortcuts:
page.goBack()
page.goForward()
page.goto()
page.reload()
page.setContent()
page.waitForNavigation()
NOTE
page.setDefaultNavigationTimeout() and page.setDefaultTimeout() take priority over browserContext.setDefaultNavigationTimeout().
Usage
browserContext.setDefaultNavigationTimeout(timeout);
Arguments
timeout number#
Maximum navigation time in milliseconds

setDefaultTimeout
Added before v1.9 
This setting will change the default maximum time for all the methods accepting timeout option.
NOTE
page.setDefaultNavigationTimeout(), page.setDefaultTimeout() and browserContext.setDefaultNavigationTimeout() take priority over browserContext.setDefaultTimeout().
Usage
browserContext.setDefaultTimeout(timeout);
Arguments
timeout number#
Maximum time in milliseconds. Pass 0 to disable timeout.

setExtraHTTPHeaders
Added before v1.9 
The extra HTTP headers will be sent with every request initiated by any page in the context. These headers are merged with page-specific extra HTTP headers set with page.setExtraHTTPHeaders(). If page overrides a particular header, page-specific header value will be used instead of the browser context header value.
NOTE
browserContext.setExtraHTTPHeaders() does not guarantee the order of headers in the outgoing requests.
Usage
await browserContext.setExtraHTTPHeaders(headers);
Arguments
headers Object<string, string>#
An object containing additional HTTP headers to be sent with every request. All header values must be strings.
Returns
Promise<void>#

setGeolocation
Added before v1.9 
Sets the context's geolocation. Passing null or undefined emulates position unavailable.
Usage
await browserContext.setGeolocation({ latitude: 59.95, longitude: 30.31667 });
NOTE
Consider using browserContext.grantPermissions() to grant permissions for the browser context pages to read its geolocation.
Arguments
geolocation null | Object#
latitude number
Latitude between -90 and 90.
longitude number
Longitude between -180 and 180.
accuracy number (optional)
Non-negative accuracy value. Defaults to 0.
Returns
Promise<void>#

setOffline
Added before v1.9 
Usage
await browserContext.setOffline(offline);
Arguments
offline boolean#
Whether to emulate network being offline for the browser context.
Returns
Promise<void>#

storageState
Added before v1.9 
Returns storage state for this browser context, contains current cookies, local storage snapshot and IndexedDB snapshot.
Usage
await browserContext.storageState();
await browserContext.storageState(options);
Arguments
options Object (optional)
indexedDB boolean (optional) Added in: v1.51#
Set to true to include IndexedDB in the storage state snapshot. If your application uses IndexedDB to store authentication tokens, like Firebase Authentication, enable this.
path string (optional)#
The file path to save the storage state to. If path is a relative path, then it is resolved relative to current working directory. If no path is provided, storage state is still returned, but won't be saved to the disk.
Returns
Promise<Object>#
cookies Array<Object>
name string
value string
domain string
path string
expires number
Unix time in seconds.
httpOnly boolean
secure boolean
sameSite "Strict" | "Lax" | "None"
origins Array<Object>
origin string
localStorage Array<Object>
name string
value string

unroute
Added before v1.9 
Removes a route created with browserContext.route(). When handler is not specified, removes all routes for the url.
Usage
await browserContext.unroute(url);
await browserContext.unroute(url, handler);
Arguments
url string | RegExp | function(URL):boolean#
A glob pattern, regex pattern or predicate receiving URL used to register a routing with browserContext.route().
handler function(Route, Request):Promise<Object> | Object (optional)#
Optional handler function used to register a routing with browserContext.route().
Returns
Promise<void>#

unrouteAll
Added in: v1.41 
Removes all routes created with browserContext.route() and browserContext.routeFromHAR().
Usage
await browserContext.unrouteAll();
await browserContext.unrouteAll(options);
Arguments
options Object (optional)
behavior "wait" | "ignoreErrors" | "default" (optional)#
Specifies whether to wait for already running handlers and what to do if they throw errors:
'default' - do not wait for current handler calls (if any) to finish, if unrouted handler throws, it may result in unhandled error
'wait' - wait for current handler calls (if any) to finish
'ignoreErrors' - do not wait for current handler calls (if any) to finish, all errors thrown by the handlers after unrouting are silently caught
Returns
Promise<void>#

waitForEvent
Added before v1.9 
Waits for event to fire and passes its value into the predicate function. Returns when the predicate returns truthy value. Will throw an error if the context closes before the event is fired. Returns the event data value.
Usage
const pagePromise = context.waitForEvent('page');
await page.getByRole('button').click();
const page = await pagePromise;
Arguments
event string#
Event name, same one would pass into browserContext.on(event).
optionsOrPredicate function | Object (optional)#
predicate function
Receives the event data and resolves to truthy value when the waiting should resolve.
timeout number (optional)
Maximum time to wait for in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() method.
Either a predicate that receives an event or an options object. Optional.
options Object (optional)
predicate function (optional)#
Receives the event data and resolves to truthy value when the waiting should resolve.
Returns
Promise<Object>#

Properties
clock
Added in: v1.45 
Playwright has ability to mock clock and passage of time.
Usage
browserContext.clock
Type
Clock

request
Added in: v1.16 
API testing helper associated with this context. Requests made with this API will use context cookies.
Usage
browserContext.request
Type
APIRequestContext

tracing
Added in: v1.12 
Usage
browserContext.tracing
Type
Tracing

Events
on('backgroundpage')
Added in: v1.11 
NOTE
Only works with Chromium browser's persistent context.
Emitted when new background page is created in the context.
const backgroundPage = await context.waitForEvent('backgroundpage');
Usage
browserContext.on('backgroundpage', data => {});
Event data
Page

on('close')
Added before v1.9 
Emitted when Browser context gets closed. This might happen because of one of the following:
Browser context is closed.
Browser application is closed or crashed.
The browser.close() method was called.
Usage
browserContext.on('close', data => {});
Event data
BrowserContext

on('console')
Added in: v1.34 
Emitted when JavaScript within the page calls one of console API methods, e.g. console.log or console.dir.
The arguments passed into console.log and the page are available on the ConsoleMessage event handler argument.
Usage
context.on('console', async msg => {
 const values = [];
 for (const arg of msg.args())
   values.push(await arg.jsonValue());
 console.log(...values);
});
await page.evaluate(() => console.log('hello', 5, { foo: 'bar' }));
Event data
ConsoleMessage

on('dialog')
Added in: v1.34 
Emitted when a JavaScript dialog appears, such as alert, prompt, confirm or beforeunload. Listener must either dialog.accept() or dialog.dismiss() the dialog - otherwise the page will freeze waiting for the dialog, and actions like click will never finish.
Usage
context.on('dialog', dialog => {
 dialog.accept();
});
NOTE
When no page.on('dialog') or browserContext.on('dialog') listeners are present, all dialogs are automatically dismissed.
Event data
Dialog

on('page')
Added before v1.9 
The event is emitted when a new Page is created in the BrowserContext. The page may still be loading. The event will also fire for popup pages. See also page.on('popup') to receive events about popups relevant to a specific page.
The earliest moment that page is available is when it has navigated to the initial url. For example, when opening a popup with window.open('http://example.com'), this event will fire when the network request to "http://example.com" is done and its response has started loading in the popup. If you would like to route/listen to this network request, use browserContext.route() and browserContext.on('request') respectively instead of similar methods on the Page.
const newPagePromise = context.waitForEvent('page');
await page.getByText('open new page').click();
const newPage = await newPagePromise;
console.log(await newPage.evaluate('location.href'));
NOTE
Use page.waitForLoadState() to wait until the page gets to a particular state (you should not need it in most cases).
Usage
browserContext.on('page', data => {});
Event data
Page

on('request')
Added in: v1.12 
Emitted when a request is issued from any pages created through this context. The request object is read-only. To only listen for requests from a particular page, use page.on('request').
In order to intercept and mutate requests, see browserContext.route() or page.route().
Usage
browserContext.on('request', data => {});
Event data
Request

on('requestfailed')
Added in: v1.12 
Emitted when a request fails, for example by timing out. To only listen for failed requests from a particular page, use page.on('requestfailed').
NOTE
HTTP Error responses, such as 404 or 503, are still successful responses from HTTP standpoint, so request will complete with browserContext.on('requestfinished') event and not with browserContext.on('requestfailed').
Usage
browserContext.on('requestfailed', data => {});
Event data
Request

on('requestfinished')
Added in: v1.12 
Emitted when a request finishes successfully after downloading the response body. For a successful response, the sequence of events is request, response and requestfinished. To listen for successful requests from a particular page, use page.on('requestfinished').
Usage
browserContext.on('requestfinished', data => {});
Event data
Request

on('response')
Added in: v1.12 
Emitted when response status and headers are received for a request. For a successful response, the sequence of events is request, response and requestfinished. To listen for response events from a particular page, use page.on('response').
Usage
browserContext.on('response', data => {});
Event data
Response

on('serviceworker')
Added in: v1.11 
NOTE
Service workers are only supported on Chromium-based browsers.
Emitted when new service worker is created in the context.
Usage
browserContext.on('serviceworker', data => {});
Event data
Worker

on('weberror')
Added in: v1.38 
Emitted when exception is unhandled in any of the pages in this context. To listen for errors from a particular page, use page.on('pageerror') instead.
Usage
browserContext.on('weberror', data => {});
Event data
WebError

Deprecated
setHTTPCredentials
Added before v1.9 
DEPRECATED
Browsers may cache credentials after successful authentication. Create a new browser context instead.
Usage
await browserContext.setHTTPCredentials(httpCredentials);
Arguments
httpCredentials null | Object#
username string
password string
Returns
Promise<void>#
Previous
Browser
Next
BrowserServer
Methods
addCookies
addInitScript
backgroundPages
browser
clearCookies
clearPermissions
close
cookies
exposeBinding
exposeFunction
grantPermissions
newCDPSession
newPage
pages
removeAllListeners
route
routeFromHAR
routeWebSocket
serviceWorkers
setDefaultNavigationTimeout
setDefaultTimeout
setExtraHTTPHeaders
setGeolocation
setOffline
storageState
unroute
unrouteAll
waitForEvent
Properties
clock
request
tracing
Events
on('backgroundpage')
on('close')
on('console')
on('dialog')
on('page')
on('request')
on('requestfailed')
on('requestfinished')
on('response')
on('serviceworker')
on('weberror')
Deprecated
setHTTPCredentials
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
BrowserServer

Methods
close
Added before v1.9 
Closes the browser gracefully and makes sure the process is terminated.
Usage
await browserServer.close();
Returns
Promise<void>#

kill
Added before v1.9 
Kills the browser process and waits for the process to exit.
Usage
await browserServer.kill();
Returns
Promise<void>#

process
Added before v1.9 
Spawned browser application process.
Usage
browserServer.process();
Returns
ChildProcess#

wsEndpoint
Added before v1.9 
Browser websocket url.
Browser websocket endpoint which can be used as an argument to browserType.connect() to establish connection to the browser.
Note that if the listen host option in launchServer options is not specified, localhost will be output anyway, even if the actual listening address is an unspecified address.
Usage
browserServer.wsEndpoint();
Returns
string#

Events
on('close')
Added before v1.9 
Emitted when the browser server closes.
Usage
browserServer.on('close', data => {});
Previous
BrowserContext
Next
BrowserType
Methods
close
kill
process
wsEndpoint
Events
on('close')
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
BrowserType
BrowserType provides methods to launch a specific browser instance or connect to an existing one. The following is a typical example of using Playwright to drive automation:
const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.

(async () => {
 const browser = await chromium.launch();
 const page = await browser.newPage();
 await page.goto('https://example.com');
 // other actions...
 await browser.close();
})();

Methods
connect
Added before v1.9 
This method attaches Playwright to an existing browser instance created via BrowserType.launchServer in Node.js.
NOTE
The major and minor version of the Playwright instance that connects needs to match the version of Playwright that launches the browser (1.2.3 → is compatible with 1.2.x).
Usage
await browserType.connect(wsEndpoint);
await browserType.connect(wsEndpoint, options);
Arguments
wsEndpoint string Added in: v1.10#
A Playwright browser websocket endpoint to connect to. You obtain this endpoint via BrowserServer.wsEndpoint.
options Object (optional)
exposeNetwork string (optional) Added in: v1.37#
This option exposes network available on the connecting client to the browser being connected to. Consists of a list of rules separated by comma.
Available rules:
Hostname pattern, for example: example.com, *.org:99, x.*.y.com, *foo.org.
IP literal, for example: 127.0.0.1, 0.0.0.0:99, [::1], [0:0::1]:99.
<loopback> that matches local loopback interfaces: localhost, *.localhost, 127.0.0.1, [::1].
Some common examples:
"*" to expose all network.
"<loopback>" to expose localhost network.
"*.test.internal-domain,*.staging.internal-domain,<loopback>" to expose test/staging deployments and localhost.
headers Object<string, string> (optional) Added in: v1.11#
Additional HTTP headers to be sent with web socket connect request. Optional.
logger Logger (optional) Added in: v1.14#
DEPRECATED
The logs received by the logger are incomplete. Please use tracing instead.
Logger sink for Playwright logging. Optional.
slowMo number (optional) Added in: v1.10#
Slows down Playwright operations by the specified amount of milliseconds. Useful so that you can see what is going on. Defaults to 0.
timeout number (optional) Added in: v1.10#
Maximum time in milliseconds to wait for the connection to be established. Defaults to 0 (no timeout).
Returns
Promise<Browser>#

connectOverCDP
Added in: v1.9 
This method attaches Playwright to an existing browser instance using the Chrome DevTools Protocol.
The default browser context is accessible via browser.contexts().
NOTE
Connecting over the Chrome DevTools Protocol is only supported for Chromium-based browsers.
NOTE
This connection is significantly lower fidelity than the Playwright protocol connection via browserType.connect(). If you are experiencing issues or attempting to use advanced functionality, you probably want to use browserType.connect().
Usage
const browser = await playwright.chromium.connectOverCDP('http://localhost:9222');
const defaultContext = browser.contexts()[0];
const page = defaultContext.pages()[0];
Arguments
endpointURL string Added in: v1.11#
A CDP websocket endpoint or http url to connect to. For example http://localhost:9222/ or ws://127.0.0.1:9222/devtools/browser/387adf4c-243f-4051-a181-46798f4a46f4.
options Object (optional)
endpointURL string (optional) Added in: v1.14#
DEPRECATED
Use the first argument instead.
headers Object<string, string> (optional) Added in: v1.11#
Additional HTTP headers to be sent with connect request. Optional.
logger Logger (optional) Added in: v1.14#
DEPRECATED
The logs received by the logger are incomplete. Please use tracing instead.
Logger sink for Playwright logging. Optional.
slowMo number (optional) Added in: v1.11#
Slows down Playwright operations by the specified amount of milliseconds. Useful so that you can see what is going on. Defaults to 0.
timeout number (optional) Added in: v1.11#
Maximum time in milliseconds to wait for the connection to be established. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
Returns
Promise<Browser>#

executablePath
Added before v1.9 
A path where Playwright expects to find a bundled browser executable.
Usage
browserType.executablePath();
Returns
string#

launch
Added before v1.9 
Returns the browser instance.
Usage
You can use ignoreDefaultArgs to filter out --mute-audio from default arguments:
const browser = await chromium.launch({  // Or 'firefox' or 'webkit'.
 ignoreDefaultArgs: ['--mute-audio']
});
Chromium-only Playwright can also be used to control the Google Chrome or Microsoft Edge browsers, but it works best with the version of Chromium it is bundled with. There is no guarantee it will work with any other version. Use executablePath option with extreme caution.
If Google Chrome (rather than Chromium) is preferred, a Chrome Canary or Dev Channel build is suggested.
Stock browsers like Google Chrome and Microsoft Edge are suitable for tests that require proprietary media codecs for video playback. See this article for other differences between Chromium and Chrome. This article describes some differences for Linux users.
Arguments
options Object (optional)
args Array<string> (optional)#
WARNING
Use custom browser args at your own risk, as some of them may break Playwright functionality.
Additional arguments to pass to the browser instance. The list of Chromium flags can be found here.
channel string (optional)#
Browser distribution channel.
Use "chromium" to opt in to new headless mode.
Use "chrome", "chrome-beta", "chrome-dev", "chrome-canary", "msedge", "msedge-beta", "msedge-dev", or "msedge-canary" to use branded Google Chrome and Microsoft Edge.
chromiumSandbox boolean (optional)#
Enable Chromium sandboxing. Defaults to false.
devtools boolean (optional)#
DEPRECATED
Use debugging tools instead.
Chromium-only Whether to auto-open a Developer Tools panel for each tab. If this option is true, the headless option will be set false.
downloadsPath string (optional)#
If specified, accepted downloads are downloaded into this directory. Otherwise, temporary directory is created and is deleted when browser is closed. In either case, the downloads are deleted when the browser context they were created in is closed.
env Object<string, string | number | boolean> (optional)#
Specify environment variables that will be visible to the browser. Defaults to process.env.
executablePath string (optional)#
Path to a browser executable to run instead of the bundled one. If executablePath is a relative path, then it is resolved relative to the current working directory. Note that Playwright only works with the bundled Chromium, Firefox or WebKit, use at your own risk.
firefoxUserPrefs Object<string, string | number | boolean> (optional)#
Firefox user preferences. Learn more about the Firefox user preferences at about:config.
You can also provide a path to a custom policies.json file via PLAYWRIGHT_FIREFOX_POLICIES_JSON environment variable.
handleSIGHUP boolean (optional)#
Close the browser process on SIGHUP. Defaults to true.
handleSIGINT boolean (optional)#
Close the browser process on Ctrl-C. Defaults to true.
handleSIGTERM boolean (optional)#
Close the browser process on SIGTERM. Defaults to true.
headless boolean (optional)#
Whether to run browser in headless mode. More details for Chromium and Firefox. Defaults to true unless the devtools option is true.
ignoreDefaultArgs boolean | Array<string> (optional)#
If true, Playwright does not pass its own configurations args and only uses the ones from args. If an array is given, then filters out the given default arguments. Dangerous option; use with care. Defaults to false.
logger Logger (optional)#
DEPRECATED
The logs received by the logger are incomplete. Please use tracing instead.
Logger sink for Playwright logging.
proxy Object (optional)#
server string
Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example http://myproxy.com:3128 or socks5://myproxy.com:3128. Short form myproxy.com:3128 is considered an HTTP proxy.
bypass string (optional)
Optional comma-separated domains to bypass proxy, for example ".com, chromium.org, .domain.com".
username string (optional)
Optional username to use if HTTP proxy requires authentication.
password string (optional)
Optional password to use if HTTP proxy requires authentication.
Network proxy settings.
slowMo number (optional)#
Slows down Playwright operations by the specified amount of milliseconds. Useful so that you can see what is going on.
timeout number (optional)#
Maximum time in milliseconds to wait for the browser instance to start. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
tracesDir string (optional)#
If specified, traces are saved into this directory.
Returns
Promise<Browser>#

launchPersistentContext
Added before v1.9 
Returns the persistent browser context instance.
Launches browser that uses persistent storage located at userDataDir and returns the only context. Closing this context will automatically close the browser.
Usage
await browserType.launchPersistentContext(userDataDir);
await browserType.launchPersistentContext(userDataDir, options);
Arguments
userDataDir string#
Path to a User Data Directory, which stores browser session data like cookies and local storage. Pass an empty string to create a temporary directory.
More details for Chromium and Firefox. Chromium's user data directory is the parent directory of the "Profile Path" seen at chrome://version.
Note that browsers do not allow launching multiple instances with the same User Data Directory.
options Object (optional)
acceptDownloads boolean (optional)#
Whether to automatically download all the attachments. Defaults to true where all the downloads are accepted.
args Array<string> (optional)#
WARNING
Use custom browser args at your own risk, as some of them may break Playwright functionality.
Additional arguments to pass to the browser instance. The list of Chromium flags can be found here.
baseURL string (optional)#
When using page.goto(), page.route(), page.waitForURL(), page.waitForRequest(), or page.waitForResponse() it takes the base URL in consideration by using the URL() constructor for building the corresponding URL. Unset by default. Examples:
baseURL: http://localhost:3000 and navigating to /bar.html results in http://localhost:3000/bar.html
baseURL: http://localhost:3000/foo/ and navigating to ./bar.html results in http://localhost:3000/foo/bar.html
baseURL: http://localhost:3000/foo (without trailing slash) and navigating to ./bar.html results in http://localhost:3000/bar.html
bypassCSP boolean (optional)#
Toggles bypassing page's Content-Security-Policy. Defaults to false.
channel string (optional)#
Browser distribution channel.
Use "chromium" to opt in to new headless mode.
Use "chrome", "chrome-beta", "chrome-dev", "chrome-canary", "msedge", "msedge-beta", "msedge-dev", or "msedge-canary" to use branded Google Chrome and Microsoft Edge.
chromiumSandbox boolean (optional)#
Enable Chromium sandboxing. Defaults to false.
clientCertificates Array<Object> (optional) Added in: 1.46#
origin string
Exact origin that the certificate is valid for. Origin includes https protocol, a hostname and optionally a port.
certPath string (optional)
Path to the file with the certificate in PEM format.
cert Buffer (optional)
Direct value of the certificate in PEM format.
keyPath string (optional)
Path to the file with the private key in PEM format.
key Buffer (optional)
Direct value of the private key in PEM format.
pfxPath string (optional)
Path to the PFX or PKCS12 encoded private key and certificate chain.
pfx Buffer (optional)
Direct value of the PFX or PKCS12 encoded private key and certificate chain.
passphrase string (optional)
Passphrase for the private key (PEM or PFX).
TLS Client Authentication allows the server to request a client certificate and verify it.
Details
An array of client certificates to be used. Each certificate object must have either both certPath and keyPath, a single pfxPath, or their corresponding direct value equivalents (cert and key, or pfx). Optionally, passphrase property should be provided if the certificate is encrypted. The origin property should be provided with an exact match to the request origin that the certificate is valid for.
NOTE
When using WebKit on macOS, accessing localhost will not pick up client certificates. You can make it work by replacing localhost with local.playwright.
colorScheme null | "light" | "dark" | "no-preference" (optional)#
Emulates prefers-colors-scheme media feature, supported values are 'light' and 'dark'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'light'.
contrast null | "no-preference" | "more" (optional)#
Emulates 'prefers-contrast' media feature, supported values are 'no-preference', 'more'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'no-preference'.
deviceScaleFactor number (optional)#
Specify device scale factor (can be thought of as dpr). Defaults to 1. Learn more about emulating devices with device scale factor.
devtools boolean (optional)#
DEPRECATED
Use debugging tools instead.
Chromium-only Whether to auto-open a Developer Tools panel for each tab. If this option is true, the headless option will be set false.
downloadsPath string (optional)#
If specified, accepted downloads are downloaded into this directory. Otherwise, temporary directory is created and is deleted when browser is closed. In either case, the downloads are deleted when the browser context they were created in is closed.
env Object<string, string | number | boolean> (optional)#
Specify environment variables that will be visible to the browser. Defaults to process.env.
executablePath string (optional)#
Path to a browser executable to run instead of the bundled one. If executablePath is a relative path, then it is resolved relative to the current working directory. Note that Playwright only works with the bundled Chromium, Firefox or WebKit, use at your own risk.
extraHTTPHeaders Object<string, string> (optional)#
An object containing additional HTTP headers to be sent with every request. Defaults to none.
firefoxUserPrefs Object<string, string | number | boolean> (optional) Added in: v1.40#
Firefox user preferences. Learn more about the Firefox user preferences at about:config.
You can also provide a path to a custom policies.json file via PLAYWRIGHT_FIREFOX_POLICIES_JSON environment variable.
forcedColors null | "active" | "none" (optional)#
Emulates 'forced-colors' media feature, supported values are 'active', 'none'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'none'.
geolocation Object (optional)#
latitude number
Latitude between -90 and 90.
longitude number
Longitude between -180 and 180.
accuracy number (optional)
Non-negative accuracy value. Defaults to 0.
handleSIGHUP boolean (optional)#
Close the browser process on SIGHUP. Defaults to true.
handleSIGINT boolean (optional)#
Close the browser process on Ctrl-C. Defaults to true.
handleSIGTERM boolean (optional)#
Close the browser process on SIGTERM. Defaults to true.
hasTouch boolean (optional)#
Specifies if viewport supports touch events. Defaults to false. Learn more about mobile emulation.
headless boolean (optional)#
Whether to run browser in headless mode. More details for Chromium and Firefox. Defaults to true unless the devtools option is true.
httpCredentials Object (optional)#
username string
password string
origin string (optional)
Restrain sending http credentials on specific origin (scheme://host:port).
send "unauthorized" | "always" (optional)
This option only applies to the requests sent from corresponding APIRequestContext and does not affect requests sent from the browser. 'always' - Authorization header with basic authentication credentials will be sent with the each API request. 'unauthorized - the credentials are only sent when 401 (Unauthorized) response with WWW-Authenticate header is received. Defaults to 'unauthorized'.
Credentials for HTTP authentication. If no origin is specified, the username and password are sent to any servers upon unauthorized responses.
ignoreDefaultArgs boolean | Array<string> (optional)#
If true, Playwright does not pass its own configurations args and only uses the ones from args. If an array is given, then filters out the given default arguments. Dangerous option; use with care. Defaults to false.
ignoreHTTPSErrors boolean (optional)#
Whether to ignore HTTPS errors when sending network requests. Defaults to false.
isMobile boolean (optional)#
Whether the meta viewport tag is taken into account and touch events are enabled. isMobile is a part of device, so you don't actually need to set it manually. Defaults to false and is not supported in Firefox. Learn more about mobile emulation.
javaScriptEnabled boolean (optional)#
Whether or not to enable JavaScript in the context. Defaults to true. Learn more about disabling JavaScript.
locale string (optional)#
Specify user locale, for example en-GB, de-DE, etc. Locale will affect navigator.language value, Accept-Language request header value as well as number and date formatting rules. Defaults to the system default locale. Learn more about emulation in our emulation guide.
logger Logger (optional)#
DEPRECATED
The logs received by the logger are incomplete. Please use tracing instead.
Logger sink for Playwright logging.
offline boolean (optional)#
Whether to emulate network being offline. Defaults to false. Learn more about network emulation.
permissions Array<string> (optional)#
A list of permissions to grant to all pages in this context. See browserContext.grantPermissions() for more details. Defaults to none.
proxy Object (optional)#
server string
Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example http://myproxy.com:3128 or socks5://myproxy.com:3128. Short form myproxy.com:3128 is considered an HTTP proxy.
bypass string (optional)
Optional comma-separated domains to bypass proxy, for example ".com, chromium.org, .domain.com".
username string (optional)
Optional username to use if HTTP proxy requires authentication.
password string (optional)
Optional password to use if HTTP proxy requires authentication.
Network proxy settings.
recordHar Object (optional)#
omitContent boolean (optional)
Optional setting to control whether to omit request content from the HAR. Defaults to false. Deprecated, use content policy instead.
content "omit" | "embed" | "attach" (optional)
Optional setting to control resource content management. If omit is specified, content is not persisted. If attach is specified, resources are persisted as separate files or entries in the ZIP archive. If embed is specified, content is stored inline the HAR file as per HAR specification. Defaults to attach for .zip output files and to embed for all other file extensions.
path string
Path on the filesystem to write the HAR file to. If the file name ends with .zip, content: 'attach' is used by default.
mode "full" | "minimal" (optional)
When set to minimal, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to full.
urlFilter string | RegExp (optional)
A glob or regex pattern to filter requests that are stored in the HAR. When a baseURL via the context options was provided and the passed URL is a path, it gets merged via the new URL() constructor. Defaults to none.
Enables HAR recording for all pages into recordHar.path file. If not specified, the HAR is not recorded. Make sure to await browserContext.close() for the HAR to be saved.
recordVideo Object (optional)#
dir string
Path to the directory to put videos into.
size Object (optional)
width number
Video frame width.
height number
Video frame height.
Optional dimensions of the recorded videos. If not specified the size will be equal to viewport scaled down to fit into 800x800. If viewport is not configured explicitly the video size defaults to 800x450. Actual picture of each page will be scaled down if necessary to fit the specified size.
Enables video recording for all pages into recordVideo.dir directory. If not specified videos are not recorded. Make sure to await browserContext.close() for videos to be saved.
reducedMotion null | "reduce" | "no-preference" (optional)#
Emulates 'prefers-reduced-motion' media feature, supported values are 'reduce', 'no-preference'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'no-preference'.
screen Object (optional)#
width number
page width in pixels.
height number
page height in pixels.
Emulates consistent window screen size available inside web page via window.screen. Is only used when the viewport is set.
serviceWorkers "allow" | "block" (optional)#
Whether to allow sites to register Service workers. Defaults to 'allow'.
'allow': Service Workers can be registered.
'block': Playwright will block all registration of Service Workers.
slowMo number (optional)#
Slows down Playwright operations by the specified amount of milliseconds. Useful so that you can see what is going on.
strictSelectors boolean (optional)#
If set to true, enables strict selectors mode for this context. In the strict selectors mode all operations on selectors that imply single target DOM element will throw when more than one element matches the selector. This option does not affect any Locator APIs (Locators are always strict). Defaults to false. See Locator to learn more about the strict mode.
timeout number (optional)#
Maximum time in milliseconds to wait for the browser instance to start. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
timezoneId string (optional)#
Changes the timezone of the context. See ICU's metaZones.txt for a list of supported timezone IDs. Defaults to the system timezone.
tracesDir string (optional)#
If specified, traces are saved into this directory.
userAgent string (optional)#
Specific user agent to use in this context.
videoSize Object (optional)#
DEPRECATED
Use recordVideo instead.
width number
Video frame width.
height number
Video frame height.
videosPath string (optional)#
DEPRECATED
Use recordVideo instead.
viewport null | Object (optional)#
width number
page width in pixels.
height number
page height in pixels.
Emulates consistent viewport for each page. Defaults to an 1280x720 viewport. Use null to disable the consistent viewport emulation. Learn more about viewport emulation.
NOTE
The null value opts out from the default presets, makes viewport depend on the host window size defined by the operating system. It makes the execution of the tests non-deterministic.
Returns
Promise<BrowserContext>#

launchServer
Added before v1.9 
Returns the browser app instance. You can connect to it via browserType.connect(), which requires the major/minor client/server version to match (1.2.3 → is compatible with 1.2.x).
Usage
Launches browser server that client can connect to. An example of launching a browser executable and connecting to it later:
const { chromium } = require('playwright');  // Or 'webkit' or 'firefox'.

(async () => {
 const browserServer = await chromium.launchServer();
 const wsEndpoint = browserServer.wsEndpoint();
 // Use web socket endpoint later to establish a connection.
 const browser = await chromium.connect(wsEndpoint);
 // Close browser instance.
 await browserServer.close();
})();
Arguments
options Object (optional)
args Array<string> (optional)#
WARNING
Use custom browser args at your own risk, as some of them may break Playwright functionality.
Additional arguments to pass to the browser instance. The list of Chromium flags can be found here.
channel string (optional)#
Browser distribution channel.
Use "chromium" to opt in to new headless mode.
Use "chrome", "chrome-beta", "chrome-dev", "chrome-canary", "msedge", "msedge-beta", "msedge-dev", or "msedge-canary" to use branded Google Chrome and Microsoft Edge.
chromiumSandbox boolean (optional)#
Enable Chromium sandboxing. Defaults to false.
devtools boolean (optional)#
DEPRECATED
Use debugging tools instead.
Chromium-only Whether to auto-open a Developer Tools panel for each tab. If this option is true, the headless option will be set false.
downloadsPath string (optional)#
If specified, accepted downloads are downloaded into this directory. Otherwise, temporary directory is created and is deleted when browser is closed. In either case, the downloads are deleted when the browser context they were created in is closed.
env Object<string, string | number | boolean> (optional)#
Specify environment variables that will be visible to the browser. Defaults to process.env.
executablePath string (optional)#
Path to a browser executable to run instead of the bundled one. If executablePath is a relative path, then it is resolved relative to the current working directory. Note that Playwright only works with the bundled Chromium, Firefox or WebKit, use at your own risk.
firefoxUserPrefs Object<string, string | number | boolean> (optional)#
Firefox user preferences. Learn more about the Firefox user preferences at about:config.
You can also provide a path to a custom policies.json file via PLAYWRIGHT_FIREFOX_POLICIES_JSON environment variable.
handleSIGHUP boolean (optional)#
Close the browser process on SIGHUP. Defaults to true.
handleSIGINT boolean (optional)#
Close the browser process on Ctrl-C. Defaults to true.
handleSIGTERM boolean (optional)#
Close the browser process on SIGTERM. Defaults to true.
headless boolean (optional)#
Whether to run browser in headless mode. More details for Chromium and Firefox. Defaults to true unless the devtools option is true.
host string (optional) Added in: v1.45#
Host to use for the web socket. It is optional and if it is omitted, the server will accept connections on the unspecified IPv6 address (::) when IPv6 is available, or the unspecified IPv4 address (0.0.0.0) otherwise. Consider hardening it with picking a specific interface.
ignoreDefaultArgs boolean | Array<string> (optional)#
If true, Playwright does not pass its own configurations args and only uses the ones from args. If an array is given, then filters out the given default arguments. Dangerous option; use with care. Defaults to false.
logger Logger (optional)#
DEPRECATED
The logs received by the logger are incomplete. Please use tracing instead.
Logger sink for Playwright logging.
port number (optional)#
Port to use for the web socket. Defaults to 0 that picks any available port.
proxy Object (optional)#
server string
Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example http://myproxy.com:3128 or socks5://myproxy.com:3128. Short form myproxy.com:3128 is considered an HTTP proxy.
bypass string (optional)
Optional comma-separated domains to bypass proxy, for example ".com, chromium.org, .domain.com".
username string (optional)
Optional username to use if HTTP proxy requires authentication.
password string (optional)
Optional password to use if HTTP proxy requires authentication.
Network proxy settings.
timeout number (optional)#
Maximum time in milliseconds to wait for the browser instance to start. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
tracesDir string (optional)#
If specified, traces are saved into this directory.
wsPath string (optional) Added in: v1.15#
Path at which to serve the Browser Server. For security, this defaults to an unguessable string.
WARNING
Any process or web page (including those running in Playwright) with knowledge of the wsPath can take control of the OS user. For this reason, you should use an unguessable token when using this option.
Returns
Promise<BrowserServer>#

name
Added before v1.9 
Returns browser name. For example: 'chromium', 'webkit' or 'firefox'.
Usage
browserType.name();
Returns
string#
Previous
BrowserServer
Next
CDPSession
Methods
connect
connectOverCDP
executablePath
launch
launchPersistentContext
launchServer
name
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
CDPSession
The CDPSession instances are used to talk raw Chrome Devtools Protocol:
protocol methods can be called with session.send method.
protocol events can be subscribed to with session.on method.
Useful links:
Documentation on DevTools Protocol can be found here: DevTools Protocol Viewer.
Getting Started with DevTools Protocol: https://github.com/aslushnikov/getting-started-with-cdp/blob/master/README.md
const client = await page.context().newCDPSession(page);
await client.send('Animation.enable');
client.on('Animation.animationCreated', () => console.log('Animation created!'));
const response = await client.send('Animation.getPlaybackRate');
console.log('playback rate is ' + response.playbackRate);
await client.send('Animation.setPlaybackRate', {
 playbackRate: response.playbackRate / 2
});

Methods
detach
Added before v1.9 
Detaches the CDPSession from the target. Once detached, the CDPSession object won't emit any events and can't be used to send messages.
Usage
await cdpSession.detach();
Returns
Promise<void>#

send
Added before v1.9 
Usage
await cdpSession.send(method);
await cdpSession.send(method, params);
Arguments
method string#
Protocol method name.
params Object (optional)#
Optional method parameters.
Returns
Promise<Object>#
Previous
BrowserType
Next
Clock
Methods
detach
send
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Clock
Accurately simulating time-dependent behavior is essential for verifying the correctness of applications. Learn more about clock emulation.
Note that clock is installed for the entire BrowserContext, so the time in all the pages and iframes is controlled by the same clock.

Methods
fastForward
Added in: v1.45 
Advance the clock by jumping forward in time. Only fires due timers at most once. This is equivalent to user closing the laptop lid for a while and reopening it later, after given time.
Usage
await page.clock.fastForward(1000);
await page.clock.fastForward('30:00');
Arguments
ticks number | string#
Time may be the number of milliseconds to advance the clock by or a human-readable string. Valid string formats are "08" for eight seconds, "01:00" for one minute and "02:34:10" for two hours, 34 minutes and ten seconds.
Returns
Promise<void>#

install
Added in: v1.45 
Install fake implementations for the following time-related functions:
Date
setTimeout
clearTimeout
setInterval
clearInterval
requestAnimationFrame
cancelAnimationFrame
requestIdleCallback
cancelIdleCallback
performance
Fake timers are used to manually control the flow of time in tests. They allow you to advance time, fire timers, and control the behavior of time-dependent functions. See clock.runFor() and clock.fastForward() for more information.
Usage
await clock.install();
await clock.install(options);
Arguments
options Object (optional)
time number | string | Date (optional)#
Time to initialize with, current system time by default.
Returns
Promise<void>#

pauseAt
Added in: v1.45 
Advance the clock by jumping forward in time and pause the time. Once this method is called, no timers are fired unless clock.runFor(), clock.fastForward(), clock.pauseAt() or clock.resume() is called.
Only fires due timers at most once. This is equivalent to user closing the laptop lid for a while and reopening it at the specified time and pausing.
Usage
await page.clock.pauseAt(new Date('2020-02-02'));
await page.clock.pauseAt('2020-02-02');
For best results, install the clock before navigating the page and set it to a time slightly before the intended test time. This ensures that all timers run normally during page loading, preventing the page from getting stuck. Once the page has fully loaded, you can safely use clock.pauseAt() to pause the clock.
// Initialize clock with some time before the test time and let the page load
// naturally. `Date.now` will progress as the timers fire.
await page.clock.install({ time: new Date('2024-12-10T08:00:00') });
await page.goto('http://localhost:3333');
await page.clock.pauseAt(new Date('2024-12-10T10:00:00'));
Arguments
time number | string | Date#
Time to pause at.
Returns
Promise<void>#

resume
Added in: v1.45 
Resumes timers. Once this method is called, time resumes flowing, timers are fired as usual.
Usage
await clock.resume();
Returns
Promise<void>#

runFor
Added in: v1.45 
Advance the clock, firing all the time-related callbacks.
Usage
await page.clock.runFor(1000);
await page.clock.runFor('30:00');
Arguments
ticks number | string#
Time may be the number of milliseconds to advance the clock by or a human-readable string. Valid string formats are "08" for eight seconds, "01:00" for one minute and "02:34:10" for two hours, 34 minutes and ten seconds.
Returns
Promise<void>#

setFixedTime
Added in: v1.45 
Makes Date.now and new Date() return fixed fake time at all times, keeps all the timers running.
Use this method for simple scenarios where you only need to test with a predefined time. For more advanced scenarios, use clock.install() instead. Read docs on clock emulation to learn more.
Usage
await page.clock.setFixedTime(Date.now());
await page.clock.setFixedTime(new Date('2020-02-02'));
await page.clock.setFixedTime('2020-02-02');
Arguments
time number | string | Date#
Time to be set in milliseconds.
Returns
Promise<void>#

setSystemTime
Added in: v1.45 
Sets system time, but does not trigger any timers. Use this to test how the web page reacts to a time shift, for example switching from summer to winter time, or changing time zones.
Usage
await page.clock.setSystemTime(Date.now());
await page.clock.setSystemTime(new Date('2020-02-02'));
await page.clock.setSystemTime('2020-02-02');
Arguments
time number | string | Date#
Time to be set in milliseconds.
Returns
Promise<void>#
Previous
CDPSession
Next
ConsoleMessage
Methods
fastForward
install
pauseAt
resume
runFor
setFixedTime
setSystemTime
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
ConsoleMessage
ConsoleMessage objects are dispatched by page via the page.on('console') event. For each console message logged in the page there will be corresponding event in the Playwright context.
// Listen for all console logs
page.on('console', msg => console.log(msg.text()));

// Listen for all console events and handle errors
page.on('console', msg => {
 if (msg.type() === 'error')
   console.log(`Error text: "${msg.text()}"`);
});

// Get the next console log
const msgPromise = page.waitForEvent('console');
await page.evaluate(() => {
 console.log('hello', 42, { foo: 'bar' });  // Issue console.log inside the page
});
const msg = await msgPromise;

// Deconstruct console log arguments
await msg.args()[0].jsonValue(); // hello
await msg.args()[1].jsonValue(); // 42

Methods
args
Added before v1.9 
List of arguments passed to a console function call. See also page.on('console').
Usage
consoleMessage.args();
Returns
Array<JSHandle>#

location
Added before v1.9 
Usage
consoleMessage.location();
Returns
Object#
url string
URL of the resource.
lineNumber number
0-based line number in the resource.
columnNumber number
0-based column number in the resource.

page
Added in: v1.34 
The page that produced this console message, if any.
Usage
consoleMessage.page();
Returns
null | Page#

text
Added before v1.9 
The text of the console message.
Usage
consoleMessage.text();
Returns
string#

type
Added before v1.9 
Usage
consoleMessage.type();
Returns
"log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd"#
Previous
Clock
Next
Coverage
Methods
args
location
page
text
type
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Coverage
Coverage gathers information about parts of JavaScript and CSS that were used by the page.
An example of using JavaScript coverage to produce Istanbul report for page load:
NOTE
Coverage APIs are only supported on Chromium-based browsers.
const { chromium } = require('playwright');
const v8toIstanbul = require('v8-to-istanbul');

(async () => {
 const browser = await chromium.launch();
 const page = await browser.newPage();
 await page.coverage.startJSCoverage();
 await page.goto('https://chromium.org');
 const coverage = await page.coverage.stopJSCoverage();
 for (const entry of coverage) {
   const converter = v8toIstanbul('', 0, { source: entry.source });
   await converter.load();
   converter.applyCoverage(entry.functions);
   console.log(JSON.stringify(converter.toIstanbul()));
 }
 await browser.close();
})();

Methods
startCSSCoverage
Added in: v1.11 
Returns coverage is started
Usage
await coverage.startCSSCoverage();
await coverage.startCSSCoverage(options);
Arguments
options Object (optional)
resetOnNavigation boolean (optional)#
Whether to reset coverage on every navigation. Defaults to true.
Returns
Promise<void>#

startJSCoverage
Added in: v1.11 
Returns coverage is started
NOTE
Anonymous scripts are ones that don't have an associated url. These are scripts that are dynamically created on the page using eval or new Function. If reportAnonymousScripts is set to true, anonymous scripts will have __playwright_evaluation_script__ as their URL.
Usage
await coverage.startJSCoverage();
await coverage.startJSCoverage(options);
Arguments
options Object (optional)
reportAnonymousScripts boolean (optional)#
Whether anonymous scripts generated by the page should be reported. Defaults to false.
resetOnNavigation boolean (optional)#
Whether to reset coverage on every navigation. Defaults to true.
Returns
Promise<void>#

stopCSSCoverage
Added in: v1.11 
Returns the array of coverage reports for all stylesheets
NOTE
CSS Coverage doesn't include dynamically injected style tags without sourceURLs.
Usage
await coverage.stopCSSCoverage();
Returns
Promise<Array<Object>>#
url string
StyleSheet URL
text string (optional)
StyleSheet content, if available.
ranges Array<Object>
start number
A start offset in text, inclusive
end number
An end offset in text, exclusive
StyleSheet ranges that were used. Ranges are sorted and non-overlapping.

stopJSCoverage
Added in: v1.11 
Returns the array of coverage reports for all scripts
NOTE
JavaScript Coverage doesn't include anonymous scripts by default. However, scripts with sourceURLs are reported.
Usage
await coverage.stopJSCoverage();
Returns
Promise<Array<Object>>#
url string
Script URL
scriptId string
Script ID
source string (optional)
Script content, if applicable.
functions Array<Object>
functionName string
isBlockCoverage boolean
ranges Array<Object>
count number
startOffset number
endOffset number
V8-specific coverage format.
Previous
ConsoleMessage
Next
Dialog
Methods
startCSSCoverage
startJSCoverage
stopCSSCoverage
stopJSCoverage
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Dialog
Dialog objects are dispatched by page via the page.on('dialog') event.
An example of using Dialog class:
const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.

(async () => {
 const browser = await chromium.launch();
 const page = await browser.newPage();
 page.on('dialog', async dialog => {
   console.log(dialog.message());
   await dialog.dismiss();
 });
 await page.evaluate(() => alert('1'));
 await browser.close();
})();
NOTE
Dialogs are dismissed automatically, unless there is a page.on('dialog') listener. When listener is present, it must either dialog.accept() or dialog.dismiss() the dialog - otherwise the page will freeze waiting for the dialog, and actions like click will never finish.

Methods
accept
Added before v1.9 
Returns when the dialog has been accepted.
Usage
await dialog.accept();
await dialog.accept(promptText);
Arguments
promptText string (optional)#
A text to enter in prompt. Does not cause any effects if the dialog's type is not prompt. Optional.
Returns
Promise<void>#

defaultValue
Added before v1.9 
If dialog is prompt, returns default prompt value. Otherwise, returns empty string.
Usage
dialog.defaultValue();
Returns
string#

dismiss
Added before v1.9 
Returns when the dialog has been dismissed.
Usage
await dialog.dismiss();
Returns
Promise<void>#

message
Added before v1.9 
A message displayed in the dialog.
Usage
dialog.message();
Returns
string#

page
Added in: v1.34 
The page that initiated this dialog, if available.
Usage
dialog.page();
Returns
null | Page#

type
Added before v1.9 
Returns dialog's type, can be one of alert, beforeunload, confirm or prompt.
Usage
dialog.type();
Returns
string#
Previous
Coverage
Next
Download
Methods
accept
defaultValue
dismiss
message
page
type
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Download
Download objects are dispatched by page via the page.on('download') event.
All the downloaded files belonging to the browser context are deleted when the browser context is closed.
Download event is emitted once the download starts. Download path becomes available once download completes.
// Start waiting for download before clicking. Note no await.
const downloadPromise = page.waitForEvent('download');
await page.getByText('Download file').click();
const download = await downloadPromise;

// Wait for the download process to complete and save the downloaded file somewhere.
await download.saveAs('/path/to/save/at/' + download.suggestedFilename());

Methods
cancel
Added in: v1.13 
Cancels a download. Will not fail if the download is already finished or canceled. Upon successful cancellations, download.failure() would resolve to 'canceled'.
Usage
await download.cancel();
Returns
Promise<void>#

createReadStream
Added before v1.9 
Returns a readable stream for a successful download, or throws for a failed/canceled download.
Usage
await download.createReadStream();
Returns
Promise<Readable>#

delete
Added before v1.9 
Deletes the downloaded file. Will wait for the download to finish if necessary.
Usage
await download.delete();
Returns
Promise<void>#

failure
Added before v1.9 
Returns download error if any. Will wait for the download to finish if necessary.
Usage
await download.failure();
Returns
Promise<null | string>#

page
Added in: v1.12 
Get the page that the download belongs to.
Usage
download.page();
Returns
Page#

path
Added before v1.9 
Returns path to the downloaded file for a successful download, or throws for a failed/canceled download. The method will wait for the download to finish if necessary. The method throws when connected remotely.
Note that the download's file name is a random GUID, use download.suggestedFilename() to get suggested file name.
Usage
await download.path();
Returns
Promise<string>#

saveAs
Added before v1.9 
Copy the download to a user-specified path. It is safe to call this method while the download is still in progress. Will wait for the download to finish if necessary.
Usage
await download.saveAs('/path/to/save/at/' + download.suggestedFilename());
Arguments
path string#
Path where the download should be copied.
Returns
Promise<void>#

suggestedFilename
Added before v1.9 
Returns suggested filename for this download. It is typically computed by the browser from the Content-Disposition response header or the download attribute. See the spec on whatwg. Different browsers can use different logic for computing it.
Usage
download.suggestedFilename();
Returns
string#

url
Added before v1.9 
Returns downloaded url.
Usage
download.url();
Returns
string#
Previous
Dialog
Next
ElementHandle
Methods
cancel
createReadStream
delete
failure
page
path
saveAs
suggestedFilename
url
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
ElementHandle
extends: JSHandle
ElementHandle represents an in-page DOM element. ElementHandles can be created with the page.$() method.
DISCOURAGED
The use of ElementHandle is discouraged, use Locator objects and web-first assertions instead.
const hrefElement = await page.$('a');
await hrefElement.click();
ElementHandle prevents DOM element from garbage collection unless the handle is disposed with jsHandle.dispose(). ElementHandles are auto-disposed when their origin frame gets navigated.
ElementHandle instances can be used as an argument in page.$eval() and page.evaluate() methods.
The difference between the Locator and ElementHandle is that the ElementHandle points to a particular element, while Locator captures the logic of how to retrieve an element.
In the example below, handle points to a particular DOM element on page. If that element changes text or is used by React to render an entirely different component, handle is still pointing to that very DOM element. This can lead to unexpected behaviors.
const handle = await page.$('text=Submit');
// ...
await handle.hover();
await handle.click();
With the locator, every time the element is used, up-to-date DOM element is located in the page using the selector. So in the snippet below, underlying DOM element is going to be located twice.
const locator = page.getByText('Submit');
// ...
await locator.hover();
await locator.click();

Methods
boundingBox
Added before v1.9 
This method returns the bounding box of the element, or null if the element is not visible. The bounding box is calculated relative to the main frame viewport - which is usually the same as the browser window.
Scrolling affects the returned bounding box, similarly to Element.getBoundingClientRect. That means x and/or y may be negative.
Elements from child frames return the bounding box relative to the main frame, unlike the Element.getBoundingClientRect.
Assuming the page is static, it is safe to use bounding box coordinates to perform input. For example, the following snippet should click the center of the element.
Usage
const box = await elementHandle.boundingBox();
await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
Returns
Promise<null | Object>#
x number
the x coordinate of the element in pixels.
y number
the y coordinate of the element in pixels.
width number
the width of the element in pixels.
height number
the height of the element in pixels.

contentFrame
Added before v1.9 
Returns the content frame for element handles referencing iframe nodes, or null otherwise
Usage
await elementHandle.contentFrame();
Returns
Promise<null | Frame>#

ownerFrame
Added before v1.9 
Returns the frame containing the given element.
Usage
await elementHandle.ownerFrame();
Returns
Promise<null | Frame>#

waitForElementState
Added before v1.9 
Returns when the element satisfies the state.
Depending on the state parameter, this method waits for one of the actionability checks to pass. This method throws when the element is detached while waiting, unless waiting for the "hidden" state.
"visible" Wait until the element is visible.
"hidden" Wait until the element is not visible or not attached. Note that waiting for hidden does not throw when the element detaches.
"stable" Wait until the element is both visible and stable.
"enabled" Wait until the element is enabled.
"disabled" Wait until the element is not enabled.
"editable" Wait until the element is editable.
If the element does not satisfy the condition for the timeout milliseconds, this method will throw.
Usage
await elementHandle.waitForElementState(state);
await elementHandle.waitForElementState(state, options);
Arguments
state "visible" | "hidden" | "stable" | "enabled" | "disabled" | "editable"#
A state to wait for, see below for more details.
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

Deprecated
$
Added in: v1.9 
DISCOURAGED
Use locator-based page.locator() instead. Read more about locators.
The method finds an element matching the specified selector in the ElementHandle's subtree. If no elements match the selector, returns null.
Usage
await elementHandle.$(selector);
Arguments
selector string#
A selector to query for.
Returns
Promise<null | ElementHandle>#

$$
Added in: v1.9 
DISCOURAGED
Use locator-based page.locator() instead. Read more about locators.
The method finds all elements matching the specified selector in the ElementHandles subtree. If no elements match the selector, returns empty array.
Usage
await elementHandle.$$(selector);
Arguments
selector string#
A selector to query for.
Returns
Promise<Array<ElementHandle>>#

$eval
Added in: v1.9 
DISCOURAGED
This method does not wait for the element to pass actionability checks and therefore can lead to the flaky tests. Use locator.evaluate(), other Locator helper methods or web-first assertions instead.
Returns the return value of pageFunction.
The method finds an element matching the specified selector in the ElementHandles subtree and passes it as a first argument to pageFunction. If no elements match the selector, the method throws an error.
If pageFunction returns a Promise, then elementHandle.$eval() would wait for the promise to resolve and return its value.
Usage
const tweetHandle = await page.$('.tweet');
expect(await tweetHandle.$eval('.like', node => node.innerText)).toBe('100');
expect(await tweetHandle.$eval('.retweets', node => node.innerText)).toBe('10');
Arguments
selector string#
A selector to query for.
pageFunction function(Element) | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<Serializable>#

$$eval
Added in: v1.9 
DISCOURAGED
In most cases, locator.evaluateAll(), other Locator helper methods and web-first assertions do a better job.
Returns the return value of pageFunction.
The method finds all elements matching the specified selector in the ElementHandle's subtree and passes an array of matched elements as a first argument to pageFunction.
If pageFunction returns a Promise, then elementHandle.$$eval() would wait for the promise to resolve and return its value.
Usage
<div class="feed">
 <div class="tweet">Hello!</div>
 <div class="tweet">Hi!</div>
</div>
const feedHandle = await page.$('.feed');
expect(await feedHandle.$$eval('.tweet', nodes =>
 nodes.map(n => n.innerText))).toEqual(['Hello!', 'Hi!'],
);
Arguments
selector string#
A selector to query for.
pageFunction function(Array<Element>) | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<Serializable>#

check
Added before v1.9 
DISCOURAGED
Use locator-based locator.check() instead. Read more about locators.
This method checks the element by performing the following steps:
Ensure that element is a checkbox or a radio input. If not, this method throws. If the element is already checked, this method returns immediately.
Wait for actionability checks on the element, unless force option is set.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now checked. If not, this method throws.
If the element is detached from the DOM at any moment during the action, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await elementHandle.check();
await elementHandle.check(options);
Arguments
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional) Added in: v1.11#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

click
Added before v1.9 
DISCOURAGED
Use locator-based locator.click() instead. Read more about locators.
This method clicks the element by performing the following steps:
Wait for actionability checks on the element, unless force option is set.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element, or the specified position.
Wait for initiated navigations to either succeed or fail, unless noWaitAfter option is set.
If the element is detached from the DOM at any moment during the action, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await elementHandle.click();
await elementHandle.click(options);
Arguments
options Object (optional)
button "left" | "right" | "middle" (optional)#
Defaults to left.
clickCount number (optional)#
defaults to 1. See UIEvent.detail.
delay number (optional)#
Time to wait between mousedown and mouseup in milliseconds. Defaults to 0.
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option will default to true in the future.
Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating to inaccessible pages. Defaults to false.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

dblclick
Added before v1.9 
DISCOURAGED
Use locator-based locator.dblclick() instead. Read more about locators.
This method double clicks the element by performing the following steps:
Wait for actionability checks on the element, unless force option is set.
Scroll the element into view if needed.
Use page.mouse to double click in the center of the element, or the specified position.
If the element is detached from the DOM at any moment during the action, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
NOTE
elementHandle.dblclick() dispatches two click events and a single dblclick event.
Usage
await elementHandle.dblclick();
await elementHandle.dblclick(options);
Arguments
options Object (optional)
button "left" | "right" | "middle" (optional)#
Defaults to left.
delay number (optional)#
Time to wait between mousedown and mouseup in milliseconds. Defaults to 0.
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

dispatchEvent
Added before v1.9 
DISCOURAGED
Use locator-based locator.dispatchEvent() instead. Read more about locators.
The snippet below dispatches the click event on the element. Regardless of the visibility state of the element, click is dispatched. This is equivalent to calling element.click().
Usage
await elementHandle.dispatchEvent('click');
Under the hood, it creates an instance of an event based on the given type, initializes it with eventInit properties and dispatches it on the element. Events are composed, cancelable and bubble by default.
Since eventInit is event-specific, please refer to the events documentation for the lists of initial properties:
DeviceMotionEvent
DeviceOrientationEvent
DragEvent
Event
FocusEvent
KeyboardEvent
MouseEvent
PointerEvent
TouchEvent
WheelEvent
You can also specify JSHandle as the property value if you want live objects to be passed into the event:
// Note you can only create DataTransfer in Chromium and Firefox
const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
await elementHandle.dispatchEvent('dragstart', { dataTransfer });
Arguments
type string#
DOM event type: "click", "dragstart", etc.
eventInit EvaluationArgument (optional)#
Optional event-specific initialization properties.
Returns
Promise<void>#

fill
Added before v1.9 
DISCOURAGED
Use locator-based locator.fill() instead. Read more about locators.
This method waits for actionability checks, focuses the element, fills it and triggers an input event after filling. Note that you can pass an empty string to clear the input field.
If the target element is not an <input>, <textarea> or [contenteditable] element, this method throws an error. However, if the element is inside the <label> element that has an associated control, the control will be filled instead.
To send fine-grained keyboard events, use locator.pressSequentially().
Usage
await elementHandle.fill(value);
await elementHandle.fill(value, options);
Arguments
value string#
Value to set for the <input>, <textarea> or [contenteditable] element.
options Object (optional)
force boolean (optional) Added in: v1.13#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

focus
Added before v1.9 
DISCOURAGED
Use locator-based locator.focus() instead. Read more about locators.
Calls focus on the element.
Usage
await elementHandle.focus();
Returns
Promise<void>#

getAttribute
Added before v1.9 
DISCOURAGED
Use locator-based locator.getAttribute() instead. Read more about locators.
Returns element attribute value.
Usage
await elementHandle.getAttribute(name);
Arguments
name string#
Attribute name to get the value for.
Returns
Promise<null | string>#

hover
Added before v1.9 
DISCOURAGED
Use locator-based locator.hover() instead. Read more about locators.
This method hovers over the element by performing the following steps:
Wait for actionability checks on the element, unless force option is set.
Scroll the element into view if needed.
Use page.mouse to hover over the center of the element, or the specified position.
If the element is detached from the DOM at any moment during the action, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await elementHandle.hover();
await elementHandle.hover(options);
Arguments
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional) Added in: v1.28#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

innerHTML
Added before v1.9 
DISCOURAGED
Use locator-based locator.innerHTML() instead. Read more about locators.
Returns the element.innerHTML.
Usage
await elementHandle.innerHTML();
Returns
Promise<string>#

innerText
Added before v1.9 
DISCOURAGED
Use locator-based locator.innerText() instead. Read more about locators.
Returns the element.innerText.
Usage
await elementHandle.innerText();
Returns
Promise<string>#

inputValue
Added in: v1.13 
DISCOURAGED
Use locator-based locator.inputValue() instead. Read more about locators.
Returns input.value for the selected <input> or <textarea> or <select> element.
Throws for non-input elements. However, if the element is inside the <label> element that has an associated control, returns the value of the control.
Usage
await elementHandle.inputValue();
await elementHandle.inputValue(options);
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<string>#

isChecked
Added before v1.9 
DISCOURAGED
Use locator-based locator.isChecked() instead. Read more about locators.
Returns whether the element is checked. Throws if the element is not a checkbox or radio input.
Usage
await elementHandle.isChecked();
Returns
Promise<boolean>#

isDisabled
Added before v1.9 
DISCOURAGED
Use locator-based locator.isDisabled() instead. Read more about locators.
Returns whether the element is disabled, the opposite of enabled.
Usage
await elementHandle.isDisabled();
Returns
Promise<boolean>#

isEditable
Added before v1.9 
DISCOURAGED
Use locator-based locator.isEditable() instead. Read more about locators.
Returns whether the element is editable.
Usage
await elementHandle.isEditable();
Returns
Promise<boolean>#

isEnabled
Added before v1.9 
DISCOURAGED
Use locator-based locator.isEnabled() instead. Read more about locators.
Returns whether the element is enabled.
Usage
await elementHandle.isEnabled();
Returns
Promise<boolean>#

isHidden
Added before v1.9 
DISCOURAGED
Use locator-based locator.isHidden() instead. Read more about locators.
Returns whether the element is hidden, the opposite of visible.
Usage
await elementHandle.isHidden();
Returns
Promise<boolean>#

isVisible
Added before v1.9 
DISCOURAGED
Use locator-based locator.isVisible() instead. Read more about locators.
Returns whether the element is visible.
Usage
await elementHandle.isVisible();
Returns
Promise<boolean>#

press
Added before v1.9 
DISCOURAGED
Use locator-based locator.press() instead. Read more about locators.
Focuses the element, and then uses keyboard.down() and keyboard.up().
key can specify the intended keyboardEvent.key value or a single character to generate the text for. A superset of the key values can be found here. Examples of the keys are:
F1 - F12, Digit0- Digit9, KeyA- KeyZ, Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape, ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight, ArrowUp, etc.
Following modification shortcuts are also supported: Shift, Control, Alt, Meta, ShiftLeft, ControlOrMeta.
Holding down Shift will type the text that corresponds to the key in the upper case.
If key is a single character, it is case-sensitive, so the values a and A will generate different respective texts.
Shortcuts such as key: "Control+o", key: "Control++ or key: "Control+Shift+T" are supported as well. When specified with the modifier, modifier is pressed and being held while the subsequent key is being pressed.
Usage
await elementHandle.press(key);
await elementHandle.press(key, options);
Arguments
key string#
Name of the key to press or a character to generate, such as ArrowLeft or a.
options Object (optional)
delay number (optional)#
Time to wait between keydown and keyup in milliseconds. Defaults to 0.
noWaitAfter boolean (optional)#
DEPRECATED
This option will default to true in the future.
Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating to inaccessible pages. Defaults to false.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

screenshot
Added before v1.9 
DISCOURAGED
Use locator-based locator.screenshot() instead. Read more about locators.
This method captures a screenshot of the page, clipped to the size and position of this particular element. If the element is covered by other elements, it will not be actually visible on the screenshot. If the element is a scrollable container, only the currently scrolled content will be visible on the screenshot.
This method waits for the actionability checks, then scrolls element into view before taking a screenshot. If the element is detached from DOM, the method throws an error.
Returns the buffer with the captured screenshot.
Usage
await elementHandle.screenshot();
await elementHandle.screenshot(options);
Arguments
options Object (optional)
animations "disabled" | "allow" (optional)#
When set to "disabled", stops CSS animations, CSS transitions and Web Animations. Animations get different treatment depending on their duration:
finite animations are fast-forwarded to completion, so they'll fire transitionend event.
infinite animations are canceled to initial state, and then played over after the screenshot.
Defaults to "allow" that leaves animations untouched.
caret "hide" | "initial" (optional)#
When set to "hide", screenshot will hide text caret. When set to "initial", text caret behavior will not be changed. Defaults to "hide".
mask Array<Locator> (optional)#
Specify locators that should be masked when the screenshot is taken. Masked elements will be overlaid with a pink box #FF00FF (customized by maskColor) that completely covers its bounding box. The mask is also applied to invisible elements, see Matching only visible elements to disable that.
maskColor string (optional) Added in: v1.35#
Specify the color of the overlay box for masked elements, in CSS color format. Default color is pink #FF00FF.
omitBackground boolean (optional)#
Hides default white background and allows capturing screenshots with transparency. Not applicable to jpeg images. Defaults to false.
path string (optional)#
The file path to save the image to. The screenshot type will be inferred from file extension. If path is a relative path, then it is resolved relative to the current working directory. If no path is provided, the image won't be saved to the disk.
quality number (optional)#
The quality of the image, between 0-100. Not applicable to png images.
scale "css" | "device" (optional)#
When set to "css", screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using "device" option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.
Defaults to "device".
style string (optional) Added in: v1.41#
Text of the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies to the inner frames.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
type "png" | "jpeg" (optional)#
Specify screenshot type, defaults to png.
Returns
Promise<Buffer>#

scrollIntoViewIfNeeded
Added before v1.9 
DISCOURAGED
Use locator-based locator.scrollIntoViewIfNeeded() instead. Read more about locators.
This method waits for actionability checks, then tries to scroll element into view, unless it is completely visible as defined by IntersectionObserver's ratio.
Throws when elementHandle does not point to an element connected to a Document or a ShadowRoot.
See scrolling for alternative ways to scroll.
Usage
await elementHandle.scrollIntoViewIfNeeded();
await elementHandle.scrollIntoViewIfNeeded(options);
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

selectOption
Added before v1.9 
DISCOURAGED
Use locator-based locator.selectOption() instead. Read more about locators.
This method waits for actionability checks, waits until all specified options are present in the <select> element and selects these options.
If the target element is not a <select> element, this method throws an error. However, if the element is inside the <label> element that has an associated control, the control will be used instead.
Returns the array of option values that have been successfully selected.
Triggers a change and input event once all the provided options have been selected.
Usage
// Single selection matching the value or label
handle.selectOption('blue');

// single selection matching the label
handle.selectOption({ label: 'Blue' });

// multiple selection
handle.selectOption(['red', 'green', 'blue']);
Arguments
values null | string | ElementHandle | Array<string> | Object | Array<ElementHandle> | Array<Object>#
value string (optional)
Matches by option.value. Optional.
label string (optional)
Matches by option.label. Optional.
index number (optional)
Matches by the index. Optional.
Options to select. If the <select> has the multiple attribute, all matching options are selected, otherwise only the first option matching one of the passed options is selected. String values are matching both values and labels. Option is considered matching if all specified properties match.
options Object (optional)
force boolean (optional) Added in: v1.13#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<Array<string>>#

selectText
Added before v1.9 
DISCOURAGED
Use locator-based locator.selectText() instead. Read more about locators.
This method waits for actionability checks, then focuses the element and selects all its text content.
If the element is inside the <label> element that has an associated control, focuses and selects text in the control instead.
Usage
await elementHandle.selectText();
await elementHandle.selectText(options);
Arguments
options Object (optional)
force boolean (optional) Added in: v1.13#
Whether to bypass the actionability checks. Defaults to false.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

setChecked
Added in: v1.15 
DISCOURAGED
Use locator-based locator.setChecked() instead. Read more about locators.
This method checks or unchecks an element by performing the following steps:
Ensure that element is a checkbox or a radio input. If not, this method throws.
If the element already has the right checked state, this method returns immediately.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now checked or unchecked. If not, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await elementHandle.setChecked(checked);
await elementHandle.setChecked(checked, options);
Arguments
checked boolean#
Whether to check or uncheck the checkbox.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

setInputFiles
Added before v1.9 
DISCOURAGED
Use locator-based locator.setInputFiles() instead. Read more about locators.
Sets the value of the file input to these file paths or files. If some of the filePaths are relative paths, then they are resolved relative to the current working directory. For empty array, clears the selected files. For inputs with a [webkitdirectory] attribute, only a single directory path is supported.
This method expects ElementHandle to point to an input element. However, if the element is inside the <label> element that has an associated control, targets the control instead.
Usage
await elementHandle.setInputFiles(files);
await elementHandle.setInputFiles(files, options);
Arguments
files string | Array<string> | Object | Array<Object>#
name string
File name
mimeType string
File type
buffer Buffer
File content
options Object (optional)
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

tap
Added before v1.9 
DISCOURAGED
Use locator-based locator.tap() instead. Read more about locators.
This method taps the element by performing the following steps:
Wait for actionability checks on the element, unless force option is set.
Scroll the element into view if needed.
Use page.touchscreen to tap the center of the element, or the specified position.
If the element is detached from the DOM at any moment during the action, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
NOTE
elementHandle.tap() requires that the hasTouch option of the browser context be set to true.
Usage
await elementHandle.tap();
await elementHandle.tap(options);
Arguments
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

textContent
Added before v1.9 
DISCOURAGED
Use locator-based locator.textContent() instead. Read more about locators.
Returns the node.textContent.
Usage
await elementHandle.textContent();
Returns
Promise<null | string>#

type
Added before v1.9 
DEPRECATED
In most cases, you should use locator.fill() instead. You only need to press keys one by one if there is special keyboard handling on the page - in this case use locator.pressSequentially().
Focuses the element, and then sends a keydown, keypress/input, and keyup event for each character in the text.
To press a special key, like Control or ArrowDown, use elementHandle.press().
Usage
Arguments
text string#
A text to type into a focused element.
options Object (optional)
delay number (optional)#
Time to wait between key presses in milliseconds. Defaults to 0.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

uncheck
Added before v1.9 
DISCOURAGED
Use locator-based locator.uncheck() instead. Read more about locators.
This method checks the element by performing the following steps:
Ensure that element is a checkbox or a radio input. If not, this method throws. If the element is already unchecked, this method returns immediately.
Wait for actionability checks on the element, unless force option is set.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now unchecked. If not, this method throws.
If the element is detached from the DOM at any moment during the action, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await elementHandle.uncheck();
await elementHandle.uncheck(options);
Arguments
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional) Added in: v1.11#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

waitForSelector
Added before v1.9 
DISCOURAGED
Use web assertions that assert visibility or a locator-based locator.waitFor() instead.
Returns element specified by selector when it satisfies state option. Returns null if waiting for hidden or detached.
Wait for the selector relative to the element handle to satisfy state option (either appear/disappear from dom, or become visible/hidden). If at the moment of calling the method selector already satisfies the condition, the method will return immediately. If the selector doesn't satisfy the condition for the timeout milliseconds, the function will throw.
Usage
await page.setContent(`<div><span></span></div>`);
const div = await page.$('div');
// Waiting for the 'span' selector relative to the div.
const span = await div.waitForSelector('span', { state: 'attached' });
NOTE
This method does not work across navigations, use page.waitForSelector() instead.
Arguments
selector string#
A selector to query for.
options Object (optional)
state "attached" | "detached" | "visible" | "hidden" (optional)#
Defaults to 'visible'. Can be either:
'attached' - wait for element to be present in DOM.
'detached' - wait for element to not be present in DOM.
'visible' - wait for element to have non-empty bounding box and no visibility:hidden. Note that element without any content or with display:none has an empty bounding box and is not considered visible.
'hidden' - wait for element to be either detached from DOM, or have an empty bounding box or visibility:hidden. This is opposite to the 'visible' option.
strict boolean (optional) Added in: v1.15#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<null | ElementHandle>#
Previous
Download
Next
FileChooser
Methods
boundingBox
contentFrame
ownerFrame
waitForElementState
Deprecated
$
$$
$eval
$$eval
check
click
dblclick
dispatchEvent
fill
focus
getAttribute
hover
innerHTML
innerText
inputValue
isChecked
isDisabled
isEditable
isEnabled
isHidden
isVisible
press
screenshot
scrollIntoViewIfNeeded
selectOption
selectText
setChecked
setInputFiles
tap
textContent
type
uncheck
waitForSelector
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
FileChooser
FileChooser objects are dispatched by the page in the page.on('filechooser') event.
// Start waiting for file chooser before clicking. Note no await.
const fileChooserPromise = page.waitForEvent('filechooser');
await page.getByText('Upload file').click();
const fileChooser = await fileChooserPromise;
await fileChooser.setFiles(path.join(__dirname, 'myfile.pdf'));

Methods
element
Added before v1.9 
Returns input element associated with this file chooser.
Usage
fileChooser.element();
Returns
ElementHandle#

isMultiple
Added before v1.9 
Returns whether this file chooser accepts multiple files.
Usage
fileChooser.isMultiple();
Returns
boolean#

page
Added before v1.9 
Returns page this file chooser belongs to.
Usage
fileChooser.page();
Returns
Page#

setFiles
Added before v1.9 
Sets the value of the file input this chooser is associated with. If some of the filePaths are relative paths, then they are resolved relative to the current working directory. For empty array, clears the selected files.
Usage
await fileChooser.setFiles(files);
await fileChooser.setFiles(files, options);
Arguments
files string | Array<string> | Object | Array<Object>#
name string
File name
mimeType string
File type
buffer Buffer
File content
options Object (optional)
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#
Previous
ElementHandle
Next
Frame
Methods
element
isMultiple
page
setFiles
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Frame
At every point of time, page exposes its current frame tree via the page.mainFrame() and frame.childFrames() methods.
Frame object's lifecycle is controlled by three events, dispatched on the page object:
page.on('frameattached') - fired when the frame gets attached to the page. A Frame can be attached to the page only once.
page.on('framenavigated') - fired when the frame commits navigation to a different URL.
page.on('framedetached') - fired when the frame gets detached from the page. A Frame can be detached from the page only once.
An example of dumping frame tree:
const { firefox } = require('playwright');  // Or 'chromium' or 'webkit'.

(async () => {
 const browser = await firefox.launch();
 const page = await browser.newPage();
 await page.goto('https://www.google.com/chrome/browser/canary.html');
 dumpFrameTree(page.mainFrame(), '');
 await browser.close();

 function dumpFrameTree(frame, indent) {
   console.log(indent + frame.url());
   for (const child of frame.childFrames())
     dumpFrameTree(child, indent + '  ');
 }
})();

Methods
addScriptTag
Added before v1.9 
Returns the added tag when the script's onload fires or when the script content was injected into frame.
Adds a <script> tag into the page with the desired url or content.
Usage
await frame.addScriptTag();
await frame.addScriptTag(options);
Arguments
options Object (optional)
content string (optional)#
Raw JavaScript content to be injected into frame.
path string (optional)#
Path to the JavaScript file to be injected into frame. If path is a relative path, then it is resolved relative to the current working directory.
type string (optional)#
Script type. Use 'module' in order to load a JavaScript ES6 module. See script for more details.
url string (optional)#
URL of a script to be added.
Returns
Promise<ElementHandle>#

addStyleTag
Added before v1.9 
Returns the added tag when the stylesheet's onload fires or when the CSS content was injected into frame.
Adds a <link rel="stylesheet"> tag into the page with the desired url or a <style type="text/css"> tag with the content.
Usage
await frame.addStyleTag();
await frame.addStyleTag(options);
Arguments
options Object (optional)
content string (optional)#
Raw CSS content to be injected into frame.
path string (optional)#
Path to the CSS file to be injected into frame. If path is a relative path, then it is resolved relative to the current working directory.
url string (optional)#
URL of the <link> tag.
Returns
Promise<ElementHandle>#

childFrames
Added before v1.9 
Usage
frame.childFrames();
Returns
Array<Frame>#

content
Added before v1.9 
Gets the full HTML contents of the frame, including the doctype.
Usage
await frame.content();
Returns
Promise<string>#

dragAndDrop
Added in: v1.13 
Usage
await frame.dragAndDrop(source, target);
await frame.dragAndDrop(source, target, options);
Arguments
source string#
A selector to search for an element to drag. If there are multiple elements satisfying the selector, the first will be used.
target string#
A selector to search for an element to drop onto. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
sourcePosition Object (optional) Added in: v1.14#
x number
y number
Clicks on the source element at this point relative to the top-left corner of the element's padding box. If not specified, some visible point of the element is used.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
targetPosition Object (optional) Added in: v1.14#
x number
y number
Drops on the target element at this point relative to the top-left corner of the element's padding box. If not specified, some visible point of the element is used.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

evaluate
Added before v1.9 
Returns the return value of pageFunction.
If the function passed to the frame.evaluate() returns a Promise, then frame.evaluate() would wait for the promise to resolve and return its value.
If the function passed to the frame.evaluate() returns a non-Serializable value, then frame.evaluate() returns undefined. Playwright also supports transferring some additional values that are not serializable by JSON: -0, NaN, Infinity, -Infinity.
Usage
const result = await frame.evaluate(([x, y]) => {
 return Promise.resolve(x * y);
}, [7, 8]);
console.log(result); // prints "56"
A string can also be passed in instead of a function.
console.log(await frame.evaluate('1 + 2')); // prints "3"
ElementHandle instances can be passed as an argument to the frame.evaluate():
const bodyHandle = await frame.evaluate('document.body');
const html = await frame.evaluate(([body, suffix]) =>
 body.innerHTML + suffix, [bodyHandle, 'hello'],
);
await bodyHandle.dispose();
Arguments
pageFunction function | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<Serializable>#

evaluateHandle
Added before v1.9 
Returns the return value of pageFunction as a JSHandle.
The only difference between frame.evaluate() and frame.evaluateHandle() is that frame.evaluateHandle() returns JSHandle.
If the function, passed to the frame.evaluateHandle(), returns a Promise, then frame.evaluateHandle() would wait for the promise to resolve and return its value.
Usage
// Handle for the window object
const aWindowHandle = await frame.evaluateHandle(() => Promise.resolve(window));
A string can also be passed in instead of a function.
const aHandle = await frame.evaluateHandle('document'); // Handle for the 'document'.
JSHandle instances can be passed as an argument to the frame.evaluateHandle():
const aHandle = await frame.evaluateHandle(() => document.body);
const resultHandle = await frame.evaluateHandle(([body, suffix]) =>
 body.innerHTML + suffix, [aHandle, 'hello'],
);
console.log(await resultHandle.jsonValue());
await resultHandle.dispose();
Arguments
pageFunction function | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<JSHandle>#

frameElement
Added before v1.9 
Returns the frame or iframe element handle which corresponds to this frame.
This is an inverse of elementHandle.contentFrame(). Note that returned handle actually belongs to the parent frame.
This method throws an error if the frame has been detached before frameElement() returns.
Usage
const frameElement = await frame.frameElement();
const contentFrame = await frameElement.contentFrame();
console.log(frame === contentFrame);  // -> true
Returns
Promise<ElementHandle>#

frameLocator
Added in: v1.17 
When working with iframes, you can create a frame locator that will enter the iframe and allow selecting elements in that iframe.
Usage
Following snippet locates element with text "Submit" in the iframe with id my-frame, like <iframe id="my-frame">:
const locator = frame.frameLocator('#my-iframe').getByText('Submit');
await locator.click();
Arguments
selector string#
A selector to use when resolving DOM element.
Returns
FrameLocator#

getByAltText
Added in: v1.27 
Allows locating elements by their alt text.
Usage
For example, this method will find the image by alt text "Playwright logo":
<img alt='Playwright logo'>
await page.getByAltText('Playwright logo').click();
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByLabel
Added in: v1.27 
Allows locating input elements by the text of the associated <label> or aria-labelledby element, or by the aria-label attribute.
Usage
For example, this method will find inputs by label "Username" and "Password" in the following DOM:
<input aria-label="Username">
<label for="password-input">Password:</label>
<input id="password-input">
await page.getByLabel('Username').fill('john');
await page.getByLabel('Password').fill('secret');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByPlaceholder
Added in: v1.27 
Allows locating input elements by the placeholder text.
Usage
For example, consider the following DOM structure.
<input type="email" placeholder="name@example.com" />
You can fill the input after locating it by the placeholder text:
await page
   .getByPlaceholder('name@example.com')
   .fill('playwright@microsoft.com');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByRole
Added in: v1.27 
Allows locating elements by their ARIA role, ARIA attributes and accessible name.
Usage
Consider the following DOM structure.
<h3>Sign up</h3>
<label>
 <input type="checkbox" /> Subscribe
</label>
<br/>
<button>Submit</button>
You can locate each element by it's implicit role:
await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();

await page.getByRole('checkbox', { name: 'Subscribe' }).check();

await page.getByRole('button', { name: /submit/i }).click();
Arguments
role "alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"#
Required aria role.
options Object (optional)
checked boolean (optional)#
An attribute that is usually set by aria-checked or native <input type=checkbox> controls.
Learn more about aria-checked.
disabled boolean (optional)#
An attribute that is usually set by aria-disabled or disabled.
NOTE
Unlike most other attributes, disabled is inherited through the DOM hierarchy. Learn more about aria-disabled.
exact boolean (optional) Added in: v1.28#
Whether name is matched exactly: case-sensitive and whole-string. Defaults to false. Ignored when name is a regular expression. Note that exact match still trims whitespace.
expanded boolean (optional)#
An attribute that is usually set by aria-expanded.
Learn more about aria-expanded.
includeHidden boolean (optional)#
Option that controls whether hidden elements are matched. By default, only non-hidden elements, as defined by ARIA, are matched by role selector.
Learn more about aria-hidden.
level number (optional)#
A number attribute that is usually present for roles heading, listitem, row, treeitem, with default values for <h1>-<h6> elements.
Learn more about aria-level.
name string | RegExp (optional)#
Option to match the accessible name. By default, matching is case-insensitive and searches for a substring, use exact to control this behavior.
Learn more about accessible name.
pressed boolean (optional)#
An attribute that is usually set by aria-pressed.
Learn more about aria-pressed.
selected boolean (optional)#
An attribute that is usually set by aria-selected.
Learn more about aria-selected.
Returns
Locator#
Details
Role selector does not replace accessibility audits and conformance tests, but rather gives early feedback about the ARIA guidelines.
Many html elements have an implicitly defined role that is recognized by the role selector. You can find all the supported roles here. ARIA guidelines do not recommend duplicating implicit roles and attributes by setting role and/or aria-* attributes to default values.

getByTestId
Added in: v1.27 
Locate element by the test id.
Usage
Consider the following DOM structure.
<button data-testid="directions">Itinéraire</button>
You can locate the element by it's test id:
await page.getByTestId('directions').click();
Arguments
testId string | RegExp#
Id to locate the element by.
Returns
Locator#
Details
By default, the data-testid attribute is used as a test id. Use selectors.setTestIdAttribute() to configure a different test id attribute if necessary.
// Set custom test id attribute from @playwright/test config:
import { defineConfig } from '@playwright/test';

export default defineConfig({
 use: {
   testIdAttribute: 'data-pw'
 },
});

getByText
Added in: v1.27 
Allows locating elements that contain given text.
See also locator.filter() that allows to match by another criteria, like an accessible role, and then filter by the text content.
Usage
Consider the following DOM structure:
<div>Hello <span>world</span></div>
<div>Hello</div>
You can locate by text substring, exact string, or a regular expression:
// Matches <span>
page.getByText('world');

// Matches first <div>
page.getByText('Hello world');

// Matches second <div>
page.getByText('Hello', { exact: true });

// Matches both <div>s
page.getByText(/Hello/);

// Matches second <div>
page.getByText(/^hello$/i);
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#
Details
Matching by text always normalizes whitespace, even with exact match. For example, it turns multiple spaces into one, turns line breaks into spaces and ignores leading and trailing whitespace.
Input elements of the type button and submit are matched by their value instead of the text content. For example, locating by text "Log in" matches <input type=button value="Log in">.

getByTitle
Added in: v1.27 
Allows locating elements by their title attribute.
Usage
Consider the following DOM structure.
<span title='Issues count'>25 issues</span>
You can check the issues count after locating it by the title text:
await expect(page.getByTitle('Issues count')).toHaveText('25 issues');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

goto
Added before v1.9 
Returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the last redirect.
The method will throw an error if:
there's an SSL error (e.g. in case of self-signed certificates).
target URL is invalid.
the timeout is exceeded during navigation.
the remote server does not respond or is unreachable.
the main resource failed to load.
The method will not throw an error when any valid HTTP status code is returned by the remote server, including 404 "Not Found" and 500 "Internal Server Error". The status code for such responses can be retrieved by calling response.status().
NOTE
The method either throws an error or returns a main resource response. The only exceptions are navigation to about:blank or navigation to the same URL with a different hash, which would succeed and return null.
NOTE
Headless mode doesn't support navigation to a PDF document. See the upstream issue.
Usage
await frame.goto(url);
await frame.goto(url, options);
Arguments
url string#
URL to navigate frame to. The url should include scheme, e.g. https://.
options Object (optional)
referer string (optional)#
Referer header value. If provided it will take preference over the referer header value set by page.setExtraHTTPHeaders().
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<null | Response>#

isDetached
Added before v1.9 
Returns true if the frame has been detached, or false otherwise.
Usage
frame.isDetached();
Returns
boolean#

isEnabled
Added before v1.9 
Returns whether the element is enabled.
Usage
await frame.isEnabled(selector);
await frame.isEnabled(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

locator
Added in: v1.14 
The method returns an element locator that can be used to perform actions on this page / frame. Locator is resolved to the element immediately before performing an action, so a series of actions on the same locator can in fact be performed on different DOM elements. That would happen if the DOM structure between those actions has changed.
Learn more about locators.
Learn more about locators.
Usage
frame.locator(selector);
frame.locator(selector, options);
Arguments
selector string#
A selector to use when resolving DOM element.
options Object (optional)
has Locator (optional)#
Narrows down the results of the method to those which contain elements matching this relative locator. For example, article that has text=Playwright matches <article><div>Playwright</div></article>.
Inner locator must be relative to the outer locator and is queried starting with the outer locator match, not the document root. For example, you can find content that has div in <article><content><div>Playwright</div></content></article>. However, looking for content that has article div will fail, because the inner locator must be relative and should not use any elements outside the content.
Note that outer and inner locators must belong to the same frame. Inner locator must not contain FrameLocators.
hasNot Locator (optional) Added in: v1.33#
Matches elements that do not contain an element that matches an inner locator. Inner locator is queried against the outer one. For example, article that does not have div matches <article><span>Playwright</span></article>.
Note that outer and inner locators must belong to the same frame. Inner locator must not contain FrameLocators.
hasNotText string | RegExp (optional) Added in: v1.33#
Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element. When passed a string, matching is case-insensitive and searches for a substring.
hasText string | RegExp (optional)#
Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a string, matching is case-insensitive and searches for a substring. For example, "Playwright" matches <article><div>Playwright</div></article>.
Returns
Locator#

name
Added before v1.9 
Returns frame's name attribute as specified in the tag.
If the name is empty, returns the id attribute instead.
NOTE
This value is calculated once when the frame is created, and will not update if the attribute is changed later.
Usage
frame.name();
Returns
string#

page
Added before v1.9 
Returns the page containing this frame.
Usage
frame.page();
Returns
Page#

parentFrame
Added before v1.9 
Parent frame, if any. Detached frames and main frames return null.
Usage
frame.parentFrame();
Returns
null | Frame#

setContent
Added before v1.9 
This method internally calls document.write(), inheriting all its specific characteristics and behaviors.
Usage
await frame.setContent(html);
await frame.setContent(html, options);
Arguments
html string#
HTML markup to assign to the page.
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<void>#

title
Added before v1.9 
Returns the page title.
Usage
await frame.title();
Returns
Promise<string>#

url
Added before v1.9 
Returns frame's url.
Usage
frame.url();
Returns
string#

waitForFunction
Added before v1.9 
Returns when the pageFunction returns a truthy value, returns that value.
Usage
The frame.waitForFunction() can be used to observe viewport size change:
const { firefox } = require('playwright');  // Or 'chromium' or 'webkit'.

(async () => {
 const browser = await firefox.launch();
 const page = await browser.newPage();
 const watchDog = page.mainFrame().waitForFunction('window.innerWidth < 100');
 await page.setViewportSize({ width: 50, height: 50 });
 await watchDog;
 await browser.close();
})();
To pass an argument to the predicate of frame.waitForFunction function:
const selector = '.foo';
await frame.waitForFunction(selector => !!document.querySelector(selector), selector);
Arguments
pageFunction function | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
options Object (optional)
polling number | "raf" (optional)#
If polling is 'raf', then pageFunction is constantly executed in requestAnimationFrame callback. If polling is a number, then it is treated as an interval in milliseconds at which the function would be executed. Defaults to raf.
timeout number (optional)#
Maximum time to wait for in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<JSHandle>#

waitForLoadState
Added before v1.9 
Waits for the required load state to be reached.
This returns when the frame reaches a required load state, load by default. The navigation must have been committed when this method is called. If current document has already reached the required state, resolves immediately.
NOTE
Most of the time, this method is not needed because Playwright auto-waits before every action.
Usage
await frame.click('button'); // Click triggers navigation.
await frame.waitForLoadState(); // Waits for 'load' state by default.
Arguments
state "load" | "domcontentloaded" | "networkidle" (optional)#
Optional load state to wait for, defaults to load. If the state has been already reached while loading current document, the method resolves immediately. Can be one of:
'load' - wait for the load event to be fired.
'domcontentloaded' - wait for the DOMContentLoaded event to be fired.
'networkidle' - DISCOURAGED wait until there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

waitForURL
Added in: v1.11 
Waits for the frame to navigate to the given URL.
Usage
await frame.click('a.delayed-navigation'); // Clicking the link will indirectly cause a navigation
await frame.waitForURL('**/target.html');
Arguments
url string | RegExp | function(URL):boolean#
A glob pattern, regex pattern or predicate receiving URL to match while waiting for the navigation. Note that if the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly equal to the string.
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<void>#

Deprecated
$
Added in: v1.9 
DISCOURAGED
Use locator-based frame.locator() instead. Read more about locators.
Returns the ElementHandle pointing to the frame element.
CAUTION
The use of ElementHandle is discouraged, use Locator objects and web-first assertions instead.
The method finds an element matching the specified selector within the frame. If no elements match the selector, returns null.
Usage
await frame.$(selector);
await frame.$(selector, options);
Arguments
selector string#
A selector to query for.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
Returns
Promise<null | ElementHandle>#

$$
Added in: v1.9 
DISCOURAGED
Use locator-based frame.locator() instead. Read more about locators.
Returns the ElementHandles pointing to the frame elements.
CAUTION
The use of ElementHandle is discouraged, use Locator objects instead.
The method finds all elements matching the specified selector within the frame. If no elements match the selector, returns empty array.
Usage
await frame.$$(selector);
Arguments
selector string#
A selector to query for.
Returns
Promise<Array<ElementHandle>>#

$eval
Added in: v1.9 
DISCOURAGED
This method does not wait for the element to pass the actionability checks and therefore can lead to the flaky tests. Use locator.evaluate(), other Locator helper methods or web-first assertions instead.
Returns the return value of pageFunction.
The method finds an element matching the specified selector within the frame and passes it as a first argument to pageFunction. If no elements match the selector, the method throws an error.
If pageFunction returns a Promise, then frame.$eval() would wait for the promise to resolve and return its value.
Usage
const searchValue = await frame.$eval('#search', el => el.value);
const preloadHref = await frame.$eval('link[rel=preload]', el => el.href);
const html = await frame.$eval('.main-container', (e, suffix) => e.outerHTML + suffix, 'hello');
Arguments
selector string#
A selector to query for.
pageFunction function(Element) | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
Returns
Promise<Serializable>#

$$eval
Added in: v1.9 
DISCOURAGED
In most cases, locator.evaluateAll(), other Locator helper methods and web-first assertions do a better job.
Returns the return value of pageFunction.
The method finds all elements matching the specified selector within the frame and passes an array of matched elements as a first argument to pageFunction.
If pageFunction returns a Promise, then frame.$$eval() would wait for the promise to resolve and return its value.
Usage
const divsCounts = await frame.$$eval('div', (divs, min) => divs.length >= min, 10);
Arguments
selector string#
A selector to query for.
pageFunction function(Array<Element>) | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<Serializable>#

check
Added before v1.9 
DISCOURAGED
Use locator-based locator.check() instead. Read more about locators.
This method checks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Ensure that matched element is a checkbox or a radio input. If not, this method throws. If the element is already checked, this method returns immediately.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now checked. If not, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await frame.check(selector);
await frame.check(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional) Added in: v1.11#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

click
Added before v1.9 
DISCOURAGED
Use locator-based locator.click() instead. Read more about locators.
This method clicks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element, or the specified position.
Wait for initiated navigations to either succeed or fail, unless noWaitAfter option is set.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await frame.click(selector);
await frame.click(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
button "left" | "right" | "middle" (optional)#
Defaults to left.
clickCount number (optional)#
defaults to 1. See UIEvent.detail.
delay number (optional)#
Time to wait between mousedown and mouseup in milliseconds. Defaults to 0.
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option will default to true in the future.
Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating to inaccessible pages. Defaults to false.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#

dblclick
Added before v1.9 
DISCOURAGED
Use locator-based locator.dblclick() instead. Read more about locators.
This method double clicks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to double click in the center of the element, or the specified position. if the first click of the dblclick() triggers a navigation event, this method will throw.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
NOTE
frame.dblclick() dispatches two click events and a single dblclick event.
Usage
await frame.dblclick(selector);
await frame.dblclick(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
button "left" | "right" | "middle" (optional)#
Defaults to left.
delay number (optional)#
Time to wait between mousedown and mouseup in milliseconds. Defaults to 0.
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#

dispatchEvent
Added before v1.9 
DISCOURAGED
Use locator-based locator.dispatchEvent() instead. Read more about locators.
The snippet below dispatches the click event on the element. Regardless of the visibility state of the element, click is dispatched. This is equivalent to calling element.click().
Usage
await frame.dispatchEvent('button#submit', 'click');
Under the hood, it creates an instance of an event based on the given type, initializes it with eventInit properties and dispatches it on the element. Events are composed, cancelable and bubble by default.
Since eventInit is event-specific, please refer to the events documentation for the lists of initial properties:
DeviceMotionEvent
DeviceOrientationEvent
DragEvent
Event
FocusEvent
KeyboardEvent
MouseEvent
PointerEvent
TouchEvent
WheelEvent
You can also specify JSHandle as the property value if you want live objects to be passed into the event:
// Note you can only create DataTransfer in Chromium and Firefox
const dataTransfer = await frame.evaluateHandle(() => new DataTransfer());
await frame.dispatchEvent('#source', 'dragstart', { dataTransfer });
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
type string#
DOM event type: "click", "dragstart", etc.
eventInit EvaluationArgument (optional)#
Optional event-specific initialization properties.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

fill
Added before v1.9 
DISCOURAGED
Use locator-based locator.fill() instead. Read more about locators.
This method waits for an element matching selector, waits for actionability checks, focuses the element, fills it and triggers an input event after filling. Note that you can pass an empty string to clear the input field.
If the target element is not an <input>, <textarea> or [contenteditable] element, this method throws an error. However, if the element is inside the <label> element that has an associated control, the control will be filled instead.
To send fine-grained keyboard events, use locator.pressSequentially().
Usage
await frame.fill(selector, value);
await frame.fill(selector, value, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
value string#
Value to fill for the <input>, <textarea> or [contenteditable] element.
options Object (optional)
force boolean (optional) Added in: v1.13#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

focus
Added before v1.9 
DISCOURAGED
Use locator-based locator.focus() instead. Read more about locators.
This method fetches an element with selector and focuses it. If there's no element matching selector, the method waits until a matching element appears in the DOM.
Usage
await frame.focus(selector);
await frame.focus(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

getAttribute
Added before v1.9 
DISCOURAGED
Use locator-based locator.getAttribute() instead. Read more about locators.
Returns element attribute value.
Usage
await frame.getAttribute(selector, name);
await frame.getAttribute(selector, name, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
name string#
Attribute name to get the value for.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<null | string>#

hover
Added before v1.9 
DISCOURAGED
Use locator-based locator.hover() instead. Read more about locators.
This method hovers over an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to hover over the center of the element, or the specified position.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await frame.hover(selector);
await frame.hover(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional) Added in: v1.28#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#

innerHTML
Added before v1.9 
DISCOURAGED
Use locator-based locator.innerHTML() instead. Read more about locators.
Returns element.innerHTML.
Usage
await frame.innerHTML(selector);
await frame.innerHTML(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<string>#

innerText
Added before v1.9 
DISCOURAGED
Use locator-based locator.innerText() instead. Read more about locators.
Returns element.innerText.
Usage
await frame.innerText(selector);
await frame.innerText(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<string>#

inputValue
Added in: v1.13 
DISCOURAGED
Use locator-based locator.inputValue() instead. Read more about locators.
Returns input.value for the selected <input> or <textarea> or <select> element.
Throws for non-input elements. However, if the element is inside the <label> element that has an associated control, returns the value of the control.
Usage
await frame.inputValue(selector);
await frame.inputValue(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<string>#

isChecked
Added before v1.9 
DISCOURAGED
Use locator-based locator.isChecked() instead. Read more about locators.
Returns whether the element is checked. Throws if the element is not a checkbox or radio input.
Usage
await frame.isChecked(selector);
await frame.isChecked(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

isDisabled
Added before v1.9 
DISCOURAGED
Use locator-based locator.isDisabled() instead. Read more about locators.
Returns whether the element is disabled, the opposite of enabled.
Usage
await frame.isDisabled(selector);
await frame.isDisabled(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

isEditable
Added before v1.9 
DISCOURAGED
Use locator-based locator.isEditable() instead. Read more about locators.
Returns whether the element is editable.
Usage
await frame.isEditable(selector);
await frame.isEditable(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

isHidden
Added before v1.9 
DISCOURAGED
Use locator-based locator.isHidden() instead. Read more about locators.
Returns whether the element is hidden, the opposite of visible. selector that does not match any elements is considered hidden.
Usage
await frame.isHidden(selector);
await frame.isHidden(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
DEPRECATED
This option is ignored. frame.isHidden() does not wait for the element to become hidden and returns immediately.
Returns
Promise<boolean>#

isVisible
Added before v1.9 
DISCOURAGED
Use locator-based locator.isVisible() instead. Read more about locators.
Returns whether the element is visible. selector that does not match any elements is considered not visible.
Usage
await frame.isVisible(selector);
await frame.isVisible(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
DEPRECATED
This option is ignored. frame.isVisible() does not wait for the element to become visible and returns immediately.
Returns
Promise<boolean>#

press
Added before v1.9 
DISCOURAGED
Use locator-based locator.press() instead. Read more about locators.
key can specify the intended keyboardEvent.key value or a single character to generate the text for. A superset of the key values can be found here. Examples of the keys are:
F1 - F12, Digit0- Digit9, KeyA- KeyZ, Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape, ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight, ArrowUp, etc.
Following modification shortcuts are also supported: Shift, Control, Alt, Meta, ShiftLeft, ControlOrMeta. ControlOrMeta resolves to Control on Windows and Linux and to Meta on macOS.
Holding down Shift will type the text that corresponds to the key in the upper case.
If key is a single character, it is case-sensitive, so the values a and A will generate different respective texts.
Shortcuts such as key: "Control+o", key: "Control++ or key: "Control+Shift+T" are supported as well. When specified with the modifier, modifier is pressed and being held while the subsequent key is being pressed.
Usage
await frame.press(selector, key);
await frame.press(selector, key, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
key string#
Name of the key to press or a character to generate, such as ArrowLeft or a.
options Object (optional)
delay number (optional)#
Time to wait between keydown and keyup in milliseconds. Defaults to 0.
noWaitAfter boolean (optional)#
DEPRECATED
This option will default to true in the future.
Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating to inaccessible pages. Defaults to false.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

selectOption
Added before v1.9 
DISCOURAGED
Use locator-based locator.selectOption() instead. Read more about locators.
This method waits for an element matching selector, waits for actionability checks, waits until all specified options are present in the <select> element and selects these options.
If the target element is not a <select> element, this method throws an error. However, if the element is inside the <label> element that has an associated control, the control will be used instead.
Returns the array of option values that have been successfully selected.
Triggers a change and input event once all the provided options have been selected.
Usage
// Single selection matching the value or label
frame.selectOption('select#colors', 'blue');

// single selection matching both the value and the label
frame.selectOption('select#colors', { label: 'Blue' });

// multiple selection
frame.selectOption('select#colors', 'red', 'green', 'blue');
Arguments
selector string#
A selector to query for.
values null | string | ElementHandle | Array<string> | Object | Array<ElementHandle> | Array<Object>#
value string (optional)
Matches by option.value. Optional.
label string (optional)
Matches by option.label. Optional.
index number (optional)
Matches by the index. Optional.
Options to select. If the <select> has the multiple attribute, all matching options are selected, otherwise only the first option matching one of the passed options is selected. String values are matching both values and labels. Option is considered matching if all specified properties match.
options Object (optional)
force boolean (optional) Added in: v1.13#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<Array<string>>#

setChecked
Added in: v1.15 
DISCOURAGED
Use locator-based locator.setChecked() instead. Read more about locators.
This method checks or unchecks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Ensure that matched element is a checkbox or a radio input. If not, this method throws.
If the element already has the right checked state, this method returns immediately.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now checked or unchecked. If not, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await frame.setChecked(selector, checked);
await frame.setChecked(selector, checked, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
checked boolean#
Whether to check or uncheck the checkbox.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional)#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

setInputFiles
Added before v1.9 
DISCOURAGED
Use locator-based locator.setInputFiles() instead. Read more about locators.
Sets the value of the file input to these file paths or files. If some of the filePaths are relative paths, then they are resolved relative to the current working directory. For empty array, clears the selected files.
This method expects selector to point to an input element. However, if the element is inside the <label> element that has an associated control, targets the control instead.
Usage
await frame.setInputFiles(selector, files);
await frame.setInputFiles(selector, files, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
files string | Array<string> | Object | Array<Object>#
name string
File name
mimeType string
File type
buffer Buffer
File content
options Object (optional)
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

tap
Added before v1.9 
DISCOURAGED
Use locator-based locator.tap() instead. Read more about locators.
This method taps an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.touchscreen to tap the center of the element, or the specified position.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
NOTE
frame.tap() requires that the hasTouch option of the browser context be set to true.
Usage
await frame.tap(selector);
await frame.tap(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#

textContent
Added before v1.9 
DISCOURAGED
Use locator-based locator.textContent() instead. Read more about locators.
Returns element.textContent.
Usage
await frame.textContent(selector);
await frame.textContent(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<null | string>#

type
Added before v1.9 
DEPRECATED
In most cases, you should use locator.fill() instead. You only need to press keys one by one if there is special keyboard handling on the page - in this case use locator.pressSequentially().
Sends a keydown, keypress/input, and keyup event for each character in the text. frame.type can be used to send fine-grained keyboard events. To fill values in form fields, use frame.fill().
To press a special key, like Control or ArrowDown, use keyboard.press().
Usage
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
text string#
A text to type into a focused element.
options Object (optional)
delay number (optional)#
Time to wait between key presses in milliseconds. Defaults to 0.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

uncheck
Added before v1.9 
DISCOURAGED
Use locator-based locator.uncheck() instead. Read more about locators.
This method checks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Ensure that matched element is a checkbox or a radio input. If not, this method throws. If the element is already unchecked, this method returns immediately.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now unchecked. If not, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await frame.uncheck(selector);
await frame.uncheck(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional) Added in: v1.11#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

waitForNavigation
Added before v1.9 
DEPRECATED
This method is inherently racy, please use frame.waitForURL() instead.
Waits for the frame navigation and returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the last redirect. In case of navigation to a different anchor or navigation due to History API usage, the navigation will resolve with null.
Usage
This method waits for the frame to navigate to a new URL. It is useful for when you run code which will indirectly cause the frame to navigate. Consider this example:
// Start waiting for navigation before clicking. Note no await.
const navigationPromise = page.waitForNavigation();
await page.getByText('Navigate after timeout').click();
await navigationPromise;
NOTE
Usage of the History API to change the URL is considered a navigation.
Arguments
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
url string | RegExp | function(URL):boolean (optional)#
A glob pattern, regex pattern or predicate receiving URL to match while waiting for the navigation. Note that if the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly equal to the string.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<null | Response>#

waitForSelector
Added before v1.9 
DISCOURAGED
Use web assertions that assert visibility or a locator-based locator.waitFor() instead. Read more about locators.
Returns when element specified by selector satisfies state option. Returns null if waiting for hidden or detached.
NOTE
Playwright automatically waits for element to be ready before performing an action. Using Locator objects and web-first assertions make the code wait-for-selector-free.
Wait for the selector to satisfy state option (either appear/disappear from dom, or become visible/hidden). If at the moment of calling the method selector already satisfies the condition, the method will return immediately. If the selector doesn't satisfy the condition for the timeout milliseconds, the function will throw.
Usage
This method works across navigations:
const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.

(async () => {
 const browser = await chromium.launch();
 const page = await browser.newPage();
 for (const currentURL of ['https://google.com', 'https://bbc.com']) {
   await page.goto(currentURL);
   const element = await page.mainFrame().waitForSelector('img');
   console.log('Loaded image: ' + await element.getAttribute('src'));
 }
 await browser.close();
})();
Arguments
selector string#
A selector to query for.
options Object (optional)
state "attached" | "detached" | "visible" | "hidden" (optional)#
Defaults to 'visible'. Can be either:
'attached' - wait for element to be present in DOM.
'detached' - wait for element to not be present in DOM.
'visible' - wait for element to have non-empty bounding box and no visibility:hidden. Note that element without any content or with display:none has an empty bounding box and is not considered visible.
'hidden' - wait for element to be either detached from DOM, or have an empty bounding box or visibility:hidden. This is opposite to the 'visible' option.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<null | ElementHandle>#

waitForTimeout
Added before v1.9 
DISCOURAGED
Never wait for timeout in production. Tests that wait for time are inherently flaky. Use Locator actions and web assertions that wait automatically.
Waits for the given timeout in milliseconds.
Note that frame.waitForTimeout() should only be used for debugging. Tests using the timer in production are going to be flaky. Use signals such as network events, selectors becoming visible and others instead.
Usage
await frame.waitForTimeout(timeout);
Arguments
timeout number#
A timeout to wait for
Returns
Promise<void>#
Previous
FileChooser
Next
FrameLocator
Methods
addScriptTag
addStyleTag
childFrames
content
dragAndDrop
evaluate
evaluateHandle
frameElement
frameLocator
getByAltText
getByLabel
getByPlaceholder
getByRole
getByTestId
getByText
getByTitle
goto
isDetached
isEnabled
locator
name
page
parentFrame
setContent
title
url
waitForFunction
waitForLoadState
waitForURL
Deprecated
$
$$
$eval
$$eval
check
click
dblclick
dispatchEvent
fill
focus
getAttribute
hover
innerHTML
innerText
inputValue
isChecked
isDisabled
isEditable
isHidden
isVisible
press
selectOption
setChecked
setInputFiles
tap
textContent
type
uncheck
waitForNavigation
waitForSelector
waitForTimeout
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft


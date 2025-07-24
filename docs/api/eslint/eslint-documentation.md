# ESLint Documentation
Getting Started with ESLint
ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs.
ESLint is completely pluggable. Every single rule is a plugin and you can add more at runtime. You can also add community plugins, configurations, and parsers to extend the functionality of ESLint.
Prerequisites
To use ESLint, you must have Node.js (^18.18.0, ^20.9.0, or >=21.1.0) installed and built with SSL support. (If you are using an official Node.js distribution, SSL is always built in.)
Quick start
You can install and configure ESLint using this command:
npmyarnpnpmbun
npm init @eslint/config@latest


If you want to use a specific shareable config that is hosted on npm, you can use the --config option and specify the package name:
npmyarnpnpmbun
# use `eslint-config-xo` shared config - npm 7+
npm init @eslint/config@latest -- --config eslint-config-xo



Note: npm init @eslint/config assumes you have a package.json file already. If you don’t, make sure to run npm init or yarn init beforehand.
After that, you can run ESLint on any file or directory like this:
npmyarnpnpmbun
npx eslint yourfile.js 


Configuration
Note: If you are coming from a version before 9.0.0 please see the migration guide.
When you run npm init @eslint/config, you’ll be asked a series of questions to determine how you’re using ESLint and what options should be included. After answering these questions, you’ll have an eslint.config.js (or eslint.config.mjs) file created in your directory.
For example, one of the questions is “Where does your code run?” If you select “Browser” then your configuration file will contain the definitions for global variables found in web browsers. Here’s an example:
import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
	{ files: ["**/*.js"], languageOptions: { globals: globals.browser } },
	{ files: ["**/*.js"], plugins: { js }, extends: ["js/recommended"] },
]);









The "js/recommended" configuration ensures all of the rules marked as recommended on the rules page will be turned on. Alternatively, you can use configurations that others have created by searching for “eslint-config” on npmjs.com. ESLint will not lint your code unless you extend from a shared configuration or explicitly turn rules on in your configuration.
You can configure rules individually by defining a new object with a rules key, as in this example:
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
	{ files: ["**/*.js"], plugins: { js }, extends: ["js/recommended"] },

	{
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
		},
	},
]);














The names "no-unused-vars" and "no-undef" are the names of rules in ESLint. The first value is the error level of the rule and can be one of these values:
"off" or 0 - turn the rule off
"warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
"error" or 2 - turn the rule on as an error (exit code will be 1)
The three error levels allow you fine-grained control over how ESLint applies rules (for more configuration options and details, see the configuration docs).
Global Install
It is also possible to install ESLint globally, rather than locally, using npm install eslint --global. However, this is not recommended, and any plugins or shareable configs that you use must still be installed locally if you install ESLint globally.
Manual Set Up
You can also manually set up ESLint in your project.
Important
If you are using pnpm, be sure to create a .npmrc file with at least the following settings:
auto-install-peers=true
node-linker=hoisted



This ensures that pnpm installs dependencies in a way that is more compatible with npm and is less likely to produce errors.
Before you begin, you must already have a package.json file. If you don’t, make sure to run npm init or yarn init to create the file beforehand.
Install the ESLint packages in your project:
npmyarnpnpmbun
npm install --save-dev eslint@latest @eslint/js@latest


Add an eslint.config.js file:
# Create JavaScript configuration file
touch eslint.config.js







Add configuration to the eslint.config.js file. Refer to the Configure ESLint documentation to learn how to add rules, custom configurations, plugins, and more.
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
	{
		files: ["**/*.js"],
		plugins: {
			js,
		},
		extends: ["js/recommended"],
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
		},
	},
]);





















Lint code using the ESLint CLI:
npmyarnpnpmbun
npx eslint project-dir/ file.js 


For more information on the available CLI options, refer to Command Line Interface.

Next Steps
Learn about advanced configuration of ESLint.
Get familiar with the command line options.
Explore ESLint integrations into other tools like editors, build systems, and more.
Can’t find just the right rule? Make your own custom rule.
Make ESLint even better by contributing.
Edit this page
Table of Contents
Prerequisites
Quick start
Configuration
Global Install
Manual Set Up
Next Steps
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Core Concepts
This page contains a high-level overview of some of the core concepts of ESLint.
What is ESLint?
ESLint is a configurable JavaScript linter. It helps you find and fix problems in your JavaScript code. Problems can be anything from potential runtime bugs, to not following best practices, to styling issues.
Rules
Rules are the core building block of ESLint. A rule validates if your code meets a certain expectation, and what to do if it does not meet that expectation. Rules can also contain additional configuration options specific to that rule.
For example, the semi rule lets you specify whether or not JavaScript statements should end with a semicolon (;). You can set the rule to either always require semicolons or require that a statement never ends with a semicolon.
ESLint contains hundreds of built-in rules that you can use. You can also create custom rules or use rules that others have created with plugins.
For more information, refer to Rules.
Rule Fixes
Rules may optionally provide fixes for violations that they find. Fixes safely correct the violation without changing application logic.
Fixes may be applied automatically with the --fix command line option and via editor extensions.
Rules that may provide fixes are marked with 🔧 in Rules.
Rule Suggestions
Rules may optionally provide suggestions in addition to or instead of providing fixes. Suggestions differ from fixes in two ways:
Suggestions may change application logic and so cannot be automatically applied.
Suggestions cannot be applied through the ESLint CLI and are only available through editor integrations.
Rules that may provide suggestions are marked with 💡 in Rules.
Configuration Files
An ESLint configuration file is a place where you put the configuration for ESLint in your project. You can include built-in rules, how you want them enforced, plugins with custom rules, shareable configurations, which files you want rules to apply to, and more.
For more information, refer to Configuration Files.
Shareable Configurations
Shareable configurations are ESLint configurations that are shared via npm.
Often shareable configurations are used to enforce style guides using ESLint’s built-in rules. For example the sharable configuration eslint-config-airbnb-base implements the popular Airbnb JavaScript style guide.
For more information, refer to Using a Shareable Configuration Package.
Plugins
An ESLint plugin is an npm module that can contain a set of ESLint rules, configurations, processors, and languages. Often plugins include custom rules. Plugins can be used to enforce a style guide and support JavaScript extensions (like TypeScript), libraries (like React), and frameworks (like Angular).
A popular use case for plugins is to enforce best practices for a framework. For example, @angular-eslint/eslint-plugin contains best practices for using the Angular framework.
For more information, refer to Configure Plugins.
Parsers
An ESLint parser converts code into an abstract syntax tree that ESLint can evaluate. By default, ESLint uses the built-in Espree parser, which is compatible with standard JavaScript runtimes and versions.
Custom parsers let ESLint parse non-standard JavaScript syntax. Often custom parsers are included as part of shareable configurations or plugins, so you don’t have to use them directly.
For example, @typescript-eslint/parser is a custom parser included in the typescript-eslint project that lets ESLint parse TypeScript code.
Custom Processors
An ESLint processor extracts JavaScript code from other kinds of files, then lets ESLint lint the JavaScript code. Alternatively, you can use a processor to manipulate JavaScript code before parsing it with ESLint.
For example, @eslint/markdown contains a custom processor that lets you lint JavaScript code inside of Markdown code blocks.
Formatters
An ESLint formatter controls the appearance of the linting results in the CLI.
For more information, refer to Formatters.
Integrations
One of the things that makes ESLint such a useful tool is the ecosystem of integrations that surrounds it. For example, many code editors have ESLint extensions that show you the ESLint results of your code in the file as you work so that you don’t need to use the ESLint CLI to see linting results.
For more information, refer to Integrations.
CLI & Node.js API
The ESLint CLI is a command line interface that lets you execute linting from the terminal. The CLI has a variety of options that you can pass to its commands.
The ESLint Node.js API lets you use ESLint programmatically from Node.js code. The API is useful when developing plugins, integrations, and other tools related to ESLint.
Unless you are extending ESLint in some way, you should use the CLI.
For more information, refer to Command Line Interface and Node.js API.
Edit this page
Table of Contents
What is ESLint?
Rules
Rule Fixes
Rule Suggestions
Configuration Files
Shareable Configurations
Plugins
Parsers
Custom Processors
Formatters
Integrations
CLI & Node.js API
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Glossary
This page serves as a reference for common terms associated with ESLint.
A
Abstract Syntax Tree (AST)
A structured representation of code syntax.
Each section of source code in an AST is referred to as a node. Each node may have any number of properties, including properties that store child nodes.
The AST format used by ESLint is the ESTree format.
ESLint rules are given an AST and may produce violations on parts of the AST when they detect a violation.
C
Config File (Configuration File)
A file containing preferences for how ESLint should parse files and run rules.
ESLint config files are named like eslint.config.(c|m)js. Each config file exports a config array containing config objects.
For example, this eslint.config.js file enables the prefer-const rule at the error severity:
export default [
	{
		rules: {
			"prefer-const": "error",
		},
	},
];








See Configuration Files for more details.
Config Array
An array of config objects within a config file.
Each config file exports an array of config objects. The objects in the array are evaluated in order: later objects may override settings specified in earlier objects.
See Configuration Files for more details.
Config Object
A config file entry specifying all of the information ESLint needs to execute on a set of files.
Each configuration object may include properties describing which files to run on, how to handle different file types, which plugins to include, and how to run rules.
See Configuration Files > Configuration Objects for more details.
E
ESQuery
The library used by ESLint to parse selector syntax for querying nodes in an AST.
ESQuery interprets CSS syntax for AST node properties. Examples of ESQuery selectors include:
BinaryExpression: selects all nodes of type BinaryExpression
BinaryExpression[operator='+']: selects all BinaryExpression nodes whose operator is +
BinaryExpression > Literal[value=1]: selects all Literal nodes with value 1 whose direct parent is a BinaryExpression
See github.com/estools/esquery for more information on the ESQuery format.
ESTree
The format used by ESLint for how to represent JavaScript syntax as an AST.
For example, the ESTree representation of the code 1 + 2; would be an object roughly like:
{
	"type": "ExpressionStatement",
	"expression": {
		"type": "BinaryExpression",
		"left": {
			"type": "Literal",
			"value": 1,
			"raw": "1"
		},
		"operator": "+",
		"right": {
			"type": "Literal",
			"value": 2,
			"raw": "2"
		}
	}
}


















Static analysis tools such as ESLint typically operate by converting syntax into an AST in the ESTree format.
See github.com/estree/estree for more information on the ESTree specification.
F
Fix
An optional augmentation to a rule violation that describes how to automatically correct the violation.
Fixes are generally “safe” to apply automatically: they shouldn’t cause code behavior changes. ESLint attempts to apply as many fixes as possible in a report when run with the --fix flag, though there is no guarantee that all fixes will be applied. Fixes may also be applied by common editor extensions.
Rule violations may also include file changes that are unsafe and not automatically applied in the form of suggestions.
Flat Config
The current configuration file format for ESLint.
Flat config files are named in the format eslint.config.(c|m)?js. “Flat” config files are named as such because all nesting must be done in one configuration file. In contrast, the “Legacy” config format allowed nesting configuration files in sub-directories within a project.
You can read more about the motivations behind flat configurations in ESLint’s new config system, Part 2: Introduction to flat config.
Formatter (Linting)
A package that presents the report generated by ESLint.
ESLint ships with several built-in reporters, including stylish (default), json, and html.
For more information, see Formatters.
Formatter (Tool)
A static analysis tool that quickly reformats code without changing its logic or names.
Formatters generally only modify the “trivia” of code, such as semicolons, spacing, newlines, and whitespace in general. Trivia changes generally don’t modify the AST of code.
Common formatters in the ecosystem include Prettier and dprint.
Note that although ESLint is a linter rather than a formatter, ESLint rules can also apply formatting changes to source code. See Formatting (Rule) for more information on formatting rules.
Formatting (Rule)
A rule that solely targets formatting concerns, such as semicolons and whitespace. These rules don’t change application logic and are a subset of Stylistic rules.
ESLint no longer recommends formatting rules and previously deprecated its built-in formatting rules. ESLint recommends instead using a dedicated formatter such as Prettier or dprint. Alternately, the ESLint Stylistic project provides formatting-related lint rules.
For more information, see Deprecation of formatting rules.
G
Global Declaration
A description to ESLint of a JavaScript global variable that should exist at runtime.
Global declarations inform lint rules that check for proper uses of global variables. For example, the no-undef rule will create a violation for references to global variables not defined in the configured list of globals.
Config files have globals defined as JavaScript objects.
For information about configuring globals, see Configure Language Options > Specifying Globals.
Global Variable
A runtime variable that exists in the global scope, meaning all modules and scripts have access to it.
Global variables in JavaScript are declared on the globalThis object (generally aliased as global in Node.js and window in browsers).
You can let ESLint know which global variables your code uses with global declarations.
I
Inline Config (Configuration Comment)
A source code comment that configures a rule to a different severity and/or set of options.
Inline configs use similar syntax as config files to specify any number of rules by name, their new severity, and optionally new options for the rules. For example, the following inline config comment simultaneously disables the eqeqeq rule and sets the curly rule to "error":
/* eslint eqeqeq: "off", curly: "error" */


For documentation on inline config comments, see Rules > Using configuration comments.
L
Legacy Config
The previous configuration file format for ESLint, now superseded by “Flat” config.
Legacy ESLint configurations are named in the format .eslintrc.* and allowed to be nested across files within sub-directories in a project.
You can read more about the lifetime of legacy configurations in ESLint’s new config system, Part 1: Background.
Linter
A static analysis tool that can report the results from running a set of rules on source code. Each rule may report any number of violations in the source code.
ESLint is a commonly used linter for JavaScript and other web technologies.
Note that a linter is separate from formatters and type checkers.
Logical Rule
A rule that inspects how code operates to find problems.
Many logical rules look for likely crashes (e.g. no-undef), unintended behavior (e.g. no-sparse-arrays), and unused code (e.g no-unused-vars).
You can see the full list of logical rules that ship with ESLint under Rules > Possible Problems
N
Node
A section of code within an AST.
Each node represents a type of syntax found in source code. For example, the 1 + 2 in the AST for 1 + 2; is a BinaryExpression.
See #esquery for the library ESLint uses to parse selectors that allow rules to search for nodes.
O
Override
When a config object or inline config sets a new severity and/or rule options that supersede previously set severity and/or options.
The following config file overrides no-unused-expressions from "error" to "off" in *.test.js files:
export default [
	{
		rules: {
			"no-unused-expressions": "error",
		},
	},
	{
		files: ["*.test.js"],
		rules: {
			"no-unused-expressions": "off",
		},
	},
];














The following inline config sets no-unused-expressions to "error":
/* eslint no-unused-expressions: "error" */


For more information on overrides in legacy configs, see Configuration Files (Deprecated) > How do overrides work?.
P
Parser
An object containing a method that reads in a string and converts it to a standardized format.
ESLint uses parsers to convert source code strings into an AST shape. By default, ESLint uses the Espree parser, which generates an AST compatible with standard JavaScript runtimes and versions.
Custom parsers let ESLint parse non-standard JavaScript syntax. Often custom parsers are included as part of shareable configurations or plugins, so you don’t have to use them directly. For example, @typescript-eslint/parser is a custom parser included in the typescript-eslint project that lets ESLint parse TypeScript code.
For more information on using parsers with ESLint, see Configure a Parser.
Plugin
A package that can contain a set of configurations, processors, and/or rules.
A popular use case for plugins is to enforce best practices for a framework. For example, @angular-eslint/eslint-plugin contains best practices for using the Angular framework.
For more information, refer to Configure Plugins.
Processor
A part of a plugin that extracts JavaScript code from other kinds of files, then lets ESLint lint the JavaScript code.
For example, @eslint/markdown includes a processor that converts the text of ``` code blocks in Markdown files into code that can be linted.
For more information on configuring processor, see Plugins > Specify a Processor.
R
Report
A collection of violations from a single ESLint run.
When ESLint runs on source files, it will pass an AST for each source file to each configured rule. The collection of violations from each of the rules will be packaged together and passed to a formatter to be presented to the user.
Rule
Code that checks an AST for expected patterns. When a rule’s expectation is not met, it creates a violation.
ESLint provides a large collection of rules that check for common JavaScript code issues. Many more rules may be loaded in by plugins.
For an overview of rules provided, see Core Concepts > Rules.
S
Selector
Syntax describing how to search for nodes within an AST.
ESLint rules use ESQuery selectors to find nodes that should be checked.
Severity
What level of reporting a rule is configured to run, if at all.
ESLint supports three levels of severity:
"off" (0): Do not run the rule.
"warn" (1): Run the rule, but don’t exit with a non-zero status code based on its violations (excluding the --max-warnings flag)
"error" (2): Run the rule, and exit with a non-zero status code if it produces any violations
For documentation on configuring rules, see Configure Rules.
Shareable Config (Configuration)
A module that provides a predefined config file configurations.
Shareable configs can configure all the same information from config files, including plugins and rules.
Shareable configs are often provided alongside plugins. Many plugins provide configs with names like “recommended” that enable their suggested starting set of rules. For example, eslint-plugin-solid provides a shareable recommended config:
import js from "@eslint/js";
import solid from "eslint-plugin-solid/configs/recommended";

export default [js.configs.recommended, solid];





For information on shareable configs, see Share Configurations.
Static Analysis
The process of analyzing source code without building or running it.
Linters such as ESLint, formatters, and type checkers are examples of static analysis tools.
Static analysis is different from dynamic analysis, which is the process of evaluating source code after it is built and executed. Unit, integration, and end-to-end tests are common examples of dynamic analysis.
Stylistic (Rule)
A rule that enforces a preference rather than a logical issue. Stylistic areas include Formatting rules, naming conventions, and consistent choices between equivalent syntaxes.
ESLint’s built-in stylistic rules are feature frozen: except for supporting new ECMAScript versions, they won’t receive new features.
For more information, see Changes to our rules policies and Deprecation of formatting rules.
Suggestion
An optional augmentation to a rule violation that describes how one may manually adjust the code to address the violation.
Suggestions are not generally safe to apply automatically because they cause code behavior changes. ESLint does not apply suggestions directly but does provide suggestion to integrations that may choose to apply suggestions (such as an editor extension).
Rule violations may also include file changes that are safe and may be automatically applied in the form of fixes.
T
Type Checker
A static analysis tool that builds a full understanding of a project’s code constructs and data shapes.
Type checkers are generally slower and more comprehensive than linters. Whereas linters traditionally operate only on a single file’s or snippet’s AST at a time, type checkers understand cross-file dependencies and types.
TypeScript is the most common type checker for JavaScript. The typescript-eslint project provides integrations that allow using type checker in lint rules.
V
Violation
An indication from a rule that an area of code doesn’t meet the expectation of the rule.
Rule violations indicate a range in source code and error message explaining the violation. Violations may also optionally include a fix and/or suggestions that indicate how to improve the violating code.
Edit this page
Table of Contents
A
Abstract Syntax Tree (AST)
C
Config File (Configuration File)
Config Array
Config Object
E
ESQuery
ESTree
F
Fix
Flat Config
Formatter (Linting)
Formatter (Tool)
Formatting (Rule)
G
Global Declaration
Global Variable
I
Inline Config (Configuration Comment)
L
Legacy Config
Linter
Logical Rule
N
Node
O
Override
P
Parser
Plugin
Processor
R
Report
Rule
S
Selector
Severity
Shareable Config (Configuration)
Static Analysis
Stylistic (Rule)
Suggestion
T
Type Checker
V
Violation
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Configure ESLint
ESLint is designed to be flexible and configurable for your use case. You can turn off every rule and run only with basic syntax validation or mix and match the bundled rules and your custom rules to fit the needs of your project. There are two primary ways to configure ESLint:
Configuration Comments - use JavaScript comments to embed configuration information directly into a file.
Configuration Files - use a JavaScript file to specify configuration information for an entire directory and all of its subdirectories. This can be in the form of an eslint.config.js file which ESLint will look for and read automatically, or you can specify a configuration file on the command line.
Here are some of the options that you can configure in ESLint:
Globals - the additional global variables your script accesses during execution.
Rules - which rules are enabled and at what error level.
Plugins - which third-party plugins define additional rules, languages, configs, etc. for ESLint to use.
All of these options give you fine-grained control over how ESLint treats your code.
Table of Contents
Configuration Files
Configuration File Format
Configuration Objects
Configuring Shared Settings
Configuration File Resolution
Configure Language Options
Specifying JavaScript Options
Specifying Globals
Configure Rules
Configuring Rules
Disabling Rules
Configure Plugins
Configure Plugins
Specify a Processor
Configure a Parser
Configure a Custom Parser
Ignore Files
Ignoring Files
Ignoring Directories
Unignoring Files and Directories
Ignored File Warnings
Edit this page
Table of Contents
Table of Contents
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Configuration Files
Tip
This page explains how to use flat config files. For the deprecated eslintrc format, see the deprecated documentation.
You can put your ESLint project configuration in a configuration file. You can include built-in rules, how you want them enforced, plugins with custom rules, shareable configurations, which files you want rules to apply to, and more.
Configuration File
The ESLint configuration file may be named any of the following:
eslint.config.js
eslint.config.mjs
eslint.config.cjs
eslint.config.ts (requires additional setup)
eslint.config.mts (requires additional setup)
eslint.config.cts (requires additional setup)
It should be placed in the root directory of your project and export an array of configuration objects. Here’s an example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			semi: "error",
			"prefer-const": "error",
		},
	},
]);












In this example, the defineConfig() helper is used to define a configuration array with just one configuration object. The configuration object enables two rules: semi and prefer-const. These rules are applied to all of the files ESLint processes using this config file.
If your project does not specify "type":"module" in its package.json file, then eslint.config.js must be in CommonJS format, such as:
// eslint.config.js
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
	{
		rules: {
			semi: "error",
			"prefer-const": "error",
		},
	},
]);












Configuration Objects
Each configuration object contains all of the information ESLint needs to execute on a set of files. Each configuration object is made up of these properties:
name - A name for the configuration object. This is used in error messages and config inspector to help identify which configuration object is being used. (Naming Convention)
basePath - A string specifying the path to a subdirectory to which the configuration object should apply to. It can be a relative or an absolute path.
files - An array of glob patterns indicating the files that the configuration object should apply to. If not specified, the configuration object applies to all files matched by any other configuration object.
ignores - An array of glob patterns indicating the files that the configuration object should not apply to. If not specified, the configuration object applies to all files matched by files. If ignores is used without any other keys in the configuration object, then the patterns act as global ignores and it gets applied to every configuration object.
extends - An array of strings, configuration objects, or configuration arrays that contain additional configuration to apply.
languageOptions - An object containing settings related to how JavaScript is configured for linting.
ecmaVersion - The version of ECMAScript to support. May be any year (i.e., 2022) or version (i.e., 5). Set to "latest" for the most recent supported version. (default: "latest")
sourceType - The type of JavaScript source code. Possible values are "script" for traditional script files, "module" for ECMAScript modules (ESM), and "commonjs" for CommonJS files. (default: "module" for .js and .mjs files; "commonjs" for .cjs files)
globals - An object specifying additional objects that should be added to the global scope during linting.
parser - An object containing a parse() method or a parseForESLint() method. (default: espree)
parserOptions - An object specifying additional options that are passed directly to the parse() or parseForESLint() method on the parser. The available options are parser-dependent.
linterOptions - An object containing settings related to the linting process.
noInlineConfig - A Boolean value indicating if inline configuration is allowed.
reportUnusedDisableDirectives - A severity string indicating if and how unused disable and enable directives should be tracked and reported. For legacy compatibility, true is equivalent to "warn" and false is equivalent to "off". (default: "warn").
reportUnusedInlineConfigs - A severity string indicating if and how unused inline configs should be tracked and reported. (default: "off")
processor - Either an object containing preprocess() and postprocess() methods or a string indicating the name of a processor inside of a plugin (i.e., "pluginName/processorName").
plugins - An object containing a name-value mapping of plugin names to plugin objects. When files is specified, these plugins are only available to the matching files.
rules - An object containing the configured rules. When files or ignores are specified, these rule configurations are only available to the matching files.
settings - An object containing name-value pairs of information that should be available to all rules.
Specifying files and ignores
Tip
Patterns specified in files and ignores use minimatch syntax and are evaluated relative to the location of the eslint.config.js file. If using an alternate config file via the --config command line option, then all patterns are evaluated relative to the current working directory. In case the configuration object has the basePath property with a relative path, the subdirectory it specifies is evaluated relative to the location of the eslint.config.js file (or relative to the current working directory if using an alternate config file via the --config command line option). In configuration objects with the basePath property, patterns specified in files and ignores are evaluated relative to the subdirectory represented by the basePath.
You can use a combination of files and ignores to determine which files the configuration object should apply to and which not. Here’s an example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	// matches all files ending with .js
	{
		files: ["**/*.js"],
		rules: {
			semi: "error",
		},
	},

	// matches all files ending with .js except those in __tests
	{
		files: ["**/*.js"],
		ignores: ["__tests/**"],
		rules: {
			"no-console": "error",
		},
	},
]);






















Configuration objects without files or ignores are automatically applied to any file that is matched by any other configuration object. For example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	// matches all files because it doesn't specify the `files` or `ignores` key
	{
		rules: {
			semi: "error",
		},
	},
]);












With this configuration, the semi rule is enabled for all files that match the default files in ESLint. So if you pass example.js to ESLint, the semi rule is applied. If you pass a non-JavaScript file, like example.txt, the semi rule is not applied because there are no other configuration objects that match that filename. (ESLint outputs an error message letting you know that the file was ignored due to missing configuration.)
Important
By default, ESLint lints files that match the patterns **/*.js, **/*.cjs, and **/*.mjs. Those files are always matched unless you explicitly exclude them using global ignores.
Specifying files with arbitrary extensions
To lint files with extensions other than the default .js, .cjs and .mjs, include them in files with a pattern in the format of "**/*.extension". Any pattern will work except if it is * or if it ends with /* or /**. For example, to lint TypeScript files with .ts, .cts and .mts extensions, you would specify a configuration object like this:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.ts", "**/*.cts", "**.*.mts"],
	},
	// ...other config
]);










Specifying files without extension
Files without an extension can be matched with the pattern !(*.*). For example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/!(*.*)"],
	},
	// ...other config
]);










The above config lints files without extension besides the default .js, .cjs and .mjs extensions in all directories.
Tip
Filenames starting with a dot, such as .gitignore, are considered to have only an extension without a base name. In the case of .gitignore, the extension is gitignore, so the file matches the pattern "**/.gitignore" but not "**/*.gitignore".
Specifying files with an AND operation
Multiple patterns can be matched against the same file by using an array of strings inside of the files array. For example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: [["src/*", "**/.js"]],
	},
	// ...other config
]);










The pattern ["src/*", "**/.js"] matches when a file is both inside of the src directory and also ends with .js. This approach can be helpful when you’re dynamically calculating the value of the files array and want to avoid potential errors by trying to combine multiple glob patterns into a single string.
Excluding files with ignores
You can limit which files a configuration object applies to by specifying a combination of files and ignores patterns. For example, you may want certain rules to apply only to files in your src directory:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["src/**/*.js"],
		rules: {
			semi: "error",
		},
	},
]);












Here, only the JavaScript files in the src directory have the semi rule applied. If you run ESLint on files in another directory, this configuration object is skipped. By adding ignores, you can also remove some of the files in src from this configuration object:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["src/**/*.js"],
		ignores: ["**/*.config.js"],
		rules: {
			semi: "error",
		},
	},
]);













This configuration object matches all JavaScript files in the src directory except those that end with .config.js. You can also use negation patterns in ignores to exclude files from the ignore patterns, such as:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["src/**/*.js"],
		ignores: ["**/*.config.js", "!**/eslint.config.js"],
		rules: {
			semi: "error",
		},
	},
]);













Here, the configuration object excludes files ending with .config.js except for eslint.config.js. That file still has semi applied.
Non-global ignores patterns can only match file names. A pattern like "dir-to-exclude/" will not ignore anything. To ignore everything in a particular directory, a pattern like "dir-to-exclude/**" should be used instead.
If ignores is used without files and there are other keys (such as rules), then the configuration object applies to all linted files except the ones excluded by ignores, for example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		ignores: ["**/*.config.js"],
		rules: {
			semi: "error",
		},
	},
]);












This configuration object applies to all JavaScript files except those ending with .config.js. Effectively, this is like having files set to **/*. In general, it’s a good idea to always include files if you are specifying ignores.
Note that when files is not specified, negated ignores patterns do not cause any matching files to be linted automatically. ESLint only lints files that are matched either by default or by a files pattern that is not * and does not end with /* or /**.
Tip
Use the config inspector (--inspect-config in the CLI) to test which config objects apply to a specific file.
Globally ignoring files with ignores
Depending on how the ignores property is used, it can behave as non-global ignores or as global ignores.
When ignores is used without any other keys (besides name) in the configuration object, then the patterns act as global ignores. This means they apply to every configuration object (not only to the configuration object in which it is defined). Global ignores allows you not to have to copy and keep the ignores property synchronized in more than one configuration object.
If ignores is used with other properties in the same configuration object, then the patterns act as non-global ignores. This way ignores applies only to the configuration object in which it is defined.
Global and non-global ignores have some usage differences:
patterns in non-global ignores only match the files (dir/filename.js) or files within directories (dir/**)
patterns in global ignores can match directories (dir/) in addition to the patterns that non-global ignores supports.
For all uses of ignores:
The patterns you define are added after the default ESLint patterns, which are ["**/node_modules/", ".git/"].
The patterns always match files and directories that begin with a dot, such as .foo.js or .fixtures, unless those files are explicitly ignored. The only dot directory ignored by default is .git.
// eslint.config.js
import { defineConfig } from "eslint/config";

// Example of global ignores
export default defineConfig([
    {
      ignores: [".config/", "dist/", "tsconfig.json"] // acts as global ignores, due to the absence of other properties
    },
    { ... }, // ... other configuration object, inherit global ignores
    { ... }, // ... other configuration object, inherit global ignores
]);

// Example of non-global ignores
export default defineConfig([
    {
      ignores: [".config/**", "dir1/script1.js"],
      rules: { ... } // the presence of this property dictates non-global ignores
    },
    {
      ignores: ["other-dir/**", "dist/script2.js"],
      rules: { ... } // the presence of this property dictates non-global ignores
    },
]);
























To avoid confusion, use the globalIgnores() helper function to clearly indicate which ignores are meant to be global. Here’s the previous example rewritten to use globalIgnores():
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

// Example of global ignores
export default defineConfig([
    globalIgnores([".config/", "dist/", "tsconfig.json"]),
    { ... }, // ... other configuration object, inherit global ignores
    { ... }, // ... other configuration object, inherit global ignores
]);

// Example of non-global ignores
export default defineConfig([
    {
      ignores: [".config/**", "dir1/script1.js"],
      rules: { ... } // the presence of this property dictates non-global ignores
    },
    {
      ignores: ["other-dir/**", "dist/script2.js"],
      rules: { ... } // the presence of this property dictates non-global ignores
    },
]);






















For more information and examples on configuring rules regarding ignores, see Ignore Files.
Specifying base path
You can optionally specify basePath to apply the configuration object to a specific subdirectory (including its subdirectories).
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	// matches all files in tests and its subdirectories
	{
		basePath: "tests",
		rules: {
			"no-undef": "error",
		},
	},

	// matches all files ending with spec.js in tests and its subdirectories
	{
		basePath: "tests",
		files: ["**/*.spec.js"],
		languageOptions: {
			globals: {
				it: "readonly",
				describe: "readonly",
			},
		},
	},

	// globally ignores tests/fixtures directory
	{
		basePath: "tests",
		ignores: ["fixtures/"],
	},
]);































In combination with extends, multiple configuration objects can be applied to the same subdirectory by specifying basePath only once, like this:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		basePath: "tests",
		extends: [
			// matches all files in tests and its subdirectories
			{
				rules: {
					"no-undef": "error",
				},
			},

			// matches all files ending with spec.js in tests and its subdirectories
			{
				files: ["**/*.spec.js"],
				languageOptions: {
					globals: {
						it: "readonly",
						describe: "readonly",
					},
				},
			},

			// globally ignores tests/fixtures directory
			{
				ignores: ["fixtures/"],
			},
		],
	},
]);

































Cascading Configuration Objects
When more than one configuration object matches a given filename, the configuration objects are merged with later objects overriding previous objects when there is a conflict. For example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		languageOptions: {
			globals: {
				MY_CUSTOM_GLOBAL: "readonly",
			},
		},
	},
	{
		files: ["tests/**/*.js"],
		languageOptions: {
			globals: {
				it: "readonly",
				describe: "readonly",
			},
		},
	},
]);























Using this configuration, all JavaScript files define a custom global object defined called MY_CUSTOM_GLOBAL while those JavaScript files in the tests directory have it and describe defined as global objects in addition to MY_CUSTOM_GLOBAL. For any JavaScript file in the tests directory, both configuration objects are applied, so languageOptions.globals are merged to create a final result.
Configuring Linter Options
Options specific to the linting process can be configured using the linterOptions object. These effect how linting proceeds and does not affect how the source code of the file is interpreted.
Disabling Inline Configuration
Inline configuration is implemented using an /*eslint*/ comment, such as /*eslint semi: error*/. You can disallow inline configuration by setting noInlineConfig to true. When enabled, all inline configuration is ignored. Here’s an example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		linterOptions: {
			noInlineConfig: true,
		},
	},
]);












Reporting Unused Disable Directives
Disable and enable directives such as /*eslint-disable*/, /*eslint-enable*/ and /*eslint-disable-next-line*/ are used to disable ESLint rules around certain portions of code. As code changes, it’s possible for these directives to no longer be needed because the code has changed in such a way that the rule is no longer triggered. You can enable reporting of these unused disable directives by setting the reportUnusedDisableDirectives option to a severity string, as in this example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		linterOptions: {
			reportUnusedDisableDirectives: "error",
		},
	},
]);












This setting defaults to "warn".
You can override this setting using the --report-unused-disable-directives or the --report-unused-disable-directives-severity command line options.
For legacy compatibility, true is equivalent to "warn" and false is equivalent to "off".
Reporting Unused Inline Configs
Inline config comments such as /* eslint rule-name: "error" */ are used to change ESLint rule severity and/or options around certain portions of code. As a project’s ESLint configuration file changes, it’s possible for these directives to no longer be different from what was already set. You can enable reporting of these unused inline config comments by setting the reportUnusedInlineConfigs option to a severity string, as in this example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		linterOptions: {
			reportUnusedInlineConfigs: "error",
		},
	},
]);












You can override this setting using the --report-unused-inline-configs command line option.
Configuring Rules
You can configure any number of rules in a configuration object by add a rules property containing an object with your rule configurations. The names in this object are the names of the rules and the values are the configurations for each of those rules. Here’s an example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			semi: "error",
		},
	},
]);











This configuration object specifies that the semi rule should be enabled with a severity of "error". You can also provide options to a rule by specifying an array where the first item is the severity and each item after that is an option for the rule. For example, you can switch the semi rule to disallow semicolons by passing "never" as an option:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			semi: ["error", "never"],
		},
	},
]);











Each rule specifies its own options and can be any valid JSON data type. Please check the documentation for the rule you want to configure for more information about its available options.
For more information on configuring rules, see Configure Rules.
Configuring Shared Settings
ESLint supports adding shared settings into configuration files. When you add a settings object to a configuration object, it is supplied to every rule. By convention, plugins namespace the settings they are interested in to avoid collisions with others. Plugins can use settings to specify the information that should be shared across all of their rules. This may be useful if you are adding custom rules and want them to have access to the same information. Here’s an example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		settings: {
			sharedData: "Hello",
		},
		plugins: {
			customPlugin: {
				rules: {
					"my-rule": {
						meta: {
							// custom rule's meta information
						},
						create(context) {
							const sharedData = context.settings.sharedData;
							return {
								// code
							};
						},
					},
				},
			},
		},
		rules: {
			"customPlugin/my-rule": "error",
		},
	},
]);































Extending Configurations
A configuration object uses extends to inherit all the traits of another configuration object or array (including rules, plugins, and language options) and can then modify all the options. The extends key is an array of values indicating which configurations to extend from. The elements of the extends array can be one of three values:
a string that specifies the name of a configuration in a plugin
a configuration object
a configuration array
Using Configurations from Plugins
ESLint plugins can export predefined configurations. These configurations are referenced using a string and follow the pattern pluginName/configName. The plugin must be specified in the plugins key first. Here’s an example:
// eslint.config.js
import examplePlugin from "eslint-plugin-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		plugins: {
			example: examplePlugin,
		},
		extends: ["example/recommended"],
	},
]);














In this example, the configuration named recommended from eslint-plugin-example is loaded. The plugin configurations can also be referenced by name inside of the configuration array.
You can also insert plugin configurations directly into the extends array. For example:
// eslint.config.js
import pluginExample from "eslint-plugin-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		plugins: {
			example: pluginExample,
		},
		extends: [pluginExample.configs.recommended],
	},
]);














In this case, the configuration named recommended from eslint-plugin-example is accessed directly through the plugin object’s configs property.
Important
It’s recommended to always use a files key when you use the extends key to ensure that your configuration applies to the correct files. By omitting the files key, the extended configuration may end up applied to all files.
Using Predefined Configurations
ESLint has two predefined configurations for JavaScript:
js/recommended - enables the rules that ESLint recommends everyone use to avoid potential errors.
js/all - enables all of the rules shipped with ESLint. This configuration is not recommended for production use because it changes with every minor and major version of ESLint. Use at your own risk.
To include these predefined configurations, install the @eslint/js package and then make any modifications to other properties in subsequent configuration objects:
// eslint.config.js
import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		plugins: {
			js,
		},
		extends: ["js/recommended"],
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);

















Here, the js/recommended predefined configuration is applied first and then another configuration object adds the desired configuration for no-unused-vars.
For more information on how to combine predefined configs with your preferences, please see Combine Configs.
Using a Shareable Configuration Package
A sharable configuration is an npm package that exports a configuration object or array. This package should be installed as a dependency in your project and then referenced from inside of your eslint.config.js file. For example, to use a shareable configuration named eslint-config-example, your configuration file would look like this:
// eslint.config.js
import exampleConfig from "eslint-config-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		extends: [exampleConfig],
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);














In this example, exampleConfig can be either an object or an array, and either way it can be inserted directly into the extends array.
For more information on how to combine shareable configs with your preferences, please see Combine Configs.
Configuration Naming Conventions
The name property is optional, but it is recommended to provide a name for each configuration object, especially when you are creating shared configurations. The name is used in error messages and the config inspector to help identify which configuration object is being used.
The name should be descriptive of the configuration object’s purpose and scoped with the configuration name or plugin name using / as a separator. ESLint does not enforce the names to be unique at runtime, but it is recommended that unique names be set to avoid confusion.
For example, if you are creating a configuration object for a plugin named eslint-plugin-example, you might add name to the configuration objects with the example/ prefix:
export default {
	configs: {
		recommended: {
			name: "example/recommended",
			rules: {
				"no-unused-vars": "warn",
			},
		},
		strict: {
			name: "example/strict",
			rules: {
				"no-unused-vars": "error",
			},
		},
	},
};

















When exposing arrays of configuration objects, the name may have extra scoping levels to help identify the configuration object. For example:
export default {
	configs: {
		strict: [
			{
				name: "example/strict/language-setup",
				languageOptions: {
					ecmaVersion: 2024,
				},
			},
			{
				name: "example/strict/sub-config",
				files: ["src/**/*.js"],
				rules: {
					"no-unused-vars": "error",
				},
			},
		],
	},
};




















Configuration File Resolution
When ESLint is run on the command line, it first checks the current working directory for eslint.config.js. If that file is found, then the search stops, otherwise it checks for eslint.config.mjs. If that file is found, then the search stops, otherwise it checks for eslint.config.cjs. If none of the files are found, it checks the parent directory for each file. This search continues until either a config file is found or the root directory is reached.
You can prevent this search for eslint.config.js by using the -c or --config option on the command line to specify an alternate configuration file, such as:
npmyarnpnpmbun
npx eslint --config some-other-file.js **/*.js 


In this case, ESLint does not search for eslint.config.js and instead uses some-other-file.js.
Experimental Configuration File Resolution
Warning
This feature is experimental and its details may change before being finalized. This behavior will be the new lookup behavior starting in v10.0.0, but you can try it today using a feature flag.
You can use the v10_config_lookup_from_file flag to change the way ESLint searches for configuration files. Instead of searching from the current working directory, ESLint will search for a configuration file by first starting in the directory of the file being linted and then searching up its ancestor directories until it finds a eslint.config.js file (or any other extension of configuration file). This behavior is better for monorepos, where each subdirectory may have its own configuration file.
To use this feature on the command line, use the --flag flag:
npx eslint --flag v10_config_lookup_from_file .


For more information about using feature flags, see Feature Flags.
TypeScript Configuration Files
For Deno and Bun, TypeScript configuration files are natively supported; for Node.js, you must install the optional dev dependency jiti in version 2.0.0 or later in your project (this dependency is not automatically installed by ESLint):
npmyarnpnpmbun
npm install --save-dev jiti


You can then create a configuration file with a .ts, .mts, or .cts extension, and export an array of configuration objects.
Important
ESLint does not perform type checking on your configuration file and does not apply any settings from tsconfig.json.
Native TypeScript Support
If you’re using Node.js >= 22.10.0, you can load TypeScript configuration files natively without requiring jiti. This is possible thanks to the --experimental-strip-types flag.
Since this feature is still experimental, you must also enable the unstable_native_nodejs_ts_config flag.
npx --node-options='--experimental-strip-types' eslint --flag unstable_native_nodejs_ts_config


Configuration File Precedence
If you have multiple ESLint configuration files, ESLint prioritizes JavaScript files over TypeScript files. The order of precedence is as follows:
eslint.config.js
eslint.config.mjs
eslint.config.cjs
eslint.config.ts
eslint.config.mts
eslint.config.cts
To override this behavior, use the --config or -c command line option to specify a different configuration file:
npmyarnpnpmbun
npx eslint --config eslint.config.ts 


Edit this page
Table of Contents
Configuration File
Configuration Objects
Specifying files and ignores
Specifying files with arbitrary extensions
Specifying files without extension
Specifying files with an AND operation
Excluding files with ignores
Globally ignoring files with ignores
Specifying base path
Cascading Configuration Objects
Configuring Linter Options
Disabling Inline Configuration
Reporting Unused Disable Directives
Reporting Unused Inline Configs
Configuring Rules
Configuring Shared Settings
Extending Configurations
Using Configurations from Plugins
Using Predefined Configurations
Using a Shareable Configuration Package
Configuration Naming Conventions
Configuration File Resolution
Experimental Configuration File Resolution
TypeScript Configuration Files
Native TypeScript Support
Configuration File Precedence
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Configure Language Options
Tip
This page explains how to configure language options using the flat config format. For the deprecated eslintrc format, see the deprecated documentation.
The JavaScript ecosystem has a variety of runtimes, versions, extensions, and frameworks. Each of these can have different supported syntax and global variables. ESLint lets you configure language options specific to the JavaScript used in your project, like custom global variables. You can also use plugins to extend ESLint to support your project’s language options.
Specifying JavaScript Options
ESLint allows you to specify the JavaScript language options you want to support. By default, ESLint expects the most recent stage 4 ECMAScript syntax and ECMAScript modules (ESM) mode. You can override these settings by using the languageOptions key and specifying one or more of these properties:
ecmaVersion (default: "latest") - Indicates the ECMAScript version of the code being linted, determining both the syntax and the available global variables. Set to 3 or 5 for ECMAScript 3 and 5, respectively. Otherwise, you can use any year between 2015 to present. In most cases, we recommend using the default of "latest" to ensure you’re always using the most recent ECMAScript version.
sourceType (default: "module") - Indicates the mode of the JavaScript file being used. Possible values are:
module - ESM module (invalid when ecmaVersion is 3 or 5). Your code has a module scope and is run in strict mode.
commonjs - CommonJS module (useful if your code uses require()). Your code has a top-level function scope and runs in non-strict mode.
script - non-module. Your code has a shared global scope and runs in non-strict mode.
Here’s an example configuration file you might use when linting ECMAScript 5 code:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			ecmaVersion: 5,
			sourceType: "script",
		},
	},
]);












Specifying Parser Options
If you are using the built-in ESLint parser, you can additionally change how ESLint interprets your code by specifying the languageOptions.parserOptions key. All options are false by default:
allowReserved - allow the use of reserved words as identifiers (if ecmaVersion is 3).
ecmaFeatures - an object indicating which additional language features you’d like to use:
globalReturn - allow return statements in the global scope.
impliedStrict - enable global strict mode (if ecmaVersion is 5 or greater).
jsx - enable JSX.
Here’s an example configuration file that enables JSX parsing in the default parser:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
	},
]);















Important
Please note that supporting JSX syntax is not the same as supporting React. React applies specific semantics to JSX syntax that ESLint doesn’t recognize. We recommend using eslint-plugin-react if you are using React.
Specifying Globals
Some of ESLint’s core rules rely on knowledge of the global variables available to your code at runtime. Since these can vary greatly between different environments as well as be modified at runtime, ESLint makes no assumptions about what global variables exist in your execution environment. If you would like to use rules that require knowledge of what global variables are available, you can define global variables in your configuration file or by using configuration comments in your source code.
Using configuration comments
To specify globals using a comment inside of your JavaScript file, use the following format:
/* global var1, var2 */


This defines two global variables, var1 and var2. If you want to optionally specify that these global variables can be written to (rather than only being read), then you can set each with a "writable" flag:
/* global var1:writable, var2:writable */


Using configuration files
To configure global variables inside of a configuration file, set the languageOptions.globals configuration property to an object containing keys named for each of the global variables you want to use. For each global variable key, set the corresponding value equal to "writable" to allow the variable to be overwritten or "readonly" to disallow overwriting. For example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			globals: {
				var1: "writable",
				var2: "readonly",
			},
		},
	},
]);














This configuration allows var1 to be overwritten in your code, but disallow it for var2.
Globals can be disabled by setting their value to "off". For example, in an environment where most globals are available but Promise is unavailable, you might use this config:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			globals: {
				Promise: "off",
			},
		},
	},
]);













Tip
For historical reasons, the boolean value false and the string value "readable" are equivalent to "readonly". Similarly, the boolean value true and the string value "writeable" are equivalent to "writable". However, the use of these older values is deprecated.
Predefined global variables
Apart from the ECMAScript standard built-in globals, which are automatically enabled based on the configured languageOptions.ecmaVersion, ESLint doesn’t provide predefined sets of global variables. You can use the globals package to additionally enable all globals for a specific environment. For example, here is how you can add console, amongst other browser globals, into your configuration.
// eslint.config.js
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
]);














You can include multiple different collections of globals in the same way. The following example includes globals both for web browsers and for Jest:
// eslint.config.js
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jest,
			},
		},
	},
]);

Configure Rules
Tip
This page explains how to configure rules using the flat config format. For the deprecated eslintrc format, see the deprecated documentation.
Rules are the core building block of ESLint. A rule validates if your code meets a certain expectation, and what to do if it does not meet that expectation. Rules can also contain additional configuration options specific to that rule.
ESLint comes with a large number of built-in rules and you can add more rules through plugins. You can modify which rules your project uses with either configuration comments or configuration files.
Rule Severities
To change a rule’s severity, set the rule ID equal to one of these values:
"off" or 0 - turn the rule off.
"warn" or 1 - turn the rule on as a warning (doesn’t affect exit code).
"error" or 2 - turn the rule on as an error (exit code is 1 when triggered).
Rules are typically set to "error" to enforce compliance with the rule during continuous integration testing, pre-commit checks, and pull request merging because doing so causes ESLint to exit with a non-zero exit code.
If you don’t want to enforce compliance with a rule but would still like ESLint to report the rule’s violations, set the severity to "warn". This is typically used when introducing a new rule that will eventually be set to "error", when a rule is flagging something other than a potential buildtime or runtime error (such as an unused variable), or when a rule cannot determine with certainty that a problem has been found (when a rule might have false positives and need manual review).
Using configuration comments
To configure rules inside of a file using configuration comments, use a comment in the following format:
/* eslint eqeqeq: "off", curly: "error" */


In this example, eqeqeq is turned off and curly is turned on as an error. You can also use the numeric equivalent for the rule severity:
/* eslint eqeqeq: 0, curly: 2 */


This example is the same as the last example, only it uses the numeric codes instead of the string values. The eqeqeq rule is off and the curly rule is set to be an error.
If a rule has additional options, you can specify them using array literal syntax, such as:
/* eslint quotes: ["error", "double"], curly: 2 */


This comment specifies the "double" option for the quotes rule. The first item in the array is always the rule severity (number or string).
Configuration Comment Descriptions
Configuration comments can include descriptions to explain why the comment is necessary. The description must occur after the configuration and is separated from the configuration by two or more consecutive - characters. For example:
/* eslint eqeqeq: "off", curly: "error" -- Here's a description about why this configuration is necessary. */


/* eslint eqeqeq: "off", curly: "error"
    --------
    Here's a description about why this configuration is necessary. */




/* eslint eqeqeq: "off", curly: "error"
 * --------
 * This will not work due to the line above starting with a '*' character.
 */





Report unused eslint inline config comments
To report unused eslint inline config comments (those that don’t change anything from what was already configured), use the reportUnusedInlineConfigs setting. For example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		linterOptions: {
			reportUnusedInlineConfigs: "error",
		},
	},
]);











This setting defaults to "off".
This setting is similar to the --report-unused-inline-configs CLI option.
Using Configuration Files
To configure rules inside of a configuration file, use the rules key along with an error level and any options you want to use. For example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			eqeqeq: "off",
			"no-unused-vars": "error",
			"prefer-const": ["error", { ignoreReadBeforeAssign: true }],
		},
	},
]);













When more than one configuration object specifies the same rule, the rule configuration is merged with the later object taking precedence over any previous objects. For example:
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			semi: ["error", "never"],
		},
	},
	{
		rules: {
			semi: ["warn", "always"],
		},
	},
]);















Using this configuration, the final rule configuration for semi is ["warn", "always"] because it appears last in the array. The array indicates that the configuration is for the severity and any options. You can change just the severity by defining only a string or number, as in this example:
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			semi: ["error", "never"],
		},
	},
	{
		rules: {
			semi: "warn",
		},
	},
]);















Here, the second configuration object only overrides the severity, so the final configuration for semi is ["warn", "never"].
Important
Rules configured via configuration comments have the highest priority and are applied after all configuration files settings.
Rules from Plugins
To configure a rule that is defined within a plugin, prefix the rule ID with the plugin namespace and /.
In a configuration file, for example:
// eslint.config.js
import example from "eslint-plugin-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		plugins: {
			example,
		},
		rules: {
			"example/rule1": "warn",
		},
	},
]);















In this configuration file, the rule example/rule1 comes from the plugin named eslint-plugin-example.
You can also use this format with configuration comments, such as:
/* eslint "example/rule1": "error" */


Important
In order to use plugin rules in configuration comments, your configuration file must load the plugin and specify it in the plugins object of your config. Configuration comments can not load plugins on their own.
Disabling Rules
Using configuration comments
Use with Caution. Disabling ESLint rules inline should be restricted and used only in situations with a clear and valid reason for doing so. Disabling rules inline should not be the default solution to resolve linting errors.
Document the Reason. Provide a comment explaining the reason for disabling a particular rule after the -- section of the comment. This documentation should clarify why the rule is being disabled and why it is necessary in that specific situation.
Temporary Solutions. If a disable comment is added as a temporary measure to address a pressing issue, create a follow-up task to address the underlying problem adequately. This ensures that the disable comment is revisited and resolved at a later stage.
Code Reviews and Pair Programming. Encourage team members to review each other’s code regularly. Code reviews can help identify the reasons behind disable comments and ensure that they are used appropriately.
Configurations. Whenever possible, prefer using ESLint configuration files over disable comments. Configuration files allow for consistent and project-wide rule handling.
To disable rule warnings in a part of a file, use block comments in the following format:
/* eslint-disable */

alert("foo");

/* eslint-enable */






You can also disable or enable warnings for specific rules:
/* eslint-disable no-alert, no-console */

alert("foo");
console.log("bar");

/* eslint-enable no-alert, no-console */







Warning
/* eslint-enable */ without any specific rules listed causes all disabled rules to be re-enabled.
To disable rule warnings in an entire file, put a /* eslint-disable */ block comment at the top of the file:
/* eslint-disable */

alert("foo");




You can also disable or enable specific rules for an entire file:
/* eslint-disable no-alert */

alert("foo");




To ensure that a rule is never applied (regardless of any future enable/disable lines):
/* eslint no-alert: "off" */

alert("foo");




To disable all rules on a specific line, use a line or block comment in one of the following formats:
alert("foo"); // eslint-disable-line

// eslint-disable-next-line
alert("foo");

/* eslint-disable-next-line */
alert("foo");

alert("foo"); /* eslint-disable-line */










To disable a specific rule on a specific line:
alert("foo"); // eslint-disable-line no-alert

// eslint-disable-next-line no-alert
alert("foo");

alert("foo"); /* eslint-disable-line no-alert */

/* eslint-disable-next-line no-alert */
alert("foo");










To disable multiple rules on a specific line:
alert("foo"); // eslint-disable-line no-alert, quotes, semi

// eslint-disable-next-line no-alert, quotes, semi
alert("foo");

alert("foo"); /* eslint-disable-line no-alert, quotes, semi */

/* eslint-disable-next-line no-alert, quotes, semi */
alert("foo");

/* eslint-disable-next-line
  no-alert,
  quotes,
  semi
*/
alert("foo");

















All of the above methods also work for plugin rules. For example, to disable eslint-plugin-example’s rule-name rule, combine the plugin’s name (example) and the rule’s name (rule-name) into example/rule-name:
foo(); // eslint-disable-line example/rule-name
foo(); /* eslint-disable-line example/rule-name */



Tip
Comments that disable warnings for a portion of a file tell ESLint not to report rule violations for the disabled code. ESLint still parses the entire file, however, so disabled code still needs to be syntactically valid JavaScript.
Comment descriptions
Configuration comments can include descriptions to explain why disabling or re-enabling the rule is necessary. The description must come after the configuration and needs to be separated from the configuration by two or more consecutive - characters. For example:
// eslint-disable-next-line no-console -- Here's a description about why this configuration is necessary.
console.log("hello");

/* eslint-disable-next-line no-console --
 * Here's a very long description about why this configuration is necessary
 * along with some additional information
 **/
console.log("hello");









Using configuration files
To disable rules inside of a configuration file for a group of files, use a subsequent config object with a files key. For example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			"no-unused-expressions": "error",
		},
	},
	{
		files: ["*-test.js", "*.spec.js"],
		rules: {
			"no-unused-expressions": "off",
		},
	},
]);

















Disabling Inline Comments
To disable all inline config comments, use the noInlineConfig setting in your configuration file. For example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		linterOptions: {
			noInlineConfig: true,
		},
		rules: {
			"no-unused-expressions": "error",
		},
	},
]);














You can also use the --no-inline-config CLI option to disable rule comments, in addition to other in-line configuration.
Report unused eslint-disable comments
To report unused eslint-disable comments (those that disable rules which would not report on the disabled line), use the reportUnusedDisableDirectives setting. For example:
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		linterOptions: {
			reportUnusedDisableDirectives: "error",
		},
	},
]);











This setting defaults to "warn".
This setting is similar to --report-unused-disable-directives and --report-unused-disable-directives-severity CLI options.
Edit this page
Table of Contents
Rule Severities
Using configuration comments
Configuration Comment Descriptions
Report unused eslint inline config comments
Using Configuration Files
Rules from Plugins
Disabling Rules
Using configuration comments
Comment descriptions
Using configuration files
Disabling Inline Comments
Report unused eslint-disable comments
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Configure Plugins
Tip
This page explains how to configure plugins using the flat config format. For the deprecated eslintrc format, see the deprecated documentation.
You can extend ESLint with plugins in a variety of different ways. Plugins can include:
Custom rules to validate if your code meets a certain expectation, and what to do if it does not meet that expectation.
Custom configurations. Please refer to the plugin’s documentation for details on how to use these configurations.
Custom processors to extract JavaScript code from other kinds of files or preprocess code before linting.
Configure Plugins
ESLint supports the use of third-party plugins. Plugins are simply objects that conform to a specific interface that ESLint recognizes.
To configure plugins inside of a configuration file, use the plugins key, which contains an object with properties representing plugin namespaces and values equal to the plugin object.
// eslint.config.js
import example from "eslint-plugin-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		plugins: {
			example,
		},
		rules: {
			"example/rule1": "warn",
		},
	},
]);















Tip
When creating a namespace for a plugin, the convention is to use the npm package name without the eslint-plugin- prefix. In the preceding example, eslint-plugin-example is assigned a namespace of example.
Configure a Local Plugin
Plugins don’t need to be published to npm for use with ESLint. You can also load plugins directly from a file, as in this example:
// eslint.config.js
import local from "./my-local-plugin.js";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		plugins: {
			local,
		},
		rules: {
			"local/rule1": "warn",
		},
	},
]);















Here, the namespace local is used, but you can also use any name you’d like instead.
Configure a Virtual Plugin
Plugin definitions can be created virtually directly in your config. For example, suppose you have a rule contained in a file called my-rule.js that you’d like to enable in your config. You can define a virtual plugin to do so, as in this example:
// eslint.config.js
import myRule from "./rules/my-rule.js";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		plugins: {
			local: {
				rules: {
					"my-rule": myRule,
				},
			},
		},
		rules: {
			"local/my-rule": "warn",
		},
	},
]);



















Here, the namespace local is used to define a virtual plugin. The rule myRule is then assigned a name of my-rule inside of the virtual plugin’s rules object. (See Create Plugins for the complete format of a plugin.) You can then reference the rule as local/my-rule to configure it.
Use Plugin Rules
You can use specific rules included in a plugin. To do this, specify the plugin in a configuration object using the plugins key. The value for the plugin key is an object where the name of the plugin is the property name and the value is the plugin object itself. Here’s an example:
// eslint.config.js
import jsdoc from "eslint-plugin-jsdoc";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		plugins: {
			jsdoc: jsdoc,
		},
		rules: {
			"jsdoc/require-description": "error",
			"jsdoc/check-values": "error",
		},
	},
]);

















In this configuration, the JSDoc plugin is defined to have the name jsdoc. The prefix jsdoc/ in each rule name indicates that the rule is coming from the plugin with that name rather than from ESLint itself.
Because the name of the plugin and the plugin object are both jsdoc, you can also shorten the configuration to this:
import jsdoc from "eslint-plugin-jsdoc";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		plugins: {
			jsdoc,
		},
		rules: {
			"jsdoc/require-description": "error",
			"jsdoc/check-values": "error",
		},
	},
]);
















While this is the most common convention, you don’t need to use the same name that the plugin prescribes. You can specify any prefix that you’d like, such as:
import jsdoc from "eslint-plugin-jsdoc";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		plugins: {
			jsd: jsdoc,
		},
		rules: {
			"jsd/require-description": "error",
			"jsd/check-values": "error",
		},
	},
]);
















This configuration object uses jsd as the prefix plugin instead of jsdoc.
Specify a Processor
Plugins may provide processors. Processors can extract JavaScript code from other kinds of files, then let ESLint lint the JavaScript code. Alternatively, processors can convert JavaScript code during preprocessing.
To specify processors in a configuration file, use the processor key and assign the name of processor in the format namespace/processor-name. For example, the following uses the processor from @eslint/markdown for *.md files.
// eslint.config.js
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.md"],
		plugins: {
			markdown,
		},
		processor: "markdown/markdown",
	},
]);














Processors may make named code blocks such as 0.js and 1.js. ESLint handles such a named code block as a child file of the original file. You can specify additional configurations for named code blocks with additional config objects. For example, the following disables the strict rule for the named code blocks which end with .js in markdown files.
// eslint.config.js
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";

export default defineConfig([
	// applies to all JavaScript files
	{
		rules: {
			strict: "error",
		},
	},

	// applies to Markdown files
	{
		files: ["**/*.md"],
		plugins: {
			markdown,
		},
		processor: "markdown/markdown",
	},

	// applies only to JavaScript blocks inside of Markdown files
	{
		files: ["**/*.md/*.js"],
		rules: {
			strict: "off",
		},
	},
]);






























ESLint only lints named code blocks when they are JavaScript files or if they match a files entry in a config object. Be sure to add a config object with a matching files entry if you want to lint non-JavaScript named code blocks. Also note that global ignores apply to named code blocks as well.
// eslint.config.js
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";

export default defineConfig([
	// applies to Markdown files
	{
		files: ["**/*.md"],
		plugins: {
			markdown,
		},
		processor: "markdown/markdown",
	},

	// applies to all .jsx files, including jsx blocks inside of Markdown files
	{
		files: ["**/*.jsx"],
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
	},

	// ignore jsx blocks inside of test.md files
	{
		ignores: ["**/test.md/*.jsx"],
	},
]);
































Specify a Language
Plugins may provide languages. Languages allow ESLint to lint programming languages besides JavaScript. To specify a language in a configuration file, use the language key and assign the name of language in the format namespace/language-name. For example, the following uses the json/jsonc language from @eslint/json for *.json files.
// eslint.config.js
import json from "@eslint/json";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.json"],
		plugins: {
			json,
		},
		language: "json/jsonc",
	},
]);














Tip
When you specify a language in a config object, languageOptions becomes specific to that language. Each language defines its own languageOptions, so check the documentation of the plugin to determine which options are available.
Common Problems
Plugin rules using the ESLint < v9.0.0 API
Plugin configurations have not been upgraded to flat config
Edit this page
Table of Contents
Configure Plugins
Configure a Local Plugin
Configure a Virtual Plugin
Use Plugin Rules
Specify a Processor
Specify a Language
Common Problems
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Configure a Parser
Tip
This page explains how to configure parsers using the flat config format. For the deprecated eslintrc format, see the deprecated documentation.
You can use custom parsers to convert JavaScript code into an abstract syntax tree for ESLint to evaluate. You might want to add a custom parser if your code isn’t compatible with ESLint’s default parser, Espree.
Configure a Custom Parser
In many cases, you can use the default parser that ESLint ships with for parsing your JavaScript code. You can optionally override the default parser by using the parser property. The parser property must be an object that conforms to the parser interface. For example, you can use the @babel/eslint-parser package to allow ESLint to parse experimental syntax:
// eslint.config.js
import babelParser from "@babel/eslint-parser";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js", "**/*.mjs"],
		languageOptions: {
			parser: babelParser,
		},
	},
]);













This configuration ensures that the Babel parser, rather than the default Espree parser, is used to parse all files ending with .js and .mjs.
The following third-party parsers are known to be compatible with ESLint:
Esprima
@babel/eslint-parser - A wrapper around the Babel parser that makes it compatible with ESLint.
@typescript-eslint/parser - A parser that converts TypeScript into an ESTree-compatible form so it can be used in ESLint.
Warning
There are no guarantees that an external parser works correctly with ESLint. ESLint does not fix bugs related to incompatibilities that affect only third-party parsers.
Configure Parser Options
Parsers may accept options to alter the way they behave. The languageOptions.parserOptions is used to pass options directly to parsers. These options are always parser-specific, so you’ll need to check the documentation of the parser you’re using for available options. Here’s an example of setting parser options for the Babel ESLint parser:
// eslint.config.js
import babelParser from "@babel/eslint-parser";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			parser: babelParser,
			parserOptions: {
				requireConfigFile: false,
				babelOptions: {
					babelrc: false,
					configFile: false,
					presets: ["@babel/preset-env"],
				},
			},
		},
	},
]);




















Tip
In addition to the options specified in languageOptions.parserOptions, ESLint also passes ecmaVersion and sourceType to all parsers. This allows custom parsers to understand the context in which ESLint is evaluating JavaScript code.
Edit this page
Table of Contents
Configure a Custom Parser
Configure Parser Options
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Combine Configs
In many cases, you won’t write an ESLint config file from scratch, but rather, you’ll use a combination of predefined and shareable configs along with your own overrides to create the config for your project. This page explains some of the patterns you can use to combine configs in your configuration file.
Apply a Config Object
If you are importing a config object from another module, in most cases, you can just pass the object directly to the defineConfig() helper. For example, you can use the recommended rule configurations for JavaScript by importing the recommended config and using it in your array:
// eslint.config.js
import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
	js.configs.recommended,
	{
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);













Here, the js.configs.recommended predefined configuration is applied first and then another configuration object adds the desired configuration for no-unused-vars.
Apply a Configuration to a Subset of Files
You can apply a config object to just a subset of files by creating a new object with a files key and using the extends key to merge in the rest of the properties from the config object. For example:
// eslint.config.js
import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/src/safe/*.js"],
		plugins: {
			js,
		},
		extends: ["js/recommended"],
	},
]);














Here, the js/recommended config object is applied only to files that match the pattern "**/src/safe/*.js".
Apply a Config Array
If you are importing a config array from another module, pass the array directly to the defineConfig() helper. Here’s an example:
// eslint.config.js
import exampleConfigs from "eslint-config-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	// insert array directly
	exampleConfigs,

	// your modifications
	{
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);
















Here, the exampleConfigs shareable configuration is applied first and then another configuration object adds the desired configuration for no-unused-vars. This is equivalent to inserting the individual elements of exampleConfigs in order, such as:
// eslint.config.js
import exampleConfigs from "eslint-config-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	// insert individual elements instead of an array
	exampleConfigs[0],
	exampleConfigs[1],
	exampleConfigs[2],

	// your modifications
	{
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);


















Apply a Config Array to a Subset of Files
You can apply a config array (an array of configuration objects) to just a subset of files by using the extends key. For example:
// eslint.config.js
import exampleConfigs from "eslint-config-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/src/safe/*.js"],
		extends: [exampleConfigs],
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);














Here, each config object in exampleConfigs is applied only to files that match the pattern "**/src/safe/*.js".
Edit this page
Table of Contents
Apply a Config Object
Apply a Configuration to a Subset of Files
Apply a Config Array
Apply a Config Array to a Subset of Files
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Ignore Files
Tip
This page explains how to ignore files using the flat config format. For the deprecated eslintrc format, see the deprecated documentation.
Tip
This page explains how to use the globalIgnores() function to completely ignore files and directories. For more information on non-global ignores, see Specifying files and ignores. For more information on the differences between global and non-global ignores, see Globally ignoring files with ignores.
You can configure ESLint to ignore certain files and directories while linting by specifying one or more glob patterns in the following ways:
Inside of your eslint.config.js file.
On the command line using --ignore-pattern.
Ignoring Files
In your eslint.config.js file, you can use the globalIgnores() helper function to indicate patterns of files to be ignored. Here’s an example:
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores([".config/*"])]);





This configuration specifies that all of the files in the .config directory should be ignored. This pattern is added after the default patterns, which are ["**/node_modules/", ".git/"].
You can also ignore files on the command line using --ignore-pattern, such as:
npmyarnpnpmbun
npx eslint . --ignore-pattern '.config/*' 


Ignoring Directories
Ignoring directories works the same way as ignoring files, by passing a pattern to the globalIgnores() helper function. For example, the following ignores the .config directory as a whole (meaning file search will not traverse into it at all):
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores([".config/"])]);





Unlike .gitignore, an ignore pattern like .config will only ignore the .config directory in the same directory as the configuration file. If you want to recursively ignore all directories named .config, you need to use **/.config/, as in this example:
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores(["**/.config/"])]);





Unignoring Files and Directories
You can also unignore files and directories that are ignored by previous patterns, including the default patterns. For example, this config unignores node_modules/mylibrary:
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores([
		"!node_modules/", // unignore `node_modules/` directory
		"node_modules/*", // ignore its content
		"!node_modules/mylibrary/", // unignore `node_modules/mylibrary` directory
	]),
]);











If you’d like to ignore a directory except for specific files or subdirectories, then the ignore pattern directory/**/* must be used instead of directory/**. The pattern directory/** ignores the entire directory and its contents, so traversal will skip over the directory completely and you cannot unignore anything inside.
For example, build/** ignores directory build and its contents, whereas build/**/* ignores only its contents. If you’d like to ignore everything in the build directory except for build/test.js, you’d need to create a config like this:
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores([
		"build/**/*", // ignore all contents in and under `build/` directory but not the `build/` directory itself
		"!build/test.js", // unignore `!build/test.js`
	]),
]);










If you’d like to ignore a directory except for specific files at any level under the directory, you should also ensure that subdirectories are not ignored. Note that while patterns that end with / only match directories, patterns that don’t end with / match both files and directories so it isn’t possible to write a single pattern that only ignores files, but you can achieve this with two patterns: one to ignore all contents and another to unignore subdirectories.
For example, this config ignores all files in and under build directory except for files named test.js at any level:
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores([
		"build/**/*", // ignore all contents in and under `build/` directory but not the `build/` directory itself
		"!build/**/*/", // unignore all subdirectories
		"!build/**/test.js", // unignore `test.js` files
	]),
]);











Important
Note that only global ignores patterns can match directories. ignores patterns that are specific to a configuration will only match file names.
You can also unignore files on the command line using --ignore-pattern, such as:
npmyarnpnpmbun
npx eslint . --ignore-pattern '!node_modules/' 


Glob Pattern Resolution
How glob patterns are evaluated depends on where they are located and how they are used:
When using globalIgnores() in an eslint.config.js file, glob patterns are evaluated relative to the eslint.config.js file.
When using globalIgnores() in an alternate configuration file specified using the --config command line option, glob patterns are evaluated relative to the current working directory.
When using --ignore-pattern, glob patterns are evaluated relative to the current working directory.
Name the Global Ignores Config
By default, globalIgnores() will assign a name to the config that represents your ignores. You can override this name by providing a second argument to globalIgnores(), which is the name you’d like to use instead of the default:
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["build/**/*"], "Ignore Build Directory"),
]);







The "Ignore Build Directory" string in this example is the name of the config created for the global ignores. This is useful for debugging purposes.
Ignored File Warnings
When you pass directories to the ESLint CLI, files and directories are silently ignored. If you pass a specific file to ESLint, then ESLint creates a warning that the file was skipped. For example, suppose you have an eslint.config.js file that looks like this:
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores(["foo.js"])]);





And then you run:
npmyarnpnpmbun
npx eslint foo.js 


You’ll see this warning:
foo.js
  0:0  warning  File ignored because of a matching ignore pattern. Use "--no-ignore" to disable file ignore settings or use "--no-warn-ignored" to suppress this warning.

✖ 1 problem (0 errors, 1 warning)





This message occurs because ESLint is unsure if you wanted to actually lint the file or not. As the message indicates, you can use --no-ignore to omit using the ignore rules.
Including .gitignore Files
If you want to include patterns from a .gitignore file or any other file with gitignore-style patterns, you can use includeIgnoreFile utility from the @eslint/compat package.
By default, includeIgnoreFile() will assign a name to the config that represents your ignores. You can override this name by providing a second argument to includeIgnoreFile(), which is the name you’d like to use instead of the default:
// eslint.config.js
import { defineConfig } from "eslint/config";
import { includeIgnoreFile } from "@eslint/compat";
import { fileURLToPath } from "node:url";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
	includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
	{
		// your overrides
	},
]);














This automatically loads the specified file and translates gitignore-style patterns into ignores glob patterns.
Edit this page
Table of Contents
Ignoring Files
Ignoring Directories
Unignoring Files and Directories
Glob Pattern Resolution
Name the Global Ignores Config
Ignored File Warnings
Including .gitignore Files
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Debug Your Configuration
ESLint creates a configuration for each file that is linted based on your configuration file and command line options. The larger the configuration file, the more difficult it can be to determine why a file isn’t linted as expected. To aid in debugging your configuration, ESLint provides several tools.
Run the CLI in Debug Mode
Use When: You aren’t sure if the correct configuration file is being read. This may happen if you have multiple configuration files in the same project.
What To Do: Run ESLint with the --debug command line flag and pass the file to check, like this:
npmyarnpnpmbun
npx eslint --debug file.js 


This outputs all of ESLint’s debugging information onto the console. You should copy this output to a file and then search for eslint.config.js to see which file is loaded. Here’s some example output:
eslint:eslint Using file patterns: bin/eslint.js +0ms
eslint:eslint Searching for eslint.config.js +0ms
eslint:eslint Loading config from C:\Users\nzakas\projects\eslint\eslint\eslint.config.js +5ms
eslint:eslint Config file URL is file:///C:/Users/nzakas/projects/eslint/eslint/eslint.config.js +0ms





Print a File’s Calculated Configuration
Use When: You aren’t sure why linting isn’t producing the expected results, either because it seems like your rule configuration isn’t being honored or the wrong language options are being used.
What To Do: Run ESLint with the --print-config command line flag and pass the file to check, like this:
npmyarnpnpmbun
npx eslint --print-config file.js 


This outputs a JSON representation of the file’s calculated config, such as:
{
	"linterOptions": {
		"reportUnusedDisableDirectives": 1
	},
	"language": "@/js",
	"languageOptions": {
		"sourceType": "module",
		"ecmaVersion": "latest"
	},
	"plugins": ["@"],
	"rules": {
		"prefer-const": 2
	}
}















Tip
You won’t see any entries for files, ignores, or name, because those are only used in calculating the final configuration and so do not appear in the result. You will see any default configuration applied by ESLint itself.
Use the Config Inspector
Use When: You aren’t sure if certain configuration objects in your configuration file match a given filename.
What To Do: Run ESLint with the --inspect-config command line flag and pass the file to check, like this:
npmyarnpnpmbun
npx eslint --inspect-config 


This initiates the config inspector by installing and starting @eslint/config-inspector. You can then type in the filename in question to see which configuration objects will apply.

The config inspector also shows you when rules are deprecated, how many available rules you’re using, and more.
Edit this page
Table of Contents
Run the CLI in Debug Mode
Print a File’s Calculated Configuration
Use the Config Inspector
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Configuration Migration Guide
This guide provides an overview of how you can migrate your ESLint configuration file from the eslintrc format (typically configured in .eslintrc.js or .eslintrc.json files) to the new flat config format (typically configured in an eslint.config.js file).
To learn more about the flat config format, refer to this blog post.
For reference information on these configuration formats, refer to the following documentation:
eslintrc configuration files
flat configuration files
Migrate Your Config File
To get started, use the configuration migrator on your existing configuration file (.eslintrc, .eslintrc.json, .eslintrc.yml), like this:
npmyarnpnpmbun
npx @eslint/migrate-config .eslintrc.json 


This will create a starting point for your eslint.config.js file but is not guaranteed to work immediately without further modification. It will, however, do most of the conversion work mentioned in this guide automatically.
Important
The configuration migrator doesn’t yet work well for .eslintrc.js files. If you are using .eslintrc.js, the migration results in a config file that matches the evaluated output of your configuration and won’t include any functions, conditionals, or anything other than the raw data represented in your configuration.
Start Using Flat Config Files
The flat config file format has been the default configuration file format since ESLint v9.0.0. You can start using the flat config file format without any additional configuration.
To use flat config with ESLint v8, place a eslint.config.js file in the root of your project or set the ESLINT_USE_FLAT_CONFIG environment variable to true.
Things That Haven’t Changed between Configuration File Formats
While the configuration file format has changed from eslintrc to flat config, the following has stayed the same:
Syntax for configuring rules.
Syntax for configuring processors.
The CLI, except for the flag changes noted in CLI Flag Changes.
Global variables are configured the same way, but on a different property (see Configuring Language Options).
Key Differences between Configuration Formats
A few of the most notable differences between the eslintrc and flat config formats are the following:
Importing Plugins and Custom Parsers
Eslintrc files use string-based import system inside the plugins property to load plugins and inside the extends property to load external configurations.
Flat config files represent plugins and parsers as JavaScript objects. This means you can use CommonJS require() or ES module import statements to load plugins and custom parsers from external files.
For example, this eslintrc config file loads eslint-plugin-jsdoc and configures rules from that plugin:
// .eslintrc.js

module.exports = {
	// ...other config
	plugins: ["jsdoc"],
	rules: {
		"jsdoc/require-description": "error",
		"jsdoc/check-values": "error",
	},
	// ...other config
};












In flat config, you would do the same thing like this:
// eslint.config.js

import jsdoc from "eslint-plugin-jsdoc";

export default [
	{
		files: ["**/*.js"],
		plugins: {
			jsdoc: jsdoc,
		},
		rules: {
			"jsdoc/require-description": "error",
			"jsdoc/check-values": "error",
		},
	},
];

















Tip
If you import a plugin and get an error such as “TypeError: context.getScope is not a function”, then that means the plugin has not yet been updated to the ESLint v9.x rule API. While you should file an issue with the particular plugin, you can manually patch the plugin to work in ESLint v9.x using the compatibility utilities.
Custom Parsers
In eslintrc files, importing a custom parser is similar to importing a plugin: you use a string to specify the name of the parser.
In flat config files, import a custom parser as a module, then assign it to the languageOptions.parser property of a configuration object.
For example, this eslintrc config file uses the @babel/eslint-parser parser:
// .eslintrc.js

module.exports = {
	// ...other config
	parser: "@babel/eslint-parser",
	// ...other config
};








In flat config, you would do the same thing like this:
// eslint.config.js

import babelParser from "@babel/eslint-parser";

export default [
	{
		// ...other config
		languageOptions: {
			parser: babelParser,
		},
		// ...other config
	},
];














Processors
In eslintrc files, processors had to be defined in a plugin, and then referenced by name in the configuration. Processors beginning with a dot indicated a file extension-named processor which ESLint would automatically configure for that file extension.
In flat config files, processors can still be referenced from plugins by their name, but they can now also be inserted directly into the configuration. Processors will never be automatically configured, and must be explicitly set in the configuration.
As an example with a custom plugin with processors:
// node_modules/eslint-plugin-someplugin/index.js
module.exports = {
	processors: {
		".md": {
			preprocess() {},
			postprocess() {},
		},
		someProcessor: {
			preprocess() {},
			postprocess() {},
		},
	},
};














In eslintrc, you would configure as follows:
// .eslintrc.js
module.exports = {
	plugins: ["someplugin"],
	processor: "someplugin/someProcessor",
};






ESLint would also automatically add the equivalent of the following:
{
	overrides: [
		{
			files: ["**/*.md"],
			processor: "someplugin/.md",
		},
	];
}









In flat config, the following are all valid ways to express the same:
// eslint.config.js
import somePlugin from "eslint-plugin-someplugin";

export default [
	{
		plugins: { somePlugin },
		processor: "somePlugin/someProcessor",
	},
	{
		plugins: { somePlugin },
		// We can embed the processor object in the config directly
		processor: somePlugin.processors.someProcessor,
	},
	{
		// We don't need the plugin to be present in the config to use the processor directly
		processor: somePlugin.processors.someProcessor,
	},
];



















Note that because the .md processor is not automatically added by flat config, you also need to specify an extra configuration element:
{
    files: ["**/*.md"],
    processor: somePlugin.processors[".md"]
}





Glob-Based Configs
By default, eslintrc files lint all files (except those covered by .eslintignore) in the directory in which they’re placed and its child directories. If you want to have different configurations for different file glob patterns, you can specify them in the overrides property.
By default, flat config files support different glob pattern-based configs in exported array. You can include the glob pattern in a config object’s files property. If you don’t specify a files property, the config defaults to the glob pattern "**/*.{js,mjs,cjs}". Basically, all configuration in the flat config file is like the eslintrc overrides property.
eslintrc Examples
For example, this eslintrc file applies to all files in the directory where it is placed and its child directories:
// .eslintrc.js

module.exports = {
	// ...other config
	rules: {
		semi: ["warn", "always"],
	},
};









This eslintrc file supports multiple configs with overrides:
// .eslintrc.js

module.exports = {
	// ...other config
	overrides: [
		{
			files: ["src/**/*"],
			rules: {
				semi: ["warn", "always"],
			},
		},
		{
			files: ["test/**/*"],
			rules: {
				"no-console": "off",
			},
		},
	],
};




















For flat config, here is a configuration with the default glob pattern:
// eslint.config.js

import js from "@eslint/js";

export default [
	js.configs.recommended, // Recommended config applied to all files
	// Override the recommended config
	{
		rules: {
			indent: ["error", 2],
			"no-unused-vars": "warn",
		},
		// ...other configuration
	},
];
















A flat config example configuration supporting multiple configs for different glob patterns:
// eslint.config.js

import js from "@eslint/js";

export default [
	js.configs.recommended, // Recommended config applied to all files
	// File-pattern specific overrides
	{
		files: ["src/**/*", "test/**/*"],
		rules: {
			semi: ["warn", "always"],
		},
	},
	{
		files: ["test/**/*"],
		rules: {
			"no-console": "off",
		},
	},
	// ...other configurations
];






















Configuring Language Options
In eslintrc files, you configure various language options across the env, globals and parserOptions properties. Groups of global variables for specific runtimes (e.g. document and window for browser JavaScript; process and require for Node.js) are configured with the env property.
In flat config files, the globals, and parserOptions are consolidated under the languageOptions key; the env property doesn’t exist. Groups of global variables for specific runtimes are imported from the globals npm package and included in the globals property. You can use the spread operator (...) to import multiple globals at once.
For example, here’s an eslintrc file with language options:
// .eslintrc.js

module.exports = {
	env: {
		browser: true,
		node: true,
	},
	globals: {
		myCustomGlobal: "readonly",
	},
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: "module",
	},
	// ...other config
};

















Here’s the same configuration in flat config:
// eslint.config.js

import globals from "globals";

export default [
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
				myCustomGlobal: "readonly",
			},
		},
		// ...other config
	},
];



















Tip
You’ll need to install the globals package from npm for this example to work. It is not automatically installed by ESLint.
eslint-env Configuration Comments
In the eslintrc config system it was possible to use eslint-env configuration comments to define globals for a file. These comments are no longer recognized when linting with flat config: in a future version of ESLint, eslint-env comments will be reported as errors. For this reason, when migrating from eslintrc to flat config, eslint-env configuration comments should be removed from all files. They can be either replaced with equivalent but more verbose global configuration comments, or dropped in favor of globals definitions in the config file.
For example, when using eslintrc, a file to be linted could look like this:
// tests/my-file.js

/* eslint-env mocha */

describe("unit tests", () => {
	it("should pass", () => {
		// ...
	});
});










In the above example, describe and it would be recognized as global identifiers because of the /* eslint-env mocha */ comment.
The same effect can be achieved with flat config with a global configuration comment, e.g.:
// tests/my-file.js

/* global describe, it -- Globals defined by Mocha */

describe("unit tests", () => {
	it("should pass", () => {
		// ...
	});
});










Another option is to remove the comment from the file being linted and define the globals in the configuration, for example:
// eslint.config.js

import globals from "globals";

export default [
	// ...other config
	{
		files: ["tests/**"],
		languageOptions: {
			globals: {
				...globals.mocha,
			},
		},
	},
];
















Predefined and Shareable Configs
In eslintrc files, use the extends property to use predefined and shareable configs. ESLint comes with two predefined configs that you can access as strings:
"eslint:recommended": the rules recommended by ESLint.
"eslint:all": all rules shipped with ESLint.
You can also use the extends property to extend a shareable config. Shareable configs can either be paths to local config files or npm package names.
In flat config files, predefined configs are imported from separate modules into flat config files. The recommended and all rules configs are located in the @eslint/js package. You must import this package to use these configs:
npmyarnpnpmbun
npm install --save-dev @eslint/js


You can add each of these configs to the exported array or expose specific rules from them. You must import the modules for local config files and npm package configs with flat config.
For example, here’s an eslintrc file using the built-in eslint:recommended config:
// .eslintrc.js

module.exports = {
	// ...other config
	extends: "eslint:recommended",
	rules: {
		semi: ["warn", "always"],
	},
	// ...other config
};











This eslintrc file uses built-in config, local custom config, and shareable config from an npm package:
// .eslintrc.js

module.exports = {
	// ...other config
	extends: [
		"eslint:recommended",
		"./custom-config.js",
		"eslint-config-my-config",
	],
	rules: {
		semi: ["warn", "always"],
	},
	// ...other config
};















To use the same configs in flat config, you would do the following:
// eslint.config.js

import js from "@eslint/js";
import customConfig from "./custom-config.js";
import myConfig from "eslint-config-my-config";

export default [
	js.configs.recommended,
	customConfig,
	myConfig,
	{
		rules: {
			semi: ["warn", "always"],
		},
		// ...other config
	},
];


















Note that because you are just importing JavaScript modules, you can mutate the config objects before ESLint uses them. For example, you might want to have a certain config object only apply to your test files:
// eslint.config.js

import js from "@eslint/js";
import customTestConfig from "./custom-test-config.js";

export default [
	js.configs.recommended,
	{
		...customTestConfig,
		files: ["**/*.test.js"],
	},
];













Using eslintrc Configs in Flat Config
You may find that there’s a shareable config you rely on that hasn’t yet been updated to flat config format. In that case, you can use the FlatCompat utility to translate the eslintrc format into flat config format. First, install the @eslint/eslintrc package:
npmyarnpnpmbun
npm install --save-dev @eslint/eslintrc


Then, import FlatCompat and create a new instance to convert an existing eslintrc config. For example, if the npm package eslint-config-my-config is in eslintrc format, you can write this:
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default [
	// mimic ESLintRC-style extends
	...compat.extends("eslint-config-my-config"),
];

















This example uses the FlatCompat#extends() method to insert the eslint-config-my-config into the flat config array.
For more information about the FlatCompat class, please see the package README.
Ignoring Files
With eslintrc, you can make ESLint ignore files by creating a separate .eslintignore file in the root of your project. The .eslintignore file uses the same glob pattern syntax as .gitignore files. Alternatively, you can use an ignorePatterns property in your eslintrc file.
To ignore files with flat config, you can use the ignores property in a config object with no other properties. The ignores property accepts an array of glob patterns. Flat config does not support loading ignore patterns from .eslintignore files, so you’ll need to migrate those patterns directly into flat config.
For example, here’s a .eslintignore example you can use with an eslintrc config:
# .eslintignore
temp.js
config/*
# ...other ignored files





Here are the same patterns represented as ignorePatterns in a .eslintrc.js file:
// .eslintrc.js
module.exports = {
	// ...other config
	ignorePatterns: ["temp.js", "config/*"],
};






The equivalent ignore patterns in flat config look like this:
export default [
	// ...other config
	{
		// Note: there should be no other properties in this object
		ignores: ["**/temp.js", "config/*"],
	},
];








In .eslintignore, temp.js ignores all files named temp.js, whereas in flat config, you need to specify this as **/temp.js. The pattern temp.js in flat config only ignores a file named temp.js in the same directory as the configuration file.
Important
In flat config, dotfiles (e.g. .dotfile.js) are no longer ignored by default. If you want to ignore dotfiles, add an ignore pattern of "**/.*".
Linter Options
Eslintrc files let you configure the linter itself with the noInlineConfig and reportUnusedDisableDirectives properties.
The flat config system introduces a new top-level property linterOptions that you can use to configure the linter. In the linterOptions object, you can include noInlineConfig and reportUnusedDisableDirectives.
For example, here’s an eslintrc file with linter options enabled:
// .eslintrc.js

module.exports = {
	// ...other config
	noInlineConfig: true,
	reportUnusedDisableDirectives: true,
};








Here’s the same options in flat config:
// eslint.config.js

export default [
	{
		// ...other config
		linterOptions: {
			noInlineConfig: true,
			reportUnusedDisableDirectives: "warn",
		},
	},
];












CLI Flag Changes
The following CLI flags are no longer supported with the flat config file format:
--rulesdir
--ext
--resolve-plugins-relative-to
The flag --no-eslintrc has been replaced with --no-config-lookup.
--rulesdir
The --rulesdir flag was used to load additional rules from a specified directory. This is no longer supported when using flat config. You can instead create a plugin containing the local rules you have directly in your config, like this:
// eslint.config.js
import myRule from "./rules/my-rule.js";

export default [
	{
		// define the plugin
		plugins: {
			local: {
				rules: {
					"my-rule": myRule,
				},
			},
		},

		// configure the rule
		rules: {
			"local/my-rule": ["error"],
		},
	},
];





















--ext
The --ext flag was used to specify additional file extensions ESLint should search for when a directory was passed on the command line, such as npx eslint .. This is no longer supported when using flat config. Instead, specify the file patterns you’d like ESLint to search for directly in your config. For example, if you previously were using --ext .ts,.tsx, then you will need to update your config file like this:
// eslint.config.js
export default [
	{
		files: ["**/*.ts", "**/*.tsx"],

		// any additional configuration for these file types here
	},
];









ESLint uses the files keys from the config file to determine which files should be linted.
--resolve-plugins-relative-to
The --resolve-plugins-relative-to flag was used to indicate which directory plugin references in your configuration file should be resolved relative to. This was necessary because shareable configs could only resolve plugins that were peer dependencies or dependencies of parent packages.
With flat config, shareable configs can specify their dependencies directly, so this flag is no longer needed.
package.json Configuration No Longer Supported
With eslintrc, it was possible to use a package.json file to configure ESLint using the eslintConfig key.
With flat config, it’s no longer possible to use a package.json file to configure ESLint. You’ll need to move your configuration into a separate file.
Additional Changes
The following changes have been made from the eslintrc to the flat config file format:
The root option no longer exists. (Flat config files act as if root: true is set.)
The files option cannot be a single string anymore, it must be an array.
The sourceType option now supports the new value "commonjs" (.eslintrc supports it too, but it was never documented).
TypeScript Types for Flat Config Files
You can see the TypeScript types for the flat config file format in the lib/types source folder on GitHub. The interface for the objects in the config’s array is called Linter.Config.
You can view the type definitions in lib/types/index.d.ts.
Visual Studio Code Support
ESLint v9.x support was added in the vscode-eslint v3.0.10.
In versions of vscode-eslint prior to v3.0.10, the new configuration system is not enabled by default. To enable support for the new configuration files, edit your .vscode/settings.json file and add the following:
{
	// required in vscode-eslint < v3.0.10 only
	"eslint.experimental.useFlatConfig": true
}





In a future version of the ESLint plugin, you will no longer need to enable this manually.
Further Reading
Overview of the flat config file format blog post
API usage of new configuration system blog post
Background to new configuration system blog post
Edit this page
Table of Contents
Migrate Your Config File
Start Using Flat Config Files
Things That Haven’t Changed between Configuration File Formats
Key Differences between Configuration Formats
Importing Plugins and Custom Parsers
Custom Parsers
Processors
Glob-Based Configs
eslintrc Examples
Configuring Language Options
eslint-env Configuration Comments
Predefined and Shareable Configs
Using eslintrc Configs in Flat Config
Ignoring Files
Linter Options
CLI Flag Changes
--rulesdir
--ext
--resolve-plugins-relative-to
package.json Configuration No Longer Supported
Additional Changes
TypeScript Types for Flat Config Files
Visual Studio Code Support
Further Reading
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Command Line Interface Reference
The ESLint Command Line Interface (CLI) lets you execute linting from the terminal. The CLI has a variety of options that you can pass to configure ESLint.
Run the CLI
ESLint requires Node.js for installation. Follow the instructions in the Getting Started Guide to install ESLint.
Most users use npx to run ESLint on the command line like this:
npmyarnpnpmbun
npx eslint [options] [file|dir|glob]* 


Such as:
npmyarnpnpmbun
# Run on two files
npx eslint file1.js file2.js 



or
npmyarnpnpmbun
# Run on multiple files
npx eslint lib/** 



Please note that when passing a glob as a parameter, it is expanded by your shell. The results of the expansion can vary depending on your shell, and its configuration. If you want to use node glob syntax, you have to quote your parameter (using double quotes if you need it to run in Windows), as follows:
npmyarnpnpmbun
npx eslint "lib/**" 


If you are using a flat configuration file (eslint.config.js), you can also omit the file arguments and ESLint will use .. For instance, these two lines perform the same operation:
npmyarnpnpmbun
npx eslint . 


npmyarnpnpmbun
npx eslint 


If you are not using a flat configuration file, running ESLint without file arguments results in an error.
Note: You can also use alternative package managers such as Yarn or pnpm to run ESLint. For pnpm use pnpm dlx eslint and for Yarn use yarn dlx eslint.
Pass Multiple Values to an Option
Options that accept multiple values can be specified by repeating the option or with a comma-delimited list (other than --ignore-pattern, which does not allow the second style).
Examples of options that accept multiple values:
npmyarnpnpmbun
npx eslint --global describe --global it tests/ 


OR
npmyarnpnpmbun
npx eslint --global describe,it tests/ 


Options
You can view all the CLI options by running npx eslint -h.
eslint [options] file.js [file.js] [dir]

Basic configuration:
  --no-config-lookup              Disable look up for eslint.config.js
  -c, --config path::String       Use this configuration instead of eslint.config.js, eslint.config.mjs, or
                                  eslint.config.cjs
  --inspect-config                Open the config inspector with the current configuration
  --ext [String]                  Specify additional file extensions to lint
  --global [String]               Define global variables
  --parser String                 Specify the parser to be used
  --parser-options Object         Specify parser options

Specify Rules and Plugins:
  --plugin [String]               Specify plugins
  --rule Object                   Specify rules

Fix Problems:
  --fix                           Automatically fix problems
  --fix-dry-run                   Automatically fix problems without saving the changes to the file system
  --fix-type Array                Specify the types of fixes to apply (directive, problem, suggestion, layout)

Ignore Files:
  --no-ignore                     Disable use of ignore files and patterns
  --ignore-pattern [String]       Patterns of files to ignore

Use stdin:
  --stdin                         Lint code provided on <STDIN> - default: false
  --stdin-filename String         Specify filename to process STDIN as

Handle Warnings:
  --quiet                         Report errors only - default: false
  --max-warnings Int              Number of warnings to trigger nonzero exit code - default: -1

Output:
  -o, --output-file path::String  Specify file to write report to
  -f, --format String             Use a specific output format - default: stylish
  --color, --no-color             Force enabling/disabling of color

Inline configuration comments:
  --no-inline-config              Prevent comments from changing config or rules
  --report-unused-disable-directives  Adds reported errors for unused eslint-disable and eslint-enable directives
  --report-unused-disable-directives-severity String  Chooses severity level for reporting unused eslint-disable and
                                                      eslint-enable directives - either: off, warn, error, 0, 1, or 2
  --report-unused-inline-configs String  Adds reported errors for unused eslint inline config comments - either: off, warn, error, 0, 1, or 2

Caching:
  --cache                         Only check changed files - default: false
  --cache-file path::String       Path to the cache file. Deprecated: use --cache-location - default: .eslintcache
  --cache-location path::String   Path to the cache file or directory
  --cache-strategy String         Strategy to use for detecting changed files in the cache - either: metadata or
                                  content - default: metadata

Suppressing Violations:
  --suppress-all                  Suppress all violations - default: false
  --suppress-rule [String]        Suppress specific rules
  --suppressions-location path::String  Specify the location of the suppressions file
  --prune-suppressions            Prune unused suppressions - default: false
  --pass-on-unpruned-suppressions Ignore unused suppressions - default: false

Miscellaneous:
  --init                          Run config initialization wizard - default: false
  --env-info                      Output execution environment information - default: false
  --no-error-on-unmatched-pattern  Prevent errors when pattern is unmatched
  --exit-on-fatal-error           Exit with exit code 2 in case of fatal error - default: false
  --no-warn-ignored               Suppress warnings when the file list includes ignored files
  --pass-on-no-patterns           Exit with exit code 0 in case no file patterns are passed
  --debug                         Output debugging information
  -h, --help                      Show help
  -v, --version                   Output the version number
  --print-config path::String     Print the configuration for the given file
  --stats                         Add statistics to the lint report - default: false
  --flag [String]                 Enable a feature flag
  --mcp                           Start the ESLint MCP server










































































Basic Configuration
--no-eslintrc
eslintrc Mode Only. Disables use of configuration from .eslintrc.* and package.json files. For flat config mode, use --no-config-lookup instead.
Argument Type: No argument.
--no-eslintrc example
npmyarnpnpmbun
npx eslint --no-eslintrc file.js 


-c, --config
This option allows you to specify an additional configuration file for ESLint (see Configure ESLint for more).
Argument Type: String. Path to file.
Multiple Arguments: No
-c, --config example
npmyarnpnpmbun
npx eslint -c ~/my.eslint.config.js file.js 


This example uses the configuration file at ~/my.eslint.config.js, which is used instead of searching for an eslint.config.js file.
--inspect-config
Flat Config Mode Only. This option runs npx @eslint/config-inspector@latest to start the config inspector. You can use the config inspector to better understand what your configuration is doing and which files it applies to. When you use this flag, the CLI does not perform linting.
Argument Type: No argument.
--inspect-config example
npmyarnpnpmbun
npx eslint --inspect-config 


--env
eslintrc Mode Only. This option enables specific environments.
Argument Type: String. One of the available environments.
Multiple Arguments: Yes
Details about the global variables defined by each environment are available in the Specifying Environments documentation. This option only enables environments. It does not disable environments set in other configuration files. To specify multiple environments, separate them using commas, or use the option multiple times.
--env example
npmyarnpnpmbun
npx eslint --env browser,node file.js 


npmyarnpnpmbun
npx eslint --env browser --env node file.js 


--ext
This option allows you to specify additional file extensions to lint.
Argument Type: String. File extension.
Multiple Arguments: Yes
Default Value: By default, ESLint lints files with extensions .js, .mjs, .cjs, and additional extensions specified in the configuration file.
This option is primarily intended for use in combination with the --no-config-lookup option, since in that case there is no configuration file in which the additional extensions would be specified.
--ext example
npmyarnpnpmbun
# Include .ts files
npx eslint . --ext .ts 



npmyarnpnpmbun
# Include .ts and .tsx files
npx eslint . --ext .ts --ext .tsx 



npmyarnpnpmbun
# Also include .ts and .tsx files
npx eslint . --ext .ts,.tsx 



--global
This option defines global variables so that they are not flagged as undefined by the no-undef rule.
Argument Type: String. Name of the global variable. Any specified global variables are assumed to be read-only by default, but appending :true to a variable’s name ensures that no-undef also allows writes.
Multiple Arguments: Yes
--global example
npmyarnpnpmbun
npx eslint --global require,exports:true file.js 


npmyarnpnpmbun
npx eslint --global require --global exports:true 


--parser
This option allows you to specify a parser to be used by ESLint.
Argument Type: String. Parser to be used by ESLint.
Multiple Arguments: No
Default Value: espree
--parser example
npmyarnpnpmbun
# Use TypeScript ESLint parser
npx eslint --parser @typescript-eslint/parser file.ts 



--parser-options
This option allows you to specify parser options to be used by ESLint. The available parser options are determined by the parser being used.
Argument Type: Key/value pair separated by colon (:).
Multiple Arguments: Yes
--parser-options example
npmyarnpnpmbun
# fails with a parsing error
echo '3 ** 4' | npx eslint --stdin --parser-options ecmaVersion:6 



npmyarnpnpmbun
# succeeds, yay!
echo '3 ** 4' | npx eslint --stdin --parser-options ecmaVersion:7 



--resolve-plugins-relative-to
eslintrc Mode Only. Changes the directory where plugins are resolved from.
Argument Type: String. Path to directory.
Multiple Arguments: No
Default Value: By default, plugins are resolved from the directory in which your configuration file is found.
This option should be used when plugins were installed by someone other than the end user. It should be set to the project directory of the project that has a dependency on the necessary plugins.
For example:
When using a config file that is located outside of the current project (with the --config flag), if the config uses plugins which are installed locally to itself, --resolve-plugins-relative-to should be set to the directory containing the config file.
If an integration has dependencies on ESLint and a set of plugins, and the tool invokes ESLint on behalf of the user with a preset configuration, the tool should set --resolve-plugins-relative-to to the top-level directory of the tool.
--resolve-plugins-relative-to example
npmyarnpnpmbun
npx eslint --config ~/personal-eslintrc.js --resolve-plugins-relative-to /usr/local/lib/ 


Specify Rules and Plugins
--plugin
This option specifies a plugin to load.
Argument Type: String. Plugin name. You can optionally omit the prefix eslint-plugin- from the plugin name.
Multiple Arguments: Yes
Before using the plugin, you have to install it using npm.
--plugin example
npmyarnpnpmbun
npx eslint --plugin jquery file.js 


npmyarnpnpmbun
npx eslint --plugin eslint-plugin-mocha file.js 


--rule
This option specifies the rules to be used.
Argument Type: Rules and their configuration specified with levn format.
Multiple Arguments: Yes
These rules are merged with any rules specified with configuration files. If the rule is defined in a plugin, you have to prefix the rule ID with the plugin name and a /.
To ignore rules in .eslintrc configuration files and only run rules specified in the command line, use the --rule flag in combination with the --no-eslintrc flag.
--rule example
npmyarnpnpmbun
# Apply single rule
npx eslint --rule 'quotes: [error, double]' 



npmyarnpnpmbun
# Apply multiple rules
npx eslint --rule 'guard-for-in: error' --rule 'brace-style: [error, 1tbs]' 



npmyarnpnpmbun
# Apply rule from jquery plugin
npx eslint --rule 'jquery/dollar-sign: error' 



npmyarnpnpmbun
# Only apply rule from the command line
npx eslint --rule 'quotes: [error, double]' --no-eslintrc 



--rulesdir
Deprecated: Use rules from plugins instead.
eslintrc Mode Only. This option allows you to specify another directory from which to load rules files. This allows you to dynamically load new rules at run time. This is useful when you have custom rules that aren’t suitable for being bundled with ESLint.
Argument Type: String. Path to directory. The rules in your custom rules directory must follow the same format as bundled rules to work properly.
Multiple Arguments: Yes
Note that, as with core rules and plugin rules, you still need to enable the rules in configuration or via the --rule CLI option in order to actually run those rules during linting. Specifying a rules directory with --rulesdir does not automatically enable the rules within that directory.
--rulesdir example
npmyarnpnpmbun
npx eslint --rulesdir my-rules/ file.js 


npmyarnpnpmbun
npx eslint --rulesdir my-rules/ --rulesdir my-other-rules/ file.js 


Fix Problems
--fix
This option instructs ESLint to try to fix as many issues as possible. The fixes are made to the actual files themselves and only the remaining unfixed issues are output.
Argument Type: No argument.
Not all problems are fixable using this option, and the option does not work in these situations:
This option throws an error when code is piped to ESLint.
This option has no effect on code that uses a processor, unless the processor opts into allowing autofixes.
If you want to fix code from stdin or otherwise want to get the fixes without actually writing them to the file, use the --fix-dry-run option.
--fix example
npmyarnpnpmbun
npx eslint --fix file.js 


--fix-dry-run
This option has the same effect as --fix with the difference that the fixes are not saved to the file system. Because the default formatter does not output the fixed code, you’ll have to use another formatter (e.g. --format json) to get the fixes.
Argument Type: No argument.
This makes it possible to fix code from stdin when used with the --stdin flag.
This flag can be useful for integrations (e.g. editor plugins) which need to autofix text from the command line without saving it to the filesystem.
--fix-dry-run example
npmyarnpnpmbun
getSomeText | npx eslint --stdin --fix-dry-run --format json 


--fix-type
This option allows you to specify the type of fixes to apply when using either --fix or --fix-dry-run.
Argument Type: String. One of the following fix types:
problem - fix potential errors in the code
suggestion - apply fixes to the code that improve it
layout - apply fixes that do not change the program structure (AST)
directive - apply fixes to inline directives such as // eslint-disable
Multiple Arguments: Yes
This option is helpful if you are using another program to format your code, but you would still like ESLint to apply other types of fixes.
--fix-type example
npmyarnpnpmbun
npx eslint --fix --fix-type suggestion . 


npmyarnpnpmbun
npx eslint --fix --fix-type suggestion --fix-type problem . 


npmyarnpnpmbun
npx eslint --fix --fix-type suggestion,layout . 


Ignore Files
--ignore-path
eslintrc Mode Only. This option allows you to specify the file to use as your .eslintignore.
Argument Type: String. Path to file.
Multiple Arguments: No
Default Value: By default, ESLint looks for .eslintignore in the current working directory.
Note: --ignore-path is only supported when using deprecated configuration. If you want to include patterns from a .gitignore file in your eslint.config.js file, please see including .gitignore files.
--ignore-path example
npmyarnpnpmbun
npx eslint --ignore-path tmp/.eslintignore file.js 


npmyarnpnpmbun
npx eslint --ignore-path .gitignore file.js 


--no-ignore
Disables excluding of files from .eslintignore files, --ignore-path flags, --ignore-pattern flags, and the ignorePatterns property in config files.
Argument Type: No argument.
--no-ignore example
npmyarnpnpmbun
npx eslint --no-ignore file.js 


--ignore-pattern
This option allows you to specify patterns of files to ignore. In eslintrc mode, these are in addition to .eslintignore.
Argument Type: String. The supported syntax is the same as for .eslintignore files, which use the same patterns as the .gitignore specification. You should quote your patterns in order to avoid shell interpretation of glob patterns.
Multiple Arguments: Yes
--ignore-pattern example
npmyarnpnpmbun
npx eslint --ignore-pattern "/lib/" --ignore-pattern "/src/vendor/*" . 


Use stdin
--stdin
This option tells ESLint to read and lint source code from STDIN instead of from files. You can use this to pipe code to ESLint.
Argument Type: No argument.
--stdin example
npmyarnpnpmbun
cat myFile.js | npx eslint --stdin 


--stdin-filename
This option allows you to specify a filename to process STDIN as.
Argument Type: String. Path to file.
Multiple Arguments: No
This is useful when processing files from STDIN and you have rules which depend on the filename.
--stdin-filename example
npmyarnpnpmbun
cat myFile.js | npx eslint --stdin --stdin-filename myfile.js 


Handle Warnings
--quiet
This option allows you to disable reporting on warnings and running of rules set to warn. If you enable this option, only errors are reported by ESLint and only rules set to error will be run.
Argument Type: No argument.
--quiet example
npmyarnpnpmbun
npx eslint --quiet file.js 


--max-warnings
This option allows you to specify a warning threshold, which can be used to force ESLint to exit with an error status if there are too many warning-level rule violations in your project.
Argument Type: Integer. The maximum number of warnings to allow. To prevent this behavior, do not use this option or specify -1 as the argument.
Multiple Arguments: No
Normally, if ESLint runs and finds no errors (only warnings), it exits with a success exit status. However, if --max-warnings is specified and the total warning count is greater than the specified threshold, ESLint exits with an error status.
Important
When used alongside --quiet, this will cause rules marked as warn to still be run, but not reported.
--max-warnings example
npmyarnpnpmbun
npx eslint --max-warnings 10 file.js 


Output
-o, --output-file
Write the output of linting results to a specified file.
Argument Type: String. Path to file.
Multiple Arguments: No
-o, --output-file example
npmyarnpnpmbun
npx eslint -o ./test/test.html 


-f, --format
This option specifies the output format for the console.
Argument Type: String. One of the built-in formatters or a custom formatter.
Multiple Arguments: No
Default Value: stylish
If you are using a custom formatter defined in a local file, you can specify the path to the custom formatter file.
An npm-installed formatter is resolved with or without eslint-formatter- prefix.
When specified, the given format is output to the console. If you’d like to save that output into a file, you can do so on the command line like so:
npmyarnpnpmbun
# Saves the output into the `results.json` file.
npx eslint -f json file.js > results.json 



-f, --format example
Use the built-in json formatter:
npmyarnpnpmbun
npx eslint --format json file.js 


Use a local custom formatter:
npmyarnpnpmbun
npx eslint -f ./customformat.js file.js 


Use an npm-installed formatter:
npmyarnpnpmbun
npm install eslint-formatter-pretty


Then run one of the following commands
npmyarnpnpmbun
npx eslint -f pretty file.js 


or alternatively
npmyarnpnpmbun
npx eslint -f eslint-formatter-pretty file.js 


--color and --no-color
These options force the enabling/disabling of colorized output.
Argument Type: No argument.
You can use these options to override the default behavior, which is to enable colorized output unless no TTY is detected, such as when piping eslint through cat or less.
--color and --no-color example
npmyarnpnpmbun
npx eslint --color file.js | cat 


npmyarnpnpmbun
npx eslint --no-color file.js 


Inline Configuration Comments
--no-inline-config
This option prevents inline comments like /*eslint-disable*/ or /*global foo*/ from having any effect.
Argument Type: No argument.
This allows you to set an ESLint config without files modifying it. All inline config comments are ignored, such as:
/*eslint-disable*/
/*eslint-enable*/
/*global*/
/*eslint*/
/*eslint-env*/
// eslint-disable-line
// eslint-disable-next-line
--no-inline-config example
npmyarnpnpmbun
npx eslint --no-inline-config file.js 


--report-unused-disable-directives
This option causes ESLint to report directive comments like // eslint-disable-line when no errors would have been reported on that line anyway.
Argument Type: No argument.
This can be useful to prevent future errors from unexpectedly being suppressed, by cleaning up old eslint-disable and eslint-enable comments which are no longer applicable.
Warning
When using this option, it is possible that new errors start being reported whenever ESLint or custom rules are upgraded.
For example, suppose a rule has a bug that causes it to report a false positive, and an eslint-disable comment is added to suppress the incorrect report. If the bug is then fixed in a patch release of ESLint, the eslint-disable comment becomes unused since ESLint is no longer generating an incorrect report. This results in a new reported error for the unused directive if the --report-unused-disable-directives option is used.
--report-unused-disable-directives example
npmyarnpnpmbun
npx eslint --report-unused-disable-directives file.js 


--report-unused-disable-directives-severity
Same as --report-unused-disable-directives, but allows you to specify the severity level (error, warn, off) of the reported errors. Only one of these two options can be used at a time.
Argument Type: String. One of the following values:
off (or 0)
warn (or 1)
error (or 2)
Multiple Arguments: No
Default Value: By default, linterOptions.reportUnusedDisableDirectives configuration setting is used (which defaults to "warn").
--report-unused-disable-directives-severity example
npmyarnpnpmbun
npx eslint --report-unused-disable-directives-severity warn file.js 


--report-unused-inline-configs
This option causes ESLint to report inline config comments like /* eslint rule-name: "error" */ whose rule severity and any options match what’s already been configured.
Argument Type: String. One of the following values:
off (or 0)
warn (or 1)
error (or 2)
Multiple Arguments: No
Default Value: By default, linterOptions.reportUnusedInlineConfigs configuration setting is used (which defaults to "off").
This can be useful to keep files clean and devoid of misleading clutter. Inline config comments are meant to change ESLint’s behavior in some way: if they change nothing, there is no reason to leave them in.
--report-unused-inline-configs example
npx eslint --report-unused-inline-configs error file.js


Caching
--cache
Store the info about processed files in order to only operate on the changed ones. Enabling this option can dramatically improve ESLint’s run time performance by ensuring that only changed files are linted. The cache is stored in .eslintcache by default.
Argument Type: No argument.
If you run ESLint with --cache and then run ESLint without --cache, the .eslintcache file will be deleted. This is necessary because the results of the lint might change and make .eslintcache invalid. If you want to control when the cache file is deleted, then use --cache-location to specify an alternate location for the cache file.
Autofixed files are not placed in the cache. Subsequent linting that does not trigger an autofix will place it in the cache.
--cache example
npmyarnpnpmbun
npx eslint --cache file.js 


--cache-file
Deprecated: Use --cache-location instead.
Path to the cache file. If none specified .eslintcache is used. The file is created in the directory where the eslint command is executed.
--cache-location
Specify the path to the cache location. Can be a file or a directory.
Argument Type: String. Path to file or directory. If a directory is specified, a cache file is created inside the specified folder. The name of the file is based on the hash of the current working directory, e.g.: .cache_hashOfCWD.
Multiple Arguments: No
Default Value: If no location is specified, .eslintcache is used. The file is created in the directory where the eslint command is executed.
If the directory for the cache does not exist make sure you add a trailing / on *nix systems or \ on Windows. Otherwise, the path is assumed to be a file.
--cache-location example
npmyarnpnpmbun
npx eslint "src/**/*.js" --cache --cache-location "/Users/user/.eslintcache/" 


--cache-strategy
Strategy for the cache to use for detecting changed files.
Argument Type: String. One of the following values:
metadata
content
Multiple Arguments: No
Default Value: metadata
The content strategy can be useful in cases where the modification time of your files changes even if their contents have not. For example, this can happen during git operations like git clone because git does not track file modification time.
--cache-strategy example
npmyarnpnpmbun
npx eslint "src/**/*.js" --cache --cache-strategy content 


Suppressing Violations
--suppress-all
Suppresses existing violations, so that they are not being reported in subsequent runs. It allows you to enable one or more lint rules and be notified only when new violations show up. The suppressions are stored in eslint-suppressions.json by default, unless otherwise specified by --suppressions-location. The file gets updated with the new suppressions.
Argument Type: No argument.
--suppress-all example
npmyarnpnpmbun
npx eslint "src/**/*.js" --suppress-all 


--suppress-rule
Suppresses violations for specific rules, so that they are not being reported in subsequent runs. Similar to --suppress-all, the suppressions are stored in eslint-suppressions.json by default, unless otherwise specified by --suppressions-location. The file gets updated with the new suppressions.
Argument Type: String. Rule ID.
Multiple Arguments: Yes
--suppress-rule example
npmyarnpnpmbun
npx eslint "src/**/*.js" --suppress-rule no-console --suppress-rule indent 


--suppressions-location
Specify the path to the suppressions location. Can be a file or a directory.
Argument Type: String. Path to file. If a directory is specified, a cache file is created inside the specified folder. The name of the file is based on the hash of the current working directory, e.g.: suppressions_hashOfCWD
Multiple Arguments: No
Default Value: If no location is specified, eslint-suppressions.json is used. The file is created in the directory where the eslint command is executed.
--suppressions-location example
npmyarnpnpmbun
npx eslint "src/**/*.js" --suppressions-location ".eslint-suppressions-example.json" 


--prune-suppressions
Prune unused suppressions from the suppressions file. This option is useful when you addressed one or more of the suppressed violations.
Argument Type: No argument.
--prune-suppressions example
npmyarnpnpmbun
npx eslint "src/**/*.js" --prune-suppressions 


--pass-on-unpruned-suppressions
Ignore unused suppressions. By default, ESLint exits with exit code 2 and displays an error message if there are unused suppressions in the suppressions file. When you use this flag, unused suppressions do not affect the exit code and ESLint doesn’t output an error about unused suppressions.
Argument Type: No argument.
--pass-on-unpruned-suppressions example
npmyarnpnpmbun
npx eslint "src/**/*.js" --pass-on-unpruned-suppressions 


Miscellaneous
--init
This option runs npm init @eslint/config to start the config initialization wizard. It’s designed to help new users quickly create an eslint.config.js file by answering a few questions. When you use this flag, the CLI does not perform linting.
Argument Type: No argument.
The resulting configuration file is created in the current directory.
--init example
npmyarnpnpmbun
npx eslint --init 


--env-info
This option outputs information about the execution environment, including the version of Node.js, npm, and local and global installations of ESLint.
Argument Type: No argument.
The ESLint team may ask for this information to help solve bugs. When you use this flag, the CLI does not perform linting.
--env-info example
npmyarnpnpmbun
npx eslint --env-info 


--no-error-on-unmatched-pattern
This option prevents errors when a quoted glob pattern or --ext is unmatched. This does not prevent errors when your shell can’t match a glob.
Argument Type: No argument.
--no-error-on-unmatched-pattern example
npmyarnpnpmbun
npx eslint --no-error-on-unmatched-pattern --ext .ts "lib/*" 


--exit-on-fatal-error
This option causes ESLint to exit with exit code 2 if one or more fatal parsing errors occur. Without this option, ESLint reports fatal parsing errors as rule violations.
Argument Type: No argument.
--exit-on-fatal-error example
npmyarnpnpmbun
npx eslint --exit-on-fatal-error file.js 


--no-warn-ignored
Flat Config Mode Only. This option suppresses both File ignored by default and File ignored because of a matching ignore pattern warnings when an ignored filename is passed explicitly. It is useful when paired with --max-warnings 0 as it will prevent exit code 1 due to the aforementioned warning.
Argument Type: No argument.
--no-warn-ignored example
npmyarnpnpmbun
npx eslint --no-warn-ignored --max-warnings 0 ignored-file.js 


--pass-on-no-patterns
This option allows ESLint to exit with code 0 when no file or directory patterns are passed. Without this option, ESLint assumes you want to use . as the pattern. (When running in legacy eslintrc mode, ESLint will exit with code 1.)
Argument Type: No argument.
--pass-on-no-patterns example
npmyarnpnpmbun
npx eslint --pass-on-no-patterns 


--debug
This option outputs debugging information to the console. Add this flag to an ESLint command line invocation in order to get extra debugging information while the command runs.
Argument Type: No argument.
This information is useful when you’re seeing a problem and having a hard time pinpointing it. The ESLint team may ask for this debugging information to help solve bugs.
--debug example
npmyarnpnpmbun
npx eslint --debug test.js 


-h, --help
This option outputs the help menu, displaying all of the available options. All other options are ignored when this is present. When you use this flag, the CLI does not perform linting.
Argument Type: No argument.
-h, --help example
npmyarnpnpmbun
npx eslint --help 


-v, --version
This option outputs the current ESLint version onto the console. All other options are ignored when this is present. When you use this flag, the CLI does not perform linting.
Argument Type: No argument.
-v, --version example
npmyarnpnpmbun
npx eslint --version 


--print-config
This option outputs the configuration to be used for the file passed. When present, no linting is performed and only config-related options are valid. When you use this flag, the CLI does not perform linting.
Argument Type: String. Path to file.
Multiple Arguments: No
--print-config example
npmyarnpnpmbun
npx eslint --print-config file.js 


--stats
This option adds a series of detailed performance statistics (see Stats type) such as the parse-, fix- and lint-times (time per rule) to result objects that are passed to the formatter (see Stats CLI usage).
Argument Type: No argument.
This option is intended for use with custom formatters that display statistics. It can also be used with the built-in json formatter.
--stats example
npmyarnpnpmbun
npx eslint --stats --format json file.js 


--flag
This option enables one or more feature flags for ESLint.
Argument Type: String. A feature identifier.
Multiple Arguments: Yes
--flag example
npmyarnpnpmbun
npx eslint --flag x_feature file.js 


--mcp
This option starts the ESLint MCP server for use with AI agents.
Argument Type: No argument.
Multiple Arguments: No
--mcp example
npmyarnpnpmbun
npx eslint --mcp 


Exit Codes
When linting files, ESLint exits with one of the following exit codes:
0: Linting was successful and there are no linting errors. If the --max-warnings flag is set to n, the number of linting warnings is at most n.
1: Linting was successful and there is at least one linting error, or there are more linting warnings than allowed by the --max-warnings option.
2: Linting was unsuccessful due to a configuration problem or an internal error.
Edit this page
Table of Contents
Run the CLI
Pass Multiple Values to an Option
Options
Basic Configuration
--no-eslintrc
-c, --config
--inspect-config
--env
--ext
--global
--parser
--parser-options
--resolve-plugins-relative-to
Specify Rules and Plugins
--plugin
--rule
--rulesdir
Fix Problems
--fix
--fix-dry-run
--fix-type
Ignore Files
--ignore-path
--no-ignore
--ignore-pattern
Use stdin
--stdin
--stdin-filename
Handle Warnings
--quiet
--max-warnings
Output
-o, --output-file
-f, --format
--color and --no-color
Inline Configuration Comments
--no-inline-config
--report-unused-disable-directives
--report-unused-disable-directives-severity
--report-unused-inline-configs
Caching
--cache
--cache-file
--cache-location
--cache-strategy
Suppressing Violations
--suppress-all
--suppress-rule
--suppressions-location
--prune-suppressions
--pass-on-unpruned-suppressions
Miscellaneous
--init
--env-info
--no-error-on-unmatched-pattern
--exit-on-fatal-error
--no-warn-ignored
--pass-on-no-patterns
--debug
-h, --help
-v, --version
--print-config
--stats
--flag
--mcp
Exit Codes
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Rules Reference
Rules in ESLint are grouped by type to help you understand their purpose. Each rule has emojis denoting:
✅
Recommended
Using the recommended config from @eslint/js in a configuration file enables this rule
🔧
Fixable
Some problems reported by this rule are automatically fixable by the --fix command line option
💡
hasSuggestions
Some problems reported by this rule are manually fixable by editor suggestions
❄️
Frozen
This rule is currently frozen and is not accepting feature requests.
Possible Problems 
These rules relate to possible logic errors in code:
array-callback-return
Enforce return statements in callbacks of array methods
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
constructor-super
Require super() calls in constructors
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
for-direction
Enforce for loop update clause moving the counter in the right direction
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
getter-return
Enforce return statements in getters
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-async-promise-executor
Disallow using an async function as a Promise executor
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-await-in-loop
Disallow await inside of loops
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-class-assign
Disallow reassigning class members
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-compare-neg-zero
Disallow comparing against -0
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-cond-assign
Disallow assignment operators in conditional expressions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-const-assign
Disallow reassigning const, using, and await using variables
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-constant-binary-expression
Disallow expressions where the operation doesn’t affect the value
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-constant-condition
Disallow constant expressions in conditions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-constructor-return
Disallow returning value from constructor
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-control-regex
Disallow control characters in regular expressions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-debugger
Disallow the use of debugger
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-dupe-args
Disallow duplicate arguments in function definitions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-dupe-class-members
Disallow duplicate class members
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-dupe-else-if
Disallow duplicate conditions in if-else-if chains
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-dupe-keys
Disallow duplicate keys in object literals
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-duplicate-case
Disallow duplicate case labels
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-duplicate-imports
Disallow duplicate module imports
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-empty-character-class
Disallow empty character classes in regular expressions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-empty-pattern
Disallow empty destructuring patterns
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-ex-assign
Disallow reassigning exceptions in catch clauses
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-fallthrough
Disallow fallthrough of case statements
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-func-assign
Disallow reassigning function declarations
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-import-assign
Disallow assigning to imported bindings
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-inner-declarations
Disallow variable or function declarations in nested blocks
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-invalid-regexp
Disallow invalid regular expression strings in RegExp constructors
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-irregular-whitespace
Disallow irregular whitespace
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-loss-of-precision
Disallow literal numbers that lose precision
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-misleading-character-class
Disallow characters which are made with multiple code points in character class syntax
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-new-native-nonconstructor
Disallow new operators with global non-constructor functions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-obj-calls
Disallow calling global object properties as functions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-promise-executor-return
Disallow returning values from Promise executor functions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-prototype-builtins
Disallow calling some Object.prototype methods directly on objects
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-self-assign
Disallow assignments where both sides are exactly the same
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-self-compare
Disallow comparisons where both sides are exactly the same
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-setter-return
Disallow returning values from setters
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-sparse-arrays
Disallow sparse arrays
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-template-curly-in-string
Disallow template literal placeholder syntax in regular strings
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-this-before-super
Disallow this/super before calling super() in constructors
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-unassigned-vars
Disallow let or var variables that are read but never assigned
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-undef
Disallow the use of undeclared variables unless mentioned in /*global */ comments
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-unexpected-multiline
Disallow confusing multiline expressions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-unmodified-loop-condition
Disallow unmodified loop conditions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-unreachable
Disallow unreachable code after return, throw, continue, and break statements
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-unreachable-loop
Disallow loops with a body that allows only one iteration
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-unsafe-finally
Disallow control flow statements in finally blocks
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-unsafe-negation
Disallow negating the left operand of relational operators
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-unsafe-optional-chaining
Disallow use of optional chaining in contexts where the undefined value is not allowed
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-unused-private-class-members
Disallow unused private class members
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-unused-vars
Disallow unused variables
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-use-before-define
Disallow the use of variables before they are defined
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-useless-assignment
Disallow variable assignments when the value is not used
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-useless-backreference
Disallow useless backreferences in regular expressions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
require-atomic-updates
Disallow assignments that can lead to race conditions due to usage of await or yield
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
use-isnan
Require calls to isNaN() when checking for NaN
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
valid-typeof
Enforce comparing typeof expressions against valid strings
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
Suggestions 
These rules suggest alternate ways of doing things:
accessor-pairs
Enforce getter and setter pairs in objects and classes
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
arrow-body-style
❄️
Frozen
Require braces around arrow function bodies
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
block-scoped-var
Enforce the use of variables within the scope they are defined
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
camelcase
❄️
Frozen
Enforce camelcase naming convention
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
capitalized-comments
❄️
Frozen
Enforce or disallow capitalization of the first letter of a comment
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
class-methods-use-this
Enforce that class methods utilize this
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
complexity
Enforce a maximum cyclomatic complexity allowed in a program
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
consistent-return
Require return statements to either always or never specify values
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
consistent-this
❄️
Frozen
Enforce consistent naming when capturing the current execution context
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
curly
❄️
Frozen
Enforce consistent brace style for all control statements
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
default-case
Require default cases in switch statements
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
default-case-last
Enforce default clauses in switch statements to be last
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
default-param-last
❄️
Frozen
Enforce default parameters to be last
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
dot-notation
❄️
Frozen
Enforce dot notation whenever possible
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
eqeqeq
Require the use of === and !==
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
func-name-matching
❄️
Frozen
Require function names to match the name of the variable or property to which they are assigned
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
func-names
Require or disallow named function expressions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
func-style
❄️
Frozen
Enforce the consistent use of either function declarations or expressions assigned to variables
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
grouped-accessor-pairs
Require grouped accessor pairs in object literals and classes
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
guard-for-in
Require for-in loops to include an if statement
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
id-denylist
❄️
Frozen
Disallow specified identifiers
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
id-length
❄️
Frozen
Enforce minimum and maximum identifier lengths
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
id-match
❄️
Frozen
Require identifiers to match a specified regular expression
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
init-declarations
❄️
Frozen
Require or disallow initialization in variable declarations
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
logical-assignment-operators
❄️
Frozen
Require or disallow logical assignment operator shorthand
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
max-classes-per-file
Enforce a maximum number of classes per file
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
max-depth
Enforce a maximum depth that blocks can be nested
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
max-lines
Enforce a maximum number of lines per file
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
max-lines-per-function
Enforce a maximum number of lines of code in a function
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
max-nested-callbacks
Enforce a maximum depth that callbacks can be nested
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
max-params
Enforce a maximum number of parameters in function definitions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
max-statements
Enforce a maximum number of statements allowed in function blocks
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
new-cap
Require constructor names to begin with a capital letter
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-alert
Disallow the use of alert, confirm, and prompt
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-array-constructor
Disallow Array constructors
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-bitwise
Disallow bitwise operators
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-caller
Disallow the use of arguments.caller or arguments.callee
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-case-declarations
Disallow lexical declarations in case clauses
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-console
Disallow the use of console
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-continue
❄️
Frozen
Disallow continue statements
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-delete-var
Disallow deleting variables
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-div-regex
❄️
Frozen
Disallow equal signs explicitly at the beginning of regular expressions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-else-return
❄️
Frozen
Disallow else blocks after return statements in if statements
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-empty
Disallow empty block statements
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-empty-function
Disallow empty functions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-empty-static-block
Disallow empty static blocks
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-eq-null
Disallow null comparisons without type-checking operators
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-eval
Disallow the use of eval()
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-extend-native
Disallow extending native types
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-extra-bind
Disallow unnecessary calls to .bind()
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-extra-boolean-cast
❄️
Frozen
Disallow unnecessary boolean casts
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-extra-label
❄️
Frozen
Disallow unnecessary labels
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-global-assign
Disallow assignments to native objects or read-only global variables
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-implicit-coercion
❄️
Frozen
Disallow shorthand type conversions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-implicit-globals
Disallow declarations in the global scope
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-implied-eval
Disallow the use of eval()-like methods
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-inline-comments
❄️
Frozen
Disallow inline comments after code
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-invalid-this
Disallow use of this in contexts where the value of this is undefined
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-iterator
Disallow the use of the __iterator__ property
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-label-var
❄️
Frozen
Disallow labels that share a name with a variable
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-labels
❄️
Frozen
Disallow labeled statements
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-lone-blocks
Disallow unnecessary nested blocks
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-lonely-if
❄️
Frozen
Disallow if statements as the only statement in else blocks
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-loop-func
Disallow function declarations that contain unsafe references inside loop statements
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-magic-numbers
❄️
Frozen
Disallow magic numbers
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-multi-assign
Disallow use of chained assignment expressions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-multi-str
❄️
Frozen
Disallow multiline strings
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-negated-condition
❄️
Frozen
Disallow negated conditions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-nested-ternary
❄️
Frozen
Disallow nested ternary expressions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-new
Disallow new operators outside of assignments or comparisons
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-new-func
Disallow new operators with the Function object
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-new-wrappers
Disallow new operators with the String, Number, and Boolean objects
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-nonoctal-decimal-escape
Disallow &#92;8 and &#92;9 escape sequences in string literals
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-object-constructor
Disallow calls to the Object constructor without an argument
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-octal
Disallow octal literals
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-octal-escape
Disallow octal escape sequences in string literals
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-param-reassign
Disallow reassigning function parameters
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-plusplus
❄️
Frozen
Disallow the unary operators ++ and --
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-proto
Disallow the use of the __proto__ property
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-redeclare
Disallow variable redeclaration
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-regex-spaces
Disallow multiple spaces in regular expressions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-restricted-exports
Disallow specified names in exports
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-restricted-globals
Disallow specified global variables
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-restricted-imports
Disallow specified modules when loaded by import
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-restricted-properties
Disallow certain properties on certain objects
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-restricted-syntax
Disallow specified syntax
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-return-assign
Disallow assignment operators in return statements
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-script-url
Disallow javascript: URLs
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-sequences
Disallow comma operators
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-shadow
Disallow variable declarations from shadowing variables declared in the outer scope
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-shadow-restricted-names
Disallow identifiers from shadowing restricted names
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-ternary
❄️
Frozen
Disallow ternary operators
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-throw-literal
Disallow throwing literals as exceptions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-undef-init
❄️
Frozen
Disallow initializing variables to undefined
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-undefined
❄️
Frozen
Disallow the use of undefined as an identifier
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-underscore-dangle
❄️
Frozen
Disallow dangling underscores in identifiers
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-unneeded-ternary
❄️
Frozen
Disallow ternary operators when simpler alternatives exist
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-unused-expressions
Disallow unused expressions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-unused-labels
Disallow unused labels
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-useless-call
Disallow unnecessary calls to .call() and .apply()
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-useless-catch
Disallow unnecessary catch clauses
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-useless-computed-key
❄️
Frozen
Disallow unnecessary computed property keys in objects and classes
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-useless-concat
❄️
Frozen
Disallow unnecessary concatenation of literals or template literals
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-useless-constructor
Disallow unnecessary constructors
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-useless-escape
Disallow unnecessary escape characters
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-useless-rename
Disallow renaming import, export, and destructured assignments to the same name
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-useless-return
Disallow redundant return statements
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-var
Require let or const instead of var
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-void
❄️
Frozen
Disallow void operators
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-warning-comments
❄️
Frozen
Disallow specified warning terms in comments
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
no-with
Disallow with statements
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
object-shorthand
❄️
Frozen
Require or disallow method and property shorthand syntax for object literals
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
one-var
❄️
Frozen
Enforce variables to be declared either together or separately in functions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
operator-assignment
❄️
Frozen
Require or disallow assignment operator shorthand where possible
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
prefer-arrow-callback
❄️
Frozen
Require using arrow functions for callbacks
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
prefer-const
Require const declarations for variables that are never reassigned after declared
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
prefer-destructuring
❄️
Frozen
Require destructuring from arrays and/or objects
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
prefer-exponentiation-operator
❄️
Frozen
Disallow the use of Math.pow in favor of the ** operator
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
prefer-named-capture-group
Enforce using named capture group in regular expression
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
prefer-numeric-literals
❄️
Frozen
Disallow parseInt() and Number.parseInt() in favor of binary, octal, and hexadecimal literals
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
prefer-object-has-own
Disallow use of Object.prototype.hasOwnProperty.call() and prefer use of Object.hasOwn()
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
prefer-object-spread
❄️
Frozen
Disallow using Object.assign with an object literal as the first argument and prefer the use of object spread instead
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
prefer-promise-reject-errors
Require using Error objects as Promise rejection reasons
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
prefer-regex-literals
Disallow use of the RegExp constructor in favor of regular expression literals
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
prefer-rest-params
Require rest parameters instead of arguments
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
prefer-spread
❄️
Frozen
Require spread operators instead of .apply()
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
prefer-template
❄️
Frozen
Require template literals instead of string concatenation
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
radix
Enforce the consistent use of the radix argument when using parseInt()
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
require-await
Disallow async functions which have no await expression
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
require-unicode-regexp
Enforce the use of u or v flag on regular expressions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
require-yield
Require generator functions to contain yield
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
sort-imports
❄️
Frozen
Enforce sorted import declarations within modules
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
sort-keys
❄️
Frozen
Require object keys to be sorted
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
sort-vars
❄️
Frozen
Require variables within the same declaration block to be sorted
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
strict
Require or disallow strict mode directives
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
symbol-description
Require symbol descriptions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
vars-on-top
❄️
Frozen
Require var declarations be placed at the top of their containing scope
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
yoda
❄️
Frozen
Require or disallow “Yoda” conditions
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
Layout & Formatting 
These rules care about how the code looks rather than how it executes:
unicode-bom
Require or disallow Unicode byte order mark (BOM)
Categories:
✅
Extends
🔧
Fix
💡
Suggestions
Deprecated
These rules have been deprecated in accordance with the deprecation policy, and replaced by newer rules:
array-bracket-newline deprecated
Replaced by array-bracket-newline in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
array-bracket-spacing deprecated
Replaced by array-bracket-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
array-element-newline deprecated
Replaced by array-element-newline in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
arrow-parens deprecated
Replaced by arrow-parens in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
arrow-spacing deprecated
Replaced by arrow-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
block-spacing deprecated
Replaced by block-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
brace-style deprecated
Replaced by brace-style in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
callback-return deprecated
Replaced by callback-return in eslint-plugin-n
Categories:
❌🔧
Fix
💡
Suggestions
comma-dangle deprecated
Replaced by comma-dangle in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
comma-spacing deprecated
Replaced by comma-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
comma-style deprecated
Replaced by comma-style in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
computed-property-spacing deprecated
Replaced by computed-property-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
dot-location deprecated
Replaced by dot-location in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
eol-last deprecated
Replaced by eol-last in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
func-call-spacing deprecated
Replaced by function-call-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
function-call-argument-newline deprecated
Replaced by function-call-argument-newline in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
function-paren-newline deprecated
Replaced by function-paren-newline in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
generator-star-spacing deprecated
Replaced by generator-star-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
global-require deprecated
Replaced by global-require in eslint-plugin-n
Categories:
❌🔧
Fix
💡
Suggestions
handle-callback-err deprecated
Replaced by handle-callback-err in eslint-plugin-n
Categories:
❌🔧
Fix
💡
Suggestions
id-blacklist deprecated
Replaced by id-denylist
Categories:
❌🔧
Fix
💡
Suggestions
implicit-arrow-linebreak deprecated
Replaced by implicit-arrow-linebreak in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
indent deprecated
Replaced by indent in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
indent-legacy deprecated
Replaced by indent in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
jsx-quotes deprecated
Replaced by jsx-quotes in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
key-spacing deprecated
Replaced by key-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
keyword-spacing deprecated
Replaced by keyword-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
line-comment-position deprecated
Replaced by line-comment-position in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
linebreak-style deprecated
Replaced by linebreak-style in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
lines-around-comment deprecated
Replaced by lines-around-comment in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
lines-around-directive deprecated
Replaced by padding-line-between-statements in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
lines-between-class-members deprecated
Replaced by lines-between-class-members in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
max-len deprecated
Replaced by max-len in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
max-statements-per-line deprecated
Replaced by max-statements-per-line in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
multiline-comment-style deprecated
Replaced by multiline-comment-style in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
multiline-ternary deprecated
Replaced by multiline-ternary in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
new-parens deprecated
Replaced by new-parens in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
newline-after-var deprecated
Replaced by padding-line-between-statements in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
newline-before-return deprecated
Replaced by padding-line-between-statements in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
newline-per-chained-call deprecated
Replaced by newline-per-chained-call in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
no-buffer-constructor deprecated
Replaced by no-deprecated-api in eslint-plugin-n
Categories:
❌🔧
Fix
💡
Suggestions
no-catch-shadow deprecated
Replaced by no-shadow
Categories:
❌🔧
Fix
💡
Suggestions
no-confusing-arrow deprecated
Replaced by no-confusing-arrow in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
no-extra-parens deprecated
Replaced by no-extra-parens in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
no-extra-semi deprecated
Replaced by no-extra-semi in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
no-floating-decimal deprecated
Replaced by no-floating-decimal in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
no-mixed-operators deprecated
Replaced by no-mixed-operators in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
no-mixed-requires deprecated
Replaced by no-mixed-requires in eslint-plugin-n
Categories:
❌🔧
Fix
💡
Suggestions
no-mixed-spaces-and-tabs deprecated
Replaced by no-mixed-spaces-and-tabs in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
no-multi-spaces deprecated
Replaced by no-multi-spaces in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
no-multiple-empty-lines deprecated
Replaced by no-multiple-empty-lines in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
no-native-reassign deprecated
Replaced by no-global-assign
Categories:
❌🔧
Fix
💡
Suggestions
no-negated-in-lhs deprecated
Replaced by no-unsafe-negation
Categories:
❌🔧
Fix
💡
Suggestions
no-new-object deprecated
Replaced by no-object-constructor
Categories:
❌🔧
Fix
💡
Suggestions
no-new-require deprecated
Replaced by no-new-require in eslint-plugin-n
Categories:
❌🔧
Fix
💡
Suggestions
no-new-symbol deprecated
Replaced by no-new-native-nonconstructor
Categories:
❌🔧
Fix
💡
Suggestions
no-path-concat deprecated
Replaced by no-path-concat in eslint-plugin-n
Categories:
❌🔧
Fix
💡
Suggestions
no-process-env deprecated
Replaced by no-process-env in eslint-plugin-n
Categories:
❌🔧
Fix
💡
Suggestions
no-process-exit deprecated
Replaced by no-process-exit in eslint-plugin-n
Categories:
❌🔧
Fix
💡
Suggestions
no-restricted-modules deprecated
Replaced by no-restricted-require in eslint-plugin-n
Categories:
❌🔧
Fix
💡
Suggestions
no-return-await deprecated
Categories:
❌🔧
Fix
💡
Suggestions
no-spaced-func deprecated
Replaced by function-call-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
no-sync deprecated
Replaced by no-sync in eslint-plugin-n
Categories:
❌🔧
Fix
💡
Suggestions
no-tabs deprecated
Replaced by no-tabs in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
no-trailing-spaces deprecated
Replaced by no-trailing-spaces in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
no-whitespace-before-property deprecated
Replaced by no-whitespace-before-property in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
nonblock-statement-body-position deprecated
Replaced by nonblock-statement-body-position in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
object-curly-newline deprecated
Replaced by object-curly-newline in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
object-curly-spacing deprecated
Replaced by object-curly-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
object-property-newline deprecated
Replaced by object-property-newline in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
one-var-declaration-per-line deprecated
Replaced by one-var-declaration-per-line in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
operator-linebreak deprecated
Replaced by operator-linebreak in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
padded-blocks deprecated
Replaced by padded-blocks in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
padding-line-between-statements deprecated
Replaced by padding-line-between-statements in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
prefer-reflect deprecated
Categories:
❌🔧
Fix
💡
Suggestions
quote-props deprecated
Replaced by quote-props in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
quotes deprecated
Replaced by quotes in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
rest-spread-spacing deprecated
Replaced by rest-spread-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
semi deprecated
Replaced by semi in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
semi-spacing deprecated
Replaced by semi-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
semi-style deprecated
Replaced by semi-style in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
space-before-blocks deprecated
Replaced by space-before-blocks in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
space-before-function-paren deprecated
Replaced by space-before-function-paren in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
space-in-parens deprecated
Replaced by space-in-parens in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
space-infix-ops deprecated
Replaced by space-infix-ops in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
space-unary-ops deprecated
Replaced by space-unary-ops in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
spaced-comment deprecated
Replaced by spaced-comment in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
switch-colon-spacing deprecated
Replaced by switch-colon-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
template-curly-spacing deprecated
Replaced by template-curly-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
template-tag-spacing deprecated
Replaced by template-tag-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
wrap-iife deprecated
Replaced by wrap-iife in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
wrap-regex deprecated
Replaced by wrap-regex in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
yield-star-spacing deprecated
Replaced by yield-star-spacing in @stylistic/eslint-plugin
Categories:
❌🔧
Fix
💡
Suggestions
Removed
These rules from older versions of ESLint (before the deprecation policy existed) have been replaced by newer rules:
generator-star removed
Replaced by generator-star-spacing
global-strict removed
Replaced by strict
no-arrow-condition removed
Replaced by no-confusing-arrow or
no-constant-condition
no-comma-dangle removed
Replaced by comma-dangle
no-empty-class removed
Replaced by no-empty-character-class
no-empty-label removed
Replaced by no-labels
no-extra-strict removed
Replaced by strict
no-reserved-keys removed
Replaced by quote-props
no-space-before-semi removed
Replaced by semi-spacing
no-wrap-func removed
Replaced by no-extra-parens
space-after-function-name removed
Replaced by space-before-function-paren
space-after-keywords removed
Replaced by keyword-spacing
space-before-function-parentheses removed
Replaced by space-before-function-paren
space-before-keywords removed
Replaced by keyword-spacing
space-in-brackets removed
Replaced by object-curly-spacing or
array-bracket-spacing or
computed-property-spacing
space-return-throw-case removed
Replaced by keyword-spacing
space-unary-word-ops removed
Replaced by space-unary-ops
spaced-line-comment removed
Replaced by spaced-comment
valid-jsdoc removed
require-jsdoc removed
Edit this page
Table of Contents
Possible Problems
Suggestions
Layout & Formatting
Deprecated
Removed
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
MCP Server Setup
Model Context Protocol (MCP) is an open standard that enables AI models to interact with external tools and services through a unified interface. The ESLint CLI contains an MCP server that you can register with your code editor to allow LLMs to use ESLint directly.
Set Up ESLint MCP Server in VS Code
To use MCP servers in VS Code, you must have the Copilot Chat extension installed. After that, follow these steps so add the ESLint MCP server:
1. Create MCP Configuration File
Create a .vscode/mcp.json file in your project with the following configuration:
{
	"servers": {
		"ESLint": {
			"type": "stdio",
			"command": "npx",
			"args": ["@eslint/mcp@latest"]
		}
	}
}










Alternatively, you can use the Command Palette:
Press Ctrl+Shift+P (Windows/Linux) or Cmd+Shift+P (macOS)
Type and select MCP: Add Server
Select Command (stdio) from the dropdown
Enter npx @eslint/mcp@latest as the command
Type ESLint as the server ID
Choose Workspace Settings to create the configuration in .vscode/mcp.json
2. Enable MCP Server in User Settings (Optional)
If you want to use the ESLint MCP server across all workspaces, you can follow the previous steps and choose User Settings instead of Workspace Settings to add the MCP server to your settings.json file.
Using the ESLint MCP Server with GitHub Copilot
Once your MCP server is configured, you can use it with GitHub Copilot’s agent mode:
Open the Copilot Chat view in VS Code
Ensure agent mode is enabled (look for the agent icon in the chat input)
Toggle on the ESLint MCP server tools using the “Tools” button in the chat view
Ask Copilot to perform ESLint tasks, such as:
“Check this file for linting errors”
“Fix all ESLint issues in the current file”
“Show me what ESLint rules are being violated”
Troubleshooting
If you encounter issues with the ESLint MCP server:
Check the MCP server status by running MCP: List Servers from the Command Palette
Select the ESLint server and choose Show Output to view server logs
Ensure that ESLint is installed in your project or globally
Verify that your MCP configuration is correct
Set Up ESLint MCP Server in Cursor
To configure the ESLint MCP server in Cursor, follow these steps:
1. Create MCP Configuration File
Create a .cursor/mcp.json file in your project directory with the following configuration:
{
	"mcpServers": {
		"eslint": {
			"command": "npx",
			"args": ["@eslint/mcp@latest"],
			"env": {}
		}
	}
}










2. Global Configuration (Optional)
If you want to use the ESLint MCP server across all your Cursor workspaces, create a ~/.cursor/mcp.json file in your home directory with the same configuration.
3. Verify Tool Availability
Once configured, the ESLint MCP server should appear in the “Available Tools” section on the MCP settings page in Cursor.
Set Up ESLint MCP Server in Windsurf
To configure the ESLint MCP server in Windsurf, follow these steps:
1. Access Windsurf Settings
Navigate to Windsurf - Settings > Advanced Settings, or open the Command Palette and select “Open Windsurf Settings Page”.
2. Add ESLint MCP Server
Scroll down to the Cascade section and click the “Add Server” button. Then select “Add custom server +”.
3. Configure MCP Server
Add the following configuration to your ~/.codeium/windsurf/mcp_config.json file:
{
	"mcpServers": {
		"eslint": {
			"command": "npx",
			"args": ["@eslint/mcp@latest"],
			"env": {}
		}
	}
}










4. Refresh Server List
After adding the configuration, press the refresh button to update the list of available MCP servers.
5. Using ESLint with Cascade
Once configured, you can use ESLint tools with Cascade by asking it to:
Check files for linting errors
Explain ESLint rule violations
Note: MCP tool calls in Windsurf will consume credits regardless of success or failure.
Example Prompts
Here are some example prompts to an LLM for running ESLint and addressing its findings:
Lint the current file and explain any issues found

Lint and fix #file:index.js




Additional Resources
Model Context Protocol Documentation
VS Code MCP Servers Documentation
GitHub Copilot in VS Code Documentation
Model Context Protocol in Cursor documentation
Model Context Protocol in Windsurf documentation
Edit this page
Table of Contents
Set Up ESLint MCP Server in VS Code
1. Create MCP Configuration File
2. Enable MCP Server in User Settings (Optional)
Using the ESLint MCP Server with GitHub Copilot
Troubleshooting
Set Up ESLint MCP Server in Cursor
1. Create MCP Configuration File
2. Global Configuration (Optional)
3. Verify Tool Availability
Set Up ESLint MCP Server in Windsurf
1. Access Windsurf Settings
2. Add ESLint MCP Server
3. Configure MCP Server
4. Refresh Server List
5. Using ESLint with Cascade
Example Prompts
Additional Resources
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Feature Flags
ESLint ships experimental and future breaking changes behind feature flags to let users opt-in to behavior they want. Flags are used in these situations:
When a feature is experimental and not ready to be enabled for everyone.
When a feature is a breaking change that will be formally merged in the next major release, but users may opt-in to that behavior prior to the next major release.
Flag Prefixes
The prefix of a flag indicates its status:
unstable_ indicates that the feature is experimental and the implementation may change before the feature is stabilized. This is a “use at your own risk” feature.
v##_ indicates that the feature is stabilized and will be available in the next major release. For example, v10_some_feature indicates that this is a breaking change that will be formally released in ESLint v10.0.0. These flags are removed each major release, and further use of them throws an error.
A feature may move from unstable to being enabled by default without a major release if it is a non-breaking change.
The following policies apply to unstable_ flags.
When the feature is stabilized
If enabling the feature by default would be a breaking change, a new v##_ flag is added as active, and the unstable_ flag becomes inactive. Further use of the unstable_ flag automatically enables the v##_ flag but emits a warning.
Otherwise, the feature is enabled by default, and the unstable_ flag becomes inactive. Further use of the unstable_ flag emits a warning.
If the feature is abandoned, the unstable_ flag becomes inactive. Further use of it throws an error.
All inactive unstable_ flags are removed each major release, and further use of them throws an error.
Active Flags
The following flags are currently available for use in ESLint.
Flag
Description
v10_config_lookup_from_file
Look up `eslint.config.js` from the file being linted.
unstable_native_nodejs_ts_config
Use native Node.js to load TypeScript configuration.

Inactive Flags
The following flags were once used but are no longer active.
Flag
Description
Inactivity Reason
unstable_ts_config
Enable TypeScript configuration files.
This feature is now enabled by default.
unstable_config_lookup_from_file
Look up `eslint.config.js` from the file being linted.
This flag has been renamed 'v10_config_lookup_from_file' to reflect its stabilization. Please use 'v10_config_lookup_from_file' instead.

How to Use Feature Flags
Because feature flags are strictly opt-in, you need to manually enable the flags that you want.
Enable Feature Flags with the CLI
On the command line, you can specify feature flags using the --flag option. You can specify as many flags as you’d like:
npmyarnpnpmbun
npx eslint --flag flag_one --flag flag_two file.js 


Enable Feature Flags with Environment Variables
You can also set feature flags using the ESLINT_FLAGS environment variable. Multiple flags can be specified as a comma-separated list and are merged with any flags passed on the CLI or in the API. For example, here’s how you can add feature flags to your .bashrc or .bash_profile files:
export ESLINT_FLAGS="flag_one,flag_two"


This approach is especially useful in CI/CD pipelines or when you want to enable the same flags across multiple ESLint commands.
Enable Feature Flags with the API
When using the API, you can pass a flags array to both the ESLint and Linter classes:
const { ESLint, Linter } = require("eslint");

const eslint = new ESLint({
	flags: ["flag_one", "flag_two"],
});

const linter = new Linter({
	flags: ["flag_one", "flag_two"],
});










Tip
The ESLint class also reads the ESLINT_FLAGS environment variable to set flags.
Enable Feature Flags in VS Code
To enable flags in the VS Code ESLint Extension for the editor, specify the flags you’d like in the eslint.options setting in your settings.json file:
{
	"eslint.options": { "flags": ["flag_one", "flag_two"] }
}




To enable flags in the VS Code ESLint Extension for a lint task, specify the eslint.lintTask.options settings:
{
	"eslint.lintTask.options": "--flag flag_one --flag flag_two ."
}




Edit this page
Table of Contents
Flag Prefixes
Active Flags
Inactive Flags
How to Use Feature Flags
Enable Feature Flags with the CLI
Enable Feature Flags with Environment Variables
Enable Feature Flags with the API
Enable Feature Flags in VS Code
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Formatters Reference
ESLint comes with several built-in formatters to control the appearance of the linting results, and supports third-party formatters as well.
You can specify a formatter using the --format or -f flag in the CLI. For example, --format json uses the json formatter.
The built-in formatter options are:
html
json-with-metadata
json
stylish
Example Source
Examples of each formatter were created from linting fullOfProblems.js using the eslint.config.js configuration shown below.
fullOfProblems.js:
function addOne(i) {
    if (i != NaN) {
        return i ++
    } else {
      return
    }
};








eslint.config.js:
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
	js.configs.recommended,
	{
		rules: {
			"consistent-return": 2,
			"indent"           : [1, 4],
			"no-else-return"   : 1,
			"semi"             : [1, "always"],
			"space-unary-ops"  : 2
		}
	}
]);
















Tests the formatters with the CLI:
npx eslint --format <Add formatter here> fullOfProblems.js


Built-In Formatter Options
html
Outputs results to HTML. The html formatter is useful for visual presentation in the browser.
Example output:
json-with-metadata
Outputs JSON-serialized results. The json-with-metadata provides the same linting results as the json formatter with additional metadata about the rules applied. The linting results are included in the results property and the rules metadata is included in the metadata property.
Alternatively, you can use the ESLint Node.js API to programmatically use ESLint.
Example output (formatted for easier reading):
{
    "results": [
        {
            "filePath": "/var/lib/jenkins/workspace/eslint Release/eslint/fullOfProblems.js",
            "messages": [
                {
                    "ruleId": "no-unused-vars",
                    "severity": 2,
                    "message": "'addOne' is defined but never used.",
                    "line": 1,
                    "column": 10,
                    "nodeType": "Identifier",
                    "messageId": "unusedVar",
                    "endLine": 1,
                    "endColumn": 16,
                    "suggestions": [
                        {
                            "messageId": "removeVar",
                            "data": {
                                "varName": "addOne"
                            },
                            "fix": {
                                "range": [
                                    0,
                                    94
                                ],
                                "text": ""
                            },
                            "desc": "Remove unused variable 'addOne'."
                        }
                    ]
                },
                {
                    "ruleId": "use-isnan",
                    "severity": 2,
                    "message": "Use the isNaN function to compare with NaN.",
                    "line": 2,
                    "column": 9,
                    "nodeType": "BinaryExpression",
                    "messageId": "comparisonWithNaN",
                    "endLine": 2,
                    "endColumn": 17,
                    "suggestions": [
                        {
                            "messageId": "replaceWithIsNaN",
                            "fix": {
                                "range": [
                                    29,
                                    37
                                ],
                                "text": "!Number.isNaN(i)"
                            },
                            "desc": "Replace with Number.isNaN."
                        },
                        {
                            "messageId": "replaceWithCastingAndIsNaN",
                            "fix": {
                                "range": [
                                    29,
                                    37
                                ],
                                "text": "!Number.isNaN(Number(i))"
                            },
                            "desc": "Replace with Number.isNaN and cast to a Number."
                        }
                    ]
                },
                {
                    "ruleId": "space-unary-ops",
                    "severity": 2,
                    "message": "Unexpected space before unary operator '++'.",
                    "line": 3,
                    "column": 16,
                    "nodeType": "UpdateExpression",
                    "messageId": "unexpectedBefore",
                    "endLine": 3,
                    "endColumn": 20,
                    "fix": {
                        "range": [
                            57,
                            58
                        ],
                        "text": ""
                    }
                },
                {
                    "ruleId": "semi",
                    "severity": 1,
                    "message": "Missing semicolon.",
                    "line": 3,
                    "column": 20,
                    "nodeType": "ReturnStatement",
                    "messageId": "missingSemi",
                    "endLine": 4,
                    "endColumn": 1,
                    "fix": {
                        "range": [
                            60,
                            60
                        ],
                        "text": ";"
                    }
                },
                {
                    "ruleId": "no-else-return",
                    "severity": 1,
                    "message": "Unnecessary 'else' after 'return'.",
                    "line": 4,
                    "column": 12,
                    "nodeType": "BlockStatement",
                    "messageId": "unexpected",
                    "endLine": 6,
                    "endColumn": 6,
                    "fix": {
                        "range": [
                            0,
                            94
                        ],
                        "text": "function addOne(i) {\n    if (i != NaN) {\n        return i ++\n    } \n      return\n    \n}"
                    }
                },
                {
                    "ruleId": "indent",
                    "severity": 1,
                    "message": "Expected indentation of 8 spaces but found 6.",
                    "line": 5,
                    "column": 1,
                    "nodeType": "Keyword",
                    "messageId": "wrongIndentation",
                    "endLine": 5,
                    "endColumn": 7,
                    "fix": {
                        "range": [
                            74,
                            80
                        ],
                        "text": "        "
                    }
                },
                {
                    "ruleId": "consistent-return",
                    "severity": 2,
                    "message": "Function 'addOne' expected a return value.",
                    "line": 5,
                    "column": 7,
                    "nodeType": "ReturnStatement",
                    "messageId": "missingReturnValue",
                    "endLine": 5,
                    "endColumn": 13
                },
                {
                    "ruleId": "semi",
                    "severity": 1,
                    "message": "Missing semicolon.",
                    "line": 5,
                    "column": 13,
                    "nodeType": "ReturnStatement",
                    "messageId": "missingSemi",
                    "endLine": 6,
                    "endColumn": 1,
                    "fix": {
                        "range": [
                            86,
                            86
                        ],
                        "text": ";"
                    }
                }
            ],
            "suppressedMessages": [],
            "errorCount": 4,
            "fatalErrorCount": 0,
            "warningCount": 4,
            "fixableErrorCount": 1,
            "fixableWarningCount": 4,
            "source": "function addOne(i) {\n    if (i != NaN) {\n        return i ++\n    } else {\n      return\n    }\n};"
        }
    ],
    "metadata": {
        "rulesMeta": {
            "no-else-return": {
                "type": "suggestion",
                "defaultOptions": [
                    {
                        "allowElseIf": true
                    }
                ],
                "docs": {
                    "description": "Disallow `else` blocks after `return` statements in `if` statements",
                    "recommended": false,
                    "frozen": true,
                    "url": "https://eslint.org/docs/latest/rules/no-else-return"
                },
                "schema": [
                    {
                        "type": "object",
                        "properties": {
                            "allowElseIf": {
                                "type": "boolean"
                            }
                        },
                        "additionalProperties": false
                    }
                ],
                "fixable": "code",
                "messages": {
                    "unexpected": "Unnecessary 'else' after 'return'."
                }
            },
            "indent": {
                "deprecated": {
                    "message": "Formatting rules are being moved out of ESLint core.",
                    "url": "https://eslint.org/blog/2023/10/deprecating-formatting-rules/",
                    "deprecatedSince": "8.53.0",
                    "availableUntil": "10.0.0",
                    "replacedBy": [
                        {
                            "message": "ESLint Stylistic now maintains deprecated stylistic core rules.",
                            "url": "https://eslint.style/guide/migration",
                            "plugin": {
                                "name": "@stylistic/eslint-plugin",
                                "url": "https://eslint.style"
                            },
                            "rule": {
                                "name": "indent",
                                "url": "https://eslint.style/rules/indent"
                            }
                        }
                    ]
                },
                "type": "layout",
                "docs": {
                    "description": "Enforce consistent indentation",
                    "recommended": false,
                    "url": "https://eslint.org/docs/latest/rules/indent"
                },
                "fixable": "whitespace",
                "schema": [
                    {
                        "oneOf": [
                            {
                                "enum": [
                                    "tab"
                                ]
                            },
                            {
                                "type": "integer",
                                "minimum": 0
                            }
                        ]
                    },
                    {
                        "type": "object",
                        "properties": {
                            "SwitchCase": {
                                "type": "integer",
                                "minimum": 0,
                                "default": 0
                            },
                            "VariableDeclarator": {
                                "oneOf": [
                                    {
                                        "oneOf": [
                                            {
                                                "type": "integer",
                                                "minimum": 0
                                            },
                                            {
                                                "enum": [
                                                    "first",
                                                    "off"
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "object",
                                        "properties": {
                                            "var": {
                                                "oneOf": [
                                                    {
                                                        "type": "integer",
                                                        "minimum": 0
                                                    },
                                                    {
                                                        "enum": [
                                                            "first",
                                                            "off"
                                                        ]
                                                    }
                                                ]
                                            },
                                            "let": {
                                                "oneOf": [
                                                    {
                                                        "type": "integer",
                                                        "minimum": 0
                                                    },
                                                    {
                                                        "enum": [
                                                            "first",
                                                            "off"
                                                        ]
                                                    }
                                                ]
                                            },
                                            "const": {
                                                "oneOf": [
                                                    {
                                                        "type": "integer",
                                                        "minimum": 0
                                                    },
                                                    {
                                                        "enum": [
                                                            "first",
                                                            "off"
                                                        ]
                                                    }
                                                ]
                                            }
                                        },
                                        "additionalProperties": false
                                    }
                                ]
                            },
                            "outerIIFEBody": {
                                "oneOf": [
                                    {
                                        "type": "integer",
                                        "minimum": 0
                                    },
                                    {
                                        "enum": [
                                            "off"
                                        ]
                                    }
                                ]
                            },
                            "MemberExpression": {
                                "oneOf": [
                                    {
                                        "type": "integer",
                                        "minimum": 0
                                    },
                                    {
                                        "enum": [
                                            "off"
                                        ]
                                    }
                                ]
                            },
                            "FunctionDeclaration": {
                                "type": "object",
                                "properties": {
                                    "parameters": {
                                        "oneOf": [
                                            {
                                                "type": "integer",
                                                "minimum": 0
                                            },
                                            {
                                                "enum": [
                                                    "first",
                                                    "off"
                                                ]
                                            }
                                        ]
                                    },
                                    "body": {
                                        "type": "integer",
                                        "minimum": 0
                                    }
                                },
                                "additionalProperties": false
                            },
                            "FunctionExpression": {
                                "type": "object",
                                "properties": {
                                    "parameters": {
                                        "oneOf": [
                                            {
                                                "type": "integer",
                                                "minimum": 0
                                            },
                                            {
                                                "enum": [
                                                    "first",
                                                    "off"
                                                ]
                                            }
                                        ]
                                    },
                                    "body": {
                                        "type": "integer",
                                        "minimum": 0
                                    }
                                },
                                "additionalProperties": false
                            },
                            "StaticBlock": {
                                "type": "object",
                                "properties": {
                                    "body": {
                                        "type": "integer",
                                        "minimum": 0
                                    }
                                },
                                "additionalProperties": false
                            },
                            "CallExpression": {
                                "type": "object",
                                "properties": {
                                    "arguments": {
                                        "oneOf": [
                                            {
                                                "type": "integer",
                                                "minimum": 0
                                            },
                                            {
                                                "enum": [
                                                    "first",
                                                    "off"
                                                ]
                                            }
                                        ]
                                    }
                                },
                                "additionalProperties": false
                            },
                            "ArrayExpression": {
                                "oneOf": [
                                    {
                                        "type": "integer",
                                        "minimum": 0
                                    },
                                    {
                                        "enum": [
                                            "first",
                                            "off"
                                        ]
                                    }
                                ]
                            },
                            "ObjectExpression": {
                                "oneOf": [
                                    {
                                        "type": "integer",
                                        "minimum": 0
                                    },
                                    {
                                        "enum": [
                                            "first",
                                            "off"
                                        ]
                                    }
                                ]
                            },
                            "ImportDeclaration": {
                                "oneOf": [
                                    {
                                        "type": "integer",
                                        "minimum": 0
                                    },
                                    {
                                        "enum": [
                                            "first",
                                            "off"
                                        ]
                                    }
                                ]
                            },
                            "flatTernaryExpressions": {
                                "type": "boolean",
                                "default": false
                            },
                            "offsetTernaryExpressions": {
                                "type": "boolean",
                                "default": false
                            },
                            "ignoredNodes": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                    "not": {
                                        "pattern": ":exit$"
                                    }
                                }
                            },
                            "ignoreComments": {
                                "type": "boolean",
                                "default": false
                            }
                        },
                        "additionalProperties": false
                    }
                ],
                "messages": {
                    "wrongIndentation": "Expected indentation of  but found ."
                }
            },
            "space-unary-ops": {
                "deprecated": {
                    "message": "Formatting rules are being moved out of ESLint core.",
                    "url": "https://eslint.org/blog/2023/10/deprecating-formatting-rules/",
                    "deprecatedSince": "8.53.0",
                    "availableUntil": "10.0.0",
                    "replacedBy": [
                        {
                            "message": "ESLint Stylistic now maintains deprecated stylistic core rules.",
                            "url": "https://eslint.style/guide/migration",
                            "plugin": {
                                "name": "@stylistic/eslint-plugin",
                                "url": "https://eslint.style"
                            },
                            "rule": {
                                "name": "space-unary-ops",
                                "url": "https://eslint.style/rules/space-unary-ops"
                            }
                        }
                    ]
                },
                "type": "layout",
                "docs": {
                    "description": "Enforce consistent spacing before or after unary operators",
                    "recommended": false,
                    "url": "https://eslint.org/docs/latest/rules/space-unary-ops"
                },
                "fixable": "whitespace",
                "schema": [
                    {
                        "type": "object",
                        "properties": {
                            "words": {
                                "type": "boolean",
                                "default": true
                            },
                            "nonwords": {
                                "type": "boolean",
                                "default": false
                            },
                            "overrides": {
                                "type": "object",
                                "additionalProperties": {
                                    "type": "boolean"
                                }
                            }
                        },
                        "additionalProperties": false
                    }
                ],
                "messages": {
                    "unexpectedBefore": "Unexpected space before unary operator ''.",
                    "unexpectedAfter": "Unexpected space after unary operator ''.",
                    "unexpectedAfterWord": "Unexpected space after unary word operator ''.",
                    "wordOperator": "Unary word operator '' must be followed by whitespace.",
                    "operator": "Unary operator '' must be followed by whitespace.",
                    "beforeUnaryExpressions": "Space is required before unary expressions ''."
                }
            },
            "semi": {
                "deprecated": {
                    "message": "Formatting rules are being moved out of ESLint core.",
                    "url": "https://eslint.org/blog/2023/10/deprecating-formatting-rules/",
                    "deprecatedSince": "8.53.0",
                    "availableUntil": "10.0.0",
                    "replacedBy": [
                        {
                            "message": "ESLint Stylistic now maintains deprecated stylistic core rules.",
                            "url": "https://eslint.style/guide/migration",
                            "plugin": {
                                "name": "@stylistic/eslint-plugin",
                                "url": "https://eslint.style"
                            },
                            "rule": {
                                "name": "semi",
                                "url": "https://eslint.style/rules/semi"
                            }
                        }
                    ]
                },
                "type": "layout",
                "docs": {
                    "description": "Require or disallow semicolons instead of ASI",
                    "recommended": false,
                    "url": "https://eslint.org/docs/latest/rules/semi"
                },
                "fixable": "code",
                "schema": {
                    "anyOf": [
                        {
                            "type": "array",
                            "items": [
                                {
                                    "enum": [
                                        "never"
                                    ]
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "beforeStatementContinuationChars": {
                                            "enum": [
                                                "always",
                                                "any",
                                                "never"
                                            ]
                                        }
                                    },
                                    "additionalProperties": false
                                }
                            ],
                            "minItems": 0,
                            "maxItems": 2
                        },
                        {
                            "type": "array",
                            "items": [
                                {
                                    "enum": [
                                        "always"
                                    ]
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "omitLastInOneLineBlock": {
                                            "type": "boolean"
                                        },
                                        "omitLastInOneLineClassBody": {
                                            "type": "boolean"
                                        }
                                    },
                                    "additionalProperties": false
                                }
                            ],
                            "minItems": 0,
                            "maxItems": 2
                        }
                    ]
                },
                "messages": {
                    "missingSemi": "Missing semicolon.",
                    "extraSemi": "Extra semicolon."
                }
            },
            "consistent-return": {
                "type": "suggestion",
                "docs": {
                    "description": "Require `return` statements to either always or never specify values",
                    "recommended": false,
                    "url": "https://eslint.org/docs/latest/rules/consistent-return"
                },
                "schema": [
                    {
                        "type": "object",
                        "properties": {
                            "treatUndefinedAsUnspecified": {
                                "type": "boolean"
                            }
                        },
                        "additionalProperties": false
                    }
                ],
                "defaultOptions": [
                    {
                        "treatUndefinedAsUnspecified": false
                    }
                ],
                "messages": {
                    "missingReturn": "Expected to return a value at the end of .",
                    "missingReturnValue": " expected a return value.",
                    "unexpectedReturnValue": " expected no return value."
                }
            }
        }
    }
}






































































































































































































































































































































































































































































































































































































































































































json
Outputs JSON-serialized results. The json formatter is useful when you want to programmatically work with the CLI's linting results.
Alternatively, you can use the ESLint Node.js API to programmatically use ESLint.
Example output (formatted for easier reading):
[
    {
        "filePath": "/var/lib/jenkins/workspace/eslint Release/eslint/fullOfProblems.js",
        "messages": [
            {
                "ruleId": "no-unused-vars",
                "severity": 2,
                "message": "'addOne' is defined but never used.",
                "line": 1,
                "column": 10,
                "nodeType": "Identifier",
                "messageId": "unusedVar",
                "endLine": 1,
                "endColumn": 16,
                "suggestions": [
                    {
                        "messageId": "removeVar",
                        "data": {
                            "varName": "addOne"
                        },
                        "fix": {
                            "range": [
                                0,
                                94
                            ],
                            "text": ""
                        },
                        "desc": "Remove unused variable 'addOne'."
                    }
                ]
            },
            {
                "ruleId": "use-isnan",
                "severity": 2,
                "message": "Use the isNaN function to compare with NaN.",
                "line": 2,
                "column": 9,
                "nodeType": "BinaryExpression",
                "messageId": "comparisonWithNaN",
                "endLine": 2,
                "endColumn": 17,
                "suggestions": [
                    {
                        "messageId": "replaceWithIsNaN",
                        "fix": {
                            "range": [
                                29,
                                37
                            ],
                            "text": "!Number.isNaN(i)"
                        },
                        "desc": "Replace with Number.isNaN."
                    },
                    {
                        "messageId": "replaceWithCastingAndIsNaN",
                        "fix": {
                            "range": [
                                29,
                                37
                            ],
                            "text": "!Number.isNaN(Number(i))"
                        },
                        "desc": "Replace with Number.isNaN and cast to a Number."
                    }
                ]
            },
            {
                "ruleId": "space-unary-ops",
                "severity": 2,
                "message": "Unexpected space before unary operator '++'.",
                "line": 3,
                "column": 16,
                "nodeType": "UpdateExpression",
                "messageId": "unexpectedBefore",
                "endLine": 3,
                "endColumn": 20,
                "fix": {
                    "range": [
                        57,
                        58
                    ],
                    "text": ""
                }
            },
            {
                "ruleId": "semi",
                "severity": 1,
                "message": "Missing semicolon.",
                "line": 3,
                "column": 20,
                "nodeType": "ReturnStatement",
                "messageId": "missingSemi",
                "endLine": 4,
                "endColumn": 1,
                "fix": {
                    "range": [
                        60,
                        60
                    ],
                    "text": ";"
                }
            },
            {
                "ruleId": "no-else-return",
                "severity": 1,
                "message": "Unnecessary 'else' after 'return'.",
                "line": 4,
                "column": 12,
                "nodeType": "BlockStatement",
                "messageId": "unexpected",
                "endLine": 6,
                "endColumn": 6,
                "fix": {
                    "range": [
                        0,
                        94
                    ],
                    "text": "function addOne(i) {\n    if (i != NaN) {\n        return i ++\n    } \n      return\n    \n}"
                }
            },
            {
                "ruleId": "indent",
                "severity": 1,
                "message": "Expected indentation of 8 spaces but found 6.",
                "line": 5,
                "column": 1,
                "nodeType": "Keyword",
                "messageId": "wrongIndentation",
                "endLine": 5,
                "endColumn": 7,
                "fix": {
                    "range": [
                        74,
                        80
                    ],
                    "text": "        "
                }
            },
            {
                "ruleId": "consistent-return",
                "severity": 2,
                "message": "Function 'addOne' expected a return value.",
                "line": 5,
                "column": 7,
                "nodeType": "ReturnStatement",
                "messageId": "missingReturnValue",
                "endLine": 5,
                "endColumn": 13
            },
            {
                "ruleId": "semi",
                "severity": 1,
                "message": "Missing semicolon.",
                "line": 5,
                "column": 13,
                "nodeType": "ReturnStatement",
                "messageId": "missingSemi",
                "endLine": 6,
                "endColumn": 1,
                "fix": {
                    "range": [
                        86,
                        86
                    ],
                    "text": ";"
                }
            }
        ],
        "suppressedMessages": [],
        "errorCount": 4,
        "fatalErrorCount": 0,
        "warningCount": 4,
        "fixableErrorCount": 1,
        "fixableWarningCount": 4,
        "source": "function addOne(i) {\n    if (i != NaN) {\n        return i ++\n    } else {\n      return\n    }\n};"
    }
]


















































































































































































stylish
Human-readable output format. This is the default formatter.
Example output:

/var/lib/jenkins/workspace/eslint Release/eslint/fullOfProblems.js
  1:10  error    'addOne' is defined but never used            no-unused-vars
  2:9   error    Use the isNaN function to compare with NaN    use-isnan
  3:16  error    Unexpected space before unary operator '++'   space-unary-ops
  3:20  warning  Missing semicolon                             semi
  4:12  warning  Unnecessary 'else' after 'return'             no-else-return
  5:1   warning  Expected indentation of 8 spaces but found 6  indent
  5:7   error    Function 'addOne' expected a return value     consistent-return
  5:13  warning  Missing semicolon                             semi

✖ 8 problems (4 errors, 4 warnings)
  1 error and 4 warnings potentially fixable with the `--fix` option.
















Edit this page
Table of Contents
Example Source
Built-In Formatter Options
html
json-with-metadata
json
stylish
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Bulk Suppressions
Enabling a new lint rule as "error" can be challenging when the codebase has many violations and the rule isn’t auto-fixable. Unless the rule is enabled during the early stages of the project, it becomes harder and harder to enable it as the codebase grows. Existing violations must be resolved before enabling the rule, but while doing that other violations may occur.
To address this, ESLint provides a way to suppress existing violations for one or more rules. While the rule will be enforced for new code, the existing violations will not be reported. This way, you can address the existing violations at your own pace.
Important
Only rules configured as "error" are suppressed. If a rule is enabled as "warn", ESLint will not suppress the violations.
After you enable a rule as "error" in your configuration file, you can suppress all the existing violations at once by using the --suppress-all flag. It is recommended to execute the command with the --fix flag so that you don’t suppress violations that can be auto-fixed.
eslint --fix --suppress-all


This command will suppress all the existing violations of all the rules that are enabled as "error". Running the eslint command again will not report these violations.
If you would like to suppress violations of a specific rule, you can use the --suppress-rule flag.
eslint --fix --suppress-rule no-unused-expressions


You can also suppress violations of multiple rules by providing multiple rule names.
eslint --fix --suppress-rule no-unused-expressions --suppress-rule no-unsafe-assignment


Suppressions File
When you suppress violations, ESLint creates a eslint-suppressions.json file in the root of the project. This file contains the list of rules that have been suppressed. You should commit this file to the repository so that the suppressions are shared with all the developers.
If necessary, you can change the location of the suppressions file by using the --suppressions-location argument. Note that the argument must be provided not only when suppressing violations but also when running ESLint. This is necessary so that ESLint picks up the correct suppressions file.
eslint --suppressions-location .github/.eslint-suppressions


Resolving Suppressions
You can address any of the reported violations by making the necessary changes to the code as usual. If you run ESLint again you will notice that it exits with a non-zero exit code and an error is reported about unused suppressions. This is because the violations have been resolved but the suppressions are still in place.
> eslint
There are suppressions left that do not occur anymore. Consider re-running the command with `--prune-suppressions`.



To remove the suppressions that are no longer needed, you can use the --prune-suppressions flag.
eslint --prune-suppressions


To ignore unused suppressions when calculating the exit code and not report an error about unused suppressions, you can use the --pass-on-unpruned-suppressions flag.
eslint --pass-on-unpruned-suppressions


For more information on the available CLI options, refer to Command Line Interface.
Edit this page
Table of Contents
Suppressions File
Resolving Suppressions
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Integrations
This page contains community projects that have integrated ESLint. The projects on this page are not maintained by the ESLint team.
If you would like to recommend an integration to be added to this page, submit a pull request.
Editors
Sublime Text 3:
SublimeLinter-eslint
Build Next
Vim:
ALE
Syntastic
Neovim:
nvim-lspconfig
nvim-lint
Emacs: Flycheck supports ESLint with the javascript-eslint checker.
Eclipse Orion: ESLint is the default linter
Eclipse IDE: Tern ESLint linter
TextMate 2:
eslint.tmbundle
javascript-eslint.tmbundle
IntelliJ IDEA, WebStorm, PhpStorm, PyCharm, RubyMine, and other JetBrains IDEs: How to use ESLint
Visual Studio: Linting JavaScript in VS
Visual Studio Code: ESLint Extension
Brackets: Included and Brackets ESLint
Build tools
Grunt: grunt-eslint
Webpack: eslint-webpack-plugin
Rollup: @rollup/plugin-eslint
Command Line Tools
ESLint Watch
Code Climate CLI
ESLint Nibble
Source Control
Git Precommit Hook
Git pre-commit hook that only lints staged changes
overcommit Git hook manager
Mega-Linter: Linters aggregator for CI, embedding eslint
Other Integration Lists
You can find a curated list of other popular integrations for ESLint in the awesome-eslint GitHub repository.
Edit this page
Table of Contents
Editors
Build tools
Command Line Tools
Source Control
Other Integration Lists
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Migrate to v9.x
ESLint v9.0.0 is a major release of ESLint, and as such, has several breaking changes that you need to be aware of. This guide is intended to walk you through the breaking changes.
The lists below are ordered roughly by the number of users each change is expected to affect, where the first items are expected to affect the most users.
Table of Contents
Breaking changes for users
Node.js < v18.18, v19 are no longer supported
New default config format (eslint.config.js)
Removed multiple formatters
Removed require-jsdoc and valid-jsdoc rules
eslint:recommended has been updated
--quiet no longer runs rules set to "warn"
--output-file now writes a file to disk even with an empty output
Change in behavior when no patterns are passed to CLI
/* eslint */ comments with only severity now retain options from the config file
Multiple /* eslint */ comments for the same rule are now disallowed
Stricter /* exported */ parsing
no-constructor-return and no-sequences rule schemas are stricter
New checks in no-implicit-coercion by default
Case-sensitive flags in no-invalid-regexp
varsIgnorePattern option of no-unused-vars no longer applies to catch arguments
no-restricted-imports now accepts multiple config entries with the same name
"eslint:recommended" and "eslint:all" strings no longer accepted in flat config
no-inner-declarations has a new default behavior with a new option
no-unused-vars now defaults caughtErrors to "all"
no-useless-computed-key flags unnecessary computed member names in classes by default
camelcase allow option only accepts an array of strings
Breaking changes for plugin developers
Node.js < v18.18, v19 are no longer supported
Removed multiple context methods
Removed sourceCode.getComments()
Removed CodePath#currentSegments
Code paths are now precalculated
Function-style rules are no longer supported
meta.schema is required for rules with options
FlatRuleTester is now RuleTester
Stricter RuleTester checks
Breaking changes for integration developers
Node.js < v18.18, v19 are no longer supported
FlatESLint is now ESLint
Linter now expects flat config format

Node.js < v18.18, v19 are no longer supported
ESLint is officially dropping support for these versions of Node.js starting with ESLint v9.0.0. ESLint now supports the following versions of Node.js:
Node.js v18.18.0 and above
Node.js v20.9.0 and above
Node.js v21 and above
To address: Make sure you upgrade to at least Node.js v18.18.0 when using ESLint v9.0.0. One important thing to double check is the Node.js version supported by your editor when using ESLint via editor integrations. If you are unable to upgrade, we recommend continuing to use ESLint v8.56.0 until you are able to upgrade Node.js.
Related issue(s): #17595
New default config format (eslint.config.js)
As announced in our blog post, in ESLint v9.0.0, eslint.config.js is the new default configuration format. The previous format, eslintrc, is now deprecated and will not automatically be searched for.
To address: Update your configuration to the new format following the Configuration Migration Guide. In case you still need to use the deprecated eslintrc config format, set environment variable ESLINT_USE_FLAT_CONFIG to false.
Related Issues(s): #13481
Removed multiple formatters
ESLint v9.0.0 has removed the following formatters from the core:
Removed Formatter
Replacement npm Package
checkstyle
eslint-formatter-checkstyle
compact
eslint-formatter-compact
jslint-xml
eslint-formatter-jslint-xml
junit
eslint-formatter-junit
tap
eslint-formatter-tap
unix
eslint-formatter-unix
visualstudio
eslint-formatter-visualstudio

To address: If you are using any of these formatters via the -f command line flag, you’ll need to install the respective package for the formatter.
Related issue(s): #17524
Removed require-jsdoc and valid-jsdoc rules
The require-jsdoc and valid-jsdoc rules have been removed in ESLint v9.0.0. These rules were initially deprecated in 2018.
To address: Use the replacement rules in eslint-plugin-jsdoc.
Related issue(s): #15820
eslint:recommended has been updated
Four new rules have been enabled in eslint:recommended:
no-constant-binary-expression
no-empty-static-block
no-new-native-nonconstructor
no-unused-private-class-members
Additionally, the following rules have been removed from eslint:recommended:
no-extra-semi
no-inner-declarations
no-mixed-spaces-and-tabs
no-new-symbol
To address: Fix errors or disable these rules.
Related issue(s): #15576, #17446, #17596
--quiet no longer runs rules set to "warn"
Prior to ESLint v9.0.0, the --quiet CLI flag would run all rules set to either "error" or "warn" and then hide the results from rules set to "warn". In ESLint v9.0.0, --quiet will prevent rules from being executed when set to "warn". This can result in a performance improvement for configurations containing many rules set to "warn".
If --max-warnings is used then --quiet will not suppress the execution of rules set to "warn" but the output of those rules will be suppressed.
To address: In most cases, this change is transparent. If, however, you are running a rule set to "warn" that makes changes to the data available to other rules (for example, if the rule uses sourceCode.markVariableAsUsed()), then this can result in a behavior change. In such a case, you’ll need to either set the rule to "error" or stop using --quiet.
Related issue(s): #16450
--output-file now writes a file to disk even with an empty output
Prior to ESLint v9.0.0, the --output-file flag would skip writing a file to disk if the output was empty. However, in ESLint v9.0.0, --output-file now consistently writes a file to disk, even when the output is empty. This update ensures a more consistent and reliable behavior for --output-file.
To address: Review your usage of the --output-file flag, especially if your processes depend on the file’s presence or absence based on output content. If necessary, update your scripts or configurations to accommodate this change.
Related Issues(s): #17660
Change in behavior when no patterns are passed to CLI
Prior to ESLint v9.0.0, running the ESLint CLI without any file or directory patterns would result in no files being linted and would exit with code 0. This was confusing because it wasn’t clear that nothing had actually happened. In ESLint v9.0.0, this behavior has been updated:
Flat config. If you are using flat config, you can run npx eslint or eslint (if globally installed) and ESLint will assume you want to lint the current directory. Effectively, passing no patterns is equivalent to passing ..
eslintrc. If you are using the deprecated eslintrc config, you’ll now receive an error when running the CLI without any patterns.
To address: In most cases, no change is necessary, and you may find some locations where you thought ESLint was running but it wasn’t. If you’d like to keep the v8.x behavior, where passing no patterns results in ESLint exiting with code 0, add the --pass-on-no-patterns flag to the CLI call.
Related issue(s): #14308
/* eslint */ comments with only severity now retain options from the config file
Prior to ESLint v9.0.0, configuration comments such as /* eslint curly: "warn" */ or /* eslint curly: ["warn"] */ would completely override any configuration specified for the rule in the config file, and thus enforce the default options of the rule.
In ESLint v9.0.0, the behavior of configuration comments is aligned with how rule configurations in config files are merged, meaning that a configuration comment with only severity now retains options specified in the config file and just overrides the severity.
For example, if you have the following config file:
// eslint.config.js

export default [
	{
		rules: {
			curly: ["error", "multi"],
		},
	},
];










and the following configuration comment:
// my-file.js

/* eslint curly: "warn" */




the resulting configuration for the curly rule when linting my-file.js will be curly: ["warn", "multi"].
Note that this change only affects cases where the same rule is configured in the config file with options and using a configuration comment without options. In all other cases (e.g. the rule is only configured using a configuration comment), the behavior remains the same as prior to ESLint v9.0.0.
To address: We expect that in most cases no change is necessary, as rules configured using configuration comments are typically not already configured in the config file. However, if you need a configuration comment to completely override configuration from the config file and enforce the default options, you’ll need to specify at least one option:
// my-file.js

/* eslint curly: ["warn", "all"] */




Related issue(s): #17381
Multiple /* eslint */ comments for the same rule are now disallowed
Prior to ESLint v9.0.0, if the file being linted contained multiple /* eslint */ configuration comments for the same rule, the last one would be applied, while the others would be silently ignored. For example:
/* eslint semi: ["error", "always"] */
/* eslint semi: ["error", "never"] */

foo(); // valid, because the configuration is "never"





In ESLint v9.0.0, the first one is applied, while the others are reported as lint errors:
/* eslint semi: ["error", "always"] */
/* eslint semi: ["error", "never"] */ // error: Rule "semi" is already configured by another configuration comment in the preceding code. This configuration is ignored.

foo(); // error: Missing semicolon





To address: Remove duplicate /* eslint */ comments.
Related issue(s): #18132
Stricter /* exported */ parsing
Prior to ESLint v9.0.0, the /* exported */ directive incorrectly allowed the following syntax:
/* exported foo: true, bar: false */

// and

/* exported foo bar */






The true and false in this example had no effect on ESLint’s behavior, and in fact, was a parsing bug.
In ESLint v9.0.0, any /* exported */ variables followed by a colon and value will be ignored as invalid.
To address: Update any /* exported */ directives to eliminate the colons and subsequent values, and ensure there are commas between variable names such as:
/* exported foo, bar */


Related issue(s): #17622
no-constructor-return and no-sequences rule schemas are stricter
In previous versions of ESLint, no-constructor-return and no-sequences rules were mistakenly accepting invalid options.
This has been fixed in ESLint v9.0.0:
The no-constructor-return rule does not accept any options.
The no-sequences rule can take one option, an object with a property "allowInParentheses" (boolean).
{
	"rules": {
		"no-constructor-return": ["error"],
		"no-sequences": ["error", { "allowInParentheses": false }]
	}
}







To address: If ESLint reports invalid configuration for any of these rules, update your configuration.
Related issue(s): #16879
New checks in no-implicit-coercion by default
In ESLint v9.0.0, the no-implicit-coercion rule additionally reports the following cases by default:
-(-foo);
foo - 0;



To address: If you want to retain the previous behavior of this rule, set "allow": ["-", "- -"].
{
	"rules": {
		"no-implicit-coercion": [2, { "allow": ["-", "- -"] }]
	}
}






Related issue(s): #17832
Case-sensitive flags in no-invalid-regexp
In ESLint v9.0.0, the option allowConstructorFlags is now case-sensitive.
To address: Update your configuration if needed.
Related issue(s): #16574
varsIgnorePattern option of no-unused-vars no longer applies to catch arguments
In previous versions of ESLint, the varsIgnorePattern option of no-unused-vars incorrectly ignored errors specified in a catch clause. In ESLint v9.0.0, varsIgnorePattern no longer applies to errors in catch clauses. For example:
/*eslint no-unused-vars: ["error", { "caughtErrors": "all", "varsIgnorePattern": "^err" }]*/

try {
	//...
} catch (err) {
	// 'err' will be reported.
	console.error("errors");
}









To address: If you want to specify ignore patterns for catch clause variable names, use the caughtErrorsIgnorePattern option in addition to varsIgnorePattern.
Related issue(s): #17540
no-restricted-imports now accepts multiple config entries with the same name
In previous versions of ESLint, if multiple entries in the paths array of your configuration for the no-restricted-imports rule had the same name property, only the last one would apply, while the previous ones would be ignored.
As of ESLint v9.0.0, all entries apply, allowing for specifying different messages for different imported names. For example, you can now configure the rule like this:
{
    rules: {
        "no-restricted-imports": ["error", {
            paths: [
                {
                    name: "react-native",
                    importNames: ["Text"],
                    message: "import 'Text' from 'ui/_components' instead"
                },
                {
                    name: "react-native",
                    importNames: ["View"],
                    message: "import 'View' from 'ui/_components' instead"
                }
            ]
        }]
    }
}



















and both import { Text } from "react-native" and import { View } from "react-native" will be reported, with different messages.
In previous versions of ESLint, with this configuration only import { View } from "react-native" would be reported.
To address: If your configuration for this rule has multiple entries with the same name, you may need to remove unintentional ones.
Related issue(s): #15261
"eslint:recommended" and "eslint:all" no longer accepted in flat config
In ESLint v8.x, eslint.config.js could refer to "eslint:recommended" and "eslint:all" configurations by inserting a string into the config array, as in this example:
// eslint.config.js
export default ["eslint:recommended", "eslint:all"];



In ESLint v9.0.0, this format is no longer supported and will result in an error.
To address: Use the @eslint/js package instead:
// eslint.config.js
import js from "@eslint/js";

export default [js.configs.recommended, js.configs.all];





Related issue(s): #17488
no-inner-declarations has a new default behavior with a new option
ESLint v9.0.0 introduces a new option in no-inner-declarations rule called blockScopeFunctions which by default allows block-level functions in strict mode when languageOptions.ecmaVersion is set to 2015 or above.
/*eslint no-inner-declarations: "error"*/
"use strict";

if (test) {
	function foo() {} // no error
}







To address: If you want to report the block-level functions in every condition regardless of strict or non-strict mode, set the blockScopeFunctions option to "disallow".
Related issue(s): #15576
no-unused-vars now defaults caughtErrors to "all"
ESLint v9.0.0 changes the default value for the no-unused-vars rule’s caughtErrors option. Previously it defaulted to "none" to never check whether caught errors were used. It now defaults to "all" to check caught errors for being used.
/*eslint no-unused-vars: "error"*/
try {
} catch (error) {
	// 'error' is defined but never used
}






To address: If you want to allow unused caught errors, such as when writing code that will be directly run in an environment that does not support ES2019 optional catch bindings, set the caughtErrors option to "none". Otherwise, delete the unused caught errors.
/*eslint no-unused-vars: "error"*/
try {
} catch {
	// no error
}






Related issue(s): #17974
no-useless-computed-key flags unnecessary computed member names in classes by default
In ESLint v9.0.0, the default value of the enforceForClassMembers option of the no-useless-computed-key rule was changed from false to true. The effect of this change is that unnecessary computed member names in classes will be flagged by default.
/*eslint no-useless-computed-key: "error"*/

class SomeClass {
	["someMethod"]() {} // ok in ESLint v8, error in ESLint v9.
}






To address: Fix the problems reported by the rule or revert to the previous behavior by setting the enforceForClassMembers option to false.
Related issue(s): #18042
camelcase allow option only accepts an array of strings
Previously the camelcase rule didn’t enforce the allow option to be an array of strings. In ESLint v9.0.0, the allow option now only accepts an array of strings.
To address: If ESLint reports invalid configuration for this rule, update your configuration.
Related issue(s): #18232
Removed multiple context methods
ESLint v9.0.0 removes multiple deprecated methods from the context object and moves them onto the SourceCode object:
Removed on context
Replacement(s) on SourceCode
context.getSource()
sourceCode.getText()
context.getSourceLines()
sourceCode.getLines()
context.getAllComments()
sourceCode.getAllComments()
context.getNodeByRangeIndex()
sourceCode.getNodeByRangeIndex()
context.getComments()
sourceCode.getCommentsBefore(), sourceCode.getCommentsAfter(), sourceCode.getCommentsInside()
context.getCommentsBefore()
sourceCode.getCommentsBefore()
context.getCommentsAfter()
sourceCode.getCommentsAfter()
context.getCommentsInside()
sourceCode.getCommentsInside()
context.getJSDocComment()
sourceCode.getJSDocComment()
context.getFirstToken()
sourceCode.getFirstToken()
context.getFirstTokens()
sourceCode.getFirstTokens()
context.getLastToken()
sourceCode.getLastToken()
context.getLastTokens()
sourceCode.getLastTokens()
context.getTokenAfter()
sourceCode.getTokenAfter()
context.getTokenBefore()
sourceCode.getTokenBefore()
context.getTokenByRangeStart()
sourceCode.getTokenByRangeStart()
context.getTokens()
sourceCode.getTokens()
context.getTokensAfter()
sourceCode.getTokensAfter()
context.getTokensBefore()
sourceCode.getTokensBefore()
context.getTokensBetween()
sourceCode.getTokensBetween()
context.parserServices
sourceCode.parserServices
context.getDeclaredVariables()
sourceCode.getDeclaredVariables()

In addition to the methods in the above table, there are several other methods that are also moved but required different method signatures:
Removed on context
Replacement(s) on SourceCode
context.getAncestors()
sourceCode.getAncestors(node)
context.getScope()
sourceCode.getScope(node)
context.markVariableAsUsed(name)
sourceCode.markVariableAsUsed(name, node)

To address: Use the automated upgrade tool as recommended in the blog post.
Related Issues(s): #16999, #13481
Removed sourceCode.getComments()
ESLint v9.0.0 removes the deprecated sourceCode.getComments() method.
To address: Replace with sourceCode.getCommentsBefore(), sourceCode.getCommentsAfter(), or sourceCode.getCommentsInside().
Related Issues(s): #14744
Removed CodePath#currentSegments
ESLint v9.0.0 removes the deprecated CodePath#currentSegments property.
To address: Update your code following the recommendations in the blog post.
Related Issues(s): #17457
Code paths are now precalculated
Prior to ESLint v9.0.0, code paths were calculated during the same AST traversal used by rules, meaning that the information passed to methods like onCodePathStart and onCodePathSegmentStart was incomplete. Specifically, array properties like CodePath#childCodePaths and CodePathSegment#nextSegments began empty and then were filled with the appropriate information as the traversal completed, meaning that those arrays could have different elements depending on when you checked their values.
ESLint v9.0.0 now precalculates code path information before the traversal used by rules. As a result, the code path information is now complete regardless of where it is accessed inside of a rule.
To address: If you are accessing any array properties on CodePath or CodePathSegment, you’ll need to update your code. Specifically:
If you are checking the length of any array properties, ensure you are using relative comparison operators like <, >, <=, and >= instead of equals.
If you are accessing the nextSegments, prevSegments, allNextSegments, or allPrevSegments properties on a CodePathSegment, or CodePath#childCodePaths, verify that your code will still work as expected. To be backwards compatible, consider moving the logic that checks these properties into onCodePathEnd.
Related Issues(s): #16999
Function-style rules are no longer supported
ESLint v9.0.0 drops support for function-style rules. Function-style rules are rules created by exporting a function rather than an object with a create() method. This rule format was deprecated in 2016.
To address: Update your rules to the most recent rule format. For rules written in CommonJS, you can also use eslint-transforms.
The eslint-plugin/prefer-object-rule rule can help enforce the usage of object-style rules and autofix any remaining function-style rules.
Related Issues(s): #14709
meta.schema is required for rules with options
As of ESLint v9.0.0, an error will be thrown if any options are passed to a rule that doesn’t specify meta.schema property.
To address:
If your rule expects options, set meta.schema property to a JSON Schema format description of the rule’s options. This schema will be used by ESLint to validate configured options and prevent invalid or unexpected inputs to your rule.
If your rule doesn’t expect any options, there is no action required. This change ensures that end users will not mistakenly configure options for rules that don’t expect options.
(not recommended) you can also set meta.schema to false to disable this validation, but it is highly recommended to provide a schema if the rule expects options and omit the schema (or set []) if the rule doesn’t expect options so that ESLint can ensure that your users’ configurations are valid.
The eslint-plugin/require-meta-schema rule can help enforce that rules have schemas when required.
Related Issues(s): #14709
FlatRuleTester is now RuleTester
As announced in our blog post, the temporary FlatRuleTester class has been renamed to RuleTester, while the RuleTester class from v8.x has been removed. Additionally, the FlatRuleTester export from eslint/use-at-your-own-risk has been removed.
To address: Update your rule tests to use the new RuleTester. To do so, here are some of the common changes you’ll need to make:
Be aware of new defaults for ecmaVersion and sourceType. By default, RuleTester uses the flat config default of ecmaVersion: "latest" and sourceType: "module". This may cause some tests to break if they were expecting the old default of ecmaVersion: 5 and sourceType: "script". If you’d like to use the old default, you’ll need to manually specify that in your RuleTester like this:
// use eslintrc defaults
const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 5,
		sourceType: "script",
	},
});












Change parserOptions to languageOptions. If you’re setting ecmaVersion or sourceType on your tests, move those from parserOptions to languageOptions, like this:
ruleTester.run("my-rule", myRule, {
	valid: [
		{
			code: "foo",
			parserOptions: {
				ecmaVersion: 6,
			},
		},
	],
});

// becomes

ruleTester.run("my-rule", myRule, {
	valid: [
		{
			code: "foo",
			languageOptions: {
				ecmaVersion: 6,
			},
		},
	],
});




























Translate other config keys. Keys such as env and parser that used to run on the eslintrc config system must be translated into the flat config system. Please refer to the Configuration Migration Guide for details on translating other keys you may be using.
Related Issues(s): #13481
Stricter RuleTester checks
In order to aid in the development of high-quality custom rules that are free from common bugs, ESLint v9.0.0 implements several changes to RuleTester:
Test case output must be different from code. In ESLint v8.x, if output is the same as code, it asserts that there was no autofix. When looking at a test case, it’s not always immediately clear whether output differs from code, especially if the strings are longer or multiline, making it difficult for developers to determine whether or not the test case expects an autofix. In ESLint v9.0.0, to avoid this ambiguity, RuleTester now throws an error if the test output has the same value as the test code. Therefore, specifying output now necessarily means that the test case expects an autofix and asserts its result. If the test case doesn’t expect an autofix, omit the output property or set it to null. This asserts that there was no autofix.
Test error objects must specify message or messageId. To improve the quality of test coverage, RuleTester now throws an error if neither message nor messageId is specified on test error objects.
Test error object must specify suggestions if the actual error provides suggestions. In ESLint v8.x, if the suggestions property was omitted from test error objects, RuleTester wasn’t performing any checks related to suggestions, so it was easy to forget to assert if a test case produces suggestions. In ESLint v9.0.0, omitting the suggestions property asserts that the actual error does not provide suggestions, while you need to specify the suggestions property if the actual error does provide suggestions. We highly recommend that you test suggestions in detail by specifying an array of test suggestion objects, but you can also specify suggestions: <number> to assert just the number of suggestions.
Test suggestion objects must specify output. To improve the quality of test coverage, RuleTester now throws an error if output property is not specified on test suggestion objects.
Test suggestion objects must specify desc or messageId. To improve the quality of test coverage, RuleTester now throws an error if neither desc nor messageId property is specified on test suggestion objects. It’s also not allowed to specify both. If you want to assert the suggestion description text in addition to the messageId, then also add the data property.
Suggestion messages must be unique. Because suggestions are typically displayed in an editor as a dropdown list, it’s important that no two suggestions for the same lint problem have the same message. Otherwise, it’s impossible to know what any given suggestion will do. This additional check runs automatically.
Suggestions must change the code. Suggestions are expected to fix the reported problem by changing the code. RuleTester now throws an error if the suggestion test output is the same as the test code.
Suggestions must generate valid syntax. In order for rule suggestions to be helpful, they need to be valid syntax. RuleTester now parses the output of suggestions using the same language options as the code value and throws an error if parsing fails.
Test cases must be unique. Identical test cases can cause confusion and be hard to detect manually in a long test file. Duplicates are now automatically detected and can be safely removed.
filename and only must be of the expected type. RuleTester now checks the type of filename and only properties of test objects. If specified, filename must be a string value. If specified, only must be a boolean value.
Messages cannot have unsubstituted placeholders. The RuleTester now also checks if there are {{ placeholder }} still in the message as their values were not passed via data in the respective context.report() call.
To address: Run your rule tests using RuleTester and fix any errors that occur. The changes you’ll need to make to satisfy RuleTester are compatible with ESLint v8.x.
Related Issues(s): #15104, #15735, #16908, #18016
FlatESLint is now ESLint
As announced in our blog post, the temporary FlatESLint class has been renamed to ESLint, while the ESLint class from v8.x has been renamed to LegacyESLint.
To address: If you are currently using the ESLint class, verify that your tests pass using the new ESLint class. Not all of the old options are supported, so you may need to update the arguments passed to the constructor. See the Node.js API Reference for details.
If you still need the v8.x ESLint functionality, use the LegacyESLint class like this:
const { LegacyESLint } = require("eslint/use-at-your-own-risk");


Related Issues(s): #13481
Linter now expects flat config format
In ESLint v9.0.0, the config argument passed to Linter#verify() and Linter#verifyAndFix() methods should be in the flat config format.
Additionally, methods Linter#defineRule(), Linter#defineRules(), Linter#defineParser(), and Linter#getRules() are no longer available.
To address: If you are using the Linter class, verify that your tests pass.
If you’re passing configuration objects that are incompatible with the flat config format, you’ll need to update the code.
// eslintrc config format
linter.verify(code, {
	parserOptions: {
		ecmaVersion: 6,
	},
});

// flat config format
linter.verify(code, {
	languageOptions: {
		ecmaVersion: 6,
	},
});














Please refer to the Configuration Migration Guide for details on translating other keys you may be using.
Rules and parsers can be defined directly in the configuration.
// eslintrc mode
linter.defineRule("my-rule1", myRule1);
linter.defineRules({
	"my-rule2": myRule2,
	"my-rule3": myRule3,
});
linter.defineParser("my-parser", myParser);
linter.verify(code, {
	rules: {
		"my-rule1": "error",
		"my-rule2": "error",
		"my-rule3": "error",
	},
	parser: "my-parser",
});

// flat config mode
linter.verify(code, {
	plugins: {
		"my-plugin-foo": {
			rules: {
				"my-rule1": myRule1,
			},
		},
		"my-plugin-bar": {
			rules: {
				"my-rule2": myRule2,
				"my-rule3": myRule3,
			},
		},
	},
	rules: {
		"my-plugin-foo/my-rule1": "error",
		"my-plugin-bar/my-rule2": "error",
		"my-plugin-bar/my-rule3": "error",
	},
	languageOptions: {
		parser: myParser,
	},
});









































If you still need the v8.x Linter functionality, pass configType: "eslintrc" to the constructor like this:
const linter = new Linter({ configType: "eslintrc" });

linter.verify(code, {
	parserOptions: {
		ecmaVersion: 6,
	},
});

linter.getRules();










Related Issues(s): #13481
Edit this page
Table of Contents
Table of Contents
Breaking changes for users
Breaking changes for plugin developers
Breaking changes for integration developers
Node.js < v18.18, v19 are no longer supported
New default config format (eslint.config.js)
Removed multiple formatters
Removed require-jsdoc and valid-jsdoc rules
eslint:recommended has been updated
--quiet no longer runs rules set to "warn"
--output-file now writes a file to disk even with an empty output
Change in behavior when no patterns are passed to CLI
/* eslint */ comments with only severity now retain options from the config file
Multiple /* eslint */ comments for the same rule are now disallowed
Stricter /* exported */ parsing
no-constructor-return and no-sequences rule schemas are stricter
New checks in no-implicit-coercion by default
Case-sensitive flags in no-invalid-regexp
varsIgnorePattern option of no-unused-vars no longer applies to catch arguments
no-restricted-imports now accepts multiple config entries with the same name
"eslint:recommended" and "eslint:all" no longer accepted in flat config
no-inner-declarations has a new default behavior with a new option
no-unused-vars now defaults caughtErrors to "all"
no-useless-computed-key flags unnecessary computed member names in classes by default
camelcase allow option only accepts an array of strings
Removed multiple context methods
Removed sourceCode.getComments()
Removed CodePath#currentSegments
Code paths are now precalculated
Function-style rules are no longer supported
meta.schema is required for rules with options
FlatRuleTester is now RuleTester
Stricter RuleTester checks
FlatESLint is now ESLint
Linter now expects flat config format
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   














Edit this page
Table of Contents
Specifying JavaScript Options
Specifying Parser Options
Specifying Globals
Using configuration comments
Using configuration files
Predefined global variables
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Version Support
The ESLint team provides ongoing support for the current version and six months of limited support for the previous version.
Major ESLint release lines move through a status of Current, to Maintenance, to End of Life (EOL). A release line is considered Current when prerelease work begins. At that point, the previous release line moves to Maintenance status and stays there until six months after the general availability of the Current release line. After that, the release line moves to EOL.
Release Statuses
ESLint major release lines are designated by the level of support they receive from the ESLint team. The release statuses are:
Current - Receives active maintenance and development from the ESLint team.
Maintenance - Receives critical bug fixes, including security issues, and compatibility fixes to ensure interoperability between major release lines. There is no backporting of other fixes or features from the current release line.
End of Life (EOL) - When a release line falls out of maintenance mode it receives no further updates from the ESLint team.
Current Release Lines
Release Line
Status
First Release
Last Release
EOL Start
Commercial Support
v9.x
Current
2024-04-05
TBD
TBD
Tidelift
v8.0.0-v8.57.1
EOL
2021-10-09
2024-09-16
2024-10-05
HeroDevs
v7.0.0-v7.32.0
EOL
2020-05-08
2021-07-30
2022-04-09
HeroDevs
v6.0.0-v6.8.0
EOL
2019-06-21
2019-12-20
2020-11-08
HeroDevs
v5.0.0-v5.16.0
EOL
2018-06-22
2019-03-29
2019-12-21
HeroDevs
v4.0.0-v4.19.1
EOL
2017-06-11
2018-03-21
2018-12-22
HeroDevs
v3.0.0-v3.19.0
EOL
2016-07-01
2017-03-31
2017-12-11
HeroDevs
v2.0.0-v2.13.1
EOL
2016-02-12
2016-06-20
2017-01-01
HeroDevs
v1.0.0-v1.10.3
EOL
2015-07-31
2015-12-01
2016-08-12
HeroDevs

Commercial Support
ESLint offers commercial support through our partners, Tidelift and HeroDevs.
For Current and Maintenance release lines, commercial support is provided by Tidelift. Tidelift validates that ESLint is up-to-date with the latest security best practices and can be a first point of contact for any problems that may arise. Learn more
For EOL release lines, commercial support is provided by HeroDevs. HeroDevs provides drop-in replacements for older versions of ESLint that are kept up-to-date for security and compliance issues. Learn more
Theme Switcher
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇩🇪 Deutsch                                                        🇺🇸 English (US)                                                        🇪🇸 Español (ES)                                                        🇫🇷 Français                                                        🇮🇳 हिन्दी                                                        🇯🇵 日本語                                                        🇧🇷 Português (BR)                                                        🇨🇳 简体中文                                   
Copyright OpenJS Foundation and ESLint contributors. All rights reserved. The OpenJS Foundation has registered trademarks and uses trademarks. For a list of trademarks of the OpenJS Foundation, please see our Trademark Policy and Trademark List. Trademarks and logos not indicated on the list of OpenJS Foundation trademarks are trademarks™ or registered® trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.
Branding
 The OpenJS Foundation
 Terms of Use
 Privacy Policy
 OpenJS Foundation Bylaws
 Trademark Policy
 Trademark List
 Cookie Policy
Version Support
The ESLint team provides ongoing support for the current version and six months of limited support for the previous version.
Major ESLint release lines move through a status of Current, to Maintenance, to End of Life (EOL). A release line is considered Current when prerelease work begins. At that point, the previous release line moves to Maintenance status and stays there until six months after the general availability of the Current release line. After that, the release line moves to EOL.
Release Statuses
ESLint major release lines are designated by the level of support they receive from the ESLint team. The release statuses are:
Current - Receives active maintenance and development from the ESLint team.
Maintenance - Receives critical bug fixes, including security issues, and compatibility fixes to ensure interoperability between major release lines. There is no backporting of other fixes or features from the current release line.
End of Life (EOL) - When a release line falls out of maintenance mode it receives no further updates from the ESLint team.
Current Release Lines
Release Line
Status
First Release
Last Release
EOL Start
Commercial Support
v9.x
Current
2024-04-05
TBD
TBD
Tidelift
v8.0.0-v8.57.1
EOL
2021-10-09
2024-09-16
2024-10-05
HeroDevs
v7.0.0-v7.32.0
EOL
2020-05-08
2021-07-30
2022-04-09
HeroDevs
v6.0.0-v6.8.0
EOL
2019-06-21
2019-12-20
2020-11-08
HeroDevs
v5.0.0-v5.16.0
EOL
2018-06-22
2019-03-29
2019-12-21
HeroDevs
v4.0.0-v4.19.1
EOL
2017-06-11
2018-03-21
2018-12-22
HeroDevs
v3.0.0-v3.19.0
EOL
2016-07-01
2017-03-31
2017-12-11
HeroDevs
v2.0.0-v2.13.1
EOL
2016-02-12
2016-06-20
2017-01-01
HeroDevs
v1.0.0-v1.10.3
EOL
2015-07-31
2015-12-01
2016-08-12
HeroDevs

Commercial Support
ESLint offers commercial support through our partners, Tidelift and HeroDevs.
For Current and Maintenance release lines, commercial support is provided by Tidelift. Tidelift validates that ESLint is up-to-date with the latest security best practices and can be a first point of contact for any problems that may arise. Learn more
For EOL release lines, commercial support is provided by HeroDevs. HeroDevs provides drop-in replacements for older versions of ESLint that are kept up-to-date for security and compliance issues. Learn more
Theme Switcher
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇩🇪 Deutsch                                                        🇺🇸 English (US)                                                        🇪🇸 Español (ES)                                                        🇫🇷 Français                                                        🇮🇳 हिन्दी                                                        🇯🇵 日本語                                                        🇧🇷 Português (BR)                                                        🇨🇳 简体中文                                   
Copyright OpenJS Foundation and ESLint contributors. All rights reserved. The OpenJS Foundation has registered trademarks and uses trademarks. For a list of trademarks of the OpenJS Foundation, please see our Trademark Policy and Trademark List. Trademarks and logos not indicated on the list of OpenJS Foundation trademarks are trademarks™ or registered® trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.
Branding
 The OpenJS Foundation
 Terms of Use
 Privacy Policy
 OpenJS Foundation Bylaws
 Trademark Policy
 Trademark List
 Cookie Policy
Troubleshooting
This page serves as a reference for common issues working with ESLint.
Configuration
Circular fixes detected …
TypeError: context.getScope is not a function
Legacy (eslintrc) Configuration
ESLint couldn't determine the plugin … uniquely
ESLint couldn't find the config … to extend from
ESLint couldn't find the plugin …
Issues oftentimes can be resolved by updating the to latest versions of the eslint package and any related packages, such as for ESLint shareable configs and plugins.
If you still can’t figure out the problem, please stop by https://eslint.org/chat/help to chat with the team.
Edit this page
Table of Contents
Configuration
Legacy (eslintrc) Configuration
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Circular fixes detected …
Symptoms
When running ESLint with the --fix option, you may see the following warning:
ESLintCircularFixesWarning: Circular fixes detected while fixing path/to/file. It is likely that you have conflicting rules in your configuration.


Cause
You have conflicting fixable rules in your configuration. ESLint autofixes code in multiple passes, meaning it’s possible that a fix in one pass is undone in a subsequent pass. For example, in the first pass a rule removes a trailing comma and in the following pass a different rule adds a trailing comma in the same place, effectively changing the code back to the previous version. ESLint emits a warning when it detects cycles like this.
Resolution
Common resolutions for this issue include:
Remove or reconfigure one of the conflicting rules in your configuration file.
How to find the conflicting rules:
Open the file specified in the warning in an editor that supports applying individual fixes (for example, VS Code).
In the list of lint problems, find a fixable rule. That is one of the conflicting rules.
Apply the fix (“Fix this (rule-name) problem” action in VS Code).
Check what new lint problem has appeared in the list. That is the other conflicting rule.
Resources
For more information, see:
Configure Rules for documentation on how to configure rules
Edit this page
Table of Contents
Symptoms
Cause
Resolution
Resources
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
ESLint couldn't determine the plugin … uniquely
Symptoms
When using the legacy ESLint config system, you may see this error running ESLint after installing dependencies:
ESLint couldn't determine the plugin "${pluginId}" uniquely.

- ${filePath} (loaded in "${importerName}")
- ${filePath} (loaded in "${importerName}")
...

Please remove the "plugins" setting from either config or remove either plugin installation.








Cause
ESLint configuration files allow loading in plugins that may include other plugins. A plugin package might be specified as a dependency of both your package and one or more ESLint plugins. Legacy ESLint configuration files may use extends to include other configurations. Those configurations may depend on plugins to provide certain functionality in the configuration.
For example, if your config depends on eslint-plugin-a@2 and eslint-plugin-b@3, and you extend eslint-config-b that depends on eslint-plugin-a@1, then the eslint-plugin-a package might have two different versions on disk:
node_modules/eslint-plugin-a
node_modules/eslint-plugin-b/node_modules/eslint-plugin-a
If the legacy ESLint configuration system sees that both plugins exists in multiple places with different versions, it won’t know which one to use.
Note that this issue is only present in the legacy eslintrc configurations. The new “flat” config system has you import the dependencies yourself, removing the need for ESLint to attempt to determine their version uniquely.
Resolution
Common resolutions for this issue include:
Upgrading all versions of all packages to their latest version.
Running npm dedupe or the equivalent package manager command to deduplicate packages, if their version ranges are compatible.
Using overrides or the equivalent package manager package.json field, to force a specific version of a plugin package.
Note that this may cause bugs in linting if the plugin package had breaking changes between versions.
Resources
For more information, see:
Configure Plugins for documentation on how to extend from plugins
Create Plugins for documentation on how to define plugins
Edit this page
Table of Contents
Symptoms
Cause
Resolution
Resources
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
ESLint couldn't find the config … to extend from
Symptoms
When using the legacy ESLint config system, you may see this error running ESLint after installing dependencies:
ESLint couldn't find the config "${configName}" to extend from. Please check that the name of the config is correct.

The config "${configName}" was referenced from the config file in "${importerName}".




Cause
ESLint configuration files specify shareable configs by their package name in the extends array. That package name is passed to the Node.js require(), which looks up the package under local node_modules/ directories. For example, the following ESLint config will first try to load a module located at node_modules/eslint-config-yours:
module.exports = {
	extends: ["eslint-config-yours"],
};




The error is output when you attempt to extend from a configuration and the package for that configuration is not found in any searched node_modules/.
Common reasons for this occurring include:
Not running npm install or the equivalent package manager command
Mistyping the case-sensitive name of the package and/or configuration
Config Name Variations
Note that ESLint supports several config name formats:
The eslint-config- config name prefix may be omitted for brevity, e.g. extends: ["yours"]
@ npm scoped packages put the eslint-config- prefix after the org scope, e.g. extends: ["@org/yours"] to load from @org/eslint-config-yours
A plugin: prefix indicates a config is loaded from a shared plugin, e.g. extends: [plugin:yours/recommended] to load from eslint-plugin-yours
Resolution
Common resolutions for this issue include:
Upgrading all versions of all packages to their latest version.
Adding the config as a devDependency in your package.json.
Running npm install or the equivalent package manager command.
Checking that the name in your config file matches the name of the config package.
Resources
For more information, see:
Legacy ESLint configuration files for documentation on the legacy ESLint configuration format
Legacy ESLint configuration files > Using a shareable configuration package for documentation on using shareable configurations
Share Configurations for documentation on how to define standalone shared configs
Create Plugins > Configs in Plugins for documentation on how to define shared configs in plugins
Edit this page
Table of Contents
Symptoms
Cause
Config Name Variations
Resolution
Resources
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
ESLint couldn't find the plugin …
Symptoms
When using the legacy ESLint config system, you may see this error running ESLint after installing dependencies:
ESLint couldn't find the plugin "${pluginName}".

(The package "${pluginName}" was not found when loaded as a Node module from the directory "${resolvePluginsRelativeTo}".)

It's likely that the plugin isn't installed correctly. Try reinstalling by running the following:

    npm install ${pluginName}@latest --save-dev

The plugin "${pluginName}" was referenced from the config file in "${importerName}".










Cause
Legacy ESLint configuration files specify shareable configs by their package name. That package name is passed to the Node.js require(), which looks up the package under local node_modules/ directories. For example, the following ESLint config will first try to load a module located at node_modules/eslint-plugin-yours:
module.exports = {
	extends: ["plugin:eslint-plugin-yours/config-name"],
};




If the package is not found in any searched node_modules/, ESLint will print the aforementioned error.
Common reasons for this occurring include:
Not running npm install or the equivalent package manager command
Mistyping the case-sensitive name of the plugin
Plugin Name Variations
Note that the eslint-plugin- plugin name prefix may be omitted for brevity, e.g. extends: ["yours"].
@ npm scoped packages put the eslint-plugin- prefix after the org scope, e.g. extends: ["@org/yours"] to load from @org/eslint-plugin-yours.
Resolution
Common resolutions for this issue include:
Upgrading all versions of all packages to their latest version.
Adding the plugin as a devDependency in your package.json.
Running npm install or the equivalent package manager command.
Checking that the name in your config file matches the name of the plugin package.
Resources
For more information, see:
Legacy ESLint configuration files for documentation on the legacy ESLint configuration format.
Configure Plugins for documentation on how to extend from plugins.
Create Plugins for documentation on how to define plugins.
Edit this page
Table of Contents
Symptoms
Cause
Plugin Name Variations
Resolution
Resources
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
TypeError: context.getScope is not a function
Symptoms
When using ESLint v9.0.0 or later with a plugin, you may see one of the following errors:
TypeError: context.getScope is not a function
TypeError: context.getAncestors is not a function
TypeError: context.markVariableAsUsed is not a function
TypeError: context.getDeclaredVariables is not a function





Cause
ESLint v9.0.0 introduces changes to the rules API that plugin rules use, which included moving some methods from the context object to the sourceCode object. If you’re seeing one of these errors, that means the plugin has not yet been updated to use the new rules API.
Resolution
Common resolutions for this issue include:
Upgrade the plugin to the latest version.
Use the compatibility utilities to patch the plugin in your config file.
Important
If you are already using the latest version of the plugin and you need to use the compatibility utilities to make the plugin work with ESLint v9.0.0 and later, make sure to open an issue on the plugin’s repository to ask the maintainer to make the necessary API changes.
Resources
For more information, see:
Configure Plugins for documentation on how to configure plugins
Create Plugins for documentation on how to define plugins
Edit this page
Table of Contents
Symptoms
Cause
Resolution
Resources
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   


# ESLint Documentation 2

Ways to Extend ESLint
ESLint is highly pluggable and configurable. There are a variety of ways that you can extend ESLint’s functionality.
This page explains the ways to extend ESLint, and how these extensions all fit together.
Plugins
Plugins let you add your own ESLint custom rules and custom processors to a project. You can publish a plugin as an npm module.
Plugins are useful because your project may require some ESLint configuration that isn’t included in the core eslint package. For example, if you’re using a frontend JavaScript library like React or framework like Vue, these tools have some features that require custom rules outside the scope of the ESLint core rules.
Often a plugin is paired with a configuration for ESLint that applies a set of features from the plugin to a project. You can include configurations in a plugin as well.
For example, eslint-plugin-react is an ESLint plugin that includes rules specifically for React projects. The rules include things like enforcing consistent usage of React component lifecycle methods and requiring the use of key props when rendering dynamic lists.
To learn more about creating the extensions you can include in a plugin, refer to the following documentation:
Custom Rules
Custom Processors
Configs in Plugins
To learn more about bundling these extensions into a plugin, refer to Plugins.
Shareable Configs
ESLint shareable configs are pre-defined configurations for ESLint that you can use in your projects. They bundle rules and other configuration together in an npm package. Anything that you can put in a configuration file can be put in a shareable config.
You can either publish a shareable config independently or as part of a plugin.
For example, a popular shareable config is eslint-config-airbnb, which contains a variety of rules in addition to some parser options. This is a set of rules for ESLint that is designed to match the style guide used by the Airbnb JavaScript style guide. By using the eslint-config-airbnb shareable config, you can automatically enforce the Airbnb style guide in your project without having to manually configure each rule.
To learn more about creating a shareable config, refer to Share Configurations.
Custom Formatters
Custom formatters take ESLint linting results and output the results in a format that you define. Custom formatters let you display linting results in a format that best fits your needs, whether that’s in a specific file format, a certain display style, or a format optimized for a particular tool. You only need to create a custom formatter if the built-in formatters don’t serve your use case.
For example, the custom formatter eslint-formatter-gitlab can be used to display ESLint results in GitLab code quality reports.
To learn more about creating a custom formatter, refer to Custom Formatters.
Custom Parsers
ESLint custom parsers are a way to extend ESLint to support the linting of new language features or custom syntax in your code. A parser is responsible for taking your code and transforming it into an abstract syntax tree (AST) that ESLint can then analyze and lint.
ESLint ships with a built-in JavaScript parser (Espree), but custom parsers allow you to lint other languages or to extend the linting capabilities of the built-in parser.
For example, the custom parser @typescript-eslint/parser extends ESLint to lint TypeScript code.
Custom parsers can be also included in a plugin.
To learn more about creating a custom parser, refer to Custom Parsers.

Create Plugins
ESLint plugins extend ESLint with additional functionality. In most cases, you’ll extend ESLint by creating plugins that encapsulate the additional functionality you want to share across multiple projects.
Creating a plugin
A plugin is a JavaScript object that exposes certain properties to ESLint:
meta - information about the plugin.
configs - an object containing named configurations.
rules - an object containing the definitions of custom rules.
processors - an object containing named processors.
To get started, create a JavaScript file and export an object containing the properties you’d like ESLint to use. To make your plugin as easy to maintain as possible, we recommend that you format your plugin entrypoint file to look like this:
const plugin = {
	meta: {},
	configs: {},
	rules: {},
	processors: {},
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;













If you plan to distribute your plugin as an npm package, make sure that the module that exports the plugin object is the default export of your package. This will enable ESLint to import the plugin when it is specified in the command line in the --plugin option.
Meta Data in Plugins
For easier debugging and more effective caching of plugins, it’s recommended to provide a name, version, and namespace in a meta object at the root of your plugin, like this:
const plugin = {
	// preferred location of name and version
	meta: {
		name: "eslint-plugin-example",
		version: "1.2.3",
		namespace: "example",
	},
	rules: {
		// add rules here
	},
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;


















The meta.name property should match the npm package name for your plugin and the meta.version property should match the npm package version for your plugin. The meta.namespace property should match the prefix you’d like users to use for accessing the plugin’s rules, processors, languages, and configs. The namespace is typically what comes after eslint-plugin- in your package name, which is why this example uses "example". Providing a namespace allows the defineConfig() function to find your plugin even when a user assigns a different namespace in their config file.
The easiest way to add the name and version is by reading this information from your package.json, as in this example:
import fs from "fs";

const pkg = JSON.parse(
	fs.readFileSync(new URL("./package.json", import.meta.url), "utf8"),
);

const plugin = {
	// preferred location of name and version
	meta: {
		name: pkg.name,
		version: pkg.version,
		namespace: "example",
	},
	rules: {
		// add rules here
	},
};

export default plugin;




















Tip
While there are no restrictions on plugin names, it helps others to find your plugin on npm when you follow these naming conventions:
Unscoped: If your npm package name won’t be scoped (doesn’t begin with @), then the plugin name should begin with eslint-plugin-, such as eslint-plugin-example.
Scoped: If your npm package name will be scoped, then the plugin name should be in the format of @<scope>/eslint-plugin-<plugin-name> such as @jquery/eslint-plugin-jquery or even @<scope>/eslint-plugin such as @jquery/eslint-plugin.
As an alternative, you can also expose name and version properties at the root of your plugin, such as:
const plugin = {
	// alternate location of name and version
	name: "eslint-plugin-example",
	version: "1.2.3",
	rules: {
		// add rules here
	},
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;















Important
While the meta object is the preferred way to provide the plugin name and version, this format is also acceptable and is provided for backward compatibility.
Rules in Plugins
Plugins can expose custom rules for use in ESLint. To do so, the plugin must export a rules object containing a key-value mapping of rule ID to rule. The rule ID does not have to follow any naming convention except that it should not contain a / character (so it can just be dollar-sign but not foo/dollar-sign, for instance). To learn more about creating custom rules in plugins, refer to Custom Rules.
const plugin = {
	meta: {
		name: "eslint-plugin-example",
		version: "1.2.3",
	},
	rules: {
		"dollar-sign": {
			create(context) {
				// rule implementation ...
			},
		},
	},
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;




















In order to use a rule from a plugin in a configuration file, import the plugin and include it in the plugins key, specifying a namespace. Then, use that namespace to reference the rule in the rules configuration, like this:
// eslint.config.js
import { defineConfig } from "eslint/config";
import example from "eslint-plugin-example";

export default defineConfig([
	{
		plugins: {
			example,
		},
		rules: {
			"example/dollar-sign": "error",
		},
	},
]);















Warning
Namespaces that don’t begin with @ may not contain a /; namespaces that begin with @ may contain a /. For example, eslint/plugin is not a valid namespace but @eslint/plugin is valid. This restriction is for backwards compatibility with eslintrc plugin naming restrictions.
Processors in Plugins
Plugins can expose processors for use in configuration file by providing a processors object. Similar to rules, each key in the processors object is the name of a processor and each value is the processor object itself. Here’s an example:
const plugin = {
	meta: {
		name: "eslint-plugin-example",
		version: "1.2.3",
	},
	processors: {
		"processor-name": {
			preprocess(text, filename) {
				/* ... */
			},
			postprocess(messages, filename) {
				/* ... */
			},
		},
	},
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;























In order to use a processor from a plugin in a configuration file, import the plugin and include it in the plugins key, specifying a namespace. Then, use that namespace to reference the processor in the processor configuration, like this:
// eslint.config.js
import { defineConfig } from "eslint/config";
import example from "eslint-plugin-example";

export default defineConfig([
	{
		files: ["**/*.txt"],
		plugins: {
			example,
		},
		processor: "example/processor-name",
	},
]);














Configs in Plugins
You can bundle configurations inside a plugin by specifying them under the configs key. This can be useful when you want to bundle a set of custom rules with a configuration that enables the recommended options. Multiple configurations are supported per plugin.
You can include individual rules from a plugin in a config that’s also included in the plugin. In the config, you must specify your plugin name in the plugins object as well as any rules you want to enable that are part of the plugin. Any plugin rules must be prefixed with the plugin namespace. Here’s an example:
const plugin = {
	meta: {
		name: "eslint-plugin-example",
		version: "1.2.3",
	},
	configs: {},
	rules: {
		"dollar-sign": {
			create(context) {
				// rule implementation ...
			},
		},
	},
};

// assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
	recommended: [
		{
			plugins: {
				example: plugin,
			},
			rules: {
				"example/dollar-sign": "error",
			},
			languageOptions: {
				globals: {
					myGlobal: "readonly",
				},
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
	],
});

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;













































This plugin exports a recommended config that is an array with one config object. When there is just one config object, you can also export just the object without an enclosing array.
In order to use a config from a plugin in a configuration file, import the plugin and use the extends key to reference the name of the config, like this:
// eslint.config.js
import { defineConfig } from "eslint/config";
import example from "eslint-plugin-example";

export default defineConfig([
	{
		files: ["**/*.js"], // any patterns you want to apply the config to
		plugins: {
			example,
		},
		extends: ["example/recommended"],
	},
]);














Important
Plugins cannot force a specific configuration to be used. Users must manually include a plugin’s configurations in their configuration file.
Backwards Compatibility for Legacy Configs
If your plugin needs to export configs that work both with the current (flat config) system and the old (eslintrc) system, you can export both config types from the configs key. When exporting legacy configs, we recommend prefixing the name with "legacy-" (for example, "legacy-recommended") to make it clear how the config should be used.
If you’re working on a plugin that has existed prior to ESLint v9.0.0, then you may already have legacy configs with names such as "recommended". If you don’t want to update the config name, you can also create an additional entry in the configs object prefixed with "flat/" (for example, "flat/recommended"). Here’s an example:
const plugin = {
	meta: {
		name: "eslint-plugin-example",
		version: "1.2.3",
	},
	configs: {},
	rules: {
		"dollar-sign": {
			create(context) {
				// rule implementation ...
			},
		},
	},
};

// assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
	// flat config format
	"flat/recommended": [
		{
			plugins: {
				example: plugin,
			},
			rules: {
				"example/dollar-sign": "error",
			},
			languageOptions: {
				globals: {
					myGlobal: "readonly",
				},
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
	],

	// eslintrc format
	recommended: {
		plugins: ["example"],
		rules: {
			"example/dollar-sign": "error",
		},
		globals: {
			myGlobal: "readonly",
		},
		parserOptions: {
			ecmaFeatures: {
				jsx: true,
			},
		},
	},
});

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;






























































With this approach, both configuration systems recognize "recommended". The old config system uses the recommended key while the current config system uses the flat/recommended key. The defineConfig() helper first looks at the recommended key, and if that is not in the correct format, it looks for the flat/recommended key. This allows you an upgrade path if you’d later like to rename flat/recommended to recommended when you no longer need to support the old config system.
Testing a Plugin
ESLint provides the RuleTester utility to make it easy to test the rules of your plugin.
Linting a Plugin
ESLint plugins should be linted too! It’s suggested to lint your plugin with the recommended configurations of:
eslint
eslint-plugin-eslint-plugin
eslint-plugin-n
Share Plugins
In order to make your plugin available publicly, you have to publish it on npm. When doing so, please be sure to:
List ESLint as a peer dependency. Because plugins are intended for use with ESLint, it’s important to add the eslint package as a peer dependency. To do so, manually edit your package.json file to include a peerDependencies block, like this:
{
	"peerDependencies": {
		"eslint": ">=9.0.0"
	}
}










Specify keywords. ESLint plugins should specify eslint, eslintplugin and eslint-plugin as keywords in your package.json file.
Custom Rule Tutorial
This tutorial covers how to create a custom rule for ESLint and distribute it with a plugin.
You can create custom rules to validate if your code meets a certain expectation, and determine what to do if it does not meet that expectation. Plugins package custom rules and other configuration, allowing you to easily share and reuse them in different projects.
To learn more about custom rules and plugins refer to the following documentation:
Custom Rules
Plugins
Why Create a Custom Rule?
Create a custom rule if the ESLint built-in rules and community-published custom rules do not meet your needs. You might create a custom rule to enforce a best practice for your company or project, prevent a particular bug from recurring, or ensure compliance with a style guide.
Before creating a custom rule that isn’t specific to your company or project, it’s worth searching the web to see if someone has published a plugin with a custom rule that solves your use case. It’s quite possible the rule may already exist.
Prerequisites
Before you begin, make sure you have the following installed in your development environment:
Node.js
npm
This tutorial also assumes that you have a basic understanding of ESLint and ESLint rules.
The Custom Rule
The custom rule in this tutorial requires that all const variables named foo are assigned the string literal "bar". The rule is defined in the file enforce-foo-bar.js. The rule also suggests replacing any other value assigned to const foo with "bar".
For example, say you had the following foo.js file:
// foo.js

const foo = "baz123";




Running ESLint with the rule would flag "baz123" as an incorrect value for variable foo. If ESLint is running in autofix mode, then ESLint would fix the file to contain the following:
// foo.js

const foo = "bar";




Step 1: Set up Your Project
First, create a new project for your custom rule. Create a new directory, initiate a new npm project in it, and create a new file for the custom rule:
mkdir eslint-custom-rule-example # create directory
cd eslint-custom-rule-example # enter the directory
npm init -y # init new npm project
touch enforce-foo-bar.js # create file enforce-foo-bar.js





Step 2: Stub Out the Rule File
In the enforce-foo-bar.js file, add some scaffolding for the enforce-foo-bar custom rule. Also, add a meta object with some basic information about the rule.
// enforce-foo-bar.js

module.exports = {
	meta: {
		// TODO: add metadata
	},
	create(context) {
		return {
			// TODO: add callback function(s)
		};
	},
};













Step 3: Add Rule Metadata
Before writing the rule, add some metadata to the rule object. ESLint uses this information when running the rule.
Start by exporting an object with a meta property containing the rule’s metadata, such as the rule type, documentation, and fixability. In this case, the rule type is “problem,” the description is “Enforce that a variable named foo can only be assigned a value of ‘bar’.”, and the rule is fixable by modifying the code.
// enforce-foo-bar.js

module.exports = {
	meta: {
		type: "problem",
		docs: {
			description:
				"Enforce that a variable named `foo` can only be assigned a value of 'bar'.",
		},
		fixable: "code",
		schema: [],
	},
	create(context) {
		return {
			// TODO: add callback function(s)
		};
	},
};



















To learn more about rule metadata, refer to Rule Structure.
Step 4: Add Rule Visitor Methods
Define the rule’s create function, which accepts a context object and returns an object with a property for each syntax node type you want to handle. In this case, you want to handle VariableDeclarator nodes. You can choose any ESTree node type or selector.
Tip
You can view the AST for any JavaScript code using Code Explorer. This is helpful in determining the type of nodes you’d like to target.
Inside the VariableDeclarator visitor method, check if the node represents a const variable declaration, if its name is foo, and if it’s not assigned to the string "bar". You do this by evaluating the node passed to the VariableDeclaration method.
If the const foo declaration is assigned a value of "bar", then the rule does nothing. If const foo is not assigned a value of "bar", then context.report() reports an error to ESLint. The error report includes information about the error and how to fix it.
// enforce-foo-bar.js

module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Enforce that a variable named `foo` can only be assigned a value of 'bar'."
        },
        fixable: "code",
        schema: []
    },
    create(context) {
        return {

            // Performs action in the function on every variable declarator
            VariableDeclarator(node) {

                // Check if a `const` variable declaration
                if (node.parent.kind === "const") {

                    // Check if variable name is `foo`
                    if (node.id.type === "Identifier" && node.id.name === "foo") {

                        // Check if value of variable is "bar"
                        if (node.init && node.init.type === "Literal" && node.init.value !== "bar") {

                            /*
                             * Report error to ESLint. Error message uses
                             * a message placeholder to include the incorrect value
                             * in the error message.
                             * Also includes a `fix(fixer)` function that replaces
                             * any values assigned to `const foo` with "bar".
                             */
                            context.report({
                                node,
                                message: 'Value other than "bar" assigned to `const foo`. Unexpected value: {{ notBar }}.',
                                data: {
                                    notBar: node.init.value
                                },
                                fix(fixer) {
                                    return fixer.replaceText(node.init, '"bar"');
                                }
                            });
                        }
                    }
                }
            }
        };
    }
};





















































Step 5: Set up Testing
With the rule written, you can test it to make sure it’s working as expected.
ESLint provides the built-in RuleTester class to test rules. You do not need to use third-party testing libraries to test ESLint rules, but RuleTester works seamlessly with tools like Mocha and Jest.
Next, create the file for the tests, enforce-foo-bar.test.js:
touch enforce-foo-bar.test.js


You will use the eslint package in the test file. Install it as a development dependency:
npmyarnpnpmbun
npm install --save-dev eslint


And add a test script to your package.json file to run the tests:
// package.json
{
    // ...other configuration
    "scripts": {
        "test": "node enforce-foo-bar.test.js"
    },
    // ...other configuration
}









Step 6: Write the Test
To write the test using RuleTester, import the class and your custom rule into the enforce-foo-bar.test.js file.
The RuleTester#run() method tests the rule against valid and invalid test cases. If the rule fails to pass any of the test scenarios, this method throws an error. RuleTester requires that at least one valid and one invalid test scenario be present.
// enforce-foo-bar.test.js
const { RuleTester } = require("eslint");
const fooBarRule = require("./enforce-foo-bar");

const ruleTester = new RuleTester({
	// Must use at least ecmaVersion 2015 because
	// that's when `const` variables were introduced.
	languageOptions: { ecmaVersion: 2015 },
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
	"enforce-foo-bar", // rule name
	fooBarRule, // rule code
	{
		// checks
		// 'valid' checks cases that should pass
		valid: [
			{
				code: "const foo = 'bar';",
			},
		],
		// 'invalid' checks cases that should not pass
		invalid: [
			{
				code: "const foo = 'baz';",
				output: 'const foo = "bar";',
				errors: 1,
			},
		],
	},
);

console.log("All tests passed!");



































Run the test with the following command:
npm test


If the test passes, you should see the following in your console:
All tests passed!


Step 7: Bundle the Custom Rule in a Plugin
Now that you’ve written the custom rule and validated that it works, you can include it in a plugin. Using a plugin, you can share the rule in an npm package to use in other projects.
Create the file for the plugin:
touch eslint-plugin-example.js


And now write the plugin code. Plugins are just exported JavaScript objects. To include a rule in a plugin, include it in the plugin’s rules object, which contains key-value pairs of rule names and their source code.
To learn more about creating plugins, refer to Create Plugins.
// eslint-plugin-example.js

const fooBarRule = require("./enforce-foo-bar");
const plugin = { rules: { "enforce-foo-bar": fooBarRule } };
module.exports = plugin;






Step 8: Use the Plugin Locally
You can use a locally defined plugin to execute the custom rule in your project. To use a local plugin, specify the path to the plugin in the plugins property of your ESLint configuration file.
You might want to use a locally defined plugin in one of the following scenarios:
You want to test the plugin before publishing it to npm.
You want to use a plugin, but do not want to publish it to npm.
Before you can add the plugin to the project, create an ESLint configuration for your project using a flat configuration file, eslint.config.js:
touch eslint.config.js


Then, add the following code to eslint.config.js:
// eslint.config.js
"use strict";

// Import the ESLint plugin locally
const eslintPluginExample = require("./eslint-plugin-example");

module.exports = [
	{
		files: ["**/*.js"],
		languageOptions: {
			sourceType: "commonjs",
			ecmaVersion: "latest",
		},
		// Using the eslint-plugin-example plugin defined locally
		plugins: { example: eslintPluginExample },
		rules: {
			"example/enforce-foo-bar": "error",
		},
	},
];





















Before you can test the rule, you must create a file to test the rule on.
Create a file example.js:
touch example.js


Add the following code to example.js:
// example.js

function correctFooBar() {
	const foo = "bar";
}

function incorrectFoo() {
	const foo = "baz"; // Problem!
}










Now you’re ready to test the custom rule with the locally defined plugin.
Run ESLint on example.js:
npmyarnpnpmbun
npx eslint example.js 


This produces the following output in the terminal:
/<path-to-directory>/eslint-custom-rule-example/example.js
  8:11  error  Value other than "bar" assigned to `const foo`. Unexpected value: baz  example/enforce-foo-bar

✖ 1 problem (1 error, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.






Step 9: Publish the Plugin
To publish a plugin containing a rule to npm, you need to configure the package.json. Add the following in the corresponding fields:
"name": A unique name for the package. No other package on npm can have the same name.
"main": The relative path to the plugin file. Following this example, the path is "eslint-plugin-example.js".
"description": A description of the package that’s viewable on npm.
"peerDependencies": Add "eslint": ">=9.0.0" as a peer dependency. Any version greater than or equal to that is necessary to use the plugin. Declaring eslint as a peer dependency requires that users add the package to the project separately from the plugin.
"keywords": Include the standard keywords ["eslint", "eslintplugin", "eslint-plugin"] to make the package easy to find. You can add any other keywords that might be relevant to your plugin as well.
A complete annotated example of what a plugin’s package.json file should look like:
// package.json
{
  // Name npm package.
  // Add your own package name. eslint-plugin-example is taken!
  "name": "eslint-plugin-example",
  "version": "1.0.0",
  "description": "ESLint plugin for enforce-foo-bar rule.",
  "main": "eslint-plugin-example.js", // plugin entry point
  "scripts": {
    "test": "node enforce-foo-bar.test.js"
  },
  // Add eslint>=9.0.0 as a peer dependency.
  "peerDependencies": {
    "eslint": ">=9.0.0"
  },
  // Add these standard keywords to make plugin easy to find!
  "keywords": [
    "eslint",
    "eslintplugin",
    "eslint-plugin"
  ],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "eslint": "^9.0.0"
  }
}




























To publish the package, run npm publish and follow the CLI prompts.
You should see the package live on npm!
Step 10: Use the Published Custom Rule
Next, you can use the published plugin.
Run the following command in your project to download the package:
npmyarnpnpmbun
# Add your package name here
npm install --save-dev eslint-plugin-example



Update the eslint.config.js to use the packaged version of the plugin:
// eslint.config.js
"use strict";

// Import the plugin downloaded from npm
const eslintPluginExample = require("eslint-plugin-example");

// ... rest of configuration








Now you’re ready to test the custom rule.
Run ESLint on the example.js file you created in step 8, now with the downloaded plugin:
npmyarnpnpmbun
npx eslint example.js 


This produces the following output in the terminal:
/<path-to-directory>/eslint-custom-rule-example/example.js
  8:11  error  Value other than "bar" assigned to `const foo`. Unexpected value: baz  example/enforce-foo-bar

✖ 1 problem (1 error, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.






As you can see in the above message, you can actually fix the issue with the --fix flag, correcting the variable assignment to be "bar".
Run ESLint again with the --fix flag:
npmyarnpnpmbun
npx eslint example.js --fix 


There is no error output in the terminal when you run this, but you can see the fix applied in example.js. You should see the following:
// example.js

// ... rest of file

function incorrectFoo() {
	const foo = "bar"; // Fixed!
}








Summary
In this tutorial, you’ve made a custom rule that requires all const variables named foo to be assigned the string "bar" and suggests replacing any other value assigned to const foo with "bar". You’ve also added the rule to a plugin, and published the plugin on npm.
Through doing this, you’ve learned the following practices which you can apply to create other custom rules and plugins:
Creating a custom ESLint rule
Testing the custom rule
Bundling the rule in a plugin
Publishing the plugin
Using the rule from the plugin
View the Tutorial Code
You can view the annotated source code for the tutorial here.
Edit this page
Table of Contents
Why Create a Custom Rule?
Prerequisites
The Custom Rule
Step 1: Set up Your Project
Step 2: Stub Out the Rule File
Step 3: Add Rule Metadata
Step 4: Add Rule Visitor Methods
Step 5: Set up Testing
Step 6: Write the Test
Step 7: Bundle the Custom Rule in a Plugin
Step 8: Use the Plugin Locally
Step 9: Publish the Plugin
Step 10: Use the Published Custom Rule
Summary
View the Tutorial Code
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Custom Rules
You can create custom rules to use with ESLint. You might want to create a custom rule if the core rules do not cover your use case.
Here’s the basic format of a custom rule:
// customRule.js

module.exports = {
	meta: {
		type: "suggestion",
		docs: {
			description: "Description of the rule",
		},
		fixable: "code",
		schema: [], // no options
	},
	create: function (context) {
		return {
			// callback functions
		};
	},
};


















Warning
The core rules shipped in the eslint package are not considered part of the public API and are not designed to be extended from. Building on top of these rules is fragile and will most likely result in your rules breaking completely at some point in the future. If you’re interested in creating a rule that is similar to a core rule, you should first copy the rule file into your project and proceed from there.
Rule Structure
The source file for a rule exports an object with the following properties. Both custom rules and core rules follow this format.
meta: (object) Contains metadata for the rule:
type: (string) Indicates the type of rule, which is one of "problem", "suggestion", or "layout":
"problem": The rule is identifying code that either will cause an error or may cause a confusing behavior. Developers should consider this a high priority to resolve.
"suggestion": The rule is identifying something that could be done in a better way but no errors will occur if the code isn’t changed.
"layout": The rule cares primarily about whitespace, semicolons, commas, and parentheses, all the parts of the program that determine how the code looks rather than how it executes. These rules work on parts of the code that aren’t specified in the AST.
docs: (object) Properties often used for documentation generation and tooling. Required for core rules and optional for custom rules. Custom rules can include additional properties here as needed.
description: (string) Provides a short description of the rule. For core rules, this is used in rules index.
recommended: (boolean) For core rules, this specifies whether the rule is enabled by the recommended config from @eslint/js.
url: (string) Specifies the URL at which the full documentation can be accessed. Code editors often use this to provide a helpful link on highlighted rule violations.
fixable: (string) Either "code" or "whitespace" if the --fix option on the command line automatically fixes problems reported by the rule.
Important: the fixable property is mandatory for fixable rules. If this property isn’t specified, ESLint will throw an error whenever the rule attempts to produce a fix. Omit the fixable property if the rule is not fixable.
hasSuggestions: (boolean) Specifies whether rules can return suggestions (defaults to false if omitted).
Important: the hasSuggestions property is mandatory for rules that provide suggestions. If this property isn’t set to true, ESLint will throw an error whenever the rule attempts to produce a suggestion. Omit the hasSuggestions property if the rule does not provide suggestions.
schema: (object | array | false) Specifies the options so ESLint can prevent invalid rule configurations. Mandatory when the rule has options.
defaultOptions: (array) Specifies default options for the rule. If present, any user-provided options in their config will be merged on top of them recursively.
deprecated: (boolean | DeprecatedInfo) Indicates whether the rule has been deprecated. You may omit the deprecated property if the rule has not been deprecated.
There is a dedicated page for the DeprecatedInfo
replacedBy: (array, Deprecated Use meta.deprecated.replacedBy instead.) In the case of a deprecated rule, specify replacement rule(s).
create(): Returns an object with methods that ESLint calls to “visit” nodes while traversing the abstract syntax tree (AST as defined by ESTree) of JavaScript code:
If a key is a node type or a selector, ESLint calls that visitor function while going down the tree.
If a key is a node type or a selector plus :exit, ESLint calls that visitor function while going up the tree.
If a key is an event name, ESLint calls that handler function for code path analysis.
A rule can use the current node and its surrounding tree to report or fix problems.
Here are methods for the array-callback-return rule:
function checkLastSegment (node) {
    // report problem for function if last code path segment is reachable
}

module.exports = {
    meta: { ... },
    create: function(context) {
        // declare the state of the rule
        return {
            ReturnStatement: function(node) {
                // at a ReturnStatement node while going down
            },
            // at a function expression node while going up:
            "FunctionExpression:exit": checkLastSegment,
            "ArrowFunctionExpression:exit": checkLastSegment,
            onCodePathStart: function (codePath, node) {
                // at the start of analyzing a code path
            },
            onCodePathEnd: function(codePath, node) {
                // at the end of analyzing a code path
            }
        };
    }
};

























Tip
You can view the complete AST for any JavaScript code using Code Explorer.
The Context Object
The context object is the only argument of the create method in a rule. For example:
// customRule.js

module.exports = {
    meta: { ... },
    // `context` object is the argument
    create(context) {
       // ...
    }
};










As the name implies, the context object contains information that is relevant to the context of the rule.
The context object has the following properties:
id: (string) The rule ID.
filename: (string) The filename associated with the source.
physicalFilename: (string) When linting a file, it provides the full path of the file on disk without any code block information. When linting text, it provides the value passed to —stdin-filename or <text> if not specified.
cwd: (string) The cwd option passed to the Linter. It is a path to a directory that should be considered the current working directory.
options: (array) An array of the configured options for this rule. This array does not include the rule severity (see the dedicated section).
sourceCode: (object) A SourceCode object that you can use to work with the source that was passed to ESLint (see Accessing the Source Code).
settings: (object) The shared settings from the configuration.
languageOptions: (object) more details for each property here
sourceType: ('script' | 'module' | 'commonjs') The mode for the current file.
ecmaVersion: (number) The ECMA version used to parse the current file.
parser: (object): The parser used to parse the current file.
parserOptions: (object) The parser options configured for this file.
globals: (object) The specified globals.
parserPath: (string, Removed Use context.languageOptions.parser instead.) The name of the parser from the configuration.
parserOptions: (Deprecated Use context.languageOptions.parserOptions instead.) The parser options configured for this run (more details here).
Additionally, the context object has the following methods:
getCwd(): (Deprecated: Use context.cwd instead.) Returns the cwd option passed to the Linter. It is a path to a directory that should be considered the current working directory.
getFilename(): (Deprecated: Use context.filename instead.) Returns the filename associated with the source.
getPhysicalFilename(): (Deprecated: Use context.physicalFilename instead.) When linting a file, it returns the full path of the file on disk without any code block information. When linting text, it returns the value passed to —stdin-filename or <text> if not specified.
getSourceCode(): (Deprecated: Use context.sourceCode instead.) Returns a SourceCode object that you can use to work with the source that was passed to ESLint (see Accessing the Source Code).
report(descriptor). Reports a problem in the code (see the dedicated section).
Note: Earlier versions of ESLint supported additional methods on the context object. Those methods were removed in the new format and should not be relied upon.
Reporting Problems
The main method you’ll use when writing custom rules is context.report(), which publishes a warning or error (depending on the configuration being used). This method accepts a single argument, which is an object containing the following properties:
messageId: (string) The ID of the message (see messageIds) (recommended over message).
message: (string) The problem message (alternative to messageId).
node: (optional object) This can be an AST node, a token, or a comment related to the problem. If present and loc is not specified, then the starting location of the node is used as the location of the problem.
loc: (optional object) Specifies the location of the problem. If both loc and node are specified, then the location is used from loc instead of node.
start: An object of the start location.
line: (number) The 1-based line number at which the problem occurred.
column: (number) The 0-based column number at which the problem occurred.
end: An object of the end location.
line: (number) The 1-based line number at which the problem occurred.
column: (number) The 0-based column number at which the problem occurred.
data: (optional object) Placeholder data for message.
fix(fixer): (optional function) Applies a fix to resolve the problem.
Note that at least one of node or loc is required.
The simplest example is to use just node and message:
context.report({
	node: node,
	message: "Unexpected identifier",
});





The node contains all the information necessary to figure out the line and column number of the offending text as well as the source text representing the node.
Using Message Placeholders
You can also use placeholders in the message and provide data:

context.report({
    node: node,
    message: "Unexpected identifier: {{ identifier }}",
    data: {
        identifier: node.name
    }
});











Note that leading and trailing whitespace is optional in message parameters.
The node contains all the information necessary to figure out the line and column number of the offending text as well as the source text representing the node.
messageIds
messageIds are the recommended approach to reporting messages in context.report() calls because of the following benefits:
Rule violation messages can be stored in a central meta.messages object for convenient management.
Rule violation messages do not need to be repeated in both the rule file and rule test file.
As a result, the barrier for changing rule violation messages is lower, encouraging more frequent contributions to improve and optimize them for the greatest clarity and usefulness.
Rule file:

// avoid-name.js

module.exports = {
    meta: {
        messages: {
            avoidName: "Avoid using variables named '{{ name }}'"
        }
    },
    create(context) {
        return {
            Identifier(node) {
                if (node.name === "foo") {
                    context.report({
                        node,
                        messageId: "avoidName",
                        data: {
                            name: "foo",
                        }
                    });
                }
            }
        };
    }
};




























In the file to lint:
// someFile.js

var foo = 2;
//  ^ error: Avoid using variables named 'foo'





In your tests:
// avoid-name.test.js

var rule = require("../../../lib/rules/avoid-name");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("avoid-name", rule, {
	valid: ["bar", "baz"],
	invalid: [
		{
			code: "foo",
			errors: [
				{
					messageId: "avoidName",
				},
			],
		},
	],
});




















Applying Fixes
If you’d like ESLint to attempt to fix the problem you’re reporting, you can do so by specifying the fix function when using context.report(). The fix function receives a single argument, a fixer object, that you can use to apply a fix. For example:
context.report({
	node: node,
	message: "Missing semicolon",
	fix(fixer) {
		return fixer.insertTextAfter(node, ";");
	},
});








Here, the fix() function is used to insert a semicolon after the node. Note that a fix is not immediately applied, and may not be applied at all if there are conflicts with other fixes. After applying fixes, ESLint will run all the enabled rules again on the fixed code, potentially applying more fixes. This process will repeat up to 10 times, or until no more fixable problems are found. Afterward, any remaining problems will be reported as usual.
Important: The meta.fixable property is mandatory for fixable rules. ESLint will throw an error if a rule that implements fix functions does not export the meta.fixable property.
The fixer object has the following methods:
insertTextAfter(nodeOrToken, text): Insert text after the given node or token.
insertTextAfterRange(range, text): Insert text after the given range.
insertTextBefore(nodeOrToken, text): Insert text before the given node or token.
insertTextBeforeRange(range, text): Insert text before the given range.
remove(nodeOrToken): Remove the given node or token.
removeRange(range): Remove text in the given range.
replaceText(nodeOrToken, text): Replace the text in the given node or token.
replaceTextRange(range, text): Replace the text in the given range.
A range is a two-item array containing character indices inside the source code. The first item is the start of the range (inclusive) and the second item is the end of the range (exclusive). Every node and token has a range property to identify the source code range they represent.
The above methods return a fixing object. The fix() function can return the following values:
A fixing object.
An array which includes fixing objects.
An iterable object which enumerates fixing objects. Especially, the fix() function can be a generator.
If you make a fix() function which returns multiple fixing objects, those fixing objects must not overlap.
Best practices for fixes:
Avoid any fixes that could change the runtime behavior of code and cause it to stop working.
Make fixes as small as possible. Fixes that are unnecessarily large could conflict with other fixes, and prevent them from being applied.
Only make one fix per message. This is enforced because you must return the result of the fixer operation from fix().
Since all rules are run again after the initial round of fixes is applied, it’s not necessary for a rule to check whether the code style of a fix will cause errors to be reported by another rule.
For example, suppose a fixer would like to surround an object key with quotes, but it’s not sure whether the user would prefer single or double quotes.
{ foo: 1 }

// should get fixed to either
{ 'foo': 1 }

// or
{ "foo": 1 }












This fixer can just select a quote type arbitrarily. If it guesses wrong, the resulting code will be automatically reported and fixed by the quotes rule.
Note: Making fixes as small as possible is a best practice, but in some cases it may be correct to extend the range of the fix in order to intentionally prevent other rules from making fixes in a surrounding range in the same pass. For instance, if replacement text declares a new variable, it can be useful to prevent other changes in the scope of the variable as they might cause name collisions.
The following example replaces node and also ensures that no other fixes will be applied in the range of node.parent in the same pass:
context.report({
	node,
	message,
	*fix(fixer) {
		yield fixer.replaceText(node, replacementText);

		// extend range of the fix to the range of `node.parent`
		yield fixer.insertTextBefore(node.parent, "");
		yield fixer.insertTextAfter(node.parent, "");
	},
});












Conflicting Fixes
Conflicting fixes are fixes that apply different changes to the same part of the source code. There is no way to specify which of the conflicting fixes is applied.
For example, if two fixes want to modify characters 0 through 5, only one is applied.
Providing Suggestions
In some cases fixes aren’t appropriate to be automatically applied, for example, if a fix potentially changes functionality or if there are multiple valid ways to fix a rule depending on the implementation intent (see the best practices for applying fixes listed above). In these cases, there is an alternative suggest option on context.report() that allows other tools, such as editors, to expose helpers for users to manually apply a suggestion.
To provide suggestions, use the suggest key in the report argument with an array of suggestion objects. The suggestion objects represent individual suggestions that could be applied and require either a desc key string that describes what applying the suggestion would do or a messageId key (see below), and a fix key that is a function defining the suggestion result. This fix function follows the same API as regular fixes (described above in applying fixes).

context.report({
    node: node,
    message: "Unnecessary escape character: \\{{character}}.",
    data: { character },
    suggest: [
        {
            desc: "Remove the `\\`. This maintains the current functionality.",
            fix: function(fixer) {
                return fixer.removeRange(range);
            }
        },
        {
            desc: "Replace the `\\` with `\\\\` to include the actual backslash character.",
            fix: function(fixer) {
                return fixer.insertTextBeforeRange(range, "\\");
            }
        }
    ]
});























Important: The meta.hasSuggestions property is mandatory for rules that provide suggestions. ESLint will throw an error if a rule attempts to produce a suggestion but does not export this property.
Note: Suggestions are applied as stand-alone changes, without triggering multipass fixes. Each suggestion should focus on a singular change in the code and should not try to conform to user-defined styles. For example, if a suggestion is adding a new statement into the codebase, it should not try to match correct indentation or conform to user preferences on the presence/absence of semicolons. All of those things can be corrected by multipass autofix when the user triggers it.
Best practices for suggestions:
Don’t try to do too much and suggest large refactors that could introduce a lot of breaking changes.
As noted above, don’t try to conform to user-defined styles.
Suggestions are intended to provide fixes. ESLint will automatically remove the whole suggestion from the linting output if the suggestion’s fix function returned null or an empty array/sequence.
Suggestion messageIds
Instead of using a desc key for suggestions a messageId can be used instead. This works the same way as messageIds for the overall error (see messageIds). Here is an example of how to use a suggestion messageId in a rule:

module.exports = {
    meta: {
        messages: {
            unnecessaryEscape: "Unnecessary escape character: \\{{character}}.",
            removeEscape: "Remove the `\\`. This maintains the current functionality.",
            escapeBackslash: "Replace the `\\` with `\\\\` to include the actual backslash character."
        },
        hasSuggestions: true
    },
    create: function(context) {
        // ...
        context.report({
            node: node,
            messageId: 'unnecessaryEscape',
            data: { character },
            suggest: [
                {
                    messageId: "removeEscape", // suggestion messageId
                    fix: function(fixer) {
                        return fixer.removeRange(range);
                    }
                },
                {
                    messageId: "escapeBackslash", // suggestion messageId
                    fix: function(fixer) {
                        return fixer.insertTextBeforeRange(range, "\\");
                    }
                }
            ]
        });
    }
};




































Placeholders in Suggestion Messages
You can also use placeholders in the suggestion message. This works the same way as placeholders for the overall error (see using message placeholders).
Please note that you have to provide data on the suggestion’s object. Suggestion messages cannot use properties from the overall error’s data.

module.exports = {
    meta: {
        messages: {
            unnecessaryEscape: "Unnecessary escape character: \\{{character}}.",
            removeEscape: "Remove `\\` before {{character}}.",
        },
        hasSuggestions: true
    },
    create: function(context) {
        // ...
        context.report({
            node: node,
            messageId: "unnecessaryEscape",
            data: { character }, // data for the unnecessaryEscape overall message
            suggest: [
                {
                    messageId: "removeEscape",
                    data: { character }, // data for the removeEscape suggestion message
                    fix: function(fixer) {
                        return fixer.removeRange(range);
                    }
                }
            ]
        });
    }
};






























Accessing Options Passed to a Rule
Some rules require options in order to function correctly. These options appear in configuration (.eslintrc, command line interface, or comments). For example:
{
	"quotes": ["error", "double"]
}




The quotes rule in this example has one option, "double" (the error is the error level). You can retrieve the options for a rule by using context.options, which is an array containing every configured option for the rule. In this case, context.options[0] would contain "double":
module.exports = {
	meta: {
		schema: [
			{
				enum: ["single", "double", "backtick"],
			},
		],
	},
	create: function (context) {
		var isDouble = context.options[0] === "double";

		// ...
	},
};















Since context.options is just an array, you can use it to determine how many options have been passed as well as retrieving the actual options themselves. Keep in mind that the error level is not part of context.options, as the error level cannot be known or modified from inside a rule.
When using options, make sure that your rule has some logical defaults in case the options are not provided.
Rules with options must specify a schema.
Accessing the Source Code
The SourceCode object is the main object for getting more information about the source code being linted. You can retrieve the SourceCode object at any time by using the context.sourceCode property:
module.exports = {
	create: function (context) {
		var sourceCode = context.sourceCode;

		// ...
	},
};








Deprecated: The context.getSourceCode() method is deprecated; make sure to use context.sourceCode property instead.
Once you have an instance of SourceCode, you can use the following methods on it to work with the code:
getText(node): Returns the source code for the given node. Omit node to get the whole source (see the dedicated section).
getAllComments(): Returns an array of all comments in the source (see the dedicated section).
getCommentsBefore(nodeOrToken): Returns an array of comment tokens that occur directly before the given node or token (see the dedicated section).
getCommentsAfter(nodeOrToken): Returns an array of comment tokens that occur directly after the given node or token (see the dedicated section).
getCommentsInside(node): Returns an array of all comment tokens inside a given node (see the dedicated section).
isSpaceBetween(nodeOrToken, nodeOrToken): Returns true if there is a whitespace character between the two tokens or, if given a node, the last token of the first node and the first token of the second node.
isGlobalReference(node): Returns true if the identifier references a global variable configured via languageOptions.globals, /* global */ comments, or ecmaVersion, and not declared by a local binding.
getFirstToken(node, skipOptions): Returns the first token representing the given node.
getFirstTokens(node, countOptions): Returns the first count tokens representing the given node.
getLastToken(node, skipOptions): Returns the last token representing the given node.
getLastTokens(node, countOptions): Returns the last count tokens representing the given node.
getTokenAfter(nodeOrToken, skipOptions): Returns the first token after the given node or token.
getTokensAfter(nodeOrToken, countOptions): Returns count tokens after the given node or token.
getTokenBefore(nodeOrToken, skipOptions): Returns the first token before the given node or token.
getTokensBefore(nodeOrToken, countOptions): Returns count tokens before the given node or token.
getFirstTokenBetween(nodeOrToken1, nodeOrToken2, skipOptions): Returns the first token between two nodes or tokens.
getFirstTokensBetween(nodeOrToken1, nodeOrToken2, countOptions): Returns the first count tokens between two nodes or tokens.
getLastTokenBetween(nodeOrToken1, nodeOrToken2, skipOptions): Returns the last token between two nodes or tokens.
getLastTokensBetween(nodeOrToken1, nodeOrToken2, countOptions): Returns the last count tokens between two nodes or tokens.
getTokens(node): Returns all tokens for the given node.
getTokensBetween(nodeOrToken1, nodeOrToken2): Returns all tokens between two nodes.
getTokenByRangeStart(index, rangeOptions): Returns the token whose range starts at the given index in the source.
getNodeByRangeIndex(index): Returns the deepest node in the AST containing the given source index.
getLocFromIndex(index): Returns an object with line and column properties, corresponding to the location of the given source index. line is 1-based and column is 0-based.
getIndexFromLoc(loc): Returns the index of a given location in the source code, where loc is an object with a 1-based line key and a 0-based column key.
commentsExistBetween(nodeOrToken1, nodeOrToken2): Returns true if comments exist between two nodes.
getAncestors(node): Returns an array of the ancestors of the given node, starting at the root of the AST and continuing through the direct parent of the given node. This array does not include the given node itself.
getDeclaredVariables(node): Returns a list of variables declared by the given node. This information can be used to track references to variables.
If the node is a VariableDeclaration, all variables declared in the declaration are returned.
If the node is a VariableDeclarator, all variables declared in the declarator are returned.
If the node is a FunctionDeclaration or FunctionExpression, the variable for the function name is returned, in addition to variables for the function parameters.
If the node is an ArrowFunctionExpression, variables for the parameters are returned.
If the node is a ClassDeclaration or a ClassExpression, the variable for the class name is returned.
If the node is a CatchClause, the variable for the exception is returned.
If the node is an ImportDeclaration, variables for all of its specifiers are returned.
If the node is an ImportSpecifier, ImportDefaultSpecifier, or ImportNamespaceSpecifier, the declared variable is returned.
Otherwise, if the node does not declare any variables, an empty array is returned.
getScope(node): Returns the scope of the given node. This information can be used to track references to variables.
markVariableAsUsed(name, refNode): Marks a variable with the given name in a scope indicated by the given reference node as used. This affects the no-unused-vars rule. Returns true if a variable with the given name was found and marked as used, otherwise false.
skipOptions is an object which has 3 properties; skip, includeComments, and filter. Default is {skip: 0, includeComments: false, filter: null}.
skip: (number) Positive integer, the number of skipping tokens. If filter option is given at the same time, it doesn’t count filtered tokens as skipped.
includeComments: (boolean) The flag to include comment tokens into the result.
filter(token): Function which gets a token as the first argument. If the function returns false then the result excludes the token.
countOptions is an object which has 3 properties; count, includeComments, and filter. Default is {count: 0, includeComments: false, filter: null}.
count: (number) Positive integer, the maximum number of returning tokens.
includeComments: (boolean) The flag to include comment tokens into the result.
filter(token): Function which gets a token as the first argument, if the function returns false then the result excludes the token.
rangeOptions is an object that has 1 property, includeComments. Default is {includeComments: false}.
includeComments: (boolean) The flag to include comment tokens into the result.
There are also some properties you can access:
hasBOM: (boolean) The flag to indicate whether the source code has Unicode BOM.
text: (string) The full text of the code being linted. Unicode BOM has been stripped from this text.
ast: (object) Program node of the AST for the code being linted.
scopeManager: ScopeManager object of the code.
visitorKeys: (object) Visitor keys to traverse this AST.
parserServices: (object) Contains parser-provided services for rules. The default parser does not provide any services. However, if a rule is intended to be used with a custom parser, it could use parserServices to access anything provided by that parser. (For example, a TypeScript parser could provide the ability to get the computed type of a given node.)
lines: (array) Array of lines, split according to the specification’s definition of line breaks.
You should use a SourceCode object whenever you need to get more information about the code being linted.
Accessing the Source Text
If your rule needs to get the actual JavaScript source to work with, then use the sourceCode.getText() method. This method works as follows:
// get all source
var source = sourceCode.getText();

// get source for just this AST node
var nodeSource = sourceCode.getText(node);

// get source for AST node plus previous two characters
var nodeSourceWithPrev = sourceCode.getText(node, 2);

// get source for AST node plus following two characters
var nodeSourceWithFollowing = sourceCode.getText(node, 0, 2);












In this way, you can look for patterns in the JavaScript text itself when the AST isn’t providing the appropriate data (such as the location of commas, semicolons, parentheses, etc.).
Accessing Comments
While comments are not technically part of the AST, ESLint provides the sourceCode.getAllComments(), sourceCode.getCommentsBefore(), sourceCode.getCommentsAfter(), and sourceCode.getCommentsInside() to access them.
sourceCode.getCommentsBefore(), sourceCode.getCommentsAfter(), and sourceCode.getCommentsInside() are useful for rules that need to check comments in relation to a given node or token.
Keep in mind that the results of these methods are calculated on demand.
You can also access comments through many of sourceCode’s methods using the includeComments option.
Options Schemas
Rules with options must specify a meta.schema property, which is a JSON Schema format description of a rule’s options which will be used by ESLint to validate configuration options and prevent invalid or unexpected inputs before they are passed to the rule in context.options.
If your rule has options, it is strongly recommended that you specify a schema for options validation. However, it is possible to opt-out of options validation by setting schema: false, but doing so is discouraged as it increases the chance of bugs and mistakes.
For rules that don’t specify a meta.schema property, ESLint throws errors when any options are passed. If your rule doesn’t have options, do not set schema: false, but simply omit the schema property or use schema: [], both of which prevent any options from being passed.
When validating a rule’s config, there are five steps:
If the rule config is not an array, then the value is wrapped into an array (e.g. "off" becomes ["off"]); if the rule config is an array then it is used directly.
ESLint validates the first element of the rule config array as a severity ("off", "warn", "error", 0, 1, 2)
If the severity is off or 0, then the rule is disabled and validation stops, ignoring any other elements of the rule config array.
If the rule is enabled, then any elements of the array after the severity are copied into the context.options array (e.g. a config of ["warn", "never", { someOption: 5 }] results in context.options = ["never", { someOption: 5 }])
The rule’s schema validation is run on the context.options array.
Note: this means that the rule schema cannot validate the severity. The rule schema only validates the array elements after the severity in a rule config. There is no way for a rule to know what severity it is configured at.
There are two formats for a rule’s schema:
An array of JSON Schema objects
Each element will be checked against the same position in the context.options array.
If the context.options array has fewer elements than there are schemas, then the unmatched schemas are ignored.
If the context.options array has more elements than there are schemas, then the validation fails.
There are two important consequences to using this format:
It is always valid for a user to provide no options to your rule (beyond severity).
If you specify an empty array, then it is always an error for a user to provide any options to your rule (beyond severity).
A full JSON Schema object that will validate the context.options array
The schema should assume an array of options to validate even if your rule only accepts one option.
The schema can be arbitrarily complex, so you can validate completely different sets of potential options via oneOf, anyOf etc.
The supported version of JSON Schemas is Draft-04, so some newer features such as if or $data are unavailable.
At present, it is explicitly planned to not update schema support beyond this level due to ecosystem compatibility concerns. See this comment for further context.
For example, the yoda rule accepts a primary mode argument of "always" or "never", as well as an extra options object with an optional property exceptRange:
// Valid configuration:
// "yoda": "warn"
// "yoda": ["error"]
// "yoda": ["error", "always"]
// "yoda": ["error", "never", { "exceptRange": true }]
// Invalid configuration:
// "yoda": ["warn", "never", { "exceptRange": true }, 5]
// "yoda": ["error", { "exceptRange": true }, "never"]
module.exports = {
	meta: {
		schema: [
			{
				enum: ["always", "never"],
			},
			{
				type: "object",
				properties: {
					exceptRange: { type: "boolean" },
				},
				additionalProperties: false,
			},
		],
	},
};

























And here is the equivalent object-based schema:
// Valid configuration:
// "yoda": "warn"
// "yoda": ["error"]
// "yoda": ["error", "always"]
// "yoda": ["error", "never", { "exceptRange": true }]
// Invalid configuration:
// "yoda": ["warn", "never", { "exceptRange": true }, 5]
// "yoda": ["error", { "exceptRange": true }, "never"]
module.exports = {
	meta: {
		schema: {
			type: "array",
			minItems: 0,
			maxItems: 2,
			items: [
				{
					enum: ["always", "never"],
				},
				{
					type: "object",
					properties: {
						exceptRange: { type: "boolean" },
					},
					additionalProperties: false,
				},
			],
		},
	},
};






























Object schemas can be more precise and restrictive in what is permitted. For example, the below schema always requires the first option to be specified (a number between 0 and 10), but the second option is optional, and can either be an object with some options explicitly set, or "off" or "strict".
// Valid configuration:
// "someRule": ["error", 6]
// "someRule": ["error", 5, "strict"]
// "someRule": ["warn", 10, { someNonOptionalProperty: true }]
// Invalid configuration:
// "someRule": "warn"
// "someRule": ["error"]
// "someRule": ["warn", 15]
// "someRule": ["warn", 7, { }]
// "someRule": ["error", 3, "on"]
// "someRule": ["warn", 7, { someOtherProperty: 5 }]
// "someRule": ["warn", 7, { someNonOptionalProperty: false, someOtherProperty: 5 }]
module.exports = {
	meta: {
		schema: {
			type: "array",
			minItems: 1, // Can't specify only severity!
			maxItems: 2,
			items: [
				{
					type: "number",
					minimum: 0,
					maximum: 10,
				},
				{
					anyOf: [
						{
							type: "object",
							properties: {
								someNonOptionalProperty: { type: "boolean" },
							},
							required: ["someNonOptionalProperty"],
							additionalProperties: false,
						},
						{
							enum: ["off", "strict"],
						},
					],
				},
			],
		},
	},
};












































Remember, rule options are always an array, so be careful not to specify a schema for a non-array type at the top level. If your schema does not specify an array at the top-level, users can never enable your rule, as their configuration will always be invalid when the rule is enabled.
Here’s an example schema that will always fail validation:
// Possibly trying to validate ["error", { someOptionalProperty: true }]
// but when the rule is enabled, config will always fail validation because the options are an array which doesn't match "object"
module.exports = {
	meta: {
		schema: {
			type: "object",
			properties: {
				someOptionalProperty: {
					type: "boolean",
				},
			},
			additionalProperties: false,
		},
	},
};
















Note: If your rule schema uses JSON schema $ref properties, you must use the full JSON Schema object rather than the array of positional property schemas. This is because ESLint transforms the array shorthand into a single schema without updating references that makes them incorrect (they are ignored).
To learn more about JSON Schema, we recommend looking at some examples on the JSON Schema website, or reading the free Understanding JSON Schema ebook.
Option Defaults
Rules may specify a meta.defaultOptions array of default values for any options. When the rule is enabled in a user configuration, ESLint will recursively merge any user-provided option elements on top of the default elements.
For example, given the following defaults:
export default {
	meta: {
		defaultOptions: [
			{
				alias: "basic",
			},
		],
		schema: [
			{
				type: "object",
				properties: {
					alias: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
		],
	},
	create(context) {
		const [{ alias }] = context.options;

		return {
			/* ... */
		};
	},
};




























The rule would have a runtime alias value of "basic" unless the user configuration specifies a different value, such as with ["error", { alias: "complex" }].
Each element of the options array is merged according to the following rules:
Any missing value or explicit user-provided undefined will fall back to a default option
User-provided arrays and primitive values other than undefined override a default option
User-provided objects will merge into a default option object and replace a non-object default otherwise
Option defaults will also be validated against the rule’s meta.schema.
Note: ESLint internally uses Ajv for schema validation with its useDefaults option enabled. Both user-provided and meta.defaultOptions options will override any defaults specified in a rule’s schema. ESLint may disable Ajv’s useDefaults in a future major version.
Accessing Shebangs
Shebangs (#!) are represented by the unique tokens of type "Shebang". They are treated as comments and can be accessed by the methods outlined in the Accessing Comments section, such as sourceCode.getAllComments().
Accessing Variable Scopes
The SourceCode#getScope(node) method returns the scope of the given node. It is a useful method for finding information about the variables in a given scope and how they are used in other scopes.
Tip
You can view scope information for any JavaScript code using Code Explorer.
Scope types
The following table contains a list of AST node types and the scope type that they correspond to. For more information about the scope types, refer to the Scope object documentation.
AST Node Type
Scope Type
Program
global
FunctionDeclaration
function
FunctionExpression
function
ArrowFunctionExpression
function
ClassDeclaration
class
ClassExpression
class
BlockStatement ※1
block
SwitchStatement ※1
switch
ForStatement ※2
for
ForInStatement ※2
for
ForOfStatement ※2
for
WithStatement
with
CatchClause
catch
others
※3

※1 Only if the configured parser provided the block-scope feature. The default parser provides the block-scope feature if parserOptions.ecmaVersion is not less than 6.
※2 Only if the for statement defines the iteration variable as a block-scoped variable (E.g., for (let i = 0;;) {}).
※3 The scope of the closest ancestor node which has own scope. If the closest ancestor node has multiple scopes then it chooses the innermost scope (E.g., the Program node has a global scope and a module scope if Program#sourceType is "module". The innermost scope is the module scope.).
Scope Variables
The Scope#variables property contains an array of Variable objects. These are the variables declared in current scope. You can use these Variable objects to track references to a variable throughout the entire module.
Inside of each Variable, the Variable#references property contains an array of Reference objects. The Reference array contains all the locations where the variable is referenced in the module’s source code.
Also inside of each Variable, the Variable#defs property contains an array of Definition objects. You can use the Definitions to find where the variable was defined.
Global variables have the following additional properties:
Variable#writeable (boolean | undefined) … If true, this global variable can be assigned arbitrary value. If false, this global variable is read-only.
Variable#eslintExplicitGlobal (boolean | undefined) … If true, this global variable was defined by a /* globals */ directive comment in the source code file.
Variable#eslintExplicitGlobalComments (Comment[] | undefined) … The array of /* globals */ directive comments which defined this global variable in the source code file. This property is undefined if there are no /* globals */ directive comments.
Variable#eslintImplicitGlobalSetting ("readonly" | "writable" | undefined) … The configured value in config files. This can be different from variable.writeable if there are /* globals */ directive comments.
For examples of using SourceCode#getScope() to track variables, refer to the source code for the following built-in rules:
no-shadow: Calls sourceCode.getScope() at the Program node and inspects all child scopes to make sure a variable name is not reused at a lower scope. (no-shadow documentation)
no-redeclare: Calls sourceCode.getScope() at each scope to make sure that a variable is not declared twice in the same scope. (no-redeclare documentation)
Marking Variables as Used
Certain ESLint rules, such as no-unused-vars, check to see if a variable has been used. ESLint itself only knows about the standard rules of variable access and so custom ways of accessing variables may not register as “used”.
To help with this, you can use the sourceCode.markVariableAsUsed() method. This method takes two arguments: the name of the variable to mark as used and an option reference node indicating the scope in which you are working. Here’s an example:
module.exports = {
	create: function (context) {
		var sourceCode = context.sourceCode;

		return {
			ReturnStatement(node) {
				// look in the scope of the function for myCustomVar and mark as used
				sourceCode.markVariableAsUsed("myCustomVar", node);

				// or: look in the global scope for myCustomVar and mark as used
				sourceCode.markVariableAsUsed("myCustomVar");
			},
		};
		// ...
	},
};

















Here, the myCustomVar variable is marked as used relative to a ReturnStatement node, which means ESLint will start searching from the scope closest to that node. If you omit the second argument, then the top-level scope is used. (For ESM files, the top-level scope is the module scope; for CommonJS files, the top-level scope is the first function scope.)
Accessing Code Paths
ESLint analyzes code paths while traversing AST. You can access code path objects with seven events related to code paths. For more information, refer to Code Path Analysis.
Deprecated SourceCode Methods
Please note that the following SourceCode methods have been deprecated and will be removed in a future version of ESLint:
getTokenOrCommentBefore(): Replaced by SourceCode#getTokenBefore() with the { includeComments: true } option.
getTokenOrCommentAfter(): Replaced by SourceCode#getTokenAfter() with the { includeComments: true } option.
isSpaceBetweenTokens(): Replaced by SourceCode#isSpaceBetween()
getJSDocComment()
Rule Unit Tests
ESLint provides the RuleTester utility to make it easy to write tests for rules.
Rule Naming Conventions
While you can give a custom rule any name you’d like, the core rules have naming conventions. It could be clearer to apply these same naming conventions to your custom rule. To learn more, refer to the Core Rule Naming Conventions documentation.
Runtime Rules
The thing that makes ESLint different from other linters is the ability to define custom rules at runtime. This is perfect for rules that are specific to your project or company and wouldn’t make sense for ESLint to ship with or be included in a plugin. Just write your rules and include them at runtime.
Runtime rules are written in the same format as all other rules. Create your rule as you would any other and then follow these steps:
Place all of your runtime rules in the same directory (e.g., eslint_rules).
Create a configuration file and specify your rule ID error level under the rules key. Your rule will not run unless it has a value of "warn" or "error" in the configuration file.
Run the command line interface using the --rulesdir option to specify the location of your runtime rules.
Profile Rule Performance
ESLint has a built-in method to track the performance of individual rules. Setting the TIMING environment variable will trigger the display, upon linting completion, of the ten longest-running rules, along with their individual running time (rule creation + rule execution) and relative performance impact as a percentage of total rule processing time (rule creation + rule execution).
$ TIMING=1 eslint lib
Rule                    | Time (ms) | Relative
:-----------------------|----------:|--------:
no-multi-spaces         |    52.472 |     6.1%
camelcase               |    48.684 |     5.7%
no-irregular-whitespace |    43.847 |     5.1%
valid-jsdoc             |    40.346 |     4.7%
handle-callback-err     |    39.153 |     4.6%
space-infix-ops         |    35.444 |     4.1%
no-undefined            |    25.693 |     3.0%
no-shadow               |    22.759 |     2.7%
no-empty-class          |    21.976 |     2.6%
semi                    |    19.359 |     2.3%














To test one rule explicitly, combine the --no-eslintrc, and --rule options:
$ TIMING=1 eslint --no-eslintrc --rule "quotes: [2, 'double']" lib
Rule   | Time (ms) | Relative
:------|----------:|--------:
quotes |    18.066 |   100.0%





To see a longer list of results (more than 10), set the environment variable to another value such as TIMING=50 or TIMING=all.
For more granular timing information (per file per rule), use the stats option instead.
Edit this page
Table of Contents
Rule Structure
The Context Object
Reporting Problems
Using Message Placeholders
messageIds
Applying Fixes
Conflicting Fixes
Providing Suggestions
Suggestion messageIds
Placeholders in Suggestion Messages
Accessing Options Passed to a Rule
Accessing the Source Code
Accessing the Source Text
Accessing Comments
Options Schemas
Option Defaults
Accessing Shebangs
Accessing Variable Scopes
Scope types
Scope Variables
Marking Variables as Used
Accessing Code Paths
Deprecated SourceCode Methods
Rule Unit Tests
Rule Naming Conventions
Runtime Rules
Profile Rule Performance
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Custom Processors
You can also create custom processors that tell ESLint how to process files other than standard JavaScript. For example, you could write a custom processor to extract and process JavaScript from Markdown files (@eslint/markdown includes a custom processor for this).
Tip
This page explains how to create a custom processor for use with the flat config format. For the deprecated eslintrc format, see the deprecated documentation.
Custom Processor Specification
In order to create a custom processor, the object exported from your module has to conform to the following interface:
const plugin = {
	meta: {
		name: "eslint-plugin-example",
		version: "1.2.3",
	},
	processors: {
		"processor-name": {
			meta: {
				name: "eslint-processor-name",
				version: "1.2.3",
			},
			// takes text of the file and filename
			preprocess(text, filename) {
				// here, you can strip out any non-JS content
				// and split into multiple strings to lint

				return [
					// return an array of code blocks to lint
					{ text: code1, filename: "0.js" },
					{ text: code2, filename: "1.js" },
				];
			},

			// takes a Message[][] and filename
			postprocess(messages, filename) {
				// `messages` argument contains two-dimensional array of Message objects
				// where each top-level array item contains array of lint messages related
				// to the text that was returned in array from preprocess() method

				// you need to return a one-dimensional array of the messages you want to keep
				return [].concat(...messages);
			},

			supportsAutofix: true, // (optional, defaults to false)
		},
	},
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;












































The preprocess method takes the file contents and filename as arguments, and returns an array of code blocks to lint. The code blocks will be linted separately but still be registered to the filename.
A code block has two properties text and filename. The text property is the content of the block and the filename property is the name of the block. The name of the block can be anything, but should include the file extension, which tells ESLint how to process the current block. ESLint checks matching files entries in the project’s config to determine if the code blocks should be linted.
It’s up to the plugin to decide if it needs to return just one part of the non-JavaScript file or multiple pieces. For example in the case of processing .html files, you might want to return just one item in the array by combining all scripts. However, for .md files, you can return multiple items because each JavaScript block might be independent.
The postprocess method takes a two-dimensional array of arrays of lint messages and the filename. Each item in the input array corresponds to the part that was returned from the preprocess method. The postprocess method must adjust the locations of all errors to correspond to locations in the original, unprocessed code, and aggregate them into a single flat array and return it.
Reported problems have the following location information in each lint message:
type LintMessage = {
	/// The 1-based line number where the message occurs.
	line?: number;

	/// The 1-based column number where the message occurs.
	column?: number;

	/// The 1-based line number of the end location.
	endLine?: number;

	/// The 1-based column number of the end location.
	endColumn?: number;

	/// If `true`, this is a fatal error.
	fatal?: boolean;

	/// Information for an autofix.
	fix: Fix;

	/// The error message.
	message: string;

	/// The ID of the rule which generated the message, or `null` if not applicable.
	ruleId: string | null;

	/// The severity of the message.
	severity: 0 | 1 | 2;

	/// Information for suggestions.
	suggestions?: Suggestion[];
};

type Fix = {
	range: [number, number];
	text: string;
};

type Suggestion = {
	desc?: string;
	messageId?: string;
	fix: Fix;
};











































By default, ESLint does not perform autofixes when a custom processor is used, even when the --fix flag is enabled on the command line. To allow ESLint to autofix code when using your processor, you should take the following additional steps:
Update the postprocess method to additionally transform the fix property of reported problems. All autofixable problems have a fix property, which is an object with the following schema:
{
    range: [number, number],
    text: string
}









The range property contains two indexes in the code, referring to the start and end location of a contiguous section of text that will be replaced. The text property refers to the text that will replace the given range.
In the initial list of problems, the fix property will refer to a fix in the processed JavaScript. The postprocess method should transform the object to refer to a fix in the original, unprocessed file.
Add a supportsAutofix: true property to the processor.
You can have both rules and custom processors in a single plugin. You can also have multiple processors in one plugin. To support multiple extensions, add each one to the processors element and point them to the same object.
How meta Objects are Used
The meta object helps ESLint cache configurations that use a processor and to provide more friendly debug messages.
Plugin meta Object
The plugin meta object provides information about the plugin itself. When a processor is specified using the string format plugin-name/processor-name, ESLint automatically uses the plugin meta to generate a name for the processor. This is the most common case for processors.
Example:
// eslint.config.js
import { defineConfig } from "eslint/config";
import example from "eslint-plugin-example";

export default defineConfig([
	{
		files: ["**/*.txt"], // apply processor to text files
		plugins: {
			example,
		},
		processor: "example/processor-name",
	},
	// ... other configs
]);















In this example, the processor name is "example/processor-name", and that’s the value that will be used for serializing configurations.
Processor meta Object
Each processor can also specify its own meta object. This information is used when the processor object is passed directly to processor in a configuration. In that case, ESLint doesn’t know which plugin the processor belongs to. The meta.name property should match the processor name and the meta.version property should match the npm package version for your processors. The easiest way to accomplish this is by reading this information from your package.json.
Example:
// eslint.config.js
import { defineConfig } from "eslint/config";
import example from "eslint-plugin-example";

export default defineConfig([
	{
		files: ["**/*.txt"],
		processor: example.processors["processor-name"],
	},
	// ... other configs
]);












In this example, specifying example.processors["processor-name"] directly uses the processor’s own meta object, which must be defined to ensure proper handling when the processor is not referenced through the plugin name.
Why Both Meta Objects are Needed
It is recommended that both the plugin and each processor provide their respective meta objects. This ensures that features relying on meta objects, such as --print-config and --cache, work correctly regardless of how the processor is specified in the configuration.
Specifying Processor in Config Files
In order to use a processor from a plugin in a configuration file, import the plugin and include it in the plugins key, specifying a namespace. Then, use that namespace to reference the processor in the processor configuration, like this:
// eslint.config.js
import { defineConfig } from "eslint/config";
import example from "eslint-plugin-example";

export default defineConfig([
	{
		files: ["**/*.txt"],
		plugins: {
			example,
		},
		processor: "example/processor-name",
	},
]);














See Specify a Processor in the Plugin Configuration documentation for more details.
Edit this page
Table of Contents
Custom Processor Specification
How meta Objects are Used
Plugin meta Object
Processor meta Object
Why Both Meta Objects are Needed
Specifying Processor in Config Files
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Languages
Starting with ESLint v9.7.0, you can extend ESLint with additional languages through plugins. While ESLint began as a linter strictly for JavaScript, the ESLint core is generic and can be used to lint any programming language. Each language is defined as an object that contains all of the parsing, evaluating, and traversal functionality required to lint a file. These languages are then distributed in plugins for use in user configurations.
Language Requirements
In order to create a language, you need:
A parser. The parser is the piece that converts plain text into a data structure. There is no specific format that ESLint requires the data structure to be in, so you can use any already-existing parser, or write your own.
A SourceCode object. The way ESLint works with an AST is through a SourceCode object. There are some required methods on each SourceCode, and you can also add more methods or properties that you’d like to expose to rules.
A Language object. The Language object contains information about the language itself along with methods for parsing and creating the SourceCode object.
Parser Requirements for Languages
To get started, make sure you have a parser that can be called from JavaScript. The parser must return a data structure representing the code that was parsed. Most parsers return an abstract syntax tree (AST) to represent the code, but they can also return a concrete syntax tree (CST). Whether an AST or CST is returned doesn’t matter to ESLint, it only matters that there is a data structure to traverse.
While there is no specific structure an AST or CST must follow, it’s easier to integrate with ESLint when each node in the tree contains the following information:
Type - A property on each node representing the node type is required. For example, in JavaScript, the type property contains this information for each node. ESLint rules use node types to define the visitor methods, so it’s important that each node can be identified by a string. The name of the property doesn’t matter (discussed further below) so long as one exists. This property is typically named type or kind by most parsers.
Location - A property on each node representing the location of the node in the original source code is required. The location must contain:
The line on which the node starts
The column on which the node starts
The line on which the node ends
The column on which the node ends
As with the node type, the property name doesn’t matter. Two common property names are loc (as in ESTree) and position (as in Unist). This information is used by ESLint to report errors and rule violations.
Range - A property on each node representing the location of the node’s source inside the source code is required. The range indicates the index at which the first character is found and the index after the last character, such that calling code.slice(start, end) returns the text that the node represents. Once again, no specific property name is required, and this information may even be merged with location information. ESTree uses the range property while Unist includes this information on position along with the location information. This information is used by ESLint to apply autofixes.
The SourceCode Object
ESLint holds information about source code in a SourceCode object. This object is the API used both by ESLint internally and by rules written to work on the code (via context.sourceCode). The SourceCode object must implement the TextSourceCode interface as defined in the @eslint/core package.
A basic SourceCode object must implement the following:
ast - a property containing the AST or CST for the source code.
text - the text of the source code.
getLoc(nodeOrToken) - a method that returns the location of a given node or token. This must match the loc structure that ESTree uses.
getRange(nodeOrToken) - a method that returns the range of a given node or token. This must return an array where the first item is the start index and the second is the end index.
traverse() - a method that returns an iterable for traversing the AST or CST. The iterator must return objects that implement either VisitTraversalStep or CallTraversalStep from @eslint/core.
The following optional members allow you to customize how ESLint interacts with the object:
visitorKeys - visitor keys that are specific to just this SourceCode object. Typically not necessary as Language#visitorKeys is used most of the time.
applyLanguageOptions(languageOptions) - if you have specific language options that need to be applied after parsing, you can do so in this method.
getDisableDirectives() - returns any disable directives in the code. ESLint uses this to apply disable directives and track unused directives.
getInlineConfigNodes() - returns any inline config nodes. ESLint uses this to report errors when noInlineConfig is enabled.
applyInlineConfig() - returns inline configuration elements to ESLint. ESLint uses this to alter the configuration of the file being linted.
finalize() - this method is called just before linting begins and is your last chance to modify SourceCode. If you’ve defined applyLanguageOptions() or applyInlineConfig(), then you may have additional changes to apply before the SourceCode object is ready.
Additionally, the following members are common on SourceCode objects and are recommended to implement:
lines - the individual lines of the source code as an array of strings.
getParent(node) - returns the parent of the given node or undefined if the node is the root.
getAncestors(node) - returns an array of the ancestry of the node with the first item as the root of the tree and each subsequent item as the descendants of the root that lead to node.
getText(node, beforeCount, afterCount) - returns the string that represents the given node, and optionally, a specified number of characters before and after the node’s range.
See JSONSourceCode as an example of a basic SourceCode class.
Tip
The @eslint/plugin-kit package contains multiple classes that aim to make creating a SourceCode object easier. The TextSourceCodeBase class, in particular, implements the TextSourceCode interface and provides some basic functionality typically found in SourceCode objects.
The Language Object
The Language object contains all of the information about the programming language as well as methods for interacting with code written in that language. ESLint uses this object to determine how to deal with a particular file. The Language object must implement the Language interface as defined in the @eslint/core package.
A basic Language object must implement the following:
fileType - should be "text" (in the future, we will also support "binary")
lineStart - either 0 or 1 to indicate how the AST represents the first line in the file. ESLint uses this to correctly display error locations.
columnStart - either 0 or 1 to indicate how the AST represents the first column in each line. ESLint uses this to correctly display error locations.
nodeTypeKey - the name of the property that indicates the node type (usually "type" or "kind").
validateLanguageOptions(languageOptions) - validates language options for the language. This method is expected to throw a validation error when an expected language option doesn’t have the correct type or value. Unexpected language options should be silently ignored and no error should be thrown. This method is required even if the language doesn’t specify any options.
parse(file, context) - parses the given file into an AST or CST, and can also include additional values meant for use in rules. Called internally by ESLint.
createSourceCode(file, parseResult, context) - creates a SourceCode object. Call internally by ESLint after parse(), and the second argument is the exact return value from parse().
The following optional members allow you to customize how ESLint interacts with the object:
visitorKeys - visitor keys that are specific to the AST or CST. This is used to optimize traversal of the AST or CST inside of ESLint. While not required, it is strongly recommended, especially for AST or CST formats that deviate significantly from ESTree format.
defaultLanguageOptions - default languageOptions when the language is used. User-specified languageOptions are merged with this object when calculating the config for the file being linted.
matchesSelectorClass(className, node, ancestry) - allows you to specify selector classes, such as :expression, that match more than one node. This method is called whenever an esquery selector contains a : followed by an identifier.
normalizeLanguageOptions(languageOptions) - takes a validated language options object and normalizes its values. This is helpful for backwards compatibility when language options properties change and also to add custom serialization with a toJSON() method.
See JSONLanguage as an example of a basic Language class.
Publish a Language in a Plugin
Languages are published in plugins similar to processors and rules. Define the languages key in your plugin as an object whose names are the language names and the values are the language objects. Here’s an example:
import { myLanguage } from "../languages/my.js";

const plugin = {
	// preferred location of name and version
	meta: {
		name: "eslint-plugin-example",
		version: "1.2.3",
	},
	languages: {
		my: myLanguage,
	},
	rules: {
		// add rules here
	},
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;






















In order to use a language from a plugin in a configuration file, import the plugin and include it in the plugins key, specifying a namespace. Then, use that namespace to reference the language in the language configuration, like this:
// eslint.config.js
import { defineConfig } from "eslint/config";
import example from "eslint-plugin-example";

export default defineConfig([
	{
		files: ["**/*.my"],
		plugins: {
			example,
		},
		language: "example/my",
	},
]);














See Specify a Language in the Plugin Configuration documentation for more details.
Edit this page
Table of Contents
Language Requirements
Parser Requirements for Languages
The SourceCode Object
The Language Object
Publish a Language in a Plugin
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Plugin Migration to Flat Config
Beginning in ESLint v9.0.0, the default configuration system will be the new flat config system. In order for your plugins to work with flat config files, you’ll need to make some changes to your existing plugins.
Recommended Plugin Structure
To make it easier to work with your plugin in the flat config system, it’s recommended that you switch your existing plugin entrypoint to look like this:
const plugin = {
	meta: {},
	configs: {},
	rules: {},
	processors: {},
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;













This structure allows the most flexibility when making other changes discussed on this page.
Adding Plugin Meta Information
With the old eslintrc configuration system, ESLint could pull information about the plugin from the package name, but with flat config, ESLint no longer has access to the name of the plugin package. To replace that missing information, you should add a meta key that contains at least a name key, and ideally, a version key, such as:
const plugin = {
	meta: {
		name: "eslint-plugin-example",
		version: "1.0.0",
	},
	configs: {},
	rules: {},
	processors: {},
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
















If your plugin is published as an npm package, the name and version should be the same as in your package.json file; otherwise, you can assign any value you’d like.
Without this meta information, your plugin will not be usable with the --cache and --print-config command line options.
Migrating Rules for Flat Config
No changes are necessary for the rules key in your plugin. Everything works the same as with the old eslintrc configuration system.
Migrating Processors for Flat Config
Each processor should specify a meta object. For more information, see the full documentation.
No other changes are necessary for the processors key in your plugin as long as you aren’t using file extension-named processors. If you have any file extension-named processors, you must update the name to a valid identifier (numbers and letters). File extension-named processors were automatically applied in the old configuration system but are not automatically applied when using flat config. Here is an example of a file extension-named processor:
const plugin = {
	configs: {},
	rules: {},
	processors: {
		// no longer supported
		".md": {
			preprocess() {},
			postprocess() {},
		},
	},
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;


















The name ".md" is no longer valid for a processor, so it must be replaced with a valid identifier such as markdown:
const plugin = {
	configs: {},
	rules: {},
	processors: {
		// works in both old and new config systems
		markdown: {
			preprocess() {},
			postprocess() {},
		},
	},
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;


















In order to use this renamed processor, you’ll also need to manually specify it inside of a config, such as:
import { defineConfig } from "eslint/config";
import example from "eslint-plugin-example";

export default defineConfig([
	{
		files: ["**/*.md"],
		plugins: {
			example,
		},
		processor: "example/markdown",
	},
]);













You should update your plugin’s documentation to advise your users if you have renamed a file extension-named processor.
Migrating Configs for Flat Config
If your plugin is exporting configs that refer back to your plugin, then you’ll need to update your configs to flat config format. As part of the migration, you’ll need to reference your plugin directly in the plugins key. For example, here is an exported config in the old configuration system format for a plugin named eslint-plugin-example:
// plugin name: eslint-plugin-example
module.exports = {
    configs: {

        // the config referenced by example/recommended
        recommended: {
            plugins: ["example"],
            rules: {
                "example/rule1": "error",
                "example/rule2": "error"
            }
        }
    },
    rules: {
        rule1: {},
        rule2: {};
    }
};



















To migrate to flat config format, you’ll need to move the configs to after the definition of the plugin variable in the recommended plugin structure, like this:
const plugin = {
	configs: {},
	rules: {},
	processors: {},
};

// assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
	recommended: {
		plugins: {
			example: plugin,
		},
		rules: {
			"example/rule1": "error",
			"example/rule2": "error",
		},
	},
});

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;

























Your users can then use this exported config like this:
import { defineConfig } from "eslint/config";
import example from "eslint-plugin-example";

export default defineConfig([
	// use recommended config and provide your own overrides
	{
		files: ["**/*.js"],
		plugins: {
			example,
		},
		extends: ["example/recommended"],
		rules: {
			"example/rule1": "warn",
		},
	},
]);

















If your config extends other configs, you can export an array:
const baseConfig = require("./base-config");

module.exports = {
	configs: {
		extendedConfig: [
			baseConfig,
			{
				rules: {
					"example/rule1": "error",
					"example/rule2": "error",
				},
			},
		],
	},
};
















You should update your documentation so your plugin users know how to reference the exported configs.
For more information, see the full documentation.
Migrating Environments for Flat Config
Environments are no longer supported in flat config, and so we recommend transitioning your environments into exported configs. For example, suppose you export a mocha environment like this:
// plugin name: eslint-plugin-example
module.exports = {
    environments: {
        mocha: {
            globals: {
                it: true,
                xit: true,
                describe: true,
                xdescribe: true
            }
        }
    },
    rules: {
        rule1: {},
        rule2: {};
    }
};


















To migrate this environment into a config, you need to add a new key in the plugin.configs object that has a flat config object containing the same information, like this:
const plugin = {
	configs: {},
	rules: {},
	processors: {},
};

// assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
	mocha: {
		languageOptions: {
			globals: {
				it: "writeable",
				xit: "writeable",
				describe: "writeable",
				xdescribe: "writeable",
			},
		},
	},
});

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;


























Your users can then use this exported config like this:
import { defineConfig } from "eslint/config";
import example from "eslint-plugin-example";

export default defineConfig([
	{
		files: ["**/tests/*.js"],
		plugins: {
			example,
		},

		// use the mocha globals
		extends: ["example/mocha"],

		// and provide your own overrides
		languageOptions: {
			globals: {
				it: "readonly",
			},
		},
	},
]);






















You should update your documentation so your plugin users know how to reference the exported configs.
Backwards Compatibility
If your plugin needs to work with both the old and new configuration systems, then you’ll need to:
Export a CommonJS entrypoint. The old configuration system cannot load plugins that are published only in ESM format. If your source code is in ESM, then you’ll need to use a bundler that can generate a CommonJS version and use the exports key in your package.json file to ensure the CommonJS version can be found by Node.js.
Keep the environments key. If your plugin exports custom environments, you should keep those as they are and also export the equivalent flat configs as described above. The environments key is ignored when ESLint is running in flat config mode.
Export both eslintrc and flat configs. The configs key is only validated when a config is used, so you can provide both formats of configs in the configs key. We recommend that you append older format configs with -legacy to make it clear that these configs will not be supported in the future. For example, if your primary config is called recommended and is in flat config format, then you can also have a config named recommended-legacy that is the eslintrc config format.
Further Reading
Overview of the flat config file format blog post
API usage of new configuration system blog post
Background to new configuration system blog post
Edit this page
Table of Contents
Recommended Plugin Structure
Adding Plugin Meta Information
Migrating Rules for Flat Config
Migrating Processors for Flat Config
Migrating Configs for Flat Config
Migrating Environments for Flat Config
Backwards Compatibility
Further Reading
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Share Configurations
To share your ESLint configuration, create a shareable config. You can publish your shareable config on npm so that others can download and use it in their ESLint projects.
This page explains how to create and publish a shareable config.
Tip
This page explains how to create a shareable config using the flat config format. For the deprecated eslintrc format, see the deprecated documentation.
Creating a Shareable Config
Shareable configs are simply npm packages that export a configuration object or array. To start, create a Node.js module like you normally would.
While you can name the package in any way that you’d like, we recommend using one of the following conventions to make your package easier to identify:
Begin with eslint-config-, such as eslint-config-myconfig.
For an npm scoped module, name or prefix the module with @scope/eslint-config, such as @scope/eslint-config or @scope/eslint-config-myconfig.
In your module, export the shareable config from the module’s main entry point file. The default main entry point is index.js. For example:
// index.js
export default [
	{
		languageOptions: {
			globals: {
				MyGlobal: true,
			},
		},

		rules: {
			semi: [2, "always"],
		},
	},
];















Because the index.js file is just JavaScript, you can read these settings from a file or generate them dynamically.
Tip
Most of the time, you’ll want to export an array of config objects from your shareable config. However, you can also export a single config object. Make sure your documentation clearly shows an example of how to use your shareable config inside of an eslint.config.js file to avoid user confusion.
Publishing a Shareable Config
Once your shareable config is ready, you can publish it to npm to share it with others. We recommend using the eslint and eslintconfig keywords in the package.json file so others can easily find your module.
You should declare your dependency on ESLint in the package.json using the peerDependencies field. The recommended way to declare a dependency for future-proof compatibility is with the “>=” range syntax, using the lowest required ESLint version. For example:
{
	"peerDependencies": {
		"eslint": ">= 9"
	}
}






If your shareable config depends on a plugin or a custom parser, you should specify these packages as dependencies in your package.json.
Using a Shareable Config
To use a shareable config, import the package inside of an eslint.config.js file and add it into the exported array using extends, like this:
// eslint.config.js
import { defineConfig } from "eslint/config";
import myconfig from "eslint-config-myconfig";

export default defineConfig([
	{
		files: ["**/*.js"],
		extends: [myconfig],
	},
]);











Warning
It’s not possible to use shareable configs with the ESLint CLI --config flag.
Overriding Settings from Shareable Configs
You can override settings from the shareable config by adding them directly into your eslint.config.js file after importing the shareable config. For example:
// eslint.config.js
import { defineConfig } from "eslint/config";
import myconfig from "eslint-config-myconfig";

export default defineConfig([
	{
		files: ["**/*.js"],
		extends: [myconfig],

		// anything from here will override myconfig
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);
















Sharing Multiple Configs
Because shareable configs are just npm packages, you can export as many configs as you’d like from the same package. In addition to specifying a default config using the main entry in your package.json, you can specify additional shareable configs by adding a new file to your npm package and then referencing it from your eslint.config.js file.
As an example, you can create a file called my-special-config.js in the root of your npm package and export a config, such as:
// my-special-config.js
export default {
	rules: {
		quotes: [2, "double"],
	},
};







Then, assuming you’re using the package name eslint-config-myconfig, you can access the additional config via:
// eslint.config.js
import { defineConfig } from "eslint/config";
import myconfig from "eslint-config-myconfig";
import mySpecialConfig from "eslint-config-myconfig/my-special-config.js";

export default defineConfig([
	{
		files: ["**/*.js"],
		extends: [myconfig, mySpecialConfig],

		// anything from here will override myconfig
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);

















Important
We strongly recommend always including a default export for your package to avoid confusion.
Further Reading
npm Developer Guide
Edit this page
Table of Contents
Creating a Shareable Config
Publishing a Shareable Config
Using a Shareable Config
Overriding Settings from Shareable Configs
Sharing Multiple Configs
Further Reading
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Custom Formatters
Custom formatters let you display linting results in a format that best fits your needs, whether that’s in a specific file format, a certain display style, or a format optimized for a particular tool.
ESLint also has built-in formatters that you can use.
You can include custom formatters in your project directly or create an npm package to distribute them separately.
Creating a Custom Formatter
Each formatter is a function that receives a results object and a context as arguments and returns a string. For example, the following is how the built-in JSON formatter is implemented:
//my-awesome-formatter.js
module.exports = function (results, context) {
	return JSON.stringify(results, null, 2);
};





A formatter can also be an async function (from ESLint v8.4.0), the following shows a simple example:
//my-awesome-formatter.js
module.exports = async function (results) {
	const formatted = await asyncTask();
	return formatted;
};






To run ESLint with this formatter, you can use the -f (or --format) command line flag. You must begin the path to a locally defined custom formatter with a period (.), such as ./my-awesome-formatter.js or ../formatters/my-awesome-formatter.js.
eslint -f ./my-awesome-formatter.js src/


The remainder of this section contains reference information on how to work with custom formatter functions.
The results Argument
The results object passed into a formatter is an array of result objects containing the linting results for individual files. Here’s an example output:
[
	{
		filePath: "/path/to/a/file.js",
		messages: [
			{
				ruleId: "curly",
				severity: 2,
				message: "Expected { after 'if' condition.",
				line: 2,
				column: 1,
				nodeType: "IfStatement",
			},
			{
				ruleId: "no-process-exit",
				severity: 2,
				message: "Don't use process.exit(); throw an error instead.",
				line: 3,
				column: 1,
				nodeType: "CallExpression",
			},
		],
		errorCount: 2,
		warningCount: 0,
		fixableErrorCount: 0,
		fixableWarningCount: 0,
		source: "var err = doStuff();\nif (err) console.log('failed tests: ' + err);\nprocess.exit(1);\n",
	},
	{
		filePath: "/path/to/Gruntfile.js",
		messages: [],
		errorCount: 0,
		warningCount: 0,
		fixableErrorCount: 0,
		fixableWarningCount: 0,
	},
];





































The result Object
Each object in the results array is a result object. Each result object contains the path of the file that was linted and information about linting issues that were encountered. Here are the properties available on each result object:
filePath: The absolute path to the file that was linted.
messages: An array of message objects. See below for more info about messages.
errorCount: The number of errors for the given file.
warningCount: The number of warnings for the given file.
stats: The optional stats object that only exists when the stats option is used.
source: The source code for the given file. This property is omitted if this file has no errors/warnings or if the output property is present.
output: The source code for the given file with as many fixes applied as possible. This property is omitted if no fix is available.
The message Object
Each message object contains information about the ESLint rule that was triggered by some source code. The properties available on each message object are:
ruleId: the ID of the rule that produced the error or warning. If the error or warning was not produced by a rule (for example, if it’s a parsing error), this is null.
severity: the severity of the failure, 1 for warnings and 2 for errors.
message: the human readable description of the error.
line: the line where the issue is located.
column: the column where the issue is located.
nodeType: (Deprecated: This property will be removed in a future version of ESLint.) the type of the node in the AST or null if the issue isn’t related to a particular AST node.
The context Argument
The formatter function receives a context object as its second argument. The object has the following properties:
cwd: The current working directory. This value comes from the cwd constructor option of the ESLint class.
maxWarningsExceeded (optional): If --max-warnings was set and the number of warnings exceeded the limit, this property’s value is an object containing two properties:
maxWarnings: the value of the --max-warnings option
foundWarnings: the number of lint warnings
rulesMeta: The meta property values of rules. See the Custom Rules page for more information about rules.
For example, here’s what the object would look like if the rule no-extra-semi had been run:
{
    cwd: "/path/to/cwd",
    maxWarningsExceeded: {
        maxWarnings: 5,
        foundWarnings: 6
    },
    rulesMeta: {
        "no-extra-semi": {
            type: "suggestion",
            docs: {
                description: "disallow unnecessary semicolons",
                recommended: true,
                url: "https://eslint.org/docs/rules/no-extra-semi"
            },
            fixable: "code",
            schema: [],
            messages: {
                unexpected: "Unnecessary semicolon."
            }
        }
    },
}























Note: if a linting is executed by the deprecated CLIEngine class, the context argument may be a different value because it is up to the API users. Please check whether the context argument is an expected value or not if you want to support legacy environments.
Passing Arguments to Formatters
While formatter functions do not receive arguments in addition to the results object and the context, it is possible to pass additional data into custom formatters using the methods described below.
Using Environment Variables
Custom formatters have access to environment variables and so can change their behavior based on environment variable data.
Here’s an example that uses a FORMATTER_SKIP_WARNINGS environment variable to determine whether to show warnings in the results:
module.exports = function (results) {
	var skipWarnings = process.env.FORMATTER_SKIP_WARNINGS === "true";

	var results = results || [];
	var summary = results.reduce(
		function (seq, current) {
			current.messages.forEach(function (msg) {
				var logMessage = {
					filePath: current.filePath,
					ruleId: msg.ruleId,
					message: msg.message,
					line: msg.line,
					column: msg.column,
				};

				if (msg.severity === 1) {
					logMessage.type = "warning";
					seq.warnings.push(logMessage);
				}
				if (msg.severity === 2) {
					logMessage.type = "error";
					seq.errors.push(logMessage);
				}
			});
			return seq;
		},
		{
			errors: [],
			warnings: [],
		},
	);

	if (summary.errors.length > 0 || summary.warnings.length > 0) {
		var warnings = !skipWarnings ? summary.warnings : []; // skip the warnings in that case

		var lines = summary.errors
			.concat(warnings)
			.map(function (msg) {
				return (
					"\n" +
					msg.type +
					" " +
					msg.ruleId +
					"\n  " +
					msg.filePath +
					":" +
					msg.line +
					":" +
					msg.column
				);
			})
			.join("\n");

		return lines + "\n";
	}
};

























































You would run ESLint with this custom formatter and an environment variable set like this:
FORMATTER_SKIP_WARNINGS=true eslint -f ./my-awesome-formatter.js src/


The output would be:
error space-infix-ops
  src/configs/bundler.js:6:8

error semi
  src/configs/bundler.js:6:10






Complex Argument Passing
If you find the custom formatter pattern doesn’t provide enough options for the way you’d like to format ESLint results, the best option is to use ESLint’s built-in JSON formatter and pipe the output to a second program. For example:
eslint -f json src/ | your-program-that-reads-JSON --option


In this example, the your-program-that-reads-json program can accept the raw JSON of ESLint results and process it before outputting its own format of the results. You can pass as many command line arguments to that program as are necessary to customize the output.
Formatting for Terminals
Modern terminals like iTerm2 or Guake expect a specific results format to automatically open filenames when they are clicked. Most terminals support this format for that purpose:
file:line:column


Packaging a Custom Formatter
Custom formatters can be distributed through npm packages. To do so, create an npm package with a name in the format eslint-formatter-*, where * is the name of your formatter (such as eslint-formatter-awesome). Projects should then install the package and use the custom formatter with the -f (or --format) flag like this:
eslint -f awesome src/


Because ESLint knows to look for packages beginning with eslint-formatter- when the specified formatter doesn’t begin with a period, you do not need to type eslint-formatter- when using a packaged custom formatter.
Tips for the package.json of a custom formatter:
The main entry point must be the JavaScript file implementing your custom formatter.
Add these keywords to help users find your formatter:
"eslint"
"eslint-formatter"
"eslintformatter"
See all custom formatters on npm.
Examples
Summary Formatter
A formatter that only reports on the total count of errors and warnings will look like this:
module.exports = function (results, context) {
	// accumulate the errors and warnings
	var summary = results.reduce(
		function (seq, current) {
			seq.errors += current.errorCount;
			seq.warnings += current.warningCount;
			return seq;
		},
		{ errors: 0, warnings: 0 },
	);

	if (summary.errors > 0 || summary.warnings > 0) {
		return (
			"Errors: " +
			summary.errors +
			", Warnings: " +
			summary.warnings +
			"\n"
		);
	}

	return "";
};
























Run eslint with the above summary formatter:
eslint -f ./my-awesome-formatter.js src/


Will produce the following output:
Errors: 2, Warnings: 4


Detailed Formatter
A more complex report could look like this:
module.exports = function (results, context) {
	var results = results || [];

	var summary = results.reduce(
		function (seq, current) {
			current.messages.forEach(function (msg) {
				var logMessage = {
					filePath: current.filePath,
					ruleId: msg.ruleId,
					ruleUrl: context.rulesMeta[msg.ruleId].docs.url,
					message: msg.message,
					line: msg.line,
					column: msg.column,
				};

				if (msg.severity === 1) {
					logMessage.type = "warning";
					seq.warnings.push(logMessage);
				}
				if (msg.severity === 2) {
					logMessage.type = "error";
					seq.errors.push(logMessage);
				}
			});
			return seq;
		},
		{
			errors: [],
			warnings: [],
		},
	);

	if (summary.errors.length > 0 || summary.warnings.length > 0) {
		var lines = summary.errors
			.concat(summary.warnings)
			.map(function (msg) {
				return (
					"\n" +
					msg.type +
					" " +
					msg.ruleId +
					(msg.ruleUrl ? " (" + msg.ruleUrl + ")" : "") +
					"\n  " +
					msg.filePath +
					":" +
					msg.line +
					":" +
					msg.column
				);
			})
			.join("\n");

		return lines + "\n";
	}
};
























































When you run ESLint with this custom formatter:
eslint -f ./my-awesome-formatter.js src/


The output is:
error space-infix-ops (https://eslint.org/docs/rules/space-infix-ops)
  src/configs/bundler.js:6:8
error semi (https://eslint.org/docs/rules/semi)
  src/configs/bundler.js:6:10
warning no-unused-vars (https://eslint.org/docs/rules/no-unused-vars)
  src/configs/bundler.js:5:6
warning no-unused-vars (https://eslint.org/docs/rules/no-unused-vars)
  src/configs/bundler.js:6:6
warning no-shadow (https://eslint.org/docs/rules/no-shadow)
  src/configs/bundler.js:65:32
warning no-unused-vars (https://eslint.org/docs/rules/no-unused-vars)
  src/configs/clean.js:3:6













Edit this page
Table of Contents
Creating a Custom Formatter
The results Argument
The result Object
The context Argument
Passing Arguments to Formatters
Using Environment Variables
Complex Argument Passing
Formatting for Terminals
Packaging a Custom Formatter
Examples
Summary Formatter
Detailed Formatter
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Custom Parsers
ESLint custom parsers let you extend ESLint to support linting new non-standard JavaScript language features or custom syntax in your code. A parser is responsible for taking your code and transforming it into an abstract syntax tree (AST) that ESLint can then analyze and lint.
Creating a Custom Parser
Methods in Custom Parsers
A custom parser is a JavaScript object with either a parse() or parseForESLint() method. The parse method only returns the AST, whereas parseForESLint() also returns additional values that let the parser customize the behavior of ESLint even more.
Both methods should be instance (own) properties and take in the source code as the first argument, and an optional configuration object as the second argument, which is provided as parserOptions in a configuration file.
// customParser.js

const espree = require("espree");

// Logs the duration it takes to parse each file.
function parse(code, options) {
	const label = `Parsing file "${options.filePath}"`;
	console.time(label);
	const ast = espree.parse(code, options);
	console.timeEnd(label);
	return ast; // Only the AST is returned.
}

module.exports = { parse };















parse Return Object
The parse method should simply return the AST object.
parseForESLint Return Object
The parseForESLint method should return an object that contains the required property ast and optional properties services, scopeManager, and visitorKeys.
ast should contain the AST object.
services can contain any parser-dependent services (such as type checkers for nodes). The value of the services property is available to rules as context.sourceCode.parserServices. Default is an empty object.
scopeManager can be a ScopeManager object. Custom parsers can use customized scope analysis for experimental/enhancement syntaxes. The default is the ScopeManager object which is created by eslint-scope.
Support for scopeManager was added in ESLint v4.14.0. ESLint versions that support scopeManager will provide an eslintScopeManager: true property in parserOptions, which can be used for feature detection.
visitorKeys can be an object to customize AST traversal. The keys of the object are the type of AST nodes. Each value is an array of the property names which should be traversed. The default is KEYS of eslint-visitor-keys.
Support for visitorKeys was added in ESLint v4.14.0. ESLint versions that support visitorKeys will provide an eslintVisitorKeys: true property in parserOptions, which can be used for feature detection.
Meta Data in Custom Parsers
For easier debugging and more effective caching of custom parsers, it’s recommended to provide a name and version in a meta object at the root of your custom parsers, like this:
// preferred location of name and version
module.exports = {
	meta: {
		name: "eslint-parser-custom",
		version: "1.2.3",
	},
};








The meta.name property should match the npm package name for your custom parser and the meta.version property should match the npm package version for your custom parser. The easiest way to accomplish this is by reading this information from your package.json.
AST Specification
The AST that custom parsers should create is based on ESTree. The AST requires some additional properties about detail information of the source code.
All Nodes
All nodes must have range property.
range (number[]) is an array of two numbers. Both numbers are a 0-based index which is the position in the array of source code characters. The first is the start position of the node, the second is the end position of the node. code.slice(node.range[0], node.range[1]) must be the text of the node. This range does not include spaces/parentheses which are around the node.
loc (SourceLocation) must not be null. The loc property is defined as nullable by ESTree, but ESLint requires this property. The SourceLocation#source property can be undefined. ESLint does not use the SourceLocation#source property.
The parent property of all nodes must be rewritable. Before any rules have access to the AST, ESLint sets each node’s parent property to its parent node while traversing.
The Program Node
The Program node must have tokens and comments properties. Both properties are an array of the below Token interface.
interface Token {
	type: string;
	loc: SourceLocation;
	// See the "All Nodes" section for details of the `range` property.
	range: [number, number];
	value: string;
}








tokens (Token[]) is the array of tokens which affect the behavior of programs. Arbitrary spaces can exist between tokens, so rules check the Token#range to detect spaces between tokens. This must be sorted by Token#range[0].
comments (Token[]) is the array of comment tokens. This must be sorted by Token#range[0].
The range indexes of all tokens and comments must not overlap with the range of other tokens and comments.
The Literal Node
The Literal node must have raw property.
raw (string) is the source code of this literal. This is the same as code.slice(node.range[0], node.range[1]).
Packaging a Custom Parser
To publish your custom parser to npm, perform the following:
Create a custom parser following the Creating a Custom Parser section above.
Create an npm package for the custom parser.
In your package.json file, set the main field as the file that exports your custom parser.
Publish the npm package.
For more information on publishing an npm package, refer to the npm documentation.
Once you’ve published the npm package, you can use it by adding the package to your project. For example:
npmyarnpnpmbun
npm install --save-dev eslint-parser-myparser


Then add the custom parser to your ESLint configuration file with the languageOptions.parser property. For example:
// eslint.config.js

const myparser = require("eslint-parser-myparser");

module.exports = [
	{
		languageOptions: {
			parser: myparser,
		},
		// ... rest of configuration
	},
];













When using legacy configuration, specify the parser property as a string:
// .eslintrc.js

module.exports = {
	parser: "eslint-parser-myparser",
	// ... rest of configuration
};







To learn more about using ESLint parsers in your project, refer to Configure a Parser.
Example
For a complex example of a custom parser, refer to the @typescript-eslint/parser source code.
A simple custom parser that provides a context.sourceCode.parserServices.foo() method to rules.
// awesome-custom-parser.js
var espree = require("espree");
function parseForESLint(code, options) {
	return {
		ast: espree.parse(code, options),
		services: {
			foo: function () {
				console.log("foo");
			},
		},
		scopeManager: null,
		visitorKeys: null,
	};
}

module.exports = { parseForESLint };

















Include the custom parser in an ESLint configuration file:
// eslint.config.js
module.exports = [
	{
		languageOptions: {
			parser: require("./path/to/awesome-custom-parser"),
		},
	},
];









Or if using legacy configuration:
// .eslintrc.json
{
    "parser": "./path/to/awesome-custom-parser.js"
}





Edit this page
Table of Contents
Creating a Custom Parser
Methods in Custom Parsers
parse Return Object
parseForESLint Return Object
Meta Data in Custom Parsers
AST Specification
All Nodes
The Program Node
The Literal Node
Packaging a Custom Parser
Example
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Stats Data
While an analysis of the overall rule performance for an ESLint run can be carried out by setting the TIMING environment variable, it can sometimes be useful to acquire more granular timing data (lint time per file per rule) or collect other measures of interest. In particular, when developing new custom plugins and evaluating/benchmarking new languages or rule sets. For these use cases, you can optionally collect runtime statistics from ESLint.
Enable stats collection
To enable collection of statistics, you can either:
Use the --stats CLI option. This will pass the stats data into the formatter used to output results from ESLint. (Note: not all formatters output stats data.)
Set stats: true as an option on the ESLint constructor.
Enabling stats data adds a new stats key to each LintResult object containing data such as parse times, fix times, lint times per rule.
As such, it is not available via stdout but made easily ingestible via a formatter using the CLI or via the Node.js API to cater to your specific needs.
◆ Stats type
The Stats value is the timing information of each lint run. The stats property of the LintResult type contains it. It has the following properties:
fixPasses (number)
The number of times ESLint has applied at least one fix after linting.
times ({ passes: TimePass[] })
The times spent on (parsing, fixing, linting) a file, where the linting refers to the timing information for each rule.
TimePass ({ parse: ParseTime, rules?: Record<string, RuleTime>, fix: FixTime, total: number })
An object containing the times spent on (parsing, fixing, linting)
ParseTime ({ total: number })
The total time that is spent when parsing a file.
RuleTime ({ total: number }) The total time that is spent on a rule.
FixTime ({ total: number }) The total time that is spent on applying fixes to the code.
CLI usage
Let’s consider the following example:
/*eslint no-regex-spaces: "error", wrap-regex: "error"*/

function a() {
	return / foo/.test("bar");
}






Run ESLint with --stats and output to JSON via the built-in json formatter:
npmyarnpnpmbun
npx eslint file-to-fix.js --fix --stats -f json 


This yields the following stats entry as part of the formatted lint results object:
{
	"times": {
		"passes": [
			{
				"parse": {
					"total": 3.975959
				},
				"rules": {
					"no-regex-spaces": {
						"total": 0.160792
					},
					"wrap-regex": {
						"total": 0.422626
					}
				},
				"fix": {
					"total": 0.080208
				},
				"total": 12.765959
			},
			{
				"parse": {
					"total": 0.623542
				},
				"rules": {
					"no-regex-spaces": {
						"total": 0.043084
					},
					"wrap-regex": {
						"total": 0.007959
					}
				},
				"fix": {
					"total": 0
				},
				"total": 1.148875
			}
		]
	},
	"fixPasses": 1
}










































Note, that for the simple example above, the sum of all rule times should be directly comparable to the first column of the TIMING output. Running the same command with TIMING=all, you can verify this:
$ TIMING=all npx eslint file-to-fix.js --fix --stats -f json
...
Rule            | Time (ms) | Relative
:---------------|----------:|--------:
wrap-regex      |     0.431 |    67.9%
no-regex-spaces |     0.204 |    32.1%







API Usage
You can achieve the same thing using the Node.js API by passingstats: true as an option to the ESLint constructor. For example:
const { ESLint } = require("eslint");

(async function main() {
	// 1. Create an instance.
	const eslint = new ESLint({ stats: true, fix: true });

	// 2. Lint files.
	const results = await eslint.lintFiles(["file-to-fix.js"]);

	// 3. Format the results.
	const formatter = await eslint.loadFormatter("json");
	const resultText = formatter.format(results);

	// 4. Output it.
	console.log(resultText);
})().catch(error => {
	process.exitCode = 1;
	console.error(error);
});




















Edit this page
Table of Contents
Enable stats collection
◆ Stats type
CLI usage
API Usage
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Integrate with the Node.js API Tutorial
This guide walks you through integrating the ESLint class to lint files and retrieve results, which can be useful for creating integrations with other projects.
Why Create an Integration?
You might want to create an ESLint integration if you’re creating developer tooling, such as the following:
Code editors and IDEs: Integrating ESLint with code editors and IDEs can provide real-time feedback on code quality and automatically highlight potential issues as you type. Many editors already have ESLint plugins available, but you may need to create a custom integration if the existing plugins do not meet your specific requirements.
Custom linter tools: If you’re building a custom linter tool that combines multiple linters or adds specific functionality, you may want to integrate ESLint into your tool to provide JavaScript linting capabilities.
Code review tools: Integrating ESLint with code review tools can help automate the process of identifying potential issues in the codebase.
Learning platforms: If you are developing a learning platform or coding tutorial, integrating ESLint can provide real-time feedback to users as they learn JavaScript, helping them improve their coding skills and learn best practices.
Developer tool integration: If you’re creating or extending a developer tool, such as a bundler or testing framework, you may want to integrate ESLint to provide linting capabilities. You can integrate ESLint directly into the tool or as a plugin.
What You’ll Build
In this guide, you’ll create a simple Node.js project that uses the ESLint class to lint files and retrieve results.
Requirements
This tutorial assumes you are familiar with JavaScript and Node.js.
To follow this tutorial, you’ll need to have the following:
Node.js (^18.18.0, ^20.9.0, or >=21.1.0)
npm
A text editor
Step 1: Setup
First, create a new project directory:
mkdir eslint-integration
cd eslint-integration



Initialize the project with a package.json file:
npmyarnpnpmbun
npm init -y


Install the eslint package as a dependency (not as a dev dependency):
npmyarnpnpmbun
npm install eslint


Create a new file called example-eslint-integration.js in the project root:
touch example-eslint-integration.js


Step 2: Import and Configure the ESLint Instance
Import the ESLint class from the eslint package and create a new instance.
You can customize the ESLint configuration by passing an options object to the ESLint constructor:
// example-eslint-integration.js

const { ESLint } = require("eslint");

// Create an instance of ESLint with the configuration passed to the function
function createESLintInstance(overrideConfig) {
	return new ESLint({
		overrideConfigFile: true,
		overrideConfig,
		fix: true,
	});
}













Step 3: Lint and Fix Files
To lint a file, use the lintFiles method of the ESLint instance. The filePaths argument passed to ESLint#lintFiles() can be a string or an array of strings, representing the file path(s) you want to lint. The file paths can be globs or filenames.
The static method ESLint.outputFixes() takes the linting results from the call to ESLint#lintFiles(), and then writes the fixed code back to the source files.
// example-eslint-integration.js

// ... previous step's code to instantiate the ESLint instance

// Lint the specified files and return the results
async function lintAndFix(eslint, filePaths) {
	const results = await eslint.lintFiles(filePaths);

	// Apply automatic fixes and output fixed code
	await ESLint.outputFixes(results);

	return results;
}














Step 4: Output Results
Define a function to output the linting results to the console. This should be specific to your integration’s needs. For example, you could report the linting results to a user interface.
In this example, we’ll simply log the results to the console:
// example-eslint-integration.js

// ... previous step's code to instantiate the ESLint instance
// and get linting results.

// Log results to console if there are any problems
function outputLintingResults(results) {
	// Identify the number of problems found
	const problems = results.reduce(
		(acc, result) => acc + result.errorCount + result.warningCount,
		0,
	);

	if (problems > 0) {
		console.log("Linting errors found!");
		console.log(results);
	} else {
		console.log("No linting errors found.");
	}
	return results;
}






















Step 5: Put It All Together
Put the above functions together in a new function called lintFiles. This function will be the main entry point for your integration:
// example-eslint-integration.js

// Put previous functions all together
async function lintFiles(filePaths) {
	// The ESLint configuration. Alternatively, you could load the configuration
	// from a .eslintrc file or just use the default config.
	const overrideConfig = {
		languageOptions: {
			ecmaVersion: 2018,
			sourceType: "commonjs",
		},
		rules: {
			"no-console": "error",
			"no-unused-vars": "warn",
		},
	};

	const eslint = createESLintInstance(overrideConfig);
	const results = await lintAndFix(eslint, filePaths);
	return outputLintingResults(results);
}

// Export integration
module.exports = { lintFiles };

























Here’s the complete code example for example-eslint-integration.js:
const { ESLint } = require("eslint");

// Create an instance of ESLint with the configuration passed to the function
function createESLintInstance(overrideConfig) {
	return new ESLint({
		overrideConfigFile: true,
		overrideConfig,
		fix: true,
	});
}

// Lint the specified files and return the results
async function lintAndFix(eslint, filePaths) {
	const results = await eslint.lintFiles(filePaths);

	// Apply automatic fixes and output fixed code
	await ESLint.outputFixes(results);

	return results;
}

// Log results to console if there are any problems
function outputLintingResults(results) {
	// Identify the number of problems found
	const problems = results.reduce(
		(acc, result) => acc + result.errorCount + result.warningCount,
		0,
	);

	if (problems > 0) {
		console.log("Linting errors found!");
		console.log(results);
	} else {
		console.log("No linting errors found.");
	}
	return results;
}

// Put previous functions all together
async function lintFiles(filePaths) {
	// The ESLint configuration. Alternatively, you could load the configuration
	// from an eslint.config.js file or just use the default config.
	const overrideConfig = {
		languageOptions: {
			ecmaVersion: 2018,
			sourceType: "commonjs",
		},
		rules: {
			"no-console": "error",
			"no-unused-vars": "warn",
		},
	};

	const eslint = createESLintInstance(overrideConfig);
	const results = await lintAndFix(eslint, filePaths);
	return outputLintingResults(results);
}

// Export integration
module.exports = { lintFiles };





























































Conclusion
In this tutorial, we have covered the essentials of using the ESLint class to lint files and retrieve results in your projects. This knowledge can be applied to create custom integrations, such as code editor plugins, to provide real-time feedback on code quality.
View the Tutorial Code
You can view the annotated source code for the tutorial here.
Edit this page
Table of Contents
Why Create an Integration?
What You’ll Build
Requirements
Step 1: Setup
Step 2: Import and Configure the ESLint Instance
Step 3: Lint and Fix Files
Step 4: Output Results
Step 5: Put It All Together
Conclusion
View the Tutorial Code
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Node.js API Reference
While ESLint is designed to be run on the command line, it’s possible to use ESLint programmatically through the Node.js API. The purpose of the Node.js API is to allow plugin and tool authors to use the ESLint functionality directly, without going through the command line interface.
Note: Use undocumented parts of the API at your own risk. Only those parts that are specifically mentioned in this document are approved for use and will remain stable and reliable. Anything left undocumented is unstable and may change or be removed at any point.
ESLint class
The ESLint class is the primary class to use in Node.js applications.
This class depends on the Node.js fs module and the file system, so you cannot use it in browsers. If you want to lint code on browsers, use the Linter class instead.
Here’s a simple example of using the ESLint class:
const { ESLint } = require("eslint");

(async function main() {
	// 1. Create an instance.
	const eslint = new ESLint();

	// 2. Lint files.
	const results = await eslint.lintFiles(["lib/**/*.js"]);

	// 3. Format the results.
	const formatter = await eslint.loadFormatter("stylish");
	const resultText = formatter.format(results);

	// 4. Output it.
	console.log(resultText);
})().catch(error => {
	process.exitCode = 1;
	console.error(error);
});




















Here’s an example that autofixes lint problems:
const { ESLint } = require("eslint");

(async function main() {
	// 1. Create an instance with the `fix` option.
	const eslint = new ESLint({ fix: true });

	// 2. Lint files. This doesn't modify target files.
	const results = await eslint.lintFiles(["lib/**/*.js"]);

	// 3. Modify the files with the fixed code.
	await ESLint.outputFixes(results);

	// 4. Format the results.
	const formatter = await eslint.loadFormatter("stylish");
	const resultText = formatter.format(results);

	// 5. Output it.
	console.log(resultText);
})().catch(error => {
	process.exitCode = 1;
	console.error(error);
});























And here is an example of using the ESLint class with lintText API:
const { ESLint } = require("eslint");

const testCode = `
  const name = "eslint";
  if(true) {
    console.log("constant condition warning")
  };
`;

(async function main() {
	// 1. Create an instance
	const eslint = new ESLint({
		overrideConfigFile: true,
		overrideConfig: {
			languageOptions: {
				ecmaVersion: 2018,
				sourceType: "commonjs",
			},
		},
	});

	// 2. Lint text.
	const results = await eslint.lintText(testCode);

	// 3. Format the results.
	const formatter = await eslint.loadFormatter("stylish");
	const resultText = formatter.format(results);

	// 4. Output it.
	console.log(resultText);
})().catch(error => {
	process.exitCode = 1;
	console.error(error);
});



































◆ new ESLint(options)
const eslint = new ESLint(options);


Create a new ESLint instance.
Parameters
The ESLint constructor takes an options object. If you omit the options object then it uses default values for all options. The options object has the following properties.
File Enumeration
options.cwd (string)
Default is process.cwd(). The working directory. This must be an absolute path.
options.errorOnUnmatchedPattern (boolean)
Default is true. Unless set to false, the eslint.lintFiles() method will throw an error when no target files are found.
options.globInputPaths (boolean)
Default is true. If false is present, the eslint.lintFiles() method doesn’t interpret glob patterns.
options.ignore (boolean)
Default is true. If false is present, the eslint.lintFiles() method doesn’t respect ignorePatterns in your configuration.
options.ignorePatterns (string[] | null)
Default is null. Ignore file patterns to use in addition to config ignores. These patterns are relative to cwd.
options.passOnNoPatterns (boolean)
Default is false. When set to true, missing patterns cause the linting operation to short circuit and not report any failures.
options.warnIgnored (boolean)
Default is true. Show warnings when the file list includes ignored files.
Linting
options.allowInlineConfig (boolean)
Default is true. If false is present, ESLint suppresses directive comments in source code. If this option is false, it overrides the noInlineConfig setting in your configurations.
options.baseConfig (Config | Config[] | null)
Default is null. Configuration object, extended by all configurations used with this instance. You can use this option to define the default settings that will be used if your configuration files don’t configure it.
options.overrideConfig (Config | Config[] | null)
Default is null. Configuration object, added after any existing configuration and therefore applies after what’s contained in your configuration file (if used).
options.overrideConfigFile (null | true | string)
Default is null. By default, ESLint searches for a configuration file. When this option is set to true, ESLint does not search for a configuration file. When this option is set to a string value, ESLint does not search for a configuration file, and uses the provided value as the path to the configuration file.
options.plugins (Record<string, Plugin> | null)
Default is null. The plugin implementations that ESLint uses for the plugins setting of your configuration. This is a map-like object. Those keys are plugin IDs and each value is implementation.
options.ruleFilter (({ruleId: string, severity: number}) => boolean)
Default is () => true. A predicate function that filters rules to be run. This function is called with an object containing ruleId and severity, and returns true if the rule should be run.
options.stats (boolean)
Default is false. When set to true, additional statistics are added to the lint results (see Stats type).
Autofix
options.fix (boolean | (message: LintMessage) => boolean)
Default is false. If true is present, the eslint.lintFiles() and eslint.lintText() methods work in autofix mode. If a predicate function is present, the methods pass each lint message to the function, then use only the lint messages for which the function returned true.
options.fixTypes (("directive" | "problem" | "suggestion" | "layout")[] | null)
Default is null. The types of the rules that the eslint.lintFiles() and eslint.lintText() methods use for autofix.
Cache-related
options.cache (boolean)
Default is false. If true is present, the eslint.lintFiles() method caches lint results and uses it if each target file is not changed. Please mind that ESLint doesn’t clear the cache when you upgrade ESLint plugins. In that case, you have to remove the cache file manually. The eslint.lintText() method doesn’t use caches even if you pass the options.filePath to the method.
options.cacheLocation (string)
Default is .eslintcache. The eslint.lintFiles() method writes caches into this file.
options.cacheStrategy (string)
Default is "metadata". Strategy for the cache to use for detecting changed files. Can be either "metadata" or "content".
Other Options
options.flags (string[])
Default is []. The feature flags to enable for this instance.
◆ eslint.lintFiles(patterns)
const results = await eslint.lintFiles(patterns);


This method lints the files that match the glob patterns and then returns the results.
Parameters
patterns (string | string[])
The lint target files. This can contain any of file paths, directory paths, and glob patterns.
Return Value
(Promise<LintResult[]>)
The promise that will be fulfilled with an array of LintResult objects.
◆ eslint.lintText(code, options)
const results = await eslint.lintText(code, options);


This method lints the given source code text and then returns the results.
By default, this method uses the configuration that applies to files in the current working directory (the cwd constructor option). If you want to use a different configuration, pass options.filePath, and ESLint will load the same configuration that eslint.lintFiles() would use for a file at options.filePath.
If the options.filePath value is configured to be ignored, this method returns an empty array. If the options.warnIgnored option is set along with the options.filePath option, this method returns a LintResult object. In that case, the result may contain a warning that indicates the file was ignored.
Parameters
The second parameter options is omittable.
code (string)
The source code text to check.
options.filePath (string)
Optional. The path to the file of the source code text. If omitted, the result.filePath becomes the string "<text>".
options.warnIgnored (boolean)
Optional, defaults to options.warnIgnored passed to the constructor. If true is present and the options.filePath is a file ESLint should ignore, this method returns a lint result contains a warning message.
Return Value
(Promise<LintResult[]>)
The promise that will be fulfilled with an array of LintResult objects. This is an array (despite there being only one lint result) in order to keep the interfaces between this and the eslint.lintFiles() method similar.
◆ eslint.getRulesMetaForResults(results)
const results = await eslint.lintFiles(patterns);
const rulesMeta = eslint.getRulesMetaForResults(results);



This method returns an object containing meta information for each rule that triggered a lint error in the given results.
Parameters
results (LintResult[])
An array of LintResult objects returned from a call to ESLint#lintFiles() or ESLint#lintText().
Return Value
(Object)
An object whose property names are the rule IDs from the results and whose property values are the rule’s meta information (if available).
◆ eslint.calculateConfigForFile(filePath)
const config = await eslint.calculateConfigForFile(filePath);


This method calculates the configuration for a given file, which can be useful for debugging purposes.
Parameters
filePath (string)
The path to the file whose configuration you would like to calculate. Directory paths are forbidden because ESLint cannot handle the overrides setting.
Return Value
(Promise<Object>)
The promise that will be fulfilled with a configuration object.
◆ eslint.isPathIgnored(filePath)
const isPathIgnored = await eslint.isPathIgnored(filePath);


This method checks if a given file is ignored by your configuration.
Parameters
filePath (string)
The path to the file you want to check.
Return Value
(Promise<boolean>)
The promise that will be fulfilled with whether the file is ignored or not. If the file is ignored, then it will return true.
◆ eslint.loadFormatter(nameOrPath)
const formatter = await eslint.loadFormatter(nameOrPath);


This method loads a formatter. Formatters convert lint results to a human- or machine-readable string.
Parameters
nameOrPath (string | undefined)
The path to the file you want to check. The following values are allowed:
undefined. In this case, loads the "stylish" built-in formatter.
A name of built-in formatters.
A name of third-party formatters. For examples:
"foo" will load eslint-formatter-foo.
"@foo" will load @foo/eslint-formatter.
"@foo/bar" will load @foo/eslint-formatter-bar.
A path to the file that defines a formatter. The path must contain one or more path separators (/) in order to distinguish if it’s a path or not. For example, start with ./.
Return Value
(Promise<LoadedFormatter>)
The promise that will be fulfilled with a LoadedFormatter object.
◆ eslint.hasFlag(flagName)
This method is used to determine if a given feature flag is set, as in this example:
if (eslint.hasFlag("x_feature")) {
	// handle flag
}




Parameters
flagName (string)
The flag to check.
Return Value
(boolean)
True if the flag is enabled.
◆ ESLint.version
const version = ESLint.version;


The version string of ESLint. E.g. "7.0.0".
This is a static property.
◆ ESLint.defaultConfig
const defaultConfig = ESLint.defaultConfig;


The default configuration that ESLint uses internally. This is provided for tooling that wants to calculate configurations using the same defaults as ESLint. Keep in mind that the default configuration may change from version to version, so you shouldn’t rely on any particular keys or values to be present.
This is a static property.
◆ ESLint.outputFixes(results)
await ESLint.outputFixes(results);


This method writes code modified by ESLint’s autofix feature into its respective file. If any of the modified files don’t exist, this method does nothing.
This is a static method.
Parameters
results (LintResult[])
The LintResult objects to write.
Return Value
(Promise<void>)
The promise that will be fulfilled after all files are written.
◆ ESLint.getErrorResults(results)
const filteredResults = ESLint.getErrorResults(results);


This method copies the given results and removes warnings. The returned value contains only errors.
This is a static method.
Parameters
results (LintResult[])
The LintResult objects to filter.
Return Value
(LintResult[])
The filtered LintResult objects.
◆ LintResult type
The LintResult value is the information of the linting result of each file. The eslint.lintFiles() and eslint.lintText() methods return it. It has the following properties:
filePath (string)
The absolute path to the file of this result. This is the string "<text>" if the file path is unknown (when you didn’t pass the options.filePath option to the eslint.lintText() method).
messages (LintMessage[])
The array of LintMessage objects.
suppressedMessages (SuppressedLintMessage[])
The array of SuppressedLintMessage objects.
fixableErrorCount (number)
The number of errors that can be fixed automatically by the fix constructor option.
fixableWarningCount (number)
The number of warnings that can be fixed automatically by the fix constructor option.
errorCount (number)
The number of errors. This includes fixable errors and fatal errors.
fatalErrorCount (number)
The number of fatal errors.
warningCount (number)
The number of warnings. This includes fixable warnings.
output (string | undefined)
The modified source code text. This property is undefined if any fixable messages didn’t exist.
source (string | undefined)
The original source code text. This property is undefined if any messages didn’t exist or the output property exists.
stats (Stats | undefined)
The Stats object. This contains the lint performance statistics collected with the stats option.
usedDeprecatedRules ({ ruleId: string; replacedBy: string[]; info: DeprecatedInfo | undefined }[])
The information about the deprecated rules that were used to check this file. The info property is set to rule.meta.deprecated if the rule uses the new deprecated property.
◆ LintMessage type
The LintMessage value is the information of each linting error. The messages property of the LintResult type contains it. It has the following properties:
ruleId (string | null)
The rule name that generates this lint message. If this message is generated by the ESLint core rather than rules, this is null.
severity (1 | 2)
The severity of this message. 1 means warning and 2 means error.
fatal (boolean | undefined)
true if this is a fatal error unrelated to a rule, like a parsing error.
message (string)
The error message.
messageId (string | undefined)
The message ID of the lint error. This property is undefined if the rule does not use message IDs.
line (number | undefined)
The 1-based line number of the begin point of this message.
column (number | undefined)
The 1-based column number of the begin point of this message.
endLine (number | undefined)
The 1-based line number of the end point of this message. This property is undefined if this message is not a range.
endColumn (number | undefined)
The 1-based column number of the end point of this message. This property is undefined if this message is not a range.
fix (EditInfo | undefined)
The EditInfo object of autofix. This property is undefined if this message is not fixable.
suggestions ({ desc: string; fix: EditInfo; messageId?: string; data?: object }[] | undefined)
The list of suggestions. Each suggestion is the pair of a description and an EditInfo object to fix code. API users such as editor integrations can choose one of them to fix the problem of this message. This property is undefined if this message doesn’t have any suggestions.
◆ SuppressedLintMessage type
The SuppressedLintMessage value is the information of each suppressed linting error. The suppressedMessages property of the LintResult type contains it. It has the following properties:
ruleId (string | null)
Same as ruleId in LintMessage type.
severity (1 | 2)
Same as severity in LintMessage type.
fatal (boolean | undefined)
Same as fatal in LintMessage type.
message (string)
Same as message in LintMessage type.
messageId (string | undefined)
Same as messageId in LintMessage type.
line (number | undefined)
Same as line in LintMessage type.
column (number | undefined)
Same as column in LintMessage type.
endLine (number | undefined)
Same as endLine in LintMessage type.
endColumn (number | undefined)
Same as endColumn in LintMessage type.
fix (EditInfo | undefined)
Same as fix in LintMessage type.
suggestions ({ desc: string; fix: EditInfo; messageId?: string; data?: object }[] | undefined)
Same as suggestions in LintMessage type.
suppressions ({ kind: string; justification: string}[])
The list of suppressions. Each suppression is the pair of a kind and a justification.
◆ EditInfo type
The EditInfo value is information to edit text. The fix and suggestions properties of LintMessage type contain it. It has following properties:
range ([number, number])
The pair of 0-based indices in source code text to remove.
text (string)
The text to add.
This edit information means replacing the range of the range property by the text property value. It’s like sourceCodeText.slice(0, edit.range[0]) + edit.text + sourceCodeText.slice(edit.range[1]). Therefore, it’s an add if the range[0] and range[1] property values are the same value, and it’s removal if the text property value is empty string.
◆ LoadedFormatter type
The LoadedFormatter value is the object to convert the LintResult objects to text. The eslint.loadFormatter() method returns it. It has the following method:
format ((results: LintResult[], resultsMeta?: ResultsMeta) => string | Promise<string>)
The method to convert the LintResult objects to text. resultsMeta is an optional parameter that is primarily intended for use by the ESLint CLI and can contain only a maxWarningsExceeded property that would be passed through the context object when this method calls the underlying formatter function. Note that ESLint automatically generates cwd and rulesMeta properties of the context object, so you typically don’t need to pass in the second argument when calling this method.

loadESLint()
The loadESLint() function is used for integrations that wish to support both the current configuration system (flat config) and the old configuration system (eslintrc). This function returns the correct ESLint class implementation based on the arguments provided:
const { loadESLint } = require("eslint");

// loads the default ESLint that the CLI would use based on process.cwd()
const DefaultESLint = await loadESLint();

// loads the flat config version specifically
const FlatESLint = await loadESLint({ useFlatConfig: true });

// loads the legacy version specifically
const LegacyESLint = await loadESLint({ useFlatConfig: false });











You can then use the returned constructor to instantiate a new ESLint instance, like this:
// loads the default ESLint that the CLI would use based on process.cwd()
const DefaultESLint = await loadESLint();
const eslint = new DefaultESLint();




If you’re ever unsure which config system the returned constructor uses, check the configType property, which is either "flat" or "eslintrc":
// loads the default ESLint that the CLI would use based on process.cwd()
const DefaultESLint = await loadESLint();

if (DefaultESLint.configType === "flat") {
	// do something specific to flat config
}







If you don’t need to support both the old and new configuration systems, then it’s recommended to just use the ESLint constructor directly.

SourceCode
The SourceCode type represents the parsed source code that ESLint executes on. It’s used internally in ESLint and is also available so that already-parsed code can be used. You can create a new instance of SourceCode by passing in the text string representing the code and an abstract syntax tree (AST) in ESTree format (including location information, range information, comments, and tokens):
const SourceCode = require("eslint").SourceCode;

const code = new SourceCode("var foo = bar;", ast);




The SourceCode constructor throws an error if the AST is missing any of the required information.
The SourceCode constructor strips Unicode BOM. Please note the AST also should be parsed from stripped text.
const SourceCode = require("eslint").SourceCode;

const code = new SourceCode("\uFEFFvar foo = bar;", ast);

assert(code.hasBOM === true);
assert(code.text === "var foo = bar;");







SourceCode#splitLines()
This is a static function on SourceCode that is used to split the source code text into an array of lines.
const SourceCode = require("eslint").SourceCode;

const code = "var a = 1;\nvar b = 2;";

// split code into an array
const codeLines = SourceCode.splitLines(code);

/*
    Value of codeLines will be
    [
        "var a = 1;",
        "var b = 2;"
    ]
 */
















Linter
The Linter object does the actual evaluation of the JavaScript code. It doesn’t do any filesystem operations, it simply parses and reports on the code. In particular, the Linter object does not process configuration files. Unless you are working in the browser, you probably want to use the ESLint class instead.
The Linter is a constructor, and you can create a new instance by passing in the options you want to use. The available options are:
cwd - Path to a directory that should be considered as the current working directory. It is accessible to rules from context.cwd or by calling context.getCwd() (see The Context Object). If cwd is undefined, it will be normalized to process.cwd() if the global process object is defined (for example, in the Node.js runtime) , or undefined otherwise.
For example:
const Linter = require("eslint").Linter;
const linter1 = new Linter({ cwd: "path/to/project" });
const linter2 = new Linter();




In this example, rules run on linter1 will get path/to/project from context.cwd or when calling context.getCwd(). Those run on linter2 will get process.cwd() if the global process object is defined or undefined otherwise (e.g. on the browser https://eslint.org/demo).
Linter#verify
The most important method on Linter is verify(), which initiates linting of the given text. This method accepts three arguments:
code - the source code to lint (a string or instance of SourceCode).
config - a Configuration object or an array of configuration objects.
Note: If you want to lint text and have your configuration be read from the file system, use ESLint#lintFiles() or ESLint#lintText() instead.
options - (optional) Additional options for this run.
filename - (optional) the filename to associate with the source code.
preprocess - (optional) A function that Processors in Plugins documentation describes as the preprocess method.
postprocess - (optional) A function that Processors in Plugins documentation describes as the postprocess method.
filterCodeBlock - (optional) A function that decides which code blocks the linter should adopt. The function receives two arguments. The first argument is the virtual filename of a code block. The second argument is the text of the code block. If the function returned true then the linter adopts the code block. If the function was omitted, the linter adopts only *.js code blocks. If you provided a filterCodeBlock function, it overrides this default behavior, so the linter doesn’t adopt *.js code blocks automatically.
disableFixes - (optional) when set to true, the linter doesn’t make either the fix or suggestions property of the lint result.
allowInlineConfig - (optional) set to false to disable inline comments from changing ESLint rules.
reportUnusedDisableDirectives - (optional) when set to true, adds reported errors for unused eslint-disable and eslint-enable directives when no problems would be reported in the disabled area anyway.
ruleFilter - (optional) A function predicate that decides which rules should run. It receives an object containing ruleId and severity, and returns true if the rule should be run.
If the third argument is a string, it is interpreted as the filename.
You can call verify() like this:
const Linter = require("eslint").Linter;
const linter = new Linter();

const messages = linter.verify(
	"var foo;",
	{
		rules: {
			semi: 2,
		},
	},
	{ filename: "foo.js" },
);

// or using SourceCode

const Linter = require("eslint").Linter,
	linter = new Linter(),
	SourceCode = require("eslint").SourceCode;

const code = new SourceCode("var foo = bar;", ast);

const messages = linter.verify(
	code,
	{
		rules: {
			semi: 2,
		},
	},
	{ filename: "foo.js" },
);































The verify() method returns an array of objects containing information about the linting warnings and errors. Here’s an example:
[
	{
		fatal: false,
		ruleId: "semi",
		severity: 2,
		line: 1,
		column: 23,
		message: "Expected a semicolon.",
		fix: {
			range: [1, 15],
			text: ";",
		},
	},
];















The information available for each linting message is:
column - the column on which the error occurred.
fatal - usually omitted, but will be set to true if there’s a parsing error (not related to a rule).
line - the line on which the error occurred.
message - the message that should be output.
messageId - the ID of the message used to generate the message (this property is omitted if the rule does not use message IDs).
nodeType - (Deprecated: This property will be removed in a future version of ESLint.) the node, comment, or token type that was reported with the problem.
ruleId - the ID of the rule that triggered the messages (or null if fatal is true).
severity - either 1 or 2, depending on your configuration.
endColumn - the end column of the range on which the error occurred (this property is omitted if it’s not range).
endLine - the end line of the range on which the error occurred (this property is omitted if it’s not range).
fix - an object describing the fix for the problem (this property is omitted if no fix is available).
suggestions - an array of objects describing possible lint fixes for editors to programmatically enable (see details in the Working with Rules docs).
You can get the suppressed messages from the previous run by getSuppressedMessages() method. If there is not a previous run, getSuppressedMessage() will return an empty list.
const Linter = require("eslint").Linter;
const linter = new Linter();

const messages = linter.verify(
	"var foo = bar; // eslint-disable-line -- Need to suppress",
	{
		rules: {
			semi: ["error", "never"],
		},
	},
	{ filename: "foo.js" },
);
const suppressedMessages = linter.getSuppressedMessages();

console.log(suppressedMessages[0].suppressions); // [{ "kind": "directive", "justification": "Need to suppress" }]
















You can also get an instance of the SourceCode object used inside of linter by using the getSourceCode() method:
const Linter = require("eslint").Linter;
const linter = new Linter();

const messages = linter.verify(
	"var foo = bar;",
	{
		rules: {
			semi: 2,
		},
	},
	{ filename: "foo.js" },
);

const code = linter.getSourceCode();

console.log(code.text); // "var foo = bar;"

















In this way, you can retrieve the text and AST used for the last run of linter.verify().
Linter#verifyAndFix()
This method is similar to verify except that it also runs autofixing logic, similar to the --fix flag on the command line. The result object will contain the autofixed code, along with any remaining linting messages for the code that were not autofixed.
const Linter = require("eslint").Linter;
const linter = new Linter();

const messages = linter.verifyAndFix("var foo", {
	rules: {
		semi: 2,
	},
});









Output object from this method:
{
    fixed: true,
    output: "var foo;",
    messages: []
}






The information available is:
fixed - True, if the code was fixed.
output - Fixed code text (might be the same as input if no fixes were applied).
messages - Collection of all messages for the given code (It has the same information as explained above under verify block).
Linter#version/Linter.version
Each instance of Linter has a version property containing the semantic version number of ESLint that the Linter instance is from.
const Linter = require("eslint").Linter;
const linter = new Linter();

linter.version; // => '9.0.0'





There is also a Linter.version property that you can read without instantiating Linter:
const Linter = require("eslint").Linter;

Linter.version; // => '9.0.0'




Linter#getTimes()
This method is used to get the times spent on (parsing, fixing, linting) a file. See times property of the Stats object.
Linter#getFixPassCount()
This method is used to get the number of autofix passes made. See fixPasses property of the Stats object.
Linter#hasFlag()
This method is used to determine if a given feature flag is set, as in this example:
const Linter = require("eslint").Linter;
const linter = new Linter({ flags: ["x_feature"] });

console.log(linter.hasFlag("x_feature")); // true






RuleTester
eslint.RuleTester is a utility to write tests for ESLint rules. It is used internally for the bundled rules that come with ESLint, and it can also be used by plugins.
Example usage:
"use strict";

const rule = require("../../../lib/rules/my-rule"),
	RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester();

ruleTester.run("my-rule", rule, {
	valid: [
		{
			code: "var foo = true",
			options: [{ allowFoo: true }],
		},
	],

	invalid: [
		{
			code: "var invalidVariable = true",
			errors: [{ message: "Unexpected invalid variable." }],
		},
		{
			code: "var invalidVariable = true",
			errors: [{ message: /^Unexpected.+variable/ }],
		},
	],
});



























The RuleTester constructor accepts an optional object argument, which can be used to specify defaults for your test cases. For example, if all of your test cases use ES2015, you can set it as a default:
const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2015 } });


Tip
If you don’t specify any options to the RuleTester constructor, then it uses the ESLint defaults (languageOptions: { ecmaVersion: "latest", sourceType: "module" }).
The RuleTester#run() method is used to run the tests. It should be passed the following arguments:
The name of the rule (string).
The rule object itself (see “working with rules”).
An object containing valid and invalid properties, each of which is an array containing test cases.
A test case is an object with the following properties:
name (string, optional): The name to use for the test case, to make it easier to find.
code (string, required): The source code that the rule should be run on.
options (array, optional): The options passed to the rule. The rule severity should not be included in this list.
before (function, optional): Function to execute before testing the case.
after (function, optional): Function to execute after testing the case regardless of its result.
filename (string, optional): The filename for the given case (useful for rules that make assertions about filenames).
only (boolean, optional): Run this case exclusively for debugging in supported test frameworks.
In addition to the properties above, invalid test cases can also have the following properties:
errors (number or array, required): Asserts some properties of the errors that the rule is expected to produce when run on this code. If this is a number, asserts the number of errors produced. Otherwise, this should be a list of objects, each containing information about a single reported error. The following properties can be used for an error (all are optional unless otherwise noted):
message (string/regexp): The message for the error. Must provide this or messageId.
messageId (string): The ID for the error. Must provide this or message. See testing errors with messageId for details.
data (object): Placeholder data which can be used in combination with messageId.
type (string): (Deprecated: This property will be removed in a future version of ESLint.) The type of the reported AST node.
line (number): The 1-based line number of the reported location.
column (number): The 1-based column number of the reported location.
endLine (number): The 1-based line number of the end of the reported location.
endColumn (number): The 1-based column number of the end of the reported location.
suggestions (array): An array of objects with suggestion details to check. Required if the rule produces suggestions. See Testing Suggestions for details.
If a string is provided as an error instead of an object, the string is used to assert the message of the error.
output (string, required if the rule fixes code): Asserts the output that will be produced when using this rule for a single pass of autofixing (e.g. with the --fix command line flag). If this is null or omitted, asserts that none of the reported problems suggest autofixes.
Any additional properties of a test case will be passed directly to the linter as config options. For example, a test case can have a languageOptions property to configure parser behavior:
{
    code: "let foo;",
    languageOptions: { ecmaVersion: 2015 }
}





If a valid test case only uses the code property, it can optionally be provided as a string containing the code, rather than an object with a code key.
Testing Errors with messageId
If the rule under test uses messageIds, you can use messageId property in a test case to assert reported error’s messageId instead of its message.
{
    code: "let foo;",
    errors: [{ messageId: "unexpected" }]
}





For messages with placeholders, a test case can also use data property to additionally assert reported error’s message.
{
    code: "let foo;",
    errors: [{ messageId: "unexpected", data: { name: "foo" } }]
}





Please note that data in a test case does not assert data passed to context.report. Instead, it is used to form the expected message text which is then compared with the received message.
Testing Fixes
The result of applying fixes can be tested by using the output property of an invalid test case. The output property should be used only when you expect a fix to be applied to the specified code; you can safely omit output if no changes are expected to the code. Here’s an example:
ruleTester.run("my-rule-for-no-foo", rule, {
	valid: [],
	invalid: [
		{
			code: "var foo;",
			output: "var bar;",
			errors: [
				{
					messageId: "shouldBeBar",
					line: 1,
					column: 5,
				},
			],
		},
	],
});

















A the end of this invalid test case, RuleTester expects a fix to be applied that results in the code changing from var foo; to var bar;. If the output after applying the fix doesn’t match, then the test fails.
Important
ESLint makes its best attempt at applying all fixes, but there is no guarantee that all fixes will be applied. As such, you should aim for testing each type of fix in a separate RuleTester test case rather than one test case to test multiple fixes. When there is a conflict between two fixes (because they apply to the same section of code) RuleTester applies only the first fix.
Testing Suggestions
Suggestions can be tested by defining a suggestions key on an errors object. If this is a number, it asserts the number of suggestions provided for the error. Otherwise, this should be an array of objects, each containing information about a single provided suggestion. The following properties can be used:
desc (string): The suggestion desc value. Must provide this or messageId.
messageId (string): The suggestion messageId value for suggestions that use messageIds. Must provide this or desc.
data (object): Placeholder data which can be used in combination with messageId.
output (string, required): A code string representing the result of applying the suggestion fix to the input code.
Example:
ruleTester.run("my-rule-for-no-foo", rule, {
	valid: [],
	invalid: [
		{
			code: "var foo;",
			errors: [
				{
					suggestions: [
						{
							desc: "Rename identifier 'foo' to 'bar'",
							output: "var bar;",
						},
					],
				},
			],
		},
	],
});



















messageId and data properties in suggestion test objects work the same way as in error test objects. See testing errors with messageId for details.
ruleTester.run("my-rule-for-no-foo", rule, {
	valid: [],
	invalid: [
		{
			code: "var foo;",
			errors: [
				{
					suggestions: [
						{
							messageId: "renameFoo",
							data: { newName: "bar" },
							output: "var bar;",
						},
					],
				},
			],
		},
	],
});




















Customizing RuleTester
RuleTester depends on two functions to run tests: describe and it. These functions can come from various places:
If RuleTester.describe and RuleTester.it have been set to function values, RuleTester will use RuleTester.describe and RuleTester.it to run tests. You can use this to customize the behavior of RuleTester to match a test framework that you’re using.
If RuleTester.itOnly has been set to a function value, RuleTester will call RuleTester.itOnly instead of RuleTester.it to run cases with only: true. If RuleTester.itOnly is not set but RuleTester.it has an only function property, RuleTester will fall back to RuleTester.it.only.
Otherwise, if describe and it are present as globals, RuleTester will use globalThis.describe and globalThis.it to run tests and globalThis.it.only to run cases with only: true. This allows RuleTester to work when using frameworks like Mocha without any additional configuration.
Otherwise, RuleTester#run will simply execute all of the tests in sequence, and will throw an error if one of them fails. This means you can simply execute a test file that calls RuleTester.run using Node.js, without needing a testing framework.
RuleTester#run calls the describe function with two arguments: a string describing the rule, and a callback function. The callback calls the it function with a string describing the test case, and a test function. The test function will return successfully if the test passes, and throw an error if the test fails. The signature for only is the same as it. RuleTester calls either it or only for every case even when some cases have only: true, and the test framework is responsible for implementing test case exclusivity. (Note that this is the standard behavior for test suites when using frameworks like Mocha; this information is only relevant if you plan to customize RuleTester.describe, RuleTester.it, or RuleTester.itOnly.)
Example of customizing RuleTester:
"use strict";

const RuleTester = require("eslint").RuleTester,
	test = require("my-test-runner"),
	myRule = require("../../../lib/rules/my-rule");

RuleTester.describe = function (text, method) {
	RuleTester.it.title = text;
	return method.call(this);
};

RuleTester.it = function (text, method) {
	test(RuleTester.it.title + ": " + text, method);
};

// then use RuleTester as documented

const ruleTester = new RuleTester();

ruleTester.run("my-rule", myRule, {
	valid: [
		// valid test cases
	],
	invalid: [
		// invalid test cases
	],
});




























Edit this page
Table of Contents
ESLint class
◆ new ESLint(options)
Parameters
◆ eslint.lintFiles(patterns)
Parameters
Return Value
◆ eslint.lintText(code, options)
Parameters
Return Value
◆ eslint.getRulesMetaForResults(results)
Parameters
Return Value
◆ eslint.calculateConfigForFile(filePath)
Parameters
Return Value
◆ eslint.isPathIgnored(filePath)
Parameters
Return Value
◆ eslint.loadFormatter(nameOrPath)
Parameters
Return Value
◆ eslint.hasFlag(flagName)
Parameters
Return Value
◆ ESLint.version
◆ ESLint.defaultConfig
◆ ESLint.outputFixes(results)
Parameters
Return Value
◆ ESLint.getErrorResults(results)
Parameters
Return Value
◆ LintResult type
◆ LintMessage type
◆ SuppressedLintMessage type
◆ EditInfo type
◆ LoadedFormatter type
loadESLint()
SourceCode
SourceCode#splitLines()
Linter
Linter#verify
Linter#verifyAndFix()
Linter#version/Linter.version
Linter#getTimes()
Linter#getFixPassCount()
Linter#hasFlag()
RuleTester
Testing Errors with messageId
Testing Fixes
Testing Suggestions
Customizing RuleTester
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Architecture

At a high level, there are a few key parts to ESLint:
bin/eslint.js - this is the file that actually gets executed with the command line utility. It’s a dumb wrapper that does nothing more than bootstrap ESLint, passing the command line arguments to cli. This is intentionally small so as not to require heavy testing.
lib/api.js - this is the entry point of require("eslint"). This file exposes an object that contains public classes Linter, ESLint, RuleTester, and SourceCode.
lib/cli.js - this is the heart of the ESLint CLI. It takes an array of arguments and then uses eslint to execute the commands. By keeping this as a separate utility, it allows others to effectively call ESLint from within another Node.js program as if it were done on the command line. The main call is cli.execute(). This is also the part that does all the file reading, directory traversing, input, and output.
lib/cli-engine/ - this module is CLIEngine class that finds source code files and configuration files then does code verifying with the Linter class. This includes the loading logic of configuration files, parsers, plugins, and formatters.
lib/linter/ - this module is the core Linter class that does code verifying based on configuration options. This file does no file I/O and does not interact with the console at all. For other Node.js programs that have JavaScript text to verify, they would be able to use this interface directly.
lib/rule-tester/ - this module is RuleTester class that is a wrapper around Mocha so that rules can be unit tested. This class lets us write consistently formatted tests for each rule that is implemented and be confident that each of the rules work. The RuleTester interface was modeled after Mocha and works with Mocha’s global testing methods. RuleTester can also be modified to work with other testing frameworks.
lib/source-code/ - this module is SourceCode class that is used to represent the parsed source code. It takes in source code and the Program node of the AST representing the code.
lib/rules/ - this contains built-in rules that verify source code.
The cli object
The cli object is the API for the command line interface. Literally, the bin/eslint.js file simply passes arguments to the cli object and then sets process.exitCode to the returned exit code.
The main method is cli.execute(), which accepts an array of strings that represent the command line options (as if process.argv were passed without the first two arguments). If you want to run ESLint from inside of another program and have it act like the CLI, then cli is the object to use.
This object’s responsibilities include:
Interpreting command line arguments.
Reading from the file system.
Outputting to the console.
Outputting to the filesystem.
Use a formatter.
Returning the correct exit code.
This object may not:
Call process.exit() directly.
Perform any asynchronous operations.
The CLIEngine object
The CLIEngine type represents the core functionality of the CLI except that it reads nothing from the command line and doesn’t output anything by default. Instead, it accepts many (but not all) of the arguments that are passed into the CLI. It reads both configuration and source files as well as managing the environment that is passed into the Linter object.
The main method of the CLIEngine is executeOnFiles(), which accepts an array of file and directory names to run the linter on.
This object’s responsibilities include:
Managing the execution environment for Linter.
Reading from the file system.
Reading configuration information from config files (including .eslintrc and package.json).
This object may not:
Call process.exit() directly.
Perform any asynchronous operations.
Output to the console.
Use formatters.
The Linter object
The main method of the Linter object is verify() and accepts two arguments: the source text to verify and a configuration object (the baked configuration of the given configuration file plus command line options). The method first parses the given text with espree (or whatever the configured parser is) and retrieves the AST. The AST is produced with both line/column and range locations which are useful for reporting location of issues and retrieving the source text related to an AST node, respectively.
Once the AST is available, estraverse is used to traverse the AST from top to bottom. At each node, the Linter object emits an event that has the same name as the node type (i.e., “Identifier”, “WithStatement”, etc.). On the way back up the subtree, an event is emitted with the AST type name and suffixed with “:exit”, such as “Identifier:exit” - this allows rules to take action both on the way down and on the way up in the traversal. Each event is emitted with the appropriate AST node available.
This object’s responsibilities include:
Inspecting JavaScript code strings.
Creating an AST for the code.
Executing rules on the AST.
Reporting back the results of the execution.
This object may not:
Call process.exit() directly.
Perform any asynchronous operations.
Use Node.js-specific features.
Access the file system.
Call console.log() or any other similar method.
Rules
Individual rules are the most specialized part of the ESLint architecture. Rules can do very little, they are simply a set of instructions executed against an AST that is provided. They do get some context information passed in, but the primary responsibility of a rule is to inspect the AST and report warnings.
These objects’ responsibilities are:
Inspect the AST for specific patterns.
Reporting warnings when certain patterns are found.
These objects may not:
Call process.exit() directly.
Perform any asynchronous operations.
Use Node.js-specific features.
Access the file system.
Call console.log() or any other similar method.
Edit this page
Table of Contents
The cli object
The CLIEngine object
The Linter object
Rules
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Set up a Development Environment
ESLint has a very lightweight development environment that makes updating code fast and easy. This is a step-by-step guide to setting up a local development environment that will let you contribute back to the project.
Step 1: Install Node.js
Go to https://nodejs.org/ to download and install the latest stable version for your operating system.
Most of the installers already come with npm but if for some reason npm doesn’t work on your system, you can install it manually using the instructions on the site.
Step 2: Fork and Checkout Your Own ESLint Repository
Go to https://github.com/eslint/eslint and click the “Fork” button. Follow the GitHub documentation for forking and cloning.
Clone your fork:
git clone https://github.com/<Your GitHub Username>/eslint


Once you’ve cloned the repository, run npm install to get all the necessary dependencies:
cd eslint


npmyarnpnpmbun
npm install


You must be connected to the Internet for this step to work. You’ll see a lot of utilities being downloaded.
Note: It’s a good idea to re-run npm install whenever you pull from the main repository to ensure you have the latest development dependencies.
Step 3: Add the Upstream Source
The upstream source is the main ESLint repository where active development happens. While you won’t have push access to upstream, you will have pull access, allowing you to pull in the latest code whenever you want.
To add the upstream source for ESLint, run the following in your repository:
git remote add upstream git@github.com:eslint/eslint.git


Now, the remote upstream points to the upstream source.
Step 4: Install the Yeoman Generator
Yeoman is a scaffold generator that ESLint uses to help streamline development of new rules. If you don’t already have Yeoman installed, you can install it via npm:
npmyarnpnpmbun
npm install --global yo


Then, you can install the ESLint Yeoman generator:
npmyarnpnpmbun
npm install --global generator-eslint


Please see the generator documentation for instructions on how to use it.
Step 5: Run the Tests
Running the tests is the best way to ensure you have correctly set up your development environment. Make sure you’re in the eslint directory and run:
npm test


The testing takes a few minutes to complete. If any tests fail, that likely means one or more parts of the environment setup didn’t complete correctly. The upstream tests always pass.
Reference Information
Directory Structure
The ESLint directory and file structure is as follows:
bin - executable files that are available when ESLint is installed.
conf - default configuration information.
docs - documentation for the project.
lib - contains the source code.
formatters - all source files defining formatters.
rules - all source files defining rules.
tests - the main unit test folder.
lib - tests for the source code.
formatters - tests for the formatters.
rules - tests for the rules.
Workflow
Once you have your development environment installed, you can make and submit changes to the ESLint source files. Doing this successfully requires careful adherence to our pull-request submission workflow.
Build Scripts
ESLint has several build scripts that help with various parts of development.
npm test
The primary script to use is npm test, which does several things:
Lints all JavaScript (including tests) and JSON.
Runs all tests on Node.js.
Checks code coverage targets.
Generates build/eslint.js for use in a browser.
Runs a subset of tests in PhantomJS.
Be sure to run this after making changes and before sending a pull request with your changes.
Note: The full code coverage report is output into /coverage.
npm run lint
Runs just the JavaScript and JSON linting on the repository.
npm run webpack
Generates build/eslint.js, a version of ESLint for use in the browser.
Edit this page
Table of Contents
Step 1: Install Node.js
Step 2: Fork and Checkout Your Own ESLint Repository
Step 3: Add the Upstream Source
Step 4: Install the Yeoman Generator
Step 5: Run the Tests
Reference Information
Directory Structure
Workflow
Build Scripts
npm test
npm run lint
npm run webpack
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Run the Tests
Most parts of ESLint have unit tests associated with them. Unit tests are written using Mocha and are required when making contributions to ESLint. You’ll find all of the unit tests in the tests directory.
When you first get the source code, you need to run npm install once initially to set ESLint for development. Once you’ve done that, you can run the tests via:
npm test


This automatically starts Mocha and runs all tests in the tests directory. You need only add yours and it will automatically be picked up when running tests.
Running Individual Tests
If you want to quickly run just one test file, you can do so by running Mocha directly and passing in the filename. For example:
npm run test:cli tests/lib/rules/no-undef.js


If you want to run just one or a subset of RuleTester test cases, add only: true to each test case or wrap the test case in RuleTester.only(...) to add it automatically:
ruleTester.run("my-rule", myRule, {
	valid: [
		RuleTester.only("const valid = 42;"),
		// Other valid cases
	],
	invalid: [
		{
			code: "const invalid = 42;",
			only: true,
		},
		// Other invalid cases
	],
});














Running individual tests is useful when you’re working on a specific bug and iterating on the solution. You should be sure to run npm test before submitting a pull request. npm test uses Mocha’s --forbid-only option to prevent only tests from passing full test runs.
More Control on Unit Testing
npm run test:cli is an alias of the Mocha cli in ./node_modules/.bin/mocha. Options are available to be provided to help to better control the test to run.
The default timeout for tests in npm test is 10000ms. You may change the timeout by providing ESLINT_MOCHA_TIMEOUT environment variable, for example:
ESLINT_MOCHA_TIMEOUT=20000 npm test


Edit this page
Table of Contents
Running Individual Tests
More Control on Unit Testing
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Package.json Conventions
The following applies to the “scripts” section of package.json files.
Names
npm script names MUST contain only lower case letters, : to separate parts, - to separate words, and + to separate file extensions. Each part name SHOULD be either a full English word (e.g. coverage not cov) or a well-known initialism in all lowercase (e.g. wasm).
Here is a summary of the proposal in ABNF.
name         = life-cycle / main target? option* ":watch"?
life-cycle   = "prepare" / "preinstall" / "install" / "postinstall" / "prepublish" / "preprepare" / "prepare" / "postprepare" / "prepack" / "postpack" / "prepublishOnly"
main         = "build" / "lint" ":fix"? / "fmt" ":check"? / "release" / "start" / "test" / "fetch"
target       = ":" word ("-" word)* / extension ("+" extension)*
option       = ":" word ("-" word)*
word         = ALPHA +
extension    = ( ALPHA / DIGIT )+








Order
The script names MUST appear in the package.json file in alphabetical order. The other conventions outlined in this document ensure that alphabetical order will coincide with logical groupings.
Main Script Names
With the exception of npm life cycle scripts all script names MUST begin with one of the following names.
Build
Scripts that generate a set of files from source code and / or data MUST have names that begin with build.
If a package contains any build:* scripts, there MAY be a script named build. If so, SHOULD produce the same output as running each of the build scripts individually. It MUST produce a subset of the output from running those scripts.
Fetch
Scripts that generate a set of files from external data or resources MUST have names that begin with fetch.
If a package contains any fetch:* scripts, there MAY be a script named fetch. If so, it SHOULD produce the same output as running each of the fetch scripts individually. It MUST produce a subset of the output from running those scripts.
Release
Scripts that have public side effects (publishing the website, committing to Git, etc.) MUST begin with release.
Lint
Scripts that statically analyze files (mostly, but not limited to running eslint itself) MUST have names that begin with lint.
If a package contains any lint:* scripts, there SHOULD be a script named lint and it MUST run all of the checks that would have been run if each lint:* script was called individually.
If fixing is available, a linter MUST NOT apply fixes UNLESS the script contains the :fix modifier (see below).
Fmt
Scripts that format source code MUST have names that begin with fmt.
If a package contains any fmt:* scripts, there SHOULD be a script named fmt that applies formatting fixes to all source files. There SHOULD also be a script named fmt:check that validates code formatting without modifying files and exits non-zero if any files are out of compliance.
Start
A start script is used to start a server. As of this writing, no ESLint package has more than one start script, so there’s no need start to have any modifiers.
Test
Scripts that execute code in order to ensure the actual behavior matches expected behavior MUST have names that begin with test.
If a package contains any test:* scripts, there SHOULD be a script named test and it MUST run of all of the tests that would have been run if each test:* script was called individually.
A test script SHOULD NOT include linting.
A test script SHOULD report test coverage when possible.
Modifiers
One or more of the following modifiers MAY be appended to the standard script names above. If a target has modifiers, they MUST be in the order in which they appear below (e.g. lint:fix:js:watch not lint:watch:js:fix).
Fix
If it’s possible for a linter to fix problems that it finds, add a copy of the script with :fix appended to the end that also fixes.
Check
If a script validates code or artifacts without making any modifications, append :check to the script name. This modifier is typically used for formatters (e.g., fmt:check) to verify that files conform to the expected format and to exit with a non-zero status if any issues are found. Scripts with the :check modifier MUST NOT alter any files or outputs.
Target
The name of the target of the action being run. In the case of a build script, it SHOULD identify the build artifact(s), e.g. “javascript” or “css” or “website”. In the case of a lint or test script, it SHOULD identify the item(s) being linted or tested. In the case of a start script, it SHOULD identify which server is starting.
A target MAY refer to a list of affected file extensions (such as cjs or less) delimited by a +. If there is more than one extension, the list SHOULD be alphabetized. When a file extension has variants (such as cjs for CommonJS and mjs for ESM), the common part of the extension MAY be used instead of explicitly listing out all of the variants (e.g. js instead of cjs+jsx+mjs).
The target SHOULD NOT refer to name of the name of the tool that’s performing the action (eleventy, webpack, etc.).
Options
Additional options that don’t fit under the other modifiers.
Watch
If a script watches the filesystem and responds to changes, add :watch to the script name.
Edit this page
Table of Contents
Names
Order
Main Script Names
Build
Fetch
Release
Lint
Fmt
Start
Test
Modifiers
Fix
Check
Target
Options
Watch
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Work on Issues
Our public issues tracker lists all of the things we plan on doing as well as suggestions from the community. Before starting to work on an issue, be sure you read through the rest of this page.
Issue Labels
We use labels to indicate the status of issues. The most complete documentation on the labels is found in the Maintain ESLint documentation, but most contributors should find the information on this page sufficient. The most important questions that labels can help you, as a contributor, answer are:
Is this issue ready for a pull request? Issues that are ready for pull requests have the accepted label, which indicates that the team has agreed to accept a pull request. Please do not send pull requests for issues that have not been marked as accepted.
Is this issue right for a beginner? If you have little or no experience contributing to ESLint, the good first issue label marks appropriate issues. Otherwise, the help wanted label is an invitation to work on the issue. If you have more experience, you can try working on other issues labeled accepted.
What is this issue about? Labels describing the nature of issues include bug, enhancement, feature, question, rule, documentation, core, build, cli, infrastructure, breaking, and chore. These are documented in Maintain ESLint.
What is the priority of this issue? Because we have a lot of issues, we prioritize certain issues above others. The following is the list of priorities, from highest to lowest:
Bugs - problems with the project are actively affecting users. We want to get these resolved as quickly as possible.
Documentation - documentation issues are a type of bug in that they actively affect current users. As such, we want to address documentation issues as quickly as possible.
Features - new functionality that will aid users in the future.
Enhancements - requested improvements for existing functionality.
Other - anything else.
Starting Work
Important
Before starting to work on an existing issue, please check if the issue has been assigned to anyone. If it has, then that person is already responsible for submitting a pull request and you should choose a different issue to work on.
Claiming an issue
If you’re going to work on an issue, please claim the issue by adding a comment saying you’re working on it and indicating when you think you will complete it. This helps us to avoid duplication of effort. Some examples of good claim comments are:
“I’ll take a look at this over the weekend.”
“I’m going to do this, give me two weeks.”
“Working on this” (as in, I’m working on it right now)
The team will validate your claim by assigning the issue to you.
Offering help on a claimed issue
If an issue has an assignee or has already been claimed by someone, please be respectful of that person’s desire to complete the work and don’t work on it unless you verify that they are no longer interested or would welcome the help. If there hasn’t been activity on the issue after two weeks, you can express your interest in helping with the issue. For example:
“Are you still working on this? If not, I’d love to work on it.”
“Do you need any help on this? I’m interested.”
It is up to the assignee to decide if they’re going to continue working on the issue or if they’d like your help.
If there is no response after a week, please contact a team member for help.
Unclaiming an issue
If you claimed an issue and find you can’t finish the work, then add a comment letting people know, for example:
“Sorry, it looks like I don’t have time to do this.”
“I thought I knew enough to fix this, but it turns out I don’t.”
No one will blame you for backing out of an issue if you are unable to complete it. We just want to keep the process moving along as efficiently as possible.
Edit this page
Table of Contents
Issue Labels
Starting Work
Claiming an issue
Offering help on a claimed issue
Unclaiming an issue
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Submit a Pull Request
If you want to contribute to an ESLint repo, please use a GitHub pull request. This is the fastest way for us to evaluate your code and to merge it into the code base. Please don’t file an issue with snippets of code. Doing so means that we need to manually merge the changes in and update any appropriate tests. That decreases the likelihood that your code is going to get included in a timely manner. Please use pull requests.
Getting Started
If you’d like to work on a pull request and you’ve never submitted code before, follow these steps:
Set up a development environment.
If you want to implement a breaking change or a change to the core, ensure there’s an issue that describes what you’re doing and the issue has been accepted. You can create a new issue or just indicate you’re working on an existing issue. Bug fixes, documentation changes, and other pull requests do not require an issue.
After that, you’re ready to start working on code.
Working with Code
The process of submitting a pull request is fairly straightforward and generally follows the same pattern each time:
Create a new branch.
Make your changes.
Rebase onto upstream.
Run the tests.
Double check your submission.
Push your changes.
Submit the pull request.
Details about each step are found below.
Step 1: Create a new branch
The first step to sending a pull request is to create a new branch in your ESLint fork. Give the branch a descriptive name that describes what it is you’re fixing, such as:
git checkout -b issue1234


You should do all of your development for the issue in this branch.
Note: Do not combine fixes for multiple issues into one branch. Use a separate branch for each issue you’re working on.
Step 2: Make your changes
Make the changes to the code and tests, following the code conventions as you go. Once you have finished, commit the changes to your branch:
git add -A
git commit



All ESLint projects follow Conventional Commits for our commit messages. (Note: we don’t support the optional scope in messages.) Here’s an example commit message:
tag: Short description of what you did

Longer description here if necessary

Fixes #1234






The first line of the commit message (the summary) must have a specific format. This format is checked by our build tools. Although the commit message is not checked directly, it will be used to generate the title of a pull request, which will be checked when the pull request is submitted.
The tag is one of the following:
fix - for a bug fix.
feat - either for a backwards-compatible enhancement or for a rule change that adds reported problems.
fix! - for a backwards-incompatible bug fix.
feat! - for a backwards-incompatible enhancement or feature.
docs - changes to documentation only.
chore - for changes that aren’t user-facing.
build - changes to build process only.
refactor - a change that doesn’t affect APIs or user experience.
test - just changes to test files.
ci - changes to our CI configuration files and scripts.
perf - a code change that improves performance.
Use the labels of the issue you are working on to determine the best tag.
The message summary should be a one-sentence description of the change, and it must be 72 characters in length or shorter. If the pull request addresses an issue, then the issue number should be mentioned in the body of the commit message in the format Fixes #1234. If the commit doesn’t completely fix the issue, then use Refs #1234 instead of Fixes #1234.
Here are some good commit message summary examples:
build: Update Travis to only test Node 0.10
fix: Semi rule incorrectly flagging extra semicolon
chore: Upgrade Esprima to 1.2, switch to using comment attachment




Step 3: Rebase onto upstream
Before you send the pull request, be sure to rebase onto the upstream source. This ensures your code is running on the latest available code.
git fetch upstream
git rebase upstream/main



Step 4: Run the tests
After rebasing, be sure to run all of the tests once again to make sure nothing broke:
npm test


If there are any failing tests, update your code until all tests pass.
Step 5: Double check your submission
With your code ready to go, this is a good time to double-check your submission to make sure it follows our conventions. Here are the things to check:
The commit message is properly formatted.
The change introduces no functional regression. Be sure to run npm test to verify your changes before submitting a pull request.
Make separate pull requests for unrelated changes. Large pull requests with multiple unrelated changes may be closed without merging.
All changes must be accompanied by tests, even if the feature you’re working on previously had no tests.
All user-facing changes must be accompanied by appropriate documentation.
Follow the Code Conventions.
Step 6: Push your changes
Next, push your changes to your clone:
git push origin issue1234


If you are unable to push because some references are old, do a forced push instead:
git push -f origin issue1234


Step 7: Send the pull request
Now you’re ready to send the pull request. Go to your ESLint fork and then follow the GitHub documentation on how to send a pull request.
In order to submit code or documentation to an ESLint project, you’ll be asked to sign our CLA when you send your first pull request. (Read more about the OpenJS Foundation CLA process at https://cla.openjsf.org/.)
The pull request title is autogenerated from the summary of the first commit, but it can be edited before the pull request is submitted.
The description of a pull request should explain what you did and how its effects can be seen.
When a pull request is merged, its commits will be squashed into one single commit. The first line of the squashed commit message will contain the title of the pull request and the pull request number. The pull request title format is important because the titles are used to create a changelog for each release. The tag and the issue number help to create more consistent and useful changelogs.
Following Up
Once your pull request is sent, it’s time for the team to review it. As such, please make sure to:
Monitor the status of the GitHub Actions CI build for your pull request. If it fails, please investigate why. We cannot merge pull requests that fail the CI build for any reason.
Respond to comments left on the pull request from team members. Remember, we want to help you land your code, so please be receptive to our feedback.
We may ask you to make changes, rebase, or squash your commits.
Updating the Pull Request Title
If your pull request title is in the incorrect format, you’ll be asked to update it. You can do so via the GitHub user interface.
Updating the Code
If we ask you to make code changes, there’s no need to close the pull request and create a new one. Just go back to the branch on your fork and make your changes. Then, when you’re ready, you can add your changes into the branch:
git add -A
git commit
git push origin issue1234




When updating the code, it’s usually better to add additional commits to your branch rather than amending the original commit, because reviewers can easily tell which changes were made in response to a particular review. When we merge pull requests, we will squash all the commits from your branch into a single commit on the main branch.
The commit messages in subsequent commits do not need to be in any specific format because these commits do not show up in the changelog.
Rebasing
If your code is out-of-date, we might ask you to rebase. That means we want you to apply your changes on top of the latest upstream code. Make sure you have set up a development environment and then you can rebase using these commands:
git fetch upstream
git rebase upstream/main



You might find that there are merge conflicts when you attempt to rebase. Please resolve the conflicts and then do a forced push to your branch:
git push origin issue1234 -f


Edit this page
Table of Contents
Getting Started
Working with Code
Step 1: Create a new branch
Step 2: Make your changes
Step 3: Rebase onto upstream
Step 4: Run the tests
Step 5: Double check your submission
Step 6: Push your changes
Step 7: Send the pull request
Following Up
Updating the Pull Request Title
Updating the Code
Rebasing
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Contribute to Core Rules
The ESLint core rules are the rules included in the ESLint package.
Rule Writing Documentation
For full reference information on writing rules, refer to Custom Rules. Both custom rules and core rules have the same API. The primary difference between core and custom rules are:
Core rules are included in the eslint package.
Core rules must adhere to the conventions documented on this page.
File Structure
Each core rule in ESLint has three files named with its identifier (for example, no-extra-semi).
in the lib/rules directory: a source file (for example, no-extra-semi.js).
in the tests/lib/rules directory: a test file (for example, no-extra-semi.js).
in the docs/src/rules directory: a Markdown documentation file (for example, no-extra-semi.md).
Important: If you submit a core rule to the ESLint repository, you must follow the conventions explained below.
Here is the basic format of the source file for a rule:
/**
 * @fileoverview Rule to disallow unnecessary semicolons
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",

		docs: {
			description: "disallow unnecessary semicolons",
			recommended: true,
			url: "https://eslint.org/docs/rules/no-extra-semi",
		},
		fixable: "code",
		schema: [], // no options
	},
	create: function (context) {
		return {
			// callback functions
		};
	},
};































Rule Unit Tests
Each bundled rule for ESLint core must have a set of unit tests submitted with it to be accepted. The test file is named the same as the source file but lives in tests/lib/. For example, if the rule source file is lib/rules/foo.js then the test file should be tests/lib/rules/foo.js.
ESLint provides the RuleTester utility to make it easy to write tests for rules.
Performance Testing
To keep the linting process efficient and unobtrusive, it is useful to verify the performance impact of new rules or modifications to existing rules.
To learn how to profile the performance of individual rules, refer to Profile Rule Performance in the custom rules documentation.
When developing in the ESLint core repository, the npm run perf command gives a high-level overview of ESLint running time with all core rules enabled.
$ git checkout main
Switched to branch 'main'

$ npm run perf
CPU Speed is 2200 with multiplier 7500000
Performance Run #1:  1394.689313ms
Performance Run #2:  1423.295351ms
Performance Run #3:  1385.09515ms
Performance Run #4:  1382.406982ms
Performance Run #5:  1409.68566ms
Performance budget ok:  1394.689313ms (limit: 3409.090909090909ms)

$ git checkout my-rule-branch
Switched to branch 'my-rule-branch'

$ npm run perf
CPU Speed is 2200 with multiplier 7500000
Performance Run #1:  1443.736547ms
Performance Run #2:  1419.193291ms
Performance Run #3:  1436.018228ms
Performance Run #4:  1473.605485ms
Performance Run #5:  1457.455283ms
Performance budget ok:  1443.736547ms (limit: 3409.090909090909ms)
























Rule Naming Conventions
The rule naming conventions for ESLint are as follows:
Use dashes between words.
If your rule only disallows something, prefix it with no- such as no-eval for disallowing eval() and no-debugger for disallowing debugger.
If your rule is enforcing the inclusion of something, use a short name without a special prefix.
Frozen Rules
When rules are feature complete, they are marked as frozen (indicated with ❄️ in the documentation). Rules are considered feature complete when the intended purpose of the rule has been fully implemented such that it catches 80% or more of expected violations and covers the majority of common exceptions. After that point, we expect users to use disable comments when they find an edge case that isn’t covered.
When a rule is frozen, it means:
Bug fixes: We will still fix confirmed bugs.
New ECMAScript features: We will ensure compatibility with new ECMAScript features, meaning the rule will not break on new syntax.
TypeScript support: We will ensure compatibility with TypeScript syntax, meaning the rule will not break on TypeScript syntax and violations are appropriate for TypeScript.
New options: We will not add any new options unless an option is the only way to fix a bug or support a newly-added ECMAScript feature.
If you find that a frozen rule would work better for you with a change, we recommend copying the rule source code and modifying it to fit your needs.
Edit this page
Table of Contents
Rule Writing Documentation
File Structure
Rule Unit Tests
Performance Testing
Rule Naming Conventions
Frozen Rules
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Manage Issues and Pull Requests
New issues and pull requests are filed frequently, and how we respond to those issues directly affects the success of the project. Being part of the project team means helping to triage and address issues as they come in so the project can continue to run smoothly.
Things to Keep in Mind
Be nice. Even if the people are being rude or aggressive on an issue, you must be the mature one in the conversation as a project team member. Do your best to work with everyone no matter their style. Remember, poor wording choice can also be a sign of someone who doesn’t know English very well, so be sure to consider that when trying to determine the tone of someone’s message. Being rude, even when someone is being rude to you, reflects poorly on the team and the project as a whole.
Be inquisitive. Ask questions on the issue whenever something isn’t clear. Don’t assume you understand what’s being reported if there are details missing. Whenever you are unsure, it’s best to ask for more information.
Not all requests are equal. It’s unlikely we’ll be able to accommodate every request, so don’t be afraid to say that something doesn’t fit into the scope of the project or isn’t practical. It’s better to give such feedback if that’s the case.
Close when appropriate. Don’t be afraid to close issues that you don’t think will be done, or when it’s become clear from the conversation that there’s no further work to do. Issues can always be reopened if they are closed incorrectly, so feel free to close issues when appropriate. Just be sure to leave a comment explaining why the issue is being closed (if not closed by a commit).
Types of Issues and Pull Requests
There are five primary categories:
Bug: Something isn’t working the way it’s expected to work.
Enhancement: A change to something that already exists. For instance, adding a new option to an existing rule or fixing a bug in a rule where fixing it will result in the rule reporting more problems (in this case, use both “Bug” and “Enhancement”).
Feature: Adding something that doesn’t already exist. For example, adding a new rule, new formatter, or new command line flag.
Documentation: Adding, updating, or removing project documentation.
Question: An inquiry about how something works that won’t result in a code change. We prefer if people use GitHub Discussions or Discord for questions, but sometimes they’ll open an issue.
The first goal when evaluating an issue or pull request is to determine which category the issue falls into.
Triaging Process
All of ESLint’s issues and pull requests, across all GitHub repositories, are managed on our Triage Project. Please use the Triage project instead of the issues list when reviewing issues to determine what to work on. The Triage project has several columns:
Needs Triage: Issues and pull requests that have not yet been reviewed by anyone.
Triaging: Issues and pull requests that someone has reviewed but has not been able to fully triage yet.
Ready for Dev Team: Issues and pull requests that have been triaged and have all the information necessary for the dev team to take a look.
Evaluating: The dev team is evaluating these issues and pull requests to determine whether to move forward or not.
Feedback Needed: A team member is requesting more input from the rest of the team before proceeding.
Waiting for RFC: The next step in the process is for an RFC to be written.
RFC Opened: An RFC is opened to address these issues.
Blocked: The issue can’t move forward due to some dependency.
Ready to Implement: These issues have all the details necessary to start implementation.
Implementing: There is an open pull request for each of these issues or this is a pull request that has been approved.
Second Review Needed: Pull requests that already have one approval and the approver is requesting a second review before merging.
Merge Candidates: Pull requests that already have at least one approval and at least one approver believes the pull request is ready to merge into the next release but would still like a TSC member to verify.
Complete: The issue has been closed (either via pull request merge or by the team manually closing the issue).
We make every attempt to automate movement between as many columns as we can, but sometimes moving issues needs to be done manually.
When an Issue or Pull Request is Opened
When an issue or pull request is opened, it is automatically added to the “Needs Triage” column in the Triage project. These issues and pull requests need to be evaluated to determine the next steps. Anyone on the support team or dev team can follow these steps to properly triage issues.
Note: If an issue or pull request is in the “Triaging” column, that means someone is already triaging it, and you should let them finish. There’s no need to comment on issues or pull requests in the “Triaging” column unless someone asks for help.
The steps for triaging an issue or pull request are:
Move the issue or pull request from “Needs Triage” to “Triaging” in the Triage project.
Check: Has all the information in the issue template been provided?
No: If information is missing from the issue template, or you can’t tell what is being requested, please ask the author to provide the missing information:
Add the “needs info” label to the issue so we know that this issue is stalled due to lack of information.
Don’t move on to other steps until the necessary information has been provided.
If the issue author hasn’t provided the necessary information after 7 days, please close the issue. The bot will add a comment stating that the issue was closed because there was information missing.
Yes:
If the issue is actually a question (rather than something the dev team needs to change), please convert it to a discussion. You can continue the conversation as a discussion.
If the issue is reporting a bug, or if a pull request is fixing a bug, try to reproduce the issue following the instructions in the issue. If you can reproduce the bug, please add the “repro:yes” label. (The bot will automatically remove the “repro:needed” label.) If you can’t reproduce the bug, ask the author for more information about their environment or to clarify reproduction steps.
If the issue or pull request is reporting something that works as intended, please add the “works as intended” label and close the issue.
Please add labels describing the part of ESLint affected:
3rd party plugin: Related to third-party functionality (plugins, parsers, rules, etc.).
build: Related to commands run during a build (testing, linting, release scripts, etc.).
cli: Related to command line input or output, or to CLIEngine.
core: Related to internal APIs.
documentation: Related to content on eslint.org.
infrastructure: Related to resources needed for builds or deployment (VMs, CI tools, bots, etc.).
rule: Related to core rules.
Please assign an initial priority based on the importance of the issue or pull request. If you’re not sure, use your best judgment. We can always change the priority later.
P1: Urgent and important, we need to address this immediately.
P2: Important but not urgent. Should be handled by a TSC member or reviewer.
P3: Nice to have but not important. Can be handled by any team member.
P4: A good idea that we’d like to have but may take a while for the team to get to it.
P5: A good idea that the core team can’t commit to. Will likely need to be done by an outside contributor.
Please assign an initial impact assessment (make your best guess):
Low: Doesn’t affect many users.
Medium: Affects most users or has a noticeable effect on user experience.
High: Affects a lot of users, is a breaking change, or otherwise will be very noticeable to users.
If you can’t properly triage the issue or pull request, move the issue back to the “Needs Triage” column in the Triage project so someone else can triage it.
If a pull request references an already accepted issue, move it to the “Implementing” column in the Triage project.
If you have triaged the issue, move the issue to the “Ready for Dev Team” column in the Triage project.
Evaluation Process
When an issue has been moved to the “Ready for Dev Team” column, any dev team member can pick up the issue to start evaluating it.
Move the issue into the “Evaluating” column.
Next steps:
Bugs: If you can verify the bug, add the “accepted” label and ask if they would like to submit a pull request.
New Rules: If you are willing to champion the rule (meaning you believe it should be included in ESLint core and you will take ownership of the process for including it), add a comment saying you will champion the issue, assign the issue to yourself, and follow the guidelines below.
Rule Changes: If you are willing to champion the change and it would not be a breaking change (requiring a major version increment), add a comment saying that you will champion the issue, assign the issue to yourself, and follow the guidelines below.
Breaking Changes: If you suspect or can verify that a change would be breaking, label it as “Breaking”.
Duplicates: If you can verify the issue is a duplicate, add a comment mentioning the duplicate issue (such as, “Duplicate of #1234”) and close the issue.
Regardless of the above, always leave a comment. Don’t just add labels; engage with the person who opened the issue by asking a question (request more information if necessary) or stating your opinion of the issue. If it’s a verified bug, ask if the user would like to submit a pull request.
If the issue can’t be implemented because it needs an external dependency to be updated or needs to wait for another issue to be resolved, move the issue to the “Blocked” column.
If the issue has been accepted and an RFC is required as the next step, move the issue to the “Waiting for RFC” column and comment on the issue that an RFC is needed.
Note: “Good first issue” issues are intended to help new contributors feel welcome and empowered to make a contribution to ESLint. To ensure that new contributors are given a chance to work on these issues, issues labeled “good first issue” must be open for 30 days from the day the issue was labeled before a team member is permitted to work on them.
Accepting Issues and Pull Requests
Issues may be labeled as “accepted” when the issue is:
A bug that you’ve been able to reproduce and verify (i.e. you’re sure it’s a bug).
A new rule or rule change that you’re championing and consensus has been reached for its inclusion in the project.
The “accepted” label will be added to other issues by a TSC member if it’s appropriate for the roadmap.
When an issue is accepted and implementation can begin, it should be moved to the “Ready to Implement” column.
Championing Issues
New rules and rule changes require a champion. As champion, it’s your job to:
Gain consensus from the ESLint team on inclusion.
Guide the rule creation process until it’s complete (so only champion a rule that you have time to implement or help another contributor implement).
Once consensus has been reached on inclusion, add the “accepted” label. Optionally, add “help wanted” and “good first issue” labels, as necessary.
Consensus
Consensus is reached on issues when there are at least three team members who believe the change is a good idea and no one who believes the change is a bad idea. In order to indicate your support for an issue, leave a +1 reaction (thumbs up) on the original issue description in addition to any comments you might have.
When to Send to TSC
If consensus cannot be reached on an issue, or an issue’s progress has been stalled and it’s not clear if the issue should be closed, then you can refer the issue to the TSC for resolution. To do so, add the “tsc agenda” label to the issue and add a comment including the following information:
A one-paragraph summary of the discussion to this point. This should begin with “TSC Summary:”.
The question you would like the TSC to answer. This should begin with “TSC Question:”.
The issue will be discussed at the next TSC meeting and the resolution will be posted back to the issue.
Evaluating Core Features and Enhancements (TSC members only)
In addition to the above, changes to the core (including CLI changes) that would result in a minor or major version release must be approved by the TSC by standard TSC motion. Add the label “tsc agenda” to the issue and it will be discussed at the next TSC meeting. In general, requests should meet the following criteria to be considered:
The feature or enhancement is in scope for the project and should be added to the roadmap.
Someone is committed to including the change within the next year.
There is reasonable certainty about who will do the work.
When a suggestion is too ambitious or would take too much time to complete, it’s better not to accept the proposal. Stick to small, incremental changes and lay out a roadmap of where you’d like the project to go eventually. Don’t let the project get bogged down in big features that will take a long time to complete.
Breaking Changes: Be on the lookout for changes that would be breaking. Issues that represent breaking changes should be labeled as “breaking”.
Request Feedback from TSC
To request feedback from the TSC, team members can ping @eslint/eslint-tsc and add the label “tsc waiting” on an issue or pull request. Unless otherwise requested, every TSC member should provide feedback on issues labeled “tsc waiting”. If a TSC member is unable to respond in a timely manner, they should post a comment indicating when they expect to be able to leave their feedback. The last TSC member who provides feedback on an issue labeled “tsc waiting” should remove the label.
When to Close an Issue
All team members are allowed to close issues depending on how the issue has been resolved.
Team members may close an issue immediately if:
The issue is a duplicate of an existing issue.
The issue is just a question and has been answered.
Team members may close an issue where the consensus is to not accept the issue after a waiting period (to ensure that other team members have a chance to review the issue before it is closed):
Wait 2 days if the issue was opened Monday through Friday.
Wait 3 days if the issue was opened on Saturday or Sunday.
In an effort to keep the issues backlog manageable, team members may also close an issue if the following conditions are met:
Unaccepted: Close after it has been open for 21 days, as these issues do not have enough support to move forward.
Accepted: Close after 90 days if no one from the team or the community is willing to step forward and own the work to complete to it.
Help wanted: Close after 90 days if it has not been completed.


Review Pull Requests
Pull requests are submitted frequently and represent our best opportunity to interact with the community. As such, it’s important that pull requests are well-reviewed before being merged and that interactions on pull requests are positive.
Who Can Review Pull Requests?
Anyone, both team members and the public, may leave comments on pull requests.
Reviewing a Pull Request
When a pull request is opened, the bot will check the following:
Has the submitter signed a CLA?
Is the commit message summary in the correct format?
Is the commit summary too long?
The bot will add a comment specifying the problems that it finds. You do not need to look at the pull request any further until those problems have been addressed (there’s no need to comment on the pull request to ask the submitter to do what the bot asked - that’s why we have the bot!).
Once the bot checks have been satisfied, you check the following:
Double-check that the pull request title is correct based on the issue (or, if no issue is referenced, based on the stated problem).
If the pull request makes a change to core, ensure that an issue exists and the pull request references the issue in the commit message.
Does the code follow our conventions (including header comments, JSDoc comments, etc.)? If not, please leave that feedback and reference the Code Conventions documentation.
For code changes:
Are there tests that verify the change? If not, please ask for them.
Is documentation needed for the change? If yes, please ask the submitter to add the necessary documentation.
Are there any automated testing errors? If yes, please ask the submitter to check on them.
If you’ve reviewed the pull request and there are no outstanding issues, leave a comment “LGTM” to indicate your approval. If you would like someone else to verify the change, comment “LGTM but would like someone else to verify.”
Note: If you are a team member and you’ve left a comment on the pull request, please follow up to verify that your comments have been addressed.
Required Approvals for Pull Requests
Any committer, reviewer, or TSC member may approve a pull request, but the approvals required for merging differ based on the type of pull request.
One committer approval is required to merge a non-breaking change that is:
A documentation change
A bug fix (for either rules or core)
A dependency upgrade
Related to the build
A chore
For a non-breaking feature, pull requests require approval from one reviewer or TSC member, plus one additional approval from any other team member.
For a breaking change, pull requests require an approval from two TSC members.
Important
If you approve a pull request and don’t merge it, please leave a comment explaining why you didn’t merge it. You might say something like, “LGTM. Waiting three days before merging.” or “LGTM. Requires TSC member approval before merging.” or “LGTM. Would like another review before merging.”.
Moving a Pull Request Through the Triage Board
When a pull request is created, whether by a team member or an outside contributor, it is placed in the “Needs Triage” column of the Triage board automatically. The pull request should remain in that column until a team member begins reviewing it.
If the pull request does not have a related issue, then it should be moved through the normal triage process for issues to be marked as accepted. Once accepted, move the pull request to the “Implementing” column.
If the pull request does have a related issue, then:
If the issue is accepted, move the pull request to the “Implementing” column.
If the issue is not accepted, move the pull request to the “Evaluating” column until the issue is marked as accepted, at which point move the pull request to “Implementing”.
Once the pull request has one approval, one of three things can happen:
The pull request has the required approvals and the waiting period (see below) has passed so it can be merged.
The pull request has the required approvals and the waiting period has not passed, so it should be moved to the “Merge Candidates” column.
The pull request requires another approval before it can be merged, so it should be moved to the “Second Review Needed” column.
When the pull request has a second approval, it should either be merged (if 100% ready) or moved to the “Merge Candidates” column if there are any outstanding concerns that should be reviewed before the next release.
Who Can Merge a Pull Request
TSC members, reviewers, committers, and website team members may merge pull requests, depending on the contents of the pull request, once it has received the required approvals.
Website Team Members may merge a pull request in the eslint.org repository if it is:
A documentation change
A dependency upgrade
A chore
When to Merge a Pull Request
We use the “Merge” button to merge requests into the repository. Before merging a pull request, verify that:
All comments have been addressed.
Any team members who made comments have verified that their concerns were addressed.
All automated tests are passing (never merge a pull request with failing tests).
Be sure to say thank you to the submitter before merging, especially if they put a lot of work into the pull request.
Team members may merge a pull request immediately if it:
Makes a small documentation change.
Is a chore.
Fixes a block of other work on the repository (build-related, test-related, dependency-related, etc.).
Is an important fix to get into a patch release.
Otherwise, team members should observe a waiting period before merging a pull request:
Wait 2 days if the pull request was opened Monday through Friday.
Wait 3 days if the pull request was opened on Saturday or Sunday.
The waiting period ensures that other team members have a chance to review the pull request before it is merged.
Note: You should not merge your pull request unless you receive the required approvals.
When to Close a Pull Request
There are several times when it’s appropriate to close a pull request without merging:
The pull request addresses an issue that is already fixed.
The pull request hasn’t been updated in 17 days.
The pull request submitter isn’t willing to follow project guidelines.
In any of these cases, please be sure to leave a comment stating why the pull request is being closed.
Example Closing Comments
If a pull request hasn’t been updated in 17 days:
Closing because there hasn’t been activity for 17 days. If you’re still interested in submitting this code, please feel free to resubmit.
If a pull request submitter isn’t willing to follow project guidelines.
Unfortunately, we can’t accept pull requests that don’t follow our guidelines. I’m going to close this pull request now, but if you’d like to resubmit following our guidelines, we’ll be happy to review.
Edit this page
Table of Contents
Who Can Review Pull Requests?
Reviewing a Pull Request
Required Approvals for Pull Requests
Moving a Pull Request Through the Triage Board
Who Can Merge a Pull Request
When to Merge a Pull Request
When to Close a Pull Request
Example Closing Comments
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   
Manage Releases
Releases are when a project formally publishes a new version so the community can use it. There are two types of releases:
Regular releases that follow semantic versioning and are considered production-ready.
Prereleases that are not considered production-ready and are intended to give the community a preview of upcoming changes.
Release Manager
One member of the Technical Steering Committee (TSC) is assigned to manage each scheduled release. The release manager is determined at the TSC meeting the day before the release.
The release manager is responsible for:
The scheduled release on Friday.
Monitoring issues over the weekend.
Determining if a patch release is necessary on Monday.
Publishing the patch release (if necessary).
The release manager should seek input from the whole team on the Monday following a release to double-check if a patch release is necessary.
The release manager needs to have access to ESLint’s two-factor authentication for npm in order to do a release.
Release Communication
Each scheduled release is associated with an autogenerated release issue (example). The release issue is the source of information for the team about the status of a release and contains a checklist that the release manager should follow.
Process
On the day of a scheduled release, the release manager should follow the steps in the release issue.
All release-related communications occur in a thread in the #team channel on Discord.
On the Monday following the scheduled release, the release manager needs to determine if a patch release is necessary. A patch release is considered necessary if any of the following occurred since the scheduled release:
A regression bug is causing people’s lint builds to fail when it previously passed.
Any bug that is causing a lot of problems for users (frequently happens due to new functionality).
The patch release decision should be made as early on Monday as possible. If a patch release is necessary, then follow the same steps as the scheduled release process.
In rare cases, a second patch release might be necessary if the release is known to have a severe regression that hasn’t been fixed by Monday. If this occurs, the release manager should announce the situation on the release issue, and leave the issue open until all patch releases are complete. However, it’s usually better to fix bugs for the next release cycle rather than doing a second patch release.
After the patch release has been published (or no patch release is necessary), close the release issue and inform the team that they can start merging in semver-minor changes again.
Release Parameters
The following tables show examples of the option to select as RELEASE_TYPE when starting eslint-js Release (the @eslint/js package release) and eslint Release (the eslint package release) jobs on Jenkins to release a new version with the latest features. In both jobs, main should be selected as RELEASE_BRANCH.
HEAD Version
Desired Next Version
eslint-js Release
RELEASE_TYPE
9.25.0
9.25.1
patch
9.25.0
9.26.0
minor
9.25.0
10.0.0-alpha.0
alpha.0
10.0.0-alpha.0
10.0.0-alpha.1
alpha
10.0.0-alpha.1
10.0.0-beta.0
beta
10.0.0-beta.0
10.0.0-beta.1
beta
10.0.0-beta.1
10.0.0-rc.0
rc
10.0.0-rc.0
10.0.0-rc.1
rc
10.0.0-rc.1
10.0.0
major


HEAD Version
Desired Next Version
eslint Release
RELEASE_TYPE
9.25.0
9.25.1 or 9.26.0
latest
9.25.0
10.0.0-alpha.0
alpha
10.0.0-alpha.0
10.0.0-alpha.1
alpha
10.0.0-alpha.1
10.0.0-beta.0
beta
10.0.0-beta.0
10.0.0-beta.1
beta
10.0.0-beta.1
10.0.0-rc.0
rc
10.0.0-rc.0
10.0.0-rc.1
rc
10.0.0-rc.1
10.0.0
latest

When releasing a new version of the previous major line, the option to select as RELEASE_TYPE depends on whether the HEAD version is a prerelease or not. In both jobs, the corresponding development branch (for example, v9.x-dev) should be selected as RELEASE_BRANCH.
HEAD Version
Previous Major Line Version
Desired Next Version
eslint-js Release
RELEASE_TYPE
10.0.0-alpha.0
9.25.0
9.25.1
patch
10.0.0-alpha.0
9.25.0
9.26.0
minor
10.0.0
9.25.0
9.25.1
maintenance.patch
10.0.0
9.25.0
9.26.0
maintenance.minor


HEAD Version
Previous Major Line Version
Desired Next Version
eslint Release
RELEASE_TYPE
10.0.0-alpha.0
9.25.0
9.25.1 or 9.26.0
latest
10.0.0
9.25.0
9.25.1 or 9.26.0
maintenance

Emergency Releases
An emergency release is unplanned and isn’t the regularly scheduled release or the anticipated patch release.
In general, we try not to do emergency releases. Even if there is a regression, it’s best to wait until Monday to see if any other problems arise so a patch release can fix as many issues as possible.
The only real exception is if ESLint is completely unusable by most of the current users. For instance, we once pushed a release that errored for everyone because it was missing some core files. In that case, an emergency release is appropriate.
Troubleshooting
npm publish returns a 404
This typically happens due to a permission error related to the npm token.
release-please uses a granular access token that expires after a year. This token is tied to the eslintbot npm account and needs to be regenerated every year in March. If the access token is expired, npm publish returns a 404.
Jenkins uses a classic access token without an expiration date, but it does require a 2FA code to publish. If the 2FA code is incorrect, then npm publish returns a 404.
Edit this page
Table of Contents
Release Manager
Release Communication
Process
Release Parameters
Emergency Releases
Troubleshooting
npm publish returns a 404
© OpenJS Foundation and ESLint contributors, www.openjsf.org. Content licensed under MIT License.
Theme Switcher 
LightSystemDark
Selecting a language will take you to the ESLint website in that language.
Language
                                           🇺🇸 English (US)                 (Latest)                                                        🇨🇳 简体中文                 (最新)                                   


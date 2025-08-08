Introducing Zod 4
After a year of active development: Zod 4 is now stable! It's faster, slimmer, more tsc-efficient, and implements some long-requested features.
❤️
Huge thanks to Clerk, who supported my work on Zod 4 through their extremely generous OSS Fellowship. They were an amazing partner throughout the (much longer than anticipated!) development process.
Versioning
To upgrade:
npm upgrade zod@^4.0.0
For a complete list of breaking changes, refer to the Migration guide. This post focuses on new features & enhancements.
Why a new major version?
Zod v3.0 was released in May 2021 (!). Back then Zod had 2700 stars on GitHub and 600k weekly downloads. Today it has 37.8k stars and 31M weekly downloads (up from 23M when the beta came out 6 weeks ago!). After 24 minor versions, the Zod 3 codebase had hit a ceiling; the most commonly requested features and improvements require breaking changes.
Zod 4 fixes a number of long-standing design limitations of Zod 3 in one fell swoop, paving the way for several long-requested features and a huge leap in performance. It closes 9 of Zod's 10 most upvoted open issues. With luck, it will serve as the new foundation for many more years to come.
For a scannable breakdown of what's new, see the table of contents. Click on any item to jump to that section.
Benchmarks
You can run these benchmarks yourself in the Zod repo:
$ git clone git@github.com:colinhacks/zod.git$ cd zod$ git switch v4$ pnpm install
Then to run a particular benchmark:
$ pnpm bench <name>
14x faster string parsing
$ pnpm bench stringruntime: node v22.13.0 (arm64-darwin) benchmark      time (avg)             (min … max)       p75       p99      p999------------------------------------------------- -----------------------------• z.string().parse------------------------------------------------- -----------------------------zod3          363 µs/iter       (338 µs … 683 µs)    351 µs    467 µs    572 µszod4       24'674 ns/iter    (21'083 ns … 235 µs) 24'209 ns 76'125 ns    120 µs summary for z.string().parse  zod4   14.71x faster than zod3
7x faster array parsing
$ pnpm bench arrayruntime: node v22.13.0 (arm64-darwin) benchmark      time (avg)             (min … max)       p75       p99      p999------------------------------------------------- -----------------------------• z.array() parsing------------------------------------------------- -----------------------------zod3          147 µs/iter       (137 µs … 767 µs)    140 µs    246 µs    520 µszod4       19'817 ns/iter    (18'125 ns … 436 µs) 19'125 ns 44'500 ns    137 µs summary for z.array() parsing  zod4   7.43x faster than zod3
6.5x faster object parsing
This runs the Moltar validation library benchmark.
$ pnpm bench object-moltarbenchmark      time (avg)             (min … max)       p75       p99      p999------------------------------------------------- -----------------------------• z.object() safeParse------------------------------------------------- -----------------------------zod3          805 µs/iter     (771 µs … 2'802 µs)    804 µs    928 µs  2'802 µszod4          124 µs/iter     (118 µs … 1'236 µs)    119 µs    231 µs    329 µs summary for z.object() safeParse  zod4   6.5x faster than zod3
100x reduction in tsc instantiations
Consider the following simple file:
import * as z from "zod"; export const A = z.object({  a: z.string(),  b: z.string(),  c: z.string(),  d: z.string(),  e: z.string(),}); export const B = A.extend({  f: z.string(),  g: z.string(),  h: z.string(),});
Compiling this file with tsc --extendedDiagnostics using "zod/v3" results in >25000 type instantiations. With "zod/v4" it only results in ~175.
The Zod repo contains a tsc benchmarking playground. Try this for yourself using the compiler benchmarks in packages/tsc. The exact numbers may change as the implementation evolves.
$ cd packages/tsc$ pnpm bench object-with-extend
More importantly, Zod 4 has redesigned and simplified the generics of ZodObject and other schema classes to avoid some pernicious "instantiation explosions". For instance, chaining .extend() and .omit() repeatedly—something that previously caused compiler issues:
import * as z from "zod"; export const a = z.object({  a: z.string(),  b: z.string(),  c: z.string(),}); export const b = a.omit({  a: true,  b: true,  c: true,}); export const c = b.extend({  a: z.string(),  b: z.string(),  c: z.string(),}); export const d = c.omit({  a: true,  b: true,  c: true,}); export const e = d.extend({  a: z.string(),  b: z.string(),  c: z.string(),}); export const f = e.omit({  a: true,  b: true,  c: true,}); export const g = f.extend({  a: z.string(),  b: z.string(),  c: z.string(),}); export const h = g.omit({  a: true,  b: true,  c: true,}); export const i = h.extend({  a: z.string(),  b: z.string(),  c: z.string(),}); export const j = i.omit({  a: true,  b: true,  c: true,}); export const k = j.extend({  a: z.string(),  b: z.string(),  c: z.string(),}); export const l = k.omit({  a: true,  b: true,  c: true,}); export const m = l.extend({  a: z.string(),  b: z.string(),  c: z.string(),}); export const n = m.omit({  a: true,  b: true,  c: true,}); export const o = n.extend({  a: z.string(),  b: z.string(),  c: z.string(),}); export const p = o.omit({  a: true,  b: true,  c: true,}); export const q = p.extend({  a: z.string(),  b: z.string(),  c: z.string(),});
In Zod 3, this took 4000ms to compile; and adding additional calls to .extend() would trigger a "Possibly infinite" error. In Zod 4, this compiles in 400ms, 10x faster.
Coupled with the upcoming tsgo compiler, Zod 4's editor performance will scale to vastly larger schemas and codebases.
2x reduction in core bundle size
Consider the following simple script.
import * as z from "zod"; const schema = z.boolean(); schema.parse(true);
It's about as simple as it gets when it comes to validation. That's intentional; it's a good way to measure the core bundle size—the code that will end up in the bundle even in simple cases. We'll bundle this with rollup using both Zod 3 and Zod 4 and compare the final bundles.
Package
Bundle (gzip)
Zod 3
12.47kb
Zod 4
5.36kb

The core bundle is ~57% smaller in Zod 4 (2.3x). That's good! But we can do a lot better.
Introducing Zod Mini
Zod's method-heavy API is fundamentally difficult to tree-shake. Even our simple z.boolean() script pulls in the implementations of a bunch of methods we didn't use, like .optional(), .array(), etc. Writing slimmer implementations can only get you so far. That's where Zod Mini comes in.
npm install zod@^3.25.0
It's a Zod variant with a functional, tree-shakable API that corresponds one-to-one with zod. Where Zod uses methods, Zod Mini generally uses wrapper functions:
Zod MiniZod
import * as z from "zod/mini"; z.optional(z.string()); z.union([z.string(), z.number()]); z.extend(z.object({ /* ... */ }), { age: z.number() });
Not all methods are gone! The parsing methods are identical in Zod and Zod Mini:
import * as z from "zod/mini"; z.string().parse("asdf");z.string().safeParse("asdf");await z.string().parseAsync("asdf");await z.string().safeParseAsync("asdf");
There's also a general-purpose .check() method used to add refinements.
Zod MiniZod
import * as z from "zod/mini"; z.array(z.number()).check(  z.minLength(5),  z.maxLength(10),  z.refine(arr => arr.includes(5)));
The following top-level refinements are available in Zod Mini. It should be fairly self-explanatory which Zod methods they correspond to.
import * as z from "zod/mini"; // custom checksz.refine(); // first-class checksz.lt(value);z.lte(value); // alias: z.maximum()z.gt(value);z.gte(value); // alias: z.minimum()z.positive();z.negative();z.nonpositive();z.nonnegative();z.multipleOf(value);z.maxSize(value);z.minSize(value);z.size(value);z.maxLength(value);z.minLength(value);z.length(value);z.regex(regex);z.lowercase();z.uppercase();z.includes(value);z.startsWith(value);z.endsWith(value);z.property(key, schema); // for object schemas; check `input[key]` against `schema`z.mime(value); // for file schemas (see below) // overwrites (these *do not* change the inferred type!)z.overwrite(value => newValue);z.normalize();z.trim();z.toLowerCase();z.toUpperCase();
This more functional API makes it easier for bundlers to tree-shake the APIs you don't use. While regular Zod is still recommended for the majority of use cases, any projects with uncommonly strict bundle size constraints should consider Zod Mini.
6.6x reduction in core bundle size
Here's the script from above, updated to use "zod/mini" instead of "zod".
import * as z from "zod/mini"; const schema = z.boolean();schema.parse(false);
When we build this with rollup, the gzipped bundle size is 1.88kb. That's an 85% (6.6x) reduction in core bundle size compared to zod@3.
Package
Bundle (gzip)
Zod 3
12.47kb
Zod 4 (regular)
5.36kb
Zod 4 (mini)
1.88kb

Learn more on the dedicated zod/mini docs page. Complete API details are mixed into existing documentation pages; code blocks contain separate tabs for "Zod" and "Zod Mini" wherever their APIs diverge.
Metadata
Zod 4 introduces a new system for adding strongly-typed metadata to your schemas. Metadata isn't stored inside the schema itself; instead it's stored in a "schema registry" that associates a schema with some typed metadata. To create a registry with z.registry():
import * as z from "zod"; const myRegistry = z.registry<{ title: string; description: string }>();
To add schemas to your registry:
const emailSchema = z.string().email(); myRegistry.add(emailSchema, { title: "Email address", description: "..." });myRegistry.get(emailSchema);// => { title: "Email address", ... }
Alternatively, you can use the .register() method on a schema for convenience:
emailSchema.register(myRegistry, { title: "Email address", description: "..." })// => returns emailSchema
The global registry
Zod also exports a global registry z.globalRegistry that accepts some common JSON Schema-compatible metadata:
z.globalRegistry.add(z.string(), {  id: "email_address",  title: "Email address",  description: "Provide your email",  examples: ["naomie@example.com"],  extraKey: "Additional properties are also allowed"});
.meta()
To conveniently add a schema to z.globalRegistry, use the .meta() method.
z.string().meta({  id: "email_address",  title: "Email address",  description: "Provide your email",  examples: ["naomie@example.com"],  // ...});
For compatibility with Zod 3, .describe() is still available, but .meta() is preferred.
z.string().describe("An email address"); // equivalent toz.string().meta({ description: "An email address" });
JSON Schema conversion
Zod 4 introduces first-party JSON Schema conversion via z.toJSONSchema().
import * as z from "zod"; const mySchema = z.object({name: z.string(), points: z.number()}); z.toJSONSchema(mySchema);// => {//   type: "object",//   properties: {//     name: {type: "string"},//     points: {type: "number"},//   },//   required: ["name", "points"],// }
Any metadata in z.globalRegistry is automatically included in the JSON Schema output.
const mySchema = z.object({  firstName: z.string().describe("Your first name"),  lastName: z.string().meta({ title: "last_name" }),  age: z.number().meta({ examples: [12, 99] }),}); z.toJSONSchema(mySchema);// => {//   type: 'object',//   properties: {//     firstName: { type: 'string', description: 'Your first name' },//     lastName: { type: 'string', title: 'last_name' },//     age: { type: 'number', examples: [ 12, 99 ] }//   },//   required: [ 'firstName', 'lastName', 'age' ]// }
Refer to the JSON Schema docs for information on customizing the generated JSON Schema.
Recursive objects
This was an unexpected one. After years of trying to crack this problem, I finally found a way to properly infer recursive object types in Zod. To define a recursive type:
const Category = z.object({  name: z.string(),  get subcategories(){    return z.array(Category)  }}); type Category = z.infer<typeof Category>;// { name: string; subcategories: Category[] }
You can also represent mutually recursive types:
const User = z.object({  email: z.email(),  get posts(){    return z.array(Post)  }}); const Post = z.object({  title: z.string(),  get author(){    return User  }});
Unlike the Zod 3 pattern for recursive types, there's no type casting required. The resulting schemas are plain ZodObject instances and have the full set of methods available.
Post.pick({ title: true })Post.partial();Post.extend({ publishDate: z.date() });
File schemas
To validate File instances:
const fileSchema = z.file(); fileSchema.min(10_000); // minimum .size (bytes)fileSchema.max(1_000_000); // maximum .size (bytes)fileSchema.mime(["image/png"]); // MIME type
Internationalization
Zod 4 introduces a new locales API for globally translating error messages into different languages.
import * as z from "zod"; // configure English locale (default)z.config(z.locales.en());
At the time of this writing only the English locale is available; There will be a call for pull request from the community shortly; this section will be updated with a list of supported languages as they become available.
Error pretty-printing
The popularity of the zod-validation-error package demonstrates that there's significant demand for an official API for pretty-printing errors. If you are using that package currently, by all means continue using it.
Zod now implements a top-level z.prettifyError function for converting a ZodError to a user-friendly formatted string.
const myError = new z.ZodError([  {    code: 'unrecognized_keys',    keys: [ 'extraField' ],    path: [],    message: 'Unrecognized key: "extraField"'  },  {    expected: 'string',    code: 'invalid_type',    path: [ 'username' ],    message: 'Invalid input: expected string, received number'  },  {    origin: 'number',    code: 'too_small',    minimum: 0,    inclusive: true,    path: [ 'favoriteNumbers', 1 ],    message: 'Too small: expected number to be >=0'  }]); z.prettifyError(myError);
This returns the following pretty-printable multi-line string:
✖ Unrecognized key: "extraField"✖ Invalid input: expected string, received number  → at username✖ Invalid input: expected number, received string  → at favoriteNumbers[1]
Currently the formatting isn't configurable; this may change in the future.
Top-level string formats
All "string formats" (email, etc.) have been promoted to top-level functions on the z module. This is both more concise and more tree-shakable. The method equivalents (z.string().email(), etc.) are still available but have been deprecated. They'll be removed in the next major version.
z.email();z.uuidv4();z.uuidv7();z.uuidv8();z.ipv4();z.ipv6();z.cidrv4();z.cidrv6();z.url();z.e164();z.base64();z.base64url();z.jwt();z.ascii();z.utf8();z.lowercase();z.iso.date();z.iso.datetime();z.iso.duration();z.iso.time();
Custom email regex
The z.email() API now supports a custom regular expression. There is no one canonical email regex; different applications may choose to be more or less strict. For convenience Zod exports some common ones.
// Zod's default email regex (Gmail rules)// see colinhacks.com/essays/reasonable-email-regexz.email(); // z.regexes.email // the regex used by browsers to validate input[type=email] fields// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/emailz.email({ pattern: z.regexes.html5Email }); // the classic emailregex.com regex (RFC 5322)z.email({ pattern: z.regexes.rfc5322Email }); // a loose regex that allows Unicode (good for intl emails)z.email({ pattern: z.regexes.unicodeEmail });
Template literal types
Zod 4 implements z.templateLiteral(). Template literal types are perhaps the biggest feature of TypeScript's type system that wasn't previously representable.
const hello = z.templateLiteral(["hello, ", z.string()]);// `hello, ${string}` const cssUnits = z.enum(["px", "em", "rem", "%"]);const css = z.templateLiteral([z.number(), cssUnits]);// `${number}px` | `${number}em` | `${number}rem` | `${number}%` const email = z.templateLiteral([  z.string().min(1),  "@",  z.string().max(64),]);// `${string}@${string}` (the min/max refinements are enforced!)
Every Zod schema type that can be stringified stores an internal regex: strings, string formats like z.email(), numbers, boolean, bigint, enums, literals, undefined/optional, null/nullable, and other template literals. The z.templateLiteral constructor concatenates these into a super-regex, so things like string formats (z.email()) are properly enforced (but custom refinements are not!).
Read the template literal docs for more info.
Number formats
New numeric "formats" have been added for representing fixed-width integer and float types. These return a ZodNumber instance with proper minimum/maximum constraints already added.
z.int();      // [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],z.float32();  // [-3.4028234663852886e38, 3.4028234663852886e38]z.float64();  // [-1.7976931348623157e308, 1.7976931348623157e308]z.int32();    // [-2147483648, 2147483647]z.uint32();   // [0, 4294967295]
Similarly the following bigint numeric formats have also been added. These integer types exceed what can be safely represented by a number in JavaScript, so these return a ZodBigInt instance with the proper minimum/maximum constraints already added.
z.int64();    // [-9223372036854775808n, 9223372036854775807n]z.uint64();   // [0n, 18446744073709551615n]
Stringbool
The existing z.coerce.boolean() API is very simple: falsy values (false, undefined, null, 0, "", NaN etc) become false, truthy values become true.
This is still a good API, and its behavior aligns with the other z.coerce APIs. But some users requested a more sophisticated "env-style" boolean coercion. To support this, Zod 4 introduces z.stringbool():
const strbool = z.stringbool(); strbool.parse("true")         // => truestrbool.parse("1")            // => truestrbool.parse("yes")          // => truestrbool.parse("on")           // => truestrbool.parse("y")            // => truestrbool.parse("enabled")      // => true strbool.parse("false");       // => falsestrbool.parse("0");           // => falsestrbool.parse("no");          // => falsestrbool.parse("off");         // => falsestrbool.parse("n");           // => falsestrbool.parse("disabled");    // => false strbool.parse(/* anything else */); // ZodError<[{ code: "invalid_value" }]>
To customize the truthy and falsy values:
z.stringbool({  truthy: ["yes", "true"],  falsy: ["no", "false"]})
Refer to the z.stringbool() docs for more information.
Simplified error customization
The majority of breaking changes in Zod 4 involve the error customization APIs. They were a bit of a mess in Zod 3; Zod 4 makes things significantly more elegant, to the point where I think it's worth highlighting here.
Long story short, there is now a single, unified error parameter for customizing errors, replacing the following APIs:
Replace message with error. (The message parameter is still supported but deprecated.)
- z.string().min(5, { message: "Too short." });+ z.string().min(5, { error: "Too short." });
Replace invalid_type_error and required_error with error (function syntax):
// Zod 3- z.string({ -   required_error: "This field is required" -   invalid_type_error: "Not a string", - }); // Zod 4 + z.string({ error: (issue) => issue.input === undefined ? +  "This field is required" :+  "Not a string" + });
Replace errorMap with error (function syntax):
// Zod 3 - z.string({-   errorMap: (issue, ctx) => {-     if (issue.code === "too_small") {-       return { message: `Value must be >${issue.minimum}` };-     }-     return { message: ctx.defaultError };-   },- }); // Zod 4+ z.string({+   error: (issue) => {+     if (issue.code === "too_small") {+       return `Value must be >${issue.minimum}`+     }+   },+ });
Upgraded z.discriminatedUnion()
Discriminated unions now support a number of schema types not previously supported, including unions and pipes:
const MyResult = z.discriminatedUnion("status", [  // simple literal  z.object({ status: z.literal("aaa"), data: z.string() }),  // union discriminator  z.object({ status: z.union([z.literal("bbb"), z.literal("ccc")]) }),  // pipe discriminator  z.object({ status: z.literal("fail").transform(val => val.toUpperCase()) }),]);
Perhaps most importantly, discriminated unions now compose—you can use one discriminated union as a member of another.
const BaseError = z.object({ status: z.literal("failed"), message: z.string() }); const MyResult = z.discriminatedUnion("status", [  z.object({ status: z.literal("success"), data: z.string() }),  z.discriminatedUnion("code", [    BaseError.extend({ code: z.literal(400) }),    BaseError.extend({ code: z.literal(401) }),    BaseError.extend({ code: z.literal(500) })  ])]);
Multiple values in z.literal()
The z.literal() API now optionally supports multiple values.
const httpCodes = z.literal([ 200, 201, 202, 204, 206, 207, 208, 226 ]); // previously in Zod 3:const httpCodes = z.union([  z.literal(200),  z.literal(201),  z.literal(202),  z.literal(204),  z.literal(206),  z.literal(207),  z.literal(208),  z.literal(226)]);
Refinements live inside schemas
In Zod 3, they were stored in a ZodEffects class that wrapped the original schema. This was inconvenient, as it meant you couldn't interleave .refine() with other schema methods like .min().
z.string()  .refine(val => val.includes("@"))  .min(5);// ^ ❌ Property 'min' does not exist on type ZodEffects<ZodString, string, string>
In Zod 4, refinements are stored inside the schemas themselves, so the code above works as expected.
z.string()  .refine(val => val.includes("@"))  .min(5); // ✅
.overwrite()
The .transform() method is extremely useful, but it has one major downside: the output type is no longer introspectable at runtime. The transform function is a black box that can return anything. This means (among other things) there's no sound way to convert the schema to JSON Schema.
const Squared = z.number().transform(val => val ** 2);// => ZodPipe<ZodNumber, ZodTransform>
Zod 4 introduces a new .overwrite() method for representing transforms that don't change the inferred type. Unlike .transform(), this method returns an instance of the original class. The overwrite function is stored as a refinement, so it doesn't (and can't) modify the inferred type.
z.number().overwrite(val => val ** 2).max(100);// => ZodNumber
The existing .trim(), .toLowerCase() and .toUpperCase() methods have been reimplemented using .overwrite().
An extensible foundation: zod/v4/core
While this will not be relevant to the majority of Zod users, it's worth highlighting. The addition of Zod Mini necessitated the creation of a shared sub-package zod/v4/core which contains the core functionality shared between Zod and Zod Mini.
I was resistant to this at first, but now I see it as one of Zod 4's most important features. It lets Zod level up from a simple library to a fast validation "substrate" that can be sprinkled into other libraries.
If you're building a schema library, refer to the implementations of Zod and Zod Mini to see how to build on top of the foundation zod/v4/core provides. Don't hesitate to get in touch in GitHub discussions or via X/Bluesky for help or feedback.
Wrapping up
I'm planning to write up a series of additional posts explaining the design process behind some major features like Zod Mini. I'll update this section as those get posted.
For library authors, there is now a dedicated For library authors guide that describes the best practices for building on top of Zod. It answers common questions about how to support Zod 3 & Zod 4 (including Mini) simultaneously.
pnpm upgrade zod@latest
Happy parsing!
— Colin McDonnell @colinhacks
Edit on GitHub
Next
Migration guide
On this page
Versioning
Why a new major version?
Benchmarks
14x faster string parsing
7x faster array parsing
6.5x faster object parsing
100x reduction in tsc instantiations
2x reduction in core bundle size
Introducing Zod Mini
6.6x reduction in core bundle size
Metadata
The global registry
.meta()
JSON Schema conversion
Recursive objects
File schemas
Internationalization
Error pretty-printing
Top-level string formats
Custom email regex
Template literal types
Number formats
Stringbool
Simplified error customization
Upgraded z.discriminatedUnion()
Multiple values in z.literal()
Refinements live inside schemas
.overwrite()
An extensible foundation: zod/v4/core
Wrapping up

Versioning
Update — July 8th, 2025
zod@4.0.0 has been published to npm. The package root ("zod") now exports Zod 4. All other subpaths have not changed and will remain available forever.
To upgrade to Zod 4:
npm upgrade zod@^4.0.0
If you are using Zod 4, your existing imports ("zod/v4" and "zod/v4-mini") will continue to work forever. However, after upgrading, you can optionally rewrite your imports as follows:


Before
After
Zod 4
"zod/v4"
"zod"
Zod 4 Mini
"zod/v4-mini"
"zod/mini"
Zod 3
"zod"
"zod/v3"

Library authors — if you've already implemented Zod 4 support according to the best practices outlined in the Library authors guide, bump your peer dependency to include zod@^4.0.0:
// package.json{  "peerDependencies": {    "zod": "^3.25.0 || ^4.0.0"  }}
There should be no other code changes necessary. No code changes were made between the latest 3.25.x release and 4.0.0. This does not require a major version bump.
Some notes on subpath versioning
Versioning in Zod 4
This is a writeup of Zod 4's approach to versioning, with the goal of making it easier for users and Zod's ecosystem of associated libraries to migrate to Zod 4.
The general approach:
Zod 4 will not initially be published as zod@4.0.0 on npm. Instead it will be exported at a subpath ("zod/v4") alongside zod@3.25.0
Despite this, Zod 4 is considered stable and production-ready
Zod 3 will continue to be exported from the package root ("zod") as well as a new subpath "zod/v3". It will continue to receive bug fixes & stability improvements.
This approach is analogous to how Golang handles major version changes: https://go.dev/doc/modules/major-version
Sometime later:
The package root ("zod") will switch over from exporting Zod 3 to Zod 4
At this point zod@4.0.0 will get published to npm
The "zod/v4" subpath will remain available forever
Why?
Zod occupies a unique place in the ecosystem. Many libraries/frameworks in the ecosystem accept user-defined Zod schemas. This means their user-facing API is strongly coupled to Zod and its various classes/interfaces/utilities. For these libraries/frameworks, a breaking change to Zod necessarily causes a breaking change for their users. A Zod 3 ZodType is not assignable to a Zod 4 ZodType.
Why can't libraries just support v3 and v4 simultaneously?
Unfortunately the limitations of peerDependencies (and inconsistencies between package managers) make it extremely difficult to elegantly support two major versions of one library simultaneously.
If I naively published zod@4.0.0 to npm, the vast majority of the libraries in Zod's ecosystem would need to publish a new major version to properly support Zod 4, include some high-profile libraries like the AI SDK. It would trigger a "version bump avalanche" across the ecosystem and generally create a huge amount of frustration and work.
With subpath versioning, we solve this problem. it provides a straightforward way for libraries to support Zod 3 and Zod 4 (including Zod Mini) simultaneously. They can continue defining a single peerDependency on "zod"; no need for more arcane solutions like npm aliases, optional peer dependencies, a "zod-compat" package, or other such hacks.
Libraries will need to bump the minimum version of their "zod" peer dependency to zod@^3.25.0. They can then reference both Zod 3 and Zod 4 in their implementation:
import * as z3 from "zod/v3"import * as z4 from "zod/v4"
Later, once there's broad support for v4, we'll bump the major version on npm and start exporting Zod 4 from the package root, completing the transition. (This has now happened—see the note at the top of this page.)
As long as libraries are importing exclusively from the associated subpaths (not the root), their implementations will continue to work across the major version bump without code changes.
While it may seem unorthodox (at least for people who don't use Go!), this is the only approach I'm aware of that enables a clean, incremental migration path for both Zod's users and the libraries in the broader ecosystem.

A deeper dive into why peer dependencies don't work in this situation.
Imagine you're a library trying to build a function acceptSchema that accepts a Zod schema. You want to be able to accept Zod 3 or Zod 4 schemas. In this hypothetical, I'm imagine Zod 4 was published as zod@4 on npm, no subpaths. Here are your options:
Install both zod@3 and zod@4 as dependencies simultaneously using npm aliases. This works but you end up including your own copies of both Zod 3 and Zod 4. You have no guarantee that your user's Zod schemas are instances of the same z.ZodType class you're pulling from dependencies (instanceof checks will probably fail).
Use a peer dependency that spans multiple major versions: "zod@>=3.0.0" …but when developing a library you’d still need to pick a version to develop against. Usually you'd install this as a dev dependency. The onus is on you to painstakingly ensure your code works, character-for-character, across both versions. This is impossible in the case of Zod 3 & Zod 4 because a number of very fundamental classes have simplified/different generics.
Optional peer dependencies. i just couldn't find a straight answer about how to reliably determine which peer dep is installed at runtime across all platforms. Many answers online will say "use dynamic imports in a try/catch to check it a package exists". Those folks are assuming you're on the backend because no frontend bundlers have no affordance for this. They'll fail when you try to bundle a dependency that isn't installed. Obviuosly it doesn't matter if you're inside a try/catch during a build step. Also: since we're talking about multiple versions of the same library, you'd need to use npm aliases to differentiate the two versions in your package.json. Versions of npm as recent as v10 cannot handle the combination of peer dependencies + npm aliases.
zod-compat. This extremely hand-wavy solution you see online is "define interfaces for each version that represents some basic functionality". Basically some utility types libraries can use to approximate the real deal. This is error prone, a ton of work, needs to be kept synchronized with the real implementations, and ultimately libraries are developing against a shadow version of your library that probably lacks detail. It also only works for types: if a library depends on any runtime code in Zod it falls apart.
Hence, subpaths.
Edit on GitHub
Next
Migration guide
Next
Intro
On this page
Update — July 8th, 2025
Versioning in Zod 4
Why?
Why can't libraries just support v3 and v4 simultaneously?
Zod
TypeScript-first schema validation with static type inference
by @colinhacks


Website  •  Discord  •  𝕏  •  Bluesky

Zod 4 is now stable! Read the release notes here.



Featured sponsor: Jazz

Interested in featuring? Get in touch.
Introduction
Zod is a TypeScript-first validation library. Using Zod, you can define schemas you can use to validate data, from a simple string to a complex nested object.
import * as z from "zod"; const User = z.object({  name: z.string(),}); // some untrusted data...const input = { /* stuff */ }; // the parsed result is validated and type safe!const data = User.parse(input); // so you can use it with confidence :)console.log(data.name);
Features
Zero external dependencies
Works in Node.js and all modern browsers
Tiny: 2kb core bundle (gzipped)
Immutable API: methods return a new instance
Concise interface
Works with TypeScript and plain JS
Built-in JSON Schema conversion
Extensive ecosystem
Installation
npm install zod       # npmdeno add npm:zod      # denoyarn add zod          # yarnbun add zod           # bunpnpm add zod          # pnpm
Zod also publishes a canary version on every commit. To install the canary:
npm install zod@canary       # npmdeno add npm:zod@canary      # denoyarn add zod@canary          # yarnbun add zod@canary           # bunpnpm add zod@canary          # pnpm
Requirements
Zod is tested against TypeScript v5.5 and later. Older versions may work but are not officially supported.
"strict"
You must enable strict mode in your tsconfig.json. This is a best practice for all TypeScript projects.
// tsconfig.json{  // ...  "compilerOptions": {    // ...    "strict": true  }}
"moduleResolution"
Your "moduleResolution" should be set to one of the following. The legacy "node" and "classic" modes are not supported, as they do not support subpath imports.
"node16" (default if "module" is set to "node16"/"node18")
"nodenext" (default if "module" is set to "nodenext")
"bundler"

Ecosystem
Zod has a thriving ecosystem of libraries, tools, and integrations. Refer to the Ecosystem page for a complete list of libraries that support Zod or are built on top of it.
Resources
API Libraries
Form Integrations
Zod to X
X to Zod
Mocking Libraries
Powered by Zod
I also contribute to the following projects, which I'd like to highlight:
tRPC - End-to-end typesafe APIs, with support for Zod schemas
React Hook Form - Hook-based form validation with a Zod resolver
zshy - Originally created as Zod's internal build tool. Bundler-free, batteries-included build tool for TypeScript libraries. Powered by tsc.
Basic usage
This page will walk you through the basics of creating schemas, parsing data, and using inferred types. For complete documentation on Zod's schema API, refer to Defining schemas.
Defining a schema
Before you can do anything else, you need to define a schema. For the purposes of this guide, we'll use a simple object schema.
ZodZod Mini
import * as z from "zod"; const Player = z.object({  username: z.string(),  xp: z.number()});
Parsing data
Given any Zod schema, use .parse to validate an input. If it's valid, Zod returns a strongly-typed deep clone of the input.
Player.parse({ username: "billie", xp: 100 }); // => returns { username: "billie", xp: 100 }
Note — If your schema uses certain asynchronous APIs like async refinements or transforms, you'll need to use the .parseAsync() method instead.
await Player.parseAsync({ username: "billie", xp: 100 });
Handling errors
When validation fails, the .parse() method will throw a ZodError instance with granular information about the validation issues.
ZodZod Mini
try {  Player.parse({ username: 42, xp: "100" });} catch(error){  if(error instanceof z.ZodError){    error.issues;    /* [      {        expected: 'string',        code: 'invalid_type',        path: [ 'username' ],        message: 'Invalid input: expected string'      },      {        expected: 'number',        code: 'invalid_type',        path: [ 'xp' ],        message: 'Invalid input: expected number'      }    ] */  }}
To avoid a try/catch block, you can use the .safeParse() method to get back a plain result object containing either the successfully parsed data or a ZodError. The result type is a discriminated union, so you can handle both cases conveniently.
const result = Player.safeParse({ username: 42, xp: "100" });if (!result.success) {  result.error;   // ZodError instance} else {  result.data;    // { username: string; xp: number }}
Note — If your schema uses certain asynchronous APIs like async refinements or transforms, you'll need to use the .safeParseAsync() method instead.
await schema.safeParseAsync("hello");
Inferring types
Zod infers a static type from your schema definitions. You can extract this type with the z.infer<> utility and use it however you like.
const Player = z.object({  username: z.string(),  xp: z.number()}); // extract the inferred typetype Player = z.infer<typeof Player>; // use it in your codeconst player: Player = { username: "billie", xp: 100 };
In some cases, the input & output types of a schema can diverge. For instance, the .transform() API can convert the input from one type to another. In these cases, you can extract the input and output types independently:
const mySchema = z.string().transform((val) => val.length); type MySchemaIn = z.input<typeof mySchema>;// => string type MySchemaOut = z.output<typeof mySchema>; // equivalent to z.infer<typeof mySchema>// number

Now that we have the basics covered, let's jump into the Schema API.
Edit on GitHub
Next
Intro
Next
Defining schemas
On this page
Defining a schema
Parsing data
Handling errors
Inferring types

Defining schemas
To validate data, you must first define a schema. Schemas represent types, from simple primitive values to complex nested objects and arrays.
Primitives
import * as z from "zod"; // primitive typesz.string();z.number();z.bigint();z.boolean();z.symbol();z.undefined();z.null();
Coercion
To coerce input data to the appropriate type, use z.coerce instead:
z.coerce.string();    // String(input)z.coerce.number();    // Number(input)z.coerce.boolean();   // Boolean(input)z.coerce.bigint();    // BigInt(input)
The coerced variant of these schemas attempts to convert the input value to the appropriate type.
const schema = z.coerce.string(); schema.parse("tuna");    // => "tuna"schema.parse(42);        // => "42"schema.parse(true);      // => "true"schema.parse(null);      // => "null"
How coercion works in Zod
Literals
Literal schemas represent a literal type, like "hello world" or 5.
const tuna = z.literal("tuna");const twelve = z.literal(12);const twobig = z.literal(2n);const tru = z.literal(true);
To represent the JavaScript literals null and undefined:
z.null();z.undefined();z.void(); // equivalent to z.undefined()
To allow multiple literal values:
const colors = z.literal(["red", "green", "blue"]); colors.parse("green"); // ✅colors.parse("yellow"); // ❌
To extract the set of allowed values from a literal schema:
ZodZod Mini
colors.values; // => Set<"red" | "green" | "blue">
Strings
Zod provides a handful of built-in string validation and transform APIs. To perform some common string validations:
ZodZod Mini
z.string().max(5);z.string().min(5);z.string().length(5);z.string().regex(/^[a-z]+$/);z.string().startsWith("aaa");z.string().endsWith("zzz");z.string().includes("---");z.string().uppercase();z.string().lowercase();
To perform some simple string transforms:
ZodZod Mini
z.string().trim(); // trim whitespacez.string().toLowerCase(); // toLowerCasez.string().toUpperCase(); // toUpperCase
String formats
To validate against some common string formats:
z.email();z.uuid();z.url();z.emoji();         // validates a single emoji characterz.base64();z.base64url();z.nanoid();z.cuid();z.cuid2();z.ulid();z.ipv4();z.ipv6();z.cidrv4();        // ipv4 CIDR blockz.cidrv6();        // ipv6 CIDR blockz.iso.date();z.iso.time();z.iso.datetime();z.iso.duration();
Emails
To validate email addresses:
z.email();
By default, Zod uses a comparatively strict email regex designed to validate normal email addresses containing common characters. It's roughly equivalent to the rules enforced by Gmail. To learn more about this regex, refer to this post.
/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i
To customize the email validation behavior, you can pass a custom regular expression to the pattern param.
z.email({ pattern: /your regex here/ });
Zod exports several useful regexes you could use.
// Zod's default email regexz.email();z.email({ pattern: z.regexes.email }); // equivalent // the regex used by browsers to validate input[type=email] fields// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/emailz.email({ pattern: z.regexes.html5Email }); // the classic emailregex.com regex (RFC 5322)z.email({ pattern: z.regexes.rfc5322Email }); // a loose regex that allows Unicode (good for intl emails)z.email({ pattern: z.regexes.unicodeEmail });
UUIDs
To validate UUIDs:
z.uuid();
To specify a particular UUID version:
// supports "v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8"z.uuid({ version: "v4" }); // for conveniencez.uuidv4();z.uuidv6();z.uuidv7();
The RFC 9562/4122 UUID spec requires the first two bits of byte 8 to be 10. Other UUID-like identifiers do not enforce this constraint. To validate any UUID-like identifier:
z.guid();
URLs
To validate any WHATWG-compatible URL:
const schema = z.url(); schema.parse("https://example.com"); // ✅schema.parse("http://localhost"); // ✅schema.parse("mailto:noreply@zod.dev"); // ✅schema.parse("sup"); // ✅
As you can see this is quite permissive. Internally this uses the new URL() constructor to validate inputs; this behavior may differ across platforms and runtimes but it's the mostly rigorous way to validate URIs/URLs on any given JS runtime/engine.
To validate the hostname against a specific regex:
const schema = z.url({ hostname: /^example\.com$/ }); schema.parse("https://example.com"); // ✅schema.parse("https://zombo.com"); // ❌
To validate the protocol against a specific regex, use the protocol param.
const schema = z.url({ protocol: /^https$/ }); schema.parse("https://example.com"); // ✅schema.parse("http://example.com"); // ❌
Web URLs — In many cases, you'll want to validate Web URLs specifically. Here's the recommended schema for doing so:
const httpUrl = z.url({  protocol: /^https?$/,  hostname: z.regexes.domain});
This restricts the protocol to http/https and ensures the hostname is a valid domain name with the z.regexes.domain regular expression:
/^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
ISO datetimes
As you may have noticed, Zod string includes a few date/time related validations. These validations are regular expression based, so they are not as strict as a full date/time library. However, they are very convenient for validating user input.
The z.iso.datetime() method enforces ISO 8601; by default, no timezone offsets are allowed:
const datetime = z.iso.datetime(); datetime.parse("2020-01-01T06:15:00Z"); // ✅datetime.parse("2020-01-01T06:15:00.123Z"); // ✅datetime.parse("2020-01-01T06:15:00.123456Z"); // ✅ (arbitrary precision)datetime.parse("2020-01-01T06:15:00+02:00"); // ❌ (offsets not allowed)datetime.parse("2020-01-01T06:15:00"); // ❌ (local not allowed)
To allow timezone offsets:
const datetime = z.iso.datetime({ offset: true }); // allows timezone offsetsdatetime.parse("2020-01-01T06:15:00+02:00"); // ✅ // basic offsets not alloweddatetime.parse("2020-01-01T06:15:00+02");    // ❌datetime.parse("2020-01-01T06:15:00+0200");  // ❌ // Z is still supporteddatetime.parse("2020-01-01T06:15:00Z"); // ✅
To allow unqualified (timezone-less) datetimes:
const schema = z.iso.datetime({ local: true });schema.parse("2020-01-01T06:15:01"); // ✅schema.parse("2020-01-01T06:15"); // ✅ seconds optional
To constrain the allowable time precision. By default, seconds are optional and arbitrary sub-second precision is allowed.
const a = z.iso.datetime();a.parse("2020-01-01T06:15Z"); // ✅a.parse("2020-01-01T06:15:00Z"); // ✅a.parse("2020-01-01T06:15:00.123Z"); // ✅ const b = z.iso.datetime({ precision: -1 }); // minute precision (no seconds)b.parse("2020-01-01T06:15Z"); // ✅b.parse("2020-01-01T06:15:00Z"); // ❌b.parse("2020-01-01T06:15:00.123Z"); // ❌ const c = z.iso.datetime({ precision: 0 }); // second precision onlyc.parse("2020-01-01T06:15Z"); // ❌c.parse("2020-01-01T06:15:00Z"); // ✅c.parse("2020-01-01T06:15:00.123Z"); // ❌ const d = z.iso.datetime({ precision: 3 }); // millisecond precision onlyd.parse("2020-01-01T06:15Z"); // ❌d.parse("2020-01-01T06:15:00Z"); // ❌d.parse("2020-01-01T06:15:00.123Z"); // ✅
ISO dates
The z.iso.date() method validates strings in the format YYYY-MM-DD.
const date = z.iso.date(); date.parse("2020-01-01"); // ✅date.parse("2020-1-1"); // ❌date.parse("2020-01-32"); // ❌
ISO times
The z.iso.time() method validates strings in the format HH:MM[:SS[.s+]]. By default seconds are optional, as are sub-second deciams.
const time = z.iso.time(); time.parse("03:15"); // ✅time.parse("03:15:00"); // ✅time.parse("03:15:00.9999999"); // ✅ (arbitrary precision)
No offsets of any kind are allowed.
time.parse("03:15:00Z"); // ❌ (no `Z` allowed)time.parse("03:15:00+02:00"); // ❌ (no offsets allowed)
Use the precision parameter to constrain the allowable decimal precision.
z.iso.time({ precision: -1 }); // HH:MM (minute precision)z.iso.time({ precision: 0 }); // HH:MM:SS (second precision)z.iso.time({ precision: 1 }); // HH:MM:SS.s (decisecond precision)z.iso.time({ precision: 2 }); // HH:MM:SS.ss (centisecond precision)z.iso.time({ precision: 3 }); // HH:MM:SS.sss (millisecond precision)
IP addresses
const ipv4 = z.ipv4();ipv4.parse("192.168.0.0"); // ✅ const ipv6 = z.ipv6();ipv6.parse("2001:db8:85a3::8a2e:370:7334"); // ✅
IP blocks (CIDR)
Validate IP address ranges specified with CIDR notation.
const cidrv4 = z.string().cidrv4();cidrv4.parse("192.168.0.0/24"); // ✅ const cidrv6 = z.string().cidrv6();cidrv6.parse("2001:db8::/32"); // ✅
Template literals
New in Zod 4
To define a template literal schema:
const schema = z.templateLiteral([ "hello, ", z.string(), "!" ]);// `hello, ${string}!`
The z.templateLiteral API can handle any number of string literals (e.g. "hello") and schemas. Any schema with an inferred type that's assignable to string | number | bigint | boolean | null | undefined can be passed.
z.templateLiteral([ "hi there" ]);// `hi there` z.templateLiteral([ "email: ", z.string() ]);// `email: ${string}` z.templateLiteral([ "high", z.literal(5) ]);// `high5` z.templateLiteral([ z.nullable(z.literal("grassy")) ]);// `grassy` | `null` z.templateLiteral([ z.number(), z.enum(["px", "em", "rem"]) ]);// `${number}px` | `${number}em` | `${number}rem`
Numbers
Use z.number() to validate numbers. It allows any finite number.
const schema = z.number(); schema.parse(3.14);      // ✅schema.parse(NaN);       // ❌schema.parse(Infinity);  // ❌
Zod implements a handful of number-specific validations:
ZodZod Mini
z.number().gt(5);z.number().gte(5);                     // alias .min(5)z.number().lt(5);z.number().lte(5);                     // alias .max(5)z.number().positive();       z.number().nonnegative();    z.number().negative(); z.number().nonpositive(); z.number().multipleOf(5);              // alias .step(5)
If (for some reason) you want to validate NaN, use z.nan().
z.nan().parse(NaN);              // ✅z.nan().parse("anything else");  // ❌
Integers
To validate integers:
z.int();     // restricts to safe integer rangez.int32();   // restrict to int32 range
BigInts
To validate BigInts:
z.bigint();
Zod includes a handful of bigint-specific validations.
ZodZod Mini
z.bigint().gt(5n);z.bigint().gte(5n);                    // alias `.min(5n)`z.bigint().lt(5n);z.bigint().lte(5n);                    // alias `.max(5n)`z.bigint().positive(); z.bigint().nonnegative(); z.bigint().negative(); z.bigint().nonpositive(); z.bigint().multipleOf(5n);             // alias `.step(5n)`
Booleans
To validate boolean values:
z.boolean().parse(true); // => truez.boolean().parse(false); // => false
Dates
Use z.date() to validate Date instances.
z.date().safeParse(new Date()); // success: truez.date().safeParse("2022-01-12T06:15:00.000Z"); // success: false
To customize the error message:
z.date({  error: issue => issue.input === undefined ? "Required" : "Invalid date"});
Zod provides a handful of date-specific validations.
ZodZod Mini
z.date().min(new Date("1900-01-01"), { error: "Too old!" });z.date().max(new Date(), { error: "Too young!" });
Enums
Use z.enum to validate inputs against a fixed set of allowable string values.
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]); FishEnum.parse("Salmon"); // => "Salmon"FishEnum.parse("Swordfish"); // => ❌
Careful — If you declare your string array as a variable, Zod won't be able to properly infer the exact values of each element.
const fish = ["Salmon", "Tuna", "Trout"]; const FishEnum = z.enum(fish);type FishEnum = z.infer<typeof FishEnum>; // string
To fix this, always pass the array directly into the z.enum() function, or use as const.
const fish = ["Salmon", "Tuna", "Trout"] as const; const FishEnum = z.enum(fish);type FishEnum = z.infer<typeof FishEnum>; // "Salmon" | "Tuna" | "Trout"
You can also pass in an externally-declared TypeScript enum.
Zod 4 — This replaces the z.nativeEnum() API in Zod 3.
Note that using TypeScript's enum keyword is not recommended.
enum Fish {  Salmon = "Salmon",  Tuna = "Tuna",  Trout = "Trout",} const FishEnum = z.enum(Fish);
.enum
To extract the schema's values as an enum-like object:
ZodZod Mini
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]); FishEnum.enum;// => { Salmon: "Salmon", Tuna: "Tuna", Trout: "Trout" }
.exclude()
To create a new enum schema, excluding certain values:
ZodZod Mini
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);const TunaOnly = FishEnum.exclude(["Salmon", "Trout"]);
.extract()
To create a new enum schema, extracting certain values:
ZodZod Mini
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);const SalmonAndTroutOnly = FishEnum.extract(["Salmon", "Trout"]);
Stringbools
💎 New in Zod 4
In some cases (e.g. parsing environment variables) it's valuable to parse certain string "boolish" values to a plain boolean value. To support this, Zod 4 introduces z.stringbool():
const strbool = z.stringbool(); strbool.parse("true")         // => truestrbool.parse("1")            // => truestrbool.parse("yes")          // => truestrbool.parse("on")           // => truestrbool.parse("y")            // => truestrbool.parse("enabled")      // => true strbool.parse("false");       // => falsestrbool.parse("0");           // => falsestrbool.parse("no");          // => falsestrbool.parse("off");         // => falsestrbool.parse("n");           // => falsestrbool.parse("disabled");    // => false strbool.parse(/* anything else */); // ZodError<[{ code: "invalid_value" }]>
To customize the truthy and falsy values:
// these are the defaultsz.stringbool({  truthy: ["true", "1", "yes", "on", "y", "enabled"],  falsy: ["false", "0", "no", "off", "n", "disabled"],});
Be default the schema is case-insensitive; all inputs are converted to lowercase before comparison to the truthy/falsy values. To make it case-sensitive:
z.stringbool({  case: "sensitive"});
Optionals
To make a schema optional (that is, to allow undefined inputs).
ZodZod Mini
z.optional(z.literal("yoda")); // or z.literal("yoda").optional()
This returns a ZodOptional instance that wraps the original schema. To extract the inner schema:
ZodZod Mini
optionalYoda.unwrap(); // ZodLiteral<"yoda">
Nullables
To make a schema nullable (that is, to allow null inputs).
ZodZod Mini
z.nullable(z.literal("yoda")); // or z.literal("yoda").nullable()
This returns a ZodNullable instance that wraps the original schema. To extract the inner schema:
ZodZod Mini
nullableYoda.unwrap(); // ZodLiteral<"yoda">
Nullish
To make a schema nullish (both optional and nullable):
ZodZod Mini
const nullishYoda = z.nullish(z.literal("yoda"));
Refer to the TypeScript manual for more about the concept of nullish.
Unknown
Zod aims to mirror TypeScript's type system one-to-one. As such, Zod provides APIs to represent the following special types:
// allows any valuesz.any(); // inferred type: `any`z.unknown(); // inferred type: `unknown`
Never
No value will pass validation.
z.never(); // inferred type: `never`
Objects
To define an object type:
 // all properties are required by default  const Person = z.object({    name: z.string(),    age: z.number(),  });  type Person = z.infer<typeof Person>;  // => { name: string; age: number; }
By default, all properties are required. To make certain properties optional:
ZodZod Mini
const Dog = z.object({  name: z.string(),  age: z.number().optional(),}); Dog.parse({ name: "Yeller" }); // ✅
By default, unrecognized keys are stripped from the parsed result:
Dog.parse({ name: "Yeller", extraKey: true });// => { name: "Yeller" }
z.strictObject
To define a strict schema that throws an error when unknown keys are found:
const StrictDog = z.strictObject({  name: z.string(),}); StrictDog.parse({ name: "Yeller", extraKey: true });// ❌ throws
z.looseObject
To define a loose schema that allows unknown keys to pass through:
const LooseDog = z.looseObject({  name: z.string(),}); Dog.parse({ name: "Yeller", extraKey: true });// => { name: "Yeller", extraKey: true }
.catchall()
To define a catchall schema that will be used to validate any unrecognized keys:
ZodZod Mini
const DogWithStrings = z.object({  name: z.string(),  age: z.number().optional(),}).catchall(z.string()); DogWithStrings.parse({ name: "Yeller", extraKey: "extraValue" }); // ✅DogWithStrings.parse({ name: "Yeller", extraKey: 42 }); // ❌
.shape
To access the internal schemas:
ZodZod Mini
Dog.shape.name; // => string schemaDog.shape.age; // => number schema
.keyof()
To create a ZodEnum schema from the keys of an object schema:
ZodZod Mini
const keySchema = Dog.keyof();// => ZodEnum<["name", "age"]>
.extend()
To add additional fields to an object schema:
ZodZod Mini
const DogWithBreed = Dog.extend({  breed: z.string(),});
This API can be used to overwrite existing fields! Be careful with this power! If the two schemas share keys, B will override A.
Alternative: destructuring — You can alternatively avoid .extend() altogether by creating a new object schema entirely. This makes the strictness level of the resulting schema visually obvious.
const DogWithBreed = z.object({ // or z.strictObject() or z.looseObject()...  ...Dog.shape,  breed: z.string(),});
You can also use this to merge multiple objects in one go.
const DogWithBreed = z.object({  ...Animal.shape,  ...Pet.shape,  breed: z.string(),});
This approach has a few advantages:
It uses language-level features (destructuring syntax) instead of library-specific APIs
The same syntax works in Zod and Zod Mini
It's more tsc-efficient — the .extend() method can be expensive on large schemas, and due to a TypeScript limitation it gets quadratically more expensive when calls are chained
If you wish, you can change the strictness level of the resulting schema by using z.strictObject() or z.looseObject()
.pick()
Inspired by TypeScript's built-in Pick and Omit utility types, Zod provides dedicated APIs for picking and omitting certain keys from an object schema.
Starting from this initial schema:
const Recipe = z.object({  title: z.string(),  description: z.string().optional(),  ingredients: z.array(z.string()),});// { title: string; description?: string | undefined; ingredients: string[] }
To pick certain keys:
ZodZod Mini
const JustTheTitle = Recipe.pick({ title: true });
.omit()
To omit certain keys:
ZodZod Mini
const RecipeNoId = Recipe.omit({ id: true });
.partial()
For convenience, Zod provides a dedicated API for making some or all properties optional, inspired by the built-in TypeScript utility type Partial.
To make all fields optional:
ZodZod Mini
const PartialRecipe = Recipe.partial();// { title?: string | undefined; description?: string | undefined; ingredients?: string[] | undefined }
To make certain properties optional:
ZodZod Mini
const RecipeOptionalIngredients = Recipe.partial({  ingredients: true,});// { title: string; description?: string | undefined; ingredients?: string[] | undefined }
.required()
Zod provides an API for making some or all properties required, inspired by TypeScript's Required utility type.
To make all properties required:
ZodZod Mini
const RequiredRecipe = Recipe.required();// { title: string; description: string; ingredients: string[] }
To make certain properties required:
ZodZod Mini
const RecipeRequiredDescription = Recipe.required({description: true});// { title: string; description: string; ingredients: string[] }
Recursive objects
To define a self-referential type, use a getter on the key. This lets JavaScript resolve the cyclical schema at runtime.
const Category = z.object({  name: z.string(),  get subcategories(){    return z.array(Category)  }}); type Category = z.infer<typeof Category>;// { name: string; subcategories: Category[] }
Though recursive schemas are supported, passing cyclical data into Zod will cause an infinite loop.
You can also represent mutually recursive types:
const User = z.object({  email: z.email(),  get posts(){    return z.array(Post)  }}); const Post = z.object({  title: z.string(),  get author(){    return User  }});
All object APIs (.pick(), .omit(), .required(), .partial(), etc.) work as you'd expect.
Circularity errors
Due to TypeScript limitations, recursive type inference can be finicky, and it only works in certain scenarios. Some more complicated types may trigger recursive type errors like this:
const Activity = z.object({  name: z.string(),  get subactivities() {    // ^ ❌ 'subactivities' implicitly has return type 'any' because it does not    // have a return type annotation and is referenced directly or indirectly    // in one of its return expressions.ts(7023)    return z.nullable(z.array(Activity));  },});
In these cases, you can resolve the error with a type annotation on the offending getter:
const Activity = z.object({  name: z.string(),  get subactivities(): z.ZodNullable<z.ZodArray<typeof Activity>> {    return z.nullable(z.array(Activity));  },});
Arrays
To define an array schema:
ZodZod Mini
const stringArray = z.array(z.string()); // or z.string().array()
To access the inner schema for an element of the array.
ZodZod Mini
stringArray.unwrap(); // => string schema
Zod implements a number of array-specific validations:
ZodZod Mini
z.array(z.string()).min(5); // must contain 5 or more itemsz.array(z.string()).max(5); // must contain 5 or fewer itemsz.array(z.string()).length(5); // must contain 5 items exactly
Tuples
Unlike arrays, tuples are typically fixed-length arrays that specify different schemas for each index.
const MyTuple = z.tuple([  z.string(),  z.number(),  z.boolean()]); type MyTuple = z.infer<typeof MyTuple>;// [string, number, boolean]
To add a variadic ("rest") argument:
const variadicTuple = z.tuple([z.string()], z.number());// => [string, ...number[]];
Unions
Union types (A | B) represent a logical "OR". Zod union schemas will check the input against each option in order. The first value that validates successfully is returned.
const stringOrNumber = z.union([z.string(), z.number()]);// string | number stringOrNumber.parse("foo"); // passesstringOrNumber.parse(14); // passes
To extract the internal option schemas:
ZodZod Mini
stringOrNumber.options; // [ZodString, ZodNumber]
Discriminated unions
A discriminated union is a special kind of union in which a) all the options are object schemas that b) share a particular key (the "discriminator"). Based on the value of the discriminator key, TypeScript is able to "narrow" the type signature as you'd expect.
type MyResult =  | { status: "success"; data: string }  | { status: "failed"; error: string }; function handleResult(result: MyResult){  if(result.status === "success"){    result.data; // string  } else {    result.error; // string  }}
You could represent it with a regular z.union(). But regular unions are naive—they check the input against each option in order and return the first one that passes. This can be slow for large unions.
So Zod provides a z.discriminatedUnion() API that uses a discriminator key to make parsing more efficient.
const MyResult = z.discriminatedUnion("status", [  z.object({ status: z.literal("success"), data: z.string() }),  z.object({ status: z.literal("failed"), error: z.string() }),]);
Nesting discriminated unions
Intersections
Intersection types (A & B) represent a logical "AND".
const a = z.union([z.number(), z.string()]);const b = z.union([z.number(), z.boolean()]);const c = z.intersection(a, b); type c = z.infer<typeof c>; // => number
This can be useful for intersecting two object types.
const Person = z.object({ name: z.string() });type Person = z.infer<typeof Person>; const Employee = z.object({ role: z.string() });type Employee = z.infer<typeof Employee>; const EmployedPerson = z.intersection(Person, Employee);type EmployedPerson = z.infer<typeof EmployedPerson>;// Person & Employee
When merging object schemas, prefer A.extend(B) over intersections. Using .extend() will gve you a new object schema, whereas z.intersection(A, B) returns a ZodIntersection instance which lacks common object methods like pick and omit.
Records
Record schemas are used to validate types such as Record<string, number>.
const IdCache = z.record(z.string(), z.string());type IdCache = z.infer<typeof IdCache>; // Record<string, string> IdCache.parse({  carlotta: "77d2586b-9e8e-4ecf-8b21-ea7e0530eadd",  jimmie: "77d2586b-9e8e-4ecf-8b21-ea7e0530eadd",});
The key schema can be any Zod schema that is assignable to string | number | symbol.
const Keys = z.union([z.string(), z.number(), z.symbol()]);const AnyObject = z.record(Keys, z.unknown());// Record<string | number | symbol, unknown>
To create an object schemas containing keys defined by an enum:
const Keys = z.enum(["id", "name", "email"]);const Person = z.record(Keys, z.string());// { id: string; name: string; email: string }
Zod 4 — In Zod 4, if you pass a z.enum as the first argument to z.record(), Zod will exhaustively check that all enum values exist in the input as keys. This behavior agrees with TypeScript:
type MyRecord = Record<"a" | "b", string>;const myRecord: MyRecord = { a: "foo", b: "bar" }; // ✅const myRecord: MyRecord = { a: "foo" }; // ❌ missing required key `b`
In Zod 3, exhaustiveness was not checked. To replicate the old behavior, use z.partialRecord().
If you want a partial record type, use z.partialRecord(). This skips the special exhaustiveness checks Zod normally runs with z.enum() and z.literal() key schemas.
const Keys = z.enum(["id", "name", "email"]).or(z.never()); const Person = z.partialRecord(Keys, z.string());// { id?: string; name?: string; email?: string }
A note on numeric keys
Maps
const StringNumberMap = z.map(z.string(), z.number());type StringNumberMap = z.infer<typeof StringNumberMap>; // Map<string, number> const myMap: StringNumberMap = new Map();myMap.set("one", 1);myMap.set("two", 2); StringNumberMap.parse(myMap);
Sets
const NumberSet = z.set(z.number());type NumberSet = z.infer<typeof NumberSet>; // Set<number> const mySet: NumberSet = new Set();mySet.add(1);mySet.add(2);NumberSet.parse(mySet);
Set schemas can be further constrained with the following utility methods.
ZodZod Mini
z.set(z.string()).min(5); // must contain 5 or more itemsz.set(z.string()).max(5); // must contain 5 or fewer itemsz.set(z.string()).size(5); // must contain 5 items exactly
Files
To validate File instances:
ZodZod Mini
const fileSchema = z.file(); fileSchema.min(10_000); // minimum .size (bytes)fileSchema.max(1_000_000); // maximum .size (bytes)fileSchema.mime("image/png"); // MIME typefileSchema.mime(["image/png", "image/jpeg"]); // multiple MIME types
Promises
Deprecated — z.promise() is deprecated in Zod 4. There are vanishingly few valid uses cases for a Promise schema. If you suspect a value might be a Promise, simply await it before parsing it with Zod.
See z.promise() documentation
Instanceof
You can use z.instanceof to check that the input is an instance of a class. This is useful to validate inputs against classes that are exported from third-party libraries.
class Test {  name: string;} const TestSchema = z.instanceof(Test); TestSchema.parse(new Test()); // ✅TestSchema.parse("whatever"); // ❌
Refinements
Every Zod schema stores an array of refinements. Refinements are a way to perform custom validation that Zod doesn't provide a native API for.
.refine()
ZodZod Mini
const myString = z.string().refine((val) => val.length <= 255);
Refinement functions should never throw. Instead they should return a falsy value to signal failure. Thrown errors are not caught by Zod.
error
To customize the error message:
ZodZod Mini
const myString = z.string().refine((val) => val.length > 8, {  error: "Too short!" });
abort
By default, validation issues from checks are considered continuable; that is, Zod will execute all checks in sequence, even if one of them causes a validation error. This is usually desirable, as it means Zod can surface as many errors as possible in one go.
ZodZod Mini
const myString = z.string()  .refine((val) => val.length > 8, { error: "Too short!" })  .refine((val) => val === val.toLowerCase(), { error: "Must be lowercase" });  const result = myString.safeParse("OH NO");result.error.issues;/* [  { "code": "custom", "message": "Too short!" },  { "code": "custom", "message": "Must be lowercase" }] */
To mark a particular refinement as non-continuable, use the abort parameter. Validation will terminate if the check fails.
ZodZod Mini
const myString = z.string()  .refine((val) => val.length > 8, { error: "Too short!", abort: true })  .refine((val) => val === val.toLowerCase(), { error: "Must be lowercase", abort: true }); const result = myString.safeParse("OH NO");result.error!.issues;// => [{ "code": "custom", "message": "Too short!" }]
path
To customize the error path, use the path parameter. This is typically only useful in the context of object schemas.
ZodZod Mini
const passwordForm = z  .object({    password: z.string(),    confirm: z.string(),  })  .refine((data) => data.password === data.confirm, {    message: "Passwords don't match",    path: ["confirm"], // path of error  });
This will set the path parameter in the associated issue:
ZodZod Mini
const result = passwordForm.safeParse({ password: "asdf", confirm: "qwer" });result.error.issues;/* [{  "code": "custom",  "path": [ "confirm" ],  "message": "Passwords don't match"}] */
To define an asynchronous refinement, just pass an async function:
const userId = z.string().refine(async (id) => {  // verify that ID exists in database  return true;});
If you use async refinements, you must use the .parseAsync method to parse data! Otherwise Zod will throw an error.
ZodZod Mini
const result = await userId.parseAsync("abc123");
when
Note — This is a power user feature and can absolutely be abused in ways that will increase the probability of uncaught errors originating from inside your refinements.
By default, refinements don't run if any non-continuable issues have already been encountered. Zod is careful to ensure the type signature of the value is correct before passing it into any refinement functions.
const schema = z.string().refine((val) => {  return val.length > 8}); schema.parse(1234); // invalid_type: refinement won't be executed
In some cases, you want finer control over when refinements run. For instance consider this "password confirm" check:
ZodZod Mini
const schema = z  .object({    password: z.string().min(8),    confirmPassword: z.string(),    anotherField: z.string(),  })  .refine((data) => data.password === data.confirmPassword, {    message: "Passwords do not match",    path: ["confirmPassword"],  }); schema.parse({  password: "asdf",  confirmPassword: "asdf",  anotherField: 1234 // ❌ this error will prevent the password check from running});
An error on anotherField will prevent the password confirmation check from executing, even though the check doesn't depend on anotherField. To control when a refinement will run, use the when parameter:
ZodZod Mini
const schema = z  .object({    password: z.string().min(8),    confirmPassword: z.string(),    anotherField: z.string(),  })  .refine((data) => data.password === data.confirmPassword, {    message: "Passwords do not match",    path: ["confirmPassword"],    // run if password & confirmPassword are valid    when(payload) {      return schema        .pick({ password: true, confirmPassword: true })        .safeParse(payload.value).success;    },   }); schema.parse({  password: "asdf",  confirmPassword: "asdf",  anotherField: 1234 // ❌ this error will prevent the password check from running});
.superRefine()
In Zod 4, .superRefine() has been deprecated in favor of .check()
View .superRefine() example
.check()
The .refine() API is syntactic sugar atop a more versatile (and verbose) API called .check(). You can use this API to create multiple issues in a single refinement or have full control of the generated issue objects.
ZodZod Mini
const UniqueStringArray = z.array(z.string()).check((ctx) => {  if (ctx.value.length > 3) {    // full control of issue objects    ctx.issues.push({      code: "too_big",      maximum: 3,      origin: "array",      inclusive: true,      message: "Too many items 😡",      input: ctx.value    });  }  // create multiple issues in one refinement  if (ctx.value.length !== new Set(ctx.value).size) {    ctx.issues.push({      code: "custom",      message: `No duplicates allowed.`,      input: ctx.value,      continue: true // make this issue continuable (default: false)    });  }});
The regular .refine API only generates issues with a "custom" error code, but .check() makes it possible to throw other issue types. For more information on Zod's internal issue types, read the Error customization docs.
Pipes
Schemas can be chained together into "pipes". Pipes are primarily useful when used in conjunction with Transforms.
ZodZod Mini
const stringToLength = z.string().pipe(z.transform(val => val.length)); stringToLength.parse("hello"); // => 5
Transforms
Transforms are a special kind of schema. Instead of validating input, they accept anything and perform some transformation on the data. To define a transform:
ZodZod Mini
const castToString = z.transform((val) => String(val)); castToString.parse("asdf"); // => "asdf"castToString.parse(123); // => "123"castToString.parse(true); // => "true"
To perform validation logic inside a transform, use ctx. To report a validation issue, push a new issue onto ctx.issues (similar to the .check() API).
const coercedInt = z.transform((val, ctx) => {  try {    const parsed = Number.parseInt(String(val));    return parsed;  } catch (e) {    ctx.issues.push({      code: "custom",      message: "Not a number",      input: val,    });    // this is a special constant with type `never`    // returning it lets you exit the transform without impacting the inferred return type    return z.NEVER;  }});
Most commonly, transforms are used in conjunction with Pipes. This combination is useful for performing some initial validation, then transforming the parsed data into another form.
ZodZod Mini
const stringToLength = z.string().pipe(z.transform(val => val.length)); stringToLength.parse("hello"); // => 5
.transform()
Piping some schema into a transform is a common pattern, so Zod provides a convenience .transform() method.
ZodZod Mini
const stringToLength = z.string().transform(val => val.length);
Transforms can also be async:
ZodZod Mini
const idToUser = z  .string()  .transform(async (id) => {    // fetch user from database    return db.getUserById(id);  }); const user = await idToUser.parseAsync("abc123");
If you use async transforms, you must use a .parseAsync or .safeParseAsync when parsing data! Otherwise Zod will throw an error.
.preprocess()
Piping a transform into another schema is another common pattern, so Zod provides a convenience z.preprocess() function.
const coercedInt = z.preprocess((val) => {  if (typeof val === "string") {    return Number.parseInt(val);  }  return val;}, z.int());
Defaults
To set a default value for a schema:
ZodZod Mini
const defaultTuna = z.string().default("tuna"); defaultTuna.parse(undefined); // => "tuna"
Alternatively, you can pass a function which will be re-executed whenever a default value needs to be generated:
ZodZod Mini
const randomDefault = z.number().default(Math.random); randomDefault.parse(undefined);    // => 0.4413456736055323randomDefault.parse(undefined);    // => 0.1871840107401901randomDefault.parse(undefined);    // => 0.7223408162401552
Prefaults
In Zod, setting a default value will short-circuit the parsing process. If the input is undefined, the default value is eagerly returned. As such, the default value must be assignable to the output type of the schema.
const schema = z.string().transform(val => val.length).default(0);schema.parse(undefined); // => 0
Sometimes, it's useful to define a prefault ("pre-parse default") value. If the input is undefined, the prefault value will be parsed instead. The parsing process is not short circuited. As such, the prefault value must be assignable to the input type of the schema.
z.string().transform(val => val.length).prefault("tuna");schema.parse(undefined); // => 4
This is also useful if you want to pass some input value through some mutating refinements.
const a = z.string().trim().toUpperCase().prefault("  tuna  ");a.parse(undefined); // => "TUNA" const b = z.string().trim().toUpperCase().default("  tuna  ");b.parse(undefined); // => "  tuna  "
Catch
Use .catch() to define a fallback value to be returned in the event of a validation error:
ZodZod Mini
const numberWithCatch = z.number().catch(42); numberWithCatch.parse(5); // => 5numberWithCatch.parse("tuna"); // => 42
Alternatively, you can pass a function which will be re-executed whenever a catch value needs to be generated.
ZodZod Mini
const numberWithRandomCatch = z.number().catch((ctx) => {  ctx.error; // the caught ZodError  return Math.random();}); numberWithRandomCatch.parse("sup"); // => 0.4413456736055323numberWithRandomCatch.parse("sup"); // => 0.1871840107401901numberWithRandomCatch.parse("sup"); // => 0.7223408162401552
Branded types
TypeScript's type system is structural, meaning that two types that are structurally equivalent are considered the same.
type Cat = { name: string };type Dog = { name: string }; const pluto: Dog = { name: "pluto" };const simba: Cat = pluto; // works fine
In some cases, it can be desirable to simulate nominal typing inside TypeScript. This can be achieved with branded types (also known as "opaque types").
const Cat = z.object({ name: z.string() }).brand<"Cat">();const Dog = z.object({ name: z.string() }).brand<"Dog">(); type Cat = z.infer<typeof Cat>; // { name: string } & z.$brand<"Cat">type Dog = z.infer<typeof Dog>; // { name: string } & z.$brand<"Dog"> const pluto = Dog.parse({ name: "pluto" });const simba: Cat = pluto; // ❌ not allowed
Under the hood, this works by attaching a "brand" to the schema's inferred type.
const Cat = z.object({ name: z.string() }).brand<"Cat">();type Cat = z.infer<typeof Cat>; // { name: string } & z.$brand<"Cat">
With this brand, any plain (unbranded) data structures are no longer assignable to the inferred type. You have to parse some data with the schema to get branded data.
Note that branded types do not affect the runtime result of .parse. It is a static-only construct.
Readonly
To mark a schema as readonly:
ZodZod Mini
const ReadonlyUser = z.object({ name: z.string() }).readonly();type ReadonlyUser = z.infer<typeof ReadonlyUser>;// Readonly<{ name: string }>
The inferred type of the new schemas will be marked as readonly. Note that in TypeScript, this only affects objects, arrays, tuples, Set, and Map:
ZodZod Mini
z.object({ name: z.string() }).readonly(); // { readonly name: string }z.array(z.string()).readonly(); // readonly string[]z.tuple([z.string(), z.number()]).readonly(); // readonly [string, number]z.map(z.string(), z.date()).readonly(); // ReadonlyMap<string, Date>z.set(z.string()).readonly(); // ReadonlySet<string>
Inputs will be parsed like normal, then the result will be frozen with Object.freeze() to prevent modifications.
ZodZod Mini
const result = ReadonlyUser.parse({ name: "fido" });result.name = "simba"; // throws TypeError
JSON
To validate any JSON-encodable value:
const jsonSchema = z.json();
This is a convenience API that returns the following union schema:
const jsonSchema = z.lazy(() => {  return z.union([    z.string(params),    z.number(),    z.boolean(),    z.null(),    z.array(jsonSchema),    z.record(z.string(), jsonSchema)  ]);});
Custom
You can create a Zod schema for any TypeScript type by using z.custom(). This is useful for creating schemas for types that are not supported by Zod out of the box, such as template string literals.
const px = z.custom<`${number}px`>((val) => {  return typeof val === "string" ? /^\d+px$/.test(val) : false;}); type px = z.infer<typeof px>; // `${number}px` px.parse("42px"); // "42px"px.parse("42vw"); // throws;
If you don't provide a validation function, Zod will allow any value. This can be dangerous!
z.custom<{ arg: string }>(); // performs no validation
You can customize the error message and other options by passing a second argument. This parameter works the same way as the params parameter of .refine.
z.custom<...>((val) => ..., "custom error message");
Functions
In Zod 4, z.function() no longer returns a Zod schema.
Zod provides a z.function() utility for defining Zod-validated functions. This way, you can avoid intermixing validation code with your business logic.
const MyFunction = z.function({  input: [z.string()], // parameters (must be an array or a ZodTuple)  output: z.number()  // return type});
Function schemas have an .implement() method which accepts a function and returns a new function that automatically validates its inputs and outputs.
const computeTrimmedLength = MyFunction.implement((input) => {  // TypeScript knows input is a string!  return input.trim().length;}); computeTrimmedLength("sandwich"); // => 8computeTrimmedLength(" asdf "); // => 4
This function will throw a ZodError if the input is invalid:
computeTrimmedLength(42); // throws ZodError
If you only care about validating inputs, you can omit the output field.
const MyFunction = z.function({  input: [z.string()], // parameters (must be an array or a ZodTuple)}); const computeTrimmedLength = MyFunction.implement((input) => input.trim.length);
Edit on GitHub
Next
Basic usage
Next
Customizing errors
On this page
Primitives
Coercion
Literals
Strings
String formats
Emails
UUIDs
URLs
ISO datetimes
ISO dates
ISO times
IP addresses
IP blocks (CIDR)
Template literals
Numbers
Integers
BigInts
Booleans
Dates
Enums
.enum
.exclude()
.extract()
Stringbools
Optionals
Nullables
Nullish
Unknown
Never
Objects
z.strictObject
z.looseObject
.catchall()
.shape
.keyof()
.extend()
.pick()
.omit()
.partial()
.required()
Recursive objects
Circularity errors
Arrays
Tuples
Unions
Discriminated unions
Intersections
Records
Maps
Sets
Files
Promises
Instanceof
Refinements
.refine()
.superRefine()
.check()
Pipes
Transforms
.transform()
.preprocess()
Defaults
Prefaults
Catch
Branded types
Readonly
JSON
Custom
Functions
Customizing errors
In Zod, validation errors are surfaced as instances of the z.core.$ZodError class.
The ZodError class in the zod package is a subclass that implements some additional convenience methods.
Instances of $ZodError contain an .issues array. Each issue contains a human-readable message and additional structured metadata about the issue.
ZodZod Mini
import * as z from "zod"; const result = z.string().safeParse(12); // { success: false, error: ZodError }result.error.issues;// [//   {//     expected: 'string',//     code: 'invalid_type',//     path: [],//     message: 'Invalid input: expected string, received number'//   }// ]
Every issue contains a message property with a human-readable error message. Error messages can be customized in a number of ways.
The error param
Virtually every Zod API accepts an optional error message.
z.string("Not a string!");
This custom error will show up as the message property of any validation issues that originate from this schema.
z.string("Not a string!").parse(12);// ❌ throws ZodError {//   issues: [//     {//       expected: 'string',//       code: 'invalid_type',//       path: [],//       message: 'Not a string!'   <-- 👀 custom error message//     }//   ]// }
All z functions and schema methods accept custom errors.
ZodZod Mini
z.string("Bad!");z.string().min(5, "Too short!");z.uuid("Bad UUID!");z.iso.date("Bad date!");z.array(z.string(), "Not an array!");z.array(z.string()).min(5, "Too few items!");z.set(z.string(), "Bad set!");
If you prefer, you can pass a params object with an error parameter instead.
ZodZod Mini
z.string({ error: "Bad!" });z.string().min(5, { error: "Too short!" });z.uuid({ error: "Bad UUID!" });z.iso.date({ error: "Bad date!" });z.array(z.string(), { error: "Bad array!" });z.array(z.string()).min(5, { error: "Too few items!" });z.set(z.string(), { error: "Bad set!" });
The error param optionally accepts a function. An error customization function is known as an error map in Zod terminology. The error map will run at parse time if a validation error occurs.
z.string({ error: ()=>`[${Date.now()}]: Validation failure.` });
Note — In Zod v3, there were separate params for message (a string) and errorMap (a function). These have been unified in Zod 4 as error.
The error map receives a context object you can use to customize the error message based on the validation issue.
z.string({  error: (iss) => iss.input === undefined ? "Field is required." : "Invalid input."});
For advanced cases, the iss object provides additional information you can use to customize the error.
z.string({  error: (iss) => {    iss.code; // the issue code    iss.input; // the input data    iss.inst; // the schema/check that originated this issue    iss.path; // the path of the error  },});
Depending on the API you are using, there may be additional properties available. Use TypeScript's autocomplete to explore the available properties.
z.string().min(5, {  error: (iss) => {    // ...the same as above    iss.minimum; // the minimum value    iss.inclusive; // whether the minimum is inclusive    return `Password must have ${iss.minimum} characters or more`;  },});
Return undefined to avoid customizing the error message and fall back to the default message. (More specifically, Zod will yield control to the next error map in the precedence chain.) This is useful for selectively customizing certain error messages but not others.
z.int64({  error: (issue) => {    // override too_big error message    if (issue.code === "too_big") {      return { message: `Value must be <${issue.maximum}` };    }    //  defer to default    return undefined;  },});
Per-parse error customization
To customize errors on a per-parse basis, pass an error map into the parse method:
const schema = z.string(); schema.parse(12, {  error: iss => "per-parse custom error"});
This has lower precedence than any schema-level custom messages.
const schema = z.string({ error: "highest priority" });const result = schema.safeParse(12, {  error: (iss) => "lower priority",}); result.error.issues;// [{ message: "highest priority", ... }]
The iss object is a discriminated union of all possible issue types. Use the code property to discriminate between them.
For a breakdown of all Zod issue codes, see the zod/v4/core documentation.
const result = schema.safeParse(12, {  error: (iss) => {    if (iss.code === "invalid_type") {      return `invalid type, expected ${iss.expected}`;    }    if (iss.code === "too_small") {      return `minimum is ${iss.minimum}`;    }    // ...  }});
Include input in issues
By default, Zod does not include input data in issues. This is to prevent unintentional logging of potentially sensitive input data. To include the input data in each issue, use the reportInput flag:
z.string().parse(12, {  reportInput: true}) // ZodError: [//   {//     "expected": "string",//     "code": "invalid_type",//     "input": 12, // 👀//     "path": [],//     "message": "Invalid input: expected string, received number"//   }// ]
Global error customization
To specify a global error map, use z.config() to set Zod's customError configuration setting:
z.config({  customError: (iss) => {    return "globally modified error";  },});
Global error messages have lower precedence than schema-level or per-parse error messages.
The iss object is a discriminated union of all possible issue types. Use the code property to discriminate between them.
For a breakdown of all Zod issue codes, see the zod/v4/core documentation.
const result = schema.safeParse(12, {  error: (iss) => {    if (iss.code === "invalid_type") {      return `invalid type, expected ${iss.expected}`;    }    if (iss.code === "too_small") {      return `minimum is ${iss.minimum}`;    }    // ...  }})
Internationalization
To support internationalization of error message, Zod provides several built-in locales. These are exported from the zod/v4/core package.
Note — The regular zod library automatically loads the en locale automatically. Zod Mini does not load any locale by default; instead all error messages default to Invalid input.
ZodZod Mini
import * as z from "zod";import { en } from "zod/locales" z.config(en());
To lazily load a locale, consider dynamic imports:
import * as z from "zod"; async function loadLocale(locale: string) {  const { default: locale } = await import(`zod/v4/locales/${locale}.js`);  z.config(locale());}; await loadLocale("fr");
For convenience, all locales are exported as z.locales from "zod". In some bundlers, this may not be tree-shakable.
ZodZod Mini
import * as z from "zod"; z.config(z.locales.en());
Locales
The following locales are available:
ar — Arabic
az — Azerbaijani
be — Belarusian
ca — Catalan
cs — Czech
de — German
en — English
eo — Esperanto
es — Spanish
fa — Farsi
fi — Finnish
fr — French
frCA — Canadian French
he — Hebrew
hu — Hungarian
id — Indonesian
it — Italian
ja — Japanese
kh — Khmer
ko — Korean
mk — Macedonian
ms — Malay
nl — Dutch
no — Norwegian
ota — Türkî
ps — Pashto
pl — Polish
pt — Portuguese
ru — Russian
sl — Slovenian
sv — Swedish
ta — Tamil
th — Thai
tr — Türkçe
ua — Ukrainian
ur — Urdu
vi — Tiếng Việt
zhCN — Simplified Chinese
zhTW — Traditional Chinese
Error precedence
Below is a quick reference for determining error precedence: if multiple error customizations have been defined, which one takes priority? From highest to lowest priority:
Schema-level error — Any error message "hard coded" into a schema definition.
z.string("Not a string!");
Per-parse error — A custom error map passed into the .parse() method.
z.string().parse(12, {  error: (iss) => "My custom error"});
Global error map — A custom error map passed into z.config().
z.config({  customError: (iss) => "My custom error"});
Locale error map — A custom error map passed into z.config().
z.config(z.locales.en());
Edit on GitHub
Next
Defining schemas
Next
Formatting errors
On this page
The error param
Per-parse error customization
Include input in issues
Global error customization
Internationalization
Locales
Error precedence
Formatting errors
Zod emphasizes completeness and correctness in its error reporting. In many cases, it's helpful to convert the $ZodError to a more useful format. Zod provides some utilities for this.
Consider this simple object schema.
import * as z from "zod"; const schema = z.strictObject({  username: z.string(),  favoriteNumbers: z.array(z.number()),});
Attempting to parse this invalid data results in an error containing two issues.
const result = schema.safeParse({  username: 1234,  favoriteNumbers: [1234, "4567"],  extraKey: 1234,}); result.error!.issues;[  {    expected: 'string',    code: 'invalid_type',    path: [ 'username' ],    message: 'Invalid input: expected string, received number'  },  {    expected: 'number',    code: 'invalid_type',    path: [ 'favoriteNumbers', 1 ],    message: 'Invalid input: expected number, received string'  },  {    code: 'unrecognized_keys',    keys: [ 'extraKey' ],    path: [],    message: 'Unrecognized key: "extraKey"'  }];
z.treeifyError()
To convert ("treeify") this error into a nested object, use z.treeifyError().
const tree = z.treeifyError(result.error); // =>{  errors: [ 'Unrecognized key: "extraKey"' ],  properties: {    username: { errors: [ 'Invalid input: expected string, received number' ] },    favoriteNumbers: {      errors: [],      items: [        undefined,        {          errors: [ 'Invalid input: expected number, received string' ]        }      ]    }  }}
The result is a nested structure that mirrors the schema itself. You can easily access the errors that occurred at a particular path. The errors field contains the error messages at a given path, and the special properties properties and items let you traverse deeper into the tree.
tree.properties?.username?.errors;// => ["Invalid input: expected string, received number"] tree.properties?.favoriteNumbers?.items?.[1]?.errors;// => ["Invalid input: expected number, received string"];
Be sure to use optional chaining (?.) to avoid errors when accessing nested properties.
z.prettifyError()
The z.prettifyError() provides a human-readable string representation of the error.
const pretty = z.prettifyError(result.error);
This returns the following string:
✖ Unrecognized key: "extraKey"✖ Invalid input: expected string, received number  → at username✖ Invalid input: expected number, received string  → at favoriteNumbers[1]
z.formatError()
This has been deprecated in favor of z.treeifyError().
Show docs
z.flattenError()
While z.treeifyError() is useful for traversing a potentially complex nested structure, the majority of schemas are flat—just one level deep. In this case, use z.flattenError() to retrieve a clean, shallow error object.
const flattened = z.flattenError(result.error);// { errors: string[], properties: { [key: string]: string[] } } {  formErrors: [ 'Unrecognized key: "extraKey"' ],  fieldErrors: {    username: [ 'Invalid input: expected string, received number' ],    favoriteNumbers: [ 'Invalid input: expected number, received string' ]  }}
The formErrors array contains any top-level errors (where path is []). The fieldErrors object provides an array of errors for each field in the schema.
flattened.fieldErrors.username; // => [ 'Invalid input: expected string, received number' ]flattened.fieldErrors.favoriteNumbers; // => [ 'Invalid input: expected number, received string' ]
Edit on GitHub
Next
Customizing errors
Next
Metadata and registries
On this page
z.treeifyError()
z.prettifyError()
z.formatError()
z.flattenError()
Metadata and registries
It's often useful to associate a schema with some additional metadata for documentation, code generation, AI structured outputs, form validation, and other purposes.
Registries
Metadata in Zod is handled via registries. Registries are collections of schemas, each associated with some strongly-typed metadata. To create a simple registry:
import * as z from "zod"; const myRegistry = z.registry<{ description: string }>();
To register, lookup, and remove schemas from this registry:
const mySchema = z.string(); myRegistry.add(mySchema, { description: "A cool schema!"});myRegistry.has(mySchema); // => truemyRegistry.get(mySchema); // => { description: "A cool schema!" }myRegistry.remove(mySchema);myRegistry.clear(); // wipe registry
TypeScript enforces that the metadata for each schema matches the registry's metadata type.
myRegistry.add(mySchema, { description: "A cool schema!" }); // ✅myRegistry.add(mySchema, { description: 123 }); // ❌
Special handling for id — Zod registries treat the id property specially. An Error will be thrown if multiple schemas are registered with the same id value. This is true for all registries, including the global registry.
.register()
Note — This method is special in that it does not return a new schema; instead, it returns the original schema. No other Zod method does this! That includes .meta() and .describe() (documented below) which return a new instance.
Schemas provide a .register() method to more conveniently add it to a registry.
const mySchema = z.string(); mySchema.register(myRegistry, { description: "A cool schema!" });// => mySchema
This lets you define metadata "inline" in your schemas.
const mySchema = z.object({  name: z.string().register(myRegistry, { description: "The user's name" }),  age: z.number().register(myRegistry, { description: "The user's age" }),})
If a registry is defined without a metadata type, you can use it as a generic "collection", no metadata required.
const myRegistry = z.registry(); myRegistry.add(z.string());myRegistry.add(z.number());
Metadata
z.globalRegistry
For convenience, Zod provides a global registry (z.globalRegistry) that can be used to store metadata for JSON Schema generation or other purposes. It accepts the following metadata:
export interface GlobalMeta {  id?: string ;  title?: string ;  description?: string ;  example?: unknown ;  examples?:    | unknown[] // array-style (JSON Schema)    | Record<string, { value: unknown; [k: string]: unknown }>;  // map-style (OpenAPI)  deprecated?: boolean ;  [k: string]: unknown;}
To register some metadata in z.globalRegistry for a schema:
import * as z from "zod"; const emailSchema = z.email().register(z.globalRegistry, {  id: "email_address",  title: "Email address",  description: "Your email address",  examples: ["first.last@example.com"]});
.meta()
For a more convenient approach, use the .meta() method to register a schema in z.globalRegistry.
ZodZod Mini
const emailSchema = z.email().meta({  id: "email_address",  title: "Email address",  description: "Please enter a valid email address",});
Calling .meta() without an argument will retrieve the metadata for a schema.
emailSchema.meta();// => { id: "email_address", title: "Email address", ... }
Metadata is associated with a specific schema instance. This is important to keep in mind, especially since Zod methods are immutable—they always return a new instance.
const A = z.string().meta({ description: "A cool string" });A.meta(); // => { hello: "true" } const B = A.refine(_ => true);B.meta(); // => undefined
.describe()
The .describe() method still exists for compatibility with Zod 3, but .meta() is now the recommended approach.
The .describe() method is a shorthand for registering a schema in z.globalRegistry with just a description field.
ZodZod Mini
const emailSchema = z.email();emailSchema.describe("An email address"); // equivalent toemailSchema.meta({ description: "An email address" });
Custom registries
You've already seen a simple example of a custom registry:
import * as z from "zod"; const myRegistry = z.registry<{ description: string };>();
Let's look at some more advanced patterns.
Referencing inferred types
It's often valuable for the metadata type to reference the inferred type of a schema. For instance, you may want an examples field to contain examples of the schema's output.
import * as z from "zod"; type MyMeta = { examples: z.$output[] };const myRegistry = z.registry<MyMeta>(); myRegistry.add(z.string(), { examples: ["hello", "world"] });myRegistry.add(z.number(), { examples: [1, 2, 3] });
The special symbol z.$output is a reference to the schemas inferred output type (z.infer<typeof schema>). Similarly you can use z.$input to reference the input type.
Constraining schema types
Pass a second generic to z.registry() to constrain the schema types that can be added to a registry. This registry only accepts string schemas.
import * as z from "zod"; const myRegistry = z.registry<{ description: string }, z.ZodString>(); myRegistry.add(z.string(), { description: "A number" }); // ✅myRegistry.add(z.number(), { description: "A number" }); // ❌ //             ^ 'ZodNumber' is not assignable to parameter of type 'ZodString'
Edit on GitHub
Next
Formatting errors
Next
JSON Schema
On this page
Registries
.register()
Metadata
z.globalRegistry
.meta()
.describe()
Custom registries
Referencing inferred types
Constraining schema types
JSON Schema
💎
New — Zod 4 introduces a new feature: native JSON Schema conversion. JSON Schema is a standard for describing the structure of JSON (with JSON). It's widely used in OpenAPI definitions and defining structured outputs for AI.
To convert a Zod schema to JSON Schema, use the z.toJSONSchema() function.
import * as z from "zod"; const schema = z.object({  name: z.string(),  age: z.number(),}); z.toJSONSchema(schema)// => {//   type: 'object',//   properties: { name: { type: 'string' }, age: { type: 'number' } },//   required: [ 'name', 'age' ],//   additionalProperties: false,// }
All schema & checks are converted to their closest JSON Schema equivalent. Some types have no analog and cannot be reasonably represented. See the unrepresentable section below for more information on handling these cases.
z.bigint(); // ❌z.int64(); // ❌z.symbol(); // ❌z.void(); // ❌z.date(); // ❌z.map(); // ❌z.set(); // ❌z.transform(); // ❌z.nan(); // ❌z.custom(); // ❌
String formats
Zod converts the following schema types to the equivalent JSON Schema format:
// Supported via `format`z.email(); // => { type: "string", format: "email" }z.iso.datetime(); // => { type: "string", format: "date-time" }z.iso.date(); // => { type: "string", format: "date" }z.iso.time(); // => { type: "string", format: "time" }z.iso.duration(); // => { type: "string", format: "duration" }z.ipv4(); // => { type: "string", format: "ipv4" }z.ipv6(); // => { type: "string", format: "ipv6" }z.uuid(); // => { type: "string", format: "uuid" }z.guid(); // => { type: "string", format: "uuid" }z.url(); // => { type: "string", format: "uri" }
These schemas are supported via contentEncoding:
z.base64(); // => { type: "string", contentEncoding: "base64" }
All other string formats are supported via pattern:
z.base64url();z.cuid();z.regex();z.emoji();z.nanoid();z.cuid2();z.ulid();z.cidrv4();z.cidrv6();
Numeric types
Zod converts the following numeric types to JSON Schema:
// numberz.number(); // => { type: "number" }z.float32(); // => { type: "number", exclusiveMinimum: ..., exclusiveMaximum: ... }z.float64(); // => { type: "number", exclusiveMinimum: ..., exclusiveMaximum: ... } // integerz.int(); // => { type: "integer" }z.int32(); // => { type: "integer", exclusiveMinimum: ..., exclusiveMaximum: ... }
Object schemas
By default, z.object() schemas contain additionalProperties: "false". This is an accurate representation of Zod's default behavior, as plain z.object() schema strip additional properties.
import * as z from "zod"; const schema = z.object({  name: z.string(),  age: z.number(),}); z.toJSONSchema(schema)// => {//   type: 'object',//   properties: { name: { type: 'string' }, age: { type: 'number' } },//   required: [ 'name', 'age' ],//   additionalProperties: false,// }
When converting to JSON Schema in "input" mode, additionalProperties is not set. See the io docs for more information.
import * as z from "zod"; const schema = z.object({  name: z.string(),  age: z.number(),}); z.toJSONSchema(schema, { io: "input" });// => {//   type: 'object',//   properties: { name: { type: 'string' }, age: { type: 'number' } },//   required: [ 'name', 'age' ],// }
By contrast:
z.looseObject() will never set additionalProperties: false
z.strictObject() will always set additionalProperties: false
File schemas
Zod converts z.file() to the following OpenAPI-friendly schema:
z.file();// => { type: "string", format: "binary", contentEncoding: "binary" }
Size and MIME checks are also represented:
z.file().min(1).max(1024 * 1024).mime("image/png");// => {//   type: "string",//   format: "binary",//   contentEncoding: "binary",//   contentMediaType: "image/png",//   minLength: 1,//   maxLength: 1048576,// }
Nullability
Zod converts both undefined/null to { type: "null" } in JSON Schema.
z.null(); // => { type: "null" } z.undefined(); // => { type: "null" }
Similarly, nullable is represented via a union with null::
z.nullable(z.string());// => { oneOf: [{ type: "string" }, { type: "null" }] }
Optional schemas are represented as-is, though they are decorated with an optional annotation.
z.optional(z.string());// => { type: "string" }
Configuration
A second argument can be used to customize the conversion logic.
z.toJSONSchema(schema, {  // ...params})
Below is a quick reference for each supported parameter. Each one is explained in more detail below.
interface ToJSONSchemaParams {  /** The JSON Schema version to target.   * - `"draft-2020-12"` — Default. JSON Schema Draft 2020-12   * - `"draft-7"` — JSON Schema Draft 7 */  target?: "draft-7" | "draft-2020-12";  /** A registry used to look up metadata for each schema.   * Any schema with an `id` property will be extracted as a $def. */  metadata?: $ZodRegistry<Record<string, any>>;  /** How to handle unrepresentable types.   * - `"throw"` — Default. Unrepresentable types throw an error   * - `"any"` — Unrepresentable types become `{}` */  unrepresentable?: "throw" | "any";  /** How to handle cycles.   * - `"ref"` — Default. Cycles will be broken using $defs   * - `"throw"` — Cycles will throw an error if encountered */  cycles?: "ref" | "throw";  /* How to handle reused schemas.   * - `"inline"` — Default. Reused schemas will be inlined   * - `"ref"` — Reused schemas will be extracted as $defs */  reused?: "ref" | "inline";  /** A function used to convert `id` values to URIs to be used in *external* $refs.   *   * Default is `(id) => id`.   */  uri?: (id: string) => string;}
target
To set the target JSON Schema version, use the target parameter. By default, Zod will target Draft 2020-12.
z.toJSONSchema(schema, { target: "draft-7" });z.toJSONSchema(schema, { target: "draft-2020-12" });
metadata
If you haven't already, read through the Metadata and registries page for context on storing metadata in Zod.
In Zod, metadata is stored in registries. Zod exports a global registry z.globalRegistry that can be used to store common metadata fields like id, title, description, and examples.
ZodZod Mini
import * as z from "zod"; // `.meta()` is a convenience method for registering a schema in `z.globalRegistry`const emailSchema = z.string().meta({  title: "Email address",  description: "Your email address",}); z.toJSONSchema(emailSchema);// => { type: "string", title: "Email address", description: "Your email address", ... }
All metadata fields get copied into the resulting JSON Schema.
const schema = z.string().meta({  whatever: 1234}); z.toJSONSchema(schema);// => { type: "string", whatever: 1234 }
unrepresentable
The following APIs are not representable in JSON Schema. By default, Zod will throw an error if they are encountered. It is unsound to attempt a conversion to JSON Schema; you should modify your schemas as they have no equivalent in JSON. An error will be thrown if any of these are encountered.
z.bigint(); // ❌z.int64(); // ❌z.symbol(); // ❌z.void(); // ❌z.date(); // ❌z.map(); // ❌z.set(); // ❌z.transform(); // ❌z.nan(); // ❌z.custom(); // ❌
By default, Zod will throw an error if any of these are encountered.
z.toJSONSchema(z.bigint());// => throws Error
You can change this behavior by setting the unrepresentable option to "any". This will convert any unrepresentable types to {} (the equivalent of unknown in JSON Schema).
z.toJSONSchema(z.bigint(), { unrepresentable: "any" });// => {}
cycles
How to handle cycles. If a cycle is encountered as z.toJSONSchema() traverses the schema, it will be represented using $ref.
const User = z.object({  name: z.string(),  get friend() {    return User;  },}); z.toJSONSchema(User);// => {//   type: 'object',//   properties: { name: { type: 'string' }, friend: { '$ref': '#' } },//   required: [ 'name', 'friend' ],//   additionalProperties: false,// }
If instead you want to throw an error, set the cycles option to "throw".
z.toJSONSchema(User, { cycles: "throw" });// => throws Error
reused
How to handle schemas that occur multiple times in the same schema. By default, Zod will inline these schemas.
const name = z.string();const User = z.object({  firstName: name,  lastName: name,}); z.toJSONSchema(User);// => {//   type: 'object',//   properties: { //     firstName: { type: 'string' }, //     lastName: { type: 'string' } //   },//   required: [ 'firstName', 'lastName' ],//   additionalProperties: false,// }
Instead you can set the reused option to "ref" to extract these schemas into $defs.
z.toJSONSchema(User, { reused: "ref" });// => {//   type: 'object',//   properties: {//     firstName: { '$ref': '#/$defs/__schema0' },//     lastName: { '$ref': '#/$defs/__schema0' }//   },//   required: [ 'firstName', 'lastName' ],//   additionalProperties: false,//   '$defs': { __schema0: { type: 'string' } }// }
override
To define some custom override logic, use override. The provided callback has access to the original Zod schema and the default JSON Schema. This function should directly modify ctx.jsonSchema.
const mySchema = /* ... */z.toJSONSchema(mySchema, {  override: (ctx)=>{    ctx.zodSchema; // the original Zod schema    ctx.jsonSchema; // the default JSON Schema    // directly modify    ctx.jsonSchema.whatever = "sup";  }});
Note that unrepresentable types will throw an Error before this functions is called. If you are trying to define custom behavior for an unrepresentable type, you'll need to use set the unrepresentable: "any" alongside override.
// support z.date() as ISO datetime stringsconst result = z.toJSONSchema(z.date(), {  unrepresentable: "any",  override: (ctx) => {    const def = ctx.zodSchema._zod.def;    if(def.type ==="date"){      ctx.jsonSchema.type = "string";      ctx.jsonSchema.format = "date-time";    }  },});
io
Some schema types have different input and output types, e.g. ZodPipe, ZodDefault, and coerced primitives. By default, the result of z.toJSONSchema represents the output type; use "io": "input" to extract the input type instead.
const mySchema = z.string().transform(val => val.length).pipe(z.number());// ZodPipe const jsonSchema = z.toJSONSchema(mySchema); // => { type: "number" } const jsonSchema = z.toJSONSchema(mySchema, { io: "input" }); // => { type: "string" }
Registries
Passing a schema into z.toJSONSchema() will return a self-contained JSON Schema.
In other cases, you may have a set of Zod schemas you'd like to represent using multiple interlinked JSON Schemas, perhaps to write to .json files and serve from a web server.
import * as z from "zod"; const User = z.object({  name: z.string(),  get posts(){    return z.array(Post);  }}); const Post = z.object({  title: z.string(),  content: z.string(),  get author(){    return User;  }}); z.globalRegistry.add(User, {id: "User"});z.globalRegistry.add(Post, {id: "Post"});
To achieve this, you can pass a registry into z.toJSONSchema().
Important — All schemas should have a registered id property in the registry! Any schemas without an id will be ignored.
z.toJSONSchema(z.globalRegistry);// => {//   schemas: {//     User: {//       id: 'User',//       type: 'object',//       properties: {//         name: { type: 'string' },//         posts: { type: 'array', items: { '$ref': 'Post' } }//       },//       required: [ 'name', 'posts' ],//       additionalProperties: false,//     },//     Post: {//       id: 'Post',//       type: 'object',//       properties: {//         title: { type: 'string' },//         content: { type: 'string' },//         author: { '$ref': 'User' }//       },//       required: [ 'title', 'content', 'author' ],//       additionalProperties: false,//     }//   }// }
By default, the $ref URIs are simple relative paths like "User". To make these absolute URIs, use the uri option. This expects a function that converts an id to a fully-qualified URI.
z.toJSONSchema(z.globalRegistry, {  uri: (id) => `https://example.com/${id}.json`});// => {//   schemas: {//     User: {//       id: 'User',//       type: 'object',//       properties: {//         name: { type: 'string' },//         posts: {//           type: 'array',//           items: { '$ref': 'https://example.com/Post.json' }//         }//       },//       required: [ 'name', 'posts' ],//       additionalProperties: false,//     },//     Post: {//       id: 'Post',//       type: 'object',//       properties: {//         title: { type: 'string' },//         content: { type: 'string' },//         author: { '$ref': 'https://example.com/User.json' }//       },//       required: [ 'title', 'content', 'author' ],//       additionalProperties: false,//     }//   }// }
Edit on GitHub
Next
Metadata and registries
Next
Ecosystem
On this page
String formats
Numeric types
Object schemas
File schemas
Nullability
Configuration
target
metadata
unrepresentable
cycles
reused
override
io
Registries
Defining schemas
To validate data, you must first define a schema. Schemas represent types, from simple primitive values to complex nested objects and arrays.
Primitives
import * as z from "zod"; // primitive typesz.string();z.number();z.bigint();z.boolean();z.symbol();z.undefined();z.null();
Coercion
To coerce input data to the appropriate type, use z.coerce instead:
z.coerce.string();    // String(input)z.coerce.number();    // Number(input)z.coerce.boolean();   // Boolean(input)z.coerce.bigint();    // BigInt(input)
The coerced variant of these schemas attempts to convert the input value to the appropriate type.
const schema = z.coerce.string(); schema.parse("tuna");    // => "tuna"schema.parse(42);        // => "42"schema.parse(true);      // => "true"schema.parse(null);      // => "null"
How coercion works in Zod
Literals
Literal schemas represent a literal type, like "hello world" or 5.
const tuna = z.literal("tuna");const twelve = z.literal(12);const twobig = z.literal(2n);const tru = z.literal(true);
To represent the JavaScript literals null and undefined:
z.null();z.undefined();z.void(); // equivalent to z.undefined()
To allow multiple literal values:
const colors = z.literal(["red", "green", "blue"]); colors.parse("green"); // ✅colors.parse("yellow"); // ❌
To extract the set of allowed values from a literal schema:
ZodZod Mini
colors.values; // => Set<"red" | "green" | "blue">
Strings
Zod provides a handful of built-in string validation and transform APIs. To perform some common string validations:
ZodZod Mini
z.string().max(5);z.string().min(5);z.string().length(5);z.string().regex(/^[a-z]+$/);z.string().startsWith("aaa");z.string().endsWith("zzz");z.string().includes("---");z.string().uppercase();z.string().lowercase();
To perform some simple string transforms:
ZodZod Mini
z.string().trim(); // trim whitespacez.string().toLowerCase(); // toLowerCasez.string().toUpperCase(); // toUpperCase
String formats
To validate against some common string formats:
z.email();z.uuid();z.url();z.emoji();         // validates a single emoji characterz.base64();z.base64url();z.nanoid();z.cuid();z.cuid2();z.ulid();z.ipv4();z.ipv6();z.cidrv4();        // ipv4 CIDR blockz.cidrv6();        // ipv6 CIDR blockz.iso.date();z.iso.time();z.iso.datetime();z.iso.duration();
Emails
To validate email addresses:
z.email();
By default, Zod uses a comparatively strict email regex designed to validate normal email addresses containing common characters. It's roughly equivalent to the rules enforced by Gmail. To learn more about this regex, refer to this post.
/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i
To customize the email validation behavior, you can pass a custom regular expression to the pattern param.
z.email({ pattern: /your regex here/ });
Zod exports several useful regexes you could use.
// Zod's default email regexz.email();z.email({ pattern: z.regexes.email }); // equivalent // the regex used by browsers to validate input[type=email] fields// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/emailz.email({ pattern: z.regexes.html5Email }); // the classic emailregex.com regex (RFC 5322)z.email({ pattern: z.regexes.rfc5322Email }); // a loose regex that allows Unicode (good for intl emails)z.email({ pattern: z.regexes.unicodeEmail });
UUIDs
To validate UUIDs:
z.uuid();
To specify a particular UUID version:
// supports "v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8"z.uuid({ version: "v4" }); // for conveniencez.uuidv4();z.uuidv6();z.uuidv7();
The RFC 9562/4122 UUID spec requires the first two bits of byte 8 to be 10. Other UUID-like identifiers do not enforce this constraint. To validate any UUID-like identifier:
z.guid();
URLs
To validate any WHATWG-compatible URL:
const schema = z.url(); schema.parse("https://example.com"); // ✅schema.parse("http://localhost"); // ✅schema.parse("mailto:noreply@zod.dev"); // ✅schema.parse("sup"); // ✅
As you can see this is quite permissive. Internally this uses the new URL() constructor to validate inputs; this behavior may differ across platforms and runtimes but it's the mostly rigorous way to validate URIs/URLs on any given JS runtime/engine.
To validate the hostname against a specific regex:
const schema = z.url({ hostname: /^example\.com$/ }); schema.parse("https://example.com"); // ✅schema.parse("https://zombo.com"); // ❌
To validate the protocol against a specific regex, use the protocol param.
const schema = z.url({ protocol: /^https$/ }); schema.parse("https://example.com"); // ✅schema.parse("http://example.com"); // ❌
Web URLs — In many cases, you'll want to validate Web URLs specifically. Here's the recommended schema for doing so:
const httpUrl = z.url({  protocol: /^https?$/,  hostname: z.regexes.domain});
This restricts the protocol to http/https and ensures the hostname is a valid domain name with the z.regexes.domain regular expression:
/^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
ISO datetimes
As you may have noticed, Zod string includes a few date/time related validations. These validations are regular expression based, so they are not as strict as a full date/time library. However, they are very convenient for validating user input.
The z.iso.datetime() method enforces ISO 8601; by default, no timezone offsets are allowed:
const datetime = z.iso.datetime(); datetime.parse("2020-01-01T06:15:00Z"); // ✅datetime.parse("2020-01-01T06:15:00.123Z"); // ✅datetime.parse("2020-01-01T06:15:00.123456Z"); // ✅ (arbitrary precision)datetime.parse("2020-01-01T06:15:00+02:00"); // ❌ (offsets not allowed)datetime.parse("2020-01-01T06:15:00"); // ❌ (local not allowed)
To allow timezone offsets:
const datetime = z.iso.datetime({ offset: true }); // allows timezone offsetsdatetime.parse("2020-01-01T06:15:00+02:00"); // ✅ // basic offsets not alloweddatetime.parse("2020-01-01T06:15:00+02");    // ❌datetime.parse("2020-01-01T06:15:00+0200");  // ❌ // Z is still supporteddatetime.parse("2020-01-01T06:15:00Z"); // ✅
To allow unqualified (timezone-less) datetimes:
const schema = z.iso.datetime({ local: true });schema.parse("2020-01-01T06:15:01"); // ✅schema.parse("2020-01-01T06:15"); // ✅ seconds optional
To constrain the allowable time precision. By default, seconds are optional and arbitrary sub-second precision is allowed.
const a = z.iso.datetime();a.parse("2020-01-01T06:15Z"); // ✅a.parse("2020-01-01T06:15:00Z"); // ✅a.parse("2020-01-01T06:15:00.123Z"); // ✅ const b = z.iso.datetime({ precision: -1 }); // minute precision (no seconds)b.parse("2020-01-01T06:15Z"); // ✅b.parse("2020-01-01T06:15:00Z"); // ❌b.parse("2020-01-01T06:15:00.123Z"); // ❌ const c = z.iso.datetime({ precision: 0 }); // second precision onlyc.parse("2020-01-01T06:15Z"); // ❌c.parse("2020-01-01T06:15:00Z"); // ✅c.parse("2020-01-01T06:15:00.123Z"); // ❌ const d = z.iso.datetime({ precision: 3 }); // millisecond precision onlyd.parse("2020-01-01T06:15Z"); // ❌d.parse("2020-01-01T06:15:00Z"); // ❌d.parse("2020-01-01T06:15:00.123Z"); // ✅
ISO dates
The z.iso.date() method validates strings in the format YYYY-MM-DD.
const date = z.iso.date(); date.parse("2020-01-01"); // ✅date.parse("2020-1-1"); // ❌date.parse("2020-01-32"); // ❌
ISO times
The z.iso.time() method validates strings in the format HH:MM[:SS[.s+]]. By default seconds are optional, as are sub-second deciams.
const time = z.iso.time(); time.parse("03:15"); // ✅time.parse("03:15:00"); // ✅time.parse("03:15:00.9999999"); // ✅ (arbitrary precision)
No offsets of any kind are allowed.
time.parse("03:15:00Z"); // ❌ (no `Z` allowed)time.parse("03:15:00+02:00"); // ❌ (no offsets allowed)
Use the precision parameter to constrain the allowable decimal precision.
z.iso.time({ precision: -1 }); // HH:MM (minute precision)z.iso.time({ precision: 0 }); // HH:MM:SS (second precision)z.iso.time({ precision: 1 }); // HH:MM:SS.s (decisecond precision)z.iso.time({ precision: 2 }); // HH:MM:SS.ss (centisecond precision)z.iso.time({ precision: 3 }); // HH:MM:SS.sss (millisecond precision)
IP addresses
const ipv4 = z.ipv4();ipv4.parse("192.168.0.0"); // ✅ const ipv6 = z.ipv6();ipv6.parse("2001:db8:85a3::8a2e:370:7334"); // ✅
IP blocks (CIDR)
Validate IP address ranges specified with CIDR notation.
const cidrv4 = z.string().cidrv4();cidrv4.parse("192.168.0.0/24"); // ✅ const cidrv6 = z.string().cidrv6();cidrv6.parse("2001:db8::/32"); // ✅
Template literals
New in Zod 4
To define a template literal schema:
const schema = z.templateLiteral([ "hello, ", z.string(), "!" ]);// `hello, ${string}!`
The z.templateLiteral API can handle any number of string literals (e.g. "hello") and schemas. Any schema with an inferred type that's assignable to string | number | bigint | boolean | null | undefined can be passed.
z.templateLiteral([ "hi there" ]);// `hi there` z.templateLiteral([ "email: ", z.string() ]);// `email: ${string}` z.templateLiteral([ "high", z.literal(5) ]);// `high5` z.templateLiteral([ z.nullable(z.literal("grassy")) ]);// `grassy` | `null` z.templateLiteral([ z.number(), z.enum(["px", "em", "rem"]) ]);// `${number}px` | `${number}em` | `${number}rem`
Numbers
Use z.number() to validate numbers. It allows any finite number.
const schema = z.number(); schema.parse(3.14);      // ✅schema.parse(NaN);       // ❌schema.parse(Infinity);  // ❌
Zod implements a handful of number-specific validations:
ZodZod Mini
z.number().gt(5);z.number().gte(5);                     // alias .min(5)z.number().lt(5);z.number().lte(5);                     // alias .max(5)z.number().positive();       z.number().nonnegative();    z.number().negative(); z.number().nonpositive(); z.number().multipleOf(5);              // alias .step(5)
If (for some reason) you want to validate NaN, use z.nan().
z.nan().parse(NaN);              // ✅z.nan().parse("anything else");  // ❌
Integers
To validate integers:
z.int();     // restricts to safe integer rangez.int32();   // restrict to int32 range
BigInts
To validate BigInts:
z.bigint();
Zod includes a handful of bigint-specific validations.
ZodZod Mini
z.bigint().gt(5n);z.bigint().gte(5n);                    // alias `.min(5n)`z.bigint().lt(5n);z.bigint().lte(5n);                    // alias `.max(5n)`z.bigint().positive(); z.bigint().nonnegative(); z.bigint().negative(); z.bigint().nonpositive(); z.bigint().multipleOf(5n);             // alias `.step(5n)`
Booleans
To validate boolean values:
z.boolean().parse(true); // => truez.boolean().parse(false); // => false
Dates
Use z.date() to validate Date instances.
z.date().safeParse(new Date()); // success: truez.date().safeParse("2022-01-12T06:15:00.000Z"); // success: false
To customize the error message:
z.date({  error: issue => issue.input === undefined ? "Required" : "Invalid date"});
Zod provides a handful of date-specific validations.
ZodZod Mini
z.date().min(new Date("1900-01-01"), { error: "Too old!" });z.date().max(new Date(), { error: "Too young!" });
Enums
Use z.enum to validate inputs against a fixed set of allowable string values.
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]); FishEnum.parse("Salmon"); // => "Salmon"FishEnum.parse("Swordfish"); // => ❌
Careful — If you declare your string array as a variable, Zod won't be able to properly infer the exact values of each element.
const fish = ["Salmon", "Tuna", "Trout"]; const FishEnum = z.enum(fish);type FishEnum = z.infer<typeof FishEnum>; // string
To fix this, always pass the array directly into the z.enum() function, or use as const.
const fish = ["Salmon", "Tuna", "Trout"] as const; const FishEnum = z.enum(fish);type FishEnum = z.infer<typeof FishEnum>; // "Salmon" | "Tuna" | "Trout"
You can also pass in an externally-declared TypeScript enum.
Zod 4 — This replaces the z.nativeEnum() API in Zod 3.
Note that using TypeScript's enum keyword is not recommended.
enum Fish {  Salmon = "Salmon",  Tuna = "Tuna",  Trout = "Trout",} const FishEnum = z.enum(Fish);
.enum
To extract the schema's values as an enum-like object:
ZodZod Mini
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]); FishEnum.enum;// => { Salmon: "Salmon", Tuna: "Tuna", Trout: "Trout" }
.exclude()
To create a new enum schema, excluding certain values:
ZodZod Mini
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);const TunaOnly = FishEnum.exclude(["Salmon", "Trout"]);
.extract()
To create a new enum schema, extracting certain values:
ZodZod Mini
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);const SalmonAndTroutOnly = FishEnum.extract(["Salmon", "Trout"]);
Stringbools
💎 New in Zod 4
In some cases (e.g. parsing environment variables) it's valuable to parse certain string "boolish" values to a plain boolean value. To support this, Zod 4 introduces z.stringbool():
const strbool = z.stringbool(); strbool.parse("true")         // => truestrbool.parse("1")            // => truestrbool.parse("yes")          // => truestrbool.parse("on")           // => truestrbool.parse("y")            // => truestrbool.parse("enabled")      // => true strbool.parse("false");       // => falsestrbool.parse("0");           // => falsestrbool.parse("no");          // => falsestrbool.parse("off");         // => falsestrbool.parse("n");           // => falsestrbool.parse("disabled");    // => false strbool.parse(/* anything else */); // ZodError<[{ code: "invalid_value" }]>
To customize the truthy and falsy values:
// these are the defaultsz.stringbool({  truthy: ["true", "1", "yes", "on", "y", "enabled"],  falsy: ["false", "0", "no", "off", "n", "disabled"],});
Be default the schema is case-insensitive; all inputs are converted to lowercase before comparison to the truthy/falsy values. To make it case-sensitive:
z.stringbool({  case: "sensitive"});
Optionals
To make a schema optional (that is, to allow undefined inputs).
ZodZod Mini
z.optional(z.literal("yoda")); // or z.literal("yoda").optional()
This returns a ZodOptional instance that wraps the original schema. To extract the inner schema:
ZodZod Mini
optionalYoda.unwrap(); // ZodLiteral<"yoda">
Nullables
To make a schema nullable (that is, to allow null inputs).
ZodZod Mini
z.nullable(z.literal("yoda")); // or z.literal("yoda").nullable()
This returns a ZodNullable instance that wraps the original schema. To extract the inner schema:
ZodZod Mini
nullableYoda.unwrap(); // ZodLiteral<"yoda">
Nullish
To make a schema nullish (both optional and nullable):
ZodZod Mini
const nullishYoda = z.nullish(z.literal("yoda"));
Refer to the TypeScript manual for more about the concept of nullish.
Unknown
Zod aims to mirror TypeScript's type system one-to-one. As such, Zod provides APIs to represent the following special types:
// allows any valuesz.any(); // inferred type: `any`z.unknown(); // inferred type: `unknown`
Never
No value will pass validation.
z.never(); // inferred type: `never`
Objects
To define an object type:
 // all properties are required by default  const Person = z.object({    name: z.string(),    age: z.number(),  });  type Person = z.infer<typeof Person>;  // => { name: string; age: number; }
By default, all properties are required. To make certain properties optional:
ZodZod Mini
const Dog = z.object({  name: z.string(),  age: z.number().optional(),}); Dog.parse({ name: "Yeller" }); // ✅
By default, unrecognized keys are stripped from the parsed result:
Dog.parse({ name: "Yeller", extraKey: true });// => { name: "Yeller" }
z.strictObject
To define a strict schema that throws an error when unknown keys are found:
const StrictDog = z.strictObject({  name: z.string(),}); StrictDog.parse({ name: "Yeller", extraKey: true });// ❌ throws
z.looseObject
To define a loose schema that allows unknown keys to pass through:
const LooseDog = z.looseObject({  name: z.string(),}); Dog.parse({ name: "Yeller", extraKey: true });// => { name: "Yeller", extraKey: true }
.catchall()
To define a catchall schema that will be used to validate any unrecognized keys:
ZodZod Mini
const DogWithStrings = z.object({  name: z.string(),  age: z.number().optional(),}).catchall(z.string()); DogWithStrings.parse({ name: "Yeller", extraKey: "extraValue" }); // ✅DogWithStrings.parse({ name: "Yeller", extraKey: 42 }); // ❌
.shape
To access the internal schemas:
ZodZod Mini
Dog.shape.name; // => string schemaDog.shape.age; // => number schema
.keyof()
To create a ZodEnum schema from the keys of an object schema:
ZodZod Mini
const keySchema = Dog.keyof();// => ZodEnum<["name", "age"]>
.extend()
To add additional fields to an object schema:
ZodZod Mini
const DogWithBreed = Dog.extend({  breed: z.string(),});
This API can be used to overwrite existing fields! Be careful with this power! If the two schemas share keys, B will override A.
Alternative: destructuring — You can alternatively avoid .extend() altogether by creating a new object schema entirely. This makes the strictness level of the resulting schema visually obvious.
const DogWithBreed = z.object({ // or z.strictObject() or z.looseObject()...  ...Dog.shape,  breed: z.string(),});
You can also use this to merge multiple objects in one go.
const DogWithBreed = z.object({  ...Animal.shape,  ...Pet.shape,  breed: z.string(),});
This approach has a few advantages:
It uses language-level features (destructuring syntax) instead of library-specific APIs
The same syntax works in Zod and Zod Mini
It's more tsc-efficient — the .extend() method can be expensive on large schemas, and due to a TypeScript limitation it gets quadratically more expensive when calls are chained
If you wish, you can change the strictness level of the resulting schema by using z.strictObject() or z.looseObject()
.pick()
Inspired by TypeScript's built-in Pick and Omit utility types, Zod provides dedicated APIs for picking and omitting certain keys from an object schema.
Starting from this initial schema:
const Recipe = z.object({  title: z.string(),  description: z.string().optional(),  ingredients: z.array(z.string()),});// { title: string; description?: string | undefined; ingredients: string[] }
To pick certain keys:
ZodZod Mini
const JustTheTitle = Recipe.pick({ title: true });
.omit()
To omit certain keys:
ZodZod Mini
const RecipeNoId = Recipe.omit({ id: true });
.partial()
For convenience, Zod provides a dedicated API for making some or all properties optional, inspired by the built-in TypeScript utility type Partial.
To make all fields optional:
ZodZod Mini
const PartialRecipe = Recipe.partial();// { title?: string | undefined; description?: string | undefined; ingredients?: string[] | undefined }
To make certain properties optional:
ZodZod Mini
const RecipeOptionalIngredients = Recipe.partial({  ingredients: true,});// { title: string; description?: string | undefined; ingredients?: string[] | undefined }
.required()
Zod provides an API for making some or all properties required, inspired by TypeScript's Required utility type.
To make all properties required:
ZodZod Mini
const RequiredRecipe = Recipe.required();// { title: string; description: string; ingredients: string[] }
To make certain properties required:
ZodZod Mini
const RecipeRequiredDescription = Recipe.required({description: true});// { title: string; description: string; ingredients: string[] }
Recursive objects
To define a self-referential type, use a getter on the key. This lets JavaScript resolve the cyclical schema at runtime.
const Category = z.object({  name: z.string(),  get subcategories(){    return z.array(Category)  }}); type Category = z.infer<typeof Category>;// { name: string; subcategories: Category[] }
Though recursive schemas are supported, passing cyclical data into Zod will cause an infinite loop.
You can also represent mutually recursive types:
const User = z.object({  email: z.email(),  get posts(){    return z.array(Post)  }}); const Post = z.object({  title: z.string(),  get author(){    return User  }});
All object APIs (.pick(), .omit(), .required(), .partial(), etc.) work as you'd expect.
Circularity errors
Due to TypeScript limitations, recursive type inference can be finicky, and it only works in certain scenarios. Some more complicated types may trigger recursive type errors like this:
const Activity = z.object({  name: z.string(),  get subactivities() {    // ^ ❌ 'subactivities' implicitly has return type 'any' because it does not    // have a return type annotation and is referenced directly or indirectly    // in one of its return expressions.ts(7023)    return z.nullable(z.array(Activity));  },});
In these cases, you can resolve the error with a type annotation on the offending getter:
const Activity = z.object({  name: z.string(),  get subactivities(): z.ZodNullable<z.ZodArray<typeof Activity>> {    return z.nullable(z.array(Activity));  },});
Arrays
To define an array schema:
ZodZod Mini
const stringArray = z.array(z.string()); // or z.string().array()
To access the inner schema for an element of the array.
ZodZod Mini
stringArray.unwrap(); // => string schema
Zod implements a number of array-specific validations:
ZodZod Mini
z.array(z.string()).min(5); // must contain 5 or more itemsz.array(z.string()).max(5); // must contain 5 or fewer itemsz.array(z.string()).length(5); // must contain 5 items exactly
Tuples
Unlike arrays, tuples are typically fixed-length arrays that specify different schemas for each index.
const MyTuple = z.tuple([  z.string(),  z.number(),  z.boolean()]); type MyTuple = z.infer<typeof MyTuple>;// [string, number, boolean]
To add a variadic ("rest") argument:
const variadicTuple = z.tuple([z.string()], z.number());// => [string, ...number[]];
Unions
Union types (A | B) represent a logical "OR". Zod union schemas will check the input against each option in order. The first value that validates successfully is returned.
const stringOrNumber = z.union([z.string(), z.number()]);// string | number stringOrNumber.parse("foo"); // passesstringOrNumber.parse(14); // passes
To extract the internal option schemas:
ZodZod Mini
stringOrNumber.options; // [ZodString, ZodNumber]
Discriminated unions
A discriminated union is a special kind of union in which a) all the options are object schemas that b) share a particular key (the "discriminator"). Based on the value of the discriminator key, TypeScript is able to "narrow" the type signature as you'd expect.
type MyResult =  | { status: "success"; data: string }  | { status: "failed"; error: string }; function handleResult(result: MyResult){  if(result.status === "success"){    result.data; // string  } else {    result.error; // string  }}
You could represent it with a regular z.union(). But regular unions are naive—they check the input against each option in order and return the first one that passes. This can be slow for large unions.
So Zod provides a z.discriminatedUnion() API that uses a discriminator key to make parsing more efficient.
const MyResult = z.discriminatedUnion("status", [  z.object({ status: z.literal("success"), data: z.string() }),  z.object({ status: z.literal("failed"), error: z.string() }),]);
Nesting discriminated unions
Intersections
Intersection types (A & B) represent a logical "AND".
const a = z.union([z.number(), z.string()]);const b = z.union([z.number(), z.boolean()]);const c = z.intersection(a, b); type c = z.infer<typeof c>; // => number
This can be useful for intersecting two object types.
const Person = z.object({ name: z.string() });type Person = z.infer<typeof Person>; const Employee = z.object({ role: z.string() });type Employee = z.infer<typeof Employee>; const EmployedPerson = z.intersection(Person, Employee);type EmployedPerson = z.infer<typeof EmployedPerson>;// Person & Employee
When merging object schemas, prefer A.extend(B) over intersections. Using .extend() will gve you a new object schema, whereas z.intersection(A, B) returns a ZodIntersection instance which lacks common object methods like pick and omit.
Records
Record schemas are used to validate types such as Record<string, number>.
const IdCache = z.record(z.string(), z.string());type IdCache = z.infer<typeof IdCache>; // Record<string, string> IdCache.parse({  carlotta: "77d2586b-9e8e-4ecf-8b21-ea7e0530eadd",  jimmie: "77d2586b-9e8e-4ecf-8b21-ea7e0530eadd",});
The key schema can be any Zod schema that is assignable to string | number | symbol.
const Keys = z.union([z.string(), z.number(), z.symbol()]);const AnyObject = z.record(Keys, z.unknown());// Record<string | number | symbol, unknown>
To create an object schemas containing keys defined by an enum:
const Keys = z.enum(["id", "name", "email"]);const Person = z.record(Keys, z.string());// { id: string; name: string; email: string }
Zod 4 — In Zod 4, if you pass a z.enum as the first argument to z.record(), Zod will exhaustively check that all enum values exist in the input as keys. This behavior agrees with TypeScript:
type MyRecord = Record<"a" | "b", string>;const myRecord: MyRecord = { a: "foo", b: "bar" }; // ✅const myRecord: MyRecord = { a: "foo" }; // ❌ missing required key `b`
In Zod 3, exhaustiveness was not checked. To replicate the old behavior, use z.partialRecord().
If you want a partial record type, use z.partialRecord(). This skips the special exhaustiveness checks Zod normally runs with z.enum() and z.literal() key schemas.
const Keys = z.enum(["id", "name", "email"]).or(z.never()); const Person = z.partialRecord(Keys, z.string());// { id?: string; name?: string; email?: string }
A note on numeric keys
Maps
const StringNumberMap = z.map(z.string(), z.number());type StringNumberMap = z.infer<typeof StringNumberMap>; // Map<string, number> const myMap: StringNumberMap = new Map();myMap.set("one", 1);myMap.set("two", 2); StringNumberMap.parse(myMap);
Sets
const NumberSet = z.set(z.number());type NumberSet = z.infer<typeof NumberSet>; // Set<number> const mySet: NumberSet = new Set();mySet.add(1);mySet.add(2);NumberSet.parse(mySet);
Set schemas can be further constrained with the following utility methods.
ZodZod Mini
z.set(z.string()).min(5); // must contain 5 or more itemsz.set(z.string()).max(5); // must contain 5 or fewer itemsz.set(z.string()).size(5); // must contain 5 items exactly
Files
To validate File instances:
ZodZod Mini
const fileSchema = z.file(); fileSchema.min(10_000); // minimum .size (bytes)fileSchema.max(1_000_000); // maximum .size (bytes)fileSchema.mime("image/png"); // MIME typefileSchema.mime(["image/png", "image/jpeg"]); // multiple MIME types
Promises
Deprecated — z.promise() is deprecated in Zod 4. There are vanishingly few valid uses cases for a Promise schema. If you suspect a value might be a Promise, simply await it before parsing it with Zod.
See z.promise() documentation
Instanceof
You can use z.instanceof to check that the input is an instance of a class. This is useful to validate inputs against classes that are exported from third-party libraries.
class Test {  name: string;} const TestSchema = z.instanceof(Test); TestSchema.parse(new Test()); // ✅TestSchema.parse("whatever"); // ❌
Refinements
Every Zod schema stores an array of refinements. Refinements are a way to perform custom validation that Zod doesn't provide a native API for.
.refine()
ZodZod Mini
const myString = z.string().refine((val) => val.length <= 255);
Refinement functions should never throw. Instead they should return a falsy value to signal failure. Thrown errors are not caught by Zod.
error
To customize the error message:
ZodZod Mini
const myString = z.string().refine((val) => val.length > 8, {  error: "Too short!" });
abort
By default, validation issues from checks are considered continuable; that is, Zod will execute all checks in sequence, even if one of them causes a validation error. This is usually desirable, as it means Zod can surface as many errors as possible in one go.
ZodZod Mini
const myString = z.string()  .refine((val) => val.length > 8, { error: "Too short!" })  .refine((val) => val === val.toLowerCase(), { error: "Must be lowercase" });  const result = myString.safeParse("OH NO");result.error.issues;/* [  { "code": "custom", "message": "Too short!" },  { "code": "custom", "message": "Must be lowercase" }] */
To mark a particular refinement as non-continuable, use the abort parameter. Validation will terminate if the check fails.
ZodZod Mini
const myString = z.string()  .refine((val) => val.length > 8, { error: "Too short!", abort: true })  .refine((val) => val === val.toLowerCase(), { error: "Must be lowercase", abort: true }); const result = myString.safeParse("OH NO");result.error!.issues;// => [{ "code": "custom", "message": "Too short!" }]
path
To customize the error path, use the path parameter. This is typically only useful in the context of object schemas.
ZodZod Mini
const passwordForm = z  .object({    password: z.string(),    confirm: z.string(),  })  .refine((data) => data.password === data.confirm, {    message: "Passwords don't match",    path: ["confirm"], // path of error  });
This will set the path parameter in the associated issue:
ZodZod Mini
const result = passwordForm.safeParse({ password: "asdf", confirm: "qwer" });result.error.issues;/* [{  "code": "custom",  "path": [ "confirm" ],  "message": "Passwords don't match"}] */
To define an asynchronous refinement, just pass an async function:
const userId = z.string().refine(async (id) => {  // verify that ID exists in database  return true;});
If you use async refinements, you must use the .parseAsync method to parse data! Otherwise Zod will throw an error.
ZodZod Mini
const result = await userId.parseAsync("abc123");
when
Note — This is a power user feature and can absolutely be abused in ways that will increase the probability of uncaught errors originating from inside your refinements.
By default, refinements don't run if any non-continuable issues have already been encountered. Zod is careful to ensure the type signature of the value is correct before passing it into any refinement functions.
const schema = z.string().refine((val) => {  return val.length > 8}); schema.parse(1234); // invalid_type: refinement won't be executed
In some cases, you want finer control over when refinements run. For instance consider this "password confirm" check:
ZodZod Mini
const schema = z  .object({    password: z.string().min(8),    confirmPassword: z.string(),    anotherField: z.string(),  })  .refine((data) => data.password === data.confirmPassword, {    message: "Passwords do not match",    path: ["confirmPassword"],  }); schema.parse({  password: "asdf",  confirmPassword: "asdf",  anotherField: 1234 // ❌ this error will prevent the password check from running});
An error on anotherField will prevent the password confirmation check from executing, even though the check doesn't depend on anotherField. To control when a refinement will run, use the when parameter:
ZodZod Mini
const schema = z  .object({    password: z.string().min(8),    confirmPassword: z.string(),    anotherField: z.string(),  })  .refine((data) => data.password === data.confirmPassword, {    message: "Passwords do not match",    path: ["confirmPassword"],    // run if password & confirmPassword are valid    when(payload) {      return schema        .pick({ password: true, confirmPassword: true })        .safeParse(payload.value).success;    },   }); schema.parse({  password: "asdf",  confirmPassword: "asdf",  anotherField: 1234 // ❌ this error will prevent the password check from running});
.superRefine()
In Zod 4, .superRefine() has been deprecated in favor of .check()
View .superRefine() example
.check()
The .refine() API is syntactic sugar atop a more versatile (and verbose) API called .check(). You can use this API to create multiple issues in a single refinement or have full control of the generated issue objects.
ZodZod Mini
const UniqueStringArray = z.array(z.string()).check((ctx) => {  if (ctx.value.length > 3) {    // full control of issue objects    ctx.issues.push({      code: "too_big",      maximum: 3,      origin: "array",      inclusive: true,      message: "Too many items 😡",      input: ctx.value    });  }  // create multiple issues in one refinement  if (ctx.value.length !== new Set(ctx.value).size) {    ctx.issues.push({      code: "custom",      message: `No duplicates allowed.`,      input: ctx.value,      continue: true // make this issue continuable (default: false)    });  }});
The regular .refine API only generates issues with a "custom" error code, but .check() makes it possible to throw other issue types. For more information on Zod's internal issue types, read the Error customization docs.
Pipes
Schemas can be chained together into "pipes". Pipes are primarily useful when used in conjunction with Transforms.
ZodZod Mini
const stringToLength = z.string().pipe(z.transform(val => val.length)); stringToLength.parse("hello"); // => 5
Transforms
Transforms are a special kind of schema. Instead of validating input, they accept anything and perform some transformation on the data. To define a transform:
ZodZod Mini
const castToString = z.transform((val) => String(val)); castToString.parse("asdf"); // => "asdf"castToString.parse(123); // => "123"castToString.parse(true); // => "true"
To perform validation logic inside a transform, use ctx. To report a validation issue, push a new issue onto ctx.issues (similar to the .check() API).
const coercedInt = z.transform((val, ctx) => {  try {    const parsed = Number.parseInt(String(val));    return parsed;  } catch (e) {    ctx.issues.push({      code: "custom",      message: "Not a number",      input: val,    });    // this is a special constant with type `never`    // returning it lets you exit the transform without impacting the inferred return type    return z.NEVER;  }});
Most commonly, transforms are used in conjunction with Pipes. This combination is useful for performing some initial validation, then transforming the parsed data into another form.
ZodZod Mini
const stringToLength = z.string().pipe(z.transform(val => val.length)); stringToLength.parse("hello"); // => 5
.transform()
Piping some schema into a transform is a common pattern, so Zod provides a convenience .transform() method.
ZodZod Mini
const stringToLength = z.string().transform(val => val.length);
Transforms can also be async:
ZodZod Mini
const idToUser = z  .string()  .transform(async (id) => {    // fetch user from database    return db.getUserById(id);  }); const user = await idToUser.parseAsync("abc123");
If you use async transforms, you must use a .parseAsync or .safeParseAsync when parsing data! Otherwise Zod will throw an error.
.preprocess()
Piping a transform into another schema is another common pattern, so Zod provides a convenience z.preprocess() function.
const coercedInt = z.preprocess((val) => {  if (typeof val === "string") {    return Number.parseInt(val);  }  return val;}, z.int());
Defaults
To set a default value for a schema:
ZodZod Mini
const defaultTuna = z.string().default("tuna"); defaultTuna.parse(undefined); // => "tuna"
Alternatively, you can pass a function which will be re-executed whenever a default value needs to be generated:
ZodZod Mini
const randomDefault = z.number().default(Math.random); randomDefault.parse(undefined);    // => 0.4413456736055323randomDefault.parse(undefined);    // => 0.1871840107401901randomDefault.parse(undefined);    // => 0.7223408162401552
Prefaults
In Zod, setting a default value will short-circuit the parsing process. If the input is undefined, the default value is eagerly returned. As such, the default value must be assignable to the output type of the schema.
const schema = z.string().transform(val => val.length).default(0);schema.parse(undefined); // => 0
Sometimes, it's useful to define a prefault ("pre-parse default") value. If the input is undefined, the prefault value will be parsed instead. The parsing process is not short circuited. As such, the prefault value must be assignable to the input type of the schema.
z.string().transform(val => val.length).prefault("tuna");schema.parse(undefined); // => 4
This is also useful if you want to pass some input value through some mutating refinements.
const a = z.string().trim().toUpperCase().prefault("  tuna  ");a.parse(undefined); // => "TUNA" const b = z.string().trim().toUpperCase().default("  tuna  ");b.parse(undefined); // => "  tuna  "
Catch
Use .catch() to define a fallback value to be returned in the event of a validation error:
ZodZod Mini
const numberWithCatch = z.number().catch(42); numberWithCatch.parse(5); // => 5numberWithCatch.parse("tuna"); // => 42
Alternatively, you can pass a function which will be re-executed whenever a catch value needs to be generated.
ZodZod Mini
const numberWithRandomCatch = z.number().catch((ctx) => {  ctx.error; // the caught ZodError  return Math.random();}); numberWithRandomCatch.parse("sup"); // => 0.4413456736055323numberWithRandomCatch.parse("sup"); // => 0.1871840107401901numberWithRandomCatch.parse("sup"); // => 0.7223408162401552
Branded types
TypeScript's type system is structural, meaning that two types that are structurally equivalent are considered the same.
type Cat = { name: string };type Dog = { name: string }; const pluto: Dog = { name: "pluto" };const simba: Cat = pluto; // works fine
In some cases, it can be desirable to simulate nominal typing inside TypeScript. This can be achieved with branded types (also known as "opaque types").
const Cat = z.object({ name: z.string() }).brand<"Cat">();const Dog = z.object({ name: z.string() }).brand<"Dog">(); type Cat = z.infer<typeof Cat>; // { name: string } & z.$brand<"Cat">type Dog = z.infer<typeof Dog>; // { name: string } & z.$brand<"Dog"> const pluto = Dog.parse({ name: "pluto" });const simba: Cat = pluto; // ❌ not allowed
Under the hood, this works by attaching a "brand" to the schema's inferred type.
const Cat = z.object({ name: z.string() }).brand<"Cat">();type Cat = z.infer<typeof Cat>; // { name: string } & z.$brand<"Cat">
With this brand, any plain (unbranded) data structures are no longer assignable to the inferred type. You have to parse some data with the schema to get branded data.
Note that branded types do not affect the runtime result of .parse. It is a static-only construct.
Readonly
To mark a schema as readonly:
ZodZod Mini
const ReadonlyUser = z.object({ name: z.string() }).readonly();type ReadonlyUser = z.infer<typeof ReadonlyUser>;// Readonly<{ name: string }>
The inferred type of the new schemas will be marked as readonly. Note that in TypeScript, this only affects objects, arrays, tuples, Set, and Map:
ZodZod Mini
z.object({ name: z.string() }).readonly(); // { readonly name: string }z.array(z.string()).readonly(); // readonly string[]z.tuple([z.string(), z.number()]).readonly(); // readonly [string, number]z.map(z.string(), z.date()).readonly(); // ReadonlyMap<string, Date>z.set(z.string()).readonly(); // ReadonlySet<string>
Inputs will be parsed like normal, then the result will be frozen with Object.freeze() to prevent modifications.
ZodZod Mini
const result = ReadonlyUser.parse({ name: "fido" });result.name = "simba"; // throws TypeError
JSON
To validate any JSON-encodable value:
const jsonSchema = z.json();
This is a convenience API that returns the following union schema:
const jsonSchema = z.lazy(() => {  return z.union([    z.string(params),    z.number(),    z.boolean(),    z.null(),    z.array(jsonSchema),    z.record(z.string(), jsonSchema)  ]);});
Custom
You can create a Zod schema for any TypeScript type by using z.custom(). This is useful for creating schemas for types that are not supported by Zod out of the box, such as template string literals.
const px = z.custom<`${number}px`>((val) => {  return typeof val === "string" ? /^\d+px$/.test(val) : false;}); type px = z.infer<typeof px>; // `${number}px` px.parse("42px"); // "42px"px.parse("42vw"); // throws;
If you don't provide a validation function, Zod will allow any value. This can be dangerous!
z.custom<{ arg: string }>(); // performs no validation
You can customize the error message and other options by passing a second argument. This parameter works the same way as the params parameter of .refine.
z.custom<...>((val) => ..., "custom error message");
Functions
In Zod 4, z.function() no longer returns a Zod schema.
Zod provides a z.function() utility for defining Zod-validated functions. This way, you can avoid intermixing validation code with your business logic.
const MyFunction = z.function({  input: [z.string()], // parameters (must be an array or a ZodTuple)  output: z.number()  // return type});
Function schemas have an .implement() method which accepts a function and returns a new function that automatically validates its inputs and outputs.
const computeTrimmedLength = MyFunction.implement((input) => {  // TypeScript knows input is a string!  return input.trim().length;}); computeTrimmedLength("sandwich"); // => 8computeTrimmedLength(" asdf "); // => 4
This function will throw a ZodError if the input is invalid:
computeTrimmedLength(42); // throws ZodError
If you only care about validating inputs, you can omit the output field.
const MyFunction = z.function({  input: [z.string()], // parameters (must be an array or a ZodTuple)}); const computeTrimmedLength = MyFunction.implement((input) => input.trim.length);
Edit on GitHub
Next
Basic usage
Next
Customizing errors
On this page
Primitives
Coercion
Literals
Strings
String formats
Emails
UUIDs
URLs
ISO datetimes
ISO dates
ISO times
IP addresses
IP blocks (CIDR)
Template literals
Numbers
Integers
BigInts
Booleans
Dates
Enums
.enum
.exclude()
.extract()
Stringbools
Optionals
Nullables
Nullish
Unknown
Never
Objects
z.strictObject
z.looseObject
.catchall()
.shape
.keyof()
.extend()
.pick()
.omit()
.partial()
.required()
Recursive objects
Circularity errors
Arrays
Tuples
Unions
Discriminated unions
Intersections
Records
Maps
Sets
Files
Promises
Instanceof
Refinements
.refine()
.superRefine()
.check()
Pipes
Transforms
.transform()
.preprocess()
Defaults
Prefaults
Catch
Branded types
Readonly
JSON
Custom
Functions




Defining schemas
To validate data, you must first define a schema. Schemas represent types, from simple primitive values to complex nested objects and arrays.
Primitives
import * as z from "zod"; // primitive typesz.string();z.number();z.bigint();z.boolean();z.symbol();z.undefined();z.null();
Coercion
To coerce input data to the appropriate type, use z.coerce instead:
z.coerce.string();    // String(input)z.coerce.number();    // Number(input)z.coerce.boolean();   // Boolean(input)z.coerce.bigint();    // BigInt(input)
The coerced variant of these schemas attempts to convert the input value to the appropriate type.
const schema = z.coerce.string(); schema.parse("tuna");    // => "tuna"schema.parse(42);        // => "42"schema.parse(true);      // => "true"schema.parse(null);      // => "null"
How coercion works in Zod
Literals
Literal schemas represent a literal type, like "hello world" or 5.
const tuna = z.literal("tuna");const twelve = z.literal(12);const twobig = z.literal(2n);const tru = z.literal(true);
To represent the JavaScript literals null and undefined:
z.null();z.undefined();z.void(); // equivalent to z.undefined()
To allow multiple literal values:
const colors = z.literal(["red", "green", "blue"]); colors.parse("green"); // ✅colors.parse("yellow"); // ❌
To extract the set of allowed values from a literal schema:
ZodZod Mini
colors.values; // => Set<"red" | "green" | "blue">
Strings
Zod provides a handful of built-in string validation and transform APIs. To perform some common string validations:
ZodZod Mini
z.string().max(5);z.string().min(5);z.string().length(5);z.string().regex(/^[a-z]+$/);z.string().startsWith("aaa");z.string().endsWith("zzz");z.string().includes("---");z.string().uppercase();z.string().lowercase();
To perform some simple string transforms:
ZodZod Mini
z.string().trim(); // trim whitespacez.string().toLowerCase(); // toLowerCasez.string().toUpperCase(); // toUpperCase
String formats
To validate against some common string formats:
z.email();z.uuid();z.url();z.emoji();         // validates a single emoji characterz.base64();z.base64url();z.nanoid();z.cuid();z.cuid2();z.ulid();z.ipv4();z.ipv6();z.cidrv4();        // ipv4 CIDR blockz.cidrv6();        // ipv6 CIDR blockz.iso.date();z.iso.time();z.iso.datetime();z.iso.duration();
Emails
To validate email addresses:
z.email();
By default, Zod uses a comparatively strict email regex designed to validate normal email addresses containing common characters. It's roughly equivalent to the rules enforced by Gmail. To learn more about this regex, refer to this post.
/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i
To customize the email validation behavior, you can pass a custom regular expression to the pattern param.
z.email({ pattern: /your regex here/ });
Zod exports several useful regexes you could use.
// Zod's default email regexz.email();z.email({ pattern: z.regexes.email }); // equivalent // the regex used by browsers to validate input[type=email] fields// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/emailz.email({ pattern: z.regexes.html5Email }); // the classic emailregex.com regex (RFC 5322)z.email({ pattern: z.regexes.rfc5322Email }); // a loose regex that allows Unicode (good for intl emails)z.email({ pattern: z.regexes.unicodeEmail });
UUIDs
To validate UUIDs:
z.uuid();
To specify a particular UUID version:
// supports "v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8"z.uuid({ version: "v4" }); // for conveniencez.uuidv4();z.uuidv6();z.uuidv7();
The RFC 9562/4122 UUID spec requires the first two bits of byte 8 to be 10. Other UUID-like identifiers do not enforce this constraint. To validate any UUID-like identifier:
z.guid();
URLs
To validate any WHATWG-compatible URL:
const schema = z.url(); schema.parse("https://example.com"); // ✅schema.parse("http://localhost"); // ✅schema.parse("mailto:noreply@zod.dev"); // ✅schema.parse("sup"); // ✅
As you can see this is quite permissive. Internally this uses the new URL() constructor to validate inputs; this behavior may differ across platforms and runtimes but it's the mostly rigorous way to validate URIs/URLs on any given JS runtime/engine.
To validate the hostname against a specific regex:
const schema = z.url({ hostname: /^example\.com$/ }); schema.parse("https://example.com"); // ✅schema.parse("https://zombo.com"); // ❌
To validate the protocol against a specific regex, use the protocol param.
const schema = z.url({ protocol: /^https$/ }); schema.parse("https://example.com"); // ✅schema.parse("http://example.com"); // ❌
Web URLs — In many cases, you'll want to validate Web URLs specifically. Here's the recommended schema for doing so:
const httpUrl = z.url({  protocol: /^https?$/,  hostname: z.regexes.domain});
This restricts the protocol to http/https and ensures the hostname is a valid domain name with the z.regexes.domain regular expression:
/^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
ISO datetimes
As you may have noticed, Zod string includes a few date/time related validations. These validations are regular expression based, so they are not as strict as a full date/time library. However, they are very convenient for validating user input.
The z.iso.datetime() method enforces ISO 8601; by default, no timezone offsets are allowed:
const datetime = z.iso.datetime(); datetime.parse("2020-01-01T06:15:00Z"); // ✅datetime.parse("2020-01-01T06:15:00.123Z"); // ✅datetime.parse("2020-01-01T06:15:00.123456Z"); // ✅ (arbitrary precision)datetime.parse("2020-01-01T06:15:00+02:00"); // ❌ (offsets not allowed)datetime.parse("2020-01-01T06:15:00"); // ❌ (local not allowed)
To allow timezone offsets:
const datetime = z.iso.datetime({ offset: true }); // allows timezone offsetsdatetime.parse("2020-01-01T06:15:00+02:00"); // ✅ // basic offsets not alloweddatetime.parse("2020-01-01T06:15:00+02");    // ❌datetime.parse("2020-01-01T06:15:00+0200");  // ❌ // Z is still supporteddatetime.parse("2020-01-01T06:15:00Z"); // ✅
To allow unqualified (timezone-less) datetimes:
const schema = z.iso.datetime({ local: true });schema.parse("2020-01-01T06:15:01"); // ✅schema.parse("2020-01-01T06:15"); // ✅ seconds optional
To constrain the allowable time precision. By default, seconds are optional and arbitrary sub-second precision is allowed.
const a = z.iso.datetime();a.parse("2020-01-01T06:15Z"); // ✅a.parse("2020-01-01T06:15:00Z"); // ✅a.parse("2020-01-01T06:15:00.123Z"); // ✅ const b = z.iso.datetime({ precision: -1 }); // minute precision (no seconds)b.parse("2020-01-01T06:15Z"); // ✅b.parse("2020-01-01T06:15:00Z"); // ❌b.parse("2020-01-01T06:15:00.123Z"); // ❌ const c = z.iso.datetime({ precision: 0 }); // second precision onlyc.parse("2020-01-01T06:15Z"); // ❌c.parse("2020-01-01T06:15:00Z"); // ✅c.parse("2020-01-01T06:15:00.123Z"); // ❌ const d = z.iso.datetime({ precision: 3 }); // millisecond precision onlyd.parse("2020-01-01T06:15Z"); // ❌d.parse("2020-01-01T06:15:00Z"); // ❌d.parse("2020-01-01T06:15:00.123Z"); // ✅
ISO dates
The z.iso.date() method validates strings in the format YYYY-MM-DD.
const date = z.iso.date(); date.parse("2020-01-01"); // ✅date.parse("2020-1-1"); // ❌date.parse("2020-01-32"); // ❌
ISO times
The z.iso.time() method validates strings in the format HH:MM[:SS[.s+]]. By default seconds are optional, as are sub-second deciams.
const time = z.iso.time(); time.parse("03:15"); // ✅time.parse("03:15:00"); // ✅time.parse("03:15:00.9999999"); // ✅ (arbitrary precision)
No offsets of any kind are allowed.
time.parse("03:15:00Z"); // ❌ (no `Z` allowed)time.parse("03:15:00+02:00"); // ❌ (no offsets allowed)
Use the precision parameter to constrain the allowable decimal precision.
z.iso.time({ precision: -1 }); // HH:MM (minute precision)z.iso.time({ precision: 0 }); // HH:MM:SS (second precision)z.iso.time({ precision: 1 }); // HH:MM:SS.s (decisecond precision)z.iso.time({ precision: 2 }); // HH:MM:SS.ss (centisecond precision)z.iso.time({ precision: 3 }); // HH:MM:SS.sss (millisecond precision)
IP addresses
const ipv4 = z.ipv4();ipv4.parse("192.168.0.0"); // ✅ const ipv6 = z.ipv6();ipv6.parse("2001:db8:85a3::8a2e:370:7334"); // ✅
IP blocks (CIDR)
Validate IP address ranges specified with CIDR notation.
const cidrv4 = z.string().cidrv4();cidrv4.parse("192.168.0.0/24"); // ✅ const cidrv6 = z.string().cidrv6();cidrv6.parse("2001:db8::/32"); // ✅
Template literals
New in Zod 4
To define a template literal schema:
const schema = z.templateLiteral([ "hello, ", z.string(), "!" ]);// `hello, ${string}!`
The z.templateLiteral API can handle any number of string literals (e.g. "hello") and schemas. Any schema with an inferred type that's assignable to string | number | bigint | boolean | null | undefined can be passed.
z.templateLiteral([ "hi there" ]);// `hi there` z.templateLiteral([ "email: ", z.string() ]);// `email: ${string}` z.templateLiteral([ "high", z.literal(5) ]);// `high5` z.templateLiteral([ z.nullable(z.literal("grassy")) ]);// `grassy` | `null` z.templateLiteral([ z.number(), z.enum(["px", "em", "rem"]) ]);// `${number}px` | `${number}em` | `${number}rem`
Numbers
Use z.number() to validate numbers. It allows any finite number.
const schema = z.number(); schema.parse(3.14);      // ✅schema.parse(NaN);       // ❌schema.parse(Infinity);  // ❌
Zod implements a handful of number-specific validations:
ZodZod Mini
z.number().gt(5);z.number().gte(5);                     // alias .min(5)z.number().lt(5);z.number().lte(5);                     // alias .max(5)z.number().positive();       z.number().nonnegative();    z.number().negative(); z.number().nonpositive(); z.number().multipleOf(5);              // alias .step(5)
If (for some reason) you want to validate NaN, use z.nan().
z.nan().parse(NaN);              // ✅z.nan().parse("anything else");  // ❌
Integers
To validate integers:
z.int();     // restricts to safe integer rangez.int32();   // restrict to int32 range
BigInts
To validate BigInts:
z.bigint();
Zod includes a handful of bigint-specific validations.
ZodZod Mini
z.bigint().gt(5n);z.bigint().gte(5n);                    // alias `.min(5n)`z.bigint().lt(5n);z.bigint().lte(5n);                    // alias `.max(5n)`z.bigint().positive(); z.bigint().nonnegative(); z.bigint().negative(); z.bigint().nonpositive(); z.bigint().multipleOf(5n);             // alias `.step(5n)`
Booleans
To validate boolean values:
z.boolean().parse(true); // => truez.boolean().parse(false); // => false
Dates
Use z.date() to validate Date instances.
z.date().safeParse(new Date()); // success: truez.date().safeParse("2022-01-12T06:15:00.000Z"); // success: false
To customize the error message:
z.date({  error: issue => issue.input === undefined ? "Required" : "Invalid date"});
Zod provides a handful of date-specific validations.
ZodZod Mini
z.date().min(new Date("1900-01-01"), { error: "Too old!" });z.date().max(new Date(), { error: "Too young!" });
Enums
Use z.enum to validate inputs against a fixed set of allowable string values.
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]); FishEnum.parse("Salmon"); // => "Salmon"FishEnum.parse("Swordfish"); // => ❌
Careful — If you declare your string array as a variable, Zod won't be able to properly infer the exact values of each element.
const fish = ["Salmon", "Tuna", "Trout"]; const FishEnum = z.enum(fish);type FishEnum = z.infer<typeof FishEnum>; // string
To fix this, always pass the array directly into the z.enum() function, or use as const.
const fish = ["Salmon", "Tuna", "Trout"] as const; const FishEnum = z.enum(fish);type FishEnum = z.infer<typeof FishEnum>; // "Salmon" | "Tuna" | "Trout"
You can also pass in an externally-declared TypeScript enum.
Zod 4 — This replaces the z.nativeEnum() API in Zod 3.
Note that using TypeScript's enum keyword is not recommended.
enum Fish {  Salmon = "Salmon",  Tuna = "Tuna",  Trout = "Trout",} const FishEnum = z.enum(Fish);
.enum
To extract the schema's values as an enum-like object:
ZodZod Mini
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]); FishEnum.enum;// => { Salmon: "Salmon", Tuna: "Tuna", Trout: "Trout" }
.exclude()
To create a new enum schema, excluding certain values:
ZodZod Mini
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);const TunaOnly = FishEnum.exclude(["Salmon", "Trout"]);
.extract()
To create a new enum schema, extracting certain values:
ZodZod Mini
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);const SalmonAndTroutOnly = FishEnum.extract(["Salmon", "Trout"]);
Stringbools
💎 New in Zod 4
In some cases (e.g. parsing environment variables) it's valuable to parse certain string "boolish" values to a plain boolean value. To support this, Zod 4 introduces z.stringbool():
const strbool = z.stringbool(); strbool.parse("true")         // => truestrbool.parse("1")            // => truestrbool.parse("yes")          // => truestrbool.parse("on")           // => truestrbool.parse("y")            // => truestrbool.parse("enabled")      // => true strbool.parse("false");       // => falsestrbool.parse("0");           // => falsestrbool.parse("no");          // => falsestrbool.parse("off");         // => falsestrbool.parse("n");           // => falsestrbool.parse("disabled");    // => false strbool.parse(/* anything else */); // ZodError<[{ code: "invalid_value" }]>
To customize the truthy and falsy values:
// these are the defaultsz.stringbool({  truthy: ["true", "1", "yes", "on", "y", "enabled"],  falsy: ["false", "0", "no", "off", "n", "disabled"],});
Be default the schema is case-insensitive; all inputs are converted to lowercase before comparison to the truthy/falsy values. To make it case-sensitive:
z.stringbool({  case: "sensitive"});
Optionals
To make a schema optional (that is, to allow undefined inputs).
ZodZod Mini
z.optional(z.literal("yoda")); // or z.literal("yoda").optional()
This returns a ZodOptional instance that wraps the original schema. To extract the inner schema:
ZodZod Mini
optionalYoda.unwrap(); // ZodLiteral<"yoda">
Nullables
To make a schema nullable (that is, to allow null inputs).
ZodZod Mini
z.nullable(z.literal("yoda")); // or z.literal("yoda").nullable()
This returns a ZodNullable instance that wraps the original schema. To extract the inner schema:
ZodZod Mini
nullableYoda.unwrap(); // ZodLiteral<"yoda">
Nullish
To make a schema nullish (both optional and nullable):
ZodZod Mini
const nullishYoda = z.nullish(z.literal("yoda"));
Refer to the TypeScript manual for more about the concept of nullish.
Unknown
Zod aims to mirror TypeScript's type system one-to-one. As such, Zod provides APIs to represent the following special types:
// allows any valuesz.any(); // inferred type: `any`z.unknown(); // inferred type: `unknown`
Never
No value will pass validation.
z.never(); // inferred type: `never`
Objects
To define an object type:
 // all properties are required by default  const Person = z.object({    name: z.string(),    age: z.number(),  });  type Person = z.infer<typeof Person>;  // => { name: string; age: number; }
By default, all properties are required. To make certain properties optional:
ZodZod Mini
const Dog = z.object({  name: z.string(),  age: z.number().optional(),}); Dog.parse({ name: "Yeller" }); // ✅
By default, unrecognized keys are stripped from the parsed result:
Dog.parse({ name: "Yeller", extraKey: true });// => { name: "Yeller" }
z.strictObject
To define a strict schema that throws an error when unknown keys are found:
const StrictDog = z.strictObject({  name: z.string(),}); StrictDog.parse({ name: "Yeller", extraKey: true });// ❌ throws
z.looseObject
To define a loose schema that allows unknown keys to pass through:
const LooseDog = z.looseObject({  name: z.string(),}); Dog.parse({ name: "Yeller", extraKey: true });// => { name: "Yeller", extraKey: true }
.catchall()
To define a catchall schema that will be used to validate any unrecognized keys:
ZodZod Mini
const DogWithStrings = z.object({  name: z.string(),  age: z.number().optional(),}).catchall(z.string()); DogWithStrings.parse({ name: "Yeller", extraKey: "extraValue" }); // ✅DogWithStrings.parse({ name: "Yeller", extraKey: 42 }); // ❌
.shape
To access the internal schemas:
ZodZod Mini
Dog.shape.name; // => string schemaDog.shape.age; // => number schema
.keyof()
To create a ZodEnum schema from the keys of an object schema:
ZodZod Mini
const keySchema = Dog.keyof();// => ZodEnum<["name", "age"]>
.extend()
To add additional fields to an object schema:
ZodZod Mini
const DogWithBreed = Dog.extend({  breed: z.string(),});
This API can be used to overwrite existing fields! Be careful with this power! If the two schemas share keys, B will override A.
Alternative: destructuring — You can alternatively avoid .extend() altogether by creating a new object schema entirely. This makes the strictness level of the resulting schema visually obvious.
const DogWithBreed = z.object({ // or z.strictObject() or z.looseObject()...  ...Dog.shape,  breed: z.string(),});
You can also use this to merge multiple objects in one go.
const DogWithBreed = z.object({  ...Animal.shape,  ...Pet.shape,  breed: z.string(),});
This approach has a few advantages:
It uses language-level features (destructuring syntax) instead of library-specific APIs
The same syntax works in Zod and Zod Mini
It's more tsc-efficient — the .extend() method can be expensive on large schemas, and due to a TypeScript limitation it gets quadratically more expensive when calls are chained
If you wish, you can change the strictness level of the resulting schema by using z.strictObject() or z.looseObject()
.pick()
Inspired by TypeScript's built-in Pick and Omit utility types, Zod provides dedicated APIs for picking and omitting certain keys from an object schema.
Starting from this initial schema:
const Recipe = z.object({  title: z.string(),  description: z.string().optional(),  ingredients: z.array(z.string()),});// { title: string; description?: string | undefined; ingredients: string[] }
To pick certain keys:
ZodZod Mini
const JustTheTitle = Recipe.pick({ title: true });
.omit()
To omit certain keys:
ZodZod Mini
const RecipeNoId = Recipe.omit({ id: true });
.partial()
For convenience, Zod provides a dedicated API for making some or all properties optional, inspired by the built-in TypeScript utility type Partial.
To make all fields optional:
ZodZod Mini
const PartialRecipe = Recipe.partial();// { title?: string | undefined; description?: string | undefined; ingredients?: string[] | undefined }
To make certain properties optional:
ZodZod Mini
const RecipeOptionalIngredients = Recipe.partial({  ingredients: true,});// { title: string; description?: string | undefined; ingredients?: string[] | undefined }
.required()
Zod provides an API for making some or all properties required, inspired by TypeScript's Required utility type.
To make all properties required:
ZodZod Mini
const RequiredRecipe = Recipe.required();// { title: string; description: string; ingredients: string[] }
To make certain properties required:
ZodZod Mini
const RecipeRequiredDescription = Recipe.required({description: true});// { title: string; description: string; ingredients: string[] }
Recursive objects
To define a self-referential type, use a getter on the key. This lets JavaScript resolve the cyclical schema at runtime.
const Category = z.object({  name: z.string(),  get subcategories(){    return z.array(Category)  }}); type Category = z.infer<typeof Category>;// { name: string; subcategories: Category[] }
Though recursive schemas are supported, passing cyclical data into Zod will cause an infinite loop.
You can also represent mutually recursive types:
const User = z.object({  email: z.email(),  get posts(){    return z.array(Post)  }}); const Post = z.object({  title: z.string(),  get author(){    return User  }});
All object APIs (.pick(), .omit(), .required(), .partial(), etc.) work as you'd expect.
Circularity errors
Due to TypeScript limitations, recursive type inference can be finicky, and it only works in certain scenarios. Some more complicated types may trigger recursive type errors like this:
const Activity = z.object({  name: z.string(),  get subactivities() {    // ^ ❌ 'subactivities' implicitly has return type 'any' because it does not    // have a return type annotation and is referenced directly or indirectly    // in one of its return expressions.ts(7023)    return z.nullable(z.array(Activity));  },});
In these cases, you can resolve the error with a type annotation on the offending getter:
const Activity = z.object({  name: z.string(),  get subactivities(): z.ZodNullable<z.ZodArray<typeof Activity>> {    return z.nullable(z.array(Activity));  },});
Arrays
To define an array schema:
ZodZod Mini
const stringArray = z.array(z.string()); // or z.string().array()
To access the inner schema for an element of the array.
ZodZod Mini
stringArray.unwrap(); // => string schema
Zod implements a number of array-specific validations:
ZodZod Mini
z.array(z.string()).min(5); // must contain 5 or more itemsz.array(z.string()).max(5); // must contain 5 or fewer itemsz.array(z.string()).length(5); // must contain 5 items exactly
Tuples
Unlike arrays, tuples are typically fixed-length arrays that specify different schemas for each index.
const MyTuple = z.tuple([  z.string(),  z.number(),  z.boolean()]); type MyTuple = z.infer<typeof MyTuple>;// [string, number, boolean]
To add a variadic ("rest") argument:
const variadicTuple = z.tuple([z.string()], z.number());// => [string, ...number[]];
Unions
Union types (A | B) represent a logical "OR". Zod union schemas will check the input against each option in order. The first value that validates successfully is returned.
const stringOrNumber = z.union([z.string(), z.number()]);// string | number stringOrNumber.parse("foo"); // passesstringOrNumber.parse(14); // passes
To extract the internal option schemas:
ZodZod Mini
stringOrNumber.options; // [ZodString, ZodNumber]
Discriminated unions
A discriminated union is a special kind of union in which a) all the options are object schemas that b) share a particular key (the "discriminator"). Based on the value of the discriminator key, TypeScript is able to "narrow" the type signature as you'd expect.
type MyResult =  | { status: "success"; data: string }  | { status: "failed"; error: string }; function handleResult(result: MyResult){  if(result.status === "success"){    result.data; // string  } else {    result.error; // string  }}
You could represent it with a regular z.union(). But regular unions are naive—they check the input against each option in order and return the first one that passes. This can be slow for large unions.
So Zod provides a z.discriminatedUnion() API that uses a discriminator key to make parsing more efficient.
const MyResult = z.discriminatedUnion("status", [  z.object({ status: z.literal("success"), data: z.string() }),  z.object({ status: z.literal("failed"), error: z.string() }),]);
Nesting discriminated unions
Intersections
Intersection types (A & B) represent a logical "AND".
const a = z.union([z.number(), z.string()]);const b = z.union([z.number(), z.boolean()]);const c = z.intersection(a, b); type c = z.infer<typeof c>; // => number
This can be useful for intersecting two object types.
const Person = z.object({ name: z.string() });type Person = z.infer<typeof Person>; const Employee = z.object({ role: z.string() });type Employee = z.infer<typeof Employee>; const EmployedPerson = z.intersection(Person, Employee);type EmployedPerson = z.infer<typeof EmployedPerson>;// Person & Employee
When merging object schemas, prefer A.extend(B) over intersections. Using .extend() will gve you a new object schema, whereas z.intersection(A, B) returns a ZodIntersection instance which lacks common object methods like pick and omit.
Records
Record schemas are used to validate types such as Record<string, number>.
const IdCache = z.record(z.string(), z.string());type IdCache = z.infer<typeof IdCache>; // Record<string, string> IdCache.parse({  carlotta: "77d2586b-9e8e-4ecf-8b21-ea7e0530eadd",  jimmie: "77d2586b-9e8e-4ecf-8b21-ea7e0530eadd",});
The key schema can be any Zod schema that is assignable to string | number | symbol.
const Keys = z.union([z.string(), z.number(), z.symbol()]);const AnyObject = z.record(Keys, z.unknown());// Record<string | number | symbol, unknown>
To create an object schemas containing keys defined by an enum:
const Keys = z.enum(["id", "name", "email"]);const Person = z.record(Keys, z.string());// { id: string; name: string; email: string }
Zod 4 — In Zod 4, if you pass a z.enum as the first argument to z.record(), Zod will exhaustively check that all enum values exist in the input as keys. This behavior agrees with TypeScript:
type MyRecord = Record<"a" | "b", string>;const myRecord: MyRecord = { a: "foo", b: "bar" }; // ✅const myRecord: MyRecord = { a: "foo" }; // ❌ missing required key `b`
In Zod 3, exhaustiveness was not checked. To replicate the old behavior, use z.partialRecord().
If you want a partial record type, use z.partialRecord(). This skips the special exhaustiveness checks Zod normally runs with z.enum() and z.literal() key schemas.
const Keys = z.enum(["id", "name", "email"]).or(z.never()); const Person = z.partialRecord(Keys, z.string());// { id?: string; name?: string; email?: string }
A note on numeric keys
Maps
const StringNumberMap = z.map(z.string(), z.number());type StringNumberMap = z.infer<typeof StringNumberMap>; // Map<string, number> const myMap: StringNumberMap = new Map();myMap.set("one", 1);myMap.set("two", 2); StringNumberMap.parse(myMap);
Sets
const NumberSet = z.set(z.number());type NumberSet = z.infer<typeof NumberSet>; // Set<number> const mySet: NumberSet = new Set();mySet.add(1);mySet.add(2);NumberSet.parse(mySet);
Set schemas can be further constrained with the following utility methods.
ZodZod Mini
z.set(z.string()).min(5); // must contain 5 or more itemsz.set(z.string()).max(5); // must contain 5 or fewer itemsz.set(z.string()).size(5); // must contain 5 items exactly
Files
To validate File instances:
ZodZod Mini
const fileSchema = z.file(); fileSchema.min(10_000); // minimum .size (bytes)fileSchema.max(1_000_000); // maximum .size (bytes)fileSchema.mime("image/png"); // MIME typefileSchema.mime(["image/png", "image/jpeg"]); // multiple MIME types
Promises
Deprecated — z.promise() is deprecated in Zod 4. There are vanishingly few valid uses cases for a Promise schema. If you suspect a value might be a Promise, simply await it before parsing it with Zod.
See z.promise() documentation
Instanceof
You can use z.instanceof to check that the input is an instance of a class. This is useful to validate inputs against classes that are exported from third-party libraries.
class Test {  name: string;} const TestSchema = z.instanceof(Test); TestSchema.parse(new Test()); // ✅TestSchema.parse("whatever"); // ❌
Refinements
Every Zod schema stores an array of refinements. Refinements are a way to perform custom validation that Zod doesn't provide a native API for.
.refine()
ZodZod Mini
const myString = z.string().refine((val) => val.length <= 255);
Refinement functions should never throw. Instead they should return a falsy value to signal failure. Thrown errors are not caught by Zod.
error
To customize the error message:
ZodZod Mini
const myString = z.string().refine((val) => val.length > 8, {  error: "Too short!" });
abort
By default, validation issues from checks are considered continuable; that is, Zod will execute all checks in sequence, even if one of them causes a validation error. This is usually desirable, as it means Zod can surface as many errors as possible in one go.
ZodZod Mini
const myString = z.string()  .refine((val) => val.length > 8, { error: "Too short!" })  .refine((val) => val === val.toLowerCase(), { error: "Must be lowercase" });  const result = myString.safeParse("OH NO");result.error.issues;/* [  { "code": "custom", "message": "Too short!" },  { "code": "custom", "message": "Must be lowercase" }] */
To mark a particular refinement as non-continuable, use the abort parameter. Validation will terminate if the check fails.
ZodZod Mini
const myString = z.string()  .refine((val) => val.length > 8, { error: "Too short!", abort: true })  .refine((val) => val === val.toLowerCase(), { error: "Must be lowercase", abort: true }); const result = myString.safeParse("OH NO");result.error!.issues;// => [{ "code": "custom", "message": "Too short!" }]
path
To customize the error path, use the path parameter. This is typically only useful in the context of object schemas.
ZodZod Mini
const passwordForm = z  .object({    password: z.string(),    confirm: z.string(),  })  .refine((data) => data.password === data.confirm, {    message: "Passwords don't match",    path: ["confirm"], // path of error  });
This will set the path parameter in the associated issue:
ZodZod Mini
const result = passwordForm.safeParse({ password: "asdf", confirm: "qwer" });result.error.issues;/* [{  "code": "custom",  "path": [ "confirm" ],  "message": "Passwords don't match"}] */
To define an asynchronous refinement, just pass an async function:
const userId = z.string().refine(async (id) => {  // verify that ID exists in database  return true;});
If you use async refinements, you must use the .parseAsync method to parse data! Otherwise Zod will throw an error.
ZodZod Mini
const result = await userId.parseAsync("abc123");
when
Note — This is a power user feature and can absolutely be abused in ways that will increase the probability of uncaught errors originating from inside your refinements.
By default, refinements don't run if any non-continuable issues have already been encountered. Zod is careful to ensure the type signature of the value is correct before passing it into any refinement functions.
const schema = z.string().refine((val) => {  return val.length > 8}); schema.parse(1234); // invalid_type: refinement won't be executed
In some cases, you want finer control over when refinements run. For instance consider this "password confirm" check:
ZodZod Mini
const schema = z  .object({    password: z.string().min(8),    confirmPassword: z.string(),    anotherField: z.string(),  })  .refine((data) => data.password === data.confirmPassword, {    message: "Passwords do not match",    path: ["confirmPassword"],  }); schema.parse({  password: "asdf",  confirmPassword: "asdf",  anotherField: 1234 // ❌ this error will prevent the password check from running});
An error on anotherField will prevent the password confirmation check from executing, even though the check doesn't depend on anotherField. To control when a refinement will run, use the when parameter:
ZodZod Mini
const schema = z  .object({    password: z.string().min(8),    confirmPassword: z.string(),    anotherField: z.string(),  })  .refine((data) => data.password === data.confirmPassword, {    message: "Passwords do not match",    path: ["confirmPassword"],    // run if password & confirmPassword are valid    when(payload) {      return schema        .pick({ password: true, confirmPassword: true })        .safeParse(payload.value).success;    },   }); schema.parse({  password: "asdf",  confirmPassword: "asdf",  anotherField: 1234 // ❌ this error will prevent the password check from running});
.superRefine()
In Zod 4, .superRefine() has been deprecated in favor of .check()
View .superRefine() example
.check()
The .refine() API is syntactic sugar atop a more versatile (and verbose) API called .check(). You can use this API to create multiple issues in a single refinement or have full control of the generated issue objects.
ZodZod Mini
const UniqueStringArray = z.array(z.string()).check((ctx) => {  if (ctx.value.length > 3) {    // full control of issue objects    ctx.issues.push({      code: "too_big",      maximum: 3,      origin: "array",      inclusive: true,      message: "Too many items 😡",      input: ctx.value    });  }  // create multiple issues in one refinement  if (ctx.value.length !== new Set(ctx.value).size) {    ctx.issues.push({      code: "custom",      message: `No duplicates allowed.`,      input: ctx.value,      continue: true // make this issue continuable (default: false)    });  }});
The regular .refine API only generates issues with a "custom" error code, but .check() makes it possible to throw other issue types. For more information on Zod's internal issue types, read the Error customization docs.
Pipes
Schemas can be chained together into "pipes". Pipes are primarily useful when used in conjunction with Transforms.
ZodZod Mini
const stringToLength = z.string().pipe(z.transform(val => val.length)); stringToLength.parse("hello"); // => 5
Transforms
Transforms are a special kind of schema. Instead of validating input, they accept anything and perform some transformation on the data. To define a transform:
ZodZod Mini
const castToString = z.transform((val) => String(val)); castToString.parse("asdf"); // => "asdf"castToString.parse(123); // => "123"castToString.parse(true); // => "true"
To perform validation logic inside a transform, use ctx. To report a validation issue, push a new issue onto ctx.issues (similar to the .check() API).
const coercedInt = z.transform((val, ctx) => {  try {    const parsed = Number.parseInt(String(val));    return parsed;  } catch (e) {    ctx.issues.push({      code: "custom",      message: "Not a number",      input: val,    });    // this is a special constant with type `never`    // returning it lets you exit the transform without impacting the inferred return type    return z.NEVER;  }});
Most commonly, transforms are used in conjunction with Pipes. This combination is useful for performing some initial validation, then transforming the parsed data into another form.
ZodZod Mini
const stringToLength = z.string().pipe(z.transform(val => val.length)); stringToLength.parse("hello"); // => 5
.transform()
Piping some schema into a transform is a common pattern, so Zod provides a convenience .transform() method.
ZodZod Mini
const stringToLength = z.string().transform(val => val.length);
Transforms can also be async:
ZodZod Mini
const idToUser = z  .string()  .transform(async (id) => {    // fetch user from database    return db.getUserById(id);  }); const user = await idToUser.parseAsync("abc123");
If you use async transforms, you must use a .parseAsync or .safeParseAsync when parsing data! Otherwise Zod will throw an error.
.preprocess()
Piping a transform into another schema is another common pattern, so Zod provides a convenience z.preprocess() function.
const coercedInt = z.preprocess((val) => {  if (typeof val === "string") {    return Number.parseInt(val);  }  return val;}, z.int());
Defaults
To set a default value for a schema:
ZodZod Mini
const defaultTuna = z.string().default("tuna"); defaultTuna.parse(undefined); // => "tuna"
Alternatively, you can pass a function which will be re-executed whenever a default value needs to be generated:
ZodZod Mini
const randomDefault = z.number().default(Math.random); randomDefault.parse(undefined);    // => 0.4413456736055323randomDefault.parse(undefined);    // => 0.1871840107401901randomDefault.parse(undefined);    // => 0.7223408162401552
Prefaults
In Zod, setting a default value will short-circuit the parsing process. If the input is undefined, the default value is eagerly returned. As such, the default value must be assignable to the output type of the schema.
const schema = z.string().transform(val => val.length).default(0);schema.parse(undefined); // => 0
Sometimes, it's useful to define a prefault ("pre-parse default") value. If the input is undefined, the prefault value will be parsed instead. The parsing process is not short circuited. As such, the prefault value must be assignable to the input type of the schema.
z.string().transform(val => val.length).prefault("tuna");schema.parse(undefined); // => 4
This is also useful if you want to pass some input value through some mutating refinements.
const a = z.string().trim().toUpperCase().prefault("  tuna  ");a.parse(undefined); // => "TUNA" const b = z.string().trim().toUpperCase().default("  tuna  ");b.parse(undefined); // => "  tuna  "
Catch
Use .catch() to define a fallback value to be returned in the event of a validation error:
ZodZod Mini
const numberWithCatch = z.number().catch(42); numberWithCatch.parse(5); // => 5numberWithCatch.parse("tuna"); // => 42
Alternatively, you can pass a function which will be re-executed whenever a catch value needs to be generated.
ZodZod Mini
const numberWithRandomCatch = z.number().catch((ctx) => {  ctx.error; // the caught ZodError  return Math.random();}); numberWithRandomCatch.parse("sup"); // => 0.4413456736055323numberWithRandomCatch.parse("sup"); // => 0.1871840107401901numberWithRandomCatch.parse("sup"); // => 0.7223408162401552
Branded types
TypeScript's type system is structural, meaning that two types that are structurally equivalent are considered the same.
type Cat = { name: string };type Dog = { name: string }; const pluto: Dog = { name: "pluto" };const simba: Cat = pluto; // works fine
In some cases, it can be desirable to simulate nominal typing inside TypeScript. This can be achieved with branded types (also known as "opaque types").
const Cat = z.object({ name: z.string() }).brand<"Cat">();const Dog = z.object({ name: z.string() }).brand<"Dog">(); type Cat = z.infer<typeof Cat>; // { name: string } & z.$brand<"Cat">type Dog = z.infer<typeof Dog>; // { name: string } & z.$brand<"Dog"> const pluto = Dog.parse({ name: "pluto" });const simba: Cat = pluto; // ❌ not allowed
Under the hood, this works by attaching a "brand" to the schema's inferred type.
const Cat = z.object({ name: z.string() }).brand<"Cat">();type Cat = z.infer<typeof Cat>; // { name: string } & z.$brand<"Cat">
With this brand, any plain (unbranded) data structures are no longer assignable to the inferred type. You have to parse some data with the schema to get branded data.
Note that branded types do not affect the runtime result of .parse. It is a static-only construct.
Readonly
To mark a schema as readonly:
ZodZod Mini
const ReadonlyUser = z.object({ name: z.string() }).readonly();type ReadonlyUser = z.infer<typeof ReadonlyUser>;// Readonly<{ name: string }>
The inferred type of the new schemas will be marked as readonly. Note that in TypeScript, this only affects objects, arrays, tuples, Set, and Map:
ZodZod Mini
z.object({ name: z.string() }).readonly(); // { readonly name: string }z.array(z.string()).readonly(); // readonly string[]z.tuple([z.string(), z.number()]).readonly(); // readonly [string, number]z.map(z.string(), z.date()).readonly(); // ReadonlyMap<string, Date>z.set(z.string()).readonly(); // ReadonlySet<string>
Inputs will be parsed like normal, then the result will be frozen with Object.freeze() to prevent modifications.
ZodZod Mini
const result = ReadonlyUser.parse({ name: "fido" });result.name = "simba"; // throws TypeError
JSON
To validate any JSON-encodable value:
const jsonSchema = z.json();
This is a convenience API that returns the following union schema:
const jsonSchema = z.lazy(() => {  return z.union([    z.string(params),    z.number(),    z.boolean(),    z.null(),    z.array(jsonSchema),    z.record(z.string(), jsonSchema)  ]);});
Custom
You can create a Zod schema for any TypeScript type by using z.custom(). This is useful for creating schemas for types that are not supported by Zod out of the box, such as template string literals.
const px = z.custom<`${number}px`>((val) => {  return typeof val === "string" ? /^\d+px$/.test(val) : false;}); type px = z.infer<typeof px>; // `${number}px` px.parse("42px"); // "42px"px.parse("42vw"); // throws;
If you don't provide a validation function, Zod will allow any value. This can be dangerous!
z.custom<{ arg: string }>(); // performs no validation
You can customize the error message and other options by passing a second argument. This parameter works the same way as the params parameter of .refine.
z.custom<...>((val) => ..., "custom error message");
Functions
In Zod 4, z.function() no longer returns a Zod schema.
Zod provides a z.function() utility for defining Zod-validated functions. This way, you can avoid intermixing validation code with your business logic.
const MyFunction = z.function({  input: [z.string()], // parameters (must be an array or a ZodTuple)  output: z.number()  // return type});
Function schemas have an .implement() method which accepts a function and returns a new function that automatically validates its inputs and outputs.
const computeTrimmedLength = MyFunction.implement((input) => {  // TypeScript knows input is a string!  return input.trim().length;}); computeTrimmedLength("sandwich"); // => 8computeTrimmedLength(" asdf "); // => 4
This function will throw a ZodError if the input is invalid:
computeTrimmedLength(42); // throws ZodError
If you only care about validating inputs, you can omit the output field.
const MyFunction = z.function({  input: [z.string()], // parameters (must be an array or a ZodTuple)}); const computeTrimmedLength = MyFunction.implement((input) => input.trim.length);
Edit on GitHub
Next
Basic usage
Next
Customizing errors
On this page
Primitives
Coercion
Literals
Strings
String formats
Emails
UUIDs
URLs
ISO datetimes
ISO dates
ISO times
IP addresses
IP blocks (CIDR)
Template literals
Numbers
Integers
BigInts
Booleans
Dates
Enums
.enum
.exclude()
.extract()
Stringbools
Optionals
Nullables
Nullish
Unknown
Never
Objects
z.strictObject
z.looseObject
.catchall()
.shape
.keyof()
.extend()
.pick()
.omit()
.partial()
.required()
Recursive objects
Circularity errors
Arrays
Tuples
Unions
Discriminated unions
Intersections
Records
Maps
Sets
Files
Promises
Instanceof
Refinements
.refine()
.superRefine()
.check()
Pipes
Transforms
.transform()
.preprocess()
Defaults
Prefaults
Catch
Branded types
Readonly
JSON
Custom
Functions
Customizing errors
In Zod, validation errors are surfaced as instances of the z.core.$ZodError class.
The ZodError class in the zod package is a subclass that implements some additional convenience methods.
Instances of $ZodError contain an .issues array. Each issue contains a human-readable message and additional structured metadata about the issue.
ZodZod Mini
import * as z from "zod"; const result = z.string().safeParse(12); // { success: false, error: ZodError }result.error.issues;// [//   {//     expected: 'string',//     code: 'invalid_type',//     path: [],//     message: 'Invalid input: expected string, received number'//   }// ]
Every issue contains a message property with a human-readable error message. Error messages can be customized in a number of ways.
The error param
Virtually every Zod API accepts an optional error message.
z.string("Not a string!");
This custom error will show up as the message property of any validation issues that originate from this schema.
z.string("Not a string!").parse(12);// ❌ throws ZodError {//   issues: [//     {//       expected: 'string',//       code: 'invalid_type',//       path: [],//       message: 'Not a string!'   <-- 👀 custom error message//     }//   ]// }
All z functions and schema methods accept custom errors.
ZodZod Mini
z.string("Bad!");z.string().min(5, "Too short!");z.uuid("Bad UUID!");z.iso.date("Bad date!");z.array(z.string(), "Not an array!");z.array(z.string()).min(5, "Too few items!");z.set(z.string(), "Bad set!");
If you prefer, you can pass a params object with an error parameter instead.
ZodZod Mini
z.string({ error: "Bad!" });z.string().min(5, { error: "Too short!" });z.uuid({ error: "Bad UUID!" });z.iso.date({ error: "Bad date!" });z.array(z.string(), { error: "Bad array!" });z.array(z.string()).min(5, { error: "Too few items!" });z.set(z.string(), { error: "Bad set!" });
The error param optionally accepts a function. An error customization function is known as an error map in Zod terminology. The error map will run at parse time if a validation error occurs.
z.string({ error: ()=>`[${Date.now()}]: Validation failure.` });
Note — In Zod v3, there were separate params for message (a string) and errorMap (a function). These have been unified in Zod 4 as error.
The error map receives a context object you can use to customize the error message based on the validation issue.
z.string({  error: (iss) => iss.input === undefined ? "Field is required." : "Invalid input."});
For advanced cases, the iss object provides additional information you can use to customize the error.
z.string({  error: (iss) => {    iss.code; // the issue code    iss.input; // the input data    iss.inst; // the schema/check that originated this issue    iss.path; // the path of the error  },});
Depending on the API you are using, there may be additional properties available. Use TypeScript's autocomplete to explore the available properties.
z.string().min(5, {  error: (iss) => {    // ...the same as above    iss.minimum; // the minimum value    iss.inclusive; // whether the minimum is inclusive    return `Password must have ${iss.minimum} characters or more`;  },});
Return undefined to avoid customizing the error message and fall back to the default message. (More specifically, Zod will yield control to the next error map in the precedence chain.) This is useful for selectively customizing certain error messages but not others.
z.int64({  error: (issue) => {    // override too_big error message    if (issue.code === "too_big") {      return { message: `Value must be <${issue.maximum}` };    }    //  defer to default    return undefined;  },});
Per-parse error customization
To customize errors on a per-parse basis, pass an error map into the parse method:
const schema = z.string(); schema.parse(12, {  error: iss => "per-parse custom error"});
This has lower precedence than any schema-level custom messages.
const schema = z.string({ error: "highest priority" });const result = schema.safeParse(12, {  error: (iss) => "lower priority",}); result.error.issues;// [{ message: "highest priority", ... }]
The iss object is a discriminated union of all possible issue types. Use the code property to discriminate between them.
For a breakdown of all Zod issue codes, see the zod/v4/core documentation.
const result = schema.safeParse(12, {  error: (iss) => {    if (iss.code === "invalid_type") {      return `invalid type, expected ${iss.expected}`;    }    if (iss.code === "too_small") {      return `minimum is ${iss.minimum}`;    }    // ...  }});
Include input in issues
By default, Zod does not include input data in issues. This is to prevent unintentional logging of potentially sensitive input data. To include the input data in each issue, use the reportInput flag:
z.string().parse(12, {  reportInput: true}) // ZodError: [//   {//     "expected": "string",//     "code": "invalid_type",//     "input": 12, // 👀//     "path": [],//     "message": "Invalid input: expected string, received number"//   }// ]
Global error customization
To specify a global error map, use z.config() to set Zod's customError configuration setting:
z.config({  customError: (iss) => {    return "globally modified error";  },});
Global error messages have lower precedence than schema-level or per-parse error messages.
The iss object is a discriminated union of all possible issue types. Use the code property to discriminate between them.
For a breakdown of all Zod issue codes, see the zod/v4/core documentation.
const result = schema.safeParse(12, {  error: (iss) => {    if (iss.code === "invalid_type") {      return `invalid type, expected ${iss.expected}`;    }    if (iss.code === "too_small") {      return `minimum is ${iss.minimum}`;    }    // ...  }})
Internationalization
To support internationalization of error message, Zod provides several built-in locales. These are exported from the zod/v4/core package.
Note — The regular zod library automatically loads the en locale automatically. Zod Mini does not load any locale by default; instead all error messages default to Invalid input.
ZodZod Mini
import * as z from "zod";import { en } from "zod/locales" z.config(en());
To lazily load a locale, consider dynamic imports:
import * as z from "zod"; async function loadLocale(locale: string) {  const { default: locale } = await import(`zod/v4/locales/${locale}.js`);  z.config(locale());}; await loadLocale("fr");
For convenience, all locales are exported as z.locales from "zod". In some bundlers, this may not be tree-shakable.
ZodZod Mini
import * as z from "zod"; z.config(z.locales.en());
Locales
The following locales are available:
ar — Arabic
az — Azerbaijani
be — Belarusian
ca — Catalan
cs — Czech
de — German
en — English
eo — Esperanto
es — Spanish
fa — Farsi
fi — Finnish
fr — French
frCA — Canadian French
he — Hebrew
hu — Hungarian
id — Indonesian
it — Italian
ja — Japanese
kh — Khmer
ko — Korean
mk — Macedonian
ms — Malay
nl — Dutch
no — Norwegian
ota — Türkî
ps — Pashto
pl — Polish
pt — Portuguese
ru — Russian
sl — Slovenian
sv — Swedish
ta — Tamil
th — Thai
tr — Türkçe
ua — Ukrainian
ur — Urdu
vi — Tiếng Việt
zhCN — Simplified Chinese
zhTW — Traditional Chinese
Error precedence
Below is a quick reference for determining error precedence: if multiple error customizations have been defined, which one takes priority? From highest to lowest priority:
Schema-level error — Any error message "hard coded" into a schema definition.
z.string("Not a string!");
Per-parse error — A custom error map passed into the .parse() method.
z.string().parse(12, {  error: (iss) => "My custom error"});
Global error map — A custom error map passed into z.config().
z.config({  customError: (iss) => "My custom error"});
Locale error map — A custom error map passed into z.config().
z.config(z.locales.en());
Edit on GitHub
Next
Defining schemas
Next
Formatting errors
On this page
The error param
Per-parse error customization
Include input in issues
Global error customization
Internationalization
Locales
Error precedence
Formatting errors
Zod emphasizes completeness and correctness in its error reporting. In many cases, it's helpful to convert the $ZodError to a more useful format. Zod provides some utilities for this.
Consider this simple object schema.
import * as z from "zod"; const schema = z.strictObject({  username: z.string(),  favoriteNumbers: z.array(z.number()),});
Attempting to parse this invalid data results in an error containing two issues.
const result = schema.safeParse({  username: 1234,  favoriteNumbers: [1234, "4567"],  extraKey: 1234,}); result.error!.issues;[  {    expected: 'string',    code: 'invalid_type',    path: [ 'username' ],    message: 'Invalid input: expected string, received number'  },  {    expected: 'number',    code: 'invalid_type',    path: [ 'favoriteNumbers', 1 ],    message: 'Invalid input: expected number, received string'  },  {    code: 'unrecognized_keys',    keys: [ 'extraKey' ],    path: [],    message: 'Unrecognized key: "extraKey"'  }];
z.treeifyError()
To convert ("treeify") this error into a nested object, use z.treeifyError().
const tree = z.treeifyError(result.error); // =>{  errors: [ 'Unrecognized key: "extraKey"' ],  properties: {    username: { errors: [ 'Invalid input: expected string, received number' ] },    favoriteNumbers: {      errors: [],      items: [        undefined,        {          errors: [ 'Invalid input: expected number, received string' ]        }      ]    }  }}
The result is a nested structure that mirrors the schema itself. You can easily access the errors that occurred at a particular path. The errors field contains the error messages at a given path, and the special properties properties and items let you traverse deeper into the tree.
tree.properties?.username?.errors;// => ["Invalid input: expected string, received number"] tree.properties?.favoriteNumbers?.items?.[1]?.errors;// => ["Invalid input: expected number, received string"];
Be sure to use optional chaining (?.) to avoid errors when accessing nested properties.
z.prettifyError()
The z.prettifyError() provides a human-readable string representation of the error.
const pretty = z.prettifyError(result.error);
This returns the following string:
✖ Unrecognized key: "extraKey"✖ Invalid input: expected string, received number  → at username✖ Invalid input: expected number, received string  → at favoriteNumbers[1]
z.formatError()
This has been deprecated in favor of z.treeifyError().
Show docs
z.flattenError()
While z.treeifyError() is useful for traversing a potentially complex nested structure, the majority of schemas are flat—just one level deep. In this case, use z.flattenError() to retrieve a clean, shallow error object.
const flattened = z.flattenError(result.error);// { errors: string[], properties: { [key: string]: string[] } } {  formErrors: [ 'Unrecognized key: "extraKey"' ],  fieldErrors: {    username: [ 'Invalid input: expected string, received number' ],    favoriteNumbers: [ 'Invalid input: expected number, received string' ]  }}
The formErrors array contains any top-level errors (where path is []). The fieldErrors object provides an array of errors for each field in the schema.
flattened.fieldErrors.username; // => [ 'Invalid input: expected string, received number' ]flattened.fieldErrors.favoriteNumbers; // => [ 'Invalid input: expected number, received string' ]
Edit on GitHub
Next
Customizing errors
Next
Metadata and registries
On this page
z.treeifyError()
z.prettifyError()
z.formatError()
z.flattenError()
Metadata and registries
It's often useful to associate a schema with some additional metadata for documentation, code generation, AI structured outputs, form validation, and other purposes.
Registries
Metadata in Zod is handled via registries. Registries are collections of schemas, each associated with some strongly-typed metadata. To create a simple registry:
import * as z from "zod"; const myRegistry = z.registry<{ description: string }>();
To register, lookup, and remove schemas from this registry:
const mySchema = z.string(); myRegistry.add(mySchema, { description: "A cool schema!"});myRegistry.has(mySchema); // => truemyRegistry.get(mySchema); // => { description: "A cool schema!" }myRegistry.remove(mySchema);myRegistry.clear(); // wipe registry
TypeScript enforces that the metadata for each schema matches the registry's metadata type.
myRegistry.add(mySchema, { description: "A cool schema!" }); // ✅myRegistry.add(mySchema, { description: 123 }); // ❌
Special handling for id — Zod registries treat the id property specially. An Error will be thrown if multiple schemas are registered with the same id value. This is true for all registries, including the global registry.
.register()
Note — This method is special in that it does not return a new schema; instead, it returns the original schema. No other Zod method does this! That includes .meta() and .describe() (documented below) which return a new instance.
Schemas provide a .register() method to more conveniently add it to a registry.
const mySchema = z.string(); mySchema.register(myRegistry, { description: "A cool schema!" });// => mySchema
This lets you define metadata "inline" in your schemas.
const mySchema = z.object({  name: z.string().register(myRegistry, { description: "The user's name" }),  age: z.number().register(myRegistry, { description: "The user's age" }),})
If a registry is defined without a metadata type, you can use it as a generic "collection", no metadata required.
const myRegistry = z.registry(); myRegistry.add(z.string());myRegistry.add(z.number());
Metadata
z.globalRegistry
For convenience, Zod provides a global registry (z.globalRegistry) that can be used to store metadata for JSON Schema generation or other purposes. It accepts the following metadata:
export interface GlobalMeta {  id?: string ;  title?: string ;  description?: string ;  example?: unknown ;  examples?:    | unknown[] // array-style (JSON Schema)    | Record<string, { value: unknown; [k: string]: unknown }>;  // map-style (OpenAPI)  deprecated?: boolean ;  [k: string]: unknown;}
To register some metadata in z.globalRegistry for a schema:
import * as z from "zod"; const emailSchema = z.email().register(z.globalRegistry, {  id: "email_address",  title: "Email address",  description: "Your email address",  examples: ["first.last@example.com"]});
.meta()
For a more convenient approach, use the .meta() method to register a schema in z.globalRegistry.
ZodZod Mini
const emailSchema = z.email().meta({  id: "email_address",  title: "Email address",  description: "Please enter a valid email address",});
Calling .meta() without an argument will retrieve the metadata for a schema.
emailSchema.meta();// => { id: "email_address", title: "Email address", ... }
Metadata is associated with a specific schema instance. This is important to keep in mind, especially since Zod methods are immutable—they always return a new instance.
const A = z.string().meta({ description: "A cool string" });A.meta(); // => { hello: "true" } const B = A.refine(_ => true);B.meta(); // => undefined
.describe()
The .describe() method still exists for compatibility with Zod 3, but .meta() is now the recommended approach.
The .describe() method is a shorthand for registering a schema in z.globalRegistry with just a description field.
ZodZod Mini
const emailSchema = z.email();emailSchema.describe("An email address"); // equivalent toemailSchema.meta({ description: "An email address" });
Custom registries
You've already seen a simple example of a custom registry:
import * as z from "zod"; const myRegistry = z.registry<{ description: string };>();
Let's look at some more advanced patterns.
Referencing inferred types
It's often valuable for the metadata type to reference the inferred type of a schema. For instance, you may want an examples field to contain examples of the schema's output.
import * as z from "zod"; type MyMeta = { examples: z.$output[] };const myRegistry = z.registry<MyMeta>(); myRegistry.add(z.string(), { examples: ["hello", "world"] });myRegistry.add(z.number(), { examples: [1, 2, 3] });
The special symbol z.$output is a reference to the schemas inferred output type (z.infer<typeof schema>). Similarly you can use z.$input to reference the input type.
Constraining schema types
Pass a second generic to z.registry() to constrain the schema types that can be added to a registry. This registry only accepts string schemas.
import * as z from "zod"; const myRegistry = z.registry<{ description: string }, z.ZodString>(); myRegistry.add(z.string(), { description: "A number" }); // ✅myRegistry.add(z.number(), { description: "A number" }); // ❌ //             ^ 'ZodNumber' is not assignable to parameter of type 'ZodString'
Edit on GitHub
Next
Formatting errors
Next
JSON Schema
On this page
Registries
.register()
Metadata
z.globalRegistry
.meta()
.describe()
Custom registries
Referencing inferred types
Constraining schema types
JSON Schema
💎
New — Zod 4 introduces a new feature: native JSON Schema conversion. JSON Schema is a standard for describing the structure of JSON (with JSON). It's widely used in OpenAPI definitions and defining structured outputs for AI.
To convert a Zod schema to JSON Schema, use the z.toJSONSchema() function.
import * as z from "zod"; const schema = z.object({  name: z.string(),  age: z.number(),}); z.toJSONSchema(schema)// => {//   type: 'object',//   properties: { name: { type: 'string' }, age: { type: 'number' } },//   required: [ 'name', 'age' ],//   additionalProperties: false,// }
All schema & checks are converted to their closest JSON Schema equivalent. Some types have no analog and cannot be reasonably represented. See the unrepresentable section below for more information on handling these cases.
z.bigint(); // ❌z.int64(); // ❌z.symbol(); // ❌z.void(); // ❌z.date(); // ❌z.map(); // ❌z.set(); // ❌z.transform(); // ❌z.nan(); // ❌z.custom(); // ❌
String formats
Zod converts the following schema types to the equivalent JSON Schema format:
// Supported via `format`z.email(); // => { type: "string", format: "email" }z.iso.datetime(); // => { type: "string", format: "date-time" }z.iso.date(); // => { type: "string", format: "date" }z.iso.time(); // => { type: "string", format: "time" }z.iso.duration(); // => { type: "string", format: "duration" }z.ipv4(); // => { type: "string", format: "ipv4" }z.ipv6(); // => { type: "string", format: "ipv6" }z.uuid(); // => { type: "string", format: "uuid" }z.guid(); // => { type: "string", format: "uuid" }z.url(); // => { type: "string", format: "uri" }
These schemas are supported via contentEncoding:
z.base64(); // => { type: "string", contentEncoding: "base64" }
All other string formats are supported via pattern:
z.base64url();z.cuid();z.regex();z.emoji();z.nanoid();z.cuid2();z.ulid();z.cidrv4();z.cidrv6();
Numeric types
Zod converts the following numeric types to JSON Schema:
// numberz.number(); // => { type: "number" }z.float32(); // => { type: "number", exclusiveMinimum: ..., exclusiveMaximum: ... }z.float64(); // => { type: "number", exclusiveMinimum: ..., exclusiveMaximum: ... } // integerz.int(); // => { type: "integer" }z.int32(); // => { type: "integer", exclusiveMinimum: ..., exclusiveMaximum: ... }
Object schemas
By default, z.object() schemas contain additionalProperties: "false". This is an accurate representation of Zod's default behavior, as plain z.object() schema strip additional properties.
import * as z from "zod"; const schema = z.object({  name: z.string(),  age: z.number(),}); z.toJSONSchema(schema)// => {//   type: 'object',//   properties: { name: { type: 'string' }, age: { type: 'number' } },//   required: [ 'name', 'age' ],//   additionalProperties: false,// }
When converting to JSON Schema in "input" mode, additionalProperties is not set. See the io docs for more information.
import * as z from "zod"; const schema = z.object({  name: z.string(),  age: z.number(),}); z.toJSONSchema(schema, { io: "input" });// => {//   type: 'object',//   properties: { name: { type: 'string' }, age: { type: 'number' } },//   required: [ 'name', 'age' ],// }
By contrast:
z.looseObject() will never set additionalProperties: false
z.strictObject() will always set additionalProperties: false
File schemas
Zod converts z.file() to the following OpenAPI-friendly schema:
z.file();// => { type: "string", format: "binary", contentEncoding: "binary" }
Size and MIME checks are also represented:
z.file().min(1).max(1024 * 1024).mime("image/png");// => {//   type: "string",//   format: "binary",//   contentEncoding: "binary",//   contentMediaType: "image/png",//   minLength: 1,//   maxLength: 1048576,// }
Nullability
Zod converts both undefined/null to { type: "null" } in JSON Schema.
z.null(); // => { type: "null" } z.undefined(); // => { type: "null" }
Similarly, nullable is represented via a union with null::
z.nullable(z.string());// => { oneOf: [{ type: "string" }, { type: "null" }] }
Optional schemas are represented as-is, though they are decorated with an optional annotation.
z.optional(z.string());// => { type: "string" }
Configuration
A second argument can be used to customize the conversion logic.
z.toJSONSchema(schema, {  // ...params})
Below is a quick reference for each supported parameter. Each one is explained in more detail below.
interface ToJSONSchemaParams {  /** The JSON Schema version to target.   * - `"draft-2020-12"` — Default. JSON Schema Draft 2020-12   * - `"draft-7"` — JSON Schema Draft 7 */  target?: "draft-7" | "draft-2020-12";  /** A registry used to look up metadata for each schema.   * Any schema with an `id` property will be extracted as a $def. */  metadata?: $ZodRegistry<Record<string, any>>;  /** How to handle unrepresentable types.   * - `"throw"` — Default. Unrepresentable types throw an error   * - `"any"` — Unrepresentable types become `{}` */  unrepresentable?: "throw" | "any";  /** How to handle cycles.   * - `"ref"` — Default. Cycles will be broken using $defs   * - `"throw"` — Cycles will throw an error if encountered */  cycles?: "ref" | "throw";  /* How to handle reused schemas.   * - `"inline"` — Default. Reused schemas will be inlined   * - `"ref"` — Reused schemas will be extracted as $defs */  reused?: "ref" | "inline";  /** A function used to convert `id` values to URIs to be used in *external* $refs.   *   * Default is `(id) => id`.   */  uri?: (id: string) => string;}
target
To set the target JSON Schema version, use the target parameter. By default, Zod will target Draft 2020-12.
z.toJSONSchema(schema, { target: "draft-7" });z.toJSONSchema(schema, { target: "draft-2020-12" });
metadata
If you haven't already, read through the Metadata and registries page for context on storing metadata in Zod.
In Zod, metadata is stored in registries. Zod exports a global registry z.globalRegistry that can be used to store common metadata fields like id, title, description, and examples.
ZodZod Mini
import * as z from "zod"; // `.meta()` is a convenience method for registering a schema in `z.globalRegistry`const emailSchema = z.string().meta({  title: "Email address",  description: "Your email address",}); z.toJSONSchema(emailSchema);// => { type: "string", title: "Email address", description: "Your email address", ... }
All metadata fields get copied into the resulting JSON Schema.
const schema = z.string().meta({  whatever: 1234}); z.toJSONSchema(schema);// => { type: "string", whatever: 1234 }
unrepresentable
The following APIs are not representable in JSON Schema. By default, Zod will throw an error if they are encountered. It is unsound to attempt a conversion to JSON Schema; you should modify your schemas as they have no equivalent in JSON. An error will be thrown if any of these are encountered.
z.bigint(); // ❌z.int64(); // ❌z.symbol(); // ❌z.void(); // ❌z.date(); // ❌z.map(); // ❌z.set(); // ❌z.transform(); // ❌z.nan(); // ❌z.custom(); // ❌
By default, Zod will throw an error if any of these are encountered.
z.toJSONSchema(z.bigint());// => throws Error
You can change this behavior by setting the unrepresentable option to "any". This will convert any unrepresentable types to {} (the equivalent of unknown in JSON Schema).
z.toJSONSchema(z.bigint(), { unrepresentable: "any" });// => {}
cycles
How to handle cycles. If a cycle is encountered as z.toJSONSchema() traverses the schema, it will be represented using $ref.
const User = z.object({  name: z.string(),  get friend() {    return User;  },}); z.toJSONSchema(User);// => {//   type: 'object',//   properties: { name: { type: 'string' }, friend: { '$ref': '#' } },//   required: [ 'name', 'friend' ],//   additionalProperties: false,// }
If instead you want to throw an error, set the cycles option to "throw".
z.toJSONSchema(User, { cycles: "throw" });// => throws Error
reused
How to handle schemas that occur multiple times in the same schema. By default, Zod will inline these schemas.
const name = z.string();const User = z.object({  firstName: name,  lastName: name,}); z.toJSONSchema(User);// => {//   type: 'object',//   properties: { //     firstName: { type: 'string' }, //     lastName: { type: 'string' } //   },//   required: [ 'firstName', 'lastName' ],//   additionalProperties: false,// }
Instead you can set the reused option to "ref" to extract these schemas into $defs.
z.toJSONSchema(User, { reused: "ref" });// => {//   type: 'object',//   properties: {//     firstName: { '$ref': '#/$defs/__schema0' },//     lastName: { '$ref': '#/$defs/__schema0' }//   },//   required: [ 'firstName', 'lastName' ],//   additionalProperties: false,//   '$defs': { __schema0: { type: 'string' } }// }
override
To define some custom override logic, use override. The provided callback has access to the original Zod schema and the default JSON Schema. This function should directly modify ctx.jsonSchema.
const mySchema = /* ... */z.toJSONSchema(mySchema, {  override: (ctx)=>{    ctx.zodSchema; // the original Zod schema    ctx.jsonSchema; // the default JSON Schema    // directly modify    ctx.jsonSchema.whatever = "sup";  }});
Note that unrepresentable types will throw an Error before this functions is called. If you are trying to define custom behavior for an unrepresentable type, you'll need to use set the unrepresentable: "any" alongside override.
// support z.date() as ISO datetime stringsconst result = z.toJSONSchema(z.date(), {  unrepresentable: "any",  override: (ctx) => {    const def = ctx.zodSchema._zod.def;    if(def.type ==="date"){      ctx.jsonSchema.type = "string";      ctx.jsonSchema.format = "date-time";    }  },});
io
Some schema types have different input and output types, e.g. ZodPipe, ZodDefault, and coerced primitives. By default, the result of z.toJSONSchema represents the output type; use "io": "input" to extract the input type instead.
const mySchema = z.string().transform(val => val.length).pipe(z.number());// ZodPipe const jsonSchema = z.toJSONSchema(mySchema); // => { type: "number" } const jsonSchema = z.toJSONSchema(mySchema, { io: "input" }); // => { type: "string" }
Registries
Passing a schema into z.toJSONSchema() will return a self-contained JSON Schema.
In other cases, you may have a set of Zod schemas you'd like to represent using multiple interlinked JSON Schemas, perhaps to write to .json files and serve from a web server.
import * as z from "zod"; const User = z.object({  name: z.string(),  get posts(){    return z.array(Post);  }}); const Post = z.object({  title: z.string(),  content: z.string(),  get author(){    return User;  }}); z.globalRegistry.add(User, {id: "User"});z.globalRegistry.add(Post, {id: "Post"});
To achieve this, you can pass a registry into z.toJSONSchema().
Important — All schemas should have a registered id property in the registry! Any schemas without an id will be ignored.
z.toJSONSchema(z.globalRegistry);// => {//   schemas: {//     User: {//       id: 'User',//       type: 'object',//       properties: {//         name: { type: 'string' },//         posts: { type: 'array', items: { '$ref': 'Post' } }//       },//       required: [ 'name', 'posts' ],//       additionalProperties: false,//     },//     Post: {//       id: 'Post',//       type: 'object',//       properties: {//         title: { type: 'string' },//         content: { type: 'string' },//         author: { '$ref': 'User' }//       },//       required: [ 'title', 'content', 'author' ],//       additionalProperties: false,//     }//   }// }
By default, the $ref URIs are simple relative paths like "User". To make these absolute URIs, use the uri option. This expects a function that converts an id to a fully-qualified URI.
z.toJSONSchema(z.globalRegistry, {  uri: (id) => `https://example.com/${id}.json`});// => {//   schemas: {//     User: {//       id: 'User',//       type: 'object',//       properties: {//         name: { type: 'string' },//         posts: {//           type: 'array',//           items: { '$ref': 'https://example.com/Post.json' }//         }//       },//       required: [ 'name', 'posts' ],//       additionalProperties: false,//     },//     Post: {//       id: 'Post',//       type: 'object',//       properties: {//         title: { type: 'string' },//         content: { type: 'string' },//         author: { '$ref': 'https://example.com/User.json' }//       },//       required: [ 'title', 'content', 'author' ],//       additionalProperties: false,//     }//   }// }
Edit on GitHub
Next
Metadata and registries
Next
Ecosystem
On this page
String formats
Numeric types
Object schemas
File schemas
Nullability
Configuration
target
metadata
unrepresentable
cycles
reused
override
io
Registries
Ecosystem
Note — To avoid bloat and confusion, the Ecosystem section has been wiped clean with the release of Zod 4. If you've updated your library to work with Zod 4, please submit a PR to add it back in. For libraries that work with Zod 3, refer to v3.zod.dev.
There are a growing number of tools that are built atop or support Zod natively! If you've built a tool or library on top of Zod, let me know on Twitter or start a Discussion. I'll add it below and tweet it out.
Resources
Total TypeScript Zod Tutorial by @mattpocockuk
Fixing TypeScript's Blindspot: Runtime Typechecking by @jherr
API Libraries
Name
Stars
Description
tRPC
⭐️ 37873
Build end-to-end typesafe APIs without GraphQL.
oRPC
⭐️ 2577
Typesafe APIs Made Simple
Express Zod API
⭐️ 744
Build Express-based API with I/O validation and middlewares, OpenAPI docs and type-safe client.
Zod Sockets
⭐️ 92
Socket.IO solution with I/O validation, an AsyncAPI generator, and a type-safe events map.
GQLoom
⭐️ 56
Weave GraphQL schema and resolvers using Zod.
Zod JSON-RPC
⭐️ 11
Type-safe JSON-RPC 2.0 client/server library using Zod.

Form Integrations
Name
Stars
Description
Superforms
⭐️ 2559
Making SvelteKit forms a pleasure to use!
conform
⭐️ 2365
A type-safe form validation library utilizing web fundamentals to progressively enhance HTML Forms with full support for server frameworks like Remix and Next.js.
zod-validation-error
⭐️ 952
Generate user-friendly error messages from ZodError instances.
regle
⭐️ 233
Headless form validation library for Vue.js.
svelte-jsonschema-form
⭐️ 82
Svelte 5 library for creating forms based on JSON schema.

Zod to X
Name
Stars
Description
zod-openapi
⭐️ 466
Use Zod Schemas to create OpenAPI v3.x documentation
zod2md
⭐️ 107
Generate Markdown docs from Zod schemas
fastify-zod-openapi
⭐️ 101
Fastify type provider, validation, serialization and @fastify/swagger support for Zod schemas

X to Zod
Name
Stars
Description
orval
⭐️ 4286
Generate Zod schemas from OpenAPI schemas
kubb
⭐️ 1276
The ultimate toolkit for working with APIs.

Mocking Libraries
Name
Stars
Description
zod-schema-faker
⭐️ 67
Generate mock data from zod schemas. Powered by @faker-js/faker and randexp.js.
zocker
⭐️ 40
Generates valid, semantically meaningful data for your Zod schemas.

Powered by Zod
Name
Stars
Description
Composable Functions
⭐️ 717
Types and functions to make composition easy and safe.
zod-config
⭐️ 106
Load configurations across multiple sources with flexible adapters, ensuring type safety with Zod.
zod-xlsx
⭐️ 42
A xlsx based resource validator using Zod schemas for data imports and more

Zod Utilities
Name
Stars
Description

Edit on GitHub
Next
JSON Schema
Next
For library authors
On this page
Resources
API Libraries
Form Integrations
Zod to X
X to Zod
Mocking Libraries
Powered by Zod
Zod Utilities
For library authors
Update — July 10th, 2025
Zod 4.0.0 has been released on npm. This completes the incremental rollout process described below. To add support, bump your peer dependency to include zod@^4.0.0:
// package.json{  "peerDependencies": {    "zod": "^3.25.0 || ^4.0.0"  }}
If you'd already implemented Zod 4 support according to the best practices described below (e.g. using the "zod/v4/core" subpath), then no other code changes should be necessary. This should not require a major version bump in your library.
This page is primarily intended for consumption by library authors who are building tooling on top of Zod.
If you are a library author and think this page should include some additional guidance, please open an issue!
Do I need to depend on Zod?
First things first, make sure you need to depend on Zod at all.
If you're building a library that accepts user-defined schemas to perform black-box validation, you may not need to integrate with Zod specifically. Instead look into Standard Schema. It's a shared interface implemented by most popular validation libraries in the TypeScript ecosystem (see the full list), including Zod.
This spec works great if you accept user-defined schemas and treat them like "black box" validators. Given any compliant library, you can extract inferred input/output types, validate inputs, and get back a standardized error.
If you need Zod specific functionality, read on.
How to configure peer dependencies?
Any library built on top of Zod should include "zod" in "peerDependencies". This lets your users "bring their own Zod".
// package.json{  // ...  "peerDependencies": {    "zod": "^3.25.0 || ^4.0.0" // the "zod/v4" subpath was added in 3.25.0  }}
During development, you need to meet your own peer dependency requirement, to do so, add "zod" to your "devDependencies" as well.
// package.json{  "peerDependencies": {    "zod": "^3.25.0 || ^4.0.0"  },  "devDependencies": {    // generally, you should develop against the latest version of Zod    "zod": "^3.25.0 || ^4.0.0"  }}
How to support Zod 4?
To support Zod 4, update the minimum version for your "zod" peer dependency to ^3.25.0 || ^4.0.0.
// package.json{  // ...  "peerDependencies": {    "zod": "^3.25.0 || ^4.0.0"  }}
Starting with v3.25.0, the Zod 4 core package is available at the "zod/v4/core" subpath. Read the Versioning in Zod 4 writeup for full context on this versioning approach.
import * as z4 from "zod/v4/core";
Import from these subpaths only. Think of them like "permalinks" to their respective Zod versions. These will remain available forever.
"zod/v3" for Zod 3 ✅
"zod/v4/core" for the Zod 4 Core package ✅
You generally shouldn't be importing from any other paths. The Zod Core library is a shared library that undergirds both Zod 4 Classic and Zod 4 Mini. It's generally a bad idea to implement any functionality that is specific to one or the other. Do not import from these subpaths:
"zod" — ❌ In 3.x releases, this exports Zod 3. In 4.x releases, this will export Zod 4. Use the permalinks instead.
"zod/v4" and "zod/v4/mini"— ❌ These subpaths are the homes of Zod 4 Classic and Mini, respectively. If you want your library to work with both Zod and Zod Mini, you should build against the base classes defined in "zod/v4/core". If you reference classes from the "zod/v4" module, your library will not work with Zod Mini, and vice versa. This is extremely discouraged. Use "zod/v4/core" instead, which exports the $-prefixed subclasses that are extended by Zod Classic and Zod Mini. The internals of the classic & mini subclasses are identical; they only differ in which helper methods they implement.
Do I need to publish a new major version?
No, you should not need to publish a new major version of your library to support Zod 4 (unless you are dropping support for Zod 3, which isn't recommended).
You will need to bump your peer dependency to ^3.25.0, thus your users will need to npm upgrade zod. But there were no breaking changes made to Zod 3 between zod@3.24 and zod@3.25; in fact, there were no code changes whatsoever. As code changes will be required on the part of your users, I do not believe this constitutes a breaking change. I recommend against publishing a new major version.
How to support Zod 3 and Zod 4 simultaneously?
Starting in v3.25.0, the package contains copies of both Zod 3 and Zod 4 at their respective subpaths. This makes it easy to support both versions simultaneously.
import * as z3 from "zod/v3";import * as z4 from "zod/v4/core"; type Schema = z3.ZodTypeAny | z4.$ZodType; function acceptUserSchema(schema: z3.ZodTypeAny | z4.$ZodType) {  // ...}
To differentiate between Zod 3 and Zod 4 schemas at runtime, check for the "_zod" property. This property is only defined on Zod 4 schemas.
import type * as z3 from "zod/v3";import type * as z4 from "zod/v4/core"; declare const schema: z3.ZodTypeAny | v4.$ZodType; if ("_zod" in schema) {  schema._zod.def; // Zod 4 schema} else {  schema._def; // Zod 3 schema}
How to support Zod and Zod Mini simultaneously?
Your library code should only import from "zod/v4/core". This sub-package defines the interfaces, classes, and utilities that are shared between Zod and Zod Mini.
// library codeimport * as z4 from "zod/v4/core"; export function acceptObjectSchema<T extends z4.$ZodObject>(schema: T){  // parse data  z4.parse(schema, { /* somedata */});  // inspect internals  schema._zod.def.shape;}
By building against the shared base interfaces, you can reliably support both sub-packages simultaneously. This function can accept both Zod and Zod Mini schemas.
// user codeimport { acceptObjectSchema } from "your-library"; // Zod 4import * as z from "zod";acceptObjectSchema(z.object({ name: z.string() })); // Zod 4 Miniimport * as zm from "zod/mini";acceptObjectSchema(zm.object({ name: zm.string() }))
Refer to the Zod Core page for more information on the contents of the core sub-library.
How to accept user-defined schemas?
Accepting user-defined schemas is the a fundamental operation for any library built on Zod. This section outlines the best practices for doing so.
When starting out, it may be tempting to write a function that accepts a Zod schema like this:
import * as z4 from "zod/v4/core"; function inferSchema<T>(schema: z4.$ZodType<T>) {  return schema;}
This approach is incorrect, and limits TypeScript's ability to properly infer the argument. No matter what you pass in, the type of schema will be an instance of $ZodType.
inferSchema(z.string());// => $ZodType<string>
This approach loses type information, namely which subclass the input actually is (in this case, ZodString). That means you can't call any string-specific methods like .min() on the result of inferSchema. Instead, your generic parameter should extend the core Zod schema interface:
function inferSchema<T extends z4.$ZodType>(schema: T) {  return schema;} inferSchema(z.string());// => ZodString ✅
To constrain the input schema to a specific subclass:
import * as z4 from "zod/v4/core"; // only accepts object schemasfunction inferSchema<T>(schema: z4.$ZodObject) {  return schema;}
To constrain the inferred output type of the input schema:
import * as z4 from "zod/v4/core"; // only accepts string schemasfunction inferSchema<T extends z4.$ZodType<string>>(schema: T) {  return schema;} inferSchema(z.string()); // ✅ inferSchema(z.number()); // ❌ The types of '_zod.output' are incompatible between these types. // // Type 'number' is not assignable to type 'string'
To parse data with the schema, use the top-level z4.parse/z4.safeParse/z4.parseAsync/z4.safeParseAsync functions. The z4.$ZodType subclass has no methods on it. The usual parsing methods are implemented by Zod and Zod Mini, but are not available in Zod Core.
function parseData<T extends z4.$ZodType>(data: unknown, schema: T): z4.output<T> {  return z.parse(schema, data);} parseData("sup", z.string());// => string
Edit on GitHub
Next
Ecosystem
Next
Zod
On this page
Do I need to depend on Zod?
How to configure peer dependencies?
How to support Zod 4?
Do I need to publish a new major version?
How to support Zod 3 and Zod 4 simultaneously?
How to support Zod and Zod Mini simultaneously?
How to accept user-defined schemas?
Zod
The zod/v4 package is the "flagship" library of the Zod ecosystem. It strikes a balance between developer experience and bundle size that's ideal for the vast majority of applications.
If you have uncommonly strict constraints around bundle size, consider Zod Mini.
Zod aims to provide a schema API that maps one-to-one to TypeScript's type system.
import * as z from "zod"; const schema = z.object({  name: z.string(),  age: z.number().int().positive(),  email: z.string().email(),});
The API relies on methods to provide a concise, chainable, autocomplete-friendly way to define complex types.
z.string()  .min(5)  .max(10)  .toLowerCase();
All schemas extend the z.ZodType base class, which in turn extends z.$ZodType from zod/v4/core. All instance of ZodType implement the following methods:
import * as z from "zod"; const mySchema = z.string(); // parsingmySchema.parse(data);mySchema.safeParse(data);mySchema.parseAsync(data);mySchema.safeParseAsync(data); // refinementsmySchema.refine(refinementFunc);mySchema.superRefine(refinementFunc); // deprecated, use `.check()`mySchema.overwrite(overwriteFunc); // wrappersmySchema.optional();mySchema.nonoptional();mySchema.nullable();mySchema.nullish();mySchema.default(defaultValue);mySchema.array();mySchema.or(otherSchema);mySchema.transform(transformFunc);mySchema.catch(catchValue);mySchema.pipe(otherSchema);mySchema.readonly(); // metadata and registriesmySchema.register(registry, metadata);mySchema.describe(description);mySchema.meta(metadata); // utilitiesmySchema.check(checkOrFunction);mySchema.clone(def);mySchema.brand<T>();mySchema.isOptional(); // booleanmySchema.isNullable(); // boolean
Edit on GitHub
Next
For library authors
Next
Zod Mini
Zod Core
This sub-package exports the core classes and utilities that are consumed by Zod and Zod Mini. It is not intended to be used directly; instead it's designed to be extended by other packages. It implements:
import * as z from "zod/v4/core"; // the base class for all Zod schemasz.$ZodType; // subclasses of $ZodType that implement common parsersz.$ZodStringz.$ZodObjectz.$ZodArray// ... // the base class for all Zod checksz.$ZodCheck; // subclasses of $ZodCheck that implement common checksz.$ZodCheckMinLengthz.$ZodCheckMaxLength // the base class for all Zod errorsz.$ZodError; // issue formats (types only){} as z.$ZodIssue; // utilsz.util.isValidJWT(...);
Schemas
The base class for all Zod schemas is $ZodType. It accepts two generic parameters: Output and Input.
export class $ZodType<Output = unknown, Input = unknown> {  _zod: { /* internals */}}
zod/v4/core exports a number of subclasses that implement some common parsers. A union of all first-party subclasses is exported as z.$ZodTypes.
export type $ZodTypes =  | $ZodString  | $ZodNumber  | $ZodBigInt  | $ZodBoolean  | $ZodDate  | $ZodSymbol  | $ZodUndefined  | $ZodNullable  | $ZodNull  | $ZodAny  | $ZodUnknown  | $ZodNever  | $ZodVoid  | $ZodArray  | $ZodObject  | $ZodUnion  | $ZodIntersection  | $ZodTuple  | $ZodRecord  | $ZodMap  | $ZodSet  | $ZodLiteral  | $ZodEnum  | $ZodPromise  | $ZodLazy  | $ZodOptional  | $ZodDefault  | $ZodTemplateLiteral  | $ZodCustom  | $ZodTransform  | $ZodNonOptional  | $ZodReadonly  | $ZodNaN  | $ZodPipe  | $ZodSuccess  | $ZodCatch  | $ZodFile;
Inheritance diagram
Internals
All zod/v4/core subclasses only contain a single property: _zod. This property is an object containing the schemas internals. The goal is to make zod/v4/core as extensible and unopinionated as possible. Other libraries can "build their own Zod" on top of these classes without zod/v4/core cluttering up the interface. Refer to the implementations of zod and zod/mini for examples of how to extend these classes.
The _zod internals property contains some notable properties:
.def — The schema's definition: this is the object you pass into the class's constructor to create an instance. It completely describes the schema, and it's JSON-serializable.
.def.type — A string representing the schema's type, e.g. "string", "object", "array", etc.
.def.checks — An array of checks that are executed by the schema after parsing.
.input — A virtual property that "stores" the schema's inferred input type.
.output — A virtual property that "stores" the schema's inferred output type.
.run() — The schema's internal parser implementation.
If you are implementing a tool (say, a code generator) that must traverse Zod schemas, you can cast any schema to $ZodTypes and use the def property to discriminate between these classes.
export function walk(_schema: z.$ZodType) {  const schema = _schema as z.$ZodTypes;  const def = schema._zod.def;  switch (def.type) {    case "string": {      // ...      break;    }    case "object": {      // ...      break;    }  }}
There are a number of subclasses of $ZodString that implement various string formats. These are exported as z.$ZodStringFormatTypes.
export type $ZodStringFormatTypes =  | $ZodGUID  | $ZodUUID  | $ZodEmail  | $ZodURL  | $ZodEmoji  | $ZodNanoID  | $ZodCUID  | $ZodCUID2  | $ZodULID  | $ZodXID  | $ZodKSUID  | $ZodISODateTime  | $ZodISODate  | $ZodISOTime  | $ZodISODuration  | $ZodIPv4  | $ZodIPv6  | $ZodCIDRv4  | $ZodCIDRv6  | $ZodBase64  | $ZodBase64URL  | $ZodE164  | $ZodJWT
Parsing
As the Zod Core schema classes have no methods, there are top-level functions for parsing data.
import * as z from "zod/v4/core"; const schema = new z.$ZodString({ type: "string" });z.parse(schema, "hello");z.safeParse(schema, "hello");await z.parseAsync(schema, "hello");await z.safeParseAsync(schema, "hello");
Checks
Every Zod schema contains an array of checks. These perform post-parsing refinements (and occasionally mutations) that do not affect the inferred type.
const schema = z.string().check(z.email()).check(z.min(5));// => $ZodString schema._zod.def.checks;// => [$ZodCheckEmail, $ZodCheckMinLength]
The base class for all Zod checks is $ZodCheck. It accepts a single generic parameter T.
export class $ZodCheck<in T = unknown> {  _zod: { /* internals */}}
The _zod internals property contains some notable properties:
.def — The check's definition: this is the object you pass into the class's constructor to create the check. It completely describes the check, and it's JSON-serializable.
.def.check — A string representing the check's type, e.g. "min_length", "less_than", "string_format", etc.
.check() — Contains the check's validation logic.
zod/v4/core exports a number of subclasses that perform some common refinements. All first-party subclasses are exported as a union called z.$ZodChecks.
export type $ZodChecks =  | $ZodCheckLessThan  | $ZodCheckGreaterThan  | $ZodCheckMultipleOf  | $ZodCheckNumberFormat  | $ZodCheckBigIntFormat  | $ZodCheckMaxSize  | $ZodCheckMinSize  | $ZodCheckSizeEquals  | $ZodCheckMaxLength  | $ZodCheckMinLength  | $ZodCheckLengthEquals  | $ZodCheckProperty  | $ZodCheckMimeType  | $ZodCheckOverwrite  | $ZodCheckStringFormat
You can use the ._zod.def.check property to discriminate between these classes.
const check = {} as z.$ZodChecks;const def = check._zod.def; switch (def.check) {  case "less_than":  case "greater_than":    // ...    break;}
As with schema types, there are a number of subclasses of $ZodCheckStringFormat that implement various string formats.
export type $ZodStringFormatChecks =  | $ZodCheckRegex  | $ZodCheckLowerCase  | $ZodCheckUpperCase  | $ZodCheckIncludes  | $ZodCheckStartsWith  | $ZodCheckEndsWith  | $ZodGUID  | $ZodUUID  | $ZodEmail  | $ZodURL  | $ZodEmoji  | $ZodNanoID  | $ZodCUID  | $ZodCUID2  | $ZodULID  | $ZodXID  | $ZodKSUID  | $ZodISODateTime  | $ZodISODate  | $ZodISOTime  | $ZodISODuration  | $ZodIPv4  | $ZodIPv6  | $ZodCIDRv4  | $ZodCIDRv6  | $ZodBase64  | $ZodBase64URL  | $ZodE164  | $ZodJWT;
Use a nested switch to discriminate between the different string format checks.
const check = {} as z.$ZodChecks;const def = check._zod.def; switch (def.check) {  case "less_than":  case "greater_than":  // ...  case "string_format":    {      const formatCheck = check as z.$ZodStringFormatChecks;      const formatCheckDef = formatCheck._zod.def;      switch (formatCheckDef.format) {        case "email":        case "url":          // do stuff      }    }    break;}
You'll notice some of these string format checks overlap with the string format types above. That's because these classes implement both the $ZodCheck and $ZodType interfaces. That is, they can be used as either a check or a type. In these cases, both ._zod.parse (the schema parser) and ._zod.check (the check validation) are executed during parsing. In effect, the instance is prepended to its own checks array (though it won't actually exist in ._zod.def.checks).
// as a typez.email().parse("user@example.com"); // as a checkz.string().check(z.email()).parse("user@example.com")
Errors
The base class for all errors in Zod is $ZodError.
For performance reasons, $ZodError does not extend the built-in Error class! So using instanceof Error will return false.
The zod package implements a subclass of $ZodError called ZodError with some additional convenience methods.
The zod/mini sub-package directly uses $ZodError
export class $ZodError<T = unknown> implements Error { public issues: $ZodIssue[];}
Issues
The issues property corresponds to an array of $ZodIssue objects. All issues extend the z.$ZodIssueBase interface.
export interface $ZodIssueBase {  readonly code?: string;  readonly input?: unknown;  readonly path: PropertyKey[];  readonly message: string;}
Zod defines the following issue subtypes:
export type $ZodIssue =  | $ZodIssueInvalidType  | $ZodIssueTooBig  | $ZodIssueTooSmall  | $ZodIssueInvalidStringFormat  | $ZodIssueNotMultipleOf  | $ZodIssueUnrecognizedKeys  | $ZodIssueInvalidUnion  | $ZodIssueInvalidKey  | $ZodIssueInvalidElement  | $ZodIssueInvalidValue  | $ZodIssueCustom;
For details on each type, refer to the implementation.
Edit on GitHub
Next
Zod Mini
On this page
Schemas
Internals
Parsing
Checks
Errors
Issues


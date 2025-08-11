useForm
React hooks for form validation
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
Select page...registerunregisterformstatewatchsubscribehandlesubmitresetresetFieldsetErrorclearErrorssetValuesetFocusgetValuesgetFieldStatetriggercontrolForm
</> useForm: UseFormProps
useForm is a custom hook for managing forms with ease. It takes one object as optional argument. The following example demonstrates all of its properties along with their default values.
Generic props:
Option
Description
mode
Validation strategy before submitting behaviour.
reValidateMode
Validation strategy after submitting behaviour.
defaultValues
Default values for the form, this value will be cached.
values
Reactive values to update the form values.
errors
Server returns errors to update form. ⚠ Important: Keep the errors object reference-stable to avoid infinite re-renders.
resetOptions
Option to reset form state update while updating new form values.
criteriaMode
Display all validation errors or one at a time.
shouldFocusError
Enable or disable built-in focus management.
delayError
Delay error from appearing instantly.
shouldUseNativeValidation
Use browser built-in form constraint API.
shouldUnregister
Enable and disable input unregister after unmount.
disabled
Disable the entire form with all associated inputs.

Schema validation props:
Option
Description
resolver
Integrates with your preferred schema validation library.
context
A context object to supply for your schema validation.

Props

mode: onChange | onBlur | onSubmit | onTouched | all = 'onSubmit' !React Native: compatible with Controller

This option allows you to configure the validation strategy before a user submits the form. The validation occurs during the onSubmit event, which is triggered by invoking the handleSubmit function.
Name
Type
Description
onSubmit
string
Validation is triggered on the submit event, and inputs attach onChange event listeners to re-validate themselves.
onBlur
string
Validation is triggered on the blur event.
onChange
string
Validation is triggered on the changeevent for each input, leading to multiple re-renders. Warning: this often comes with a significant impact on performance.
onTouched
string
Validation is initially triggered on the first blur event. After that, it is triggered on every change event.

Note: when using with Controller, make sure to wire up onBlur with the render prop.
all
string
Validation is triggered on both blur and change events.

reValidateMode: onChange | onBlur | onSubmit = 'onChange' !React Native: Custom register or using Controller

This option allows you to configure validation strategy when inputs with errors get re-validated after a user submits the form (onSubmit event and handleSubmit function executed). By default, re-validation occurs during the input change event.
defaultValues: FieldValues | () => Promise<FieldValues>

The defaultValues prop populates the entire form with default values. It supports both synchronous and asynchronous assignment of default values. While you can set an input's default value using defaultValue or defaultChecked (as detailed in the official React documentation), it is recommended to use defaultValues for the entire form.
Copy
useForm({
 defaultValues: {
   firstName: '',
   lastName: ''
 }
})


// set default value async
useForm({
 defaultValues: async () => fetch('/api-endpoint');
})
 RULES
You should avoid providing undefined as a default value, as it conflicts with the default state of a controlled component.
defaultValues are cached. To reset them, use the reset API.
defaultValues will be included in the submission result by default.
It's recommended to avoid using custom objects containing prototype methods, such as Moment or Luxon, as defaultValues.
There are other options for including form data:
// adding a hidden input
<input {...register("hidden", { value: "data" })} type="hidden" />
// include data onSubmit
const onSubmit = (data) => {
  const output = {
    ...data,
    others: "others",
  }
}
values: FieldValues

The values prop will react to changes and update the form values, which is useful when your form needs to be updated by external state or server data. The values prop will overwrite the defaultValues prop, unless resetOptions: { keepDefaultValues: true } is also set for useForm.
Copy
// set default value sync
function App({ values }) {
 useForm({
   values, // will get updated when values props updates
 })
}


function App() {
 const values = useFetch("/api")


 useForm({
   defaultValues: {
     firstName: "",
     lastName: "",
   },
   values, // will get updated once values returns
 })
}
errors: FieldErrors

The errors props will react to changes and update the server errors state, which is useful when your form needs to be updated by external server returned errors.
Copy
function App() {
 const { errors, data } = useFetch("/api")


 useForm({
   errors, // will get updated once errors returns
 })
}
resetOptions: KeepStateOptions

This property is related to value update behaviors. When values or defaultValues are updated, the reset API is invoked internally. It's important to specify the desired behavior after values or defaultValues are asynchronously updated. The configuration option itself is a reference to the reset method's options.
Copy
// by default asynchronously value or defaultValues update will reset the form values
useForm({ values })
useForm({ defaultValues: async () => await fetch() })


// options to config the behaviour
// eg: I want to keep user interacted/dirty value and not remove any user errors
useForm({
 values,
 resetOptions: {
   keepDirtyValues: true, // user-interacted input will be retained
   keepErrors: true, // input errors will be retained with value update
 },
})
context: object





This context object is mutable and will be injected into the resolver's second argument or Yup validation's context object.
CodeSandbox

criteriaMode: firstError | all





When set to firstError (default), only the first error from each field will be gathered.
When set to all, all errors from each field will be gathered.
CodeSandbox

shouldFocusError: boolean = true

When set to true (default), and the user submits a form that fails validation, focus is set on the first field with an error.
 NOTE
Only registered fields with a ref will work. Custom registered inputs do not apply. For example: register('test') // doesn't work
The focus order is based on the register order.
delayError: number





This configuration delays the display of error states to the end-user by a specified number of milliseconds. If the user corrects the error input, the error is removed instantly, and the delay is not applied.
CodeSandbox

shouldUnregister: boolean = false

By default, an input value will be retained when input is removed. However, you can set shouldUnregister to true to unregister input during unmount.
This is a global configuration that overrides child-level configurations. To have individual behavior, set the configuration at the component or hook level, not at useForm.
By default, shouldUnregister: false means unmounted fields are not validated by built-in validation.
By setting shouldUnregister to true at useForm level, defaultValues will not be merged against submission result.
Setting shouldUnregister: true makes your form behave more closely to native forms.
Form values are stored within the inputs themselves.
Unmounting an input removes its value.
Hidden inputs should use the hidden attribute for storing hidden data.
Only registered inputs are included as submission data.
Unmounted inputs must be notified at either useForm or useWatch's useEffect for the hook form to verify that the input is unmounted from the DOM.
const NotWork = () => {
  const [show, setShow] = React.useState(false)
  // ❌ won't get notified, need to invoke unregister
  return show && <input {...register("test")} />
}


const Work = ({ control }) => {
  const { show } = useWatch({ control })
  // ✅ get notified at useEffect
  return show && <input {...register("test1")} />
}


const App = () => {
  const [show, setShow] = React.useState(false)
  const { control } = useForm({ shouldUnregister: true })
  return (
    <div>
      // ✅ get notified at useForm's useEffect
      {show && <input {...register("test2")} />}
      <NotWork />
      <Work control={control} />
    </div>
  )
}
shouldUseNativeValidation: boolean = false

This config will enable browser native validation. It will also enable CSS selectors :valid and:invalid making styling inputs easier. You can still use these selectors even when client-side validation is disabled.
Only works with onSubmit and onChange modes, as the reportValidity execution will focus the error input.
Each registered field's validation message is required to be string to display them natively.
This feature only works with the register API and useController/Controller that are connected with actual DOM references.
Examples:

Copy
import { useForm } from "react-hook-form"


export default function App() {
 const { register, handleSubmit } = useForm({
   shouldUseNativeValidation: true,
 })
 const onSubmit = async (data) => {
   console.log(data)
 }


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input
       {...register("firstName", {
         required: "Please enter your first name.",
       })} // custom message
     />
     <input type="submit" />
   </form>
 )
}
disabled: boolean = false

This config allows you to disable the entire form and all associated inputs when set to true.
This can be useful for preventing user interaction during asynchronous tasks or other situations where inputs should be temporarily unresponsive.
Examples:

Copy
import { useForm, Controller } from "react-hook-form"


const App = () => {
 const [disabled, setDisabled] = useState(false)
 const { register, handleSubmit, control } = useForm({
   disabled,
 })


 return (
   <form
     onSubmit={handleSubmit(async () => {
       setDisabled(true)
       await sleep(100)
       setDisabled(false)
     })}
   >
     <input
       type={"checkbox"}
       {...register("checkbox")}
       data-testid={"checkbox"}
     />
     <select {...register("select")} data-testid={"select"} />


     <Controller
       control={control}
       render={({ field }) => <input disabled={field.disabled} />}
       name="test"
     />


     <button type="submit">Submit</button>
   </form>
 )
}
resolver: Resolver

This function allows you to use any external validation library such as Yup, Zod, Joi, Vest, Ajv and many others. The goal is to make sure you can seamlessly integrate whichever validation library you prefer. If you're not using a library, you can always write your own logic to validate your forms.
Copy
npm install @hookform/resolvers
Props

Name
Type
Description
values
object
This object contains the entire form values.
context
object
This is the context object which you can provide to the useForm config. It is a mutable object that can be changed on each re-render.
options
{
  "criteriaMode": "string",
  "fields": "object",
  "names": "string[]"
}
This is the option object containing information about the validated fields, names and criteriaMode from useForm.

 RULES
Schema validation focuses on field-level error reporting. Parent-level error checking is limited to the direct parent level, which is applicable for components such as group checkboxes.
This function will be cached.
Re-validation of an input will only occur one field at time during a user’s interaction. The lib itself will evaluate the error object to trigger a re-render accordingly.
A resolver can not be used with the built-in validators (e.g.: required, min, etc.)
When building a custom resolver:
Make sure that you return an object with both values and errors properties. Their default values should be an empty object. For example: {}.
The keys of the errors object should match the name values of your fields, but they must be hierarchical rather than a single key for deep errors: ❌ { "participants.1.name": someErr } will not set or clear properly - instead, use ✅ { participants: [null, { name: someErr } ] } as this is reachable as errors.participants[1].name - you can still prepare your errors using flat keys, and then use a function like this one from the zod resolver: toNestErrors(flatErrs, resolverOptions)
Examples:

YupZodJoiAjvVestCustom
Copy
CodeSandboxTS
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"


const schema = yup
 .object()
 .shape({
   name: yup.string().required(),
   age: yup.number().required(),
 })
 .required()


const App = () => {
 const { register, handleSubmit } = useForm({
   resolver: yupResolver(schema), // yup, joi and even your own.
 })


 return (
   <form onSubmit={handleSubmit((d) => console.log(d))}>
     <input {...register("name")} />
     <input type="number" {...register("age")} />
     <input type="submit" />
   </form>
 )
}
Need more? See Resolver Documentation
 TIP
You can debug your schema via the following code snippet:
Copy
resolver: async (data, context, options) => {
 // you can debug your validation schema here
 console.log("formData", data)
 console.log(
   "validation result",
   await anyResolver(schema)(data, context, options)
 )
 return anyResolver(schema)(data, context, options)
}
useForm return and useEffect dependencies
In a future major release, useForm return will be memoized to optimize performance and reflect changes in formState. As a result, adding the entire return value of useForm to a useEffect dependency list may lead to infinite loops.
 WARNING
The following code is likely to create this situation:
const methods = useForm()


useEffect(() => {
 methods.reset({ ... })
}, [methods])
Passing only the relevant methods, as showed below, should avoid this kind of issue:
const methods = useForm()


useEffect(() => {
 methods.reset({ ... })
}, [methods.reset])
 TIP
The recommended way is to pass destructured methods to the dependencies of an useEffect
const { reset } = useForm()


useEffect(() => {
 reset({ ... })
}, [reset])
More info can be found on this issue
Return

The following list contains reference to useForm return props.
register
unregister
formState
watch
handleSubmit
reset
resetField
setError
clearErrors
setValue
setFocus
getValues
getFieldState
trigger
control
Form


register
Register uncontrolled/controlled inputs
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> register: (name: string, options?: RegisterOptions) => ({ ref, name, onChange, onBlur })
This method allows you to register an input or select element and apply validation rules to React Hook Form. Validation rules are all based on the HTML standard and also allow for custom validation methods.
Props

Name
Type
Description
name
string
Input's name.
options
RegisterOptions
Input's behavior.

Return

Name
Type
Description
ref
React.ref
React element ref used to connect hook form to the input.
name
string
Input's name being registered.
onChange
ChangeHandler
onChange prop to subscribe the input change event.
onBlur
ChangeHandler
onBlur prop to subscribe the input blur event.

 NOTE
This is how submitted values will look like:
Input Name
Submit Result
register("firstName")
{ firstName: value }
register("name.firstName")
{ name: { firstName: value } }
register("name.firstName.0")
{ name: { firstName: [ value ] } }

Options

By selecting the register option, the API table below will get updated.
validationvalidation and error message
Name
Description
ref
React.Ref
React element ref
required
boolean
Indicates that the input must have a value before the form can be submitted.

Note: This config aligns with web constrained API for required input validation, for object or array type of input use validate function instead.
maxLength
number
The maximum length of the value to accept for this input.
minLength
number
The minimum length of the value to accept for this input.
max
number
The maximum value to accept for this input.
min
number
The minimum value to accept for this input.
pattern
RegExp
The regex pattern for the input.

Note: RegExp with the /g flag keeps track of the last index where a match occurred.
validate
Function |
Record<string, Function>
Validate function will be executed on its own without depending on other validation rules included in the required attribute.

Note: for object or array input data, it's recommended to use the validate function for validation as the other rules mostly apply to string, array of strings, number and boolean.
valueAsNumber
boolean
Returns Number normally. If something goes wrong NaN will be returned.
valueAs process is happening before validation.
Only applies to number input, but without any data manipulation.
Does not transform defaultValue or defaultValues.
valueAsDate
boolean
Returns Date normally. If something goes wrong Invalid Date will be returned.
valueAs process is happening before validation.
Only applies to input.
Does not transform defaultValue or defaultValues.
setValueAs
<T>(value: any) => T
Return input value by running through the function.
valueAs process is happening before validation. Also, setValueAs is ignored if either valueAsNumber or valueAsDate are true.
Only applies to text input.
Does not transform defaultValue or defaultValues.
disabled
boolean = false
Set disabled to true will lead input value to be undefined and input control to be disabled.
disabled prop will also omit built-in validation rules.
For schema validation, you can leverage the undefined value returned from input or context object.
onChange
(e: SyntheticEvent) => void
onChange function event to be invoked in the change event.
onBlur
(e: SyntheticEvent) => void
onBlur function event to be invoked in the blur event.
value
unknown
Set up value for the registered input. This prop should be utilised inside useEffect or invoke once, each re-run will update or overwrite the input value which you have supplied.
shouldUnregister
boolean
Input will be unregistered after unmount and defaultValues will be removed as well.

Note: this prop should be avoided when using with useFieldArray as unregister function gets called after input unmount/remount and reorder.
deps
string | string[]
Validation will be triggered for the dependent inputs, it only limited to register api not trigger.

 RULES
Name is required and unique (except native radio and checkbox). Input name supports both dot and bracket syntax, which allows you to easily create nested form fields.
Name can neither start with a number nor use number as key name. Please avoid special characters as well.
We are using dot syntax only for typescript usage consistency, so bracket [] will not work for array form value.
register('test.0.firstName'); // ✅
register('test[0]firstName'); // ❌
Disabled input will result in an undefined form value. If you want to prevent users from updating the input, you can use readOnly or disable the entire fieldset. Here is an example.
To produce an array of fields, input names should be followed by a dot and number. For example: test.0.data
Changing the name on each render will result in new inputs being registered. It's recommended to keep static names for each registered input.
Input value and reference will no longer gets removed based on unmount. You can invoke unregister to remove that value and reference.
Individual register option can't be removed by undefined or {}. You can update individual attribute instead.
register('test', { required: true });
register('test', {}); // ❌
register('test', undefined); // ❌
register('test', { required: false });  // ✅
There are certain keyword which need to avoid before conflicting with type check. They are ref, _f.
Examples

Register input or select
CodeSandboxJS
import { useForm } from "react-hook-form"


export default function App() {
 const { register, handleSubmit } = useForm({
   defaultValues: {
     firstName: "",
     lastName: "",
     category: "",
     checkbox: [],
     radio: "",
   },
 })


 return (
   <form onSubmit={handleSubmit(console.log)}>
     <input
       {...register("firstName", { required: true })}
       placeholder="First name"
     />


     <input
       {...register("lastName", { minLength: 2 })}
       placeholder="Last name"
     />


     <select {...register("category")}>
       <option value="">Select...</option>
       <option value="A">Category A</option>
       <option value="B">Category B</option>
     </select>


     <input {...register("checkbox")} type="checkbox" value="A" />
     <input {...register("checkbox")} type="checkbox" value="B" />
     <input {...register("checkbox")} type="checkbox" value="C" />


     <input {...register("radio")} type="radio" value="A" />
     <input {...register("radio")} type="radio" value="B" />
     <input {...register("radio")} type="radio" value="C" />


     <input type="submit" />
   </form>
 )
}
Custom async validation
import { useForm } from "react-hook-form"
import { checkProduct } from "./service"


export default function App() {
 const { register, handleSubmit } = useForm()


 return (
   <form onSubmit={handleSubmit(console.log)}>
     <select
       {...register("category", {
         required: true,
       })}
     >
       <option value="">Select...</option>
       <option value="A">Category A</option>
       <option value="B">Category B</option>
     </select>


     <input
       type="text"
       {...register("product", {
         validate: {
           checkAvailability: async (product, { category }) => {
             if (!category) return "Choose a category"
             if (!product) return "Specify your product"
             const isInStock = await checkProduct(category, product)
             return isInStock || "There is no such product"
           },
         },
       })}
     />


     <input type="submit" />
   </form>
 )
}
Video

Tips

Destructuring assignment
const { onChange, onBlur, name, ref } = register('firstName');
// include type check against field path with the name you have supplied.


<input
 onChange={onChange} // assign onChange event
 onBlur={onBlur} // assign onBlur event
 name={name} // assign name prop
 ref={ref} // assign ref prop
/>
// same as above
<input {...register('firstName')} />
Custom Register
You can also register inputs with useEffect and treat them as virtual inputs. For controlled components, we provide a custom hook useController and Controller component to take care this process for you.
If you choose to manually register fields, you will need to update the input value with setValue.
register('firstName', { required: true, min: 8 });


<TextInput onTextChange={(value) => setValue('lastChange', value))} />
How to work with innerRef, inputRef?
When the custom input component didn't expose ref correctly, you can get it working via the following.
// not working, because ref is not assigned
<TextInput {...register('test')} />


const firstName = register('firstName', { required: true })
<TextInput
 name={firstName.name}
 onChange={firstName.onChange}
 onBlur={firstName.onBlur}
 inputRef={firstName.ref} // you can achieve the same for different ref name such as innerRef
/>
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
register
unregister
Unregister uncontrolled/controlled inputs
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> unregister: (name: string | string[], options) => void
This method allows you to unregister a single input or an array of inputs. It also provides a second optional argument to keep state after unregistering an input.
Props

The example below shows what to expect when you invoke the unregister method.
<input {...register('yourDetails.firstName')} />
<input {...register('yourDetails.lastName')} />
Type
Input Name
Value
string
unregister("yourDetails")
{}
string
unregister("yourDetails.firstName")
{ lastName: '' }
string[]
unregister(["yourDetails.lastName"])
''

Options

Name
Type
Description
keepDirty
boolean
isDirty and dirtyFields will be remained during this action. However, this is not going to guarantee the next user input will not update isDirty formState, because isDirty is measured against the defaultValues.
keepTouched
boolean
touchedFields will no longer remove that input after unregister.
keepIsValid
boolean
isValid will be remained during this action. However, this is not going to guarantee the next user input will not update isValid for schema validation, you will have to adjust the schema according with the unregister.
keepError
boolean
errors will not be updated.
keepValue
boolean
input's current value will not be updated.
keepDefaultValue
boolean
input's defaultValue which defined in useForm will be remained.

 RULES
This method will remove input reference and its value, which means built-in validation rules will be removed as well.
By unregister an input, it will not affect the schema validation.
const schema = yup
  .object()
  .shape({
    firstName: yup.string().required(),
  })
  .required()


unregister("firstName") // this will not remove the validation against firstName input
Make sure you unmount that input which has register callback or else the input will get registered again.
const [show, setShow] = React.useState(true)


const onClick = () => {
  unregister("test")
  setShow(false) // make sure to unmount that input so register not invoked again.
}


{
  show && <input {...register("test")} />
}
Examples:

TSJS
Copy
CodeSandboxTS
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"


interface IFormInputs {
 firstName: string
 lastName?: string
}


export default function App() {
 const { register, handleSubmit, unregister } = useForm<IFormInputs>()
 const onSubmit = (data: IFormInputs) => console.log(data)


 React.useEffect(() => {
   register("lastName")
 }, [register])


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <button type="button" onClick={() => unregister("lastName")}>
       unregister
     </button>
     <input type="submit" />
   </form>
 )
}
Video

Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
unregister
formState
State of the form
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> formState: Object
This object contains information about the entire form state. It helps you to keep on track with the user's interaction with your form application.
Return

Name
Type
Description
isDirty
boolean
Set to true after the user modifies any of the inputs.
Important: make sure to provide all inputs' defaultValues at the useForm, so hook form can have a single source of truth to compare whether the form is dirty.
const {
  formState: { isDirty, dirtyFields },
  setValue
} = useForm({ defaultValues: { test: "" } })


// isDirty: true ✅
setValue('test', 'change')


// isDirty: false because there getValues() === defaultValues ❌
setValue('test', '')
File typed input will need to be managed at the app level due to the ability to cancel file selection and FileList object.
Do not support custom object, Class or File object.
dirtyFields
object
An object with the user-modified fields. Make sure to provide all inputs' defaultValues via useForm, so the library can compare against the defaultValues.
Important: make sure to provide defaultValues at the useForm, so hook form can have a single source of truth to compare each field's dirtiness.
Dirty fields will not represent as isDirty formState, because dirty fields are marked field dirty at field level rather the entire form. If you want to determine the entire form state use isDirty instead.
touchedFields
object
An object containing all the inputs the user has interacted with.
defaultValues
object
The value which has been set at useForm's defaultValues or updated defaultValues via reset API.
isSubmitted
boolean
Set to true after the form is submitted. Will remain true until the reset method is invoked.
isSubmitSuccessful
boolean
Indicate the form was successfully submitted without any runtime error.
isSubmitting
boolean
true if the form is currently being submitted. false otherwise.
isLoading
boolean
true if the form is currently loading async default values.
Important: this prop is only applicable to async defaultValues
const {
  formState: { isLoading }
} = useForm({
  defaultValues: async () => await fetch('/api')
})
submitCount
number
Number of times the form was submitted.
isValid
boolean
Set to true if the form doesn't have any errors.
setError has no effect on isValid formState, isValid will always derived via the entire form validation result.
isValidating
boolean
Set to true during validation.
validatingFields
object
Capture fields which are getting async validation.
errors
object
An object with field errors. There is also an ErrorMessage component to retrieve error message easily.
disabled
boolean
Set to true if the form is disabled via the disabled prop in useForm.
isReady
boolean
Set to true when formState subscription setup is ready.
Renders children before the parent completes setup. If you're using useForm methods (eg. setValue) in a child before the subscription is ready, it can cause issues. Use an isReady flag to ensure the form is initialized before updating state from the child.
const {
 setValue,
 formState: { isReady }
} = useForm();


// Parent component: ✅
 useEffect(() => setValue('test', 'data'), [])
 
// Children component: ✅
 useEffect(() => isReady && setValue('test', 'data'), [isReady])

 RULES
Returned formState is wrapped with a Proxy to improve render performance and skip extra logic if specific state is not subscribed to. Therefore make sure you invoke or read it before a render in order to enable the state update.
formState is updated in batch. If you want to subscribe to formState via useEffect, make sure that you place the entire formState in the optional array.
snippetexample
useEffect(() => {
  if (formState.errors.firstName) {
    // do the your logic here
  }
}, [formState]) // ✅
// ❌ [formState.errors] will not trigger the useEffect
Pay attention to the logical operator when subscription to formState.
Copy
// ❌ formState.isValid is accessed conditionally,


// so the Proxy does not subscribe to changes of that state
return <button disabled={!formState.isDirty || !formState.isValid} />;


// ✅ read all formState values to subscribe to changes
const { isDirty, isValid } = formState;
return <button disabled={!isDirty || !isValid} />;
Examples

JS
TS
Copy
CodeSandboxJS
import { useForm } from "react-hook-form";


export default function App() {
 const {
   register,
   handleSubmit,
   // Read the formState before render to subscribe the form state through the Proxy
   formState: { errors, isDirty, isSubmitting, touchedFields, submitCount },
 } = useForm();
 const onSubmit = (data) => console.log(data);


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input {...register("test")} />
     <input type="submit" />
   </form>
 );
}
Video

Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
formState
watch
Subscribe to input changes
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> watch: UseFormWatch
This method will watch specified inputs and return their values. It is useful to render input value and for determining what to render by condition.
Overloads
This function mainly serves two purposes:
watch(name: string, defaultValue?: unknown): unknown
watch(names: string[], defaultValue?: {[key:string]: unknown}): unknown[]
watch(): {[key:string]: unknown}
The explanation of each of these four overloads follows below.
1-a. Watching single field watch(name: string, defaultValue?: unknown): unknown

Watch and subscribe to a single field used outside of render.
Params
Name
Type
Description
name
string
the field name
defaultValue
unknown
optional. default value for field

Returns the single field value.
const name = watch("name")
1-b. Watching some fields watch(names: string[], defaultValue?: {[key:string]: unknown}): unknown[]

Watch and subscribe to an array of fields used outside of render.
Params
Name
Type
Description
names
string[]
the field names
defaultValue
{[key:string]: unknown}
optional. default values for fields

Returns an array of field values.
const [name, name1] = watch(["name", "name1"])
1-c. Watching the entire form watch(): {[key:string]: unknown}

Watch and subscribe to the entire form update/change based on onChange and re-render at the useForm.
Params None
Returns the entire form values.
const formValues = watch()
2. Deprecated: consider use or migrate to subscribe. Watching with callback fn watch(callback: (data, { name, type }) => void, defaultValues?: {[key:string]: unknown}): { unsubscribe: () => void }

Subscribe to field update/change without trigger re-render.
Params
Name
Type
Description
callback
(data, { name, type }) => void
callback function to subscribe to all fields changes
defaultValues
{[key:string]: unknown}
optional. defaultValues for the entire form

Returns object with unsubscribe function.
Rules

When defaultValue is not defined, the first render of watch will return undefined because it is called before register. It's recommended to provide defaultValues at useForm to avoid this behaviour, but you can set the inline defaultValue as the second argument.
When both defaultValue and defaultValues are supplied, defaultValue will be returned.
This API will trigger re-render at the root of your app or form, consider using a callback or the useWatch api if you are experiencing performance issues.
watch result is optimised for render phase instead of useEffect's deps, to detect value update you may want to use an external custom hook for value comparison.
Examples:

Watch in a Form
TSJS
Copy
CodeSandboxTS
import { useForm } from "react-hook-form"


interface IFormInputs {
 name: string
 showAge: boolean
 age: number
}


function App() {
 const {
   register,
   watch,
   formState: { errors },
   handleSubmit,
 } = useForm<IFormInputs>()
 const watchShowAge = watch("showAge", false) // you can supply default value as second argument
 const watchAllFields = watch() // when pass nothing as argument, you are watching everything
 const watchFields = watch(["showAge", "age"]) // you can also target specific fields by their names


 const onSubmit = (data: IFormInputs) => console.log(data)


 return (
   <>
     <form onSubmit={handleSubmit(onSubmit)}>
       <input {...register("name", { required: true, maxLength: 50 })} />
       <input type="checkbox" {...register("showAge")} />
       {/* based on yes selection to display Age Input*/}
       {watchShowAge && (
         <input type="number" {...register("age", { min: 50 })} />
       )}
       <input type="submit" />
     </form>
   </>
 )
}
Watch in Field Array
TSJS
Copy
CodeSandboxTS
import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"


type FormValues = {
 test: {
   firstName: string
   lastName: string
 }[]
}


function App() {
 const { register, control, handleSubmit, watch } = useForm<FormValues>()
 const { fields, remove, append } = useFieldArray({
   name: "test",
   control,
 })
 const onSubmit = (data: FormValues) => console.log(data)


 console.log(watch("test"))


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     {fields.map((field, index) => {
       return (
         <div key={field.id}>
           <input
             defaultValue={field.firstName}
             {...register(`test.${index}.firstName`)}
           />
           <input
             defaultValue={field.lastName}
             {...register(`test.${index}.lastName`)}
           />
           <button type="button" onClick={() => remove(index)}>
             Remove
           </button>
         </div>
       )
     })}
     <button
       type="button"
       onClick={() =>
         append({
           firstName: "bill" + renderCount,
           lastName: "luo" + renderCount,
         })
       }
     >
       Append
     </button>
   </form>
 )
}
Video

Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
watch


subscribe
Subscribe to form state update without render
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
subscribe: UseFormSubscribe<TFieldValues extends FieldValues>
Subscribe to formState changes and value updates. You can subscribe to individual fields or the entire form, while avoiding unnecessary re-renders caused by form changes.
Props

Name
Type
Description
Example
name
undefined
Subscribe to the entire form
subscribe()


string[]
Subscribe on multiple fields by name.
subscribe({ name: ['firstName', 'lastName'] })
formState
Partial<ReadFormState>
Pick which formState to be subscribed.
subscribe({
 formState: {
   values: true,
   isDirty: true,
   dirtyFields: true,
   touchedFields: true,
   isValid: true,
   errors: true,
   validatingFields: true,
   isValidating: true
 }
})
callback
Function
The callback function for the subscription.
subscribe({
 formState: {
   values: true
 },
 callback: ({ values }) => {
   console.log(values)
 }
})
exact
boolean
This prop will enable an exact match for input name subscriptions.
subscribe({ name: 'target', exact: true })

 NOTES
This function is intended for subscribing to changes only; dispatching state updates or triggering re-renders is not allowed. eg setValue or reset
This function shares the same functionality as createFormControl.subscribe, with the key difference being that createFormControl can be initialized outside of a React component.
This function is dedicated for subscribe form state without render, use this function for that instead of watch callback function.
Examples:

Copy
import { useForm } from "react-hook-form"


type FormInputs = {
 firstName: string
 lastName: string
}


export default function App() {
 const { register, subscribe } = useForm<FormInputs>()


 useEffect(() => {
   // make sure to unsubscribe;
   const callback = subscribe({
     formState: {
       values: true,
     },
     callback: ({ values }) => {
       console.log(values)
     },
   })


   return () => callback()


   // You can also just return the subscribe
   // return subscribe();
 }, [subscribe])


 return (
   <form>
     <input {...register("firstName", { required: true })} />
     <input {...register("lastName", { required: true })} />
   </form>
 )
}
handleSubmit
Ready to send to the server
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> handleSubmit: ((data: Object, e?: Event) => Promise<void>, (errors: Object, e?: Event) => Promise<void>) => Promise<void>
This function will receive the form data if form validation is successful.
Props

Name
Type
Description
SubmitHandler
(data: Object, e?: Event) => Promise<void>
A successful callback.
SubmitErrorHandler
(errors: Object, e?: Event) => Promise<void>
An error callback.

 RULES
You can easily submit form asynchronously with handleSubmit.
Copy
handleSubmit(onSubmit)()


// You can pass an async function for asynchronous validation.
handleSubmit(async (data) => await fetchAPI(data))
disabled inputs will appear as undefined values in form values. If you want to prevent users from updating an input and wish to retain the form value, you can use readOnly or disable the entire <fieldset />. Here is an example.
handleSubmit function will not swallow errors that occurred inside your onSubmit callback, so we recommend you to try and catch inside async request and handle those errors gracefully for your customers.
const onSubmit = async () => {
  // async request which may result error
  try {
    // await fetch()
  } catch (e) {
    // handle your error
  }
}


return <form onSubmit={handleSubmit(onSubmit)} />
Examples:

Sync
TSJS
Copy
CodeSandboxTS
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form"


type FormValues = {
 firstName: string
 lastName: string
 email: string
}


export default function App() {
 const { register, handleSubmit } = useForm<FormValues>()
 const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data)
 const onError: SubmitErrorHandler<FormValues> = (errors) =>
   console.log(errors)


 return (
   <form onSubmit={handleSubmit(onSubmit, onError)}>
     <input {...register("firstName")} />
     <input {...register("lastName")} />
     <input type="email" {...register("email")} />


     <input type="submit" />
   </form>
 )
}
Async
Copy
CodeSandboxJS
import { useForm } from "react-hook-form";


const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


function App() {
 const { register, handleSubmit, formState: { errors } } = useForm();
 const onSubmit = async data => {
   await sleep(2000);
   if (data.username === "bill") {
     alert(JSON.stringify(data));
   } else {
     alert("There is an error");
   }
 };


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <label htmlFor="username">User Name</label>
     <input placeholder="Bill" {...register("username"} />


     <input type="submit" />
   </form>
 );
}
Video

The following video tutorial explains the handleSubmit API in detail.
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
handleSubmit
reset
Reset form state and values
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> reset: <T>(values?: T | ResetAction<T>, options?: Record<string, boolean>) => void
Reset the entire form state, fields reference, and subscriptions. There are optional arguments and will allow partial form state reset.
Props

Reset has the ability to retain formState. Here are the options you may use:
Name


Type
Description
values


object | (values: Object) => Object
An optional object to reset form values, and it's recommended to provide the entire defaultValues when supplied.
options
keepErrors
boolean
All errors will remain. This will not guarantee with further user actions.


keepDirty
boolean
DirtyFields form state will remain, and isDirty will temporarily remain as the current state until further user's action.

Important: this keep option doesn't reflect form input values but only dirty fields form state.


keepDirtyValues
boolean
DirtyFields and isDirty will remained, and only none dirty fields will be updated to the latest rest value. Check out the example.

Important: formState dirtyFields will need to be subscribed.


keepValues
boolean
Form input values will be unchanged.


keepDefaultValues
boolean
Keep the same defaultValues which are initialised via useForm.
isDirty will be checked again: it is set to be the result of the comparison of any new values provided against the original defaultValues.
dirtyFields will be updated again if values are provided: it is set to be result of the comparison between the new values provided against the original defaultValues.


keepIsSubmitted
boolean
isSubmitted state will be unchanged.


keepTouched
boolean
isTouched state will be unchanged.


keepIsValid
boolean
isValid will temporarily persist as the current state until additional user actions.


keepSubmitCount
boolean
submitCount state will be unchanged.

 RULES
For controlled components you will need to pass defaultValues to useForm in order to reset the Controller components' value.
When defaultValues is not supplied to reset API, then HTML native reset API will be invoked to restore the form.
Avoid calling reset before useForm's useEffect is invoked, this is because useForm's subscription needs to be ready before reset can send a signal to flush form state update.
It's recommended to reset inside useEffect after submission.
useEffect(() => {
  reset({
    data: "test",
  })
}, [isSubmitSuccessful])
It's fine to run reset without argument as long as you have provided a defaultValues at useForm.
reset() // update form back to default values


reset({ test: "test" }) // update your defaultValues && form values


reset(undefined, { keepDirtyValues: true }) // reset other form state but keep defaultValues and form values
Examples:

Uncontrolled
TSJS
Copy
CodeSandboxTS
import { useForm } from "react-hook-form"


interface UseFormInputs {
 firstName: string
 lastName: string
}


export default function Form() {
 const {
   register,
   handleSubmit,
   reset,
   formState: { errors },
 } = useForm<UseFormInputs>()
 const onSubmit = (data: UseFormInputs) => {
   console.log(data)
 }


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <label>First name</label>
     <input {...register("firstName", { required: true })} />


     <label>Last name</label>
     <input {...register("lastName")} />


     <input type="submit" />
     <input type="reset" value="Standard Reset Field Values" />
     <input
       type="button"
       onClick={() => reset()}
       value="Custom Reset Field Values & Errors"
     />
   </form>
 )
}
Controller
TSJS
Copy
CodeSandboxTS
import { useForm, Controller } from "react-hook-form"
import { TextField } from "@material-ui/core"


interface IFormInputs {
 firstName: string
 lastName: string
}


export default function App() {
 const { register, handleSubmit, reset, setValue, control } =
   useForm<IFormInputs>()
 const onSubmit = (data: IFormInputs) => console.log(data)


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <Controller
       render={({ field }) => <TextField {...field} />}
       name="firstName"
       control={control}
       rules={{ required: true }}
       defaultValue=""
     />
     <Controller
       render={({ field }) => <TextField {...field} />}
       name="lastName"
       control={control}
       defaultValue=""
     />


     <input type="submit" />
     <input type="button" onClick={reset} />
     <input
       type="button"
       onClick={() => {
         reset({
           firstName: "bill",
           lastName: "luo",
         })
       }}
     />
   </form>
 )
}
Submit with Reset
Copy
CodeSandboxJS
import { useForm, useFieldArray, Controller } from "react-hook-form"


function App() {
 const {
   register,
   handleSubmit,
   reset,
   formState,
   formState: { isSubmitSuccessful },
 } = useForm({ defaultValues: { something: "anything" } })


 const onSubmit = (data) => {
   // It's recommended to reset in useEffect as execution order matters
   // reset({ ...data })
 }


 React.useEffect(() => {
   if (formState.isSubmitSuccessful) {
     reset({ something: "" })
   }
 }, [formState, submittedData, reset])


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input {...register("something")} />
     <input type="submit" />
   </form>
 )
}
Field Array
Copy
CodeSandboxJS
import React, { useEffect } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"


function App() {
 const { register, control, handleSubmit, reset } = useForm({
   defaultValues: {
     loadState: "unloaded",
     names: [{ firstName: "Bill", lastName: "Luo" }],
   },
 })
 const { fields, remove } = useFieldArray({
   control,
   name: "names",
 })


 useEffect(() => {
   reset({
     names: [
       {
         firstName: "Bob",
         lastName: "Actually",
       },
       {
         firstName: "Jane",
         lastName: "Actually",
       },
     ],
   })
 }, [reset])


 const onSubmit = (data) => console.log("data", data)


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <ul>
       {fields.map((item, index) => (
         <li key={item.id}>
           <input {...register(`names.${index}.firstName`)} />


           <Controller
             render={({ field }) => <input {...field} />}
             name={`names.${index}.lastName`}
             control={control}
           />
           <button type="button" onClick={() => remove(index)}>
             Delete
           </button>
         </li>
       ))}
     </ul>


     <input type="submit" />
   </form>
 )
}
Videos

Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
reset
resetField
Reset field state and value
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> resetField: (name: string, options?: Record<string, boolean | any>) => void
Reset an individual field state.
Props

After invoke this function.
isValid form state will be reevaluated.
isDirty form state will be reevaluated.
ResetField has the ability to retain field state. Here are the options you may want to use:
Name


Type
Description
name


string
registered field name.
options
keepError
boolean
When set to true, field error will be retained.


keepDirty
boolean
When set to true, dirtyFields will be retained.


keepTouched
boolean
When set to true, touchedFields state will be unchanged.


defaultValue
unknown
When this value is not provided, field will be revert back to it's defaultValue.
When this value is provided:
field will be updated with the supplied value
field's defaultValue will be updated to this value.
Only support non undefined value.

 RULES
name need to match registered field name.
register("test")
resetField("test") // ✅ register input and resetField works
resetField("non-existent-name") // ❌ failed by input not found
Examples:

Reset Field State
Copy
CodeSandboxJS
import * as React from "react"
import { useForm } from "react-hook-form"


export default function App() {
 const {
   register,
   resetField,
   formState: { isDirty, isValid },
 } = useForm({
   mode: "onChange",
   defaultValues: {
     firstName: "",
   },
 })
 const handleClick = () => resetField("firstName")


 return (
   <form>
     <input {...register("firstName", { required: true })} />


     <p>{isDirty && "dirty"}</p>
     <p>{isValid && "valid"}</p>


     <button type="button" onClick={handleClick}>
       Reset
     </button>
   </form>
 )
}
Reset With Options
Copy
CodeSandboxJS
import * as React from "react"
import { useForm } from "react-hook-form"


export default function App() {
 const {
   register,
   resetField,
   formState: { isDirty, isValid, errors, touchedFields, dirtyFields },
 } = useForm({
   mode: "onChange",
   defaultValues: {
     firstName: "",
   },
 })


 return (
   <form>
     <input {...register("firstName", { required: true })} />


     <p>isDirty: {isDirty && "dirty"}</p>
     <p>touchedFields: {touchedFields.firstName && "touched field"}</p>
     <p>dirtyFields:{dirtyFields.firstName && "dirty field"}</p>
     <p>isValid: {isValid && "valid"}</p>
     <p>error: {errors.firstName && "error"}</p>


     <hr />


     <button
       type="button"
       onClick={() => resetField("firstName", { keepError: true })}
     >
       Reset keep error
     </button>
     <button
       type="button"
       onClick={() => resetField("firstName", { keepTouched: true })}
     >
       Reset keep touched fields
     </button>
     <button
       type="button"
       onClick={() => resetField("firstName", { keepDirty: true })}
     >
       Reset keep dirty fields
     </button>
     <button
       type="button"
       onClick={() => resetField("firstName", { defaultValue: "New" })}
     >
       update defaultValue
     </button>
   </form>
 )
}
Video

The following video tutorial demonstrates resetField API.
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
resetField
setError
Manually set an input error
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> setError: (name: string, error: FieldError, { shouldFocus?: boolean }) => void
The function allows you to manually set one or more errors.
Props

Name
Type
Description
name
string
input's name.
error
{ type: string, message?: string, types: MultipleFieldErrors }
Set an error with its type and message.
config
{ shouldFocus?: boolean }
Should focus the input during setting an error. This only works when the input's reference is registered, it will not work for custom register as well.

 RULES
This method will not persist the associated input error if the input passes register's associated rules.
register("registerInput", { minLength: 4 })
setError("registerInput", { type: "custom", message: "custom message" })
// validation will pass as long as minLength requirement pass
An error that is not associated with an input field will be persisted until cleared with clearErrors. This behaviour is only applicable for built-in validation at field level.
setError("notRegisteredInput", { type: "custom", message: "custom message" })
// clearErrors() need to invoked manually to remove that custom error
You can set a server or global error with root as the key. This type of error will not persist with each submission.
setError("root.serverError", {
  type: "400",
})
setError("root.random", {
  type: "random",
})
Can be useful in the handleSubmit method when you want to give error feedback to a user after async validation. (ex: API returns validation errors)
shouldFocus doesn't work when an input has been disabled.
This method will force set isValid formState to false. However, it's important to be aware that isValid will always be derived from the validation result of your input registration rules or schema result.
There are certain keywords that need to be avoided to prevent conflicts with type checking. They are type and types.
Examples:

Single Error
TSJS
Copy
CodeSandboxTS
import * as React from "react"
import { useForm } from "react-hook-form"


type FormInputs = {
 username: string
}


const App = () => {
 const {
   register,
   handleSubmit,
   setError,
   formState: { errors },
 } = useForm<FormInputs>()
 const onSubmit = (data: FormInputs) => {
   console.log(data)
 }


 React.useEffect(() => {
   setError("username", {
     type: "manual",
     message: "Dont Forget Your Username Should Be Cool!",
   })
 }, [setError])


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input {...register("username")} />
     {errors.username && <p>{errors.username.message}</p>}


     <input type="submit" />
   </form>
 )
}
Multiple Errors
TSJS
Copy
CodeSandboxTS
import * as React from "react"
import { useForm } from "react-hook-form"


type FormInputs = {
 username: string
 firstName: string
}


const App = () => {
 const {
   register,
   handleSubmit,
   setError,
   formState: { errors },
 } = useForm<FormInputs>()


 const onSubmit = (data: FormInputs) => {
   console.log(data)
 }


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <label>Username</label>
     <input {...register("username")} />
     {errors.username && <p>{errors.username.message}</p>}
     <label>First Name</label>
     <input {...register("firstName")} />
     {errors.firstName && <p>{errors.firstName.message}</p>}
     <button
       type="button"
       onClick={() => {
         const inputs = [
           {
             type: "manual",
             name: "username",
             message: "Double Check This",
           },
           {
             type: "manual",
             name: "firstName",
             message: "Triple Check This",
           },
         ]


         inputs.forEach(({ name, type, message }) => {
           setError(name, { type, message })
         })
       }}
     >
       Trigger Name Errors
     </button>
     <input type="submit" />
   </form>
 )
}
Single Field Errors
TSJS
Copy
import * as React from "react"
import { useForm } from "react-hook-form"


type FormInputs = {
 lastName: string
}


const App = () => {
 const {
   register,
   handleSubmit,
   setError,
   formState: { errors },
 } = useForm<FormInputs>({
   criteriaMode: "all",
 })


 const onSubmit = (data: FormInputs) => console.log(data)


 React.useEffect(() => {
   setError("lastName", {
     types: {
       required: "This is required",
       minLength: "This is minLength",
     },
   })
 }, [setError])


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <label>Last Name</label>
     <input {...register("lastName")} />
     {errors.lastName && errors.lastName.types && (
       <p>{errors.lastName.types.required}</p>
     )}
     {errors.lastName && errors.lastName.types && (
       <p>{errors.lastName.types.minLength}</p>
     )}
     <input type="submit" />
   </form>
 )
}
Server Error
Copy
import * as React from "react";
import { useForm } from "react-hook-form";


const App = () => {
 const { register, handleSubmit, setError, formState: { errors } } = useForm({
   criteriaMode: 'all',
 });
 const onSubmit = async () => {
   const response = await fetch(...)
   if (response.statusCode > 200) {
       setError('root.serverError', {
         type: response.statusCode,
       })
   }
 }


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <label>Last Name</label>
     <input {...register("lastName")} />


     {errors.root.serverError.type === 400 && <p>server response message</p>}


     <button>submit</button>
   </form>
 );
};
Video

The following video explain setError API in detail.
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
setError
clearErrors
Clear form errors
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> clearErrors: (name?: string | string[]) => void
This function can manually clear errors in the form.
Props

Type
Description
Example
undefined
Remove all errors.
clearErrors()
string
Remove single error.
clearErrors("yourDetails.firstName")
string[]
Remove multiple errors.
clearErrors(["yourDetails.lastName"])


undefined: reset all errors
string: reset the error on a single field or by key name.
register("test.firstName", { required: true })
register("test.lastName", { required: true })
clearErrors("test") // will clear both errors from test.firstName and test.lastName
clearErrors("test.firstName") // for clear single input error
string[]: reset errors on the given fields
 RULES
This will not affect the validation rules attached to each inputs.
This method doesn't affect validation rules or isValid formState.
Examples

TSJS
CodeSandboxTS
import * as React from "react"
import { useForm } from "react-hook-form"


type FormInputs = {
 firstName: string
 lastName: string
 username: string
}


const App = () => {
 const {
   register,
   formState: { errors },
   handleSubmit,
   clearErrors,
 } = useForm<FormInputs>()


 const onSubmit = (data: FormInputs) => {
   console.log(data)
 }


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input {...register("firstName", { required: true })} />
     <input {...register("lastName", { required: true })} />
     <input {...register("username", { required: true })} />
     <button type="button" onClick={() => clearErrors("firstName")}>
       Clear First Name Errors
     </button>
     <button
       type="button"
       onClick={() => clearErrors(["firstName", "lastName"])}
     >
       Clear First and Last Name Errors
     </button>
     <button type="button" onClick={() => clearErrors()}>
       Clear All Errors
     </button>
     <input type="submit" />
   </form>
 )
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
clearErrors
setValue
Update field value
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> setValue: (name: string, value: unknown, config?: SetValueConfig) => void
This function allows you to dynamically set the value of a registered field and have the options to validate and update the form state. At the same time, it tries to avoid unnecessary rerender.
Props

Name


Description
name
string


Target a single field or field array by name.
value
unknown


The value for the field. This argument is required and can not be undefined.
options
shouldValidate
boolean
Whether to compute if your input is valid or not (subscribed to errors).
Whether to compute if your entire form is valid or not (subscribed to isValid).
This option will update touchedFields at the specified field level not the entire form touched fields.


shouldDirty
boolean
Whether to compute if your input is dirty or not against your defaultValues (subscribed to dirtyFields).
Whether to compute if your entire form is dirty or not against your defaultValues (subscribed to isDirty).
This option will update dirtyFields at the specified field level not the entire form dirty fields.


shouldTouch
boolean
Whether to set the input itself to be touched.

 RULES
You can use methods such as replace or update for field array, however, they will cause the component to unmount and remount for the targeted field array.
const { update } = useFieldArray({ name: "array" })


// unmount fields and remount with updated value
update(0, { test: "1", test1: "2" })


// will directly update input value
setValue("array.0.test1", "1")
setValue("array.0.test2", "2")
The method will not create a new field when targeting a non-existing field.
const { replace } = useFieldArray({ name: "test" })


// ❌ doesn't create new input
setValue("test.101.data")


// ✅ work on refresh entire field array
replace([{ data: "test" }])
Only the following conditions will trigger a re-render:
When an error is triggered or corrected by a value update.
When setValue cause state update, such as dirty and touched.
It's recommended to target the field's name rather than make the second argument a nested object.
setValue("yourDetails.firstName", "value") // ✅ performant
setValue("yourDetails", { firstName: "value" }) ❌ // less performant


register("nestedValue", { value: { test: "data" } }) // register a nested value input
setValue("nestedValue.test", "updatedData") // ❌ failed to find the relevant field
setValue("nestedValue", { test: "updatedData" }) // ✅ setValue find input and update
It's recommended to register the input's name before invoking setValue. To update the entire FieldArray, make sure the useFieldArray hook is being executed first.
Important: use replace from useFieldArray instead, update entire field array with setValue will be removed in the next major version.
// you can update an entire Field Array,
setValue("fieldArray", [{ test: "1" }, { test: "2" }]) // ✅


// you can setValue to a unregistered input
setValue("notRegisteredInput", "value") // ✅ prefer to be registered


// the following will register a single input (without register invoked)
setValue("resultSingleNestedField", { test: "1", test2: "2" }) // 🤔


// with registered inputs, the setValue will update both inputs correctly.
register("notRegisteredInput.test", "1")
register("notRegisteredInput.test2", "2")
setValue("notRegisteredInput", { test: "1", test2: "2" }) // ✅ sugar syntax to setValue twice
Examples

Basic
CodeSandboxJS
import { useForm } from "react-hook-form"


const App = () => {
 const { register, setValue } = useForm({
   firstName: "",
 })


 return (
   <form>
     <input {...register("firstName", { required: true })} />
     <button onClick={() => setValue("firstName", "Bill")}>setValue</button>
     <button
       onClick={() =>
         setValue("firstName", "Luo", {
           shouldValidate: true,
           shouldDirty: true,
         })
       }
     >
       setValue options
     </button>
   </form>
 )
}
Dependant Fields
CodeSandboxTS
import * as React from "react"
import { useForm } from "react-hook-form"


type FormValues = {
 a: string
 b: string
 c: string
}


export default function App() {
 const { watch, register, handleSubmit, setValue, formState } =
   useForm<FormValues>({
     defaultValues: {
       a: "",
       b: "",
       c: "",
     },
   })
 const onSubmit = (data: FormValues) => console.log(data)
 const [a, b] = watch(["a", "b"])


 React.useEffect(() => {
   if (formState.touchedFields.a && formState.touchedFields.b && a && b) {
     setValue("c", `${a} ${b}`)
   }
 }, [setValue, a, b, formState])


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input {...register("a")} placeholder="a" />
     <input {...register("b")} placeholder="b" />
     <input {...register("c")} placeholder="c" />
     <input type="submit" />


     <button
       type="button"
       onClick={() => {
         setValue("a", "what", { shouldTouch: true })
         setValue("b", "ever", { shouldTouch: true })
       }}
     >
       trigger value
     </button>
   </form>
 )
}
Video

Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
setValue
setFocus
Manually set an input focus
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
setFocus: (name: string, options: SetFocusOptions) => void
This method will allow users to programmatically focus on input. Make sure input's ref is registered into the hook form.
Props

Name


Type
Description
name


string
A input field name to focus
options
shouldSelect
boolean
Whether to select the input content on focus.

 RULES
This API will invoke focus method from the ref, so it's important to provide ref during register.
Avoid calling setFocus right after reset as all input references will be removed by reset API.
Examples

TSJS
Copy
CodeSandboxTS
import * as React from "react"
import { useForm } from "react-hook-form"


type FormValues = {
 firstName: string
}


export default function App() {
 const { register, handleSubmit, setFocus } = useForm<FormValues>()
 const onSubmit = (data: FormValues) => console.log(data)
 renderCount++


 React.useEffect(() => {
   setFocus("firstName")
 }, [setFocus])


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input {...register("firstName")} placeholder="First Name" />
     <input type="submit" />
   </form>
 )
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
setFocus
getValues
Get form values
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> getValues: (payload?: string | string[]) => Object
An optimized helper for reading form values. The difference between watch and getValues is that getValues will not trigger re-renders or subscribe to input changes.
Props

Type
Description
undefined
Returns the entire form values.
string
Gets the value at path of the form values.
array
Returns an array of the value at path of the form values.

Examples:

The example below shows what to expect when you invoke getValues method.
Copy
<input {...register("root.test1")} />


<input {...register("root.test2")} />
Name
Output
getValues()
{ root: { test1: '', test2: ''} }
getValues("root")
{ test1: '', test2: ''}
getValues("root.firstName")
''
getValues(["yourDetails.lastName"])
['']

 RULES
It will return defaultValues from useForm before the initial render.
Examples:

TSJSTypes
Copy
CodeSandboxTS
import { useForm } from "react-hook-form"


type FormInputs = {
 test: string
 test1: string
}


export default function App() {
 const { register, getValues } = useForm<FormInputs>()


 return (
   <form>
     <input {...register("test")} />
     <input {...register("test1")} />


     <button
       type="button"
       onClick={() => {
         const values = getValues() // { test: "test-input", test1: "test1-input" }
         const singleValue = getValues("test") // "test-input"
         const multipleValues = getValues(["test", "test1"]) // ["test-input", "test1-input"]
       }}
     >
       Get Values
     </button>
   </form>
 )
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
getValues
getFieldState
State of the field
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> getFieldState: (name: string, formState?: Object) => ({isDirty, isTouched, invalid, error})
This method is introduced in react-hook-form (v7.25.0) to return individual field state. It's useful in case you are trying to retrieve nested field state in a typesafe way.
Props

Name
Type
Description
name
string
registered field name.
formState
object
This is an optional prop, which is only required if formState is not been read/subscribed from the useForm, useFormContext or useFormState. Read rules for more information

Return

Name
Type
Description
isDirty
boolean
field is modified.
Condition: subscribe to dirtyFields.
isTouched
boolean
field has received a focus and blur event.
Condition: subscribe to touchedFields.
invalid
boolean
field is not valid.
Condition: subscribe to errors.
error
undefined | FieldError
field error object.
Condition: subscribe to errors.

 RULES
name needs to match a registered field name.
getFieldState("test")
getFieldState("test") // ✅ register input and return field state
getFieldState("non-existent-name") // ❌ will return state as false and error as undefined
getFieldState works by subscribing to the form state update, and you can subscribe to the formState in the following ways:
You can subscribe at the useForm, useFormContext or useFormState. This is will establish the form state subscription and getFieldState second argument will no longer be required.
const {
  register,
  formState: { isDirty },
} = useForm()
register("test")
getFieldState("test") // ✅
const { isDirty } = useFormState()
register("test")
getFieldState("test") // ✅
const {
  register,
  formState: { isDirty },
} = useFormContext()
register("test")
getFieldState("test") // ✅
When form state subscription is not setup, you can pass the entire formState as the second optional argument by following the example below:
const { register } = useForm()
register("test")
const { isDirty } = getFieldState("test") // ❌ formState isDirty is not subscribed at useForm
const { register, formState } = useForm()
const { isDirty } = getFieldState("test", formState) // ✅ formState.isDirty subscribed
const { formState } = useFormContext()
const { touchedFields } = getFieldState("test", formState) // ✅ formState.touchedFields subscribed
Examples

Copy
CodeSandboxJS
import * as React from "react"


import { useForm } from "react-hook-form"


export default function App() {
 const {
   register,
   getFieldState,
   formState: { isDirty, isValid },
 } = useForm({
   mode: "onChange",


   defaultValues: {
     firstName: "",
   },
 })


 // you can invoke before render or within the render function


 const fieldState = getFieldState("firstName")


 return (
   <form>
     <input {...register("firstName", { required: true })} />{" "}
     <p>{getFieldState("firstName").isDirty && "dirty"}</p>{" "}
     <p>{getFieldState("firstName").isTouched && "touched"}</p>
     <button
       type="button"
       onClick={() => console.log(getFieldState("firstName"))}
     >
       field state
     </button>
   </form>
 )
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
getFieldState
trigger
Trigger validation across the form
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
trigger: (name?: string | string[]) => Promise<boolean>
Manually triggers form or input validation. This method is also useful when you have dependant validation (input validation depends on another input's value).
Props

Name
Type
Description
Example
name
undefined
Triggers validation on all fields.
trigger()


string
Triggers validation on a specific field value by name
trigger("yourDetails.firstName")


string[]
Triggers validation on multiple fields by name.
trigger(["yourDetails.lastName"])
shouldFocus
boolean
Should focus the input during setting an error. This only works when the input's reference is registered, it will not work for custom register as well.
trigger('name', { shouldFocus: true })

 RULES
Isolate render optimisation only applicable for targeting a single field name with string as payload, when supplied with array and undefined to trigger will re-render the entire formState.
Examples:

TSJS
Copy
CodeSandboxTS
import { useForm } from "react-hook-form"


type FormInputs = {
 firstName: string
 lastName: string
}


export default function App() {
 const {
   register,
   trigger,
   formState: { errors },
 } = useForm<FormInputs>()


 return (
   <form>
     <input {...register("firstName", { required: true })} />
     <input {...register("lastName", { required: true })} />
     <button
       type="button"
       onClick={() => {
         trigger("lastName")
       }}
     >
       Trigger
     </button>
     <button
       type="button"
       onClick={() => {
         trigger(["firstName", "lastName"])
       }}
     >
       Trigger Multiple
     </button>
     <button
       type="button"
       onClick={() => {
         trigger()
       }}
     >
       Trigger All
     </button>
   </form>
 )
}
Video

The following video explain trigger API in detail.
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
trigger
control
Take control of the form
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> control: Object
This object contains methods for registering components into React Hook Form.
 RULES
Important: do not access any of the properties inside this object directly. It's for internal usage only.
Examples:

TSJS
Copy
CodeSandboxTS
import { useForm, Controller } from "react-hook-form"
import { TextField } from "@material-ui/core"


type FormInputs = {
 firstName: string
}


function App() {
 const { control, handleSubmit } = useForm<FormInputs>()
 const onSubmit = (data: FormInputs) => console.log(data)


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <Controller
       as={TextField}
       name="firstName"
       control={control}
       defaultValue=""
     />


     <input type="submit" />
   </form>
 )
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
control
Form
Take care of form submission
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> Form: Component
Note: This component is currently in BETA
This component is optional and it takes care of the form submission by closely aligning with the standard native form.
By default, we will send a POST request with your form submission data as FormData. You can supply headers prop to avoid FormData to be submitted and use application/json instead.
Progressively enhancement for your form.
Support both React Web and React Native.
Take care of form submission handling.
<Form
 action="/api"
 method="post" // default to post
 onSubmit={() => {}} // function to be called before the request
 onSuccess={() => {}} // valid response
 onError={() => {}} // error response
 validateStatus={(status) => status >= 200} // validate status code
/>
Props

All props are optional
Name
Type
Description
Example
control
Control
control object provided by invoking useForm. Optional when using FormProvider.
<Form control={control} />
children
React.ReactNode




render
Function
Render prop function suitable for headless component.
<Form render={({ submit }) => <View/>} />
onSubmit
Function
Function invoked after successful validation.
<Form onSubmit={({ data }) => mutation(data)} />
onSuccess
Function
Function called after successful request to the server.
<Form onSuccess={({ response }) => {}} />
onError
Function
Function called after failed request to the server.

setError function will be called to update errors state. root.server will be used as error key.
<Form onError={({ response }) => {}} />
headers
Record<string, string>
Request headers object.
<Form headers={{ accessToken:  'xxx', 'Content-Type':  'application/json'  }} />
validateStatus
(status: number) => boolean
Function to validate status code.
<Form validateStatus={status => status === 200} />

 RULES
If want to prepare or omit submission data, please use handleSubmit or onSubmit.
const { handleSubmit, control } = useForm();
const onSubmit =(data) => callback(prepareData(data))
<form onSubmit={handleSubmit(onSubmit)} />
// or
<Form
  onSubmit={({ data }) => {
    console.log(data)
  }}
/>
Progressive Enhancement only applicable for SSR framework.
const { handleSubmit, control } = useForm({
  progressive: true
});


<Form onSubmit={onSubmit} control={control} action="/api/test" method="post">
  <input {...register("test", { required: true })} />
</Form>


// Renders


<form action="/api/test" method="post">
  <input required name="test" />
</form>
Examples:

React Web
Copy
import { useForm, Form } from "react-hook-form"


function App() {
 const {
   control,


   register,


   formState: { isSubmitSuccessful, errors },
 } = useForm({
   // progressive: true, optional prop for progressive enhancement
 })


 return (
   <div>
     // Use action prop to make post submission with formData
     <Form
       action="/api"
       control={control}
       onSuccess={() => {
         alert("Success")
       }}
       onError={() => {
         alert("error")
       }}
     >
       {" "}
       <input {...register("name")} />
       {isSubmitSuccessful && <p>Form submit successful.</p>}
       {errors?.root?.server && <p>Form submit failed.</p>}
       <button>submit</button>
     </Form>
     // Manual form submission
     <Form
       onSubmit={async ({ formData, data, formDataJson, event }) => {
         await fetch("api", {
           method: "post",


           body: formData,
         })
       }}
     >
       {" "}
       <input {...register("test")} /> <button>submit</button>
     </Form>
   </div>
 )
}
React Native
Copy
import { useForm, Form } from "react-hook-form"
function App() {
 const {
   control,
   register,
   formState: { isSubmitSuccessful, errors },
 } = useForm()
 return (
   <Form
     action="/api"
     control={control}
     render={({ submit }) => {
       ;<View>
         {isSubmitSuccessful && <Text>Form submit successful.</Text>}


         {errors?.root?.server && <Text>Form submit failed.</Text>}
         <Button onPress={() => submit()} />
       </View>
     }}
   />
 )
}

useController
React hooks for controlled component
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
Select page...controller
useController:
(props?: UseControllerProps) => { field: object, fieldState: object, formState: object }
This custom hook powers Controller. Additionally, it shares the same props and methods as Controller. It's useful for creating reusable Controlled input.
Props
The following table contains information about the arguments for useController.
Name
Type
Required
Description
name
FieldPath
✓
Unique name of your input.
control
Control


control object provided by invoking useForm. Optional when using FormProvider.
rules
Object


Validation rules in the same format for register, which includes:
required, min, max, minLength, maxLength, pattern, validate
CodeSandboxTS
rules={{ required: true }}
shouldUnregister
boolean = false


Input will be unregistered after unmount and defaultValues will be removed as well.
Note: this prop should be avoided when using with useFieldArray as unregister function gets called after input unmount/remount and reorder.
disabled
boolean = false


disabled prop will be returned from `field` prop. Controlled input will be disabled and its value will be omitted from the submission data.
defaultValue
unknown


Important: Can not apply undefined to defaultValue or defaultValues at useForm.
You need to either set defaultValue at the field-level or useForm's defaultValues. undefined is not a valid value. If you used defaultValues at useForm, skip using this prop.
If your form will invoke reset with default values, you will need to provide useForm with defaultValues.

Return
The following table contains information about properties which useController produces.
Object Name
Name
Type
Description
field
onChange
(value: any) => void
A function which sends the input's value to the library.
It should be assigned to the onChange prop of the input and value should not be undefined.
This prop update formState and you should avoid manually invoke setValue or other API related to field update.
field
onBlur
() => void
A function which sends the input's onBlur event to the library. It should be assigned to the input's onBlur prop.
field
value
unknown
The current value of the controlled component.
field
disabled
boolean
The disabled state of the input.
field
name
string
Input's name being registered.
field
ref
React.Ref
A ref used to connect hook form to the input. Assign ref to component's input ref to allow hook form to focus the error input.
fieldState
invalid
boolean
Invalid state for current input.
fieldState
isTouched
boolean
Touched state for current controlled input.
fieldState
isDirty
boolean
Dirty state for current controlled input.
fieldState
error
object
error for this specific input.
formState
isDirty
boolean
Set to true after the user modifies any of the inputs.
Important: Make sure to provide all inputs' defaultValues at the useForm, so hook form can have a single source of truth to compare whether the form is dirty.
Copy
const {
  formState: { isDirty, dirtyFields },
  setValue,
} = useForm({ defaultValues: { test: "" } });


// isDirty: true
setValue('test', 'change')

 // isDirty: false because there getValues() === defaultValues
setValue('test', '')
File typed input will need to be managed at the app level due to the ability to cancel file selection and FileList object.
Do not support custom object, Class or File object.
formState
dirtyFields
object
An object with the user-modified fields. Make sure to provide all inputs' defaultValues via useForm, so the library can compare against the defaultValues.
Important: Make sure to provide defaultValues at the useForm, so hook form can have a single source of truth to compare each field's dirtiness.
Dirty fields will not represent as isDirty formState, because dirty fields are marked field dirty at field level rather the entire form. If you want to determine the entire form state use isDirty instead.
formState
touchedFields
object
An object containing all the inputs the user has interacted with.
formState
defaultValues
object
The value which has been set at useForm's defaultValues or updated defaultValues via reset API.
formState
isSubmitted
boolean
Set to true after the form is submitted. Will remain true until the reset method is invoked.
formState
isSubmitSuccessful
boolean
Indicate the form was successfully submitted without any runtime error.
formState
isSubmitting
boolean
true if the form is currently being submitted. false otherwise.
formState
isLoading
boolean
true if the form is currently loading async default values.
Important: this prop is only applicable to async defaultValues
Copy
const {
 formState: { isLoading }
} = useForm({
 defaultValues: async () => await fetch('/api')
});
formState
submitCount
number
Number of times the form was submitted.
formState
isValid
boolean
Set to true if the form doesn't have any errors.
setError has no effect on isValid formState, isValid will always derived via the entire form validation result.
formState
isValidating
boolean
Set to true during validation.
formState
validatingFields
object
Capture fields which are getting async validation.
formState
errors
object
An object with field errors. There is also an ErrorMessage component to retrieve error message easily.
formState
disabled
boolean
Set to true if the form is disabled via the disabled prop in useForm.

Examples
TextFieldCheckboxes
JS
TS
Copy
CodeSandboxJS
import { TextField } from "@material-ui/core";
import { useController, useForm } from "react-hook-form";


function Input({ control, name }) {
 const {
   field,
   fieldState: { invalid, isTouched, isDirty },
   formState: { touchedFields, dirtyFields }
 } = useController({
   name,
   control,
   rules: { required: true },
 });


 return (
   <TextField
     onChange={field.onChange} // send value to hook form
     onBlur={field.onBlur} // notify when input is touched/blur
     value={field.value} // input value
     name={field.name} // send down the input name
     inputRef={field.ref} // send input ref, so we can focus on input when error appear
   />
 );
}
Tips
It's important to be aware of each prop's responsibility when working with external controlled components, such as MUI, AntD, Chakra UI. Its job is to spy on the input, report, and set its value.
onChange: send data back to hook form
onBlur: report input has been interacted (focus and blur)
value: set up input initial and updated value
ref: allow input to be focused with error
name: give input an unique name
It's fine to host your state and combined with useController.
Copy
CodeSandboxTS
const { field } = useController();
const [value, setValue] = useState(field.value);


onChange={(event) => {
  field.onChange(parseInt(event.target.value)) // data send back to hook form
  setValue(event.target.value) // UI state
}}
Do not register input again. This custom hook is designed to take care of the registration process.
Copy
const { field } = useController({ name: 'test' })


<input {...field} /> // ✅
<input {...field} {...register('test')} /> // ❌ double up the registration
It's ideal to use a single useController per component. If you need to use more than one, make sure you rename the prop. May want to consider using Controller instead.
Copy
const { field: input } = useController({ name: 'test' })
const { field: checkbox } = useController({ name: 'test1' })


<input {...input} />
<input {...checkbox} />
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
useController
Controller
Wrapper component for controlled inputs
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> Controller: Component
React Hook Form embraces uncontrolled components and native inputs, however it's hard to avoid working with external controlled component such as React-Select, AntD and MUI. This wrapper component will make it easier for you to work with them.
Props

The following table contains information about the arguments for Controller.
Name
Type
Required
Description
name
FieldPath
✓
Unique name of your input.
control
Control


control object is from invoking useForm. Optional when using FormProvider.
render
Function


This is a render prop. A function that returns a React element and provides the ability to attach events and value into the component. This simplifies integrating with external controlled components with non-standard prop names. Provides onChange, onBlur, name, ref and value to the child component, and also a fieldState object which contains specific input state.
rules
Object


Validation rules in the same format for register options, which includes:

required, min, max, minLength, maxLength, pattern, validate
shouldUnregister
boolean = false`


Input will be unregistered after unmount and defaultValues will be removed as well.

Note: this prop should be avoided when using with useFieldArray as unregister function gets called after input unmount/remount and reorder.
disabled
boolean = false`


disabled prop will be returned from field prop. Controlled input will be disabled and its value will be omitted from the submission data.
defaultValue
unknown


Important: Can not apply undefined to defaultValue or defaultValues at useForm.
You need to either set defaultValue at the field-level or useForm's defaultValues. If you used defaultValues at useForm, skip using this prop.
If your form will invoke reset with default values, you will need to provide useForm with defaultValues.
Calling onChange with undefined is not valid. You should use null or the empty string as your default/cleared value instead.

Return

The following table contains information about properties which Controller produces.
Object Name
Name
Type
Description
field
onChange
(value: any) => void
A function which sends the input's value to the library.

It should be assigned to the onChange prop of the input and value should not be undefined.
This prop update formState and you should avoid manually invoke setValue or other API related to field update.
field
onBlur
() => void
A function which sends the input's onBlur event to the library. It should be assigned to the input's onBlur prop.
field
value
unknown
The current value of the controlled component.
field
disabled
boolean
The disabled state of the input.
field
name
string
Input's name being registered.
field
ref
React.ref
A ref used to connect hook form to the input. Assign ref to component's input ref to allow hook form to focus the error input.
fieldState
invalid
boolean
Invalid state for current input.
fieldState
isTouched
boolean
Touched state for current controlled input.
fieldState
isDirty
boolean
Dirty state for current controlled input.
fieldState
error
object
error for this specific input.
formState
isDirty
boolean
Set to true after the user modifies any of the inputs.
Important: Make sure to provide all inputs' defaultValues at the useForm, so hook form can have a single source of truth to compare whether the form is dirty.
File typed input will need to be managed at the app level due to the ability to cancel file selection and FileList object.
formState
dirtyFields
object
An object with the user-modified fields. Make sure to provide all inputs' defaultValues via useForm, so the library can compare against the defaultValues
Important: Make sure to provide defaultValues at the useForm, so hook form can have a single source of truth to compare each field's dirtiness.
Dirty fields will not represent as isDirty formState, because dirty fields are marked field dirty at field level rather the entire form. If you want to determine the entire form state use isDirty instead.
formState
touchedFields
object
An object containing all the inputs the user has interacted with.
formState
defaultValues
object
The value which has been set at useForm's defaultValues or updated defaultValues via reset API.
formState
isSubmitted
boolean
Set to true after the form is submitted. Will remain true until the reset method is invoked.
formState
isSubmitSuccessful
boolean
Indicate the form was successfully submitted without any runtime error.
formState
isSubmitting
boolean
true if the form is currently being submitted. false otherwise.
formState
isLoading
boolean
true if the form is currently loading async default values.
Important: this prop is only applicable to async defaultValues
formState
submitCount
number
Number of times the form was submitted.
formState
isValid
boolean
Set to true if the form doesn't have any errors.

setError has no effect on isValid formState, isValid will always derived via the entire form validation result.
formState
isValidating
boolean
Set to true during validation.
formState
errors
object
An object with field errors. There is also an ErrorMessage component to retrieve error message easily.

Examples:

Web
TSJS
Copy
CodeSandboxTS
import ReactDatePicker from "react-datepicker"
import { TextField } from "@material-ui/core"
import { useForm, Controller } from "react-hook-form"


type FormValues = {
 ReactDatepicker: string
}


function App() {
 const { handleSubmit, control } = useForm<FormValues>()


 return (
   <form onSubmit={handleSubmit((data) => console.log(data))}>
     <Controller
       control={control}
       name="ReactDatepicker"
       render={({ field: { onChange, onBlur, value, ref } }) => (
         <ReactDatePicker
           onChange={onChange} // send value to hook form
           onBlur={onBlur} // notify when input is touched/blur
           selected={value}
         />
       )}
     />


     <input type="submit" />
   </form>
 )
}
React Native
Copy
ExpoJS
import { Text, View, TextInput, Button, Alert } from "react-native"
import { useForm, Controller } from "react-hook-form"


export default function App() {
 const {
   control,
   handleSubmit,
   formState: { errors },
 } = useForm({
   defaultValues: {
     firstName: "",
     lastName: "",
   },
 })
 const onSubmit = (data) => console.log(data)


 return (
   <View>
     <Controller
       control={control}
       rules={{
         required: true,
       }}
       render={({ field: { onChange, onBlur, value } }) => (
         <TextInput
           placeholder="First name"
           onBlur={onBlur}
           onChangeText={onChange}
           value={value}
         />
       )}
       name="firstName"
     />
     {errors.firstName && <Text>This is required.</Text>}


     <Controller
       control={control}
       rules={{
         maxLength: 100,
       }}
       render={({ field: { onChange, onBlur, value } }) => (
         <TextInput
           placeholder="Last name"
           onBlur={onBlur}
           onChangeText={onChange}
           value={value}
         />
       )}
       name="lastName"
     />


     <Button title="Submit" onPress={handleSubmit(onSubmit)} />
   </View>
 )
}
Video

The following video showcases what's inside Controller and how its been built.
 TIP
It's important to be aware of each prop's responsibility when working with external controlled components, such as MUI, AntD, Chakra UI. Controller acts as a "spy" on your input by reporting and setting value.
onChange: send data back to hook form
onBlur: report input has been interacted (focus and blur)
value: set up input initial and updated value
ref: allow input to be focused with error
name: give input an unique name The following codesandbox demonstrate the usages:
MUI and other components
Chakra UI components
Do not register input again. This component is made to take care of the registration process.
<Controller
  name="test"
  render={({ field }) => {
    // return <input {...field} {...register('test')} />; ❌ double up the registration
    return <input {...field} /> // ✅
  }}
/>
Customise what value gets sent to hook form by transforming the value during onChange.
<Controller
  name="test"
  render={({ field }) => {
    // sending integer instead of string.
    return (
      <input
        {...field}
        onChange={(e) => field.onChange(parseInt(e.target.value))}
      />
    )
  }}
/>
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
Controller
useFormContext
React Context API for hook form
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
Select page...FormProvider
</> useFormContext: Function
This custom hook allows you to access the form context. useFormContext is intended to be used in deeply nested structures, where it would become inconvenient to pass the context as a prop.
Return

This hook will return all the useForm return methods and props.
const methods = useForm()


<FormProvider {...methods} /> // all the useForm return props


const methods = useFormContext() // retrieve those props
 RULES
You need to wrap your form with the FormProvider component for useFormContext to work properly.
Example:
Copy
import { useForm, FormProvider, useFormContext } from "react-hook-form"


export default function App() {
 const methods = useForm()
 const onSubmit = (data) => console.log(data)
 const { register, reset } = methods


 useEffect(() => {
   reset({
     name: "data",
   })
 }, [reset]) // ❌ never put `methods` as the deps


 return (
   <FormProvider {...methods}>
     // pass all methods into the context
     <form onSubmit={methods.handleSubmit(onSubmit)}>
       <NestedInput />
       <input {...register("name")} />
       <input type="submit" />
     </form>
   </FormProvider>
 )
}


function NestedInput() {
 const { register } = useFormContext() // retrieve all hook methods
 return <input {...register("test")} />
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
useFormContext
FormProvider
A component to provide React Context
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
This component will host context object and allow consuming component to subscribe to context and use useForm props and methods.
Props

This following table applied to FormProvider, useFormContext accepts no argument.
Name
Type
Description
...props
Object
FormProvider requires all useForm methods.

 RULES
Avoid using nested FormProvider
Examples:

Copy
CodeSandboxJS
import { useForm, FormProvider, useFormContext } from "react-hook-form"


export default function App() {
 const methods = useForm()


 const onSubmit = (data) => console.log(data)
 const { register, reset } = methods


 useEffect(() => {
   reset({
     name: "data",
   })
 }, [reset]) // ❌ never put `methods` as the deps


 return (
   <FormProvider {...methods}>
     // pass all methods into the context
     <form onSubmit={methods.handleSubmit(onSubmit)}>
       <NestedInput />
       <input {...register("name")} />
       <input type="submit" />
     </form>
   </FormProvider>
 )
}


function NestedInput() {
 const { register } = useFormContext() // retrieve all hook methods


 return <input {...register("test")} />
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
FormProvider
useWatch
React Hook for subscribing to input changes
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> useWatch: ({ control?: Control, name?: string, defaultValue?: unknown, disabled?: boolean }) => object
Behaves similarly to the watch API, however, this will isolate re-rendering at the custom hook level and potentially result in better performance for your application.
Props

Name
Type
Description
name
string | string[] | undefined
Name of the field.
control
Object
control object provided by useForm. It's optional if you are using FormProvider.
defaultValue
unknown
default value for useWatch to return before the initial render.

Note: the first render will always return defaultValue when it's supplied.
disabled
boolean = false
Option to disable the subscription.
exact
boolean = false
This prop will enable an exact match for input name subscriptions.

Return

Example
Return
useWatch({ name: 'inputName' })
unknown
useWatch({ name: ['inputName1'] })
unknown[]
useWatch()
{[key:string]: unknown}

 RULES
The initial return value from useWatch will always return what's inside of defaultValue or defaultValues from useForm.
The only difference between useWatch and watch is at the root (useForm) level or the custom hook level update.
useWatch's execution order matters, which means if you update a form value before the subscription is in place, then the value updated will be ignored.
Copy
setValue("test", "data")
useWatch({ name: "test" }) // ❌ subscription is happened after value update, no update received
useWatch({ name: "example" }) // ✅ input value update will be received and trigger re-render
setValue("example", "data")
You can overcome the above issue with a simple custom hook as below:
Copy
const useFormValues = () => {
  const { getValues } = useFormContext()


  return {
    ...useWatch(), // subscribe to form value updates


    ...getValues(), // always merge with latest form values
  }
}
useWatch's result is optimised for render phase instead of useEffect's deps, to detect value updates you may want to use an external custom hook for value comparison.
Examples:

Form
TSJS
Copy
CodeSandboxTS
import { useForm, useWatch } from "react-hook-form"


interface FormInputs {
 firstName: string
 lastName: string
}


function FirstNameWatched({ control }: { control: Control<FormInputs> }) {
 const firstName = useWatch({
   control,
   name: "firstName", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
   defaultValue: "default", // default value before the render
 })


 return <p>Watch: {firstName}</p> // only re-render at the custom hook level, when firstName changes
}


function App() {
 const { register, control, handleSubmit } = useForm<FormInputs>()


 const onSubmit = (data: FormInputs) => {
   console.log(data)
 }


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <label>First Name:</label>
     <input {...register("firstName")} />
     <input {...register("lastName")} />
     <input type="submit" />


     <FirstNameWatched control={control} />
   </form>
 )
}
Advanced Field Array
Copy
CodeSandboxJS
import { useWatch } from "react-hook-form"


function totalCal(results) {
 let totalValue = 0


 for (const key in results) {
   for (const value in results[key]) {
     if (typeof results[key][value] === "string") {
       const output = parseInt(results[key][value], 10)
       totalValue = totalValue + (Number.isNaN(output) ? 0 : output)
     } else {
       totalValue = totalValue + totalCal(results[key][value], totalValue)
     }
   }
 }


 return totalValue
}


export const Calc = ({ control, setValue }) => {
 const results = useWatch({ control, name: "test" })
 const output = totalCal(results)


 // isolated re-render to calc the result with Field Array
 console.log(results)


 setValue("total", output)


 return <p>{output}</p>
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
useWatch
useFormState
Subscribe to form state update
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
Select page...ErrorMessage
</> useFormState: ({ control: Control }) => FormState
This custom hook allows you to subscribe to each form state, and isolate the re-render at the custom hook level. It has its scope in terms of form state subscription, so it would not affect other useFormState and useForm. Using this hook can reduce the re-render impact on large and complex form application.
Props

Name
Type
Description
control
Object
control object provided by useForm. It's optional if you are using FormProvider.
name
string | string[]
Provide a single input name, an array of them, or subscribe to all inputs' formState update.
disabled
boolean = false
Option to disable the subscription.
exact
boolean = false
This prop will enable an exact match for input name subscriptions.

Return

Name
Type
Description
isDirty
boolean
Set to true after the user modifies any of the inputs.
Important: make sure to provide all inputs' defaultValues at the useForm, so hook form can have a single source of truth to compare whether the form is dirty.
const {
  formState: { isDirty, dirtyFields },
  setValue
} = useForm({ defaultValues: { test: "" } })


// isDirty: true ✅
setValue('test', 'change')


// isDirty: false because there getValues() === defaultValues ❌
setValue('test', '')
File typed input will need to be managed at the app level due to the ability to cancel file selection and FileList object.
Do not support custom object, Class or File object.
dirtyFields
object
An object with the user-modified fields. Make sure to provide all inputs' defaultValues via useForm, so the library can compare against the defaultValues.
Important: make sure to provide defaultValues at the useForm, so hook form can have a single source of truth to compare each field's dirtiness.
Dirty fields will not represent as isDirty formState, because dirty fields are marked field dirty at field level rather the entire form. If you want to determine the entire form state use isDirty instead.
touchedFields
object
An object containing all the inputs the user has interacted with.
defaultValues
object
The value which has been set at useForm's defaultValues or updated defaultValues via reset API.
isSubmitted
boolean
Set to true after the form is submitted. Will remain true until the reset method is invoked.
isSubmitSuccessful
boolean
Indicate the form was successfully submitted without any runtime error.
isSubmitting
boolean
true if the form is currently being submitted. false otherwise.
isLoading
boolean
true if the form is currently loading async default values.
Important: this prop is only applicable to async defaultValues
const {
  formState: { isLoading }
} = useForm({
  defaultValues: async () => await fetch('/api')
})
submitCount
number
Number of times the form was submitted.
isValid
boolean
Set to true if the form doesn't have any errors.
setError has no effect on isValid formState, isValid will always derived via the entire form validation result.
isValidating
boolean
Set to true during validation.
validatingFields
object
Capture fields which are getting async validation.
errors
object
An object with field errors. There is also an ErrorMessage component to retrieve error message easily.
disabled
boolean
Set to true if the form is disabled via the disabled prop in useForm.

 RULES
Returned formState is wrapped with Proxy to improve render performance and skip extra computation if specific state is not subscribed, so make sure you deconstruct or read it before render in order to enable the subscription.
const { isDirty } = useFormState() // ✅
const formState = useFormState() // ❌ should deconstruct the formState
Examples

Copy
CodeSandboxJS
import { useForm, useFormState } from "react-hook-form"


function Child({ control }) {
 const { dirtyFields } = useFormState({ control })


 return dirtyFields.firstName ? <p>Field is dirty.</p> : null
}


export default function App() {
 const { register, handleSubmit, control } = useForm({
   defaultValues: {
     firstName: "firstName",
   },
 })
 const onSubmit = (data) => console.log(data)


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input {...register("firstName")} placeholder="First Name" />
     <Child control={control} />


     <input type="submit" />
   </form>
 )
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
useFormState
FormProvider
A component to provide React Context
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
This component will host context object and allow consuming component to subscribe to context and use useForm props and methods.
Props

This following table applied to FormProvider, useFormContext accepts no argument.
Name
Type
Description
...props
Object
FormProvider requires all useForm methods.

 RULES
Avoid using nested FormProvider
Examples:

Copy
CodeSandboxJS
import { useForm, FormProvider, useFormContext } from "react-hook-form"


export default function App() {
 const methods = useForm()


 const onSubmit = (data) => console.log(data)
 const { register, reset } = methods


 useEffect(() => {
   reset({
     name: "data",
   })
 }, [reset]) // ❌ never put `methods` as the deps


 return (
   <FormProvider {...methods}>
     // pass all methods into the context
     <form onSubmit={methods.handleSubmit(onSubmit)}>
       <NestedInput />
       <input {...register("name")} />
       <input type="submit" />
     </form>
   </FormProvider>
 )
}


function NestedInput() {
 const { register } = useFormContext() // retrieve all hook methods


 return <input {...register("test")} />
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
FormProvider
useWatch
React Hook for subscribing to input changes
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> useWatch: ({ control?: Control, name?: string, defaultValue?: unknown, disabled?: boolean }) => object
Behaves similarly to the watch API, however, this will isolate re-rendering at the custom hook level and potentially result in better performance for your application.
Props

Name
Type
Description
name
string | string[] | undefined
Name of the field.
control
Object
control object provided by useForm. It's optional if you are using FormProvider.
defaultValue
unknown
default value for useWatch to return before the initial render.

Note: the first render will always return defaultValue when it's supplied.
disabled
boolean = false
Option to disable the subscription.
exact
boolean = false
This prop will enable an exact match for input name subscriptions.

Return

Example
Return
useWatch({ name: 'inputName' })
unknown
useWatch({ name: ['inputName1'] })
unknown[]
useWatch()
{[key:string]: unknown}

 RULES
The initial return value from useWatch will always return what's inside of defaultValue or defaultValues from useForm.
The only difference between useWatch and watch is at the root (useForm) level or the custom hook level update.
useWatch's execution order matters, which means if you update a form value before the subscription is in place, then the value updated will be ignored.
Copy
setValue("test", "data")
useWatch({ name: "test" }) // ❌ subscription is happened after value update, no update received
useWatch({ name: "example" }) // ✅ input value update will be received and trigger re-render
setValue("example", "data")
You can overcome the above issue with a simple custom hook as below:
Copy
const useFormValues = () => {
  const { getValues } = useFormContext()


  return {
    ...useWatch(), // subscribe to form value updates


    ...getValues(), // always merge with latest form values
  }
}
useWatch's result is optimised for render phase instead of useEffect's deps, to detect value updates you may want to use an external custom hook for value comparison.
Examples:

Form
TSJS
Copy
CodeSandboxTS
import { useForm, useWatch } from "react-hook-form"


interface FormInputs {
 firstName: string
 lastName: string
}


function FirstNameWatched({ control }: { control: Control<FormInputs> }) {
 const firstName = useWatch({
   control,
   name: "firstName", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
   defaultValue: "default", // default value before the render
 })


 return <p>Watch: {firstName}</p> // only re-render at the custom hook level, when firstName changes
}


function App() {
 const { register, control, handleSubmit } = useForm<FormInputs>()


 const onSubmit = (data: FormInputs) => {
   console.log(data)
 }


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <label>First Name:</label>
     <input {...register("firstName")} />
     <input {...register("lastName")} />
     <input type="submit" />


     <FirstNameWatched control={control} />
   </form>
 )
}
Advanced Field Array
Copy
CodeSandboxJS
import { useWatch } from "react-hook-form"


function totalCal(results) {
 let totalValue = 0


 for (const key in results) {
   for (const value in results[key]) {
     if (typeof results[key][value] === "string") {
       const output = parseInt(results[key][value], 10)
       totalValue = totalValue + (Number.isNaN(output) ? 0 : output)
     } else {
       totalValue = totalValue + totalCal(results[key][value], totalValue)
     }
   }
 }


 return totalValue
}


export const Calc = ({ control, setValue }) => {
 const results = useWatch({ control, name: "test" })
 const output = totalCal(results)


 // isolated re-render to calc the result with Field Array
 console.log(results)


 setValue("total", output)


 return <p>{output}</p>
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
useWatch
useFormState
Subscribe to form state update
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
Select page...ErrorMessage
</> useFormState: ({ control: Control }) => FormState
This custom hook allows you to subscribe to each form state, and isolate the re-render at the custom hook level. It has its scope in terms of form state subscription, so it would not affect other useFormState and useForm. Using this hook can reduce the re-render impact on large and complex form application.
Props

Name
Type
Description
control
Object
control object provided by useForm. It's optional if you are using FormProvider.
name
string | string[]
Provide a single input name, an array of them, or subscribe to all inputs' formState update.
disabled
boolean = false
Option to disable the subscription.
exact
boolean = false
This prop will enable an exact match for input name subscriptions.

Return

Name
Type
Description
isDirty
boolean
Set to true after the user modifies any of the inputs.
Important: make sure to provide all inputs' defaultValues at the useForm, so hook form can have a single source of truth to compare whether the form is dirty.
const {
  formState: { isDirty, dirtyFields },
  setValue
} = useForm({ defaultValues: { test: "" } })


// isDirty: true ✅
setValue('test', 'change')


// isDirty: false because there getValues() === defaultValues ❌
setValue('test', '')
File typed input will need to be managed at the app level due to the ability to cancel file selection and FileList object.
Do not support custom object, Class or File object.
dirtyFields
object
An object with the user-modified fields. Make sure to provide all inputs' defaultValues via useForm, so the library can compare against the defaultValues.
Important: make sure to provide defaultValues at the useForm, so hook form can have a single source of truth to compare each field's dirtiness.
Dirty fields will not represent as isDirty formState, because dirty fields are marked field dirty at field level rather the entire form. If you want to determine the entire form state use isDirty instead.
touchedFields
object
An object containing all the inputs the user has interacted with.
defaultValues
object
The value which has been set at useForm's defaultValues or updated defaultValues via reset API.
isSubmitted
boolean
Set to true after the form is submitted. Will remain true until the reset method is invoked.
isSubmitSuccessful
boolean
Indicate the form was successfully submitted without any runtime error.
isSubmitting
boolean
true if the form is currently being submitted. false otherwise.
isLoading
boolean
true if the form is currently loading async default values.
Important: this prop is only applicable to async defaultValues
const {
  formState: { isLoading }
} = useForm({
  defaultValues: async () => await fetch('/api')
})
submitCount
number
Number of times the form was submitted.
isValid
boolean
Set to true if the form doesn't have any errors.
setError has no effect on isValid formState, isValid will always derived via the entire form validation result.
isValidating
boolean
Set to true during validation.
validatingFields
object
Capture fields which are getting async validation.
errors
object
An object with field errors. There is also an ErrorMessage component to retrieve error message easily.
disabled
boolean
Set to true if the form is disabled via the disabled prop in useForm.

 RULES
Returned formState is wrapped with Proxy to improve render performance and skip extra computation if specific state is not subscribed, so make sure you deconstruct or read it before render in order to enable the subscription.
const { isDirty } = useFormState() // ✅
const formState = useFormState() // ❌ should deconstruct the formState
Examples

Copy
CodeSandboxJS
import { useForm, useFormState } from "react-hook-form"


function Child({ control }) {
 const { dirtyFields } = useFormState({ control })


 return dirtyFields.firstName ? <p>Field is dirty.</p> : null
}


export default function App() {
 const { register, handleSubmit, control } = useForm({
   defaultValues: {
     firstName: "firstName",
   },
 })
 const onSubmit = (data) => console.log(data)


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input {...register("firstName")} placeholder="First Name" />
     <Child control={control} />


     <input type="submit" />
   </form>
 )
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
useFormState
ErrorMessage
An error message component to handle errors
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> ErrorMessage: Component
A simple component to render associated input's error message.
npm install @hookform/error-message
Props

Name
Type
Required
Description
name
string
✓
Name of the field.
errors
object


errors object from React Hook Form. Optional if you are using FormProvider.
message
string | React.ReactElement


Inline error message.
as
React.ElementType | string


Wrapper component or HTML tag. For example: as="span" or as={<Text />}
render
({ message: string | React.ReactElement, messages?: Object}) => any


This is a render prop for rendering error message or messages.

Note: you need to set criteriaMode to 'all' for using messages.

Examples:

Single Error Message
TSJS
Copy
CodeSandboxTS
import { useForm } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"


interface FormInputs {
 singleErrorInput: string
}


export default function App() {
 const {
   register,
   formState: { errors },
   handleSubmit,
 } = useForm<FormInputs>()
 const onSubmit = (data: FormInputs) => console.log(data)


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input
       {...register("singleErrorInput", { required: "This is required." })}
     />
     <ErrorMessage errors={errors} name="singleErrorInput" />


     <ErrorMessage
       errors={errors}
       name="singleErrorInput"
       render={({ message }) => <p>{message}</p>}
     />


     <input type="submit" />
   </form>
 )
}
Multiple Error Messages
TSJS
Copy
CodeSandboxTS
import { useForm } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"


interface FormInputs {
 multipleErrorInput: string
}


export default function App() {
 const {
   register,
   formState: { errors },
   handleSubmit,
 } = useForm<FormInputs>({
   criteriaMode: "all",
 })
 const onSubmit = (data: FormInputs) => console.log(data)


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input
       {...register("multipleErrorInput", {
         required: "This is required.",
         pattern: {
           value: /d+/,
           message: "This input is number only.",
         },
         maxLength: {
           value: 10,
           message: "This input exceed maxLength.",
         },
       })}
     />
     <ErrorMessage
       errors={errors}
       name="multipleErrorInput"
       render={({ messages }) =>
         messages &&
         Object.entries(messages).map(([type, message]) => (
           <p key={type}>{message}</p>
         ))
       }
     />


     <input type="submit" />
   </form>
 )
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
ErrorMessage
useFieldArray
React hooks for Field Array
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
useFieldArray: UseFieldArrayProps
Custom hook for working with Field Arrays (dynamic form). The motivation is to provide better user experience and performance. You can watch this short video to visualize the performance enhancement.
Props
Name
Type
Required
Description
name
string
✓
Name of the field array. Note: Do not support dynamic name.
control
Object


control object provided by useForm. It's optional if you are using FormProvider.
shouldUnregister
boolean


Whether Field Array will be unregistered after unmount.
keyName
string = id


Name of the attribute with autogenerated identifier to use as the key prop. This prop is no longer required and will be removed in the next major version.
rules
Object


The same validation rules API as for register, which includes:
required, minLength, maxLength, validate
CodeSandboxTS
useFieldArray({
 rules: { minLength: 4 }
})
In case of validation error, the root property is appended to formState.errors?.fieldArray?.root of type FieldError
Important: This is only applicable to built-in validation.

Examples
Copy
function FieldArray() {
 const { control, register } = useForm();
 const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
   control, // control props comes from useForm (optional: if you are using FormProvider)
   name: "test", // unique name for your Field Array
 });


 return (
   {fields.map((field, index) => (
     <input
       key={field.id} // important to include key with field's id
       {...register(`test.${index}.value`)}
     />
   ))}
 );
}
Return
Name
Type
Description
fields
object & { id: string }
This object contains the defaultValue and key for your component.
append
(obj: object | object[], focusOptions) => void
Append input/inputs to the end of your fields and focus. The input value will be registered during this action.
Important: append data is required and not partial.
prepend
(obj: object | object[], focusOptions) => void
Prepend input/inputs to the start of your fields and focus. The input value will be registered during this action.
Important: prepend data is required and not partial.
insert
(index: number, value: object | object[], focusOptions) => void
Insert input/inputs at particular position and focus.
Important: insert data is required and not partial.
swap
(from: number, to: number) => void
Swap input/inputs position.
move
(from: number, to: number) => void
Move input/inputs to another position.
update
(index: number, obj: object) => void
Update input/inputs at a particular position, updated fields will get unmounted and remounted. If this is not desired behavior, please use setValue API instead.
Important: update data is required and not partial.
replace
(obj: object[]) => void
Replace the entire field array values.
remove
(index?: number | number[]) => void
Remove input/inputs at particular position, or remove all when no index provided.

Rules
useFieldArray automatically generates a unique identifier named id which is used for key prop. For more information why this is required: https://react.dev/learn/rendering-lists
The field.id (and not index) must be added as the component key to prevent re-renders breaking the fields:
// ✅ correct:
{fields.map((field, index) => <input key={field.id} ... />)}


// ❌ incorrect:
{fields.map((field, index) => <input key={index} ... />)}
It's recommended to not stack actions one after another.
onClick={() => {
  append({ test: 'test' });
  remove(0);
}}
           
 // ✅ Better solution: the remove action is happened after the second render
React.useEffect(() => {
  remove(0);
}, [remove])


onClick={() => {
  append({ test: 'test' });
}}
Each useFieldArray is unique and has its own state update, which means you should not have multiple useFieldArray with the same name.
Each input name needs to be unique, if you need to build checkbox or radio with the same name then use it with useController or Controller.
Does not support flat field array.
When you append, prepend, insert and update the field array, the obj can't be empty object rather need to supply all your input's defaultValues.
append(); ❌
append({}); ❌
append({ firstName: 'bill', lastName: 'luo' }); ✅
TypeScript
when register input name, you will have to cast them as const
<input key={field.id} {...register(`test.${index}.test` as const)} />
we do not support circular reference. Refer to this Github issue for more detail.
for nested field array, you will have to cast the field array by its name.
const { fields } = useFieldArray({ name: `test.${index}.keyValue` as 'test.0.keyValue' });
Examples
useFieldArrayNested Formconditional Field ArrayFocus Name/index
JS
TS
Copy
CodeSandboxJS
import { useForm, useFieldArray } from "react-hook-form";


function App() {
 const { register, control, handleSubmit, reset, trigger, setError } = useForm({
   // defaultValues: {}; you can populate the fields by this attribute
 });
 const { fields, append, remove } = useFieldArray({
   control,
   name: "test"
 });
  return (
   <form onSubmit={handleSubmit(data => console.log(data))}>
     <ul>
       {fields.map((item, index) => (
         <li key={item.id}>
           <input {...register(`test.${index}.firstName`)} />
           <Controller
             render={({ field }) => <input {...field} />}
             name={`test.${index}.lastName`}
             control={control}
           />
           <button type="button" onClick={() => remove(index)}>Delete</button>
         </li>
       ))}
     </ul>
     <button
       type="button"
       onClick={() => append({ firstName: "bill", lastName: "luo" })}
     >
       append
     </button>
     <input type="submit" />
   </form>
 );
}
Video
The following video explains the basic usage of useFieldArray.
Tips
Custom Register
You can also register inputs at Controller without the actual input. This makes useFieldArray quick and flexible to use with complex data structure or the actual data is not stored inside an input.
Copy
CodeSandboxTS
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";


const ConditionalInput = ({ control, index, field }) => {
 const value = useWatch({
   name: "test",
   control
 });


 return (
   <Controller
     control={control}
     name={`test.${index}.firstName`}
     render={({ field }) =>
       value?.[index]?.checkbox === "on" ? <input {...field} /> : null
     }
   />
 );
};


function App() {
 const { control, register } = useForm();
 const { fields, append, prepend } = useFieldArray({
   control,
   name: "test"
 });


 return (
   <form>
     {fields.map((field, index) => (
       <ConditionalInput key={field.id} {...{ control, index, field }} />
     ))}
   </form>
 );
}
Controlled Field Array
There will be cases where you want to control the entire field array, which means each onChange reflects on the fields object.
Copy
CodeSandboxTS
import { useForm, useFieldArray } from "react-hook-form";


export default function App() {
 const { register, handleSubmit, control, watch } = useForm<FormValues>();
 const { fields, append } = useFieldArray({
   control,
   name: "fieldArray"
 });
 const watchFieldArray = watch("fieldArray");
 const controlledFields = fields.map((field, index) => {
   return {
     ...field,
     ...watchFieldArray[index]
   };
 });


 return (
   <form>
     {controlledFields.map((field, index) => {
       return <input {...register(`fieldArray.${index}.name` as const)} />;
     })}
   </form>
 );
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
useFieldArray
useLens
Type-safe functional lenses for React Hook Form
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
</> useLens
React Hook Form Lenses is a powerful TypeScript-first library that brings the elegance of functional lenses to form development. It provides type-safe manipulation of nested structures, enabling developers to precisely control and transform complex data with ease.
useLens is a custom hook that creates a lens instance connected to your React Hook Form control, enabling type-safe focusing, transformation, and manipulation of deeply nested form data structures through functional programming concepts.
Installation
Copy
npm install @hookform/lenses
Features
Type-Safe Form State: Focus on specific parts of your data with full TypeScript support and precise type inference
Functional Lenses: Build complex transformations through composable lens operations
Deep Structure Support: Handle deeply nested structures and arrays elegantly with specialized operations
Seamless Integration: Work smoothly with React Hook Form's Control API and existing functionality
Optimized Performance: Each lens is cached and reused for optimal efficiency
Array Handling: Specialized support for dynamic fields with type-safe mapping
Composable API: Build complex transformations through elegant lens composition
Props

The useLens hook accepts the following configuration:
control: Control<TFieldValues>
Required. The control object from React Hook Form's useForm hook. This connects your lens to the form management system.
Copy
const { control } = useForm<MyFormData>()
const lens = useLens({ control })
Dependencies Array (Optional)
You can optionally pass a dependency array as the second parameter to clear the lens cache and re-create all lenses when dependencies change:
Copy
const lens = useLens({ control }, [dependencies])
This is useful when you need to reset the entire lens cache based on external state changes.
Return

The following table contains information about the main types and operations available on lens instances:
Core Types:
Lens<T> - The main lens type that provides different operations based on the field type you're working with:
type LensWithArray = Lens<string[]>
type LensWithObject = Lens<{ name: string; age: number }>
type LensWithPrimitive = Lens<string>
Main Operations:
These are the core methods available on every lens instance:
Method
Description
Returns
focus
Focuses on a specific field path
Lens<PathValue>
reflect
Transform and reshape lens structure
Lens<NewStructure>
map
Iterate over array fields (with useFieldArray)
R[]
interop
Connect to React Hook Form's control system
{ control, name }


focus
Creates a new lens focused on a specific path. This is the primary method for drilling down into your data structure.
Copy
// Type-safe path focusing
const profileLens = lens.focus("profile")
const emailLens = lens.focus("profile.email")
const arrayItemLens = lens.focus("users.0.name")
Array focusing:
Copy
function ContactsList({ lens }: { lens: Lens<Contact[]> }) {
 // Focus on specific array index
 const firstContact = lens.focus("0")
 const secondContactName = lens.focus("1.name")


 return (
   <div>
     <ContactForm lens={firstContact} />
     <input
       {...secondContactName.interop((ctrl, name) => ctrl.register(name))}
     />
   </div>
 )
}
 TYPESCRIPT SUPPORT
The focus method provides full TypeScript support with autocompletion and type checking:
Autocomplete available field paths
Type errors for non-existent paths
Inferred return types based on focused field
reflect
Transforms the lens structure with complete type inference. This is useful when you want to create a new lens from an existing one with a different shape to pass to a shared component.
The first argument is a proxy with a dictionary of lenses. Note that lens instantiation happens only on property access. The second argument is the original lens.
Object Reflection
Copy
const contactLens = lens.reflect(({ profile }) => ({
 name: profile.focus("contact.firstName"),
 phoneNumber: profile.focus("contact.phone"),
}))


<SharedComponent lens={contactLens} />


function SharedComponent({
 lens,
}: {
 lens: Lens<{ name: string; phoneNumber: string }>
}) {
 return (
   <div>
     <input
       {...lens.focus("name").interop((ctrl, name) => ctrl.register(name))}
     />
     <input
       {...lens
         .focus("phoneNumber")
         .interop((ctrl, name) => ctrl.register(name))}
     />
   </div>
 )
}
Alternative syntax using the lens parameter:
You can also use the second parameter (the original lens) directly:
const contactLens = lens.reflect((_, l) => ({
 name: l.focus("profile.contact.firstName"),
 phoneNumber: l.focus("profile.contact.phone"),
}))


<SharedComponent lens={contactLens} />


function SharedComponent({
 lens,
}: {
 lens: Lens<{ name: string; phoneNumber: string }>
}) {
 // ...
}
Array Reflection
You can restructure array lenses:
function ArrayComponent({ lens }: { lens: Lens<{ value: string }[]> }) {
 return (
   <AnotherComponent lens={lens.reflect(({ value }) => [{ data: value }])} />
 )
}


function AnotherComponent({ lens }: { lens: Lens<{ data: string }[]> }) {
 // ...
}
 IMPORTANT
Note that for array reflection, you must pass an array with a single item as the template.
Merging Lenses
You can use reflect to merge two lenses into one:
function Component({
 lensA,
 lensB,
}: {
 lensA: Lens<{ firstName: string }>
 lensB: Lens<{ lastName: string }>
}) {
 const combined = lensA.reflect((_, l) => ({
   firstName: l.focus("firstName"),
   lastName: lensB.focus("lastName"),
 }))


 return <PersonForm lens={combined} />
}
Keep in mind that in such cases, the function passed to reflect is no longer pure.
Spread Operator Support
You can use spread in reflect if you want to leave other properties as is. At runtime, the first argument is just a proxy that calls focus on the original lens. This is useful for proper typing when you need to change the property names for only a few fields and leave the rest unchanged:
function Component({
 lens,
}: {
 lens: Lens<{ firstName: string; lastName: string; age: number }>
}) {
 return (
   <PersonForm
     lens={lens.reflect(({ firstName, lastName, ...rest }) => ({
       ...rest,
       name: firstName,
       surname: lastName,
     }))}
   />
 )
}
map
Maps over array fields with useFieldArray integration. This method requires the fields property from useFieldArray.
Copy
import { useFieldArray } from "@hookform/lenses/rhf"


function ContactsList({ lens }: { lens: Lens<Contact[]> }) {
 const { fields, append, remove } = useFieldArray(lens.interop())


 return (
   <div>
     <button onClick={() => append({ name: "", email: "" })}>
       Add Contact
     </button>


     {lens.map(fields, (value, l, index) => (
       <div key={value.id}>
         <button onClick={() => remove(index)}>Remove</button>
         <ContactForm lens={l} />
       </div>
     ))}
   </div>
 )
}


function ContactForm({
 lens,
}: {
 lens: Lens<{ name: string; email: string }>
}) {
 return (
   <div>
     <input
       {...lens.focus("name").interop((ctrl, name) => ctrl.register(name))}
     />
     <input
       {...lens.focus("email").interop((ctrl, name) => ctrl.register(name))}
     />
   </div>
 )
}
Map callback parameters:
Parameter
Type
Description
value
T
The current field value with id
lens
Lens<T>
Lens focused on the current array item
index
number
Current array index
array
T[]
The complete array
originLens
Lens<T[]>
The original array lens

interop
The interop method provides seamless integration with React Hook Form by exposing the underlying control and name properties. This allows you to connect your lens to React Hook Form's control API.
First Variant: Object Return
The first variant involves calling interop() without arguments, which returns an object containing the control and name properties for React Hook Form:
const { control, name } = lens.interop()


return <input {...control.register(name)} />
Second Variant: Callback Function
The second variant passes a callback function to interop which receives the control and name properties as arguments. This allows you to work with these properties directly within the callback scope:
return (
 <form onSubmit={handleSubmit(console.log)}>
   <input {...lens.interop((ctrl, name) => ctrl.register(name))} />
   <input type="submit" />
 </form>
)
Integration with useController
The interop method's return value can be passed directly to the useController hook from React Hook Form, providing seamless integration:
import { useController } from "react-hook-form"


function ControlledInput({ lens }: { lens: Lens<string> }) {
 const { field, fieldState } = useController(lens.interop())


 return (
   <div>
     <input {...field} />
     {fieldState.error && <p>{fieldState.error.message}</p>}
   </div>
 )
}
useFieldArray
Import the enhanced useFieldArray from @hookform/lenses/rhf for seamless array handling with lenses.
Copy
import { useFieldArray } from "@hookform/lenses/rhf"


function DynamicForm({
 lens,
}: {
 lens: Lens<{ items: { name: string; value: number }[] }>
}) {
 const itemsLens = lens.focus("items")
 const { fields, append, remove, move } = useFieldArray(itemsLens.interop())


 return (
   <div>
     <button onClick={() => append({ name: "", value: 0 })}>Add Item</button>


     {itemsLens.map(fields, (field, itemLens, index) => (
       <div key={field.id}>
         <input
           {...itemLens
             .focus("name")
             .interop((ctrl, name) => ctrl.register(name))}
         />
         <input
           type="number"
           {...itemLens
             .focus("value")
             .interop((ctrl, name) =>
               ctrl.register(name, { valueAsNumber: true })
             )}
         />
         <button onClick={() => remove(index)}>Remove</button>
         {index > 0 && (
           <button onClick={() => move(index, index - 1)}>Move Up</button>
         )}
       </div>
     ))}
   </div>
 )
}
 RULES
The control parameter is required and must be from React Hook Form's useForm hook
Each lens is cached and reused for optimal performance - focusing on the same path multiple times returns the identical lens instance
When using functions with methods like reflect, memoize the function to maintain caching benefits
Dependencies array is optional but useful for clearing lens cache based on external state changes
All lens operations maintain full TypeScript type safety and inference
Examples
Basic Usage
Copy
CodeSandboxTS
import { useForm } from "react-hook-form"
import { Lens, useLens } from "@hookform/lenses"
import { useFieldArray } from "@hookform/lenses/rhf"


function FormComponent() {
 const { handleSubmit, control } = useForm<{
   firstName: string
   lastName: string
   children: {
     name: string
     surname: string
   }[]
 }>({})


 const lens = useLens({ control })


 return (
   <form onSubmit={handleSubmit(console.log)}>
     <PersonForm
       lens={lens.reflect(({ firstName, lastName }) => ({
         name: firstName,
         surname: lastName,
       }))}
     />
     <ChildForm lens={lens.focus("children")} />
     <input type="submit" />
   </form>
 )
}


function ChildForm({
 lens,
}: {
 lens: Lens<{ name: string; surname: string }[]>
}) {
 const { fields, append } = useFieldArray(lens.interop())


 return (
   <>
     <button type="button" onClick={() => append({ name: "", surname: "" })}>
       Add child
     </button>
     {lens.map(fields, (value, l) => (
       <PersonForm key={value.id} lens={l} />
     ))}
   </>
 )
}


// PersonForm is used twice with different sources
function PersonForm({
 lens,
}: {
 lens: Lens<{ name: string; surname: string }>
}) {
 return (
   <div>
     <StringInput lens={lens.focus("name")} />
     <StringInput lens={lens.focus("surname")} />
   </div>
 )
}


function StringInput({ lens }: { lens: Lens<string> }) {
 return <input {...lens.interop((ctrl, name) => ctrl.register(name))} />
}
Motivation
Working with complex, deeply nested forms in React Hook Form can quickly become challenging. Traditional approaches often lead to common problems that make development more difficult and error-prone:
1. Type-Safe Name Props Are Nearly Impossible
Creating reusable form components requires accepting a name prop to specify which field to control. However, making this type-safe in TypeScript is extremely challenging:
// ❌ Loses type safety - no way to ensure name matches the form schema
interface InputProps<T> {
 name: string // Could be any string, even invalid field paths
 control: Control<T>
}


// ❌ Attempting proper typing leads to complex, unmaintainable generics
interface InputProps<T, TName extends Path<T>> {
 name: TName
 control: Control<T>
}
// This becomes unwieldy and breaks down with nested objects
2. useFormContext() Creates Tight Coupling
Using useFormContext() in reusable components tightly couples them to specific form schemas, making them less portable and harder to share:
// ❌ Tightly coupled to parent form structure
function AddressForm() {
 const { control } = useFormContext<UserForm>() // Locked to UserForm type


 return (
   <div>
     <input {...control.register("address.street")} />{" "}
     {/* Fixed field paths */}
     <input {...control.register("address.city")} />
   </div>
 )
}
// Can't reuse this component with different form schemas
3. String-Based Field Paths Are Error-Prone
Building reusable components with string concatenation for field paths is fragile and difficult to maintain:
// ❌ String concatenation is error-prone and hard to refactor
function PersonForm({ basePath }: { basePath: string }) {
 const { register } = useForm();


 return (
   <div>
     {/* No type safety, prone to typos */}
     <input {...register(`${basePath}.firstName`)} />
     <input {...register(`${basePath}.lastName`)} />
     <input {...register(`${basePath}.email`)} />
   </div>
 );
}


// Usage becomes unwieldy and error-prone
<PersonForm basePath="user.profile.owner" />
<PersonForm basePath="user.profile.emergency_contact" />
Performance Optimization
Built-in Caching System
Lenses are automatically cached to prevent unnecessary component re-renders when using React.memo. This means that focusing on the same path multiple times will return the identical lens instance:
assert(lens.focus("firstName") === lens.focus("firstName"))
Function Memoization
When using functions with methods like reflect, you need to be careful about function identity to maintain caching benefits:
// ❌ Creates a new function on every render, breaking the cache
lens.reflect((l) => l.focus("firstName"))
To maintain caching, memoize the function you pass:
// ✅ Memoized function preserves the cache
lens.reflect(useCallback((l) => l.focus("firstName"), []))
 REACT COMPILER OPTIMIZATION
React Compiler can automatically optimize these functions for you! Since functions passed to reflect have no side effects, React Compiler will automatically hoist them to module scope, ensuring lens caching works perfectly without manual memoization.
Advanced Usage
Manual Lens Creation
For advanced use cases or when you need more control, you can create lenses manually without the useLens hook using the LensCore class:
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { LensCore, LensesStorage } from "@hookform/lenses"


function App() {
 const { control } = useForm<{ firstName: string; lastName: string }>()


 const lens = useMemo(() => {
   const cache = new LensesStorage(control)
   return LensCore.create(control, cache)
 }, [control])


 return (
   <div>
     <input
       {...lens
         .focus("firstName")
         .interop((ctrl, name) => ctrl.register(name))}
     />
     <input
       {...lens.focus("lastName").interop((ctrl, name) => ctrl.register(name))}
     />
   </div>
 )
}
 QUESTIONS OR FEEDBACK?
Found a bug or have a feature request? Check out the GitHub repository to report issues or contribute to the project.
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
useLens
createFormControl
Create form state and ready to be subscribed
Menu
</>useForm
</> register
</> unregister
</> formState
</> watch
</> subscribe
</> handleSubmit
</> reset
</> resetField
</> setError
</> clearErrors
</> setValue
</> setFocus
</> getValues
</> getFieldState
</> trigger
</> control
</> Form
</>useController
</> Controller
</>useFormContext
</> FormProvider
</>useWatch
</>useFormState
</> ErrorMessage
</>useFieldArray
</>useLens
</>createFormControl
This function create the entire form state subscription and allow you to subscribe update with or without react component. You can use this function without the need of React Context api.
Props

Name
Type
Description
...props
Object
UseFormProps

Returns

Name
Type
Description
formControl
Object
control object for useForm hook
control
Object
control object for useController, useFormState, useWatch
subscribe
Function
function to subscribe for form state update without render
...returns
Functions
useForm return methods

 NOTES
This function is published at v7.55.0 - This function is completely optional, you can consider to use this instead of useFormContext API. - You may find it useful if you would like to subscribe formsState by skipping react re-render.
 RULES
You should either use this API or context API
const props = createFormControl()


<FormProvider {...props} /> // ❌ You don't need provider


<input {...props.register('name')} /> // ✅ Direct use method from createFormControl
Examples:

SetupSubscribe
const { formControl, control, handleSubmit, register } = createFormControl({
 mode: 'onChange',
 defaultValues: {
   firstName: 'Bill'
 }
}})


function App() {
 useForm({
   formControl,
 })


 return (
   <form onSubmit={handleSubmit(data => console.log)}>
     <input {...register('name')} />
     <FormState />
     <Controller />
   </form>
 );
}


function FormState() {
 useFormState({
   control // no longer need context api
 })
}


function Controller() {
 useFormState({
   control // no longer need context api
 })
}
Thank you for your support
If you find React Hook Form to be useful in your project, please consider to star and support it.
Star us on GitHub
Home
Get Started
API
TS
Advanced
FAQs
Form Builder
DevTools
Resources
About us
Media
V6
V5
A project by BEEKAI | Please support us by leaving a ★ @github
SUPPORTED AND BACKED BY
Powered by ▲ Vercel
createFormControl


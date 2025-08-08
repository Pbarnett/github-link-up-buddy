Typescript Support
List of exported Typescript Types.
Menu
</>Resolver
</>SubmitHandler
</>Control
</>UseFormReturn
</>UseFormProps
</>UseFieldArrayReturn
</>UseFieldArrayProps
</>UseControllerReturn
</>UseControllerProps
</>FieldError
</>FieldErrors
</>Field
</>FieldPath
</>FieldPathByValue
</>FieldValues
</>FieldArrayWithId
</>Mode
</>RegisterOptions
</>FormStateProxy
</>NestedValue
Important: Typescript ^4.3 above is the recommended version to work with react hook form.
</> Resolver
Copy
CodeSandboxTS
import { useForm, Resolver } from "react-hook-form"


type FormValues = {
 firstName: string
 lastName: string
}


const resolver: Resolver<FormValues> = async (values) => {
 return {
   values: values.firstName ? values : {},
   errors: !values.firstName
     ? {
         firstName: {
           type: "required",
           message: "This is required.",
         },
       }
     : {},
 }
}


export default function App() {
 const {
   register,
   handleSubmit,
   formState: { errors },
 } = useForm<FormValues>({ resolver })
 const onSubmit = handleSubmit((data) => console.log(data))


 return (
   <form onSubmit={onSubmit}>
     <input {...register("firstName")} placeholder="Bill" />
     {errors?.firstName && <p>{errors.firstName.message}</p>}


     <input {...register("lastName")} placeholder="Luo" />


     <input type="submit" />
   </form>
 )
}

</> SubmitHandler
Copy
CodeSandboxTS
import { useForm, SubmitHandler } from "react-hook-form"


type FormValues = {
 firstName: string
 lastName: string
 email: string
}


export default function App() {
 const { register, handleSubmit } = useForm<FormValues>()
 const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data)


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input {...register("firstName")} />
     <input {...register("lastName")} />
     <input type="email" {...register("email")} />


     <input type="submit" />
   </form>
 )
}

</> SubmitErrorHandler
Copy
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form"


type FormValues = {
 firstName: string
 lastName: string
 email: string
}


export default function App() {
 const { register, handleSubmit } = useForm<FormValues>()
 const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data)
 const onError: SubmitErrorHandler<FormValues> = (errors) => console.log(errors);


 return (
   <form onSubmit={handleSubmit(onSubmit, onError)}>
     <input {...register("firstName"), { required: true }} />
     <input {...register("lastName"), { minLength: 2 }} />
     <input type="email" {...register("email")} />


     <input type="submit" />
   </form>
 )
}

</> Control
Copy
CodeSandboxTS
import { useForm, useWatch, Control } from "react-hook-form"


type FormValues = {
 firstName: string
 lastName: string
}


function IsolateReRender({ control }: { control: Control<FormValues> }) {
 const firstName = useWatch({
   control,
   name: "firstName",
   defaultValue: "default",
 })


 return <div>{firstName}</div>
}


export default function App() {
 const { register, control, handleSubmit } = useForm<FormValues>()
 const onSubmit = handleSubmit((data) => console.log(data))


 return (
   <form onSubmit={onSubmit}>
     <input {...register("firstName")} />
     <input {...register("lastName")} />
     <IsolateReRender control={control} />


     <input type="submit" />
   </form>
 )
}

</> UseFormReturn
TypeCode Example
Copy
export type UseFormReturn<
 TFieldValues extends FieldValues = FieldValues,
 TContext = any,
 TTransformedValues extends FieldValues | undefined = undefined,
> = {
 watch: UseFormWatch<TFieldValues>
 getValues: UseFormGetValues<TFieldValues>
 getFieldState: UseFormGetFieldState<TFieldValues>
 setError: UseFormSetError<TFieldValues>
 clearErrors: UseFormClearErrors<TFieldValues>
 setValue: UseFormSetValue<TFieldValues>
 trigger: UseFormTrigger<TFieldValues>
 formState: FormState<TFieldValues>
 resetField: UseFormResetField<TFieldValues>
 reset: UseFormReset<TFieldValues>
 handleSubmit: UseFormHandleSubmit<TFieldValues>
 unregister: UseFormUnregister<TFieldValues>
 control: Control<TFieldValues, TContext>
 register: UseFormRegister<TFieldValues>
 setFocus: UseFormSetFocus<TFieldValues>
}

</> UseFormProps
Copy
export type UseFormProps<
 TFieldValues extends FieldValues = FieldValues,
 TContext extends object = object,
 TTransformedValues extends FieldValues | undefined = undefined,
> = Partial<{
 mode: Mode
 disabled: boolean
 reValidateMode: Exclude<Mode, "onTouched" | "all">
 defaultValues: DefaultValues<TFieldValues> | AsyncDefaultValues<TFieldValues>
 values: TFieldValues
 errors: FieldErrors<TFieldValues>
 resetOptions: Parameters<UseFormReset<TFieldValues>>[1]
 resolver: Resolver<TFieldValues, TContext>
 context: TContext
 shouldFocusError: boolean
 shouldUnregister: boolean
 shouldUseNativeValidation: boolean
 progressive: boolean
 criteriaMode: CriteriaMode
 delayError: number
}>

</> UseFieldArrayReturn
Copy
export type UseFieldArrayReturn<
 TFieldValues extends FieldValues = FieldValues,
 TFieldArrayName extends
   FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
 TKeyName extends string = "id",
> = {
 swap: UseFieldArraySwap
 move: UseFieldArrayMove
 prepend: UseFieldArrayPrepend<TFieldValues, TFieldArrayName>
 append: UseFieldArrayAppend<TFieldValues, TFieldArrayName>
 remove: UseFieldArrayRemove
 insert: UseFieldArrayInsert<TFieldValues, TFieldArrayName>
 update: UseFieldArrayUpdate<TFieldValues, TFieldArrayName>
 replace: UseFieldArrayReplace<TFieldValues, TFieldArrayName>
 fields: FieldArrayWithId<TFieldValues, TFieldArrayName, TKeyName>[]
}

</> UseFieldArrayProps
Copy
export type UseFieldArrayProps<
 TFieldValues extends FieldValues = FieldValues,
 TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
 TKeyName extends string = 'id',
> = {
 name: TFieldArrayName
 keyName?: TKeyName
 control?: Control<TFieldValues>
 rules?: {
   validate?
     | Validate<FieldArray<TFieldValues, TFieldArrayName>[], TFieldValues>
     | Record<
         string,
         Validate<FieldArray<TFieldValues, TFieldArrayName>[], TFieldValues>
       >
 } & Pick<
   RegisterOptions<TFieldValues>,
   'maxLength' | 'minLength' | 'required'
 >
 shouldUnregister?: boolean
}

</> UseControllerReturn
Copy
export type UseControllerReturn<
 TFieldValues extends FieldValues = FieldValues,
 TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
 field: ControllerRenderProps<TFieldValues, TName>
 formState: UseFormStateReturn<TFieldValues>
 fieldState: ControllerFieldState
}

</> UseControllerProps
Copy
export type UseControllerProps<
 TFieldValues extends FieldValues = FieldValues,
 TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
 name: TName
 rules?: Omit<
   RegisterOptions<TFieldValues, TName>,
   "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
 >
 shouldUnregister?: boolean
 defaultValue?: FieldPathValue<TFieldValues, TName>
 control?: Control<TFieldValues>
 disabled?: boolean
}

</> FieldError
Copy
export type FieldError = {
 type: LiteralUnion<keyof RegisterOptions, string>
 root?: FieldError
 ref?: Ref
 types?: MultipleFieldErrors
 message?: Message
}

</> FieldErrors
Copy
export type FieldErrors<T extends FieldValues = FieldValues> = Partial<
 FieldValues extends IsAny<FieldValues>
   ? any
   : FieldErrorsImpl<DeepRequired<T>>
> & {
 root?: Record<string, GlobalError> & GlobalError
}

</> Field
Copy
export type Field = {
 _f: {
   ref: Ref
   name: InternalFieldName
   refs?: HTMLInputElement[]
   mount?: boolean
 } & RegisterOptions
}

</> FieldPath
This type is useful when you define custom component's name prop, and it will type check against your field path.
Copy
export type FieldPath<TFieldValues extends FieldValues> = Path<TFieldValues>

</> FieldPathByValue
This type will return union with all available paths that match the passed value
Copy
export type FieldPathByValue<TFieldValues extends FieldValues, TValue> = {
 [Key in FieldPath<TFieldValues>]: FieldPathValue<
   TFieldValues,
   Key
 > extends TValue
   ? Key
   : never
}[FieldPath<TFieldValues>]

</> FieldValues
Copy
export type FieldValues = Record<string, any>

</> FieldArrayWithId
Copy
export type FieldArrayWithId<
 TFieldValues extends FieldValues = FieldValues,
 TFieldArrayName extends
   FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
 TKeyName extends string = "id",
> = FieldArray<TFieldValues, TFieldArrayName> & Record<TKeyName, string>

</> Mode
Copy
export type ValidationMode = typeof VALIDATION_MODE


export type Mode = keyof ValidationMode

</> RegisterOptions
Copy
export type RegisterOptions<
 TFieldValues extends FieldValues = FieldValues,
 TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Partial<{
 required: Message | ValidationRule<boolean>
 min: ValidationRule<number | string>
 max: ValidationRule<number | string>
 maxLength: ValidationRule<number>
 minLength: ValidationRule<number>
 validate:
   | Validate<FieldPathValue<TFieldValues, TFieldName>, TFieldValues>
   | Record<
       string,
       Validate<FieldPathValue<TFieldValues, TFieldName>, TFieldValues>
     >
 value: FieldPathValue<TFieldValues, TFieldName>
 setValueAs: (value: any) => any
 shouldUnregister?: boolean
 onChange?: (event: any) => void
 onBlur?: (event: any) => void
 disabled: boolean
 deps: FieldPath<TFieldValues> | FieldPath<TFieldValues>[]
}> &
 (
   | {
       pattern?: ValidationRule<RegExp>
       valueAsNumber?: false
       valueAsDate?: false
     }
   | {
       pattern?: undefined
       valueAsNumber?: false
       valueAsDate?: true
     }
   | {
       pattern?: undefined
       valueAsNumber?: true
       valueAsDate?: false
     }
 )

</> FormStateProxy
Copy
export type FormStateProxy<TFieldValues extends FieldValues = FieldValues> = {
 isDirty: boolean
 isValidating: boolean
 dirtyFields: FieldNamesMarkedBoolean<TFieldValues>
 touchedFields: FieldNamesMarkedBoolean<TFieldValues>
 validatingFields: FieldNamesMarkedBoolean<TFieldValues>
 errors: boolean
 isValid: boolean
}

</> NestedValue (Deprecated at 7.33.0)
Code ExampleType
Copy
CodeSandboxTS
import { useForm, NestedValue } from "react-hook-form"
import { Autocomplete, TextField, Select } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"


type Option = {
 label: string
 value: string
}


const options = [
 { label: "Chocolate", value: "chocolate" },
 { label: "Strawberry", value: "strawberry" },
 { label: "Vanilla", value: "vanilla" },
]


export default function App() {
 const {
   register,
   handleSubmit,
   watch,
   setValue,
   formState: { errors },
 } = useForm<{
   autocomplete: NestedValue<Option[]>
   select: NestedValue<number[]>
 }>({
   defaultValues: { autocomplete: [], select: [] },
 })
 const onSubmit = handleSubmit((data) => console.log(data))


 React.useEffect(() => {
   register("autocomplete", {
     validate: (value) => value.length || "This is required.",
   })
   register("select", {
     validate: (value) => value.length || "This is required.",
   })
 }, [register])


 return (
   <form onSubmit={onSubmit}>
     <Autocomplete
       options={options}
       getOptionLabel={(option: Option) => option.label}
       onChange={(e, options) => setValue("autocomplete", options)}
       renderInput={(params) => (
         <TextField
           {...params}
           error={Boolean(errors?.autocomplete)}
           helperText={errors?.autocomplete?.message}
         />
       )}
     />


     <Select
       value=""
       onChange={(e) => setValue("muiSelect", e.target.value as number[])}
     >
       <MenuItem value={10}>Ten</MenuItem>
       <MenuItem value={20}>Twenty</MenuItem>
     </Select>


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
Typescript Support
Advanced Usage
Build complex and accessible forms
Menu
</>Accessibility (A11y)
</>Wizard Form / Funnel
</>Smart Form Component
</>Error Messages
</>Connect Form
</>FormProvider Performance
</>Controlled mixed with Uncontrolled Components
</>Custom Hook with Resolver
</>Working with virtualized lists
</>Testing Form
</>Transform and Parse
Accessibility (A11y)
React Hook Form has support for native form validation, which lets you validate inputs with your own rules. Since most of us have to build forms with custom designs and layouts, it is our responsibility to make sure those are accessible (A11y).
The following code example works as intended for validation; however, it can be improved for accessibility.
Copy
import { useForm } from "react-hook-form"


export default function App() {
 const {
   register,
   handleSubmit,
   formState: { errors },
 } = useForm()
 const onSubmit = (data) => console.log(data)


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <label htmlFor="name">Name</label>
     <input
       id="name"
       {...register("name", { required: true, maxLength: 30 })}
     />
     {errors.name && errors.name.type === "required" && (
       <span>This is required</span>
     )}
     {errors.name && errors.name.type === "maxLength" && (
       <span>Max length exceeded</span>
     )}
     <input type="submit" />
   </form>
 )
}
The following code example is an improved version by leveraging ARIA.
Copy
import { useForm } from "react-hook-form"


export default function App() {
 const {
   register,
   handleSubmit,
   formState: { errors },
 } = useForm()
 const onSubmit = (data) => console.log(data)


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <label htmlFor="name">Name</label>


     {/* use aria-invalid to indicate field contain error */}
     <input
       id="name"
       aria-invalid={errors.name ? "true" : "false"}
       {...register("name", { required: true, maxLength: 30 })}
     />


     {/* use role="alert" to announce the error message */}
     {errors.name && errors.name.type === "required" && (
       <span role="alert">This is required</span>
     )}
     {errors.name && errors.name.type === "maxLength" && (
       <span role="alert">Max length exceeded</span>
     )}


     <input type="submit" />
   </form>
 )
}
After this improvement, the screen reader will say: “Name, edit, invalid entry, This is required.”

Wizard Form / Funnel
It's pretty common to collect user information through different pages and sections. We recommend using a state management library to store user input through different pages or sections. In this example, we are going to use little state machine as our state management library (you can replace it with redux if you are more familiar with it).
Step 1: Set up your routes and store.
Copy
CodeSandboxJS
import { BrowserRouter as Router, Route } from "react-router-dom"
import { StateMachineProvider, createStore } from "little-state-machine"
import Step1 from "./Step1"
import Step2 from "./Step2"
import Result from "./Result"


createStore({
 data: {
   firstName: "",
   lastName: "",
 },
})


export default function App() {
 return (
   <StateMachineProvider>
     <Router>
       <Route exact path="/" component={Step1} />
       <Route path="/step2" component={Step2} />
       <Route path="/result" component={Result} />
     </Router>
   </StateMachineProvider>
 )
}
Step 2: Create your pages, collect and submit the data to the store and push to the next form/page.
Copy
CodeSandboxJS
import { useForm } from "react-hook-form"
import { withRouter } from "react-router-dom"
import { useStateMachine } from "little-state-machine"
import updateAction from "./updateAction"


const Step1 = (props) => {
 const { register, handleSubmit } = useForm()
 const { actions } = useStateMachine({ updateAction })
 const onSubmit = (data) => {
   actions.updateAction(data)
   props.history.push("./step2")
 }


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input {...register("firstName")} />
     <input {...register("lastName")} />
     <input type="submit" />
   </form>
 )
}


export default withRouter(Step1)
Step 3: Make your final submission with all the data in the store or display the resulting data.
Copy
CodeSandboxJS
import { useStateMachine } from "little-state-machine"
import updateAction from "./updateAction"


const Result = (props) => {
 const { state } = useStateMachine(updateAction)


 return <pre>{JSON.stringify(state, null, 2)}</pre>
}
Following the above pattern, you should be able to build a wizard form/funnel to collect user input data from multiple pages.

Smart Form Component
This idea here is that you can easily compose your form with inputs. We are going to create a Form component to automatically collect form data.
Copy
CodeSandboxJS
import { Form, Input, Select } from "./Components"


export default function App() {
 const onSubmit = (data) => console.log(data)


 return (
   <Form onSubmit={onSubmit}>
     <Input name="firstName" />
     <Input name="lastName" />
     <Select name="gender" options={["female", "male", "other"]} />


     <Input type="submit" value="Submit" />
   </Form>
 )
}
Let's have a look what's in each of these components.
</> Form
The Form component's responsibility is to inject all react-hook-form methods into the child component.
Copy
CodeSandboxJS
import { Children, createElement } from "react"
import { useForm } from "react-hook-form"


export default function Form({ defaultValues, children, onSubmit }) {
 const methods = useForm({ defaultValues })
 const { handleSubmit } = methods


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     {Children.map(children, (child) => {
       return child.props.name
         ? createElement(child.type, {
             ...{
               ...child.props,
               register: methods.register,
               key: child.props.name,
             },
           })
         : child
     })}
   </form>
 )
}
</> Input / Select
Those input components' responsibility is to register them into react-hook-form.
Copy
CodeSandboxJS
export function Input({ register, name, ...rest }) {
 return <input {...register(name)} {...rest} />
}


export function Select({ register, options, name, ...rest }) {
 return (
   <select {...register(name)} {...rest}>
     {options.map((value) => (
       <option key={value} value={value}>
         {value}
       </option>
     ))}
   </select>
 )
}
With the Form component injecting react-hook-form's props into the child component, you can easily create and compose complex forms in your app.

Error Messages
Error messages are visual feedback to our users when there are issues with their inputs. React Hook Form provides an errors object to let you retrieve errors easily. There are several different ways to improve error presentation on the screen.
Register
You can simply pass the error message to register, via the message attribute of the validation rule object, like this:
<input {...register('test', { maxLength: { value: 2, message: "error message" } })} />
Optional Chaining
The ?. optional chaining operator permits reading the errors object without worrying about causing another error due to null or undefined.
errors?.firstName?.message
Lodash get
If your project is using lodash, then you can leverage the lodash get function. Eg:
get(errors, 'firstName.message')

Connect Form
When we are building forms, there are times when our input lives inside of deeply nested component trees, and that's when FormContext comes in handy. However, we can further improve the Developer Experience by creating a ConnectForm component and leveraging React's renderProps. The benefit is you can connect your input with React Hook Form much easier.
Copy
import { FormProvider, useForm, useFormContext } from "react-hook-form"


export const ConnectForm = ({ children }) => {
 const methods = useFormContext()


 return children(methods)
}


export const DeepNest = () => (
 <ConnectForm>
   {({ register }) => <input {...register("deepNestedInput")} />}
 </ConnectForm>
)


export const App = () => {
 const methods = useForm()


 return (
   <FormProvider {...methods}>
     <form>
       <DeepNest />
     </form>
   </FormProvider>
 )
}

FormProvider Performance
React Hook Form's FormProvider is built upon React's Context API. It solves the problem where data is passed through the component tree without having to pass props down manually at every level. This also causes the component tree to trigger a re-render when React Hook Form triggers a state update, but we can still optimise our App if required via the example below.
Note: Using React Hook Form's Devtools alongside FormProvider can cause performance issues in some situations. Before diving deep in performance optimizations, consider this bottleneck first.
Copy
CodeSandboxJS
import { memo } from "react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"


// we can use React.memo to prevent re-render except isDirty state changed
const NestedInput = memo(
 ({ register, formState: { isDirty } }) => (
   <div>
     <input {...register("test")} />
     {isDirty && <p>This field is dirty</p>}
   </div>
 ),
 (prevProps, nextProps) =>
   prevProps.formState.isDirty === nextProps.formState.isDirty
)


export const NestedInputContainer = ({ children }) => {
 const methods = useFormContext()


 return <NestedInput {...methods} />
}


export default function App() {
 const methods = useForm()
 const onSubmit = (data) => console.log(data)
 console.log(methods.formState.isDirty) // make sure formState is read before render to enable the Proxy


 return (
   <FormProvider {...methods}>
     <form onSubmit={methods.handleSubmit(onSubmit)}>
       <NestedInputContainer />
       <input type="submit" />
     </form>
   </FormProvider>
 )
}

Controlled mixed with Uncontrolled Components
React Hook Form embraces uncontrolled components but is also compatible with controlled components. Most UI libraries are built to support only controlled components, such as MUI and Antd. But with React Hook Form, the re-rendering of controlled components are also optimized. Here is an example that combines them both with validation.
ControllerCustom Register
Copy
import { Input, Select, MenuItem } from "@material-ui/core"
import { useForm, Controller } from "react-hook-form"


const defaultValues = {
 select: "",
 input: "",
}


function App() {
 const { handleSubmit, reset, control, register } = useForm({
   defaultValues,
 })
 const onSubmit = (data) => console.log(data)


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <Controller
       render={({ field }) => (
         <Select {...field}>
           <MenuItem value={10}>Ten</MenuItem>
           <MenuItem value={20}>Twenty</MenuItem>
         </Select>
       )}
       control={control}
       name="select"
       defaultValue={10}
     />


     <Input {...register("input")} />


     <button type="button" onClick={() => reset({ defaultValues })}>
       Reset
     </button>
     <input type="submit" />
   </form>
 )
}

Custom Hook with Resolver
You can build a custom hook as a resolver. A custom hook can easily integrate with yup/Joi/Superstruct as a validation method, and to be used inside validation resolver.
Define a memorized validation schema (or define it outside your component if you don't have any dependencies)
Use the custom hook, by passing the validation schema
Pass the validation resolver to the useForm hook
Copy
CodeSandboxJS
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"


const useYupValidationResolver = (validationSchema) =>
 useCallback(
   async (data) => {
     try {
       const values = await validationSchema.validate(data, {
         abortEarly: false,
       })


       return {
         values,
         errors: {},
       }
     } catch (errors) {
       return {
         values: {},
         errors: errors.inner.reduce(
           (allErrors, currentError) => ({
             ...allErrors,
             [currentError.path]: {
               type: currentError.type ?? "validation",
               message: currentError.message,
             },
           }),
           {}
         ),
       }
     }
   },
   [validationSchema]
 )


const validationSchema = yup.object({
 firstName: yup.string().required("Required"),
 lastName: yup.string().required("Required"),
})


export default function App() {
 const resolver = useYupValidationResolver(validationSchema)
 const { handleSubmit, register } = useForm({ resolver })


 return (
   <form onSubmit={handleSubmit((data) => console.log(data))}>
     <input {...register("firstName")} />
     <input {...register("lastName")} />
     <input type="submit" />
   </form>
 )
}

Working with virtualized lists
Imagine a scenario where you have a table of data. This table might contain hundreds or thousands of rows, and each row will have inputs. A common practice is to only render the items that are in the viewport, however this will cause issues as the items are removed from the DOM when they are out of view and re-added. This will cause items to reset to their default values when they re-enter the viewport.
An example is shown below using react-window.
FormField Array
Copy
CodeSandboxJS
import { memo } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { VariableSizeList as List } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"


const items = Array.from(Array(1000).keys()).map((i) => ({
 title: `List ${i}`,
 quantity: Math.floor(Math.random() * 10),
}))


const WindowedRow = memo(({ index, style, data }) => {
 const { register } = useFormContext()


 return <input {...register(`${index}.quantity`)} />
})


export const App = () => {
 const onSubmit = (data) => console.log(data)
 const methods = useForm({ defaultValues: items })


 return (
   <form onSubmit={methods.handleSubmit(onSubmit)}>
     <FormProvider {...methods}>
       <AutoSizer>
         {({ height, width }) => (
           <List
             height={height}
             itemCount={items.length}
             itemSize={() => 100}
             width={width}
             itemData={items}
           >
             {WindowedRow}
           </List>
         )}
       </AutoSizer>
     </FormProvider>
     <button type="submit">Submit</button>
   </form>
 )
}

Testing Form
Testing is very important because it prevents your code from having bugs or mistakes. It also guarantees code safety when refactoring the codebase.
We recommend using testing-library, because it is simple and tests are more focused on user behavior.
Step 1: Set up your testing environment.
Please install @testing-library/jest-dom with the latest version of jest, because react-hook-form uses MutationObserver to detect inputs, and to get unmounted from the DOM.
Note: If you are using React Native, you don't need to install @testing-library/jest-dom.
Copy
npm install -D @testing-library/jest-dom
Create setup.js to import @testing-library/jest-dom.
Copy
CodeSandboxJS
import "@testing-library/jest-dom"
Note: If you are using React Native, you need to create setup.js, define window object, and include the following lines in the setup file:
Copy
global.window = {}
global.window = global
Finally, you have to update setup.js in jest.config.js to include the file.
Copy
CodeSandboxJS
module.exports = {
 setupFilesAfterEnv: ["<rootDir>/setup.js"], // or .ts for TypeScript App
 // ...other settings
}
Additionally, you can set up eslint-plugin-testing-library and eslint-plugin-jest-dom to follow best practices and anticipate common mistakes when writing your tests.
Step 2: Create login form.
We have set the role attribute accordingly. These attributes are helpful for when you write tests, and they improve accessibility. For more information, you can refer to the testing-library documentation.
Copy
CodeSandboxJS
import { useForm } from "react-hook-form"


export default function App({ login }) {
 const {
   register,
   handleSubmit,
   formState: { errors },
   reset,
 } = useForm()
 const onSubmit = async (data) => {
   await login(data.email, data.password)
   reset()
 }


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <label htmlFor="email">email</label>
     <input
       id="email"
       {...register("email", {
         required: "required",
         pattern: {
           value: /\S+@\S+\.\S+/,
           message: "Entered value does not match email format",
         },
       })}
       type="email"
     />
     {errors.email && <span role="alert">{errors.email.message}</span>}
     <label htmlFor="password">password</label>
     <input
       id="password"
       {...register("password", {
         required: "required",
         minLength: {
           value: 5,
           message: "min length is 5",
         },
       })}
       type="password"
     />
     {errors.password && <span role="alert">{errors.password.message}</span>}
     <button type="submit">SUBMIT</button>
   </form>
 )
}
Step 3: Write tests.
The following criteria are what we try to cover with the tests:
Test submission failure.
We are using waitFor util and find* queries to detect submission feedback, because the handleSubmit method is executed asynchronously.
Test validation associated with each inputs.
We are using the *ByRole method when querying different elements because that's how users recognize your UI component.
Test successful submission.
Copy
CodeSandboxJS
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import App from "./App"


const mockLogin = jest.fn((email, password) => {
 return Promise.resolve({ email, password })
})


it("should display required error when value is invalid", async () => {
 render(<App login={mockLogin} />)


 fireEvent.submit(screen.getByRole("button"))


 expect(await screen.findAllByRole("alert")).toHaveLength(2)
 expect(mockLogin).not.toBeCalled()
})


it("should display matching error when email is invalid", async () => {
 render(<App login={mockLogin} />)


 fireEvent.input(screen.getByRole("textbox", { name: /email/i }), {
   target: {
     value: "test",
   },
 })


 fireEvent.input(screen.getByLabelText("password"), {
   target: {
     value: "password",
   },
 })


 fireEvent.submit(screen.getByRole("button"))


 expect(await screen.findAllByRole("alert")).toHaveLength(1)
 expect(mockLogin).not.toBeCalled()
 expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("test")
 expect(screen.getByLabelText("password")).toHaveValue("password")
})


it("should display min length error when password is invalid", async () => {
 render(<App login={mockLogin} />)


 fireEvent.input(screen.getByRole("textbox", { name: /email/i }), {
   target: {
     value: "test@mail.com",
   },
 })


 fireEvent.input(screen.getByLabelText("password"), {
   target: {
     value: "pass",
   },
 })


 fireEvent.submit(screen.getByRole("button"))


 expect(await screen.findAllByRole("alert")).toHaveLength(1)
 expect(mockLogin).not.toBeCalled()
 expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue(
   "test@mail.com"
 )
 expect(screen.getByLabelText("password")).toHaveValue("pass")
})


it("should not display error when value is valid", async () => {
 render(<App login={mockLogin} />)


 fireEvent.input(screen.getByRole("textbox", { name: /email/i }), {
   target: {
     value: "test@mail.com",
   },
 })


 fireEvent.input(screen.getByLabelText("password"), {
   target: {
     value: "password",
   },
 })


 fireEvent.submit(screen.getByRole("button"))


 await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0))
 expect(mockLogin).toBeCalledWith("test@mail.com", "password")
 expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("")
 expect(screen.getByLabelText("password")).toHaveValue("")
})
Resolving act warning during test
If you test a component that uses react-hook-form, you might run into a warning like this, even if you didn't write any asynchronous code for that component:
Warning: An update to MyComponent inside a test was not wrapped in act(...)
Copy
CodeSandboxJS
import { useForm } from "react-hook-form"


export default function App() {
 const { register, handleSubmit } = useForm({
   mode: "onChange",
 })
 const onSubmit = (data) => {}


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input
       {...register("answer", {
         required: true,
       })}
     />
     <button type="submit">SUBMIT</button>
   </form>
 )
}
Copy
CodeSandboxJS
import { render, screen } from "@testing-library/react"
import App from "./App"


it("should have a submit button", () => {
 render(<App />)


 expect(screen.getByText("SUBMIT")).toBeInTheDocument()
})
In this example, there is a simple form without any apparent async code, and the test merely renders the component and tests for the presence of a button. However, it still logs the warning about updates not being wrapped in act().
This is because react-hook-form internally uses asynchronous validation handlers. In order to compute the formState, it has to initially validate the form, which is done asynchronously, resulting in another render. That update happens after the test function returns, which triggers the warning.
To solve this, wait until some element from your UI appears with find* queries. Note that you must not wrap your render() calls in act(). You can read more about wrapping things in act unnecessarily here.
Copy
CodeSandboxJS
import { render, screen } from "@testing-library/react"
import App from "./App"


it("should have a submit button", async () => {
 render(<App />)


 expect(await screen.findByText("SUBMIT")).toBeInTheDocument()


 // Now that the UI was awaited until the async behavior was completed,
 // you can keep asserting with `get*` queries.
 expect(screen.getByRole("textbox")).toBeInTheDocument()
})

Transform and Parse
The native input returns the value in string format unless invoked with valueAsNumber or valueAsDate, you can read more under this section. However, it's not perfect. We still have to deal with isNaN or null values. So it's better to leave the transform at the custom hook level. In the following example, we are using the Controller to include the functionality of the transform value's input and output. You can also achieve a similar result with a custom register.
Copy
CodeSandboxJS
import { Controller } from "react-hook-form"


const ControllerPlus = ({ control, transform, name, defaultValue }) => (
 <Controller
   defaultValue={defaultValue}
   control={control}
   name={name}
   render={({ field }) => (
     <input
       onChange={(e) => field.onChange(transform.output(e))}
       value={transform.input(field.value)}
     />
   )}
 />
)


// usage below:
<ControllerPlus
 transform={{
   input: (value) => (isNaN(value) || value === 0 ? "" : value.toString()),
   output: (e) => {
     const output = parseInt(e.target.value, 10)
     return isNaN(output) ? 0 : output
   },
 }}
 control={control}
 name="number"
 defaultValue=""
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
Advanced Usage
FAQs
Frequently asked questions
Menu
</>Performance of React Hook Form
</>How to create an accessible input error and message?
</>Does it work with Class Components?
</>How to reset the form?
</>How to initialize form values?
</>How to share ref usage?
</>What if you don't have access to ref?
</>Why is the first keystroke not working?
</>React Hook Form, Formik or Redux Form?
</>watch vs getValues vs state
</>Why is default value not changing correctly with ternary operator?
</>How to work with modal or tab forms?
Performance of React Hook Form
Performance is one of the primary reasons why this library was created. React Hook Form relies on an uncontrolled form, which is the reason why the register function captures ref and the controlled component has its re-rendering scope with Controller or useController. This approach reduces the amount of re-rendering that occurs due to a user typing in an input or other form values changing at the root of your form or applications. Components mount to the page faster than controlled components because they have less overhead. As a reference, there is a quick comparison test that you can refer to at this repo link.

How to create an accessible input error and message?
React Hook Form is based on Uncontrolled Components, which gives you the ability to easily build an accessible custom form. (For more information about Uncontrolled Components, read Sharing State Between Components)
Copy
import { useForm } from "react-hook-form"


export default function App() {
 const {
   register,
   handleSubmit,
   formState: { errors },
 } = useForm()
 const onSubmit = (data) => console.log(data)


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <label htmlFor="firstName">First name</label>
     <input
       id="firstName"
       aria-invalid={errors.firstName ? "true" : "false"}
       {...register("firstName", { required: true })}
     />
     {errors.firstName && <span role="alert">This field is required</span>}


     <input type="submit" />
   </form>
 )
}

Does it work with Class Components?
No, not out of the box. If you want to do this, you can build a wrapper around it and use it in your Class Component.
You can’t use Hooks inside of a class component, but you can definitely mix classes and function components with Hooks in a single tree. Whether a component is a class or a function that uses Hooks is simply an implementation detail of that component. In the longer term, we expect Hooks to be the primary way people write React components.

How to reset the form?
There are two methods to clear the form:
HTMLFormElement.reset()
This method does the same thing as clicking a form's reset button. It only clears input/select/checkbox values.
React Hook Form API: reset()
React Hook Form's reset method will reset all field values, and will also clear all errors within the form.

How to initialize form values?
Being that React Hook Form relies on an uncontrolled form, you can specify a defaultValue or defaultChecked to an individual field. However, it is more common and recommended to initialize a form by passing defaultValues to useForm.
Copy
function App() {
 const { register, handleSubmit } = useForm({
   defaultValues: {
     firstName: "bill",
     lastName: "luo",
   },
 })


 return (
   <form onSubmit={handleSubmit((data) => console.log(data))}>
     <input {...register("firstName")} />
     <input {...register("lastName")} />
     <button type="submit">Submit</button>
   </form>
 )
}
For async default values, you can use the following methods:
Async defaultValues
Copy
function App() {
  const { register, handleSubmit } = useForm({
    defaultValues: async () => {
      const response = await fetch("/api")
      return await response.json() // return { firstName: '', lastName: '' }
    },
  })
}
Reactive values
Copy
function App() {
  const { data } = useQuery() // data returns { firstName: '', lastName: '' }
  const { register, handleSubmit } = useForm({
    values: data,
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  })
}

How to share ref usage?
React Hook Form needs a ref to collect the input value. However, you may want to use ref for other purposes (e.g. scroll into the view, or focus).
TSJS
Copy
import { useRef, useImperativeHandle } from "react"
import { useForm } from "react-hook-form"


type Inputs = {
 firstName: string
 lastName: string
}


export default function App() {
 const { register, handleSubmit } = useForm<Inputs>()
 const firstNameRef = useRef<HTMLInputElement>(null)
 const onSubmit = (data: Inputs) => console.log(data)
 const { ref, ...rest } = register("firstName")
 const onClick = () => {
   firstNameRef.current!.value = ""
 }


 useImperativeHandle(ref, () => firstNameRef.current)


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input {...rest} ref={firstNameRef} />
     <button type="button" onClick={onClick}>
       clear
     </button>
     <button>Submit</button>
   </form>
 )
}

What if you don't have access to ref?
You can actually register an input without a ref. In fact, you can manually setValue, setError and trigger.
Note: Because ref has not been registered, React Hook Form won't be able to register event listeners to the inputs. This means you will have to manually update value and error.
Copy
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"


export default function App() {
 const { register, handleSubmit, setValue, setError } = useForm()
 const onSubmit = (data) => console.log(data)


 useEffect(() => {
   register("firstName", { required: true })
   register("lastName")
 }, [])


 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input
       name="firstName"
       onChange={(e) => setValue("firstName", e.target.value)}
     />
     <input
       name="lastName"
       onChange={(e) => {
         const value = e.target.value
         if (value === "test") {
           setError("lastName", "notMatch")
         } else {
           setValue("lastName", e.target.value)
         }
       }}
     />
     <button>Submit</button>
   </form>
 )
}

Why is the first keystroke not working?
Make sure you are not using value. The correct property is defaultValue.
React Hook Form is focusing on uncontrolled inputs, which means you don't need to change the input value via state via onChange. In fact, you don't need value at all. You only need to set defaultValue for the initial input value.
import { useForm } from "react-hook-form/dist/index.ie11" // V6
import { useForm } from "react-hook-form/dist/react-hook-form.ie11" // V5'
// Resolvers
import { yupResolver } from "@hookform/resolvers/dist/ie11/yup"

React Hook Form, Formik or Redux Form?
First of all, all libs try to solve the same problem: make the form building experience as easy as possible. However, there are some fundamental differences between these three. react-hook-form is built with uncontrolled inputs in mind and tries to provide your form with the best performance and least amount of re-renders possible. Additionallly, react-hook-form is built with React Hooks and used as a hook, which means there is no Component for you to import. Here are some of the detailed differences:


React Hook Form
Formik
Redux Form
Component
uncontrolled & controlled
controlled
controlled
Rendering
minimum re-render and optimise computation
re-render according to local state changes (As you type in the input.)
re-render according to state management lib (Redux) changes (As you type in the input.)
API
Hooks
Component (RenderProps, Form, Field) + Hooks
Component (RenderProps, Form, Field)
Package size
Small
react-hook-form@7.27.0
8.5KB
Medium
formik@2.1.4
15KB
Large
redux-form@8.3.6
26.4KB
Validation
Built-in, Yup, Zod, Joi, Superstruct and build your own.
Build yourself or Yup
Build yourself or Plugins
Learning curve
Low to Medium
Medium
Medium


watch vs getValues vs state
watch: subscribe to either all inputs or a specified input's changes via an event listener and re-render based on which fields are subscribed to. Check out this codesandbox for actual behaviour.
getValues: get values that are stored inside the custom hook as reference, fast and cheap. This method doesn’t trigger a re-render.
local state: React local state represents more than just an input’s state and also decides what to render. This will trigger on each input’s change.

Why is default value not changing correctly with ternary operator?
React Hook Form doesn't control your entire form and inputs, which is why React wouldn't recognize that the actual input has been exchanged or swapped. As a solution, you can resolve this problem by giving a unique key prop to your input. You can also read more about the key props from this article written by Kent C. Dodds.
Copy
CodeSandboxJS
import { useForm } from "react-hook-form"


export default function App() {
 const { register } = useForm()


 return (
   <div>
     {watchChecked ? (
       <input {...register("input3")} key="key1" defaultValue="1" />
     ) : (
       <input {...register("input4")} key="key2" defaultValue="2" />
     )}
   </div>
 )
}

How to work with modal or tab forms?
It's important to understand that React Hook Form embraces native form behavior by storing input state inside each input (except custom register at useEffect). A common misconception is that input state remains with mounted or unmounted inputs. Such as when working with a modal or tab forms. Instead, the correct solution is to build a new form for your form inside each modal or tab and capture your submission data in local or global state and then do something with the combined data.
Modal form and toggle inputs example
Tab form example
Alternatively you can use the deprecated option shouldUnregister: false when calling `useForm`.
ControllerCustom Register
Copy
import { useForm, Controller } from "react-hook-form"


function App() {
 const { control } = useForm()


 return (
   <Controller
     render={({ field }) => <input {...field} />}
     name="firstName"
     control={control}
     defaultValue=""
   />
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
FAQs


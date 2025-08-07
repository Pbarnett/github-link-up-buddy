# React Testing Library API Documentation

## Overview
Complete API reference for React Testing Library, focusing on testing React components with proper async handling, user interactions, and component mocking patterns.

## Installation
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## Core Rendering Functions

### render
```tsx
import { render, RenderOptions, RenderResult } from '@testing-library/react';

interface RenderOptions {
  container?: HTMLElement;
  baseElement?: HTMLElement;
  hydrate?: boolean;
  legacyRoot?: boolean;
  wrapper?: React.ComponentType<any>;
}

interface RenderResult {
  container: HTMLDivElement;
  baseElement: HTMLElement;
  debug: (baseElement?: HTMLElement | DocumentFragment) => void;
  rerender: (ui: React.ReactElement) => void;
  unmount: () => boolean;
  asFragment: () => DocumentFragment;
  // All query methods are also available
  getByRole: (role: ByRoleMatcher, options?: ByRoleOptions) => HTMLElement;
  // ... (all other query methods)
}

function render(ui: React.ReactElement, options?: RenderOptions): RenderResult
```

#### Basic Usage
```tsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders component', () => {
  render(<MyComponent />);
  // Use screen to query elements
});
```

#### With Custom Wrapper
```tsx
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function AllTheProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
```

### renderHook
```tsx
import { renderHook, RenderHookOptions, RenderHookResult } from '@testing-library/react';

interface RenderHookOptions<Props> {
  initialProps?: Props;
  wrapper?: React.ComponentType<any>;
}

interface RenderHookResult<Result, Props> {
  result: { current: Result };
  rerender: (newProps?: Props) => void;
  unmount: () => void;
}

function renderHook<Result, Props>(
  callback: (props: Props) => Result,
  options?: RenderHookOptions<Props>
): RenderHookResult<Result, Props>
```

#### Usage
```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

## Query Methods

React Testing Library provides three types of queries:
- **getBy**: Returns element or throws error
- **queryBy**: Returns element or null
- **findBy**: Returns promise that resolves to element or rejects

### ByRole Queries
```tsx
// Get elements by their accessibility role
getByRole(role: ByRoleMatcher, options?: ByRoleOptions): HTMLElement
queryByRole(role: ByRoleMatcher, options?: ByRoleOptions): HTMLElement | null
findByRole(role: ByRoleMatcher, options?: ByRoleOptions): Promise<HTMLElement>

interface ByRoleOptions {
  hidden?: boolean;
  name?: TextMatch;
  description?: TextMatch;
  selected?: boolean;
  checked?: boolean;
  pressed?: boolean;
  current?: boolean | string;
  expanded?: boolean;
  queryFallbacks?: boolean;
  level?: number;
}
```

#### Examples
```tsx
// Button
const button = screen.getByRole('button', { name: /submit/i });

// Form input
const input = screen.getByRole('textbox', { name: /email/i });

// Checkbox
const checkbox = screen.getByRole('checkbox', { checked: true });

// Select dropdown
const select = screen.getByRole('combobox');

// Link
const link = screen.getByRole('link', { name: /learn more/i });
```

### ByLabelText Queries
```tsx
getByLabelText(text: TextMatch, options?: SelectorMatcherOptions): HTMLElement
queryByLabelText(text: TextMatch, options?: SelectorMatcherOptions): HTMLElement | null
findByLabelText(text: TextMatch, options?: SelectorMatcherOptions): Promise<HTMLElement>
```

#### Examples
```tsx
// Label text
const input = screen.getByLabelText(/email address/i);

// aria-label
const button = screen.getByLabelText(/close dialog/i);

// aria-labelledby
const input = screen.getByLabelText(/password/i);
```

### ByPlaceholderText Queries
```tsx
getByPlaceholderText(text: TextMatch, options?: MatcherOptions): HTMLElement
queryByPlaceholderText(text: TextMatch, options?: MatcherOptions): HTMLElement | null
findByPlaceholderText(text: TextMatch, options?: MatcherOptions): Promise<HTMLElement>
```

### ByText Queries
```tsx
getByText(text: TextMatch, options?: SelectorMatcherOptions): HTMLElement
queryByText(text: TextMatch, options?: SelectorMatcherOptions): HTMLElement | null
findByText(text: TextMatch, options?: SelectorMatcherOptions): Promise<HTMLElement>

interface SelectorMatcherOptions extends MatcherOptions {
  selector?: string;
  ignore?: string | boolean;
}
```

#### Examples
```tsx
// Exact text
const element = screen.getByText('Hello World');

// Partial text with regex
const element = screen.getByText(/hello/i);

// Custom selector
const element = screen.getByText('Submit', { selector: 'button' });
```

### ByDisplayValue Queries
```tsx
getByDisplayValue(value: TextMatch, options?: MatcherOptions): HTMLElement
queryByDisplayValue(value: TextMatch, options?: MatcherOptions): HTMLElement | null
findByDisplayValue(value: TextMatch, options?: MatcherOptions): Promise<HTMLElement>
```

### ByAltText Queries
```tsx
getByAltText(text: TextMatch, options?: MatcherOptions): HTMLElement
queryByAltText(text: TextMatch, options?: MatcherOptions): HTMLElement | null
findByAltText(text: TextMatch, options?: MatcherOptions): Promise<HTMLElement>
```

### ByTitle Queries
```tsx
getByTitle(title: TextMatch, options?: MatcherOptions): HTMLElement
queryByTitle(title: TextMatch, options?: MatcherOptions): HTMLElement | null
findByTitle(title: TextMatch, options?: MatcherOptions): Promise<HTMLElement>
```

### ByTestId Queries
```tsx
getByTestId(testId: TextMatch, options?: MatcherOptions): HTMLElement
queryByTestId(testId: TextMatch, options?: MatcherOptions): HTMLElement | null
findByTestId(testId: TextMatch, options?: MatcherOptions): Promise<HTMLElement>
```

## User Interactions

### fireEvent (Legacy)
```tsx
import { fireEvent } from '@testing-library/react';

// Mouse events
fireEvent.click(element);
fireEvent.dblClick(element);
fireEvent.mouseDown(element);
fireEvent.mouseUp(element);
fireEvent.mouseEnter(element);
fireEvent.mouseLeave(element);

// Keyboard events
fireEvent.keyDown(element, { key: 'Enter', code: 'Enter' });
fireEvent.keyUp(element, { key: 'Enter', code: 'Enter' });

// Form events
fireEvent.change(element, { target: { value: 'new value' } });
fireEvent.submit(element);

// Focus events
fireEvent.focus(element);
fireEvent.blur(element);
```

### userEvent (Recommended)
```tsx
import userEvent from '@testing-library/user-event';

// Setup user event
const user = userEvent.setup();

// Or use default
import { userEvent } from '@testing-library/user-event';
```

#### Clicking
```tsx
// Click element
await user.click(element);

// Double click
await user.dblClick(element);

// Right click
await user.click(element, { button: 2 });

// Click with modifiers
await user.click(element, { ctrlKey: true });
```

#### Typing
```tsx
// Type text
await user.type(input, 'Hello World');

// Clear and type
await user.clear(input);
await user.type(input, 'New text');

// Type with delay
await user.type(input, 'Slow typing', { delay: 100 });
```

#### Keyboard
```tsx
// Press single key
await user.keyboard('{Enter}');
await user.keyboard('{Escape}');
await user.keyboard('{Tab}');

// Press multiple keys
await user.keyboard('{Ctrl>}a{/Ctrl}'); // Ctrl+A

// Type characters
await user.keyboard('Hello World');
```

#### Form Interactions
```tsx
// Select option
await user.selectOptions(select, 'option-value');
await user.selectOptions(select, ['option1', 'option2']); // Multiple

// Upload file
const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
await user.upload(input, file);

// Check/uncheck
await user.check(checkbox);
await user.uncheck(checkbox);
```

#### Advanced Interactions
```tsx
// Hover
await user.hover(element);
await user.unhover(element);

// Tab navigation
await user.tab(); // Tab forward
await user.tab({ shift: true }); // Tab backward

// Copy/paste
await user.copy();
await user.paste();
```

## Async Testing

### waitFor
```tsx
import { waitFor } from '@testing-library/react';

function waitFor<T>(
  callback: () => T | Promise<T>,
  options?: waitForOptions
): Promise<T>

interface waitForOptions {
  container?: HTMLElement;
  timeout?: number; // default: 1000ms
  interval?: number; // default: 50ms
  onTimeout?: (error: Error) => Error;
  mutationObserverOptions?: MutationObserverInit;
}
```

#### Usage
```tsx
// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText('Loading complete')).toBeInTheDocument();
});

// Wait for element to disappear
await waitFor(() => {
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

// Custom timeout
await waitFor(
  () => {
    expect(screen.getByText('Slow operation')).toBeInTheDocument();
  },
  { timeout: 5000 }
);
```

### waitForElementToBeRemoved
```tsx
import { waitForElementToBeRemoved } from '@testing-library/react';

function waitForElementToBeRemoved<T>(
  callback: (() => T) | T,
  options?: waitForOptions
): Promise<void>
```

#### Usage
```tsx
// Wait for loading spinner to be removed
const loading = screen.getByText('Loading...');
await waitForElementToBeRemoved(loading);

// Wait for query result to be removed
await waitForElementToBeRemoved(
  () => screen.queryByText('Loading...')
);
```

### findBy Queries (Built-in Async)
```tsx
// These automatically wait for elements to appear
const element = await screen.findByText('Async content');
const button = await screen.findByRole('button', { name: /submit/i });

// With custom timeout
const element = await screen.findByText('Slow content', {}, { timeout: 5000 });
```

## React-Specific Testing Patterns

### Testing React Hook Form
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

function TestForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = vi.fn();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: 'Email is required' })} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}

test('validates form', async () => {
  const user = userEvent.setup();
  render(<TestForm />);

  // Submit without filling form
  await user.click(screen.getByRole('button', { name: /submit/i }));

  // Wait for validation error
  await waitFor(() => {
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });
});
```

### Testing State Updates with act()
```tsx
import { render, act } from '@testing-library/react';

test('updates state correctly', async () => {
  const { result } = renderHook(() => useCounter());

  // Wrap state updates in act()
  await act(async () => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});

test('handles async state updates', async () => {
  render(<AsyncComponent />);

  // Wait for async operations
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

### Testing Context Providers
```tsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './ThemeContext';

function renderWithTheme(ui: React.ReactElement, theme = 'light') {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
}

test('renders with theme', () => {
  renderWithTheme(<ThemedComponent />, 'dark');
  expect(screen.getByText('Dark theme active')).toBeInTheDocument();
});
```

## Component Mocking Patterns

### Mocking Child Components
```tsx
// Mock complex child component
vi.mock('./ComplexChild', () => ({
  default: ({ onAction, data }: any) => (
    <div data-testid="complex-child">
      <span>Mock Child: {data}</span>
      <button onClick={() => onAction('test')}>Action</button>
    </div>
  ),
}));
```

### Mocking External Libraries
```tsx
// Mock react-router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/test' }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

// Mock API calls
vi.mock('./api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mock data' })),
  postData: vi.fn(() => Promise.resolve({ success: true })),
}));
```

### Mocking Hooks
```tsx
// Mock custom hook
vi.mock('./useCustomHook', () => ({
  useCustomHook: () => ({
    data: 'mock data',
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));
```

## Common Testing Utilities

### Custom Render Function
```tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  queryClient?: QueryClient;
}

function customRender(
  ui: React.ReactElement,
  {
    initialEntries = ['/'],
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    }),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { userEvent } from '@testing-library/user-event';
```

### Test Utilities
```tsx
// Wait for loading to complete
export async function waitForLoadingToComplete() {
  await waitForElementToBeRemoved(
    () => screen.queryByTestId('loading-spinner'),
    { timeout: 5000 }
  );
}

// Fill form helper
export async function fillForm(fields: Record<string, string>) {
  const user = userEvent.setup();
  
  for (const [name, value] of Object.entries(fields)) {
    const field = screen.getByRole('textbox', { name: new RegExp(name, 'i') });
    await user.clear(field);
    await user.type(field, value);
  }
}

// Submit form helper
export async function submitForm() {
  const user = userEvent.setup();
  const submitButton = screen.getByRole('button', { name: /submit/i });
  await user.click(submitButton);
}
```

## Debugging

### Debug Methods
```tsx
import { screen } from '@testing-library/react';

// Print the DOM
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));

// Print with options
screen.debug(undefined, 20000); // Increase output limit

// Get accessible tree
console.log(prettyDOM(container, undefined, { highlight: false }));
```

### Loggers
```tsx
import { logRoles } from '@testing-library/dom';

// Log all available roles
logRoles(container);

// Log roles for specific element
logRoles(screen.getByTestId('form'));
```

### Common Debugging Patterns
```tsx
test('debug failing test', async () => {
  render(<MyComponent />);
  
  // Check what's actually rendered
  screen.debug();
  
  // Check if element exists (returns null if not found)
  console.log(screen.queryByText('Expected text'));
  
  // List all buttons
  const buttons = screen.getAllByRole('button');
  console.log('Available buttons:', buttons.map(b => b.textContent));
  
  // Check element attributes
  const input = screen.getByRole('textbox');
  console.log('Input attributes:', {
    value: input.getAttribute('value'),
    placeholder: input.getAttribute('placeholder'),
    name: input.getAttribute('name'),
  });
});
```

## Best Practices

### 1. Prefer Accessible Queries
```tsx
// ✅ Good - accessible
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email/i);

// ❌ Avoid - not accessible
screen.getByTestId('submit-button');
screen.getByClassName('btn-primary');
```

### 2. Use findBy for Async Content
```tsx
// ✅ Good - waits for element
const element = await screen.findByText('Async content');

// ❌ Avoid - might not be available yet
const element = screen.getByText('Async content');
```

### 3. Use userEvent Over fireEvent
```tsx
// ✅ Good - more realistic
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'text');

// ❌ Avoid - lower level
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'text' } });
```

### 4. Test Behavior, Not Implementation
```tsx
// ✅ Good - tests user behavior
test('submits form with valid data', async () => {
  const user = userEvent.setup();
  render(<ContactForm onSubmit={mockSubmit} />);
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(mockSubmit).toHaveBeenCalledWith({
    email: 'test@example.com'
  });
});

// ❌ Avoid - tests implementation details
test('calls setValue when input changes', () => {
  // Testing internal React Hook Form methods
});
```

### 5. Proper Async Testing
```tsx
// ✅ Good - properly waits
test('loads data', async () => {
  render(<DataComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded data')).toBeInTheDocument();
  });
});

// ❌ Avoid - doesn't wait
test('loads data', () => {
  render(<DataComponent />);
  expect(screen.getByText('Loaded data')).toBeInTheDocument(); // Might fail
});
```

---

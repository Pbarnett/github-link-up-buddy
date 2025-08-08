# Zustand API Reference

Zustand is a small, fast, and scalable state management solution. This document covers the core APIs and concepts of Zustand.

## Core API

### Create a Store
```typescript
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useStore = create<BearState>((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))
```

### Store Access
```typescript
function BearCounter() {
  const bears = useStore((state) => state.bears)
  return <h1>{bears} around here...</h1>
}
```

### Actions
```typescript
function Controls() {
  const increase = useStore((state) => state.increase)
  return <button onClick={() => increase(1)}>one up</button>
}
```

## Middleware

### Redux Devtools
```typescript
import { devtools } from 'zustand/middleware'

const useStore = create(devtools(store))
```

### Persist
```typescript
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      bears: 0,
    }),
    {
      name: 'bear-storage',
    }
  )
)
```

## Best Practices

### Typescript Usage
```typescript
interface State {
  bears: number
  increase: (by: number) => void
}

const useStore = create<State>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))
```

### Slices Pattern
```typescript
const createBearSlice = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  removeBear: () => set((state) => ({ bears: state.bears - 1 })),
})

const createFishSlice = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})

const useStore = create((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}))
```

## Advanced Features

### Transient Updates
```typescript
const useScratchStore = create(
  subscribeWithSelector((set) => ({
    scratches: 0,
    addScratches: () => set((state) => ({ scratches: state.scratches + 1 })),
  }))
)
```

### Async Actions
```typescript
const useStore = create((set) => ({
  fishies: {},
  fetch: async (pond) => {
    const response = await fetch(pond)
    set({ fishies: await response.json() })
  },
}))
```

### Computed Values
```typescript
const useStore = create((set) => ({
  todos: [],
  completedTodos: (state) => state.todos.filter((todo) => todo.completed),
}))
```

## Performance Optimization

### Selecting State
```typescript
// ❌ Subscribes to all state changes
const { bears, incrementBears } = useStore()

// ✅ Only subscribes to bears state changes
const bears = useStore((state) => state.bears)
const incrementBears = useStore((state) => state.incrementBears)
```

### Shallow Equality
```typescript
import { shallow } from 'zustand/shallow'

// Only re-renders if either value changes
const { bears, fishes } = useStore(
  (state) => ({ bears: state.bears, fishes: state.fishes }),
  shallow
)
```

## Integration with React

### Context Support
```typescript
import { createContext, useContext } from 'zustand/context'

const { Provider, useStore } = createContext()

function App() {
  return (
    <Provider createStore={() => create(store)}>
      <Component />
    </Provider>
  )
}
```

### Usage with React.memo
```typescript
const Counter = React.memo(() => {
  const count = useStore((state) => state.count)
  return <div>{count}</div>
})
```

## Error Handling

### Common Issues and Solutions

1. **State Not Updating**
```typescript
// ❌ Wrong
set({ count: state.count++ })

// ✅ Correct
set((state) => ({ count: state.count + 1 }))
```

2. **Async State Updates**
```typescript
// ❌ Wrong
set(async (state) => ({ data: await fetchData() }))

// ✅ Correct
const response = await fetchData()
set({ data: response })
```

## Development Tools

### Redux DevTools Integration
```typescript
import { devtools } from 'zustand/middleware'

const useStore = create(devtools(store, {
  name: 'BearStore',
  enabled: process.env.NODE_ENV === 'development'
}))
```

### Logging Middleware
```typescript
const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log('applying', args)
      set(...args)
      console.log('new state', get())
    },
    get,
    api
  )

const useStore = create(log(store))
```

## Migration from Other State Management

### From Redux
```typescript
// Redux
const store = createStore(reducer)
const { dispatch, getState, subscribe } = store

// Zustand
const useStore = create(store)
const { setState, getState, subscribe } = useStore
```

### From Context
```typescript
// Context
const Context = createContext(null)
const useValue = () => useContext(Context)

// Zustand
const useStore = create(store)
```

## Testing

### Unit Testing
```typescript
import { createStore } from 'zustand'

const useStore = createStore((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
}))

test('increases bears', () => {
  const store = useStore.getState()
  store.increase()
  expect(store.bears).toBe(1)
})
```

### Integration Testing
```typescript
import { renderHook, act } from '@testing-library/react'

test('uses zustand store', () => {
  const { result } = renderHook(() => useStore())
  
  act(() => {
    result.current.increase()
  })
  
  expect(result.current.bears).toBe(1)
})
```

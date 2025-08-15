import { act } from '@testing-library/react'

export async function actAsync<T>(fn: () => Promise<T> | T): Promise<T> {
  let result!: T
  await act(async () => {
    result = await fn()
  })
  return result
}

export async function flushMicrotasks(): Promise<void> {
  await act(async () => {
    await Promise.resolve()
  })
}

// Run a function (typically rendering a hook/component) inside React act and return its result
export async function renderHookAct<R>(fn: () => R): Promise<R> {
  let result!: R
  await act(async () => {
    result = fn()
    await Promise.resolve()
  })
  return result
}


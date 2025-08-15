import React from 'react'
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom'

// Test-only router provider that enables React Router v7 future flags.
// This lets us proactively validate behavior while keeping app code unchanged.
export function V7TestRouter({ children, ...props }: MemoryRouterProps) {
  return (
    <MemoryRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
      {...props}
    >
      {children}
    </MemoryRouter>
  )
}


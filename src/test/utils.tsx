import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { ToastProvider } from '@/components/ui'

/** Fresh QueryClient per render so tests never share cache. */
function makeClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
}

interface Options extends Omit<RenderOptions, 'wrapper'> {
  route?: string
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', ...options }: Options = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={makeClient()}>
        <MemoryRouter initialEntries={[route]}>
          <ToastProvider>{children}</ToastProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }
  return render(ui, { wrapper: Wrapper, ...options })
}

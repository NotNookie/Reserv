import { QueryClient } from '@tanstack/react-query'

/**
 * Shared React Query client. Defaults tuned for a mock/in-memory data layer:
 * data is cheap to refetch but stable within a session, so we keep a modest
 * stale time and avoid noisy refetches on window focus.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

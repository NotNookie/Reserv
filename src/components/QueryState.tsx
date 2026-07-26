import type { ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { Button, EmptyState, Spinner } from '@/components/ui'

export interface QueryStateProps<T> {
  query: UseQueryResult<T>
  children: (data: T) => ReactNode
  /** Predicate marking a successful-but-empty result. */
  isEmpty?: (data: T) => boolean
  empty?: ReactNode
  loadingLabel?: string
  errorTitle?: string
}

/**
 * Standardizes the loading / error / empty / ready states for a React Query
 * result so every async view handles all four consistently.
 */
export function QueryState<T>({
  query,
  children,
  isEmpty,
  empty,
  loadingLabel = 'Loading…',
  errorTitle = 'Unable to load data',
}: QueryStateProps<T>) {
  if (query.isPending) {
    return (
      <div
        className="flex items-center justify-center gap-2 py-16 text-muted-foreground"
        role="status"
      >
        <Spinner />
        <span className="text-sm">{loadingLabel}</span>
      </div>
    )
  }

  if (query.isError) {
    return (
      <EmptyState
        icon="error"
        title={errorTitle}
        description={
          query.error instanceof Error
            ? query.error.message
            : 'Something went wrong.'
        }
        action={
          <Button icon="refresh" onClick={() => void query.refetch()}>
            Retry
          </Button>
        }
      />
    )
  }

  const data = query.data
  if (isEmpty && isEmpty(data) && empty) return <>{empty}</>

  return <>{children(data)}</>
}

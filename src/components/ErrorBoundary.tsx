import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * App-level error boundary. Catches render/runtime errors in the subtree and
 * shows a recoverable fallback instead of a blank screen.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // In a real app this would report to an error-tracking service.
    console.error('Uncaught error:', error, info.componentStack)
  }

  reset = (): void => {
    this.setState({ error: null })
  }

  override render(): ReactNode {
    const { error } = this.state
    if (error) {
      if (this.props.fallback) return this.props.fallback(error, this.reset)
      return (
        <div
          role="alert"
          className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center"
        >
          <span className="material-symbols-outlined text-4xl text-status-cancelled">
            error
          </span>
          <h1 className="text-lg font-semibold text-foreground">
            Something went wrong
          </h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            {error.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

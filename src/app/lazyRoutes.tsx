import { lazy, Suspense } from 'react'
import { Spinner } from '@/components/ui'

// Code-split the charts-heavy Analytics route so recharts stays out of the
// main bundle and only loads when the route is visited.
const AnalyticsPage = lazy(() =>
  import('@/features/analytics/AnalyticsPage').then((m) => ({
    default: m.AnalyticsPage,
  })),
)

function RouteFallback() {
  return (
    <div className="flex justify-center py-16 text-muted-foreground">
      <Spinner />
    </div>
  )
}

export function AnalyticsRoute() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <AnalyticsPage />
    </Suspense>
  )
}

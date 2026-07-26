import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <Icon name="explore_off" className="text-4xl text-subtle-foreground" />
      <h2 className="text-lg font-semibold text-foreground">Page not found</h2>
      <p className="max-w-sm text-[13px] text-muted-foreground">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        <Icon name="arrow_back" className="text-[18px]" />
        Back to dashboard
      </Link>
    </div>
  )
}

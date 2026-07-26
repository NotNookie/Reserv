import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

export interface EmptyStateProps {
  icon?: string
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}

/** Centered placeholder for empty lists and unbuilt areas. */
export function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface px-6 py-14 text-center',
        className,
      )}
    >
      <Icon name={icon} className="text-3xl text-subtle-foreground" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && (
        <p className="max-w-sm text-[13px] text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

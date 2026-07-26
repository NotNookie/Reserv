import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

export interface StatCardProps {
  label: string
  value: ReactNode
  /** Secondary line under the value. */
  hint?: ReactNode
  /** Material Symbols icon shown in the corner. */
  icon?: string
  /** Directional trend, colours the hint. */
  trend?: 'up' | 'down' | 'flat'
  className?: string
}

const trendClasses: Record<NonNullable<StatCardProps['trend']>, string> = {
  up: 'text-status-confirmed',
  down: 'text-status-cancelled',
  flat: 'text-muted-foreground',
}

/** Compact summary tile for high-level metrics. */
export function StatCard({
  label,
  value,
  hint,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface p-4',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        {icon && (
          <Icon name={icon} className="text-[18px] text-subtle-foreground" />
        )}
      </div>
      <p className="mt-1.5 text-[22px] leading-tight font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {hint && (
        <p
          className={cn(
            'mt-1 text-[11px]',
            trend ? trendClasses[trend] : 'text-subtle-foreground',
          )}
        >
          {hint}
        </p>
      )}
    </div>
  )
}

import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type BadgeTone =
  'confirmed' | 'pending' | 'cancelled' | 'info' | 'neutral' | 'blue' | 'purple'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

const tones: Record<BadgeTone, string> = {
  confirmed: 'bg-status-confirmed-surface text-status-confirmed',
  pending: 'bg-status-pending-surface text-status-pending',
  cancelled: 'bg-status-cancelled-surface text-status-cancelled',
  info: 'bg-status-info-surface text-status-info',
  neutral: 'bg-status-neutral-surface text-status-neutral',
  blue: 'bg-accent-blue-surface text-accent-blue',
  purple: 'bg-accent-purple-surface text-accent-purple',
}

/** Pill-shaped status badge. */
export function Badge({
  tone = 'neutral',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

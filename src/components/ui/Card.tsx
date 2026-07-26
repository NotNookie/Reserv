import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type CardProps = HTMLAttributes<HTMLDivElement>

/** Surface container with hairline border and large radius. */
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-xl border border-border bg-surface', className)}
      {...props}
    />
  )
}

export interface CardHeaderProps {
  title: ReactNode
  action?: ReactNode
  className?: string
}

/** Uppercase section header used at the top of a Card. */
export function CardHeader({ title, action, className }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-border px-5 py-3.5',
        className,
      )}
    >
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      {action}
    </div>
  )
}

/** Padded body region for a Card. */
export function CardBody({ className, ...props }: CardProps) {
  return <div className={cn('p-5', className)} {...props} />
}

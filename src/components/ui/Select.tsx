import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { fieldBase } from './fieldStyles'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, invalid, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          fieldBase,
          'appearance-none pr-8',
          invalid ? 'border-status-cancelled' : 'border-border-strong',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    )
  },
)

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { fieldBase } from './fieldStyles'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        fieldBase,
        invalid ? 'border-status-cancelled' : 'border-border-strong',
        className,
      )}
      {...props}
    />
  )
})

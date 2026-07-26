import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'
import { Spinner } from './Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Material Symbols icon name rendered before the label. */
  icon?: string
  /** Show a spinner and disable the button. */
  loading?: boolean
}

const base =
  'inline-flex items-center justify-center gap-1.5 rounded-md font-medium ' +
  'transition-colors select-none whitespace-nowrap ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ' +
  'disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover border border-primary',
  secondary:
    'bg-surface text-foreground border border-border-strong hover:bg-surface-muted',
  ghost: 'bg-transparent text-foreground hover:bg-surface-muted',
  danger:
    'bg-status-cancelled-surface text-status-cancelled border border-status-cancelled/30 hover:bg-status-cancelled/15',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-2.5 text-xs',
  md: 'h-9 px-3.5 text-[13px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'secondary',
      size = 'md',
      icon,
      loading = false,
      disabled,
      className,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <Spinner className="size-3.5" />
        ) : icon ? (
          <Icon name={icon} className="text-[18px]" />
        ) : null}
        {children}
      </button>
    )
  },
)

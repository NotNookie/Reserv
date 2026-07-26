import { cn } from '@/lib/cn'

export interface IconProps {
  /** Material Symbols Outlined ligature name, e.g. "calendar_month". */
  name: string
  className?: string
  /** Render the filled variant. */
  filled?: boolean
  /** Accessible label. Omit for purely decorative icons. */
  label?: string
}

/**
 * Thin wrapper around the Material Symbols Outlined icon font.
 * Decorative by default (aria-hidden); pass `label` to expose it to a11y.
 */
export function Icon({ name, className, filled = false, label }: IconProps) {
  return (
    <span
      className={cn('material-symbols-outlined select-none', className)}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      {name}
    </span>
  )
}

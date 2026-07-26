import { cn } from '@/lib/cn'
import { getInitials } from '@/lib/format'
import { getAvatarColor } from '@/lib/avatar'

export interface AvatarProps {
  name: string
  size?: 'sm' | 'md'
  className?: string
}

/** Circular initials avatar with a deterministic colour. */
export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        size === 'sm' ? 'size-7 text-[11px]' : 'size-9 text-xs',
        getAvatarColor(name),
        className,
      )}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  )
}

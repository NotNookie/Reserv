import type { BookingStatus } from '@/data/types'

/**
 * Chart colors are CSS variables so they follow the active light/dark theme
 * automatically (SVG `fill`/`stroke` accept `var(--token)`).
 */
export const chartColors = {
  primary: 'var(--primary)',
  grid: 'var(--border)',
  axis: 'var(--muted-foreground)',
}

/** Booking status → reserved status-palette color (matches the badges). */
export const STATUS_FILL: Record<BookingStatus, string> = {
  pending: 'var(--status-pending)',
  confirmed: 'var(--status-confirmed)',
  arrived: 'var(--status-info)',
  completed: 'var(--accent-blue)',
  cancelled: 'var(--status-cancelled)',
  no_show: 'var(--status-neutral)',
}

/** Shared axis tick style. */
export const axisTick = { fill: 'var(--muted-foreground)', fontSize: 11 }

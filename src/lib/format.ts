/**
 * Formatting helpers shared across features. Kept dependency-free and
 * locale-aware via the Intl APIs.
 */

const DEFAULT_LOCALE = 'en-US'

const currencyFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
  style: 'currency',
  currency: 'USD',
})

const dateFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  hour: 'numeric',
  minute: '2-digit',
})

function toDate(value: Date | string | number): Date {
  return value instanceof Date ? value : new Date(value)
}

/** Format a monetary amount (in whole currency units) as USD. */
export function formatMoney(amount: number): string {
  return currencyFormatter.format(amount)
}

/** Format a date as e.g. "Jul 26, 2026". */
export function formatDate(value: Date | string | number): string {
  return dateFormatter.format(toDate(value))
}

/** Format a time as e.g. "9:30 AM". */
export function formatTime(value: Date | string | number): string {
  return timeFormatter.format(toDate(value))
}

/** Format a start/end range as e.g. "9:30 AM – 10:15 AM". */
export function formatTimeRange(
  start: Date | string | number,
  end: Date | string | number,
): string {
  return `${formatTime(start)} – ${formatTime(end)}`
}

/** Derive up-to-two-letter initials from a person's name. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase()
  return (
    parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)
  ).toUpperCase()
}

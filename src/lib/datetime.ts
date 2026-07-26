/** Helpers for converting between ISO strings and <input type="datetime-local">. */

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** ISO string -> "YYYY-MM-DDTHH:mm" in the user's local timezone. */
export function toLocalInputValue(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`
}

/** "YYYY-MM-DDTHH:mm" (local) -> ISO string. */
export function fromLocalInputValue(value: string): string {
  return new Date(value).toISOString()
}

export function addMinutes(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString()
}

/** Whole-hour start/end of a given day (local), returned as ISO. */
export function dayBounds(date: Date): { from: string; to: string } {
  const from = new Date(date)
  from.setHours(0, 0, 0, 0)
  const to = new Date(from)
  to.setDate(to.getDate() + 1)
  return { from: from.toISOString(), to: to.toISOString() }
}

/** Minutes since local midnight for an ISO time. */
export function minutesIntoDay(iso: string): number {
  const d = new Date(iso)
  return d.getHours() * 60 + d.getMinutes()
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

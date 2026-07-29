import { useNavigate } from 'react-router-dom'
import { EmptyState } from '@/components/ui'
import type { BookingWithRelations } from '@/data/types'
import { formatDate, formatTime } from '@/lib/format'
import { BookingStatusBadge } from './BookingStatusBadge'

export interface BookingHistoryListProps {
  bookings: BookingWithRelations[]
  /** What each row's secondary line shows. */
  secondary?: (booking: BookingWithRelations) => string
  emptyLabel?: string
}

/** Compact, clickable list of bookings shared by customer and staff detail. */
export function BookingHistoryList({
  bookings,
  secondary = (b) => b.service.name,
  emptyLabel = 'No bookings yet.',
}: BookingHistoryListProps) {
  const navigate = useNavigate()

  if (bookings.length === 0) {
    return (
      <EmptyState className="border-0" icon="event_busy" title={emptyLabel} />
    )
  }

  return (
    <ul className="divide-y divide-border">
      {bookings.map((b) => (
        <li key={b.id}>
          <button
            type="button"
            onClick={() => navigate(`/bookings/${b.id}`)}
            className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-surface-muted"
          >
            <span className="w-24 shrink-0">
              <span className="block text-[13px] font-medium text-foreground">
                {formatDate(b.startAt)}
              </span>
              <span className="block font-mono text-[11px] text-muted-foreground">
                {formatTime(b.startAt)}
              </span>
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">
              {secondary(b)}
            </span>
            <BookingStatusBadge status={b.status} />
          </button>
        </li>
      ))}
    </ul>
  )
}

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { QueryState } from '@/components/QueryState'
import { Button, Card, Icon } from '@/components/ui'
import { useBookings, useResources } from '@/data/hooks'
import type {
  BookingStatus,
  BookingWithRelations,
  Resource,
} from '@/data/types'
import {
  dayBounds,
  formatDayLabel,
  isSameLocalDay,
  minutesIntoDay,
} from '@/lib/datetime'
import { formatTime } from '@/lib/format'
import { BookingFormModal } from '@/features/bookings/components/BookingFormModal'

const BUSINESS_START = 8 * 60 // 08:00
const BUSINESS_END = 20 * 60 // 20:00
const HOUR_PX = 56
const PX_PER_MIN = HOUR_PX / 60
const HOURS = Array.from(
  { length: (BUSINESS_END - BUSINESS_START) / 60 + 1 },
  (_, i) => BUSINESS_START / 60 + i,
)

const STATUS_BLOCK: Record<BookingStatus, string> = {
  pending:
    'bg-status-pending-surface text-status-pending border-status-pending/30',
  confirmed:
    'bg-status-confirmed-surface text-status-confirmed border-status-confirmed/30',
  arrived: 'bg-status-info-surface text-status-info border-status-info/30',
  completed: 'bg-accent-blue-surface text-accent-blue border-accent-blue/30',
  cancelled:
    'bg-status-cancelled-surface text-status-cancelled border-status-cancelled/30 opacity-60 line-through',
  no_show:
    'bg-status-neutral-surface text-status-neutral border-status-neutral/30 opacity-60',
}

function BookingBlock({
  booking,
  resourceId,
  onOpen,
}: {
  booking: BookingWithRelations
  resourceId: string
  onOpen: (id: string) => void
}) {
  const startMin = minutesIntoDay(booking.startAt)
  const endMin = minutesIntoDay(booking.endAt)
  const top = (startMin - BUSINESS_START) * PX_PER_MIN
  const height = Math.max((endMin - startMin) * PX_PER_MIN, 18)

  return (
    <button
      type="button"
      onClick={() => onOpen(booking.id)}
      style={{ top, height }}
      className={`absolute inset-x-1 overflow-hidden rounded-md border px-2 py-1 text-left ${STATUS_BLOCK[booking.status]}`}
      title={`${booking.customer.name} · ${booking.service.name}`}
      data-resource={resourceId}
    >
      <span className="block truncate text-[11px] font-semibold">
        {formatTime(booking.startAt)} {booking.customer.name}
      </span>
      <span className="block truncate text-[11px] opacity-80">
        {booking.service.name}
      </span>
    </button>
  )
}

function DayGrid({
  resources,
  bookings,
  onOpenBooking,
}: {
  resources: Resource[]
  bookings: BookingWithRelations[]
  onOpenBooking: (id: string) => void
}) {
  const gridHeight = (BUSINESS_END - BUSINESS_START) * PX_PER_MIN

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max">
        {/* Time gutter */}
        <div className="w-14 shrink-0 pt-8">
          {HOURS.map((h) => (
            <div
              key={h}
              style={{ height: HOUR_PX }}
              className="relative -top-2 pr-2 text-right font-mono text-[10px] text-subtle-foreground"
            >
              {formatTime(new Date(2000, 0, 1, h).toISOString())}
            </div>
          ))}
        </div>

        {/* Resource columns */}
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="w-40 shrink-0 border-l border-border"
          >
            <div className="flex h-8 items-center justify-center border-b border-border bg-surface-muted text-[11px] font-semibold text-muted-foreground">
              {resource.name}
            </div>
            <div className="relative" style={{ height: gridHeight }}>
              {HOURS.slice(0, -1).map((h, i) => (
                <div
                  key={h}
                  style={{ top: i * HOUR_PX, height: HOUR_PX }}
                  className="absolute inset-x-0 border-b border-border/60"
                />
              ))}
              {bookings
                .filter((b) => b.resourceIds.includes(resource.id))
                .map((b) => (
                  <BookingBlock
                    key={b.id}
                    booking={b}
                    resourceId={resource.id}
                    onOpen={onOpenBooking}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CalendarPage() {
  const navigate = useNavigate()
  const [date, setDate] = useState(() => new Date())
  const [creating, setCreating] = useState(false)
  const bounds = useMemo(() => dayBounds(date), [date])
  const bookings = useBookings({ from: bounds.from, to: bounds.to })
  const resources = useResources()

  function shiftDay(delta: number) {
    setDate((prev) => {
      const next = new Date(prev)
      next.setDate(next.getDate() + delta)
      return next
    })
  }

  const isToday = isSameLocalDay(date, new Date())

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Day schedule across resources."
        actions={
          <Button
            variant="primary"
            icon="add"
            onClick={() => setCreating(true)}
          >
            New booking
          </Button>
        }
      />

      <Card className="mb-4 flex flex-wrap items-center justify-between gap-2 p-3">
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            icon="chevron_left"
            aria-label="Previous day"
            onClick={() => shiftDay(-1)}
          />
          <Button
            size="sm"
            variant={isToday ? 'primary' : 'secondary'}
            onClick={() => setDate(new Date())}
          >
            Today
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon="chevron_right"
            aria-label="Next day"
            onClick={() => shiftDay(1)}
          />
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Icon
            name="calendar_today"
            className="text-[18px] text-muted-foreground"
          />
          {formatDayLabel(date)}
        </div>
      </Card>

      <Card className="p-2">
        <QueryState query={bookings} loadingLabel="Loading schedule…">
          {(rows) => (
            <QueryState query={resources} loadingLabel="Loading resources…">
              {(res) => (
                <DayGrid
                  resources={res}
                  bookings={rows.filter((b) => b.status !== 'cancelled')}
                  onOpenBooking={(id) => navigate(`/bookings/${id}`)}
                />
              )}
            </QueryState>
          )}
        </QueryState>
      </Card>

      {creating && (
        <BookingFormModal
          open
          initialStart={bounds.from}
          onClose={() => setCreating(false)}
        />
      )}
    </>
  )
}

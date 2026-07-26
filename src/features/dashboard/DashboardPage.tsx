import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { QueryState } from '@/components/QueryState'
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  StatCard,
} from '@/components/ui'
import { useBookings, useResources } from '@/data/hooks'
import type { BookingWithRelations } from '@/data/types'
import { dayBounds } from '@/lib/datetime'
import { formatMoney, formatTime } from '@/lib/format'
import { BookingStatusBadge } from '@/features/bookings/components/BookingStatusBadge'
import { BookingFormModal } from '@/features/bookings/components/BookingFormModal'

function computeStats(rows: BookingWithRelations[]) {
  return {
    total: rows.length,
    confirmed: rows.filter((b) => b.status === 'confirmed').length,
    arrived: rows.filter((b) => b.status === 'arrived').length,
    revenue: rows
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + b.service.price, 0),
  }
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const today = useMemo(() => dayBounds(new Date()), [])
  const bookings = useBookings({ from: today.from, to: today.to })
  const resources = useResources()

  const availableCount =
    resources.data?.filter((r) => r.status === 'available').length ?? 0

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Today's overview at a glance."
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

      <QueryState query={bookings} loadingLabel="Loading today's schedule…">
        {(rows) => {
          const stats = computeStats(rows)
          return (
            <>
              <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard
                  label="Today's bookings"
                  value={stats.total}
                  icon="event"
                />
                <StatCard
                  label="Confirmed"
                  value={stats.confirmed}
                  icon="check_circle"
                />
                <StatCard
                  label="Checked in"
                  value={stats.arrived}
                  icon="login"
                />
                <StatCard
                  label="Available resources"
                  value={availableCount}
                  hint={formatMoney(stats.revenue) + ' completed today'}
                  icon="meeting_room"
                />
              </div>

              <Card>
                <CardHeader
                  title="Today's schedule"
                  action={
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="calendar_month"
                      onClick={() => navigate('/calendar')}
                    >
                      Calendar
                    </Button>
                  }
                />
                <CardBody className="p-0">
                  {rows.length === 0 ? (
                    <EmptyState
                      className="border-0"
                      icon="event_available"
                      title="Nothing scheduled today"
                      description="Create a booking to fill the schedule."
                    />
                  ) : (
                    <ul className="divide-y divide-border">
                      {rows.map((b) => (
                        <li key={b.id}>
                          <button
                            type="button"
                            onClick={() => navigate(`/bookings/${b.id}`)}
                            className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-surface-muted"
                          >
                            <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
                              {formatTime(b.startAt)}
                            </span>
                            <Avatar name={b.customer.name} size="sm" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-medium text-foreground">
                                {b.customer.name}
                              </span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {b.service.name}
                                {b.staff ? ` · ${b.staff.name}` : ''}
                              </span>
                            </span>
                            <BookingStatusBadge status={b.status} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardBody>
              </Card>
            </>
          )
        }}
      </QueryState>

      {creating && <BookingFormModal open onClose={() => setCreating(false)} />}
    </>
  )
}

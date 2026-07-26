import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { QueryState } from '@/components/QueryState'
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  useToast,
} from '@/components/ui'
import { useBooking, useSetBookingStatus } from '@/data/hooks'
import type { BookingStatus, BookingWithRelations } from '@/data/types'
import {
  formatDate,
  formatMoney,
  formatTime,
  formatTimeRange,
} from '@/lib/format'
import { BookingStatusBadge } from './components/BookingStatusBadge'
import { BookingFormModal } from './components/BookingFormModal'

/** Contextual next-status actions for the lifecycle. */
const NEXT_ACTIONS: Partial<
  Record<
    BookingStatus,
    Array<{ label: string; to: BookingStatus; icon: string }>
  >
> = {
  pending: [
    { label: 'Confirm', to: 'confirmed', icon: 'check' },
    { label: 'Cancel', to: 'cancelled', icon: 'close' },
  ],
  confirmed: [
    { label: 'Check in', to: 'arrived', icon: 'login' },
    { label: 'Mark no-show', to: 'no_show', icon: 'person_off' },
    { label: 'Cancel', to: 'cancelled', icon: 'close' },
  ],
  arrived: [{ label: 'Complete', to: 'completed', icon: 'task_alt' }],
}

function InfoRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right text-[13px] font-medium text-foreground">
        {children}
      </span>
    </div>
  )
}

function BookingDetail({ booking }: { booking: BookingWithRelations }) {
  const { show } = useToast()
  const setStatus = useSetBookingStatus()
  const [editing, setEditing] = useState(false)
  const actions = NEXT_ACTIONS[booking.status] ?? []

  async function changeStatus(status: BookingStatus) {
    try {
      await setStatus.mutateAsync({ id: booking.id, status })
      show({ tone: 'success', title: 'Status updated' })
    } catch (error) {
      show({
        tone: 'error',
        title: 'Could not update status',
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <>
      <PageHeader
        title="Booking detail"
        actions={
          <Button icon="edit" onClick={() => setEditing(true)}>
            Edit
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <CardHeader
              title="Reservation"
              action={<BookingStatusBadge status={booking.status} />}
            />
            <CardBody>
              <div className="mb-4 flex items-center gap-3">
                <Avatar name={booking.customer.name} />
                <div>
                  <Link
                    to={`/customers/${booking.customer.id}`}
                    className="font-semibold text-foreground hover:text-primary"
                  >
                    {booking.customer.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {booking.customer.email}
                  </p>
                </div>
              </div>
              <div className="divide-y divide-border">
                <InfoRow label="Service">{booking.service.name}</InfoRow>
                <InfoRow label="Date">{formatDate(booking.startAt)}</InfoRow>
                <InfoRow label="Time">
                  {formatTimeRange(booking.startAt, booking.endAt)}
                </InfoRow>
                <InfoRow label="Staff">{booking.staff?.name ?? '—'}</InfoRow>
                <InfoRow label="Resource">
                  {booking.resources.map((r) => r.name).join(', ') || '—'}
                </InfoRow>
                <InfoRow label="Price">
                  {formatMoney(booking.service.price)}
                </InfoRow>
                {booking.notes && (
                  <InfoRow label="Notes">{booking.notes}</InfoRow>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Actions" />
            <CardBody className="flex flex-col gap-2">
              {actions.length === 0 && (
                <p className="text-[13px] text-muted-foreground">
                  No further actions for a {booking.status.replace('_', '-')}{' '}
                  booking.
                </p>
              )}
              {actions.map((action) => (
                <Button
                  key={action.to}
                  icon={action.icon}
                  variant={action.to === 'cancelled' ? 'danger' : 'secondary'}
                  loading={setStatus.isPending}
                  className="justify-start"
                  onClick={() => void changeStatus(action.to)}
                >
                  {action.label}
                </Button>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Occupancy" />
            <CardBody className="divide-y divide-border">
              <InfoRow label="Checked in">
                {booking.checkInAt ? (
                  formatTime(booking.checkInAt)
                ) : (
                  <span className="text-muted-foreground">Not yet</span>
                )}
              </InfoRow>
              <InfoRow label="Checked out">
                {booking.checkOutAt ? (
                  formatTime(booking.checkOutAt)
                ) : (
                  <span className="text-muted-foreground">Not yet</span>
                )}
              </InfoRow>
            </CardBody>
          </Card>
        </div>
      </div>

      {editing && (
        <BookingFormModal
          open
          booking={booking}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  )
}

export function BookingDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const query = useBooking(id)

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/bookings')}
        className="mb-3 inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icon name="arrow_back" className="text-[18px]" />
        Back to bookings
      </button>
      <QueryState
        query={query}
        isEmpty={(data) => data == null}
        empty={
          <p className="text-sm text-muted-foreground">Booking not found.</p>
        }
      >
        {(booking) => (booking ? <BookingDetail booking={booking} /> : null)}
      </QueryState>
    </>
  )
}

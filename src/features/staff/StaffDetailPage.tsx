import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { QueryState } from '@/components/QueryState'
import {
  Avatar,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Icon,
  StatCard,
} from '@/components/ui'
import { useBookings, useStaffMember } from '@/data/hooks'
import type { Staff } from '@/data/types'
import { BookingHistoryList } from '@/features/bookings/components/BookingHistoryList'

function ContactRow({
  icon,
  children,
}: {
  icon: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
      <Icon name={icon} className="text-[18px] text-subtle-foreground" />
      {children}
    </div>
  )
}

function StaffDetail({ member }: { member: Staff }) {
  const bookings = useBookings({ staffId: member.id })
  const rows = bookings.data ?? []
  const [now] = useState(() => Date.now())
  const upcoming = rows.filter(
    (b) =>
      new Date(b.startAt).getTime() >= now &&
      b.status !== 'cancelled' &&
      b.status !== 'no_show',
  )
  const completed = rows.filter((b) => b.status === 'completed').length

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4">
        <Card>
          <CardBody className="flex flex-col items-center gap-3 text-center">
            <Avatar name={member.name} className="size-16 text-lg" />
            <div>
              <p className="text-base font-semibold text-foreground">
                {member.name}
              </p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
            {member.active ? (
              <Badge tone="confirmed">Active</Badge>
            ) : (
              <Badge tone="neutral">Inactive</Badge>
            )}
            <div className="flex w-full flex-col gap-2 border-t border-border pt-3">
              <ContactRow icon="mail">{member.email}</ContactRow>
              <ContactRow icon="call">{member.phone}</ContactRow>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col gap-4 lg:col-span-2">
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Total" value={rows.length} icon="event" />
          <StatCard label="Upcoming" value={upcoming.length} icon="upcoming" />
          <StatCard label="Completed" value={completed} icon="task_alt" />
        </div>
        <Card>
          <CardHeader title="Assigned bookings" />
          <CardBody className="p-0">
            <QueryState query={bookings} loadingLabel="Loading bookings…">
              {(list) => (
                <BookingHistoryList
                  bookings={[...list].reverse()}
                  secondary={(b) => `${b.customer.name} · ${b.service.name}`}
                  emptyLabel="No bookings assigned to this staff member."
                />
              )}
            </QueryState>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export function StaffDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const query = useStaffMember(id)

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/staff')}
        className="mb-3 inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icon name="arrow_back" className="text-[18px]" />
        Back to staff
      </button>
      <PageHeader title="Staff profile" />
      <QueryState
        query={query}
        isEmpty={(data) => data == null}
        empty={
          <p className="text-sm text-muted-foreground">
            Staff member not found.
          </p>
        }
      >
        {(member) => (member ? <StaffDetail member={member} /> : null)}
      </QueryState>
    </>
  )
}

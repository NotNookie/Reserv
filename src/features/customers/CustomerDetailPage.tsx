import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { QueryState } from '@/components/QueryState'
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Icon,
  StatCard,
} from '@/components/ui'
import { useBookings, useCustomer } from '@/data/hooks'
import type { Customer } from '@/data/types'
import { formatDate } from '@/lib/format'
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

function CustomerDetail({ customer }: { customer: Customer }) {
  const bookings = useBookings({ customerId: customer.id })
  const rows = bookings.data ?? []
  const [now] = useState(() => Date.now())
  const upcoming = rows.filter(
    (b) =>
      new Date(b.startAt).getTime() >= now &&
      b.status !== 'cancelled' &&
      b.status !== 'no_show',
  ).length

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4">
        <Card>
          <CardBody className="flex flex-col items-center gap-3 text-center">
            <Avatar name={customer.name} className="size-16 text-lg" />
            <div>
              <p className="text-base font-semibold text-foreground">
                {customer.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Member since {formatDate(customer.createdAt)}
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 border-t border-border pt-3">
              <ContactRow icon="mail">{customer.email}</ContactRow>
              <ContactRow icon="call">{customer.phone}</ContactRow>
            </div>
          </CardBody>
        </Card>

        {customer.notes && (
          <Card>
            <CardHeader title="Notes" />
            <CardBody className="text-[13px] text-muted-foreground">
              {customer.notes}
            </CardBody>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:col-span-2">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total bookings" value={rows.length} icon="event" />
          <StatCard label="Upcoming" value={upcoming} icon="upcoming" />
        </div>
        <Card>
          <CardHeader title="Booking history" />
          <CardBody className="p-0">
            <QueryState query={bookings} loadingLabel="Loading history…">
              {(list) => (
                <BookingHistoryList
                  bookings={[...list].reverse()}
                  secondary={(b) =>
                    `${b.service.name}${b.staff ? ` · ${b.staff.name}` : ''}`
                  }
                  emptyLabel="No bookings for this customer yet."
                />
              )}
            </QueryState>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export function CustomerDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const query = useCustomer(id)

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/customers')}
        className="mb-3 inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icon name="arrow_back" className="text-[18px]" />
        Back to customers
      </button>
      <PageHeader title="Customer" />
      <QueryState
        query={query}
        isEmpty={(data) => data == null}
        empty={
          <p className="text-sm text-muted-foreground">Customer not found.</p>
        }
      >
        {(customer) =>
          customer ? <CustomerDetail customer={customer} /> : null
        }
      </QueryState>
    </>
  )
}

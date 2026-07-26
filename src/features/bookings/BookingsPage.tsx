import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { QueryState } from '@/components/QueryState'
import {
  Avatar,
  Button,
  Card,
  EmptyState,
  Input,
  Select,
  Table,
  TableContainer,
  Td,
  Th,
  Tr,
} from '@/components/ui'
import { useBookings, useResources, useStaff } from '@/data/hooks'
import type { BookingFilters } from '@/data/services'
import { BOOKING_STATUSES, type BookingStatus } from '@/data/types'
import { BOOKING_STATUS_META } from '@/data/status'
import { formatDate, formatTimeRange } from '@/lib/format'
import { BookingStatusBadge } from './components/BookingStatusBadge'
import { BookingFormModal } from './components/BookingFormModal'

export function BookingsPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<BookingFilters>({})
  const [creating, setCreating] = useState(false)
  const bookings = useBookings(filters)
  const staff = useStaff()
  const resources = useResources()

  function update<K extends keyof BookingFilters>(
    key: K,
    value: BookingFilters[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }))
  }

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Browse, filter, and manage reservations."
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

      <Card className="mb-4 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-56"
            placeholder="Search customer…"
            value={filters.search ?? ''}
            onChange={(e) => update('search', e.target.value)}
          />
          <Select
            className="max-w-44"
            value={filters.status ?? ''}
            onChange={(e) =>
              update('status', (e.target.value as BookingStatus) || undefined)
            }
          >
            <option value="">All statuses</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {BOOKING_STATUS_META[s].label}
              </option>
            ))}
          </Select>
          <Select
            className="max-w-44"
            value={filters.staffId ?? ''}
            onChange={(e) => update('staffId', e.target.value || undefined)}
          >
            <option value="">All staff</option>
            {staff.data?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Select
            className="max-w-44"
            value={filters.resourceId ?? ''}
            onChange={(e) => update('resourceId', e.target.value || undefined)}
          >
            <option value="">All resources</option>
            {resources.data?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card>
        <QueryState
          query={bookings}
          isEmpty={(data) => data.length === 0}
          empty={
            <EmptyState
              icon="event_busy"
              title="No bookings match"
              description="Try adjusting the filters, or create a new booking."
            />
          }
          loadingLabel="Loading bookings…"
        >
          {(rows) => (
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <Th>When</Th>
                    <Th>Customer</Th>
                    <Th>Service</Th>
                    <Th>Staff</Th>
                    <Th>Resource</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((b) => (
                    <Tr
                      key={b.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/bookings/${b.id}`)}
                    >
                      <Td className="whitespace-nowrap">
                        <div className="font-medium text-foreground">
                          {formatDate(b.startAt)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeRange(b.startAt, b.endAt)}
                        </div>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <Avatar name={b.customer.name} size="sm" />
                          <span className="font-medium text-foreground">
                            {b.customer.name}
                          </span>
                        </div>
                      </Td>
                      <Td className="text-muted-foreground">
                        {b.service.name}
                      </Td>
                      <Td className="text-muted-foreground">
                        {b.staff?.name ?? '—'}
                      </Td>
                      <Td className="text-muted-foreground">
                        {b.resources.map((r) => r.name).join(', ') || '—'}
                      </Td>
                      <Td>
                        <BookingStatusBadge status={b.status} />
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          )}
        </QueryState>
      </Card>

      {creating && <BookingFormModal open onClose={() => setCreating(false)} />}
    </>
  )
}

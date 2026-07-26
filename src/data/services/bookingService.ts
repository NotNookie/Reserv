import { getDb, nextId } from '../store'
import type {
  Booking,
  BookingStatus,
  BookingWithRelations,
  CreateBookingInput,
  UpdateBookingInput,
} from '../types'
import { clone, delay, intervalsOverlap } from './util'

/** Statuses that actively occupy a resource/staff slot and block overlaps. */
const BLOCKING_STATUSES: BookingStatus[] = [
  'pending',
  'confirmed',
  'arrived',
  'completed',
]

export interface AvailabilityQuery {
  resourceIds: string[]
  staffId?: string
  startAt: string
  endAt: string
  /** Ignore this booking when checking (used when editing). */
  excludeBookingId?: string
}

export interface AvailabilityResult {
  ok: boolean
  /** Bookings that conflict, if any. */
  conflicts: Booking[]
}

export interface BookingFilters {
  status?: BookingStatus
  staffId?: string
  resourceId?: string
  /** Inclusive ISO date-time lower bound (by startAt). */
  from?: string
  /** Exclusive ISO date-time upper bound (by startAt). */
  to?: string
  /** Case-insensitive search across customer name. */
  search?: string
}

/** Raised when a create/update would double-book a resource or staff member. */
export class BookingConflictError extends Error {
  conflicts: Booking[]
  constructor(conflicts: Booking[]) {
    super('This time slot conflicts with an existing booking.')
    this.name = 'BookingConflictError'
    this.conflicts = conflicts
  }
}

function resolve(booking: Booking): BookingWithRelations {
  const db = getDb()
  const customer = db.customers.find((c) => c.id === booking.customerId)
  const service = db.services.find((s) => s.id === booking.serviceId)
  if (!customer || !service) {
    throw new Error(`Booking ${booking.id} references missing entities`)
  }
  const staff = booking.staffId
    ? db.staff.find((s) => s.id === booking.staffId)
    : undefined
  const resources = booking.resourceIds
    .map((id) => db.resources.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => r != null)

  return { ...booking, customer, service, staff, resources }
}

function findConflicts(query: AvailabilityQuery): Booking[] {
  const { resourceIds, staffId, startAt, endAt, excludeBookingId } = query
  return getDb().bookings.filter((b) => {
    if (b.id === excludeBookingId) return false
    if (!BLOCKING_STATUSES.includes(b.status)) return false
    if (!intervalsOverlap(startAt, endAt, b.startAt, b.endAt)) return false

    const sharesResource = b.resourceIds.some((id) => resourceIds.includes(id))
    const sharesStaff = staffId != null && b.staffId === staffId
    return sharesResource || sharesStaff
  })
}

export const bookingService = {
  async list(filters: BookingFilters = {}): Promise<BookingWithRelations[]> {
    await delay()
    const db = getDb()
    let rows = [...db.bookings]

    if (filters.status) rows = rows.filter((b) => b.status === filters.status)
    if (filters.staffId)
      rows = rows.filter((b) => b.staffId === filters.staffId)
    if (filters.resourceId) {
      rows = rows.filter((b) => b.resourceIds.includes(filters.resourceId!))
    }
    if (filters.from) rows = rows.filter((b) => b.startAt >= filters.from!)
    if (filters.to) rows = rows.filter((b) => b.startAt < filters.to!)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      rows = rows.filter((b) => {
        const customer = db.customers.find((c) => c.id === b.customerId)
        return customer?.name.toLowerCase().includes(q)
      })
    }

    rows.sort((a, b) => a.startAt.localeCompare(b.startAt))
    return rows.map(resolve)
  },

  async getById(id: string): Promise<BookingWithRelations | null> {
    await delay()
    const booking = getDb().bookings.find((b) => b.id === id)
    return booking ? resolve(booking) : null
  },

  async checkAvailability(
    query: AvailabilityQuery,
  ): Promise<AvailabilityResult> {
    await delay(60)
    const conflicts = findConflicts(query)
    return { ok: conflicts.length === 0, conflicts: clone(conflicts) }
  },

  async create(input: CreateBookingInput): Promise<BookingWithRelations> {
    await delay()
    const conflicts = findConflicts({
      resourceIds: input.resourceIds,
      staffId: input.staffId,
      startAt: input.startAt,
      endAt: input.endAt,
    })
    if (conflicts.length > 0) throw new BookingConflictError(clone(conflicts))

    const booking: Booking = {
      id: nextId('b'),
      customerId: input.customerId,
      serviceId: input.serviceId,
      staffId: input.staffId,
      resourceIds: input.resourceIds,
      startAt: input.startAt,
      endAt: input.endAt,
      status: input.status ?? 'pending',
      notes: input.notes,
      createdAt: new Date().toISOString(),
    }
    getDb().bookings.push(booking)
    return resolve(booking)
  },

  async update(
    id: string,
    input: UpdateBookingInput,
  ): Promise<BookingWithRelations> {
    await delay()
    const booking = getDb().bookings.find((b) => b.id === id)
    if (!booking) throw new Error(`Booking ${id} not found`)

    const next: Booking = { ...booking, ...input }

    // Re-validate availability if timing/assignment changed.
    const timingChanged =
      input.startAt != null ||
      input.endAt != null ||
      input.resourceIds != null ||
      input.staffId != null
    if (timingChanged) {
      const conflicts = findConflicts({
        resourceIds: next.resourceIds,
        staffId: next.staffId,
        startAt: next.startAt,
        endAt: next.endAt,
        excludeBookingId: id,
      })
      if (conflicts.length > 0) throw new BookingConflictError(clone(conflicts))
    }

    Object.assign(booking, next)
    return resolve(booking)
  },

  async setStatus(
    id: string,
    status: BookingStatus,
  ): Promise<BookingWithRelations> {
    await delay()
    const booking = getDb().bookings.find((b) => b.id === id)
    if (!booking) throw new Error(`Booking ${id} not found`)
    booking.status = status
    if (status === 'arrived' && !booking.checkInAt) {
      booking.checkInAt = new Date().toISOString()
    }
    if (status === 'completed' && !booking.checkOutAt) {
      booking.checkOutAt = new Date().toISOString()
    }
    return resolve(booking)
  },
}

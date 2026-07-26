/**
 * Domain model for Reserv. Date/time fields are ISO 8601 strings — the same
 * shape a real REST/GraphQL API would return — so the mock service layer can be
 * swapped for a network layer without changing these types.
 */

export type ID = string

/** Booking lifecycle. Scheduled -> occupancy -> terminal states. */
export type BookingStatus =
  'pending' | 'confirmed' | 'arrived' | 'completed' | 'cancelled' | 'no_show'

export const BOOKING_STATUSES: BookingStatus[] = [
  'pending',
  'confirmed',
  'arrived',
  'completed',
  'cancelled',
  'no_show',
]

export type ResourceStatus = 'available' | 'occupied' | 'maintenance'

export type ResourceKind = 'room' | 'station' | 'unit'

export interface Customer {
  id: ID
  name: string
  email: string
  phone: string
  notes?: string
  createdAt: string
}

export interface Staff {
  id: ID
  name: string
  /** Job title / role, e.g. "Senior Therapist". */
  role: string
  email: string
  phone: string
  active: boolean
}

export interface Resource {
  id: ID
  name: string
  kind: ResourceKind
  capacity: number
  status: ResourceStatus
  location?: string
}

export interface Service {
  id: ID
  name: string
  durationMinutes: number
  /** Price in whole currency units (USD). */
  price: number
  category?: string
}

export interface Booking {
  id: ID
  customerId: ID
  serviceId: ID
  /** Optional assigned staff member. */
  staffId?: ID
  /** One or more resources (junction) — UI currently manages a single one. */
  resourceIds: ID[]
  /** Scheduled window (ISO). */
  startAt: string
  endAt: string
  status: BookingStatus
  /** Actual occupancy timestamps, distinct from the scheduled window. */
  checkInAt?: string
  checkOutAt?: string
  notes?: string
  createdAt: string
}

/** A booking with its related entities resolved, for display. */
export interface BookingWithRelations extends Booking {
  customer: Customer
  service: Service
  staff?: Staff
  resources: Resource[]
}

/** Payload for creating a booking. */
export interface CreateBookingInput {
  customerId: ID
  serviceId: ID
  staffId?: ID
  resourceIds: ID[]
  startAt: string
  endAt: string
  status?: BookingStatus
  notes?: string
}

export type UpdateBookingInput = Partial<CreateBookingInput> & {
  status?: BookingStatus
  checkInAt?: string
  checkOutAt?: string
}

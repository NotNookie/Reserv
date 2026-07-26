import { describe, it, expect, beforeEach } from 'vitest'
import { resetDb } from '../store'
import { bookingService, BookingConflictError } from './bookingService'
import type { CreateBookingInput } from '../types'

// A free resource (Suite 1) not used by the seed scheduler, in the far future
// so there is no collision with seeded bookings.
const baseInput: CreateBookingInput = {
  customerId: 'c1',
  serviceId: 'svc2',
  staffId: 's1',
  resourceIds: ['r6'],
  startAt: '2030-01-01T10:00:00.000Z',
  endAt: '2030-01-01T11:00:00.000Z',
}

describe('bookingService availability', () => {
  beforeEach(() => resetDb())

  it('creates a booking in a free slot', async () => {
    const booking = await bookingService.create(baseInput)
    expect(booking.id).toBeTruthy()
    expect(booking.customer.id).toBe('c1')
    expect(booking.resources[0]?.id).toBe('r6')
  })

  it('rejects an overlapping booking on the same resource', async () => {
    await bookingService.create(baseInput)
    await expect(
      bookingService.create({
        ...baseInput,
        customerId: 'c2',
        staffId: 's2',
        startAt: '2030-01-01T10:30:00.000Z',
        endAt: '2030-01-01T11:30:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BookingConflictError)
  })

  it('allows a back-to-back booking that does not overlap', async () => {
    await bookingService.create(baseInput)
    const next = await bookingService.create({
      ...baseInput,
      customerId: 'c2',
      staffId: 's2',
      startAt: '2030-01-01T11:00:00.000Z',
      endAt: '2030-01-01T12:00:00.000Z',
    })
    expect(next.id).toBeTruthy()
  })

  it('does not let a cancelled booking block the slot', async () => {
    const first = await bookingService.create(baseInput)
    await bookingService.setStatus(first.id, 'cancelled')
    const reused = await bookingService.create({
      ...baseInput,
      customerId: 'c3',
    })
    expect(reused.id).toBeTruthy()
  })

  it('detects a staff conflict even on a different resource', async () => {
    await bookingService.create(baseInput)
    const result = await bookingService.checkAvailability({
      resourceIds: ['r3'],
      staffId: 's1',
      startAt: '2030-01-01T10:15:00.000Z',
      endAt: '2030-01-01T10:45:00.000Z',
    })
    expect(result.ok).toBe(false)
    expect(result.conflicts.length).toBeGreaterThan(0)
  })
})
